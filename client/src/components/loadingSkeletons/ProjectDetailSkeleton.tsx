import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shimmer } from "@/components/Loading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProjectDetailSkeleton = () => {
  return (
    <div className="w-full space-y-6">
      {/* Project header */}
      <div className="mb-6 animate-pulse-subtle">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Shimmer height="36px" width="300px" className="mb-2" />
            <div className="flex items-center gap-2 mt-2">
              <Shimmer height="16px" width="16px" className="rounded-full" />
              <Shimmer height="16px" width="180px" />
              <Shimmer height="24px" width="80px" className="rounded-full" />
            </div>
          </div>

          <div className="flex gap-2">
            <Shimmer height="40px" width="100px" className="rounded-md" />
            <Shimmer height="40px" width="140px" className="rounded-md" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="w-full mb-6">
              {["Overview", "Tasks", "Discussion", "Requests"].map((tab) => (
                <TabsTrigger key={tab} value={tab.toLowerCase()} disabled>
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="space-y-6">
              <Card className="animate-pulse-subtle">
                <CardHeader>
                  <Shimmer height="24px" width="200px" />
                </CardHeader>
                <CardContent>
                  <Shimmer height="16px" width="100%" className="mb-2" />
                  <Shimmer height="16px" width="100%" className="mb-2" />
                  <Shimmer height="16px" width="100%" className="mb-2" />
                  <Shimmer height="16px" width="80%" />
                </CardContent>
              </Card>

              <Card className="animate-pulse-subtle">
                <CardHeader>
                  <Shimmer height="24px" width="150px" />
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

              <Card className="animate-pulse-subtle">
                <CardHeader>
                  <Shimmer height="24px" width="100px" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Shimmer
                          height="40px"
                          width="40px"
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <Shimmer
                            height="18px"
                            width="120px"
                            className="mb-1"
                          />
                          <Shimmer height="14px" width="80px" />
                        </div>
                        <Shimmer
                          height="24px"
                          width="80px"
                          className="rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="animate-pulse-subtle">
            <CardHeader>
              <Shimmer height="24px" width="150px" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Shimmer height="48px" width="48px" className="rounded-full" />
                <div>
                  <Shimmer height="18px" width="120px" className="mb-1" />
                  <Shimmer height="14px" width="180px" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-pulse-subtle">
            <CardHeader>
              <Shimmer height="24px" width="120px" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Shimmer height="36px" width="100%" className="rounded-md" />
                <Shimmer height="36px" width="100%" className="rounded-md" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-pulse-subtle">
            <CardHeader>
              <Shimmer height="24px" width="140px" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Shimmer
                      height="32px"
                      width="32px"
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <Shimmer height="16px" width="100px" className="mb-1" />
                      <Shimmer height="12px" width="80px" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full flex items-center justify-between">
                <Shimmer height="16px" width="120px" />
                <Shimmer height="32px" width="100px" className="rounded-md" />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};
