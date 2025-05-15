import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventItem } from "@/components/calendar/EventItem";
import { Event } from "@/types";

interface UpcomingEventsProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onAddEvent: () => void;
}

export function UpcomingEvents({ events, onEventClick, onAddEvent }: UpcomingEventsProps) {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-700">
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event, index) => (
              <EventItem 
                key={index} 
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
      </CardContent>
      
      <CardFooter className="p-4 border-t border-gray-100 dark:border-gray-700">
        <Button 
          onClick={onAddEvent} 
          className="w-full py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Event
        </Button>
      </CardFooter>
    </Card>
  );
}
