import { useState, useEffect, ReactNode, FC } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HexColorPicker } from "react-colorful";

// Color Picker Component using react-colorful
const ColorPicker = ({
  value,
  onChange,
  id,
  label,
}: {
  value: string;
  onChange: (color: string) => void;
  id: string;
  label: string;
}): ReactNode => {
  const [open, setOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value);

  useEffect(() => {
    setTempColor(value);
  }, [value]);

  const handleColorChange = (color: string) => {
    setTempColor(color);
    onChange(color);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset temp color when closing
      setTempColor(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="space-y-2 w-fit">
        <Button
          type="button"
          variant="outline"
          className="w-full  relative justify-start text-left font-normal h-10"
          onClick={() => setOpen(!open)}
        >
          <div
            className="h-4 w-4 rounded border border-border mr-2 flex-shrink-0"
            style={{ backgroundColor: value }}
          />
          <span className="text-muted-foreground truncate">{value}</span>
        </Button>
        {open && (
          <div className=" rounded-md border bg-popover p-3 shadow-md absolute top-0 left-0">
            <HexColorPicker
              color={tempColor}
              onChange={handleColorChange}
              style={{ width: "100%", height: "150px" }}
            />
            <div className="mt-3 flex gap-2">
              <Input
                value={tempColor}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setTempColor(newColor);
                  if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                    onChange(newColor);
                  }
                }}
                className="flex-1"
                placeholder="#000000"
              />
              <Button type="button" size="sm" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
