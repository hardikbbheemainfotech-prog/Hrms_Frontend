import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MyTeamSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card
          key={index}
          className="border-none shadow-sm bg-white overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            
            {/* Sidebar */}
            <div className="w-2 bg-gray-200" />

            <CardContent className="flex-1 p-6 space-y-5">
              
              {/* Top Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-3 w-full">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-40 rounded-md" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>

                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-2/4 rounded-md" />
                </div>

                <Skeleton className="h-5 w-24 rounded-md" />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>

              {/* Footer */}
              <div className="pt-4 border-t flex flex-wrap justify-between gap-3">
                <Skeleton className="h-3 w-28 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}