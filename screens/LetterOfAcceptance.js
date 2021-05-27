import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, Dimensions, AsyncStorage, TouchableOpacity, } from 'react-native'
import { Block, Text } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { numFormat } from "../components/NumFormat";
import { LoadingScreen } from "../components/";

const { height, width } = Dimensions.get("window");
export default class LetterOfAcceptance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: null,
            loaArr: []
        }
    }

    async componentDidMount() {
        var StudentId = await AsyncStorage.getItem("StudentId");
        var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
        var Source = await AsyncStorage.getItem("Source");
        await this.setState({ studentId: StudentId });
        await this.setState({ term: CurrentSemester });
        this._getLoa(StudentId, Source);
    }

    _getLoa = (studentId, Source) => {
        fetch(`https://api-m.bodwell.edu/api/loaList/${studentId}/${Source}`)
            .then(response => response.json())
            .then(json => {
                if (json.status == '1') {
                    this.setState({
                        loaArr: json.data
                    })
                } else {
                    console.log(json.message);
                }
            })
    }

    openPDFpage(invoice) {
        console.log(invoice)
    }

    render() {
        const { loaArr } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                {loaArr[0] ?
                    <ScrollView
                        contentContainerStyle={styles.scrollview}
                    >
                        <Block flex style={{ alignItems: "center" }}>
                            <Block row>
                                <Text style={styles.tableHeader}>Letter of Acceptance</Text>
                            </Block>
                            <Block style={[styles.tableBorder, { width: "95%" }]} />
                            {loaArr.map((rowData, index) =>
                                <TouchableOpacity onPress={() => this.openPDFpage(rowData.Invoice)} key={index} style={styles.mgv8}>
                                    <Text style={styles.tableItem} color={"#977cc8"}>{rowData.Invoice}</Text>
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
