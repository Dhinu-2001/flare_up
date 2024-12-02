import React, { createContext, useState, useEffect } from 'react'
import axiosInstance from '@/axiosconfig'
import { store } from '@/redux/Store';

export const PaymentsByHosterDataContext = createContext();

function PaymentsByHosterDataProvider ({ children }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const state = store.getState()
    const hoster_id = state.id

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`registrations/${hoster_id}/`)
                console.log('Payment detraliil', response)
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
        <PaymentsByHosterDataContext.Provider value={{ data, error, loading }}>
            {children}
        </PaymentsByHosterDataContext.Provider>
    )
}

export default PaymentsByHosterDataProvider 
