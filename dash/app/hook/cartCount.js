import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl } from "../constants/theme";
import { CartCountContext } from "../context/CartCountContext";

const fetchCartCount = () => {
  const [count, setCount] = useState(null);
  const [isCartLoading, setIsLoading] = useState(false);
  //const {cartCount, setCartCount} =  useContext(CartCountContext);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);

    setIsLoading(true);

    try {
      const response = await axios.get(`${BaseUrl}/api/cart/count`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data)

     //setCount(response.data.cartCount);
      //setCartCount(response.data.cartCount)
      setIsLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    setIsLoading(true);
    fetchData();
  };

  return { count, isCartLoading, error, refetch };
};

export default fetchCartCount;
