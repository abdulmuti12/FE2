'use client'

import Image from 'next/image'

export default function SystemMaintenance() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        {/* Content Container */}
        <div className="flex flex-col items-center text-center space-y-8 sm:space-y-10">
          {/* Text Content - Top */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white whitespace-nowrap">
              System Under Maintenance
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-lg">
              We're performing scheduled upgrades to enhance platform performance. Services will resume shortly.
            </p>
          </div>

          {/* Illustration - Center */}
          <div className="w-full max-w-xs sm:max-w-md aspect-square relative flex items-center justify-center">
            <Image
              src="/images/error/maintenance.png"
              alt="System under maintenance illustration"
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
