import React, { createContext, useState, useEffect } from 'react'
import axiosInstance from '@/axiosconfig'
import { store } from "../redux/Store";
import { useParams } from 'react-router-dom';

export const EventDetailsDataContext = createContext();

function EventDetailsProvider ({ children }) {
    const { event_id } = useParams();
    const numericEventId = Number(event_id);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`/events/event/${numericEventId}/`)
            console.log('context', response)
            setData(response.data)
            setLoading(false)
        } catch (err) {
            setError(err)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const refreshData = async () => {
        setLoading(true);
        await fetchData();
      };

    return (
        <EventDetailsDataContext.Provider value={{ data, error, loading, refreshData, setLoading }}>
            {children}
        </EventDetailsDataContext.Provider>
    )
}

export default EventDetailsProvider 
