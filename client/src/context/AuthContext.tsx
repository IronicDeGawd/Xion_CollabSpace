import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios, { AxiosError } from "axios";
import { User } from "@/types";

// Define error response interface
interface ErrorResponse {
  msg?: string;
  message?: string;
  error?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (address: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    address: string,
    skills: string[]
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (
    bio: string,
    imageUrl: string,
    githubUrl?: string,
    telegramId?: string,
    discordId?: string
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadUserRef = useRef(false);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Only set loading to true if we're starting a new request
    if (!loadUserRef.current) {
      setLoading(true);
    }

    loadUserRef.current = true;

    try {
      const cachedUser = localStorage.getItem("cached_user");
      const cachedTime = localStorage.getItem("cached_user_time");

      // If we have cached user data less than 5 minutes old, use it initially
      if (
        cachedUser &&
        cachedTime &&
        Date.now() - parseInt(cachedTime) < 5 * 60 * 1000
      ) {
        setUser(JSON.parse(cachedUser));
        setLoading(false);
      }

      // Always fetch fresh data from server
      console.log("Fetching user data from server...");
      const res = await api.get("/api/auth", {
        headers: {
          "x-auth-token": token,
        },
      });

      console.log("Server returned user data:", res.data);

      // Update state and cache
      setUser(res.data);
      localStorage.setItem("cached_user", JSON.stringify(res.data));
      localStorage.setItem("cached_user_time", Date.now().toString());

      setError(null);
    } catch (err) {
      console.error(
        "Load user error:",
        err instanceof Error ? err.message : String(err)
      );
      setToken(null);
      setError("Authentication error");
      localStorage.removeItem("token");
      localStorage.removeItem("cached_user");
      localStorage.removeItem("cached_user_time");
    } finally {
      setLoading(false);
      loadUserRef.current = false;
    }
  }, [token, api]);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]); // Remove loadUser from dependencies

  const login = async (address: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", { address });
      const receivedToken = res.data.token;

      // Save token to localStorage first
      localStorage.setItem("token", receivedToken);

      // Then update state
      setToken(receivedToken);
      setError(null);
      return true;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data
          ? (err.response.data as ErrorResponse).msg ||
            (err.response.data as ErrorResponse).message ||
            (err.response.data as ErrorResponse).error ||
            "Login failed"
          : err instanceof Error
          ? err.message
          : "Login failed";

      console.error("Login error:", errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    address: string,
    skills: string[]
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/register", {
        name,
        email,
        address,
        skills,
      });
      const receivedToken = res.data.token;

      // Save token to localStorage first
      localStorage.setItem("token", receivedToken);

      // Then update state
      setToken(receivedToken);
      setError(null);
      return true;
    } catch (err) {
      // Error handling...
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cached_user");
    localStorage.removeItem("cached_user_time");
    setToken(null);

    // Redirect to root page
    window.location.href = "/";
  };

  const updateProfile = async (
    bio: string,
    imageUrl: string,
    githubUrl?: string,
    telegramId?: string,
    discordId?: string
  ): Promise<void> => {
    try {
      console.log("Called updateProfile");
      setLoading(true);
      const res = await api.put<User>(
        "/api/profile",
        {
          bio,
          imageUrl,
          githubUrl,
          telegramId,
          discordId,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      // Update user state with returned data
      setUser(res.data);

      // Force a full reload of user data to ensure consistency
      await loadUser();

      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError<{ msg: string }>;
      console.error(
        "Profile update error:",
        axiosError.response?.data?.msg || axiosError.message
      );
      setError(axiosError.response?.data?.msg || "Profile update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
