import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ensureArray } from "@/lib/utils/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const TagInputField = ({
  label,
  placeholder,
  description,
  value,
  onChange,
  onRemove,
}: {
  label: string;
  placeholder: string;
  description: string;
  value: string[];
  onChange: (tags: string[]) => void;
  onRemove: (index: number) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTags = () => {
    if (!inputValue.trim()) return;

    // Check if input contains spaces (multiple tags) or is a single tag
    if (inputValue.includes(" ")) {
      // Split by spaces only and filter out empty strings
      const newTags = inputValue
        .split(" ")
        .map((tag) => tag.replace(",", "").trim())
        .filter((tag) => tag && tag.length > 1);

      if (newTags.length > 0) {
        // Filter out duplicates
        const uniqueNewTags = newTags.filter((tag) => !value.includes(tag));
        onChange([...value, ...uniqueNewTags]);
        setInputValue("");
      }
    } else {
      // Single tag - add directly
      const singleTag = inputValue.trim();
      if (singleTag && singleTag.length > 1 && !value.includes(singleTag)) {
        onChange([...value, singleTag]);
        setInputValue("");
      }
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTags();
              }
            }}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddTags}
            disabled={!inputValue.trim()}
            className="px-4"
          >
            Add Vibes
          </Button>
        </div>

        {/* Tags Display */}
        <div className="flex flex-wrap gap-2">
          {ensureArray(value).map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        {ensureArray(value).length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            Add vibes to define your community&apos;s {label.toLowerCase()}
          </p>
        )}
      </div>
      {/* <FormDescription >{description}</FormDescription> */}
    </FormItem>
  );
};

export default TagInputField;
