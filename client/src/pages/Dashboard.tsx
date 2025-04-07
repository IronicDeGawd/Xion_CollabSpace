import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowRight,
  Plus,
  Users,
  Lightbulb,
  BarChart3,
  Briefcase,
  Clock,
  Bell,
} from "lucide-react";
import { ExtendedProject } from "@/types/index";

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

  // Fetch active projects from API route
  const getActiveProjects = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/projects`;
      const res = await axios.get(apiUrl);
      const projects = res.data || [];
      setActiveProjects(projects);
      // Simple stats calc (customize as needed)
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {stats.totalXP}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Projects Completed</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-web3-primary" />
                {stats.projectsCompleted}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Current Projects</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Clock className="h-5 w-5 mr-2 text-web3-primary" />
                {stats.currentProjects}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardDescription>Ideas Submitted</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-web3-primary" />
                {stats.ideasSubmitted}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Active Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">Loading projects...</div>
            ) : activeProjects.length > 0 ? (
              activeProjects.map((project: ExtendedProject) => (
                <Card key={project.project_id || project.id} className="mb-4">
                  <CardHeader>
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
                    <Button asChild className="w-full">
                      <Link to={`/projects/${project.project_id}`}>
                        View Details <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-xl font-bold">No projects found</div>
              </div>
            )}
          </div>
        </div>

        {/* Notifications - kept as is or update similarly */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Stay updated with your projects
                </CardDescription>
              </div>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>{/* You can update this as needed */}</CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">
                View All Notifications
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
