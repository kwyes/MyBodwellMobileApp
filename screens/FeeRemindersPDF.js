import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import PDFReader from 'rn-pdf-reader-js-no-loading'
import Constants from 'expo-constants'

export default class FeeRemindersPDF extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
    }

    componentDidMount() {
        console.log(this.params.studentId);
        console.log(this.params.filename)
    }

    render() {
        return (
          <View style={styles.container}>
           <PDFReader
             source={{
               uri: 'https://api-m.bodwell.edu/download/2019000102019102367465.pdf',
             }}
           />
         </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
})
