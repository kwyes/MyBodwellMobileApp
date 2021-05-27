import React, { Component } from "react";
import {
  StyleSheet,
  AsyncStorage,
  Dimensions,
  ScrollView,
  SafeAreaView
} from "react-native";
import { Block, Text } from "galio-framework";
import { LoadingScreen } from "../components";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { TermHeader } from "../components/";
import { numFormat } from "../components/NumFormat";
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

export default class StudentLifeVLWE extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vlweObj: [],
      hours: 0,
      semesterName: null
    };
  }

  async componentDidMount() {
    var StudentId = await AsyncStorage.getItem("StudentId");
    var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    var SemesterName = await AsyncStorage.getItem("SemesterName");
    var Source = await AsyncStorage.getItem("Source");
    this.setState({ semesterName: SemesterName });
    this._getVolunteerHours(StudentId, CurrentSemester, Source);
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  _getVolunteerHours = (StudentId, CurrentSemester, Source) => {
    fetch(
      `https://api-m.bodwell.edu/api/vlweList/${StudentId}/${CurrentSemester}/${Source}`
    )
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          var result = json["data"];
          var allTmp = [];
          var allTotalHours = 0;

          for (let i = 0; i < result.length; i++) {
            if (result[i].ActivityStatus == "80") {
              var monIndex = parseInt(result[i].activityDate.substring(5, 7));
              var mon = month[monIndex - 1];
              var day = result[i].activityDate.substring(8, 10);
              var color = "";

              switch (result[i].category) {
                case "10":
                  color = "#8346a9";
                  break;
                case "11":
                  color = "#a94687";
                  break;
                case "12":
                  color = "#5546a9";
                  break;
                case "13":
                  color = "#4677a9";
                  break;
                default:
                  break;
              }

              allTmp.push({
                date_m: mon,
                date_d: day,
                title: result[i].Title,
                hours: numFormat(result[i].hours, 1),
                ActivityStatus: result[i].ActivityStatus,
                category: result[i].category,
                color: color
              });
              allTotalHours += parseFloat(result[i].hours);
            }
          }

          this.setState({
            vlweObj: allTmp,
            hours: allTotalHours
          });
        } else {
          console.log(json.message);
        }
      });
  };

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

  createCard(rowData, index) {
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
          <Block style={[styles.card, { backgroundColor: rowData.color }]} wrap>
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
                <Block
                  flex={0.3}
                  style={{ alignItems: "flex-end", justifyContent: "center" }}
                >
                  <MaterialIcons
                    name={this.getCategoryIcon(rowData.category)}
                    size={RFValue(24)}
                    color="white"
                  />
                </Block>
                <Block flex={0.7} center middle>
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyBlack, styles.customH5]}
                  >
                    {rowData.hours}{" "}
                    <Text
                      style={[styles.fontFamilyHeavy, styles.customFontSize14]}
                    >
                      {translate('volunteerhours_text_hrs')}
                    </Text>
                  </Text>
                </Block>
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
          <Block right flex={0.8} style={{ paddingTop: 5 }}>
            <Block flex
              style={{
                borderTopColor: "#a30077",
                borderTopWidth: 3,
                width: "100%"
              }} />
            <Block
              style={[styles.card, { backgroundColor: rowData.color }]}
              key={index}
              flex
            >
              <Block flex={0.5} center middle style={styles.mgb10} row>
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
                  <Block
                    flex={0.3}
                    style={{ alignItems: "flex-end", justifyContent: "center" }}
                  >
                    <MaterialIcons
                      name={this.getCategoryIcon(rowData.category)}
                      size={RFValue(24)}
                      color="white"
                    />
                  </Block>
                  <Block flex={0.7} center middle>
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyBlack, styles.customH5]}
                    >
                      {rowData.hours}{" "}
                      <Text
                        style={[
                          styles.fontFamilyHeavy,
                          styles.customFontSize14
                        ]}
                      >
                        {translate('volunteerhours_text_hrs')}
                      </Text>
                    </Text>
                  </Block>
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

  render() {
    const { vlweObj, hours, semesterName } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {vlweObj[0]
          ? <ScrollView
            contentContainerStyle={styles.scrollview}
            scrollEnabled={true}
            onContentSizeChange={this.onContentSizeChange}
            showsVerticalScrollIndicator={false}
          >
            <TermHeader color={"#a30077"} text={semesterName} />
            <Block flex center>
              <Block center style={[styles.width100per, styles.mgb20]}>
                <Text
                  color={"#a30077"}
                  style={[
                    styles.mgv10,
                    styles.fontFamilyBlack,
                    styles.customH5
                  ]}
                >
                  {translate('volunteerhours_text_ceh')}
                </Text>
                <Block style={{ width: width }}>
                  <Block
                    flex
                    style={[styles.width100per, styles.hrsSumRightContainer]}
                    center
                    middle
                    row
                  >
                    <Block flex={0.6} center middle>
                      <Text
                        color={"#a30077"}
                        style={[
                          styles.fontFamilyBlack,
                          styles.customFontSize16
                        ]}
                      >
                        {translate('volunteerhours_text_qfce')}
                      </Text>
                    </Block>
                    <Block flex={0.4} center middle>
                      <Text
                        color={"#a30077"}
                        style={[styles.fontFamilyBlack, styles.customH4]}
                      >
                        {numFormat(hours, 1)} {translate('volunteerhours_text_hrs')}
                      </Text>
                    </Block>
                  </Block>
                </Block>
              </Block>
              <Block center>
                {vlweObj.map((rowData, index) =>
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
  card: {
    borderRadius: 3,
    width: width / 4 * 3,
    marginVertical: 10,
    marginRight: width / 30,
    elevation: 5,
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  width100per: {
    width: "100%"
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
