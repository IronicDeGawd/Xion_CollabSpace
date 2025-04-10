// filepath: /home/ironyaditya/project-files/XionBuildathonBuildX/project-peer-connect/client/src/components/timeline/MonetizationPlan.tsx
import React from 'react';

const MonetizationPlan: React.FC = () => {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-4 gradient-text">Monetization Plan</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
        Our monetization strategy focuses on providing value to our users while ensuring sustainable growth for the platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30">
          <h3 className="text-xl font-bold mb-2">Subscription Model</h3>
          <p className="text-muted-foreground">
            Users can subscribe to premium features that enhance their experience, such as advanced project matching and analytics tools.
          </p>
        </div>
        <div className="p-6 rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30">
          <h3 className="text-xl font-bold mb-2">Transaction Fees</h3>
          <p className="text-muted-foreground">
            A small fee will be charged for transactions made through the platform, ensuring a revenue stream while keeping user costs low.
          </p>
        </div>
        <div className="p-6 rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30">
          <h3 className="text-xl font-bold mb-2">Advertising Partnerships</h3>
          <p className="text-muted-foreground">
            Collaborating with relevant brands to offer targeted advertising opportunities that align with our users' interests.
          </p>
        </div>
        <div className="p-6 rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30">
          <h3 className="text-xl font-bold mb-2">Tokenomics</h3>
          <p className="text-muted-foreground">
            Implementing a token system that rewards users for contributions and engagement, creating a self-sustaining ecosystem.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MonetizationPlan;