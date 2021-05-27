import React from "react";
import { ScrollView, StyleSheet, Platform, Dimensions } from "react-native";
import { Block, Text, theme, Input, Button } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

import { materialTheme } from "../constants/";
import { HeaderHeight } from "../constants/utils";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
const PUSH_ENDPOINT = "https://your-server.com/users/push-token";

const { height, width } = Dimensions.get("window");

export default class Agreement extends React.Component {
  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
  };

  componentDidMount() {
    this.registerForPushNotificationsAsync();
  }

  render() {
    const { navigation } = this.props;
    return (
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0.25, y: 1.1 }}
        locations={[0.2, 1]}
        colors={["#8E76C6", "#673AB7"]}
        style={[{ flex: 1, paddingTop: theme.SIZES.BASE * 4 }]}
      >
        <Block flex center>
          <Block center>
            <Text h2 style={styles.title}>
              WELCOME
            </Text>
            <Text h3 style={styles.title}>
              TO MY BODWELL
            </Text>
          </Block>
          <Block flex style={styles.container}>
            <Block center>
              <Text h5 style={styles.textDecoration}>
                AGREEMENT
              </Text>
              <ScrollView
                contentContainerStyle={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                <Text>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum. Lorem
                  Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry's standard dummy
                  text ever since the 1500s, when an unknown printer took a
                  galley of type and scrambled it to make a type specimen book.
                  It has survived not only five centuries, but also the leap
                  into electronic typesetting, remaining essentially unchanged.
                  It was popularised in the 1960s with the release of Letraset
                  sheets containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </Text>
              </ScrollView>
              <Block style={styles.buttonContainer} center middle>
                <Button
                  shadowless
                  middle
                  color={materialTheme.COLORS.BUTTON_COLOR}
                  style={styles.button}
                >
                  DISAGREE
                </Button>
                <Button
                  shadowless
                  middle
                  color={materialTheme.COLORS.BUTTON_COLOR}
                  style={styles.button}
                  onPress={() => navigation.navigate("login")}
                >
                  AGREE
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  agreements: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0
  },
  container: {
    width: width - 50,
    marginTop: 50,
    marginBottom: 50,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5
  },
  buttonContainer: {
    flexDirection: "row",
    width: width - 50,
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    shadowOpacity: 0.4,
    elevation: 3
  },
  button: {
    width: 140,
    height: 48,
    marginLeft: 5,
    marginRight: 5
  },
  title: {
    color: "white"
  },
  textDecoration: {
    textDecorationLine: "underline",
    marginBottom: 10
  },
  scrollView: {
    flexGrow: 1
    // paddingBottom: 60
  }
});
