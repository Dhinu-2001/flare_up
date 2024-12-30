const EventListShimmer = () => {
    return (
      <div>
        {/* Title Shimmer */}
        <div className="h-16 w-60 bg-gray-700 animate-pulse rounded mb-4"></div>
  
        {/* Table Shimmer */}
        <div className="container mx-auto pt-0 py-10">
          <div className="space-y-4">
            {/* Table Header Shimmer */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-14 w-full bg-gray-700 animate-pulse rounded"
                ></div>
              ))}
            </div>
  
            {/* Table Rows Shimmer */}
            {[...Array(5)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-4 gap-4 mt-2"
              >
                {[...Array(4)].map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className="h-9 w-full bg-gray-700 animate-pulse rounded"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default EventListShimmer;
  