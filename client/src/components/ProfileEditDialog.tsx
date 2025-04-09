"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface EditProfileData {
  about: string;
  imageUrl: string;
  githubUrl?: string;
  telegramId?: string;
  discordId?: string;
}

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: EditProfileData;
  onSave: (
    bio: string,
    imageUrl: string,
    githubUrl?: string,
    telegramId?: string,
    discordId?: string
  ) => Promise<void>;
}

export default function ProfileEditDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ProfileEditDialogProps) {
  const [formData, setFormData] = useState({
    about: initialData.about || "",
    imageUrl: initialData.imageUrl || "",
    githubUrl: initialData.githubUrl || "",
    telegramId: initialData.telegramId || "",
    discordId: initialData.discordId || "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(
        formData.about,
        formData.imageUrl,
        formData.githubUrl,
        formData.telegramId,
        formData.discordId
      );
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and social links
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image-url">Avatar URL</Label>
              <Input
                id="image-url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://example.com/your-image.jpg"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL for your profile picture
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="about">About</Label>
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                placeholder="Tell us about yourself and your experience in Web3 development"
                className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub Profile</Label>
              <div className="relative">
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, githubUrl: e.target.value })
                  }
                  placeholder="https://github.com/yourusername"
                  className="pl-10"
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
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
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegramId">Telegram Username</Label>
              <div className="relative">
                <Input
                  id="telegramId"
                  value={formData.telegramId}
                  onChange={(e) =>
                    setFormData({ ...formData, telegramId: e.target.value })
                  }
                  placeholder="@yourusername"
                  className="pl-10"
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
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
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discordId">Discord Username</Label>
              <div className="relative">
                <Input
                  id="discordId"
                  value={formData.discordId}
                  onChange={(e) =>
                    setFormData({ ...formData, discordId: e.target.value })
                  }
                  placeholder="username#1234"
                  className="pl-10"
                />
                <svg
                  className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
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
              className="transition-all duration-300 hover:shadow-md hover:shadow-primary/20"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
