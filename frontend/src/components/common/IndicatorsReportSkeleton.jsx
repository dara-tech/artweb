import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const IndicatorsReportSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6">
        {/* Report Configuration Panel Skeleton */}
        <Card className="shadow-lg border border-border">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Site Selection */}
              <div className="flex-1">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-9 w-full" />
              </div>
              
              {/* Year Selection */}
              <div className="flex-1">
                <Skeleton className="h-4 w-12 mb-2" />
                <Skeleton className="h-9 w-full" />
              </div>
              
              {/* Quarter Selection */}
              <div className="flex-1">
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-9 w-full" />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Header Skeleton */}
        
        <div className="bg-card shadow-sm p-6 mb-6">
          {/* Main Title */}
          <div className="text-center mb-6">
            <Skeleton className="h-8 w-96 mx-auto mb-2" />
          </div>

          {/* Report Parameters Table Skeleton */}
          <div className="border border-border overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 w-1/4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-4 py-3 w-1/4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3 w-1/4">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-4 py-3 w-1/4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-36" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-16" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Main Indicators Table Skeleton */}
        <div className="bg-card rounded-lg">
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header Skeleton */}
                <thead className="bg-muted border-b-2 border-border">
                  <tr>
                    <th className="px-3 py-4 text-center text-sm font-bold text-foreground w-12">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-foreground">
                      <Skeleton className="h-4 w-32 mx-auto" />
                    </th>
                    <th className="px-3 py-4 text-center text-sm font-bold text-foreground w-20">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </th>
                    <th className="px-3 py-4 text-center text-sm font-bold text-foreground w-24">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </th>
                    <th className="px-3 py-4 text-center text-sm font-bold text-foreground w-24">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </th>
                    <th className="px-3 py-4 text-center text-sm font-bold text-foreground w-24">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </th>
                  </tr>
                </thead>

                {/* Table Body Skeleton */}
                <tbody className="bg-card divide-y divide-border">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <React.Fragment key={index}>
                      {/* Indicator Header Row Skeleton */}
                      <tr className="border-b border-border">
                        {/* Row Number */}
                        <td className="px-3 py-4 text-center text-sm font-medium text-foreground" rowSpan="3">
                          <Skeleton className="h-4 w-4 mx-auto" />
                        </td>

                        {/* Indicator Name - spans 3 rows */}
                        <td className="px-4 py-4 text-sm text-foreground align-middle text-center" rowSpan="3">
                          <Skeleton className="h-4 w-64 mx-auto" />
                        </td>

                        {/* Age 0-14 */}
                        <td className="px-3 py-4 text-center text-sm font-medium text-muted-foreground">
                          <Skeleton className="h-4 w-8 mx-auto" />
                        </td>

                        {/* Male 0-14 */}
                        <td className="px-3 py-4 text-center">
                          <Skeleton className="h-6 w-12 mx-auto" />
                        </td>

                        {/* Female 0-14 */}
                        <td className="px-3 py-4 text-center">
                          <Skeleton className="h-6 w-12 mx-auto" />
                        </td>

                        {/* Total 0-14 */}
                        <td className="px-3 py-4 text-center">
                          <Skeleton className="h-6 w-12 mx-auto" />
                        </td>
                      </tr>

                      {/* 15+ Age Group Row Skeleton */}
                      <tr className="bg-muted/50 border-b border-border">
                        <td className="px-3 py-3 text-center text-sm font-medium text-muted-foreground">
                          <Skeleton className="h-4 w-8 mx-auto" />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Skeleton className="h-6 w-12 mx-auto" />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Skeleton className="h-6 w-12 mx-auto" />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Skeleton className="h-6 w-12 mx-auto" />
                        </td>
                      </tr>

                      {/* Sub-Total Row Skeleton */}
                      <tr className="bg-primary/10 border-b-2 border-primary/20 font-bold">
                        <td className="px-3 py-3 text-center text-sm font-bold text-muted-foreground">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Skeleton className="h-6 w-12 mx-auto" />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Skeleton className="h-6 w-12 mx-auto" />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Skeleton className="h-6 w-16 mx-auto" />
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorsReportSkeleton;
