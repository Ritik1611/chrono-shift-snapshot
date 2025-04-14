
import { toast } from "@/components/ui/use-toast";

// Base API URL - you should set this to your Flask server URL in production
const API_BASE_URL = "http://localhost:5000";

// Interface for login/signup responses
interface AuthResponse {
  token?: string;
  message: string;
}

// Interface for timeline data
interface TimelineItem {
  filename: string;
  version: string;
  timestamp: string;
}

// Interface for capsule data
interface Capsule {
  capsule_name: string;
  capsule_time: string;
  updated_at: string;
}

// Utility function to handle API errors
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  toast({
    title: "Error",
    description: error.message || "Something went wrong. Please try again.",
    variant: "destructive",
  });
  throw error;
};

// Add auth token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("chrono_token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
};

// Authentication services
export const authService = {
  // Login to the system
  async login(username: string, password: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/chrono/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data: AuthResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      if (data.token) {
        localStorage.setItem("chrono_token", data.token);
        localStorage.setItem("chrono_username", username);
        return data.token;
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Register a new user
  async signup(username: string, password: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/chrono/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data: AuthResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
      
      // After signup, automatically log in
      return await this.login(username, password);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Logout function
  logout() {
    localStorage.removeItem("chrono_token");
    localStorage.removeItem("chrono_username");
    window.location.href = "/";
  },

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem("chrono_token");
  },

  // Get current username
  getUsername(): string | null {
    return localStorage.getItem("chrono_username");
  }
};

// Timeline services
export const timelineService = {
  // Get all files in the timeline
  async getPresent(): Promise<TimelineItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chrono/present`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch timeline data");
      }
      
      const data = await response.json();
      return data.files || [];
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get timeline for specific file
  async getFileTimeline(filename: string): Promise<TimelineItem[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chrono/timeline?filename=${encodeURIComponent(filename)}`,
        {
          headers: getAuthHeaders(),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch file timeline");
      }
      
      const data = await response.json();
      return data.timeline || [];
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Jump to a specific time (version) for a file
  async timeJump(filename: string, timeMarkVersion: string): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chrono/timejump?filename=${encodeURIComponent(filename)}&time_mark=${encodeURIComponent(timeMarkVersion)}`,
        {
          headers: getAuthHeaders(),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to jump to version");
      }
      
      const data = await response.json();
      return data.content || "";
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// Capsule services
export const capsuleService = {
  // List all capsules
  async listCapsules(): Promise<Capsule[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/chrono/list-capsules`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch capsules");
      }
      
      const data = await response.json();
      return data.capsules || [];
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create or update a capsule
  async cloneState(capsuleName: string, filesMapping: Record<string, string>): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/chrono/clone`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          capsule_name: capsuleName,
          files: filesMapping,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create capsule");
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Shift to a specific capsule
  async shiftCapsule(capsuleName: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/chrono/shift-capsule`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          capsule_name: capsuleName,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to shift capsule");
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// EC2 and EBS services
export const awsService = {
  // Start EC2 instance
  async awakenInstance(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/chrono/awaken`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to start EC2 instance");
      }
      
      const data = await response.json();
      return data.instance_id || "";
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create EBS snapshot
  async createSnapshot(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/chrono/ebs-snapshot`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create snapshot");
      }
      
      const data = await response.json();
      return data.snapshot_id || "";
    } catch (error) {
      return handleApiError(error);
    }
  }
};

// File services
export const fileService = {
  // Upload a file for versioning
  async warpFile(file: File, filePath: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_path", filePath);
      
      const response = await fetch(`${API_BASE_URL}/chrono/warp`, {
        method: "POST",
        headers: {
          Authorization: getAuthHeaders().Authorization,
          // Don't set Content-Type for FormData
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload file");
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete a file and all its versions
  async eraseFile(filename: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/chrono/erase`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          filename,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete file");
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  }
};
