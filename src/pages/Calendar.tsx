import { useState } from "react";
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

export default function Calendar() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Sample data - in a real app, this would come from API
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
    },
    {
      id: 5,
      title: "Community Match",
      date: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
      time: "2:00 PM - 4:00 PM",
      location: "Court 2",
      type: "tournament"
    },
    {
      id: 6,
      title: "Youth Program",
      date: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
      time: "3:30 PM - 5:30 PM",
      location: "Courts 1-2",
      type: "training"
    },
    {
      id: 7,
      title: "Equipment Check",
      date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      time: "8:00 AM - 9:00 AM",
      location: "All Courts",
      type: "maintenance"
    }
  ]);
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  const handleAddEvent = () => {
    // Open event form/modal
    showToast({
      title: "Add Event",
      description: "Event creation form would open here",
      variant: "default"
    });
  };
  
  const filteredEvents = events.filter(event => {
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
        <Button onClick={handleAddEvent}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add Event</span>
        </Button>
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
