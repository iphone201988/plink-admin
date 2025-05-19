import { motion } from "framer-motion";
import { Event } from "@/types";

interface EventItemProps {
  event: Event;
  borderColor?: string;
  onClick: (event: Event) => void;
}

export function EventItem({ event, onClick, borderColor = "primary" }: EventItemProps) {
  const getDateLabel = () => {
    const eventDate = new Date(event.startTimestamp);
    const today = new Date();
    
    // Check if it's today
    if (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    ) {
      return "Today";
    }
    
    // Format date as "MMM DD"
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[eventDate.getMonth()]} ${eventDate.getDate()}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  return (
    <motion.div 
      className="border-l-4 border-primary pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/20 cursor-pointer"
      onClick={() => onClick(event)}
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between">
        <h4 className="font-medium text-textDark dark:text-white">{event.court.title}</h4>
        <span className="text-xs bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">
          {getDateLabel()}
        </span>
      </div>
      <p className="text-sm text-textLight dark:text-gray-400">
        {formatTime(event.startTimestamp)} - {formatTime(event.endTimestamp)}
      </p>
      <p className="text-sm text-textLight dark:text-gray-400">{event.court.address}</p>
    </motion.div>
  );
}
