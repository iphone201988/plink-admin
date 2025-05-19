import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown } from "lucide-react";
import { EventItem } from "@/components/calendar/EventItem";
import { Event } from "@/types";

interface UpcomingEventsProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onAddEvent: () => void;
}

export function UpcomingEvents({ events, onEventClick, onAddEvent }: UpcomingEventsProps) {
  const [showAll, setShowAll] = useState(false);
  
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.startTimestamp);
    const dateB = new Date(b.startTimestamp);
    return dateA.getTime() - dateB.getTime();
  });
  
  const displayEvents = showAll ? sortedEvents : sortedEvents.slice(0, 7);
  const remainingCount = sortedEvents.length - 7;

  const today = new Date();
  // Only show upcoming events (events that haven't ended yet)
  const upcomingEvents = displayEvents.filter(event => {
    const endDate = new Date(event.endTimestamp);
    return endDate > today;
  });
  
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle>Upcoming Events</CardTitle>
          {/* <Button 
            onClick={onAddEvent} 
            size="sm"
            className="bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </Button> */}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <EventItem
                key={event._id}
                event={event}
                onClick={onEventClick}
              />
            ))
          ) : (
            <div className="text-center py-8 text-textLight dark:text-gray-400">
              No upcoming events scheduled
            </div>
          )}
        </motion.div>
        
        {remainingCount > 0 && !showAll && (
          <Button
            variant="ghost"
            className="w-full mt-4 text-primary hover:text-primary/80"
            onClick={() => setShowAll(true)}
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Show {remainingCount} more events
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
