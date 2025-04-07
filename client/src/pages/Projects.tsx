import React, { useState, useEffect, useCallback } from "react";
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
import {
  ArrowRight,
  Plus,
  Search,
  Users,
  Calendar,
  Filter,
  Loader2,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ProjectCardSkeleton } from "@/components/Loading";
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
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import { useToast } from "@/components/ui/use-toast";
import ProjectFormDialog from "@/components/ProjectFormDialog";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import type { ExtendedProject, Project } from "@/types/index";

type ExecuteResultOrUndefined = ExecuteResult | undefined;

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
  const { isConnected, data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const { toast } = useToast();
  const { isAuthenticated, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<ExtendedProject[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [projectType, setProjectType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    repositoryUrl: "",
    websiteUrl: "",
  });

  const [executeResult, setExecuteResult] =
    useState<ExecuteResultOrUndefined>(undefined);

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  // More efficient project loading strategy
  const getProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    // If client is available (user is connected), fetch from contract
    if (client && isConnected) {
      try {
        setLoading(true);
        toast({
          title: "Fetching live data",
          description: "Getting latest project information from blockchain...",
        });

        const contractResponse = await client.queryContractSmart(
          contractAddress,
          {
            ListProjects: {},
          }
        );

        if (Array.isArray(contractResponse) && contractResponse.length > 0) {
          const formattedProjects = contractResponse.map((project) => ({
            project_id: project.id,
            title: project.title,
            description: project.description,
            owner_address: project.owner,
            skills_required: project.skills_required || [],
            status: project.status || "Open",
            collaborator_count: project.collaborator_count || 0,
            owner_name: "Unknown User",
            created_at: project.created_at || new Date().toISOString(),
          }));

          // Try to fetch additional details from DB
          try {
            const dbResponse = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/projects`
            );
            const dbProjects = dbResponse.data || [];

            // Merge contract projects with DB details where available
            const mergedProjects = formattedProjects.map((contractProject) => {
              const dbProject = dbProjects.find(
                (p) => p.project_id === contractProject.project_id
              );
              return dbProject
                ? { ...contractProject, ...dbProject }
                : contractProject;
            });

            setProjects(mergedProjects);
          } catch (dbError) {
            console.error("DB fetch failed:", dbError);
            setProjects(formattedProjects);
          }
        }
      } catch (contractError) {
        console.error("Contract fetch failed:", contractError);
        toast({
          title: "Blockchain Error",
          description: "Falling back to database records",
          variant: "destructive",
        });
        await fetchFromDatabase();
      }
    } else {
      // If no client, fetch from database
      await fetchFromDatabase();
    }

    setLoading(false);
  }, [client, isConnected, toast]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  // Filter projects based on search query and filters
  const filteredProjects = projects.filter((project) => {
    // Filter by search query
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by selected skills (if any)
    const projectSkills = Array.isArray(project.skills_required)
      ? project.skills_required
      : [];
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) =>
        projectSkills.some(
          (projSkill) => projSkill.toLowerCase() === skill.toLowerCase()
        )
      );

    // Filter by project type - fix comparison logic
    const projectTypeValue = project.type || "Standard"; // Get project's type value
    const matchesType =
      projectType === "all" || // Using component state variable
      projectTypeValue.toLowerCase() === projectType.toLowerCase();

    return matchesSearch && matchesSkills && matchesType;
  });

  // Separate function for database fetching
  const fetchFromDatabase = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/projects`;
      const dbResponse = await axios.get(apiUrl);

      if (dbResponse.data) {
        const formattedProjects = Array.isArray(dbResponse.data)
          ? dbResponse.data.map((project) => ({
              ...project,
              contract_synced: false, // Flag to indicate it's from DB
            }))
          : [];

        console.log(formattedProjects);
        setProjects(formattedProjects);
      }
    } catch (dbError) {
      console.error("Database fetch failed:", dbError);
      setError("Failed to load projects");
      setProjects([]);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create project submission handler
  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !client) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a project",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please register or login first",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingProject(true);

    const skillsArray = formData.skillsRequired
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    // Contract message
    const msg = {
      CreateProject: {
        title: formData.title,
        description: formData.description,
        skills_required: skillsArray,
      },
    };

    try {
      // Step 1: Create project on-chain first
      const res = await client?.execute(
        account.bech32Address,
        contractAddress,
        msg,
        "auto"
      );

      setExecuteResult(res);
      console.log("On-chain transaction successful:", res);

      // Get project ID from events
      const projectId = res.events[11].attributes[2].value;

      if (!projectId) {
        throw new Error("Failed to extract project ID from transaction");
      }

      // Step 2: Once on-chain creation is successful, save to database
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/projects`,
          {
            project_id: projectId,
            title: formData.title,
            description: formData.description,
            skills_required: skillsArray,
            repository_url: formData.repositoryUrl,
            website_url: formData.websiteUrl,
            status: "Open",
          },
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        toast({
          title: "Project created!",
          description: "Your project has been successfully created.",
        });

        // Reset form
        setFormData({
          title: "",
          description: "",
          skillsRequired: "",
          repositoryUrl: "",
          websiteUrl: "",
        });

        setIsCreateDialogOpen(false);

        // Refresh projects after successful creation
        await getProjects();
      } catch (dbError) {
        console.error("Database error:", dbError);
        toast({
          title: "Warning: Extra details not saved",
          description:
            "Your project was created on-chain, but additional details couldn't be saved to our database.",
          variant: "warning",
        });

        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreatingProject(false);
    }
  };

  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
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

                  <h3 className="font-medium mb-2 mt-4">Skills</h3>
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
              <Button
                className="flex items-center gap-2"
                onClick={() => setIsCreateDialogOpen(true)}
              >
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-xl font-bold text-red-500">{error}</div>
            <Button onClick={getProjects} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.project_id || project.id}
                className="card-hover border border-border overflow-hidden"
              >
                <CardHeader>
                  <CardTitle className="text-foreground">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills_required.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-2 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      <span>{project.owner_name || "Unknown Owner"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(project.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {project.collaborator_count || 0} Contributors
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button asChild className="w-full">
                    <Link
                      to={`/projects/${project.project_id}`}
                      className="flex items-center justify-center gap-2"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-xl font-bold">No projects found</div>
            <div className="text-muted-foreground mt-2">
              {searchQuery || selectedSkills.length > 0
                ? "Try adjusting your search or filters"
                : "Be the first to create a project!"}
            </div>
          </div>
        )}

        {/* Project Form Dialog */}
        <ProjectFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={createProject}
          formData={formData}
          handleChange={handleChange}
          loading={isCreatingProject}
        />
      </div>
    </Layout>
  );
};

export default Projects;
