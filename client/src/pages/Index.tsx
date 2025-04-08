"use client";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code,
  Lightbulb,
  Wallet,
  CheckCircle,
  Users,
  Zap,
  MessageSquare,
  GitBranch,
  ArrowUpRight,
  Globe,
  Shield,
  Sparkles,
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
import { Card, CardContent } from "@/components/ui/card";

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
        {/* Hero Section - Redesigned with image */}
        <section className="py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-left-10 duration-700">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="gradient-text">Connect.</span>{" "}
                <span className="gradient-text">Collab.</span>{" "}
                <span className="gradient-text">Create.</span>
              </h1>
              <p className="text-lg md:text-xl max-w-xl text-muted-foreground">
                The collaborative platform for Web3 developers to find projects,
                share ideas, and build the future together on the decentralized
                web.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {!isConnected && (
                  <Button
                    size="lg"
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="flex items-center gap-2 bg-web3-primary hover:bg-web3-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-web3-primary/20 hover:scale-105 group"
                  >
                    <Wallet className="h-5 w-5 transition-all duration-300 group-hover:rotate-12" />
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                )}
                <Button
                  size="lg"
                  variant={isConnected ? "default" : "outline"}
                  className="flex items-center gap-2 group"
                  asChild
                >
                  <Link to="/projects">
                    <Code className="h-5 w-5 transition-all duration-300 group-hover:rotate-12" />
                    Browse Projects
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2 group"
                  asChild
                >
                  <Link to="/ideas">
                    <Lightbulb className="h-5 w-5 transition-all duration-300 group-hover:rotate-12" />
                    Explore Ideas
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-in fade-in-50 slide-in-from-right-10 duration-700">
              <div className="relative z-10">
                <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-web3-primary/20 to-web3-accent/20 rounded-2xl p-6 shadow-xl">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="space-y-4">
                      <div className="h-1/2 bg-gradient-to-br from-web3-primary/30 to-web3-primary/10 rounded-lg p-4 flex items-center justify-center shadow-lg">
                        <GitBranch className="h-12 w-12 text-web3-primary animate-float" />
                      </div>
                      <div className="h-1/2 bg-gradient-to-tr from-web3-accent/10 to-web3-primary/20 rounded-lg p-4 flex items-center justify-center shadow-lg">
                        <Code className="h-12 w-12 text-web3-accent animate-float" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-1/3 bg-gradient-to-bl from-web3-primary/20 to-web3-accent/10 rounded-lg p-4 flex items-center justify-center shadow-lg">
                        <Users className="h-10 w-10 text-web3-primary animate-float" />
                      </div>
                      <div className="h-2/3 bg-gradient-to-tr from-web3-accent/20 to-web3-primary/10 rounded-lg p-4 flex items-center justify-center shadow-lg">
                        <Globe className="h-16 w-16 text-web3-accent animate-float" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full opacity-30 animate-pulse-slow"></div>
              <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-web3-accent/20 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -left-6 h-24 w-24 bg-web3-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 bg-gradient-to-b from-background to-background/80 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              The Problem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Web3 development faces unique challenges that traditional
              collaboration platforms can't solve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 hover:rotate-6 hover:scale-110 hover:bg-destructive/20">
                <Users className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fragmented Teams</h3>
              <p className="text-muted-foreground">
                Decentralized teams struggle to find and coordinate with skilled
                Web3 developers.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 hover:rotate-6 hover:scale-110 hover:bg-destructive/20">
                <GitBranch className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trust & Verification</h3>
              <p className="text-muted-foreground">
                Verifying skills and building trust in a pseudonymous
                environment is challenging.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 hover:rotate-6 hover:scale-110 hover:bg-destructive/20">
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
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Our Solution
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A Web3-native platform that brings together developers, projects,
              and ideas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px] group">
              <div className="h-2 bg-gradient-to-r from-web3-primary to-web3-accent"></div>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary/20">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Find Projects</h3>
                <p className="text-muted-foreground mb-4">
                  Discover Web3 projects looking for collaborators with your
                  skillset.
                </p>
                <Link
                  to="/projects"
                  className="flex items-center gap-1 text-primary mt-4 group transition-all duration-300"
                >
                  Browse Projects{" "}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px] group">
              <div className="h-2 bg-gradient-to-r from-web3-primary to-web3-accent"></div>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary/20">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Share Ideas</h3>
                <p className="text-muted-foreground mb-4">
                  Submit your project ideas to the community and get feedback.
                </p>
                <Link
                  to="/ideas"
                  className="flex items-center gap-1 text-primary mt-4 group transition-all duration-300"
                >
                  Explore Ideas{" "}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px] group">
              <div className="h-2 bg-gradient-to-r from-web3-primary to-web3-accent"></div>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary/20">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Earn XP</h3>
                <p className="text-muted-foreground mb-4">
                  Track your contributions and earn experience points on-chain.
                </p>
                <Link
                  to={isAuthenticated ? "/profile" : "/"}
                  className="flex items-center gap-1 text-primary mt-4 group transition-all duration-300"
                  onClick={!isConnected ? connectWallet : undefined}
                >
                  {isAuthenticated ? "View Profile" : "Connect Wallet"}{" "}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section - New */}
        <section className="py-16 bg-gradient-to-b from-web3-primary/5 to-web3-accent/5 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Key Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for Web3 developers and projects
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px] group">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">On-chain Identity</h3>
              <p className="text-sm text-muted-foreground">
                Verify your skills and reputation with blockchain proof
              </p>
            </div>
            <div className="bg-card border rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px] group">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Skill Matching</h3>
              <p className="text-sm text-muted-foreground">
                Find projects that perfectly match your expertise
              </p>
            </div>
            <div className="bg-card border rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px] group">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Decentralized Teams
              </h3>
              <p className="text-sm text-muted-foreground">
                Collaborate seamlessly with developers worldwide
              </p>
            </div>
            <div className="bg-card border rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px] group">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Token Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Earn tokens for valuable contributions to projects
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Benefits</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Why choose our platform for your Web3 development journey?
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4 group">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
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
            <div className="flex items-start gap-4 group">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Skill Matching</h3>
                <p className="text-muted-foreground">
                  Find projects that match your expertise and interests.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
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
            <div className="flex items-start gap-4 group">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
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
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our platform.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem
                value="item-1"
                className="transition-all duration-300 data-[state=open]:bg-accent/50 rounded-md data-[state=open]:shadow-sm"
              >
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  Connect your wallet, create a profile, and start browsing
                  projects or sharing your ideas. It's that simple!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-2"
                className="transition-all duration-300 data-[state=open]:bg-accent/50 rounded-md data-[state=open]:shadow-sm"
              >
                <AccordionTrigger>What chains are supported?</AccordionTrigger>
                <AccordionContent>
                  We currently support Ethereum and compatible chains. More
                  networks will be added based on community demand.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-3"
                className="transition-all duration-300 data-[state=open]:bg-accent/50 rounded-md data-[state=open]:shadow-sm"
              >
                <AccordionTrigger>How does reputation work?</AccordionTrigger>
                <AccordionContent>
                  Your reputation is built through successful project
                  collaborations, community contributions, and skill
                  validations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="item-4"
                className="transition-all duration-300 data-[state=open]:bg-accent/50 rounded-md data-[state=open]:shadow-sm"
              >
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
          <div className="flex flex-col items-center bg-gradient-to-r from-web3-primary/10 to-web3-accent/10 rounded-xl p-8 md:p-12 transition-all duration-500 hover:shadow-xl hover:from-web3-primary/20 hover:to-web3-accent/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center gradient-text">
              Ready to start building?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-center">
              Join a growing community of Web3 developers building the future of
              decentralized applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex items-center gap-2 bg-web3-primary hover:bg-web3-primary/90 group"
                onClick={!isConnected ? connectWallet : undefined}
                asChild={isAuthenticated}
              >
                {isAuthenticated ? (
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:translate-x-[2px]" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Wallet className="h-5 w-5 transition-all duration-300 group-hover:rotate-12" />
                    Get Started
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" asChild className="group">
                <Link to="/projects" className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:translate-x-[2px]" />
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
