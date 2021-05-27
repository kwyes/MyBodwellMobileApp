import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, Dimensions, AsyncStorage, TouchableOpacity, } from 'react-native'
import { Block, Text } from "galio-framework";
import Modal from "react-native-simple-modal";
import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { numFormat } from "../components/NumFormat";
import { LoadingScreen } from "../components/";
import {
    Container,
    Content,
    List,
    ListItem,
    Left,
    Body,
    Right
} from "native-base";

const { height, width } = Dimensions.get("window");

export default class ActivityPayments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: null,
            apArr: [],
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
        this._getActivityPayment(CurrentSemester, StudentId, Source);
    }

    _getActivityPayment = (termId, studentId, Source) => {
        fetch(`https://api-m.bodwell.edu/api/activityPayment/${termId}/${studentId}/${Source}`)
            .then(response => response.json())
            .then(json => {
                if (json.status == '1') {
                    this.setState({
                        apArr: json.data
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

    dateFormat(date) {
        return date.toString().substring(0, 10)
    }

    render() {
        const { apArr, modalVisible, transactionNo } = this.state;
        return (
            <Container>
                {apArr[0] ?
                    <Content padder>
                        <List >
                            {apArr.map((rowData, index) =>
                                <ListItem key={index} onPress={() => { this.setModalVisible(!this.state.modalVisible, rowData.EventID); }} >
                                    <Body style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Block style={{ width: "25%" }}>
                                            <Text style={styles.fontFamilyMedium} size={RFValue(14)} muted>{this.dateFormat(rowData.DatePaid)}</Text>
                                        </Block>
                                        <Block right style={{ width: "65%" }}>
                                            <Text style={styles.fontFamilyMedium} size={RFValue(14)}>{rowData.EventName}</Text>
                                            <Text style={styles.fontFamilyMedium} size={RFValue(18)}>${numFormat(rowData.Amounttobepaid, 2)}</Text>
                                        </Block>

                                        <Block right style={{ width: "10%" }}>
                                            <Text muted>
                                                <MaterialIcons name="keyboard-arrow-right" size={25} />
                                            </Text>
                                        </Block>
                                    </Body>
                                </ListItem>
                            )}
                        </List>
                    </Content>
                    : <LoadingScreen />}
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
                        <Text style={styles.modalTitleText}>Activity Payment Detail</Text>
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
                        {apArr.map((rowData, index) =>
                            <Block flex key={index}>
                                {rowData.EventID == transactionNo ?
                                    <Block flex style={{ width: "100%" }}>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.45}>
                                                <Text style={styles.modalTableHeader}>Event ID</Text>
                                            </Block>
                                            <Block flex={0.55}>
                                                <Text style={styles.modalTableItem}>{rowData.EventID}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.45} style={{ justifyContent: "center" }}>
                                                <Text style={styles.modalTableHeader}>Event name</Text>
                                            </Block>
                                            <Block flex={0.55}>
                                                <Text style={styles.modalTableItem}>{rowData.EventName}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.45}>
                                                <Text style={styles.modalTableHeader}>Event date</Text>
                                            </Block>
                                            <Block flex={0.55}>
                                                <Text style={styles.modalTableItem}>{this.dateFormat(rowData.EventDate)}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.45}>
                                                <Text style={styles.modalTableHeader}>Deadline</Text>
                                            </Block>
                                            <Block flex={0.55}>
                                                <Text style={styles.modalTableItem}>{this.dateFormat(rowData.Deadline)}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.45}>
                                                <Text style={styles.modalTableHeader}>Teacher in charge</Text>
                                            </Block>
                                            <Block flex={0.55}>
                                                <Text style={styles.modalTableItem}>{rowData.TeacherID}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.45}>
                                                <Text style={styles.modalTableHeader}>Amount to be paid</Text>
                                            </Block>
                                            <Block flex={0.55}>
                                                <Text style={styles.modalTableItem}>${numFormat(rowData.Amounttobepaid, 2)}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.45}>
                                                <Text style={styles.modalTableHeader}>Date paid</Text>
                                            </Block>
                                            <Block flex={0.55}>
                                                <Text style={styles.modalTableItem}>{this.dateFormat(rowData.DatePaid)}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.45} style={{ justifyContent: "center" }}>
                                                <Text style={styles.modalTableHeader}>Payment method</Text>
                                            </Block>
                                            <Block flex={0.55}>
                                                <Text style={styles.modalTableItem}>{rowData.PaymentMethod}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.45} style={{ justifyContent: "center" }}>
                                                <Text style={styles.modalTableHeader}>Card type</Text>
                                            </Block>
                                            <Block flex={0.55}>
                                                <Text style={styles.modalTableItem}>{rowData.CardType}</Text>
                                            </Block>
                                        </Block>
                                    </Block>
                                    : <Block />}
                            </Block>
                        )}
                    </ScrollView>
                </Modal>
            </Container>

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
    fontFamilyMedium: {
        fontFamily: "Medium"
    },
    fontFamilyHeavy: {
        fontFamily: "Heavy"
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
    mgv10: {
        marginVertical: 10
    },
    mgv8: {
        marginVertical: 8
    }
})
