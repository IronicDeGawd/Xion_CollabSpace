/* filepath: /home/ironyaditya/project-files/XionBuildathonBuildX/project-peer-connect/client/src/components/Loading.tsx */
// Create a new shimmer loading component
import React from "react";

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
    className={`shimmer rounded-md bg-muted ${className}`}
    style={{ width, height }}
  />
);

export const ProjectCardSkeleton = () => (
  <div className="border rounded-lg p-5 space-y-4">
    <Shimmer height="28px" width="70%" />
    <Shimmer height="60px" />
    <div className="flex gap-2 my-4">
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
