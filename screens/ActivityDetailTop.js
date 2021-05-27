import React, { Component } from "react";
import {
  StyleSheet,
  AsyncStorage,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  Image
} from "react-native";
import { getDirections } from "../components";
import { Block, Text } from "galio-framework";
import { LoadingScreen } from "../components";
import { MaterialIcons } from "@expo/vector-icons";
import { textFormat } from "../components/TextFormat";
import { RFValue } from "react-native-responsive-fontsize";
import moment from "moment";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("window");


export default class ActivityDetailTop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentlifeObj: [],
      screenHeight: height,
      activeTab: "Top",
      totalCurrentHour: null,
      totalVLWEHour: null
    };
    this.params = this.props.navigation.state.params;
  }

  async componentDidMount() {
    var StudentId = await AsyncStorage.getItem("StudentId");
    var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    var Source = await AsyncStorage.getItem("Source");
    this._getStudentLife(StudentId, CurrentSemester, Source);
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  _getStudentLife = (StudentId, CurrentSemester, Source) => {
    fetch(
      `https://api-m.bodwell.edu/api/studentLifeHours/${StudentId}/${CurrentSemester}/${Source}`
    )
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          var result = json["data"];
          var totalCurrentHour = 0;
          var totalVLWEHour = 0;
          for (let i = 0; i < result.length; i++) {
            totalCurrentHour += parseFloat(result[i].CurrentHours);
            totalVLWEHour += parseFloat(result[i].VLWEHours);
          }
          this.setState({
            studentlifeObj: json["data"],
            totalCurrentHour: totalCurrentHour,
            totalVLWEHour: totalVLWEHour
          });
        } else {
          console.log(json.message);
        }
      });
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };


  removeShadowOpacity = () =>
    this.setState({ shadowOpacity: 0.1, elevation: 2 });

  setShadowOpacity = () => this.setState({ shadowOpacity: 0.3, elevation: 5 });

  formatDateTime = date => {
    var mDate = moment(date);
    var time = date.substring(11, 16);
    var hour = time.substring(0, 2);
    var dateFormat;
    if (hour == "00") {
      dateFormat = mDate.format("Y-MM-DD (ddd)");
    } else {
      dateFormat = mDate.format("Y-MM-DD (ddd) h:mm a");
    }
    return dateFormat;
  };

  handleGetDirections = location => {
    const data = location;
    getDirections(data);
  };

  render() {
    const { studentlifeObj, totalCurrentHour, totalVLWEHour } = this.state;
    const detail = this.params.detail;
    var pHour = 0;
    var vHour = 0;
    var location = "";

    if (detail.location) {
      location = detail.location;
    } else {
      location = "Bodwell High School";
    }

    if (detail.VLWE == "1") {
      pHour = detail.baseHours;
      vHour = detail.baseHours;
    } else {
      pHour = detail.baseHours;
    }

    return (
      <SafeAreaView style={styles.container}>
        {studentlifeObj[0]
          ? <ScrollView
            contentContainerStyle={styles.scrollview}
            onContentSizeChange={this.onContentSizeChange}
            showsVerticalScrollIndicator={false}
          >
            <Block flex center middle>
              <Block flex={0.3} row center>
                <Block flex={0.7} right>
                  <Text
                    color={"#a30077"}
                    style={[
                      styles.mgb5,
                      styles.fontFamilyBlack,
                      styles.customH4
                    ]}
                  >
                    {textFormat(detail.title)}
                  </Text>
                  <Text
                    color={"#a30077"}
                    style={[styles.fontFamilyHeavy, styles.customFontSize14]}
                  >
                    {translate('activitydetail_text_teacher')}: {detail.staffName}
                  </Text>
                </Block>
                <Block flex={0.3} center>
                  <Image
                    source={{
                      uri:
                        "https://asset.bodwell.edu/OB4mpVpg/staff/" +
                        detail.staffId +
                        ".jpg"
                    }}
                    defaultSource={require("../assets/images/userimg.png")}
                    style={{
                      height: width / 5,
                      width: width / 5,
                      borderRadius: width / 10
                    }}
                  />
                </Block>
              </Block>
              <Block flex={0.1} row>
                <Block
                  flex={0.5}
                  row
                  style={[styles.hrsSumLeftContainer, styles.height100per]}
                  center
                  middle
                >
                  <Block flex={0.3}>
                    <MaterialIcons
                      name="accessibility"
                      size={RFValue(52)}
                      color="white"
                    />
                  </Block>
                  <Block flex={0.7} center wrap>
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyBlack, styles.customH4]}
                    >
                      {pHour} {translate('studentlifedetail_text_hrs')}
                    </Text>
                    <Text
                      color={"white"}
                      style={[
                        styles.fontFamilyRoman,
                        styles.customFontSize12
                      ]}
                    >
                      {translate('activitydetail_text_eph')}
                    </Text>
                  </Block>
                </Block>
                <Block
                  flex={0.5}
                  style={[styles.hrsSumRightContainer, styles.height100per]}
                  center
                  middle
                >
                  <Text
                    color={"#a30077"}
                    style={[styles.fontFamilyBlack, styles.customH4]}
                  >
                    {vHour} {translate('studentlifedetail_text_hrs')}
                  </Text>
                  <Text
                    color={"#a30077"}
                    style={[styles.fontFamilyRoman, styles.customFontSize12]}
                  >
                    {translate('activitydetail_text_vwe')}
                  </Text>
                </Block>
              </Block>
              <Block
                flex={0.6}
                style={[{ backgroundColor: "#f4e0ee", width: width }]}
              >
                <Block flex={0.3}>
                  <Block style={[styles.pdl10, styles.pdt20]}>
                    <Text
                      color={"#d07bb9"}
                      style={[
                        styles.fontFamilyRoman,
                        styles.customFontSize16
                      ]}
                    >
                      {translate('activitydetail_text_location')}
                    </Text>
                  </Block>
                  <TouchableHighlight
                    onPress={() => this.handleGetDirections(location)}
                    underlayColor={"#ecf0f1"}
                    style={styles.locationContainer}
                    onShowUnderlay={() => this.removeShadowOpacity()}
                    onHideUnderlay={() => this.setShadowOpacity()}
                  >
                    <Block
                      row
                      style={[styles.pdh10, styles.jcend, styles.aicenter]}
                    >
                      <Block flex right wrap>
                        <Text
                          color={"#a30077"}
                          style={[styles.fontFamilyHeavy, styles.customH5]}
                        >
                          {location}
                        </Text>
                      </Block>
                      <Image
                        source={require("../assets/images/map.png")}
                        style={{ height: 60, width: 60 }}
                      />
                    </Block>
                  </TouchableHighlight>
                </Block>
                <Block flex={0.2} style={styles.pdl10}>
                  <Block>
                    <Text
                      color={"#d07bb9"}
                      style={[
                        styles.fontFamilyRoman,
                        styles.customFontSize16
                      ]}
                    >
                      {translate('activitydetail_text_from')}
                    </Text>
                  </Block>
                  <Block style={styles.pdh10}>
                    <Text
                      color={"#a30077"}
                      style={[styles.fontFamilyRoman, styles.customH5]}
                    >
                      {this.formatDateTime(detail.startDate)}
                    </Text>
                  </Block>
                </Block>
                <Block flex={0.2} style={[styles.pdl10, styles.mgb10]}>
                  <Block>
                    <Text
                      color={"#d07bb9"}
                      style={[
                        styles.fontFamilyRoman,
                        styles.customFontSize16
                      ]}
                    >
                      {translate('activitydetail_text_to')}
                    </Text>
                  </Block>
                  <Block style={styles.pdh10}>
                    <Text
                      color={"#a30077"}
                      style={[styles.fontFamilyRoman, styles.customH5]}
                    >
                      {this.formatDateTime(detail.endDate)}
                    </Text>
                  </Block>
                </Block>
                <Block row flex={0.3} style={styles.pdl10} />
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
  content: {
    flexGrow: 1
  },
  height100per: {
    height: "100%"
  },
  hrsSumLeftContainer: {
    backgroundColor: "#a30077",
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  hrsSumRightContainer: {
    backgroundColor: "#ffbfee",
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  mgb10: {
    marginBottom: 10
  },
  mgb5: {
    marginBottom: 5
  },
  pdl10: {
    paddingLeft: 10
  },
  pdt20: {
    paddingTop: 20
  },
  pdh10: {
    paddingHorizontal: 10
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
  locationContainer: {
    flex: 1,
    justifyContent: "center"
  },
  jcend: {
    justifyContent: "flex-end"
  },
  aicenter: {
    alignItems: "center"
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
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
