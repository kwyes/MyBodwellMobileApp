import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableHighlight
} from "react-native";
import { Block, Text } from "galio-framework";
import { LoadingScreen } from "../components";
import { textFormat } from "../components/TextFormat";
import { RFValue } from "react-native-responsive-fontsize";
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

export default class AllActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allActivityObj: [],
      screenHeight: height
    };
  }

  async componentDidMount() {
    var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    var StartDate = await AsyncStorage.getItem("StartDate");
    var Source = await AsyncStorage.getItem("Source");
    this._getAllactivity(CurrentSemester, StartDate, Source);
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  _getAllactivity = (CurrentSemester, StartDate, Source) => {
    fetch(`https://api-m.bodwell.edu/api/schoolActivityList/${CurrentSemester}/${Source}`)
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          var allActivity = [];
          var dataArr = json["data"];
          for (let i = 0; i < dataArr.length; i++) {
            if (dataArr[i].startDate >= StartDate) {
              var monIndex = parseInt(dataArr[i].startDate.substring(5, 7));
              var mon = month[monIndex - 1];
              var day = dataArr[i].startDate.substring(8, 10);
              allActivity[i] = {
                SubstractNum: dataArr[i].SubstractNum,
                VLWE: dataArr[i].VLWE,
                activityId: dataArr[i].activityId,
                activityType: dataArr[i].activityType,
                allDay: dataArr[i].allDay,
                baseHours: dataArr[i].baseHours,
                categoryCode: dataArr[i].categoryCode,
                categoryDescription: dataArr[i].categoryDescription,
                categoryTitle: dataArr[i].categoryTitle,
                curEnroll: dataArr[i].curEnroll,
                description: dataArr[i].description,
                dpa: dataArr[i].dpa,
                endDate: dataArr[i].endDate,
                location: dataArr[i].location,
                latitude: dataArr[i].Latitude,
                longitude: dataArr[i].Longitude,
                maxEnroll: dataArr[i].maxEnroll,
                meetingPlace: dataArr[i].meetingPlace,
                overdue: dataArr[i].overdue,
                penEnroll: dataArr[i].penEnroll,
                staff2Name: dataArr[i].staff2Name,
                staffId: dataArr[i].staffId,
                staffId2: dataArr[i].staffId2,
                staffName: dataArr[i].staffName,
                startDate: dataArr[i].startDate,
                termId: dataArr[i].termId,
                title: dataArr[i].title,
                date_m: mon,
                date_d: day
              };
            }
          }
          this.setState({
            allActivityObj: allActivity
          });
        } else {
          console.log(json.message);
        }
      });
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  redirectActivityDetailTop = rowData => {
    const { navigation } = this.props;
    if (rowData) {
      navigation.navigate("activityDetailTop", {
        detail: rowData
      });
    } else {
      Alert.alert("Sign Out and Try Again");
    }
  };

  getColorTheme = categoryId => {
    var color = "";

    switch (categoryId) {
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

    return color;
  };

  removeShadowOpacity = () =>
    this.setState({ shadowOpacity: 0.1, elevation: 2 });

  setShadowOpacity = () => this.setState({ shadowOpacity: 0.3, elevation: 5 });

  createCard(rowData, index) {
    var card = [];

    if (rowData.date_m == tmp_day_m && rowData.date_d == tmp_day_d) {
      card.push(
        <Block right style={styles.width100per} key={index}>
          <TouchableHighlight
            onPress={() => this.redirectActivityDetailTop(rowData)}
            underlayColor={"#ecf0f1"}
            onShowUnderlay={() => this.removeShadowOpacity()}
            onHideUnderlay={() => this.setShadowOpacity()}
            key={index}
          >
            <Block
              style={[
                styles.card,
                { backgroundColor: this.getColorTheme(rowData.categoryCode) }
              ]}
            >
              <Block style={styles.leftMiddle} flex={0.5}>
                <Text
                  color={"white"}
                  style={[styles.fontFamilyHeavy, styles.customH5]}
                >
                  {textFormat(rowData.title)}
                </Text>
              </Block>
              <Block style={styles.leftMiddle} flex={0.5}>
                <Text
                  color={"white"}
                  style={[styles.fontFamilyMedium, styles.customFontSize12]}
                >
                  {rowData.staffName} | {rowData.categoryTitle}
                </Text>
              </Block>
            </Block>
          </TouchableHighlight>
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
            <TouchableHighlight
              onPress={() => this.redirectActivityDetailTop(rowData)}
              underlayColor={"#ecf0f1"}
              onShowUnderlay={() => this.removeShadowOpacity()}
              onHideUnderlay={() => this.setShadowOpacity()}
              key={index}
            >
              <Block
                style={[
                  styles.card,
                  { backgroundColor: this.getColorTheme(rowData.categoryCode) }
                ]}
              >
                <Block style={styles.leftMiddle} flex={0.5} wrap>
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyHeavy, styles.customH5]}
                  >
                    {textFormat(rowData.title)}
                  </Text>
                </Block>
                <Block style={styles.leftMiddle} flex={0.5}>
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyMedium, styles.customFontSize12]}
                  >
                    {rowData.staffName} | {rowData.categoryTitle}
                  </Text>
                </Block>
              </Block>
            </TouchableHighlight>
          </Block>
        </Block>
      );
    }

    tmp_day_m = rowData.date_m;
    tmp_day_d = rowData.date_d;

    return card;
  }

  render() {
    const scrollEnabled = this.state.screenHeight > height;
    const { allActivityObj } = this.state;
    if (allActivityObj[0]) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollview}
            scrollEnabled={true}
            onContentSizeChange={this.onContentSizeChange}
          >
            <Block style={styles.content}>
              <Block style={{ width: width }} center middle>
                <Text
                  color={"#a30077"}
                  style={[
                    styles.mgv10,
                    styles.fontFamilyBlack,
                    styles.customH5
                  ]}
                >
                  {translate('allactivities_text_allactivities')}
                </Text>
              </Block>
              {allActivityObj.map((rowData, index) =>
                <Block style={[styles.shadow, { width: width }]} key={index}>
                  {this.createCard(rowData, index)}
                </Block>
              )}
            </Block>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return <LoadingScreen />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollview: {
    flexGrow: 1
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
  width100per: {
    width: "100%"
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
  mgv10: {
    marginVertical: 10
  },
  leftMiddle: {
    justifyContent: "center",
    alignItems: "flex-start"
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  },
  fontFamilyMedium: {
    fontFamily: "Medium"
  },
  customH4: {
    fontSize: RFValue(24)
  },
  customH5: {
    fontSize: RFValue(20)
  },
  customFontSize12: {
    fontSize: RFValue(12)
  }
});
