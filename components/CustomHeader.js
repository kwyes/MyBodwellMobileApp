import React from "react";
import { withNavigation } from "react-navigation";
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  AsyncStorage
} from "react-native";
import { Header } from "react-native-elements";
import { Button, Block, NavBar, Input, Text, theme } from "galio-framework";
import { RFValue } from "react-native-responsive-fontsize";

import Icon from "./Icon";
import Tabs from "./Tabs";
import materialTheme from "../constants/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import GoogleAnalytics from "./GoogleAnalytics";
import i18n from 'i18n-js';
import { translate } from "../components/Translate";

const { height, width } = Dimensions.get("window");
const iPhoneX = () =>
  Platform.OS === "ios" &&
  (height === 812 || width === 812 || height === 896 || width === 896);

class CustomHeader extends React.Component {
  constructor(props) {
    super(props);
    obj = new GoogleAnalytics;
  }

  async componentDidMount() {
    var LanguageAsync = await AsyncStorage.getItem("language");
    i18n.locale = LanguageAsync;
    i18n.fallbacks = true;

    this.props.navigation.addListener('willFocus', payload => { this.changeLang() })
  }

  async changeLang() {
    var LanguageAsync = await AsyncStorage.getItem("language");
    i18n.locale = LanguageAsync;
    this.forceUpdate();
  }

  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return back ? navigation.goBack(null) : navigation.openDrawer();
  };

  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;

    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })}
      />
    );
  };

  render() {
    const { back, title, white, transparent, navigation } = this.props;
    const { routeName } = navigation.state;
    const noShadow = ["Search", "Profile"].includes(routeName);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null
    ];
    const iconName = back ? "keyboard-arrow-left" : "menu";

    const screenName = this.props.navigation.state.routeName;
    obj._pageHit(screenName);

    return (
      <NavBar
        style={styles.navbar}
        left={
          <TouchableOpacity
            onPress={() => this.handleLeftPress()}
            style={{ paddingHorizontal: 5 }}
          >
            <MaterialIcons
              name={iconName}
              color={"#512da8"}
              size={RFValue(26)}
            />
          </TouchableOpacity>
        }
        title={title ? translate(title).toUpperCase() : ""}
        titleStyle={styles.title}
      />
    );
  }
}

export default withNavigation(CustomHeader);

const styles = StyleSheet.create({
  icon: {
    paddingVertical: 0,
    flex: 0.4,
    zIndex: 5
  },
  button: {
    padding: 12,
    position: "relative"
  },
  title: {
    color: "#512da8",
    fontFamily: "Black",
    fontSize: RFValue(16),
    textAlign: "left",
    width: "100%"
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: theme.SIZES.BASE * 1.5,
    marginTop:
      Platform.OS === "android"
        ? theme.SIZES.BASE * 0.5
        : height === 812 || width === 812 || height === 896 || width === 896
          ? theme.SIZES.BASE * 3
          : theme.SIZES.BASE * 1.5,
    height: 40
  },
  navbar2: {
    paddingVertical: 0,
    paddingBottom: 18,
    paddingTop: 18
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  },
  notify: {
    backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: "absolute",
    top: 8,
    right: 8
  },
  header: {
    backgroundColor: theme.COLORS.WHITE
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.5,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: "300"
  }
});
