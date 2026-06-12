import { Card } from "@/components/ui/card";
import { AlertCircle, Lightbulb, BarChart3, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Tentang FitDecision</h1>
        <p className="text-muted-foreground">
          Pelajari tentang metode SAW dan bagaimana kami menghitung rekomendasi kebugaran Anda
        </p>
      </div>

      {/* System Overview */}
      <Card className="bg-card border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Apa itu FitDecision?
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          FitDecision adalah Sistem Pendukung Keputusan (SPK) yang dirancang untuk memberikan rekomendasi
          program kebugaran pribadi. Dengan menggunakan metode Simple Additive Weighting (SAW),
          sistem kami menganalisis metrik tubuh, profil latihan, dan tujuan kebugaran Anda untuk
          menentukan pendekatan latihan yang paling sesuai untuk kondisi unik Anda.
        </p>
      </Card>

      {/* SAW Method Explanation */}
      <Card className="bg-card border-border p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <BarChart3 size={28} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Simple Additive Weighting (SAW)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Metode pengambilan keputusan multi-kriteria yang terbukti
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Metode Simple Additive Weighting adalah teknik yang mapan dalam
            sistem pendukung keputusan. Metode ini bekerja dengan:
          </p>

          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="font-bold text-accent min-w-fit">1.</span>
              <div>
                <p className="font-medium text-foreground">Mengidentifikasi Kriteria</p>
                <p className="text-sm text-muted-foreground">
                  Menentukan faktor-faktor penting untuk keputusan (misalnya, % lemak tubuh, IMT)
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent min-w-fit">2.</span>
              <div>
                <p className="font-medium text-foreground">Pemberian Skor Setiap Alternatif</p>
                <p className="text-sm text-muted-foreground">
                  Mengevaluasi setiap pilihan terhadap setiap kriteria (skala 0-100)
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent min-w-fit">3.</span>
              <div>
                <p className="font-medium text-foreground">Menentukan Bobot</p>
                <p className="text-sm text-muted-foreground">
                  Memberikan tingkat kepentingan relatif untuk setiap kriteria (total 100%)
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent min-w-fit">4.</span>
              <div>
                <p className="font-medium text-foreground">Menghitung Skor Total</p>
                <p className="text-sm text-muted-foreground">
                  Menjumlahkan skor tertimbang untuk setiap alternatif
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-accent min-w-fit">5.</span>
              <div>
                <p className="font-medium text-foreground">Perangkingan Hasil</p>
                <p className="text-sm text-muted-foreground">
                  Alternatif dengan skor tertinggi adalah rekomendasi terbaik
                </p>
              </div>
            </li>
          </ol>
        </div>
      </Card>

      {/* Six Criteria */}
      <Card className="bg-card border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Enam Kriteria Keputusan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Persentase Lemak Tubuh",
              weight: "20%",
              description:
                "Menunjukkan rasio otot-ke-lemak Anda saat ini. Lemak tubuh yang lebih tinggi mungkin menunjukkan kebutuhan untuk fase penurunan lemak (cutting), sementara lemak tubuh yang lebih rendah ideal untuk fase membangun otot (bulking).",
            },
            {
              name: "IMT (Indeks Massa Tubuh)",
              weight: "20%",
              description:
                "Mengukur berat badan Anda relatif terhadap tinggi badan. Digunakan sebagai indikator umum rentang berat badan sehat dan status komposisi tubuh secara keseluruhan.",
            },
            {
              name: "Pengalaman Latihan",
              weight: "15%",
              description:
                "Tingkat pengalaman Anda memengaruhi kompleksitas dan intensitas program. Pemula mendapat manfaat dari program yang lebih sederhana, sedangkan lifter tingkat lanjut dapat menangani kompleksitas yang lebih tinggi.",
            },
            {
              name: "Frekuensi Latihan",
              weight: "15%",
              description:
                "Berapa hari per minggu Anda dapat berlatih memengaruhi pemilihan program. Latihan yang lebih sering memungkinkan program dengan volume lebih tinggi seperti Push/Pull/Legs.",
            },
            {
              name: "Lingkar Pinggang",
              weight: "15%",
              description:
                "Mengukur lemak perut secara langsung. Lingkar pinggang yang tinggi menunjukkan kelebihan lemak viseral, yang merupakan prioritas untuk program penurunan lemak.",
            },
            {
              name: "Tujuan Kebugaran",
              weight: "15%",
              description:
                "Tujuan utama Anda (membangun otot, penurunan lemak, rekomposisi tubuh, atau kebugaran umum) sangat memengaruhi program mana yang paling cocok untuk Anda.",
            },
          ].map((criterion, idx) => (
            <div key={idx} className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">
                  {criterion.name}
                </h3>
                <span className="px-3 py-1 bg-accent/10 rounded-full text-sm font-bold text-accent">
                  {criterion.weight}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {criterion.description}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Four Fitness Programs */}
      <Card className="bg-card border-border p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Empat Program Kebugaran
        </h2>

        <div className="space-y-6">
          {[
            {
              name: "Bulking",
              icon: "📈",
              description: "Surplus kalori untuk memaksimalkan peningkatan massa otot dan kekuatan",
              focus: "Pertumbuhan otot",
              deficit: "Surplus",
            },
            {
              name: "Rekomposisi Tubuh",
              icon: "⚡",
              description: "Peningkatan otot dan penurunan lemak secara bersamaan untuk estetika terbaik",
              focus: "Transformasi tubuh",
              deficit: "Pemeliharaan",
            },
            {
              name: "Cutting Moderat",
              icon: "📉",
              description: "Penurunan lemak yang berkelanjutan sambil mempertahankan massa otot",
              focus: "Penurunan lemak",
              deficit: "Defisit 15%",
            },
            {
              name: "Cutting Agresif",
              icon: "💪",
              description: "Penurunan lemak cepat untuk lifter berpengalaman yang bersiap untuk acara tertentu",
              focus: "Penurunan lemak maksimal",
              deficit: "Defisit 25%",
            },
          ].map((program, idx) => (
            <div key={idx} className="flex gap-4 p-4 bg-background rounded-lg border border-border">
              <div className="text-3xl">{program.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">
                  {program.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {program.description}
                </p>
                <div className="flex gap-4 mt-3">
                  <span className="text-xs px-2 py-1 bg-primary/10 rounded text-primary font-medium">
                    {program.focus}
                  </span>
                  <span className="text-xs px-2 py-1 bg-accent/10 rounded text-accent font-medium">
                    {program.deficit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* How It Works */}
      <Card className="bg-card border-border p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-accent/10 rounded-lg">
            <Lightbulb size={28} className="text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Cara Kerja Proses Rekomendasi
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <CheckCircle size={20} className="text-accent mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Anda Menyelesaikan Penilaian
              </h3>
              <p className="text-sm text-muted-foreground">
                Sediakan metrik tubuh Anda, pengalaman latihan, frekuensi, dan tujuan kebugaran
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <CheckCircle size={20} className="text-accent mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Sistem Kami Memberikan Skor untuk Setiap Program
              </h3>
              <p className="text-sm text-muted-foreground">
                Masing-masing dari 4 program diberi skor 0-100 terhadap metrik spesifik Anda
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <CheckCircle size={20} className="text-accent mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Bobot Diterapkan
              </h3>
              <p className="text-sm text-muted-foreground">
                Pentingnya setiap kriteria diperhitungkan (misalnya, lemak tubuh menyumbang 20% dari keputusan)
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <CheckCircle size={20} className="text-accent mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Peringkat Akhir Dihasilkan
              </h3>
              <p className="text-sm text-muted-foreground">
                Program diurutkan berdasarkan skor total tertimbang, dengan rekomendasi utama disorot
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <CheckCircle size={20} className="text-accent mt-1" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Anda Menerima Rencana Pribadi
              </h3>
              <p className="text-sm text-muted-foreground">
                Rencana nutrisi, latihan, dan implementasi yang disesuaikan dengan program yang Anda rekomendasikan
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Important Notes */}
      <Card className="bg-orange-500/10 border border-orange-500/20 p-8">
        <div className="flex items-start gap-4">
          <AlertCircle size={24} className="text-orange-500 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              (Disclaimer) Penting
            </h2>
            <p className="text-sm text-muted-foreground">
              Sistem ini memberikan rekomendasi berdasarkan metrik tubuh dan profil latihan Anda.
              Hasil tidak dijamin dan bergantung pada eksekusi program yang konsisten,
              kepatuhan nutrisi yang tepat, pemulihan yang memadai, dan faktor genetik individu.
              Silakan berkonsultasi dengan profesional kebugaran atau dokter yang berkualifikasi sebelum memulai
              program latihan atau nutrisi baru, terutama jika Anda memiliki kondisi kesehatan tertentu sebelumnya.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
