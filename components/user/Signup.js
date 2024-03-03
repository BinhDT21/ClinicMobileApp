import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator, Text, ScrollView, View, Image, Button, Dimensions, Animated, TextInput, TouchableOpacity, Easing, FlatList, Alert, Modal } from 'react-native';
import { RadioButton } from 'react-native-paper' //npm install react-native-paper
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker'
import WelcomeScreen from '../home/WelcomeScreen';
import Login from './Login';
import API, { endpoints } from '../../configs/API';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const UserRole = ['Bác sĩ', 'Y tá', 'Người dùng', 'Quản trị viên']


const Signup = ({ navigation, route }) => {
    const is_Admin_creating = route.params.admin_creating
    const [p1, setP1] = useState(true)
    const [p2, setP2] = useState(false)
    const [p3, setP3] = useState(false)
    const [p4, setP4] = useState(false)
    const [cv, setCV] = useState(false)

    const [user, setUser] = useState({
        'first_name': '',
        'last_name': '',
        'email': '',
        'birthdate': '',
        'gender': true,
        'address': '',
        'password': '',
        'username': '',
        'avatar': {}
    })

    //P1
    const [date, setDate] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false);

    const change = (field, value) => {
        setUser(current => {
            return { ...current, [field]: value }
        })
    }
    const onChange = (event, selectedDate) => {
        setShowPicker(false);
        let formatedDate = selectedDate.getFullYear() + '-' + (selectedDate.getMonth() + 1) + '-' + selectedDate.getDate()
        change('birthdate', formatedDate)
    };
    const nextToP2 = () => {
        console.log(user)
        if (user.first_name == "" || user.last_name == "" || user.birthdate == "" || user.address == "") {
            Alert.alert("Vui lòng nhập đầy đủ thông tin")
            return
        }
        setP1(false)
        setP2(true)
        change('username', '')
        change('password', '')
    }
    //P2
    const [confirm, setCF] = useState("")
    const preToP1 = () => {
        setP1(true)
        setP2(false)
    }
    const nextToP3 = () => {
        if (user.username == "" || user.password == "" || confirm == "") {
            Alert.alert("Vui lòng nhập đầy đủ thông tin")
            return
        }
        if (user.password !== confirm) {
            Alert.alert("Xác nhận mật khẩu thất bại")
            return
        }
        setP2(false)
        setP3(true)
    }

    //P3
    const [active, setActive] = useState(false)
    const imagePicker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status === 'granted') {
            let res = await ImagePicker.launchImageLibraryAsync()
            if (!res.canceled) {
                change('avatar', res.assets[0])
                setActive(true)
            }
        }
    }
    const preToP2 = () => {
        setP2(true)
        setP3(false)
    }
    const nextToP4 = () => {
        if (!active) {
            Alert.alert("Vui lòng chọn hình ảnh")
            return
        }
        if (is_Admin_creating) {
            setP3(false)
            setP4(true)
        }
        else {
            setP3(false)
            setCV(true)
        }

    }

    //P4
    const pre = () => {
        setP3(true)
        setP4(false)
    }
    const nextToCreate = () => {
        setP4(false)
        setCV(true)
    }
    //Create view
    const create = async () => {
        const form = new FormData()
        for (let key in user)
            if (key === 'avatar') {
                form.append(key, {
                    uri: user[key].uri,
                    name: user[key].fileName,
                    type: 'image/jpeg'
                })
            } else {
                form.append(key, user[key])
            }

        console.log(form)

        if (is_Admin_creating) { }
        //POST LÊN KÈM ACCESS TOKEN CỦA ADMIN
        //CHUYỂN SANG TRANG ĐỂ CÀI TIẾP CÁC THUỘC TÍNH CỦA BÁC SĨ NẾU ROLE==0
        //VIẾT 1 HÀM CÀI THUỘC TÍNH (CHỈ CÓ BÁC SĨ LÀ CÀI THÊM KHOA ĐANG LM VIỆC)
        else {
            //POST LÊN BÌNH THƯỜNG
            let res = await API.post(endpoints['signup'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log(res)
            navigation.navigate(Login)
        }
    }
    useEffect(() => {
        // console.log(p1, p2, p3, p4, cv)
        if (cv) {
            create()
        }
    },[cv])
    return (
        <View style={[styles.container, styles.signup_layout,{height:HEIGHT-40}]}>


            <View style={{ marginTop: 100 }}>
                <Text style={styles.sigup_label}>Họ:</Text>
                <TextInput style={styles.signup_text} defaultValue={user.last_name} onChangeText={text => change('last_name', text)} />

                <Text style={styles.sigup_label}>Tên:</Text>
                <TextInput style={styles.signup_text} defaultValue={user.first_name} onChangeText={text => change('first_name', text)} />

                <Text style={styles.sigup_label}>Giới tính</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                        <Text style={{ padding: 7, fontSize: 15 }}>Nam</Text>
                        <RadioButton value='Nam' status={user.gender ? 'checked' : 'unchecked'} onPress={() => change('gender', true)} />
                    </View>
                    <View style={{ flexDirection: 'row', marginRight: 20 }}>
                        <Text style={{ padding: 7, fontSize: 15 }}>Nữ</Text>
                        <RadioButton value='Nữ' status={!user.gender ? 'checked' : 'unchecked'} onPress={() => change('gender', false)} />
                    </View>
                </View>

                <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }, styles.sigup_label]}>
                    <Text style={styles.sigup_label}>Ngày sinh</Text>
                    <Text style={[styles.signup_text, { paddingVertical: 17, borderWidth: 1, width: 100 }]} >{user.birthdate}</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>

                        <Text style={{ paddingVertical: 13, textAlign: 'center', width: 70, borderRadius: 20, backgroundColor: 'blue', color: 'white' }}>Tùy chỉnh</Text>
                        {showPicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onChange}

                            />
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.sigup_label}>Địa chỉ:</Text>
                <TextInput style={styles.signup_text} defaultValue={user.address} onChangeText={text => change('address', text)} />
            </View>
            <View style={[styles.signup_panel]}>
                <TouchableOpacity onPress={() => {

                    setP1(true)
                    navigation.navigate(WelcomeScreen)
                }}>
                    <Text style={styles.signup_btn}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextToP2}>
                    <Text style={styles.signup_btn}>Tiếp theo</Text>
                </TouchableOpacity>
            </View>





            <Modal visible={p2} animationType='slide'>
                <View style={[styles.container, styles.signup_layout]}>
                    <View style={{ marginTop: 200 }}>
                        <Text style={styles.sigup_label}>Tên đăng nhập:</Text>
                        <TextInput style={styles.signup_text} defaultValue={user.username} onChangeText={text => change('username', text)} />
                        <Text style={styles.sigup_label}>Mật khẩu:</Text>
                        <TextInput style={styles.signup_text} secureTextEntry defaultValue={user.password} onChangeText={text => change('password', text)} />
                        <Text style={styles.sigup_label}>Nhập lại mật khẩu:</Text>
                        <TextInput style={styles.signup_text} defaultValue={confirm} secureTextEntry onChangeText={text => setCF(text)} />
                    </View>
                    <View style={styles.signup_panel}>
                        <TouchableOpacity onPress={preToP1}>
                            <Text style={styles.signup_btn}>Quay lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextToP3}>
                            <Text style={styles.signup_btn}>Tiếp theo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={p3} animationType='slide'>
                <View style={[styles.container, styles.signup_layout]}>
                    <View style={{ marginTop: 200 }}>
                        <TouchableOpacity onPress={imagePicker}>
                            <Text style={{ fontSize: 20, backgroundColor: "blue", color: "white", borderRadius: 20, marginVertical: 5, padding: 20, alignSelf: "center" }}>Chọn ảnh đại diện</Text>
                        </TouchableOpacity>
                        <View style={{ alignSelf: "center", width: WIDTH - 40, height: WIDTH - 40, backgroundColor: '#CACACA', borderRadius: 20 }}>
                            {user.avatar != {} ? <Image style={{ width: WIDTH - 40, height: WIDTH - 40, borderWidth: 1, borderRadius: 20 }} source={{ uri: user.avatar.uri }} /> : ""}
                        </View>
                    </View>

                    <View style={styles.signup_panel}>
                        <TouchableOpacity onPress={preToP2}>
                            <Text style={styles.signup_btn}>Quay lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextToP4}>
                            <Text style={styles.signup_btn}>Tiếp theo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={p4} animationType='slide'>
                <View style={[styles.container, styles.signup_layout]}>
                    <View style={{ marginTop: 200 }}>
                        <Text style={styles.sigup_label}>LOẠI NHÂN VIÊN:</Text>
                        <TouchableOpacity onPress={() => change('role', 0)}>
                            <Text style={[styles.content_btn, 'role' in user && user.role == 0 ? { backgroundColor: '#f6aa30' } : {}]}>BÁC SĨ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => change('role', 1)}>
                            <Text style={[styles.content_btn, 'role' in user && user.role == 1 ? { backgroundColor: '#f6aa30' } : {}]}>Y TÁ</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signup_panel}>
                        <TouchableOpacity onPress={pre}>
                            <Text style={styles.signup_btn}>Quay lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={nextToCreate}>
                            <Text style={styles.signup_btn}>Tạo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={cv} animationType='slide'>
                <View style={styles.container}>
                    <Text style={styles.sigup_label}>Vui lòng chờ trong giây lát</Text>
                    <ActivityIndicator size="large" color="#f6aa30" />
                </View>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    sigup_label: {
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 20
    },
    signup_text: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        width: WIDTH - 100,
        height: 50,
        padding: 10,
        fontSize: 15
    },
    signup_layout: {
        width: WIDTH,
        height: HEIGHT,
        justifyContent: 'space-between'
    },
    signup_panel: {
        flexDirection: 'row',
        width: WIDTH,
        justifyContent: 'space-between'
    },
    signup_btn: {
        width: 120,
        height: 50,
        textAlign: 'center',
        textAlignVertical: 'center',
        backgroundColor: '#f6aa30',
        color: 'white',
        borderRadius: 20,
        fontWeight: 'bold',
        margin: 20
    },
    content_btn: {
        fontSize: 20,
        backgroundColor: "blue",
        color: "white",
        borderRadius: 20,
        marginVertical: 5,
        padding: 20,
        alignSelf: "center"
    }
});

export default Signup