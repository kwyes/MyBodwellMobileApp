import React, { Component } from "react";
import { StyleSheet, Dimensions, ScrollView, SafeAreaView } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import HTML from "react-native-render-html";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("screen");

export default class ListAvatarExample extends Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  dateFormat(date) {
    return moment(date).format("ll") + "\n" + moment(date).format("LT");
  }

  render() {
    var data = this.params.param;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollview}
          showsVerticalScrollIndicator={false}
        >
          <Block row space="between" style={styles.headContainer}>
            <Block style={styles.categoryContainer}>
              <MaterialIcons name="chat" size={RFValue(20)} color={"red"} />
              <Text style={[styles.categoryText, styles.fontFamilyHeavy]}>
                {data.category}
              </Text>
            </Block>
            <Block>
              <Text
                muted
                size={RFValue(12)}
                style={[styles.fontFamilyHeavyOblique, { textAlign: "right" }]}
              >
                {this.dateFormat(data.date)}
              </Text>
            </Block>
          </Block>
          <Block>
            <Text style={[styles.fontFamilyHeavy, styles.customH5]}>
              {data.title}
            </Text>

            <Block style={styles.body}>
              {data.bodyHTML
                ? <HTML html={data.bodyHTML} imagesMaxWidth={width} />
                : <Block />}
            </Block>
          </Block>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  headContainer: {
    width: width - theme.SIZES.BASE * 3,
    marginVertical: 20,
    alignItems: "center"
  },
  body: {
    marginVertical: 20
  },
  scrollview: {
    flexGrow: 1,
    width: width - theme.SIZES.BASE * 3,
    alignItems: "center"
  },
  categoryContainer: {
    alignSelf: "center",
    flexDirection: "row"
  },
  categoryText: {
    fontSize: RFValue(16),
    color: "red",
    paddingLeft: 2
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  },
  fontFamilyHeavyOblique: {
    fontFamily: "HeavyOblique"
  },
  customH5: {
    fontSize: RFValue(20)
  }
});
