import React, { createContext, useState, useEffect } from 'react'
import axiosInstance from '@/axiosconfig'
import { store } from '@/redux/Store';
import { useParams } from 'react-router-dom';

export const PaymentsByEventDataContext = createContext();

function PaymentsByEventDataProvider ({ children }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
    const { event_id } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`events/participants/event/${event_id}/`)
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
        <PaymentsByEventDataContext.Provider value={{ data, error, loading }}>
            {children}
        </PaymentsByEventDataContext.Provider>
    )
}

export default PaymentsByEventDataProvider 
