import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types";

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

interface CalendarDay {
  date: number;
  currentMonth: boolean;
  today?: boolean;
  events: Event[];
  fullDate: Date;
}

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
  console.log("CalendarView events", events);
  
  // Debug: Log parsed events to see what dates we're getting
  console.log("Parsed events with dates:", events.map(event => ({
    id: event._id,
    court: event.court.title,
    startTimestamp: event.startTimestamp,
    parsedDate: new Date(event.startTimestamp),
    localDate: new Date(
      new Date(event.startTimestamp).getUTCFullYear(),
      new Date(event.startTimestamp).getUTCMonth(),
      new Date(event.startTimestamp).getUTCDate()
    )
  })));
  
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const isSameDay = (date1: Date, date2: Date) => {
    // Ensure we're comparing dates only (not time)
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() === d2.getTime();
  };
  
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      // Parse the UTC timestamp properly
      const eventDate = new Date(event.startTimestamp);
      // Create a local date for comparison
      const localEventDate = new Date(
        eventDate.getUTCFullYear(),
        eventDate.getUTCMonth(),
        eventDate.getUTCDate()
      );
      return isSameDay(localEventDate, date);
    });
  };
  
  const getMonthDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and how many days in month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Get previous month info
    const prevMonth = new Date(year, month - 1, 1);
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    // Add previous month days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = daysInPrevMonth - i;
      const fullDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), date);
      days.push({
        date,
        currentMonth: false,
        events: getEventsForDate(fullDate),
        fullDate
      });
    }
    
    // Add current month days
    for (let date = 1; date <= daysInMonth; date++) {
      const fullDate = new Date(year, month, date);
      const isToday = isSameDay(fullDate, today);
      
      days.push({
        date,
        currentMonth: true,
        today: isToday,
        events: getEventsForDate(fullDate),
        fullDate
      });
    }
    
    // Add next month days to complete the grid (6 weeks = 42 days)
    const nextMonth = new Date(year, month + 1, 1);
    const remainingDays = 42 - days.length;
    for (let date = 1; date <= remainingDays; date++) {
      const fullDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), date);
      days.push({
        date,
        currentMonth: false,
        events: getEventsForDate(fullDate),
        fullDate
      });
    }
    
    return days;
  };
  
  const calendarDays = getMonthDays();
  
  const formatEventTime = (startTime: string, endTime: string) => {
    // Parse UTC timestamps properly
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const formatTime = (date: Date) => {
      // Use UTC methods to avoid timezone issues
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  };
  
  const getEventColorClass = (event: Event, index: number) => {
    // Different colors for different events
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    ];
    return colors[index % colors.length];
  };
  
  const getMonthEventCount = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    return events.filter(event => {
      // Parse UTC timestamp properly
      const eventDate = new Date(event.startTimestamp);
      const localEventDate = new Date(
        eventDate.getUTCFullYear(),
        eventDate.getUTCMonth(),
        eventDate.getUTCDate()
      );
      return localEventDate.getMonth() === month && localEventDate.getFullYear() === year;
    }).length;
  };
  
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Calendar
          </CardTitle>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {getMonthEventCount()} events this month
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday}
              className="text-xs px-3 py-1"
            >
              Today
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateMonth(1)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {daysOfWeek.map((day) => (
            <div 
              key={day} 
              className="text-center font-medium text-gray-500 dark:text-gray-400 p-3 text-sm"
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <motion.div 
              key={`${day.fullDate.getTime()}-${index}`}
              className={`
                border border-gray-100 dark:border-gray-700 p-2 min-h-[120px] 
                calendar-cell transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50
                ${!day.currentMonth 
                  ? "bg-gray-50/50 dark:bg-gray-800/50" 
                  : day.today 
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" 
                    : "bg-white dark:bg-gray-800"
                }
              `}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
            >
              {/* Date number */}
              <div className={`
                text-right mb-2 text-sm font-medium
                ${day.today 
                  ? "text-blue-600 dark:text-blue-400" 
                  : day.currentMonth 
                    ? "text-gray-900 dark:text-white" 
                    : "text-gray-400 dark:text-gray-600"
                }
              `}>
                {day.date}
              </div>
              
              {/* Events */}
              <div className="space-y-1">
                {day.events?.slice(0, 3).map((event, eventIndex) => (
                  <motion.div 
                    key={event._id}
                    className={`
                      text-xs p-1.5 rounded cursor-pointer
                      ${getEventColorClass(event, eventIndex)}
                      hover:shadow-sm transition-all duration-200
                    `}
                    onClick={() => onEventClick(event)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium truncate text-xs">
                      {event.court.title}
                    </div>
                    <div className="text-xs opacity-75 truncate">
                      {formatEventTime(event.startTimestamp, event.endTimestamp)}
                    </div>
                    <div className="text-xs opacity-60">
                      {event.playerCount} player{event.playerCount !== 1 ? 's' : ''}
                    </div>
                  </motion.div>
                ))}
                
                {/* Show more indicator */}
                {day.events && day.events.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                    +{day.events.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
                <span>Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded"></div>
                <span>Today</span>
              </div>
            </div>
            <div className="text-xs">
              Total events: {events.length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}