import { useContext, useEffect, useState } from "react"

import { View, StyleSheet, Image, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Button } from "react-native";
import MyContext from "../configs/MyContext";
import { authApi, endpoints } from "../configs/API";


const Receipt = ({ navigation, route }) => {
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [receipt, setReceipt] = useState(null)
    const id = route.params?.id
    const Money = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'VND'
    })

    const loadReceipt = async () => {
        try {
            console.info("id health record:", id)
            let res = await authApi(accessTk).get(endpoints['health_record_getreceipt'](id))
            setReceipt(res.data)
        }
        catch (ex) {
            console.info(ex)
            Alert.alert("Thông báo !","y tá chưa xác nhận hóa đơn toa thuốc !")
            navigation.navigate('HealthrecordDetail',{'id':id})
        }
    }

    useEffect(() => {
        loadReceipt()
    }, [id])

    // xac nhan benh nhan da thanh toan
    const paidReceipt = async () => {
        try{
            let res = await authApi(accessTk).put(endpoints['receipt_paid'](id))
            Alert.alert("Thông báo !","Đã xác nhận thành công")
            navigation.navigate('Create_health_record_medicines')
        }catch(ex){
            console.info(ex)
        }
    }


    return (
        <ScrollView style={{ flex: 1, width: "100%", marginBottom: 20 }}>
            <View style={{ width: "100%", alignItems: 'center', marginTop: 50, flexDirection: "row" }}>
                <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                    style={{ width: 120, height: 120, borderRadius: 75, backgroundColor: "white", borderWidth: 8, borderColor: "#79AEFF", marginHorizontal: 10 }} />
                <View>
                    <Text style={{ fontSize: 45, fontWeight: 'bold', color: "blue" }}>PB CLINIC</Text>
                    <Text>Chi tiết hóa đơn </Text>
                </View>
            </View>
            {receipt === null ? <ActivityIndicator /> : <>
                
                    <View style={{ width: "90%", backgroundColor: "white", borderRadius: 20, alignSelf: 'center', height:"auto", marginVertical: 20 }}>

                        <View style={[styles.panel_subject, { borderTopLeftRadius: 20,borderTopRightRadius: 20, flexDirection: "row", }]}>
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
                            {receipt.detail.map(item => (
                                <>
                                    <View style={styles.panel_textinfo}>
                                        <Text style={[styles.textInfo,{fontWeight:"bold"}]}>Tên dịch vụ: </Text>
                                        <Text style={styles.textInfo}>{item.name}</Text>
                                    </View>
                                    <View style={styles.panel_textinfo}>
                                        <Text style={[styles.textInfo,{fontSize:15,paddingLeft:20}]}>Thành tiền: </Text>
                                        <Text style={styles.textInfo}>{Money.format(item.price)}</Text>
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

                        <View style={[styles.panel_subject,{flexDirection:"row"}]}>
                            <Text style={styles.subject}>TỔNG THANH TOÁN: </Text>
                            <Text style={styles.subject}>{Money.format(receipt.total)}</Text>
                        </View>

                        <Button title="xác nhận thanh toán" onPress={()=>{paidReceipt()}}/>
                    </View>
                


            </>}
            <TouchableOpacity style={{alignItems:"center", backgroundColor:"lightgray", width:"30%", alignSelf:"center", borderRadius:7}} onPress={()=>navigation.navigate('HealthrecordDetail',{'id':id})}>
                <Text style={{fontSize:15, paddingVertical:4}}>Quay lại</Text>
            </TouchableOpacity>

            {/* them nut xac nhan thanh toan */}
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    panel_subject: {
        backgroundColor: "orange", width: "100%", flexDirection: "colum",
    },
    subject: {
        color: "white", fontSize: 18, paddingVertical: 7, paddingLeft: 20, fontWeight: "500"
    },
    panel_textinfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal:10,
        marginVertical:8
    },
    textInfo: {
        fontSize: 17
    }
})
export default Receipt