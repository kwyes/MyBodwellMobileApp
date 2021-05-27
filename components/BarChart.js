import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";
import PureChart from "react-native-pure-chart";

const { width, height } = Dimensions.get("screen");

class BarCustomChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pore: 0,
      aisd: 0,
      cile: 0,
      acle: 0
    };
  }

  componentDidMount() {
    const { param, param2 } = this.props;
    let activityHours = '';
    for (let i = 0; i < param.length; i++) {
      if (param2 == 'total') {
        activityHours = param[i].AccumHours;
      } else {
        activityHours = param[i].CurrentHours;
      }
      switch (param[i].ActivityCategory) {
        case "10":
          this.setState({ pore: activityHours });
          break;
        case "11":
          this.setState({ aisd: activityHours });
          break;
        case "12":
          this.setState({ cile: activityHours });
          break;
        case "13":
          this.setState({ acle: activityHours });
          break;
        default:
          break;
      }
    }
  }

  render() {
    const { pore, aisd, cile, acle } = this.state;
    var hoursData = [
      {
        seriesName: "series1",
        data: [
          { x: "PORE", y: parseFloat(pore) },
          { x: "AISD", y: parseFloat(aisd) },
          { x: "CILE", y: parseFloat(cile) },
          { x: "ACLE", y: parseFloat(acle) }
        ],
        color: "#a30077"
      }
    ];

    return (
      <PureChart
        data={hoursData}
        width={width / 2}
        height={height / 2}
        defaultColumnWidth={width / 10}
        defaultColumnMargin={width / 10}
        type="bar"
        numberOfYAxisGuideLine={10}
        showEvenNumberXaxisLabel={false}
      />
    );
  }
}

export default BarCustomChart;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
