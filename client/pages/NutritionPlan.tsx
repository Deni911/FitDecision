import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Assessment, calculateSAW, getRecommendationDetails } from "@/lib/saw-calculator";
import { Flame, Apple, Fish, Droplets } from "lucide-react";

// Helper function to scale calories and macros to specific Indonesian meals
function getDynamicMeals(
  programName: string,
  totalCal: number,
  totalProt: number,
  totalCarb: number,
  totalFat: number
) {
  // Sarapan: 25%, Makan Siang: 35%, Makan Malam: 30%, Camilan: 10%
  const scale = (pct: number) => ({
    calories: Math.round(totalCal * pct),
    protein: Math.round(totalProt * pct),
    carbs: Math.round(totalCarb * pct),
    fat: Math.round(totalFat * pct),
  });

  const sarapanScale = scale(0.25);
  const siangScale = scale(0.35);
  const malamScale = scale(0.30);
  const camilanScale = scale(0.10);

  if (programName === "Bulking") {
    return {
      breakfast: [
        { name: "Nasi goreng telur", ...sarapanScale },
        { name: "Oatmeal pisang susu", ...sarapanScale },
      ],
      lunch: [
        { name: "Nasi putih + dada ayam + sayuran", ...siangScale },
      ],
      dinner: [
        { name: "Nasi putih + ikan + sayuran", ...malamScale },
      ],
      snack: [
        { name: "Suku tinggi protein (shake/susu)", ...scale(0.06) },
        { name: "Pisang", ...scale(0.04) },
      ],
    };
  } else if (programName === "Rekomposisi Tubuh") {
    return {
      breakfast: [
        { name: "Roti gandum + telur", ...sarapanScale },
      ],
      lunch: [
        { name: "Nasi putih + ayam panggang + sayuran", ...siangScale },
      ],
      dinner: [
        { name: "Ikan + sayuran + nasi secukupnya", ...malamScale },
      ],
      snack: [
        { name: "Telur rebus", ...scale(0.06) },
        { name: "Apel", ...scale(0.04) },
      ],
    };
  } else if (programName === "Cutting Moderat") {
    return {
      breakfast: [
        { name: "Oatmeal + telur rebus", ...sarapanScale },
      ],
      lunch: [
        { name: "Nasi merah + ayam panggang + sayuran", ...siangScale },
      ],
      dinner: [
        { name: "Ikan bakar + sayuran", ...malamScale },
      ],
      snack: [
        { name: "Buah (Apel / Jeruk)", ...scale(0.04) },
        { name: "Telur rebus", ...scale(0.06) },
      ],
    };
  } else {
    // Cutting Agresif
    return {
      breakfast: [
        { name: "Putih telur + oatmeal", ...sarapanScale },
      ],
      lunch: [
        { name: "Dada ayam + sayuran", ...siangScale },
      ],
      dinner: [
        { name: "Ikan + sayuran", ...malamScale },
      ],
      snack: [
        { name: "Buah rendah kalori", ...scale(0.04) },
        { name: "Sumber protein (rebusan/shake)", ...scale(0.06) },
      ],
    };
  }
}

export default function NutritionPlan() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    const lastAssessment = localStorage.getItem("lastAssessment");
    if (lastAssessment) {
      const data = JSON.parse(lastAssessment) as Assessment;
      setAssessment(data);
    } else {
      const defaultAssessment: Assessment = {
        id: "default",
        fullName: "Alex Johnson",
        age: 28,
        gender: "male",
        height: 180,
        weight: 85,
        bodyFat: 18,
        waistCircumference: 85,
        trainingExperience: "intermediate",
        trainingFrequency: "5-6",
        fitnessGoal: "recomp",
        date: new Date().toISOString(),
        sawScores: [],
      };
      defaultAssessment.sawScores = calculateSAW(defaultAssessment);
      setAssessment(defaultAssessment);
    }
  }, []);

  if (!assessment) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat data nutrisi...</p>
      </div>
    );
  }

  const rec = getRecommendationDetails(assessment);
  const dynamicMeals = getDynamicMeals(
    rec.programName,
    rec.calorieTarget,
    rec.proteinTarget,
    rec.carbsTarget,
    rec.fatTarget
  );

  const MacroCard = ({
    icon: Icon,
    label,
    value,
    unit,
    color,
  }: {
    icon: React.ComponentType<any>;
    label: string;
    value: number;
    unit: string;
    color: string;
  }) => (
    <Card className="bg-background border-border p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">
            {value}
            <span className="text-sm font-normal text-muted-foreground ml-1">
              {unit}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );

  const MealCard = ({ meal }: { meal: { name: string; calories: number; protein: number; carbs: number; fat: number } }) => (
    <Card className="bg-background border-border p-4 hover:border-accent/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{meal.name}</h4>
          <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
            <div>
              <p className="text-muted-foreground">Kalori</p>
              <p className="font-bold text-foreground">{meal.calories} kcal</p>
            </div>
            <div>
              <p className="text-muted-foreground">Protein</p>
              <p className="font-bold text-foreground">{meal.protein}g</p>
            </div>
            <div>
              <p className="text-muted-foreground">Karbohidrat</p>
              <p className="font-bold text-foreground">{meal.carbs}g</p>
            </div>
            <div>
              <p className="text-muted-foreground">Lemak</p>
              <p className="font-bold text-foreground">{meal.fat}g</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const totalCaloriesVal = rec.calorieTarget;
  const pctProtein = Math.round((rec.proteinTarget * 4) / totalCaloriesVal * 100);
  const pctCarbs = Math.round((rec.carbsTarget * 4) / totalCaloriesVal * 100);
  const pctFat = Math.round((rec.fatTarget * 9) / totalCaloriesVal * 100);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Rencana Nutrisi</h1>
        <p className="text-muted-foreground">
          Rencana nutrisi pribadi untuk {assessment.fullName} berdasarkan program <strong>{rec.programName}</strong>
        </p>
      </div>

      {/* Calorie Surplus/Deficit Info */}
      <Card
        className={`border-l-4 p-6 ${
          rec.calorieDiff > 0
            ? "bg-accent/10 border-accent"
            : rec.calorieDiff < 0
            ? "bg-primary/10 border-primary"
            : "bg-card border-border"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {rec.calorieDiff > 0 ? "SURPLUS KALORI" : rec.calorieDiff < 0 ? "DEFISIT KALORI" : "PEMELIHARAAN"}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {Math.abs(rec.calorieDiff) === 0 ? "Kebutuhan Pemeliharaan (TDEE)" : `${Math.abs(rec.calorieDiff)} kalori`}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {rec.calorieDiff > 0
                ? "Surplus energi untuk mendukung pertumbuhan dan pemulihan massa otot."
                : rec.calorieDiff < 0
                ? "Defisit energi terkontrol untuk memaksimalkan pembakaran lemak tubuh."
                : "Asupan kalori seimbang untuk membangun otot sekaligus membakar lemak."}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Target Harian</p>
            <p className="text-4xl font-bold text-foreground">
              {rec.calorieTarget}
            </p>
            <p className="text-xs text-muted-foreground mt-1">kalori / hari</p>
          </div>
        </div>
      </Card>

      {/* Macronutrient Targets */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Target Makronutrisi
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MacroCard
            icon={Flame}
            label="Kalori Harian"
            value={rec.calorieTarget}
            unit="kcal"
            color="bg-primary/10"
          />
          <MacroCard
            icon={Fish}
            label="Protein"
            value={rec.proteinTarget}
            unit="g"
            color="bg-accent/10"
          />
          <MacroCard
            icon={Apple}
            label="Karbohidrat"
            value={rec.carbsTarget}
            unit="g"
            color="bg-blue-500/10"
          />
          <MacroCard
            icon={Droplets}
            label="Lemak"
            value={rec.fatTarget}
            unit="g"
            color="bg-orange-500/10"
          />
        </div>
      </div>

      {/* Recommended Foods */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Bahan Makanan yang Direkomendasikan
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Berikut adalah beberapa contoh bahan makanan umum di Indonesia yang disarankan untuk program <strong>{rec.programName}</strong>:
        </p>
        <div className="flex flex-wrap gap-2">
          {rec.recommendedFoods.map((food, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-accent/10 border border-accent/20 text-accent rounded-full text-sm font-medium"
            >
              {food}
            </span>
          ))}
        </div>
      </Card>

      {/* Macro Distribution */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Distribusi Makro Harian
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Protein</span>
              <span className="text-sm font-bold text-accent">
                {pctProtein}%
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-3 border border-border overflow-hidden">
              <div
                className="h-full bg-accent rounded-full"
                style={{
                  width: `${pctProtein}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {rec.proteinTarget}g = {rec.proteinTarget * 4} kcal
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Karbohidrat
              </span>
              <span className="text-sm font-bold text-blue-500">
                {pctCarbs}%
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-3 border border-border overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${pctCarbs}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {rec.carbsTarget}g = {rec.carbsTarget * 4} kcal
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Lemak</span>
              <span className="text-sm font-bold text-orange-500">
                {pctFat}%
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-3 border border-border overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{
                  width: `${pctFat}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {rec.fatTarget}g = {rec.fatTarget * 9} kcal
            </p>
          </div>
        </div>
      </Card>

      {/* Sample Meal Plans */}
      <div className="space-y-6">
        {(
          [
            { title: "Sarapan", meals: dynamicMeals.breakfast },
            { title: "Makan Siang", meals: dynamicMeals.lunch },
            { title: "Makan Malam", meals: dynamicMeals.dinner },
            { title: "Camilan", meals: dynamicMeals.snack },
          ] as const
        ).map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Pilihan {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.meals.map((meal, idx) => (
                <MealCard key={idx} meal={meal} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Tips Nutrisi FitDecision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-muted-foreground text-sm">
                Lacak asupan makanan harian Anda secara rutin untuk konsistensi.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-muted-foreground text-sm">
                Persiapkan makanan (meal prep) sebelumnya untuk menghindari makan sembarangan.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-muted-foreground text-sm">
                Minum minimal 2-3 liter air putih bersih setiap hari agar hidrasi optimal.
              </span>
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-muted-foreground text-sm">
                Prioritaskan sumber protein berkualitas tinggi dan batasi makanan olahan/cepat saji.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-muted-foreground text-sm">
                Lemak sehat sangat penting untuk kestabilan hormon (alpukat, kuning telur, tempe).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-muted-foreground text-sm">
                Evaluasi berat badan mingguan dan sesuaikan porsi jika terjadi perubahan drastis pada energi.
              </span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
