import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Ban, Trash2, CheckCircle } from "lucide-react";
import { User } from "@/types";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}

export function UserCard({ user, onEdit, onToggleStatus, onDelete }: UserCardProps) {
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex flex-col items-center">
          <div className={`w-16 h-16 rounded-full bg-${user.colorScheme}-100 flex items-center justify-center text-${user.colorScheme}-600 text-xl font-medium mb-3`}>
            {initials}
          </div>
          
          <h3 className="text-lg font-semibold text-textDark dark:text-white">{user.firstName} {user.lastName}</h3>
          <p className="text-textLight dark:text-gray-400 text-sm mb-2">{user.email}</p>
          
          <Badge 
            variant={user.status === "Active" ? "success" : "destructive"} 
            className="mb-3 capitalize"
          >
            {user.status}
          </Badge>
          
          <div className="flex flex-wrap justify-center gap-1 mb-4">
            {user.groups?.map((group, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className={`bg-${group.color}-100 text-${group.color}-600 border-none`}
              >
                {group.name}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-center space-x-3 w-full">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(user)}
              className="text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleStatus}
              className={
                user.status === "Active" 
                  ? "text-warning hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300" 
                  : "text-success hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              }
            >
              {user.status === "Active" ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete}
              className="text-danger hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
