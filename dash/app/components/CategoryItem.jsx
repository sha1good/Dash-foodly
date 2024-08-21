import React from "react";
import { View, Image, Text} from "react-native";
import { COLORS, SHADOWS, SIZES } from "../constants/theme";
import NetworkImage from "./NetworkImage";

const CategoryItem = ({ category, selected }) => {
 
  return (
    <View
      style={{
        marginLeft: 12,
        padding: 5,
        alignItems: "center",
        margin: 5,
        width: 90,
        height: 55,
        justifyContent: "center",
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor:
          category.value === selected ? COLORS.secondary : "transparent",
        shadowColor: SHADOWS.small,
      }}
    >
      <Image source={{uri: category.imageUrl}} style={{ width: 30, height: 30 }} />
      <Text style={{ fontSize: 13, fontFamily: "regular" }}>
      {category.title}
      </Text>
     
    </View>
  );
};

export default CategoryItem;
