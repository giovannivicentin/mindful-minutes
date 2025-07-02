"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { useStore } from "@/lib/store";

interface TratakPracticeProps {
  locale: string;
  duration: number;
  isPaused?: boolean;
}

export function TratakPractice({
  locale,
  duration,
  isPaused = false,
}: TratakPracticeProps) {
  const t = useTranslation(locale);
  const { addSession } = useStore();
  // Get the current theme
  const { theme } = useTheme();
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isComplete, setIsComplete] = useState(false);
  const tratakContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Customization states with theme-aware defaults
  const [circleSize, setCircleSize] = useState(200);
  const [circleColor, setCircleColor] = useState(
    theme === "dark" ? "#FFFFFF" : "#000000"
  );
  const [pointSize, setPointSize] = useState(8);
  const [pointColor, setPointColor] = useState(
    theme === "dark" ? "#FFFFFF" : "#000000"
  );
  const [backgroundColor, setBackgroundColor] = useState(
    theme === "dark" ? "#000000" : "#FFFFFF"
  );
  const [showPulsation, setShowPulsation] = useState(false);
  const [brightness, setBrightness] = useState(100);

  // Update colors when theme changes
  useEffect(() => {
    if (theme === "dark") {
      setCircleColor("#FFFFFF");
      setPointColor("#FFFFFF");
      setBackgroundColor("#000000");
    } else {
      setCircleColor("#000000");
      setPointColor("#000000");
      setBackgroundColor("#FFFFFF");
    }
  }, [theme]);

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
              practice: "tratak",
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

  // Check if audio files are available
  useEffect(() => {
    const checkAudioAvailability = async () => {
      try {
        // Try to fetch the audio file to check if it exists
        const response = await fetch("/audio/meditation-bell.mp3", {
          method: "HEAD",
        });
        setAudioAvailable(response.ok);

        if (!response.ok) {
          console.warn(
            "Audio files not available. Sound features will be disabled."
          );
        }
      } catch (error) {
        console.warn("Error checking audio availability:", error);
        setAudioAvailable(false);
      }
    };

    checkAudioAvailability();
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!tratakContainerRef.current) return;

    if (!isFullscreen) {
      try {
        if (tratakContainerRef.current.requestFullscreen) {
          tratakContainerRef.current.requestFullscreen();
        } else if (
          (tratakContainerRef.current as any).webkitRequestFullscreen
        ) {
          /* Safari */
          (tratakContainerRef.current as any).webkitRequestFullscreen();
        } else if ((tratakContainerRef.current as any).msRequestFullscreen) {
          /* IE11 */
          (tratakContainerRef.current as any).msRequestFullscreen();
        }
      } catch (error) {
        console.error("Error entering fullscreen:", error);
        toast({
          title: t("tratak.fullscreenError"),
          description: t("tratak.fullscreenErrorDesc"),
          variant: "destructive",
        });
      }
    } else {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          /* Safari */
          (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          /* IE11 */
          (document as any).msExitFullscreen();
        }
      } catch (error) {
        console.error("Error exiting fullscreen:", error);
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);

      // Close any open popovers when entering fullscreen mode
      const popoverTrigger = document.querySelector('[data-state="open"]');
      if (popoverTrigger && document.fullscreenElement) {
        // @ts-ignore
        popoverTrigger.click();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  // Audio cue for beginning and end of session
  useEffect(() => {
    if (isPlaying && !isMuted && audioAvailable) {
      // Play start sound when session begins
      const playStartSound = async () => {
        try {
          const startSound = new Audio("/audio/meditation-bell.mp3");
          startSound.volume = 0.5;
          await startSound.play();
        } catch (error) {
          console.warn("Start sound playback failed:", error);
          setAudioAvailable(false);
        }
      };

      playStartSound();
    }
  }, [isPlaying, isMuted, audioAvailable]);

  // Handle ambient sound
  useEffect(() => {
    if (!audioAvailable) return;

    const setupAmbientSound = async () => {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio("/audio/ambient-meditation.mp3");
          audioRef.current.loop = true;
          audioRef.current.volume = 0.2;
        }

        if (isPlaying && !isMuted) {
          try {
            await audioRef.current.play();
          } catch (error) {
            console.warn("Ambient sound playback failed:", error);
            setAudioAvailable(false);
          }
        } else if (audioRef.current) {
          audioRef.current.pause();
        }
      } catch (error) {
        console.warn("Error setting up ambient sound:", error);
        setAudioAvailable(false);
      }
    };

    setupAmbientSound();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isPlaying, isMuted, audioAvailable]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
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

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate responsive sizes
  const getResponsiveCircleSize = () => {
    // Base the maximum size on viewport width
    const maxSize = Math.min(window.innerWidth * 0.8, 500);
    return (circleSize / 300) * maxSize;
  };

  const getResponsivePointSize = () => {
    const baseCircleSize = getResponsiveCircleSize();
    return (pointSize / 10) * (baseCircleSize / 10);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-8">
      {/* Timer Display */}
      <div className="text-center">
        <div className="text-3xl font-bold mb-2">
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

      {/* Tratak practice area */}
      <div
        ref={tratakContainerRef}
        className="relative flex flex-col items-center justify-center w-full transition-all duration-1000 rounded-lg overflow-hidden"
        style={{
          backgroundColor,
          minHeight: "60vh",
          filter: `brightness(${brightness}%)`,
        }}
      >
        {/* Circle */}
        <motion.div
          className="rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "transparent",
            border: `2px solid ${circleColor}`,
            width: getResponsiveCircleSize(),
            height: getResponsiveCircleSize(),
          }}
          animate={
            showPulsation && isPlaying
              ? {
                  boxShadow: [
                    `0 0 10px 0px ${circleColor}40`,
                    `0 0 20px 2px ${circleColor}30`,
                    `0 0 10px 0px ${circleColor}40`,
                  ],
                }
              : { boxShadow: "none" }
          }
          transition={{
            duration: 4,
            repeat: showPulsation ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          {/* Central point */}
          <motion.div
            className="rounded-full"
            style={{
              backgroundColor: pointColor,
              width: getResponsivePointSize(),
              height: getResponsivePointSize(),
            }}
            animate={
              showPulsation && isPlaying
                ? {
                    boxShadow: [
                      `0 0 5px 0px ${pointColor}80`,
                      `0 0 8px 1px ${pointColor}60`,
                      `0 0 5px 0px ${pointColor}80`,
                    ],
                  }
                : { boxShadow: "none" }
            }
            transition={{
              duration: 2,
              repeat: showPulsation ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Floating controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 right-4 flex gap-2"
            >
              {audioAvailable && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className="bg-background/80 backdrop-blur-sm"
                  aria-label={isMuted ? t("tratak.unmute") : t("tratak.mute")}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                className="bg-background/80 backdrop-blur-sm"
                aria-label={
                  isFullscreen
                    ? t("tratak.exitFullscreen")
                    : t("tratak.fullscreen")
                }
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>

              {/* Only show settings button when NOT in fullscreen mode */}
              {!isFullscreen && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-background/80 backdrop-blur-sm"
                      aria-label={t("tratak.settings")}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{t("tratak.customize")}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowControls(false)}
                          aria-label={t("common.close")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>{t("tratak.circleSize")}</Label>
                        <Slider
                          value={[circleSize]}
                          min={100}
                          max={300}
                          step={10}
                          onValueChange={(value) => setCircleSize(value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{t("tratak.circleColor")}</Label>
                        <div className="flex gap-2">
                          {[
                            "#000000",
                            "#FFFFFF",
                            "#00B4B4",
                            "#FFD700",
                            "#FF5555",
                            "#5555FF",
                          ].map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full ${
                                circleColor === color
                                  ? "ring-2 ring-offset-2 ring-primary"
                                  : ""
                              } ${
                                color === "#FFFFFF"
                                  ? "border border-gray-200"
                                  : ""
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setCircleColor(color)}
                              aria-label={`${t("tratak.selectColor")} ${color}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t("tratak.pointSize")}</Label>
                        <Slider
                          value={[pointSize]}
                          min={2}
                          max={20}
                          step={1}
                          onValueChange={(value) => setPointSize(value[0])}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{t("tratak.pointColor")}</Label>
                        <div className="flex gap-2">
                          {[
                            "#000000",
                            "#FFFFFF",
                            "#00B4B4",
                            "#FFD700",
                            "#FF5555",
                            "#5555FF",
                          ].map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full ${
                                pointColor === color
                                  ? "ring-2 ring-offset-2 ring-primary"
                                  : ""
                              } ${
                                color === "#FFFFFF"
                                  ? "border border-gray-200"
                                  : ""
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setPointColor(color)}
                              aria-label={`${t("tratak.selectColor")} ${color}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t("tratak.background")}</Label>
                        <div className="flex gap-2">
                          {[
                            "#FFFFFF",
                            "#000000",
                            "#F5F5F5",
                            "#111111",
                            "#001122",
                            "#FFFFEE",
                          ].map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full ${
                                backgroundColor === color
                                  ? "ring-2 ring-offset-2 ring-primary"
                                  : ""
                              } ${
                                color === "#FFFFFF" ||
                                color === "#F5F5F5" ||
                                color === "#FFFFEE"
                                  ? "border border-gray-200"
                                  : ""
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setBackgroundColor(color)}
                              aria-label={`${t("tratak.selectColor")} ${color}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{t("tratak.brightness")}</Label>
                        <Slider
                          value={[brightness]}
                          min={50}
                          max={150}
                          step={5}
                          onValueChange={(value) => setBrightness(value[0])}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="pulsation"
                          checked={showPulsation}
                          onCheckedChange={setShowPulsation}
                        />
                        <Label htmlFor="pulsation">
                          {t("tratak.pulsation")}
                        </Label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle controls button */}
        <AnimatePresence>
          {!showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 right-4"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={toggleControls}
                className="bg-background/20 backdrop-blur-sm"
                aria-label={t("tratak.showControls")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Practice Controls */}
      <div className="flex justify-center gap-4">
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

      {/* Instructions - moved below the practice area */}
      <div className="text-center max-w-md mx-auto px-4 bg-card rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-medium mb-2">{t("tratak.instructions")}</h3>
        <p className="text-muted-foreground">{t("tratak.instructionsText")}</p>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
          <p className="text-green-800 dark:text-green-200 font-medium">
            {locale === "en"
              ? "Tratak practice complete! Well done."
              : "Prática de Tratak completa! Muito bem."}
          </p>
        </div>
      )}
    </div>
  );
}
