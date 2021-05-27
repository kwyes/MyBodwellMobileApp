import React, { Component } from "react";
import {
  StyleSheet,
  Platform,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { Block, Text, Button, Input, theme } from "galio-framework";
import { HeaderHeight } from "../constants/utils";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("window");

export default class LoadingScreen extends Component {
  render() {
    return (
      <Block style={styles.loading}>
        <ActivityIndicator size="large" color="#512da8" />
        <Text style={styles.loadingText}>Loading...</Text>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  loading: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    flex: 1,
    position: "absolute",
    opacity: 0.8,
    backgroundColor: "#ffffff",
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999
  },
  loadingText: {
    color: "#512da8",
    marginTop: 10,
    opacity: 1
  }
});
