import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { env } from '@/utils/env'

// Initialize Mapbox
mapboxgl.accessToken = env.VITE_map_key
console.log('map key loakded', env.VITE_map_key)

export default function LocationPicker({ lng, setLng, lat, setLat, address, setAddress, city, setCity, state, setState, country, setCountry }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const geocoder = useRef(null);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom,
    });

    geocoder.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false, // Hide the default geocoder marker
    });

    map.current.addControl(geocoder.current);

    marker.current = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current);

    geocoder.current.on('result', (e) => {
      const { result } = e;
      const coordinates = result.geometry.coordinates;

      setLng(parseFloat(coordinates[0].toFixed(4)));
      setLat(parseFloat(coordinates[1].toFixed(4)));
      marker.current?.setLngLat(coordinates);

      // Update address components
      setAddress(result.place_name); // Or access more specific properties like result.address, etc.
      result.context.forEach((item) => {
        if (item.id.startsWith('place')) {
          setCity(item.text);
        } else if (item.id.startsWith('region')) {
          setState(item.text);
        } else if (item.id.startsWith('country')) {
          setCountry(item.text);
        }
      });
    });

    map.current.on('move', () => {
      if (map.current) {
        setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
        setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
        setZoom(parseFloat(map.current.getZoom().toFixed(2)));

        // Reverse geocode to update address components on map move
        const center = map.current.getCenter();
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${center.lng},${center.lat}.json?access_token=${mapboxgl.accessToken}`)
          .then(res => res.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              setAddress(data.features[0].place_name);
              data.features[0].context.forEach((item) => {
                if (item.id.startsWith('place')) {
                  setCity(item.text);
                } else if (item.id.startsWith('region')) {
                  setState(item.text);
                } else if (item.id.startsWith('country')) {
                  setCountry(item.text);
                }
              });
            }
          });
      }
    });

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setLng(parseFloat(lng.toFixed(4)));
      setLat(parseFloat(lat.toFixed(4)));
      marker.current?.setLngLat([lng, lat]);

      const center = map.current.getCenter();
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            setAddress(data.features[0].place_name);
            data.features[0].context.forEach((item) => {
              if (item.id.startsWith('place')) {
                setCity(item.text);
              } else if (item.id.startsWith('region')) {
                setState(item.text);
              } else if (item.id.startsWith('country')) {
                setCountry(item.text);
              }
            });
          }
        });

    });
  }, []);

  return (
    <div className="flex flex-col w-3/5">
      <div className="p-5 bg-black">
        <h2 className="text-lg font-semibold mb-1">Selected Location</h2>
        <p>Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}</p>
        {/* <p>Address: {address}</p>
        <p>City: {city}</p>
        <p>State: {state}</p>
        <p>Country: {country}</p> */}
      </div>
      <div ref={mapContainer} className="flex w-full h-96" />
    </div>
  );
}
