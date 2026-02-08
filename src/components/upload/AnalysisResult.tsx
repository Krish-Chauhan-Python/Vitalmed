import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Save, RefreshCw } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { type AudioType, getAudioTypeLabel, getAudioTypeIcon } from "@/lib/mockAnalysis";

interface AnalysisResultProps {
  audioType: AudioType;
  prediction: string;
  confidence: number;
  details: string;
  filename: string;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

export function AnalysisResult({
  audioType,
  prediction,
  confidence,
  details,
  filename,
  onSave,
  onReset,
  isSaving,
}: AnalysisResultProps) {
  const isPositive = !prediction.toLowerCase().includes("irregularity") &&
    !prediction.toLowerCase().includes("minor") &&
    !prediction.toLowerCase().includes("congested") &&
    !prediction.toLowerCase().includes("elevated");

  const icon = getAudioTypeIcon(audioType);
  const iconNode = icon.kind === "image" ? (
    <img src={icon.value} alt="Analysis type" className="h-10 w-10" />
  ) : (
    icon.value
  );

  const getConfidenceColor = (conf: number): string => {
    if (conf >= 90) return "text-green-600 dark:text-green-400";
    if (conf >= 80) return "text-blue-600 dark:text-blue-400";
    if (conf >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <div className={`h-1 ${isPositive ? "bg-green-500" : "bg-yellow-500"}`} />
        
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{iconNode}</span>
            <div>
              <CardTitle className="text-lg">{getAudioTypeLabel(audioType)}</CardTitle>
              <p className="text-sm text-muted-foreground">{filename}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Prediction Result */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            {isPositive ? (
              <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">{prediction}</p>
              <p className="text-sm text-muted-foreground mt-1">{details}</p>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Health score</span>
              <span className={`text-sm font-bold ${getConfidenceColor(confidence)}`}>
                {confidence.toFixed(1)}%
              </span>
            </div>
            <Progress value={confidence} className="h-2" />
          </div>

        </CardContent>

        <CardFooter className="gap-2">
          <Button onClick={onSave} disabled={isSaving} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save to History"}
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
