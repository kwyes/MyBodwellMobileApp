import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Block, Text } from "galio-framework";
import Pie from "react-native-pie";
import { RFValue } from "react-native-responsive-fontsize";
import { numFormat } from "../components/NumFormat";

const { width } = Dimensions.get("screen");

export default class PieChart extends Component {
  render() {
    const { value } = this.props;
    return (
      <Block>
        <Pie
          radius={width / 8}
          innerRadius={width / 10}
          series={[parseFloat(value)]}
          colors={["#e67e22"]}
          backgroundColor="#ddd"
        />
        <Block style={styles.gauge}>
          <Text style={[styles.gaugeText, styles.fontFamilyBlack]}>
            {numFormat(value, 1)}%
          </Text>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  gauge: {
    position: "absolute",
    width: width / 4,
    height: width / 4,
    alignItems: "center",
    justifyContent: "center"
  },
  gaugeText: {
    backgroundColor: "transparent",
    color: "#000",
    fontSize: RFValue(16)
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  }
});
