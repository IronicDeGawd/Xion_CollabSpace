// filepath: /home/ironyaditya/project-files/XionBuildathonBuildX/project-peer-connect/client/src/components/timeline/FeatureCard.tsx
import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  status?: 'implemented' | 'planned';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, status }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-card">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      {status && (
        <span className={`mt-2 inline-block px-2 py-1 text-xs font-bold rounded-full ${status === 'implemented' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )}
    </div>
  );
};

export default FeatureCard;