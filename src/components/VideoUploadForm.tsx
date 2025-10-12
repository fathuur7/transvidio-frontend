import { useState } from "react";
import { Upload, Link2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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

export const VideoUploadForm = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [activeTab, setActiveTab] = useState("upload");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video/")) {
        setVideoFile(file);
        toast.success(`Video "${file.name}" dipilih`);
      } else {
        toast.error("File harus berupa video");
      }
    }
  };

  const handleProcess = () => {
    if (!selectedLanguage) {
      toast.error("Pilih bahasa tujuan terlebih dahulu");
      return;
    }

    if (activeTab === "upload" && !videoFile) {
      toast.error("Pilih video terlebih dahulu");
      return;
    }

    if (activeTab === "youtube" && !youtubeUrl) {
      toast.error("Masukkan URL YouTube terlebih dahulu");
      return;
    }

    // Simulate processing
    toast.success("Video sedang diproses...");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card border-border/50 shadow-glow animate-fade-in">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Terjemahkan Video Anda
        </CardTitle>
        <CardDescription className="text-base">
          Upload video atau masukkan link YouTube untuk memulai
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Video</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center space-x-2">
              <Link2 className="h-4 w-4" />
              <span>Link YouTube</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="video-upload">Pilih Video</Label>
              <div className="relative">
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              {videoFile && (
                <p className="text-sm text-muted-foreground flex items-center space-x-2">
                  <Play className="h-4 w-4" />
                  <span>{videoFile.name}</span>
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="youtube-url">URL YouTube</Label>
              <Input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="transition-all focus:shadow-glow"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Language Selection */}
        <div className="space-y-2">
          <Label htmlFor="target-language">Bahasa Tujuan</Label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger id="target-language" className="w-full">
              <SelectValue placeholder="Pilih bahasa terjemahan" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Process Button */}
        <Button
          onClick={handleProcess}
          className="w-full bg-gradient-primary hover:opacity-90 transition-all transform hover:scale-105 shadow-glow"
          size="lg"
        >
          <Play className="mr-2 h-5 w-5" />
          Proses Video
        </Button>
      </CardContent>
    </Card>
  );
};
