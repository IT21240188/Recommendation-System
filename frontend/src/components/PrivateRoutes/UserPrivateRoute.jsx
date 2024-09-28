import React from 'react'
import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const UserPrivateRoute = () => {
    const userInfoString = localStorage.getItem('UserInfo');
    const storedUserInfo = JSON.parse(userInfoString);
    console.log(storedUserInfo);
    
    const navigate = useNavigate();
  
    useEffect(() => {
        
        if(storedUserInfo){
        }
        else{
            navigate('/login');
        }
      
  
      
    }, [])
  
    return storedUserInfo ? <Outlet /> :  null ;
}

export default UserPrivateRoute
