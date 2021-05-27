import React, { Component } from "react";
import { StyleSheet } from "react-native";
import TextTicker from 'react-native-text-ticker'
import { RFValue } from "react-native-responsive-fontsize"

export default class MovingText extends Component {
  render() {
    return (
      <TextTicker
        style={styles.fontStyle}
        loop
        bounce
        scrollingSpeed={1000}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et enim et erat dictum pellentesque. Praesent laoreet tellus sed congue lobortis. Duis viverra sem et tempus bibendum. Vestibulum porta pretium ligula quis consectetur. Donec mollis ac tellus in consectetur. Ut nec ex ex. Nunc varius justo ac vehicula volutpat. Cras vitae ultricies justo. Donec tempor consequat augue vel imperdiet. Fusce hendrerit placerat efficitur.
      </TextTicker>
    );
  }
}

const styles = StyleSheet.create({
  fontStyle: {
    fontFamily: "Roman",
    fontSize: RFValue(20)
  }
});
