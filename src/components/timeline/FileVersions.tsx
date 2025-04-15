
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { Check, FileText, RotateCcw, Clock } from "lucide-react";

// Update interfaces to match potential API response structure
interface FileVersion {
  time_mark?: string;
  timestamp?: string;
  created_at?: string;
  version?: string;
  version_id?: string;
  base?: boolean;
  is_base?: boolean;
}

interface FileData {
  filename?: string;
  file_id?: string;
  name?: string;
  versions?: FileVersion[];
  file_versions?: FileVersion[];
}

interface FileVersionsProps {
  files: FileData[];
  selectedTimePoint: string;
  onSelectTimePoint: (timestamp: string) => void;
}

export function FileVersions({ files, selectedTimePoint, onSelectTimePoint }: FileVersionsProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };
  
  const handleCompare = (filename: string, time1: string, time2: string) => {
    toast({
      title: "Comparing Versions",
      description: `Comparing ${filename} between ${formatDate(time1)} and ${formatDate(time2)}`,
    });
  };
  
  const handleTimeJump = (filename: string, timestamp: string, version: string) => {
    onSelectTimePoint(timestamp);
    toast({
      title: "Time Jump",
      description: `Jumped to ${filename} version ${version} (${formatDate(timestamp)})`,
    });
  };

  const getFileIcon = (filename: string) => {
    return <FileText className="h-5 w-5" />;
  };

  const getFileName = (file: FileData) => {
    return file.filename || file.name || `File ${file.file_id}`;
  };

  const getFileVersions = (file: FileData) => {
    return file.versions || file.file_versions || [];
  };

  const getVersionTimestamp = (version: FileVersion) => {
    return version.time_mark || version.timestamp || version.created_at || "";
  };

  const getVersionName = (version: FileVersion) => {
    return version.version || version.version_id || "Unknown version";
  };

  const isBaseVersion = (version: FileVersion) => {
    return version.base || version.is_base || false;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">File Timeline</h2>
          <p className="text-sm text-muted-foreground">View file versions across time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {files.map((file) => {
          const fileVersions = getFileVersions(file);
          const fileName = getFileName(file);
          
          return (
            <Card key={fileName} className="overflow-hidden border hover:border-primary/50 transition-all">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={fileName} className="border-0">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      {getFileIcon(fileName)}
                      <span className="font-medium">{fileName}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {fileVersions.length} versions
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 p-4 pt-0">
                      <div className="relative">
                        <div className="absolute left-[1.7rem] top-0 bottom-0 w-0.5 bg-muted"></div>
                        
                        {fileVersions.map((version, index) => {
                          const timestamp = getVersionTimestamp(version);
                          const versionName = getVersionName(version);
                          const isBase = isBaseVersion(version);
                          
                          return (
                            <div 
                              key={`${fileName}-${versionName}-${index}`} 
                              className={`relative pl-10 py-3 flex justify-between items-center
                              ${selectedTimePoint === timestamp ? 'bg-primary/5 rounded-md' : ''}
                              ${index !== fileVersions.length - 1 ? 'mb-2' : ''}`}
                            >
                              <div className="absolute left-7 w-3 h-3 rounded-full bg-primary-foreground border-2 border-primary"></div>
                              
                              <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{versionName}</span>
                                  {isBase && (
                                    <span className="text-xs text-primary-foreground bg-primary px-2 py-0.5 rounded">Base</span>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">{formatDate(timestamp)}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant={selectedTimePoint === timestamp ? "default" : "secondary"} 
                                  size="sm" 
                                  className="gap-1"
                                  onClick={() => handleTimeJump(fileName, timestamp, versionName)}
                                >
                                  {selectedTimePoint === timestamp ? (
                                    <>
                                      <Check className="h-4 w-4" /> Current
                                    </>
                                  ) : (
                                    <>
                                      <RotateCcw className="h-4 w-4" /> View
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          );
        })}
      </div>
      
      {files.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No files in the timeline yet.</p>
        </Card>
      )}
    </div>
  );
}
