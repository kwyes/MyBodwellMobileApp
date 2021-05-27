import React, { Component } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Image,
  AsyncStorage
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialIcons } from "@expo/vector-icons";
import { LoadingScreen } from "../components";
import { textFormat } from "../components/TextFormat";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("window");
const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

var tmp_day_m = "";
var tmp_day_d = "";
var tmp_title = "";

export default class Attendance extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params.param;
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  createCard(rowData, index) {
    var card = [];
    var monIndex = parseInt(rowData.ADate.substring(5, 7));
    var mon = month[monIndex - 1];
    var day = rowData.ADate.substring(8, 10);
    var text = "";

    if (rowData.AbsencePeriod == "1") {
      text = translate('attendance_text_absent');
    } else if (rowData.LatePeriod == "1") {
      text = translate('attendance_text_late');
    }

    if (
      mon == tmp_day_m &&
      day == tmp_day_d &&
      rowData.SubjectName != tmp_title
    ) {
      card.push(
        <Block
          row
          style={[styles.width100per, { justifyContent: "flex-end" }]}
          key={index}
        >
          <Block style={[styles.card, { backgroundColor: "#512da8" }]} wrap>
            <Block wrap flex style={{ justifyContent: "center" }}>
              <Text
                color={"white"}
                style={[styles.fontFamilyBlack, styles.customFontSize16]}
              >
                {text}
                {rowData.ExcuseChkData != ""
                  ? " | " + translate('attendance_text_' + rowData.ExcuseChkData)
                  : ""}
                {rowData.ExcuseTxtData != ""
                  ? " | " + translate('attendance_text_' + rowData.ExcuseTxtData)
                  : ""}
              </Text>
              <Text
                color={"white"}
                style={[styles.fontFamilyHeavy, styles.customFontSize16]}
              >
                {textFormat(rowData.SubjectName)}
              </Text>
            </Block>
          </Block>
        </Block>
      );
    } else {
      card.push(
        <Block row flex key={index}>
          <Block style={{ alignItems: "center" }} flex={0.2}>
            <Text
              color={"#512da8"}
              style={[styles.fontFamilyHeavy, styles.customFontSize12]}
            >
              {mon}
            </Text>
            <Text
              color={"#512da8"}
              style={[styles.fontFamilyHeavy, styles.customH4]}
            >
              {day}
            </Text>
          </Block>
          <Block right flex={0.8} style={{ paddingTop: 5 }}>
            <Block flex
              style={{
                borderTopColor: "#512da8",
                borderTopWidth: 3,
                width: "100%"
              }} />
            <Block
              style={[styles.card, { backgroundColor: "#512da8" }]}
              key={index}
              flex
            >
              <Block flex style={{ justifyContent: "center" }}>
                <Text
                  color={"white"}
                  style={[styles.fontFamilyBlack, styles.customFontSize16]}
                >
                  {text}
                  {rowData.ExcuseChkData != ""
                    ? " | " + translate('attendance_text_' + rowData.ExcuseChkData)
                    : ""}
                  {rowData.ExcuseTxtData != ""
                    ? " | " + translate('attendance_text_' + rowData.ExcuseTxtData)
                    : ""}
                </Text>
                <Text
                  color={"white"}
                  style={[styles.fontFamilyHeavy, styles.customFontSize16]}
                >
                  {textFormat(rowData.SubjectName)}
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      );
    }

    tmp_day_m = mon;
    tmp_day_d = day;
    tmp_title = rowData.SubjectName;

    return card;
  }

  render() {
    const data = this.params;
    return (
      <SafeAreaView style={styles.container}>
        {data[0]
          ? <ScrollView
            contentContainerStyle={styles.scrollview}
            scrollEnabled={true}
            onContentSizeChange={this.onContentSizeChange}
            showsVerticalScrollIndicator={false}
          >
            <Block style={styles.content} center>
              <Block center>
                <Block>
                  <Text
                    color={"#512da8"}
                    style={[
                      styles.mgv10,
                      styles.fontFamilyBlack,
                      styles.customH5
                    ]}
                  >
                    {translate('attendance_text_attendancereport')}
                  </Text>
                </Block>
                {data.map((rowData, index) =>
                  <Block style={{ width: width }} key={index}>
                    {this.createCard(rowData[0], index)}
                  </Block>
                )}
              </Block>
            </Block>
          </ScrollView>
          : <LoadingScreen />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  scrollview: {
    flexGrow: 1,
    width: width
  },
  title: {
    textAlign: "center",
    color: "white"
  },
  content: {
    flexGrow: 1
  },
  card: {
    borderRadius: 3,
    width: width / 4 * 3,
    marginVertical: 10,
    marginRight: width / 30,
    elevation: 5,
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0.5, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.3
  },
  width100per: {
    width: "100%"
  },
  width50per: {
    width: "50%"
  },
  hrsSumLeftContainer: {
    backgroundColor: "#a30077",
    paddingVertical: 15,
    maxHeight: height / 8,
    minHeight: height / 8
  },
  hrsSumRightContainer: {
    backgroundColor: "#ffbfee",
    paddingVertical: 15,
    maxHeight: height / 8,
    minHeight: height / 8
  },
  borderTop: {
    borderTopColor: "white",
    borderTopWidth: 1
  },
  borderLeft: {
    borderLeftColor: "white",
    borderLeftWidth: 0.5
  },
  borderRight: {
    borderRightColor: "white",
    borderRightWidth: 0.5
  },
  mgl10: {
    marginLeft: 10
  },
  mgb10: {
    marginBottom: 10
  },
  mgv10: {
    marginVertical: 10
  },
  pdt10: {
    paddingTop: 10
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  },
  fontFamilyHeavyOblique: {
    fontFamily: "HeavyOblique"
  },
  fontFamilyRoman: {
    fontFamily: "Roman"
  },
  customH4: {
    fontSize: RFValue(24)
  },
  customH5: {
    fontSize: RFValue(20)
  },
  customFontSize16: {
    fontSize: RFValue(16)
  },
  customFontSize14: {
    fontSize: RFValue(14)
  },
  customFontSize12: {
    fontSize: RFValue(12)
  }
});
