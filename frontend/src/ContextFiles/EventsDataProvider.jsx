import React, { createContext, useState, useEffect } from 'react'
import axiosInstance from '@/axiosconfig'

export const EventsDataContext = createContext();

function EventsDataProvider ({ children }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/events/')
                console.log('context', response)
                setData(response.data)
                setLoading(false)
            } catch (err) {
                setError(err)
                setLoading(false)
            }
        }
        fetchData();
    }, [])

    return (
        <EventsDataContext.Provider value={{ data, error, loading }}>
            {children}
        </EventsDataContext.Provider>
    )
}

export default EventsDataProvider 
