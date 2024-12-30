const EventFormShimmer = () => {
  return (
    <div className="w-full overflow-y-auto mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Shimmer for Form Container */}
        <div className="min-w-72 max-w-xl flex-1 bg-gray-800 text-gray-100 p-4 rounded-md animate-pulse">
          {/* Card Header Shimmer */}
          <div className="flex flex-col items-start justify-between mb-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-gray-700 rounded-full mr-2"></div>
              <div className="h-6 w-32 bg-gray-700 rounded-md"></div>
            </div>
            <div className="h-4 w-40 bg-gray-700 rounded-md"></div>
          </div>

          {/* Card Content Shimmer */}
          <div className="space-y-4">
            {/* Event Title Shimmer */}
            <div className="w-full">
              <div className="h-4 w-24 bg-gray-700 rounded-md mb-2"></div>
              <div className="h-9 w-full bg-gray-700 rounded-full"></div>
            </div>

            {/* Event Description Shimmer */}
            <div className="w-full">
              <div className="h-4 w-32 bg-gray-700 rounded-md mb-2"></div>
              <div className="h-20 w-full bg-gray-700 rounded-md"></div>
            </div>

            {/* Event Category and Type Shimmer */}
            <div className="grid md:grid-cols-2 gap-3">
              {/* Category Shimmer */}
              <div className="w-full">
                <div className="h-4 w-28 bg-gray-700 rounded-md mb-2"></div>
                <div className="h-9 w-full bg-gray-700 rounded-lg"></div>
                <div className="h-4 w-64 bg-gray-700 rounded-md mt-2"></div>
              </div>

              {/* Type Shimmer */}
              <div className="w-full">
                <div className="h-4 w-20 bg-gray-700 rounded-md mb-2"></div>
                <div className="h-9 w-full bg-gray-700 rounded-lg"></div>
                <div className="h-4 w-64 bg-gray-700 rounded-md mt-2"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-72 max-w-xl flex-1 bg-gray-800 text-gray-100 p-4 rounded-md animate-pulse">
          {/* Card Header Shimmer */}
          <div className="flex flex-col items-start justify-between mb-4">
            <div className="flex items-center mb-2">
              <div className="w-6 h-6 bg-gray-700 rounded-full mr-2"></div>
              <div className="h-6 w-32 bg-gray-700 rounded-md"></div>
            </div>
            <div className="h-4 w-40 bg-gray-700 rounded-md"></div>
          </div>

          {/* Card Content Shimmer */}
          <div className="space-y-4">
            {/* Event Title Shimmer */}
            <div className="w-full">
              <div className="h-4 w-24 bg-gray-700 rounded-md mb-2"></div>
              <div className="h-9 w-full bg-gray-700 rounded-full"></div>
            </div>

            {/* Event Description Shimmer */}
            <div className="w-full">
              <div className="h-4 w-32 bg-gray-700 rounded-md mb-2"></div>
              <div className="h-20 w-full bg-gray-700 rounded-md"></div>
            </div>

            {/* Event Category and Type Shimmer */}
            <div className="grid md:grid-cols-2 gap-3">
              {/* Category Shimmer */}
              <div className="w-full">
                <div className="h-4 w-28 bg-gray-700 rounded-md mb-2"></div>
                <div className="h-9 w-full bg-gray-700 rounded-lg"></div>
                <div className="h-4 w-64 bg-gray-700 rounded-md mt-2"></div>
              </div>

              {/* Type Shimmer */}
              <div className="w-full">
                <div className="h-4 w-20 bg-gray-700 rounded-md mb-2"></div>
                <div className="h-9 w-full bg-gray-700 rounded-lg"></div>
                <div className="h-4 w-64 bg-gray-700 rounded-md mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-8 py-4 text-gray-100 flex flex-wrap justify-center items-start gap-4 animate-pulse">
        {/* DateTime Section Shimmer */}
        <div className="h-60 w-full max-w-md bg-gray-700 rounded-md"></div>

        {/* Map Picker Shimmer */}
        <div className="h-60 w-full max-w-md bg-gray-700 rounded-md"></div>
      </div>
    </div>
  );
};

export default EventFormShimmer;
