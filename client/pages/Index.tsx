import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Heart,
  Target,
  TrendingUp,
  Flame,
  AlertCircle,
  ArrowRight,
  Trophy,
  Dumbbell,
  Apple,
  Droplets,
  Clock,
  Activity,
} from "lucide-react";
import {
  Assessment,
  calculateSAW,
  getBMI,
  getRecommendationDetails,
} from "@/lib/saw-calculator";

export default function Index() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [recentAssessments, setRecentAssessments] = useState<any[]>([]);

  useEffect(() => {
    const lastAssessment = localStorage.getItem("lastAssessment");
    if (lastAssessment) {
      setAssessment(JSON.parse(lastAssessment));
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

    const stored = localStorage.getItem("assessments");
    if (stored) {
      const data = JSON.parse(stored) as Assessment[];
      const mapped = data.slice(-3).reverse().map((a) => {
        const top = a.sawScores[0];
        const goalMap: Record<string, string> = {
          bulk: "Membangun Otot",
          recomp: "Memperbaiki Komposisi Tubuh",
          moderate_cut: "Menurunkan Lemak (Moderat)",
          aggressive_cut: "Menurunkan Lemak (Agresif)"
        };
        return {
          id: a.id,
          date: a.date,
          goal: goalMap[a.fitnessGoal] || a.fitnessGoal,
          recommendation: top ? top.alternative : "Rekomposisi Tubuh",
          score: top ? top.score : 0,
        };
      });
      setRecentAssessments(mapped);
    } else {
      setRecentAssessments([
        {
          id: 1,
          date: "2024-01-15",
          goal: "Membangun Otot",
          recommendation: "Rekomposisi Tubuh",
          score: 87.5,
        },
        {
          id: 2,
          date: "2024-01-08",
          goal: "Memperbaiki Komposisi Tubuh",
          recommendation: "Cutting Moderat",
          score: 82.3,
        },
        {
          id: 3,
          date: "2024-01-01",
          goal: "Kebugaran Umum",
          recommendation: "Rekomposisi Tubuh",
          score: 78.9,
        },
      ]);
    }
  }, []);

  if (!assessment) return null;

  const rec = getRecommendationDetails(assessment);
  const bmi = getBMI(assessment.height, assessment.weight);

  // Dynamic progress chart based on latest assessment weight
  const progressData = [
    { week: "Minggu 1", weight: assessment.weight + 2, bodyFat: assessment.bodyFat + 2 },
    { week: "Minggu 2", weight: assessment.weight + 1.5, bodyFat: assessment.bodyFat + 1.5 },
    { week: "Minggu 3", weight: assessment.weight + 1, bodyFat: assessment.bodyFat + 1.2 },
    { week: "Minggu 4", weight: assessment.weight + 0.5, bodyFat: assessment.bodyFat + 0.8 },
    { week: "Minggu 5", weight: assessment.weight + 0.2, bodyFat: assessment.bodyFat + 0.5 },
    { week: "Minggu 6", weight: assessment.weight, bodyFat: assessment.bodyFat },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          Selamat datang kembali, {assessment.fullName}!
        </h1>
        <p className="text-muted-foreground">
          Berikut adalah ringkasan dashboard kebugaran Anda. Pantau kemajuan Anda dan tetap termotivasi!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Program Fitness Terpilih */}
        <div className="bg-card rounded-lg border border-border p-6 hover:border-accent/50 transition-colors flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Program Fitness Terpilih</p>
            <p className="text-2xl font-bold text-accent mt-2">{rec.programName}</p>
            <p className="text-xs text-muted-foreground mt-1">{rec.goal}</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <Target size={24} className="text-accent" />
          </div>
        </div>

        {/* Card 2: Nilai SAW Tertinggi */}
        <div className="bg-card rounded-lg border border-border p-6 hover:border-accent/50 transition-colors flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nilai SAW Tertinggi</p>
            <p className="text-3xl font-bold text-foreground mt-2">{rec.score}%</p>
            <p className="text-xs text-muted-foreground mt-1">Berdasarkan hasil SPK</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Trophy size={24} className="text-primary" />
          </div>
        </div>

        {/* Card 3: Target Kalori Harian */}
        <div className="bg-card rounded-lg border border-border p-6 hover:border-accent/50 transition-colors flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Target Kalori Harian</p>
            <p className="text-3xl font-bold text-foreground mt-2">{rec.calorieTarget} kkal</p>
            <p className="text-xs text-muted-foreground mt-1">Kebutuhan energi harian</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Flame size={24} className="text-primary" />
          </div>
        </div>

        {/* Card 4: Defisit/Surplus Kalori */}
        <div className="bg-card rounded-lg border border-border p-6 hover:border-accent/50 transition-colors flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Defisit/Surplus Kalori</p>
            <p className={`text-2xl font-bold mt-2 ${rec.calorieDiff > 0 ? "text-accent" : rec.calorieDiff < 0 ? "text-red-500" : "text-blue-500"}`}>
              {rec.calorieDiff > 0 ? `+${rec.calorieDiff}` : rec.calorieDiff === 0 ? "Pemeliharaan" : rec.calorieDiff} kkal
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {rec.calorieDiffType === "surplus" ? "Surplus kalori" : rec.calorieDiffType === "deficit" ? "Defisit kalori" : "Kalori pemeliharaan"}
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Activity size={24} className="text-primary" />
          </div>
        </div>

        {/* Card 5: Target Protein */}
        <div className="bg-card rounded-lg border border-border p-6 hover:border-accent/50 transition-colors flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Target Protein</p>
            <p className="text-3xl font-bold text-foreground mt-2">{rec.proteinTarget}g</p>
            <p className="text-xs text-muted-foreground mt-1">{rec.proteinTarget * 4} kkal</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <Dumbbell size={24} className="text-accent" />
          </div>
        </div>

        {/* Card 6: Target Karbohidrat */}
        <div className="bg-card rounded-lg border border-border p-6 hover:border-accent/50 transition-colors flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Target Karbohidrat</p>
            <p className="text-3xl font-bold text-foreground mt-2">{rec.carbsTarget}g</p>
            <p className="text-xs text-muted-foreground mt-1">{rec.carbsTarget * 4} kkal</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Apple size={24} className="text-primary" />
          </div>
        </div>

        {/* Card 7: Target Lemak */}
        <div className="bg-card rounded-lg border border-border p-6 hover:border-accent/50 transition-colors flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Target Lemak</p>
            <p className="text-3xl font-bold text-foreground mt-2">{rec.fatTarget}g</p>
            <p className="text-xs text-muted-foreground mt-1">{rec.fatTarget * 9} kkal</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Droplets size={24} className="text-primary" />
          </div>
        </div>

        {/* Card 8: Frekuensi Latihan */}
        <div className="bg-card rounded-lg border border-border p-6 hover:border-accent/50 transition-colors flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Frekuensi Latihan</p>
            <p className="text-2xl font-bold text-foreground mt-2">{rec.trainingFrequency}</p>
            <p className="text-xs text-muted-foreground mt-1">Disarankan per minggu</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <Clock size={24} className="text-accent" />
          </div>
        </div>

        {/* Card 9: Split Latihan */}
        <div className="bg-card rounded-lg border border-border p-6 hover:border-accent/50 transition-colors flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Split Latihan</p>
            <p className="text-lg font-bold text-foreground mt-2">{rec.trainingSplits.join(", ")}</p>
            <p className="text-xs text-muted-foreground mt-1">Program rekomendasi</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Dumbbell size={24} className="text-primary" />
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <Card className="bg-card border-border p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {assessment.fullName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {assessment.fullName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Usia: {assessment.age} | Tinggi: {assessment.height}cm | Berat:{" "}
                {assessment.weight}kg | IMT: {bmi} ({bmi < 18.5 ? "Kurus" : bmi < 25 ? "Normal" : bmi < 30 ? "Kelebihan Berat" : "Obesitas"})
              </p>
              <p className="text-sm text-accent font-medium mt-1">
                Tingkat Pengalaman: {assessment.trainingExperience === "beginner" ? "Pemula" : assessment.trainingExperience === "intermediate" ? "Menengah" : "Mahir"} • Latihan {assessment.trainingFrequency} kali/minggu
              </p>
            </div>
          </div>
          <Link to="/assessment">
            <Button>Perbarui Profil</Button>
          </Link>
        </div>
      </Card>

      {/* Progress Chart */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Kemajuan 6 Minggu
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
              }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#2563eb"
              name="Berat Badan (kg)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="bodyFat"
              stroke="#22c55e"
              name="Lemak Tubuh %"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Assessments */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Penilaian Terbaru
          </h2>
          <Link to="/history">
            <Button variant="outline" size="sm">
              Lihat Semua <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {recentAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-accent/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent"></div>
                  <div>
                    <p className="font-medium text-foreground">
                      {assessment.goal}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(assessment.date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">
                    {assessment.recommendation}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Skor: {assessment.score}%
                  </p>
                </div>
                <Link to="/ranking">
                  <Button variant="ghost" size="sm">
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-6 hover:border-accent/50 transition-colors cursor-pointer">
          <Link to="/assessment" className="flex flex-col gap-3">
            <div className="p-3 bg-primary/10 rounded-lg w-fit">
              <AlertCircle size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Penilaian Baru</h3>
            <p className="text-sm text-muted-foreground">
              Perbarui metrik tubuh Anda dan dapatkan rekomendasi baru
            </p>
          </Link>
        </Card>

        <Card className="bg-card border-border p-6 hover:border-accent/50 transition-colors cursor-pointer">
          <Link to="/nutrition" className="flex flex-col gap-3">
            <div className="p-3 bg-accent/10 rounded-lg w-fit">
              <Flame size={24} className="text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">Rencana Nutrisi</h3>
            <p className="text-sm text-muted-foreground">
              Lihat rencana makan dan makronutrisi pribadi Anda
            </p>
          </Link>
        </Card>

        <Card className="bg-card border-border p-6 hover:border-accent/50 transition-colors cursor-pointer">
          <Link to="/workout" className="flex flex-col gap-3">
            <div className="p-3 bg-primary/10 rounded-lg w-fit">
              <TrendingUp size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Rencana Latihan</h3>
            <p className="text-sm text-muted-foreground">
              Periksa jadwal latihan mingguan Anda
            </p>
          </Link>
        </Card>
      </div>
    </div>
  );
}
