const DashboardShimmer = () => {
    return (
      <div className="flex flex-col ">
        {/* Map Shimmer */}
        <div className="h-40 lg:h-80 mb-4 bg-gray-700 animate-pulse rounded"></div>
  
        {/* Cards Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-700 animate-pulse p-4 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="h-4 w-24 bg-gray-500 mb-2 rounded"></div>
                  <div className="h-6 w-32 bg-gray-500 mb-2 rounded"></div>
                </div>
                <div className="bg-gray-500 p-3 rounded-lg h-10 w-10"></div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Main Graph Shimmer */}
        <div className="h-64 bg-gray-700 animate-pulse rounded mb-6"></div>
  
        {/* Category Analysis Shimmer */}
        <div className="flex flex-col w-2/3 mb-6">
          <div className="h-6 w-1/3 bg-gray-500 mb-4 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 bg-gray-700 animate-pulse rounded"></div>
            <div className="h-48 bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
  
        {/* Charts and Carousel Shimmer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-700 animate-pulse h-[400px] rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  };
  
  export default DashboardShimmer;
  