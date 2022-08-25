import React, { useEffect } from 'react'

const Favourites = () => {
    useEffect(() => {
        const GetFavs = async () => {
            const { response, status } = await fetchData(
                '/api/favourites',
                'GET', 
                null, 
                { Authorization: "Bearer " + String(authToken.access) }
            )
            GetFavs()
        }
    }, [])
  return (
    <div>Favourites</div>
  )
}

export default Favourites