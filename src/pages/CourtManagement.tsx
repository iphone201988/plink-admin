import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, MapPin,ShieldCheck  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { showToast } from "@/lib/toastManager";
import { Court } from "@/types";
import { pageTransition } from "@/lib/animations";
import { useDeleteCourtMutation, useGetCourtsQuery } from "@/api";
import { getCourtTypeKey } from "@/lib/helper";
import { toast } from "@/hooks/use-toast";
import { CourtModal } from "@/components/court/CourModal";

export default function CourtManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [addCourt, setAddCourt] = useState<boolean>(false);

  const [deleteCourt] =useDeleteCourtMutation()

  const {data:courtData} = useGetCourtsQuery({
    page: currentPage
  });


  console.log("courtData", courtData);

  const courts = useMemo(() => {
    return (courtData?.courts || []).map((court: any) => ({
      id: court?._id,
      name: court?.title,
      location: court?.address,
      status: court?.status,
      courtType: getCourtTypeKey(court?.courtType),
      capacity:court?.courtCount,
      amenities: ["Lighting", "Seating", "Water Station"]
    }));
  }, [courtData]);
  
  
  const handleEditCourt = (court: Court) => {
    toast({ 
      title: "pending",
      description: `this functionality is under development`,
      variant: "destructive"
    });
  };
  
  const handleDeleteCourt = async(courtId: number) => {
     deleteCourt({
      type:1,
      courtId:courtId
    }).unwrap()
    const court = courts.find((c:any) => c.id === courtId);
    toast({
      title: "Court Deleted",
      description: `${court?.name} has been removed`,
      variant: "success",
      position: "topRight"
    });
  };
  
  const handleToggleCourtStatus = (courtId: number) => {
    deleteCourt({
      type:2,
      courtId:courtId
    }).unwrap()
    
    const court = courts.find((c:any) => c.id === courtId);
    const newStatus = court?.status === "active" ? "Maintenance" : "Active";

    toast({
      title: "Status Updated",
      description: `${court?.name} is now in ${newStatus}`,
      variant: newStatus === "Active" ? "success" : "destructive",
      position: "topRight"
    });
  };
  
  const handleAddCourt = () => {
    // toast({
    //   title: "Add Court",
    //   description: "Court creation form would open here",
    //   variant: "default"
    // });
    setAddCourt(true);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "active":
        return <Badge variant="success">{status}</Badge>;
      case "maintenance":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredCourts = courts.filter((court:any) => {
    const matchesSearch = 
      searchQuery === "" || 
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.courtType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      court.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
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
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search courts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddCourt}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add Court</span>
        </Button>
      </div>
      
      {/* Courts List */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle>Court Management</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === "table" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("table")}
                className="px-3 py-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="3" y1="15" x2="21" y2="15"></line>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
              </Button>
              <Button 
                variant={viewMode === "card" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("card")}
                className="px-3 py-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Court Name</TableHead>
                  <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Location</TableHead>
                  <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">court Type</TableHead>
                  <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Court Count</TableHead>
                  <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Amenities</TableHead>
                  <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourts.length > 0 ? (
                  filteredCourts.map((court:any) => (
                    <TableRow key={court.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <TableCell className="font-medium text-textDark dark:text-white">
                        {court.name}
                      </TableCell>
                      <TableCell className="text-textLight dark:text-gray-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-textLight dark:text-gray-400" />
                          {court.location}
                        </div>
                      </TableCell>
                      <TableCell>{court.courtType}</TableCell>
                      <TableCell>{getStatusBadge(court.status)}</TableCell>
                      <TableCell>{court.capacity}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {court.amenities.map((amenity:any, index:any) => (
                            <Badge key={index} variant="outline" className="bg-secondary dark:bg-gray-700">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCourt(court)}>
                            <Edit className="h-4 w-4 text-primary hover:text-blue-700" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleToggleCourtStatus(court.id)}>
                            {court.status !== "active" ? (
                              <span className="text-warning hover:text-yellow-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M6 12h12"></path>
                                </svg>
                              </span>
                            ) : (
                              <span className="text-success hover:text-green-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6 9 17l-5-5"></path>
                                </svg>
                              </span>
                            )}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCourt(court.id)}>
                            <Trash2 className="h-4 w-4 text-danger hover:text-red-700" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-textLight dark:text-gray-400">
                      No courts found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourts.length > 0 ? (
              filteredCourts.map((court:any) => (
                <motion.div
                  key={court.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-textDark dark:text-white">{court.name}</h3>
                          <p className="text-sm text-textLight dark:text-gray-400 flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {court.location}
                          </p>
                        </div>
                        {getStatusBadge(court.status)}
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div>
                          <p className="text-sm font-medium text-textDark dark:text-white">court Type</p>
                          <p className="text-sm text-textLight dark:text-gray-400">{court.courtType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-textDark dark:text-white">Capacity</p>
                          <p className="text-sm text-textLight dark:text-gray-400">{court.capacity}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-textDark dark:text-white">Amenities</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {court.amenities.map((amenity:any, index:any) => (
                              <Badge key={index} variant="outline" className="bg-secondary dark:bg-gray-700">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Button variant="outline" size="sm" onClick={() => handleEditCourt(court)} className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant={court.status === "Active" ? "destructive" : "default"} 
                          size="sm" 
                          onClick={() => handleToggleCourtStatus(court.id)}
                          className="flex-1"
                        >
                          {court.status === "active" ? "Maintenance" : "Activate"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-textLight dark:text-gray-400">
                No courts found matching your criteria
              </div>
            )}
          </CardContent>
        )}
        
        <CardFooter className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-textLight dark:text-gray-400">
            Showing {courtData?.pagination?.perPage} of {courtData?.pagination?.totalItems} users
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
            {Array.from({ length:courtData?.pagination?.totalPages }, (_, i) => i + 1).map((page) => (
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
              onClick={() => currentPage < courtData?.pagination?.totalPages  && handlePageChange(currentPage + 1)}
              disabled={currentPage === courtData?.pagination?.totalPages }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CourtModal
      isOpen={addCourt}
      onClose={() => setAddCourt(false)}

      />

    </motion.div>
  );
}
