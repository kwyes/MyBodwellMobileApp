/* @flow */

import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  AsyncStorage,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Picker
} from "react-native";
import { withNavigation } from "react-navigation";
import { Block, Text, theme } from "galio-framework";
import { TermHeader, LoadingScreen } from "../components/";
import { RFValue } from "react-native-responsive-fontsize";
import RNPickerSelect from "react-native-picker-select";
import { MaterialIcons } from "@expo/vector-icons";
import { textFormat } from "../components/TextFormat";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("window");
const colorTheme = [
  {
    color1: "#0089aa",
    color2: "#59b2c7",
    color3: "#cce7ee"
  },
  {
    color1: "#b23ab7",
    color2: "#cd7ed0",
    color3: "#f0d7f1"
  },
  {
    color1: "#dd7700",
    color2: "#e9a659",
    color3: "#f8e4cc"
  },
  {
    color1: "#258830",
    color2: "#71b178",
    color3: "#d3e7d5"
  },
  {
    color1: "#0080dd",
    color2: "#59ace9",
    color3: "#cce6f8"
  }
];
var colorId = 0;

class Academic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendance: null,
      overall: [],
      other: [],
      tableHeadCredit: ["COURSE", "%", "LETTER", "LATE", "ABSENT"],
      tableHeadNonCredit: ["COURSE", "LATE", "ABSENT"],
      screenHeight: height,
      term: "",
      termName: "",
      pastTermArr: [],
      studentId: "",
      isPastTerm: false,
      currentTerm: "",
      attendanceArr: []
    };
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  async componentDidMount() {
    var StudentId = await AsyncStorage.getItem("StudentId");
    var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    var SemesterName = await AsyncStorage.getItem("SemesterName");
    var Source = await AsyncStorage.getItem("Source");
    await this.setState({ studentId: StudentId });
    await this.setState({ term: CurrentSemester });
    await this.setState({ termName: SemesterName });
    await this.setState({ currentTerm: CurrentSemester });
    this._getAcademic(StudentId, this.state.term, Source);
    this._getPastTerm(StudentId, this.state.currentTerm, Source);
    this._getAttendance(StudentId, this.state.currentTerm, Source);
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  getGradeLetter = rate => {
    if (rate >= 0.86) {
      return "A";
    } else if (rate >= 0.73 && rate < 0.86) {
      return "B";
    } else if (rate >= 0.67 && rate < 0.73) {
      return "C+";
    } else if (rate >= 0.6 && rate < 0.67) {
      return "C";
    } else if (rate >= 0.5 && rate < 0.6) {
      return "C-";
    } else {
      return "F";
    }
  };

  _getAcademic = (StudentId, semester, Source) => {
    fetch(`https://api-m.bodwell.edu/api/academic/${StudentId}/${semester}/${Source}`)
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          var overallCourse = [];
          var otherCourse = [];
          var creditArr = json["credit"];
          var nonCreditArr = json["noncredit"];
          var gradeArr = json["grade"];
          var attendanceArr = json["attendance"];

          if (creditArr.length > 0) {
            for (let i = 0; i < creditArr.length; i++) {
              var courseid = "";
              var studentCourseid = "";
              var gradePercentage;
              var gradeLetter;
              var creditLate = 0;
              var creditAbs = 0;

              courseid = creditArr[i].courseId;
              studentCourseid = creditArr[i].studentCourseId;
              if (gradeArr[courseid]) {
                gradePercentage = gradeArr[courseid][0].courseRateScaled * 100;
                gradeLetter = this.getGradeLetter(
                  gradeArr[courseid][0].courseRateScaled
                );
                gradePercentage = gradePercentage.toFixed(1) + `%`;
              }

              if (attendanceArr[studentCourseid]) {
                creditLate = attendanceArr[studentCourseid][0].lateCount;
                creditAbs = attendanceArr[studentCourseid][0].absenceCount;
              }

              overallCourse[i] = {
                courseId: creditArr[i].courseId,
                courseName: creditArr[i].courseName,
                studentCourseId: creditArr[i].studentCourseId,
                gradePercentage: gradePercentage,
                gradeLetter: gradeLetter,
                late: creditLate,
                abs: creditAbs,
                creditNum: creditArr[i].credit,
                teacher: creditArr[i].teacherName,
                teacherId: creditArr[i].teacherId
              };
            }
          }

          if (nonCreditArr.length > 0) {
            for (let i = 0; i < nonCreditArr.length; i++) {
              var courseid = "";
              var studentCourseid = "";
              var gradePercentage = 0;
              var gradeLetter = "";
              var nonCreditLate = 0;
              var nonCreditAbs = 0;
              var isAttendance = false;

              courseid = nonCreditArr[i].courseId;
              studentCourseid = nonCreditArr[i].studentCourseId;
              if (nonCreditArr[i].SubHeader != "Assessment") {
                if (attendanceArr[studentCourseid]) {
                  nonCreditLate = attendanceArr[studentCourseid][0].lateCount;
                  nonCreditAbs = attendanceArr[studentCourseid][0].absenceCount;
                  isAttendance = true;
                } else {
                  isAttendance = false;
                }
              } else {
                isAttendance = false;
              }

              otherCourse[i] = {
                courseId: nonCreditArr[i].courseId,
                courseName: nonCreditArr[i].courseName,
                SubHeader: nonCreditArr[i].SubHeader,
                studentCourseId: nonCreditArr[i].studentCourseId,
                late: nonCreditLate,
                abs: nonCreditAbs,
                teacher: nonCreditArr[i].teacherName,
                teacherId: nonCreditArr[i].teacherId,
                isAttendance: isAttendance
              };
            }
          }

          this.setState({
            attendance: json["attendance"],
            overall: overallCourse,
            other: otherCourse
          });
        } else {
          console.log(json.message);
        }
      });
  };

  _getPastTerm = (StudentId, currentSemester, Source) => {
    fetch(
      `https://api-m.bodwell.edu/api/pastTermList/${currentSemester}/${StudentId}/${Source}`
    )
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          var dataArr = json["data"];
          var tmpArr = [];
          for (let i = 0; i < dataArr.length; i++) {
            tmpArr.push({
              label: dataArr[i].SemesterName,
              value: dataArr[i].SemesterID
            });
          }

          this.setState({ pastTermArr: tmpArr });
        } else {
          console.log(json.message);
        }
      });
  };

  _getAttendance = (StudentId, currentSemester, Source) => {
    fetch(
      `https://api-m.bodwell.edu/api/absentList/${currentSemester}/${StudentId}/${Source}`
    )
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          this.setState({ attendanceArr: json["data"] });
        } else {
          console.log(json.message);
        }
      });
  };

  removeShadowOpacity = () =>
    this.setState({ shadowOpacity: 0.1, elevation: 2 });

  setShadowOpacity = () => this.setState({ shadowOpacity: 0.3, elevation: 5 });

  getStyleBoederRadius = (i, category) => {
    if (i % 2 == 1) {
      if (category == "top") {
        return {
          borderTopLeftRadius: 8
        };
      } else if (category == "bottom") {
        return {
          borderBottomLeftRadius: 8
        };
      }
    } else {
      if (category == "top") {
        return {
          borderTopRightRadius: 8
        };
      } else if (category == "bottom") {
        return {
          borderBottomRightRadius: 8
        };
      }
    }
  };

  _createCardCredit = () => {
    const { overall, isPastTerm, attendanceArr } = this.state;
    const { navigation } = this.props;
    let card = [];
    var paramColorId = [];
    var bgColor1 = "";
    var bgColor2 = "";
    var bgColor3 = "";
    var textColor = "";
    var tmpIndex = 0;

    for (let i = 0; i < overall.length; i++) {
      if (tmpIndex >= colorTheme.length - 1) {
        tmpIndex = 0;
        colorId = tmpIndex;
      } else {
        tmpIndex++;
        colorId = tmpIndex;
      }

      paramColorId[i] = colorId;

      if (isPastTerm) {
        bgColor1 = "#7f8c8d";
        bgColor2 = "#bdc3c7";
        bgColor3 = "#ecf0f1";
        textColor = "#7f8c8d";
      } else {
        bgColor1 = colorTheme[colorId].color1;
        bgColor2 = colorTheme[colorId].color2;
        bgColor3 = colorTheme[colorId].color3;
        textColor = "#512da8";
      }

      card.push(
        <Block style={[styles.card, styles.leftRadius]} key={i}>
          <TouchableHighlight
            onPress={() =>
              overall[i]
                ? navigation.navigate("academicDetail", {
                  param: overall[i],
                  colors: colorTheme[paramColorId[i]],
                  attendance: attendanceArr
                })
                : Alert.alert("No record")}
            underlayColor={"#ecf0f1"}
            style={{ borderRadius: 8 }}
            onShowUnderlay={() => this.removeShadowOpacity()}
            onHideUnderlay={() => this.setShadowOpacity()}
            disabled={isPastTerm}
          >
            <Block>
              <Block
                center
                middle
                style={[
                  {
                    backgroundColor: bgColor1
                  },
                  this.getStyleBoederRadius(i, "top"),
                  styles.width100per,
                  styles.minHeight90,
                  styles.paddingHorizontal20
                ]}
              >
                <Text
                  color={"white"}
                  style={[styles.fontFamilyBlack, styles.customFontSize14]}
                >
                  {textFormat(overall[i].courseName)}
                </Text>
                <Text
                  color={"white"}
                  style={[
                    styles.fontFamilyBlackOblique,
                    styles.customFontSize10
                  ]}
                >
                  {translate('academics_text_teacher')}: {overall[i].teacher}
                </Text>
              </Block>
              {i % 2 == 0
                ? <Block row style={{ backgroundColor: bgColor2 }}>
                  <Block
                    style={[styles.width70per, styles.paddingVertical8]}
                    center
                  >
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyBlack, styles.customH5]}
                    >
                      {overall[i].gradePercentage
                        ? overall[i].gradePercentage
                        : "n/a"}
                    </Text>
                  </Block>
                  <Block style={styles.borderLeft} />
                  <Block
                    style={[styles.width30per, styles.paddingVertical8]}
                    center
                  >
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyBlack, styles.customH5]}
                    >
                      {overall[i].gradeLetter
                        ? overall[i].gradeLetter
                        : "n/a"}
                    </Text>
                  </Block>
                </Block>
                : <Block row style={{ backgroundColor: bgColor2 }}>
                  <Block
                    style={[styles.width30per, styles.paddingVertical8]}
                    center
                  >
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyBlack, styles.customH5]}
                    >
                      {overall[i].gradeLetter
                        ? overall[i].gradeLetter
                        : "n/a"}
                    </Text>
                  </Block>
                  <Block style={styles.borderLeft} />
                  <Block
                    style={[styles.width70per, styles.paddingVertical8]}
                    center
                  >
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyBlack, styles.customH5]}
                    >
                      {overall[i].gradePercentage
                        ? overall[i].gradePercentage
                        : "n/a"}
                    </Text>
                  </Block>
                </Block>}
              <Block
                row
                middle
                style={[
                  {
                    backgroundColor: bgColor3
                  },
                  this.getStyleBoederRadius(i, "bottom"),
                  styles.width100per,
                  styles.paddingVertical8
                ]}
              >
                <Text
                  color={textColor}
                  style={[styles.fontFamilyBlack, styles.customFontSize14]}
                >
                  {translate('attendance_text_late')}: {overall[i].late}
                </Text>
                <Text
                  color={textColor}
                  style={[styles.fontFamilyBlack, styles.customFontSize14]}
                >
                  {" "}|{" "}
                </Text>
                <Text
                  color={textColor}
                  style={[styles.fontFamilyBlack, styles.customFontSize14]}
                >
                  {translate('attendance_text_absent')}: {overall[i].abs}
                </Text>
              </Block>
            </Block>
          </TouchableHighlight>
        </Block>
      );
    }

    return card;
  };

  _createCardNoncredit = () => {
    const { other, isPastTerm } = this.state;
    let card = [];
    var bgColor1 = "";
    var bgColor2 = "";
    var bgColor3 = "";
    var textColor = "";
    var tmpIndex = 0;

    for (let i = 0; i < other.length; i++) {
      if (tmpIndex >= colorTheme.length - 1) {
        tmpIndex = 0;
        colorId = tmpIndex;
      } else {
        tmpIndex++;
        colorId = tmpIndex;
      }

      if (isPastTerm) {
        bgColor1 = "#7f8c8d";
        bgColor2 = "#bdc3c7";
        bgColor3 = "#ecf0f1";
        textColor = "#7f8c8d";
      } else {
        bgColor1 = colorTheme[colorId].color1;
        bgColor2 = colorTheme[colorId].color2;
        bgColor3 = colorTheme[colorId].color3;
        textColor = "#512da8";
      }

      card.push(
        <Block style={[styles.card, styles.leftRadius]} key={i}>
          <Block
            center
            middle
            style={[
              {
                backgroundColor: bgColor1
              },
              this.getStyleBoederRadius(i, "top"),
              styles.width100per,
              styles.minHeight90,
              styles.paddingHorizontal20
            ]}
          >
            <Text
              color={"white"}
              style={[styles.fontFamilyBlack, styles.customFontSize14]}
            >
              {textFormat(other[i].courseName)}
            </Text>
            <Text
              color={"white"}
              style={[styles.fontFamilyBlackOblique, styles.customFontSize10]}
            >
              {translate('academics_text_teacher')}: {other[i].teacher}
            </Text>
          </Block>
          <Block
            middle
            style={[{ backgroundColor: bgColor2 }, styles.paddingVertical8]}
          >
            <Text
              color={"white"}
              style={[styles.fontFamilyHeavyOblique, styles.customFontSize10]}
            >
              {other[i].SubHeader}
            </Text>
          </Block>
          {other[i].isAttendance
            ? <Block
              row
              middle
              style={[
                {
                  backgroundColor: bgColor3
                },
                this.getStyleBoederRadius(i, "bottom"),
                styles.width100per,
                styles.paddingVertical8
              ]}
            >
              <Text
                color={textColor}
                style={[styles.fontFamilyBlack, styles.customFontSize14]}
              >
                {translate('attendance_text_late')}: {other[i].late}
              </Text>
              <Text
                color={textColor}
                style={[styles.fontFamilyBlack, styles.customFontSize14]}
              >
                {" "}|{" "}
              </Text>
              <Text
                color={textColor}
                style={[styles.fontFamilyBlack, styles.customFontSize14]}
              >
                {translate('attendance_text_absent')}: {other[i].abs}
              </Text>
            </Block>
            : <Block
              row
              middle
              style={[
                {
                  backgroundColor: bgColor3
                },
                this.getStyleBoederRadius(i, "bottom"),
                styles.width100per,
                styles.paddingVertical8
              ]}
            >
              <Text
                color={textColor}
                style={[styles.fontFamilyHeavy, styles.customFontSize14]}
              >
                n/a
                </Text>
            </Block>}
        </Block>
      );
    }

    return card;
  };

  changeTerm = (val, index) => {
    const { studentId, currentTerm, pastTermArr } = this.state;

    if (val == currentTerm) {
      this.setState({ isPastTerm: false });
    } else {
      this.setState({ isPastTerm: true });
    }
    this.setState({ term: val });
    this.setState({ termName: pastTermArr[index].label });
    this._getAcademic(studentId, val);
  };

  render() {
    const scrollEnabled = this.state.screenHeight > height;
    const { navigation } = this.props;
    const {
      overall,
      other,
      term,
      termName,
      pastTermArr,
      isPastTerm,
      attendanceArr
    } = this.state;
    var textColor = "";
    var textColor2 = "";

    if (isPastTerm) {
      textColor = "#7f8c8d";
      textColor2 = "#bdc3c7";
    } else {
      textColor = "#512da8";
      textColor2 = "#977cc8";
    }

    return (
      <SafeAreaView style={styles.container}>
        {overall[0] || other[0]
          ? <ScrollView
            contentContainerStyle={styles.scrollview}
            scrollEnabled={scrollEnabled}
            onContentSizeChange={this.onContentSizeChange}
            showsVerticalScrollIndicator={false}
          >
            <TermHeader color={textColor} text={termName} />
            <Block
              flex
              center
              middle
              style={[styles.width100per, styles.mgv20]}
            >
              <TouchableHighlight
                onPress={() =>
                  attendanceArr[0]
                    ? navigation.navigate("attendance", {
                      param: attendanceArr
                    })
                    : Alert.alert("No record")}
                style={styles.width90per}
                underlayColor={"#ecf0f1"}
                onShowUnderlay={() => this.removeShadowOpacity()}
                onHideUnderlay={() => this.setShadowOpacity()}
              >
                <Block style={styles.buttonStyle}>
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyBlack, styles.customFontSize14]}
                  >
                    {translate('academics_button_attendance')}
                  </Text>
                </Block>
              </TouchableHighlight>
              {/* <TouchableHighlight
                  style={[styles.buttonStyle, styles.mgv10, styles.width90per]}
                  underlayColor={"#ecf0f1"}
                  onShowUnderlay={() => this.removeShadowOpacity()}
                  onHideUnderlay={() => this.setShadowOpacity()}
                >
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyBlack, styles.customFontSize14]}
                  >
                    Report Cards | Progress Reports
                  </Text>
                </TouchableHighlight>
                <Block
                  row
                  flex
                  space={"around"}
                  style={[styles.width100per, styles.mgv10]}
                >
                  <TouchableHighlight
                    onPress={() =>
                      attendanceArr[0]
                        ? navigation.navigate("attendance", {
                            param: attendanceArr
                          })
                        : Alert.alert("No record")}
                    style={styles.width40per}
                    underlayColor={"#ecf0f1"}
                    onShowUnderlay={() => this.removeShadowOpacity()}
                    onHideUnderlay={() => this.setShadowOpacity()}
                  >
                    <Block style={styles.buttonStyle}>
                      <Text
                        color={"white"}
                        style={[
                          styles.fontFamilyBlack,
                          styles.customFontSize14
                        ]}
                      >
                        Attendance
                      </Text>
                    </Block>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={[styles.buttonStyle, styles.width40per]}
                    underlayColor={"#ecf0f1"}
                    onShowUnderlay={() => this.removeShadowOpacity()}
                    onHideUnderlay={() => this.setShadowOpacity()}
                  >
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyBlack, styles.customFontSize14]}
                    >
                      Transcripts
                    </Text>
                  </TouchableHighlight>
                </Block> */}
            </Block>
            {/* <Block flex center middle style={styles.mgb10}>
              <RNPickerSelect
                onValueChange={(value, index) =>
                  this.changeTerm(value, index)}
                value={term}
                items={pastTermArr}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                    top: 10,
                    right: 12,
                  },
                }}
                Icon={() => {
                  return <MaterialIcons name="arrow-drop-down" size={30} color="black" />;
                }}
                placeholder={{}}
              />
            </Block> */}
            <Block flex center>
              <Text
                style={[
                  styles.fontFamilyBlack,
                  styles.mgv10,
                  styles.customH5
                ]}
                color={textColor2}
              >
                {translate('academics_text_creditcourse')}
              </Text>
            </Block>
            {overall[0]
              ? <Block
                flex
                row
                style={{ flexWrap: "wrap" }}
                space={"between"}
              >
                {this._createCardCredit()}
              </Block>
              : <Block flex row center>
                <Text
                  muted
                  style={[
                    styles.fontFamilyBlack,
                    styles.mgv10,
                    styles.customFontSize16
                  ]}
                >
                  {translate('error_text_nodata')}
                </Text>
              </Block>}
            <Block flex center style={styles.mgt20}>
              <Text
                style={[
                  styles.fontFamilyBlack,
                  styles.mgv10,
                  styles.customH5
                ]}
                color={textColor2}
              >
                {translate('academics_text_noncreditcourses')}
              </Text>
            </Block>
            {other[0]
              ? <Block
                flex
                row
                style={[{ flexWrap: "wrap" }, styles.mgb10]}
                space={"between"}
              >
                {this._createCardNoncredit()}
              </Block>
              : <Block flex row center>
                <Text
                  muted
                  style={[
                    styles.fontFamilyBlack,
                    styles.mgv10,
                    styles.customFontSize16
                  ]}
                >
                  {translate('error_text_nodata')}
                </Text>
              </Block>}

          </ScrollView>
          : <LoadingScreen />}
      </SafeAreaView>
    );
  }
}

export default withNavigation(Academic);

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
  card: {
    flexBasis: "48%",
    marginVertical: 5
  },
  rightRadius: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5
  },
  leftRadius: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  width30per: {
    width: "30%"
  },
  width40per: {
    width: "40%"
  },
  width70per: {
    width: "70%"
  },
  width90per: {
    width: "90%"
  },
  width100per: {
    width: "100%"
  },
  borderLeft: {
    borderLeftColor: "white",
    borderLeftWidth: 2
  },
  borderRight: {
    borderRightColor: "white",
    borderRightWidth: 2
  },
  borderBottom: {
    borderBottomColor: "black",
    borderBottomWidth: 2
  },
  paddingHorizontal20: {
    paddingHorizontal: 20
  },
  paddingVertical8: {
    paddingVertical: 8
  },
  minHeight90: {
    minHeight: 90
  },
  mgb10: {
    marginBottom: 10
  },
  mgt20: {
    marginTop: 20
  },
  mgv20: {
    marginVertical: 20
  },
  mgv10: {
    marginVertical: 10
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  },
  fontFamilyBlackOblique: {
    fontFamily: "BlackOblique"
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  },
  fontFamilyHeavyOblique: {
    fontFamily: "HeavyOblique"
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
  customFontSize10: {
    fontSize: RFValue(10)
  },
  buttonStyle: {
    backgroundColor: "#512da8",
    // paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center"
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    width: width * 0.7
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "#34495e",
    borderTopRightRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
    width: width * 0.7
  }
});
