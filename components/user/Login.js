import { useContext, useState } from "react"
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyContext from "../../configs/MyContext"
import API, { authApi, endpoints } from "../../configs/API"
import Home from "../home/Home"



const Login = ({ navigation}) => {
    const [usFocus, setUsFocused] = useState(false)
    const [passFocus, setPassFocused] = useState(false)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [loading, setLoading] = useState(false)


    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    

    const login = async () => {
        setLoading(true)
        try {
            let res = await API.post(endpoints['login'], {
                "username": username,
                "password": password,
                "client_id": "76By4NEVDuDJMUQjFjibNHcjjLs8qM5rIcvzsZbE",
                "client_secret": "vOmQFbOqW7bJlHBTfY6ij7LvaVfnqZl7umhmkslrvE5uOV2ypH0DLA0fV0Q5pWYXXOsTq1Emtxi3dwRwjdp1AKxklfFndmta51QZBNHWV4S1OMKNeYgSStmRwtgxmmLl",
                "grant_type": "password"
            })
            let u = await authApi(res.data.access_token).get(endpoints['current_user'])

            dispatch({
                type: "login",
                payload: u.data,
            })
            navigation.navigate(Home)
            console.info(u.data)
            setAccessTk(res.data.access_token)
        } catch (ex) {
            console.log(ex)
            console.info(username)
            console.info(password)
            Alert.alert('Thông báo !',"Bạn đã nhập sai username hoặc mật khẩu !")
        } finally {
            setLoading(false)
        }
    }


    return (
        <View style={{ flex: 1, width: "100%" }}>
            <KeyboardAwareScrollView >
                <View style={{ flex: 1, width: "100%", alignItems: 'center', justifyContent: 'center', marginVertical: 50 }}>
                    <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                        style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: "blue", borderWidth: 8, borderColor: "#79AEFF" }} />
                    <Text style={{ fontSize: 20 }}>Chào mừng bạn đến với</Text>
                    <Text style={{ fontSize: 45, fontWeight: 'bold', color: "blue" }}>PB CLINIC</Text>
                </View>


                <View style={{ flex: 1.1, width: "100%", alignItems: 'center' }}>

                    <TextInput onFocus={() => setUsFocused(true)} onBlur={() => setUsFocused(false)}
                        style={[styles.border_input, usFocus && { borderColor: "blue", borderWidth: 2 }]}
                        placeholder="Tên đăng nhập"
                        value={username} onChangeText={t => setUsername(t)} />

                    <TextInput onFocus={() => { setPassFocused(true) }} onBlur={() => { setPassFocused(false) }}
                        style={[styles.border_input, passFocus && { borderColor: "#f6aa30", borderWidth: 2 }]} placeholder="Mật khẩu"
                        secureTextEntry={true}
                        value={password} onChangeText={t => setPassword(t)} />


                    {loading === true ? <><ActivityIndicator /></> : <>
                        <TouchableOpacity style={styles.button} onPress={() => { login() }}>
                            <Text style={styles.text_button}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </>}


                    <Text>Đăng nhập bằng cách khác</Text>

                    <TouchableOpacity style={[styles.button, { backgroundColor: "#173278", width: "70%" }]}>
                        <Text style={styles.text_button}>Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: "#ED1D24", width: "70%" }]}>
                        <Text style={styles.text_button}>Email</Text>
                    </TouchableOpacity>


                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => { navigation.navigate('Signup', {'admin_creating': false}) }} >
                            <Text style={{ color: "blue" }}>Đăng ký </Text>
                        </TouchableOpacity>
                        <Text>nếu bạn chưa có tài khoản</Text>
                    </View>


                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    border_input: {
        borderWidth: 1, borderColor: "black", width: "90%", fontSize: 20, paddingVertical: 8, marginVertical: 10, paddingLeft: 10, borderRadius: 10
    },
    button: {
        width: "60%",
        backgroundColor: "#2E67F8",
        alignItems: "center",
        marginVertical: 10,
        borderRadius: 10
    },
    text_button: {
        fontSize: 18,
        fontWeight: "500",
        color: "white",
        paddingVertical: 7
    }
})
export default Login