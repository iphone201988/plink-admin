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

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
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
  
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1).getDay();
    
    // Last day of the month
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    // Last day of the previous month
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDate - i,
        currentMonth: false,
        events: []
      });
    }
    
    // Current month days
    const today = new Date();
    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      const isToday = 
        today.getDate() === i && 
        today.getMonth() === month && 
        today.getFullYear() === year;
      
      // Find events for this day
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === i &&
          eventDate.getMonth() === month &&
          eventDate.getFullYear() === year
        );
      });
      
      days.push({
        date: i,
        currentMonth: true,
        today: isToday,
        events: dayEvents
      });
    }
    
    // Next month days to fill the calendar grid
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        currentMonth: false,
        events: []
      });
    }
    
    return days;
  };
  
  const calendarDays = getMonthDays();
  
  const getEventColorClass = (eventType: string) => {
    switch(eventType) {
      case "tournament":
        return "bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-300";
      case "maintenance":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300";
      case "league":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300";
      case "training":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-textDark dark:text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-textLight dark:text-gray-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateMonth(1)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-textLight dark:text-gray-400"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center font-medium text-textLight dark:text-gray-400 p-2">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`border border-gray-100 dark:border-gray-700 p-2 calendar-cell ${
                !day.currentMonth 
                  ? "text-gray-400 dark:text-gray-600" 
                  : day.today 
                    ? "bg-blue-50 dark:bg-blue-900/20" 
                    : ""
              }`}
            >
              <div className={`text-right mb-1 ${
                day.today 
                  ? "font-medium text-primary dark:text-blue-300" 
                  : day.currentMonth 
                    ? "text-textDark dark:text-white" 
                    : ""
              }`}>
                {day.date}
              </div>
              
              {day.events?.map((event, eventIndex) => (
                <motion.div 
                  key={eventIndex}
                  className={`calendar-event text-xs p-1 rounded ${getEventColorClass(event.type)} mb-1 cursor-pointer`}
                  onClick={() => onEventClick(event)}
                  whileHover={{ scale: 1.03 }}
                >
                  {event.title}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
