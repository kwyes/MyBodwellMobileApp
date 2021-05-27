import React from "react";
import { withNavigation } from "react-navigation";
import {
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Share,
  Image
} from "react-native";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { Block, Text, theme } from "galio-framework";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("screen");

class CustomCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOpacity: 0.3,
      elevation: 5,
      fileUrl: null
    }
  }

  removeShadowOpacity = () => this.setState({ shadowOpacity: 0.1, elevation: 2 })

  setShadowOpacity = () => this.setState({ shadowOpacity: 0.3, elevation: 5 })

  onShare = async () => {
    try {
      const { product } = this.props;
      const { fileUrl } = this.state;

      const result = await Share.share({
        message:
          'Shared from My Bodwell App.',
        url: "https://bodwell.canto.com/download/video/" + product.param.id + "/original",
        title: 'Wow, did you see that?',
        subject: "test"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    const {
      navigation,
      product,
      horizontal,
      full,
      style,
      priceColor,
      imageStyle
    } = this.props;
    const { shadowOpacity, elevation } = this.state;
    const imageStyles = [
      styles.image,
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle
    ];

    return (
      <TouchableHighlight
        onPress={() => navigation.navigate(product.navigate, { param: product.param, colorTheme: product.colorTheme, category: product.category })}
        underlayColor={"#ecf0f1"}
        style={[styles.container, styles.shadow]}
      >
        <Block>
          <Image source={{ uri: product.image }} style={{ height: 200 }} />
          <Block style={styles.durationContainer}>
            <Block style={styles.durationTextContainer}>
              <Text color={"white"}>{product.duration}</Text>
            </Block>
          </Block>
          <Block style={styles.descContainer} center middle>
            <Image source={require("../assets/images/icon.png")} style={{ width: 50, height: 50, borderRadius: 25 }} />
            <Block style={styles.videoDetails}>
              <Text numberOfLines={2} style={[styles.videoTitle, styles.fontFamilyMedium]}>{product.title}</Text>
              <Text style={[styles.videoStats, styles.fontFamilyMedium]} muted>{moment(product.param.default["Date Created"], "YYYYMMDD").fromNow()}</Text>
            </Block>
            <Block style={{ paddingHorizontal: 5, height: "100%" }}>
              <TouchableHighlight onPress={this.onShare}>
                <MaterialIcons name="share" size={18} color={theme.COLORS.MUTED} />
              </TouchableHighlight>
            </Block>
          </Block>
        </Block>
      </TouchableHighlight>
    );
  }
}

export default withNavigation(CustomCard);

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: width,
    maxWidth: 350,
    height: 310,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  durationContainer: {
    position: "absolute",
    height: 200,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    padding: 10
  },
  durationTextContainer: {
    backgroundColor: "black",
    opacity: 0.8,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 2
  },
  descContainer: {
    flexDirection: 'row',
    paddingTop: 15
  },
  videoTitle: {
    fontSize: 15,
    color: '#3c3c3c'
  },
  videoDetails: {
    paddingHorizontal: 15,
    flex: 1
  },
  videoStats: {
    fontSize: 13,
    paddingTop: 3
  },
  fontFamilyMedium: {
    fontFamily: "Medium"
  },
  shadow: {
    // shadowColor: theme.COLORS.BLACK,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 3,
    // elevation: 0.1
  }
});
