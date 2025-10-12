import { Navbar } from "@/components/Navbar";
import { VideoUploadForm } from "@/components/VideoUploadForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Platform Penerjemah Video
              <span className="block mt-2 bg-gradient-primary bg-clip-text text-transparent">
                Mudah & Cepat
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Terjemahkan video Anda ke berbagai bahasa dengan teknologi AI terdepan
            </p>
          </div>

          {/* Upload Form */}
          <div className="animate-slide-up">
            <VideoUploadForm />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in">
            <div className="text-center p-6 rounded-lg bg-gradient-card border border-border/50">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Akurat</h3>
              <p className="text-sm text-muted-foreground">
                Terjemahan berkualitas tinggi dengan AI terbaru
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-card border border-border/50">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Cepat</h3>
              <p className="text-sm text-muted-foreground">
                Proses terjemahan dalam hitungan menit
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-card border border-border/50">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold mb-2">Multi Bahasa</h3>
              <p className="text-sm text-muted-foreground">
                Mendukung lebih dari 50+ bahasa di dunia
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 TransVidio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
