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

export default function Calendar() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const {data:gameEvents} = useGetGameEventsQuery();

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
  
  const filteredEvents = events.filter((event:any) => {
    return typeFilter === "all" || event.type === typeFilter;
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
