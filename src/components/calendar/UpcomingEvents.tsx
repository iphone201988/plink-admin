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
  
  const today = new Date();
  
  // First filter for upcoming events, then sort
  const upcomingEvents = events
    .filter(event => {
      const endDate = new Date(event.endTimestamp);
      return endDate > today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.startTimestamp);
      const dateB = new Date(b.startTimestamp);
      return dateA.getTime() - dateB.getTime();
    });
  
  // Then slice based on showAll state
  const displayEvents = showAll ? upcomingEvents : upcomingEvents.slice(0, 7);
  const remainingCount = upcomingEvents.length - 7;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          Upcoming Events
        </CardTitle>
        <Button
          onClick={onAddEvent}
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {displayEvents.length > 0 ? (
          displayEvents.map((event) => (
            <EventItem
              key={event._id}
              event={event}
              onClick={() => onEventClick(event)}
            />
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No upcoming events scheduled
          </div>
        )}
        
        {remainingCount > 0 && !showAll && (
          <Button
            variant="ghost"
            className="w-full"
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