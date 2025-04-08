"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Link2, Github } from "lucide-react";

interface ProjectFormData {
  title: string;
  description: string;
  skillsRequired: string;
  repositoryUrl?: string;
  websiteUrl?: string;
}

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: ProjectFormData;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  loading: boolean;
}

export default function ProjectFormDialog({
  open,
  onOpenChange,
  onSubmit,
  formData,
  handleChange,
  loading,
}: ProjectFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-10">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Share your project with the community to find collaborators.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                required
                className="bg-input text-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project, goals, and what kind of help you need..."
                className="min-h-[120px] bg-input text-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skillsRequired">
                Required Skills (comma separated)
              </Label>
              <Input
                id="skillsRequired"
                name="skillsRequired"
                value={formData.skillsRequired}
                onChange={handleChange}
                placeholder="React, Solidity, TypeScript..."
                required
                className="bg-input text-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="repositoryUrl">
                GitHub Repository URL (optional)
              </Label>
              <div className="relative group">
                <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
                <Input
                  id="repositoryUrl"
                  name="repositoryUrl"
                  value={formData.repositoryUrl || ""}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className="pl-10 bg-input text-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="websiteUrl">Project Website URL (optional)</Label>
              <div className="relative group">
                <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-all duration-300 group-focus-within:text-primary" />
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl || ""}
                  onChange={handleChange}
                  placeholder="https://your-project.com"
                  className="pl-10 bg-input text-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="transition-all duration-200 hover:bg-background/80"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="transition-all duration-200 relative overflow-hidden"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
