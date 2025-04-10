import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Shimmer } from "@/components/Shimmer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ProjectsSkeleton = () => {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Shimmer height="32px" width="150px" className="mb-2" />
          <Shimmer height="20px" width="300px" />
        </div>
        <div className="flex items-center gap-2">
          <Shimmer height="40px" width="120px" className="rounded-md" />
          <Shimmer height="40px" width="140px" className="rounded-md" />
        </div>
      </div>

      <div className="relative">
        <Shimmer height="40px" width="100%" className="rounded-md" />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          {["All Projects", "Trending", "Recent", "Saved"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase().replace(/\s/g, "-")}
              disabled
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse-subtle h-full">
            <CardHeader>
              <Shimmer height="24px" width="80%" className="mb-2" />
              <Shimmer height="16px" width="90%" className="mb-1" />
              <Shimmer height="16px" width="70%" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {[...Array(3)].map((_, j) => (
                  <Shimmer
                    key={j}
                    height="22px"
                    width={`${70 + j * 10}px`}
                    className="rounded-full"
                  />
                ))}
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2">
                  <Shimmer
                    height="16px"
                    width="16px"
                    className="rounded-full"
                  />
                  <Shimmer height="16px" width="120px" />
                </div>
                <div className="flex items-center gap-2">
                  <Shimmer
                    height="16px"
                    width="16px"
                    className="rounded-full"
                  />
                  <Shimmer height="16px" width="100px" />
                </div>
                <div className="flex items-center gap-2">
                  <Shimmer
                    height="16px"
                    width="16px"
                    className="rounded-full"
                  />
                  <Shimmer height="16px" width="80px" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Shimmer height="36px" width="100%" className="rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
