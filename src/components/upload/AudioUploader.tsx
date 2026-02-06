import { useState, useCallback } from "react";
import { Upload, FileAudio, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface AudioUploaderProps {
  onFileSelect: (file: File) => void; // ✅ matches Upload.tsx
  isAnalyzing: boolean;
  selectedFile: File | null;
  onClear: () => void;
}

const ACCEPTED_TYPES = ["audio/wav"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export function AudioUploader({
  onFileSelect,
  isAnalyzing,
  selectedFile,
  onClear,
}: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .wav audio file",
        variant: "destructive",
      });
      return false;
    }
    if (file.size > MAX_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // ✅ This is where we actually notify Upload.tsx about the file
  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 50);

        onFileSelect(file); // ✅ Crucial: tells parent that file is ready
      }
    },
    [onFileSelect, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <AnimatePresence mode="wait">
          {!selectedFile ? (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <label
                htmlFor="audio-upload"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex flex-col items-center justify-center gap-4 p-8 md:p-12 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">Drop your audio file here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports only .wav files up to 10MB
                </p>
                <input
                  id="audio-upload"
                  type="file"
                  accept=".wav"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
            </motion.div>
          ) : (
            <motion.div
              key="file-preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileAudio className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                {!isAnalyzing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClear}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {isAnalyzing && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing audio...</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
