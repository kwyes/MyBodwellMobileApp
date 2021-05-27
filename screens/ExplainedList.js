import React, { Component } from "react";
import { StyleSheet, SafeAreaView, Dimensions, ScrollView, AsyncStorage } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { CardExplain, LoadingScreen, CustomCard } from "../components/";
import { RFValue } from "react-native-responsive-fontsize";
import { VideoTitleFormat } from "../components/VideoTitleFormat";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const { width, height } = Dimensions.get("screen");
const screenWidth = Math.round(Dimensions.get("window").width);

export default class ExplainedList extends Component {
  constructor(props) {
    super(props);
    this.param = this.props.navigation.state.params.param;
    this.state = {
      explainList: [],
      title: null,
      colorTheme: null,
      numFlexBasis: "",
      numWidth: 1
    };
  }

  async componentDidMount() {
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })

    var cantoAcademicFldr = await AsyncStorage.getItem("Canto-Explained-Academic");
    var cantoStudentLifeFldr = await AsyncStorage.getItem("Canto-Explained-StudentLife");

    if (this.param == 1) {
      this.setState({
        title: translate('bodwellexplainedlist_text_academicsvideo'),
        colorTheme: "#c43200"
      });
      var url = `https://api-m.bodwell.edu/api/cantoApi/album/${cantoAcademicFldr}/30`;
      this._getMedia(url);
    } else {
      this.setState({
        title: translate('bodwellexplainedlist_text_slv'),
        colorTheme: "#226200"
      });
      var url = `https://api-m.bodwell.edu/api/cantoApi/album/${cantoStudentLifeFldr}/30`;
      this._getMedia(url);
    }

    if (screenWidth > 700) {
      this.setState({
        numFlexBasis: "50%",
        numWidth: 0.5
      });
    } else {
      this.setState({
        numFlexBasis: "100%",
        numWidth: 1
      });
    }
  }

  _getMedia(url) {
    fetch(url).then(response => response.json()).then(json => {
      if (json.found > 0) {
        this.setState({
          explainList: json["results"]
        });
      } else {
        Alert.alert(translate('error_text_nodata'));
      }
    });
  }

  convertToMin(stringSec) {
    var roundedSec = Math.round(parseFloat(stringSec));
    var min = Math.floor(roundedSec / 60);
    var sec = Math.round(roundedSec % 60).toString().padStart(2, "0");

    var duration = min + ":" + sec;
    return duration;
  }

  render() {
    const {
      title,
      explainList,
      colorTheme,
      numFlexBasis,
      numWidth
    } = this.state;
    if (explainList[0]) {
      return (
        <SafeAreaView style={styles.container}>
          <Block style={styles.titleTextContainer}>
            <Text
              style={[
                styles.titleText,
                { color: colorTheme },
                styles.fontFamilyBlack
              ]}
            >
              {" "}{title}{" "}
            </Text>
          </Block>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.products}
          >
            <Block style={styles.videoContainer}>
              {explainList.map((rowData, index) =>
                <Block
                  key={index}
                  style={{
                    flexBasis: numFlexBasis,
                    width: width * numWidth,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <CustomCard
                    product={{
                      title: VideoTitleFormat(rowData.name),
                      image:
                        "https://bodwell.canto.com/preview/image/" + rowData.id,
                      description: rowData.description,
                      duration: this.convertToMin(rowData["default"].Time),
                      colorTheme: colorTheme,
                      navigate: "explainDetail",
                      param: rowData,
                      category: this.param
                    }}
                  />
                </Block>
              )}
            </Block>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return <LoadingScreen />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  videoContainer: {
    width: width,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  titleTextContainer: {
    width: width - theme.SIZES.BASE * 3,
    textAlign: "left"
  },
  titleText: {
    fontSize: RFValue(20),
    marginVertical: 15
  },
  products: {
    width: width,
    alignItems: "center"
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  }
});
