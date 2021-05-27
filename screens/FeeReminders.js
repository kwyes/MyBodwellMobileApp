import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, Dimensions, AsyncStorage, TouchableOpacity, } from 'react-native'
import { Block, Text } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { numFormat } from "../components/NumFormat";
import { LoadingScreen } from "../components/";

const { height, width } = Dimensions.get("window");

export default class FeeReminders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: null,
            frArr: []
        }
    }

    async componentDidMount() {
        var StudentId = await AsyncStorage.getItem("StudentId");
        var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
        var Source = await AsyncStorage.getItem("Source");
        await this.setState({ studentId: StudentId });
        await this.setState({ term: CurrentSemester });
        this._getFeeReminder(StudentId, Source);
    }

    _getFeeReminder = (studentId, Source) => {
        fetch(`https://api-m.bodwell.edu/api/feereminderList/${studentId}/${Source}`)
            .then(response => response.json())
            .then(json => {
                if (json.status == '1') {
                    this.setState({
                        frArr: json.data
                    })
                } else {
                    console.log(json.message);
                }
            })
    }

    render() {
        const { frArr, studentId } = this.state;
        const { navigation } = this.props


        return (
            <SafeAreaView style={styles.container}>
                {frArr[0] ?
                    <ScrollView
                        contentContainerStyle={styles.scrollview}
                    >
                        <Block flex style={{ alignItems: "center" }}>
                            <Block row>
                                <Text style={styles.tableHeader}>Fee Reminder</Text>
                            </Block>
                            <Block style={[styles.tableBorder, { width: "95%" }]} />
                            {frArr.map((rowData, index) =>
                                <TouchableOpacity onPress={() => navigation.navigate("feeRemindersPDF", { studentId: studentId, filename: rowData.filename })} key={index} style={styles.mgv8}>
                                    <Text style={styles.tableItem} color={"#977cc8"}>{rowData.IDate}</Text>
                                </TouchableOpacity>
                            )}
                        </Block>
                    </ScrollView>
                    : <LoadingScreen />}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    scrollview: {
        flexGrow: 1,
        width: width
    },
    tableBorder: {
        marginVertical: 10,
        borderBottomColor: "grey",
        borderBottomWidth: 1.5
    },
    tableHeader: {
        fontSize: RFValue(18),
        fontFamily: "Heavy",
        color: "#443567"
    },
    tableItem: {
        fontSize: RFValue(14),
        fontFamily: "Medium"
    },
    mgv5: {
        marginVertical: 5
    },
    mgv8: {
        marginVertical: 8
    }
})
