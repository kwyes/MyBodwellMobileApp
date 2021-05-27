import React from "react";
import {
  Alert,
  Image,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  AppState,
  Platform,
  Linking,
  TouchableHighlight
} from "react-native";
import { Video } from "expo-av";
import { Block, Text } from "galio-framework";
import { ProgressBar } from "../components/";
import { RFValue } from "react-native-responsive-fontsize";
import { numFormat } from "../components/NumFormat";
import Carousel, { Pagination } from "react-native-snap-carousel";
import moment from "moment";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import VersionCheck from 'react-native-version-check-expo'
import Modal from "react-native-simple-modal";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const colorThemeArr = {
  Unity: ["#0076bf", "#005183", "#b5f3fc", "#d1fffd"],
  Discovery: ["#7b1fa2", "#5d187b", "#e6bef5", "#f1d8ff"],
  Harmony: ["#3aa800", "#266e00", "#c1ff9a", "#ebffb5"],
  Legacy: ["#ff6f00", "#c43c00", "#ffbd71", "#ffe8b5"],
  Spirit: ["#d1a120", "#7c6500", "#f8f21e", "#fffdcb"],
  Courage: ["#ff0000", "#8e0000", "#ff9771", "#ffdab5"]
};
var EnrollmentDate = "";

// limit for session timeout (sec)
const sessionTime = 5400;

export default class DashboardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      EnrollmentDate: null,
      counsellor: null,
      currentGradeText: null,
      currentGrade: null,
      currentGrade2: null,
      englishName: null,
      firstName: null,
      lastName: null,
      firstNameLen: 0,
      lastNameLen: 0,
      halls: null,
      homestay: null,
      houses: null,
      mentor: null,
      roomNo: null,
      numTerms: null,
      progressValue: null,
      isLoaded: null,
      startDate: null,
      endDate: null,
      residence: null,
      termText: null,
      colorTheme: [],
      media: "i8o2pv14bd47pc245bl3tc924q",
      SemesterText: null,
      activeSlide: 0,
      msgList: [],
      refreshing: false,
      appState: AppState.currentState,
      modalVisible: false,
      transModalVisible: false,
      source: null
    };
  }

  dateFormat(date) {
    return moment(date).format("LL");
  }

  _renderItem({ item, index }) {
    const { colorTheme } = this.state;
    var text = "";
    var date = "";
    var title = "";

    if (item.date == "") {
      date = ""
    } else {
      date = this.dateFormat(item.date);
    }

    if (item.body.length > 125) {
      text = item.body.substring(0, 125) + "...";
    } else {
      text = item.body;
    }

    return (
      <Block flex center middle>
        <Block flex={0.85} center middle>
          <Block
            center
            middle
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: "#D8D2E8",
              borderRadius: 5
            }}
          >
            <Text
              style={[
                styles.fontFamilyBlack,
                styles.customFontSize18,
                { textAlign: "center" }
              ]}
              color={"#3e3255"}
            >
              {item.title}
            </Text>
          </Block>
        </Block>
        <Block flex={0.15}>
          <Text
            style={[styles.fontFamilyMediumOblique, styles.customFontSize14]}
            color={"#7b7b7b"}
          >
            {date}
          </Text>
        </Block>
      </Block>
    );
  }

  async componentDidMount() {
    // check force update
    AppState.addEventListener('change', this._handleAppStateChange);

    // check language setting
    var isLangSaved = await AsyncStorage.getItem("isLangSaved");

    // if language setting not saved yet & force update modal not pop up
    // modal for transration announcement shows up
    if ((isLangSaved == '' || isLangSaved == null || isLangSaved == "no") && this.state.modalVisible === false) {
      this.setState({ transModalVisible: true })
    }

    var StudentId = await AsyncStorage.getItem("StudentId");
    var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    var Source = await AsyncStorage.getItem("Source");
    this._getChildInfo(StudentId, CurrentSemester, Source);

    var EndDateAsync = await AsyncStorage.getItem("EndDate");
    var StartDateAsync = await AsyncStorage.getItem("StartDate");
    const EndDate = new Date(EndDateAsync);
    const StartDate = new Date(StartDateAsync);
    const EndDateTime = EndDate.getTime();
    const StartDateTime = StartDate.getTime();
    const Today = new Date().getTime();
    const Total = EndDateTime - StartDateTime;
    var per = 0;
    if (EndDateTime >= Today && Today >= StartDateTime) {
      per = EndDateTime - Today;
    } else {
      if (StartDateTime > Today) {
        per = Total;
      } else if (EndDateTime > Today) {
        per = 0;
      }
    }
    const param = 1 - per / Total;
    const paramStr = JSON.stringify(param);
    this.setState({
      progressValue: parseFloat(paramStr),
      source: Source
    });
    this.saveItem("progressValue", paramStr);
    this._getCurrentSemesterInfo(Source);
    this._getSemesterText(Source);
    await this._getWeeklyMessage();
    this._getMessageList(Source);

    this._registerForPushNotificationsAsync();
    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      this.willBlurAction
    );

    // console.log('Current Ver. : ' + VersionCheck.getCurrentVersion());

    // VersionCheck.getLatestVersion()
    //   .then(latestVersion => {
    //     console.log('Latest Ver. : ' + latestVersion);
    //   })

    VersionCheck.needUpdate()
      .then(async res => {
        if (res.isNeeded) {
          this.setState({ modalVisible: true })
        }
      });

    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  openStoreUrl() {
    if (Platform.OS === "ios") {
      const appId = 1486680935;
      const itunesURLScheme = `itms-apps://itunes.apple.com/jp/app/id${appId}?mt=8`;
      const itunesURL = `https://itunes.apple.com/jp/app/id${appId}?mt=8`;

      Linking.canOpenURL(itunesURLScheme).then(supported => {
        if (supported) {
          Linking.openURL(itunesURLScheme);
        } else {
          Linking.openURL(itunesURL);
        }
      });
    } else {
      const appId = "app.bodwell.com";
      const playStoreURLScheme = `market://details?id=${appId}`;
      const playStoreURL = `https://play.google.com/store/apps/details?id=${appId}`;

      Linking.canOpenURL(playStoreURLScheme).then(supported => {
        if (supported) {
          Linking.openURL(playStoreURLScheme);
        } else {
          Linking.openURL(playStoreURL);
        }
      });
    }
    this.setState({ modalVisible: false })
  };


  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    // remove listener
    this.willBlurSubscription.remove();
  }

  _handleAppStateChange = async nextAppState => {
    // When close the app
    if (this.state.appState === 'active' && nextAppState.match(/inactive|background/)) {
      this.dateBackground = new Date;
      this.timeout = setTimeout(() => {
        this.signout();
      }, sessionTime * 1000);
    }

    // When resume the app
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.dateActive = new Date;
      var diff = Math.abs(this.dateBackground - this.dateActive)
      if (sessionTime * 1000 > diff) {
        console.log('cancel timeout')
        clearTimeout(this.timeout);
      }

      VersionCheck.needUpdate()
        .then(async res => {
          if (res.isNeeded) {
            this.setState({ modalVisible: true })
          }
        });
    }

    this.setState({ appState: nextAppState });
  }

  async signout() {
    await AsyncStorage.clear();
    this.props.navigation.navigate("AuthLoading");
  }

  willBlurAction = payload => {
    if (this.video) {
      this.video.pauseAsync();
    }
  };

  async _registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    const userName = await AsyncStorage.getItem("userName");
    let finalStatus = existingStatus;
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    var source;
    if (__DEV__) {
      // run through EXPO
      source = 'mybodwell_expo';
    } else {
      // run through production app
      source = 'mybodwell_prd';
    }


    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    } else {
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      console.log("token test : " + token)
      const PUSH_ENDPOINT = "https://api-m.bodwell.edu/api/pushtoken";

      return fetch(PUSH_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: {
            value: token
          },
          user: {
            username: userName
          },
          source: {
            sourcename: source
          }
        })
      })
        .then(response => response.text())
        .then(responseText => {
          console.log(responseText);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  async removeItem(item) {
    try {
      await AsyncStorage.removeItem(item);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  async _getWeeklyMessage() {
    fetch(`https://api-m.bodwell.edu/api/weeklyMessage`)
      .then(response => response.json())
      .then(json => {
        if (json.found > 0) {
          this.setState({
            media: json["results"][0].id
          });
        } else {
          Alert.alert(translate('error_text_nodata'));
        }
      });
  }

  _getChildInfo = (StudentId, CurrentSemester, Source) => {
    fetch(
      `https://api-m.bodwell.edu/api/childInfo/${StudentId}/${CurrentSemester}/${Source}`
    )
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          var currentGradeArr = json[0].currentGrade.split(" ")[1].split("(");
          var currentGrade1 = "";
          var currentGrade2 = "";
          if (currentGradeArr[1]) {
            currentGrade1 = currentGradeArr[0];
            currentGrade2 = " (" + currentGradeArr[1];
          } else {
            currentGrade1 = json[0].currentGrade.split(" ")[1];
          }

          EnrollmentDate = json[0].EnrollmentDate.substring(0, 10);
          this.setState({
            EnrollmentDate: json[0].EnrollmentDate.substring(0, 10),
            counsellor: json[0].counsellor,
            currentGradeText: json[0].currentGrade.split(" ")[0],
            currentGrade: currentGrade1,
            currentGrade2: currentGrade2,
            englishName: json[0].englishName,
            firstName: json[0].firstName,
            lastName: json[0].lastName,
            firstNameLen: json[0].firstName.length,
            lastNameLen: json[0].lastName.length,
            halls: json[0].halls,
            homestay: json[0].homestay,
            houses: json[0].houses,
            mentor: json[0].mentor,
            roomNo: json[0].roomNo,
            studentId: json[0].studentId,
            numTerms: json[0].numTerms,
            residence: json[0].residence,
            colorTheme: colorThemeArr[json[0].houses]
          });
        } else {
          console.log(json.message);
        }
      });
  };

  _getCurrentSemesterInfo(Source) {
    fetch(`https://api-m.bodwell.edu/api/semesterList/${Source}`)
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          const EndDate = new Date(json["data"][0].EndDate);
          const StartDate = new Date(json["data"][0].StartDate);
          const EndDateTime = EndDate.getTime();
          const StartDateTime = StartDate.getTime();
          const Today = new Date().getTime();
          const Total = EndDateTime - StartDateTime;
          var per = 0;
          if (EndDateTime >= Today && Today >= StartDateTime) {
            per = EndDateTime - Today;
          } else {
            if (StartDateTime > Today) {
              per = Total;
            } else if (EndDateTime > Today) {
              per = 0;
            }
          }
          const param = 1 - per / Total;
          this.saveItem("CurrentSemester", json["data"][0].SemesterID);
          this.saveItem("progressValue", JSON.stringify(param));
          this.saveItem("SemesterName", json["data"][0].SemesterName);
          this.saveItem("StartDate", json["data"][0].StartDate);
          this.saveItem("EndDate", json["data"][0].EndDate);
          this.setState({
            SemesterID: json["data"][0].SemesterID,
            progressValue: param,
            isLoaded: true,
            startDate: json["data"][0].StartDate,
            endDate: json["data"][0].EndDate
          });

          var tmpEnrollName = "";
          for (let i = 0; i < json["data"].length; i++) {
            if (EnrollmentDate == json["data"][i].StartDate) {
              tmpEnrollName = json["data"][i].SemesterName;
            }
          }
          this.saveItem("EnrollSemesterName", tmpEnrollName);

          return json["data"][0].SemesterID;
        } else {
          console.log(json.message);
        }
      });
  }

  _getSemesterText(Source) {
    fetch(`https://api-m.bodwell.edu/api/currentTermV2/${Source}`)
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          this.saveItem("termText", json.data.termTxt);
          this.setState({ SemesterText: json.data.termTxt })
        } else {
          console.log(json.message);
        }
      });
  }

  _getMessageList(Source) {
    fetch(`https://api-m.bodwell.edu/api/messageList/app_notify/${Source}`)
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          var tmpArr = [];
          for (let i = 0; i < json.data.length; i++) {
            if (json.data[i].ToFrontPage == "1") {
              tmpArr.push({
                messageId: json.data[i].MessageID,
                title: json.data[i].Subject,
                date: json.data[i].ModifyDate,
                body: json.data[i].Body,
                category: json.data[i].MsgCategory,
                alert: json.data[i].Alert,
                alertLevel: json.data[i].AlertLevel
              });
            }
          }
          this.setState({ msgList: tmpArr });
        } else {
          console.log(json.message);
          var tmpArr = [];
          tmpArr.push({
            title: '"Strength in Diversity"',
            date: "",
            body: "",
          });
          this.setState({ msgList: tmpArr });
        }
      });
  }

  get pagination() {
    const { msgList, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={msgList.length}
        activeDotIndex={activeSlide}
        containerStyle={{ paddingVertical: 8, backgroundColor: "transparent" }}
        dotStyle={{
          width: 5,
          height: 5,
          borderRadius: 2.5,
          marginHorizontal: 1,
          backgroundColor: "black"
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  _onRefresh() {
    const { source } = this.state;

    this._getMessageList(source);
  }

  _closeTranslationModal() {

    this.setState({ transModalVisible: false })
  }

  _gotoSetting() {
    this._closeTranslationModal();
    this.props.navigation.navigate("settings");
  }

  render() {
    const {
      studentId,
      currentGrade,
      currentGrade2,
      currentGradeText,
      firstName,
      lastName,
      firstNameLen,
      lastNameLen,
      halls,
      houses,
      roomNo,
      progressValue,
      colorTheme,
      media,
      residence,
      homestay,
      SemesterText,
      msgList,
      refreshing,
      modalVisible,
      transModalVisible
    } = this.state;

    const weeklyVideoUrl =
      "https://bodwell.canto.com/preview/play/video/" + media;
    const imguri =
      "https://asset.bodwell.edu/OB4mpVpg/student/bhs" + studentId + ".jpg";

    var nameLen = parseInt(firstNameLen) + parseInt(lastNameLen);
    var nameStyle = null;
    if (parseInt(nameLen) < 28) {
      nameStyle = styles.customH4;
    } else {
      nameStyle = styles.customFontSize18;
    }

    var residenceTxet = "";
    if (residence == "Y") {
      residenceTxet = "Boarding";
    } else if (homestay == "Y") {
      residenceTxet = "Homestay";
    } else {
      residenceTxet = "Day Program";
    }

    var houseuri = "";
    switch (houses) {
      case "Courage":
        houseuri = require("../assets/images/Courage.png");
        break;
      case "Discovery":
        houseuri = require("../assets/images/Discovery.png");
        break;
      case "Harmony":
        houseuri = require("../assets/images/Harmony.png");
        break;
      case "Legacy":
        houseuri = require("../assets/images/Legacy.png");
        break;
      case "Spirit":
        houseuri = require("../assets/images/Spirit.png");
        break;
      case "Unity":
        houseuri = require("../assets/images/Unity.png");
        break;
      default:
        break;
    }

    var progressText = numFormat(progressValue, 2) * 100;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                this._onRefresh();
              }}
            />
          }
        >
          <Block style={styles.firstContainer} flex={0.42}>
            <Block style={styles.photoWrapper}>
              <Block style={styles.photoBackground}>
                <Block style={styles.photoContainer}>
                  <Image
                    source={{ uri: imguri }}
                    style={{ width: RFValue(100), height: RFValue(150) }}
                  />
                </Block>
              </Block>
            </Block>
            <Block
              style={[
                styles.firstContainer_1,
                { backgroundColor: colorTheme[0] }
              ]}
              flex={0.45}
            >
              <Block row style={styles.heigth100per}>
                <Block flex={0.35} />
                <Block
                  flex={0.65}
                  style={{
                    justifyContent: "center",
                    alignItems: "flex-start"
                  }}
                >
                  <Text
                    color={"white"}
                    style={styles.fontFamilyBlack}
                    size={RFValue(19)}
                  >
                    {firstName}
                  </Text>
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyBlack, nameStyle]}
                  >
                    {lastName}
                  </Text>
                  <Block row>
                    <Text
                      color={"white"}
                      style={styles.fontFamilyHeavy}
                      size={RFValue(14)}
                    >
                      {currentGradeText}
                    </Text>
                    <Text
                      color={"white"}
                      style={styles.fontFamilyHeavy}
                      size={RFValue(14)}
                    >
                      {currentGrade}
                    </Text>
                    <Text
                      color={"white"}
                      style={styles.fontFamilyHeavy}
                      size={RFValue(14)}
                    >
                      {currentGrade2}
                    </Text>
                  </Block>
                </Block>
              </Block>
            </Block>

            <Block style={styles.firstContainer_2} row flex={0.40}>
              <Block
                style={[
                  styles.firstContainer_2_1,
                  { backgroundColor: colorTheme[1] }
                ]}
                row
                flex={0.35}
              />
              <Block
                style={[
                  styles.firstContainer_2_2,
                  { backgroundColor: colorTheme[1] }
                ]}
                flex={0.65}
                row
              >
                <Block flex={0.3}>
                  {houseuri
                    ? <Image source={houseuri} style={styles.houseIcon} />
                    : <Block />}
                </Block>
                <Block
                  flex={0.7}
                  style={{
                    justifyContent: "center",
                    alignItems: "flex-start"
                  }}
                >
                  <Text
                    color={"white"}
                    style={[styles.fontFamilyBlack, styles.customH5]}
                  >
                    {halls}
                  </Text>
                  <Block row>
                    <Text
                      color={"white"}
                      style={[styles.fontFamilyHeavy, styles.customFontSize15]}
                    >
                      {residenceTxet}
                    </Text>
                    {residence == "Y"
                      ? <Text
                        color={"white"}
                        style={[
                          styles.fontFamilyHeavy,
                          styles.customFontSize15
                        ]}
                      >
                        {" "}/ Room {roomNo}
                      </Text>
                      : <Text />}
                  </Block>
                </Block>
              </Block>
            </Block>

            <Block
              style={[
                styles.firstContainer_3,
                { backgroundColor: colorTheme[3] }
              ]}
              flex={0.15}
            >
              <ProgressBar value={progressValue} color={colorTheme[2]} />
            </Block>
            <Block row style={styles.progressTextWrapper}>
              <Text
                color={"#3e3255"}
                style={[styles.fontFamilyBlack, styles.customFontSize14]}
              >
                {/* {SemesterText} -{" "} */}
                {translate("term_text_" + SemesterText) + " - " + numFormat(progressText, 0) + "%"}
              </Text>
            </Block>
          </Block>

          <Block style={styles.secondContainer} flex={0.23} center middle>
            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={msgList}
              renderItem={this._renderItem.bind(this)}
              sliderWidth={width}
              itemWidth={width * 0.95}
              loop={true}
              autoplay={true}
              autoplayDelay={500}
              autoplayInterval={5000}
              onSnapToItem={index => this.setState({ activeSlide: index })}
            />
            {this.pagination}
          </Block>
          <Block style={styles.thirdContainer} flex={0.35}>
            <Block flex row>
              <Video
                ref={ref => {
                  this.video = ref;
                }}
                source={{ uri: weeklyVideoUrl }}
                rate={1.0}
                volume={1.0}
                resizeMode="contain"
                shouldPlay={false}
                useNativeControls={true}
                style={{ width: width }}
              />
            </Block>
          </Block>
          <Modal
            offset={this.state.offset}
            open={modalVisible}
            closeOnTouchOutside={false}
            // modalDidClose={() => this.closeModal1()}
            containerStyle={{
              justifyContent: "center",
              zIndex: 99
            }}
            modalStyle={styles.modal}
            overlayStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              flex: 1
            }}
          >
            <Block style={styles.modalTitle}>
              <Image
                source={require("../assets/images/icon_android.png")}
                style={{ width: RFValue(40), height: RFValue(40) }}
              />
              <Text style={styles.modalTitleText}>Your app is out of date!</Text>
            </Block>
            <ScrollView
              contentContainerStyle={styles.modalScrollview}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <Block>
                <Text style={styles.modalText}>To continue using the MyBodwell Mobile app, please update to the latest version.</Text>
              </Block>
              <TouchableHighlight
                onPress={() => this.openStoreUrl()}
                style={styles.width50per}
                underlayColor={"#ecf0f1"}
              >
                <Block style={styles.buttonStyle}>
                  <Text
                    color={"white"}
                    style={styles.buttonText}
                  >
                    UPDATE NOW
                    </Text>
                </Block>
              </TouchableHighlight>
            </ScrollView>
          </Modal>
          <Modal
            offset={this.state.offset}
            open={transModalVisible}
            closeOnTouchOutside={false}
            // modalDidClose={() => this.closeModal1()}
            containerStyle={{
              justifyContent: "center",
              zIndex: 99
            }}
            modalStyle={styles.modal}
            overlayStyle={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              flex: 1
            }}
          >
            <Block style={styles.modalTitle}>
              <Text style={styles.modalTitleText}>
                <MaterialIcons name="g-translate" size={RFValue(20)} color="black" />Your app is ready for translation
              </Text>

            </Block>
            <ScrollView
              contentContainerStyle={styles.modalScrollview}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <Block>
                <Text style={styles.modalText}>You can choose your preferred language.</Text>
                <Text style={styles.modalText}>Would you like to try now?</Text>
              </Block>
              <Block row space="around" style={styles.width100per}>
                <TouchableHighlight
                  onPress={() => this._closeTranslationModal()}
                  style={styles.width40per}
                  underlayColor={"#ecf0f1"}
                >
                  <Block style={styles.buttonStyle2}>
                    <Text
                      color={"white"}
                      style={styles.buttonText}
                    >
                      Not now
                    </Text>
                  </Block>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => this._gotoSetting()}
                  style={styles.width40per}
                  underlayColor={"#ecf0f1"}
                >
                  <Block style={styles.buttonStyle} row>
                    <Text
                      color={"white"}
                      style={styles.buttonText}
                    >
                      Go to Setting
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={RFValue(16)}
                      color="white"
                    />
                  </Block>
                </TouchableHighlight>
              </Block>
            </ScrollView>
          </Modal>
        </ScrollView>
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
  modal: {
    borderRadius: 10,
    marginHorizontal: 5,
    paddingVertical: 20,
    zIndex: 999,
    elevation: 5
  },
  modalScrollview: {
    flexGrow: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 20
  },
  firstContainer: {
    width: width,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  secondContainer: {
    width: width
  },
  firstContainer_1: {
    width: width,
    justifyContent: "center",
    alignItems: "center"
  },
  firstContainer_2: {
    width: width
  },
  firstContainer_2_1: {
    width: width,
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "white"
  },
  firstContainer_2_2: {
    width: width,
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "white"
  },
  firstContainer_3: {
    width: width,
    height: "auto",
    justifyContent: "center",
    alignItems: "center"
  },
  thirdContainer: {
    justifyContent: "flex-end",
    alignItems: "center"
  },
  photo: {
    width: height / 6,
    height: height / 5,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: "white",
    borderWidth: 2
  },
  photoWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.35,
    height: height * 0.318,
    zIndex: 50
  },
  photoContainer: {
    overflow: "hidden",
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10
  },
  photoBackground: {
    backgroundColor: "white",
    padding: 2,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10
  },
  houseIcon: {
    height: RFValue(75),
    width: RFValue(55)
  },
  progressTextWrapper: {
    position: "absolute",
    width: width,
    height: height * 0.056,
    justifyContent: "center",
    alignItems: "center"
  },
  heigth100per: {
    height: "100%"
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
  fontFamilyMediumOblique: {
    fontFamily: "MediumOblique"
  },
  customH4: {
    fontSize: RFValue(24)
  },
  customH5: {
    fontSize: RFValue(20)
  },
  customFontSize18: {
    fontSize: RFValue(18)
  },
  customFontSize15: {
    fontSize: RFValue(15)
  },
  customFontSize14: {
    fontSize: RFValue(14)
  },
  modalTitle: {
    alignSelf: "stretch",
    alignItems: "center"
  },
  modalTitleText: {
    fontFamily: "Black",
    fontSize: RFValue(18)
  },
  modalText: {
    fontFamily: "Medium",
    fontSize: RFValue(15)
  },
  buttonStyle: {
    backgroundColor: "#512da8",
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonStyle2: {
    backgroundColor: "#7f8c8d",
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    fontFamily: "Heavy",
    fontSize: RFValue(13)
  },
  width100per: {
    width: "100%"
  },
  width50per: {
    width: "50%"
  },
  width40per: {
    width: "40%"
  }
});
