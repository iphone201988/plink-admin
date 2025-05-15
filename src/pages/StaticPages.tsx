import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Eye, File, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showToast } from "@/lib/toastManager";
import { StaticPage } from "@/types";
import { pageTransition } from "@/lib/animations";

export default function StaticPages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Sample data - in a real app, this would come from API
  const [pages, setPages] = useState<StaticPage[]>([
    {
      id: 1,
      title: "About Us",
      slug: "about-us",
      category: "Company",
      status: "Published",
      lastUpdated: "2023-07-15",
      author: "Admin"
    },
    {
      id: 2,
      title: "Privacy Policy",
      slug: "privacy-policy",
      category: "Legal",
      status: "Published",
      lastUpdated: "2023-06-20",
      author: "Admin"
    },
    {
      id: 3,
      title: "Terms of Service",
      slug: "terms-of-service",
      category: "Legal",
      status: "Published",
      lastUpdated: "2023-06-20",
      author: "Admin"
    },
    {
      id: 4,
      title: "Membership Rules",
      slug: "membership-rules",
      category: "Rules",
      status: "Published",
      lastUpdated: "2023-07-05",
      author: "John Doe"
    },
    {
      id: 5,
      title: "Court Etiquette",
      slug: "court-etiquette",
      category: "Rules",
      status: "Published",
      lastUpdated: "2023-07-10",
      author: "Jane Smith"
    },
    {
      id: 6,
      title: "Contact Us",
      slug: "contact-us",
      category: "Company",
      status: "Published",
      lastUpdated: "2023-07-01",
      author: "Admin"
    },
    {
      id: 7,
      title: "Upcoming Features",
      slug: "upcoming-features",
      category: "Announcements",
      status: "Draft",
      lastUpdated: "2023-07-18",
      author: "Robert Johnson"
    }
  ]);
  
  const handleEditPage = (page: StaticPage) => {
    showToast({ 
      title: "Edit Page",
      description: `Editing ${page.title}`,
      variant: "default"
    });
  };
  
  const handleDeletePage = (pageId: number) => {
    const page = pages.find(p => p.id === pageId);
    
    setPages(prevPages => prevPages.filter(page => page.id !== pageId));
    
    showToast({
      title: "Page Deleted",
      description: `${page?.title} has been removed`,
      variant: "destructive"
    });
  };
  
  const handleToggleStatus = (pageId: number) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === pageId 
          ? { 
              ...page, 
              status: page.status === "Published" ? "Draft" : "Published" 
            } 
          : page
      )
    );
    
    const page = pages.find(p => p.id === pageId);
    const newStatus = page?.status === "Published" ? "Draft" : "Published";
    
    showToast({
      title: "Status Updated",
      description: `${page?.title} is now ${newStatus}`,
      variant: newStatus === "Published" ? "success" : "default"
    });
  };
  
  const handleViewPage = (page: StaticPage) => {
    showToast({
      title: "View Page",
      description: `Viewing ${page.title}`,
      variant: "default"
    });
  };
  
  const handleAddPage = () => {
    showToast({
      title: "Add Page",
      description: "Page creation form would open here",
      variant: "default"
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Published":
        return <Badge variant="success">{status}</Badge>;
      case "Draft":
        return <Badge variant="outline">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const categories = Array.from(new Set(pages.map(page => page.category)));
  
  const filteredPages = pages.filter(page => {
    const matchesSearch = 
      searchQuery === "" || 
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || 
      page.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
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
              placeholder="Search pages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddPage}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add Page</span>
        </Button>
      </div>
      
      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {categories.map(category => {
          const count = pages.filter(page => page.category === category).length;
          return (
            <motion.div
              key={category}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card 
                className={`bg-white dark:bg-gray-800 cursor-pointer ${
                  categoryFilter === category.toLowerCase() 
                    ? "ring-2 ring-primary" 
                    : ""
                }`}
                onClick={() => setCategoryFilter(category.toLowerCase())}
              >
                <CardContent className="p-6 flex items-center">
                  <div className="mr-4 p-3 rounded-full bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-textDark dark:text-white">{category}</h3>
                    <p className="text-sm text-textLight dark:text-gray-400">{count} pages</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Pages List */}
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <CardHeader className="p-6 border-b border-gray-100 dark:border-gray-700">
          <CardTitle>Static Pages</CardTitle>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Title</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Slug</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Category</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Last Updated</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Author</TableHead>
                <TableHead className="text-xs font-medium text-textLight dark:text-gray-400 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.length > 0 ? (
                filteredPages.map((page) => (
                  <TableRow key={page.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <TableCell className="font-medium text-textDark dark:text-white">
                      <div className="flex items-center">
                        <File className="h-4 w-4 mr-2 text-textLight dark:text-gray-400" />
                        {page.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-textLight dark:text-gray-400">/{page.slug}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-secondary dark:bg-gray-700">
                        {page.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(page.status)}</TableCell>
                    <TableCell className="text-textLight dark:text-gray-400">{page.lastUpdated}</TableCell>
                    <TableCell className="text-textDark dark:text-white">{page.author}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewPage(page)}>
                          <Eye className="h-4 w-4 text-primary hover:text-blue-700" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditPage(page)}>
                          <Edit className="h-4 w-4 text-primary hover:text-blue-700" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(page.id)}>
                          {page.status === "Published" ? (
                            <span className="text-warning hover:text-yellow-700">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19c-2.3 0-6.4-.2-8.1-.6-.7-.2-1.2-.7-1.4-1.4-.3-1.1-.5-3.4-.5-5s.2-3.9.5-5c.2-.7.7-1.2 1.4-1.4C5.6 5.2 9.7 5 12 5s6.4.2 8.1.6c.7.2 1.2.7 1.4 1.4.3 1.1.5 3.4.5 5s-.2 3.9-.5 5c-.2.7-.7 1.2-1.4 1.4-1.7.4-5.8.6-8.1.6z"></path>
                                <rect width="6" height="8" x="9" y="8" rx="1"></rect>
                              </svg>
                            </span>
                          ) : (
                            <span className="text-success hover:text-green-700">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 10a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0v-5Z"></path>
                                <path d="M15 10a1 1 0 0 0-2 0v5a1 1 0 0 0 2 0v-5Z"></path>
                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z"></path>
                              </svg>
                            </span>
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeletePage(page.id)}>
                          <Trash2 className="h-4 w-4 text-danger hover:text-red-700" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-textLight dark:text-gray-400">
                    No pages found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <CardFooter className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <p className="text-sm text-textLight dark:text-gray-400">
            Showing {filteredPages.length} of {pages.length} pages
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
