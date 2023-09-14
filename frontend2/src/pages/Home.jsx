import React from 'react'
import Sidebar from '../components/Sidebar'
import Products from '../components/Products'


const Home = () => {
  return (
    <div className='flex'>
        <Sidebar />
        <Products />
    </div>
  )
}

export default Home