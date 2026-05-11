"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ArrowLeft,
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { fetchEntityValues } from "@/features/onboarding/api/onboarding_api";
interface StepEntityValuesProps {
  selected: string[];
  onChange: (value: string[]) => void;
  onBack: () => void;
  onSubmit: () => void;
}

interface Values {
  id: string;
  value_name: string;
  value_description: string;
}

export default function StepEntityValues({
  selected,
  onChange,
  onBack,
  onSubmit,
}: StepEntityValuesProps) {
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [showAllValues, setShowAllValues] = useState(false);
  const [values, setValues] = useState<Values[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const maxSelection = 5;
  const ITEMS_PER_PAGE = 12;
  const displayedValues = showAllValues
    ? values
    : values.slice(0, ITEMS_PER_PAGE);

  const toggleValue = (valueId: string) => {
    const isSelected = selected.includes(valueId);

    if (isSelected) {
      onChange(selected.filter((id) => id !== valueId));
    } else {
      if (selected.length < maxSelection) {
        onChange([...selected, valueId]);
      }
    }
  };

  const isValueSelected = (valueId: string) => selected.includes(valueId);

  const handleSubmit = () => {
    if (selected.length === maxSelection) {
      onSubmit();
    }
  };

  useEffect(() => {
    const loadValues = async () => {
      try {
        const data = await fetchEntityValues();
        setValues(data);
      } catch (error) {
        console.error("Failed to fetch values:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadValues();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-tertiary" />
        </div>
        <h1 className="h3-bold sm:h2-bold text-foreground mb-2">
          What principles guide your work?
        </h1>
        <p className="p-regular-14 sm:p-regular-16 text-muted-foreground">
          Select exactly {maxSelection} core principles that define your entity
          values
        </p>
        <div className="mt-3 sm:mt-4">
          <Badge variant="secondary" className="p-medium-12 sm:p-medium-14">
            {selected.length}/{maxSelection} selected
          </Badge>
        </div>
      </div>

      {/* Values Grid */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Core Principles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2">
            {displayedValues.map((value) => (
              <div
                key={value.id}
                className={`p-2 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                  isValueSelected(value.id)
                    ? "border-primary bg-primary/5 shadow-md cursor-pointer"
                    : selected.length >= maxSelection
                      ? "border-border bg-muted/30 cursor-not-allowed opacity-60"
                      : hoveredValue === value.id
                        ? "border-primary/50 bg-muted/50 cursor-pointer"
                        : "border-border hover:border-primary/30 cursor-pointer"
                }`}
                onClick={() => toggleValue(value.id)}
                onMouseEnter={() => setHoveredValue(value.id)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="p-medium-14 sm:text-lg  text-foreground font-semibold">
                    {value.value_name}
                  </h3>
                  {isValueSelected(value.id) && (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  )}
                </div>
                <p className="p-regular-12 sm:p-regular-14 text-muted-foreground">
                  {value.value_description}
                </p>
              </div>
            ))}
          </div>

          {/* Expand/Collapse Button */}
          {values.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAllValues(!showAllValues)}
                className="flex items-center gap-2"
              >
                {showAllValues ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show More ({values.length - ITEMS_PER_PAGE} more)
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Values Preview */}
      {selected.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Your Core Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {selected.map((item, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="p-medium-12 hover:cursor-pointer"
                  onClick={() => toggleValue(item)}
                >
                  {values.find((value) => value.id === item)?.value_name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Values Summary */}
      {selected.length === maxSelection && (
        <Card className="mt-6 shadow-lg bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="h3-bold text-foreground mb-2">Perfect!</h3>
              <p className="p-regular-16 text-muted-foreground">
                You&apos;ve selected {selected.length} core principles. This
                will help us personalize your entity experience and connect you
                with like-minded everything.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 sm:mt-8">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={selected.length !== maxSelection}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          <ArrowRight className="h-4 w-4" />
          Continue
        </Button>
      </div>

      {/* Selection Status */}
      {selected.length < maxSelection && (
        <div className="mt-4 text-center">
          <p className="p-medium-14 text-muted-foreground">
            Please select exactly {maxSelection} principles to complete your
            entity profile ({maxSelection - selected.length} more needed)
          </p>
        </div>
      )}
    </div>
  );
}
