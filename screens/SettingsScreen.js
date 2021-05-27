import React from "react";
import {
  StyleSheet,
  Switch,
  FlatList,
  Platform,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  AsyncStorage
} from "react-native";
import { Block, Text, theme, Icon } from "galio-framework";

import materialTheme from "../constants/Theme";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';
import Select2 from "react-native-select-two"
// import * as CustomFont from "../assets/fonts"


const languageArr = [
  { id: "en", name: "English", checked: false },
  { id: "zhHans", name: "简体中文", checked: false },
  { id: "zhHant", name: "繁體中文", checked: false },
  { id: "vi", name: "Tiếng Việt", checked: false },
  { id: "es", name: "Español", checked: false },
  { id: "fa", name: "فارسی", checked: false },
  { id: "ja", name: "日本語", checked: false },
  { id: "ru", name: "Русский", checked: false },
  { id: "koKR", name: "한국어", checked: false },
  // { id: "ar", name: "العربية", checked: false },
]

const { width, height } = Dimensions.get("window");

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "English",
      langCode: 'en'
    }
  }

  async componentDidMount() {
    this.props.navigation.addListener('willFocus', payload => { this.setLanguage() })
  }

  async setLanguage() {
    var LanguageAsync = await AsyncStorage.getItem("language");
    if (LanguageAsync) {
      this.setState({ langCode: LanguageAsync })

      languageArr.forEach(element => {
        if (element.id === LanguageAsync) {
          element.checked = true
          this.setState({ lang: element.name })
        } else {
          element.checked = false
        }
      });

      this.forceUpdate();
    }
  }

  toggleSwitch = switchNumber =>
    this.setState({ [switchNumber]: !this.state[switchNumber] });

  renderItem = ({ item }) => {
    const { navigate } = this.props.navigation;

    switch (item.type) {
      case "switch":
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text size={14}>
              {item.title}
            </Text>
            <Switch
              onValueChange={() => this.toggleSwitch(item.id)}
              ios_backgroundColor={materialTheme.COLORS.SWITCH_OFF}
              thumbColor={
                Platform.OS === "android"
                  ? materialTheme.COLORS.SWITCH_OFF
                  : null
              }
              trackColor={{
                false: materialTheme.COLORS.SWITCH_OFF,
                true: materialTheme.COLORS.SWITCH_ON
              }}
              value={this.state[item.id]}
            />
          </Block>
        );
      case "button":
        return (
          <Block style={styles.rows}>
            <TouchableOpacity onPress={() => navigate(item.id)}>
              <Block row middle space="between" style={{ paddingTop: 7 }}>
                <Text size={14}>
                  {item.title}
                </Text>

              </Block>
            </TouchableOpacity>
          </Block>
        );
      default:
        break;
    }
  };

  async _changeLanguage(value) {
    this.saveItem("language", value);
    this.saveItem("isLangSaved", "yes");
    // Set the locale once at the beginning of your app.
    // i18n.locale = Localization.locale;
    i18n.locale = value;
    // When a value is missing from a language it'll fallback to another language with the key present.
    i18n.fallbacks = true;

    this.setState({ langCode: value })
    languageArr.forEach(element => {
      if (element.id === value) {
        element.checked = true
        this.setState({ lang: element.name })
      } else {
        element.checked = false
      }
    });

    this.props.navigation.navigate("home")
    this.props.navigation.navigate("settings")
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  render() {
    const recommended = [
      { title: "Use FaceID to sign in", id: "face", type: "switch" },
      { title: "Auto-Lock security", id: "autolock", type: "switch" },
      { title: "Notifications", id: "Notifications", type: "button" }
    ];

    const payment = [
      { title: "Manage Payment Options", id: "Payment", type: "button" },
      { title: "Manage Gift Cards", id: "gift", type: "button" }
    ];

    const privacy = [
      { title: "User Agreement", id: "Agreement", type: "button" },
      { title: "Privacy", id: "Privacy", type: "button" },
      { title: "About", id: "About", type: "button" }
    ];

    const { lang } = this.state;

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.settings}
      >
        <FlatList
          // data={recommended}
          // keyExtractor={(item, index) => item.id}
          // renderItem={this.renderItem}
          ListHeaderComponent={
            <Block center style={styles.title}>
              <Text bold size={theme.SIZES.BASE} style={{ paddingBottom: 5 }}>
                {translate("setting_text_language")}
              </Text>
              <Text size={12} color={materialTheme.COLORS.CAPTION}>
                {translate("setting_text_sypl")}
              </Text>
            </Block>
          }
        />
        <Block center middle style={styles.mgb10}>
          <Block style={{ width: "80%" }}>
            <Select2
              isSelectSingle={true}
              style={{ borderRadius: 5 }}
              colorTheme="#512da8"
              popupTitle="Select Language"
              title={lang}
              cancelButtonText='Cancel'
              selectButtonText='Choose'
              showSearchBox={false}
              searchPlaceHolderText="Search language here"
              listEmptyTitle='No Language'
              data={languageArr}
              onSelect={(data) => {
                if (data[0]) {
                  this._changeLanguage(data[0])
                }
              }}
            // onRemoveItem={data => {
            //   this.setState({ data })
            // }}
            />
          </Block>
        </Block>
        {/* <Block center style={styles.title}>
          <Text bold size={theme.SIZES.BASE} style={{ paddingBottom: 5 }}>
            Payment Settings
          </Text>
          <Text size={12} color={materialTheme.COLORS.CAPTION}>
            These are also important settings
          </Text>
        </Block>

        <FlatList
          data={payment}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
        />

        <Block center style={styles.title}>
          <Text bold size={theme.SIZES.BASE} style={{ paddingBottom: 5 }}>
            Privacy Settings
          </Text>
          <Text size={12} color={materialTheme.COLORS.CAPTION}>
            Third most important settings
          </Text>
        </Block>
        <FlatList
          data={privacy}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
        /> */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  settings: {
    paddingVertical: theme.SIZES.BASE / 3
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2
  },
  rows: {
    height: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2
  },
  mgb10: { marginBottom: 10 }
});
