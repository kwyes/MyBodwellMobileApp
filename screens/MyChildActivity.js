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
import { MaterialIcons } from "@expo/vector-icons";
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
var tmp_title = "";

export default class MyChildActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChildActivityObj: [],
      screenHeight: height,
      myChildDetailObj: []
    };
  }

  async componentDidMount() {
    var StudentId = await AsyncStorage.getItem("StudentId");
    var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    var StartDate = await AsyncStorage.getItem("StartDate");
    var Source = await AsyncStorage.getItem("Source");
    this._getMyChildActivity(StudentId, CurrentSemester, StartDate, Source);
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  _getMyChildActivity = (StudentId, CurrentSemester, StartDate, Source) => {
    fetch(
      `https://api-m.bodwell.edu/api/studentLife/${StudentId}/${CurrentSemester}/${Source}`
    )
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          var myChildDetail = [];
          var dataArr = json["data"];
          for (var i = 0; i < dataArr.length; i++) {
            if (dataArr[i].startDate.substring(0, 10) >= StartDate) {
              var monIndex = parseInt(dataArr[i].startDate.substring(5, 7));
              var mon = month[monIndex - 1];
              var day = dataArr[i].startDate.substring(8, 10);
              myChildDetail[i] = {
                date: dataArr[i].activityDate,
                title: dataArr[i].Title,
                baseHours: dataArr[i].hours,
                ActivityStatus: dataArr[i].ActivityStatus,
                startDate: dataArr[i].startDate,
                endDate: dataArr[i].endDate,
                staffName: dataArr[i].FullStaffName,
                latitude: dataArr[i].Latitude,
                longitude: dataArr[i].Longitude,
                staffId: dataArr[i].staffId,
                CategoryTitle: dataArr[i].CategoryTitle,
                categoryDescription: dataArr[i].Body,
                category: dataArr[i].category,
                date_m: mon,
                date_d: day
              };
            }
          }
          this.setState({
            myChildActivityObj: json["data"],
            myChildDetailObj: myChildDetail
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

  getStatusIcon(status) {
    var iconName = "";
    switch (status) {
      case "20":
        return (iconName = "date-range");
      case "60":
        return (iconName = "hourglass-empty");
      case "80":
        return (iconName = "done");
      case "90":
        return (iconName = "block");
      default:
        return null;
    }
  }

  removeShadowOpacity = () =>
    this.setState({ shadowOpacity: 0.1, elevation: 2 });

  setShadowOpacity = () => this.setState({ shadowOpacity: 0.3, elevation: 5 });

  createCard(rowData, index) {
    var card = [];

    if (
      rowData.date_m == tmp_day_m &&
      rowData.date_d == tmp_day_d &&
      rowData.title != tmp_title
    ) {
      card.push(
        <Block style={styles.width100per} key={index} row>
          <Block center middle flex={0.2}>
            <MaterialIcons
              name={this.getStatusIcon(rowData.ActivityStatus)}
              size={RFValue(20)}
              color="#a30077"
            />
          </Block>
          <Block right flex={0.8}>
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
                  { backgroundColor: this.getColorTheme(rowData.category) }
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
                    {rowData.staffName} | {rowData.CategoryTitle}
                  </Text>
                </Block>
              </Block>
            </TouchableHighlight>
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
            <MaterialIcons
              name={this.getStatusIcon(rowData.ActivityStatus)}
              size={RFValue(20)}
              color="#a30077"
            />
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
                  { backgroundColor: this.getColorTheme(rowData.category) }
                ]}
              >
                <Block flex={0.5} style={[styles.leftMiddle]} wrap>
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyHeavy, styles.customH5]}
                  >
                    {textFormat(rowData.title)}
                  </Text>
                </Block>
                <Block flex={0.5} style={[styles.leftMiddle]}>
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyMedium, styles.customFontSize12]}
                  >
                    {rowData.staffName} | {rowData.CategoryTitle}
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
    tmp_title = rowData.title;

    return card;
  }

  render() {
    const scrollEnabled = this.state.screenHeight > height;
    const { myChildActivityObj, myChildDetailObj } = this.state;
    if (myChildDetailObj[0]) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView
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
                  {translate('mychildsactivities_text_cua')}
                </Text>
              </Block>
              {myChildDetailObj.map((rowData, index) =>
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
  head: {
    backgroundColor: "#8d6bc9",
    height: 35
  },
  text: {
    margin: 6,
    textAlign: "center",
    color: "#673ab7"
  },
  row: {
    backgroundColor: "#dad0ee"
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
