
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in (using token from session storage)
    const token = sessionStorage.getItem('token');
    const storedUsername = sessionStorage.getItem('currentUser');
    
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await apiService.login(username, password);
      
      if (result.success) {
        setIsAuthenticated(true);
        setUsername(username);
        toast({
          title: "Login successful",
          description: `Welcome back, ${username}!`,
        });
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Invalid username or password",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, message: "An unexpected error occurred" };
    }
  };

  const signup = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await apiService.signup(username, password);
      
      if (result.success) {
        toast({
          title: "Signup successful",
          description: "Your account has been created. You can now log in.",
        });
        
        // Auto login after signup
        const loginResult = await apiService.login(username, password);
        if (loginResult.success) {
          setIsAuthenticated(true);
          setUsername(username);
        }
      } else {
        toast({
          title: "Signup failed",
          description: result.message,
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Signup error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, message: "An unexpected error occurred" };
    }
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setUsername(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const value = {
    isAuthenticated,
    username,
    login,
    signup,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
