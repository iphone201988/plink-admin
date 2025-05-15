import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { MapPin, Clock, Calendar, Tag } from "lucide-react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export function EventModal({ isOpen, onClose, event }: EventModalProps) {
  if (!event) return null;
  
  const getEventTypeColor = (type: string) => {
    switch(type) {
      case "tournament":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300";
      case "maintenance":
        return "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300";
      case "league":
        return "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300";
      case "training":
        return "text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  const formatEventType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{event.title}</DialogTitle>
          <DialogDescription>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${getEventTypeColor(event.type)}`}>
              {formatEventType(event.type)}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-textDark dark:text-gray-200">Date</p>
              <p className="text-sm text-textLight dark:text-gray-400">{formatDate(event.date)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-textDark dark:text-gray-200">Time</p>
              <p className="text-sm text-textLight dark:text-gray-400">{event.time}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-textDark dark:text-gray-200">Location</p>
              <p className="text-sm text-textLight dark:text-gray-400">{event.location}</p>
            </div>
          </div>
          
          {event.description && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="font-medium text-textDark dark:text-gray-200 mb-1">Description</p>
              <p className="text-sm text-textLight dark:text-gray-400">{event.description}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Edit Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}