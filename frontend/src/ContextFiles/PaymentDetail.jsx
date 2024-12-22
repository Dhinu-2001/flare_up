import React,{useState, useEffect, createContext} from 'react'
import axiosInstance from '@/axiosconfig'
import { useParams } from 'react-router-dom'

export const PaymentDetailDataContext =  createContext();

function PaymentDetailProvider({children}) {
    const {transaction_id, user_id, event_id} = useParams()
    const user = Number(user_id)
    const event = Number(event_id)
    const [ data, setData] = useState(null)
    const [ loading, setLoading] = useState(true)
    const [ error, setError] = useState(null)


    useEffect(()=>{
        const fetchData = async()=>{
            try{
                setLoading(true)
                const response = await axiosInstance.get(`/payment_api/payments/${transaction_id}/${user}/${event}/`)
                console.log('payment details', response.data)
                const result = response.data
                setData(result)
            }catch(err){
                const error = err.response?.data?.error || err
                setError(error)
            } finally{
                setLoading(false)
            }
        }

        if(transaction_id && user_id){
            fetchData();
        }
    },[transaction_id, user_id])
    
  return (
    <PaymentDetailDataContext.Provider
    value ={{data, error, loading}}
    >
      {children}
    </PaymentDetailDataContext.Provider>
  )
}

export default PaymentDetailProvider
