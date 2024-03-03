
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import API, { authApi, endpoints } from '../../configs/API';
import MyContext from '../../configs/MyContext';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Schedule = () => {
    const weekdays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
    const [list, setList] = useState(null)
    const [ListType, setType] = useState("now")
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)



    useEffect(() => {
        setList(null)

        const loadSchedule = async () => {
            let url = endpoints['schedule']
            if (ListType == "now") {
                url = `${url}/?type=now`
            } else {
                url = `${url}/?type=next`
            }

            try {
                let res = await authApi(accessTk).get(url)
                setList(res.data)
            }catch(ex){
                console.info(ex)
            }
        }

        loadSchedule()
    }, [ListType])


    const next_btn = () => {
        t = new Date()
        t = t.getDay()
        if (t == 6 || t == 0)
            setType('next')
        else
            Alert.alert("Bạn chỉ có thể xem lịch tiếp theo vào ngày thứ 7 đến CN hàng tuần")
    }
    return (
        <View style={[styles.container, { backgroundColor: '#F3F3F3' }]}>
            <View style={styles.item}>
                <TouchableOpacity onPress={() => setType('now')}>
                    <Text style={styles.button}>Lịch tuần này</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={next_btn}>
                    <Text style={styles.button}>Lịch tuần sau</Text>
                </TouchableOpacity>
            </View>
            <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} style={{ height: 500 }}>
                <View style={{ flexDirection: 'row' }}>
                    {list ? <>
                        {weekdays.map((s, index) => (
                            <View key={index}>
                                <Text style={[styles.button, { width: WIDTH / 2, backgroundColor: 'blue', borderWidth: 1, borderColor: 'grey', borderRadius: 0 }]}>{s}</Text>
                                {list.filter((s) => s.weekday == index + 1).length != 0 ? (<View style={[styles.button, styles.has_schedule,]}>
                                    <Text style={styles.text}>{list.filter((s) => s.weekday == index + 1)[0].ScheduleDate}</Text>
                                    <Text style={styles.text}>{list.filter((s) => s.weekday == index + 1)[0].department.name}</Text>
                                    <Text style={[styles.text, { color: "blue" }]}>Nhân lực:</Text>
                                    <View>
                                        {list.filter((s) => s.weekday == index + 1)[0].employees.map((s, index) => <Text>{s.user_info.role == 0 ? "Bác sĩ" : "Y tá"} {s.user_info.name}</Text>)}
                                    </View>
                                </View>) : <Text style={[styles.button, styles.none_has_schedule]}>Không có lịch làm</Text>}

                            </View>

                        ))}
                        <View>
                            <Text style={[styles.button, { width: WIDTH / 2, backgroundColor: 'blue', borderWidth: 1, borderColor: 'grey', borderRadius: 0 }]}> </Text>
                            <Text style={[styles.button, { width: WIDTH / 2, height: 400, backgroundColor: 'white', borderWidth: 1, borderColor: 'grey', borderRadius: 0 }]}></Text>
                        </View>
                    </> : <>
                        {weekdays.map((s, index) => (<View>
                            <Text style={[styles.button, { width: WIDTH / 2, backgroundColor: 'blue', borderWidth: 1, borderColor: 'grey', borderRadius: 0 }]}>{s}</Text>
                            <Text style={[styles.button, { color: 'grey', width: WIDTH / 2, height: 400, backgroundColor: 'white', borderWidth: 1, borderColor: 'grey', borderRadius: 0 }]}>Đang tải....</Text>
                        </View>))}
                    </>}
                </View>
            </ScrollView>
            {list ? null : <ActivityIndicator style={{ position: 'absolute', width: WIDTH, height: HEIGHT, backgroundColor: 'rgba(255 255 255/ 0.5)' }} color={'blue'} size={'large'} />}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        width: WIDTH - 40,
        marginTop: 100,
        padding: 30,
        backgroundColor: "white",
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 20,
        backgroundColor: 'white',
        alignSelf: 'center',
        marginBottom:50
    },
    button: {
        backgroundColor: 'green',
        color: 'white',
        padding: 10,
        width: 130,
        height: 50,
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        borderRadius: 20
    },
    has_schedule: {
        width: WIDTH / 2,
        height: 400,
        backgroundColor: '#9AC0FE',
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    none_has_schedule: {
        width: WIDTH / 2,
        height: 400,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 0,
        color: 'grey'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    }
})
export default Schedule