import { useContext, useEffect, useState } from "react"

import { View, StyleSheet, Image, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";

import { authApi, endpoints } from "../../configs/API";
import MyContext from "../../configs/MyContext";

const MyDetailReceipt = ({ navigation, route }) => {
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [receipt, setReceipt] = useState(null)

    const Money = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'VND'
    })

    const id = route.params?.id

    const loadReceipt = async () => {
        try {

            let res = await authApi(accessTk).get(endpoints['my_receipt_detail'](id))
            setReceipt(res.data)
            console.log(receipt)
        }
        catch (ex) {
            console.info(ex)
        }
    }

    useEffect(() => {
        loadReceipt()
    }, [id])



    return (
        <ScrollView style={{ flex: 1, width: "100%", marginBottom: 10 }}>
            <View style={{ width: "100%", alignItems: 'center', marginTop: 50, flexDirection: "row" }}>
                <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                    style={{ width: 120, height: 120, borderRadius: 75, backgroundColor: "white", borderWidth: 8, borderColor: "#79AEFF", marginHorizontal: 10 }} />
                <View>
                    <Text style={{ fontSize: 45, fontWeight: 'bold', color: "blue" }}>PB CLINIC</Text>
                    <Text>Hóa đơn của khách hàng</Text>
                </View>
            </View>

            {receipt === null ? <ActivityIndicator /> : <>

                <View style={{ width: "90%", backgroundColor: "white", borderRadius: 20, alignSelf: 'center', height: "auto", marginTop: 30, marginBottom: 50 }}>
                    <View style={[styles.panel_subject, { borderTopLeftRadius: 20, borderTopRightRadius: 20, flexDirection: "row", backgroundColor: "#2E67F8aa" }]}>
                        <Text style={styles.subject}>MÃ HÓA ĐƠN: </Text>
                        <Text style={styles.subject}>{receipt.record.id}</Text>
                    </View>

                    <View style={styles.panel_subject}>
                        <Text style={styles.subject}>THÔNG TIN BỆNH NHÂN: </Text>
                    </View>
                    <View style={styles.panel_textinfo}>
                        <Text style={styles.textInfo}>Mã bệnh nhân:</Text>
                        <Text style={styles.textInfo}>{receipt.record.patient.user_info.id}</Text>
                    </View>

                    <View style={styles.panel_textinfo}>
                        <Text style={styles.textInfo}>Tên bệnh nhân:</Text>
                        <Text style={styles.textInfo}>{receipt.record.patient.user_info.name}</Text>
                    </View>

                    <View style={styles.panel_subject}>
                        <Text style={styles.subject}>THÔNG TIN BÁC SĨ: </Text>

                    </View>
                    <View>
                        <View style={styles.panel_textinfo}>
                            <Text style={styles.textInfo}>Mã bác sĩ:</Text>
                            <Text style={styles.textInfo}>{receipt.record.doctor.employee_info.user_info.id}</Text>
                        </View>
                    </View>

                    <View style={styles.panel_textinfo}>
                        <Text style={styles.textInfo}>Tên bác sĩ:</Text>
                        <Text style={styles.textInfo}>{receipt.record.doctor.employee_info.user_info.name}</Text>
                    </View>

                    <View style={styles.panel_textinfo}>
                        <Text style={styles.textInfo}>Chuyên khoa:</Text>
                        <Text style={styles.textInfo}>{receipt.record.doctor.departments.name}</Text>
                    </View>


                    <View style={styles.panel_subject}>
                        <Text style={styles.subject}>THÔNG TIN CHI TIẾT HÓA ĐƠN: </Text>
                    </View>
                    <View>
                        {receipt.detail.map(sv => (
                            <>
                                <View style={styles.panel_textinfo}>
                                    <Text style={[styles.textInfo, { fontWeight: "bold" }]}>Tên dịch vụ: </Text>
                                    <Text style={styles.textInfo}>{sv.name}</Text>
                                </View>
                                <View style={styles.panel_textinfo}>
                                    <Text style={[styles.textInfo, { fontSize: 15, paddingLeft: 20 }]}>Thành tiền: </Text>
                                    <Text style={styles.textInfo}>{Money.format(sv.price)}</Text>
                                </View>
                            </>
                        ))}
                        <View style={styles.panel_textinfo}>
                            <Text style={styles.textInfo}>Tình trạng: </Text>
                            {receipt.paid === false ? <>
                                <Text style={[styles.textInfo, { color: "red" }]}>chưa thanh toán</Text>
                            </> : <>
                                <Text style={[styles.textInfo, { color: "green" }]}>đã thanh toán</Text>
                            </>}
                        </View>
                    </View>

                    <View style={[styles.panel_subject, { flexDirection: "row" }]}>
                        <Text style={styles.subject}>TỔNG THANH TOÁN: </Text>
                        <Text style={styles.subject}>{Money.format(receipt.total)}</Text>
                    </View>


                    <View style={[styles.panel_subject, { flexDirection: "row" }]}>
                        <Text style={styles.subject}>NGÀY: </Text>
                        <Text style={styles.subject}>{receipt.created_date}</Text>
                    </View>

                    <TouchableOpacity style={{ alignItems: "center", backgroundColor: "lightgray", width: "30%", alignSelf: "center", borderRadius: 7, marginTop:20 }} onPress={() => navigation.navigate('MyReceipt')}>
                        <Text style={{ fontSize: 15, paddingVertical: 4 }}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </>}
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    panel_subject: {
        backgroundColor: "gray", width: "100%", flexDirection: "colum",
    },
    subject: {
        color: "white", fontSize: 18, paddingVertical: 7, paddingLeft: 20, fontWeight: "500"
    },
    panel_textinfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 8
    },
    textInfo: {
        fontSize: 17
    }
})
export default MyDetailReceipt