import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  AsyncStorage
} from "react-native";
import { Block, Text } from "galio-framework";
import { LoadingScreen, BarCustomChart } from "../components";
import { ScrollableTab, Tab, Tabs, TabHeading } from "native-base";
import { RFValue } from "react-native-responsive-fontsize";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("window");

export default class ParticipationGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentlifeObj: [],
      screenHeight: height,
      activeTab: "Top",
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
    this._getStudentLife(StudentId, CurrentSemester, Source);
    this.setState({
      enrollSemesterName: EnrollSemesterName,
      semesterName: SemesterName
    });
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
          this.setState({
            studentlifeObj: json["data"]
          });
        } else {
          console.log(json.message);
        }
      });
  };

  render() {
    const { studentlifeObj, enrollSemesterName, semesterName, lang } = this.state;
    if (studentlifeObj[0]) {
      return (
        <SafeAreaView style={styles.container}>
          <Tabs
            renderTabBar={() =>
              <ScrollableTab
                tabsContainerStyle={{ backgroundColor: "white" }}
              />}
            tabBarUnderlineStyle={{
              backgroundColor: "#a30077"
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
                    {translate('participationgraph_text_currentterm')}
                  </Text>
                </TabHeading>
              }
            >
              <ScrollView
                contentContainerStyle={styles.scrollview}
                showsVerticalScrollIndicator={false}
              >
                <Block center>
                  <Text
                    style={[styles.fontFamilyBlack, styles.customH4]}
                    color={"#a30077"}
                  >
                    {translate('participationgraph_text_participationhours')}
                  </Text>
                  <Text
                    style={[
                      { marginBottom: 10 },
                      styles.fontFamilyRoman,
                      styles.customFontSize14
                    ]}
                    color={"#a30077"}
                  >
                    {semesterName}
                  </Text>
                  <Block style={styles.graphContainer}>
                    <BarCustomChart param={studentlifeObj} param2="current" />
                  </Block>
                </Block>
              </ScrollView>
            </Tab>
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
                    {translate('participationgraph_text_totalhours')}
                  </Text>
                </TabHeading>
              }
            >
              <ScrollView
                contentContainerStyle={styles.scrollview}
                showsVerticalScrollIndicator={false}
              >
                <Block center>
                  <Text
                    style={[styles.fontFamilyBlack, styles.customH4]}
                    color={"#a30077"}
                  >
                    {translate('participationgraph_text_tph')}
                  </Text>
                  <Text
                    style={[
                      { marginBottom: 10 },
                      styles.fontFamilyRoman,
                      styles.customFontSize14
                    ]}
                    color={"#a30077"}
                  >
                    ({lang == "ja" ? enrollSemesterName + " " + translate('participationgraph_text_since') : translate('participationgraph_text_since') + " " + enrollSemesterName})
                  </Text>
                  <Block style={styles.graphContainer}>
                    <BarCustomChart param={studentlifeObj} param2="total" />
                  </Block>
                </Block>
              </ScrollView>
            </Tab>
          </Tabs>
        </SafeAreaView>
      );
    } else {
      return <LoadingScreen />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  scrollview: {
    flexGrow: 1,
    width: width,
    alignItems: "center",
    justifyContent: "center"
  },
  graphContainer: {
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
  customFontSize14: {
    fontSize: RFValue(14)
  }
});
