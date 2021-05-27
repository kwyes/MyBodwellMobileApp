import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import * as Font from 'expo-font';
import { createIconSet, MaterialIcons } from "@expo/vector-icons";

const glyphMap = {
  home: 59530,
  "mail-outline": 57569,
  school: 59404,
  accessibility: 59470,
  "video-library": 57418,
  people: 59387,
  "account-circle": 59475,
  settings: 59576,
  "power-settings-new": 59564,
  "star-border": 59450,
  person: 59389,
  list: 59542,
  "show-chart": 59105,
  "chevron-right": 58828,
  close: 58829,
  fingerprint: 59661,
  "date-range": 59670,
  "hourglass-empty": 59531,
  done: 59510,
  block: 57675,
  chat: 57527,
  today: 59615,
  "photo-library": 58387,
  description: 59507,
  "local-movies": 58701,
  group: 59375,
  "cast-connected": 58120,
  notifications: 59380,
  place: 58719,
  "access-time": 57746,
  restore: 59571,
  "report-problem": 59570,
  "sms-failed": 58918,
  "local-atm": 58686,
  restaurant: 58732,
  "more-vert": 58836,
  "insert-drive-file": 57933,
  "forward": 57684,
  "play-circle-filled": 57400,
  "share": 59405,
  "fiber-manual-record": 57441,
  dehaze: 58311,
  "keyboard-backspace": 58135,
  palette: 58378,
  public: 59403,
  "directions-run": 58726,
  "check-box": 59444,
  "check-box-outline-blank": 59445,
  "business": 57519,
  "arrow-drop-down": 58821,
  "keyboard-arrow-left": 58132,
  "movie": 57388,
  "event": 59512,
  "keyboard-arrow-right": 58133,
  "fiber-new": 57438,
  "priority-high": 58949,
  "attach-file": 57894,
  "receipt": 59568,
  "help-outline": 59645,
  "swap-horiz": 59604,
  "replay": 57410,
  "g-translate": 59687,
};
const CustomIcon = createIconSet(glyphMap, "MaterialIcons");

export default class MaterialIcon extends Component {
  state = {
    fontLoaded: false
  };

  async componentWillMount() {
    await Font.loadAsync({
      MaterialIcons: MaterialIcons
    });

    this.setState({ fontLoaded: true });
  }

  setIcon() {
    const { name, size, color, style } = this.props;
    return <CustomIcon name={name} size={size} color={color} style={style} />;
  }

  render() {
    const fontLoaded = this.state;
    if (!fontLoaded) {
      return null;
    }

    return this.setIcon();
  }
}

const styles = StyleSheet.create({});
