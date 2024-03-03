
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Button, Dimensions, ActivityIndicator, TouchableOpacity, } from 'react-native';
import MyContext from '../configs/MyContext';
import { authApi, endpoints } from '../configs/API';
import { Create_health_record_medicines } from './health_record_medicines'
import DateTimePicker from "react-native-modal-datetime-picker";
import { AntDesign } from '@expo/vector-icons';

const Unit = ['viên', 'gói', 'hộp']
const Period = ['sáng', 'trưa', 'chiều']

const Money = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'VND'
})
const MyHealthRecord = () => {
    const [healthRecord, setHealRecord] = useState([])
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [nextPath, setNextPath] = useState('')
    const [showNextButton, setShowNextButton] = useState(true)
    const [prevPath, setPrevPath] = useState('')
    const [showPrevButton, setShowPrevButton] = useState(true)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')



    const loadHealthRecord = async () => {
        try {

            let url = endpoints['my_health_record']
            if (startDate !== '' || endDate !== '') {
                url = `${url}?start=${startDate}&end=${endDate}`
            }


            let res = await authApi(accessTk).get(url)
            setHealRecord(res.data.results)
            console.info(res.data.results)

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
    useEffect(() => {
        loadHealthRecord()
    }, [user])
    const loadNext = async () => {
        try {
            let res = await authApi(accessTk).get(nextPath)
            setHealRecord(res.data.results)
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
            setHealRecord(res.data.results)
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

    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

    const showStartDatePicker = () => {
        setStartDatePickerVisibility(true);
    };
    const showEndDatePicker = () => {
        setEndDatePickerVisibility(true);
    };
    const hideStartDatePicker = () => {
        setStartDatePickerVisibility(false);
    };
    const hideEndDatePicker = () => {
        setEndDatePickerVisibility(false);
    };
    const handleConfirmStartDate = (date) => {
        let tmp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        setStartDate(tmp)
        hideStartDatePicker();
    };
    const handleConfirmEndDate = (date) => {
        let tmp = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        setEndDate(tmp)
        hideEndDatePicker();
    };

    return (

        <ScrollView style={{ flex: 1, width: "100%", height: "100%" }}>

            <View style={[styles.view, { height: "auto", alignSelf: "center", marginTop: 25 }]}>
                <Text style={styles.subject}>Lọc theo ngày: </Text>

                <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", margin: 30 }}>
                    <Button title={startDate === '' ? 'Ngày bắt đầu' : startDate} onPress={showStartDatePicker} />
                    <DateTimePicker
                        isVisible={isStartDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmStartDate}
                        onCancel={hideStartDatePicker}
                        display="spinner"

                    />
                    <Button title={endDate === '' ? 'Ngày kết thúc' : endDate} onPress={showEndDatePicker} />
                    <DateTimePicker
                        isVisible={isEndDatePickerVisible}
                        mode="date"
                        onConfirm={handleConfirmEndDate}
                        onCancel={hideEndDatePicker}
                        display="spinner"

                    />

                    <TouchableOpacity style={{ width: 30, height: 30, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "gray" }}
                        onPress={() => { loadHealthRecord() }}>
                        <AntDesign name="filter" size={25} />
                    </TouchableOpacity>

                </View>

            </View>
            {healthRecord === null ? <ActivityIndicator /> : <>

                {healthRecord.map(item => (
                    <View style={styles.container}>
                        {/* thong tin chung */}
                        <View style={styles.view}>
                            <Text style={styles.subject}>THÔNG TIN BỆNH ÁN CÁ NHÂN</Text>
                            <View style={styles.panel_label_info}>
                                <Text style={styles.label}>Mã bệnh án:</Text>
                                <Text style={styles.text_info}>{item.id}</Text>
                            </View>
                            <View style={styles.panel_label_info}>
                                <Text style={styles.label}>Bệnh nhân:</Text>
                                <Text style={styles.text_info}>{item.patient.user_info.name}</Text>
                            </View>
                            <View style={styles.panel_label_info}>
                                <Text style={styles.label}>Bác sĩ:</Text>
                                <Text style={styles.text_info}>{item.doctor.employee_info.user_info.name}</Text>
                            </View>
                            <View style={styles.panel_label_info}>
                                <Text style={styles.label}>Khoa:</Text>
                                <Text style={styles.text_info}>{item.doctor.departments.name}</Text>
                            </View>
                            <View style={{ width: "90%", height: 1, backgroundColor: "gray", alignSelf: "center", marginVertical: 5 }} />
                            <View style={styles.panel_label_info}>
                                <Text style={styles.label}>Trạng thái:</Text>
                                {item.lock === true ? <>
                                    <Text style={[styles.text_info, { color: "green" }]}>Đã xuất hóa đơn</Text>
                                </> : <>
                                    <Text style={[styles.text_info, { color: "red" }]}>Chưa xuất hóa đơn</Text>
                                </>}
                            </View>
                            <View style={styles.panel_label_info}>
                                <Text style={styles.label}>Ngày khám:</Text>
                                <Text style={styles.text_info}>{item.created_date}</Text>
                            </View>
                            <View style={styles.panel_label_info}>
                                <Text style={styles.label}>Ngày cập nhật gần nhất:</Text>
                                <Text style={styles.text_info}>{item.updated_date}</Text>
                            </View>
                        </View>

                        {/* ho so suc khoe */}
                        <View style={styles.view}>
                            <Text style={styles.subject}>THÔNG TIN SỨC KHỎE</Text>
                            <Text style={styles.label}>Triệu chứng</Text>
                            <View style={styles.symstom_box}>
                                <Text style={styles.text_info}>{item.symstoms}</Text>
                            </View>

                            <Text style={styles.label}>Kết luận</Text>
                            <View style={styles.symstom_box}>
                                <Text style={styles.text_info}>{item.overview}</Text>
                            </View>

                        </View>

                        {/* cac dich vu */}
                        < View style={styles.view} >
                            <Text style={styles.subject}>CÁC DỊCH VỤ</Text>
                            {
                                item.services === null ? <></> : <>
                                    {
                                        item.services.map(sv => (
                                            <View key={sv.id}>
                                                <View style={styles.services_panel}>
                                                    <Text style={[styles.text_info, { color: "white", paddingLeft: 5, fontWeight: "bold" }]}>{sv.name}</Text>
                                                </View>

                                            </View>
                                        ))
                                    }
                                </>
                            }

                        </View>
                        {/* don thuoc */}
                        <View style={styles.view}>
                            <Text style={styles.subject}>ĐƠN THUỐC</Text>
                            {item.medicines_detail === null ? <></> : <>
                                {
                                    item.medicines_detail.map(med => (
                                        <View key={med.id} style={{ width: "100%", alignItems: "center" }}>
                                            <View style={{ borderWidth: 1, borderRadius: 10, width: "95%", alignSelf: "center" }}>
                                                <View style={styles.panel_label_info}>
                                                    <Text style={styles.label}>Tên thuốc:</Text>
                                                    <Text style={styles.text_info}>{med.medicine.name}</Text>
                                                </View>

                                                <View style={styles.panel_label_info}>
                                                    <Text style={styles.label}>Số lượng:</Text>
                                                    <Text style={styles.text_info}>{med.amount} {Unit[med.unit]}</Text>
                                                </View>

                                                <View style={styles.panel_label_info}>
                                                    <Text style={styles.label}>Tổng tiền:</Text>
                                                    <Text style={styles.text_info}>{Money.format(med.total)}</Text>
                                                </View>
                                            </View>

                                            <View style={{ width: "80%", backgroundColor: "gray", borderBottomLeftRadius: 10, borderBottomRightRadius: 10, alignItems: "center", marginBottom: 20 }}>
                                                {med.instructions.map((i, index) => (
                                                    <View key={index} style={{}}>
                                                        <Text style={{ color: "white", fontSize: 17 }}>Dùng...{i.amount}...{Unit[i.unit]}/{Period[i.period]}</Text>
                                                    </View>
                                                ))}
                                            </View>

                                        </View>
                                    ))
                                }
                            </>}

                        </View>
                    </View>
                ))
                }

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
        </ScrollView >

    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 10, marginBottom: 30
    },
    view: {
        width: "90%", backgroundColor: "white", marginVertical: 5
    },
    subject: {
        fontSize: 18, fontWeight: "bold", marginVertical: 20, marginLeft: 20
    },
    panel_label_info: {
        flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10,
        marginVertical: 2
    },
    label: {
        fontSize: 17,
        fontWeight: "bold"
    },
    text_info: {
        fontSize: 17,
    },
    symstom_box: {
        width: "90%", height: 100, borderWidth: 1, borderRadius: 20, alignSelf: "center", alignItems: "center", justifyContent: "center", marginVertical: 5, borderColor: "orange"
    },
    services_panel: {
        backgroundColor: "orange", width: "90%", alignSelf: "center", marginVertical: 3, borderRadius: 8
    }
})
export default MyHealthRecord