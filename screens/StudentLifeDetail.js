/* @flow */

import React, { Component } from "react";
import {
  StyleSheet,
  AsyncStorage,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Animated,
  UIManager,
  Platform,
  Image
} from "react-native";
import { TermHeader } from "../components/";
import { Icon } from "native-base";
import moment from "moment";
import { Block, Text } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import { LoadingScreen } from "../components";
import { textFormat } from "../components/TextFormat";
import { numFormat } from "../components/NumFormat";
import { RFValue } from "react-native-responsive-fontsize";

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

export default class StudentLifeDetail extends Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: (
      <Icon
        style={{ paddingLeft: 20 }}
        onPress={() => navigation.goBack()}
        name="md-arrow-back"
        size={30}
        color="#b9b8bc"
      />
    )
  });
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.state = {
      obj: [],
      tableHead: ["DATE", "CATEGORY", "HOURS", "STATUS"],
      screenHeight: height,
      flexDirection: "column",
      title: "",
      title_long: "",
      title_short: "",
      categoryId: null,
      totalHrs: 0,
      vlweHrs: 0,
      semesterName: null
    };
    this.scrollYAnimatedValue = new Animated.Value(0);
    scrollFlg = 0;
    bottomBorderWidth = 3;
    rightBorderWidth = 0;
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  async componentDidMount() {
    var StudentId = await AsyncStorage.getItem("StudentId");
    var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    var StartDate = await AsyncStorage.getItem("StartDate");
    var SemesterName = await AsyncStorage.getItem("SemesterName");
    var Source = await AsyncStorage.getItem("Source");
    const ActivityCategory = this.params.param;
    this.setState({
      categoryId: ActivityCategory,
      semesterName: SemesterName
    });
    this._getStudentLifeDetail(
      StudentId,
      CurrentSemester,
      ActivityCategory,
      StartDate,
      Source
    );
    this.getCategoryName(ActivityCategory);
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  _getStudentLifeDetail = (
    StudentId,
    CurrentSemester,
    ActivityCategory,
    StartDate,
    Source
  ) => {
    fetch(
      `https://api-m.bodwell.edu/api/studentLife/${StudentId}/${CurrentSemester}/${Source}`
    )
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          this.setState({ obj: [] });
          var studentlifeDetail = [];
          var stArr = json["data"];
          var objNum = 0;
          var totalHrsTmp = 0;
          var vlweHrsTmp = 0;

          for (var i = 0; i < stArr.length; i++) {
            if (
              stArr[i].category == ActivityCategory &&
              stArr[i].activityDate >= StartDate
            ) {
              var monIndex = parseInt(stArr[i].activityDate.substring(5, 7));
              var mon = month[monIndex - 1];
              var day = stArr[i].activityDate.substring(8, 10);
              var hour = "";

              studentlifeDetail[objNum] = {
                date_m: mon,
                date_d: day,
                title: stArr[i].Title,
                hours: numFormat(stArr[i].hours, 1),
                ActivityStatus: stArr[i].ActivityStatus,
                category: stArr[i].category
              };
              objNum++;

              if (stArr[i].ActivityStatus == "80") {
                totalHrsTmp += parseFloat(stArr[i].hours);
                if (stArr[i].VLWE == 0) {
                  vlweHrsTmp += parseFloat(stArr[i].hours);
                }
              }
            }
          }

          this.setState({
            obj: studentlifeDetail,
            totalHrs: totalHrsTmp,
            vlweHrs: vlweHrsTmp
          });
        } else {
          console.log(json.message);
        }
      });
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  getStatusIcon(status) {
    switch (status) {
      case "20":
        return <MaterialIcons name="date-range" size={RFValue(24)} />;
      case "60":
        return <MaterialIcons name="hourglass-empty" size={RFValue(24)} />;
      case "80":
        return <MaterialIcons name="done" size={RFValue(24)} />;
      case "90":
        return <MaterialIcons name="block" size={RFValue(24)} />;
      default:
        return null;
    }
  }

  getCategoryIcon = categoryId => {
    var iconName = "";

    switch (categoryId) {
      case "10":
        iconName = "directions-run";
        break;
      case "11":
        iconName = "school";
        break;
      case "12":
        iconName = "public";
        break;
      case "13":
        iconName = "palette";
        break;
      default:
        break;
    }

    return iconName;
  };

  createCard(rowData, index) {
    const colors = this.params.color;
    var card = [];

    if (
      rowData.date_m == tmp_day_m &&
      rowData.date_d == tmp_day_d &&
      rowData.title != tmp_title
    ) {
      card.push(
        <Block
          row
          style={[styles.width100per, { justifyContent: "flex-end" }]}
          key={index}
        >
          <Block style={[styles.card, { backgroundColor: colors.color1 }]} wrap>
            <Block center middle wrap flex={0.5} style={styles.mgb10}>
              <Text
                color={"white"}
                style={[styles.fontFamilyHeavy, styles.customFontSize16]}
              >
                {textFormat(rowData.title)}
              </Text>
            </Block>
            <Block row style={[styles.borderTop]} flex={0.5}>
              <Block
                row
                flex={0.5}
                style={[styles.borderRight, styles.pdt10]}
                center
                middle
              >
                <Text
                  color={"white"}
                  style={[styles.fontFamilyBlack, styles.customH5]}
                >
                  {rowData.hours}{" "}
                  <Text
                    style={[styles.fontFamilyHeavy, styles.customFontSize14]}
                  >
                    hrs
                  </Text>
                </Text>
              </Block>
              <Block
                row
                flex={0.5}
                style={[styles.borderLeft, styles.pdt10]}
                center
                middle
              >
                <Text color={"white"}>
                  {this.getStatusIcon(rowData.ActivityStatus)}
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      );
    } else {
      card.push(
        <Block row flex key={index}>
          <Block style={{ alignItems: "center" }} flex={0.2}>
            <Text
              color={"#a30077"}
              style={[styles.fontFamilyHeavy, styles.customFontSize12]}
            >
              {rowData.date_m}
            </Text>
            <Text
              color={"#a30077"}
              style={[styles.fontFamilyHeavy, styles.customH4]}
            >
              {rowData.date_d}
            </Text>
          </Block>
          <Block
            right
            flex={0.8}
            style={{ paddingTop: 5 }}
          >
            <Block flex
              style={{
                borderTopColor: "#a30077",
                borderTopWidth: 3,
                width: "100%"
              }} />
            <Block
              style={[styles.card, { backgroundColor: colors.color1 }]}
              key={index}
              flex
            >
              <Block flex={0.5} center middle style={styles.mgb10}>
                <Text
                  color={"white"}
                  style={[styles.fontFamilyHeavy, styles.customFontSize16]}
                >
                  {textFormat(rowData.title)}
                </Text>
              </Block>
              <Block row flex={0.5} style={[styles.borderTop]}>
                <Block
                  row
                  flex={0.5}
                  style={[styles.borderRight, styles.pdt10]}
                  center
                  middle
                >
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyBlack, styles.customH5]}
                  >
                    {rowData.hours}{" "}
                    <Text
                      style={[styles.fontFamilyHeavy, styles.customFontSize14]}
                    >
                      hrs
                    </Text>
                  </Text>
                </Block>
                <Block
                  row
                  flex={0.5}
                  style={[styles.borderLeft, styles.pdt10]}
                  center
                  middle
                >
                  <Text color={"white"}>
                    {this.getStatusIcon(rowData.ActivityStatus)}
                  </Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      );
    }

    tmp_day_m = rowData.date_m;
    tmp_day_d = rowData.date_d;
    tmp_title = rowData.title;

    return card;
  }

  getCategoryName(ActivityCategory) {
    if (ActivityCategory == 10) {
      this.setState({ title_long: "Physical, Outdoor & Recreation Education" });
      this.setState({ title_short: "PORE" });
    } else if (ActivityCategory == 11) {
      this.setState({ title_long: "Academic, Interest & Skill Development" });
      this.setState({ title_short: "AISD" });
    } else if (ActivityCategory == 12) {
      this.setState({
        title_long: "Citizenship, Interaction & Leadership Experience"
      });
      this.setState({ title_short: "CILE" });
    } else if (ActivityCategory == 13) {
      this.setState({ title_long: "Arts, Culture & Local Exploration" });
      this.setState({ title_short: "ACLE" });
    }

    this.setState({ title: this.state.title_long });
  }

  render() {
    const scrollEnabled = this.state.screenHeight > height;
    const {
      obj,
      title_short,
      title_long,
      categoryId,
      totalHrs,
      vlweHrs,
      semesterName
    } = this.state;
    const colors = this.params.color;

    return (
      <SafeAreaView style={styles.container}>
        {obj[0]
          ? <ScrollView
            contentContainerStyle={styles.scrollview}
            scrollEnabled={scrollEnabled}
            onContentSizeChange={this.onContentSizeChange}
            showsVerticalScrollIndicator={false}
          >
            <TermHeader color={"#a30077"} text={semesterName} />
            <Block style={styles.content} center>
              <Block center style={styles.mgb20}>
                <Text
                  color={"#a30077"}
                  style={[
                    styles.mgv10,
                    styles.fontFamilyBlack,
                    styles.customH5
                  ]}
                >
                  {title_short} ACTIVITIES
                  </Text>
                <Block
                  flex
                  style={[
                    styles.hrsSumLeftContainer,
                    { backgroundColor: colors.color1 }
                  ]}
                  row
                >
                  <Block flex={0.2} middle center>
                    <MaterialIcons
                      name={this.getCategoryIcon(categoryId)}
                      size={RFValue(52)}
                      color="white"
                    />
                  </Block>
                  <Block flex={0.5} style={{ justifyContent: "center" }}>
                    <Text
                      color={"white"}
                      style={[
                        styles.fontFamilyBlack,
                        styles.customFontSize16
                      ]}
                    >
                      {title_long}
                    </Text>
                  </Block>
                  <Block flex={0.3} middle center>
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyBlack, styles.customH4]}
                    >
                      {numFormat(totalHrs, 1)} hrs.
                      </Text>
                  </Block>
                </Block>
              </Block>
              <Block center>
                {obj.map((rowData, index) =>
                  <Block style={{ width: width }} key={index}>
                    {this.createCard(rowData, index)}
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
  hrsSumLeftContainer: {
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
  mgb10: {
    marginBottom: 10
  },
  mgb20: {
    marginBottom: 20
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
