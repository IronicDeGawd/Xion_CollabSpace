import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Badge,
  Code,
  Lightbulb,
  Wallet,
  CheckCircle,
  Users,
  Zap,
  MessageSquare,
  GitBranch,
  ArrowUpRight,
} from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
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

  const connectWallet = () => {
    setShowModal(true);
  };

  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-block mb-4">
              <Badge className="text-web3-primary border-web3-primary/30">
                Web3 Collaboration Platform
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="gradient-text">Connect.</span>{" "}
              <span className="gradient-text">Collab.</span>{" "}
              <span className="gradient-text">Create.</span>
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
              The collaborative platform for Web3 developers to find projects,
              share ideas, and build the future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              {!isConnected && (
                <Button
                  size="lg"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="flex items-center gap-2 bg-web3-primary hover:bg-web3-primary/90"
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

        {/* Problem Section */}
        <section className="py-16 bg-gradient-to-b from-background to-background/80 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Problem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Web3 development faces unique challenges that traditional
              collaboration platforms can't solve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fragmented Teams</h3>
              <p className="text-muted-foreground">
                Decentralized teams struggle to find and coordinate with skilled
                Web3 developers.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trust & Verification</h3>
              <p className="text-muted-foreground">
                Verifying skills and building trust in a pseudonymous
                environment is challenging.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2">Communication Gaps</h3>
              <p className="text-muted-foreground">
                Traditional platforms lack Web3-native features for
                decentralized collaboration.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Solution</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A Web3-native platform that brings together developers, projects,
              and ideas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <Zap className="h-6 w-6 text-primary" />
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
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gradient-to-b from-web3-primary/5 to-web3-accent/5 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Why choose our platform for your Web3 development journey?
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  On-chain Reputation
                </h3>
                <p className="text-muted-foreground">
                  Build a verifiable track record of your contributions and
                  skills.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Skill Matching</h3>
                <p className="text-muted-foreground">
                  Find projects that match your expertise and interests.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Community Feedback
                </h3>
                <p className="text-muted-foreground">
                  Get valuable insights from experienced Web3 developers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Token Rewards</h3>
                <p className="text-muted-foreground">
                  Earn tokens for your contributions to projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our platform.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  Connect your wallet, create a profile, and start browsing
                  projects or sharing your ideas. It's that simple!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What chains are supported?</AccordionTrigger>
                <AccordionContent>
                  We currently support Ethereum and compatible chains. More
                  networks will be added based on community demand.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How does reputation work?</AccordionTrigger>
                <AccordionContent>
                  Your reputation is built through successful project
                  collaborations, community contributions, and skill
                  validations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Is it free to use?</AccordionTrigger>
                <AccordionContent>
                  Yes, the platform is free to use. You only pay gas fees for
                  on-chain actions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="flex flex-col items-center bg-gradient-to-r from-web3-primary/10 to-web3-accent/10 rounded-xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
              Ready to start building?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-center">
              Join a growing community of Web3 developers building the future of
              decentralized applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex items-center gap-2 bg-web3-primary hover:bg-web3-primary/90"
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
              <Button size="lg" variant="outline" asChild>
                <Link to="/projects" className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  View Projects
                </Link>
              </Button>
            </div>
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
