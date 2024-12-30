export default function TicketBookingShimmer() {
  return (
    <div className="relative pt-20 flex flex-1 justify-center items-center h-2/4 overflow-auto">
      <div className="container bg-gray-800 p-16 sm:w-3/4 md:w-2/4">
        <div className="space-y-8">
          <div className="animate-pulse">
            {/* Title */}
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>

            {/* Participant capacity */}
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>

            {/* Quantity Input */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="h-8 bg-gray-700 rounded"></div>
            </div>

            {/* Ticket Details Table */}
            <div className="mt-8 space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="h-4 bg-gray-700 rounded w-full"></div>
              ))}
            </div>

            {/* Book Tickets Button */}
            <div className="h-10 bg-gray-700 rounded w-1/2 mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}