import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Group } from "@/types";

// Mock group color schemes until we get them from the theme file
const groupColorSchemes = {
  blue: { primary: "#0593fe" },
  green: { primary: "#10b981" },
  purple: { primary: "#8b5cf6" },
  red: { primary: "#ef4444" },
  yellow: { primary: "#f59e0b" },
  pink: { primary: "#ec4899" },
  indigo: { primary: "#6366f1" },
  gray: { primary: "#6b7280" },
};

// Form validation schema
const groupFormSchema = z.object({
  name: z.string().min(3, { message: "Group name must be at least 3 characters." }),
  description: z.string().optional(),
  colorScheme: z.string(),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

interface GroupFormProps {
  group?: Group;
  onSubmit: (values: GroupFormValues) => void;
  isSubmitting?: boolean;
}

export function GroupForm({ group, onSubmit, isSubmitting = false }: GroupFormProps) {
  const isEditMode = !!group;
  
  // Initialize form with default values or group data if in edit mode
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: group?.name || "",
      description: group?.description || "",
      colorScheme: group?.colorScheme || "blue",
    },
  });

  const [selectedColor, setSelectedColor] = useState<string>(group?.colorScheme || "blue");
  
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    form.setValue("colorScheme", color);
  };

  const handleSubmit = (values: GroupFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Tennis Club" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Group description..." 
                  className="resize-none min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="colorScheme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Scheme</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(groupColorSchemes).map(([color, scheme]) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                      selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: scheme.primary }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isEditMode ? (isSubmitting ? "Saving..." : "Save Changes") : (isSubmitting ? "Creating..." : "Create Group")}
          </Button>
        </div>
      </form>
    </Form>
  );
}