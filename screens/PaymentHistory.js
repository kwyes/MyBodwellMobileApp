import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, ScrollView, Dimensions, AsyncStorage, TouchableOpacity, } from 'react-native'
import { Block, Text } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-simple-modal";
import { RFValue } from "react-native-responsive-fontsize";
import { numFormat } from "../components/NumFormat";
import { LoadingScreen } from "../components/";
import moment from "moment";
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
const typeColors = ["#417adb", "#2bcbba", "#ed8a65"]

export default class PaymentHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: null,
            phArr: [],
            phTotalAmount: null,
            modalVisible: false,
            transactionNo: null,
            detailModalVisible: false,
            pdArr: [],
            pdTotalAmount: null,
            referenceModalVisible: false
        }
    }

    async componentDidMount() {
        var StudentId = await AsyncStorage.getItem("StudentId");
        var CurrentSemester = await AsyncStorage.getItem("CurrentSemester");
        var Source = await AsyncStorage.getItem("Source");
        await this.setState({ studentId: StudentId });
        await this.setState({ term: CurrentSemester });
        await this.setState({ source: Source });
        this._getPaymentHistory(StudentId, Source);
    }

    _getPaymentHistory = (studentId, Source) => {
        fetch(`https://api-m.bodwell.edu/api/paymentHistory/${studentId}/${Source}`)
            .then(response => response.json())
            .then(json => {
                if (json.status == '1') {
                    // console.log(json.data);
                    var data = json.data
                    var total = 0;
                    for (let i = 0; i < data.length; i++) {
                        total += parseFloat(data[i].Amount);
                        console.log(total)

                    }

                    this.setState({
                        phArr: json.data,
                        phTotalAmount: total
                    })
                } else {
                    console.log(json.message);
                }
            })
    }

    _getPaymentDetail = (paymentId) => {
        const { studentId, source } = this.state;
        fetch(`https://api-m.bodwell.edu/api/paymentDetail/${studentId}/${paymentId}/${source}`)
            .then(response => response.json())
            .then(json => {
                if (json.status == '1') {
                    var data = json.data
                    var total = 0;
                    for (let i = 0; i < data.length; i++) {
                        total += parseFloat(data[i].Amount);
                    }

                    this.setState({
                        pdArr: json.data,
                        pdTotalAmount: total
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

    setDetailModalVisible() {
        const { transactionNo } = this.state;

        this._getPaymentDetail(transactionNo)
        this.setState({ detailModalVisible: true });
    }

    closeModal = () => this.setState({
        modalVisible: false,
        transactionNo: null
    });

    closeDetailModal = () => this.setState({ detailModalVisible: false });

    openReferenceModal = () => this.setState({ referenceModalVisible: true });

    closeReferenceModal = () => this.setState({ referenceModalVisible: false });

    dateFormat(date) {
        return date.toString().substring(0, 10)
    }

    typeFormat(type) {
        switch (type) {
            case "RC":
                return "receipt";
                break;
            case "RF":
                return "replay";
                break;
            case "TR":
                return "swap-horiz";
            default:
                return "";
                break;
        }
    }

    getTypeColor(type) {
        switch (type) {
            case "RC":
                return typeColors[0];
                break;
            case "RF":
                return typeColors[1];
                break;
            case "TR":
                return typeColors[2];
            default:
                return "";
                break;
        }
    }

    render() {
        const { phArr, modalVisible, detailModalVisible
            , phTotalAmount, transactionNo, pdArr, pdTotalAmount, referenceModalVisible } = this.state;
        return (
            <Container>
                {phArr[0] ?
                    <Content padder>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                {
                                    borderColor: "#977cc8",
                                    backgroundColor: "#977cc8",
                                    alignSelf: "flex-start",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }
                            ]}
                            onPress={() => { this.openReferenceModal(); }}
                        >
                            <Text color="#ffffff" style={styles.mgr3}>Icons</Text>
                            <MaterialIcons name="help-outline" size={14} color="#ffffff" />
                        </TouchableOpacity>

                        <List>
                            {phArr.map((rowData, index) =>
                                <ListItem key={index} onPress={() => { this.setModalVisible(!this.state.modalVisible, rowData.PaymentID); }}>
                                    <Left>
                                        <MaterialIcons name={this.typeFormat(rowData.Type)} size={30} color={this.getTypeColor(rowData.Type)} />
                                    </Left>
                                    <Body style={{ alignItems: "flex-end" }}>
                                        <Text style={styles.fontFamilyMedium} size={RFValue(12)} muted>{this.dateFormat(rowData.PaymentDate)}</Text>
                                        <Text style={styles.fontFamilyMedium} size={RFValue(20)}>${numFormat(rowData.Amount, 2)}</Text>
                                    </Body>
                                    <Right style={{ alignItems: "flex-end" }}>
                                        <Text muted>
                                            <MaterialIcons name="keyboard-arrow-right" size={25} />
                                        </Text>
                                    </Right>
                                </ListItem>
                            )}
                            <ListItem style={{ borderBottomWidth: 0 }}>
                                <Left>
                                    <Block style={{ paddingHorizontal: 15, paddingVertical: 3 }}>
                                        <Text style={styles.fontFamilyHeavy} size={RFValue(16)} color={"#443567"}>Total</Text>
                                    </Block>
                                </Left>
                                <Body style={{ alignItems: "flex-end" }}>
                                    <Text style={styles.fontFamilyMedium} size={RFValue(20)}>${numFormat(phTotalAmount, 2)}</Text>
                                </Body>
                                <Right>
                                </Right>
                            </ListItem>
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
                        <Text style={styles.modalTitleText}>Payment</Text>
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
                        {phArr.map((rowData, index) =>
                            <Block flex key={index} style={{ width: "80%" }}>
                                {rowData.PaymentID == transactionNo ?
                                    <Block flex>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.4}>
                                                <Text style={styles.modalTableHeader}>Payment No</Text>
                                            </Block>
                                            <Block flex={0.6}>
                                                <Text style={styles.modalTableItem}>{rowData.PaymentID}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.4}>
                                                <Text style={styles.modalTableHeader}>Payment Date</Text>
                                            </Block>
                                            <Block flex={0.6}>
                                                <Text style={styles.modalTableItem}>{this.dateFormat(rowData.PaymentDate)}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.4}>
                                                <Text style={styles.modalTableHeader}>Type</Text>
                                            </Block>
                                            <Block flex={0.6}>
                                                <Text style={styles.modalTableItem}>{this.typeFormat(rowData.Type)}</Text>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10} middle>
                                            <Block flex={0.4}>
                                                <Text style={styles.modalTableHeader}>Amount</Text>
                                            </Block>
                                            <Block flex={0.6}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setDetailModalVisible();
                                                    }}
                                                >
                                                    <Block row style={[styles.button, { borderColor: "#977cc8", backgroundColor: "#977cc8", alignSelf: "flex-start", alignItems: "center" }]}>
                                                        <Text style={[styles.modalTableItem, styles.mgr3]} color={"#ffffff"}>${numFormat(rowData.Amount, 2)}</Text>
                                                        <MaterialIcons name="keyboard-arrow-right" size={15} color={"#ffffff"} />
                                                    </Block>
                                                </TouchableOpacity>
                                            </Block>
                                        </Block>
                                        <Block row style={styles.mgv10}>
                                            <Block flex={0.4}>
                                                <Text style={styles.modalTableHeader}>Method</Text>
                                            </Block>
                                            <Block flex={0.6}>
                                                <Text style={styles.modalTableItem}>{rowData.PaymentMethod}</Text>
                                            </Block>
                                        </Block>
                                    </Block> :
                                    <Block />}
                            </Block>

                        )}
                    </ScrollView>
                </Modal>
                <Modal
                    offset={this.state.offset}
                    open={detailModalVisible}
                    modalDidClose={() => this.closeDetailModal()}
                    containerStyle={{
                        justifyContent: "center"
                    }}
                    modalStyle={styles.modal}
                >
                    <Block style={styles.modalTitle}>
                        <Text style={styles.modalTitleText}>Payment Detail</Text>
                    </Block>
                    <Block style={styles.modalCloseIcon}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeDetailModal();
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
                        <List style={{ width: "100%" }}>
                            {pdArr.map((rowData, index) =>
                                <ListItem key={index}>
                                    <Left>
                                        <Block >
                                            <Text style={styles.fontFamilyMedium} size={14}>{rowData.PaymentTypeID}</Text>
                                        </Block>
                                    </Left>
                                    <Body style={{ alignItems: "flex-end" }}>
                                        <Text style={styles.fontFamilyMedium} size={12} muted>{this.dateFormat(rowData.PaymentDate)}</Text>
                                        <Text style={styles.fontFamilyMedium} size={16}>${numFormat(rowData.Amount, 2)}</Text>
                                    </Body>
                                </ListItem>
                            )}
                            <ListItem style={{ borderBottomWidth: 0 }}>
                                <Left>
                                    <Block >
                                        <Text style={styles.modalTableHeader} size={14}>Total</Text>
                                    </Block>
                                </Left>
                                <Body style={{ alignItems: "flex-end" }}>
                                    <Text style={styles.fontFamilyMedium} size={16}>${numFormat(pdTotalAmount, 2)}</Text>
                                </Body>
                            </ListItem>
                        </List>
                    </ScrollView>
                </Modal>
                <Modal
                    offset={this.state.offset}
                    open={referenceModalVisible}
                    modalDidClose={() => this.closeReferenceModal()}
                    containerStyle={{
                        justifyContent: "center"
                    }}
                    modalStyle={styles.modal}
                >
                    <Block style={styles.modalTitle}>
                        <Text style={styles.modalTitleText}>Payment Detail</Text>
                    </Block>
                    <Block style={styles.modalCloseIcon}>
                        <TouchableOpacity
                            onPress={() => {
                                this.closeReferenceModal();
                            }}
                            style={{ paddingHorizontal: 10 }}
                            underlayColor="transparent"
                        >
                            <MaterialIcons name="close" size={30} color="black" />
                        </TouchableOpacity>
                    </Block>
                    <Block style={styles.pdv10}>
                        <Block row middle style={styles.mgv5}>
                            <MaterialIcons name={this.typeFormat("RC")} size={25} color={this.getTypeColor("RC")} style={styles.mgr3} />
                            <Text>Receipt</Text>
                        </Block>
                        <Block row middle style={styles.mgv5}>
                            <MaterialIcons name={this.typeFormat("RF")} size={25} color={this.getTypeColor("RF")} style={styles.mgr3} />
                            <Text>Refund</Text>
                        </Block>
                        <Block row middle style={styles.mgv5}>
                            <MaterialIcons name={this.typeFormat("TR")} size={25} color={this.getTypeColor("TR")} style={styles.mgr3} />
                            <Text>Transfer</Text>
                        </Block>
                    </Block>
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
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10
    },
    tableBorder: {
        marginVertical: 10,
        borderBottomColor: "grey",
        borderBottomWidth: 1.5
    },
    referenceText: {
        fontSize: RFValue(16),
        fontFamily: "Medium",
        marginHorizontal: 5
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
    button: {
        borderWidth: 1,
        borderRadius: 3,
        paddingHorizontal: 15,
        paddingVertical: 3
    },
    mgv5: {
        marginVertical: 5
    },
    mgv10: {
        marginVertical: 10
    },
    mgv15: {
        marginVertical: 20
    },
    mgr3: {
        marginRight: 3
    },
    pdv10: {
        paddingVertical: 10
    }
})
