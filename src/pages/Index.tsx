import { Navbar } from "@/components/Navbar";
import VideoUploadForm from "@/components/VideoUploadForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Fixed height container to prevent CLS */}
        <div className="w-full max-w-7xl mx-auto" style={{ minHeight: '700px' }}>
          {/* Hero Section - Fixed height */}
          <div className="text-center mb-8" style={{ height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight" style={{ minHeight: '120px' }}>
              Platform Penerjemah Video
              <span className="block mt-2 bg-gradient-to-r from-black to-[#e4f806] dark:from-white dark:to-[#e4f806] bg-clip-text text-transparent">
                Mudah & Cepat
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto" style={{ minHeight: '32px' }}>
              Terjemahkan video Anda ke berbagai bahasa dengan teknologi Whispper
            </p>
          </div>

          {/* Upload Form - Reserved space */}
          <div style={{ minHeight: '450px' }}>
            <VideoUploadForm />
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-6 px-4" style={{ height: '80px', display: 'flex', alignItems: 'center' }}>
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 TransVidio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;