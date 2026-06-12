import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <AlertCircle size={48} className="mx-auto text-accent mb-4" />
        <h1 className="text-5xl font-bold text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-2">Halaman Tidak Ditemukan</p>
        <p className="text-sm text-muted-foreground mb-8">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
