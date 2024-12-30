import React from "react";

function AdminProfileShimmer() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="bg-gray-700 mb-6 rounded-lg">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="h-28 w-28 bg-gray-600 rounded-full"></div>
                <div className="h-6 w-32 bg-gray-600 rounded"></div>
              </div>
              <div>
                <div className="h-6 w-48 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="bg-gray-700 rounded-lg col-span-1 p-6">
            <div className="h-6 w-32 bg-gray-600 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 w-40 bg-gray-600 rounded"></div>
              <div className="h-4 w-56 bg-gray-600 rounded"></div>
              <div className="h-4 w-48 bg-gray-600 rounded"></div>
            </div>
          </div>

          {/* Organization Information */}
          <div className="bg-gray-700 rounded-lg col-span-1 p-6">
            <div className="h-6 w-40 bg-gray-600 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 w-60 bg-gray-600 rounded"></div>
              <div className="h-4 w-40 bg-gray-600 rounded"></div>
              <div className="h-4 w-48 bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfileShimmer;
