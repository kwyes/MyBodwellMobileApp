import React from "react";
import { StyleSheet, Dimensions, AsyncStorage } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "./Icon";
import materialTheme from "../constants/Theme";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { translate } from "./Translate";

const { height, width } = Dimensions.get("window");
// const colorThemeArr = {
//   Unity: "#005183",
//   Discovery: "#5d187b",
//   Harmony: "#266e00",
//   Legacy: "#c43c00",
//   Spirit: "#7c6500",
//   Courage: "#8e0000"
// }

class DrawerItem extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { house: "" };
  }

  // async componentDidMount() {
  //   const House = await AsyncStorage.getItem("House");
  //   this.setState({ house: House });
  // }

  renderIcon = () => {
    const { title, focused } = this.props;
    switch (translate(title)) {
      case translate('home_title'):
        return (
          <MaterialIcons
            name="home"
            size={RFValue(20)}
            color={focused ? "white" : "black"}
          />
        );
      case translate('message_title'):
        return (
          <MaterialIcons
            name="mail-outline"
            size={RFValue(20)}
            color={focused ? "white" : "black"}
          />
        );
      case translate('academics_title'):
        return (
          <MaterialIcons
            name="school"
            size={RFValue(20)}
            color={focused ? "white" : "black"}
          />
        );
      case translate('studentlife_title'):
        return (
          <MaterialIcons
            name="accessibility"
            size={RFValue(20)}
            color={focused ? "white" : "black"}
          />
        );
      case translate('bodwellexplained_title'):
        return (
          <MaterialIcons
            name="video-library"
            size={RFValue(20)}
            color={focused ? "white" : "black"}
          />
        );
      case translate('schoolcommunity_title'):
        return (
          <MaterialIcons
            name="people"
            size={RFValue(20)}
            color={focused ? "white" : "black"}
          />
        );
      case "My Account":
        return (
          <MaterialIcons
            name="receipt"
            size={RFValue(20)}
            color={focused ? "white" : "black"}
          />
        );
      case translate('setting_title'):
        return (
          <MaterialIcons
            name="settings"
            size={RFValue(20)}
            color={focused ? "white" : "black"}
          />
        );
      case translate('logout_title'):
        return (
          <MaterialIcons
            name="power-settings-new"
            size={RFValue(20)}
            color={focused ? "white" : "black"}
          />
        );
      default:
        return null;
    }
  };
  render() {
    const { focused, title } = this.props;
    // const { house } = this.state;

    if (title == 'logout_title') {
      return (
        <Block row flex style={styles.defaultStyle}>
          <Block middle flex={0.15} style={{ marginRight: 22 }}>
            {this.renderIcon()}
          </Block>
          <Block flex={0.85} style={{ justifyContent: "center" }}>
            <Text
              size={RFValue(14)}
              color={focused ? "white" : "black"}
              style={styles.fontFamilyBlack}
            >
              {translate(title).toUpperCase()}
            </Text>
          </Block>
          <Block middle flex={0.1} />
        </Block>
      );
    } else {
      return (
        <Block
          flex
          row
          style={[
            styles.defaultStyle,
            focused
              ? [
                styles.activeStyle,
                styles.shadow,
                { backgroundColor: "#512da8" }
              ]
              : null
          ]}
        >
          <Block middle flex={0.15} style={{ marginRight: 22 }}>
            {this.renderIcon()}
          </Block>
          <Block flex={0.85} style={{ justifyContent: "center" }}>
            <Text
              size={RFValue(14)}
              color={focused ? "white" : "black"}
              style={styles.fontFamilyBlack}
            >
              {translate(title).toUpperCase()}
            </Text>
          </Block>
          <Block middle flex={0.1} />
        </Block>
      );
    }
  }
}

export default DrawerItem;

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: width / 3 * 2
  },
  activeStyle: {
    // backgroundColor: materialTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  }
});
