"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowRight,
  Lightbulb,
  BarChart3,
  Briefcase,
  Clock,
  Bell,
} from "lucide-react";
import type { ExtendedProject } from "@/types/index";
import { DashboardSkeleton } from "@/components/loadingSkeletons/DashboardSkeleton";

const Dashboard = () => {
  const { isConnected, data: account } = useAbstraxionAccount();
  const { toast } = useToast();
  const [activeProjects, setActiveProjects] = useState<ExtendedProject[]>([]);
  const [stats, setStats] = useState({
    totalXP: 0,
    projectsCompleted: 0,
    currentProjects: 0,
    ideasSubmitted: 0,
  });
  const [loading, setLoading] = useState(true);

  const getActiveProjects = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/projects`;
      const res = await axios.get(apiUrl);
      const projects = res.data || [];
      setActiveProjects(projects);
      setStats({
        totalXP: projects.reduce((acc, p) => acc + (p.xp || 0), 0),
        projectsCompleted: projects.filter((p) => p.status === "Completed")
          .length,
        currentProjects: projects.filter((p) => p.status !== "Completed")
          .length,
        ideasSubmitted: projects.length,
      });
    } catch (error) {
      console.error("Error fetching active projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getActiveProjects();
  }, []);

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-8 animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="transition-all hover:shadow-md hover:border-primary/20 hover:translate-y-[-5px] animate-in fade-in-50 slide-in-from-bottom-5 duration-300 delay-100">
            <CardHeader className="py-4">
              <CardDescription>Total XP</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-web3-primary transition-all duration-500 hover:scale-125" />
                {stats.totalXP}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="transition-all hover:shadow-md hover:border-primary/20 hover:translate-y-[-5px] animate-in fade-in-50 slide-in-from-bottom-5 duration-300 delay-200">
            <CardHeader className="py-4">
              <CardDescription>Projects Completed</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-web3-primary transition-all duration-500 hover:scale-125" />
                {stats.projectsCompleted}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="transition-all hover:shadow-md hover:border-primary/20 hover:translate-y-[-5px] animate-in fade-in-50 slide-in-from-bottom-5 duration-300 delay-300">
            <CardHeader className="py-4">
              <CardDescription>Current Projects</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Clock className="h-5 w-5 mr-2 text-web3-primary transition-all duration-500 hover:scale-125" />
                {stats.currentProjects}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="transition-all hover:shadow-md hover:border-primary/20 hover:translate-y-[-5px] animate-in fade-in-50 slide-in-from-bottom-5 duration-300 delay-400">
            <CardHeader className="py-4">
              <CardDescription>Ideas Submitted</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-web3-primary transition-all duration-500 hover:scale-125" />
                {stats.ideasSubmitted}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Using the same grid layout as the working example */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project cards */}
          <div className="lg:col-span-2">
            {loading ? (
              <DashboardSkeleton />
            ) : activeProjects.length > 0 ? (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>
                    Your ongoing projects and collaborations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {activeProjects.map((project: ExtendedProject) => (
                      <Card
                        key={project.project_id || project.id}
                        className="border rounded-lg"
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-foreground">
                            {project.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                          <Button
                            asChild
                            className="w-full group transition-all duration-300 hover:shadow-md"
                          >
                            <Link to={`/projects/${project.project_id}`}>
                              View Details{" "}
                              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full h-full">
                <CardContent className="text-center py-12">
                  <div className="text-xl font-bold">No projects found</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notifications card */}
          <div className="lg:col-span-1">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/20 animate-in fade-in-50 slide-in-from-right-5 duration-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Stay updated with your projects
                  </CardDescription>
                </div>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>{/* Notifications content */}</CardContent>
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
