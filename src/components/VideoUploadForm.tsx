import React, { useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LANGUAGES }  from "@/constants/languages";
import { Button } from "@/components/ui/button";
import { FileUploadZone } from "@/components/FileUploadZone";
import { VideoPlayer } from "@/components/VideoPlayer";
import { parseSRT, generateSRT } from "@/utils/fileUtils";
import { SubtitleList } from "@/components/SubtitleList";
import { useVideoUpload, useSubtitleEditor, useVideoPlayer, useVideoProcessing } from "@/hooks/use-vidio";


export default function VideoUploadForm() {
  const { toast } = useToast();
  const videoRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  const uploadProps = useVideoUpload();
  const { isProcessing, error, processVideo } = useVideoProcessing();
  const playerProps = useVideoPlayer(videoRef);
  const editorProps = useSubtitleEditor([]);

  const handleProcess = async () => {
    const data = await processVideo(uploadProps.videoFile, selectedLanguage);
    if (data && data.translated_srt) {
      const parsed = parseSRT(data.translated_srt);
      editorProps.setSubtitles(parsed);
      setShowPreview(true);
    }
  };

  const handleDownloadSrt = () => {
    const srtText = generateSRT(editorProps.subtitles);
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

  const getCurrentSubtitle = () => {
    return editorProps.subtitles.find(
      sub => playerProps.currentTime >= sub.startSeconds && playerProps.currentTime <= sub.endSeconds
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {!showPreview ? (
            <>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Pilih Video
                </label>
                <FileUploadZone
                  videoFile={uploadProps.videoFile}
                  dragActive={uploadProps.dragActive}
                  onFileChange={uploadProps.handleFileChange}
                  onDrag={uploadProps.handleDrag}
                  onDrop={uploadProps.handleDrop}
                />
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
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full px-4 py-3 sm:py-4 bg-blue-600 dark:bg-blue-500 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span>Proses Video</span>
                  </>
                )}
              </button>

              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm sm:text-base p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {error}
                </div>
              )}
            </>
          ) : (
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

              <VideoPlayer
                videoRef={videoRef}
                videoUrl={uploadProps.videoUrl}
                currentSubtitle={getCurrentSubtitle()}
                playerProps={playerProps}
              />

              <SubtitleList
                subtitles={editorProps.subtitles}
                currentTime={playerProps.currentTime}
                editingIndex={editorProps.editingIndex}
                editText={editorProps.editText}
                setEditText={editorProps.setEditText}
                onEdit={editorProps.handleEditSubtitle}
                onSave={editorProps.handleSaveEdit}
                onCancel={editorProps.handleCancelEdit}
                onDownload={handleDownloadSrt}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}