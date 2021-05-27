import React, { Component } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  AsyncStorage,
  Image
} from "react-native";
import { Block, Text } from "galio-framework";
import { textFormat } from "../components/TextFormat";
import { RFValue } from "react-native-responsive-fontsize";
import { translate } from "../components/Translate";
import i18n from 'i18n-js';

const { width, height } = Dimensions.get("window");

export default class StaffInvolved extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Counselor: [],
      Hadvisor: [],
      Hadvisor2: [],
      Principal1: [],
      Principal2: [],
      teacherObj: [],
      noncreditTeacherObj: []
    };
  }

  async componentDidMount() {
    var StudentId = await AsyncStorage.getItem("StudentId");
    var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
    var Source = await AsyncStorage.getItem("Source");
    this._getStaffInvolved(StudentId, CurrentSemester, Source);
    this.props.navigation.addListener('willFocus', payload => { this.forceUpdate() })
  }

  _getStaffInvolved = (StudentId, CurrentSemester, Source) => {
    fetch(
      `https://api-m.bodwell.edu/api/involvedStaff/${CurrentSemester}/${StudentId}/${Source}`
    )
      .then(response => response.json())
      .then(json => {
        if (json.status == 1) {
          this.setState({
            Counselor: json["data"][0]["Counselor"],
            Hadvisor: json["data"][0]["Hadvisor"],
            Hadvisor2: json["data"][0]["Hadvisor2"],
            Principal1: json["data"][0]["Principal1"],
            Principal2: json["data"][0]["Principal2"],
            teacherObj: json["data"][0]["Teachers"],
            noncreditTeacherObj: json["data"][0]["noncreditTeachers"]
          });
        } else {
          console.log(json.message);
        }
      });
  };

  render() {
    const imgUrl = "https://asset.bodwell.edu/OB4mpVpg/staff/";
    const {
      Counselor,
      Hadvisor,
      Hadvisor2,
      Principal1,
      Principal2,
      teacherObj,
      noncreditTeacherObj
    } = this.state;

    return (
      <Block flex center>
        <ScrollView
          contentContainerStyle={styles.scrollview}
          showsVerticalScrollIndicator={false}
        >
          <Block style={styles.categoryContainer}>
            <Text
              style={[styles.fontFamilyBlack, styles.customH4]}
              color={"#226200"}
            >
              {translate('staffinvolved_text_staffinvolved')}
            </Text>
            <Block style={styles.line} />
          </Block>
          <Block style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>
              {translate('staffinvolved_text_teachers')}
            </Text>
            <Block row style={{ flexWrap: "wrap" }}>
              {teacherObj.map((rowData, index) =>
                <Block style={styles.staffContainer} key={index}>
                  <Image
                    source={{
                      uri: imgUrl + rowData.teacherId + ".jpg"
                    }}
                    defaultSource={require("../assets/images/userimg.png")}
                    style={styles.photo}
                  />
                  <Text style={styles.staffName}>
                    {rowData.teacherName}
                  </Text>
                  <Text style={styles.staffPosition}>
                    {textFormat(rowData.courseName)}
                  </Text>
                </Block>
              )}
            </Block>
            <Block style={styles.line} />
          </Block>
          <Block style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>
              {translate('staffinvolved_text_sc')}
            </Text>
            <Block row style={{ flexWrap: "wrap" }}>
              {noncreditTeacherObj.map((rowData, index) =>
                <Block style={styles.staffContainer} key={index}>
                  <Image
                    source={{
                      uri: imgUrl + rowData.teacherId + ".jpg"
                    }}
                    defaultSource={require("../assets/images/userimg.png")}
                    style={styles.photo}
                  />
                  <Text style={styles.staffName}>
                    {rowData.teacherName}
                  </Text>
                  <Text style={styles.staffPosition}>
                    {textFormat(rowData.courseName)}
                  </Text>
                </Block>
              )}
            </Block>

            <Block style={styles.line} />
          </Block>
          <Block style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>
              {translate('staffinvolved_text_cya')}
            </Text>
            <Block row style={{ flexWrap: "wrap" }}>
              <Block style={styles.staffContainer}>
                <Image
                  source={{
                    uri: imgUrl + Counselor.staffId + ".jpg"
                  }}
                  defaultSource={require("../assets/images/userimg.png")}
                  style={styles.photo}
                />
                <Text style={styles.staffName}>
                  {Counselor.fullName}
                </Text>
                <Text style={styles.staffPosition}>
                  {textFormat(Counselor.positionTitle)}
                </Text>
              </Block>

              <Block style={styles.staffContainer}>
                <Image
                  source={{
                    uri: imgUrl + Hadvisor.staffId + ".jpg"
                  }}
                  defaultSource={require("../assets/images/userimg.png")}
                  style={styles.photo}
                />
                <Text style={styles.staffName}>
                  {Hadvisor.fullName}
                </Text>
                <Text style={styles.staffPosition}>
                  {textFormat(Hadvisor.positionTitle)}
                </Text>
              </Block>
              <Block style={styles.staffContainer}>
                <Image
                  source={{
                    uri: imgUrl + Hadvisor2.staffId + ".jpg"
                  }}
                  defaultSource={require("../assets/images/userimg.png")}
                  style={styles.photo}
                />
                <Text style={styles.staffName}>
                  {Hadvisor2.fullName}
                </Text>
                <Text style={styles.staffPosition}>
                  {textFormat(Hadvisor2.positionTitle)}
                </Text>
              </Block>
            </Block>
            <Block style={styles.line} />
          </Block>

          <Block style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>
              {translate('staffinvolved_text_principals')}
            </Text>
            <Block row style={{ flexWrap: "wrap" }}>
              <Block style={styles.staffContainer}>
                <Image
                  source={{
                    uri: imgUrl + Principal1.staffId + ".jpg"
                  }}
                  defaultSource={require("../assets/images/userimg.png")}
                  style={styles.photo}
                />
                <Text style={styles.staffName}>
                  {Principal1.fullName}
                </Text>
                <Text style={styles.staffPosition}>
                  {textFormat(Principal1.positionTitle)}
                </Text>
              </Block>
              <Block style={styles.staffContainer}>
                <Image
                  source={{
                    uri: imgUrl + Principal2.staffId + ".jpg"
                  }}
                  defaultSource={require("../assets/images/userimg.png")}
                  style={styles.photo}
                />
                <Text style={styles.staffName}>
                  {Principal2.fullName}
                </Text>
                <Text style={styles.staffPosition}>
                  {textFormat(Principal2.positionTitle)}
                </Text>
              </Block>
            </Block>
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  scrollview: {
    flexGrow: 1,
    width: width,
    alignItems: "center",
    paddingTop: 30
  },
  line: {
    borderBottomColor: "#bdc3c7",
    borderBottomWidth: 1,
    width: width * 0.8,
    marginTop: 30
  },
  photo: {
    width: height / 10,
    height: height / 10,
    borderRadius: height / 20
  },
  categoryContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30
  },
  staffContainer: {
    flexBasis: "50%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  categoryTitle: {
    color: "#226200",
    fontFamily: "Heavy",
    fontSize: RFValue(22)
  },
  staffName: {
    color: "#226200",
    fontFamily: "Heavy",
    fontSize: RFValue(12)
  },
  staffPosition: {
    color: "#226200",
    fontFamily: "Oblique",
    fontSize: RFValue(10),
    width: width * 0.35,
    textAlign: "center"
  },
  fontFamilyBlack: {
    fontFamily: "Black"
  },
  customH4: {
    fontSize: RFValue(24)
  }
});
