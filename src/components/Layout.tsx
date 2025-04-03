import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import {
  BrainCircuit,
  Wallet,
  Home,
  LucideIcon,
  LogOut,
  User,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggleButton } from "./ThemeToggle";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useModal,
} from "@burnt-labs/abstraxion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: account, isConnecting, isConnected } = useAbstraxionAccount();
  const { logout } = useAbstraxionSigningClient();
  const location = useLocation();
  const [, setShowModal] = useModal();

  // Helper function to connect wallet
  const connectWallet = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="border-b p-4 bg-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Link to="/" className="text-xl font-bold gradient-text">
              CollabSpace
            </Link>
            <div className="ml-4 flex items-center">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggleButton />
            {isConnected ? (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden md:inline-block">
                  {account?.bech32Address}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-muted"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 CollabSpace - Connect, Collab, Create</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
