import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { type AudioType, getAudioTypeLabel, getAudioTypeIcon } from "@/lib/mockAnalysis";

interface AudioTypeSelectorProps {
  selectedType: AudioType;
  onSelect: (type: AudioType) => void;
  disabled?: boolean;
}

const audioTypes: AudioType[] = ["respiratory", "heartbeat", "cough"];

export function AudioTypeSelector({
  selectedType,
  onSelect,
  disabled,
}: AudioTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {audioTypes.map((type) => (
        <motion.div key={type} whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.98 }}>
          <Card
            className={`audio-type-button cursor-pointer transition-all ${
              selectedType === type
                ? "border-primary ring-2 ring-primary/20"
                : "hover:border-primary/50"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !disabled && onSelect(type)}
          >
            <CardContent className="flex flex-col items-center gap-2 p-4">
              <span className="text-3xl">
                {(() => {
                  const icon = getAudioTypeIcon(type);
                  if (icon.kind === "image") {
                    return (
                      <img
                        src={icon.value}
                        alt="Bowel sounds"
                        className="h-8 w-8"
                      />
                    );
                  }
                  return icon.value;
                })()}
              </span>
              <span className="text-sm font-medium text-center">
                {getAudioTypeLabel(type)}
              </span>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
