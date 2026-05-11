"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  Star,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";
import { fetchEntityArchetypes } from "../../../api/onboarding_api";
import BackButton from "@/components/back_button";

interface StepEntityArchetypeProps {
  selected: string[]; // now just persona IDs
  onChange: (archetype: string[]) => void;
  onSubmit: () => void;
}

interface Archetype {
  id: string;
  archetype_name: string;
  archetype_description: string;
  icon_url: string;
}

export default function StepEntityArchetype({
  selected,
  onChange,
  onSubmit,
}: StepEntityArchetypeProps) {
  const [hoveredArchetype, setHoveredArchetype] = useState<string | null>(null);
  const [showAllArchetypes, setShowAllArchetypes] = useState(false);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 12;
  const maxLength = 2;
  const minLength = 1;

  const displayedArchetypes = showAllArchetypes
    ? archetypes
    : archetypes?.slice(0, ITEMS_PER_PAGE);

  const toggleArchetype = (archetypeId: string) => {
    const isSelected = selected.includes(archetypeId);

    if (isSelected) {
      onChange(selected.filter((id) => id !== archetypeId));
    } else {
      if (selected.length < maxLength) {
        onChange([...selected, archetypeId]);
      }
    }
  };
  const isArchetypeSelected = (archetypeId: string) =>
    selected.includes(archetypeId);

  const handleNext = () => {
    if (selected.length >= minLength && selected.length <= maxLength) {
      onSubmit();
    }
  };

  useEffect(() => {
    const loadArchetypes = async () => {
      try {
        const data = await fetchEntityArchetypes();
        setArchetypes(data);
      } catch (error) {
        console.error("Failed to fetch archetypes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArchetypes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-tertiary" />
        </div>
        <h1 className="h3-bold sm:h2-bold text-foreground mb-2">
          What business archetype best represents your business?
        </h1>
        <p className="p-regular-14 sm:p-regular-16 text-muted-foreground">
          Select between {minLength}-{maxLength} business archetypes that best
          represent your business. Choose the archetypes that resonate most with
          your brand identity and target audience.
        </p>
        <div className="mt-3 sm:mt-4">
          <Badge variant="secondary" className="p-medium-12 sm:p-medium-14">
            {selected.length}/{maxLength} selected
          </Badge>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Business Archetypes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2">
              {displayedArchetypes.map((archetype) => (
                <div
                  key={archetype.id}
                  className={`p-2 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                    isArchetypeSelected(archetype.id)
                      ? "border-primary bg-primary/5 shadow-md cursor-pointer"
                      : selected.length >= maxLength
                        ? "border-border bg-muted/30 cursor-not-allowed opacity-60"
                        : hoveredArchetype === archetype.id
                          ? "border-primary/50 bg-muted/50 cursor-pointer"
                          : "border-border hover:border-primary/30 cursor-pointer"
                  }`}
                  onClick={() => toggleArchetype(archetype.id)}
                  onMouseEnter={() => setHoveredArchetype(archetype.id)}
                  onMouseLeave={() => setHoveredArchetype(null)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="p-medium-14 sm:text-lg text-foreground font-semibold">
                      {archetype.archetype_name}
                    </h3>
                    {isArchetypeSelected(archetype.id) && (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    )}
                  </div>
                  <p className="p-regular-12 sm:p-regular-14 text-muted-foreground">
                    {archetype.archetype_description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!isLoading && archetypes.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAllArchetypes(!showAllArchetypes)}
                className="flex items-center gap-2"
              >
                {showAllArchetypes ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show More ({archetypes.length - ITEMS_PER_PAGE} more)
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selected.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              Your Business Archetypes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {selected.map((id) => {
                const archetype = archetypes.find((a) => a.id === id);
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="p-medium-12 hover:cursor-pointer"
                    onClick={() => toggleArchetype(id)}
                  >
                    {archetype?.archetype_name || "Unknown"}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {selected.length >= minLength && selected.length <= maxLength && (
        <Card className="mt-6 shadow-lg bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="h3-bold text-foreground mb-2">Perfect!</h3>
              <p className="p-regular-16 text-muted-foreground">
                You selected your top {selected.length} business archetypes.
              </p>
              {selected.length >= minLength && selected.length < maxLength && (
                <span className="text-secondary">
                  {" "}
                  You can select {maxLength - selected.length} more{" "}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-6 sm:mt-8">
        <BackButton buttonText="Back" />

        <Button
          onClick={handleNext}
          disabled={selected.length < minLength || selected.length > maxLength}
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {selected.length < maxLength && (
        <div className="mt-4 text-center">
          <p className="p-medium-14 text-muted-foreground">
            Please select {minLength}-{maxLength} archetypes to complete your
            business profile ({maxLength - selected.length} more needed)
          </p>
        </div>
      )}
    </div>
  );
}
