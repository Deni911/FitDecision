import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Assessment, calculateSAW } from "@/lib/saw-calculator";
import { supabase } from "@/lib/supabase";

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "" as "male" | "female" | "",
    age: "",
    height: "",
    weight: "",
    bodyFat: "",
    waistCircumference: "",
    trainingExperience: "" as "beginner" | "intermediate" | "advanced" | "",
    trainingFrequency: "" as "1-2" | "3-4" | "5-6" | "daily" | "",
    fitnessGoal: "" as
      | "bulk"
      | "recomp"
      | "moderate_cut"
      | "aggressive_cut"
      | "",
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Nama lengkap wajib diisi";
    if (!formData.gender) newErrors.gender = "Jenis kelamin wajib diisi";
    if (!formData.age || parseInt(formData.age) < 18)
      newErrors.age = "Usia minimal harus 18 tahun atau lebih";
    if (!formData.height || parseFloat(formData.height) <= 0)
      newErrors.height = "Tinggi badan harus bernilai positif";
    if (!formData.weight || parseFloat(formData.weight) <= 0)
      newErrors.weight = "Berat badan harus bernilai positif";
    if (!formData.bodyFat || parseFloat(formData.bodyFat) < 0)
      newErrors.bodyFat = "Persentase lemak tubuh wajib diisi";
    if (!formData.waistCircumference || parseFloat(formData.waistCircumference) <= 0)
      newErrors.waistCircumference = "Lingkar pinggang harus bernilai positif";
    if (!formData.trainingExperience)
      newErrors.trainingExperience = "Pengalaman latihan wajib diisi";
    if (!formData.trainingFrequency)
      newErrors.trainingFrequency = "Frekuensi latihan wajib diisi";
    if (!formData.fitnessGoal)
      newErrors.fitnessGoal = "Tujuan kebugaran wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const assessment: Assessment = {
      id: Date.now().toString(),
      fullName: formData.fullName,
      gender: formData.gender as "male" | "female",
      age: parseInt(formData.age),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      bodyFat: parseFloat(formData.bodyFat),
      waistCircumference: parseFloat(formData.waistCircumference),
      trainingExperience: formData.trainingExperience as
        | "beginner"
        | "intermediate"
        | "advanced",
      trainingFrequency: formData.trainingFrequency as
        | "1-2"
        | "3-4"
        | "5-6"
        | "daily",
      fitnessGoal: formData.fitnessGoal as
        | "bulk"
        | "recomp"
        | "moderate_cut"
        | "aggressive_cut",
      date: new Date().toISOString(),
      sawScores: [],
    };

    // Calculate SAW scores
    assessment.sawScores = calculateSAW(assessment);

    // Simpan ke Supabase jika terkonfigurasi
    if (supabase) {
      try {
        const { error } = await supabase.from("assessments").insert([
          {
            id: assessment.id,
            full_name: assessment.fullName,
            gender: assessment.gender,
            age: assessment.age,
            height: assessment.height,
            weight: assessment.weight,
            body_fat: assessment.bodyFat,
            waist_circumference: assessment.waistCircumference,
            training_experience: assessment.trainingExperience,
            training_frequency: assessment.trainingFrequency,
            fitness_goal: assessment.fitnessGoal,
            date: assessment.date,
            saw_scores: assessment.sawScores,
          },
        ]);
        if (error) {
          console.error("Gagal menyimpan ke Supabase:", error.message);
        }
      } catch (err) {
        console.error("Error saat menyimpan ke Supabase:", err);
      }
    }

    // Simpan ke localStorage
    const assessments = JSON.parse(
      localStorage.getItem("assessments") || "[]"
    ) as Assessment[];
    assessments.push(assessment);
    localStorage.setItem("assessments", JSON.stringify(assessments));
    localStorage.setItem("lastAssessment", JSON.stringify(assessment));

    setSubmitted(true);
    setTimeout(() => {
      navigate("/ranking");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="bg-card border-border p-8 text-center max-w-md">
          <CheckCircle size={48} className="mx-auto text-accent mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Penilaian Berhasil Disimpan!
          </h2>
          <p className="text-muted-foreground mb-4">
            Penilaian tubuh Anda telah berhasil disimpan. Mengalihkan ke halaman hasil...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Penilaian Tubuh</h1>
        <p className="text-muted-foreground">
          Isi metrik tubuh Anda untuk mendapatkan rekomendasi kebugaran pribadi
        </p>
      </div>

      <Card className="bg-card border-border p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Informasi Pribadi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="John Doe"
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      gender: value as "male" | "female",
                    })
                  }
                >
                  <SelectTrigger
                    id="gender"
                    className={errors.gender ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>

              <div>
                <Label htmlFor="age">Usia</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  placeholder="28"
                  className={errors.age ? "border-red-500" : ""}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                )}
              </div>
            </div>
          </div>

          {/* Body Measurements Section */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Ukuran Tubuh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="height">Tinggi Badan (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  placeholder="180"
                  className={errors.height ? "border-red-500" : ""}
                />
                {errors.height && (
                  <p className="text-red-500 text-sm mt-1">{errors.height}</p>
                )}
              </div>

              <div>
                <Label htmlFor="weight">Berat Badan (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="85"
                  className={errors.weight ? "border-red-500" : ""}
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                )}
              </div>

              <div>
                <Label htmlFor="bodyFat">Persentase Lemak Tubuh (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={formData.bodyFat}
                  onChange={(e) =>
                    setFormData({ ...formData, bodyFat: e.target.value })
                  }
                  placeholder="18"
                  className={errors.bodyFat ? "border-red-500" : ""}
                />
                {errors.bodyFat && (
                  <p className="text-red-500 text-sm mt-1">{errors.bodyFat}</p>
                )}
              </div>

              <div>
                <Label htmlFor="waistCircumference">
                  Lingkar Pinggang (cm)
                </Label>
                <Input
                  id="waistCircumference"
                  type="number"
                  step="0.1"
                  value={formData.waistCircumference}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      waistCircumference: e.target.value,
                    })
                  }
                  placeholder="85"
                  className={
                    errors.waistCircumference ? "border-red-500" : ""
                  }
                />
                {errors.waistCircumference && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.waistCircumference}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Training Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Informasi Latihan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="experience">Pengalaman Latihan</Label>
                <Select
                  value={formData.trainingExperience}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      trainingExperience: value as
                        | "beginner"
                        | "intermediate"
                        | "advanced",
                    })
                  }
                >
                  <SelectTrigger
                    id="experience"
                    className={
                      errors.trainingExperience ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Pilih tingkat pengalaman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Pemula</SelectItem>
                    <SelectItem value="intermediate">Menengah</SelectItem>
                    <SelectItem value="advanced">Mahir</SelectItem>
                  </SelectContent>
                </Select>
                {errors.trainingExperience && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.trainingExperience}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="frequency">Frekuensi Latihan (per minggu)</Label>
                <Select
                  value={formData.trainingFrequency}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      trainingFrequency: value as
                        | "1-2"
                        | "3-4"
                        | "5-6"
                        | "daily",
                    })
                  }
                >
                  <SelectTrigger
                    id="frequency"
                    className={
                      errors.trainingFrequency ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Pilih frekuensi latihan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 kali/minggu</SelectItem>
                    <SelectItem value="3-4">3-4 kali/minggu</SelectItem>
                    <SelectItem value="5-6">5-6 kali/minggu</SelectItem>
                    <SelectItem value="daily">Setiap Hari</SelectItem>
                  </SelectContent>
                </Select>
                {errors.trainingFrequency && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.trainingFrequency}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Fitness Goal Section */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Tujuan Utama Kebugaran
            </h2>
            <RadioGroup
              value={formData.fitnessGoal}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  fitnessGoal: value as
                    | "bulk"
                    | "recomp"
                    | "moderate_cut"
                    | "aggressive_cut",
                })
              }
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer">
                  <RadioGroupItem value="bulk" id="bulk" />
                  <Label htmlFor="bulk" className="cursor-pointer flex-1">
                    Membangun Otot (Bulking)
                    <span className="block text-xs text-muted-foreground">
                      Menaikkan berat badan untuk meningkatkan massa otot
                    </span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer">
                  <RadioGroupItem value="recomp" id="recomp" />
                  <Label htmlFor="recomp" className="cursor-pointer flex-1">
                    Memperbaiki Komposisi Tubuh (Recomp)
                    <span className="block text-xs text-muted-foreground">
                      Membangun otot sekaligus membakar lemak secara bersamaan
                    </span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer">
                  <RadioGroupItem value="moderate_cut" id="moderate_cut" />
                  <Label
                    htmlFor="moderate_cut"
                    className="cursor-pointer flex-1"
                  >
                    Menurunkan Lemak (Moderat - Cutting)
                    <span className="block text-xs text-muted-foreground">
                      Menurunkan berat badan secara bertahap sambil mempertahankan otot
                    </span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-background transition-colors cursor-pointer">
                  <RadioGroupItem value="aggressive_cut" id="aggressive_cut" />
                  <Label
                    htmlFor="aggressive_cut"
                    className="cursor-pointer flex-1"
                  >
                    Menurunkan Lemak (Agresif - Cutting)
                    <span className="block text-xs text-muted-foreground">
                      Menurunkan lemak secara cepat (membutuhkan disiplin tinggi)
                    </span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
            {errors.fitnessGoal && (
              <p className="text-red-500 text-sm mt-3">{errors.fitnessGoal}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Hitung Rekomendasi
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Batal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
