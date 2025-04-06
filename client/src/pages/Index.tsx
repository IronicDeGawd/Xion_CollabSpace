import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Lightbulb, Wallet } from "lucide-react";
import {
  Abstraxion,
  useAbstraxionAccount,
  useModal,
} from "@burnt-labs/abstraxion";
import { useAuth } from "@/context/AuthContext";
import { useAuthIntegration } from "@/hooks/useAuthIntegration";
import RegistrationDialog from "@/components/RegistrationDialog";
import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";

const Index = () => {
  // Abstraxion hooks
  const { isConnected, isConnecting, data: address } = useAbstraxionAccount();
  const [showModal, setShowModal] = useModal();
  const { isAuthenticated } = useAuth();

  const {
    registrationOpen,
    setRegistrationOpen,
    formData,
    setFormData,
    handleRegister,
  } = useAuthIntegration();

  // Helper function to connect wallet
  const connectWallet = () => {
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="gradient-text">Connect.</span>{" "}
              <span className="gradient-text">Collab.</span>{" "}
              <span className="gradient-text">Create.</span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
              The collaborative platform for Web3 developers to find projects,
              share ideas, and build the future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              {!isConnected && (
                <Button
                  size="lg"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="flex items-center gap-2"
                >
                  <Wallet className="h-5 w-5" />
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              )}
              <Button
                size="lg"
                variant={isConnected ? "default" : "outline"}
                className="flex items-center gap-2"
                asChild
              >
                <Link to="/projects">
                  <Code className="h-5 w-5" />
                  Browse Projects
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex items-center gap-2"
                asChild
              >
                <Link to="/ideas">
                  <Lightbulb className="h-5 w-5" />
                  Explore Ideas
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Find Projects</h3>
            <p className="text-muted-foreground">
              Discover Web3 projects looking for collaborators with your
              skillset.
            </p>
            <Link
              to="/projects"
              className="flex items-center gap-1 text-primary mt-4 hover:underline"
            >
              Browse Projects <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Share Ideas</h3>
            <p className="text-muted-foreground">
              Submit your project ideas to the community and get feedback.
            </p>
            <Link
              to="/ideas"
              className="flex items-center gap-1 text-primary mt-4 hover:underline"
            >
              Explore Ideas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M16 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3" />
                <line x1="12" y1="12" x2="21" y2="12" />
                <polyline points="18 9 21 12 18 15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Earn XP</h3>
            <p className="text-muted-foreground">
              Track your contributions and earn experience points on-chain.
            </p>
            <Link
              to={isAuthenticated ? "/profile" : "/"}
              className="flex items-center gap-1 text-primary mt-4 hover:underline"
              onClick={!isConnected ? connectWallet : undefined}
            >
              {isAuthenticated ? "View Profile" : "Connect Wallet"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <div className="flex flex-col items-center bg-gradient-to-r from-web3-primary/10 to-web3-accent/10 rounded-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to collaborate?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Join a growing community of Web3 developers building the future of
              decentralized applications.
            </p>
            <Button
              size="lg"
              className="flex items-center gap-2"
              onClick={!isConnected ? connectWallet : undefined}
              asChild={isAuthenticated}
            >
              {isAuthenticated ? (
                <Link to="/dashboard">Go to Dashboard</Link>
              ) : (
                <>
                  <Wallet className="h-5 w-5" />
                  Get Started
                </>
              )}
            </Button>
          </div>
        </section>
      </div>

      {/* Abstraxion Modal */}
      <Abstraxion onClose={() => setShowModal(false)} />

      {/* Registration Dialog */}
      {address && (
        <RegistrationDialog
          open={registrationOpen}
          onOpenChange={setRegistrationOpen}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleRegister}
          address={address.bech32Address}
        />
      )}
    </Layout>
  );
};

export default Index;
