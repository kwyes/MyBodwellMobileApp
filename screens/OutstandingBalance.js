import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, Dimensions, AsyncStorage, TouchableOpacity, } from 'react-native'
import { Block, Text } from "galio-framework";
import Modal from "react-native-simple-modal";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { numFormat } from "../components/NumFormat";
import { LoadingScreen } from "../components/";

const { height, width } = Dimensions.get("window");

export default class OutstandingBalance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: null,
            obArr: [],
            modalVisible: false,
            transactionNo: null,
        }
    }

    async componentDidMount() {
        var StudentId = await AsyncStorage.getItem("StudentId");
        var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
        var Source = await AsyncStorage.getItem("Source");
        await this.setState({ studentId: StudentId });
        await this.setState({ term: CurrentSemester });
        this._getOutstandingBalance(StudentId, Source);
    }

    _getOutstandingBalance = (studentId, Source) => {
        fetch(`https://api-m.bodwell.edu/api/outstandingList/${studentId}/${Source}`)
            .then(response => response.json())
            .then(json => {
                if (json.status == '1') {
                    this.setState({
                        obArr: json.data
                    })
                } else {
                    console.log(json.message);
                }
            })
    }

    setModalVisible(visible, data) {
        this.setState({
            modalVisible: visible,
            transactionNo: data
        });
    }

    openModal = () => this.setState({ modalVisible: true });

    closeModal = () => this.setState({
        modalVisible: false,
        transactionNo: null
    });

    render() {
        const { obArr, modalVisible, transactionNo } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                {obArr[0] ?
                    <ScrollView
                        contentContainerStyle={styles.scrollview}
                    >
                        <Block flex style={{ alignItems: "center" }}>
                            <Block row>
                                <Block flex={0.65} center>
                                    <Text style={styles.tableHeader}>Fee Type</Text>
                                </Block>
                                <Block flex={0.35} center>
                                    <Text style={styles.tableHeader}>Start Date</Text>
                                </Block>
                            </Block>
                            <Block style={[styles.tableBorder, { width: "95%" }]} />
                            {obArr.map((rowData, index) =>
                                <Block row key={index} style={styles.mgv8}>
                                    <Block flex={0.65} center>
                                        <TouchableOpacity onPress={() => {
                                            this.setModalVisible(!this.state.modalVisible, rowData.TxNumber);
                                        }}>
                                            <Text style={styles.tableItem} color={"#977cc8"}>{rowData.FeeType}</Text>
                                        </TouchableOpacity>
                                    </Block>
                                    <Block flex={0.35} center>
                                        <Text style={styles.tableItem}>{rowData.StartDate}</Text>
                                    </Block>
                                </Block>
                            )}
                        </Block>
                        <Modal
                            offset={this.state.offset}
                            open={modalVisible}
                            modalDidClose={() => this.closeModal()}
                            containerStyle={{
                                justifyContent: "center"
                            }}
                            modalStyle={styles.modal}
                        >
                            <Block style={styles.modalTitle}>
                                <Text style={styles.modalTitleText}>Outstanding Balance</Text>
                            </Block>
                            <Block style={styles.modalCloseIcon}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.closeModal();
                                    }}
                                    style={{ paddingHorizontal: 10 }}
                                    underlayColor="transparent"
                                >
                                    <MaterialIcons name="close" size={30} color="black" />
                                </TouchableOpacity>
                            </Block>
                            <ScrollView
                                contentContainerStyle={styles.modalScrollview}
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                            >
                                {obArr.map((rowData, index) =>
                                    <Block flex key={index}>
                                        {rowData.TxNumber == transactionNo ?
                                            <Block flex style={{ width: "100%" }}>
                                                <Block row style={styles.mgv5}>
                                                    <Block flex={0.4}>
                                                        <Text style={styles.modalTableHeader}>Transaction No</Text>
                                                    </Block>
                                                    <Block flex={0.6}>
                                                        <Text style={styles.modalTableItem}>{rowData.TxNumber}</Text>
                                                    </Block>
                                                </Block>
                                                <Block row style={styles.mgv5}>
                                                    <Block flex={0.4} style={{ justifyContent: "center" }}>
                                                        <Text style={styles.modalTableHeader}>Fee Type</Text>
                                                    </Block>
                                                    <Block flex={0.6}>
                                                        <Text style={styles.modalTableItem}>{rowData.FeeType}</Text>
                                                    </Block>
                                                </Block>
                                                <Block row style={styles.mgv5}>
                                                    <Block flex={0.4}>
                                                        <Text style={styles.modalTableHeader}>Start Date</Text>
                                                    </Block>
                                                    <Block flex={0.6}>
                                                        <Text style={styles.modalTableItem}>{rowData.StartDate}</Text>
                                                    </Block>
                                                </Block>
                                                <Block row style={styles.mgv5}>
                                                    <Block flex={0.4}>
                                                        <Text style={styles.modalTableHeader}>Expire Date</Text>
                                                    </Block>
                                                    <Block flex={0.6}>
                                                        <Text style={styles.modalTableItem}>{rowData.ExpireDate}</Text>
                                                    </Block>
                                                </Block>
                                                <Block row style={styles.mgv5}>
                                                    <Block flex={0.4}>
                                                        <Text style={styles.modalTableHeader}>Amount</Text>
                                                    </Block>
                                                    <Block flex={0.6}>
                                                        <Text style={styles.modalTableItem}>${numFormat(rowData.Amount, 2)}</Text>
                                                    </Block>
                                                </Block>
                                                <Block row style={styles.mgv5}>
                                                    <Block flex={0.4}>
                                                        <Text style={styles.modalTableHeader}>Deadline</Text>
                                                    </Block>
                                                    <Block flex={0.6}>
                                                        <Text style={styles.modalTableItem}>{rowData.Deadline}</Text>
                                                    </Block>
                                                </Block>
                                                <Block row style={styles.mgv5}>
                                                    <Block flex={0.4} style={{ justifyContent: "center" }}>
                                                        <Text style={styles.modalTableHeader}>Remarks</Text>
                                                    </Block>
                                                    <Block flex={0.6}>
                                                        <Text style={styles.modalTableItem}>{rowData.Remarks}</Text>
                                                    </Block>
                                                </Block>
                                            </Block>
                                            : <Block />}
                                    </Block>
                                )}
                            </ScrollView>
                        </Modal>
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
    modalScrollview: {
        flexGrow: 1,
        width: "100%",
        paddingVertical: 10
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
    modal: {
        borderRadius: 10,
        // alignItems: "center",
        marginHorizontal: 5
    },
    modalTableHeader: {
        fontSize: RFValue(14),
        fontFamily: "Heavy",
        color: "#443567"
    },
    modalTableItem: {
        fontSize: RFValue(14),
        fontFamily: "Medium"
    },
    modalTitle: {
        alignSelf: "stretch",
        alignItems: "center"
    },
    modalTitleText: {
        color: "#512da8",
        fontFamily: "Black",
        fontSize: RFValue(18)
    },
    modalCloseIcon: {
        alignSelf: "stretch",
        alignItems: "flex-end",
        position: "absolute",
        top: 0,
        right: 0,
        padding: 5
    },
    mgv5: {
        marginVertical: 5
    },
    mgv8: {
        marginVertical: 8
    }
})
