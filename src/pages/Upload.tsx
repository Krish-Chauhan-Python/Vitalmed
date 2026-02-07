import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioUploader } from "@/components/upload/AudioUploader";
import { AudioTypeSelector } from "@/components/upload/AudioTypeSelector";
import { AnalysisResult } from "@/components/upload/AnalysisResult";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { PageNav } from "@/components/layout/PageNav";
import { supabase } from "@/integrations/supabase/client";
import { type AudioType } from "@/lib/mockAnalysis";

// --- Real Analysis Function (FastAPI integration) ---
async function performAnalysis(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    const data = await response.json();

    return {
      prediction: data.diagnosis,
      confidence: parseFloat(data.confidence),
      details: `File: ${data.filename}`,
    };
  } catch (error) {
    console.error("Error sending file to backend:", error);
    throw error;
  }
}

interface AnalysisData {
  prediction: string;
  confidence: number;
  details: string;
}

export default function Upload() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioType, setAudioType] = useState<AudioType>("respiratory");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);

  const uploadGradient =
    audioType === "respiratory"
      ? "linear-gradient(135deg, rgba(0, 150, 255, 0.45), rgba(0, 185, 168, 0.2))"
      : audioType === "heartbeat"
      ? "linear-gradient(135deg, rgba(255, 52, 85, 0.5), rgba(255, 140, 160, 0.25))"
      : "linear-gradient(135deg, rgba(210, 163, 118, 0.5), rgba(241, 210, 178, 0.25))";

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
  };

  // Clear file + result
  const handleClear = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
  };

  // Perform analysis via FastAPI
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const result = await performAnalysis(selectedFile);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Your audio has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save both audio file + result to Supabase
  const handleSave = async () => {
    if (!analysisResult || !selectedFile || !user) return;

    setIsSaving(true);
    try {
      const filePath = `${user.id}/${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("audio-uploads")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("analysis_history").insert({
        user_id: user.id,
        filename: selectedFile.name,
        audio_type: audioType,
        prediction: analysisResult.prediction,
        confidence: analysisResult.confidence,
        file_path: filePath,
      });

      if (dbError) throw dbError;

      toast({
        title: "Saved Successfully",
        description: "Your analysis has been saved to history.",
      });

      handleClear();
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-layout upload-theme" style={{ background: uploadGradient }}>
      <PageNav
        title="Upload"
        items={[
          { href: "/upload#overview", label: "Overview" },
          { href: "/upload#analysis", label: "Analysis" },
          { href: "/upload#results", label: "Results" },
        ]}
      />
      <div className="page-content">
        <div className="container py-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
        {/* Header */}
        <section id="overview" className="text-center">
          <h1 className="text-3xl font-bold mb-2">Audio Analysis</h1>
          <p className="text-muted-foreground">
            Upload an audio file and select the type of analysis
          </p>
        </section>

        {/* Analysis Section */}
        {!analysisResult ? (
          <>
            {/* Type Selector */}
            <section id="analysis" className="space-y-3">
              <label className="text-sm font-medium">Select Analysis Type</label>
              <AudioTypeSelector
                selectedType={audioType}
                onSelect={setAudioType}
                disabled={isAnalyzing}
              />
            </section>

            {/* File Uploader */}
            <AudioUploader
              onFileSelect={handleFileSelect}
              isAnalyzing={isAnalyzing}
              selectedFile={selectedFile}
              onClear={handleClear}
            />

            {/* Always-visible Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4"
            >
              <Button
                onClick={handleAnalyze}
                className="w-full"
                size="lg"
                disabled={!selectedFile || isAnalyzing}
              >
                <Play className="mr-2 h-4 w-4" />
                {isAnalyzing
                  ? "Analyzing..."
                  : selectedFile
                  ? "Start Analysis"
                  : "Upload a File First"}
              </Button>
            </motion.div>
          </>
        ) : (
          <section id="results">
          <AnalysisResult
            audioType={audioType}
            prediction={analysisResult.prediction}
            confidence={analysisResult.confidence}
            details={analysisResult.details}
            filename={selectedFile?.name || ""}
            onSave={handleSave}
            onReset={handleClear}
            isSaving={isSaving}
          />
          </section>
        )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
