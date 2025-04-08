import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GitBranch, Home, Code } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen min-w-full flex flex-col items-center justify-center bg-background p-4 animate-in fade-in-50 duration-500">
      <div className="relative mb-8">
        <GitBranch className="h-20 w-20 text-primary animate-float" />
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-30 animate-pulse-slow"></div>
      </div>

      <h1 className="text-8xl font-bold gradient-text mb-4 animate-in slide-in-from-top-10 duration-700">
        404
      </h1>

      <p className="text-xl text-muted-foreground mb-8 text-center max-w-md animate-in slide-in-from-bottom-10 duration-700 delay-200">
        Oops! This page doesn't exist in our collaboration network
      </p>

      <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-10 duration-700 delay-300">
        <Button
          asChild
          className="group transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
        >
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            Return Home
          </Link>
        </Button>
        <Button
          variant="outline"
          asChild
          className="group transition-all duration-300 hover:border-primary/50"
        >
          <Link to="/projects" className="flex items-center gap-2">
            <Code className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            Browse Projects
          </Link>
        </Button>
      </div>

      <div className="mt-16 text-sm text-muted-foreground/60 animate-in fade-in-50 duration-700 delay-500">
        Lost? Try searching for projects or ideas from our homepage
      </div>
    </div>
  );
};

export default NotFound;
