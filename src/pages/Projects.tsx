import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Search, Users, Calendar, Bookmark, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";

// Mock project data
const PROJECTS = [
  {
    id: "1",
    title: "DeFi Yield Aggregator",
    description:
      "Building a cross-chain yield optimizer that automatically moves funds between protocols to maximize returns.",
    skills: ["Solidity", "React", "Web3.js", "TypeScript"],
    type: "paid",
    trustLevel: "high",
    createdAt: "2023-06-15",
    collaborators: 3,
  },
  {
    id: "2",
    title: "NFT Marketplace",
    description:
      "A marketplace for trading NFTs with low gas fees and creator royalties.",
    skills: ["Solidity", "Next.js", "ethers.js", "TailwindCSS"],
    type: "free",
    trustLevel: "medium",
    createdAt: "2023-07-22",
    collaborators: 2,
  },
  {
    id: "3",
    title: "DAO Governance Tool",
    description:
      "A tool to simplify proposal creation and voting for DAOs with gasless transactions.",
    skills: ["Solidity", "React", "TypeScript", "TheGraph"],
    type: "paid",
    trustLevel: "high",
    createdAt: "2023-08-05",
    collaborators: 5,
  },
  {
    id: "4",
    title: "Cross-chain Bridge",
    description:
      "Building a secure cross-chain bridge for transferring assets between blockchains.",
    skills: ["Rust", "Solidity", "Go", "zkSNARKs"],
    type: "paid",
    trustLevel: "medium",
    createdAt: "2023-09-10",
    collaborators: 4,
  },
  {
    id: "5",
    title: "DApp Analytics Dashboard",
    description:
      "An analytics dashboard for tracking DApp usage, active users, and revenue metrics.",
    skills: ["React", "D3.js", "GraphQL", "TheGraph"],
    type: "free",
    trustLevel: "low",
    createdAt: "2023-10-15",
    collaborators: 2,
  },
  {
    id: "6",
    title: "Social Network DApp",
    description:
      "A decentralized social network with content monetization and censorship resistance.",
    skills: ["Solidity", "React", "IPFS", "TailwindCSS"],
    type: "free",
    trustLevel: "medium",
    createdAt: "2023-11-03",
    collaborators: 3,
  },
];

// All possible skill tags
const ALL_SKILLS = [
  "Solidity",
  "React",
  "Web3.js",
  "TypeScript",
  "Next.js",
  "ethers.js",
  "TailwindCSS",
  "TheGraph",
  "Rust",
  "Go",
  "zkSNARKs",
  "D3.js",
  "GraphQL",
  "IPFS",
  "Hardhat",
  "Foundry",
  "Python",
  "Vyper",
];

const Projects = () => {
  const { isConnected } = useAbstraxionAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [projectType, setProjectType] = useState<string>("all");

  // Filter projects based on search query and filters
  const filteredProjects = PROJECTS.filter((project) => {
    // Filter by search query
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by selected skills (if any)
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => project.skills.includes(skill));

    // Filter by project type
    const matchesType = projectType === "all" || project.type === projectType;

    return matchesSearch && matchesSkills && matchesType;
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Find projects to collaborate on or create your own
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters{" "}
                  {selectedSkills.length > 0 && `(${selectedSkills.length})`}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Projects</SheetTitle>
                  <SheetDescription>
                    Narrow down projects based on your preferences
                  </SheetDescription>
                </SheetHeader>

                <div className="py-4">
                  <h3 className="font-medium mb-2">Project Type</h3>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <Button
                      variant={projectType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProjectType("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={projectType === "free" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProjectType("free")}
                    >
                      Free
                    </Button>
                    <Button
                      variant={projectType === "paid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setProjectType("paid")}
                    >
                      Paid
                    </Button>
                  </div>

                  <h3 className="font-medium mb-2">Skills</h3>
                  <div className="space-y-2">
                    {ALL_SKILLS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedSkills([]);
                      setProjectType("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                  <SheetTrigger asChild>
                    <Button>Apply Filters</Button>
                  </SheetTrigger>
                </div>
              </SheetContent>
            </Sheet>

            {isConnected && (
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            {isConnected && <TabsTrigger value="saved">Saved</TabsTrigger>}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          // Save project functionality would go here
                        }}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{project.collaborators} collaborators</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{project.createdAt}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <div className="w-full flex justify-between items-center">
                      <Badge
                        variant={
                          project.type === "paid" ? "default" : "secondary"
                        }
                      >
                        {project.type === "paid" ? "Paid" : "Free"}
                      </Badge>
                      <Button size="sm">View Details</Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                No projects found matching your criteria
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSkills([]);
                  setProjectType("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
