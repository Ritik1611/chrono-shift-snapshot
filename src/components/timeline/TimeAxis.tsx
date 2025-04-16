
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatAxisDate } from "./formatAxisDate";

interface TimeEvent {
  id: string | number;
  timestamp: string;
  type: string;
  status: string;
}

interface TimeAxisProps {
  events: TimeEvent[];
  selectedTimePoint: string;
  onSelectTimePoint: (timestamp: string) => void;
}

export function TimeAxis({ events, selectedTimePoint, onSelectTimePoint }: TimeAxisProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Check if an event is selected
  const isSelected = (timestamp: string) => selectedTimePoint === timestamp;
  
  // Handle scroll buttons
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  // Update scroll buttons state
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  
  // Set up scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);
  
  return (
    <Card className="p-4 relative overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Time Continuum</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleScrollLeft}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleScrollRight}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto pb-4 scrollbar-none"
        onScroll={checkScrollPosition}
      >
        <div className="relative min-w-full">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted transform -translate-y-1/2"></div>
          
          {/* Event points */}
          <div className="flex justify-between min-w-[1200px] px-8 relative">
            {sortedEvents.map((event) => {
              const date = formatAxisDate(event.timestamp);
              return (
                <div 
                  key={event.id}
                  className="flex flex-col items-center cursor-pointer group"
                  onClick={() => onSelectTimePoint(event.timestamp)}
                >
                  <div className="mb-2 text-center">
                    <p className="text-xs text-muted-foreground">{date.time}</p>
                    <p className="text-xs font-medium">{date.day} {date.month}</p>
                  </div>
                  
                  <div 
                    className={`w-4 h-4 rounded-full border-2 border-white relative z-10 
                    ${isSelected(event.timestamp)
                      ? 'bg-primary scale-125'
                      : event.status === 'successful' 
                        ? 'bg-green-500 group-hover:scale-110' 
                        : 'bg-red-500 group-hover:scale-110'
                    } transition-all duration-200`}
                  ></div>
                  
                  <div className="mt-2 text-center">
                    <p className={`text-xs ${isSelected(event.timestamp) ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {event.type}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
