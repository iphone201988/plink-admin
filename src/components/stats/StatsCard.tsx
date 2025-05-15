import { motion } from "framer-motion";
import { 
  Users, Volleyball, CalendarCheck, Star, 
  ArrowUp, ArrowDown, Minus 
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: "users" | "courts" | "events" | "rating";
  change: number;
  changePeriod?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  changePeriod = "Since last month" 
}: StatsCardProps) {
  const getIconComponent = () => {
    switch (icon) {
      case "users":
        return <Users className="w-5 h-5" />;
      case "courts":
        return <Volleyball className="w-5 h-5" />;
      case "events":
        return <CalendarCheck className="w-5 h-5" />;
      case "rating":
        return <Star className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getIconBackground = () => {
    switch (icon) {
      case "users":
        return "bg-blue-100 text-primary";
      case "courts":
        return "bg-green-100 text-success";
      case "events":
        return "bg-yellow-100 text-warning";
      case "rating":
        return "bg-red-100 text-danger";
      default:
        return "bg-blue-100 text-primary";
    }
  };

  const getChangeColor = () => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-danger";
    return "text-warning";
  };

  const getChangeIcon = () => {
    if (change > 0) return <ArrowUp className="w-3 h-3 mr-1" />;
    if (change < 0) return <ArrowDown className="w-3 h-3 mr-1" />;
    return <Minus className="w-3 h-3 mr-1" />;
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform hover:scale-[1.01] transition-transform"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${getIconBackground()}`}>
          {getIconComponent()}
        </div>
        <div className="ml-5">
          <h4 className="text-textLight dark:text-gray-400 text-sm">{title}</h4>
          <h3 className="text-2xl font-bold text-textDark dark:text-white">{value}</h3>
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs">
        <span className={`flex items-center ${getChangeColor()}`}>
          {getChangeIcon()}
          {Math.abs(change)}%
        </span>
        <span className="text-textLight dark:text-gray-400 ml-2">{changePeriod}</span>
      </div>
    </motion.div>
  );
}
