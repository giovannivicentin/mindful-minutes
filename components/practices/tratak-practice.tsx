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
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";

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
  const { theme } = useTheme();
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const tratakContainerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Customization states
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

  useEffect(() => {
    const checkAudioAvailability = async () => {
      try {
        const response = await fetch("/audio/meditation-bell.mp3", {
          method: "HEAD",
        });
        setAudioAvailable(response.ok);
        if (!response.ok) console.warn("Audio not available.");
      } catch {
        console.warn("Audio check failed.");
        setAudioAvailable(false);
      }
    };
    checkAudioAvailability();
  }, []);

  const toggleFullscreen = () => {
    if (!tratakContainerRef.current) return;
    if (!isFullscreen) {
      try {
        tratakContainerRef.current.requestFullscreen?.() ||
          (tratakContainerRef.current as any).webkitRequestFullscreen?.() ||
          (tratakContainerRef.current as any).msRequestFullscreen?.();
      } catch (err) {
        toast({
          title: t("practices.tratak.fullscreenError"),
          description: t("practices.tratak.fullscreenErrorDesc"),
          variant: "destructive",
        });
      }
    } else {
      try {
        document.exitFullscreen?.() ||
          (document as any).webkitExitFullscreen?.() ||
          (document as any).msExitFullscreen?.();
      } catch {
        /* ignore */
      }
    }
  };

  useEffect(() => {
    const onFsChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    document.addEventListener("mozfullscreenchange", onFsChange);
    document.addEventListener("MSFullscreenChange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
      document.removeEventListener("mozfullscreenchange", onFsChange);
      document.removeEventListener("MSFullscreenChange", onFsChange);
    };
  }, []);

  // Start/end bells
  useEffect(() => {
    if (!isPaused && !isMuted && audioAvailable) {
      const playBell = async () => {
        try {
          const bell = new Audio("/audio/meditation-bell.mp3");
          bell.volume = 0.5;
          await bell.play();
        } catch {
          setAudioAvailable(false);
        }
      };
      playBell();
      if (duration) {
        const endTimer = setTimeout(() => {
          playBell();
        }, duration * 60 * 1000 - 1000);
        return () => clearTimeout(endTimer);
      }
    }
  }, [isPaused, isMuted, duration, audioAvailable]);

  // Ambient loop
  useEffect(() => {
    if (!audioAvailable) return;
    const setup = async () => {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio("/audio/ambient-meditation.mp3");
          audioRef.current.loop = true;
          audioRef.current.volume = 0.2;
        }
        if (!isPaused && !isMuted) {
          await audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      } catch {
        setAudioAvailable(false);
      }
    };
    setup();
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [isPaused, isMuted, audioAvailable]);

  const toggleMute = () => setIsMuted((m) => !m);
  const toggleControls = () => setShowControls((s) => !s);

  const getResponsiveCircleSize = () => {
    const max = Math.min(window.innerWidth * 0.8, 500);
    return (circleSize / 300) * max;
  };
  const getResponsivePointSize = () => {
    const base = getResponsiveCircleSize();
    return (pointSize / 10) * (base / 10);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-8">
      <div
        ref={tratakContainerRef}
        className="relative flex flex-col items-center justify-center w-full rounded-lg overflow-hidden transition-all duration-1000"
        style={{
          backgroundColor,
          minHeight: "60vh",
          filter: `brightness(${brightness}%)`,
        }}
      >
        <motion.div
          className="rounded-full flex items-center justify-center"
          style={{
            border: `2px solid ${circleColor}`,
            width: getResponsiveCircleSize(),
            height: getResponsiveCircleSize(),
            backgroundColor: "transparent",
          }}
          animate={
            showPulsation && !isPaused
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
            repeat: showPulsation ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="rounded-full"
            style={{
              backgroundColor: pointColor,
              width: getResponsivePointSize(),
              height: getResponsivePointSize(),
            }}
            animate={
              showPulsation && !isPaused
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
              repeat: showPulsation ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        </motion.div>

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
                  aria-label={
                    isMuted
                      ? t("practices.tratak.unmute")
                      : t("practices.tratak.mute")
                  }
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
                    ? t("practices.tratak.exitFullscreen")
                    : t("practices.tratak.fullscreen")
                }
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm"
                    aria-label={t("practices.tratak.settings")}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {t("practices.tratak.customize")}
                      </h4>
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
                      <Label>{t("practices.tratak.circleSize")}</Label>
                      <Slider
                        value={[circleSize]}
                        min={100}
                        max={300}
                        step={10}
                        onValueChange={(v) => setCircleSize(v[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t("practices.tratak.circleColor")}</Label>
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
                            aria-label={`${t(
                              "practices.tratak.selectColor"
                            )} ${color}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t("practices.tratak.pointSize")}</Label>
                      <Slider
                        value={[pointSize]}
                        min={2}
                        max={20}
                        step={1}
                        onValueChange={(v) => setPointSize(v[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>{t("practices.tratak.pointColor")}</Label>
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
                            aria-label={`${t(
                              "practices.tratak.selectColor"
                            )} ${color}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t("practices.tratak.background")}</Label>
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
                              ["#FFFFFF", "#F5F5F5", "#FFFFEE"].includes(color)
                                ? "border border-gray-200"
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setBackgroundColor(color)}
                            aria-label={`${t(
                              "practices.tratak.selectColor"
                            )} ${color}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t("practices.tratak.brightness")}</Label>
                      <Slider
                        value={[brightness]}
                        min={50}
                        max={150}
                        step={5}
                        onValueChange={(v) => setBrightness(v[0])}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="pulsation"
                        checked={showPulsation}
                        onCheckedChange={setShowPulsation}
                      />
                      <Label htmlFor="pulsation">
                        {t("practices.tratak.pulsation")}
                      </Label>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </motion.div>
          )}
        </AnimatePresence>

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
                aria-label={t("practices.tratak.showControls")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center max-w-md mx-auto px-4 bg-card rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-medium mb-2">
          {t("practices.tratak.instructions")}
        </h3>
        <p className="text-muted-foreground">
          {t("practices.tratak.instructionsText")}
        </p>
      </div>
    </div>
  );
}
