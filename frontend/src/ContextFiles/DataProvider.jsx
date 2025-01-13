import React, { createContext, useState, useEffect } from 'react'
import axiosInstance from '@/axiosconfig'

export const DataContext = createContext();

function DataProvider ({ children }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

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

    useEffect(() => {
        
        fetchData();
    }, [])

    const refreshData = async () => {
        setLoading(true);
        await fetchData();
      };

    return (
        <DataContext.Provider value={{ data, error, refreshData, loading }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider 
