'use client'

import Image from 'next/image'

export default function ContentUnavailable() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        {/* Content Container */}
        <div className="flex flex-col items-center text-center space-y-8 sm:space-y-10">
          {/* Text Content - Top */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-balance">
              Content Unavailable
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300">
              This title couldn't be loaded. Refresh or return to the previous page.
            </p>
          </div>

          {/* Illustration - Center */}
          <div className="w-full max-w-xs sm:max-w-md aspect-square relative flex items-center justify-center">
            <Image
              src="/images/error/data_error.png"
              alt="Content unavailable illustration"
              width={500}
              height={500}
              priority
              className="w-full h-auto object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
