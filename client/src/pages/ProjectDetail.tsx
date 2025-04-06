import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Code,
  GitBranch,
  Link2,
  MessageCircle,
  Plus,
  Send,
  Share2,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";

// Mock project data - in a real app, you'd fetch this based on ID
const PROJECT = {
  id: "1",
  title: "DeFi Yield Aggregator",
  description:
    "Building a cross-chain yield optimizer that automatically moves funds between protocols to maximize returns. The platform will feature a user-friendly dashboard where users can track their yield farming performance across multiple chains.",
  longDescription:
    "This project aims to create a decentralized finance (DeFi) yield aggregator that automatically optimizes users' assets across multiple protocols and chains to maximize returns. The system uses smart algorithms to monitor yield rates across platforms like Aave, Compound, and chain-specific DEXs, then reallocates assets to the most profitable options while considering gas costs and impermanent loss risks.\n\nThe platform will feature a user-friendly dashboard with comprehensive analytics, allowing users to track their yield farming performance in real-time. Smart contracts will handle all cross-chain operations securely, with regular security audits planned throughout development.",
  skills: ["Solidity", "React", "Web3.js", "TypeScript", "Rust"],
  type: "paid",
  trustLevel: "high",
  status: "In Progress",
  createdAt: "June 15, 2023",
  progress: 65,
  createdBy: {
    name: "Alex Thompson",
    address: "0xabc...123",
    avatar: null,
  },
  collaborators: [
    {
      name: "Sarah Chen",
      role: "Frontend Developer",
      address: "0xdef...456",
      avatar: null,
    },
    {
      name: "Miguel Rodriguez",
      role: "Smart Contract Developer",
      address: "0xghi...789",
      avatar: null,
    },
    {
      name: "Priya Sharma",
      role: "UX Designer",
      address: "0xjkl...012",
      avatar: null,
    },
  ],
  tasks: [
    {
      id: "task1",
      title: "Smart Contract Development",
      description: "Develop core yield optimization contracts",
      status: "In Progress",
      assignedTo: "Miguel Rodriguez",
    },
    {
      id: "task2",
      title: "Frontend Dashboard",
      description: "Create user interface for tracking yield",
      status: "In Progress",
      assignedTo: "Sarah Chen",
    },
    {
      id: "task3",
      title: "User Testing",
      description: "Conduct usability testing with focus group",
      status: "Not Started",
      assignedTo: "Unassigned",
    },
  ],
  messages: [
    {
      id: "msg1",
      sender: "Alex Thompson",
      content:
        "Welcome to the project! Let's discuss the architecture in our first meeting.",
      timestamp: "2 days ago",
    },
    {
      id: "msg2",
      sender: "Miguel Rodriguez",
      content:
        "I've started working on the smart contracts. Will share the GitHub repo soon.",
      timestamp: "1 day ago",
    },
    {
      id: "msg3",
      sender: "Sarah Chen",
      content:
        "Just finished the wireframes for the dashboard. Please review when you have time.",
      timestamp: "5 hours ago",
    },
  ],
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { isConnected } = useAbstraxionAccount();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // In a real app, you'd send this to an API
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the project team.",
    });

    setNewMessage("");
  };

  const handleRequestToJoin = () => {
    toast({
      title: "Request Sent",
      description:
        "Your request to join this project has been sent to the project owner.",
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">{PROJECT.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <Calendar className="h-4 w-4" />
                <span>Created on {PROJECT.createdAt}</span>
                <Badge
                  variant={PROJECT.type === "paid" ? "default" : "secondary"}
                >
                  {PROJECT.type === "paid" ? "Paid" : "Free"}
                </Badge>
                <Badge variant="outline">{PROJECT.status}</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              {isConnected && (
                <Button
                  className="flex items-center gap-2"
                  onClick={handleRequestToJoin}
                >
                  <GitBranch className="h-4 w-4" />
                  Request to Join
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
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">
                        {PROJECT.longDescription}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Required Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {PROJECT.skills.map((skill) => (
                          <Badge key={skill}>{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle>Progress</CardTitle>
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">
                            Overall Completion
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {PROJECT.progress}%
                          </span>
                        </div>
                        <Progress value={PROJECT.progress} className="h-2" />
                      </div>

                      <div className="mt-6 space-y-4">
                        <h4 className="text-sm font-medium">Task Breakdown</h4>
                        {PROJECT.tasks.map((task) => (
                          <div key={task.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{task.title}</h5>
                                <p className="text-sm text-muted-foreground">
                                  {task.description}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  task.status === "Completed"
                                    ? "default"
                                    : task.status === "In Progress"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {task.status}
                              </Badge>
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              Assigned to: {task.assignedTo}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tasks">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Project Tasks</CardTitle>
                      <CardDescription>
                        Track and manage project deliverables
                      </CardDescription>
                    </div>
                    {isConnected && (
                      <Button size="sm" className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Add Task
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {PROJECT.tasks.map((task) => (
                        <div key={task.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{task.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                            </div>
                            <Badge
                              variant={
                                task.status === "Completed"
                                  ? "default"
                                  : task.status === "In Progress"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {task.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Assigned to: {task.assignedTo}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Discussion</CardTitle>
                    <CardDescription>
                      Collaborate with team members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      {PROJECT.messages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {message.sender.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted p-3 rounded-lg">
                              <div className="font-medium text-sm">
                                {message.sender}
                              </div>
                              <p className="text-sm mt-1">{message.content}</p>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {message.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {isConnected ? (
                      <div className="flex gap-3">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="resize-none"
                        />
                        <Button
                          className="flex-shrink-0 self-end"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4 border rounded-lg">
                        <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          Connect your wallet to join the discussion
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Project Files</CardTitle>
                      <CardDescription>Documents and resources</CardDescription>
                    </div>
                    {isConnected && (
                      <Button size="sm" className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Upload
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No files yet</h3>
                    <p className="text-muted-foreground">
                      Project files and documentation will appear here
                    </p>
                    {isConnected && (
                      <Button className="mt-4">Upload First File</Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
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
                    <AvatarImage
                      src={PROJECT.createdBy.avatar || undefined}
                      alt={PROJECT.createdBy.name}
                    />
                    <AvatarFallback>
                      {PROJECT.createdBy.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{PROJECT.createdBy.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Wallet className="h-3 w-3" />
                      {PROJECT.createdBy.address}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href="#" className="flex items-center gap-2">
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
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href="#" className="flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      Project Website
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {PROJECT.collaborators.map((collaborator, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={collaborator.avatar || undefined}
                          alt={collaborator.name}
                        />
                        <AvatarFallback>
                          {collaborator.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{collaborator.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {collaborator.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{PROJECT.collaborators.length} Contributors</span>
                  </div>
                  {isConnected && (
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
