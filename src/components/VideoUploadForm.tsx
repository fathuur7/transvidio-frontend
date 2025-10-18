import React, { useRef, useState, lazy, Suspense, useEffect } from "react";
import { Play, X, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LANGUAGES }  from "@/constants/languages";
import { FileUploadZone } from "@/components/FileUploadZone";
import useAuth from "@/hooks/use-auth"; 

// Lazy load komponen berat yang tidak diperlukan di initial render
const VideoPlayer = lazy(() =>
  import("@/components/VideoPlayer").then((mod) => ({
    // map named export or default export to the shape React.lazy expects
    default: ((mod as any).default ?? (mod as any).VideoPlayer) as any,
  }))
);
const SubtitleList = lazy(() =>
  import("@/components/SubtitleList").then((mod) => ({
    // map named export or default export to the shape React.lazy expects
    default: ((mod as any).default ?? (mod as any).SubtitleList) as any,
  }))
);

const LazyVideoPlayer: any = VideoPlayer as any;
const LazySubtitleList: any = SubtitleList as any;

// Loading component untuk Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    <span className="ml-3 text-card-foreground">Memuat komponen...</span>
  </div>
);

// Komponen Button sederhana untuk menghindari import Button dari UI library
const SimpleButton = ({ onClick, variant, size, children, className = "" }) => {
  const baseClass = "px-4 py-2 rounded-lg font-medium transition-all";
  const variantClass = variant === "outline" 
    ? "border border-border bg-transparent hover:bg-accent" 
    : "bg-primary text-primary-foreground hover:bg-primary/90";
  
  return (
    <button 
      onClick={onClick} 
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default function VideoUploadForm() {
  const { user, loading, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  // State untuk video upload - simplified
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  
  // State untuk subtitle - hanya diinisialisasi saat diperlukan
  const [subtitles, setSubtitles] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  
  // State untuk processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // State untuk video player - lazy initialized
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Lazy import utils hanya saat diperlukan
  const [fileUtils, setFileUtils] = useState(null);
  const [videoHooks, setVideoHooks] = useState(null);

  // Load utils saat showPreview true
  useEffect(() => {
    if (showPreview && !fileUtils) {
      import("@/utils/fileUtils").then(module => setFileUtils(module));
    }
  }, [showPreview, fileUtils]);

  useEffect(() => {
    if (showPreview && !videoHooks) {
      import("@/hooks/use-vidio").then(module => setVideoHooks(module));
    }
  }, [showPreview, videoHooks]);

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setError(null);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setError(null);
    }
  };

  // Handle process dengan validasi auth
  const handleProcess = async () => {
    if (!videoFile) {
      toast({
        title: "Video Belum Dipilih",
        description: "Silakan pilih video terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    if (!selectedLanguage) {
      toast({
        title: "Bahasa Belum Dipilih",
        description: "Silakan pilih bahasa tujuan terjemahan",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Lazy import processVideo function
      const { useVideoProcessing } = await import("@/hooks/use-vidio");
      const { processVideo } = useVideoProcessing();
      
      const data = await processVideo(videoFile, selectedLanguage);
      
      if (data && data.translated_srt) {
        // Lazy import parseSRT
        const { parseSRT } = await import("@/utils/fileUtils");
        const parsed = parseSRT(data.translated_srt);
        setSubtitles(parsed);
        setShowPreview(true);
        
        toast({
          title: "Berhasil",
          description: "Video berhasil diproses!",
        });
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memproses video");
      toast({
        title: "Error",
        description: err.message || "Terjadi kesalahan saat memproses video",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoginClick = () => {
    window.location.href = `/auth?redirect=${encodeURIComponent(window.location.pathname)}`;
  };

  const handleDownloadSrt = async () => {
    try {
      // Dynamic import generateSRT hanya saat download
      const { generateSRT } = await import("@/utils/fileUtils");
      const srtText = generateSRT(subtitles);
      const blob = new Blob([srtText], { type: 'text/srt' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subtitle_${selectedLanguage}.srt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Berhasil",
        description: "File SRT berhasil diunduh",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Gagal mengunduh file SRT",
        variant: "destructive",
      });
    }
  };

  const getCurrentSubtitle = () => {
    return subtitles.find(
      sub => currentTime >= sub.startSeconds && currentTime <= sub.endSeconds
    );
  };

  // Subtitle editor handlers
  const handleEditSubtitle = (index) => {
    setEditingIndex(index);
    setEditText(subtitles[index].text);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updated = [...subtitles];
      updated[editingIndex].text = editText;
      setSubtitles(updated);
      setEditingIndex(null);
      setEditText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  // Player props yang minimal
  const playerProps = {
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    togglePlay: () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-3 text-card-foreground">Memuat...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-card dark:bg-card rounded-2xl shadow-xl border border-border dark:border-border overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {!showPreview ? (
            <>
              {!user && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                        Login Diperlukan
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Anda harus login terlebih dahulu untuk memproses video
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-sm font-medium text-card-foreground">
                  Pilih Video
                </label>
                <FileUploadZone
                  videoFile={videoFile}
                  dragActive={dragActive}
                  onFileChange={handleFileChange}
                  onDrag={handleDrag}
                  onDrop={handleDrop}
                />
              </div>

              <div className="space-y-4">
                <label htmlFor="target-language" className="block text-sm font-medium text-card-foreground">
                  Bahasa Tujuan
                </label>
                <select
                  id="target-language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base border border-border dark:border-border rounded-xl bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  disabled={!user}
                >
                  <option value="">Pilih bahasa terjemahan</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {!user ? (
                <button
                  onClick={handleLoginClick}
                  className="w-full px-4 py-3 sm:py-4 bg-blue-600 dark:bg-blue-500 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center justify-center space-x-2"
                >
                  <Lock className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Login untuk Memproses Video</span>
                </button>
              ) : (
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || !videoFile || !selectedLanguage}
                  className="w-full px-4 py-3 sm:py-4 bg-yellow-500 dark:bg-yellow-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent rounded-full"></span>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-gray-900 dark:text-white">
                        Proses Video
                      </span>
                    </>
                  )}
                </button>
              )}

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm sm:text-base p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {error}
                </div>
              )}
            </>
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-card-foreground">
                    Preview & Edit Subtitle
                  </h2>
                  <SimpleButton
                    onClick={() => setShowPreview(false)}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Kembali
                  </SimpleButton>
                </div>

                <LazyVideoPlayer
                  videoRef={videoRef}
                  videoUrl={videoUrl}
                  currentSubtitle={getCurrentSubtitle()}
                  playerProps={playerProps}
                />

                <LazySubtitleList
                  subtitles={subtitles}
                  currentTime={currentTime}
                  editingIndex={editingIndex}
                  editText={editText}
                  setEditText={setEditText}
                  onEdit={handleEditSubtitle}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                  onDownload={handleDownloadSrt}
                />
              </div>
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}