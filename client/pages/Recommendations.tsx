import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Zap, BarChart3 } from "lucide-react";

const recommendations = [
  {
    id: "bulk",
    title: "Bulking",
    icon: TrendingUp,
    description:
      "Strategi surplus kalori yang dirancang untuk memaksimalkan pertumbuhan otot dengan menerima konsekuensi penambahan sedikit lemak.",
    pros: [
      "Peningkatan massa otot dan kekuatan yang cepat",
      "Lebih baik untuk performa angkat beban berat",
      "Lebih sedikit pembatasan makanan",
      "Lebih mudah mempertahankan kepadatan otot",
    ],
    cons: [
      "Penambahan lemak tidak dapat dihindari",
      "Membutuhkan asupan makanan yang lebih tinggi",
      "Fase perantara yang kurang estetis",
      "Mungkin merasa kembung/begah",
    ],
    suitableFor:
      "Lifter tingkat menengah hingga mahir dengan kadar lemak tubuh lebih rendah yang ingin memprioritaskan pertumbuhan otot",
    duration: "8-16 minggu per siklus",
  },
  {
    id: "recomp",
    title: "Rekomposisi Tubuh",
    icon: Zap,
    description:
      "Pendekatan seimbang untuk membangun otot sekaligus menghilangkan lemak secara bersamaan. Ideal untuk memaksimalkan estetika.",
    pros: [
      "Terbaik untuk hasil visual",
      "Membangun otot tanpa lemak berlebih",
      "Meningkatkan komposisi tubuh secara signifikan",
      "Berkelanjutan dalam jangka panjang",
      "Cocok untuk semua tingkatan",
    ],
    cons: [
      "Kemajuan lebih lambat daripada siklus bulk/cut",
      "Membutuhkan nutrisi yang presisi",
      "Pemrograman latihan yang lebih kompleks",
      "Membutuhkan kesabaran",
    ],
    suitableFor:
      "Pemula, lifter menengah, dan mereka yang ingin meningkatkan estetika tubuh",
    duration: "12-24 minggu untuk perubahan nyata",
  },
  {
    id: "moderate_cut",
    title: "Cutting Moderat",
    icon: TrendingDown,
    description:
      "Pendekatan penurunan lemak yang berkelanjutan untuk mempertahankan massa otot melalui nutrisi dan latihan yang tepat.",
    pros: [
      "Pendekatan yang berkelanjutan",
      "Mempertahankan massa otot",
      "Tingkat energi tetap tinggi",
      "Dapat mempertahankan kekuatan",
      "Rasa lapar tidak terlalu dramatis",
    ],
    cons: [
      "Penurunan lemak lebih lambat",
      "Membutuhkan konsistensi diet",
      "Mungkin merasa terbatas dalam porsi makan",
      "Durasi yang dibutuhkan lebih lama",
    ],
    suitableFor:
      "Siapa pun yang ingin menurunkan lemak sambil mempertahankan otot, terbaik untuk keberlanjutan",
    duration: "12-20 minggu tergantung target",
  },
  {
    id: "aggressive_cut",
    title: "Cutting Agresif",
    icon: BarChart3,
    description:
      "Pendekatan defisit kalori tinggi untuk penurunan lemak dengan cepat. Membutuhkan disiplin tinggi dan terbaik untuk lifter tingkat lanjut.",
    pros: [
      "Hasil visual yang cepat terlihat",
      "Penurunan lemak yang cepat",
      "Durasi yang dibutuhkan lebih singkat",
      "Kemajuan awal yang sangat memotivasi",
    ],
    cons: [
      "Risiko kehilangan massa otot",
      "Energi dan suasana hati yang lebih rendah",
      "Rasa lapar yang ekstrem",
      "Membutuhkan pengalaman",
      "Dapat memperlambat metabolisme",
      "Tidak berkelanjutan untuk jangka panjang",
    ],
    suitableFor:
      "Lifter tingkat lanjut dengan fondasi otot yang baik yang bersiap untuk acara atau kompetisi",
    duration: "Maksimal 6-12 minggu",
  },
];

export default function Recommendations() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Program Kebugaran
        </h1>
        <p className="text-muted-foreground">
          Jelajahi empat program kebugaran utama dan pilih salah satu yang paling sesuai dengan tujuan Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((program) => {
          const Icon = program.icon;
          return (
            <Card
              key={program.id}
              className="bg-card border-border p-6 hover:border-accent/50 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon size={28} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">
                    {program.title}
                  </h2>
                  <p className="text-sm text-accent font-medium mt-1">
                    {program.duration}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{program.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-accent mb-3">
                    Kelebihan
                  </h3>
                  <ul className="space-y-2">
                    {program.pros.map((pro, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-foreground flex gap-2"
                      >
                        <span className="text-accent font-bold">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-destructive mb-3">
                    Kekurangan
                  </h3>
                  <ul className="space-y-2">
                    {program.cons.map((con, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-foreground flex gap-2"
                      >
                        <span className="text-destructive font-bold">−</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Terbaik Untuk
                </h3>
                <p className="text-sm text-muted-foreground">
                  {program.suitableFor}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Key Principles */}
      <Card className="bg-card border-border p-6 mt-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Prinsip Utama untuk Keberhasilan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-accent mb-3">
              Nutrisi
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Lacak makronutrisi secara konsisten</li>
              <li>• Prioritaskan asupan protein</li>
              <li>• Jaga hidrasi tubuh</li>
              <li>• Rencanakan makanan sebelumnya</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent mb-3">Latihan</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Beban bertahap (Progressive overload)</li>
              <li>• Jadwal latihan yang konsisten</li>
              <li>• Gerakan dan teknik yang tepat</li>
              <li>• Pemulihan yang memadai</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent mb-3">Gaya Hidup</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Tidur 7-9 jam</li>
              <li>• Kelola stres</li>
              <li>• Tetap konsisten</li>
              <li>• Penilaian berkala</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
