import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, UserGroup } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<User>) => void;
  user?: User;
}

const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  status: z.string(),
  groups: z.array(z.object({
    name: z.string(),
    color: z.string()
  })).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function UserModal({ isOpen, onClose, onSubmit, user }: UserModalProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    user?.groups?.map(g => g.name) || []
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      status: user?.status || "Active",
      groups: user?.groups || [],
    }
  });

  const availableGroups = [
    { name: "Tennis Club", color: "blue" },
    { name: "Weekend Warriors", color: "purple" },
    { name: "Pickle Pros", color: "green" },
    { name: "Juniors", color: "yellow" }
  ];

  const handleGroupChange = (groupName: string) => {
    const group = availableGroups.find(g => g.name === groupName);
    if (!group) return;

    // Update selected groups for the UI
    setSelectedGroups(prev => {
      // If already selected, remove it
      if (prev.includes(groupName)) {
        return prev.filter(g => g !== groupName);
      } 
      // Otherwise add it
      return [...prev, groupName];
    });

    // Update the form value
    const currentGroups = form.getValues().groups || [];
    const groupExists = currentGroups.some(g => g.name === groupName);

    if (groupExists) {
      // Remove the group
      form.setValue(
        "groups", 
        currentGroups.filter(g => g.name !== groupName)
      );
    } else {
      // Add the group
      form.setValue(
        "groups", 
        [...currentGroups, { name: groupName, color: group.color }]
      );
    }
  };

  const handleSubmit = (values: UserFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Groups</FormLabel>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableGroups.map(group => (
                  <Button
                    key={group.name}
                    type="button"
                    variant={selectedGroups.includes(group.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleGroupChange(group.name)}
                    className={`
                      ${selectedGroups.includes(group.name) ? `bg-${group.color}-100 text-${group.color}-800 hover:bg-${group.color}-200` : ''}
                    `}
                  >
                    {group.name}
                  </Button>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {user ? "Save Changes" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}