import { useState, useEffect, useRef } from "react";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
    name: "",
    email: "",
    skills: "",
  });
  const navigate = useNavigate();

  const loginAttemptedRef = useRef(false);

  // Reset login attempt when wallet changes
  useEffect(() => {
    loginAttemptedRef.current = false;
  }, [account?.bech32Address]);

  useEffect(() => {
    if (
      !isConnected ||
      !account?.bech32Address ||
      isAuthenticated ||
      loading ||
      loginAttemptedRef.current
    ) {
      return;
    }

    loginAttemptedRef.current = true;

    const handleLogin = async () => {
      try {
        const success = await login(account.bech32Address);
        if (success) {
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          navigate("/dashboard"); // optional: redirect on login
        } else {
          setRegistrationOpen(true);
        }
      } catch (err) {
        console.error("Login error:", err);
        setRegistrationOpen(true);
      }
    };

    handleLogin();
  }, [isConnected, account?.bech32Address, isAuthenticated, loading]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account?.bech32Address) return;

    const skills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    try {
      const success = await register(
        formData.name,
        formData.email,
        account.bech32Address,
        skills
      );

      if (success) {
        setRegistrationOpen(false);
        toast({
          title: "Registration successful",
          description: "Your account has been created!",
        });
        navigate("/dashboard"); // optional: redirect after registration
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred";

      toast({
        title: "Registration failed",
        description: message,
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
