import React, { useEffect } from 'react'
import Register from '../Page_components/Register/Register'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
function RegisterPage() {
  
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
    <div>
      <Register/>
    </div>
  )
}

export default RegisterPage