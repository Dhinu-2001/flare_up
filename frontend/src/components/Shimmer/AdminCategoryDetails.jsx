import React from "react";

function AdminCategoryDetailsShimmer() {
  return (
    <main className="p-6">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center animate-pulse">
        <div>
          <div className="h-8 w-48 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-72 bg-gray-300 rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-gray-300 rounded"></div>
          <div className="h-10 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Types Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 animate-pulse">
          <div className="flex justify-between mb-4">
            <div>
              <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-48 bg-gray-300 rounded"></div>
            </div>
            <div className="h-10 w-40 bg-gray-300 rounded"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="h-6 w-20 bg-gray-300 rounded"></div>
              ))}
          </div>
        </div>

        {/* Placeholder for Other Cards */}
        <div className="border rounded-lg p-4 animate-pulse">
          <div className="h-6 w-40 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-60 bg-gray-300 rounded mb-4"></div>
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="h-4 w-full bg-gray-300 rounded mb-2"
              ></div>
            ))}
        </div>
      </div>
    </main>
  );
}

export default AdminCategoryDetailsShimmer;
