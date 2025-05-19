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
import { useGetDashboardDataQuery } from "@/api";
import React from "react";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const { data: dashboardData } = useGetDashboardDataQuery({
    page: currentPage,
    limit: perPage
  });


  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Memoize transform functions to prevent recreation on every render
  const transformApiUsers = React.useCallback((apiUsers: any[] = []) => {
    return apiUsers.map((user) => ({
      id: user._id,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      email: user.email,
      status: "Active",
      memberSince: new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      colorScheme: "blue",
      profileImage: user.profileImage,
      groups: []
    }));
  }, []);

  interface ApiEvent {
    _id: string;
    court?: {
      title?: string;
      address?: string;
    };
    startTimestamp: string;
    endTimestamp: string;
    playerCount: number;
    hostId: any;
  }

  // Memoize transformed data
  const users = React.useMemo(() =>
    transformApiUsers(dashboardData?.recentUsers?.data || []),
    [dashboardData?.recentUsers?.data, transformApiUsers]
  );

  const events = React.useMemo(() =>
    dashboardData?.gameMetrics?.upcoming?.future?.games || [],
    [dashboardData?.gameMetrics?.upcoming?.future?.games]
  );

  const totalPages = dashboardData?.recentUsers?.pagination?.totalPages || 1;

  useEffect(() => {
    if (users && users.length > 0) {
      setFilteredUsers(users);
    }
  }, [users]);

  // Handler for applying filters
  const handleApplyFilters = (filters: FilterOptions) => {
    let filtered = [...users];

    if (filters.status.length > 0) {
      filtered = filtered.filter(user => filters.status.includes(user.status));
    }

    if (filters.groups.length > 0) {
      filtered = filtered.filter((user: any) =>
        user.groups?.some((group: any) => filters.groups.includes(group.name))
      );
    }

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
      setFilteredUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === activeUser.id ? { ...user, ...userData } : user
        )
      );

      showToast({
        title: "User Updated",
        description: `${userData.firstName || activeUser.firstName} ${userData.lastName || activeUser.lastName} was updated`,
        variant: "success"
      });

      setShowUserModal(false);
      setActiveUser(null);
    }
  };

  const handleToggleUserStatus = (user: User) => {
    const newStatus = user.status === "Active" ? "Suspended" : "Active";

    setFilteredUsers(prevUsers =>
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
      setFilteredUsers(prevUsers => prevUsers.filter(user => user.id !== activeUser.id));

      showToast({
        title: "User Deleted",
        description: `${activeUser.firstName} ${activeUser.lastName} has been removed`,
        variant: "destructive"
      });

      setShowDeleteDialog(false);
      setActiveUser(null);
    }
  };

  const handleEventClick = (event: any) => {
    showToast({
      title: event?.court?.title || 'Event Title',
      description: `${event.startTimestamp} at ${event?.court?.address || 'Location'}`,
      variant: "default"
    });
  };

  const handleAddEvent = () => {
    dispatch(toggleNotificationModal());
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
        {/* <Button onClick={handleAddEvent}>
          <Plus className="h-4 w-4 mr-2" />
          <span>New Event</span>
        </Button> */}
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
            value={dashboardData?.userMetrics?.total.toString() || "0"}
            icon="users"
            change={dashboardData?.userMetrics?.growthPercentage || 0}
          />
        </motion.div>

        <motion.div variants={slideUp}>
          <StatsCard
            title="Active Courts"
            value={dashboardData?.courtMetrics?.total.toString() || "0"}
            icon="courts"
            change={dashboardData?.courtMetrics?.growthPercentage || 0}
          />
        </motion.div>

        <motion.div variants={slideUp}>
          <StatsCard
            title="Events Today"
            value={dashboardData?.gameMetrics?.totalToday.toString() || "0"}
            icon="events"
            change={dashboardData?.gameMetrics?.growthPercentage || 0}
          />
        </motion.div>

        <motion.div variants={slideUp}>
          <StatsCard
            title="Average Rating"
            value={dashboardData?.courtMetrics?.avgRating.toString() || "0"}
            icon="rating"
            change={((dashboardData?.courtMetrics?.avgRating || 0) - (dashboardData?.courtMetrics?.avgRatingLastMonth || 0)) * 100}
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
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textLight dark:text-gray-400" onClick={() => handlePageChange(currentPage - 1)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="icon"
                className="w-8 h-8"
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textLight dark:text-gray-400" onClick={() => handlePageChange(currentPage + 1)}>
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
