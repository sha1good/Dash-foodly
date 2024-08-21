import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, SIZES } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import pages from "./page.style";
import uidata from "../constants/uidata";

import HomeHeader from "../components/HomeHeader";
import CategoryList from "../components/CategoryList";
import ChoiceList from "../components/ChoiceList";
import Heading from "../components/Heading";
import NearByRestaurants from "../components/NearByRestaurants";
import Divider from "../components/Divider";
import NewFoodList from "../components/NewFoodList";
import HomeCategory from "../components/HomeCategory";
import axios from "axios";
import { BaseUrl } from "../constants/theme";

const Home = ({navigation}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${BaseUrl}/api/foods/${selectedCategory}/41007428`
      );

      
      setCategory(response.data);

      setIsLoading(false);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, selectedSection]);

  return (
    <SafeAreaView>
      <View style={pages.viewOne}>
        <View style={pages.viewTwo}>
          <HomeHeader />
          <ScrollView
            showsHorizontalScrollIndicator={false}
            style={{ borderBottomEndRadius: 30, borderBottomStartRadius: 30 }}
          >
            <CategoryList
              setSelectedCategory={setSelectedCategory}
              setSelectedSection={setSelectedSection}
              setSelectedValue={setSelectedValue}
            />
            <ChoiceList
              setSelectedChoice={setSelectedChoice}
              setSelectedSection={setSelectedSection}
            />

            {selectedCategory !== null && selectedSection !== null ? (
              <View>
                <Heading
                  heading={`Browse ${selectedValue}`}
                  onPress={() =>  navigation.navigate('more_categories')}
                />
                <HomeCategory category={category} isLoading={isLoading} />
              </View>
            ) : (
              <View>
                <Heading heading={"Nearby Restaurants"} onPress={() => {}} />
                <NearByRestaurants code={"41007428"} />

                <Divider />
                <Heading heading={"Try Something New"} onPress={() => {}} />

                <NewFoodList code={"41007428"} />
                <Divider />
                <Heading heading={"Fastest Near You"} onPress={() => {}} />

                <NewFoodList code={"41007428"} />
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
