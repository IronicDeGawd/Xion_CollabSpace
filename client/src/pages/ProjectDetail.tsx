import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

// Define a more detailed project type
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
  const { toast } = useToast();

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError("Invalid project ID");
        setLoading(false);
        return;
      }

      // Check cache first
      const cachedProject = sessionStorage.getItem(`project-${id}`);
      const cacheTime = sessionStorage.getItem(`project-${id}-time`);
      const isCacheValid =
        cacheTime && Date.now() - parseInt(cacheTime) < 5 * 60 * 1000; // 5 minute cache

      if (cachedProject && isCacheValid) {
        try {
          const parsedProject = JSON.parse(cachedProject);
          setProject(parsedProject);

          // Check for collaborator status
          if (isAuthenticated && user) {
            const userCollaborator = parsedProject.collaborators?.find(
              (c) => c.address === user.address
            );
            setCollaborationStatus(userCollaborator?.status || null);
          }

          setLoading(false);

          // Still fetch in background to update cache
          fetchAndCacheProject();
          return;
        } catch (e) {
          console.error("Cache parsing error:", e);
          // Continue with normal fetch if cache parsing fails
        }
      }

      setLoading(true);
      await fetchAndCacheProject();
    };

    // Helper function to fetch and cache
    const fetchAndCacheProject = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects/${id}`
        );

        console.log("Project detail response:", response.data);

        // Normalize the project data to ensure all fields exist
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
        };

        setProject(projectData);

        // Cache the project data
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

    // Verify ownership
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

    // Verify ownership
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

      // Update collaborator in local state
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

    // Verify ownership
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

      // Update local state
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

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Error</h2>
            <p className="text-muted-foreground mt-2">
              {error || "Project not found"}
            </p>
            <Button className="mt-4" asChild>
              <Link to="/projects">Back to Projects</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Is user the owner?
  const isOwner = isAuthenticated && user?.address === project.owner_address;

  // Can user request to join?
  const canRequestToJoin = isAuthenticated && !isOwner && !collaborationStatus;

  // Does user have a pending request?
  const hasPendingRequest = collaborationStatus === "Pending";

  // Is user an approved collaborator?
  const isCollaborator = collaborationStatus === "Approved";

  // Are there pending collaboration requests?
  const pendingRequests = project.collaborators.filter(
    (c) => c.status === "Pending"
  );

  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Project header with status badge and controls */}
        <div className="mb-6">
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
                    "transition-colors duration-300",
                    project.status === "Open" &&
                      "border-green-500/50 text-green-500",
                    project.status === "In Progress" &&
                      "border-blue-500/50 text-blue-500",
                    project.status === "Completed" &&
                      "border-purple-500/50 text-purple-500"
                  )}
                >
                  {project.status}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              {/* Project status dropdown for owner */}
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

              {/* Request to join button */}
              {canRequestToJoin && (
                <Button
                  className="flex items-center gap-2"
                  onClick={handleRequestToJoin}
                >
                  <GitBranch className="h-4 w-4" />
                  Request to Join
                </Button>
              )}

              {/* Pending request indicator */}
              {hasPendingRequest && (
                <Button disabled className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-pulse" />
                  Request Pending
                </Button>
              )}

              {/* Collaborator indicator */}
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
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                {isOwner && (
                  <TabsTrigger value="requests">
                    Requests{" "}
                    {pendingRequests.length > 0 &&
                      `(${pendingRequests.length})`}
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">
                        {project.description}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
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

                  {/* Show collaborators */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Project Owner */}
                        <div className="flex items-center gap-3">
                          <Avatar>
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

                        {/* Collaborators */}
                        {project.collaborators
                          .filter((c) => c.status === "Approved")
                          .map((collaborator) => (
                            <div
                              key={collaborator.id}
                              className="flex items-center gap-3"
                            >
                              <Avatar>
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

                        {/* Show message if no collaborators yet */}
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

              <TabsContent value="tasks">{/* Tasks content */}</TabsContent>

              <TabsContent value="discussion">
                {/* Discussion content */}
              </TabsContent>

              {/* Collaboration Requests Tab (for project owner) */}
              {isOwner && (
                <TabsContent value="requests">
                  <Card>
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
                              className="p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <Avatar>
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

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
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

            {/* Project links */}
            <Card>
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

            {/* Team members card */}
            <Card>
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
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50"
                      >
                        <Avatar>
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

                  {/* Request to join button */}
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
