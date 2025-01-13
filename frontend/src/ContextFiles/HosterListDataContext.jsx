import React, { createContext, useState, useEffect } from 'react'
import axiosInstance from '@/axiosconfig'
import { store } from '../redux/Store';

export const HosterListDataContext = createContext();

function HosterListDataProvider ({ children }) {
    const state = store.getState()
    const user_id = state.id
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`hoster_list/`)
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
        <HosterListDataContext.Provider value={{ data, error, loading, refreshData }}>
            {children}
        </HosterListDataContext.Provider>
    )
}

export default HosterListDataProvider 
