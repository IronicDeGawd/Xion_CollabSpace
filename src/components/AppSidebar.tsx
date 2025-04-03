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
  MessageSquare,
  Settings,
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
        <div className="flex items-center justify-center">
          <GitBranch className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold gradient-text">
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
                        "flex items-center gap-2 py-2",
                        location.pathname === item.path &&
                          "text-primary font-medium"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
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
                          "flex items-center gap-2 py-2",
                          location.pathname === item.path &&
                            "text-primary font-medium"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
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
        <div className="px-4 space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            asChild
          >
            <a
              href="https://xion.burnt.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              XION Network
            </a>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
