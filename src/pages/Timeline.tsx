import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, CloudLightning, FileText, History, XCircle, Hourglass } from "lucide-react";
import { TimeAxis } from "@/components/timeline/TimeAxis";
import { CapsuleList } from "@/components/timeline/CapsuleList";
import { FileVersions } from "@/components/timeline/FileVersions";
import { toast } from "@/hooks/use-toast";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/apiService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { formatAxisDate } from "@/components/timeline/formatAxisDate";

export default function Timeline() {
  const [filter, setFilter] = useState("all");
  const [selectedTimePoint, setSelectedTimePoint] = useState("");
  const [activeTab, setActiveTab] = useState("events");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      toast({
        title: "Authentication required",
        description: "Please log in to view timelines",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, navigate]);

  const { data: timelines, isLoading: timelinesLoading } = useQuery({
    queryKey: ['timelines'],
    queryFn: apiService.getTimelines,
    enabled: isAuthenticated
  });

  const { data: capsules, isLoading: capsulesLoading } = useQuery({
    queryKey: ['capsules'],
    queryFn: apiService.getCapsules,
    enabled: isAuthenticated
  });

  const { data: fileVersions, isLoading: fileVersionsLoading } = useQuery({
    queryKey: ['fileVersions'],
    queryFn: apiService.getFileVersions,
    enabled: isAuthenticated
  });

  const { data: snapshots, isLoading: snapshotsLoading } = useQuery({
    queryKey: ['snapshots'],
    queryFn: apiService.getSnapshots,
    enabled: isAuthenticated
  });

  const { data: ec2Instances, isLoading: ec2InstancesLoading } = useQuery({
    queryKey: ['ec2Instances'],
    queryFn: apiService.getEC2Instances,
    enabled: isAuthenticated
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case "snapshot":
        return <Clock className="h-5 w-5" />;
      case "deployment":
        return <CloudLightning className="h-5 w-5" />;
      case "config":
        return <FileText className="h-5 w-5" />;
      default:
        return <History className="h-5 w-5" />;
    }
  };

  const constructTimelineEvents = () => {
    let events: any[] = [];

    if (snapshots) {
      snapshots.forEach((snapshot: any, index: number) => {
        events.push({
          id: `snapshot-${index}`,
          type: "snapshot",
          status: snapshot.status || "successful",
          timestamp: snapshot.updated_at || snapshot.timestamp || snapshot.created_at,
          message: snapshot.description || "Instance snapshot created",
          details: snapshot.snapshot_id || `Snapshot ${index + 1}`
        });
      });
    }

    if (ec2Instances) {
      ec2Instances.forEach((instance: any, index: number) => {
        events.push({
          id: `ec2-${index}`,
          type: "deployment",
          status: instance.state === "running" ? "successful" : "failed",
          timestamp: instance.launch_time || instance.created_at,
          message: `EC2 instance ${instance.state || "updated"}`,
          details: instance.instance_id || `Instance ${index + 1}`
        });
      });
    }

    if (timelines) {
      timelines.forEach((timeline: any, index: number) => {
        events.push({
          id: `timeline-${index}`,
          type: timeline.type || "config",
          status: timeline.status || "successful",
          timestamp: timeline.timestamp || timeline.created_at,
          message: timeline.description || `Timeline event ${index + 1}`,
          details: timeline.details || ""
        });
      });
    }

    return events.sort((a, b) => {
      const timeA = new Date(a.timestamp || "").getTime() || 0;
      const timeB = new Date(b.timestamp || "").getTime() || 0;
      return timeB - timeA;
    });
  };

  const timelineEvents = constructTimelineEvents();

  const handleTimePointSelect = (timePoint: string) => {
    setSelectedTimePoint(timePoint);
    const formattedDate = formatAxisDate(timePoint);
    toast({
      title: "Time point selected",
      description: `You've selected time point: ${formattedDate.month} ${formattedDate.day}, ${formattedDate.time}`,
    });
  };

  const filteredEvents = filter === "all" 
    ? timelineEvents 
    : timelineEvents.filter(event => event.type === filter);

  useEffect(() => {
    if (timelineEvents.length > 0 && !selectedTimePoint) {
      setSelectedTimePoint(timelineEvents[0].timestamp);
    }
  }, [timelineEvents, selectedTimePoint]);

  const isLoading = timelinesLoading || capsulesLoading || fileVersionsLoading || 
                    snapshotsLoading || ec2InstancesLoading;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-r-2"></div>
            <p className="mt-4 text-muted-foreground">Loading timeline data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="relative z-10 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg -z-10 blur-xl"></div>
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-xl opacity-60 time-pulse"></div>
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-secondary/20 rounded-full blur-xl opacity-60 time-pulse"></div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
                Chrono Timeline
              </h1>
              <p className="text-muted-foreground">
                Navigate through your system's history across time and space
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span>Filter by Date</span>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" size="sm" className="gap-2 time-warp">
                    <Hourglass className="h-4 w-4 chrono-spin" />
                    <span>Time Controls</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold time-gradient-text">Chrono Control Panel</h3>
                      <p className="text-sm text-muted-foreground">View your time travel operations</p>
                    </div>
                    <div className="space-y-4">
                      <div className="time-shimmer">
                        <h4 className="text-sm font-medium mb-2">View Time Points</h4>
                        <div className="space-y-2">
                          <input 
                            type="datetime-local" 
                            className="w-full px-3 py-2 border border-input bg-background rounded-md" 
                          />
                          <Button variant="secondary" className="w-full time-warp">View Time Point</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {timelineEvents.length > 0 ? (
          <TimeAxis 
            events={timelineEvents}
            selectedTimePoint={selectedTimePoint}
            onSelectTimePoint={handleTimePointSelect}
          />
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No timeline events available.</p>
          </Card>
        )}

        <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="events" className="data-[state=active]:time-shimmer">Events</TabsTrigger>
              <TabsTrigger value="capsules" className="data-[state=active]:time-shimmer">Capsules</TabsTrigger>
              <TabsTrigger value="files" className="data-[state=active]:time-shimmer">File Versions</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="events" className="mt-6 relative space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFilter("all")}>All Events</TabsTrigger>
                <TabsTrigger value="snapshot" onClick={() => setFilter("snapshot")}>Snapshots</TabsTrigger>
                <TabsTrigger value="deployment" onClick={() => setFilter("deployment")}>Deployments</TabsTrigger>
                <TabsTrigger value="config" onClick={() => setFilter("config")}>Configurations</TabsTrigger>
              </TabsList>
            </div>

            <div className="timeline-connector -z-10"></div>

            {filteredEvents.length > 0 ? (
              <div className="space-y-8">
                {filteredEvents.map((event, idx) => (
                  <div key={event.id} className="relative pl-10 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="timeline-dot">
                      {selectedTimePoint === event.timestamp && (
                        <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75"></span>
                      )}
                    </div>
                    
                    <Card 
                      className={`border-l-4 ${event.status === "successful" ? "border-l-green-500" : "border-l-red-500"} hover:shadow-md transition-all ${selectedTimePoint === event.timestamp ? 'ring-2 ring-primary time-shimmer' : ''}`}
                      onClick={() => handleTimePointSelect(event.timestamp)}
                    >
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <span className="p-1 rounded-md bg-muted inline-flex">
                              {getEventIcon(event.type)}
                            </span>
                            {event.message}
                            {event.status === "successful" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </CardTitle>
                          <span className="text-xs text-muted-foreground">
                            {(() => {
                              const date = formatAxisDate(event.timestamp);
                              return `${date.month} ${date.day}, ${date.time}`;
                            })()}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="py-2 px-4">
                        <p className="text-sm text-muted-foreground">{event.details}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No {filter} events found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="capsules" className="mt-6">
            {capsules && capsules.length > 0 ? (
              <CapsuleList 
                capsules={capsules}
                selectedTimePoint={selectedTimePoint}
                onSelectTimePoint={handleTimePointSelect}
              />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No capsules available.</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            {fileVersions && fileVersions.length > 0 ? (
              <FileVersions 
                files={fileVersions}
                selectedTimePoint={selectedTimePoint}
                onSelectTimePoint={handleTimePointSelect}
              />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No file versions available.</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
