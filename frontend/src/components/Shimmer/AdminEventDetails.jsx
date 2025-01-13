import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

function AdminEventDetailsShimmer() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="w-full h-full aspect-w-16 aspect-h-9 flex items-center justify-center bg-gray-200 animate-pulse rounded-lg"></div>
          </div>

          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded-md animate-pulse w-3/4"></div>
              <div className="h-5 bg-gray-200 rounded-md animate-pulse w-1/2"></div>
              <div className="flex gap-2 mt-2">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[...Array(2)].map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, idx) => (
                      <div className="flex items-center gap-4" key={idx}>
                        <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(4)].map((_, idx) => (
                    <div className="flex items-center gap-4" key={idx}>
                      <div className="h-4 w-1/3 bg-gray-200 rounded-md animate-pulse"></div>
                      <div className="h-4 w-2/3 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div>
              <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse mb-4"></div>
              <div className="aspect-video bg-gray-200 animate-pulse rounded-lg"></div>
            </div>

            <Card>
              <CardHeader>
                <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[...Array(3)].map((_, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between bg-gray-200 animate-pulse rounded-lg p-4 h-20"
                    ></li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-5 w-40 bg-gray-200 rounded-md animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse mt-2"></div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminEventDetailsShimmer;
