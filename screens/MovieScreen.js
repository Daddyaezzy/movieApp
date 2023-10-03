import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { styles, theme } from "../theme";
import { Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image185,
  image500,
} from "../api/moviedb";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const topMargin = ios ? "" : "mt-3";

export default function MovieScreen() {
  const { params: item } = useRoute();
  const navigation = useNavigation();
  const movieName = "Ant-man and the Wasp: Quantumania";

  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, toggleFavourite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovie(item.id);
  }, [item]);

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    // console.log("data", data);
    if (data) setMovie(data);
    setLoading(false);
  };
  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    // console.log("data", data);
    if (data && data.cast) setCast(data.cast);
  };
  const getSimilarMovie = async (id) => {
    const data = await fetchSimilarMovies(id);
    // console.log("Similar data", data);
    if (data && data.results) setSimilarMovies(data.results);
  };

  return (
    <View className="flex-1 bg-neutral-900">
      {/* back button and movie poster */}

      <SafeAreaView
        className={
          " absolute z-20 w-full flex-row justify-between items-center " +
          topMargin
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
          <HeartIcon
            size="35"
            color={isFavourite ? theme.background : "white"}
          />
        </TouchableOpacity>
      </SafeAreaView>

      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          className="w-full"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="">
            <Image
              source={{
                uri: image500(movie?.poster_path) || fallbackMoviePoster,
              }}
              // source={require("../assets/images/moviePoster2.png")}
              style={{ width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]}
              style={{ width, height: height * 0.4 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="absolute bottom-0"
            />
          </View>

          {/* movie details */}
          <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
            {/* title */}
            <Text className="text-white text-center text-3xl font-bold tracking-wider">
              {movie?.title}
            </Text>
            {/* status, release, runtime */}

            {movie?.id ? (
              <Text className="text-neutral-400 font-semibold text-center">
                {movie?.status} • {movie?.release_date?.split("-")[0]} •{" "}
                {movie?.runtime} min
              </Text>
            ) : null}

            {/* genres */}
            <View className="flex-row justify-center mx-4 space-x-2">
              {movie?.genres?.map((genre, index) => {
                let showDot = index + 1 != movie?.genres?.length;

                return (
                  <Text
                    key={index}
                    className="text-neutral-400 font-semibold text-base text-center"
                  >
                    {genre.name} {showDot ? "•" : null}
                  </Text>
                );
              })}
            </View>

            {/* description */}
            <Text className="text-neutral-400 mx-4 tracking-wide">
              {movie?.overview}
            </Text>
          </View>

          {/* cast */}
          {cast.length > 0 && <Cast navigation={navigation} cast={cast} />}

          {/* Related movies */}
          {similarMovies.length > 0 && (
            <MovieList
              title="Related Movies"
              hideSeeAll={true}
              data={similarMovies}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}
