import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AssetImage from "./AssetImage";
import * as Location from "expo-location";
import { UserReversedGeoCode } from "../context/UserReversedGeoCode";
import { UserLocationContext } from "../context/UserLocationContext";
import { COLORS, SIZES } from "../constants/theme";

const HomeHeader = () => {
  const [time, setTime] = useState(null);
  const { address, setAddress } = useContext(UserReversedGeoCode);
  const { location } = useContext(UserLocationContext);

  useEffect(() => {
    if (location !== null) {
      reverseGeocode(location.coords.longitude, location.coords.latitude);
    }
    const greeting = getTimeOfDay();
    setTime(greeting);
  }, [location]);

  const reverseGeocode = async (longitude, latitude) => {
    const reverseGeoCodeAddress = await Location.reverseGeocodeAsync({
      longitude: longitude,
      latitude: latitude,
    });
    setAddress(reverseGeoCodeAddress[0]);
  };

  const getTimeOfDay = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 0 && hour < 12) {
      return "☀️ ";
    } else if (hour >= 12 && hour < 17) {
      return "🌤️ ";
    } else {
      return "🌙 ";
    }
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={styles.outerStyles}>
        <AssetImage
          data={require("../../assets/images/profile.jpg")}
          width={50}
          height={50}
          mode={"cover"}
          radius={99}
        />
        <View style={styles.headerText}>
          <Text style={styles.heading}>Delivering To: </Text>
          <Text style={styles.location}>
            {address
              ? `${address.city || "Unknown City"} ${address.name || ""}`
              : "Fetching location..."}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 36 }}>{time}</Text>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  outerStyles: {
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: "row",
  },
  headerText: {
    marginLeft: 10,
    width: "70%",
    justifyContent: "center",
  },
  heading: {
    fontFamily: "medium",
    fontSize: SIZES.medium,
    color: COLORS.secondary,
  },
  location: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
});
