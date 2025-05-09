"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import { useStore } from "@/lib/store";

interface TimerSelectorProps {
  locale: string;
  onSelect: (minutes: number) => void;
}

export function TimerSelector({ locale, onSelect }: TimerSelectorProps) {
  const t = useTranslation(locale);
  const [customMinutes, setCustomMinutes] = useState<number>(10);
  const [customMode, setCustomMode] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const { lastSelectedTimer, setLastSelectedTimer } = useStore();

  // Initialize with the last selected timer or default to 7
  useEffect(() => {
    const initialValue = lastSelectedTimer?.toString() || "7";
    setSelectedDuration(initialValue);
    onSelect(Number.parseInt(initialValue, 10));
  }, [lastSelectedTimer, onSelect]);

  const handleSelect = (value: string) => {
    setSelectedDuration(value);

    if (value === "custom") {
      setCustomMode(true);
      return;
    }

    setCustomMode(false);
    const minutes = Number.parseInt(value, 10);
    setLastSelectedTimer(minutes);
    onSelect(minutes);
  };

  const handleCustomSubmit = () => {
    setLastSelectedTimer(customMinutes);
    onSelect(customMinutes);
    setCustomMode(false);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="timer-select">{t("timer.select")}</Label>
      {!customMode ? (
        <Select
          value={selectedDuration || undefined}
          onValueChange={handleSelect}
        >
          <SelectTrigger id="timer-select" className="w-full">
            <SelectValue placeholder={t("timer.select")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 {t("timer.minutes")}</SelectItem>
            <SelectItem value="12">12 {t("timer.minutes")}</SelectItem>
            <SelectItem value="15">15 {t("timer.minutes")}</SelectItem>
            <SelectItem value="18">18 {t("timer.minutes")}</SelectItem>
            <SelectItem value="21">21 {t("timer.minutes")}</SelectItem>
            <SelectItem value="custom">{t("timer.custom")}</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              type="number"
              min="1"
              max="60"
              value={customMinutes}
              onChange={(e) =>
                setCustomMinutes(Number.parseInt(e.target.value, 10))
              }
              className="w-full"
            />
          </div>
          <button
            onClick={handleCustomSubmit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            {t("common.save")}
          </button>
        </div>
      )}
    </div>
  );
}
