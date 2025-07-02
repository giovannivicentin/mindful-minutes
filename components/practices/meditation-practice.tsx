"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";

interface MeditationPracticeProps {
  locale: string;
  duration: number;
}

export function MeditationPractice({
  locale,
  duration,
}: MeditationPracticeProps) {
  const t = useTranslation(locale);
  const { addSession } = useStore();
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isComplete, setIsComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Timer logic
  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setIsComplete(true);
            // Record session completion
            addSession({
              practice: "meditation",
              duration: duration,
              date: new Date().toISOString(),
            });
            if (audioRef.current) {
              audioRef.current.pause();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeRemaining, duration, addSession]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
      setIsPlaying(true);
    }
  };

  const resetPractice = () => {
    setIsPlaying(false);
    setIsComplete(false);
    setTimeRemaining(duration * 60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md bg-card rounded-lg p-6 shadow-sm">
        <div className="text-xl font-medium mb-4 text-center">
          {t("practices.meditation.title")}
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold mb-2">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-muted-foreground">
            {isComplete
              ? t("timer.complete")
              : `${Math.ceil(timeRemaining / 60)} ${t("timer.minutes")} ${t(
                  "timer.remaining"
                )}`}
          </div>
        </div>

        {/* Audio Controls */}
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

        {/* Play Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={togglePlayPause} size="lg">
            {isPlaying ? (
              <Pause className="h-5 w-5 mr-2" />
            ) : (
              <Play className="h-5 w-5 mr-2" />
            )}
            {isPlaying ? t("timer.pause") : t("timer.start")}
          </Button>
          <Button variant="outline" onClick={resetPractice}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t("timer.reset")}
          </Button>
        </div>

        {/* Instructions */}
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

        {/* Completion Message */}
        {isComplete && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-green-800 dark:text-green-200 font-medium">
              {locale === "en"
                ? "Meditation complete! Well done."
                : "Meditação completa! Muito bem."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
