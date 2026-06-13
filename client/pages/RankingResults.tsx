import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SAWResult, Assessment, getRecommendationDetails } from "@/lib/saw-calculator";
import { Trophy, BarChart3, ArrowRight, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function RankingResults() {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [scores, setScores] = useState<SAWResult[]>([]);

  useEffect(() => {
    const lastAssessment = localStorage.getItem("lastAssessment");
    if (lastAssessment) {
      const data = JSON.parse(lastAssessment) as Assessment;
      setAssessment(data);
      setScores(data.sawScores);
    }
  }, []);

  if (!assessment || scores.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Hasil Pemeringkatan SAW
          </h1>
          <p className="text-muted-foreground">
            Lihat peringkat program kebugaran pribadi Anda
          </p>
        </div>

        <Card className="bg-card border-border p-12 text-center">
          <BarChart3 size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Penilaian Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground mb-6">
            Selesaikan penilaian terlebih dahulu untuk melihat peringkat pribadi Anda
          </p>
          <Link to="/assessment">
            <Button>Mulai Penilaian</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const maxScore = Math.max(...scores.map((s) => s.score));
  const topProgram = scores[0];
  const rec = getRecommendationDetails(assessment);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Hasil Pemeringkatan SAW Anda
        </h1>
        <p className="text-muted-foreground">
          Berdasarkan penilaian untuk {assessment.fullName}
        </p>
      </div>

      {/* Top Recommendation Card */}
      <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-accent p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-4 bg-accent rounded-lg flex-shrink-0">
            <Trophy size={32} className="text-background" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-accent mb-1">
              REKOMENDASI UTAMA
            </p>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {topProgram.alternative}
            </h2>
            <p className="text-muted-foreground">
              Program ini paling cocok untuk kondisi tubuh, tujuan, dan profil latihan Anda saat ini.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-4xl font-bold text-accent">
              {topProgram.score}%
            </p>
            <p className="text-sm text-muted-foreground">Skor SAW</p>
          </div>
        </div>
      </Card>

      {/* Explanation Narrative Card */}
      <Card className="bg-card border-border p-6 border-l-4 border-l-accent">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="text-accent" size={20} />
          Analisis Rekomendasi
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Berdasarkan hasil perhitungan metode SAW menggunakan kriteria <strong>Persentase Lemak Tubuh</strong>, <strong>IMT (Indeks Massa Tubuh)</strong>, <strong>Pengalaman Latihan</strong>, <strong>Frekuensi Latihan</strong>, dan <strong>Lingkar Pinggang</strong>, sistem merekomendasikan <strong className="text-accent">{rec.programName}</strong> sebagai program yang paling sesuai dengan kondisi pengguna.
        </p>
      </Card>

      {/* Ranking Table */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Peringkat Lengkap
        </h2>
        <div className="space-y-3">
          {scores.map((score, index) => (
            <div key={index} className="space-y-2">
              <div className={`flex items-center justify-between p-4 bg-background rounded-lg border transition-colors ${
                score.rank === 1 ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
              }`}>
                <div className="flex items-center gap-4 flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${score.rank === 1 ? "bg-accent/20" : "bg-primary/10"}`}>
                    <span className={`text-lg font-bold ${score.rank === 1 ? "text-accent" : "text-primary"}`}>
                      {score.rank}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {score.alternative}
                    </p>
                    {score.rank === 1 && (
                      <p className="text-xs text-accent font-medium">
                        Direkomendasikan
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className={`text-2xl font-bold ${score.rank === 1 ? "text-accent" : "text-foreground"}`}>
                    {score.score}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-4">
                <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      score.rank === 1
                        ? "bg-accent"
                        : score.rank === 2
                          ? "bg-primary"
                          : "bg-muted"
                    }`}
                    style={{
                      width: `${(score.score / maxScore) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Alternatives Score Comparison Chart */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Grafik Perbandingan Nilai Alternatif (%)
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scores} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="alternative" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  color: "#f8fafc",
                }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {scores.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.rank === 1 ? "var(--accent)" : "var(--primary)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Assessment Details */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Rincian Penilaian Anda
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Nama Lengkap</p>
            <p className="text-lg font-semibold text-foreground">
              {assessment.fullName}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Usia</p>
            <p className="text-lg font-semibold text-foreground">
              {assessment.age} tahun
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jenis Kelamin</p>
            <p className="text-lg font-semibold text-foreground">
              {assessment.gender === "male" ? "Laki-laki" : "Perempuan"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tinggi Badan</p>
            <p className="text-lg font-semibold text-foreground">
              {assessment.height} cm
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Berat Badan</p>
            <p className="text-lg font-semibold text-foreground">
              {assessment.weight} kg
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lemak Tubuh</p>
            <p className="text-lg font-semibold text-foreground">
              {assessment.bodyFat}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lingkar Pinggang</p>
            <p className="text-lg font-semibold text-foreground">
              {assessment.waistCircumference} cm
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tingkat Pengalaman</p>
            <p className="text-lg font-semibold text-foreground capitalize">
              {assessment.trainingExperience === "beginner" ? "Pemula" : 
               assessment.trainingExperience === "intermediate" ? "Menengah" : "Mahir"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Frekuensi Latihan</p>
            <p className="text-lg font-semibold text-foreground">
              {assessment.trainingFrequency} kali/minggu
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tujuan Kebugaran</p>
            <p className="text-lg font-semibold text-foreground">
              {topProgram ? topProgram.alternative : "Rekomposisi Tubuh"}
            </p>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border p-6 hover:border-accent/50 transition-colors">
          <Link to="/nutrition" className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">Lihat Rencana Nutrisi</h3>
            <p className="text-sm text-muted-foreground">
              Dapatkan rencana makan pribadi dan target makronutrisi Anda
            </p>
            <div className="flex items-center gap-2 text-accent font-medium text-sm">
              Lihat Rencana <ArrowRight size={16} />
            </div>
          </Link>
        </Card>

        <Card className="bg-card border-border p-6 hover:border-accent/50 transition-colors">
          <Link to="/workout" className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">Lihat Rencana Latihan</h3>
            <p className="text-sm text-muted-foreground">
              Lihat pembagian latihan dan jadwal mingguan Anda
            </p>
            <div className="flex items-center gap-2 text-accent font-medium text-sm">
              Lihat Rencana <ArrowRight size={16} />
            </div>
          </Link>
        </Card>

        <Card className="bg-card border-border p-6 hover:border-accent/50 transition-colors">
          <Link to="/assessment" className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">Penilaian Baru</h3>
            <p className="text-sm text-muted-foreground">
              Perbarui metrik Anda dan dapatkan rekomendasi terbaru
            </p>
            <div className="flex items-center gap-2 text-accent font-medium text-sm">
              Nilai Ulang <ArrowRight size={16} />
            </div>
          </Link>
        </Card>
      </div>
    </div>
  );
}
