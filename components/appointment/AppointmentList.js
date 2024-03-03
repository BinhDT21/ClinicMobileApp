import { useContext, useEffect, useState } from "react"
import { Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MyContext from "../../configs/MyContext"
import { authApi, endpoints } from "../../configs/API"
import { ActivityIndicator } from "react-native"

const ApppointmentList = () => {
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [appointment, setAppointment] = useState(null)

    const [next, setNext] = useState(false)
    const [prevous, setPrevous] = useState(false)
    const [urlNext, setUrlNext] = useState('')
    const [urlPrevous, setUrlPrevous] = useState('')
    const [reload, setReload] = useState(true)



    useEffect(() => {
        const loadAppointment = async () => {
            let url = endpoints['appointment']
            try {
                let res = await authApi(accessTk).get(url)
                setAppointment(res.data.results)

                if (res.data.next !== null) {
                    setNext(true)
                    setUrlNext(res.data.next)

                } else {
                    setNext(false)

                }

                if (res.data.previous === null) {
                    setPrevous(false)

                } else {
                    setUrlPrevous(res.data.previous)
                    setPrevous(true)
                }
            } catch (ex) {
                console.error(ex)
            }
        }
        loadAppointment()
    }, [reload])

    const loadAppointment = async (val) => {

        try {
            let res = await authApi(accessTk).get(val)
            setAppointment(res.data.results)

            if (res.data.next != null) {
                setNext(true)
                setUrlNext(res.data.next)
            } else {
                setNext(false)
            }

            if (res.data.previous != null) {
                setPrevous(true)
                setUrlPrevous(res.data.previous)
            } else {
                setPrevous(false)
            }

        } catch (ex) {
            console.error(ex)
        }

    }


    const confirm = async (id) => {
        try {
            let res = await authApi(accessTk).post(endpoints['appointment_confirm'](id))
            setReload(!reload)
        } catch (ex) {
            console.error(ex)
        }
    }
    // const cancel = async (id) => {
    //     try {
    //         let res = await authApi(accessTk).put(endpoints['appointment_cancel'](id))
    //         setReload(!reload)
    //     } catch (ex) {
    //         console.error(ex)
    //     }
    // }
    return (
        <ScrollView style={{ flex: 1, width: "100%", backgroundColor: "#F3F3F3" }}>
            <View style={{ width: "100%", alignItems: 'center', marginTop: 50, flexDirection: "row" }}>
                <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                    style={{ width: 120, height: 120, borderRadius: 75, backgroundColor: "white", borderWidth: 8, borderColor: "#79AEFF", marginHorizontal: 10 }} />
                <View>
                    <Text style={{ fontSize: 45, fontWeight: 'bold', color: "blue" }}>PB CLINIC</Text>
                    <Text>Danh sách đăng ký khám bệnh</Text>
                </View>
            </View>


            {appointment === null ? <ActivityIndicator /> : <>
                {
                    appointment.map(a => (
                        <View key={a.id} style={{ marginVertical: 30, width: "100%", height: 300, borderWidth: 0, borderColor: "#2E67F8", alignSelf: "center", borderRadius: 15, backgroundColor: "white", flexDirection: "column" }}>

                            <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                <Text style={{ fontSize: 18, paddingLeft: 10 }}>Id: </Text>
                                <Text style={{ fontSize: 18 }}>{a.id}</Text>
                            </View>

                            <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                <Text style={{ fontSize: 18, paddingLeft: 10 }}>Bệnh nhân: </Text>
                                <Text style={{ fontSize: 18 }}>{a.patient.user_info.name}</Text>
                            </View>

                            <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                <Text style={{ fontSize: 18, paddingLeft: 10 }}>Khoa khám: </Text>
                                <Text style={{ fontSize: 18 }}>{a.department.name}</Text>
                            </View>

                            <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                <Text style={{ fontSize: 18, paddingLeft: 10 }}>Lịch khám: </Text>
                                <Text style={{ fontSize: 18 }}>{a.ExpectedDate}</Text>
                            </View>

                            <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                <Text style={{ fontSize: 18, paddingLeft: 10 }}>Trạng thái: </Text>
                                {a.confirmed === true ? <>
                                    <Text style={{ fontSize: 18, color: "green" }}>đã xác nhận</Text>
                                </> : <>
                                    <Text style={{ fontSize: 18, color: "red" }}>chưa xác nhận</Text>
                                </>}
                            </View>
                                        


                            <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", paddingTop: 10 }}>
                                <TouchableOpacity style={{ width: 150, height: 40, backgroundColor: "orange", alignItems: "center", justifyContent: "center", borderRadius: 15, marginHorizontal: 10 }} onPress={() => { confirm(a.id) }}>
                                    <Text style={{ color: "white", fontSize: 17 }}>Xác nhận</Text>
                                </TouchableOpacity>
                                {/* <TouchableOpacity style={{ width: 150, height: 40, backgroundColor: "#2E67F8", alignItems: "center", justifyContent: "center", borderRadius: 15, marginHorizontal: 10 }} onPress={() => { cancel(a.id) }}>
                                    <Text style={{ color: "white", fontSize: 17 }}>Hủy bỏ</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    ))
                }
            </>}

            <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
                {prevous && (
                    <TouchableOpacity style={{ width: 150, height: 40, backgroundColor: "gray", alignItems: "center", justifyContent: "center", borderRadius: 10, marginHorizontal: 15 }}
                        onPress={() => { loadAppointment(urlPrevous) }}>
                        <Text style={{ color: "white", fontSize: 17 }}>Trang trước</Text>
                    </TouchableOpacity>

                )}

                {next && (
                    <TouchableOpacity style={{ width: 150, height: 40, backgroundColor: "gray", alignItems: "center", justifyContent: "center", borderRadius: 10, marginHorizontal: 15 }}
                        onPress={() => { loadAppointment(urlNext) }}>
                        <Text style={{ color: "white", fontSize: 17 }}>Trang tiếp theo</Text>
                    </TouchableOpacity>
                )}

            </View>



        </ScrollView>
    )
}
const styles = StyleSheet.create({

})
export default ApppointmentList
