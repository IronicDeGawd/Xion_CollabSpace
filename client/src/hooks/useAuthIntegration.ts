import { useState, useEffect, useRef } from "react";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  skills: string;
}

export const useAuthIntegration = () => {
  const { isConnected, data: account } = useAbstraxionAccount();
  const { isAuthenticated, login, register, user, loading } = useAuth();
  const { toast } = useToast();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    skills: '',
  });
  const navigate = useNavigate();

  // Use a ref to track login attempts to prevent loops
  const loginAttemptedRef = useRef(false);

  // Add a cleanup controller for fetch requests
  useEffect(() => {
    // Skip if conditions aren't right
    if (!isConnected || !account?.bech32Address || isAuthenticated || loading || loginAttemptedRef.current) {
      return;
    }

    // Set attempted flag immediately
    loginAttemptedRef.current = true;

    // Create an AbortController for the login request
    const controller = new AbortController();

    const handleLogin = async () => {
      try {
        const success = await login(account.bech32Address);
        if (success) {
          toast({
            title: 'Login successful',
            description: 'Welcome back!',
          });
        } else {
          setRegistrationOpen(true);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        console.error("Login error:", err);
        setRegistrationOpen(true);
      }
    };

    handleLogin();

    return () => {
      controller.abort();
    };
  }, [isConnected, account?.bech32Address, isAuthenticated]); // Remove loading from dependencies

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account?.bech32Address) return;

    try {
      const skills = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill !== '');

      await register(
        formData.name,
        formData.email,
        account.bech32Address,
        skills
      );

      setRegistrationOpen(false);
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    isConnected,
    isAuthenticated,
    user,
    registrationOpen,
    setRegistrationOpen,
    formData,
    setFormData,
    handleRegister,
  };
};
