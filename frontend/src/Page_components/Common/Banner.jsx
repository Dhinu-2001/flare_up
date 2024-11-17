import React from 'react'
import { Button } from "@/components/ui/button"

function Banner() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome to the Ultimate Concert Experience!</h2>
        <p className="text-xl">Discover, connect, and rock out with fellow music lovers.</p>
        <Button className="mt-4 bg-white text-purple-600 hover:bg-gray-100">Explore Events</Button>
    </div>
  )
}

export default Banner
