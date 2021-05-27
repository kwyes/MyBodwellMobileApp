import React from "react";
import {
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Block, Text } from "galio-framework";
import { LoadingScreen } from "../components";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("screen");

export default class BodwellinVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      media: [],
      modalVisible: false
    };
  }

  _getMedia(cantoFldr) {
    fetch(`https://api-m.bodwell.edu/api/cantoApi/album/${cantoFldr}/8`)
      .then(response => response.json())
      .then(json => {
        if (json.found > 0) {
          this.setState({
            media: json["results"]
          });
        } else {
          Alert.alert(translate('error_text_nodata'));
        }
      });
  }

  async componentDidMount() {
    var cantoFldr = await AsyncStorage.getItem("Canto-BodwellinVideo");
    this._getMedia(cantoFldr);
  }

  convertToMin(stringSec) {
    var roundedSec = Math.round(parseFloat(stringSec));
    var min = Math.floor(roundedSec / 60);
    var sec = Math.round(roundedSec % 60).toString().padStart(2, "0");

    var duration = min + ":" + sec;
    return duration;
  }

  redirectBodwellinVideoDetail = rowData => {
    const { navigation } = this.props;
    if (rowData) {
      navigation.navigate("bodwellinVideoDetail", {
        param: rowData
      });
    } else {
      Alert.alert("Sign Out and Try Again");
    }
  };

  render() {
    const { media } = this.state;
    if (media[0]) {
      return (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Block flex row space={"between"} style={{ flexWrap: "wrap" }}>
            {media.map((rowData, index) =>
              <TouchableOpacity
                onPress={() => this.redirectBodwellinVideoDetail(rowData)}
                style={styles.image}
                key={index}
              >
                <Image
                  source={{
                    uri: "https://bodwell.canto.com/preview/image/" + rowData.id
                  }}
                  style={{ flex: 1 }}
                />
                <Block flex style={styles.containerAbs}>
                  <Block style={styles.durationContainer}>
                    <Text color={"white"} size={RFValue(10)}>
                      {this.convertToMin(rowData["default"].Time)}
                    </Text>
                  </Block>
                </Block>
              </TouchableOpacity>
            )}
          </Block>
        </ScrollView>
      );
    } else {
      return <LoadingScreen />;
    }
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1
  },
  image: {
    maxWidth: width / 3 - 1,
    height: width / 3,
    flexBasis: "33%",
    marginVertical: 0.5
  },
  containerAbs: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 4,

  },
  durationContainer: {
    backgroundColor: "black",
    opacity: 0.8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2
  }
});
