import { useContext, useEffect, useState } from "react"

import { View, StyleSheet, Image, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Button } from "react-native";

import { authApi, endpoints } from "../../configs/API";
import MyContext from "../../configs/MyContext";



const MyReceipt = ({ navigation, route }) => {
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [receipt, setReceipt] = useState(null)
    const [nextPath, setNextPath] = useState('')
    const [showNextButton, setShowNextButton] = useState(true)
    const [prevPath, setPrevPath] = useState('')
    const [showPrevButton, setShowPrevButton] = useState(true)

    const Money = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'VND'
    })

    const loadReceipt = async () => {
        try {

            let res = await authApi(accessTk).get(endpoints['my_receipt'])
            setReceipt(res.data.results)

            if (res.data.next != null) {
                setNextPath(res.data.next)
                setShowNextButton(true)
            } else {
                setShowNextButton(false)
            }

            if (res.data.previous != null) {
                setPrevPath(res.data.previous)
                setShowPrevButton(true)
            } else {
                setShowPrevButton(false)
            }
            console.log(receipt)
        }
        catch (ex) {
            console.info(ex)
        }
    }

    useEffect(() => {
        loadReceipt()
    }, [accessTk])

    const loadNext = async () => {
        try {
            let res = await authApi(accessTk).get(nextPath)
            setReceipt(res.data.results)
            if (res.data.next != null) {
                setNextPath(res.data.next)
                setShowNextButton(true)
            } else {
                setShowNextButton(false)
            }
            if (res.data.previous != null) {
                setPrevPath(res.data.previous)
                setShowPrevButton(true)
            } else {
                setShowPrevButton(false)
            }
        } catch (ex) {
            console.log(ex)
        }
    }

    const loadPrevous = async () => {
        try {
            let res = await authApi(accessTk).get(prevPath)
            setReceipt(res.data.results)
            if (res.data.next != null) {
                setNextPath(res.data.next)
                setShowNextButton(true)
            } else {
                setShowNextButton(false)
            }
            if (res.data.previous != null) {
                setPrevPath(res.data.previous)
                setShowPrevButton(true)
            } else {
                setShowPrevButton(false)
            }
        } catch (ex) {
            console.log(ex)
        }
    }


    const renderReceipt = (item) => {
        return (
            <View style={{ width: "90%", backgroundColor: "white", borderRadius: 20, alignSelf: 'center', height: "auto", marginTop: 30, marginBottom:50 }} key={item.id}>
                <View style={[styles.panel_subject, { borderTopLeftRadius: 20, borderTopRightRadius: 20, flexDirection: "row", backgroundColor: "#2E67F8aa" }]}>
                    <Text style={styles.subject}>MÃ HÓA ĐƠN: </Text>
                    <Text style={styles.subject}>{item.record.id}</Text>
                </View>

                <View style={styles.panel_subject}>
                    <Text style={styles.subject}>THÔNG TIN BỆNH NHÂN: </Text>
                </View>
                <View style={styles.panel_textinfo}>
                    <Text style={styles.textInfo}>Mã bệnh nhân:</Text>
                    <Text style={styles.textInfo}>{item.record.patient.user_info.id}</Text>
                </View>

                <View style={styles.panel_textinfo}>
                    <Text style={styles.textInfo}>Tên bệnh nhân:</Text>
                    <Text style={styles.textInfo}>{item.record.patient.user_info.name}</Text>
                </View>

                <View style={styles.panel_subject}>
                    <Text style={styles.subject}>THÔNG TIN BÁC SĨ: </Text>

                </View>
                <View>
                    <View style={styles.panel_textinfo}>
                        <Text style={styles.textInfo}>Mã bác sĩ:</Text>
                        <Text style={styles.textInfo}>{item.record.doctor.employee_info.user_info.id}</Text>
                    </View>
                </View>

                <View style={styles.panel_textinfo}>
                    <Text style={styles.textInfo}>Tên bác sĩ:</Text>
                    <Text style={styles.textInfo}>{item.record.doctor.employee_info.user_info.name}</Text>
                </View>

                <View style={styles.panel_textinfo}>
                    <Text style={styles.textInfo}>Chuyên khoa:</Text>
                    <Text style={styles.textInfo}>{item.record.doctor.departments.name}</Text>
                </View>


                <View style={[styles.panel_subject, { flexDirection: "row" }]}>
                    <Text style={styles.subject}>TỔNG THANH TOÁN: </Text>
                    <Text style={styles.subject}>{Money.format(item.total)}</Text>
                </View>
                

                <View style={[styles.panel_subject, { flexDirection: "row" }]}>
                    <Text style={styles.subject}>NGÀY: </Text>
                    <Text style={styles.subject}>{item.created_date}</Text>
                </View>

                <Button title="Xem chi tiết" onPress={()=>{navigation.navigate('MyDetailReceipt',{'id':item.record.id})}}/>
            </View>
        )
    }

    return (
        <ScrollView style={{ flex: 1, width: "100%", marginBottom: 20 }}>
            <View style={{ width: "100%", alignItems: 'center', marginTop: 50, flexDirection: "row" }}>
                <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                    style={{ width: 120, height: 120, borderRadius: 75, backgroundColor: "white", borderWidth: 8, borderColor: "#79AEFF", marginHorizontal: 10 }} />
                <View>
                    <Text style={{ fontSize: 45, fontWeight: 'bold', color: "blue" }}>PB CLINIC</Text>
                    <Text>Hóa đơn của khách hàng</Text>
                </View>
            </View>

            {receipt === null ? <ActivityIndicator /> : <>

                {receipt.map(item => (
                    renderReceipt(item)
                ))}
            </>}

            <View style={{ width: "90%", alignSelf: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>


                {showPrevButton === true ? <>
                    <TouchableOpacity style={{ backgroundColor: "#2E67F8", width: 120, alignItems: "center", borderRadius: 10 }} onPress={() => { loadPrevous() }}>
                        <Text style={{ fontSize: 17, paddingVertical: 5, fontWeight: "bold", color: "white" }}>Trang trước</Text>
                    </TouchableOpacity>
                </> : <>
                    <TouchableOpacity style={{ backgroundColor: "gray", width: 120, alignItems: "center", borderRadius: 10 }} onPress={() => { loadPrevous() }} disabled={true}>
                        <Text style={{ fontSize: 17, paddingVertical: 5, fontWeight: "bold", color: "white" }}>Trang trước</Text>
                    </TouchableOpacity>
                </>}


                {showNextButton === true ? <>
                    <TouchableOpacity style={{ backgroundColor: "#2E67F8", width: 150, alignItems: "center", borderRadius: 10 }} onPress={() => { loadNext() }} >
                        <Text style={{ fontSize: 17, paddingVertical: 5, fontWeight: "bold", color: "white" }}>Trang tiếp theo</Text>
                    </TouchableOpacity>
                </> : <>
                    <TouchableOpacity style={{ backgroundColor: "gray", width: 150, alignItems: "center", borderRadius: 10 }} onPress={() => { loadNext() }} disabled={true}>
                        <Text style={{ fontSize: 17, paddingVertical: 5, fontWeight: "bold", color: "white" }}>Trang tiếp theo</Text>
                    </TouchableOpacity>
                </>}

            </View>
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
export default MyReceipt