import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, UserGroup } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { format } from "date-fns";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<User>) => void;
  user?: User;
}

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address"),
  status: z.string(),
  groups: z.array(z.object({
    name: z.string(),
    color: z.string()
  })).optional(),
  memberSince: z.string().optional(),
  profileImage: z.string().optional(),
  selfRating: z.number().min(0).max(5).optional(),
  UTRP: z.number().min(0).max(16).optional(),
  WPR: z.number().min(0).max(16).optional(),
  UTPR: z.number().min(0).max(16).optional(),
  CTPR: z.number().min(0).max(16).optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function UserModal({ isOpen, onClose, onSubmit, user }: UserModalProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    user?.groups?.map(g => g.name) || []
  );

  console.log("user recent", user);


  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user ? `${user.firstName} ${user.lastName}`.trim() : "",
      email: user?.email || "",
      status: user?.status || "Active",
      selfRating: user?.selfRating || 0,
      UTRP: user?.UTRP || 0,
      WPR: user?.WPR || 0,
      UTPR: user?.UTPR || 0,
      CTPR: user?.CTPR || 0,
    },
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

    setSelectedGroups(prev => {
      if (prev.includes(groupName)) {
        return prev.filter(g => g !== groupName);
      }
      return [...prev, groupName];
    });

    const currentGroups = form.getValues().groups || [];
    const groupExists = currentGroups.some(g => g.name === groupName);

    if (groupExists) {
      form.setValue(
        "groups",
        currentGroups.filter(g => g.name !== groupName)
      );
    } else {
      form.setValue(
        "groups",
        [...currentGroups, { name: groupName, color: group.color }]
      );
    }
  };

  const handleSubmit = (values: UserFormValues) => {

    const nameParts = values.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const userData = {
      ...values,
      firstName,
      lastName,
      isActive: values.status === "Active",
    };

    onSubmit(userData);
    onClose();
  };

  useEffect(() => {
    if (user) {
      form.reset({
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email || "",
        status: user.status || "Active",
        selfRating: user.selfRating || 0,
        UTRP: user.UTRP || 0,
        WPR: user.WPR || 0,
        UTPR: user.UTPR || 0,
        CTPR: user.CTPR || 0,
        groups: user.groups || [],
        memberSince: user.memberSince || "",
        profileImage: user.profileImage || "",
      });
      setSelectedGroups(user.groups?.map(g => g.name) || []);
    }
  }, [user, form]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Member since: {format(user ? new Date(user.memberSince) : new Date(), "MMMM yyyy")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  console.log("field", field);

                  return (
                    (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  )
                }}
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Player Ratings</h4>
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