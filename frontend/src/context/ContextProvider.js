import { useContext, createContext, useState, useEffect } from "react";
import { fetchData } from '../utils/FetchData'
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";


const StateContext = createContext()
export const ContextProvider = ({ children }) => {
  const navigate = useNavigate()
  const [filterCategory, setFilterCategory] = useState([])
  const [openDrawer, setOpenDrawer] = useState(false);
  const [products, setproducts] = useState([]);
  const [user, setUser] = useState(() => localStorage.getItem('authToken') ? jwtDecode(JSON.parse(localStorage.getItem('authToken')).access) : {})
  const [authToken, setauthToken] = useState(() => localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
  const [loginError, setLoginError] = useState({})
  const [registerError, setRegisterError] = useState({})
  const [loading, setloading] = useState(true)
  const [cartItems, setcartItems] = useState(null);
  const [order, setorder] = useState('')
  const [message, setmessage] = useState('')
  const [snackBar, setSnackbar] = useState(false)
  // const [favourites, setfavourites] = useState([])
  const [favChanged, setfavChanged] = useState('')


  const updateProducts = async () => {
    const { response } = await fetchData("/api/products", "GET");
    setproducts(response);
  }

  useEffect(() => {
    updateProducts()
  }, [user,]);


  useEffect(() => {
    loading && updateToken()

    const fourMins = 1000 * 60 * 9
    const interval = setInterval(() => {
      if (authToken.access) {
        updateToken()
      }
    }, fourMins)
    return () => clearInterval(interval)
  }, [authToken, loading])

  const GetCartItems = async () => {
    if (authToken.access) {
      const { response, status } = await fetchData(
        "/api/get-cart-items",
        "GET",
        null,
        { Authorization: "Bearer " + String(authToken.access) }
      );
      if (status === 200) {
          response.order_product.length > 0 ? setcartItems([...response.order_product]) : setcartItems(null)
        setorder(response)
      } else {
        setcartItems(null);
      }
    }
  }

  // useEffect(() => {
  //   const GetFav = async () => {
  //     if (user.username) {
  //       const { response, status } = await fetchData(
  //         "http://127.0.0.1:8000/api/favourites",
  //         "GET",
  //         null,
  //         { Authorization: "Bearer " + String(authToken.access) }
  //       );
  //       setfavourites(response.product)
  //     }
  //   }
  //   GetFav()
  // }, [favChanged,])

  const loginUser = async (e, username, password) => {
    e.preventDefault()
    const { response, status } = await fetchData('/api/token', 'POST', { username: username, password: password })
    if (status === 200) {
      setUser(jwtDecode(response.access))
      setauthToken(response)
      localStorage.setItem('authToken', JSON.stringify(response))
      setLoginError({})
      setmessage({
        message: `welcome ${jwtDecode(response.access).username}`,
        severity: 'success'
      })
      setSnackbar(true)
      navigate('/')
    } else {
      setLoginError(response)
    }
  }

  const logOutUser = () => {
    localStorage.removeItem('authToken')
    setUser({})
    setauthToken({})
    setmessage({
      message: 'logged out! please come back soon',
      severity: 'success'
    })
    setSnackbar(true)
  }

  const registerUser = async (username, password, password2, email) => {
    const { response, status } = await fetchData(
      "/api/register",
      "POST",
      { username, password, password2, email }
    );
    if (status === 200) {
      setUser({})
      setauthToken(null)
      localStorage.removeItem('authToken')
      navigate('/login')
      setRegisterError({})
      setmessage({
        message: 'Registration Complete, Please Log in',
        severity: 'success'
      })
      setSnackbar(true)
    } else {
      setRegisterError(response)
    }
  };
  const updateToken = async () => {
    if (authToken) {
      const { response, status } = await fetchData('/api/token/refresh', 'POST', { 'refresh': authToken.refresh })
      if (status === 200) {
        setUser(jwtDecode(response.access))
        setauthToken(response)
        localStorage.setItem('authToken', JSON.stringify(response))
      } else {
        logOutUser()
      }

      loading && setloading(false);
    }
  }

  const addToCart = async (id) => {
    if (user.username) {
      const { status } = await fetchData(`/api/add-to-cart/${id}`, 'GET', null, { 'Authorization': 'Bearer ' + String(authToken.access) })
      if (status === 200) {
        setmessage({
          message: 'item added successfully',
          severity: 'success'
        })
        setSnackbar(true)
        GetCartItems()
        navigate('/cart')
      } else {
        // console.log(status)
      }
    } else {
      navigate('/login')
    }
  }

  const addToFav = async (id) => {
    const { response, status } = await fetchData(
      `/api/add-favourite/${id}`,
      'GET',
      null,
      { 'Authorization': 'Bearer ' + String(authToken.access) }
    )
    if (status === 200) {
      setmessage({
        message: 'item added wishlist',
        severity: 'success'
      })
      setSnackbar(true)
      setfavChanged('')
    } else {
      console.log(response, 'dsd')
    }
  }

  const handleClose = () => {
    setSnackbar(false)
  }
  const handleOpen = () => {
    setSnackbar(true)
  }
  return (
    <StateContext.Provider
      value={
        {
          filterCategory, setFilterCategory, openDrawer,
          setOpenDrawer, products, setproducts, user,
          setUser, loginUser, loginError, logOutUser,
          registerUser, registerError, setRegisterError,
          addToCart, cartItems, authToken,
          setcartItems, order, setmessage,
          message, snackBar, setSnackbar, handleClose, handleOpen,
          addToFav, favChanged, setfavChanged, GetCartItems
        }
      }>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)