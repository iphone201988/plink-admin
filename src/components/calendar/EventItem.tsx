import { motion } from "framer-motion";
import { Event } from "@/types";

interface EventItemProps {
  event: Event;
  borderColor?: string;
  onClick: (event: Event) => void;
}

export function EventItem({ event, onClick, borderColor = "primary" }: EventItemProps) {
  const getDateLabel = () => {
    const eventDate = new Date(event.date);
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
  
  const getBadgeColor = () => {
    switch(event.type) {
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

  const getBorderColor = () => {
    switch(event.type) {
      case "tournament":
        return "border-primary";
      case "maintenance":
        return "border-purple-500";
      case "league":
        return "border-green-500";
      case "training":
        return "border-yellow-500";
      default:
        return "border-gray-500";
    }
  };
  
  return (
    <motion.div 
      className={`border-l-4 ${getBorderColor()} pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/20 cursor-pointer`}
      onClick={() => onClick(event)}
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between">
        <h4 className="font-medium text-textDark dark:text-white">{event.title}</h4>
        <span className={`text-xs ${getBadgeColor()} px-2 py-1 rounded`}>
          {getDateLabel()}
        </span>
      </div>
      <p className="text-sm text-textLight dark:text-gray-400">{event.time}</p>
      <p className="text-sm text-textLight dark:text-gray-400">{event.location}</p>
    </motion.div>
  );
}
