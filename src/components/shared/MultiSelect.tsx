import * as React from "react";
import { useController } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils"; // Utility function for class merging

interface MultiSelectProps {
  options: { value: string; label: string, imageUrl: string }[];
  name: string;
  control: any;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, name, control }) => {
  const {
    field: { value = [], onChange },
  } = useController({ name, control });

  const toggleSelection = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v: string) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="text-black">
      <div className="space-y-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px]">
              {value.length > 0 ? value.map((val: any) => options.find((o) => o.value === val)?.label).join(", ") : "Select Users"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-2">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100",
                  value.includes(option.value) ? "bg-gray-200" : ""
                )}
                onClick={() => toggleSelection(option.value)}
              >
                <img src={option.imageUrl} alt={option.label} className="w-6 h-6 rounded-full" />
                <span>{option.label}</span>
                {value.includes(option.value) && <Check className="w-4 h-4 text-green-500" />}
              </div>
            ))}
          </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((selected: any) => {
            const user = options.find((o) => o.value === selected);
            return (
              <Button key={selected} variant="outline" size="sm" onClick={() => toggleSelection(selected)}>
                <img src={user?.imageUrl} alt={user?.label} className="w-5 h-5 rounded-full mr-2" />
                {user?.label} ✕
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
