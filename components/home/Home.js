import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Image, Button, Dimensions, Animated, TextInput, TouchableOpacity, Easing, FlatList, ActivityIndicator } from 'react-native';
import MyContext from "../../configs/MyContext";
import Login from '../user/Login';
import Signup from '../user/Signup';
import { FontAwesome5 } from "react-native-vector-icons"
import Appointment from '../appointment/Appointment';
import Medicine from '../medicine/Medicine';
import ApppointmentList from '../appointment/AppointmentList';
import WelcomeScreen from './WelcomeScreen';
import Create_health_record_medicines from '../../health_record/health_record_medicines';
import MyHealthRecord from '../../health_record/my_healthRecord';
import Manage from '../admin/Manage';
import Stat from '../admin/Stat';
import MyReceipt from '../receipt/receipt_getMyReceipt';
import Schedule from '../schedule/schedule';


const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const UserRole = ['Bác sĩ', 'Y tá', 'Quản trị viên', 'Người dùng']
const adList = [{
    id: "01",
    image: "https://marketplace.canva.com/EAE_Jk3uJTI/1/0/1600w/canva-medical-%28card-%28landscape%29%29-jsWLtRsAl50.jpg"
}, {
    id: "02",
    image: "https://digeemed.com/assets/images/why-hospitals-should-partner-with-a-healthcare-marketing-agency.png"
}, {
    id: "03",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWsKkVqZFwJQ_Wx0tnxe4mGT_RCxEgZlFs-g&usqp=CAU"
}]
const HDSD = [
    { for: 5, name: "Tổng quan", content: "Phòng khám đa khoa PB Clinic là một địa điểm y tế uy tín, đã hoạt động hơn hai thập kỷ tại Tp Hồ Chí Minh, Việt Nam. Dựa vào sự chuyên nghiệp và tận tâm, PB Clinic đã tạo dựng được uy tín lớn trong việc khám chữa bệnh và dịch vụ chăm sóc." },
    { for: 5, name: "Thuốc", content: "Chúng tôi cung cấp một kho tàng thông tin thuốc để cho bạn có thể tra cứu, cách sử dụng, nhấn ngay vào 'Thuốc' để bắt đầu" },
    { for: 2, name: "Lịch Khám", content: "Bạn có thể hoàn toàn đặt trước lịch khám thông qua ứng dụng này, bằng cách chọn vào 'Đặt lịch khám', chọn ngày giờ và khoa khám, sau khi được xác nhận, chúng tôi sẽ gửi về mail cho bạn một thông báo, và bạn có thể đến khám trực tiếp mà không cần phải chờ đợi" },
    { for: 2, name: "Toa Thuốc", content: "Bạn có thể xem và kiểm tra toa thuốc sau khi khám chữa trị tại PB Clinic, nhấp ngay vào mục 'Toa Thuốc' để xem chi tiết" },
    { for: 2, name: "Hóa đơn", content: "Bạn có thể xem và kiểm tra hóa đơn khám chữa trị tại PB Clinic, nhấp ngay vào 'Hóa đơn' để xem chi tiết" },
    { for: 0, name: "Toa Thuốc", content: "Bạn có thể khám chữ bệnh cho một bệnh nhân, kê đơn thuốc cho bệnh nhân, nhấp vào 'Kê đơn thuốc' để thực hiện chức năng này" },
    { for: 0, name: "Bệnh án", content: "Bạn có thể tra cứu những hồ sơ khám bệnh của bệnh nhân, chi tiết nhấp vào 'Tra cứu bệnh án" },
    { for: 1, name: "Lịch khám", content: "Bạn có tra cứu, xác nhận lịch khám của bênh nhân, chi tiết nhấp vào 'Xác nhận lịch khám'" },
    { for: 1, name: "Hóa đơn", content: "Bạn có thể tiến hành xuất hóa đơn của bệnh nhân, chi tiết nhấp vào 'Xuất hóa đơn'" },
    { for: 3, name: "Nhân viên", content: "Bạn có thể quản lý các nhân viên của PB Clinic, chi tiết nhấp 'Quản lý nhân viên'" },
    { for: 3, name: "Thuốc", content: "Bạn có thể quản lý các sản phẩm thuốc đang được cung cấp tại PB Clinic, chi tiết nhấp 'Quản lý thuốc'" },
    { for: 3, name: "Báo Cáo", content: "Bạn có thể xem báo cáo, biểu đồ, chi tiết nhấp vào 'Báo cáo'" },
    { for: 5, name: "Sai sót", content: "Nếu gặp bất kì sai sót, hoặc sai lầm thì đừng ngần ngại liên hệ với chúng toi qua sđt: 0983xxxxxxx hoặc thông qua mhphat@gmail.com" }
]
const Function = [
    { id: 0, for: 0, name: "Kê đơn thuốc", icon: "pen" },
    { id: 1, for: 0, name: "Tra cứu bệnh án", icon: "search" },
    { id: 2, for: 5, name: "Thuốc", icon: "capsules" },
    { id: 3, for: 1, name: "Xác nhận lịch khám", icon: "check" },
    { id: 4, for: 1, name: "Xuất hóa đơn", icon: "paste" },
    { id: 5, for: 3, name: "Đặt lịch khám", icon: "calendar-plus" },
    { id: 6, for: 3, name: "Bệnh án", icon: "file-signature" },
    { id: 7, for: 3, name: "Hóa đơn", icon: "money-check-alt" },
    { id: 8, for: 2, name: "Quản lý", icon: "users-cog" },
    { id: 9, for: 2, name: "Thống kê", icon: "signal" },
    { id: 10, for: 0, name: "Lịch trực", icon: "calendar-alt" },
    { id: 11, for: 1, name: "Lịch trực", icon: "calendar-alt" },
]




const Home = ({ navigation }) => {
    const num = 2
    const adFlat = useRef()
    const [activeAd, setActiveAd] = useState(0)
    const [HList, setHList] = useState([])
    const [HContent, setHContent] = useState(HDSD[0].content)
    const DynamidHeight = useRef(new Animated.Value(0)).current
    const [hideable, setHideable] = useState(false)
    const [FList, setFL] = useState([])

    const [chosen, setChosen] = useState(0)
    const [doctors, setDoctors] = useState([])
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [loading, setLoading] = useState(false)



    //ADVERTISEMENT COMPONENT
    const renderAd = (item, index) => {
        return <View style={styles.container}>
            <Image source={{ uri: item['item'].image }} style={{ resizeMode: 'cover', height: 200, width: WIDTH }} />
        </View>
    }

    const renderDot = (event) => {
        return (
            adList.map((dot, index) => {
                return <View key={index} style={index == activeAd ? styles.dot_active : styles.dot}></View>
            })
        )
    }

    const handlerScroll = (event) => {
        const ad = Math.ceil(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width)
        setActiveAd(ad)
    }
    //Auto play
    useEffect(() => {
        let i = setInterval(() => {
            if (activeAd === adList.length - 1) {
                adFlat.current.scrollToIndex({
                    index: 0,
                    animation: true,
                })
            } else {
                adFlat.current.scrollToIndex({
                    index: activeAd + 1,
                    animation: true,
                })
            }
        }, 3000)
        return () => { clearInterval(i) }
    }, [activeAd])



    const getItemLayout = (data, index) => ({
        length: WIDTH,
        offset: WIDTH * index,
        index: index,
    });

    //HDSD COMPONENT
    const renderHDSD = ({ item, index }) => {

        return (
            <TouchableOpacity onPress={() => Show_HC(item.content, index)}>
                <View
                    style={[index == chosen ? { backgroundColor: '#f6aa30' } : { backgroundColor: "#F3F3F3" }, {
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: WIDTH / 4,
                        height: 70,
                        borderRadius: 25,
                        marginHorizontal: 5
                    }]} key={index}>
                    <Text style={[index == chosen ? { color: 'white' } : { color: 'black' }, { fontSize: 18, fontWeight: 'bold' }]}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    useEffect(() => {
        if (user != null) {
            setHList(HDSD.filter(item => (item.for == 5 || item.for == user.user_info.role)))
            setFL(Function.filter(item => (item.for == 5 || item.for == user.user_info.role)))
            if(user.user_info.role===2){
                setFL(Function.filter(item => (item.for == user.user_info.role)))
            }

        } else {
            setHList(HDSD.filter(item => (item.for == 5 || item.for == 3)))
            setFL(Function.filter(item => (item.for == 5 || item.for == 3)))
        }

    }, [user])

    const Show_HC = (content, index) => {
        setChosen(index)
        setHContent(content)
        Animated.timing(DynamidHeight, {
            toValue: 170,
            duration: 1000,
            useNativeDriver: false,
        }).start(() => { setHideable(true) })
    }

    const Hide_HC = () => {
        setHideable(false)
        Animated.timing(DynamidHeight, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
        }).start()
    }
    //USER COMPONENT
    const Unauthorized = () => {
        return (
            <View style={[styles.home_container]}>
                <Text style={{ marginTop: 20, fontSize: 20, fontWeight: 'bold' }}>Chào mừng đến với PB Clinic</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: WIDTH - WIDTH / 2, marginVertical: 20 }}>
                    <Button color='blue' title='Đăng nhập' onPress={() => { navigation.navigate(Login) }} />
                    <Button color="#f6aa30" title='Đăng kí' onPress={() => { navigation.navigate('Signup', {'admin_creating': false}) }} />
                </View>
            </View>
        )
    }

    const Authorized = () => {
        return (
            <View style={[styles.home_container, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <Image style={[styles.circle, { borderWidth: 4, borderColor: "blue", margin: 30, marginRight: 0 }]} source={{ uri: user.user_info.image_url }} />
                <View style={{ margin: 30, marginLeft: 10, alignContent: 'center', width: (WIDTH - 40) / 2 }}>
                    <Text style={{ fontWeight: 'bold', color: "grey" }}>XIN CHÀO {UserRole[user.user_info.role].toUpperCase()} </Text>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>{user.user_info.first_name} {user.user_info.last_name}</Text>

                    {loading === true ? <>
                        <ActivityIndicator />
                    </> : <>
                        <Button title='Đăng xuất' color="grey" onPress={() => { logout() }} />
                    </>}

                </View>
            </View>
        )
    }
    //FUNCTION COMPONENT
    const handlePressItem = (item) => {

        console.info(item)
        switch (item) {
            case 0: {
                navigation.navigate(Create_health_record_medicines)
                break;
            }
            case 1: {
                navigation.navigate(Create_health_record_medicines)
                break;
            }
            case 2: {
                navigation.navigate(Medicine)
                break;
            }
            case 3: {
                navigation.navigate(ApppointmentList)
                break;
            }
            case 4: {
                navigation.navigate(Create_health_record_medicines)
                break;
            }
            case 5: {
                if (user === null) {
                    navigation.navigate(Login)
                }
                else {
                    navigation.navigate(Appointment)
                }
                break;
            }
            case 6: {
                if (user===null){
                    navigation.navigate(Login)
                }else{
                    navigation.navigate(MyHealthRecord)
                }
                
                break;
            }
            case 7: {
                if (user===null){
                    navigation.navigate(Login)
                }else{
                    navigation.navigate(MyReceipt)
                }
                
                break;
            }
            case 8: {
                navigation.navigate(Manage)
                break;
            }
            case 9: {
                navigation.navigate(Stat)
                break;
            }
            case 10: {
                navigation.navigate(Schedule)
                break;
            }
            case 11: {
                navigation.navigate(Schedule)
                break;
            }
            default:
                break;
        }


    }
    const renderFB = ({ item, index }) => {

        return (
            <TouchableOpacity style={[styles.function_item]} onPress={() => handlePressItem(item.id)}>
                <View style={styles.funtion_block}>
                    <FontAwesome5 name={item.icon} color='white' size={35} />
                </View>
                <Text>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    //DOCTORS COMPONENT
    useEffect(() => {
        fetch('https://hphat03.pythonanywhere.com/doctor/').then(res => res.json()).then((data) => {
            setDoctors(data)
        })
    }, [])

    const renderDoctor = ({ item, index }) => {
        return (
            <View key={item.employee_info.user_info.id} style={{ width: 300, marginHorizontal: 27, marginVertical: 10, borderWidth: 1, padding: 10, borderRadius: 20, borderColor: "grey", flexDirection: 'row' }}>
                <Image source={{ uri: item.employee_info.user_info.image_url }} style={{ width: 100, height: 130, resizeMode: 'cover', borderRadius: 20 }}></Image>
                <View style={{ margin: 20, marginVertical: 35 }}>
                    <Text>BÁC SĨ</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.employee_info.user_info.name.toUpperCase()}</Text>
                    <Text style={{ fontSize: 13 }}>{item.departments.name}</Text>
                </View>
            </View>
        )
    }
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
    return (
        <ScrollView style={{ backgroundColor: "#F3F3F3" }}>

            {/*  */}
            <FlatList
                data={adList}
                ref={adFlat}
                keyExtractor={(item) => item.id}
                renderItem={renderAd}
                onScroll={handlerScroll}
                getItemLayout={getItemLayout}
                horizontal
                pagingEnabled
                style={{ marginTop: 50 }}></FlatList>
            {/*  */}

            <View style={{ justifyContent: 'center', flexDirection: 'row', marginVertical: 7 }}>{renderDot()}</View>

            {/*  */}

            <View style={styles.home_child}>
                {user === null ? <>
                    {Unauthorized()}
                </> : <>
                    {Authorized()}
                </>}
            </View>

            {/*  */}

            <Animated.View style={[styles.home_child, { backgroundColor: 'white', height: 170 + DynamidHeight, justifyContent: 'center', alignItems: 'flex-start' }]}>
                <Text style={styles.h2}>Hướng dẫn chung:</Text>
                <FlatList data={HList} renderItem={renderHDSD} horizontal style={{ marginBottom: 20 }}></FlatList>
                <Animated.View style={{ width: WIDTH, backgroundColor: '#f6aa30', height: DynamidHeight, borderColor: 'grey' }}>
                    <Text style={{ color: 'white', padding: 15, fontSize: 16 }}>{HContent}</Text>
                    {hideable ? <TouchableOpacity style={[styles.circle, { width: 40, height: 40, position: 'absolute', left: WIDTH - 70, top: 110, backgroundColor: 'coral', borderWidth: 0, justifyContent: 'center', alignItems: 'center' }]}
                        onPress={Hide_HC}>
                        <Text style={{ fontSize: 20, color: 'white' }}>⤫</Text>
                    </TouchableOpacity> : null}
                </Animated.View>
            </Animated.View>

            <View style={styles.home_child}>
                <View style={[styles.home_container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <FlatList
                        data={FList}
                        renderItem={renderFB}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={num}

                    />
                </View>
            </View>
            <StatusBar style="auto" />
            <View style={styles.home_child}>
                <View style={styles.home_container}>
                    <Text style={styles.h2}>Đồng hành cùng PB Clinic</Text>
                    <FlatList
                        data={doctors}
                        renderItem={renderDoctor}
                        pagingEnabled
                        horizontal
                    ></FlatList>
                </View>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "blue",
        borderWidth: 8,
        borderColor: "#79AEFF",
    },
    button_panel: {
        marginHorizontal: 30,
        color: "white",
        justifyContent: 'space-between',
        width: 200,
        height: 130,
        fontSize: 4,
    },
    wrap: {
        width: WIDTH - 40,
        height: HEIGHT / 4,
        borderRadius: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#282828",
        marginHorizontal: 6
    },
    dot_active: {
        width: 20,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#282828",
        marginHorizontal: 6
    },
    dot_panel: {
        position: 'absolute',
        top: HEIGHT - 200,
        flexDirection: 'row',
    },
    login_panel_child: {
        marginVertical: 6,
        borderWidth: 6
    },
    home_child: {
        alignItems: 'center',
        marginVertical: 30
    },
    home_container: {
        backgroundColor: 'white',
        width: WIDTH - 40,
        alignItems: 'center',
        borderRadius: 20
    },
    function_row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 30
    },
    function_item: {
        width: 130,
        height: 130,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    funtion_block: {
        backgroundColor: '#f6aa30',
        width: 80,
        height: 60,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',

    },
    h2: { fontSize: 24, fontWeight: 'bold', margin: 20 }
});
export default Home