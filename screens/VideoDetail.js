import React from "react";
import { StyleSheet, Dimensions, AsyncStorage } from "react-native";
import { Block, Text } from "galio-framework";
import { CustomVideoV2 } from "../components";
import { RFValue } from "react-native-responsive-fontsize";
import { VideoTitleFormat } from "../components/VideoTitleFormat";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const { width } = Dimensions.get("window");

export default class VideoDetail extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    obj = new GoogleAnalytics;
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  render() {
    const videoInf = this.params.param;
    const detail = videoInf.id;
    const title = videoInf.name;
    const date = videoInf.default["Date Created"].substring(0, 10);
    const description = videoInf.description;
    const videouri =
      "https://bodwell.canto.com/download/video/" + detail + "/original";

    obj._videoPlayEvent(VideoTitleFormat(title));

    return (
      <Block flex center style={styles.container}>
        <Block style={styles.videoContainer} flex={0.35}>
          <Block flex row>
            <CustomVideoV2 videouri={videouri} />
          </Block>
        </Block>
        <Block flex style={styles.textContainer} flex={0.65}>
          <Block style={styles.titleContainer} flex={0.2}>
            <Text style={[styles.customH5, styles.fontFamilyHeavy]}>
              {VideoTitleFormat(title)}
            </Text>
          </Block>
          <Block flex={0.08}>
            <Text size={RFValue(12)} style={styles.fontFamilyMedium}>
              Published on {date}
            </Text>
          </Block>
          <Block style={styles.descriptionContainer}>
            <Text size={RFValue(12)} style={styles.fontFamilyMedium}>
              {description}
            </Text>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  videoContainer: {
    width: width
  },
  textContainer: {
    width: width - 30
  },
  titleContainer: {
    justifyContent: "center"
  },
  descriptionContainer: {
    marginTop: 10
  },
  customH5: {
    fontSize: RFValue(20)
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  },
  fontFamilyMedium: {
    fontFamily: "Medium"
  }
});
