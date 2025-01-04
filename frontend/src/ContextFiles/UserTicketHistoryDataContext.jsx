import React, { createContext, useState, useEffect } from 'react'
import axiosInstance from '@/axiosconfig'
import { store } from '../redux/Store';

export const UserTicketHistoryDataContext = createContext();

function UserTicketHistoryDataProvider ({ children }) {
    const state = store.getState()
    const user_id = state.id
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`events/get_user_ticket_booking_details/${user_id}/`)
            console.log('context', response)
            setData(response.data.result)
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
        <UserTicketHistoryDataContext.Provider value={{ data, error, loading, refreshData }}>
            {children}
        </UserTicketHistoryDataContext.Provider>
    )
}

export default UserTicketHistoryDataProvider 
