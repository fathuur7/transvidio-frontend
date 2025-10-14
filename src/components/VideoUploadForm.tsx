import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, Play, Pause, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileVideo, CheckCircle2 } from "lucide-react";

const languages = [
  { code: "id", name: "Bahasa Indonesia" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
];

// Parse SRT content into subtitle objects
const parseSRT = (srtContent) => {
  if (!srtContent) return [];
  
  const blocks = srtContent.trim().split('\n\n');
  return blocks.map(block => {
    const lines = block.split('\n');
    if (lines.length < 3) return null;
    
    const index = parseInt(lines[0]);
    const timecode = lines[1];
    const text = lines.slice(2).join('\n');
    
    const [start, end] = timecode.split(' --> ');
    
    return {
      index,
      start,
      end,
      startSeconds: timeToSeconds(start),
      endSeconds: timeToSeconds(end),
      text
    };
  }).filter(Boolean);
};

// Convert SRT time format to seconds
const timeToSeconds = (time) => {
  const [hours, minutes, seconds] = time.split(':');
  const [secs, millis] = seconds.split(',');
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(secs) + parseInt(millis) / 1000;
};

// Convert seconds to SRT time format
const secondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
};

// Convert subtitle objects back to SRT format
const generateSRT = (subtitles) => {
  return subtitles.map(sub => 
    `${sub.index}\n${sub.start} --> ${sub.end}\n${sub.text}`
  ).join('\n\n');
};

export default function VideoUploadForm() {
  const { toast } = useToast();
  const videoRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [srtContent, setSrtContent] = useState(null);
  const [subtitles, setSubtitles] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (srtContent) {
      const parsed = parseSRT(srtContent);
      setSubtitles(parsed);
    }
  }, [srtContent]);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
      } else {
        toast({
          variant: "destructive",
          title: "Format File Salah",
          description: "File harus berupa video",
        });
      }
    }
  };

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
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    }
  };

  const handleProcess = async () => {
    setError("");
    setResults(null);
    setSrtContent(null);
    setShowPreview(false);

    if (!selectedLanguage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Pilih bahasa tujuan terlebih dahulu",
      });
      return;
    }

    if (!videoFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Pilih video terlebih dahulu",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("video_file", videoFile);
      formData.append("target_language", selectedLanguage);

      const response = await fetch("http://localhost:8000/translate-video/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.detail || "Gagal memproses video";
        setError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      setResults(data);
      
      if (data.translated_srt) {
        setSrtContent(data.translated_srt);
        setShowPreview(true);
      }
      
      toast({
        title: "Berhasil",
        description: "Video berhasil diproses. Silakan preview dan edit subtitle.",
      });
    } catch (err) {
      const errorMsg = err.message || "Terjadi kesalahan saat memproses video";
      setError(errorMsg);
      toast({
        title: "Error Sistem",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDownloadSrt = () => {
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
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const getCurrentSubtitle = () => {
    return subtitles.find(
      sub => currentTime >= sub.startSeconds && currentTime <= sub.endSeconds
    );
  };

  const handleEditSubtitle = (index, text) => {
    setEditingIndex(index);
    setEditText(text);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const newSubtitles = [...subtitles];
      newSubtitles[editingIndex].text = editText;
      setSubtitles(newSubtitles);
      setEditingIndex(null);
      setEditText("");
      
      toast({
        title: "Berhasil",
        description: "Subtitle berhasil diupdate",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const currentSubtitle = getCurrentSubtitle();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Upload Section */}
          {!showPreview && (
            <>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Pilih Video
                </label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl transition-all ${
                    dragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
                  }`}
                >
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {!videoFile ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 mb-1 text-center">
                        Drag & drop video atau klik untuk browse
                      </p>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center">
                        MP4, MOV, AVI, WebM (Max 500MB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 sm:space-x-4 py-4 sm:py-6 px-4 sm:px-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <FileVideo className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300 truncate">
                          {videoFile.name}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          {formatFileSize(videoFile.size)}
                        </p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="target-language" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Bahasa Tujuan
                </label>
                <select
                  id="target-language"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-3 sm:py-4 text-sm sm:text-base border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Pilih bahasa terjemahan</option>
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {!isProcessing ? (
                <button
                  onClick={handleProcess}
                  className="w-full px-4 py-3 sm:py-4 bg-blue-600 dark:bg-blue-500 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Proses Video</span>
                </button>
              ) : (
                <button
                  className="w-full px-4 py-3 sm:py-4 bg-blue-600 dark:bg-blue-500 text-white text-sm sm:text-base font-semibold rounded-xl cursor-not-allowed flex items-center justify-center space-x-2"
                  disabled
                >
                  <span className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Memproses...</span>
                </button>
              )}

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm sm:text-base p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {error}
                </div>
              )}
            </>
          )}

          {/* Preview & Edit Section */}
          {showPreview && videoUrl && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  Preview & Edit Subtitle
                </h2>
                <Button
                  onClick={() => setShowPreview(false)}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </div>

              {/* Video Player */}
              <div className="relative bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Subtitle Overlay */}
                {currentSubtitle && (
                  <div className="absolute bottom-20 left-0 right-0 flex justify-center px-4">
                    <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-center max-w-3xl">
                      {currentSubtitle.text}
                    </div>
                  </div>
                )}

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div 
                    className="w-full h-1 bg-gray-600 rounded-full mb-3 cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-white">
                    <button
                      onClick={togglePlayPause}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                    
                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtitle List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Daftar Subtitle
                  </h3>
                  <Button onClick={handleDownloadSrt} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download SRT
                  </Button>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  {subtitles.map((sub, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border transition ${
                        currentTime >= sub.startSeconds && currentTime <= sub.endSeconds
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {editingIndex === index ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button onClick={handleSaveEdit} size="sm" className="flex-1">
                              <Save className="h-4 w-4 mr-1" />
                              Simpan
                            </Button>
                            <Button onClick={handleCancelEdit} size="sm" variant="outline" className="flex-1">
                              <X className="h-4 w-4 mr-1" />
                              Batal
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                              {sub.start} → {sub.end}
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              {sub.text}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleEditSubtitle(index, sub.text)}
                            size="sm"
                            variant="ghost"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}