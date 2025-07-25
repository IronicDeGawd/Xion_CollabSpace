"use client";

import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Wallet, Home, LogOut, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggleButton } from "./ThemeToggle";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useModal,
  Abstraxion,
} from "@burnt-labs/abstraxion";
import { useAuth } from "@/context/AuthContext";
import { useAuthIntegration } from "@/hooks/useAuthIntegration";
import RegistrationDialog from "@/components/RegistrationDialog";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: account, isConnecting, isConnected } = useAbstraxionAccount();
  const { logout: disconnect } = useAbstraxionSigningClient();
  const { logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useModal();

  const {
    registrationOpen,
    setRegistrationOpen,
    formData,
    setFormData,
    handleRegister,
  } = useAuthIntegration();

  const connectWallet = () => {
    setShowModal(true);
  };

  const handleDisconnect = () => {
    disconnect();
    logout();
  };

  return (
    <>
      <div className="min-h-screen flex px-6">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b p-4 bg-card flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 w-full">
            <div className="flex w-full items-center gap-2">
              <SidebarTrigger />
              <Link
                to="/"
                className="text-xl font-bold gradient-text transition-all duration-300 hover:scale-105"
              >
                CollabSpace
              </Link>
              <div className="ml-4 flex items-center">
                <Link to="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 transition-all duration-200 hover:bg-primary/10"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4 px-2">
              <ThemeToggleButton />
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm hidden md:inline-block truncate max-w-[200px]">
                    {account?.bech32Address}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Disconnect</span>
                  </Button>
                  {isAuthenticated && (
                    <Link to="/profile">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-muted transition-all duration-300 hover:bg-primary/20 hover:scale-110"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="flex items-center gap-2 transition-all duration-300 hover:shadow-md hover:shadow-primary/20 animate-in slide-in-from-right-5"
                >
                  <Wallet className="h-4 w-4" />
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}
            </div>
          </header>
          <main className="flex-1 w-full p-4 md:p-6">{children}</main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground transition-opacity duration-300 hover:text-foreground w-full">
            <p>© 2025 CollabSpace - Connect, Collab, Create</p>
          </footer>
        </div>
        {/* Abstraxion Modal */}
        <Abstraxion onClose={() => setShowModal(false)} />
        {/* Registration Dialog */}
        {account && (
          <RegistrationDialog
            open={registrationOpen}
            onOpenChange={setRegistrationOpen}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleRegister}
            address={account.bech32Address}
          />
        )}
      </div>
    </>
  );
};

export default Layout;
