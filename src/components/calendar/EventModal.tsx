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
import { MapPin, Clock, Calendar, Users } from "lucide-react";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

export function EventModal({ isOpen, onClose, event }: EventModalProps) {
  if (!event) return null;
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
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
          <DialogTitle className="text-xl font-bold">{event.court.title}</DialogTitle>
          <DialogDescription>
            <span className="inline-block rounded text-xs font-medium mt-2">
              Hosted by {event.hostId.name}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-textDark dark:text-gray-200">Date</p>
              <p className="text-sm text-textLight dark:text-gray-400">{formatDate(event.startTimestamp)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-textDark dark:text-gray-200">Time</p>
              <p className="text-sm text-textLight dark:text-gray-400">
                {formatTime(event.startTimestamp)} - {formatTime(event.endTimestamp)}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-textDark dark:text-gray-200">Location</p>
              <p className="text-sm text-textLight dark:text-gray-400">{event.court.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <p className="font-medium text-textDark dark:text-gray-200">Players</p>
              <p className="text-sm text-textLight dark:text-gray-400">{event.playerCount} players</p>
            </div>
          </div>

          {event.court.description && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="font-medium text-textDark dark:text-gray-200 mb-1">Description</p>
              <p className="text-sm text-textLight dark:text-gray-400">{event.court.description}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Join Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}