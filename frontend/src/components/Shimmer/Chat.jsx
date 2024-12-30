const ChatShimmer = () => {
    return (
      <div className="flex-1 flex flex-col h-screen py-12 bg-gradient-to-tl from-stone-800 to-black">
        <header className="flex items-center justify-between px-4 py-2 border-b">
          <div className="h-5 w-1/3 bg-gray-700 animate-pulse rounded"></div>
          <div className="h-8 w-24 bg-gray-700 animate-pulse rounded"></div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-end space-x-2">
              {/* Avatar shimmer */}
              <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                {/* Message shimmer */}
                <div className="h-4 w-40 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </main>
        <footer className="flex items-center space-x-2 p-2 border-t">
          <div className="flex-1 h-10 bg-gray-700 animate-pulse rounded"></div>
          <div className="h-10 w-20 bg-gray-700 animate-pulse rounded"></div>
        </footer>
      </div>
    );
  };
  
  export default ChatShimmer;
  