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
