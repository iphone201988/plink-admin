import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Plus, 
  Bell, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { showToast } from "@/lib/toastManager";
import { useDispatch } from "react-redux";
import { toggleNotificationModal } from "@/store/slices/uiSlice";
import { Notification } from "@/types";
import { pageTransition, slideUp, staggerContainer } from "@/lib/animations";

export default function Notifications() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("sent");
  
  // Sample data - in a real app, this would come from API
  const [sentNotifications, setSentNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "System Maintenance",
      message: "The system will be unavailable for maintenance on Saturday from 2-4 AM.",
      type: "system",
      recipients: "All Users",
      sentAt: "2023-07-18 10:30",
      status: "Delivered",
      readCount: 245,
      totalRecipients: 300
    },
    {
      id: 2,
      title: "New Tournament Announced",
      message: "Join our Summer Tennis Tournament starting next weekend!",
      type: "event",
      recipients: "Tennis Club",
      sentAt: "2023-07-17 14:15",
      status: "Delivered",
      readCount: 41,
      totalRecipients: 65
    },
    {
      id: 3,
      title: "Court Closures",
      message: "Courts A and B will be closed for maintenance on Friday.",
      type: "alert",
      recipients: "All Users",
      sentAt: "2023-07-16 09:00",
      status: "Delivered",
      readCount: 180,
      totalRecipients: 300
    },
    {
      id: 4,
      title: "Payment Reminder",
      message: "Your monthly membership fee is due in 3 days.",
      type: "reminder",
      recipients: "Selected Users (28)",
      sentAt: "2023-07-15 08:30",
      status: "Delivered",
      readCount: 20,
      totalRecipients: 28
    },
    {
      id: 5,
      title: "Welcome to New Members",
      message: "We're excited to welcome all our new members who joined this month!",
      type: "message",
      recipients: "New Members (15)",
      sentAt: "2023-07-12 11:45",
      status: "Delivered",
      readCount: 12,
      totalRecipients: 15
    }
  ]);
  
  const [draftNotifications, setDraftNotifications] = useState<Notification[]>([
    {
      id: 6,
      title: "Upcoming Event Reminder",
      message: "Don't forget about the community match this weekend!",
      type: "event",
      recipients: "All Users",
      status: "Draft",
      sentAt: "",
      readCount: 0,
      totalRecipients: 300
    },
    {
      id: 7,
      title: "Survey Request",
      message: "Please take a moment to complete our satisfaction survey.",
      type: "message",
      recipients: "Active Members",
      status: "Draft",
      sentAt: "",
      readCount: 0,
      totalRecipients: 250
    }
  ]);
  
  const handleViewNotification = (notification: Notification) => {
    showToast({ 
      title: "View Notification",
      description: `Viewing details for "${notification.title}"`,
      variant: "default"
    });
  };
  
  const handleEditNotification = (notification: Notification) => {
    dispatch(toggleNotificationModal());
  };
  
  const handleDeleteNotification = (notificationId: number) => {
    const isFromSent = sentNotifications.some(n => n.id === notificationId);
    const notification = isFromSent 
      ? sentNotifications.find(n => n.id === notificationId)
      : draftNotifications.find(n => n.id === notificationId);
    
    if (isFromSent) {
      setSentNotifications(prev => prev.filter(n => n.id !== notificationId));
    } else {
      setDraftNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
    
    showToast({
      title: "Notification Deleted",
      description: `"${notification?.title}" has been removed`,
      variant: "destructive"
    });
  };
  
  const handleResendNotification = (notification: Notification) => {
    showToast({
      title: "Notification Resent",
      description: `"${notification.title}" has been resent to recipients`,
      variant: "success"
    });
  };
  
  const handleAddNotification = () => {
    dispatch(toggleNotificationModal());
  };
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case "system":
        return <Info className="h-4 w-4 text-primary" />;
      case "event":
        return <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "reminder":
        return <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getTypeBadge = (type: string) => {
    switch(type) {
      case "system":
        return <Badge variant="outline" className="bg-blue-100 text-primary dark:bg-blue-900/30 dark:text-blue-300">{type}</Badge>;
      case "event":
        return <Badge variant="outline" className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300">{type}</Badge>;
      case "alert":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">{type}</Badge>;
      case "reminder":
        return <Badge variant="outline" className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">{type}</Badge>;
      case "message":
        return <Badge variant="outline" className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };
  
  const getActiveData = () => {
    return activeTab === "sent" ? sentNotifications : draftNotifications;
  };
  
  const filteredData = getActiveData().filter(notification => {
    const matchesSearch = 
      searchQuery === "" || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.recipients.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || 
      notification.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  const getReadPercentage = (notification: Notification) => {
    if (notification.totalRecipients === 0) return 0;
    return Math.round((notification.readCount / notification.totalRecipients) * 100);
  };
  
  // Get unique notification types for filtering
  const notificationTypes = Array.from(
    new Set([...sentNotifications, ...draftNotifications].map(n => n.type))
  );
  
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Notification Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={staggerContainer}
      >
        <motion.div variants={slideUp}>
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-textLight dark:text-gray-400">Total Notifications</p>
                  <p className="text-2xl font-bold text-textDark dark:text-white">{sentNotifications.length + draftNotifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={slideUp}>
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-success">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-textLight dark:text-gray-400">Sent Notifications</p>
                  <p className="text-2xl font-bold text-textDark dark:text-white">{sentNotifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={slideUp}>
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-warning">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-textLight dark:text-gray-400">Total Recipients</p>
                  <p className="text-2xl font-bold text-textDark dark:text-white">
                    {sentNotifications.reduce((sum, n) => sum + n.totalRecipients, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Tabs and Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Tabs defaultValue="sent" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search notifications..."
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {notificationTypes.map(type => (
                <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddNotification}>
            <Plus className="h-4 w-4 mr-2" />
            <span>New Notification</span>
          </Button>
        </div>
      </div>
      
      {/* Notifications List */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-700">
          <CardTitle>{activeTab === "sent" ? "Sent Notifications" : "Draft Notifications"}</CardTitle>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Title</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Recipients</TableHead>
                {activeTab === "sent" && (
                  <>
                    <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Sent</TableHead>
                    <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Read</TableHead>
                  </>
                )}
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((notification) => (
                  <TableRow key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <TableCell className="font-medium text-textDark dark:text-white">
                      <div className="flex items-center">
                        <span className="mr-2">{getTypeIcon(notification.type)}</span>
                        <div>
                          <p>{notification.title}</p>
                          <p className="text-xs text-textLight dark:text-gray-400 mt-1 line-clamp-1">{notification.message}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(notification.type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-textLight dark:text-gray-400" />
                        <span>{notification.recipients}</span>
                      </div>
                    </TableCell>
                    {activeTab === "sent" && (
                      <>
                        <TableCell>
                          <div className="flex items-center text-textLight dark:text-gray-400">
                            <Clock className="h-4 w-4 mr-1" />
                            {notification.sentAt}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${getReadPercentage(notification)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-textLight dark:text-gray-400">
                              {notification.readCount}/{notification.totalRecipients}
                            </span>
                          </div>
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewNotification(notification)}
                        >
                          View
                        </Button>
                        
                        {activeTab === "drafts" ? (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleEditNotification(notification)}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={() => handleResendNotification(notification)}
                          >
                            Resend
                          </Button>
                        )}
                        
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={activeTab === "sent" ? 6 : 4} 
                    className="text-center py-8 text-textLight dark:text-gray-400"
                  >
                    No notifications found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <CardFooter className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-textLight dark:text-gray-400">
            Showing {filteredData.length} of {getActiveData().length} {activeTab === "sent" ? "sent" : "draft"} notifications
          </p>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textLight dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>
            <Button variant="default" size="icon" className="w-8 h-8">1</Button>
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 text-textDark dark:text-white border-gray-200 dark:border-gray-700">2</Button>
            <Button variant="outline" size="icon" className="w-8 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textLight dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
