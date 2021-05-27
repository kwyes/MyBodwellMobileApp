import React, { Component } from "react";
import {
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Dimensions,
  AsyncStorage
} from "react-native";
import { Block, Text } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const { width } = Dimensions.get("screen");

export default class Explained extends React.Component {

  componentDidMount() {
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  render() {
    const { navigation } = this.props;
    return (
      <Block style={styles.container}>
        <Block style={styles.headerWrapper}>
          <Text style={[styles.HeaderTxt, styles.fontFamilyBlack]}>
            {translate('bodwellexplained_text_lab')}
          </Text>
        </Block>
        <Block style={{ width: width }} center>
          <Block style={styles.subheaderWrapper}>
            <Text style={[styles.HeaderSubTxt, styles.fontFamilyMedium]}>
              {translate('bodwellexplained_text_avlt')}
            </Text>
          </Block>
        </Block>
        <ImageBackground
          source={require("../assets/images/explained.png")}
          style={styles.buttonContainer}
        >
          <Block style={styles.flexitem} row>
            <Block flex={0.2}>
              <MaterialIcons name="school" size={RFValue(39)} color="#c43200" />
            </Block>
            <Block flex={0.8} style={{ alignItems: "center" }}>
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate("explainList", { param: 1 })}
              >
                <Block>
                  <Text style={[styles.flexitemTxt, styles.fontFamilyHeavy]}>
                    {translate('bodwellexplained_text_academics')}{" "}
                  </Text>
                  <Text style={[styles.flexitemTxt2, styles.fontFamilyMedium]}>
                    {translate('bodwellexplained_text_video')}
                  </Text>
                </Block>
              </TouchableWithoutFeedback>
            </Block>
          </Block>
          <Block style={styles.flexitem} row>
            <Block flex={0.2}>
              <MaterialIcons
                name="accessibility"
                size={RFValue(40)}
                color="#c43200"
              />
            </Block>
            <Block flex={0.8} style={{ alignItems: "center" }}>
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate("explainList", { param: 2 })}
              >
                <Block>
                  <Text style={[styles.flexitemTxt, styles.fontFamilyHeavy]}>
                    {translate('bodwellexplained_text_studentlife')}{" "}
                  </Text>
                  <Text style={[styles.flexitemTxt2, styles.fontFamilyMedium]}>
                    {translate('bodwellexplained_text_video')}
                  </Text>
                </Block>
              </TouchableWithoutFeedback>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  headerWrapper: {
    paddingVertical: 20
  },
  subheaderWrapper: {
    maxWidth: width * 0.75,
    paddingBottom: 30
  },
  HeaderTxt: {
    color: "#c43200",
    fontSize: RFValue(22),
    textAlign: "center"
  },
  HeaderSubTxt: {
    color: "#c43200",
    fontSize: RFValue(15),
    textAlign: "center"
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  flexitem: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    width: "50%"
  },
  flexitemTxt: {
    fontSize: RFValue(20),
    color: "#c43200",
    textAlign: "left",
    marginLeft: 8
  },
  flexitemTxt2: {
    fontSize: RFValue(15),
    color: "#c43200",
    textAlign: "left",
    marginLeft: 8
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  },
  fontFamilyMedium: {
    fontFamily: "Medium"
  }
});
