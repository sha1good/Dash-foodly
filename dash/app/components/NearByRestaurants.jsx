import { StyleSheet, FlatList, View, Text } from "react-native";
import React, { useContext } from "react";
import uidata from "../constants/uidata";
import StoreComponent from "./StoreComponent";
import { useNavigation } from "@react-navigation/native";
import { RestaurantContext } from "../context/RestaurantContext";
import fetchNearByRestaurants from "../hook/nearByRestaurants";
import ReusableShimmer from "./Shimmers/ReusableShimmer";
import { SIZES } from "../constants/theme";

const NearByRestaurants = ({ code }) => {
  const navigation = useNavigation();
  const { restaurantObj, setRestaurantObj } = useContext(RestaurantContext);
  const {restaurants, isLoading,} = fetchNearByRestaurants(code);
  const restaurantShimmer = [1,2,3,4];
  
  if (isLoading) {
    return (
      <View style={{ marginLeft: 12, marginBottom: 10,}}>
        <FlatList
          data={restaurantShimmer} 
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 5,rowGap: 10 }}
          horizontal
          scrollEnabled
          renderItem={({ item }) => (
            <View style={{ marginRight: 15}}>
              <ReusableShimmer width={SIZES.width - 80} height={SIZES.height / 5.3} radius={16}/>
            </View>
              
            
          )}
        />
      </View>
    );
  }

  return (
    <View style={{ marginLeft: 12, marginBottom: 10 }}>
      <FlatList
        data={restaurants}
        //data={uidata.restaurants}
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 5 }}
        keyExtractor={(item) => item._id}
        horizontal
        scrollEnabled
        renderItem={({ item }) => (
          <StoreComponent item={item} onPress={() => {navigation.navigate("restaurant", item), setRestaurantObj(item)}} />
        )}
      />
    </View>
  );
};

export default NearByRestaurants;
