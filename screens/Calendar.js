import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  AsyncStorage,
  Alert
} from "react-native";
import { Icon } from "../components";
import { Block, Button, Input, theme } from "galio-framework";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Body,
  Text
} from "native-base";

export default class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
      eventObj: {}
    };
  }
  render() {
    const calendarTheme = {
      backgroundColor: "#f1f2f6",
      calendarBackground: "#ffffff",
      textSectionTitleColor: "#b6c1cd",
      selectedDayBackgroundColor: "#5dc8b4",
      selectedDayTextColor: "#ffffff",
      todayTextColor: "#5dc8b4",
      dayTextColor: "#2d4150",
      textDisabledColor: "#d9e1e8",
      dotColor: "#5dc8b4",
      selectedDotColor: "#ffffff",
      arrowColor: "orange",
      monthTextColor: "#5dc8b4",
      textMonthFontWeight: "bold",
      textDayFontSize: 14,
      textMonthFontSize: 16,
      textDayHeaderFontSize: 14
    };
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems.bind(this)}
        renderItem={this.renderItem.bind(this)}
        renderEmptyData={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
        theme={{
          ...calendarTheme
        }}
        style={{}}
      />
    );
  }

  async componentDidMount() {
    var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    var Source = await AsyncStorage.getItem("Source");
    this._getEvent(CurrentSemester, Source);
  }

  _getEvent = (CurrentSemester, Source) => {
    fetch(`https://api-m.bodwell.edu/api/event/${CurrentSemester}/${Source}`)
      .then(response => response.json())
      .then(json => {
        if (json != null) {
          if (json.status == 1) {
            this.setState({
              eventObj: json["data"]
            });
          } else {
            console.log(json.message);
          }
        }
      });
  };

  loadItems(day) {
    const { eventObj } = this.state;
    setTimeout(() => {
      for (var i = 0; i < eventObj.length; i++) {
        var strTime = eventObj[i].SDate;
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          this.state.items[strTime].push({
            name: eventObj[i].Title
          });
        }
      }
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems,
        height: 50
      });
    }, 1000);
  }

  renderItem(item) {
    return (
      <Card style={[styles.item, { height: item.height }]}>
        <CardItem>
          <Body>
            <Text style={styles.fontFamilyHeavy}>
              {item.name}
            </Text>
          </Body>
        </CardItem>
      </Card>
    );
  }

  renderEmptyDate() {
    return (
      <Card>
        <CardItem>
          <Body>
            <Text style={styles.fontFamilyHeavy}>No Event</Text>
          </Body>
        </CardItem>
      </Card>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }
}

const styles = StyleSheet.create({
  eventContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  },
  fontFamilyHeavy: {
    fontFamily: "Heavy"
  }
});
