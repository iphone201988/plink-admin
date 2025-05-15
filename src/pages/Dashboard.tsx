import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats/StatsCard";
import { UserTable } from "@/components/users/UserTable";
import { UserCard } from "@/components/users/UserCard";
import { CalendarView } from "@/components/calendar/CalendarView";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import { FilterDialog, FilterOptions } from "@/components/dashboard/FilterDialog";
import { UserModal } from "@/components/users/UserModal";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { showToast } from "@/lib/toastManager";
import { useDispatch } from "react-redux";
import { toggleNotificationModal } from "@/store/slices/uiSlice";
import { User, Event } from "@/types";
import { pageTransition, staggerContainer, slideUp } from "@/lib/animations";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  
  // State for modals and dialogs
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
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
    }
  ]);
  
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Tennis Tournament",
      date: new Date().toISOString(),
      time: "9:00 AM - 5:00 PM",
      location: "Main Court",
      type: "tournament"
    },
    {
      id: 2,
      title: "Court Maintenance",
      date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      time: "7:00 AM - 10:00 AM",
      location: "All Courts",
      type: "maintenance"
    },
    {
      id: 3,
      title: "Pickle League",
      date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
      time: "1:00 PM - 4:00 PM",
      location: "Courts 3-6",
      type: "league"
    },
    {
      id: 4,
      title: "Training Session",
      date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
      time: "10:00 AM - 12:00 PM",
      location: "Practice Court",
      type: "training"
    }
  ]);
  
  useEffect(() => {
    // Initialize filtered users with all users
    setFilteredUsers(users);
  }, [users]);

  // Handler for applying filters
  const handleApplyFilters = (filters: FilterOptions) => {
    let filtered = [...users];
    
    // Filter by status if any status filters selected
    if (filters.status.length > 0) {
      filtered = filtered.filter(user => filters.status.includes(user.status));
    }
    
    // Filter by groups if any group filters selected
    if (filters.groups.length > 0) {
      filtered = filtered.filter(user => 
        user.groups?.some(group => filters.groups.includes(group.name))
      );
    }
    
    // Update filtered users
    setFilteredUsers(filtered);
    
    showToast({
      title: "Filters Applied",
      description: `Showing ${filtered.length} of ${users.length} users`,
      variant: "default"
    });
  };
  
  // User action handlers
  const handleEditUser = (user: User) => {
    setActiveUser(user);
    setShowUserModal(true);
  };
  
  const handleUpdateUser = (userData: Partial<User>) => {
    if (activeUser) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === activeUser.id ? { ...user, ...userData } : user
        )
      );
      
      showToast({ 
        title: "User Updated",
        description: `${userData.firstName || activeUser.firstName} ${userData.lastName || activeUser.lastName} was updated`,
        variant: "success"
      });
    }
  };
  
  const handleToggleUserStatus = (user: User) => {
    const newStatus = user.status === "Active" ? "Suspended" : "Active";
    
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id 
          ? { 
              ...u, 
              status: newStatus
            } 
          : u
      )
    );
    
    showToast({
      title: "Status Updated",
      description: `${user.firstName} ${user.lastName} is now ${newStatus}`,
      variant: newStatus === "Active" ? "success" : "destructive"
    });
  };
  
  const handleDeleteUser = (user: User) => {
    setActiveUser(user);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteUser = () => {
    if (activeUser) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== activeUser.id));
      
      showToast({
        title: "User Deleted",
        description: `${activeUser.firstName} ${activeUser.lastName} has been removed`,
        variant: "destructive"
      });
      
      // Close the dialog
      setShowDeleteDialog(false);
      setActiveUser(null);
    }
  };
  
  const handleEventClick = (event: Event) => {
    showToast({
      title: event.title,
      description: `${event.time} at ${event.location}`,
      variant: "default"
    });
  };
  
  const handleAddEvent = () => {
    // Open event form/modal
    showToast({
      title: "Add Event",
      description: "Event creation form would open here",
      variant: "default"
    });
  };
  
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mb-8">
        <Button 
          variant="outline" 
          className="bg-white dark:bg-gray-800" 
          onClick={() => setShowFilterDialog(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          <span>Filter</span>
        </Button>
        <Button onClick={() => dispatch(toggleNotificationModal())}>
          <Plus className="h-4 w-4 mr-2" />
          <span>New Event</span>
        </Button>
      </div>
      
      {/* Filter Dialog */}
      <FilterDialog 
        isOpen={showFilterDialog}
        onClose={() => setShowFilterDialog(false)}
        onApplyFilters={handleApplyFilters}
      />
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={staggerContainer}
      >
        <motion.div variants={slideUp}>
          <StatsCard 
            title="Total Users" 
            value="2,854" 
            icon="users" 
            change={12.5} 
          />
        </motion.div>
        
        <motion.div variants={slideUp}>
          <StatsCard 
            title="Active Courts" 
            value="42" 
            icon="courts" 
            change={8.2} 
          />
        </motion.div>
        
        <motion.div variants={slideUp}>
          <StatsCard 
            title="Events Today" 
            value="28" 
            icon="events" 
            change={0} 
          />
        </motion.div>
        
        <motion.div variants={slideUp}>
          <StatsCard 
            title="Average Rating" 
            value="4.8" 
            icon="rating" 
            change={3.1} 
          />
        </motion.div>
      </motion.div>
      
      {/* Recent Users Section */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle>Recent Users</CardTitle>
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
            onToggleStatus={handleToggleUserStatus}
            onDelete={handleDeleteUser}
          />
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard 
                key={user.id} 
                user={user} 
                onEdit={handleEditUser}
                onToggleStatus={() => handleToggleUserStatus(user)}
                onDelete={() => handleDeleteUser(user)}
              />
            ))}
          </div>
        )}
        
        <CardContent className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-textLight dark:text-gray-400">Showing {filteredUsers.length} of {users.length} users</p>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textLight dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>
            <Button variant="default" size="icon" className="w-8 h-8">1</Button>
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 text-textDark dark:text-white border-gray-200 dark:border-gray-700">2</Button>
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 text-textDark dark:text-white border-gray-200 dark:border-gray-700">3</Button>
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textLight dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Calendar & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CalendarView events={events} onEventClick={handleEventClick} />
        </div>
        
        <div>
          <UpcomingEvents 
            events={events} 
            onEventClick={handleEventClick} 
            onAddEvent={handleAddEvent} 
          />
        </div>
      </div>
      
      {/* User edit modal */}
      <UserModal 
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setActiveUser(null);
        }}
        onSubmit={handleUpdateUser}
        user={activeUser || undefined}
      />
      
      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog 
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setActiveUser(null);
        }}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete ${activeUser?.firstName} ${activeUser?.lastName}? This action cannot be undone.`}
      />
    </motion.div>
  );
}
