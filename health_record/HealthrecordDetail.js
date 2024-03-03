import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Button, Dimensions, ActivityIndicator, TouchableOpacity, } from 'react-native';
import MyContext from '../configs/MyContext';
import { authApi, endpoints } from '../configs/API';
import { Create_health_record_medicines } from './health_record_medicines'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Unit = ['viên', 'gói', 'hộp']
const Period = ['sáng', 'trưa', 'chiều']
const Money = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'VND'
})

const HealthrecordDetail = ({ navigation, route }) => {
    const [role, setRole] = useState(null)
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [HRDetail, setHRDetail] = useState(null)
    const id = route.params?.id

    useEffect(() => {
        try {
            setRole(user.user_info.role)

        } catch {
            setRole(0)
        }
    }, [user])


    const loadHealthrecordDetail = async () => {
        try {

            let res = await authApi(accessTk).get(endpoints['health_record_detail'](id))
            console.info(res.data)
            setHRDetail(res.data)
        } catch (ex) {
            console.log(ex)
        }
    }
    useEffect(() => {
        loadHealthrecordDetail()
    }, [id])


    return (
        <View style={{ height: "100%" }}>
            <ScrollView style={{ marginTop: 30, width: WIDTH, height: HEIGHT, backgroundColor: '#F3F3F3' }}>
                {HRDetail === null ? <ActivityIndicator /> : <>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.detail_item}>
                            <Text style={styles.dheader}>THÔNG TIN CHUNG</Text>
                            <View style={styles.col2}>
                                <Text style={styles.dlabel}>Mã bệnh án:</Text>
                                <Text style={styles.dtext}>{HRDetail.id}</Text>
                            </View>
                            <View style={styles.col2}>
                                <Text style={styles.dlabel}>Bệnh nhân:</Text>
                                <Text style={styles.dtext}>{HRDetail.patient.user_info.name}</Text>
                            </View>
                            <View style={styles.col2}>
                                <Text style={styles.dlabel}>Bác sĩ:</Text>
                                <Text style={styles.dtext}>{HRDetail.doctor.employee_info.user_info.name}</Text>
                            </View>
                            <View style={styles.col2}>
                                <Text style={styles.dlabel}>Khoa:</Text>
                                <Text style={styles.dtext}>{HRDetail.doctor.departments.name}</Text>
                            </View>

                            <View style={{ width: WIDTH - 60, height: 1, borderWidth: 0.5, marginVertical: 20, marginHorizontal: 10 }}></View>
                            <View style={styles.col2}>
                                <Text style={styles.dlabel}>Trạng thái:</Text>
                                {HRDetail.locked === false ? <Text style={[styles.dtext, { color: "green" }]}>Mở</Text> : <Text style={[styles.dtext, { color: "red" }]}>Khóa</Text>}
                            </View>
                            <View style={styles.col2}>
                                <Text style={styles.dlabel}>Ngày khám:</Text>
                                <Text style={styles.dtext}>{HRDetail.created_date}</Text>
                            </View>
                            <View style={styles.col2}>
                                <Text style={styles.dlabel}>Cập nhật gần nhất:</Text>
                                <Text style={styles.dtext}>{HRDetail.updated_date}</Text>
                            </View>
                        </View>
                        <View style={styles.detail_item}>
                            <Text style={styles.dheader}>HỒ SƠ SỨC KHỎE</Text>
                            <View>
                                <Text style={[styles.dlabel, { marginBottom: 10, marginLeft: 10 }]}>Triệu chứng:</Text>
                                <Text style={styles.dbox}>{HRDetail.symstoms}</Text>
                            </View>
                            <View>
                                <Text style={[styles.dlabel, { marginVertical: 10, marginLeft: 10 }]}>Kết luận:</Text>
                                <Text style={styles.dbox}>{HRDetail.overview}</Text>
                            </View>
                        </View>

                        <View style={styles.detail_item}>
                            <Text style={styles.dheader}>CÁC DỊCH VỤ:</Text>
                            {HRDetail.services.map((s, index) => (
                                <Text key={s.id} style={[styles.dlabel, { width: WIDTH - 50, padding: 5, margin: 5, backgroundColor: "#f6aa30", color: "white", borderRadius: 5 }]}>{s.name}</Text>
                            ))}
                        </View>

                        <View style={styles.detail_item}>
                            <Text style={styles.dheader}>ĐƠN THUỐC:</Text>
                            <View style={{ backgroundColor: '#F3F3F3', width: WIDTH - 50, padding: 10 }}>

                                {HRDetail.medicines_detail.map((s, index) => (
                                    <View key={s.medicine.id} style={{ alignItems: 'center', marginTop: 10, marginHorizontal: 3 }}>
                                        <View style={{ backgroundColor: 'white', width: WIDTH - 60, padding: 10, borderColor: 'grey', borderWidth: 1, borderRadius: 10 }}>
                                            <View style={styles.col2}>
                                                <Text style={styles.dlabel}>Tên thuốc:</Text>
                                                <Text style={styles.dtext}>{s.medicine.name}</Text>
                                            </View>
                                            <View style={styles.col2}>
                                                <Text style={styles.dlabel}>Số lượng:</Text>
                                                <Text style={styles.dtext}>{s.amount} {Unit[s.unit]}</Text>
                                            </View>
                                            <View style={styles.col2}>
                                                <Text style={styles.dlabel}>Tổng tiền:</Text>
                                                <Text style={styles.dtext}>{Money.format(s.total)}</Text>
                                            </View>
                                        </View>

                                        <View style={{ backgroundColor: 'grey', width: WIDTH - 100, alignItems: 'center', borderBottomEndRadius: 20, borderBottomStartRadius: 20 }}>
                                            {s.instructions.map((i, index) => (
                                                <Text key={index} style={{ backgroundColor: 'grey', color: 'white', fontWeight: 'bold', marginVertical: 3 }}>Dùng...{i.amount}...{Unit[i.unit]}/{Period[i.period]}</Text>
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </>}
            </ScrollView>
            <View style={[styles.detail_item, { flexDirection: 'row', justifyContent: "space-around", marginBottom: 0, width: "100%" }]}>
                {role === 1 ? <Button title='Xuất hóa đơn' color={'orange'} onPress={() => { navigation.navigate('Receipt', { 'id': id }) }} /> : null}
                <Button title='Quay lại' color={'grey'} onPress={() => { navigation.navigate('Create_health_record_medicines') }} />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 20
    },
    detail_item: {
        width: WIDTH - 20,
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 10,

    },
    col2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    dlabel: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    dtext: {
        fontSize: 15
    },
    dheader: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 20
    },
    dbox: {
        width: WIDTH - 40,
        height: 100,
        textAlign: 'center',
        textAlignVertical: 'center',
        borderWidth: 1,
        borderColor: '#f6aa30',
        borderRadius: 20
    }
})
export default HealthrecordDetail