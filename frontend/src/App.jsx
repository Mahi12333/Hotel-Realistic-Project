import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import { Container } from 'react-bootstrap'
import { Outlet, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetUserQuery } from './slices/usersApiSlice.js'
import { useEffect } from 'react'
import { setCredentials } from './slices/authSlice.js'
import { useDispatch } from 'react-redux'

function App() {

  const { data: userData, error, isLoading } = useGetUserQuery();
  const navigate  =useNavigate()
  const dispatch = useDispatch()


  useEffect(() => {
    if (userData) {
      dispatch(setCredentials({ ...userData })); // Assuming userData contains credentials
    } else if (error) {
      navigate('/login');
      console.log('ok');
    }
  }, [userData, error, dispatch, navigate]);

  
  if (isLoading) {
    return <div>Loading...</div>;
}
console.log(isLoading);







  return (
    <>
      <Header />
      <ToastContainer />
      <Container className='my-2'>
        <Outlet />
      </Container>
    </>
  )
}

export default App
