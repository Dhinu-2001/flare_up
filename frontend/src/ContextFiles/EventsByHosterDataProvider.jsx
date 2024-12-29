import React, { createContext, useState, useEffect } from 'react'
import axiosInstance from '@/axiosconfig'
import { store } from '@/redux/Store';

export const EventsByHosterDataContext = createContext();

function EventsByHosterDataProvider ({ children }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const state = store.getState()
    const hoster_id = state.id

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/events/events/hoster/${hoster_id}/`)
                console.log('EventsByHosterDataProvider', response)
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
        <EventsByHosterDataContext.Provider value={{ data, error, loading }}>
            {children}
        </EventsByHosterDataContext.Provider>
    )
}

export default EventsByHosterDataProvider 
