
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/');
    toast.error("Authentication required to access settings");
    return null;
  }

  const handleSave = () => {
    toast("Settings saved", {
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Configure your Chrono instance
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Configure API access and credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">API Key</h3>
                <p className="text-sm text-muted-foreground">
                  Used for programmatic access to your Chrono instance
                </p>
              </div>
              <Button variant="outline" onClick={() => toast.info("New API key will be generated")}>Generate New Key</Button>
            </div>
            
            <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
              chro_k1_••••••••••••••••••••••••••••••••
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Advanced account settings can be configured through the API
            </p>
            <Button onClick={() => toast.info("Documentation will open in a new tab")}>
              View API Documentation
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
