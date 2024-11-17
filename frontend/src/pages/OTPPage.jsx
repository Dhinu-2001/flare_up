import React,{useEffect} from 'react'
import OTPInputPage from '@/Page_components/Common/OTPcomponent'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function OTPPage() {

  const navigate = useNavigate()
  const authenticateStateValue = useSelector((store)=>store.isAuthenticated)
  const roleValue = useSelector((store)=>store.role)

  useEffect(()=>{
    
    if(authenticateStateValue == true){
      if(roleValue == 'hoster'){
        navigate('/hoster_home')
      }else if(roleValue == 'admin'){
        navigate('/admin_dashboard')
      }else if(roleValue == 'user'){
        navigate('/')
      }
    }

  },[])

  return (
    <OTPInputPage/>
  )
}

export default OTPPage
