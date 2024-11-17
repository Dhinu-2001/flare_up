import React, { createContext, useState, useEffect } from 'react'
import axiosInstance from '@/axiosconfig'

export const DataContext = createContext();

function DataProvider ({ children }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/events/event-types-and-categories/')
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
        <DataContext.Provider value={{ data, error, loading }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider 
