import React from 'react'
import { Button } from '@/components/ui/button'

function HomePageEventDetails() {
  return (
    <div className="relative z-10 container mx-auto px-4 pt-2 pb-9">
          {/* Logo */}
          {/* <div className="text-center mb-8">
            <Image
              src="/placeholder.svg"
              alt="FDDAY Logo"
              width={200}
              height={80}
              className="mx-auto"
            />
          </div> */}

          {/* 2024 Edition Section */}
          <div className="text-white max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl mb-2">2024 Edition</h2>
            <div className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              Sept. 18
              <br />
              2024
            </div>
            <p className="text-xl md:text-2xl max-w-xl">
              The coolest startup family reunion in Europe that brings together over 4500 founders and investors.
            </p>
          </div>

          {/* 2025 Announcement Section */}
          <div className="text-white max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              FDDay will be back on September 17th, 2025!
            </h1>
            
            <Button 
              className="bg-[#3B3BF9] text-white px-8 py-4 text-lg rounded-md hover:bg-[#3B3BF9]/90 transition-colors"
            >
              Come back in 2025!
            </Button>
          </div>
        </div>
  )
}

export default HomePageEventDetails
