
import AuthForm from "@/components/auth/AuthForm";
import { Clock, Hourglass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Login/Signup form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        {/* Background decoration elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="w-full max-w-md z-10 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg time-shimmer">
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-chrono-primary flex items-center justify-center">
              <Clock className="h-10 w-10 text-white chrono-spin" />
            </div>
          </div>
          <h2 className="text-center text-2xl font-bold mb-6 time-gradient-text">Welcome to Chrono</h2>
          <AuthForm />
        </div>
      </div>
      
      {/* Right side - Hero section */}
      <div className="flex-1 bg-chrono-primary text-white flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background time ripples */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/5 time-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-white/5 time-pulse" style={{animationDelay: "1s"}}></div>
        
        <div className="max-w-lg z-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center time-warp">
              <Clock className="h-8 w-8 text-chrono-primary" />
            </div>
            <h1 className="text-4xl font-bold">Chrono</h1>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Time-Based Version Control System</h2>
          
          <p className="text-lg mb-6">
            Chrono provides powerful tools for tracking, managing, and restoring system states over time.
            Take snapshots of your EC2 instances, clone environments, and travel through time with ease.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-3 time-shimmer">
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
            
            <div className="flex items-start gap-3 time-shimmer">
              <div className="h-10 w-10 rounded-full bg-chrono-secondary flex items-center justify-center mt-1">
                <Clock className="h-6 w-6 text-white chrono-spin" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Time Travel</h3>
                <p className="text-white/80">
                  Restore your system to any point in time with complete confidence
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 time-shimmer">
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
              onClick={() => navigate("/dashboard")} 
              size="lg" 
              className="bg-white text-chrono-primary hover:bg-white/90 time-shimmer"
            >
              Explore Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
