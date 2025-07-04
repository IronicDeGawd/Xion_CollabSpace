"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Share2,
  Users,
  Wallet,
  Loader2,
  Check,
  Clock,
  GitBranch,
  Link2,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  useAbstraxionAccount,
  useAbstraxionSigningClient,
} from "@burnt-labs/abstraxion";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectDetailSkeleton } from "@/components/loadingSkeletons/ProjectDetailSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectDetail {
  project_id: string;
  title: string;
  description: string;
  skills_required: string[];
  owner_address: string;
  owner_name: string;
  owner_image?: string;
  repository_url?: string;
  website_url?: string;
  status: string;
  created_at: string;
  collaborators: Collaborator[];
  is_paid?: boolean;
}

interface Collaborator {
  id: number;
  user_id: number;
  address: string;
  name: string;
  image_url?: string;
  role: string;
  status: string;
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isConnected, data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const { isAuthenticated, token, user } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState("Contributor");
  const [collaborationStatus, setCollaborationStatus] = useState<string | null>(
    null
  );
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError("Invalid project ID");
        setLoading(false);
        return;
      }

      // Check if project ID has the expected format
      const validIdPattern = /^proj-\d+-\d+-\w+$/;
      if (!validIdPattern.test(id) && !id.match(/^[a-zA-Z0-9-]+$/)) {
        console.warn("Project ID doesn't match expected format:", id);
      }

      const cachedProject = sessionStorage.getItem(`project-${id}`);
      const cacheTime = sessionStorage.getItem(`project-${id}-time`);
      const isCacheValid =
        cacheTime && Date.now() - Number.parseInt(cacheTime) < 5 * 60 * 1000;

      if (cachedProject && isCacheValid) {
        try {
          const parsedProject = JSON.parse(cachedProject);
          setProject(parsedProject);

          if (isAuthenticated && user) {
            const userCollaborator = parsedProject.collaborators?.find(
              (c) => c.address === user.address
            );
            setCollaborationStatus(userCollaborator?.status || null);
          }

          setLoading(false);
          fetchAndCacheProject();
          return;
        } catch (e) {
          console.error("Cache parsing error:", e);
        }
      }

      setLoading(true);
      await fetchAndCacheProject();
    };

    const fetchAndCacheProject = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects/${id}`
        );

        const projectData: ProjectDetail = {
          project_id: response.data.project_id || id || "",
          title: response.data.title || "Untitled Project",
          description: response.data.description || "No description provided",
          skills_required: Array.isArray(response.data.skills_required)
            ? response.data.skills_required
            : [],
          owner_address:
            response.data.owner_address || response.data.owner || "",
          owner_name: response.data.owner_name || "Unknown User",
          owner_image: response.data.owner_image,
          repository_url: response.data.repository_url,
          website_url: response.data.website_url,
          status: response.data.status || "Open",
          created_at: response.data.created_at || new Date().toISOString(),
          collaborators: Array.isArray(response.data.collaborators)
            ? response.data.collaborators
            : [],
          is_paid: response.data.is_paid || false,
        };

        setProject(projectData);
        sessionStorage.setItem(`project-${id}`, JSON.stringify(projectData));
        sessionStorage.setItem(`project-${id}-time`, Date.now().toString());

        if (isAuthenticated && user) {
          const userCollaborator = projectData.collaborators.find(
            (c) => c.address === user.address
          );
          setCollaborationStatus(userCollaborator?.status || null);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, isAuthenticated, user]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the project team.",
    });

    setNewMessage("");
  };

  const handleRequestToJoin = async () => {
    if (!isAuthenticated || !token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request collaboration",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}/collaborate`,
        { role },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setCollaborationStatus("Pending");

      toast({
        title: "Request Sent",
        description:
          "Your request to join this project has been sent to the project owner.",
      });
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Failed to send collaboration request";

      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const updateProjectStatus = async (newStatus: string) => {
    if (!isAuthenticated || !token || !project) {
      return;
    }

    if (user?.address !== project.owner_address) {
      toast({
        title: "Permission Denied",
        description: "Only the project owner can update the status",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/projects/${id}/status`,
        { status: newStatus },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setProject({
        ...project,
        status: newStatus,
      });

      toast({
        title: "Status Updated",
        description: `Project status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update project status",
        variant: "destructive",
      });
    }
  };

  const handleCollaborationResponse = async (
    userId: number,
    status: "Approved" | "Rejected"
  ) => {
    if (!isAuthenticated || !token || !project) {
      return;
    }

    if (user?.address !== project.owner_address) {
      return;
    }

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/projects/${id}/collaborate/${userId}`,
        { status },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setProject({
        ...project,
        collaborators: project.collaborators.map((c) =>
          c.user_id === userId ? { ...c, status } : c
        ),
      });

      toast({
        title: "Request Updated",
        description: `Collaboration request ${status.toLowerCase()}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update collaboration request",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCollaborator = async (userId: number) => {
    if (!isAuthenticated || !token || !project) {
      return;
    }

    if (user?.address !== project.owner_address) {
      toast({
        title: "Permission Denied",
        description: "Only the project owner can remove collaborators",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/projects/${id}/collaborate/${userId}`,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setProject({
        ...project,
        collaborators: project.collaborators.filter(
          (c) => c.user_id !== userId
        ),
      });

      toast({
        title: "Collaborator Removed",
        description: "The collaborator has been removed from the project",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove collaborator",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async () => {
    if (!account || !client || !isAuthenticated || !project) {
      toast({
        title: "Error",
        description: "Could not delete project. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsDeletingProject(true);

    try {
      // Step 1: Delete the project on-chain
      const msg = {
        DeleteProject: {
          project_id: project.project_id,
        },
      };

      const res = await client.execute(
        account.bech32Address,
        contractAddress,
        msg,
        "auto"
      );

      console.log("On-chain deletion successful:", res);

      // Step 2: Delete the project from the database
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/projects/${id}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        toast({
          title: "Project deleted",
          description: "Your project has been successfully deleted",
        });

        // Redirect to projects list
        navigate("/projects");
      } catch (dbError) {
        console.error("Database deletion error:", dbError);
        toast({
          title: "Warning",
          description: "Project deleted on-chain but database cleanup failed",
          variant: "warning",
        });
        navigate("/projects");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error deleting project",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeletingProject(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <ProjectDetailSkeleton />
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <Card className="my-8">
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold">Error</h2>
              <p className="text-muted-foreground mt-2">
                {error || "Project not found"}
              </p>
              <Button className="mt-4" asChild>
                <Link to="/projects">Back to Projects</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const isOwner = isAuthenticated && user?.address === project.owner_address;
  const canRequestToJoin = isAuthenticated && !isOwner && !collaborationStatus;
  const hasPendingRequest = collaborationStatus === "Pending";
  const isCollaborator = collaborationStatus === "Approved";
  const pendingRequests = project.collaborators.filter(
    (c) => c.status === "Pending"
  );

  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-6 animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Created on {new Date(project.created_at).toLocaleDateString()}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "transition-all duration-500 hover:scale-105",
                    project.status === "Open" &&
                      "border-green-500/50 text-green-500 hover:bg-green-500/10",
                    project.status === "In Progress" &&
                      "border-blue-500/50 text-blue-500 hover:bg-blue-500/10",
                    project.status === "Completed" &&
                      "border-purple-500/50 text-purple-500 hover:bg-purple-500/10"
                  )}
                >
                  {project.status}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 transition-all duration-300 hover:bg-primary/5 hover:border-primary/30"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>Update Status</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => updateProjectStatus("Open")}
                    >
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => updateProjectStatus("In Progress")}
                    >
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => updateProjectStatus("Completed")}
                    >
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Project
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your project and remove your data from the
                        blockchain.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteProject}
                        disabled={isDeletingProject}
                      >
                        {isDeletingProject ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {canRequestToJoin && (
                <Button
                  className="flex items-center gap-2"
                  onClick={handleRequestToJoin}
                >
                  <GitBranch className="h-4 w-4" />
                  Request to Join
                </Button>
              )}

              {hasPendingRequest && (
                <Button disabled className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-pulse" />
                  Request Pending
                </Button>
              )}

              {isCollaborator && (
                <Button variant="outline" className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Project Collaborator
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="w-full mb-6 transition-all duration-300">
                <TabsTrigger
                  value="overview"
                  className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
                >
                  Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="discussion"
                  className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
                >
                  Discussion
                </TabsTrigger>
                <TabsTrigger
                  value="requests"
                  className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
                >
                  Requests{" "}
                  {pendingRequests.length > 0 && `(${pendingRequests.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="overview"
                className="animate-in fade-in-50 duration-300"
              >
                <div className="space-y-6">
                  <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">
                        {project.description}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
                    <CardHeader>
                      <CardTitle>Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.skills_required.map((skill) => (
                          <Badge key={skill}>{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
                    <CardHeader>
                      <CardTitle>Project Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge
                        variant={project.is_paid ? "default" : "secondary"}
                      >
                        {project.is_paid ? "Paid Project" : "Free Project"}
                      </Badge>
                      {project.is_paid && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          This project offers compensation to contributors
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
                    <CardHeader>
                      <CardTitle>Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="transition-all duration-300 hover:scale-110">
                            {project.owner_image ? (
                              <AvatarImage
                                src={project.owner_image}
                                alt={project.owner_name}
                              />
                            ) : null}
                            <AvatarFallback>
                              {project.owner_name?.substring(0, 2) || "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">
                              {project.owner_name}
                            </div>

                            <div className="text-xs text-muted-foreground">
                              Project Owner
                            </div>
                          </div>
                          <Badge>Owner</Badge>
                        </div>

                        {project.collaborators
                          .filter((c) => c.status === "Approved")
                          .map((collaborator) => (
                            <div
                              key={collaborator.id}
                              className="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-accent/50"
                            >
                              <Avatar className="transition-all duration-300 hover:scale-110">
                                {collaborator.image_url ? (
                                  <AvatarImage
                                    src={collaborator.image_url}
                                    alt={collaborator.name}
                                  />
                                ) : null}
                                <AvatarFallback>
                                  {collaborator.name?.substring(0, 2) || "??"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium">
                                  {collaborator.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {collaborator.role}
                                </div>
                              </div>
                              <Badge variant="secondary">Collaborator</Badge>
                            </div>
                          ))}

                        {project.collaborators.filter(
                          (c) => c.status === "Approved"
                        ).length === 0 && (
                          <div className="text-center py-4 text-muted-foreground">
                            No collaborators yet
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent
                value="tasks"
                className="animate-in fade-in-50 duration-300"
              >
                {/* Tasks content */}
              </TabsContent>

              <TabsContent
                value="discussion"
                className="animate-in fade-in-50 duration-300"
              >
                {/* Discussion content */}
              </TabsContent>

              {isOwner && (
                <TabsContent
                  value="requests"
                  className="animate-in fade-in-50 duration-300"
                >
                  <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
                    <CardHeader>
                      <CardTitle>Collaboration Requests</CardTitle>
                      <CardDescription>
                        People who want to join your project
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {pendingRequests.length > 0 ? (
                        <div className="space-y-4">
                          {pendingRequests.map((request) => (
                            <div
                              key={request.id}
                              className="p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-accent/30"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <Avatar className="transition-all duration-300 hover:scale-110">
                                  {request.image_url ? (
                                    <AvatarImage
                                      src={request.image_url}
                                      alt={request.name}
                                    />
                                  ) : null}
                                  <AvatarFallback>
                                    {request.name?.substring(0, 2) || "??"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {request.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Requested Role: {request.role}
                                  </div>
                                </div>
                                <Badge variant="outline">Pending</Badge>
                              </div>

                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleCollaborationResponse(
                                      request.user_id,
                                      "Rejected"
                                    )
                                  }
                                >
                                  Decline
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleCollaborationResponse(
                                      request.user_id,
                                      "Approved"
                                    )
                                  }
                                >
                                  Approve
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No pending collaboration requests
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <CardHeader>
                <CardTitle>Project Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="transition-all duration-300 hover:scale-110">
                    {project.owner_image ? (
                      <AvatarImage
                        src={project.owner_image}
                        alt={project.owner_name}
                      />
                    ) : null}
                    <AvatarFallback>
                      {project.owner_name?.substring(0, 2) || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{project.owner_name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Wallet className="h-3 w-3" />
                      {project.owner_address.substring(0, 8)}...
                      {project.owner_address.substring(
                        project.owner_address.length - 4
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.repository_url && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={project.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                        GitHub Repository
                      </a>
                    </Button>
                  )}

                  {project.website_url && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={project.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Link2 className="h-4 w-4" />
                        Project Website
                      </a>
                    </Button>
                  )}

                  {!project.repository_url && !project.website_url && (
                    <div className="text-center py-4 text-muted-foreground">
                      No project links available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.collaborators
                    .filter((c) => c.status === "Approved")
                    .map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-accent/50"
                      >
                        <Avatar className="transition-all duration-300 hover:scale-110">
                          {collaborator.image_url ? (
                            <AvatarImage
                              src={collaborator.image_url}
                              alt={collaborator.name}
                            />
                          ) : null}
                          <AvatarFallback>
                            {collaborator.name?.substring(0, 2) || "??"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{collaborator.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {collaborator.role}
                          </div>
                        </div>
                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleRemoveCollaborator(collaborator.user_id)
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}

                  {project.collaborators.filter((c) => c.status === "Approved")
                    .length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No team members yet
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {
                        project.collaborators.filter(
                          (c) => c.status === "Approved"
                        ).length
                      }{" "}
                      Contributors
                    </span>
                  </div>

                  {canRequestToJoin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRequestToJoin}
                    >
                      Join Team
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
