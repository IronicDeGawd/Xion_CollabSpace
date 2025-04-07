import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast"; // Fix import path

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleToggle = () => {
    // Determine the next theme before toggling
    const nextTheme = theme === "light" ? "dark" : "light";

    // Toggle the theme
    toggleTheme();

    // Use the pre-determined next theme for toast
    toast({
      title: `${
        nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)
      } mode activated`,
      description: `Theme switched to ${nextTheme} mode`,
      duration: 2000,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
      />
      <Moon className="h-4 w-4" />
    </div>
  );
};

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleToggle = () => {
    // Determine the next theme before toggling
    const nextTheme = theme === "light" ? "dark" : "light";

    // Toggle the theme
    toggleTheme();

    // Use the pre-determined next theme for toast
    toast({
      title: `${
        nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)
      } mode activated`,
      description: `Theme switched to ${nextTheme} mode`,
      duration: 2000,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};
