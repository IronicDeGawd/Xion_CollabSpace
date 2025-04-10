import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Shimmer } from "@/components/Shimmer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProfileSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
      {/* Profile Sidebar Skeleton */}
      <div className="lg:col-span-1">
        <Card className="animate-pulse-subtle">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto" />
            </div>
            <Shimmer height="24px" width="70%" className="mx-auto" />
            <Shimmer height="16px" width="50%" className="mx-auto mt-2" />
            <div className="mt-2">
              <Shimmer
                height="32px"
                width="90%"
                className="mx-auto rounded-full"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <Shimmer height="16px" width="30%" />
                  <Shimmer height="16px" width="20%" />
                </div>
                <Shimmer height="8px" width="100%" className="rounded-full" />
              </div>

              <div className="space-y-2">
                <Shimmer height="16px" width="100%" />
                <Shimmer height="16px" width="100%" />
              </div>

              <Shimmer height="36px" width="100%" className="rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Skeleton */}
      <div className="lg:col-span-3">
        <Tabs defaultValue="overview">
          <TabsList className="w-full mb-6">
            {["Overview", "Projects", "Contributions", "Achievements"].map(
              (tab) => (
                <TabsTrigger key={tab} value={tab.toLowerCase()} disabled>
                  {tab}
                </TabsTrigger>
              )
            )}
          </TabsList>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Shimmer height="24px" width="30%" />
              </CardHeader>
              <CardContent>
                <Shimmer height="16px" width="100%" className="mb-2" />
                <Shimmer height="16px" width="90%" className="mb-2" />
                <Shimmer height="16px" width="95%" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shimmer height="24px" width="30%" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Shimmer
                      key={i}
                      height="24px"
                      width={`${60 + i * 10}px`}
                      className="rounded-full"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <Shimmer height="24px" width="40%" />
                <Shimmer height="32px" width="80px" className="rounded-md" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <Shimmer height="20px" width="60%" />
                          <Shimmer height="16px" width="90%" />
                        </div>
                        <Shimmer
                          height="24px"
                          width="60px"
                          className="rounded-full"
                        />
                      </div>
                      <div className="mt-2 flex items-center">
                        <Shimmer height="16px" width="120px" />
                      </div>
                      <div className="mt-2">
                        <Shimmer
                          height="32px"
                          width="120px"
                          className="rounded-md"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
