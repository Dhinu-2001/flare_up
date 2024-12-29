import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, MapPin, Calendar, MessageCircle, X } from "lucide-react"
import { Link } from 'react-router-dom'

function CardComponent({EventsData}) {
    const concerts = [
        { id: 1, title: 'Neon Nights', artist: 'The Glowing Embers', date: 'July 15, 2023', venue: 'Starlight Arena', genre: 'Synthwave' },
        { id: 2, title: 'Bass Drop Festival', artist: 'Various Artists', date: 'July 20, 2023', venue: 'Thunderdome', genre: 'Electronic' },
        { id: 3, title: 'Cosmic Harmony', artist: 'Stellar Sounds', date: 'July 25, 2023', venue: 'Nebula Stadium', genre: 'Space Rock' },
        { id: 4, title: 'Neon Nights', artist: 'The Glowing Embers', date: 'July 15, 2023', venue: 'Starlight Arena', genre: 'Synthwave' },
        { id: 5, title: 'Bass Drop Festival', artist: 'Various Artists', date: 'July 20, 2023', venue: 'Thunderdome', genre: 'Electronic' },
        { id: 6, title: 'Cosmic Harmony', artist: 'Stellar Sounds', date: 'July 25, 2023', venue: 'Nebula Stadium', genre: 'Space Rock' },
      ]

  const upComingEvents = EventsData.filter((event)=>{
    
    return event.approval_status === "Approved" && event.status === "Active"
    
  })
  console.log('upComingEvents',upComingEvents)


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {upComingEvents.map((event) => (
        <div key={event.id} className="relative group overflow-hidden rounded-lg">
            <img
                src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1731575754/${event.banner_image}.jpg`}
                alt={event.title}
                width={800}
                height={600}
                className="object-cover w-full h-[300px] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <span className="text-[#00ffcc] text-sm font-medium">
                    {event.type}
                </span>
                <div>
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-4">
                        {event.title}
                    </h3>
                    <Link to={`/catgory/${event.category}/${event.type}/${event.id}/`}>
                        <Button
                            variant="outline"
                            className="rounded-none bg-[#00ffcc] text-black border-none hover:bg-[#00ffcc]/90 transition-colors"
                        >
                            VIEW EVENT DETAILS
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    ))}
</div>
  )
}

export default CardComponent
