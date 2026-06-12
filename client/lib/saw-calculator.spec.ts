import { describe, it, expect } from "vitest";
import {
  Assessment,
  calculateSAW,
  getBMI,
  calculateCalories,
  getRecommendationDetails,
} from "./saw-calculator";

describe("saw-calculator helper functions", () => {
  it("should calculate BMI correctly", () => {
    expect(getBMI(180, 85)).toBe(26.2);
    expect(getBMI(170, 60)).toBe(20.8);
  });

  it("should calculate TDEE calories based on Mifflin-St Jeor equation", () => {
    // Male: 10 * weight + 6.25 * height - 5 * age + 5
    // 10 * 85 + 6.25 * 180 - 5 * 28 + 5 = 850 + 1125 - 140 + 5 = 1840
    // Active multiplier: 1.725
    // 1840 * 1.725 = 3174
    const calMale = calculateCalories(85, 180, 28, "male", "active");
    expect(calMale).toBe(3174);

    // Female: 10 * weight + 6.25 * height - 5 * age - 161
    // 10 * 60 + 6.25 * 170 - 5 * 25 - 161 = 600 + 1062.5 - 125 - 161 = 1376.5
    // Active multiplier: 1.725
    // 1376.5 * 1.725 = 2374.4625 -> 2374
    const calFemale = calculateCalories(60, 170, 25, "female", "active");
    expect(calFemale).toBe(2374);
  });

  it("should calculate SAW results and sort them correctly", () => {
    const testAssessment: Assessment = {
      id: "test",
      fullName: "Test User",
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
    const results = calculateSAW(testAssessment);
    expect(results.length).toBe(4);
    expect(results[0].rank).toBe(1);
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
  });

  it("should return detailed recommendation matching the computed top SAW alternative", () => {
    const testAssessment: Assessment = {
      id: "test-bulk",
      fullName: "Bulk User",
      age: 25,
      gender: "male",
      height: 175,
      weight: 65,
      bodyFat: 12,
      waistCircumference: 78,
      trainingExperience: "intermediate",
      trainingFrequency: "5-6",
      fitnessGoal: "bulk",
      date: new Date().toISOString(),
      sawScores: [],
    };
    testAssessment.sawScores = calculateSAW(testAssessment);

    const details = getRecommendationDetails(testAssessment);
    // With fitnessGoal = bulk and low BF (12) / low waist (78), Bulking should be the highest recommendation
    expect(details.programName).toBe("Bulking");
    expect(details.goal).toBe("Menambah massa otot");
    expect(details.calorieDiffType).toBe("surplus");
    expect(details.calorieDiff).toBe(400);
    expect(details.recommendedFoods).toContain("Nasi putih");
    expect(details.recommendedFoods).toContain("Dada ayam");
    expect(details.trainingSplits).toContain("Push Pull Legs");
    expect(details.sampleMeals.breakfast).toContain("Nasi goreng telur");
  });
});
