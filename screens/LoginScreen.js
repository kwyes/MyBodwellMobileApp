import React from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  TextInput,
  AsyncStorage,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView
} from "react-native";
import { Block, Button, Input, Text, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { materialTheme } from "../constants/";
import { HeaderHeight } from "../constants/utils";
import { RFValue } from "react-native-responsive-fontsize";
// import MaterialIcon from "../components/MaterialIcon";
import { MaterialIcons } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import i18n from 'i18n-js';

const { height, width } = Dimensions.get("window");

export default class LoginScreen extends React.Component {
  state = {
    id: "",
    password: "",
    active: {
      id: false,
      password: false
    },
    saveID: false,
    lang: null
  };

  // componentWillMount() {
  //   this.clear()
  // }

  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  toggleActive = name => {
    const { active } = this.state;
    active[name] = !active[name];

    this.setState({ active });
  };

  onLogin() {
    const { id, password, saveID, lang } = this.state;
    if (saveID) {
      this.remember();
    } else {
      this.clear();
    }

    if (lang) {
      this.saveItem("language", lang);
      this.saveItem("isLangSaved", "yes");
      i18n.locale = lang;
    } else {
      this.saveItem("language", 'en');
      this.saveItem("isLangSaved", "no");
      i18n.locale = 'en';
    }
    i18n.fallbacks = true;
    this._getUserAuth(id, password);
  }
  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }
  onReDirect() {
    const { status, studentId } = this.state;
    this.props.navigation.navigate("AuthLoading");
  }
  onCheck() {
    const { status, studentId } = this.state;
  }

  _getCurrentSemesterInfo(source) {
    fetch(`https://api-m.bodwell.edu/api/semesterList/${source}`)
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          this.saveItem("CurrentSemester", json["data"][0].SemesterID);
          this.saveItem("SemesterName", json["data"][0].SemesterName);
          this.saveItem("StartDate", json["data"][0].StartDate);
          this.saveItem("EndDate", json["data"][0].EndDate);
          this.onReDirect();
        } else {
          console.log(json.message);
        }
      });
  }

  _getCantoFolderName(source) {
    fetch(`https://api-m.bodwell.edu/api/cantoFolder/${source}`)
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          for (let i = 0; i < json["data"][0].length; i++) {
            var fldDesc = json["data"][0][i][1];
            var fldName = json["data"][0][i][2];
            this.saveItem("Canto-" + fldDesc, fldName);

          }
        } else {
          console.log(json.message);
        }
      });
  }

  _getUserAuth = (id, password) => {
    fetch(`https://api-m.bodwell.edu/api/login/${id}/${password}/p`)
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          this.setState({
            status: json.status,
            studentId: json.studentId,
          });
          this.saveItem("userName", id);
          this.saveItem("StudentId", json.studentId);
          this.saveItem("Source", json.source);
          this._getCantoFolderName(json.source);
          this._getCurrentSemesterInfo(json.source);
        } else {
          console.log(json.message);
        }
      });
  };

  async componentDidMount() {
    this.read();
  }

  _clearStorage = async () => {
    AsyncStorage.clear();
  };

  read = async () => {
    try {
      const credentials = await SecureStore.getItemAsync("loginInfo");
      if (credentials) {
        const myJson = JSON.parse(credentials);
        console.log(myJson);
        this.setState({
          id: myJson.id,
          password: myJson.password,
          saveID: myJson.saveID
        });
      }
      const language = await SecureStore.getItemAsync("langInfo");
      if (language) {
        const myLang = JSON.parse(language);
        this.setState({
          lang: myLang
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  remember = async () => {
    const { id, password, saveID } = this.state;
    const credentials = { id, password, saveID };
    try {
      await SecureStore.setItemAsync("loginInfo", JSON.stringify(credentials));
    } catch (e) {
      console.log(e);
    }
  };

  clear = async () => {
    try {
      await SecureStore.deleteItemAsync("langInfo");
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { navigation } = this.props;
    const { id, password, saveID } = this.state;
    const DismissKeyboard = ({ children }) =>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
      </TouchableWithoutFeedback>;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollview}
          // scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
          showsVerticalScrollIndicator={false}
        >
          <Block flex center>
            {/* <KeyboardAvoidingView behavior="padding" enabled> */}
            <DismissKeyboard>
              <Block middle center flex={0.3} style={{ width: "80%" }}>
                <Text style={{ textAlign: "center" }} color={"#512da8"}>
                  <Text style={[styles.customH1, styles.fontFamilyBlack]}>
                    WELCOME{"\n"}
                  </Text>
                  <Text
                    style={[
                      styles.customH3,
                      styles.fontFamilyHeavy,
                      { lineHeight: RFValue(25) }
                    ]}
                  >
                    TO MY BODWELL
                  </Text>
                </Text>
              </Block>
            </DismissKeyboard>
            <Block flex={0.7}>
              <ImageBackground
                source={require("../assets/images/login.png")}
                resizeMode={"cover"}
                style={{ flex: 1, width: width, alignItems: "center" }}
              >
                <Block center>
                  <Input
                    borderless
                    color="#3e3255"
                    placeholder="ID"
                    // type="numeric"
                    bgColor="transparent"
                    onBlur={() => this.toggleActive("id")}
                    onFocus={() => this.toggleActive("id")}
                    placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                    onChangeText={text => this.handleChange("id", text)}
                    style={[
                      styles.input,
                      this.state.active.id ? styles.inputActive : null
                    ]}
                    value={id}
                  />
                  <Input
                    password
                    // viewPass
                    borderless
                    color="#3e3255"
                    iconColor="#3e3255"
                    placeholder="Password"
                    bgColor="transparent"
                    onBlur={() => this.toggleActive("password")}
                    onFocus={() => this.toggleActive("password")}
                    placeholderTextColor={materialTheme.COLORS.PLACEHOLDER}
                    onChangeText={text => this.handleChange("password", text)}
                    style={[
                      styles.input,
                      this.state.active.password ? styles.inputActive : null
                    ]}
                    value={password}
                  />
                  <Block row style={{ width: "90%" }} space={"between"}>
                    <Block row flex={0.5} center>
                      {saveID
                        ? <MaterialIcons
                          name="check-box"
                          size={18}
                          color="#3e3255"
                        />
                        : <MaterialIcons
                          name="check-box-outline-blank"
                          size={18}
                          color="#3e3255"
                        />}
                      <Text
                        color={"#3e3255"}
                        size={theme.SIZES.FONT * 0.75}
                        onPress={() => this.setState({ saveID: !saveID })}
                        style={[
                          {
                            alignSelf: "flex-end",
                            lineHeight: theme.SIZES.FONT * 2
                          },
                          styles.fontFamilyMedium
                        ]}
                      >
                        Save ID
                      </Text>
                    </Block>
                    <Block flex={0.5}>
                      {/* <Text
                        color={"#3e3255"}
                        size={theme.SIZES.FONT * 0.75}
                        onPress={() => Alert.alert("Not implemented")}
                        style={{
                          alignSelf: "flex-end",
                          lineHeight: theme.SIZES.FONT * 2
                        }}
                      >
                        Forgot your password?
                      </Text> */}
                    </Block>
                  </Block>
                </Block>

                <Block center style={styles.buttonContainer}>
                  <Button
                    shadowless
                    middle
                    color={"#512da8"}
                    style={styles.button}
                    textStyle={styles.fontFamilyHeavy}
                    onPress={() => this.onLogin()}
                  >
                    LOGIN
                  </Button>
                </Block>
                {/* <Block flex middle>
                <Block style={styles.fingerPrintContainer}>
                  <MaterialIcons name="fingerprint" size={48} color="white" />
                  <Block style={styles.fingerPrintText}>
                    <Text style={styles.textWhite}>Use Fingerprint</Text>
                    <Text style={styles.textWhite}>Authentication</Text>
                  </Block>
                </Block>
              </Block> */}
              </ImageBackground>
            </Block>
            {/* </KeyboardAvoidingView> */}
          </Block>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollview: {
    flex: 1
  },
  signin: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0
  },
  loginTitle: {
    marginTop: 50,
    marginBottom: 50
  },
  input: {
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: materialTheme.COLORS.PLACEHOLDER
  },
  inputActive: {
    borderBottomColor: "#3e3255"
  },
  buttonContainer: {
    marginTop: 20
  },
  button: {
    height: 48
  },
  fingerPrintContainer: {
    flex: 2,
    flexDirection: "row",
    marginTop: 30
  },
  fingerPrintText: {
    padding: 6
  },
  textWhite: {
    color: "white"
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  },
  fontFamilyMedium: {
    fontFamily: "Medium"
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  },
  customH1: {
    fontSize: RFValue(44)
  },
  customH3: {
    fontSize: RFValue(30)
  }
});
