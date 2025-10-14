import { Navbar } from "@/components/Navbar";
import VideoUploadForm from "@/components/VideoUploadForm";

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
              Terjemahkan video Anda ke berbagai bahasa dengan teknologi 
            </p>
          </div>

          {/* Upload Form */}
          <div className="animate-slide-up">
            <VideoUploadForm />
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
