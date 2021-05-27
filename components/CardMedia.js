import React from "react";
import { withNavigation } from "react-navigation";
import {
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ImageBackground
} from "react-native";
import { Thumbnail } from "react-native-thumbnail-video";
import { Block, Text, theme } from "galio-framework";

const { width } = Dimensions.get("screen");

class CardMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOpacity: 0.3,
      elevation: 5
    }
  }

  removeShadowOpacity = () => this.setState({ shadowOpacity: 0.1, elevation: 2 })

  setShadowOpacity = () => this.setState({ shadowOpacity: 0.3, elevation: 5 })

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
        onPress={() =>
          navigation.navigate(product.navigate, { param: product.param })}
        underlayColor={"#ecf0f1"}
        style={[styles.product, styles.shadow, style, { shadowOpacity: shadowOpacity, elevation: elevation }]}
        onShowUnderlay={() => this.removeShadowOpacity()}
        onHideUnderlay={() => this.setShadowOpacity()}
      >
        <Block flex row={horizontal} style={{ justifyContent: "center" }}>
          <Block flex style={[styles.imageContainer, styles.shadow]}>
            <Image source={{ uri: product.image }} style={imageStyles} />
          </Block>
          <Block flex space="between" style={styles.productDescription}>
            <Text size={14} style={styles.productTitle}>
              {product.title}
            </Text>
            <Text size={13} color={priceColor} numberOfLines={1}>
              {product.description}
            </Text>
            <Text size={12} muted={!priceColor} color={priceColor}>
              {product.duration}
            </Text>
          </Block>
        </Block>
      </TouchableHighlight>
    );
  }
}

export default withNavigation(CardMedia);

const styles = StyleSheet.create({
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    borderRadius: 5,
    minWidth: width - theme.SIZES.BASE * 2 - 10
  },
  productTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2
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
    height: 215,
    width: width - theme.SIZES.BASE * 3
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3
  }
});
