"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface MeditationPracticeProps {
  locale: string;
  duration: number;
}

export function MeditationPractice({
  locale,
  duration,
}: MeditationPracticeProps) {
  const t = useTranslation(locale);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Select the appropriate audio track based on duration
  const getAudioTrack = () => {
    // In a real implementation, you would have different audio files for each duration
    // For now, we'll use placeholder URLs
    switch (duration) {
      case 7:
        return "/audio/meditation-7min.mp3";
      case 12:
        return "/audio/meditation-12min.mp3";
      case 15:
        return "/audio/meditation-15min.mp3";
      case 18:
        return "/audio/meditation-18min.mp3";
      case 21:
        return "/audio/meditation-21min.mp3";
      default:
        return "/audio/meditation-7min.mp3";
    }
  };

  useEffect(() => {
    // Initialize audio
    if (!audioRef.current) {
      audioRef.current = new Audio(getAudioTrack());
      audioRef.current.loop = false;
      audioRef.current.volume = volume;
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md bg-card rounded-lg p-6 shadow-sm">
        <div className="text-xl font-medium mb-4 text-center">
          {t("practices.meditation.title")}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <Slider
            value={[volume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0] / 100)}
            aria-label="Volume"
          />
        </div>

        <div className="text-center text-muted-foreground text-sm">
          {locale === "en" ? (
            <p>
              Find a comfortable position, close your eyes, and focus on your
              breath.
            </p>
          ) : (
            <p>
              Encontre uma posição confortável, feche os olhos e concentre-se na
              sua respiração.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
