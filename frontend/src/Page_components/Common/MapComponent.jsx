import React from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, MapPin, Calendar, X, Maximize, Minimize } from "lucide-react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerPortal,
  DrawerOverlay
} from "@/components/ui/drawer"
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import { ImageIcon, VideoIcon } from 'lucide-react'
import { env } from '@/utils/env'

// Initialize Mapbox
mapboxgl.accessToken = env.VITE_map_key
console.log('map key loakded',env.VITE_map_key)


function MapComponent({ mapEvent }) {
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [ myImage, setMyImage ] = useState(null)
  const [cloudName] = useState(env.VITE_cloudinary_name);
 
  const concerts = [
    { id: 1, title: 'Neon Nights', artist: 'The Glowing Stones', date: 'July 15, 2023', venue: 'Stellar Arena', genre: 'Rock', image: '/placeholder.svg?height=200&width=300', coordinates: [-74.006, 40.7128] },
    { id: 2, title: 'Synthwave Surge', artist: 'Retro Pulse', date: 'July 20, 2023', venue: 'Neon Lounge', genre: 'Electronic', image: '/placeholder.svg?height=200&width=300', coordinates: [-73.935242, 40.730610] },
    { id: 3, title: 'Cosmic Melodies', artist: 'Stardust Symphony', date: 'July 25, 2023', venue: 'Galactic Hall', genre: 'Classical Fusion', image: '/placeholder.svg?height=200&width=300', coordinates: [-74.0445, 40.6892] },
    { id: 4, title: 'Techno Twilight', artist: 'Binary Beats', date: 'August 1, 2023', venue: 'Digital Dome', genre: 'Techno', image: '/placeholder.svg?height=200&width=300', coordinates: [-73.9857, 40.7484] },
  ]
  
  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  const handleMarkerClick = (event) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
    setMyImage(cld.image(event.banner_image))
  };


  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-74.006, 40.7128],
      zoom: 11
    });

    map.current.on('load', () => {
      // Add markers for each concert
      mapEvent.forEach((event) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(https://res.cloudinary.com/dzwjm8n8v/image/upload/v1731575754/${event.banner_image}.jpg)`;
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.backgroundSize = '100%';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid #fff';

        el.addEventListener('click', () => {
          handleMarkerClick(event)
        });

        new mapboxgl.Marker(el)
          .setLngLat([event.longitude, event.latitude])
          .addTo(map.current);
      });
    });
  }, [mapEvent]);

  useEffect(() => {
    if (!map.current) return;
    map.current.resize();
  }, [isMapFullscreen]);



  


  return (
    <div className=' w-full h-full'>
      <div ref={mapContainer} className=" relative w-full h-full rounded-xl" />



      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{selectedEvent?.title || "Event Details"}</DrawerTitle>
            <DrawerDescription>
              {selectedEvent?.description || "No additional details available."}
            </DrawerDescription>
            <div className="border-2  rounded-lg p-4  flex items-center justify-center mt-2">
            {myImage ? (
              <AdvancedImage
                style={{ maxWidth: "30%" }}
                cldImg={myImage}
                plugins={[responsive(), placeholder()]}
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Image preview will appear here</p>
              </div>
            )}
          </div>
          </DrawerHeader>

          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* <Card className="absolute z-10 top-24 right-4 w-64 bg-gray-800 border-gray-700">
          <Button variant="ghost" size="icon" onClick={() => setSelectedConcert(null)} className="text-gray-400 hover:text-white">
            <X />
          </Button>
          <CardHeader>
            <CardTitle className="text-purple-400">{selectedConcert.title}</CardTitle>
            <CardDescription className="text-gray-400">{selectedConcert.artist}</CardDescription>

          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-300">
              <p><Calendar className="inline h-4 w-4 mr-2" />{selectedConcert.date}</p>
              <p><MapPin className="inline h-4 w-4 mr-2" />{selectedConcert.venue}</p>
              <p><Music className="inline h-4 w-4 mr-2" />{selectedConcert.genre}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Get Tickets</Button>
          </CardFooter>
        </Card>
      */}
    </div>
  )
}

export default MapComponent
