'use client';

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TagInput = React.forwardRef(
  ({ className, value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState("");
    const inputRef = React.useRef(null);

    React.useEffect(() => {
      if (pendingDataPoint.includes(",")) {
        const newDataPoints = new Set([
          ...value,
          ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
        ]);
        const filteredDataPoints = Array.from(newDataPoints).filter(Boolean);
        onChange(filteredDataPoints);
        setPendingDataPoint("");
      }
    }, [pendingDataPoint, onChange, value]);

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint.trim()]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    const removeTag = (tagToRemove) => {
      onChange(value.filter((i) => i !== tagToRemove));
    };

    return (
      <div
        className={cn(
          "flex min-h-9 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs ring-offset-background transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 h-3 w-3"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(item);
              }}
            >
              <XIcon className="w-3" />
            </Button>
          </Badge>
        ))}
        <input
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addPendingDataPoint();
            } else if (
              e.key === "Backspace" &&
              pendingDataPoint.length === 0 &&
              value.length > 0
            ) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          {...props}
          ref={inputRef}
        />
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export { TagInput };