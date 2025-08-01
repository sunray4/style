import { Atma_600SemiBold, useFonts } from "@expo-google-fonts/atma";
import { Nunito_600SemiBold, Nunito_900Black } from "@expo-google-fonts/nunito";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { useAuth } from "./context/AuthContext";

import Logo from "../assets/Catto.svg"; // Adjust the path as necessary

const catimg = [
  require("../assets/frames/1.png"),
  require("../assets/frames/2.png"),
  require("../assets/frames/3.png"),
  require("../assets/frames/4.png"),
  require("../assets/frames/5.png"),
  require("../assets/frames/6.png"),
  require("../assets/frames/7.png"),
  require("../assets/frames/8.png"),
];

const BackgroundPattern = () => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const patternSize = 100;
  const spacing = 60; // Reduced spacing between patterns

  const patterns = [];
  for (let x = 0; x < screenWidth; x += patternSize) {
    for (let y = 0; y < screenHeight; y += patternSize) {
      patterns.push(
        <View
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: patternSize,
            height: patternSize,
          }}
        >
          <Svg width={patternSize} height={patternSize}>
            <Rect
              width={patternSize}
              height={patternSize}
              fill="#FFC688"
              fillOpacity="0.41"
            />
            <Path
              d="M11 0l5 20H6l5-20zm42 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM0 72h40v4H0v-4zm0-8h31v4H0v-4zm20-16h20v4H20v-4zM0 56h40v4H0v-4zm63-25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM53 41a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-28-8a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zM56 5a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zm-3 46a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 0l5 20H16l5-20zm43 64v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4zM36 13h4v4h-4v-4zm4 4h4v4h-4v-4zm-4 4h4v4h-4v-4zm8-8h4v4h-4v-4z"
              fill="#FFE2C0"
              fillOpacity="0.41"
            />
          </Svg>
        </View>
      );
    }
  }

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {patterns}
    </View>
  );
};

const Home = () => {
  const { userEmail, isLoading, logout } = useAuth();

  const floatAnimation = useRef(new Animated.Value(0)).current;

  // State for cat frame animation
  const [currentFrame, setCurrentFrame] = useState(0);

  // State for button hover effects
  const [browseHover, setBrowseHover] = useState(false);
  const [galleryHover, setGalleryHover] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !userEmail) {
      router.replace("/login");
    }
  }, [isLoading, userEmail]);

  // cat circle animation
  useEffect(() => {
    const startFloating = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnimation, {
            toValue: -15,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnimation, {
            toValue: 0, // original position
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startFloating();
  }, [floatAnimation]);

  // Cat frame animation - cycles through catimg array every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % catimg.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  let [fontsLoaded] = useFonts({
    Atma_600SemiBold,
    Nunito_900Black,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!userEmail) {
    return null;
  }

  const onPressButton = (buttonName) => {
    if (buttonName === "Browse") {
      console.log("Browse button pressed!");
      setBrowseHover(true);
      router.push("/browse");
    } else if (buttonName === "Gallery") {
      console.log("Gallery button pressed!");
      setGalleryHover(true);
      router.push("/gallery");
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundPattern />
      <Text
        style={[
          styles.title,
          { fontFamily: "Atma_600SemiBold", marginBottom: -10 },
        ]}
      >
        Welcome to
      </Text>
      <Text
        style={[styles.title, { fontFamily: "Atma_600SemiBold", fontSize: 45 }]}
      >
        Style Master
      </Text>

      <Animated.View
        style={[
          styles.imageFrame,
          {
            transform: [{ translateY: floatAnimation }],
          },
        ]}
      >
        <Logo width="100%" height="100%" viewBox="0 0 1000 1000" />
      </Animated.View>
      <TouchableOpacity
        style={[styles.button, browseHover && { backgroundColor: "#90EE90" }]}
        onPressIn={() => onPressButton("Browse")}
        onPressOut={() => setBrowseHover(false)}
      >
        <Text style={styles.buttonText}>Browse</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: "#6D9BFF",
            borderColor: "#355A99",
            marginBottom: 0,
          },
          galleryHover && { backgroundColor: "#90EE90" },
        ]}
        onPressIn={() => onPressButton("Gallery")}
        onPressOut={() => setGalleryHover(false)}
      >
        <Text style={styles.buttonText}>Gallery</Text>
      </TouchableOpacity>

      {/* Animated Cat under Gallery button */}
      <View style={styles.animatedCat}>
        <Image
          source={catimg[currentFrame]}
          style={styles.catImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.userInfo}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFC688",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 40,
    color: "black",
    marginBottom: 5,
    textAlign: "center",
  },
  imageFrame: {
    width: 200,
    height: 200,
    overflow: "hidden",
    borderRadius: 100,
    margin: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 1.0,
    shadowRadius: 16,
    elevation: 15,
    borderWidth: 2,
    borderColor: "#FFE2C0",
    marginBottom: 50,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  button: {
    backgroundColor: "#72B16D", //green
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#4F7A4B",
    padding: 14,
    width: "70%",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Nunito_900Black",
  },
  loadingText: {
    fontSize: 16,
    color: "black",
    marginTop: 16,
  },
  userInfo: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  userEmail: {
    fontSize: 16,
    color: "black",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#EBAF74",
    borderColor: "#B3743E",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFC688",
  },
  animatedCat: {
    marginTop: 15,
    alignItems: "center",
  },
  catImage: {
    width: 80,
    height: 80,
  },
  gifImage: {
    width: 100,
    height: 100,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
