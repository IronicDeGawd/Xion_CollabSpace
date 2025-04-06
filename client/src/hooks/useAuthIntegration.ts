import { useEffect, useState } from 'react';
import { useAbstraxionAccount } from '@burnt-labs/abstraxion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface FormData {
  name: string;
  email: string;
  skills: string[];
}

export const useAuthIntegration = () => {
  const { isConnected, data: account } = useAbstraxionAccount();
  const { login, register, isAuthenticated, user, error } = useAuth();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    skills: [],
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  // When wallet connects, attempt to login
  useEffect(() => {
    const handleLogin = async () => {
      if (!account?.bech32Address) return;
      try {
        await login(account.bech32Address);
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
      } catch (err: unknown) {
        // If login fails, user might need to register
        if ((err as { response?: { status?: number } })?.response?.status === 400) {
          setRegistrationOpen(true);
        }
      }
    };

    if (isConnected && account?.bech32Address) {
      // Only attempt login if address changed or we haven't tried yet
      if (account.bech32Address !== currentAddress) {
        setCurrentAddress(account.bech32Address);
        // Only try to login if we're not already authenticated
        if (!isAuthenticated) {
          handleLogin();
        }
      }
    }
  }, [isConnected, account, isAuthenticated]);

  const handleRegister = async () => {
    if (!account?.bech32Address) return;

    try {
      await register(formData.name, formData.email, account.bech32Address, formData.skills);
      setRegistrationOpen(false);
      toast({
        title: 'Registration successful',
        description: 'Your account has been created',
      });
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: 'Registration failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  // Debug the current state
  useEffect(() => {
    console.log("Auth integration state:", {
      isConnected,
      address: account?.bech32Address,
      isAuthenticated,
      error
    });
  }, [isConnected, account, isAuthenticated, error]);

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
