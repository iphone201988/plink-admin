import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GroupModal } from "@/components/groups/GroupModal";
import { DeleteConfirmationDialog } from "@/components/ui/DeleteConfirmationDialog";
import { showToast } from "@/lib/toastManager";
import { Group } from "@/types";
import { pageTransition } from "@/lib/animations";
import { useDeleteGroupMutation, useEditGroupMutation, useGetGroupDataQuery } from "@/api";
import { formatISODate } from "@/lib/helper";

export default function GroupManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: groupData } = useGetGroupDataQuery({
    page: currentPage,
    limit: 6
  });
 const [editGroup] =  useEditGroupMutation()
  const [deleteGroup] = useDeleteGroupMutation();
  
  const totalPages = groupData?.pagination?.totalPages || 1;

  
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  
  const groups = useMemo(() => {
    return (groupData?.groups || []).map((group: any) => ({
      id: group?._id,
      name: group?.groupName,
      description: group?.groupDescription,
      members: group?.participants?.length || 0,
      colorScheme: group?.colorScheme || "blue",
      createdAt: formatISODate(group?.createdAt)
    }));
  }, [groupData]);
  

  
  const handleEditGroup = (group: Group) => {
    setActiveGroup(group);
    setShowGroupModal(true);
  };
  
  const handleUpdateGroup = async(groupData: Partial<Group>) => {
    if (activeGroup) {
      // setGroups(prevGroups => 
      //   prevGroups.map(group => 
      //     group.id === activeGroup.id ? { ...group, ...groupData } : group
      //   )
      // );

     await editGroup({
        id:activeGroup.id,
        body:{groupName:groupData.name,
          groupDescription : groupData.description,
        }
      }).unwrap();

      
      showToast({ 
        title: "Group Updated",
        description: `${groupData.name || activeGroup.name} was updated successfully`,
        variant: "success"
      });
    }
  };
  
  const handleDeleteGroup = (group: Group) => {
    setActiveGroup(group);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteGroup = async() => {
    if (activeGroup) {
      // setGroups(prevGroups => prevGroups.filter(group => group.id !== activeGroup.id));
      deleteGroup
      showToast({
        title: "Group Deleted",
        description: `${activeGroup.name} has been removed`,
        variant: "destructive"
      });

     await deleteGroup({
        id:activeGroup.id
      }).unwrap();
      
      // Close the dialog
      setShowDeleteDialog(false);
      setActiveGroup(null);
    }
  };
  
  const handleAddGroup = () => {
    setActiveGroup(null);
    setShowGroupModal(true);
  };
  
  const handleViewMembers = (group: Group) => {
    showToast({
      title: `${group.name} Members`,
      description: `Viewing ${group.members} members`,
      variant: "default"
    });
  };
  
  const filteredGroups = groups.filter((group:any) => {
    return (
      searchQuery === "" || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* <Button onClick={handleAddGroup}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add Group</span>
        </Button> */}
      </div>
      
      {/* Groups List */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-700">
          <CardTitle>Group Management</CardTitle>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Group</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Description</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Members</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Created</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group:any) => (
                  <TableRow key={group.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <TableCell>
                      <div className="flex items-center">
                        <Badge className={`bg-${group.colorScheme}-100 text-${group.colorScheme}-600 dark:bg-${group.colorScheme}-900/30 dark:text-${group.colorScheme}-300 mr-3`}>
                          {group.name.substring(0, 2).toUpperCase()}
                        </Badge>
                        <span className="font-medium text-textDark dark:text-white">{group.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-textLight dark:text-gray-400">{group.description}</TableCell>
                    <TableCell className="text-textDark dark:text-white font-medium">{group.members}</TableCell>
                    <TableCell className="text-textLight dark:text-gray-400">{group.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewMembers(group)}>
                          <Users className="h-4 w-4 text-primary hover:text-blue-700" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditGroup(group)}>
                          <Edit className="h-4 w-4 text-primary hover:text-blue-700" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteGroup(group)}>
                          <Trash2 className="h-4 w-4 text-danger hover:text-red-700" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-textLight dark:text-gray-400">
                    No groups found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <CardFooter className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-textLight dark:text-gray-400">
            Showing {groupData?.pagination?.perPage} of {groupData?.pagination?.totalItems} users
          </p>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textLight dark:text-gray-400"
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className="w-8 h-8"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-textLight dark:text-gray-400"
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Group edit/add modal */}
      <GroupModal 
        isOpen={showGroupModal}
        onClose={() => {
          setShowGroupModal(false);
          setActiveGroup(null);
        }}
        onSubmit={handleUpdateGroup}
        group={activeGroup || undefined}
      />
      
      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog 
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setActiveGroup(null);
        }}
        onConfirm={confirmDeleteGroup}
        title="Delete Group"
        description={`Are you sure you want to delete the group "${activeGroup?.name}"? This action cannot be undone.`}
      />
    </motion.div>
  );
}
