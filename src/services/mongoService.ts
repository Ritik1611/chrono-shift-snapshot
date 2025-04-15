
// This is a simulated MongoDB service for frontend demonstration purposes
// In a real app, these calls would go to a secure backend API

interface User {
  username: string;
  email: string;
  name: string;
  organization: string;
  password?: string; // Only used for simulation - never store actual passwords in frontend
}

// Simulated user collection (mimicking MongoDB)
const userCollection: User[] = [
  {
    username: "john_doe",
    email: "john.doe@example.com",
    name: "John Doe",
    organization: "Acme Corp",
    password: "password123" // In a real app, this would be a hashed password
  },
  {
    username: "jane_smith",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    organization: "Tech Solutions",
    password: "password123" // In a real app, this would be a hashed password
  }
];

export const mongoService = {
  // Authenticate user (simulate MongoDB query)
  authenticateUser: async (email: string, password: string): Promise<Omit<User, 'password'> | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const user = userCollection.find(u => u.email === email && u.password === password);
    
    if (!user) return null;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  // Get user by email (simulate MongoDB query)
  getUserByEmail: async (email: string): Promise<Omit<User, 'password'> | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = userCollection.find(u => u.email === email);
    
    if (!user) return null;
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  // Create new user (simulate MongoDB insert)
  createUser: async (userData: User): Promise<Omit<User, 'password'> | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Add user to collection
    userCollection.push(userData);
    
    // Return created user without password
    const { password: _, ...userWithoutPassword } = userData;
    return userWithoutPassword;
  },
  
  // Simulate getting user information from MongoDB
  getUserByUsername: async (username: string): Promise<User | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = userCollection.find(u => u.username === username);
    return user || null;
  },
  
  // Simulate updating user in MongoDB
  updateUser: async (username: string, userData: Partial<User>): Promise<User | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const userIndex = userCollection.findIndex(u => u.username === username);
    if (userIndex === -1) return null;
    
    const updatedUser = {
      ...userCollection[userIndex],
      ...userData
    };
    
    // Update the "database"
    userCollection[userIndex] = updatedUser;
    
    // Return updated user without password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },
  
  // Simulate password update in MongoDB
  updatePassword: async (username: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIndex = userCollection.findIndex(u => u.username === username);
    if (userIndex === -1) return false;
    
    // Verify current password
    if (userCollection[userIndex].password !== currentPassword) {
      return false;
    }
    
    // Simulate password update
    userCollection[userIndex].password = newPassword;
    
    return true;
  }
};
