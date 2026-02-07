export type AudioType = "respiratory" | "cough" | "heartbeat";

interface AnalysisResult {
  prediction: string;
  confidence: number;
  details: string;
}

const predictions: Record<AudioType, { positive: string[]; negative: string[] }> = {
  respiratory: {
    positive: [
      "Normal breathing pattern detected",
      "Clear respiratory sounds observed",
      "Healthy lung function indicators",
      "Regular breath rhythm identified",
    ],
    negative: [
      "Slight irregularity in breathing pattern",
      "Minor wheeze detected - consider monitoring",
      "Possible congestion indicators present",
      "Irregular breath rhythm noted",
    ],
  },
  cough: {
    positive: [
      "Dry cough pattern - likely minor irritation",
      "Normal cough reflex detected",
      "Mild cough characteristics observed",
      "Typical seasonal cough pattern",
    ],
    negative: [
      "Congested cough characteristics detected",
      "Persistent cough pattern identified",
      "Wet cough indicators present",
      "Productive cough pattern noted",
    ],
  },
  heartbeat: {
    positive: [
      "Regular heart rhythm detected",
      "Normal heartbeat pattern observed",
      "Healthy cardiac rhythm indicators",
      "Steady heart rate confirmed",
    ],
    negative: [
      "Minor rhythm variation noted",
      "Slight irregularity in heartbeat",
      "Elevated heart rate detected",
      "Consider monitoring heart rhythm",
    ],
  },
};

const details: Record<AudioType, string[]> = {
  respiratory: [
    "Analysis based on frequency patterns and amplitude variations in the audio recording.",
    "Evaluated breathing rate, depth, and consistency across the sample duration.",
    "Compared against baseline respiratory patterns from our training dataset.",
  ],
  cough: [
    "Analyzed cough frequency, duration, and acoustic characteristics.",
    "Evaluated moisture content and force indicators in the cough pattern.",
    "Pattern matched against common cough type classifications.",
  ],
  heartbeat: [
    "Analyzed beat-to-beat interval consistency and rhythm regularity.",
    "Evaluated heart rate variability and baseline measurements.",
    "Compared against normal sinus rhythm patterns.",
  ],
};

export async function performAnalysis(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    return {
      prediction: data.diagnosis,
      confidence: parseFloat(data.confidence),
      details: `File: ${data.filename}`,
    };
  } catch (error) {
    console.error("Error sending file to backend:", error);
    return {
      prediction: "Error processing audio",
      confidence: 0,
      details: "Check server or try again.",
    };
  }
}


export function getAudioTypeLabel(type: AudioType): string {
  const labels: Record<AudioType, string> = {
    respiratory: "Respiratory Analysis",
    cough: "Bowel Sounds Analysis",
    heartbeat: "Heartbeat Analysis",
  };
  return labels[type];
}

export type AudioTypeIcon = {
  kind: "emoji" | "image";
  value: string;
};

export function getAudioTypeIcon(type: AudioType): AudioTypeIcon {
  const icons: Record<AudioType, AudioTypeIcon> = {
    respiratory: { kind: "emoji", value: "🫁" },
    cough: { kind: "image", value: "/images/intestein.png" },
    heartbeat: { kind: "emoji", value: "❤️" },
  };
  return icons[type];
}
