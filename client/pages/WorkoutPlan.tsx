import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Assessment, calculateSAW, getRecommendationDetails } from "@/lib/saw-calculator";
import { Dumbbell, Clock, Target, TrendingUp, CheckCircle } from "lucide-react";

const TRAINING_SPLITS = {
  ppl: {
    name: "Push/Pull/Legs (PPL)",
    description: "Mendedikasikan hari untuk gerakan pendorong (push), penarik (pull), dan kaki (legs)",
    frequency: "5–6 kali per minggu",
    bestFor: "Lifter yang fokus pada volume tinggi untuk hipertrofi otot",
    indName: "Push Pull Legs",
    exercises: {
      "Hari Push (Mendorong)": [
        { name: "Flat Bench Press", sets: 4, reps: "6-8" },
        { name: "Incline Dumbbell Press", sets: 3, reps: "8-10" },
        { name: "Overhead Press", sets: 3, reps: "8-10" },
        { name: "Tricep Pushdown", sets: 3, reps: "10-12" },
        { name: "Lateral Raises", sets: 3, reps: "12-15" },
      ],
      "Hari Pull (Menarik)": [
        { name: "Deadlift / Barbell Row", sets: 3, reps: "5-8" },
        { name: "Pull-up / Lat Pulldown", sets: 4, reps: "8-10" },
        { name: "Seated Cable Row", sets: 3, reps: "10-12" },
        { name: "Face Pulls", sets: 3, reps: "12-15" },
        { name: "Barbell Curls", sets: 3, reps: "10-12" },
      ],
      "Hari Legs (Kaki)": [
        { name: "Barbell Back Squat", sets: 3, reps: "6-8" },
        { name: "Romanian Deadlift (RDL)", sets: 3, reps: "8-10" },
        { name: "Leg Press", sets: 3, reps: "10-12" },
        { name: "Leg Extensions", sets: 3, reps: "12-15" },
        { name: "Seated Calf Raises", sets: 4, reps: "12-15" },
      ],
    },
  },
  upper_lower: {
    name: "Split Tubuh Atas/Bawah (Upper/Lower)",
    description: "Bergantian antara melatih tubuh bagian atas dan tubuh bagian bawah secara merata",
    frequency: "4–5 kali per minggu",
    bestFor: "Pembangunan massa otot dengan pemulihan seimbang",
    indName: "Upper Lower",
    exercises: {
      "Tubuh Atas (Upper)": [
        { name: "Bench Press", sets: 4, reps: "6-8" },
        { name: "Bent Over Barbell Row", sets: 4, reps: "6-8" },
        { name: "Dumbbell Overhead Press", sets: 3, reps: "8-10" },
        { name: "Lat Pulldown", sets: 3, reps: "10-12" },
        { name: "Tricep Overhead Extensions", sets: 3, reps: "10-12" },
        { name: "Hammer Curls", sets: 3, reps: "10-12" },
      ],
      "Tubuh Bawah (Lower)": [
        { name: "Barbell Back Squat", sets: 4, reps: "6-8" },
        { name: "Romanian Deadlift", sets: 3, reps: "8-10" },
        { name: "Bulgarian Split Squat", sets: 3, reps: "10 rep/kaki" },
        { name: "Leg Curls", sets: 3, reps: "10-12" },
        { name: "Standing Calf Raises", sets: 4, reps: "12-15" },
      ],
    },
  },
  full_body: {
    name: "Seluruh Tubuh (Full Body)",
    description: "Melatih seluruh kelompok otot utama dalam satu sesi latihan",
    frequency: "3–4 kali per minggu",
    bestFor: "Pemula atau pelaku rekomposisi tubuh dengan waktu terbatas",
    indName: "Full Body",
    exercises: {
      "Sesi Full Body A": [
        { name: "Barbell Back Squat", sets: 4, reps: "6-8" },
        { name: "Flat Bench Press", sets: 4, reps: "6-8" },
        { name: "Barbell Row", sets: 4, reps: "6-8" },
        { name: "Dumbbell Lateral Raises", sets: 3, reps: "12-15" },
        { name: "Plank", sets: 3, reps: "60 detik" },
      ],
      "Sesi Full Body B": [
        { name: "Deadlift", sets: 3, reps: "5" },
        { name: "Overhead Press", sets: 4, reps: "6-8" },
        { name: "Pull-ups", sets: 4, reps: "8-10" },
        { name: "Lying Leg Curls", sets: 3, reps: "10-12" },
        { name: "Bicep Curls", sets: 3, reps: "10-12" },
      ],
    },
  },
  full_body_cardio: {
    name: "Seluruh Tubuh & Kardio (Full Body + Cardio)",
    description: "Gabungan latihan beban seluruh tubuh dengan sesi kardio pembakaran kalori intensif",
    frequency: "5–6 kali per minggu",
    bestFor: "Menurunkan berat badan dengan cepat sambil memelihara otot",
    indName: "Full Body + Cardio",
    exercises: {
      "Latihan Beban Seluruh Tubuh": [
        { name: "Dumbbell Squats", sets: 4, reps: "10-12" },
        { name: "Push-ups / Chest Press", sets: 4, reps: "12-15" },
        { name: "Dumbbell Rows", sets: 4, reps: "10-12" },
        { name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12" },
        { name: "Hanging Knee Raises", sets: 3, reps: "12-15" },
      ],
      "Kardio & Core HIIT": [
        { name: "Lompat Tali (Jump Rope)", sets: 5, reps: "2 menit" },
        { name: "Burpees", sets: 4, reps: "12" },
        { name: "Mountain Climbers", sets: 4, reps: "30 detik" },
        { name: "Plank", sets: 3, reps: "60 detik" },
        { name: "Lari Santai (Jogging)", sets: 1, reps: "20-30 mnt" },
      ],
    },
  },
};

type SplitKey = keyof typeof TRAINING_SPLITS;

export default function WorkoutPlan() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [selectedSplit, setSelectedSplit] = useState<SplitKey>("full_body");

  useEffect(() => {
    const lastAssessment = localStorage.getItem("lastAssessment");
    let data: Assessment;
    if (lastAssessment) {
      data = JSON.parse(lastAssessment) as Assessment;
    } else {
      data = {
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
      data.sawScores = calculateSAW(data);
    }
    setAssessment(data);

    // Recommend default selected split based on SAW result
    const rec = getRecommendationDetails(data);
    const firstSplit = rec.trainingSplits[0];
    if (firstSplit === "Push Pull Legs") {
      setSelectedSplit("ppl");
    } else if (firstSplit === "Upper Lower") {
      setSelectedSplit("upper_lower");
    } else if (firstSplit === "Full Body") {
      setSelectedSplit("full_body");
    } else if (firstSplit === "Full Body + Cardio") {
      setSelectedSplit("full_body_cardio");
    } else {
      setSelectedSplit("upper_lower");
    }
  }, []);

  if (!assessment) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Memuat rencana latihan...</p>
      </div>
    );
  }

  const rec = getRecommendationDetails(assessment);
  const split = TRAINING_SPLITS[selectedSplit];

  // Map splits to index arrays to construct weekly plan dynamically
  const getWeeklySchedule = (splitKey: SplitKey) => {
    const keys = Object.keys(TRAINING_SPLITS[splitKey].exercises);
    if (splitKey === "ppl") {
      return [
        { day: "Senin", type: keys[0] }, // Push
        { day: "Selasa", type: keys[1] }, // Pull
        { day: "Rabu", type: keys[2] }, // Legs
        { day: "Kamis", type: "Istirahat & Pemulihan" },
        { day: "Jumat", type: keys[0] }, // Push
        { day: "Sabtu", type: keys[1] }, // Pull
        { day: "Minggu", type: "Istirahat & Pemulihan" },
      ];
    } else if (splitKey === "upper_lower") {
      return [
        { day: "Senin", type: keys[0] }, // Upper
        { day: "Selasa", type: keys[1] }, // Lower
        { day: "Rabu", type: "Istirahat & Pemulihan" },
        { day: "Kamis", type: keys[0] }, // Upper
        { day: "Jumat", type: keys[1] }, // Lower
        { day: "Sabtu", type: "Istirahat & Pemulihan" },
        { day: "Minggu", type: "Istirahat & Pemulihan" },
      ];
    } else if (splitKey === "full_body") {
      return [
        { day: "Senin", type: keys[0] }, // Full Body A
        { day: "Selasa", type: "Istirahat & Pemulihan" },
        { day: "Rabu", type: keys[1] }, // Full Body B
        { day: "Kamis", type: "Istirahat & Pemulihan" },
        { day: "Jumat", type: keys[0] }, // Full Body A
        { day: "Sabtu", type: "Istirahat & Pemulihan" },
        { day: "Minggu", type: "Istirahat & Pemulihan" },
      ];
    } else {
      // full_body_cardio
      return [
        { day: "Senin", type: keys[0] }, // Beban
        { day: "Selasa", type: keys[1] }, // HIIT Cardio
        { day: "Rabu", type: "Istirahat & Pemulihan" },
        { day: "Kamis", type: keys[0] }, // Beban
        { day: "Jumat", type: keys[1] }, // HIIT Cardio
        { day: "Sabtu", type: "Istirahat & Pemulihan" },
        { day: "Minggu", type: "Istirahat & Pemulihan" },
      ];
    }
  };

  const WEEKLY_SCHEDULE = getWeeklySchedule(selectedSplit);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Rencana Latihan</h1>
        <p className="text-muted-foreground">
          Rencana latihan pribadi untuk <strong>{assessment.fullName}</strong> yang disesuaikan dengan program rekomendasi.
        </p>
      </div>

      {/* Recommended program summary info */}
      <Card className="bg-card border-border p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Program Rekomendasi SAW</p>
            <p className="text-2xl font-bold text-accent mt-1">{rec.programName}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Frekuensi Latihan Disarankan: <strong>{rec.trainingFrequency}</strong>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="px-4 py-2 bg-accent/10 rounded-lg border border-accent/20 text-center">
              <p className="text-xs text-muted-foreground">Rekomendasi Split</p>
              <p className="text-sm font-semibold text-accent mt-1">
                {rec.trainingSplits.join(" / ")}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Training Split Selection */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Pilihan Pembagian Latihan (Split)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(TRAINING_SPLITS) as Array<[SplitKey, typeof TRAINING_SPLITS[SplitKey]]>).map(
            ([key, data]) => {
              const recommended = rec.trainingSplits.includes(data.indName);
              return (
                <Card
                  key={key}
                  className={`bg-card border cursor-pointer transition-all p-5 flex flex-col justify-between relative overflow-hidden ${
                    selectedSplit === key
                      ? "border-accent bg-accent/5 ring-1 ring-accent"
                      : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => setSelectedSplit(key)}
                >
                  {recommended && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-accent/20 text-accent border border-accent/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      <CheckCircle size={10} />
                      REKOMENDASI
                    </div>
                  )}
                  <div className="mt-2">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">
                      {data.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 min-h-[40px]">
                      {data.description}
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-accent mt-4">{data.frequency}</p>
                </Card>
              );
            }
          )}
        </div>
      </div>

      {/* Current Split Info */}
      <Card className="bg-card border-border p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-foreground">
              {split.name}
            </h2>
            {rec.trainingSplits.includes(split.indName) && (
              <span className="bg-accent/15 text-accent border border-accent/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                Sesuai Rekomendasi SPK
              </span>
            )}
          </div>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">{split.description}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-md text-xs sm:text-sm">
              <Clock size={16} className="text-primary" />
              <span className="font-medium text-foreground">{split.frequency}</span>
            </div>
            <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-md text-xs sm:text-sm">
              <Target size={16} className="text-accent" />
              <span className="font-medium text-foreground">{split.bestFor}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Weekly Schedule */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Jadwal Mingguan Otomatis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {WEEKLY_SCHEDULE.map((item) => (
            <Card
              key={item.day}
              className={`p-4 border ${
                item.type.includes("Istirahat")
                  ? "bg-background border-border"
                  : "bg-primary/5 border-primary/20"
              }`}
            >
              <div className="flex flex-col justify-between h-full min-h-[80px]">
                <p className="font-semibold text-foreground text-sm">{item.day}</p>
                <div className="flex items-center justify-between mt-2">
                  <p
                    className={`text-xs ${
                      item.type.includes("Istirahat")
                        ? "text-muted-foreground"
                        : "text-primary font-bold"
                    }`}
                  >
                    {item.type}
                  </p>
                  {!item.type.includes("Istirahat") && (
                    <Dumbbell size={16} className="text-primary" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Exercise Details */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          Detail Gerakan Latihan
        </h2>
        {Object.entries(split.exercises).map(([session, exercises]) => (
          <Card key={session} className="bg-card border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
              {session}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {exercise.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {exercise.sets} set × {exercise.reps} rep
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-lg text-primary text-xs">
                    <TrendingUp size={14} className="text-primary" />
                    <span className="font-medium">Progresif</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Training Tips */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Tips Latihan FitDecision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-accent font-bold">→</span>
              <span className="text-sm text-muted-foreground">
                Lakukan pemanasan dinamis 5-10 menit sebelum memulai latihan inti untuk mencegah cedera.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">→</span>
              <span className="text-sm text-muted-foreground">
                Utamakan eksekusi teknik/form yang benar sebelum menambah beban (mind-muscle connection).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">→</span>
              <span className="text-sm text-muted-foreground">
                Terapkan Progressive Overload (tambah beban/rep secara berkala) agar otot terus terstimulasi.
              </span>
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-accent font-bold">→</span>
              <span className="text-sm text-muted-foreground">
                Rest time yang ideal untuk gerakan compound adalah 2-3 menit, dan isolation 60-90 detik.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">→</span>
              <span className="text-sm text-muted-foreground">
                Hari istirahat (recovery day) sangat krusial, karena otot tumbuh ketika kita tidur dan beristirahat.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">→</span>
              <span className="text-sm text-muted-foreground">
                Catat setiap kemajuan beban Anda untuk memastikan intensitas latihan terus meningkat dari waktu ke waktu.
              </span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
