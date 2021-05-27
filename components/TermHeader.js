import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  AsyncStorage,
  Picker,
  PickerItem
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo";
import RNPickerSelect from "react-native-picker-select";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("window");

export default class TermHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SemesterName1: null,
      SemesterName2: null,
      progressValue: 0,
      StartDate: null,
      EndDate: null,
      term: null
    };
  }

  async componentDidMount() {
    var SemesterName = await AsyncStorage.getItem("SemesterName");
    var StartDate = await AsyncStorage.getItem("StartDate");
    var EndDate = await AsyncStorage.getItem("EndDate");
    var progressValue = await AsyncStorage.getItem("progressValue");
    this.setState({
      SemesterName: SemesterName,
      progressValue: parseFloat(progressValue),
      StartDate: StartDate,
      EndDate: EndDate
    });
  }

  roundProgress(val) {
    return Math.round(val * 100);
  }

  render() {
    const { SemesterName } = this.state;
    const { color, text } = this.props;

    return (
      <Block style={styles.card} center middle row>
        <Text size={RFValue(24)} color={color} style={{ fontFamily: "Black" }}>
          {text}
        </Text>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    height: 60,
    width: width
  }
});
