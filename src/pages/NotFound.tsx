import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GitBranch } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen min-w-full flex flex-col items-center justify-center bg-background p-4">
      <GitBranch className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Oops! This page doesn't exist in our network
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/projects">Browse Projects</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
