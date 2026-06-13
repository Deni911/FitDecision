export interface Assessment {
  id: string;
  fullName: string;
  gender: "male" | "female";
  age: number;
  height: number; // cm
  weight: number; // kg
  bodyFat: number; // %
  waistCircumference: number; // cm
  trainingExperience: "beginner" | "intermediate" | "advanced";
  trainingFrequency: "1-2" | "3-4" | "5-6" | "daily";
  fitnessGoal?: "bulk" | "recomp" | "moderate_cut" | "aggressive_cut";
  date: string;
  sawScores: SAWResult[];
}

export interface SAWResult {
  alternative: string;
  score: number;
  rank: number;
}

// Criteria weights (total = 1)
const WEIGHTS = {
  bodyFat: 0.25,
  bmi: 0.25,
  trainingExperience: 0.15,
  trainingFrequency: 0.15,
  waistCircumference: 0.20,
};

// Score templates for each program type and criteria
const PROGRAM_SCORES: Record<string, Record<string, (data: Assessment) => number>> = {
  bulk: {
    bodyFat: (data) => {
      // Higher body fat (for bulk) scores lower initially
      if (data.bodyFat > 20) return 60;
      if (data.bodyFat > 15) return 75;
      return 90; // Low body fat is ideal for bulk
    },
    bmi: (data) => {
      const bmi = data.weight / ((data.height / 100) ** 2);
      if (bmi < 18.5) return 95; // Underweight - great for bulk
      if (bmi < 25) return 80;
      return 65;
    },
    trainingExperience: (data) => {
      const exp = {
        beginner: 75,
        intermediate: 85,
        advanced: 90,
      };
      return exp[data.trainingExperience];
    },
    trainingFrequency: (data) => {
      const freq = {
        "1-2": 60,
        "3-4": 80,
        "5-6": 85,
        daily: 75,
      };
      return freq[data.trainingFrequency];
    },
    waistCircumference: (data) => {
      if (data.waistCircumference < 80) return 90;
      if (data.waistCircumference < 90) return 75;
      return 60;
    },
    fitnessGoal: (data) => (data.fitnessGoal === "bulk" ? 100 : 70),
  },
  recomp: {
    bodyFat: (data) => {
      if (data.bodyFat > 25) return 85; // High BF needs recomp
      if (data.bodyFat > 18) return 95;
      if (data.bodyFat > 12) return 80;
      return 70;
    },
    bmi: (data) => {
      const bmi = data.weight / ((data.height / 100) ** 2);
      if (bmi >= 25 && bmi < 30) return 95; // Overweight is ideal
      if (bmi >= 18.5 && bmi < 25) return 85;
      if (bmi >= 30) return 80;
      return 75;
    },
    trainingExperience: (data) => {
      const exp = {
        beginner: 70,
        intermediate: 90,
        advanced: 95,
      };
      return exp[data.trainingExperience];
    },
    trainingFrequency: (data) => {
      const freq = {
        "1-2": 70,
        "3-4": 90,
        "5-6": 95,
        daily: 85,
      };
      return freq[data.trainingFrequency];
    },
    waistCircumference: (data) => {
      if (data.waistCircumference > 95) return 90;
      if (data.waistCircumference > 85) return 85;
      if (data.waistCircumference > 75) return 80;
      return 70;
    },
    fitnessGoal: (data) => (data.fitnessGoal === "recomp" ? 100 : 75),
  },
  moderate_cut: {
    bodyFat: (data) => {
      if (data.bodyFat > 20) return 95;
      if (data.bodyFat > 15) return 85;
      return 70;
    },
    bmi: (data) => {
      const bmi = data.weight / ((data.height / 100) ** 2);
      if (bmi >= 30) return 95; // Obese benefits most
      if (bmi >= 25) return 90;
      if (bmi < 25) return 75;
      return 60;
    },
    trainingExperience: (data) => {
      const exp = {
        beginner: 75,
        intermediate: 85,
        advanced: 90,
      };
      return exp[data.trainingExperience];
    },
    trainingFrequency: (data) => {
      const freq = {
        "1-2": 75,
        "3-4": 85,
        "5-6": 90,
        daily: 80,
      };
      return freq[data.trainingFrequency];
    },
    waistCircumference: (data) => {
      if (data.waistCircumference > 100) return 95;
      if (data.waistCircumference > 90) return 85;
      if (data.waistCircumference > 80) return 75;
      return 65;
    },
    fitnessGoal: (data) =>
      data.fitnessGoal === "moderate_cut" ? 100 : data.fitnessGoal === "aggressive_cut" ? 50 : 80,
  },
  aggressive_cut: {
    bodyFat: (data) => {
      if (data.bodyFat > 25) return 90;
      if (data.bodyFat > 20) return 80;
      return 65;
    },
    bmi: (data) => {
      const bmi = data.weight / ((data.height / 100) ** 2);
      if (bmi >= 30) return 90;
      if (bmi >= 25) return 80;
      return 70;
    },
    trainingExperience: (data) => {
      const exp = {
        beginner: 60,
        intermediate: 80,
        advanced: 95,
      };
      return exp[data.trainingExperience];
    },
    trainingFrequency: (data) => {
      const freq = {
        "1-2": 60,
        "3-4": 75,
        "5-6": 90,
        daily: 85,
      };
      return freq[data.trainingFrequency];
    },
    waistCircumference: (data) => {
      if (data.waistCircumference > 100) return 95;
      if (data.waistCircumference > 90) return 85;
      if (data.waistCircumference > 80) return 75;
      return 65;
    },
    fitnessGoal: (data) =>
      data.fitnessGoal === "aggressive_cut" ? 100 : data.fitnessGoal === "moderate_cut" ? 70 : 60,
  },
};

export function calculateSAW(assessment: Assessment): SAWResult[] {
  const programs = Object.keys(PROGRAM_SCORES);
  const scores: SAWResult[] = [];

  for (const program of programs) {
    const criteria = PROGRAM_SCORES[program];
    let totalScore = 0;

    // Calculate weighted score
    totalScore +=
      (criteria.bodyFat(assessment) / 100) * WEIGHTS.bodyFat;
    totalScore +=
      (criteria.bmi(assessment) / 100) * WEIGHTS.bmi;
    totalScore +=
      (criteria.trainingExperience(assessment) / 100) *
      WEIGHTS.trainingExperience;
    totalScore +=
      (criteria.trainingFrequency(assessment) / 100) *
      WEIGHTS.trainingFrequency;
    totalScore +=
      (criteria.waistCircumference(assessment) / 100) *
      WEIGHTS.waistCircumference;

    // Convert to 0-100 scale
    const finalScore = totalScore * 100;

    scores.push({
      alternative: program === "recomp" ? "Rekomposisi Tubuh" : 
                   program === "moderate_cut" ? "Cutting Moderat" :
                   program === "aggressive_cut" ? "Cutting Agresif" :
                   program === "bulk" ? "Bulking" :
                   program.charAt(0).toUpperCase() + program.slice(1),
      score: Math.round(finalScore * 10) / 10,
      rank: 0,
    });
  }

  // Sort by score and assign ranks
  scores.sort((a, b) => b.score - a.score);
  scores.forEach((score, index) => {
    score.rank = index + 1;
  });

  return scores;
}

export function getBMI(height: number, weight: number): number {
  return Math.round((weight / ((height / 100) ** 2)) * 10) / 10;
}

export function calculateCalories(
  weight: number,
  height: number,
  age: number,
  gender: "male" | "female",
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active" = "moderate"
): number {
  // Mifflin-St Jeor equation
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
}

export interface RecommendationDetails {
  programName: string;
  score: number;
  goal: string;
  calorieTarget: number;
  calorieDiff: number;
  calorieDiffType: "surplus" | "deficit" | "maintenance";
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  trainingFrequency: string;
  trainingSplits: string[];
  recommendedFoods: string[];
  sampleMeals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snack: string[];
  };
}

export function getRecommendationDetails(assessment: Assessment): RecommendationDetails {
  const topProgram = assessment.sawScores[0];
  const programName = topProgram ? topProgram.alternative : "Rekomposisi Tubuh";
  const score = topProgram ? topProgram.score : 80;

  const tdee = calculateCalories(
    assessment.weight,
    assessment.height,
    assessment.age,
    assessment.gender,
    "active"
  );

  let goal = "";
  let calorieDiff = 0;
  let calorieDiffType: "surplus" | "deficit" | "maintenance" = "maintenance";
  let trainingFrequency = "";
  let trainingSplits: string[] = [];
  let recommendedFoods: string[] = [];
  let sampleMeals = {
    breakfast: [] as string[],
    lunch: [] as string[],
    dinner: [] as string[],
    snack: [] as string[],
  };

  if (programName === "Bulking") {
    goal = "Menambah massa otot";
    calorieDiff = 400; // TDEE + 300 s.d 500 kkal
    calorieDiffType = "surplus";
    trainingFrequency = "5–6 kali per minggu";
    trainingSplits = ["Push Pull Legs", "Upper Lower"];
    recommendedFoods = ["Nasi putih", "Dada ayam", "Telur", "Tempe", "Tahu", "Susu", "Pisang", "Selai kacang"];
    sampleMeals = {
      breakfast: ["Nasi goreng telur", "Oatmeal pisang susu"],
      lunch: ["Nasi putih + dada ayam + sayuran"],
      dinner: ["Nasi putih + ikan + sayuran"],
      snack: ["Susu tinggi protein", "Pisang"],
    };
  } else if (programName === "Rekomposisi Tubuh") {
    goal = "Menambah massa otot sekaligus mengurangi lemak tubuh";
    calorieDiff = 0; // Mendekati TDEE (maintenance)
    calorieDiffType = "maintenance";
    trainingFrequency = "4–5 kali per minggu";
    trainingSplits = ["Upper Lower", "Full Body"];
    recommendedFoods = ["Nasi putih secukupnya", "Dada ayam", "Ikan", "Telur", "Tempe", "Sayuran", "Buah-buahan"];
    sampleMeals = {
      breakfast: ["Roti gandum + telur"],
      lunch: ["Nasi putih + ayam panggang + sayuran"],
      dinner: ["Ikan + sayuran + nasi secukupnya"],
      snack: ["Telur rebus", "Apel"],
    };
  } else if (programName === "Cutting Moderat") {
    goal = "Menurunkan lemak tubuh secara bertahap";
    calorieDiff = -400; // TDEE - 300 s.d 500 kkal
    calorieDiffType = "deficit";
    trainingFrequency = "4–5 kali per minggu";
    trainingSplits = ["Upper Lower", "Push Pull Legs"];
    recommendedFoods = ["Nasi merah", "Dada ayam", "Ikan", "Telur", "Brokoli", "Bayam", "Apel", "Jeruk"];
    sampleMeals = {
      breakfast: ["Oatmeal + telur rebus"],
      lunch: ["Nasi merah + ayam panggang + sayuran"],
      dinner: ["Ikan bakar + sayuran"],
      snack: ["Buah", "Telur rebus"],
    };
  } else { // Cutting Agresif
    goal = "Menurunkan lemak tubuh dengan lebih cepat";
    calorieDiff = -650; // TDEE - 500 s.d 800 kkal
    calorieDiffType = "deficit";
    trainingFrequency = "5–6 kali per minggu";
    trainingSplits = ["Push Pull Legs", "Full Body + Cardio"];
    recommendedFoods = ["Dada ayam", "Putih telur", "Ikan", "Brokoli", "Selada", "Timun", "Sayuran rendah kalori"];
    sampleMeals = {
      breakfast: ["Putih telur + oatmeal"],
      lunch: ["Dada ayam + sayuran"],
      dinner: ["Ikan + sayuran"],
      snack: ["Buah rendah kalori", "Sumber protein"],
    };
  }

  const calorieTarget = Math.round(tdee + calorieDiff);

  // Calculate macros:
  // Protein: 2g per kg body weight
  const proteinTarget = Math.round(assessment.weight * 2);
  const remainingCalories = calorieTarget - proteinTarget * 4;
  // Carbs: 45% of remaining calories
  const carbsTarget = Math.max(0, Math.round((remainingCalories * 0.45) / 4));
  // Fat: 25% of remaining calories / 9
  const fatTarget = Math.max(0, Math.round((remainingCalories * 0.25) / 9));

  return {
    programName,
    score,
    goal,
    calorieTarget,
    calorieDiff,
    calorieDiffType,
    proteinTarget,
    carbsTarget,
    fatTarget,
    trainingFrequency,
    trainingSplits,
    recommendedFoods,
    sampleMeals,
  };
}
