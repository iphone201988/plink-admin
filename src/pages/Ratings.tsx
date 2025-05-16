import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, UserRound, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Rating } from "@/types";
import { pageTransition, slideUp, staggerContainer } from "@/lib/animations";

// Simple component for star ratings display
const StarRating = ({ rating }: { rating: number }) => {
  // Ensure rating is a number to prevent toFixed errors
  const numericRating = typeof rating === 'number' ? rating : 0;
  
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= numericRating
              ? "text-warning fill-warning"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-textDark dark:text-white">
        {numericRating.toFixed(1)}
      </span>
    </div>
  );
};

export default function Ratings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("courts");
  
  // Sample data - in a real app, this would come from API
  const [courtRatings, setCourtRatings] = useState<Rating[]>([
    {
      id: 1,
      entityName: "Main Court",
      entityType: "court",
      rating: 4.8,
      reviewCount: 125,
      lastRated: "2023-07-18",
      categories: {
        cleanliness: 4.9,
        maintenance: 4.7,
        staff: 4.8,
        amenities: 4.6
      }
    },
    {
      id: 2,
      entityName: "Court A",
      entityType: "court",
      rating: 4.5,
      reviewCount: 98,
      lastRated: "2023-07-15",
      categories: {
        cleanliness: 4.3,
        maintenance: 4.6,
        staff: 4.7,
        amenities: 4.4
      }
    },
    {
      id: 3,
      entityName: "Court B",
      entityType: "court",
      rating: 3.9,
      reviewCount: 87,
      lastRated: "2023-07-17",
      categories: {
        cleanliness: 3.7,
        maintenance: 3.8,
        staff: 4.2,
        amenities: 3.9
      }
    },
    {
      id: 4,
      entityName: "Youth Court",
      entityType: "court",
      rating: 4.6,
      reviewCount: 65,
      lastRated: "2023-07-10",
      categories: {
        cleanliness: 4.7,
        maintenance: 4.5,
        staff: 4.8,
        amenities: 4.4
      }
    },
    {
      id: 5,
      entityName: "Practice Court",
      entityType: "court",
      rating: 4.2,
      reviewCount: 42,
      lastRated: "2023-07-12",
      categories: {
        cleanliness: 4.0,
        maintenance: 4.1,
        staff: 4.5,
        amenities: 4.0
      }
    }
  ]);
  
  const [staffRatings, setStaffRatings] = useState<Rating[]>([
    {
      id: 1,
      entityName: "John Doe",
      entityType: "staff",
      rating: 4.9,
      reviewCount: 87,
      lastRated: "2023-07-18",
      categories: {
        knowledge: 4.9,
        friendliness: 5.0,
        responsiveness: 4.8,
        professionalism: 4.9
      }
    },
    {
      id: 2,
      entityName: "Jane Smith",
      entityType: "staff",
      rating: 4.7,
      reviewCount: 65,
      lastRated: "2023-07-16",
      categories: {
        knowledge: 4.8,
        friendliness: 4.9,
        responsiveness: 4.5,
        professionalism: 4.6
      }
    },
    {
      id: 3,
      entityName: "Robert Johnson",
      entityType: "staff",
      rating: 4.3,
      reviewCount: 56,
      lastRated: "2023-07-15",
      categories: {
        knowledge: 4.5,
        friendliness: 4.1,
        responsiveness: 4.2,
        professionalism: 4.4
      }
    },
    {
      id: 4,
      entityName: "Mary Wilson",
      entityType: "staff",
      rating: 4.8,
      reviewCount: 72,
      lastRated: "2023-07-17",
      categories: {
        knowledge: 4.7,
        friendliness: 5.0,
        responsiveness: 4.8,
        professionalism: 4.7
      }
    },
    {
      id: 5,
      entityName: "David Brown",
      entityType: "staff",
      rating: 4.1,
      reviewCount: 48,
      lastRated: "2023-07-10",
      categories: {
        knowledge: 4.2,
        friendliness: 3.9,
        responsiveness: 4.0,
        professionalism: 4.3
      }
    }
  ]);
  
  const handleViewDetails = (rating: Rating) => {
    toast({ 
      title: "Rating Updated",
      description: "The rating has been updated successfully.",
      variant: "success"
    });
  };
  
  const getRatingBadge = (rating: number) => {
    // Ensure rating is a number to prevent toFixed errors
    const numericRating = typeof rating === 'number' ? rating : 0;
    
    // Using only the available variants: default, secondary, destructive, outline
    if (numericRating >= 4.5) return <Badge className="bg-green-500 hover:bg-green-600">{numericRating.toFixed(1)}</Badge>;
    if (numericRating >= 4.0) return <Badge variant="default">{numericRating.toFixed(1)}</Badge>;
    if (numericRating >= 3.0) return <Badge variant="secondary">{numericRating.toFixed(1)}</Badge>;
    return <Badge variant="destructive">{numericRating.toFixed(1)}</Badge>;
  };
  
  const getCategories = (type: string) => {
    if (type === "court") {
      return ["cleanliness", "maintenance", "staff", "amenities"];
    }
    return ["knowledge", "friendliness", "responsiveness", "professionalism"];
  };
  
  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  const getAverageRating = (ratings: Rating[]) => {
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, item) => {
      // Ensure rating is a number
      const rating = typeof item.rating === 'number' ? item.rating : 0;
      return sum + rating;
    }, 0) / ratings.length;
  };
  
  const getTotalReviews = (ratings: Rating[]) => {
    return ratings.reduce((sum, item) => sum + item.reviewCount, 0);
  };
  
  const getActiveData = () => {
    return activeTab === "courts" ? courtRatings : staffRatings;
  };
  
  const filteredData = getActiveData().filter(item => {
    const matchesSearch = 
      searchQuery === "" || 
      item.entityName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date filtering could be implemented with a real date parser
    // For now, we'll just return true for all periods except 'last7days'
    const matchesPeriod = periodFilter === "all" || true;
    
    return matchesSearch && matchesPeriod;
  });
  
  // Sort by highest rating
  const sortedData = [...filteredData].sort((a, b) => b.rating - a.rating);
  
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Rating Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={staggerContainer}
      >
        <motion.div variants={slideUp}>
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-textLight dark:text-gray-400">Average Court Rating</p>
                  <p className="text-2xl font-bold text-textDark dark:text-white">{getAverageRating(courtRatings)?.toFixed(1) || "0.0"}</p>
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
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-textLight dark:text-gray-400">Average Staff Rating</p>
                  <p className="text-2xl font-bold text-textDark dark:text-white">{getAverageRating(staffRatings).toFixed(1)}</p>
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
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-textLight dark:text-gray-400">Total Court Reviews</p>
                  <p className="text-2xl font-bold text-textDark dark:text-white">{getTotalReviews(courtRatings)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={slideUp}>
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="mr-4 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-textLight dark:text-gray-400">Total Staff Reviews</p>
                  <p className="text-2xl font-bold text-textDark dark:text-white">{getTotalReviews(staffRatings)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Tabs and Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Tabs defaultValue="courts" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="courts">Courts</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder={`Search ${activeTab}...`}
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={periodFilter}
            onValueChange={setPeriodFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Ratings List */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-700">
          <CardTitle>{activeTab === "courts" ? "Court Ratings" : "Staff Ratings"}</CardTitle>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">
                  {activeTab === "courts" ? "Court" : "Staff Member"}
                </TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Rating</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Reviews</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Last Rated</TableHead>
                {getCategories(activeTab).map(category => (
                  <TableHead 
                    key={category} 
                    className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider"
                  >
                    {getCategoryLabel(category)}
                  </TableHead>
                ))}
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length > 0 ? (
                sortedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <TableCell className="font-medium text-textDark dark:text-white">
                      <div className="flex items-center">
                        {activeTab === "courts" ? (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                          </div>
                        ) : (
                          <UserRound className="w-5 h-5 mr-2 text-primary" />
                        )}
                        {item.entityName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getRatingBadge(item.rating)} 
                        <div className="ml-2">
                          <StarRating rating={item.rating} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.reviewCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-textLight dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.lastRated}
                      </div>
                    </TableCell>
                    {getCategories(activeTab).map(category => (
                      <TableCell key={category}>
                        <StarRating rating={item.categories && item.categories[category] ? item.categories[category] : 0} />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(item)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7 + getCategories(activeTab).length} className="text-center py-8 text-textLight dark:text-gray-400">
                    No ratings found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <CardFooter className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-textLight dark:text-gray-400">
            Showing {sortedData.length} of {getActiveData().length} {activeTab}
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
