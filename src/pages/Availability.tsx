import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showToast } from "@/lib/toastManager";
import { Availability as AvailabilityType } from "@/types";
import { pageTransition, slideUp } from "@/lib/animations";

export default function Availability() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dayFilter, setDayFilter] = useState<string>("all");
  
  // Sample data - in a real app, this would come from API
  const [availabilities, setAvailabilities] = useState<AvailabilityType[]>([
    {
      id: 1,
      courtName: "Main Court",
      day: "Monday",
      startTime: "08:00",
      endTime: "22:00",
      assignedTo: "John Doe",
      status: "Available"
    },
    {
      id: 2,
      courtName: "Court A",
      day: "Monday",
      startTime: "09:00",
      endTime: "18:00",
      assignedTo: "Jane Smith",
      status: "Reserved"
    },
    {
      id: 3,
      courtName: "Court B",
      day: "Tuesday",
      startTime: "10:00",
      endTime: "20:00",
      assignedTo: "Robert Johnson",
      status: "Available"
    },
    {
      id: 4,
      courtName: "Main Court",
      day: "Wednesday",
      startTime: "08:00",
      endTime: "22:00",
      assignedTo: "Mary Wilson",
      status: "Maintenance"
    },
    {
      id: 5,
      courtName: "Youth Court",
      day: "Wednesday",
      startTime: "14:00",
      endTime: "18:00",
      assignedTo: "David Brown",
      status: "Reserved"
    },
    {
      id: 6,
      courtName: "Practice Court",
      day: "Thursday",
      startTime: "09:00",
      endTime: "21:00",
      assignedTo: "John Doe",
      status: "Available"
    },
    {
      id: 7,
      courtName: "Court A",
      day: "Friday",
      startTime: "08:00",
      endTime: "20:00",
      assignedTo: "Sarah Miller",
      status: "Available"
    },
    {
      id: 8,
      courtName: "Main Court",
      day: "Saturday",
      startTime: "10:00",
      endTime: "18:00",
      assignedTo: "Robert Johnson",
      status: "Reserved"
    },
    {
      id: 9,
      courtName: "Court B",
      day: "Sunday",
      startTime: "12:00",
      endTime: "18:00",
      assignedTo: "Mary Wilson",
      status: "Available"
    }
  ]);
  
  const handleEditAvailability = (availability: AvailabilityType) => {
    showToast({ 
      title: "Edit Availability",
      description: `Editing ${availability.courtName} on ${availability.day}`,
      variant: "default"
    });
  };
  
  const handleDeleteAvailability = (availabilityId: number) => {
    const availability = availabilities.find(a => a.id === availabilityId);
    
    setAvailabilities(prevAvailabilities => 
      prevAvailabilities.filter(a => a.id !== availabilityId)
    );
    
    showToast({
      title: "Availability Deleted",
      description: `${availability?.courtName} on ${availability?.day} has been removed`,
      variant: "destructive"
    });
  };
  
  const handleToggleStatus = (availabilityId: number) => {
    setAvailabilities(prevAvailabilities => 
      prevAvailabilities.map(availability => 
        availability.id === availabilityId 
          ? { 
              ...availability, 
              status: availability.status === "Available" 
                ? "Reserved" 
                : availability.status === "Reserved" 
                  ? "Maintenance" 
                  : "Available" 
            } 
          : availability
      )
    );
    
    const availability = availabilities.find(a => a.id === availabilityId);
    const newStatus = availability?.status === "Available" 
      ? "Reserved" 
      : availability?.status === "Reserved" 
        ? "Maintenance" 
        : "Available";
    
    showToast({
      title: "Status Updated",
      description: `${availability?.courtName} on ${availability?.day} is now ${newStatus}`,
      variant: newStatus === "Available" ? "success" : newStatus === "Reserved" ? "default" : "destructive"
    });
  };
  
  const handleAddAvailability = () => {
    showToast({
      title: "Add Availability",
      description: "Availability creation form would open here",
      variant: "default"
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Available":
        return <Badge variant="success">{status}</Badge>;
      case "Reserved":
        return <Badge variant="default">{status}</Badge>;
      case "Maintenance":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredAvailabilities = availabilities.filter(availability => {
    const matchesSearch = 
      searchQuery === "" || 
      availability.courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      availability.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDay = 
      dayFilter === "all" || 
      availability.day.toLowerCase() === dayFilter.toLowerCase();
    
    return matchesSearch && matchesDay;
  });
  
  // Group availabilities by day for better visualization
  const availabilitiesByDay = filteredAvailabilities.reduce((acc, curr) => {
    const day = curr.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(curr);
    return acc;
  }, {} as Record<string, AvailabilityType[]>);
  
  // Days of the week for filtering
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
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
              placeholder="Search courts or staff..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={dayFilter}
            onValueChange={setDayFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Days</SelectItem>
              {daysOfWeek.map(day => (
                <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddAvailability}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add Availability</span>
        </Button>
      </div>
      
      {/* Weekly Schedule View */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-700">
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center">
                <div className="font-medium text-textDark dark:text-white mb-2">{day}</div>
                <div className={`bg-secondary dark:bg-gray-700 rounded-lg p-3 ${
                  dayFilter === "all" || dayFilter === day.toLowerCase() 
                    ? "ring-2 ring-primary/20" 
                    : ""
                }`}>
                  <p className="text-sm font-medium text-primary dark:text-blue-300">
                    {availabilitiesByDay[day]?.length || 0} slots
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Availabilities List */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-700">
          <CardTitle>Availability Management</CardTitle>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Court</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Day</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Time</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Staff</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAvailabilities.length > 0 ? (
                filteredAvailabilities.map((availability) => (
                  <TableRow key={availability.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <TableCell className="font-medium text-textDark dark:text-white">
                      {availability.courtName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-textLight dark:text-gray-400" />
                        {availability.day}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-textLight dark:text-gray-400" />
                        {availability.startTime} - {availability.endTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-textLight dark:text-gray-400" />
                        {availability.assignedTo}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(availability.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditAvailability(availability)}>
                          <Edit className="h-4 w-4 text-primary hover:text-blue-700" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(availability.id)}>
                          {availability.status === "Available" ? (
                            <span className="text-primary hover:text-blue-700">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5"></path>
                              </svg>
                            </span>
                          ) : availability.status === "Reserved" ? (
                            <span className="text-warning hover:text-yellow-700">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                              </svg>
                            </span>
                          ) : (
                            <span className="text-success hover:text-green-700">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                <path d="m9 12 2 2 4-4"></path>
                              </svg>
                            </span>
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAvailability(availability.id)}>
                          <Trash2 className="h-4 w-4 text-danger hover:text-red-700" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-textLight dark:text-gray-400">
                    No availabilities found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <CardFooter className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-textLight dark:text-gray-400">
            Showing {filteredAvailabilities.length} of {availabilities.length} availabilities
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
    </motion.div>
  );
}
