
import { useState, useEffect } from 'react';
import { mongoService } from '../services/mongoService';

export function useMongoUser() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        
        // Get current user from session storage
        const username = sessionStorage.getItem("currentUser");
        
        if (!username) {
          setError('User not logged in');
          return;
        }
        
        const userData = await mongoService.getUserByUsername(username);
        
        if (userData) {
          setUser(userData);
          setError(null);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUserProfile = async (userData: any) => {
    try {
      setIsLoading(true);
      const username = sessionStorage.getItem("currentUser");
      
      if (!username) {
        return { success: false, message: 'User not logged in' };
      }
      
      const updatedUser = await mongoService.updateUser(username, userData);
      
      if (updatedUser) {
        setUser(updatedUser);
        return { success: true, message: 'Profile updated successfully' };
      } else {
        setError('Failed to update user');
        return { success: false, message: 'User not found' };
      }
    } catch (err) {
      setError('Error updating profile');
      return { success: false, message: 'Error updating profile' };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      const username = sessionStorage.getItem("currentUser");
      
      if (!username) {
        return { success: false, message: 'User not logged in' };
      }
      
      const success = await mongoService.updatePassword(username, currentPassword, newPassword);
      
      if (success) {
        return { success: true, message: 'Password updated successfully' };
      } else {
        return { success: false, message: 'Failed to update password' };
      }
    } catch (err) {
      return { success: false, message: 'Error updating password' };
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, error, updateUserProfile, updateUserPassword };
}
