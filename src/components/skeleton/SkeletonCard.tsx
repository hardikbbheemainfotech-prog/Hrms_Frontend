import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonCard() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card
          key={index}
          className="hover:shadow-md transition"
        >
          {/* Header */}
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
            </div>

            <Skeleton className="h-8 w-16 rounded-md" />
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Info Row */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
              <Skeleton className="h-3 w-4/6 rounded-md" />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-4/6 rounded-md" />
            </div>

            {/* Footer */}
            <div className="pt-2 border-t">
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}