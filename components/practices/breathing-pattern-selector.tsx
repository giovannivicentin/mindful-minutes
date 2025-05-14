"use client";
import { useTranslation } from "@/hooks/use-translation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export type BreathingPattern = {
  id: string;
  title: string;
  purpose: string;
  timing: {
    inhale: number;
    holdAfterInhale: number;
    exhale: number;
    holdAfterExhale: number;
    doubleInhale?: boolean;
  };
};

interface BreathingPatternSelectorProps {
  locale: string;
  selectedPattern: string;
  onPatternChange: (patternId: string) => void;
}

export function BreathingPatternSelector({
  locale,
  selectedPattern,
  onPatternChange,
}: BreathingPatternSelectorProps) {
  const t = useTranslation(locale);

  const breathingPatterns: BreathingPattern[] = [
    {
      id: "balanced",
      title: t("practices.breathing.patterns.balanced.title"),
      purpose: t("practices.breathing.patterns.balanced.purpose"),
      timing: {
        inhale: 5,
        holdAfterInhale: 3,
        exhale: 7,
        holdAfterExhale: 0,
      },
    },
    {
      id: "box",
      title: t("practices.breathing.patterns.box.title"),
      purpose: t("practices.breathing.patterns.box.purpose"),
      timing: {
        inhale: 4,
        holdAfterInhale: 4,
        exhale: 4,
        holdAfterExhale: 4,
      },
    },
    {
      id: "relaxing",
      title: t("practices.breathing.patterns.relaxing.title"),
      purpose: t("practices.breathing.patterns.relaxing.purpose"),
      timing: {
        inhale: 4,
        holdAfterInhale: 7,
        exhale: 8,
        holdAfterExhale: 0,
      },
    },
    {
      id: "balanced-simple",
      title: t("practices.breathing.patterns.balanced-simple.title"),
      purpose: t("practices.breathing.patterns.balanced-simple.purpose"),
      timing: {
        inhale: 5,
        holdAfterInhale: 0,
        exhale: 5,
        holdAfterExhale: 0,
      },
    },
    {
      id: "sighing",
      title: t("practices.breathing.patterns.sighing.title"),
      purpose: t("practices.breathing.patterns.sighing.purpose"),
      timing: {
        inhale: 3,
        holdAfterInhale: 0,
        exhale: 6,
        holdAfterExhale: 1,
        doubleInhale: true,
      },
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {t("practices.breathing.selectPattern")}
      </h3>
      <RadioGroup
        value={selectedPattern}
        onValueChange={onPatternChange}
        className="space-y-3"
      >
        {breathingPatterns.map((pattern) => (
          <div
            key={pattern.id}
            onClick={() => onPatternChange(pattern.id)}
            className="cursor-pointer"
          >
            <Card
              className={`transition-all ${
                selectedPattern === pattern.id
                  ? "ring-2 ring-primary"
                  : "hover:bg-accent"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3 pt-1">
                  <RadioGroupItem
                    value={pattern.id}
                    id={pattern.id}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor={pattern.id} className="font-medium">
                      {pattern.title}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {pattern.purpose}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
