import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import { COLORS, SIZES } from "../constants/theme";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { CartCountContext } from "../context/CartCountContext";
import Counter from "../components/Counter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BaseUrl } from "../constants/theme";

const FoodPage = ({ route, navigation }) => {
  const item = route.params.item;

  const [isChecked, setIsChecked] = useState(false);
  const [additives, setAdditives] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const { cartCount, setCartCount } = useContext(CartCountContext);
  const [restaurant, setRestaurant] = useState(1);
  const [count, setCount] = useState(1);
  const [preference, setPreference] = useState("");

  let id = item.restaurant;

  let sendToOrderPage = {
    orderItem: {
      foodId: item._id,
      quantity: count,
      additives: additives,
      instructions: preference,
      price: (item.price + totalPrice) * count,
    },
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl[0],
    restaurant: id,
  };

  const handleAdditive = (newAdditive) => {
    setAdditives((prevAdditive) => {
      // Remove the additive from the list
      const exist = prevAdditive.some(
        (additive) => additive.id === newAdditive.id
      );
      // Remove the additive from the list
      if (exist) {
        return prevAdditive.filter(
          (additive) => additive.id !== newAdditive.id
        );
      } else {
        // Add the additive to the list
        return [...prevAdditive, newAdditive];
      }
    });
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [additives]);

  function calculateTotalPrice() {
    const total = additives.reduce(
      (sum, additive) => sum + parseFloat(additive.price),
      0
    );
    setTotalPrice(total);
  }

  const handlePress = (item) => {
    const cartItem = {
      foodId: item._id,
      additives: additives,
      quantity: count,
      totalPrice: (item.price + totalPrice) * count,
    };

    addToCart(cartItem);
  };

  const addToCart = async (item) => {
    const token = await AsyncStorage.getItem("token");
    const accessToken = JSON.parse(token);
    try {
      const response = await axios.post(`${BaseUrl}/api/cart`, item, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCartCount(response.data.count);
    } catch (error) {
      console.error("There was a problem with the axios request:", error);
    }
  };
  return (
    <View style={{ backgroundColor: COLORS.lightWhite, height: SIZES.height }}>
      <View>
        <Image
          source={{ uri: item.imageUrl[0] }}
          style={{
            width: SIZES.width,
            height: SIZES.height / 4,
            borderBottomRightRadius: 30,
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons
            name="chevron-back-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} style={styles.shareBtn}>
          <MaterialCommunityIcons
            name="share-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} style={styles.restBtn}>
          <View
            style={{
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: 15,
              padding: 10,
              marginRight: 10,
            }}
          >
            <Text>Open the Store</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={[styles.title, { marginBottom: 10 }]}>{item.title}</Text>
          <Text style={[styles.title, { color: COLORS.primary }]}>
            ${(item.price + totalPrice) * count}
          </Text>
        </View>

        <Text style={styles.title}>{item.description}</Text>

        <FlatList
          data={item.foodTags}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item}
          style={{ marginTop: 5 }}
          horizontal
          renderItem={({ item }) => (
            <View
              style={{
                marginHorizontal: 10,
                right: 10,
                backgroundColor: COLORS.primary,
                borderRadius: 8,
              }}
            >
              <Text style={{ paddingHorizontal: 4, color: COLORS.lightWhite }}>
                {item}
              </Text>
            </View>
          )}
        />

        <Text style={[styles.title, { marginBottom: 10, marginTop: 10 }]}>
          Additives and Toppings
        </Text>

        <FlatList
          data={item.additives}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          style={{ marginTop: 5 }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <BouncyCheckbox
                size={20}
                fillColor={COLORS.primary}
                unfillColor="#FFFFFF"
                text={item.title}
                innerIconStyle={{ borderWidth: 1 }}
                textStyle={styles.small}
                onPress={() => {
                  handleAdditive(item);
                }}
              />
              <Text style={styles.small}>$ {item.price}</Text>
            </View>
          )}
        />

        <Text style={[styles.title, { marginBottom: 10, marginTop: 30 }]}>
          Preferences
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Add Specific instructions"
            value={preference}
            onChangeText={(value) => setPreference(preference)}
            autoCapitalize="none"
            autoCorrect={false}
            style={{ flex: 1 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text style={[styles.title, { marginBottom: 10 }]}>Quantity</Text>
          <Counter count={count} setCount={setCount} />
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <View style={styles.cartSuspension}>
          <View style={styles.cart}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => handlePress(item)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 99,
                  backgroundColor: COLORS.primary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign
                  name="pluscircleo"
                  size={24}
                  color={COLORS.lightWhite}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("order-page", sendToOrderPage)
                }
                style={{
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 80,
                  borderRadius: 30,
                }}
              >
                <Text
                  style={[
                    styles.title,
                    {
                      color: COLORS.gray2,
                      marginTop: 8,
                      alignItems: "center",
                      fontSize: 18,
                    },
                  ]}
                >
                  Order Now
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 99,
                  backgroundColor: COLORS.primary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.title, { color: COLORS.lightWhite }]}>
                  {cartCount}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FoodPage;

const styles = StyleSheet.create({
  backBtn: {
    marginLeft: 12,
    alignItems: "center",
    position: "absolute",
    zIndex: 999,
    top: SIZES.xxLarge,
  },
  shareBtn: {
    marginRight: 12,
    position: "absolute",
    right: 0,
    zIndex: 999,
    top: SIZES.xxLarge,
  },
  restBtn: {
    position: "absolute",
    zIndex: 999,
    bottom: 30,
    right: 0,
  },
  container: {
    marginHorizontal: 12,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: "medium",
    color: COLORS.black,
  },

  inputWrapper: {
    borderColor: COLORS.primary1,
    backgroundColor: COLORS.offWhite,
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 12,
    alignItems: "center",
  },

  cartSuspension: {
    position: "absolute",
    zIndex: 999,
    width: "100%",
    alignItems: "center",
  },
  cart: {
    width: SIZES.width - 24,
    height: 60,
    justifyContent: "center",
    backgroundColor: COLORS.primary1,
    borderRadius: 30,
  },
});
