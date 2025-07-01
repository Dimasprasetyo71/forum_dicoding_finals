import LoadingBar from 'react-redux-loading-bar';

function Loading() {
  return (
    <div className="Loading relative">
      {/* Custom Loading Bar Container */}
      <div className="relative z-10">
        <LoadingBar
          showFastActions
          style={{
            height: '4px',
            position: 'relative'
          }}
        />
      </div>

      {/* Enhanced Visual Loading Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* Animated Progress Bar */}
        <div className="relative h-1 bg-gradient-to-r from-gray-200 to-gray-300 overflow-hidden">
          {/* Moving gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse opacity-80"></div>

          {/* Shimmer effect */}
          <div
            data-testid="shimmer"
            className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]"
          ></div>
          {/* Glowing dots */}
          <div className="absolute top-0 left-0 w-2 h-1 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-0 right-0 w-2 h-1 bg-white rounded-full animate-bounce animation-delay-300"></div>
        </div>

        {/* Particle effects */}
        <div className="absolute -top-2 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute -top-3 left-1/2 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-500"></div>
        <div className="absolute -top-2 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping animation-delay-700"></div>
      </div>

      {/* Full Screen Loading Overlay (Optional) */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-300 rounded-full animate-spin animation-duration-[8s]"></div>
          <div className="absolute top-20 right-20 w-16 h-16 border-2 border-purple-300 rounded-full animate-spin animation-duration-[6s] animation-direction-reverse"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 border-2 border-pink-300 rounded-full animate-spin animation-duration-[10s]"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float"></div>
        </div>
        <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-float animation-delay-1000"></div>
        </div>
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-float animation-delay-500"></div>
        </div>
      </div>


    </div>
  );
}

export default Loading;