"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getBusinessTypes } from "@/features/entities/entity_types/businesses/api/business_api";
import { cn } from "@/lib/utils/utils";

interface BusinessTypeInputProps {
  value?: string;
  onChange: (value: string) => void;
}

interface BusinessTypeGroup {
  industry: string;
  industry_description: string;
  business_types: { id: string; business_type: string }[];
}

export default function BusinessTypeInput({
  value,
  onChange,
}: BusinessTypeInputProps) {
  const [groups, setGroups] = useState<BusinessTypeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] =
    useState<BusinessTypeGroup | null>(null);

  useEffect(() => {
    async function fetchBusinessTypesData() {
      try {
        const data = await getBusinessTypes();
        setGroups(data);
      } catch (error) {
        console.error("Failed to load business types", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBusinessTypesData();
  }, []);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            groups
              .flatMap((g) => g.business_types)
              .find((bt) => bt.id === value)?.business_type ||
            "Select Business Type"
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[300px] max-h-[350px] overflow-y-auto p-2 bg-popover text-popover-foreground border border-border shadow-md rounded-md z-[9999]"
        sideOffset={5}
      >
        {loading && (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...
          </div>
        )}

        {!loading && !selectedIndustry && (
          <>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-2 rounded-md shadow-2 ">
              Select Industry
            </p>
            {groups.map((group) => (
              <Button
                variant="simple"
                key={group.industry}
                className="w-full text-left text-sm px-3 py-1.5 mb-1 rounded-md border-1 h-auto hover:bg-accent"
                onClick={() => setSelectedIndustry(group)}
              >
                <div className="wrap ">
                  <p className="font-medium">{group.industry}</p>
                  <p className="text-xs text-muted-foreground  text-wrap">
                    {group.industry_description}
                  </p>
                </div>

                <ChevronRight className="h-3 w-3 mr-1" />
              </Button>
            ))}
          </>
        )}

        {!loading && selectedIndustry && (
          <>
            <div className="flex items-center  justify-between mb-2">
              <Button
                variant="simple"
                onClick={() => setSelectedIndustry(null)}
                className="flex items-center text-xs text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-3 w-3 mr-1" /> Back
              </Button>

              <p className="text-xs font-bold text-black-foreground  text-right uppercase mb-1 mr-2 ">
                {selectedIndustry.industry}
              </p>
            </div>
            <Separator className="mb-2 border-1 border-gray-200" />
            {selectedIndustry.business_types.map((bt) => (
              <Button
                key={bt.id}
                variant="simple"
                className={cn(
                  `w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-accent justify-start  border border-b-2 ${
                    value === bt.id ? "bg-accent border-b-2 border-primary" : ""
                  }`
                )}
                onClick={() => {
                  onChange(bt.id);
                }}
              >
                {bt.business_type}
              </Button>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
