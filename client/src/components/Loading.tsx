import type React from "react";

interface ShimmerProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  className = "",
  width = "100%",
  height = "20px",
}) => (
  <div
    className={`shimmer rounded-md bg-muted animate-shimmer overflow-hidden relative ${className}`}
    style={{ width, height }}
  >
    <div className="shimmer-highlight"></div>
  </div>
);

export const ProjectCardSkeleton = () => (
  <div className="border rounded-lg p-5 space-y-4 animate-pulse-subtle">
    <Shimmer height="28px" width="70%" />
    <Shimmer height="60px" />
    <div className="flex gap-2 my-4 flex-wrap">
      <Shimmer height="22px" width="80px" className="rounded-full" />
      <Shimmer height="22px" width="100px" className="rounded-full" />
      <Shimmer height="22px" width="90px" className="rounded-full" />
    </div>
    <div className="space-y-2 pt-2">
      <Shimmer height="16px" width="40%" />
      <Shimmer height="16px" width="50%" />
      <Shimmer height="16px" width="30%" />
    </div>
    <div className="pt-4 border-t mt-4">
      <Shimmer height="36px" />
    </div>
  </div>
);

export const FullPageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-md animate-pulse-slow"></div>
      </div>
      <p className="mt-4 text-muted-foreground animate-pulse-subtle">
        Loading...
      </p>
    </div>
  </div>
);

export const ContentLoader = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative">
      <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-md animate-pulse-slow"></div>
    </div>
    <p className="mt-4 text-sm text-muted-foreground animate-pulse-subtle">
      Loading content...
    </p>
  </div>
);
