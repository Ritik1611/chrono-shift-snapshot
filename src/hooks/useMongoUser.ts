
import { useState } from 'react';
import apiService from '@/services/apiService';
import { toast } from "sonner";

export function useMongoUser() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // This hook is kept for backward compatibility but functionality is removed
  // as we now use apiService directly
  
  const updateUserProfile = async (userData: any) => {
    setError('Profile update feature is not available');
    toast.error("Feature unavailable", {
      description: "Profile update feature is not available"
    });
    return { success: false, message: 'This feature is not available' };
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    setError('Password update feature is not available');
    toast.error("Feature unavailable", {
      description: "Password update feature is not available"
    });
    return { success: false, message: 'This feature is not available' };
  };

  return { user, isLoading, error, updateUserProfile, updateUserPassword };
}
