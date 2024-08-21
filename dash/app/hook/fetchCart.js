import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl } from "../constants/theme";
import { CartCountContext } from "../context/CartCountContext";

const fetchCart = () => {
    const [cartList, setCart] = useState(null);
    const [isCartLoading, setIsCartLoading] = useState(false);
    const {cartCount, setCartCount} =  useContext(CartCountContext);
    const [error, setError] = useState(null)


    const fetchData = async ()=> {  
        const token = await AsyncStorage.getItem('token')
        const accessToken = JSON.parse(token)
        setIsCartLoading(true)

        try {
            const response = await axios.get(`${BaseUrl}/api/cart`,
            {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            setCart(response.data.cart)
            setCartCount(response.data.cartCount)
            setIsCartLoading(false)
        } catch (error) {
           setError(error) 
        } finally{
            setIsCartLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const refetch =() => {
        setIsCartLoading(true)
        fetchData();
    }


    return {cartList, isCartLoading, error, refetch}
}

export default fetchCart