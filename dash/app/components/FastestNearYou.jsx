import { StyleSheet, FlatList, View, Text } from "react-native";
import React from "react";
import NetworkImage from "./NetworkImage";
import { COLORS, SIZES } from "../constants/theme";
import { Rating, RatingInput } from "react-native-stock-star-rating";
import FoodComponent from "./FoodComponent";
import uidata from "../constants/uidata";
//import { useNavigation } from "@react-navigation/native";
//import fetchFoodRecommendations from "../hooks/recommendationsByCat";
//import ReusableShimmer from "./Shimmers/ReusableShimmer";

const FastestNearYou = () => {
  const renderFoodItem = ({ item }) => (
    <FoodComponent item={item} onPress={() => {}} />
  );

  return (
    <View style={{ marginLeft: 12, marginBottom: 10 }}>
      <FlatList
        data={uidata.foods}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        style={{ marginTop: 5 }}
        horizontal
        scrollEnabled
        renderItem={renderFoodItem}
      />
    </View>
  );
};

export default FastestNearYou;

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontFamily: "medium",
    marginTop: 5,
  },

  small: {
    fontSize: 12,
    fontFamily: "regular",
    color: COLORS.gray,
  },
});
