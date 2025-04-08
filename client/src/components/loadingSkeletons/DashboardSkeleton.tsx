import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Shimmer } from "@/components/Loading";

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 w-full">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse-subtle">
            <CardHeader className="py-4">
              <Shimmer height="16px" width="60%" className="mb-2" />
              <Shimmer height="28px" width="40%" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Projects Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse-subtle">
              <CardHeader>
                <Shimmer height="24px" width="70%" />
              </CardHeader>
              <CardContent>
                <Shimmer height="16px" width="90%" className="mb-2" />
                <Shimmer height="16px" width="80%" />
              </CardContent>
              <div className="p-4 border-t">
                <Shimmer height="36px" />
              </div>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card className="animate-pulse-subtle h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Shimmer height="24px" width="60%" />
              <Shimmer height="20px" width="20px" className="rounded-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Shimmer key={i} height="16px" width={`${90 - i * 10}%`} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
