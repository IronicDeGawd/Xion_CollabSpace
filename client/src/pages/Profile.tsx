import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Navigate } from "react-router-dom";
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
} from "lucide-react";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import { useToast } from "@/components/ui/use-toast";

// Mock projects - keep these for now as they're not in the user data yet
const USER_PROJECTS = [
  {
    id: "1",
    title: "DeFi Lending Protocol",
    description: "A lending platform with algorithmic interest rates.",
    role: "Smart Contract Developer",
    status: "In Progress",
  },
  {
    id: "2",
    title: "NFT Marketplace",
    description: "Marketplace for trading digital collectibles with low fees.",
    role: "Frontend Developer",
    status: "Completed",
  },
];

const Profile = () => {
  const { isConnected, data: walletData } = useAbstraxionAccount();
  const { user, loading, error, updateProfile } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { toast } = useToast();

  // Calculate a simple XP system (can be enhanced later)
  const userLevel = user ? Math.floor(user.skills.length / 2) + 1 : 1;
  const userXP = user ? user.skills.length * 100 : 0;
  const xpProgress = 70; // Mock progress percentage (can be calculated based on XP logic)

  // Get the month and year the user joined
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent";

  // Handle profile update
  const handleUpdateProfile = async (about: string, imageUrl: string) => {
    try {
      await updateProfile(about, imageUrl);
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

  // Redirect to homepage if not connected
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Skeleton className="w-24 h-24 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-32 mx-auto" />
                  <Skeleton className="h-4 w-24 mx-auto mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-10 w-full mb-6" />
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button>Retry</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Avatar className="w-24 h-24">
                    {user?.image_url ? (
                      <AvatarImage src={user.image_url} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="text-2xl bg-web3-light text-web3-primary">
                      {user?.name
                        ? user.name.substring(0, 2).toUpperCase()
                        : "??"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{user?.name}</CardTitle>
                <CardDescription>Level {userLevel} Developer</CardDescription>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 mx-auto p-2"
                  >
                    <Wallet className="h-4 w-7" />
                    <span className="line-clamp-2 text-xs overflow-hidden text-ellipsis">
                      {user?.address.substring(0, 8)}...
                      {user?.address.substring(user.address.length - 6)}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">XP: {userXP}</span>
                      <span className="text-sm text-muted-foreground">
                        {xpProgress}%
                      </span>
                    </div>
                    <Progress value={xpProgress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-sm truncate">{user?.email}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs self-start sm:self-auto sm:ml-auto"
                      >
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined {joinedDate}</span>
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
              <TabsList className="w-full mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        {user?.about ||
                          "Tell us about yourself and your experience in Web3 development."}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {user?.skills && user.skills.length > 0 ? (
                          user.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">
                            No skills added yet
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {USER_PROJECTS.map((project) => (
                          <div
                            key={project.id}
                            className="p-4 border rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{project.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {project.description}
                                </p>
                              </div>
                              <Badge>{project.status}</Badge>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-muted-foreground">
                              <Briefcase className="h-4 w-4 mr-1" />
                              <span>Role: {project.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>My Projects</CardTitle>
                    <CardDescription>
                      Projects you've created or are contributing to
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {USER_PROJECTS.map((project) => (
                        <div key={project.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{project.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {project.description}
                              </p>
                            </div>
                            <Badge>{project.status}</Badge>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-muted-foreground">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span>Role: {project.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contributions">
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

              <TabsContent value="achievements">
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
      </div>

      {/* Profile Edit Dialog */}
      <ProfileEditDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        initialData={{
          about: user?.about || "",
          imageUrl: user?.image_url || "",
        }}
        onSave={handleUpdateProfile}
      />
    </Layout>
  );
};

export default Profile;
