import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Image, Button, Dimensions, Animated, TextInput, TouchableOpacity, Easing, FlatList } from 'react-native';
import MyContext from '../../configs/MyContext';
import { authApi, endpoints } from '../../configs/API';


const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Appointment_Current = ({navigation}) => {
    const [type, setType] = useState(0)
    const [list, setList] = useState([])
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const chosen = useRef(new Animated.Value(0)).current


    const changeAnimation = (index) => {
        Animated.timing(chosen, {
            toValue: index * WIDTH / 3,
            duration: 300,
            useNativeDriver: false,
        }).start(() => { setType(index) })
    }

    useEffect(() => {
        const loadList = async () => {
            switch (type) {
                case 0: {
                    let res = await authApi(accessTk).get(endpoints['appointment_currentPatient_recent'])
                    console.info("case 0")
                    setList(res.data)
                    console.info(list)
                    break
                }
                case 1:
                    {
                        let res =await authApi(accessTk).get(endpoints['appointment_currentPatient_sucess'])
                        console.info("case 1")
                        setList(res.data)
                        console.info(list)
                        break
                    }
                case 2:
                    {
                        let res =await authApi(accessTk).get(endpoints['appointment_currentPatient_canceled'])
                        console.info("case 2")
                        setList(res.data)
                        console.info(list)
                        break
                    }
            }
        }
        loadList()
    }, [type])

    const getTime = (string, type) => {
        string = string.split(/[\s,]+/)
        switch (type) {
            case 'time': {
                return string[1]
            }
            case 'date': {
                return string[0]
            }
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#F3F3F3" }}>
            <View style={{ backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: WIDTH, height: 55 }}>
                <TouchableOpacity onPress={() => changeAnimation(0)}><Text style={styles.hd_btn}>Gần đây</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => changeAnimation(1)}><Text style={styles.hd_btn}>Đã xác nhận</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => changeAnimation(2)}><Text style={styles.hd_btn}>Đã hủy</Text></TouchableOpacity>
                <Animated.View style={{ position: 'absolute', left: chosen, width: WIDTH / 3, top: 53, height: 1, borderBottomColor: "blue", borderBottomWidth: 2 }}></Animated.View>
            </View>
            <View style={styles.container}>
                <ScrollView>
                    {list.map((item, index) => (
                        <View key={item.id} style={{ width: WIDTH - 40, backgroundColor: 'white', height: 200, borderRadius: 20, marginVertical: 15, flexDirection: 'row' }}>
                            <Image source={{ uri: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xpbmljfGVufDB8fDB8fHww" }} style={{ width: 70, height: 200, borderBottomLeftRadius: 20, borderTopLeftRadius: 20 }}></Image>
                            <View style={{ justifyContent: 'space-between' }}>
                                <Text style={[styles.h2, { borderRadius: 5, marginVertical: 5, color: 'grey', width: (WIDTH - 40) * 2 / 3, borderWidth: 1, borderColor: 'grey', padding: 5, fontSize: 20, textAlign: 'center' }]}>{item.department.name}</Text>
                                <View style={{ borderRadius: 5, borderWidth: 1, borderColor: 'grey', height: 100, width: (WIDTH - 40) * 2 / 3 + 20, marginLeft: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                                        <Text style={{ fontSize: 10 }}>NGƯỜI DÙNG</Text>
                                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>{item.patient.user_info.name}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, width: 100, borderLeftWidth: 1, borderColor: 'grey' }}>
                                        <Text style={[styles.funtion_block, { height: 30, width: 30 }, type == 2 ? { backgroundColor: 'red' } : item.confirmed ? { backgroundColor: "green" } : { backgroundColor: '#f6aa30' }]}></Text>
                                        <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 8 }}>{getTime(item.ExpectedDate, 'time')}</Text>
                                        <Text>{getTime(item.ExpectedDate, 'date')}</Text>
                                    </View>

                                </View>

                                {/*  */}
                                <TouchableOpacity onPress={()=>{navigation.navigate('AppointmentDetail',{'id':item.id})}}>
                                    <Text style={{ marginLeft: 20, marginBottom: 5, backgroundColor: 'blue', color: 'white', fontSize: 15, textAlign: 'center', width: (WIDTH - 40) * 2 / 3, borderRadius: 5, textAlignVertical: 'center', height: 30 }}>
                                        XEM CHI TIẾT</Text>
                                </TouchableOpacity>
                            </View>
                        </View>))}
                </ScrollView>
            </View>
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
        width: 60,
        height: 60,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center'
    },
    h2: { fontSize: 24, fontWeight: 'bold', margin: 20 },
    hd_btn: {
        paddingHorizontal: 30,
        borderLeftColor: '#F3F3F3',
        borderLeftWidth: 1,
        textAlign: 'center',
        width: WIDTH / 3,
        height: 50,
        textAlignVertical: 'center'
    }
});
export default Appointment_Current