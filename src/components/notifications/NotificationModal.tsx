import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toggleNotificationModal } from "@/store/slices/uiSlice";
import { showToast } from "@/lib/toastManager";

export function NotificationModal() {
  const dispatch = useDispatch();
  const { notificationModalOpen } = useSelector((state: any) => state.ui);
  
  const [recipientType, setRecipientType] = useState<"all" | "selected">("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [position, setPosition] = useState<"topLeft" | "topRight" | "bottomLeft" | "bottomRight">("topRight");
  
  const handleClose = () => {
    dispatch(toggleNotificationModal());
  };
  
  const handleSend = () => {
    if (!title.trim() || !message.trim()) {
      showToast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    // Implement sending notification logic here
    showToast({
      title: "Success",
      description: "Notification has been sent",
      variant: "default",
      position
    });
    
    // Reset form and close modal
    setTitle("");
    setMessage("");
    handleClose();
  };
  
  const positionMap = [
    { value: "topLeft", label: "Top Left" },
    { value: "topRight", label: "Top Right" },
    { value: "bottomLeft", label: "Bottom Left" },
    { value: "bottomRight", label: "Bottom Right" }
  ];
  
  return (
    <Dialog open={notificationModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-textDark dark:text-white">Send Notification</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <div className="text-sm font-medium text-textDark dark:text-white mb-2">Recipients</div>
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
              <Label className="flex items-center cursor-pointer mr-4">
                <RadioGroup value={recipientType} onValueChange={(value) => setRecipientType(value as "all" | "selected")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" checked={recipientType === "all"} />
                    <Label htmlFor="all" className="text-sm">All Users</Label>
                  </div>
                </RadioGroup>
              </Label>
              <Label className="flex items-center cursor-pointer">
                <RadioGroup value={recipientType} onValueChange={(value) => setRecipientType(value as "all" | "selected")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="selected" id="selected" checked={recipientType === "selected"} />
                    <Label htmlFor="selected" className="text-sm">Selected Users</Label>
                  </div>
                </RadioGroup>
              </Label>
            </div>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="notificationTitle" className="block text-sm font-medium text-textDark dark:text-white mb-2">
              Notification Title
            </Label>
            <Input
              id="notificationTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
              className="w-full"
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="notificationMessage" className="block text-sm font-medium text-textDark dark:text-white mb-2">
              Message
            </Label>
            <Textarea
              id="notificationMessage"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              className="w-full h-24"
            />
          </div>
          
          <div>
            <div className="block text-sm font-medium text-textDark dark:text-white mb-2">Toast Position</div>
            <div className="grid grid-cols-2 gap-2">
              {positionMap.map((pos) => (
                <Button
                  key={pos.value}
                  type="button"
                  variant={position === pos.value ? "default" : "outline"}
                  onClick={() => setPosition(pos.value as any)}
                  className={position === pos.value ? "bg-primary text-white" : "border-gray-200 text-textDark dark:text-white dark:border-gray-700"}
                >
                  {pos.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSend}>
            Send Notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
