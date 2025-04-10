"use client";

import { CardFooter } from "@/components/ui/card";

import type React from "react";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Clock,
  Search,
  ThumbsUp,
  MessageSquare,
  UserCircle,
  Calendar,
  MessageCircle,
  Tag,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";
import { IdeasSkeleton } from "@/components/loadingSkeletons/IdeasSkeleton";

// Mock idea data
const IDEAS = [
  {
    id: "1",
    title: "Decentralized Social Media Platform",
    description:
      "Create a censorship-resistant social media platform where users own their data and can monetize their content.",
    tags: ["Social", "Privacy", "Monetization"],
    upvotes: 42,
    comments: 12,
    createdBy: "0x123...abc",
    createdAt: "2023-11-10",
  },
  {
    id: "2",
    title: "DeFi Insurance Protocol",
    description:
      "An insurance protocol for DeFi users to protect against smart contract exploits and other risks.",
    tags: ["DeFi", "Insurance", "Risk Management"],
    upvotes: 35,
    comments: 8,
    createdBy: "0x456...def",
    createdAt: "2023-11-15",
  },
  {
    id: "3",
    title: "Blockchain-based Supply Chain Tracking",
    description:
      "A solution for tracking goods through the supply chain using blockchain to ensure authenticity and provenance.",
    tags: ["Supply Chain", "Enterprise", "Traceability"],
    upvotes: 28,
    comments: 5,
    createdBy: "0x789...ghi",
    createdAt: "2023-11-18",
  },
  {
    id: "4",
    title: "Decentralized Video Streaming",
    description:
      "A platform for content creators to share videos without censorship and earn directly from viewers.",
    tags: ["Content", "Streaming", "Monetization"],
    upvotes: 56,
    comments: 15,
    createdBy: "0xabc...123",
    createdAt: "2023-11-20",
  },
  {
    id: "5",
    title: "Token-Gated Community Platform",
    description:
      "A platform for creating communities where access is granted based on token ownership.",
    tags: ["Community", "Tokens", "Governance"],
    upvotes: 31,
    comments: 9,
    createdBy: "0xdef...456",
    createdAt: "2023-11-22",
  },
  {
    id: "6",
    title: "On-chain Resume and Reputation System",
    description:
      "A system for verifying skills and work history on-chain, creating a portable reputation for developers.",
    tags: ["Identity", "Reputation", "Employment"],
    upvotes: 47,
    comments: 11,
    createdBy: "0xghi...789",
    createdAt: "2023-11-25",
  },
];

// Mock comments data
const COMMENTS = [
  {
    id: "c1",
    ideaId: "1",
    text: "This is a great idea! I'd love to see decentralized social media that gives ownership back to users.",
    author: "0xabc...123",
    createdAt: "2023-11-12",
  },
  {
    id: "c2",
    ideaId: "1",
    text: "Have you considered how content moderation would work in a censorship-resistant platform?",
    author: "0xdef...456",
    createdAt: "2023-11-14",
  },
  {
    id: "c3",
    ideaId: "2",
    text: "Insurance for DeFi is definitely needed. How would claims be verified?",
    author: "0x789...ghi",
    createdAt: "2023-11-16",
  },
  {
    id: "c4",
    ideaId: "3",
    text: "This could revolutionize supply chains if implemented correctly.",
    author: "0x123...abc",
    createdAt: "2023-11-19",
  },
];

const Ideas = () => {
  const { isConnected } = useAbstraxionAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [upvotedIdeas, setUpvotedIdeas] = useState<string[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<(typeof IDEAS)[0] | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter ideas based on search query
  const filteredIdeas = IDEAS.filter((idea) => {
    return (
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const toggleUpvote = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isConnected) return;

    setUpvotedIdeas((prev) =>
      prev.includes(id) ? prev.filter((ideaId) => ideaId !== id) : [...prev, id]
    );
  };

  // Get comments for the selected idea
  const getIdeaComments = (ideaId: string) => {
    return COMMENTS.filter((comment) => comment.ideaId === ideaId);
  };

  // Open the idea detail dialog
  const openIdeaDetail = (idea: (typeof IDEAS)[0], e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedIdea(idea);
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="w-full max-w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Project Ideas</h1>
              <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/50 hover:bg-amber-500/30 animate-pulse-slow py-1 px-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Work in Progress
                </span>
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Browse and submit ideas for future Web3 projects
            </p>
          </div>

          {isConnected && (
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Submit Idea
            </Button>
          )}
        </div>

        <div className="mb-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-300 delay-100">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ideas..."
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="popular" className="mb-6">
          <TabsList className="transition-all duration-300">
            <TabsTrigger
              value="popular"
              className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
            >
              Popular
            </TabsTrigger>
            <TabsTrigger
              value="recent"
              className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
            >
              Recent
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="transition-all duration-200 data-[state=active]:animate-in data-[state=active]:fade-in-50"
            >
              Trending
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <IdeasSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredIdeas.length > 0 ? (
                filteredIdeas.map((idea) => (
                  <Card
                    key={idea.id}
                    className="card-hover h-full transition-all hover:shadow-lg hover:border-primary/20 hover:translate-y-[-5px] animate-in fade-in-50 duration-500"
                  >
                    <CardHeader>
                      <CardTitle className="group">
                        <span className="transition-colors hover:text-web3-primary hover:underline decoration-dotted underline-offset-4">
                          {idea.title}
                        </span>
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {idea.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {idea.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="transition-colors hover:bg-web3-primary/20 hover:text-web3-primary hover:scale-105"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <UserCircle className="h-4 w-4" />
                          <span>{idea.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{idea.createdAt}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 group transition-all duration-200"
                            onClick={(e) => toggleUpvote(idea.id, e)}
                            disabled={!isConnected}
                          >
                            <ThumbsUp
                              className={`h-4 w-4 transition-all duration-300 ${
                                upvotedIdeas.includes(idea.id)
                                  ? "fill-primary text-primary scale-125 animate-pulse-subtle"
                                  : "group-hover:scale-110 group-hover:rotate-12"
                              }`}
                            />
                            <span>
                              {upvotedIdeas.includes(idea.id)
                                ? idea.upvotes + 1
                                : idea.upvotes}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 group"
                          >
                            <MessageSquare className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                            <span>{idea.comments}</span>
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          onClick={(e) => openIdeaDetail(idea, e)}
                          className="bg-web3-primary hover:bg-web3-primary/90 transition-all duration-300 hover:shadow-md hover:shadow-web3-primary/20 hover:scale-105"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground">
                    No ideas found matching your search
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Idea Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedIdea && (
            <DialogContent className="sm:max-w-2xl animate-in fade-in-50 zoom-in-95 duration-300">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedIdea.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <UserCircle className="h-4 w-4" />
                  <span>{selectedIdea.createdBy}</span>
                  <span className="mx-1">•</span>
                  <Calendar className="h-4 w-4" />
                  <span>{selectedIdea.createdAt}</span>
                </div>
              </DialogHeader>

              <div className="space-y-4 my-4">
                <div className="flex items-start gap-2">
                  <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {selectedIdea.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      {selectedIdea.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={(e) => toggleUpvote(selectedIdea.id, e)}
                    disabled={!isConnected}
                  >
                    <ThumbsUp
                      className={`h-4 w-4 ${
                        upvotedIdeas.includes(selectedIdea.id)
                          ? "fill-primary text-primary"
                          : ""
                      }`}
                    />
                    <span>
                      {upvotedIdeas.includes(selectedIdea.id)
                        ? selectedIdea.upvotes + 1
                        : selectedIdea.upvotes}{" "}
                      Upvotes
                    </span>
                  </Button>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>
                      {getIdeaComments(selectedIdea.id).length} Comments
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Comments</h3>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    {getIdeaComments(selectedIdea.id).length > 0 ? (
                      <div className="space-y-4">
                        {getIdeaComments(selectedIdea.id).map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8 transition-all duration-300 hover:scale-110">
                              <AvatarFallback>
                                {comment.author.substring(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {comment.author}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {comment.createdAt}
                                </span>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No comments yet
                      </div>
                    )}
                  </ScrollArea>

                  {isConnected && (
                    <div className="flex flex-col gap-2">
                      <Input placeholder="Add a comment..." />
                      <div className="flex justify-end">
                        <Button size="sm">Post Comment</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
                {isConnected && (
                  <Button>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Support This Idea
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </Layout>
  );
};

export default Ideas;
