"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MultiSelectFilterProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  disabled?: boolean;
  onChange: (selected: string[]) => void;
}

/**
 * Checkbox dropdown for the reports filter bar. Selections apply immediately
 * and the menu stays open so several can be toggled in one pass.
 */
export function MultiSelectFilter({
  label,
  options,
  selected,
  disabled = false,
  onChange,
}: MultiSelectFilterProps) {
  const summary =
    selected.length === 0
      ? `All ${label.toLowerCase()}`
      : selected.length === 1
        ? (options.find((option) => option.value === selected[0])?.label ??
          "1 selected")
        : `${selected.length} selected`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled || options.length === 0}
        render={
          <Button 
            variant="outline" 
            size="lg" 
            className="h-9 border-neutral-700 text-neutral-200 hover:bg-neutral-800" 
          />
        }
      >
        <span className="ev-label text-neutral-400">{label}</span>
        <span className="max-w-40 truncate text-neutral-200">{summary}</span>
        <ChevronDownIcon aria-hidden="true" />
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="start" 
        className="w-64 border-neutral-800 bg-neutral-900 text-neutral-200"
      >
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selected.includes(option.value)}
            closeOnClick={false}
            className="focus:bg-neutral-800 focus:text-neutral-50"
            onCheckedChange={(checked) =>
              onChange(
                checked
                  ? [...selected, option.value]
                  : selected.filter((value) => value !== option.value)
              )
            }
          >
            <span className="truncate">{option.label}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}