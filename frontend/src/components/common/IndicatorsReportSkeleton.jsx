import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const IndicatorsReportSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Enterprise Header Skeleton */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div>
                  <Skeleton className="h-8 w-80 mb-2" />
                  <Skeleton className="h-5 w-96" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>

        {/* Executive Summary Dashboard Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-20 mb-2" />
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-12 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Period Selector Skeleton */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
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
          </CardContent>
        </Card>

        {/* Main Content Area Skeleton */}
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-1" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Tabs Skeleton */}
            <div className="px-3 sm:px-6 pt-4">
              <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 bg-gray-100 h-auto rounded-lg p-1">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded" />
                ))}
              </div>
            </div>

            {/* Indicators Content Skeleton */}
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* Report Header Skeleton */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-80" />
                  </div>
                  <div className="text-left sm:text-right">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>

              {/* Indicators Table Skeleton - Matching the new 3-row layout */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    {/* Table Header Skeleton */}
                    <thead className="bg-gray-50 border-b-2 border-gray-300">
                      <tr>
                        <th className="px-3 py-4 text-center text-sm font-bold text-gray-700 w-12">
                          <Skeleton className="h-4 w-4 mx-auto" />
                        </th>
                        <th className="px-4 py-4 text-center text-sm font-bold text-gray-700">
                          <Skeleton className="h-4 w-32 mx-auto" />
                        </th>
                        <th className="px-3 py-4 text-center text-sm font-bold text-gray-700 w-20">
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </th>
                        <th className="px-3 py-4 text-center text-sm font-bold text-gray-700 w-24">
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </th>
                        <th className="px-3 py-4 text-center text-sm font-bold text-gray-700 w-24">
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </th>
                        <th className="px-3 py-4 text-center text-sm font-bold text-gray-700 w-24">
                          <Skeleton className="h-4 w-16 mx-auto" />
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body Skeleton */}
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <React.Fragment key={index}>
                          {/* Indicator Header Row Skeleton */}
                          <tr className="border-b border-gray-100">
                            {/* Row Number */}
                            <td className="px-3 py-4 text-center text-sm font-medium text-gray-900" rowSpan="3">
                              <Skeleton className="h-4 w-4 mx-auto" />
                            </td>

                            {/* Indicator Name - spans 3 rows */}
                            <td className="px-4 py-4 text-sm text-gray-900 align-middle text-center" rowSpan="3">
                              <Skeleton className="h-4 w-64 mx-auto" />
                            </td>

                            {/* Age 0-14 */}
                            <td className="px-3 py-4 text-center text-sm font-medium text-gray-700">
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
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <td className="px-3 py-3 text-center text-sm font-medium text-gray-700">
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
                          <tr className="bg-blue-50 border-b-2 border-blue-200 font-bold">
                            <td className="px-3 py-3 text-center text-sm font-bold text-gray-700">
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

              {/* Report Footer Skeleton */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 mt-6 sm:mt-8">
                <div className="text-center">
                  <Skeleton className="h-4 w-80 mx-auto mb-2" />
                  <Skeleton className="h-3 w-96 mx-auto" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndicatorsReportSkeleton;
