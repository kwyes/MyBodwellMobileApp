/* @flow */
import React, { Component } from "react";
import {
  Alert,
  View,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  Image
} from "react-native";
import {
  Icon,
  Thumbnail,
  ScrollableTab,
  Tab,
  Tabs,
  TabHeading
} from "native-base";
import moment from "moment";
import { Chart, PieChart, LoadingScreen } from "../components/";
import { Block, Text, theme } from "galio-framework";
import Modal from "react-native-simple-modal";
import { MaterialIcons } from "@expo/vector-icons";
import { withNavigation } from "react-navigation";
import { numFormat } from "../components/NumFormat";
import { RFValue } from "react-native-responsive-fontsize";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const screenHeight = Dimensions.get("screen");
const { width, height } = Dimensions.get("window");
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
const cardColors = [
  {
    color1: "#e85f63",
    color2: "#EA2027"
  }, // red1
  {
    color1: "#ea7e90",
    color2: "#ED4C67"
  }, // red2
  {
    color1: "#ed8a65",
    color2: "#EE5A24"
  }, // orange1
  {
    color1: "#f2b868",
    color2: "#F79F1F"
  }, // orange2
  {
    color1: "#2aba5a",
    color2: "#009432"
  }, // green1
  {
    color1: "#2bcbba",
    color2: "#01b7ae"
  }, // green2
  {
    color1: "#45aaf2",
    color2: "#118dd6"
  }, // blue1
  {
    color1: "#417adb",
    color2: "#0652DD"
  }, // blue2
  {
    color1: "#a55eea",
    color2: "#8854d0"
  }, // purple1
  {
    color1: "#9b527f",
    color2: "#6F1E51"
  } // purple2
];

const pieColors = [
  "#EA2027", // red1
  "#ED4C67", // red2
  "#EE5A24", // orange1
  "#F79F1F", // orange2
  "#009432", // green1
  "#01b7ae", // green2
  "#118dd6", // blue1
  "#0652DD", // blue2
  "#8854d0", // purple1
  "#6F1E51" // purple2
];

class AcademicDetail extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    this.state = {
      gradeDetail: [],
      weight: [],
      filterObj: [],
      calculateObj: [],
      tableHeadScores: ["DATE", "CATEGORY", "ITEM", "SCORE"],
      tableHeadWeight: ["COURSE", "LATE", "ABSENT"],
      screenHeight: screenHeight,
      modalVisible1: false,
      shadowOpacity: 0.3,
      elevation: 5,
      pieData: [],
      attendanceArr: [],
      isAttendanceData: false
    };
    pieColorIndex = 0;
    pieColorIndexUsed = [];
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };
  async componentDidMount() {
    const StudentId = await AsyncStorage.getItem("StudentId");
    const CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    const SemesterName = await AsyncStorage.getItem("SemesterName");
    const termText = await AsyncStorage.getItem("termText");
    const Source = await AsyncStorage.getItem("Source");
    const courseId = this.params.param.courseId;
    const attendanceData = this.params.attendance;
    this.setState({
      SemesterName: SemesterName,
      roomNo: this.params.param.roomNo,
      courseName: this.params.param.courseName,
      teacher: this.params.param.teacher,
      teacherId: this.params.param.teacherId,
      gradePercentage: this.params.param.gradePercentage,
      gradeLetter: this.params.param.gradeLetter,
      termText: termText,
      colors: this.params.colors,
      isFilterScore: true
    });
    this._getAcademicDetail(StudentId, CurrentSemester, courseId, Source);
    this.getCourseAttendance(attendanceData, courseId);
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  _getAcademicDetail = (StudentId, CurrentSemester, courseId, Source) => {
    const { navigation } = this.props;
    fetch(
      `https://api-m.bodwell.edu/api/academicDetail/${StudentId}/${CurrentSemester}/${courseId}/${Source}`
    )
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          this.setState({
            gradeDetail: json["gradeDetail"],
            weight: json["weight"]
          });
          this.getPieColor();
        } else {
          console.log(json.message);
          navigation.navigate("academics");
        }
      });
  };

  getCourseAttendance = (aData, courseId) => {
    var tmpArr = [];
    for (let i = 0; i < aData.length; i++) {
      if (aData[i][0].SubjectID == courseId) {
        tmpArr.push(aData[i]);
      }
    }

    this.setState({ attendanceArr: tmpArr });

    if (tmpArr.length > 0) {
      this.setState({ isAttendanceData: true });
    }
  };

  gradeFilter = (obj, i) => {
    const { gradeDetail } = this.state;
    if (i > 0 && i <= obj.length) {
      var filterHeader = obj[i - 1].CategoryID;
      var filterCourses = [];
      var index = 0;
      for (var s = 0; s < gradeDetail.length; s++) {
        var title = gradeDetail[s].categoryId;
        if (title == filterHeader) {
          filterCourses[index] = {
            categoryId: gradeDetail[s].categoryId,
            itemWeight: gradeDetail[s].itemWeight,
            assignDate: gradeDetail[s].assignDate,
            categoryTitle: gradeDetail[s].categoryTitle,
            itemTitle: gradeDetail[s].itemTitle,
            categoryWeight: gradeDetail[s].categoryWeight,
            categoryWeightLabel: gradeDetail[s].categoryWeightLabel,
            scorePoint: gradeDetail[s].scorePoint,
            scoreRate: gradeDetail[s].scoreRate,
            maxScore: gradeDetail[s].maxScore,
            row_number: gradeDetail[s].row_number
          };
          index++;
        }
      }
      if (filterCourses) {
        this.calculateECWP(filterCourses);
      }
      this.setState({
        filterObj: filterCourses
      });
    }
  };

  calculateECWP = filterCourses => {
    var filterScore = [];
    var categoryId;
    var categoryWeight;
    var categoryWeightLabel;
    var overallScore = 0;
    var itemSum = 0;
    for (var i = 0; i < filterCourses.length; i++) {
      categoryId = filterCourses[i].categoryId;
      categoryWeight = parseFloat(filterCourses[i].categoryWeight);
      categoryWeightLabel = filterCourses[i].categoryWeightLabel;
      itemSum += parseFloat(filterCourses[i].itemWeight);
      overallScore += filterCourses[i].itemWeight * filterCourses[i].scoreRate;
    }

    if (filterCourses.length > 0) {
      var overall = overallScore * (1 / itemSum) * categoryWeight * 100;
      var rounded_overall = Math.round(overall * 100);
      var percentage =
        (rounded_overall / 100).toFixed(2) /
        parseFloat(categoryWeightLabel.replace("%", ""));
      var rounded_percentage = Math.round(percentage * 10000);

      filterScore[0] = {
        overall: overall.toFixed(2).toString() + "%",
        categoryWeight: categoryWeightLabel,
        percentage: (rounded_percentage / 100).toFixed(2)
      };

      this.setState({
        calculateObj: filterScore,
        isFilterScore: true
      });
    } else {
      this.setState({
        calculateObj: null,
        isFilterScore: false
      });
    }
  };

  convertDate = nDate => {
    var mDate = moment(nDate).format("M/DD");
    return mDate;
  };
  transToPercentage(rate) {
    var floatNum = parseFloat(rate).toFixed(3);
    var per = (floatNum * 100).toFixed(1);
    return per;
  }
  fixScore(score) {
    return parseFloat(score).toFixed(1);
  }

  chooseCardColor(cardColorsIndex) {
    var color = cardColors[cardColorsIndex];
    return color;
  }

  createCard(rowData, index) {
    const { shadowOpacity, elevation } = this.state;

    let title = "";
    title = rowData.itemTitle;

    var card = [];
    card.push(
      <Block key={index} right>
        <Block row space={"between"}>
          <Block flex={0.2}>
            <Text
              color={"#512da8"}
              style={[styles.fontFamilyHeavy, styles.customFontSize14]}
            >
              {rowData.assignDate.substring(5, 7)}/{rowData.assignDate.substring(8, 10)}
            </Text>
          </Block>
          <Block flex={0.8} center style={{
            borderTopColor: "#512da8",
            borderTopWidth: 3
          }} />
        </Block>
        <Block
          style={[
            styles.itemContainer,
            { backgroundColor: cardColors[rowData.row_number].color2 }
          ]}
          key={index}
        >
          <Block flex={1} row space={"between"} middle>
            <Block style={{ width: "70%" }}>
              <Text
                color="white"
                style={[styles.fontFamilyHeavy, styles.customFontSize14]}
              >
                {title}
              </Text>
            </Block>
            <Block
              style={{
                height: "100%",
                width: "30%",
                borderLeftWidth: 2,
                borderLeftColor: "white",
                backgroundColor: cardColors[rowData.row_number].color1
              }}
            >
              <Block
                style={{
                  height: "50%",
                  width: "100%",
                  borderBottomWidth: 1,
                  borderBottomColor: "white"
                }}
                center
                middle
              >
                <Text
                  color="white"
                  style={[styles.fontFamilyBlack, styles.customFontSize16]}
                >
                  {this.fixScore(rowData.scorePoint)} /{" "}
                  {this.fixScore(rowData.maxScore)}
                </Text>
              </Block>
              <Block
                style={{
                  height: "50%",
                  width: "100%",
                  borderTopWidth: 1,
                  borderTopColor: "white"
                }}
                center
                middle
              >
                <Text
                  color="white"
                  style={[styles.fontFamilyBlack, styles.customFontSize16]}
                >
                  {this.transToPercentage(rowData.scoreRate)}%
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    );
    return card;
  }

  createAttendanceCard(rowData, index) {
    var card = [];
    var text = "";

    if (rowData.AbsencePeriod == "1") {
      text = translate('attendance_text_absent');
    } else if (rowData.LatePeriod == "1") {
      text = translate('attendance_text_late');;
    }

    var monIndex = parseInt(rowData.ADate.substring(5, 7));
    var mon = month[monIndex - 1];
    var day = rowData.ADate.substring(8, 10);

    card.push(
      <Block row key={index}>
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
        <Block flex={0.8} right style={{ paddingTop: 10 }}>
          <Block flex middle
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
              </Text>
              {rowData.ExcuseTxtData != ""
                ? <Text
                  color={"white"}
                  style={[styles.fontFamilyBlack, styles.customFontSize16]}
                >
                  {translate('attendance_text_' + rowData.ExcuseTxtData)}
                </Text>
                : <Block />}
            </Block>
          </Block>
        </Block>
      </Block>
    );
    return card;
  }

  removeShadowOpacity = () =>
    this.setState({
      shadowOpacity: 0.1,
      elevation: 1
    });

  setShadowOpacity = () => this.setState({ shadowOpacity: 0.3, elevation: 5 });

  closeModal1 = () => this.setState({ modalVisible1: false });

  openModal1 = () => this.setState({ modalVisible1: true });

  formatWeight(weight) {
    if (weight == ".00") {
      return 0;
    } else {
      return parseInt(weight);
    }
  }

  getPieColor() {
    const { gradeDetail, weight } = this.state;
    var pieData = [];
    var pieColorIndex = 0;
    var pieColorIndexUsed = [];

    for (let i = 0; i < weight.length; i++) {
      var pieColor = "";

      for (let j = 0; j < gradeDetail.length; j++) {
        if (weight[i].CategoryID == gradeDetail[j].categoryId) {
          categoryIndex = gradeDetail[j].row_number;
          pieColor = pieColors[categoryIndex];
          pieColorIndex = parseInt(categoryIndex);
          pieColorIndexUsed.push(pieColorIndex);
        }
      }

      pieData.push({
        value: this.formatWeight(weight[i].weight),
        svg: {
          fill: pieColor,
          onPress: () => Alert.alert(weight[i].Text)
        },
        key: weight[i].Text
      });
    }

    for (let i = 0; i < pieData.length; i++) {
      if (pieData[i].svg.fill == "") {
        for (let j = 0; j < 10; j++) {
          if (pieColorIndexUsed.indexOf(j) == -1) {
            pieData[i].svg.fill = pieColors[j];
            pieColorIndexUsed.push(j);
            break;
          }
        }
      }
    }

    this.setState({ pieData: pieData });
  }

  render() {
    const {
      gradeDetail,
      weight,
      tableHeadScores,
      SemesterName,
      roomNo,
      courseName,
      teacher,
      teacherId,
      gradePercentage,
      gradeLetter,
      filterObj,
      modalVisible1,
      pieColor,
      shadowOpacity,
      elevation,
      termText,
      calculateObj,
      colors,
      pieData,
      isFilterScore,
      attendanceArr,
      isAttendanceData
    } = this.state;
    const scrollEnabled = this.state.screenHeight > height;

    return (
      <View style={styles.container}>
        {gradeDetail[0]
          ? <Block flex>
            <Block style={styles.firstContainer}>
              <Block style={[styles.width100per, styles.paddingHorizontal10]}>
                <Block right>
                  <Text
                    color="#512da8"
                    style={[styles.fontFamilyBlack, styles.customFontSize14]}
                  >
                    {SemesterName} - {translate("term_text_" + termText)}
                  </Text>
                </Block>
                <Block right>
                  <Text
                    color="#512da8"
                    style={[styles.fontFamilyBlack, styles.customFontSize16]}
                  >
                    {courseName}
                  </Text>
                </Block>
              </Block>

              <Block style={styles.width100per} right>
                <Block
                  row
                  right
                  style={[
                    styles.gradeInfCard,
                    styles.marginTop10,
                    styles.marginBottom10,
                    styles.width90per
                  ]}
                >
                  <Block
                    center
                    middle
                    style={[styles.width10per, styles.shadow]}
                  >
                    <Thumbnail
                      source={{
                        uri:
                          "https://asset.bodwell.edu/OB4mpVpg/staff/" +
                          teacherId +
                          ".jpg"
                      }}
                      style={styles.thumbnail}
                    />
                  </Block>
                  <Block
                    center
                    style={[
                      styles.width60per,
                      styles.height100per,
                      { backgroundColor: colors["color1"] }
                    ]}
                  >
                    <Text
                      color="white"
                      style={[styles.fontFamilyBlack, styles.customH4]}
                    >
                      {gradePercentage}
                    </Text>
                    <Text
                      color="white"
                      style={[
                        styles.fontFamilyRoman,
                        styles.customFontSize14
                      ]}
                    >
                      {translate('academicdetail_text_overallaverage')}
                    </Text>
                  </Block>
                  <Block
                    center
                    style={[
                      styles.width30per,
                      styles.height100per,
                      { backgroundColor: colors["color2"] }
                    ]}
                  >
                    <Text
                      color="white"
                      style={[styles.fontFamilyBlack, styles.customH4]}
                    >
                      {gradeLetter}
                    </Text>
                    <Text
                      color="white"
                      style={[
                        styles.fontFamilyRoman,
                        styles.customFontSize14
                      ]}
                    >
                      {translate('academicdetail_text_grade')}
                    </Text>
                  </Block>
                </Block>
                <Text
                  color="#512da8"
                  style={[
                    styles.paddingHorizontal10,
                    styles.fontFamilyHeavy,
                    styles.customFontSize14
                  ]}
                >
                  {translate('academicdetail_text_teacher')} : {teacher}
                </Text>
              </Block>
            </Block>
            <Block style={styles.secondContainer}>
              <Tabs
                renderTabBar={() =>
                  <ScrollableTab style={{ borderWidth: 0 }} />}
                onChangeTab={({ i }) => this.gradeFilter(weight, i)}
                tabBarUnderlineStyle={{
                  backgroundColor: colors["color2"]
                }}
              >
                <Tab
                  heading={
                    <TabHeading style={{ backgroundColor: "white" }}>
                      <Text
                        style={[
                          styles.fontFamilyHeavy,
                          styles.customFontSize14,
                          { color: "grey" }
                        ]}
                      >
                        {translate('academicdetail_text_categoryweight')}
                      </Text>
                    </TabHeading>
                  }
                >
                  <ScrollView
                    contentContainerStyle={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                  >
                    <Block row flex center style={{ width: width }}>
                      <Block flex={0.6} center>
                        <Chart pieData={pieData} />
                      </Block>
                      <Block style={{ paddingRight: 10 }} flex={0.4}>
                        {pieData.map((rowData, index) =>
                          <Block
                            row
                            key={index}
                            style={{ marginVertical: 3 }}
                          >
                            <Block>
                              <Text>
                                <Icon
                                  ios="ios-pie"
                                  android="md-pie"
                                  style={{
                                    fontSize: RFValue(14),
                                    color: pieData[index].svg.fill
                                  }}
                                />
                                <Text> </Text>
                              </Text>
                            </Block>
                            <Block>
                              <Text
                                style={[
                                  styles.fontFamilyMedium,
                                  styles.customFontSize14,
                                  { color: pieData[index].svg.fill }
                                ]}
                              >
                                {pieData[index].key}
                              </Text>
                            </Block>
                          </Block>
                        )}
                      </Block>
                    </Block>
                  </ScrollView>
                </Tab>
                {weight.map((rowData, index) =>
                  <Tab
                    heading={
                      <TabHeading
                        style={{ backgroundColor: "white" }}
                        key={index}
                      >
                        <Text
                          style={[
                            styles.fontFamilyHeavy,
                            styles.customFontSize14,
                            { color: "grey" }
                          ]}
                        >
                          {rowData.Text}
                        </Text>
                      </TabHeading>
                    }
                    key={index}
                  >
                    <Block
                      flex={1}
                      style={{ width: width }}
                      space={"between"}
                    >
                      {(calculateObj || []).map((rowData, index) =>
                        <Block
                          style={styles.ecwpCard}
                          flex={0.65}
                          middle
                          key={index}
                        >
                          <Block row style={styles.marginBottom20} flex={0.4}>
                            <Block flex={0.5} center>
                              <Text
                                style={[
                                  styles.marginBottom5,
                                  styles.fontFamilyMedium,
                                  styles.customFontSize14
                                ]}
                              >
                                {translate('academicdetail_text_categoryweight')}
                              </Text>
                              <Text
                                style={[
                                  styles.fontFamilyBlack,
                                  styles.customH4
                                ]}
                              >
                                {calculateObj[index].categoryWeight
                                  ? numFormat(
                                    calculateObj[index].categoryWeight,
                                    1
                                  ) + "%"
                                  : calculateObj[index].categoryWeight}
                              </Text>
                            </Block>
                            <Block flex={0.5} center>
                              <Text
                                style={[
                                  styles.marginBottom5,
                                  styles.fontFamilyMedium,
                                  styles.customFontSize14
                                ]}
                              >
                                {translate('academicdetail_text_earnedpoint')}
                              </Text>
                              <Text
                                color="#d63031"
                                style={[
                                  styles.fontFamilyBlack,
                                  styles.customH4
                                ]}
                              >
                                {calculateObj[index].overall
                                  ? numFormat(
                                    calculateObj[index].overall,
                                    1
                                  ) + "%"
                                  : calculateObj[index].overall}
                              </Text>
                            </Block>
                          </Block>
                          <Block center flex={0.6}>
                            <Text
                              style={[
                                styles.marginBottom5,
                                styles.fontFamilyMedium,
                                styles.customFontSize14
                              ]}
                            >
                              {translate('academicdetail_text_earnedpercentage')}
                            </Text>
                            <PieChart
                              value={calculateObj[index].percentage}
                            />
                          </Block>
                        </Block>
                      )}
                      {isFilterScore
                        ? <Block flex={0.35}>
                          <Block flex middle center>
                            <TouchableHighlight
                              onPress={this.openModal1}
                              underlayColor="transparent"
                              onShowUnderlay={() =>
                                this.removeShadowOpacity()}
                              onHideUnderlay={() => this.setShadowOpacity()}
                            >
                              <Block style={styles.categoryItemBtn} row>
                                <Block style={{ marginRight: 5 }} center>
                                  <Text
                                    color="white"
                                    style={[
                                      styles.fontFamilyBlack,
                                      styles.customFontSize14
                                    ]}
                                  >
                                    {translate('academicdetail_text_vci')}
                                  </Text>
                                </Block>
                                <MaterialIcons
                                  name="chevron-right"
                                  size={RFValue(16)}
                                  color="white"
                                />
                              </Block>
                            </TouchableHighlight>
                          </Block>
                        </Block>
                        : <Block flex center middle>
                          <Text
                            color={colors["color2"]}
                            style={[
                              styles.customH4,
                              styles.fontFamilyBlack
                            ]}
                          >
                            {translate('error_text_nodata')}
                          </Text>
                        </Block>}
                    </Block>
                  </Tab>
                )}
                <Tab
                  heading={
                    <TabHeading style={{ backgroundColor: "white" }}>
                      <Text
                        style={[
                          styles.fontFamilyHeavy,
                          styles.customFontSize14,
                          { color: "grey" }
                        ]}
                      >
                        {translate('academicdetail_text_attendancereport')}
                      </Text>
                    </TabHeading>
                  }
                >
                  <ScrollView
                    contentContainerStyle={styles.scrollView2}
                    showsVerticalScrollIndicator={false}
                  >
                    {isAttendanceData
                      ? <Block style={styles.width100per}>
                        {attendanceArr.map((rowData, index) =>
                          <Block key={index} flex>
                            {this.createAttendanceCard(rowData[0], index)}
                          </Block>
                        )}
                      </Block>
                      : <Block flex center middle>
                        <Text
                          color={colors["color2"]}
                          style={[styles.customH4, styles.fontFamilyBlack]}
                        >
                          {translate('error_text_nodata')}
                        </Text>
                      </Block>}
                  </ScrollView>
                </Tab>
              </Tabs>
            </Block>
            <Modal
              offset={this.state.offset}
              open={modalVisible1}
              modalDidClose={() => this.closeModal1()}
              containerStyle={{
                justifyContent: "center"
              }}
              modalStyle={styles.modal}
            >
              <Block style={styles.modalTitle}>
                <Text style={styles.modalTitleText}>
                  {translate('academicdetail_text_categoryitems')}
                </Text>
              </Block>
              <Block style={styles.modalCloseIcon}>
                <TouchableHighlight
                  onPress={() => {
                    this.closeModal1();
                  }}
                  style={{ paddingHorizontal: 10 }}
                  underlayColor="transparent"
                >
                  <MaterialIcons name="close" size={30} color="black" />
                </TouchableHighlight>
              </Block>
              {filterObj[0]
                ? <ScrollView
                  contentContainerStyle={styles.modalScrollview}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  {filterObj.map((rowData, index) =>
                    <Block key={index}>
                      {this.createCard(rowData, index)}
                    </Block>
                  )}
                </ScrollView>
                : <ScrollView
                  contentContainerStyle={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                >
                  <Block
                    flex={1}
                    style={{
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text h5 color={"grey"} style={styles.fontFamilyBlack}>
                      {translate('error_text_nodata')}
                    </Text>
                  </Block>
                </ScrollView>}
            </Modal>
          </Block>
          : <LoadingScreen />}
      </View>
    );
  }
}

export default withNavigation(AcademicDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  firstContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  secondContainer: {
    flex: 0.7
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center"
  },
  scrollView2: {
    flexGrow: 1,
    width: width,
    alignItems: "flex-end"
  },
  modalScrollview: {
    flexGrow: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    width: width - 50,
    minHeight: height / 8,
    maxHeight: height / 8,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    elevation: 5
  },
  card: {
    borderRadius: 3,
    width: width * 0.55,
    marginVertical: 10,
    marginRight: width / 30,
    elevation: 5,
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0.5, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.3,
    elevation: 3,
    zIndex: 99
  },
  gradeInfCard: {
    justifyContent: "space-around",
    alignItems: "center"
  },
  categoryItemBtn: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: width - 30,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#f39c12"
  },
  modal: {
    borderRadius: 10,
    marginHorizontal: 5
  },
  modalTitle: {
    alignSelf: "stretch",
    alignItems: "center"
  },
  modalTitleText: {
    color: "#512da8",
    fontFamily: "Black",
    fontSize: RFValue(18)
  },
  modalCloseIcon: {
    alignSelf: "stretch",
    alignItems: "flex-end",
    position: "absolute",
    top: 0,
    right: 0,
    padding: 5
  },
  ecwpCard: {
    padding: 20
  },
  marginBottom5: {
    marginBottom: 5
  },
  marginBottom20: {
    marginBottom: 20
  },
  marginBottom10: {
    marginBottom: 10
  },
  marginTop10: {
    marginTop: 10
  },
  rotate: {
    transform: [{ rotate: "90deg" }]
  },
  width100per: {
    width: "100%"
  },
  width90per: {
    width: "90%"
  },
  width60per: {
    width: "60%"
  },
  width30per: {
    width: "30%"
  },
  width10per: {
    width: "10%"
  },
  height100per: {
    height: "100%",
    paddingVertical: 10
  },
  paddingHorizontal10: {
    paddingHorizontal: 10
  },
  thumbnail: {
    borderWidth: 2,
    borderColor: "white",
    width: width / 4,
    height: width / 4,
    borderRadius: width / 8,
    position: "absolute"
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
  fontFamilyMedium: {
    fontFamily: "Medium"
  },
  customH4: {
    fontSize: RFValue(24)
  },
  customFontSize16: {
    fontSize: RFValue(16)
  },
  customFontSize14: {
    fontSize: RFValue(14)
  }
});