import React, { Component } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import * as Progress from "react-native-progress";

const { width, height } = Dimensions.get("window");

export default class ProgressBar extends Component {
  render() {
    const { value, color } = this.props;
    return (
      <View style={styles.progressWrapper}>
        <Progress.Bar
          progress={value}
          width={width}
          height={height * 0.056}
          // height={12}
          borderRadius={0}
          useNativeDriver={true}
          color={color}
          animated={true}
          borderWidth={0}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  progressWrapper: {
    // marginTop: 10,
    // marginBottom: 20
    margin: 3
  }
});
