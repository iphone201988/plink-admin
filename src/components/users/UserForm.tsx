import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User } from "@/types";
import { useEditUserMutation } from "@/api";


// Form validation schema
const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  status: z.string(),
  // avatarColor: z.string(),
  // password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional(),
  selfRating: z.number().min(0).max(5).optional(),
  UTRP: z.number().min(0).max(16).optional(),
  WPR: z.number().min(0).max(16).optional(),
  UTPR: z.number().min(0).max(16).optional(),
  CTPR: z.number().min(0).max(16).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (values: UserFormValues) => void;
  isSubmitting?: boolean;
}

export function UserForm({ user, onSubmit, isSubmitting = false }: UserFormProps) {


  const isEditMode = !!user;


  const [editUser] = useEditUserMutation();


  
  
  // Initialize form with default values or user data if in edit mode
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user ? `${user.firstName} ${user.lastName}`.trim() : "",
      email: user?.email || "",
      status: user?.status || "Active",
      // avatarColor: user?.colorScheme || "blue",
      // password: "", // Empty for edit mode
      selfRating: user?.selfRating || 0,
      UTRP: user?.UTRP || 0,
      WPR: user?.WPR || 0,
      UTPR: user?.UTPR || 0,
      CTPR: user?.CTPR || 0,
    },
  });


  const handleSubmit = async (values: UserFormValues) => {
      onSubmit(values);
      await editUser({
        id: user?.id,
        userData: {
          name: `${values.name}`.trim(),
          selfRating: values.selfRating || 0,
          UTRP: values.UTRP || 0,
          WPR: values.WPR || 0,
          UTPR: values.UTPR || 0,
          CTPR: values.CTPR || 0,
          isActive: values.status === "Active" ? true : false,
        },
      }).unwrap();
    
  };



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="selfRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Self Rating</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0-5"
                    min={0}
                    max={5}
                    step={0.01}
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="UTRP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UTRP</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0-16"
                    min={0}
                    max={16}
                    step={0.01}
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="WPR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WPR</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0-16"
                    min={0}
                    max={16}
                    step={0.01}
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="UTPR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UTPR</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0-16"
                    min={0}
                    max={16}
                    step={0.01}
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="CTPR"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTPR</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0-16"
                    min={0}
                    max={16}
                    step={0.01}
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isEditMode ? (isSubmitting ? "Saving..." : "Save Changes") : (isSubmitting ? "Creating..." : "Create User")}
          </Button>
        </div>
      </form>
    </Form>
  );
}