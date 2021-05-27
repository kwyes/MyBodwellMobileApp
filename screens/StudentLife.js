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
import { TermHeader } from "../components/";
import { Block, Text, theme, Button } from "galio-framework";
import { LoadingScreen } from "../components";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { numFormat } from "../components/NumFormat";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("window");
const colorTheme = [
  {
    color1: "#8346a9",
    color2: "#af87c8"
  },
  {
    color1: "#a94687",
    color2: "#c887b2"
  },
  {
    color1: "#5546a9",
    color2: "#9187c8"
  },
  {
    color1: "#4677a9",
    color2: "#87a7c8"
  }
];

export default class StudentLife extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentlifeObj: [],
      screenHeight: height,
      activeTab: "Top",
      totalCurrentHour: null,
      totalVLWEHour: null,
      semesterName: null,
      enrollSemesterName: null,
      lang: "en"
    };
  }

  async componentDidMount() {
    var StudentId = await AsyncStorage.getItem("StudentId");
    var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    var SemesterName = await AsyncStorage.getItem("SemesterName");
    var EnrollSemesterName = await AsyncStorage.getItem("EnrollSemesterName");
    var Source = await AsyncStorage.getItem("Source");
    this.setState({
      semesterName: SemesterName,
      enrollSemesterName: EnrollSemesterName
    });
    this._getStudentLife(StudentId, CurrentSemester, Source);
    this.props.navigation.addListener('willFocus', payload => { this.changeLang() })
  }

  async changeLang() {
    var LanguageAsync = await AsyncStorage.getItem("language");
    this.setState({ lang: LanguageAsync })
    this.forceUpdate();
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

  redirectStudentLifeDetailWithAcitivityCategory = ActivityCategory => {
    const { navigation } = this.props;
    if (ActivityCategory) {
      navigation.navigate("studentLifeDetail", {
        ActivityCategory: ActivityCategory
      });
    } else {
      Alert.alert("Sign Out and Try Again");
    }
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

  getTextAlign(i) {
    if (i % 2 == 1) {
      return { justifyCntent: "right" };
    } else {
      return { justifyCntent: "left" };
    }
  }

  createCard = () => {
    const { studentlifeObj } = this.state;
    const { navigation } = this.props;
    let card = [];
    var paramColorId = [];

    for (let i = 0; i < studentlifeObj.length; i++) {
      if (i >= colorTheme.length) {
        colorId = i - colorTheme.length;
      } else {
        colorId = i;
      }

      paramColorId[i] = colorId;

      card.push(
        <Block style={[styles.card, styles.leftRadius]} key={i}>
          <TouchableHighlight
            onPress={() =>
              parseFloat(studentlifeObj[i].CurrentHours) > 0
                ? navigation.navigate("studentLifeDetail", {
                  param: studentlifeObj[i].ActivityCategory,
                  color: colorTheme[paramColorId[i]]
                })
                : Alert.alert("No record")}
            underlayColor={"#ecf0f1"}
            style={{ borderRadius: 8 }}
            onShowUnderlay={() => this.removeShadowOpacity()}
            onHideUnderlay={() => this.setShadowOpacity()}
          >
            <Block>
              <Block
                middle
                style={[
                  {
                    backgroundColor: colorTheme[colorId].color1
                  },
                  this.getStyleBoederRadius(i, "top"),
                  this.getTextAlign(i),
                  styles.width100per,
                  styles.minHeight120,
                  styles.pdh15
                ]}
              >
                {i % 2 == 1
                  ? <Block row space={"between"} style={styles.width100per}>
                    <MaterialIcons
                      name={this.getCategoryIcon(
                        studentlifeObj[i].ActivityCategory
                      )}
                      size={RFValue(24)}
                      color="white"
                    />
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyBlack, styles.customH5]}
                    >
                      {studentlifeObj[i].CategoryTitle}
                    </Text>
                  </Block>
                  : <Block row space={"between"} style={styles.width100per}>
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyBlack, styles.customH5]}
                    >
                      {studentlifeObj[i].CategoryTitle}
                    </Text>
                    <MaterialIcons
                      name={this.getCategoryIcon(
                        studentlifeObj[i].ActivityCategory
                      )}
                      size={RFValue(24)}
                      color="white"
                    />
                  </Block>}
                <Block style={styles.width100per}>
                  {i % 2 == 1
                    ? <Text
                      color={"white"}
                      style={[
                        { textAlign: "right" },
                        styles.fontFamilyHeavyOblique,
                        styles.customFontSize14
                      ]}
                    >
                      {studentlifeObj[i].Body}
                    </Text>
                    : <Text
                      color={"white"}
                      style={[
                        { textAlign: "left" },
                        styles.fontFamilyHeavyOblique,
                        styles.customFontSize14
                      ]}
                    >
                      {studentlifeObj[i].Body}
                    </Text>}
                </Block>
              </Block>
              <Block
                style={[
                  { backgroundColor: colorTheme[colorId].color2 },
                  this.getStyleBoederRadius(i, "bottom")
                ]}
              >
                <Block
                  style={[styles.width100per, styles.pdv10, styles.borderTop]}
                  center
                >
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyBlack, styles.customH5]}
                  >
                    {numFormat(studentlifeObj[i].CurrentHours, 1)}{" "}
                    <Text style={styles.customFontSize14}>{translate('studentlife_text_hrs')}</Text>
                  </Text>
                </Block>
              </Block>
            </Block>
          </TouchableHighlight>
        </Block>
      );
    }
    return card;
  };

  render() {
    const scrollEnabled = this.state.screenHeight > height;
    const {
      studentlifeObj,
      totalCurrentHour,
      totalVLWEHour,
      semesterName,
      enrollSemesterName,
      lang
    } = this.state;
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>
        {studentlifeObj[0]
          ? <ScrollView
            contentContainerStyle={styles.scrollview}
            // scrollEnabled={scrollEnabled}
            onContentSizeChange={this.onContentSizeChange}
            showsVerticalScrollIndicator={false}
          >
            <TermHeader color={"#a30077"} text={semesterName} />
            <Block center flex style={{ width: width }}>
              <Block center flex={0.2} style={styles.mgb20}>
                <Text
                  color={"#a30077"}
                  style={[
                    styles.mgb10,
                    styles.fontFamilyBlack,
                    styles.customH5
                  ]}
                >
                  {translate('studentlife_text_participationhours')}
                </Text>
                <Block row style={styles.width100per}>
                  <Block
                    row
                    style={[
                      styles.width55per,
                      styles.hrsSumLeftContainer,
                      styles.height100per
                    ]}
                    center
                    middle
                  >
                    <Block flex={0.3} style={{ alignItems: "flex-end" }}>
                      <MaterialIcons
                        name="accessibility"
                        size={RFValue(52)}
                        color="white"
                      />
                    </Block>
                    <Block center flex={0.7} style={styles.mgl10}>
                      <Text
                        color={"white"}
                        style={[styles.fontFamilyBlack, styles.customH4]}
                      >
                        {totalCurrentHour} {translate('studentlife_text_hrs')}
                      </Text>
                      <Text
                        color={"white"}
                        style={[
                          styles.fontFamilyRoman,
                          styles.customFontSize12
                        ]}
                      >
                        {translate('studentlife_text_tpic')}
                      </Text>
                    </Block>
                  </Block>
                  <TouchableHighlight
                    onPress={() =>
                      parseFloat(totalVLWEHour) > 0
                        ? navigation.navigate("studentLifeVLWE")
                        : Alert.alert("No record")}
                    style={[
                      styles.width45per,
                      styles.hrsSumRightContainer,
                      styles.height100per
                    ]}
                    underlayColor={"#ecf0f1"}
                    onShowUnderlay={() => this.removeShadowOpacity()}
                    onHideUnderlay={() => this.setShadowOpacity()}
                  >
                    <Block
                      flex
                      style={[
                        styles.width100per,
                        styles.pdh15,
                        { backgroundColor: "#ffbfee" }
                      ]}
                      center
                      middle
                    >
                      <Text
                        color={"#a30077"}
                        style={[styles.fontFamilyBlack, styles.customH4]}
                      >
                        {totalVLWEHour} {translate('studentlife_text_hrs')}
                      </Text>
                      <Text
                        color={"#a30077"}
                        style={[
                          styles.fontFamilyRoman,
                          styles.customFontSize12
                        ]}
                      >
                        {translate('studentlife_text_qfce')}
                      </Text>
                    </Block>
                  </TouchableHighlight>
                </Block>
              </Block>
              <Block flex={0.5} center middle style={styles.mgb10}>
                <Block
                  flex
                  row
                  style={[styles.mgb10, { flexWrap: "wrap", width: width }]}
                  space={"between"}
                >
                  {this.createCard()}
                </Block>
              </Block>
              <Block
                flex={0.3}
                space={"between"}
                style={[
                  styles.width100per,
                  styles.mgb10,
                  { height: height / 5 }
                ]}
              >
                <Block row flex={0.5} center>
                  <Block flex={0.47} center middle>
                    <TouchableHighlight
                      onPress={() => navigation.navigate("childsActivity")}
                      style={styles.buttonTouchable}
                      underlayColor={"#ecf0f1"}
                      onShowUnderlay={() => this.removeShadowOpacity()}
                      onHideUnderlay={() => this.setShadowOpacity()}
                    >
                      <Block style={styles.button}>
                        <Text
                          style={[
                            styles.fontFamilyBlack,
                            styles.customFontSize14,
                            { textAlign: "center" }
                          ]}
                          color={"white"}
                        >
                          {translate('studentlife_button_mcai') + " " + semesterName}
                        </Text>
                      </Block>
                    </TouchableHighlight>
                  </Block>
                  <Block flex={0.47} center middle>
                    <TouchableHighlight
                      onPress={() => navigation.navigate("allActivity")}
                      style={styles.buttonTouchable}
                      underlayColor={"#ecf0f1"}
                      onShowUnderlay={() => this.removeShadowOpacity()}
                      onHideUnderlay={() => this.setShadowOpacity()}
                    >
                      <Block style={styles.button}>
                        <Text
                          style={[
                            styles.fontFamilyBlack,
                            styles.customFontSize14,
                            { textAlign: "center" }
                          ]}
                          color={"white"}
                        >
                          {translate('studentlife_button_asai') + " " + semesterName}
                        </Text>
                      </Block>
                    </TouchableHighlight>
                  </Block>
                </Block>
                <Block
                  flex={0.5}
                  style={[
                    styles.width100per,
                    { justifyCntent: "flex-end", alignItems: "center" }
                  ]}
                >
                  <TouchableHighlight
                    onPress={() => navigation.navigate("participationGraph")}
                    style={[styles.buttonTouchable, styles.mgt10]}
                    underlayColor={"#ecf0f1"}
                    onShowUnderlay={() => this.removeShadowOpacity()}
                    onHideUnderlay={() => this.setShadowOpacity()}
                  >
                    <Block style={styles.button}>
                      <Text
                        style={[
                          styles.fontFamilyBlack,
                          styles.customFontSize14
                        ]}
                        color={"white"}
                      >
                        {lang == "ja" ? enrollSemesterName + " " + translate('studentlife_button_tphs') : translate('studentlife_button_tphs') + " " + enrollSemesterName}
                      </Text>
                    </Block>
                  </TouchableHighlight>
                </Block>
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
    flexGrow: 1
  },
  card: {
    flexBasis: "48%",
    marginVertical: 5
  },
  height100per: {
    height: "100%"
  },
  minHeight120: {
    minHeight: 120
  },
  width100per: {
    width: "100%"
  },
  width55per: {
    width: "55%"
  },
  width45per: {
    width: "45%"
  },
  hrsSumLeftContainer: {
    backgroundColor: "#a30077",
    paddingVertical: 15,
    maxHeight: height / 8,
    minHeight: height / 8
  },
  hrsSumRightContainer: {
    maxHeight: height / 8,
    minHeight: height / 8
  },
  mgl10: {
    marginLeft: 10
  },
  mgt10: {
    marginTop: 10
  },
  mgb10: {
    marginBottom: 10
  },
  mgb20: {
    marginBottom: 20
  },
  pdv10: {
    paddingVertical: 10
  },
  pdh15: {
    paddingHorizontal: 15
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
  buttonTouchable: {
    width: "90%",
    borderRadius: 5,
    justifyContent: "center"
  },
  button: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#a30077",
    backgroundColor: "#a30077",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10
  },
  customH4: {
    fontSize: RFValue(24)
  },
  customH5: {
    fontSize: RFValue(20)
  },
  customFontSize14: {
    fontSize: RFValue(14)
  },
  customFontSize12: {
    fontSize: RFValue(12)
  }
});
