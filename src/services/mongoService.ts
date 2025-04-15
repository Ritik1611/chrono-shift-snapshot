
// This file is kept for backward compatibility but we are no longer using
// simulated data. All data is fetched from the API through apiService.ts

interface User {
  username: string;
  email: string;
  name: string;
  organization: string;
  password?: string;
}

// Empty user collection since we're not using dummy data anymore
const userCollection: User[] = [];

export const mongoService = {
  // These methods are kept for backwards compatibility but will return empty/null results
  authenticateUser: async (email: string, password: string): Promise<Omit<User, 'password'> | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    return null;
  },
  
  getUserByEmail: async (email: string): Promise<Omit<User, 'password'> | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return null;
  },
  
  createUser: async (userData: User): Promise<Omit<User, 'password'> | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return null;
  },
  
  getUserByUsername: async (username: string): Promise<User | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return null;
  },
  
  updateUser: async (username: string, userData: Partial<User>): Promise<User | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return null;
  },
  
  updatePassword: async (username: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return false;
  }
};
