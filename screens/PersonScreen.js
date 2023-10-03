import {
  View,
  Text,
  Dimensions,
  Platform,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { useNavigation, useRoute } from "@react-navigation/native";
import { styles, theme } from "../theme";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import {
  fallbackPersonImage,
  fetchPersonDetails,
  fetchPersonMovies,
  image500,
} from "../api/moviedb";

let { height, width } = Dimensions.get("window");
let ios = Platform.OS === "ios";
const verticalMargin = ios ? "" : "my-3";

export default function PersonScreen() {
  const { params: item } = useRoute();
  const navigation = useNavigation();
  const [isFavourite, toggleFavourite] = useState(false);
  const [personMovies, setPersonMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState({});

  useEffect(() => {
    setLoading(true);
    getPersonDetails(item.id);
    getPersonMovies(item.id);
  }, [item]);

  const getPersonDetails = async (id) => {
    const data = await fetchPersonDetails(id);
    // console.log("person details", data);
    if (data) setPerson(data);
    setLoading(false);
  };
  const getPersonMovies = async (id) => {
    const data = await fetchPersonMovies(id);
    // console.log("person MOVIES details", data);
    if (data && data.cast) setPersonMovies(data.cast);
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-neutral-900">
      {/* back button and movie poster */}

      <SafeAreaView
        className={
          " absolute z-20 w-full flex-row justify-between items-center " +
          verticalMargin
        }
      >
        <TouchableOpacity
          style={styles.background}
          className="rounded-xl p-1 ml-4"
          onPress={() => navigation.goBack()}
        >
          <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="mr-4"
          onPress={() => toggleFavourite(!isFavourite)}
        >
          <HeartIcon size="35" color={isFavourite ? "red" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* person details */}

      {loading ? (
        <Loading />
      ) : (
        <View className="mt-28">
          <View
            className="flex-row justify-center"
            style={{
              shadowColor: "gray",
              shadowRadius: 40,
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 1,
            }}
          >
            <View className="items-center rounded-full overflow-hidden h-72 w-72 border border-neutral-500">
              <Image
                // source={require("../assets/images/castImage2.png")}
                source={{
                  uri: image500(person?.profile_path) || fallbackPersonImage,
                }}
                style={{ height: height * 0.43, width: width * 0.74 }}
              />
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-3xl text-white font-bold text-center">
              {person?.name}
            </Text>
            <Text className="text-base text-neutral-500 font-bold text-center">
              {person?.place_of_birth || "N/A"}
            </Text>
          </View>
          <View className="mx-3 p-4 mt-6 flex-row justify-between items-center bg-neutral-700 rounded-full">
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Gender</Text>
              <Text className="text-neutral-300 font-sm">
                {person?.gender === 1 ? "Female" : "Male"}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Birthday</Text>
              <Text className="text-neutral-300 font-sm">
                {person?.birthday || "N/A"}
              </Text>
            </View>
            <View className="border-r-2 border-r-neutral-400 px-2 items-center">
              <Text className="text-white font-semibold">Known for</Text>
              <Text className="text-neutral-300 font-sm">
                {person?.known_for_department || "N/A"}
              </Text>
            </View>
            <View className=" px-2 items-center">
              <Text className="text-white font-semibold">Popularity</Text>
              <Text className="text-neutral-300 font-sm">
                {person?.popularity?.toFixed(2) || "N/A"}
              </Text>
            </View>
          </View>
          <View className="my-6 mx-4 space-y-2">
            <Text className="text-white text-lg">Biography</Text>
            <Text className="text-neutral-400 tracking-wide">
              {person?.biography || "N/A"}
            </Text>
          </View>
          {/* movies */}

          {personMovies.length > 0 ? (
            <MovieList title={"Movies"} hideSeeAll={true} data={personMovies} />
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}
