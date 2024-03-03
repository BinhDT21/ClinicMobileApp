import { useContext, useState } from "react"
import { ActivityIndicator, Animated, Image, ImageBackground, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native"
import MyContext from "../../configs/MyContext"
import WelcomeScreen from "../home/WelcomeScreen"

const ProfileScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false)
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [animateValue, setAnimateValue] = useState(new Animated.Value(50))
    const [show, setShow] = useState(true)

    const logout = () => {
        setLoading(true)
        try {
            dispatch({
                type: "logout",
                payload: {
                    "username": null,
                    "password": null,
                }
            })
            setAccessTk('')
            navigation.navigate(WelcomeScreen)
        } finally {
            setLoading(false)
        }

    }
    const showInfo = () => {

        Animated.spring(animateValue, {
            toValue: 400,
            useNativeDriver: false,
        }).start()

    }
    const hideInfo = () => {

        Animated.spring(animateValue, {
            toValue: 50,
            useNativeDriver: false
        }).start()

    }
    const showInfoView = () => {
        if (show === true) {
            showInfo()
        } else
            hideInfo()
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ backgroundColor: "white", borderRadius: 20, width: "90%", alignSelf: "center", marginTop: 20, justifyContent: "center" }}>

                <View style={{ alignItems: "center", }}>
                    <View style={{ width: 150, height: 150, backgroundColor: "white", borderRadius: 70, alignSelf: "center" }}>
                        <Image source={{ uri: user.user_info.image_url }} resizeMode="contain" style={{ width: 150, height: 150, borderRadius: 500, }} />
                    </View>
                    <Text style={{ fontSize: 20, marginTop: 10 }}>{user.user_info.first_name} {user.user_info.last_name}</Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginVertical: 20 }}>
                        {user.user_info.role === 3 ? <>
                        <TouchableOpacity style={{ backgroundColor: "#2E67F8", borderRadius: 17, width: 140, alignItems: "center" }} onPress={() => navigation.navigate('Appointment')}>
                            <Text style={{ color: "white", fontSize: 17, paddingVertical: 10 }}>Đặt lịch khám</Text>
                        </TouchableOpacity></> : <></>}
                        {user.user_info.role === 0 ? <>
                        <TouchableOpacity style={{ backgroundColor: "#2E67F8", borderRadius: 17, width: 150, alignItems: "center" }} onPress={() => navigation.navigate('Create_health_record_medicines')}>
                            <Text style={{ color: "white", fontSize: 17, paddingVertical: 10 }}>Tra cứu bệnh án</Text>
                        </TouchableOpacity></> : <></>}
                        {user.user_info.role === 1 ? <>
                        <TouchableOpacity style={{ backgroundColor: "#2E67F8", borderRadius: 17, width: 200, alignItems: "center" }} onPress={() => navigation.navigate('ApppointmentList')}>
                            <Text style={{ color: "white", fontSize: 17, paddingVertical: 10 }}>Xác nhận lịch khám</Text>
                        </TouchableOpacity></> : <></>}

                        {loading === true ? <ActivityIndicator /> : <>
                            <TouchableOpacity style={{ backgroundColor: "gray", borderRadius: 17, width: 140, alignItems: "center" }} onPress={() => logout()}>
                                <Text style={{ color: "white", fontSize: 17, paddingVertical: 10 }}>Đăng xuất</Text>
                            </TouchableOpacity></>}
                    </View>
                </View>
            </View>

            {/* ****************************************************************** */}
            <Animated.View style={{ backgroundColor: "white", borderRadius: 20, width: "90%", alignSelf: "center", marginVertical: 20, height: animateValue }}>
                <TouchableOpacity onPress={() => { setShow(!show), showInfoView() }} style={{ backgroundColor: 'orange', borderRadius: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginHorizontal: 5, marginVertical: 10, color: "white", alignSelf: "center" }}>Thông tin cá nhân</Text>
                </TouchableOpacity>

                <View style={styles.info_panel}>
                    <Text style={styles.info_text}>Username</Text>
                    <Text style={styles.info_text}>{user.user_info.username}</Text>
                </View>

                <View style={styles.info_panel}>
                    <Text style={styles.info_text}>Email</Text>
                    <Text style={styles.info_text}>{user.user_info.email}</Text>
                </View>

                <View style={styles.info_panel}>
                    <Text style={styles.info_text}>Giới tính</Text>
                    {user.user_info.gender === true ? <>
                        <Text style={styles.info_text}>Nam</Text>
                    </> : <>
                        <Text style={styles.info_text}>Nữ</Text>
                    </>}
                </View>

                <View style={styles.info_panel}>
                    <Text style={styles.info_text}>Địa chỉ</Text>
                    <Text style={styles.info_text}>{user.user_info.address}</Text>
                </View>

                <View style={styles.info_panel}>
                    <Text style={styles.info_text}>Ngày sinh</Text>
                    <Text style={styles.info_text}>{user.user_info.birthdate}</Text>
                </View>
            </Animated.View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    info_panel: {
        flexDirection: "row", marginHorizontal: 20, justifyContent: "space-between", marginVertical: 20
    },
    info_text: {
        fontSize: 17
    }
})
export default ProfileScreen