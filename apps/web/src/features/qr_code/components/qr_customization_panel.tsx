"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import type { DotType, CornerDotType, CornerSquareType } from "qr-code-styling";
import ColorPicker from "./color_picker";

interface QRCustomizationPanelProps {
  dotsType: DotType;
  dotsColor: string;
  cornersSquareType: CornerSquareType;
  cornersSquareColor: string;
  cornersDotType: CornerDotType;
  cornersDotColor: string;
  backgroundColor: string;
  onDotsTypeChange: (type: DotType) => void;
  onDotsColorChange: (color: string) => void;
  onCornersSquareTypeChange: (type: CornerSquareType) => void;
  onCornersSquareColorChange: (color: string) => void;
  onCornersDotTypeChange: (type: CornerDotType) => void;
  onCornersDotColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  defaultOpen?: boolean;
}

const dotTypes: DotType[] = [
  "dots",
  "rounded",
  "classy",
  "classy-rounded",
  "square",
  "extra-rounded",
];
const cornerSquareTypes: CornerSquareType[] = [
  "dot",
  "square",
  "extra-rounded",
  "dots",
  "rounded",
  "classy",
  "classy-rounded",
];
const cornerDotTypes: CornerDotType[] = [
  "dot",
  "square",
  "dots",
  "rounded",
  "classy",
  "classy-rounded",
  "extra-rounded",
];

export default function QRCustomizationPanel({
  dotsType,
  dotsColor,
  cornersSquareType,
  cornersSquareColor,
  cornersDotType,
  cornersDotColor,
  backgroundColor,
  onDotsTypeChange,
  onDotsColorChange,
  onCornersSquareTypeChange,
  onCornersSquareColorChange,
  onCornersDotTypeChange,
  onCornersDotColorChange,
  onBackgroundColorChange,
  defaultOpen = false,
}: QRCustomizationPanelProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Customize QR Code</CardTitle>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-4">
            {/* Background Color */}
            <ColorPicker
              value={backgroundColor || "#ffffff"}
              onChange={onBackgroundColorChange}
              id="background-color"
              label="Background Color"
            />

            {/* Dots Options */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">Dots Style</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="dots-type">Dots Type</Label>
                  <Select value={dotsType} onValueChange={onDotsTypeChange}>
                    <SelectTrigger id="dots-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dotTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() +
                            type.slice(1).replace(/-/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ColorPicker
                  value={dotsColor || "#676767"}
                  onChange={onDotsColorChange}
                  id="dots-color"
                  label="Dots Color"
                />
              </div>
            </div>

            {/* Corners Square Options */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">Corner Squares</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="corners-square-type">
                    Corner Square Type
                  </Label>
                  <Select
                    value={cornersSquareType}
                    onValueChange={onCornersSquareTypeChange}
                  >
                    <SelectTrigger id="corners-square-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cornerSquareTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() +
                            type.slice(1).replace(/-/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ColorPicker
                  value={cornersSquareColor || "#676767"}
                  onChange={onCornersSquareColorChange}
                  id="corners-square-color"
                  label="Corner Square Color"
                />
              </div>
            </div>

            {/* Corners Dot Options */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-sm">Corner Dots</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="corners-dot-type">Corner Dot Type</Label>
                  <Select
                    value={cornersDotType}
                    onValueChange={onCornersDotTypeChange}
                  >
                    <SelectTrigger id="corners-dot-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cornerDotTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() +
                            type.slice(1).replace(/-/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ColorPicker
                  value={cornersDotColor || "#676767"}
                  onChange={onCornersDotColorChange}
                  id="corners-dot-color"
                  label="Corner Dot Color"
                />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
