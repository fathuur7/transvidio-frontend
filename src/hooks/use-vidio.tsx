import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const useVideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (file) => {
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    } else {
      toast({
        variant: "destructive",
        title: "Format File Salah",
        description: "File harus berupa video",
      });
    }
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(type === "enter" || type === "over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  return {
    videoFile,
    videoUrl,
    dragActive,
    handleFileChange,
    handleDrag,
    handleDrop,
    setVideoFile
  };
};

const useSubtitleEditor = (initialSubtitles = []) => {
  const [subtitles, setSubtitles] = useState(initialSubtitles);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const { toast } = useToast();

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

  return {
    subtitles,
    setSubtitles,
    editingIndex,
    editText,
    setEditText,
    handleEditSubtitle,
    handleSaveEdit,
    handleCancelEdit
  };
};

const useVideoPlayer = (videoRef) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return {
    currentTime,
    duration,
    isPlaying,
    setIsPlaying,
    togglePlayPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek
  };
};

const useVideoProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const processVideo = async (videoFile, targetLanguage) => {
    setError("");
    setResults(null);

    if (!targetLanguage) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Pilih bahasa tujuan terlebih dahulu",
      });
      return null;
    }

    if (!videoFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Pilih video terlebih dahulu",
      });
      return null;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("video_file", videoFile);
      formData.append("target_language", targetLanguage);

      const response = await fetch("http://srv1068768.hstgr.cloud:8000/translate-video/", {
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
        return null;
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Berhasil",
        description: "Video berhasil diproses. Silakan preview dan edit subtitle.",
      });

      return data;
    } catch (err) {
      const errorMsg = err.message || "Terjadi kesalahan saat memproses video";
      setError(errorMsg);
      toast({
        title: "Error Sistem",
        description: errorMsg,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, error, results, processVideo };
};

export { useVideoUpload, useSubtitleEditor, useVideoPlayer, useVideoProcessing };