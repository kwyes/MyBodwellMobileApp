import React, { Component } from "react";
import { StyleSheet, Alert, Linking, Image, AsyncStorage } from "react-native";
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Button,
  ActionSheet,
  Root
} from "native-base";
import { Block, Text } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import { RFValue } from "react-native-responsive-fontsize";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

var BUTTONS = ["View", "Cancel"];
var CANCEL_INDEX = 2;

export default class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  async downloadFile(url) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      console.log(FileSystem.documentDirectory + "small.pdf");

      const file = await FileSystem.downloadAsync(url);

      // const assetLink = await MediaLibrary.createAssetAsync(file.uri);
      // console.log(file, assetLink);
      Alert.alert("File has been downloaded!");
    }
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  render() {
    return (
      <Root>
        <Block flex>
          <Container>
            <Content padder>
              <List>
                <ListItem thumbnail>
                  <Left>
                    <Image
                      source={require("../assets/images/pdfIcon.png")}
                      style={{ width: RFValue(30), height: RFValue(30) }}
                    />
                  </Left>
                  <Body>
                    <Text
                      style={[styles.fontFamilyBlack, styles.customFontSize14]}
                    >
                      {translate('importantdocuments_text_bsh')}
                    </Text>
                    <Text
                      note
                      numberOfLines={1}
                      style={[styles.fontFamilyBlack, styles.customFontSize14]}
                    >
                      Spring 2020
                    </Text>
                  </Body>
                  <Right>
                    <Button
                      transparent
                      onPress={() =>
                        ActionSheet.show(
                          {
                            options: BUTTONS,
                            cancelButtonIndex: CANCEL_INDEX,
                            title: "Options"
                          },
                          buttonIndex => {
                            if (buttonIndex == 0) {
                              Linking.openURL(
                                "https://mychild.bodwell.edu/assets/file/Bodwell Handbook - Spring 2020.pdf"
                              );
                            }
                          }
                        )}
                    >
                      <Text>
                        <MaterialIcons name="more-vert" size={28} />
                      </Text>
                    </Button>
                  </Right>
                </ListItem>

                {/* <ListItem thumbnail>
                  <Left>
                    <Image
                      source={require("../assets/images/pdfIcon.png")}
                      style={{ width: RFValue(30), height: RFValue(30) }}
                    />
                  </Left>
                  <Body>
                    <Text
                      style={[styles.fontFamilyBlack, styles.customFontSize14]}
                    >
                      Important Dates and Reminders
                    </Text>
                    <Text
                      note
                      numberOfLines={1}
                      style={[styles.fontFamilyBlack, styles.customFontSize14]}
                    >
                      Summer 2019
                    </Text>
                  </Body>
                  <Right>
                    <Button
                      transparent
                      onPress={() =>
                        ActionSheet.show(
                          {
                            options: BUTTONS,
                            cancelButtonIndex: CANCEL_INDEX,
                            title: "Options"
                          },
                          buttonIndex => {
                            if (buttonIndex == 0) {
                              Linking.openURL(
                                "https://mychild.bodwell.edu/assets/file/Important Dates and Reminders - Summer 2019.pdf"
                              );
                            }
                          }
                        )}
                    >
                      <Text>
                        <MaterialIcons name="more-vert" size={28} />
                      </Text>
                    </Button>
                  </Right>
                </ListItem> */}
              </List>
            </Content>
          </Container>
        </Block>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  fontFamilyBlack: {
    fontFamily: "Black"
  },
  customFontSize14: {
    fontSize: RFValue(14)
  }
});
