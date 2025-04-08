import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Shimmer } from "@/components/Loading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const IdeasSkeleton = () => {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Shimmer height="32px" width="200px" className="mb-2" />
          <Shimmer height="20px" width="300px" />
        </div>
        <Shimmer height="40px" width="120px" className="rounded-md" />
      </div>

      <div className="relative">
        <Shimmer height="40px" width="100%" className="rounded-md" />
      </div>

      <Tabs defaultValue="popular">
        <TabsList className="mb-6">
          {["Popular", "Recent", "Trending"].map((tab) => (
            <TabsTrigger key={tab} value={tab.toLowerCase()} disabled>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
              <div className="flex items-center justify-between">
                <Shimmer height="16px" width="40%" />
                <Shimmer height="16px" width="30%" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Shimmer height="24px" width="60px" className="rounded-md" />
                  <Shimmer height="24px" width="60px" className="rounded-md" />
                </div>
                <Shimmer height="32px" width="100px" className="rounded-md" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
