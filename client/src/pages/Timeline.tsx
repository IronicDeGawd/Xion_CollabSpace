"use client";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Code,
  Wallet,
  Users,
  Zap,
  GitBranch,
  Globe,
  Shield,
  Sparkles,
  Rocket,
  BadgeDollarSign,
  BarChart3,
  LucideIcon,
  Star,
  Trophy,
  UserPlus,
  Clock,
  Lock,
  Gem,
  Crown,
  Building,
  LockKeyhole,
  Settings,
  CheckSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Timeline item types
type TimelineItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "completed" | "in-progress" | "planned";
  highlight?: boolean;
};

// Monetization plan types
type MonetizationPlan = {
  title: string;
  description: string;
  icon: LucideIcon;
  price?: string;
  features: string[];
  primary?: boolean;
};

// XION Feature types
type XionFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
  benefit: string;
};

const Timeline = () => {
  // Implemented features (past and present)
  const implementedFeatures: TimelineItem[] = [
    {
      title: "Platform Launch",
      description:
        "Initial launch of CollabSpace with core wallet integration and project browsing.",
      icon: Rocket,
      status: "completed",
    },
    {
      title: "User Profiles",
      description:
        "On-chain identity system and user profile creation with skill tags.",
      icon: Users,
      status: "completed",
      highlight: true,
    },
    {
      title: "Project Listing",
      description:
        "Ability for users to create and browse projects seeking collaborators.",
      icon: Code,
      status: "completed",
    },
    {
      title: "Ideas Marketplace",
      description:
        "Platform for users to share, discuss, and collaborate on Web3 project ideas.",
      icon: Sparkles,
      status: "in-progress",
    },
    {
      title: "XION Integration",
      description:
        "Full integration with XION blockchain for transaction processing and identity.",
      icon: Shield,
      status: "in-progress",
    },
  ];

  // Future features
  const futureFeatures: TimelineItem[] = [
    {
      title: "Skill Verification System",
      description:
        "On-chain verification of developer skills through challenges and peer reviews.",
      icon: Check,
      status: "planned",
      highlight: true,
    },
    {
      title: "Reputation Tokens",
      description:
        "ERC-20 based reputation tokens earned through successful collaborations.",
      icon: Star,
      status: "planned",
    },
    {
      title: "Project Funding Pool",
      description:
        "Decentralized funding mechanism for promising projects in the ecosystem.",
      icon: Wallet,
      status: "planned",
      highlight: true,
    },
    {
      title: "Developer DAO",
      description:
        "Governance structure allowing community members to vote on platform direction.",
      icon: Users,
      status: "planned",
    },
    {
      title: "Enterprise Partnership Program",
      description:
        "Connecting Web3 projects with enterprise clients seeking development teams.",
      icon: UserPlus,
      status: "planned",
      highlight: true,
    },
    {
      title: "Global Developer Events",
      description:
        "Virtual and physical hackathons and meetups for the community.",
      icon: Globe,
      status: "planned",
    },
  ];

  // Monetization plans
  const monetizationPlans: MonetizationPlan[] = [
    {
      title: "Free Tier",
      description: "Basic access for individual developers",
      icon: Users,
      features: [
        "Browse up to 10 projects per day",
        "View 5 detailed project descriptions",
        "Submit 1 project idea per week",
        "Basic profile with limited customization",
      ],
    },
    {
      title: "Developer Pro",
      description: "Enhanced features for serious contributors",
      icon: Code,
      price: "15 XION / month",
      features: [
        "Unlimited project browsing",
        "Unlimited idea submissions",
        "Enhanced profile with portfolio showcase",
        "Priority application for projects",
        "Access to exclusive developer events",
      ],
      primary: true,
    },
    {
      title: "Project Creator",
      description: "For teams looking to recruit talent",
      icon: Rocket,
      price: "50 XION / month",
      features: [
        "Post unlimited projects with premium visibility",
        "Advanced filtering for applicant matching",
        "Team management dashboard",
        "Direct messaging with applicants",
        "Customizable application templates",
      ],
    },
    {
      title: "Enterprise",
      description: "For companies building in Web3",
      icon: Building,
      price: "Custom Pricing",
      features: [
        "White-label recruiting portal",
        "API access for integration with HR systems",
        "Dedicated account manager",
        "Verified talent pool access",
        "Custom reporting and analytics",
      ],
    },
  ];

  // XION Features
  const xionFeatures: XionFeature[] = [
    {
      title: "Account Abstraction",
      description:
        "XION's account abstraction enables seamless user onboarding without compromising security.",
      icon: Shield,
      benefit:
        "Users can interact with our platform without managing seed phrases or private keys.",
    },
    {
      title: "On-chain Identity",
      description:
        "Verifiable credentials stored on XION blockchain provide authentic developer profiles.",
      icon: CheckSquare,
      benefit:
        "Skills and contributions are cryptographically verified, creating genuine trust between collaborators.",
    },
    {
      title: "Gasless Transactions",
      description:
        "XION's transaction fee model allows for seamless platform interactions.",
      icon: Zap,
      benefit:
        "Users can interact with the platform without worrying about gas fees for basic operations.",
    },
    {
      title: "Smart Contract Foundation",
      description:
        "Core platform features like reputation and matching are implemented as XION smart contracts.",
      icon: Settings,
      benefit:
        "Ensures transparency, reliability, and auditability of critical platform operations.",
    },
    {
      title: "Interoperability",
      description:
        "XION's interchain capabilities connect our platform to the broader Web3 ecosystem.",
      icon: GitBranch,
      benefit:
        "Projects and profiles can interact with other chains and protocols seamlessly.",
    },
  ];

  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="space-y-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight gradient-text animate-in fade-in-50 slide-in-from-bottom-10 duration-700">
              Project Roadmap
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground animate-in fade-in-50 slide-in-from-bottom-10 duration-700 delay-200">
              Tracking our journey from concept to the ultimate Web3
              collaboration platform
            </p>
          </div>
        </section>

        {/* Timeline Tabs */}
        <Tabs defaultValue="all" className="mb-24">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-background/60 backdrop-blur-sm border">
              <TabsTrigger value="all">Full Timeline</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="monetization">Subscription Plans</TabsTrigger>
              <TabsTrigger value="xion">XION Technology</TabsTrigger>
            </TabsList>
          </div>

          {/* All Timeline Content */}
          <TabsContent value="all">
            <div className="relative max-w-5xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-web3-primary/60 to-web3-accent/60 rounded-full"></div>

              <div className="space-y-16">
                {/* Implemented Features Section */}
                <div className="text-center relative">
                  <div className="inline-block px-6 py-2 bg-web3-primary/10 backdrop-blur-sm rounded-full animate-pulse-slow">
                    <h2 className="text-2xl font-bold gradient-text">
                      Implemented Features
                    </h2>
                  </div>
                </div>

                {implementedFeatures.map((feature, index) => (
                  <div
                    key={`implemented-${index}`}
                    className="relative flex items-center justify-center"
                  >
                    <div
                      className={`w-full md:w-5/12 ${
                        index % 2 === 0
                          ? "md:mr-auto md:text-right md:pr-8"
                          : "md:ml-auto md:pl-8"
                      }`}
                    >
                      <Card
                        className={`overflow-hidden transition-all duration-300 hover:shadow-lg border ${
                          feature.highlight
                            ? "border-web3-primary/30"
                            : "border-border"
                        } hover:translate-y-[-5px]`}
                      >
                        <div
                          className={`h-1 ${
                            feature.highlight
                              ? "bg-gradient-to-r from-web3-primary to-web3-accent"
                              : "bg-gradient-to-r from-primary/30 to-primary/10"
                          }`}
                        ></div>
                        <CardContent className="p-6">
                          <div className="mb-4">
                            {feature.status === "completed" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                                Completed
                              </span>
                            )}
                            {feature.status === "in-progress" && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400">
                                In Progress
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                          feature.highlight
                            ? "bg-gradient-to-br from-web3-primary to-web3-accent shadow-lg shadow-web3-primary/20"
                            : "bg-primary/20"
                        }`}
                      >
                        <feature.icon
                          className={`h-5 w-5 ${
                            feature.highlight ? "text-white" : "text-primary"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Future Features Section */}
                <div className="text-center relative">
                  <div className="inline-block px-6 py-2 bg-web3-accent/10 backdrop-blur-sm rounded-full animate-pulse-slow">
                    <h2 className="text-2xl font-bold gradient-text">
                      Future Roadmap
                    </h2>
                  </div>
                </div>

                {futureFeatures.map((feature, index) => (
                  <div
                    key={`future-${index}`}
                    className="relative flex items-center justify-center"
                  >
                    <div
                      className={`w-full md:w-5/12 ${
                        index % 2 === 0
                          ? "md:mr-auto md:text-right md:pr-8"
                          : "md:ml-auto md:pl-8"
                      }`}
                    >
                      <Card
                        className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:translate-y-[-5px] border ${
                          feature.highlight
                            ? "border-web3-accent/30"
                            : "border-border"
                        }`}
                      >
                        <div
                          className={`h-1 ${
                            feature.highlight
                              ? "bg-gradient-to-r from-web3-primary to-web3-accent"
                              : "bg-primary/20"
                          }`}
                        ></div>
                        <CardContent className="p-6">
                          <div className="mb-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400">
                              Planned
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-3">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-background z-10 ${
                          feature.highlight
                            ? "bg-gradient-to-br from-web3-accent/40 to-web3-primary/40"
                            : "bg-primary/10"
                        }`}
                      >
                        <feature.icon
                          className={`h-5 w-5 ${
                            feature.highlight ? "text-white" : "text-primary/70"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Completed Features Tab */}
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {implementedFeatures
                .filter((item) => item.status === "completed")
                .map((feature, index) => (
                  <Card
                    key={index}
                    className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      feature.highlight ? "border-web3-primary/30" : ""
                    } hover:translate-y-[-5px] group`}
                  >
                    <div
                      className={`h-2 ${
                        feature.highlight
                          ? "bg-gradient-to-r from-web3-primary to-web3-accent"
                          : "bg-primary/20"
                      }`}
                    ></div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`w-12 h-12 ${
                            feature.highlight
                              ? "bg-web3-primary/20"
                              : "bg-primary/10"
                          } rounded-lg flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}
                        >
                          <feature.icon
                            className={`h-6 w-6 ${
                              feature.highlight
                                ? "text-web3-primary"
                                : "text-primary"
                            }`}
                          />
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                          Completed
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              {implementedFeatures
                .filter((item) => item.status === "in-progress")
                .map((feature, index) => (
                  <Card
                    key={`in-progress-${index}`}
                    className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      feature.highlight ? "border-web3-primary/30" : ""
                    } hover:translate-y-[-5px] group`}
                  >
                    <div
                      className={`h-2 ${
                        feature.highlight
                          ? "bg-gradient-to-r from-web3-primary to-web3-accent"
                          : "bg-primary/20"
                      }`}
                    ></div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`w-12 h-12 ${
                            feature.highlight
                              ? "bg-web3-primary/20"
                              : "bg-primary/10"
                          } rounded-lg flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}
                        >
                          <feature.icon
                            className={`h-6 w-6 ${
                              feature.highlight
                                ? "text-web3-primary"
                                : "text-primary"
                            }`}
                          />
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400">
                          In Progress
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Upcoming Features Tab */}
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {futureFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    feature.highlight ? "border-web3-accent/30" : ""
                  } hover:translate-y-[-5px] group`}
                >
                  <div
                    className={`h-2 ${
                      feature.highlight
                        ? "bg-gradient-to-r from-web3-primary to-web3-accent"
                        : "bg-primary/20"
                    }`}
                  ></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`w-12 h-12 ${
                          feature.highlight
                            ? "bg-web3-accent/20"
                            : "bg-primary/10"
                        } rounded-lg flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}
                      >
                        <feature.icon
                          className={`h-6 w-6 ${
                            feature.highlight
                              ? "text-web3-accent"
                              : "text-primary"
                          }`}
                        />
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400">
                        Planned
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Subscription Plans Tab */}
          <TabsContent value="monetization">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">
                  Subscription Plans
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Our sustainable approach to platform growth while delivering
                  maximum value to users
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {monetizationPlans.map((plan, index) => (
                  <Card
                    key={index}
                    className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] ${
                      plan.primary
                        ? "border-web3-primary/50 shadow-md shadow-web3-primary/10"
                        : "hover:border-primary/30"
                    }`}
                  >
                    <div
                      className={`h-2 ${
                        plan.primary
                          ? "bg-gradient-to-r from-web3-primary to-web3-accent"
                          : "bg-primary/20"
                      }`}
                    ></div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold">
                            {plan.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {plan.description}
                          </CardDescription>
                        </div>
                        <div
                          className={`w-12 h-12 ${
                            plan.primary
                              ? "bg-web3-primary/20"
                              : "bg-primary/10"
                          } rounded-lg flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}
                        >
                          <plan.icon
                            className={`h-6 w-6 ${
                              plan.primary
                                ? "text-web3-primary"
                                : "text-primary"
                            }`}
                          />
                        </div>
                      </div>
                      {plan.price && (
                        <div
                          className={`text-lg font-bold mt-4 ${
                            plan.primary ? "text-web3-primary" : ""
                          }`}
                        >
                          {plan.price}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check
                              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                                plan.primary
                                  ? "text-web3-primary"
                                  : "text-primary"
                              }`}
                            />
                            <span className="text-muted-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={`w-full ${
                          plan.primary
                            ? "bg-web3-primary hover:bg-web3-primary/90"
                            : "bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary"
                        }`}
                      >
                        {plan.price ? "Subscribe Now" : "Get Started Free"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="mt-16 bg-gradient-to-r from-web3-primary/10 to-web3-accent/10 rounded-xl p-8 transition-all duration-500 hover:shadow-lg hover:from-web3-primary/20 hover:to-web3-accent/20">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold gradient-text mb-2">
                    Why Subscriptions?
                  </h3>
                  <p className="text-muted-foreground">
                    Our tiered approach ensures platform sustainability while
                    keeping core features accessible
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-web3-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Lock className="h-6 w-6 text-web3-primary" />
                    </div>
                    <h4 className="font-bold mb-2">Fair Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Free tier ensures everyone can participate, while premium
                      features support platform growth
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-web3-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Gem className="h-6 w-6 text-web3-primary" />
                    </div>
                    <h4 className="font-bold mb-2">Quality Focus</h4>
                    <p className="text-sm text-muted-foreground">
                      Subscriptions help filter for serious users, improving
                      match quality for everyone
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-web3-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Rocket className="h-6 w-6 text-web3-primary" />
                    </div>
                    <h4 className="font-bold mb-2">Sustainable Growth</h4>
                    <p className="text-sm text-muted-foreground">
                      Revenue allows us to continually improve the platform and
                      add new features
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* XION Technology Tab */}
          <TabsContent value="xion">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 gradient-text">
                  Powered by XION
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  How XION's blockchain technology enables our platform's unique
                  features
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {xionFeatures.map((feature, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-web3-primary/30 hover:translate-y-[-5px] group"
                  >
                    <div className="h-2 bg-gradient-to-r from-web3-primary to-web3-accent"></div>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-web3-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-web3-primary/20">
                          <feature.icon className="h-6 w-6 text-web3-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {feature.description}
                          </p>
                          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                            <p className="text-sm font-medium text-primary">
                              Benefit: {feature.benefit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-gradient-to-r from-web3-primary/10 to-web3-accent/10 rounded-xl p-8 transition-all duration-500 hover:shadow-lg hover:from-web3-primary/20 hover:to-web3-accent/20">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-24 h-24 bg-web3-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-12 w-12 text-web3-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 gradient-text">
                      Why XION for CollabSpace?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      XION blockchain provides the perfect foundation for our
                      platform with its focus on user experience, scalability,
                      and developer tools. Its account abstraction capabilities
                      make Web3 accessible to everyone, while its robust smart
                      contract environment enables us to build advanced
                      collaboration features with complete transparency and
                      security.
                    </p>
                    <p className="text-muted-foreground">
                      By building on XION, we ensure that our platform remains
                      decentralized, censorship-resistant, and aligned with the
                      core values of Web3 - all while delivering a user
                      experience that rivals traditional Web2 platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <section className="py-16">
          <div className="flex flex-col items-center bg-gradient-to-r from-web3-primary/10 to-web3-accent/10 rounded-xl p-8 md:p-12 transition-all duration-500 hover:shadow-xl hover:from-web3-primary/20 hover:to-web3-accent/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center gradient-text">
              Want to contribute to our platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-center">
              We welcome community feedback and feature suggestions to help
              build the ultimate platform for Web3 collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex items-center gap-2 bg-web3-primary hover:bg-web3-primary/90 group"
                asChild
              >
                <Link to="/feedback" className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 transition-all duration-300 group-hover:rotate-12" />
                  Submit Feedback
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="group">
                <Link to="/discord" className="flex items-center gap-2">
                  <Users className="h-5 w-5 transition-all duration-300 group-hover:rotate-12" />
                  Join Our Community
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Timeline;
