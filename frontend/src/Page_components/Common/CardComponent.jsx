import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, MapPin, Calendar, MessageCircle, X } from "lucide-react"
import { Link } from 'react-router-dom'
import { AdvancedImage } from '@cloudinary/react'
import { Cloudinary } from "@cloudinary/url-gen";
import {env} from "@/utils/env"

import { getConfig } from '../../config';
let { VITE_cloudinary_name } = getConfig();

VITE_cloudinary_name = VITE_cloudinary_name || env.VITE_cloudinary_name


function CardComponent({EventsData}) {
    
  const upComingEvents = EventsData.filter((event)=>{
    
    return event.approval_status === "Approved" && event.status === "Active"
    
  })
  console.log('upComingEvents',upComingEvents)
  
  const [cloudName] = useState(VITE_cloudinary_name);

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const myImage=(imageId) => cld.image(imageId);



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {upComingEvents.map((event) => (
        <div key={event.id} className="relative group overflow-hidden rounded-lg">
            <AdvancedImage
                cldImg={myImage(event.banner_image)}
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
