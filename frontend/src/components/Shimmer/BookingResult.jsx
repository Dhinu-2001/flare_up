export default function BookingResultShimmer() {
    return (
      <div className="animate-pulse flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full sm:w-3/4 md:w-2/4">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-6 bg-gray-700 rounded mb-2"></div>
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
  
          <div className="bg-gray-800 p-4 rounded space-y-2">
            <div className="h-5 bg-gray-700 rounded mb-2"></div>
            <div className="h-5 bg-gray-700 rounded"></div>
          </div>
  
          <div className="flex justify-between mt-6">
            <div className="h-10 bg-gray-700 rounded w-1/3"></div>
            <div className="h-10 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  };
  