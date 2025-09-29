import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const IndicatorsDashboardSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto p-0 sm:px-0 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-3 sm:gap-0">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-6" />
                </div>
                <Skeleton className="h-7 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector Skeleton */}
      <div className="w-full px-0 sm:px-0 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-4 w-12" />
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid Skeleton */}
      <div className="w-full px-0 sm:px-0 lg:px-8 py-3 sm:py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 9 }).map((_, index) => (
            <Card
              key={index}
              className="border-0 shadow-md rounded-md animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <Skeleton className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <Skeleton className="h-4 w-full max-w-48" />
                  </div>
                  <Skeleton className="h-4 w-4 flex-shrink-0 ml-2" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Chart Area Skeleton - matches the actual chart container */}
                <div className="h-[200px] w-full rounded-sm">
                  <Skeleton className="h-full w-full rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndicatorsDashboardSkeleton;
