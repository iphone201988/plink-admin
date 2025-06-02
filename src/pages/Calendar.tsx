import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarView } from "@/components/calendar/CalendarView";
import { UpcomingEvents } from "@/components/calendar/UpcomingEvents";
import { EventModal } from "@/components/calendar/EventModal";
import { showToast } from "@/lib/toastManager";
import { Event } from "@/types";
import { pageTransition } from "@/lib/animations";
import { useGetGameEventsQuery } from "@/api";

// Skeleton Components
const SkeletonCalendarView = () => (
  <Card className="h-full">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
        <div className="h-6 bg-gray-100 rounded w-32 animate-pulse" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-7 bg-gray-200 rounded w-28 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div key={i} className="p-2 text-center text-sm font-medium text-gray-400 bg-gray-50 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-8 mx-auto" />
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-t border-l">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="min-h-[100px] border-r border-b bg-white p-2 relative">
            <div className="h-4 bg-gray-200 rounded w-6 animate-pulse mb-2" />
            {/* Random event placeholders */}
            {Math.random() > 0.7 && (
              <div className="h-2 bg-blue-100 rounded w-full animate-pulse mb-1" />
            )}
            {Math.random() > 0.8 && (
              <div className="h-2 bg-green-100 rounded w-3/4 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const SkeletonUpcomingEvents = () => (
  <Card className="h-full">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-3 border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
              <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const SkeletonFilterSelect = () => (
  <div className="w-[180px] h-10 bg-gray-200 rounded animate-pulse" />
);

export default function Calendar() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: gameEvents, isLoading } = useGetGameEventsQuery();

  const events = React.useMemo(() =>
    gameEvents?.allGames || [],
    [gameEvents?.allGames]
  );
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  const handleAddEvent = () => {
    showToast({
      title: "Add Event",
      description: "Event creation form would open here",
      variant: "default"
    });
  };
  
  const filteredEvents = events.filter((event: any) => {
    return typeFilter === "all" || event.type === typeFilter;
  });

  if (isLoading) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Skeleton Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <SkeletonFilterSelect />
        </div>
        
        {/* Skeleton Calendar & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <SkeletonCalendarView />
          </div>
          
          <div>
            <SkeletonUpcomingEvents />
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <Select
          value={typeFilter}
          onValueChange={setTypeFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="tournament">Tournaments</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="league">Leagues</SelectItem>
            <SelectItem value="training">Training</SelectItem>
          </SelectContent>
        </Select>
        {/* <Button onClick={handleAddEvent}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add Event</span>
        </Button> */}
      </div>
      
      {/* Calendar & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <CalendarView events={filteredEvents} onEventClick={handleEventClick} />
        </div>
        
        <div>
          <UpcomingEvents 
            events={filteredEvents} 
            onEventClick={handleEventClick} 
            onAddEvent={handleAddEvent} 
          />
        </div>
      </div>
      
      {/* Event Detail Modal */}
      <EventModal 
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        event={selectedEvent}
      />
    </motion.div>
  );
}