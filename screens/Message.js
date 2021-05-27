import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
  AsyncStorage
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import { Block } from "galio-framework";

const { width, height } = Dimensions.get("window");


export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgList: [],
      today: null,
      refreshing: false
    };
  }

  async componentDidMount() {
    var Source = await AsyncStorage.getItem("Source");
    this._getMessageList(Source);
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  _getMessageList(Source) {
    fetch(`https://api-m.bodwell.edu/api/messageList/app_notify/${Source}`)
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          var tmpArr = [];
          var today = moment(new Date()).format("L");

          console.log(json)
          for (let i = 0; i < json.data.length; i++) {
            if (json.data[i].ToFrontPage == '0') {
              var cDate = moment(json.data[i].PublishDate).format("L");
              var isNew = false;
              if (cDate == today) {
                isNew = true;
              }

              tmpArr.push({
                messageId: json.data[i].MessageID,
                title: json.data[i].Subject,
                date: json.data[i].PublishDate,
                body: json.data[i].Body,
                category: json.data[i].MsgCategory,
                alert: json.data[i].Alert,
                alertLevel: json.data[i].AlertLevel,
                attachment: json.data[i].Attachment,
                staffId: json.data[i].FromStaffID,
                isNew: isNew,
                bodyHTML: json.data[i].BodyHTML
              });
            }
          }
          this.setState({
            msgList: tmpArr,
            today: today
          });
        } else {
          console.log(json.message);
        }
      });
  }

  redirectMessageDetail = data => {
    const { navigation } = this.props;
    navigation.navigate("messageDetail", { param: data });
  };

  dateFormat(date) {
    return moment(date).format("MMM Do") + "\n" + moment(date).format("LT");
    // return moment(date).calendar();
  }

  _onRefresh() {
    this._getMessageList();
  }

  render() {
    const { msgList, today, refreshing } = this.state;

    return (
      <Container>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                this._onRefresh();
              }}
            />
          }
        >
          <List>
            {msgList.map((rowData, index) =>
              <ListItem
                avatar
                onPress={() => this.redirectMessageDetail(rowData)}
                key={index}
              >
                <Left style={styles.thumbnailContainer}>
                  <Thumbnail
                    source={{
                      uri:
                        "https://asset.bodwell.edu/OB4mpVpg/staff/" +
                        rowData.staffId +
                        ".jpg"
                    }}
                    style={styles.photo}
                  />
                </Left>
                <Body>
                  <View style={styles.categoryContainer}>
                    <MaterialIcons name="chat" size={14} color={"red"} />
                    <Text style={[styles.categoryText, styles.fontFamilyHeavy]}>
                      {rowData.category}
                    </Text>
                  </View>

                  <Text
                    numberOfLines={1}
                    style={[styles.fontFamilyBook, styles.customFontSize16]}
                  >
                    {rowData.title}
                  </Text>
                  <Text
                    note
                    numberOfLines={1}
                    style={[styles.fontFamilyBook, styles.customFontSize14]}
                  >
                    {rowData.body}
                  </Text>
                </Body>
                <Right style={{ justifyContent: "space-between" }}>
                  <Block row>
                    {rowData.isNew
                      ? <MaterialIcons
                        name="fiber-new"
                        size={18}
                        color={"orange"}
                      />
                      : <Text />}
                    {rowData.alertLevel == "H"
                      ? <MaterialIcons
                        name="priority-high"
                        size={18}
                        color={"red"}
                      />
                      : <Text />}
                    {rowData.attachment == "1"
                      ? <MaterialIcons
                        name="attach-file"
                        size={18}
                        color={"#3e3255"}
                      />
                      : <Text />}
                  </Block>
                  <Text
                    note
                    style={[
                      styles.fontFamilyBook,
                      styles.customFontSize12,
                      { textAlign: "right" }
                    ]}
                  >
                    {this.dateFormat(rowData.date)}
                  </Text>
                </Right>
              </ListItem>
            )}
          </List>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    width: height / 13,
    height: height / 13,
    borderRadius: height / 26
  },
  categoryContainer: {
    alignSelf: "flex-start",
    flexDirection: "row"
  },
  categoryText: {
    fontSize: RFValue(10),
    color: "red",
    paddingLeft: 2
  },
  thumbnailContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  },
  fontFamilyBook: {
    fontFamily: "Book"
  },
  customFontSize16: {
    fontSize: RFValue(16)
  },
  customFontSize14: {
    fontSize: RFValue(14)
  },
  customFontSize12: {
    fontSize: RFValue(12)
  }
});
