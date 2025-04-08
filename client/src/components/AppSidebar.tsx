import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  Code,
  Lightbulb,
  User,
  LayoutDashboard,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion";

export function AppSidebar() {
  const { isConnected } = useAbstraxionAccount();
  const location = useLocation();

  const mainNavItems = [
    {
      title: "Home",
      path: "/",
      icon: Home,
    },
    {
      title: "Projects",
      path: "/projects",
      icon: Code,
    },
    {
      title: "Ideas",
      path: "/ideas",
      icon: Lightbulb,
    },
  ];

  const connectedNavItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <div className="flex items-center justify-center transition-transform duration-300 hover:scale-105">
          <GitBranch className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold text-primary">
            CollabSpace
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 py-2 px-4 rounded-md transition-all duration-300",
                        location.pathname === item.path
                          ? "text-primary font-medium bg-primary/10"
                          : "hover:bg-primary/5 hover:translate-x-1"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                      {location.pathname === item.path && (
                        <div className="absolute left-0 w-1 h-full bg-primary rounded-r-md animate-pulse-subtle" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isConnected && (
          <SidebarGroup>
            <SidebarGroupLabel>My Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {connectedNavItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        className={cn(
                          "flex items-center gap-2 py-2 px-4 rounded-md transition-all duration-300",
                          location.pathname === item.path
                            ? "text-primary font-medium bg-primary/10"
                            : "hover:bg-primary/5 hover:translate-x-1"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                        {location.pathname === item.path && (
                          <div className="absolute left-0 w-1 h-full bg-primary rounded-r-md animate-pulse-subtle" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="py-4">
        <div className="px-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 transition-all duration-300 hover:bg-primary/5 hover:border-primary/30"
            asChild
          >
            <a
              href="https://xion.burnt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <ExternalLink className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
              XION Network
            </a>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
