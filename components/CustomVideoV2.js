import React from "react";
import { View, Text, StyleSheet, Button, Dimensions } from "react-native";
import { Constants, ScreenOrientation, LinearGradient } from "expo";
import { Audio, Video } from "expo-av";
import VideoPlayer from "expo-video-player";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("screen");

function CustomVideoV2({ videouri }) {
  return (
    <Video
      source={{ uri: videouri }}
      rate={1.0}
      volume={1.0}
      resizeMode="contain"
      shouldPlay={false}
      useNativeControls={true}
      style={{ width: width }}
    />
  );
}

CustomVideoV2.propTypes = {
  videouri: PropTypes.string
};

export default CustomVideoV2;

const styles = StyleSheet.create({});
