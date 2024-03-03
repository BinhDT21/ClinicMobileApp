import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Alert, Animated, Button, ScrollView, StyleSheet, Text, View } from "react-native"
import MyContext from "../../configs/MyContext"
import API, { authApi, endpoints } from "../../configs/API"
import { Image } from "react-native"
import Appointment_Current from "./Appointment_Current"

const AppointmentDetail = ({ navigation, route }) => {
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [appointment, setAppointment] = useState(null)
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(40))
    const [showMoreInfo, setShowMoreInfo] = useState(true)


    const [patient, setPatient] = useState(null)


    const id = route.params?.id

    useEffect(() => {
        const loadAppointment = async () => {
            try {
                let res = await authApi(accessTk).get(endpoints['appointment_detail'](id))
                console.log(res.data)
                setAppointment(res.data)


            } catch (ex) {
                console.info(ex)
            }
        }
        loadAppointment()
    }, [id])

    const CancleAppointment = async () => {
        try{
            let res = await authApi(accessTk).put(endpoints['appointment_cancel'](id))

            Alert.alert("Thông báo !", "Bạn hủy lịch khám thành công")
            navigation.navigate(Appointment_Current)
        }catch(ex){
            console.info(ex)
        }
    }

    const LoadPatient = async (patientId) => {
        try {

            let res = await API.get(endpoints['patient_detail'](patientId))
            setPatient(res.data)
            console.info('thong tin benh nhan lay duoc')
            console.info(res.data)

        } catch (ex) {
            console.info('load benh nhan that bai')
            console.info(ex)
        }
    }


    const showInfo = () => {
        Animated.spring(animatedValue, {
            toValue: 250,
            useNativeDriver: false
        }).start()
    }
    const hideInfo = () => {
        // setAnimatedValue(new Animated.Value(40))
        Animated.timing(animatedValue, {
            toValue: 42,
            duration: 1000,
            useNativeDriver: false
        }).start()
    }
    const handleShowInfo = (id) => {

        LoadPatient(id)
        if (showMoreInfo === true) {
            showInfo()
        } else
            hideInfo()

        setShowMoreInfo(!showMoreInfo)
        console.info(id)
    }


    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ width: "100%", alignItems: 'center', flexDirection: "row", marginVertical: 30 }}>
                <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                    style={{ width: 120, height: 120, borderRadius: 75, backgroundColor: "white", borderWidth: 8, borderColor: "#79AEFF", marginHorizontal: 10, position: "relative" }} />
                <View>
                    <Text style={{ fontSize: 45, fontWeight: 'bold', color: "orange" }}>PB CLINIC</Text>
                </View>
            </View>

            <ScrollView style={{ flex: 1, width: "95%", marginVertical: 20 }} showsVerticalScrollIndicator={false}>
                {appointment === null ? <ActivityIndicator /> : <>
                    {
                        <View style={{ alignItems: 'center' }}>
                            <View style={styles.view}>
                                <Text style={styles.subject}>THÔNG TIN LỊCH KHÁM</Text>
                                <View style={styles.panel_label_info}>
                                    <Text style={styles.label}>Mã lịch khám:</Text>
                                    <Text style={styles.text_info}>{appointment.id}</Text>
                                </View>
                                <View style={styles.panel_label_info}>
                                    <Text style={styles.label}>Ngày đăng ký:</Text>
                                    <Text style={styles.text_info}>{appointment.created_date}</Text>
                                </View>
                                <View style={styles.panel_label_info}>
                                    <Text style={styles.label}>Ngày khám bệnh:</Text>
                                    <Text style={styles.text_info}>{appointment.ExpectedDate}</Text>
                                </View>
                                <View style={styles.panel_label_info}>
                                    <Text style={styles.label}>Trạng thái:</Text>
                                    {appointment.confirmed === false ? <>
                                        <Text style={[styles.text_info, { color: "red" }]}>Chưa được xác nhận</Text>
                                    </> : <>
                                        <Text style={[styles.text_info, { color: "green" }]}>Đã được xác nhận</Text>
                                    </>}
                                </View>
                                <View style={styles.panel_label_info}>
                                    <Text style={styles.label}>Khoa khám bệnh:</Text>
                                    <Text style={styles.text_info}>{appointment.department.name}</Text>
                                </View>
                            </View>


                            <View style={styles.view}>
                                <Text style={styles.subject}>THÔNG TIN BỆNH NHÂN</Text>
                                <View style={styles.panel_label_info}>
                                    <Text style={styles.label}>Họ và tên:</Text>
                                    <Text style={styles.text_info}>{appointment.patient.user_info.name}</Text>
                                </View>
                            </View>
                            <Animated.View style={{ backgroundColor: "white", width: "90%", height: animatedValue }}>
                                <Button title="xem thêm thông tin" onPress={() => { handleShowInfo(appointment.patient.user_info.id) }} />
                                {patient === null ? <ActivityIndicator /> : <>
                                    <View>
                                        <View style={styles.panel_label_info}>
                                            <Text style={styles.label}>Mã bệnh nhân</Text>
                                            <Text style={styles.text_info}>{patient.user_info.id}</Text>
                                        </View>
                                        <View style={styles.panel_label_info}>
                                            <Text style={styles.label}>Giới tính</Text>
                                            {patient.user_info.gender === true ? <>
                                                <Text style={styles.text_info}>Nam</Text>
                                            </> : <>
                                                <Text style={styles.text_info}>Nữ</Text>
                                            </>}

                                        </View>
                                        <View style={styles.panel_label_info}>
                                            <Text style={styles.label}>Email:</Text>
                                            <Text style={styles.text_info}>{patient.user_info.email}</Text>
                                        </View>
                                        <View style={styles.panel_label_info}>
                                            <Text style={styles.label}>Ngày sinh</Text>
                                            <Text style={styles.text_info}>{patient.user_info.birthdate}</Text>
                                        </View>
                                        <View style={styles.panel_label_info}>
                                            <Text style={styles.label}>Địa chỉ</Text>
                                            <Text style={styles.text_info}>{patient.user_info.address}</Text>
                                        </View>

                                        <Button title="Hủy lịch khám" color={"red"} onPress={()=>{CancleAppointment()}}/>
                                    </View>
                                </>}

                            </Animated.View>
                        </View>
                    }
                </>}
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        width: "90%", backgroundColor: "white", marginVertical: 5
    },
    subject: {
        fontSize: 18, fontWeight: "bold", marginVertical: 20, marginLeft: 20
    },
    panel_label_info: {
        flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10,
        marginVertical: 5
    },
    label: {
        fontSize: 17,
        fontWeight: "bold"
    },
    text_info: {
        fontSize: 17,
    },
})
export default AppointmentDetail