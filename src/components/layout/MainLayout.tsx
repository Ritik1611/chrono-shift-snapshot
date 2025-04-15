
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  History, 
  Home, 
  LogOut, 
  Settings, 
  User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  
  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-16 md:w-64 bg-card border-r shrink-0">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-chrono-primary flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold hidden md:inline-block">Chrono</span>
          </div>
          
          {/* Navigation */}
          <nav className="mt-8 px-2 space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3" 
              onClick={() => navigate("/dashboard")}
            >
              <Home size={20} />
              <span className="hidden md:inline-block">Dashboard</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3" 
              onClick={() => navigate("/timeline")}
            >
              <History size={20} />
              <span className="hidden md:inline-block">Timeline</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3" 
              onClick={() => navigate("/profile")}
            >
              <User size={20} />
              <span className="hidden md:inline-block">Profile</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3" 
              onClick={() => navigate("/settings")}
            >
              <Settings size={20} />
              <span className="hidden md:inline-block">Settings</span>
            </Button>
          </nav>
          
          {/* Logout at the bottom */}
          <Button 
            variant="ghost" 
            className="mt-auto w-full justify-start gap-3 mb-4 mx-2" 
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="hidden md:inline-block">Logout</span>
          </Button>
        </div>
      </aside>
      
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
