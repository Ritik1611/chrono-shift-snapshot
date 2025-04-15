import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiService from '@/services/apiService';
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
    // Check if user is logged in (using token from localStorage)
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('currentUser');
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
      // Check if token exists in result
      if (result.token) {
        setIsAuthenticated(true);
        setUsername(username);
        localStorage.setItem('currentUser', username);
        toast({
          title: "Login successful",
          description: `Welcome back, ${username}!`,
        });
        setIsLoading(false);
        return { success: true };
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Invalid username or password",
          variant: "destructive"
        });
        setIsLoading(false);
        return { success: false, message: result.message || "Invalid username or password" };
      }
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
      if (result.message === "User created successfully") {
        toast({
          title: "Signup successful",
          description: "Your account has been created. You can now log in.",
        });
        // Auto-login after signup
        const loginResult = await apiService.login(username, password);
        if (loginResult.token) {
          setIsAuthenticated(true);
          setUsername(username);
          localStorage.setItem('currentUser', username);
          setIsLoading(false);
          return { success: true, message: "Signup and login successful" };
        } else {
          setIsLoading(false);
          return { success: false, message: "Auto login failed after signup" };
        }
      } else {
        toast({
          title: "Signup failed",
          description: result.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return { success: false, message: result.message };
      }
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
    localStorage.removeItem('currentUser');
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
