import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";
import BottomTab from "./app/navigation/BottomTab";
import { UserLocationContext } from "./app/context/UserLocationContext";
import { UserReversedGeoCode } from "./app/context/UserReversedGeoCode";
import { RestaurantContext } from "./app/context/RestaurantContext";
import { CartCountContext } from "./app/context/CartCountContext";
import { LoginContext } from "./app/context/LoginContext";
import FoodNavigator from "./app/navigation/FoodNavigator";
import RestaurantPage from "./app/navigation/RestaurantPage";
import Restaurant from "./app/screens/restuarant/Restaurant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginPage from "./app/screens/LoginPage";
import SignUp from "./app/screens/SignUp";
import AddRating from "./app/screens/AddRating";

import MoreFoods from "./app/screens/food/MoreFoods";
import AllRestaurants from "./app/screens/food/AllRestaurants";
import FastestFoods   from "./app/screens/food/FastestFoods";

const Stack = createNativeStackNavigator();

export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [restaurantObj, setRestaurantObj] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [login, setLogin] = useState(null);

  const [fontsLoaded] = useFonts({
    regular: require("./assets/fonts/Poppins-Regular.ttf"),
    light: require("./assets/fonts/Poppins-Light.ttf"),
    bold: require("./assets/fonts/Poppins-Bold.ttf"),
    medium: require("./assets/fonts/Poppins-Medium.ttf"),
    extrabold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
    semibold: require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  const defaultAddresss = {
    city: "Hamilton",
    country: "Canada",
    district: "Ontario",
    isoCountryCode: "CA",
    name: "33 King Street Rd",
    postalCode: "L8R1Z7",
    region: "SH",
    street: "Stockton St",
    streetNumber: "1",
    subregion: "San Francisco County",
    timezone: "America/Los_Angeles",
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const fetchData = async () => {
    setAddress(defaultAddresss);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access the location was denied!");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    loginStatus();
  };

  const loginStatus = useCallback(async () => {
    const userToken = await AsyncStorage.getItem("token");

    if (userToken !== null) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // Call hooks unconditionally
  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <UserLocationContext.Provider value={{ location, setLocation }}>
      <UserReversedGeoCode.Provider value={{ address, setAddress }}>
        <RestaurantContext.Provider value={{ restaurantObj, setRestaurantObj }}>
          <CartCountContext.Provider value={{ cartCount, setCartCount }}>
            <LoginContext.Provider value={{ login, setLogin }}>
              <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen
                    name="bottom-navigation"
                    component={BottomTab}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="food-nav"
                    component={FoodNavigator}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="restaurant-page"
                    component={RestaurantPage}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="restaurant"
                    component={Restaurant}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="rating-page"
                    component={AddRating}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="signUp"
                    component={SignUp}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="login"
                    component={LoginPage}
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="more_categories"
                    component={MoreFoods}
                    options={{ headerShown: true, title: "Explore Foods" }}
                  />

                  <Stack.Screen
                    name="nearby_restaurants"
                    component={AllRestaurants}
                    options={{ headerShown: true, title: "All Restaurants" }}
                  />

                  <Stack.Screen
                    name="fastest"
                    component={FastestFoods}
                    options={{ headerShown: true, title: "All Fastest Foods" }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </LoginContext.Provider>
          </CartCountContext.Provider>
        </RestaurantContext.Provider>
      </UserReversedGeoCode.Provider>
    </UserLocationContext.Provider>
  );
}
