import { Navbar } from "@/components/Navbar";
import VideoUploadForm from "@/components/VideoUploadForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300 text-foreground">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Fixed container dengan min-height untuk prevent layout shift */}
        <div className="w-full max-w-7xl space-y-8 min-h-[600px] sm:min-h-[700px]">
          {/* Hero Section - Optimized for LCP */}
          <div className="text-center space-y-4 h-[200px] sm:h-[220px] flex flex-col justify-center">
            {/* LCP Element - Remove animation delay, optimize rendering */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
              style={{ 
                contentVisibility: 'auto',
                contain: 'layout style paint'
              }}
            >
              Platform Penerjemah Video
              {/* Use inline gradient instead of utility class for faster render */}
              <span 
                className="block mt-2"
                style={{
                  background: 'linear-gradient(135deg, #000000ff 0%, #e4f806ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Mudah & Cepat
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Terjemahkan video Anda ke berbagai bahasa dengan teknologi Whispper
            </p>
          </div>

          {/* Upload Form dengan min-height untuk prevent shift */}
          <div className="min-h-[400px] sm:min-h-[450px]">
            <VideoUploadForm />
          </div>
        </div>
      </main>

      {/* Footer dengan fixed height */}
      <footer className="border-t border-border/40 py-6 px-4 h-[80px] flex items-center">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 TransVidio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;