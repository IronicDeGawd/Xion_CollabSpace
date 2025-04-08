"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, User, Mail, Code, Wallet } from "lucide-react";

// Changed the interface to use string for skills
export interface RegistrationFormData {
  name: string;
  email: string;
  skills: string; // Changed from string[] to string
}

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  address: string;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  onSubmit,
  address,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate a slight delay for better UX
    setTimeout(() => {
      onSubmit(e);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-in fade-in-50 slide-in-from-bottom-10 duration-300">
        <DialogHeader>
          <DialogTitle className="text-xl gradient-text">
            Complete your profile
          </DialogTitle>
          <DialogDescription>
            Please provide some additional information to complete your
            registration
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skills" className="flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                Skills (comma separated)
              </Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Solidity, TypeScript..."
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                Wallet Address
              </Label>
              <Input
                id="address"
                value={address}
                disabled
                className="bg-muted/50 text-muted-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="transition-all duration-200 hover:bg-background/80"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;
