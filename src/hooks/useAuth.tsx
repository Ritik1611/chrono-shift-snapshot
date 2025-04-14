
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

type AuthContextType = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check authentication status on load
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = authService.isLoggedIn();
      setIsAuthenticated(isLoggedIn);
      setUsername(authService.getUsername());
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await authService.login(username, password);
      setIsAuthenticated(true);
      setUsername(username);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      await authService.signup(username, password);
      setIsAuthenticated(true);
      setUsername(username);
      
      toast({
        title: "Account created",
        description: `Welcome to Chrono, ${username}!`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try a different username",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername(null);
    
    toast({
      title: "Logged out",
      description: "You've been successfully logged out",
    });
    
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
