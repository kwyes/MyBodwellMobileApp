import React, { Component } from "react";
import { StyleSheet, Alert, View, Text, WebView } from "react-native";



export default class DocumentsView extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          bounces={false}
          scrollEnabled={false}
          source={{ uri: 'https://mychild.bodwell.edu/assets/file/Bodwell Handbook - Fall 2019.pdf' }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
