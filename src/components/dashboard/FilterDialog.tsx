import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  status: string[];
  groups: string[];
  dateRange: string;
}

export function FilterDialog({ isOpen, onClose, onApplyFilters }: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    groups: [],
    dateRange: "all"
  });

  const statusOptions = ["Active", "Suspended", "Pending"];
  const groupOptions = ["Tennis Club", "Weekend Warriors", "Pickle Pros", "Juniors"];
  const dateRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" }
  ];

  const handleStatusChange = (status: string) => {
    setFilters(prev => {
      const newStatus = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];
      
      return { ...prev, status: newStatus };
    });
  };

  const handleGroupChange = (group: string) => {
    setFilters(prev => {
      const newGroups = prev.groups.includes(group)
        ? prev.groups.filter(g => g !== group)
        : [...prev.groups, group];
      
      return { ...prev, groups: newGroups };
    });
  };

  const handleDateRangeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: value
    }));
  };

  const handleReset = () => {
    setFilters({
      status: [],
      groups: [],
      dateRange: "all"
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Data</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-base">Status</Label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`status-${status}`} 
                    checked={filters.status.includes(status)}
                    onCheckedChange={() => handleStatusChange(status)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Groups Filter */}
          <div className="space-y-2">
            <Label htmlFor="groups" className="text-base">Groups</Label>
            <div className="grid grid-cols-2 gap-2">
              {groupOptions.map(group => (
                <div key={group} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`group-${group}`} 
                    checked={filters.groups.includes(group)}
                    onCheckedChange={() => handleGroupChange(group)}
                  />
                  <Label htmlFor={`group-${group}`} className="text-sm font-normal">
                    {group}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Date Range Filter */}
          <div className="space-y-2">
            <Label htmlFor="dateRange" className="text-base">Date Range</Label>
            <Select
              value={filters.dateRange}
              onValueChange={handleDateRangeChange}
            >
              <SelectTrigger id="dateRange">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}