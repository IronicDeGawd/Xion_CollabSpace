"use client";

import { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Award,
  GitBranch,
  Briefcase,
  UserCircle2,
  Mail,
  Wallet,
  Loader2,
} from "lucide-react";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { useToast } from "@/components/ui/use-toast";
import { ProfileSkeleton } from "@/components/loadingSkeletons/ProfileSkeleton";

interface Project {
  project_id: string;
  title: string;
  description: string;
  status: string;
  role?: string;
  collaboration_status?: string;
}

interface UserProjects {
  owned: Project[];
  collaborating: Project[];
}

const Profile = () => {
  const { isConnected, data: address } = useAbstraxionAccount();
  const { isAuthenticated, user, updateProfile } = useAuth();
  const [userProjects, setUserProjects] = useState<UserProjects>({
    owned: [],
    collaborating: [],
  });
  const [projectsLoading, setProjectsLoading] = useState(false);
  const fetchedRef = useRef(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Manage loading state based on auth status
  useEffect(() => {
    // Only show loading if we're connected and have a token but user data is still loading
    if (isConnected && localStorage.getItem("token") && !user) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isConnected, user]);

  useEffect(() => {
    console.log("Current user data:", user);
  }, [user]);

  // Format date to readable string
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle profile update
  const handleUpdateProfile = async (
    bio: string,
    imageUrl: string,
    githubUrl?: string,
    telegramId?: string,
    discordId?: string
  ) => {
    try {
      await updateProfile(bio, imageUrl, githubUrl, telegramId, discordId);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update your profile",
        variant: "destructive",
      });
    }
  };

  // Create a complete userData object with all required properties
  const userData = {
    name: user?.name || "Guest User",
    email: user?.email || "Not provided",
    address: user?.address || address?.bech32Address || "Not connected",
    skills: user?.skills || [],
    image_url: user?.image_url || undefined,
    bio: user?.bio || "No bio provided",
    xp: user?.xp || Math.floor(Math.random() * 500) + 50,
    xpProgress: user?.xpProgress || Math.floor(Math.random() * 100),
    verifiedEmail: user?.verifiedEmail || true,
    joinedDate: user?.created_at ? formatDate(user.created_at) : "Recently",
    githubUrl: user?.github_url || "",
    telegramId: user?.telegram_id || "",
    discordId: user?.discord_id || "",
  };

  // Modify the useEffect hook to include address?.bech32Address in dependencies
  useEffect(() => {
    // Skip if conditions aren't right
    if (
      !isConnected ||
      !isAuthenticated ||
      !address?.bech32Address ||
      fetchedRef.current
    ) {
      return;
    }

    fetchedRef.current = true;
    const controller = new AbortController();

    const fetchUserProjects = async () => {
      setProjectsLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/projects/user/${address.bech32Address}`,
          { signal: controller.signal }
        );

        setUserProjects({
          owned: response.data.owned || [],
          collaborating: response.data.collaborating || [],
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error fetching user projects:", error);
        setUserProjects({ owned: [], collaborating: [] });
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchUserProjects();

    return () => {
      controller.abort();
      fetchedRef.current = false;
    };
  }, [isConnected, isAuthenticated, address?.bech32Address]);

  // Redirect to home if not connected
  if (!isConnected || !isAuthenticated) {
    return (
      <Layout>
        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Profile Not Available</h1>
          <p className="text-muted-foreground mb-8">
            Please connect your wallet and sign in to view your profile.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-full mx-auto">
        {loading ? (
          <ProfileSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-card border border-border transition-all duration-300 hover:shadow-md hover:border-primary/20">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Avatar className="w-24 h-24 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary/10">
                      <AvatarImage
                        src={userData.image_url || undefined}
                        alt={userData.name}
                      />
                      <AvatarFallback className="text-2xl bg-secondary text-primary">
                        {userData.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>{userData.name}</CardTitle>
                  <CardDescription>Web3 Developer</CardDescription>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 mx-auto p-2 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
                    >
                      <Wallet className="h-4 w-7" />
                      <span className="line-clamp-2">
                        {address.bech32Address}
                      </span>
                      <span>...</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          XP: {userData.xp}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {userData.xpProgress}%
                        </span>
                      </div>
                      <Progress
                        value={userData.xpProgress}
                        className="h-2 transition-all duration-1000 animate-pulse-subtle"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{userData.email}</span>
                        {userData.verifiedEmail && (
                          <Badge variant="outline" className="ml-auto text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Joined {userData.joinedDate}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      onClick={() => setIsEditProfileOpen(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Profile Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="overview">
                <TabsList className="w-full mb-6 transition-all duration-300">
                  <TabsTrigger
                    value="overview"
                    className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="contributions"
                    className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
                  >
                    Contributions
                  </TabsTrigger>
                  <TabsTrigger
                    value="achievements"
                    className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
                  >
                    Achievements
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="overview"
                  className="animate-in fade-in-50 duration-300"
                >
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{userData.bio}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Skills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {userData.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Social Profiles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {userData.githubUrl ? (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              asChild
                            >
                              <a
                                href={userData.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <svg
                                  className="h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
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
                                GitHub |{" "}
                                {userData.githubUrl.replace(
                                  /^https?:\/\/github\.com\//,
                                  ""
                                )}
                              </a>
                            </Button>
                          ) : null}

                          {userData.telegramId ? (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              asChild
                            >
                              <a
                                href={`https://t.me/${userData.telegramId.replace(
                                  /^@/,
                                  ""
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <svg
                                  className="h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m22 2-7 20-4-9-9-4Z" />
                                  <path d="M22 2 11 13" />
                                </svg>
                                Telegram |{" "}
                                {userData.telegramId.startsWith("@")
                                  ? userData.telegramId
                                  : `@${userData.telegramId}`}
                              </a>
                            </Button>
                          ) : null}

                          {userData.discordId ? (
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              asChild
                            >
                              <a
                                href={`https://discord.com/users/${
                                  userData.discordId.split("#")[0]
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <svg
                                  className="h-4 w-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="9" cy="12" r="1" />
                                  <circle cx="15" cy="12" r="1" />
                                  <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
                                  <path d="M7 16.5c3.5 1 6.5 1 10 0" />
                                  <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2-1.5 2-3 0-1.5-2-5.5-2-5.5 0 0-2 4-2 5.5z" />
                                  <path d="M8.5 17c0 1-1.5 3-2 3-1.5 0-2-1.5-2-3 0-1.5 2-5.5 2-5.5 0 0 2 4 2 5.5z" />
                                </svg>
                                Discord | {userData.discordId}
                              </a>
                            </Button>
                          ) : null}

                          {!userData.githubUrl &&
                          !userData.telegramId &&
                          !userData.discordId ? (
                            <div className="text-center text-muted-foreground py-4">
                              No social profiles added yet. Edit your profile to
                              add them.
                            </div>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Recent Projects</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/projects">View All</Link>
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {projectsLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        ) : userProjects.owned.length > 0 ||
                          userProjects.collaborating.length > 0 ? (
                          <div className="space-y-4">
                            {/* Owned projects */}
                            {userProjects.owned.slice(0, 2).map((project) => (
                              <div
                                key={project.project_id}
                                className="p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-accent/30"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">
                                      {project.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {project.description.length > 100
                                        ? `${project.description.substring(
                                            0,
                                            100
                                          )}...`
                                        : project.description}
                                    </p>
                                  </div>
                                  <Badge>{project.status}</Badge>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                  <Briefcase className="h-4 w-4 mr-1" />
                                  <span>Role: Owner</span>
                                </div>
                                <div className="mt-2">
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link
                                      to={
                                        project.project_id
                                          ? `/projects/${project.project_id}`
                                          : "#"
                                      }
                                    >
                                      View Project
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            ))}

                            {/* Collaborating projects */}
                            {userProjects.collaborating
                              .slice(0, 2)
                              .map((project) => (
                                <div
                                  key={project.project_id}
                                  className="p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-accent/30"
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-medium">
                                        {project.title}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        {project.description.length > 100
                                          ? `${project.description.substring(
                                              0,
                                              100
                                            )}...`
                                          : project.description}
                                      </p>
                                    </div>
                                    <Badge
                                      variant={
                                        project.collaboration_status ===
                                        "Approved"
                                          ? "default"
                                          : "outline"
                                      }
                                    >
                                      {project.collaboration_status}
                                    </Badge>
                                  </div>
                                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                    <Briefcase className="h-4 w-4 mr-1" />
                                    <span>Role: {project.role}</span>
                                  </div>
                                  <div className="mt-2">
                                    <Button variant="ghost" size="sm" asChild>
                                      <Link
                                        to={
                                          project.project_id
                                            ? `/projects/${project.project_id}`
                                            : "#"
                                        }
                                      >
                                        View Project
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            You haven't created or joined any projects yet.
                            <div className="mt-2">
                              <Button asChild>
                                <Link to="/projects">Browse Projects</Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent
                  value="projects"
                  className="animate-in fade-in-50 duration-300"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>My Projects</CardTitle>
                      <CardDescription>
                        Projects you've created or are contributing to
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {projectsLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : userProjects.owned.length > 0 ||
                        userProjects.collaborating.length > 0 ? (
                        <div className="space-y-4">
                          {/* Owned projects */}
                          {userProjects.owned.map((project) => (
                            <div
                              key={project.project_id}
                              className="p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-accent/30"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">
                                    {project.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {project.description.length > 100
                                      ? `${project.description.substring(
                                          0,
                                          100
                                        )}...`
                                      : project.description}
                                  </p>
                                </div>
                                <Badge>{project.status}</Badge>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                <Briefcase className="h-4 w-4 mr-1" />
                                <span>Role: Owner</span>
                              </div>
                              <div className="mt-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link
                                    to={
                                      project.project_id
                                        ? `/projects/${project.project_id}`
                                        : "#"
                                    }
                                  >
                                    View Project
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ))}

                          {/* Collaborating projects */}
                          {userProjects.collaborating.map((project) => (
                            <div
                              key={project.project_id}
                              className="p-4 border rounded-lg transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:bg-accent/30"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">
                                    {project.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {project.description.length > 100
                                      ? `${project.description.substring(
                                          0,
                                          100
                                        )}...`
                                      : project.description}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    project.collaboration_status === "Approved"
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {project.collaboration_status}
                                </Badge>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                                <Briefcase className="h-4 w-4 mr-1" />
                                <span>Role: {project.role}</span>
                              </div>
                              <div className="mt-2">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link
                                    to={
                                      project.project_id
                                        ? `/projects/${project.project_id}`
                                        : "#"
                                    }
                                  >
                                    View Project
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          You haven't created or joined any projects yet.
                          <div className="mt-2">
                            <Button asChild>
                              <Link to="/projects">Browse Projects</Link>
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="contributions"
                  className="animate-in fade-in-50 duration-300"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Contributions</CardTitle>
                      <CardDescription>
                        Your contributions to projects and ideas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                      <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No contributions yet
                      </h3>
                      <p className="text-muted-foreground">
                        Join a project or submit ideas to start building your
                        contribution history
                      </p>
                      <Button className="mt-4">Browse Projects</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent
                  value="achievements"
                  className="animate-in fade-in-50 duration-300"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Achievements</CardTitle>
                      <CardDescription>
                        Your on-chain badges and achievements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                      <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No achievements yet
                      </h3>
                      <p className="text-muted-foreground">
                        Complete projects and earn XP to unlock achievements
                      </p>
                      <Button className="mt-4">Browse Projects</Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
      <ProfileEditDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        initialData={{
          about: user?.bio || "",
          imageUrl: user?.image_url || "",
          githubUrl: user?.github_url || "",
          telegramId: user?.telegram_id || "",
          discordId: user?.discord_id || "",
        }}
        onSave={handleUpdateProfile}
      />
    </Layout>
  );
};

export default Profile;
