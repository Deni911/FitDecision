import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Assessment, getBMI } from "@/lib/saw-calculator";
import { Search, Trash2, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function History() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  useEffect(() => {
    const loadData = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("assessments")
            .select("*")
            .order("date", { ascending: false });

          if (error) {
            console.error("Gagal memuat dari Supabase:", error.message);
            loadFromLocalStorage();
          } else if (data) {
            // Map snake_case to camelCase
            const mapped: Assessment[] = data.map((d: any) => ({
              id: d.id,
              fullName: d.full_name,
              gender: d.gender,
              age: d.age,
              height: Number(d.height),
              weight: Number(d.weight),
              bodyFat: Number(d.body_fat),
              waistCircumference: Number(d.waist_circumference),
              trainingExperience: d.training_experience,
              trainingFrequency: d.training_frequency,
              fitnessGoal: d.fitness_goal,
              date: d.date,
              sawScores: d.saw_scores,
            }));
            setAssessments(mapped);
          }
        } catch (err) {
          console.error("Error saat memuat dari Supabase:", err);
          loadFromLocalStorage();
        }
      } else {
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      const stored = localStorage.getItem("assessments");
      if (stored) {
        const data = JSON.parse(stored) as Assessment[];
        setAssessments(data.reverse()); // Most recent first
      }
    };

    loadData();
  }, []);

  const filteredAssessments = assessments
    .filter((a) => {
      const searchLower = searchTerm.toLowerCase().trim();
      if (!searchLower) return true;

      // 1. Cari berdasarkan Nama
      const nameMatch = a.fullName.toLowerCase().includes(searchLower);

      // 2. Cari berdasarkan Umur
      const ageMatch = a.age.toString().includes(searchLower);

      // 3. Cari berdasarkan Tanggal (format: "12/6/2026" atau "12 juni 2026")
      const dateObj = new Date(a.date);
      const dateFormattedId = dateObj.toLocaleDateString("id-ID");
      const dateOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
      const dateTextId = dateObj.toLocaleDateString("id-ID", dateOptions).toLowerCase();

      const dateMatch = dateFormattedId.includes(searchLower) || dateTextId.includes(searchLower);

      return nameMatch || ageMatch || dateMatch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "name") {
        return a.fullName.localeCompare(b.fullName);
      }
      return 0;
    });

  const handleDelete = async (id: string) => {
    const password = prompt("Masukkan password admin untuk menghapus penilaian ini:");
    if (password !== "admin") {
      alert("Akses ditolak! Hanya admin yang memiliki hak untuk menghapus data.");
      return;
    }

    if (confirm("Apakah Anda yakin ingin menghapus penilaian ini?")) {
      if (supabase) {
        try {
          const { error } = await supabase
            .from("assessments")
            .delete()
            .eq("id", id);
          if (error) {
            console.error("Gagal menghapus dari Supabase:", error.message);
          }
        } catch (err) {
          console.error("Error saat menghapus dari Supabase:", err);
        }
      }

      const updated = assessments.filter((a) => a.id !== id);
      setAssessments(updated);
      localStorage.setItem("assessments", JSON.stringify(updated));
    }
  };

  const handleView = (assessment: Assessment) => {
    localStorage.setItem("lastAssessment", JSON.stringify(assessment));
    window.location.href = "/ranking";
  };

  const goalMap: Record<string, string> = {
    bulk: "Bulking",
    recomp: "Rekomposisi Tubuh",
    moderate_cut: "Cutting Moderat",
    aggressive_cut: "Cutting Agresif"
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Riwayat Penilaian</h1>
        <p className="text-muted-foreground">
          Lihat dan kelola semua penilaian kebugaran Anda sebelumnya
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <Input
            placeholder="Cari berdasarkan nama, tanggal, atau usia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={sortBy === "date" ? "default" : "outline"}
            onClick={() => setSortBy("date")}
            className="text-xs sm:text-sm"
          >
            Urutkan Tanggal
          </Button>
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            onClick={() => setSortBy("name")}
            className="text-xs sm:text-sm"
          >
            Urutkan Nama
          </Button>
        </div>
      </div>

      {/* Assessments Container */}
      {filteredAssessments.length === 0 ? (
        <Card className="bg-card border-border p-12 text-center">
          <p className="text-muted-foreground text-lg mb-4">
            Penilaian tidak ditemukan
          </p>
          <p className="text-sm text-muted-foreground">
            {assessments.length === 0
              ? "Mulai dengan membuat penilaian pertama Anda"
              : "Coba sesuaikan filter pencarian Anda"}
          </p>
        </Card>
      ) : (
        <>
          {/* Mobile Card Layout (Shown on small screens, hidden on desktop) */}
          <div className="md:hidden space-y-4">
            {filteredAssessments.map((assessment) => {
              const bmi = getBMI(assessment.height, assessment.weight);
              const topRecommendation = assessment.sawScores[0];
              return (
                <Card key={assessment.id} className="bg-card border-border p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground text-base">{assessment.fullName}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(assessment.date).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleView(assessment)}
                        className="h-8 px-2 flex items-center gap-1"
                        title="Lihat hasil"
                      >
                        <Eye size={14} />
                        <span className="text-[10px]">Lihat</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(assessment.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-background/50 p-3 rounded-lg border border-border text-center text-xs">
                    <div>
                      <p className="text-muted-foreground text-[10px]">Usia</p>
                      <p className="font-bold text-foreground mt-0.5">{assessment.age} thn</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px]">IMT</p>
                      <p className="font-bold text-primary mt-0.5">{bmi}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px]">Lemak</p>
                      <p className="font-bold text-foreground mt-0.5">{assessment.bodyFat.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tujuan:</span>
                      <span className="capitalize font-semibold text-foreground">
                        {goalMap[assessment.fitnessGoal] || assessment.fitnessGoal.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rekomendasi Utama:</span>
                      <span className="px-2.5 py-0.5 bg-accent/15 border border-accent/20 rounded-full font-bold text-accent text-[11px]">
                        {topRecommendation ? topRecommendation.alternative : "N/A"}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Desktop Table Layout (Hidden on mobile, shown on md screens and up) */}
          <div className="hidden md:block">
            <Card className="bg-card border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Usia</TableHead>
                      <TableHead>IMT</TableHead>
                      <TableHead>% Lemak Tubuh</TableHead>
                      <TableHead>Tujuan</TableHead>
                      <TableHead>Rekomendasi Utama</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessments.map((assessment) => {
                      const bmi = getBMI(assessment.height, assessment.weight);
                      const topRecommendation = assessment.sawScores[0];
                      return (
                        <TableRow
                          key={assessment.id}
                          className="border-b border-border hover:bg-background/50 transition-colors"
                        >
                          <TableCell className="font-medium text-sm">
                            {new Date(assessment.date).toLocaleDateString("id-ID")}
                          </TableCell>
                          <TableCell className="text-sm font-medium">{assessment.fullName}</TableCell>
                          <TableCell className="text-sm">{assessment.age}</TableCell>
                          <TableCell>
                            <span className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary">
                              {bmi}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">{assessment.bodyFat.toFixed(1)}%</TableCell>
                          <TableCell>
                            <span className="text-sm capitalize font-medium">
                              {goalMap[assessment.fitnessGoal] || assessment.fitnessGoal.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="px-3 py-1 bg-accent/10 rounded-full text-xs font-semibold text-accent">
                              {topRecommendation ? topRecommendation.alternative : "N/A"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleView(assessment)}
                                title="Lihat hasil penilaian"
                                className="h-8 w-8 p-0"
                              >
                                <Eye size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(assessment.id)}
                                title="Hapus penilaian"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Summary Stats */}
      {filteredAssessments.length > 0 && (
        <Card className="bg-card border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Statistik Ringkasan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Penilaian</p>
              <p className="text-2xl sm:text-3xl font-bold text-accent mt-1">
                {filteredAssessments.length}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Rata-rata Usia</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary mt-1">
                {Math.round(
                  filteredAssessments.reduce((sum, a) => sum + a.age, 0) /
                  filteredAssessments.length
                )}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Rata-rata IMT</p>
              <p className="text-2xl sm:text-3xl font-bold text-primary mt-1">
                {(
                  filteredAssessments.reduce((sum, a) => {
                    return sum + getBMI(a.height, a.weight);
                  }, 0) / filteredAssessments.length
                ).toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Rata-rata Lemak</p>
              <p className="text-2xl sm:text-3xl font-bold text-accent mt-1">
                {(
                  filteredAssessments.reduce((sum, a) => sum + a.bodyFat, 0) /
                  filteredAssessments.length
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
