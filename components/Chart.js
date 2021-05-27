import React, { Component } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { Text } from "react-native-svg";
import { PieChart } from "react-native-svg-charts";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("window");

function Chart({ pieData }) {
  const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      return (
        <Text
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={"white"}
          textAnchor={"middle"}
          alignmentBaseline={"middle"}
          fontSize={12}
          strokeWidth={0.2}
          fontFamily={"Black"}
          fontWeight={"bold"}
        >
          {data.value}%
        </Text>
      );
    });
  };

  return (
    <PieChart
      style={{ width: width * 0.45, height: width * 0.45 }}
      data={pieData}
      valueAccessor={({ item }) => item.value}
      // spacing={0}
      outerRadius={"100%"}
      // padAngle={0}
      animate={true}
      animationDuration={5000}
    >
      <Labels />
    </PieChart>
  );
}

Chart.propTypes = {
  pieData: PropTypes.array
};

export default Chart;
