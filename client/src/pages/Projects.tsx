import React, { useState, useEffect } from "react";
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
import {
  useAbstraxionAccount,
  useAbstraxionClient,
} from "@burnt-labs/abstraxion";

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

// Define the Project type to match the contract response
interface Project {
  id: string;
  title: string;
  description: string;
  owner: string;
  skills_required: string[];
  type: string;
  trust_level: string;
  created_at: string;
  // Commented out for future implementation when contract includes this data
  // collaborators: number;
  // upvotes: number;
}

const Projects = () => {
  const { isConnected } = useAbstraxionAccount();
  const { client: queryClient } = useAbstraxionClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [projectType, setProjectType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  const getProject = async () => {
    setLoading(true);
    setError(null);

    try {
      // Query the contract
      const response = await queryClient.queryContractSmart(contractAddress, {
        ListProjects: {},
      });

      console.log(response);

      // Set the projects from the response
      if (Array.isArray(response)) {
        setProjects(response);
      } else {
        console.error("Unexpected response format:", response);
        setError("Unexpected response format from the contract");
      }
    } catch (error) {
      console.error("Error querying contract:", error);
      setError("Failed to query the contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryClient) {
      getProject();
    }
  }, [queryClient]);

  // Filter projects based on search query and filters
  const filteredProjects = projects.filter((project) => {
    // Filter by search query
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by selected skills (if any)
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => project.skills_required.includes(skill));

    // Filter by project type
    const matchesType = projectType === "all" || project.type === projectType;

    return matchesSearch && matchesSkills && matchesType;
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Future function for handling upvotes - commented for future implementation
  // const handleUpvote = (projectId: string, e: React.MouseEvent) => {
  //   e.preventDefault();
  //   // Upvote logic to be implemented when contract supports it
  //   console.log("Upvote project:", projectId);
  // };

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
                  {/* Free/Paid currently not added to contract */}
                  {/* <div className="grid grid-cols-3 gap-2 mb-6">
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
                  </div> */}

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

            {/* {isConnected && (
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
            )} */}
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

        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground">Loading projects...</div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <div className="text-red-500">{error}</div>
            <Button variant="outline" className="mt-4" onClick={getProject}>
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                // <Link key={project.id} to={`/projects/${project.id}`}>
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
                      {project.skills_required.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {/* Commenting out collaborators display for future implementation */}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {/* <span>{project.collaborators || 0} collaborators</span> */}
                        <span>0 collaborators</span>{" "}
                        {/* Placeholder until contract data is available */}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{project.created_at || "N/A"}</span>
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

                    {/* Upvote functionality - commented for future implementation */}
                    {/* <div className="mt-2 w-full flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1"
                            onClick={(e) => handleUpvote(project.id, e)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{project.upvotes || 0}</span>
                          </Button>
                        </div>
                      </div> */}
                  </CardFooter>
                </Card>
                // </Link>
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
        )}
      </div>
    </Layout>
  );
};

export default Projects;
