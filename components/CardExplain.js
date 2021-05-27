import React from "react";
import { withNavigation } from "react-navigation";
import {
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ImageBackground,
  Share
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { RFValue } from "react-native-responsive-fontsize";

const { width, height } = Dimensions.get("screen");

class CardExplain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOpacity: 0.3,
      elevation: 5,
      fileUrl: null
    };
  }

  removeShadowOpacity = () =>
    this.setState({ shadowOpacity: 0.1, elevation: 2 });

  setShadowOpacity = () => this.setState({ shadowOpacity: 0.3, elevation: 5 });

  onShare = async () => {
    try {
      const { product } = this.props;
      const { fileUrl } = this.state;

      const result = await Share.share({
        message: "Shared from My Bodwell App.",
        url:
          "https://bodwell.canto.com/download/video/" +
          product.param.id +
          "/original",
        title: "Wow, did you see that?",
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
      <Block
        row={horizontal}
        card
        flex
        style={[
          styles.product,
          styles.shadow,
          style,
          { shadowOpacity: shadowOpacity, elevation: elevation }
        ]}
      >
        <TouchableHighlight
          onPress={() =>
            navigation.navigate(product.navigate, {
              param: product.param,
              colorTheme: product.colorTheme,
              category: product.category
            })}
          underlayColor={"#ecf0f1"}
          style={{ borderRadius: 3 }}
          onShowUnderlay={() => this.removeShadowOpacity()}
          onHideUnderlay={() => this.setShadowOpacity()}
        >
          <Block>
            <Block flex style={[styles.imageContainer, styles.shadow]}>
              <ImageBackground
                source={{ uri: product.image }}
                style={styles.fullImage}
                imageStyle={{ borderRadius: 3 }}
              >
                <Block style={styles.imageFilter} />
                <Block style={styles.durationContainer}>
                  <Text color={"white"} style={styles.customFontSize14}>
                    {product.duration}
                  </Text>
                </Block>
              </ImageBackground>
            </Block>
            <Block flex style={styles.productDescription}>
              <Block>
                <Text
                  style={[
                    styles.titleText,
                    { color: product.colorTheme },
                    styles.fontFamilyHeavy
                  ]}
                >
                  {product.title}
                </Text>
              </Block>
              <Block style={styles.metaContainer} row>
                <TouchableHighlight onPress={this.onShare}>
                  <MaterialIcons
                    name="share"
                    size={RFValue(22)}
                    color={product.colorTheme}
                  />
                </TouchableHighlight>
                <Text
                  style={[
                    styles.marginLeft10,
                    { color: product.colorTheme },
                    styles.fontFamilyMedium,
                    styles.customFontSize14
                  ]}
                >
                  meta
                </Text>
              </Block>
            </Block>
          </Block>
        </TouchableHighlight>
      </Block>
    );
  }
}

export default withNavigation(CardExplain);

const styles = StyleSheet.create({
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: width * 0.8,
    borderRadius: 5
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
    justifyContent: "space-around",
    alignItems: "center",
    height: width * 0.3,
    width: width - theme.SIZES.BASE * 3
  },
  imageContainer: {
    elevation: 1
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16
  },
  horizontalImage: {
    height: 122,
    width: "auto"
  },
  fullImage: {
    height: width * 0.5,
    width: width - theme.SIZES.BASE * 3
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3
  },
  durationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    borderRadius: 3,
    padding: theme.SIZES.BASE / 2
  },
  titleText: {
    fontSize: RFValue(18)
  },
  metaContainer: {
    width: width - theme.SIZES.BASE * 3,
    paddingHorizontal: 10
  },
  marginLeft10: {
    marginLeft: 10
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  },
  fontFamilyHeavyOblique: {
    fontFamily: "HeavyOblique"
  },
  fontFamilyRoman: {
    fontFamily: "Roman"
  },
  fontFamilyMedium: {
    fontFamily: "Medium"
  },
  customH4: {
    fontSize: RFValue(24)
  },
  customH5: {
    fontSize: RFValue(20)
  },
  customFontSize14: {
    fontSize: RFValue(14)
  },
  customFontSize12: {
    fontSize: RFValue(12)
  },
  customFontSize10: {
    fontSize: RFValue(10)
  }
});
