import React, { createContext, useContext, useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

// Define User interface
interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  skills: string[];
  createdAt?: string;
  updatedAt?: string;
  about?: string;
  image_url?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (address: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    address: string,
    skills: string[]
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (about: string, imageUrl: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

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

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    // On mount, try to load user if we have a token
    const initialToken = localStorage.getItem("token");
    if (initialToken) {
      setToken(initialToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Separate effect to handle token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      loadUser();
    } else {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const loadUser = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.get<User>("/api/user-data", {
        headers: {
          "x-auth-token": token,
        },
      });
      setUser(res.data);
      setError(null);
    } catch (err) {
      console.error(
        "Load user error:",
        err instanceof Error ? err.message : String(err)
      );
      setToken(null);
      setError("Authentication error");
    } finally {
      setLoading(false);
    }
  };

  const login = async (address: string): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.post<{ token: string }>("/api/auth/login", {
        address,
      });
      setToken(res.data.token);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError<{ msg: string }>;
      console.error(
        "Login error:",
        axiosError.response?.data?.msg || axiosError.message
      );
      setError(axiosError.response?.data?.msg || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    address: string,
    skills: string[]
  ): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.post<{ token: string }>("/api/auth/register", {
        name,
        email,
        address,
        skills,
      });
      setToken(res.data.token);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError<{ msg: string }>;
      console.error(
        "Register error:",
        axiosError.response?.data?.msg || axiosError.message
      );
      setError(axiosError.response?.data?.msg || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (
    about: string,
    imageUrl: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const res = await api.put<User>(
        "/api/profile",
        { about, imageUrl },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setUser(res.data);
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
