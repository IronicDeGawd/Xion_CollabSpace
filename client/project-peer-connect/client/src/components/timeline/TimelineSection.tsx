import React from "react";
import FeatureCard from "./FeatureCard";
import { Feature } from "@/types/timeline";

interface TimelineSectionProps {
  title: string;
  features: Feature[];
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ title, features }) => {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-4 gradient-text">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} title={feature.title} description={feature.description} status={feature.status} />
        ))}
      </div>
    </section>
  );
};

export default TimelineSection;