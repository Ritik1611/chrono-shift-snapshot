
import AuthForm from "@/components/auth/AuthForm";
import { Clock, Download, Hourglass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // If the user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/assets/chrono_installer.exe';
    link.download = 'chrono_installer.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login/Signup form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md z-10 bg-white/90 dark:bg-card p-8 rounded-xl shadow-md">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-chrono-primary flex items-center justify-center">
              <Clock className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-center text-2xl font-bold mb-6 time-gradient-text">Welcome to Chrono</h2>
          <AuthForm />
        </div>
      </div>
      
      {/* Right side - Hero section */}
      <div className="flex-1 bg-chrono-primary text-white flex items-center justify-center p-6">        
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
              <Clock className="h-8 w-8 text-chrono-primary" />
            </div>
            <h1 className="text-4xl font-bold">Chrono</h1>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Time-Based Version Control System</h2>
          
          <p className="text-lg mb-6">
            Chrono provides powerful tools for tracking, managing, and restoring system states over time.
            Take snapshots of your EC2 instances, clone environments, and travel through time with ease.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-chrono-secondary flex items-center justify-center mt-1">
                <Hourglass className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Snapshot Management</h3>
                <p className="text-white/80">
                  Create, manage and restore system snapshots with a single command
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-chrono-secondary flex items-center justify-center mt-1">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Time Travel</h3>
                <p className="text-white/80">
                  Restore your system to any point in time with complete confidence
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-chrono-secondary flex items-center justify-center mt-1">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Cloud Integration</h3>
                <p className="text-white/80">
                  Seamlessly works with AWS EC2, EBS, and other cloud providers
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={handleDownload}
              size="lg" 
              className="bg-white text-chrono-primary hover:bg-white/90"
            >
              <Download className="mr-2 h-4 w-4" />
              Install Chrono CLI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
