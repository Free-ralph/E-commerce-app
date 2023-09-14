import React from 'react'
import { Routes , Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from '../../frontend/src/components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'
import Cart from './pages/Cart'
import Shipping from './pages/Shipping'
import Confirmation from './pages/Confirmation'
import PrivateRoute from './components/PrivateRoute'
import { useStateContext } from './context/ContextProvider'
import { Snackbar, Alert } from '@mui/material'
import About from './pages/About'


const App = () => {
  
  const { message, snackBar, handleClose } = useStateContext()
  return (
    <div className=' bg-secondary w-screen h-screen overflow-hidden font-display'>
      <Snackbar open={snackBar} anchorOrigin={{ vertical : 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={message.severity} sx={{ width: '100%' }}>
          {message.message}
        </Alert>
      </Snackbar>
      <Routes>
        <Route path = '/login' element = {<Login />}/>
        <Route path = '/register' element = {<Register />}/>
      </Routes>
      <div className='w-full h-full overflow-scroll'>
        <Navbar />
        <div className='mx-7'>
          <Routes>
            <Route path = '/'  element = {<Home />}/>
            <Route path = '/cart'  element = {<PrivateRoute><Cart /></PrivateRoute>}/>
            <Route path = '/shipping'  element = {<PrivateRoute><Shipping /></PrivateRoute>}/>
            <Route path = '/confirm-order'  element = {<PrivateRoute><Confirmation /></PrivateRoute>}/>
            <Route path = '/about'  element = {<About />}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App