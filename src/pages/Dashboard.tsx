import React from "react";
import Layout from "@/components/Layout";
import { Navigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Bell,
  MessageSquare,
  Plus,
  Users,
  Lightbulb,
  BarChart3,
  Briefcase,
  Clock,
} from "lucide-react";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";

// Mock data
const NOTIFICATIONS = [
  {
    id: "1",
    title: "New collaboration request",
    message: "John Doe wants to collaborate on 'DeFi Protocol'",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Project update",
    message: "NFT Marketplace: New milestone completed",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "3",
    title: "Achievement unlocked",
    message: "You've earned the 'Smart Contract Specialist' badge",
    time: "1 day ago",
    read: true,
  },
];

const ACTIVE_PROJECTS = [
  {
    id: "1",
    title: "DeFi Lending Protocol",
    progress: 65,
    role: "Smart Contract Developer",
    collaborators: 4,
    messages: 8,
  },
  {
    id: "2",
    title: "NFT Marketplace",
    progress: 82,
    role: "Frontend Developer",
    collaborators: 3,
    messages: 12,
  },
];

const STATS = {
  totalXP: 720,
  projectsCompleted: 3,
  currentProjects: 2,
  ideasSubmitted: 4,
};

const Dashboard = () => {
  const { isConnected } = useAbstraxionAccount();

  //   Redirect to homepage if not connected
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your projects
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Total XP</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-web3-primary" />
                {STATS.totalXP}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardDescription>Projects Completed</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-web3-primary" />
                {STATS.projectsCompleted}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardDescription>Current Projects</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Clock className="h-5 w-5 mr-2 text-web3-primary" />
                {STATS.currentProjects}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardDescription>Ideas Submitted</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-web3-primary" />
                {STATS.ideasSubmitted}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>
                    Your ongoing projects and collaborations
                  </CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link to="/projects" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    New Project
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {ACTIVE_PROJECTS.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{project.title}</h3>
                        <Badge variant="outline">{project.role}</Badge>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {project.progress}%
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{project.collaborators}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageSquare className="h-4 w-4" />
                            <span>{project.messages}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            to={`/projects/${project.id}`}
                            className="flex items-center gap-1"
                          >
                            View <ArrowRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/projects">View All Projects</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Notifications */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Stay updated with your projects
                  </CardDescription>
                </div>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {NOTIFICATIONS.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        !notification.read
                          ? "bg-primary/5 border-primary/20"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {notification.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full">
                  View All Notifications
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
