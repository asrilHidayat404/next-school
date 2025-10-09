// components/User/Pagination.tsx - With Tooltip
"use client";

import { Button } from "@/src/views/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/views/components/ui/tooltip";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  modelName: string;
  currentPage: number;
  totalPages: number;
  totalModels: number;
}

export function Pagination({modelName, currentPage, totalPages, totalModels }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (totalPages <= 1) return null;

  const showingFrom = (currentPage - 1) * 10 + 1;
  const showingTo = Math.min(currentPage * 10, totalModels);

  const PaginationButton = ({ 
    onClick, 
    disabled, 
    icon: Icon, 
    tooltip 
  }: { 
    onClick: () => void; 
    disabled: boolean; 
    icon: any; 
    tooltip: string; 
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={onClick}
          disabled={disabled}
          className="h-8 w-8 p-0 border transition-colors hover:bg-accent/50"
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t bg-gradient-to-r from-muted/5 to-muted/10">
        {/* Left - Results Summary */}
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {showingFrom}-{showingTo}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{totalModels}</span> {modelName}
          </div>
        </div>

        {/* Right - Pagination Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Page Info */}
          <div className="sm:hidden text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
            {currentPage}/{totalPages}
          </div>

          {/* Desktop Page Info */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span>Page</span>
            <span className="font-semibold text-foreground">{currentPage}</span>
            <span>of</span>
            <span className="font-semibold text-foreground">{totalPages}</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            <PaginationButton
              onClick={() => navigateToPage(1)}
              disabled={currentPage === 1}
              icon={ChevronsLeft}
              tooltip="First page"
            />
            
            <PaginationButton
              onClick={() => navigateToPage(currentPage - 1)}
              disabled={currentPage === 1}
              icon={ChevronLeft}
              tooltip="Previous page"
            />
            
            <PaginationButton
              onClick={() => navigateToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              icon={ChevronRight}
              tooltip="Next page"
            />
            
            <PaginationButton
              onClick={() => navigateToPage(totalPages)}
              disabled={currentPage === totalPages}
              icon={ChevronsRight}
              tooltip="Last page"
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}