import React from "react";
import Layout from "@/components/Layout";
import TimelineSection from "@/components/timeline/TimelineSection";
import MonetizationPlan from "@/components/timeline/MonetizationPlan";
import { Feature } from "@/types/timeline";

const implementedFeatures: Feature[] = [
  {
    title: "User Authentication",
    description: "Implemented secure user authentication using wallet integration.",
    status: "Implemented",
  },
  {
    title: "Project Browsing",
    description: "Users can browse and filter projects based on their interests.",
    status: "Implemented",
  },
];

const futureFeatures: Feature[] = [
  {
    title: "Real-time Collaboration Tools",
    description: "Integrating tools for real-time collaboration among developers.",
    status: "Planned",
  },
  {
    title: "Enhanced Profile Features",
    description: "Allow users to showcase their skills and past projects.",
    status: "Planned",
  },
];

const Timeline = () => {
  return (
    <Layout>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <h1 className="text-3xl font-bold mb-8">Project Timeline</h1>
        <TimelineSection title="Implemented Features" features={implementedFeatures} />
        <TimelineSection title="Future Features" features={futureFeatures} />
        <MonetizationPlan />
      </div>
    </Layout>
  );
};

export default Timeline;