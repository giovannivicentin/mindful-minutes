"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import { useStore } from "@/lib/store";

interface TimerSelectorProps {
  locale: string;
  onSelect: (minutes: number) => void;
}

export function TimerSelector({ locale, onSelect }: TimerSelectorProps) {
  const t = useTranslation(locale);
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
    const minutes = Number.parseInt(value, 10);

    // Validate the parsed value
    if (!isNaN(minutes) && minutes > 0) {
      setLastSelectedTimer(minutes);
      onSelect(minutes);
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="timer-select">{t("timer.select")}</Label>
      <Select
        value={selectedDuration || undefined}
        onValueChange={handleSelect}
      >
        <SelectTrigger id="timer-select" className="w-full">
          <SelectValue placeholder={t("timer.select")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 {t("timer.minutes")}</SelectItem>
          <SelectItem value="3">3 {t("timer.minutes")}</SelectItem>
          <SelectItem value="5">5 {t("timer.minutes")}</SelectItem>
          <SelectItem value="7">7 {t("timer.minutes")}</SelectItem>
          <SelectItem value="12">12 {t("timer.minutes")}</SelectItem>
          <SelectItem value="15">15 {t("timer.minutes")}</SelectItem>
          <SelectItem value="18">18 {t("timer.minutes")}</SelectItem>
          <SelectItem value="21">21 {t("timer.minutes")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
