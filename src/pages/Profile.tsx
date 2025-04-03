import React from "react";
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

// Mock user data
const USER = {
  address: "0xabc...123",
  name: "Alex Thompson",
  email: "alex@example.com",
  avatar: null,
  bio: "Full-stack Web3 developer experienced in DeFi and NFT projects. Looking to collaborate on interesting dApps.",
  skills: [
    "Solidity",
    "React",
    "TypeScript",
    "Node.js",
    "Web3.js",
    "Hardhat",
    "GraphQL",
  ],
  xp: 720,
  xpProgress: 72, // percentage to next level
  level: 8,
  verifiedEmail: true,
  joinedDate: "November 2023",
};

// Mock projects
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
  const { isConnected, data: address } = useAbstraxionAccount();

  // Redirect to homepage if not connected
  if (!isConnected) {
    return <Navigate to="/" replace />;
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
                    <AvatarImage
                      src={USER.avatar || undefined}
                      alt={USER.name}
                    />
                    <AvatarFallback className="text-2xl bg-web3-light text-web3-primary">
                      {USER.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{USER.name}</CardTitle>
                <CardDescription>Level {USER.level} Developer</CardDescription>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 mx-auto p-2"
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
                      <span className="text-sm font-medium">XP: {USER.xp}</span>
                      <span className="text-sm text-muted-foreground">
                        {USER.xpProgress}%
                      </span>
                    </div>
                    <Progress value={USER.xpProgress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{USER.email}</span>
                      {USER.verifiedEmail && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined {USER.joinedDate}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
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
                      <p>{USER.bio}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {USER.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
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
    </Layout>
  );
};

export default Profile;
