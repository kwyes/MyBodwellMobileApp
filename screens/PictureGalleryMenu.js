import React, { Component } from "react";
import { StyleSheet, ImageBackground, Dimensions, AsyncStorage } from "react-native";
import { Block, Text } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const { height, width } = Dimensions.get("window");

export default class PictureGalleryMenu extends Component {

  componentDidMount() {
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  render() {
    const { navigation } = this.props;
    return (
      <Block style={styles.container}>
        <Block style={styles.headerWrapper}>
          <Text style={[styles.HeaderTxt, styles.fontFamilyBlack]}>
            {translate('picturegallery_text_picturegallery')}
          </Text>
        </Block>
        <Block style={{ width: width }} center>
          <Block style={styles.subheaderWrapper}>
            <Text style={[styles.HeaderSubTxt, styles.fontFamilyMedium]}>
              {translate('picturegallery_text_pavg')}
            </Text>
          </Block>
        </Block>
        <ImageBackground
          source={require("../assets/images/pictureGallery.png")}
          style={styles.buttonContainer}
        >
          <Block style={styles.flexitem} row>
            <Block flex={0.3} right>
              <MaterialIcons
                name="business"
                size={RFValue(36)}
                color="#226200"
              />
            </Block>
            <Block flex={0.7}>
              <Text
                style={[styles.flexitemTxt, styles.fontFamilyHeavy]}
                onPress={() => navigation.navigate("campusGallery")}
              >
                {translate('picturegallery_text_campusphotos')}
              </Text>
            </Block>
          </Block>
          <Block style={styles.flexitem} row>
            <Block flex={0.3} right>
              <MaterialIcons
                name="accessibility"
                size={RFValue(36)}
                color="#226200"
              />
            </Block>
            <Block flex={0.7}>
              <Text
                style={[styles.flexitemTxt, styles.fontFamilyHeavy]}
                onPress={() => navigation.navigate("studentGallery")}
              >
                {translate('picturegallery_text_studentlife')}
              </Text>
            </Block>
          </Block>
          <Block style={styles.flexitem} row>
            <Block flex={0.3} right>
              <MaterialIcons name="event" size={RFValue(36)} color="#226200" />
            </Block>
            <Block flex={0.7}>
              <Text
                style={[styles.flexitemTxt, styles.fontFamilyHeavy]}
                onPress={() => navigation.navigate("weeklyGallery")}
              >
                {translate('picturegallery_text_btw')}
              </Text>
            </Block>
          </Block>
          <Block style={styles.flexitem} row>
            <Block flex={0.3} right>
              <MaterialIcons name="person" size={RFValue(36)} color="#226200" />
            </Block>
            <Block flex={0.7}>
              <Text
                style={[styles.flexitemTxt, styles.fontFamilyHeavy]}
                onPress={() => navigation.navigate("bruinsGallery")}
              >
                {translate('picturegallery_text_bodwellbruins')}
              </Text>
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
    width: width * 0.75,
    paddingBottom: 30
  },
  HeaderTxt: {
    color: "#226200",
    fontSize: RFValue(25),
    textAlign: "center"
  },
  HeaderSubTxt: {
    color: "#226200",
    fontSize: RFValue(14),
    textAlign: "center"
  },
  buttonContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  flexitem: {
    flexBasis: "50%",
    height: height / 10,
    justifyContent: "center",
    alignItems: "center"
  },
  flexitemTxt: {
    fontSize: RFValue(14),
    color: "#226200",
    textAlign: "left",
    marginLeft: 5
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
