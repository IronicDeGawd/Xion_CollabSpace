import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
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
    if (!token || loadUserRef.current) {
      setLoading(false);
      return;
    }

    loadUserRef.current = true;

    try {
      const res = await api.get("/api/auth", {
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
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
      loadUserRef.current = false;
    }
  }, [token]);

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
      setToken(res.data.token);
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
      setToken(res.data.token);
      setError(null);
      return true;
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data
          ? (err.response.data as ErrorResponse).msg ||
            (err.response.data as ErrorResponse).message ||
            (err.response.data as ErrorResponse).error ||
            "Registration failed"
          : err instanceof Error
          ? err.message
          : "Registration failed";

      console.error("Register error:", errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
