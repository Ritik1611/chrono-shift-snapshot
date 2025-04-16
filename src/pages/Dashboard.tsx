import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CloudLightning, CheckCircle, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [currentVolumeId, setCurrentVolumeId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Safe formatDate function: if invalid or missing, return fallback string.
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Fetch EBS Snapshots on mount
  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        const res = await axios.get("http://localhost:5001/chrono/view/ebs-snapshots", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Sort snapshots by updated_at descending (most recent first)
        const sortedSnapshots = res.data.sort(
          (a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setSnapshots(sortedSnapshots);

        // Use the most recent snapshot for Current Instance info.
        if (sortedSnapshots.length > 0) {
          setCurrentVolumeId(sortedSnapshots[0].volume_id);
          setLastUpdated(formatDate(sortedSnapshots[0].updated_at));
        }
      } catch (error) {
        console.error("Failed to fetch snapshots:", error);
      }
    };

    fetchSnapshots();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your system snapshots and time-based changes
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {/* Total Snapshots Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Snapshots</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{snapshots.length}</div>
              <p className="text-xs text-muted-foreground">
                {snapshots.length > 5 ? `+${snapshots.length - 5} since last week` : ""}
              </p>
            </CardContent>
          </Card>

          {/* Current Instance Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Instance</CardTitle>
              <CloudLightning className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentVolumeId ? currentVolumeId : "Loading..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated {lastUpdated || "Loading..."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Snapshots */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Snapshots</h2>
          <div className="space-y-4">
            {snapshots.map((snapshot: any, index: number) => (
              <Card key={snapshot._id || index} className="hover:shadow-md transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {snapshot.status === "successful" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">Snapshot #{index + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(snapshot.updated_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{snapshot.size || "N/A"}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-chrono-secondary border-chrono-secondary hover:bg-chrono-secondary hover:text-white"
                    >
                      Restore
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Actions (only Compare Versions remains for read-only dashboard) */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            variant="outline"
            className="border-chrono-secondary text-chrono-secondary hover:bg-chrono-secondary hover:text-white"
          >
            Compare Versions
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
