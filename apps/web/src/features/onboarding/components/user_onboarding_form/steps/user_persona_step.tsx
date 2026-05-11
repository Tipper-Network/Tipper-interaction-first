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
import { fetchPersonas } from "../../../api/onboarding_api";
import { useSaveUserPersonas } from "@/views/users/hooks/users_hooks";

interface StepPersonaProps {
  selected: string[]; // now just persona IDs
  onChange: (persona: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

interface Persona {
  id: string;
  persona_name: string;
  persona_description: string;
  icon_url: string;
}

export default function StepPersona({
  selected,
  onChange,
  onBack,
  onNext,
}: StepPersonaProps) {
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null);
  const [showAllPersonas, setShowAllPersonas] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 12;
  const maxLength = 3;
  const minLength = 2;

  const displayedPersonas = showAllPersonas
    ? personas
    : personas?.slice(0, ITEMS_PER_PAGE);

  const togglePersona = (personaId: string) => {
    const isSelected = selected.includes(personaId);

    if (isSelected) {
      onChange(selected.filter((id) => id !== personaId));
    } else {
      if (selected.length < maxLength) {
        onChange([...selected, personaId]);
      }
    }
  };
  const isPersonaSelected = (personaId: string) => selected.includes(personaId);

  const { mutateAsync: savePersonas, isPending, error } = useSaveUserPersonas();

  const handleNext = async () => {
    if (selected.length < minLength || selected.length > maxLength) {
      return;
    }

    try {
      // Save Step 2: Personas
      await savePersonas({
        personas: selected.map((id) => ({ persona_id: id })),
      });
      // Move to next step after successful save
      onNext();
    } catch (err) {
      console.error("Failed to save personas:", err);
    }
  };

  useEffect(() => {
    const loadPersonas = async () => {
      try {
        const data = await fetchPersonas();
        setPersonas(data);
      } catch (error) {
        console.error("Failed to fetch personas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonas();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-tertiary" />
        </div>
        <h1 className="h3-bold sm:h2-bold text-foreground mb-2">
          what kind of person are you?
        </h1>
        <p className="p-regular-14 sm:p-regular-16 text-muted-foreground">
          Select between {minLength}-{maxLength} personality types that describe
          you best.
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
            Personal Characteristics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2">
              {displayedPersonas.map((persona) => (
                <div
                  key={persona.id}
                  className={`p-2 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                    isPersonaSelected(persona.id)
                      ? "border-primary bg-primary/5 shadow-md cursor-pointer"
                      : selected.length >= maxLength
                        ? "border-border bg-muted/30 cursor-not-allowed opacity-60"
                        : hoveredPersona === persona.id
                          ? "border-primary/50 bg-muted/50 cursor-pointer"
                          : "border-border hover:border-primary/30 cursor-pointer"
                  }`}
                  onClick={() => togglePersona(persona.id)}
                  onMouseEnter={() => setHoveredPersona(persona.id)}
                  onMouseLeave={() => setHoveredPersona(null)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="p-medium-14 sm:text-lg text-foreground font-semibold">
                      {persona.persona_name}
                    </h3>
                    {isPersonaSelected(persona.id) && (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    )}
                  </div>
                  <p className="p-regular-12 sm:p-regular-14 text-muted-foreground">
                    {persona.persona_description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!isLoading && personas.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAllPersonas(!showAllPersonas)}
                className="flex items-center gap-2"
              >
                {showAllPersonas ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show More ({personas.length - ITEMS_PER_PAGE} more)
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
            <CardTitle className="text-center">Your Personas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center">
              {selected.map((id) => {
                const persona = personas.find((p) => p.id === id);
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="p-medium-12 hover:cursor-pointer"
                    onClick={() => togglePersona(id)}
                  >
                    {persona?.persona_name || "Unknown"}
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
                You selected your top {selected.length} personality traits.
              </p>
              {selected.length >= minLength && selected.length < maxLength && (
                <span className="text-secondary">
                  {" "}
                  you can select {maxLength - selected.length} more{" "}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
          onClick={handleNext}
          disabled={
            selected.length < minLength ||
            selected.length > maxLength ||
            isPending
          }
          className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Continue"}
          {!isPending && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>

      {selected.length < maxLength && (
        <div className="mt-4 text-center">
          <p className="p-medium-14 text-muted-foreground">
            Please select {minLength}-{maxLength} Personas to complete your
            profile ({maxLength - selected.length} more needed)
          </p>
        </div>
      )}
    </div>
  );
}
