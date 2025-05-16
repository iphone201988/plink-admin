import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserTable } from "@/components/users/UserTable";
import { UserCard } from "@/components/users/UserCard";
import { UserForm } from "@/components/users/UserForm";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types";
import { pageTransition } from "@/lib/animations";

export default function UserManagement() {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sample data - in a real app, this would come from API
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      status: "Active",
      memberSince: "Jan 2023",
      colorScheme: "blue",
      groups: [
        { name: "Tennis Club", color: "blue" },
        { name: "Weekend Warriors", color: "purple" }
      ]
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      status: "Active",
      memberSince: "Mar 2023",
      colorScheme: "green",
      groups: [
        { name: "Tennis Club", color: "blue" }
      ]
    },
    {
      id: 3,
      firstName: "Robert",
      lastName: "Johnson",
      email: "robert.j@example.com",
      status: "Suspended",
      memberSince: "Feb 2023",
      colorScheme: "purple",
      groups: [
        { name: "Weekend Warriors", color: "purple" }
      ]
    },
    {
      id: 4,
      firstName: "Mary",
      lastName: "Wilson",
      email: "mary.w@example.com",
      status: "Active",
      memberSince: "Apr 2023",
      colorScheme: "yellow",
      groups: [
        { name: "Tennis Club", color: "blue" },
        { name: "Pickle Pros", color: "green" }
      ]
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Brown",
      email: "david.brown@example.com",
      status: "Active",
      memberSince: "May 2023",
      colorScheme: "red",
      groups: [
        { name: "Pickle Pros", color: "green" }
      ]
    },
    {
      id: 6,
      firstName: "Sarah",
      lastName: "Miller",
      email: "sarah.m@example.com",
      status: "Suspended",
      memberSince: "Jun 2023",
      colorScheme: "pink",
      groups: [
        { name: "Tennis Club", color: "blue" },
        { name: "Weekend Warriors", color: "purple" }
      ]
    }
  ]);
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  const handleToggleUserStatus = (user: User) => {
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id 
          ? { 
              ...u, 
              status: u.status === "Active" ? "Suspended" : "Active" 
            } 
          : u
      )
    );
    
    const newStatus = user.status === "Active" ? "Suspended" : "Active";
    
    toast({
      title: "Status Updated",
      description: `${user.firstName} ${user.lastName} is now ${newStatus}`,
      variant: newStatus === "Active" ? "success" : "destructive"
    });
  };
  
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
    
    toast({
      title: "User Deleted",
      description: `${selectedUser.firstName} ${selectedUser.lastName} has been removed`,
      variant: "destructive"
    });
    
    setIsDeleteModalOpen(false);
  };
  
  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };
  
  const handleSubmitUser = (values: any) => {
    setIsSubmitting(true);
    
    try {
      if (selectedUser) {
        // Edit existing user
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id
            ? { 
                ...user, 
                ...values, 
                colorScheme: values.avatarColor 
              }
            : user
        );
        setUsers(updatedUsers);
        
        toast({
          title: "User Updated",
          description: `${values.firstName} ${values.lastName} has been updated`,
          variant: "success"
        });
        
        setIsEditModalOpen(false);
      } else {
        // Add new user
        const newUser: User = {
          id: users.length + 1,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          status: values.status,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          colorScheme: values.avatarColor,
          groups: []
        };
        
        setUsers([...users, newUser]);
        
        toast({
          title: "User Added",
          description: "The user has been added successfully.",
          variant: "success"
        });
        
        setIsAddModalOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchQuery === "" || 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      user.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add User</span>
        </Button>
      </div>
      
      {/* Users List */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === "table" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("table")}
                className="px-3 py-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
              </Button>
              <Button 
                variant={viewMode === "card" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("card")}
                className="px-3 py-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {viewMode === "table" ? (
          <UserTable 
            users={filteredUsers} 
            onEdit={handleEditUser} 
            onToggleStatus={(user) => handleToggleUserStatus(user)}
            onDelete={(user) => handleDeleteClick(user)}
          />
        ) : (
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  onEdit={handleEditUser}
                  onToggleStatus={() => handleToggleUserStatus(user)}
                  onDelete={() => handleDeleteClick(user)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-textLight dark:text-gray-400">
                No users found matching your criteria
              </div>
            )}
          </CardContent>
        )}
        
        <CardFooter className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-textLight dark:text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textLight dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>
            <Button variant="default" size="icon" className="w-8 h-8">1</Button>
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 text-textDark dark:text-white border-gray-200 dark:border-gray-700">2</Button>
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textLight dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        size="md"
      >
        <UserForm
          onSubmit={handleSubmitUser}
          isSubmitting={isSubmitting}
        />
      </Modal>
      
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        size="md"
      >
        {selectedUser && (
          <UserForm
            user={selectedUser}
            onSubmit={handleSubmitUser}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </motion.div>
  );
}
