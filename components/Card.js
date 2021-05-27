import React from "react";
import { withNavigation } from "react-navigation";
import {
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  ImageBackground
} from "react-native";
import { Block, Text, theme } from "galio-framework";

const { width } = Dimensions.get("screen");

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOpacity: 0.3,
      elevation: 5
    };
  }

  _createDescription(code) {
    const { product, priceColor } = this.props;
    let description = [];

    switch (code) {
      case 0:
        // Academic NON-Credit
        description.push(
          <Block key={product.key}>
            {/* <Text size={12} style={styles.productTitle} color={priceColor}>
              Non-Credit Course
            </Text> */}
            <Text size={12} style={styles.productTitle} color={priceColor}>
              Late/Absent: {product.lateAbsent}
            </Text>
            <Text size={12} style={styles.productTitle} color={priceColor}>
              Teacher: {product.teacher}
            </Text>
          </Block>
        );
        break;
      case 1:
        // Academic Credit
        description.push(
          <Block key={product.key}>
            <Text size={12} style={styles.productTitle} color={priceColor}>
              Grade: {product.grade}
            </Text>
            <Text size={12} style={styles.productTitle} color={priceColor}>
              Credit: {product.credit}
            </Text>
            <Text size={12} style={styles.productTitle} color={priceColor}>
              Late/Absent: {product.lateAbsent}
            </Text>
            <Text size={12} style={styles.productTitle} color={priceColor}>
              Teacher: {product.teacher}
            </Text>
          </Block>
        );
        break;
      default:
        break;
    }

    return description;
  }

  removeShadowOpacity = () =>
    this.setState({ shadowOpacity: 0.1, elevation: 2 });

  setShadowOpacity = () => this.setState({ shadowOpacity: 0.3, elevation: 5 });

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
            navigation.navigate(product.navigate, { param: product.param })}
          underlayColor={"#ecf0f1"}
          style={{ borderRadius: 3 }}
          onShowUnderlay={() => this.removeShadowOpacity()}
          onHideUnderlay={() => this.setShadowOpacity()}
        >
          <Block>
            <Block flex style={[styles.imageContainer, styles.shadow]}>
              <ImageBackground
                source={product.image}
                style={imageStyles}
                imageStyle={{ borderRadius: 3 }}
              >
                <Block style={styles.imageFilter} />
                <Block style={styles.title}>
                  <Text color={"#34495e"}>
                    {product.title}
                  </Text>
                </Block>
              </ImageBackground>
            </Block>
            {/* </TouchableHighlight>
        <TouchableHighlight
          onPress={() =>
            navigation.navigate(product.navigate, { param: product.param })}
        > */}
            <Block flex space="between" style={styles.productDescription}>
              {this._createDescription(product.code)}
            </Block>
          </Block>
        </TouchableHighlight>
      </Block>
    );
  }
}

export default withNavigation(Card);

const styles = StyleSheet.create({
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    maxWidth: width / 2 - 25
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
    shadowOffset: { width: 0.5, height: 2 },
    shadowRadius: 3
  },
  imageFilter: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 3,
    opacity: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    paddingHorizontal: theme.SIZES.BASE / 2
  }
});
