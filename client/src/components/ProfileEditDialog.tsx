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

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    about: string;
    imageUrl: string;
  };
  onSave: (about: string, imageUrl: string) => Promise<void>;
}

export default function ProfileEditDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: ProfileEditDialogProps) {
  const [about, setAbout] = useState(initialData.about || "");
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      await onSave(about, imageUrl);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and avatar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image-url">Avatar URL</Label>
            <Input
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
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
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell us about yourself and your experience in Web3 development"
              className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
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
            onClick={handleSubmit}
            disabled={isSaving}
            className="transition-all duration-300 hover:shadow-md hover:shadow-primary/20"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
