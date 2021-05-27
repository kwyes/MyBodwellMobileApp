import React, { Component } from "react";
import { StyleSheet, ImageBackground, Dimensions } from "react-native";
import { Block, Text } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const { height, width } = Dimensions.get("window");

export default class Account extends React.Component {
  render() {
    const { navigation } = this.props

    return (
      <Block style={styles.container}>
        <Block style={styles.headerWrapper}>
          <Text style={[styles.HeaderTxt, styles.fontFamilyBlack]}>MY ACCOUNT</Text>
        </Block>
        <Block style={{ width: width }} center>
          <Block style={styles.subheaderWrapper}>
            <Text style={[styles.HeaderSubTxt, styles.fontFamilyMedium]}>
              My payment history, outstanding balance, fee reminders and more.
          </Text>
          </Block>
        </Block>
        <ImageBackground
          source={require("../assets/images/account.png")}
          style={styles.buttonContainer}
        >
          <Block style={styles.flexitem} row>
            <Block flex={0.3} right>
              <MaterialIcons name="local-atm" size={RFValue(36)} color="#443567" />
            </Block>
            <Block flex={0.7}>
              <Text
                style={[styles.flexitemTxt, styles.fontFamilyHeavy]}
                onPress={() => navigation.navigate("outstandingBalance")}
              >
                OUTSTANDING{"\n"}BALANCE
              </Text>
            </Block>

          </Block>
          {/* <Block style={styles.flexitem} row>
            <Block flex={0.3} right>
              <MaterialIcons name="priority-high" size={RFValue(36)} color="#443567" />
            </Block>
            <Block flex={0.7}>
              <Text
                style={[styles.flexitemTxt, styles.fontFamilyHeavy]}
                onPress={() => navigation.navigate("feeReminders")}
              >
                FEE{"\n"}REMINDERS
              </Text>
            </Block>
          </Block> */}
          <Block style={styles.flexitem} row>
            <Block flex={0.3} right>
              <MaterialIcons name="restore" size={RFValue(36)} color="#443567" />
            </Block>
            <Block flex={0.7}>
              <Text
                style={[styles.flexitemTxt, styles.fontFamilyHeavy]}
                onPress={() => navigation.navigate("paymentHistory")}
              >
                PAYMENT{"\n"}HISTORY
              </Text>
            </Block>
          </Block>
          <Block style={styles.flexitem} row>
            <Block flex={0.3} right>
              <MaterialIcons name="receipt" size={RFValue(36)} color="#443567" />
            </Block>
            <Block flex={0.7}>
              <Text
                style={[styles.flexitemTxt, styles.fontFamilyHeavy]}
                onPress={() => navigation.navigate("activityPayments")}
              >
                ACTIVITY{"\n"}PAYMENTS
              </Text>
            </Block>
          </Block>
          {/* <Block style={styles.flexitem} row>
            <Block flex={0.3} right>
              <MaterialIcons name="mail-outline" size={RFValue(36)} color="#443567" />
            </Block>
            <Block flex={0.7}>
              <Text
                style={[styles.flexitemTxt, styles.fontFamilyHeavy]}
                onPress={() => navigation.navigate("letterOfAcceptance")}
              >
                LETTER OF{"\n"}ACCEPTANCE
                </Text>
            </Block>
          </Block> */}
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
    color: "#443567",
    fontSize: RFValue(25),
    textAlign: "center",
    fontFamily: "Black"
  },
  HeaderSubTxt: {
    color: "#443567",
    fontSize: RFValue(14),
    textAlign: "center",
    fontFamily: "Medium"
  },
  buttonContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  flexitem: {
    flexBasis: "50%",
    height: height / 10,
    alignItems: "center",
    justifyContent: "center"
  },
  flexitemTxt: {
    fontSize: RFValue(14),
    color: "#443567",
    textAlign: "left",
    marginLeft: 5
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
  },
  fontFamilyRoman: {
    fontFamily: "Roman"
  },
  fontFamilyMedium: {
    fontFamily: "Medium"
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  }
});
