import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, MapPin, Calendar, MessageCircle, X } from "lucide-react"

function CardComponent() {
    const concerts = [
        { id: 1, title: 'Neon Nights', artist: 'The Glowing Embers', date: 'July 15, 2023', venue: 'Starlight Arena', genre: 'Synthwave' },
        { id: 2, title: 'Bass Drop Festival', artist: 'Various Artists', date: 'July 20, 2023', venue: 'Thunderdome', genre: 'Electronic' },
        { id: 3, title: 'Cosmic Harmony', artist: 'Stellar Sounds', date: 'July 25, 2023', venue: 'Nebula Stadium', genre: 'Space Rock' },
        { id: 4, title: 'Neon Nights', artist: 'The Glowing Embers', date: 'July 15, 2023', venue: 'Starlight Arena', genre: 'Synthwave' },
        { id: 5, title: 'Bass Drop Festival', artist: 'Various Artists', date: 'July 20, 2023', venue: 'Thunderdome', genre: 'Electronic' },
        { id: 6, title: 'Cosmic Harmony', artist: 'Stellar Sounds', date: 'July 25, 2023', venue: 'Nebula Stadium', genre: 'Space Rock' },
      ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concerts.map((concert) => (
              <Card key={concert.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all">
                <CardHeader>
                  <CardTitle className="text-purple-400">{concert.title}</CardTitle>
                  <CardDescription className="text-gray-400">{concert.artist}</CardDescription>
                </CardHeader> 
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2 text-gray-300">
                    <Calendar className="h-4 w-4 text-pink-500" />
                    <span>{concert.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2 text-gray-300">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span>{concert.venue}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-4 text-gray-300">
                    <Music className="h-4 w-4 text-blue-500" />
                    <span>Genre: {concert.genre}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Tickets</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
  )
}

export default CardComponent
