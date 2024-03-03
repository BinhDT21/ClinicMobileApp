import { all } from "axios"
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Animated, Button, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from "react-native"
import { SelectList } from 'react-native-dropdown-select-list'
import API, { authApi, endpoints } from "../configs/API"
import MyContext from "../configs/MyContext"
import { AntDesign } from "react-native-vector-icons"
import HealthrecordDetail from "./HealthrecordDetail"


const Create_health_record_medicines = ({ navigation }) => {
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [medicines, setMedicines] = useState([])
    const [medicineList, setMedicineList] = useState(null)
    const [medicineItem, setMedicineItem] = useState({
        'id': null,
        'amount': null,
        'unit': '',
        'instructions': []
    })

    const [ins_items, setIns_items] = useState({
        'amount': 0,
        'period': '',
        'unit': ''
    })
    const changeMedicineItem = (field, value) => {
        setMedicineItem(current => {
            return { ...current, [field]: value }
        })
    }
    const [healthRecord, setHealthRecord] = useState(null)
    const [nextPath, setNextPath] = useState('')
    const [disable, setDisable] = useState(false)
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0))
    const [showModalAddMedicines, setShowModalAddMedicines] = useState(false)
    const [showModalPickMedicines, setShowModalPickMedicines] = useState(false)
    const [idHR, setIdHR] = useState(null)
    const [medName, setMedName] = useState(null)
    const [medId, setMetId] = useState(null)
    const [medUnit, setMedUnit] = useState([])
    const [role, setRole] = useState(null)
    const [loadNextMedList, setloadNextMedList] = useState(false)
    const [nextPath_Med, setNextPath_Med] = useState('')
    
    const periodData = [
        { key: 0, value: 'MORN', },
        { key: 1, value: 'AFNOON' },
        { key: 2, value: 'EVE' },
    ]
    const ins_periodData = [
        { key: 'TABLET', value: 'viên'},
        { key: 'BOX', value: 'hộp' },
        { key: 'PACK', value: 'gói ' },
    ]
    // vd moi lan bam la them 1 {"amount": "1", "period": "1"}
    const addInstructions = () => {
        let tmp = medicineItem.instructions.concat(ins_items)
        changeMedicineItem('instructions', tmp)
        changeMedicineItem('id', medId)
        console.info(medicineItem.instructions)
    }

    // vd moi lan bam la them 1 medicine item
    const addMedicines = () => {
        let tmp = medicines
        let tmpConcat = tmp.concat(medicineItem)
        setMedicines(tmpConcat)
        console.info("line 77", tmpConcat)
        changeMedicineItem('instructions', [])

    }

    //them amount va period cua 1 instructions
    const change = (field, value) => {
        setIns_items(current => {
            return { ...current, [field]: value }
        })
    }

    const loadHealthRecord = async () => {
        let res = await authApi(accessTk).get(endpoints['health_record'])
        setHealthRecord(res.data.results)
        if (res.data.next !== null)
            setNextPath(res.data.next)
    }
    useEffect(() => {
        loadHealthRecord()
        setDisable(false)
    }, [])

    const renderHealthRecordList = (item) => {
        return (
            <View key={item.id} style={{ marginTop: 30, marginBottom: 15, width: "90%", height: "auto", alignSelf: "center", backgroundColor: "white", borderRadius: 20 }}>

                <View style={{ marginBottom: 10, width: "100%", alignItems: "center", backgroundColor: "orange",flexDirection:"row",justifyContent:"center" }}>
                    <Text style={{ color: "white", fontWeight: "bold", paddingVertical: 5, paddingHorizontal:10 }}>HỒ SƠ BỆNH ÁN</Text>
                    <Text style={{ color: "white", fontWeight: "bold", paddingVertical: 5,paddingHorizontal:10 }}>{item.id}</Text>
                </View>

                <View style={styles.info_panel}>
                    <View style={styles.label}>
                        <Text style={styles.text}>Họ tên bệnh nhân: </Text>
                    </View>

                    <View style={[styles.label, { backgroundColor: "white" }]}>
                        <Text style={[styles.text, { color: "black", fontWeight: "400" }]}>{item.patient.user_info.name}</Text>
                    </View>
                </View>

                <View style={styles.info_panel}>
                    <View style={styles.label}>
                        <Text style={styles.text}>Mã số bệnh nhân: </Text>
                    </View>

                    <View style={[styles.label, { backgroundColor: "white" }]}>
                        <Text style={[styles.text, { color: "black", fontWeight: "400" }]}>{item.patient.user_info.id}</Text>
                    </View>
                </View>

                <View style={styles.info_panel}>
                    <View style={styles.label}>
                        <Text style={styles.text}>Bác sĩ lập bệnh án: </Text>
                    </View>
                    <View style={[styles.label, { backgroundColor: "white" }]}>
                        <Text style={[styles.text, { color: "black", fontWeight: "400" }]}>{item.doctor.employee_info.user_info.name}</Text>
                    </View>
                </View>

                <View style={styles.info_panel}>
                    <View style={styles.label}>
                        <Text style={styles.text}>Chuyên khoa: </Text>
                    </View>

                    <View style={[styles.label, { backgroundColor: "white" }]}>
                        <Text style={[styles.text, { color: "black", fontWeight: "400" }]}>{item.doctor.departments.name}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                    <TouchableOpacity style={{ backgroundColor: "orange", alignItems: "center", borderRadius: 15, marginVertical: 15 }} onPress={() => { navigation.navigate('HealthrecordDetail', { "id": item.id }) }}>
                        <Text style={{ fontSize: 17, color: "white", padding: 10, fontWeight: "bold" }}>Chi tiết bệnh án</Text>
                    </TouchableOpacity>
                    {role === 0 ? <>
                        <TouchableOpacity style={{ backgroundColor: "#06BF06", alignItems: "center", borderRadius: 15, marginVertical: 15 }} onPress={() => showPopup(item.id)}>
                            <Text style={{ fontSize: 17, color: "white", padding: 10, fontWeight: "bold" }}>Chỉnh sửa toa thuốc</Text>
                        </TouchableOpacity>
                    </> : <>
                        <TouchableOpacity style={{ backgroundColor: "#06BF06", alignItems: "center", borderRadius: 15, marginVertical: 15 }} onPress={() => { make_receipt(item.id) }}>
                            <Text style={{ fontSize: 17, color: "white", padding: 10, fontWeight: "bold" }}>Xác nhận bệnh án</Text>
                        </TouchableOpacity>
                    </>}
                </View>

            </View>
        )

    }

    const loadNextList = async () => {
        let res = await authApi(accessTk).get(nextPath)

        let tmpList = healthRecord
        let ConcatList = tmpList.concat(res.data.results)
        setHealthRecord(ConcatList)
        console.info("load next healthrecord thanh cong")
        if (res.data.next !== null) {
            setNextPath(res.data.next)
        }
        else {
            setDisable(true)
        }
    }

    const showPopup = (id) => {
        setIdHR(id)
        setShowModalAddMedicines(!showModalAddMedicines)
        Animated.spring(animatedValue, {
            toValue: 700,
            useNativeDriver: false
        }).start()
    }
    const hidePopup = () => {
        setIdHR(null)
        setAnimatedValue(new Animated.Value(0))
        setShowModalAddMedicines(!showModalAddMedicines)
        Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: false
        }).start()
    }

    // tạo đơn thuốc / thêm thuốc
    const prescription_override = async () => {
        console.log(medicines)
        try {
            let res = await authApi(accessTk).post(endpoints['health_record_medicine'](idHR), {
                'override': true,
                'medicines': medicines
            })

            Alert.alert("Thông báo !","Tạo toa thuốc thành công")
            console.info(res.data)
            setMedicines([]);
            hidePopup()
        } catch (ex) {
            setMedicines([]);
            console.error(ex)
        }
    }
    const prescription = async () => {
        console.log(medicines)
        try {
            let res = await authApi(accessTk).post(endpoints['health_record_medicine'](idHR), {
                'override': false,
                'medicines': medicines
            })

            Alert.alert("Thông báo !","Tạo toa thuốc thành công")
            console.info(res.data)
            setMedicines([]);
            hidePopup()
        } catch (ex) {
            setMedicines([]);
            console.error(ex)
        }
    }

    //load trang lựa thuốc
    const loadMedicines = async () => {
        let res = await API.get(endpoints['medicine'])
        setMedicineList(res.data.results)
        if (res.data.next !== null)
            setNextPath_Med(res.data.next)

    }
    useEffect(() => {
        loadMedicines()
        setloadNextMedList(false)
    }, [])
    const loadNextMedicines = async () => {
        let res = await API.get(nextPath_Med)
        let ConcatList = medicineList.concat(res.data.results)
        setMedicineList(ConcatList)
        if (res.data.next !== null) {
            setNextPath_Med(res.data.next)
        }
        else {
            setloadNextMedList(true)
        }
    }

    const PickMedicine = (id, name) => {
        setMetId(id)
        setMedName(name)

        setShowModalPickMedicines(!showModalPickMedicines)
    }

    const setUnit = (value) => {
        changeMedicineItem('unit', value)
    }

    const setPeriod = (value) => {

        change('period', value)

    }
    const confirmMed = () => {
        addMedicines();
        setShowModalPickMedicines(!showModalPickMedicines)
    }

    const getUnit = async (id) => {
        let url = `https://hphat03.pythonanywhere.com/medicines/${id}/unit/`
        let res = await API.get(url)
        setMedUnit(res.data)
        console.log(medUnit)

    }

    useEffect(() => {
        try {
            setRole(user.user_info.role)
        } catch {
            setRole(0)
        }

    }, [user])

    //make receipt
    const make_receipt = async (id) => {
        try {
            let res = await authApi(accessTk).post(endpoints['health_record_makereceipt'](id))

            Alert.alert("Thông báo", "Xác nhận thành công, vào chi tiết bệnh án để xuất hóa đơn")
        } catch (ex) {
            Alert.alert("Thông báo", "Xác nhận không thành công!")
            console.log(ex)
        }
    }
    return (
        <ScrollView style={{ flex: 1, width: "100%", backgroundColor: "#F3F3F3" }} showsVerticalScrollIndicator={false}>
            <View style={{ width: "100%", alignItems: 'center', marginTop: 50, flexDirection: "row" }}>
                <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                    style={{ width: 120, height: 120, borderRadius: 75, backgroundColor: "white", borderWidth: 8, borderColor: "#79AEFF", marginHorizontal: 10 }} />
                <View>
                    <Text style={{ fontSize: 45, fontWeight: 'bold', color: "blue" }}>PB CLINIC</Text>
                    <Text>Danh sách hồ sơ bệnh án</Text>
                </View>
            </View>

            {healthRecord === null ? <ActivityIndicator /> : <>
                {healthRecord.map(item => (
                    renderHealthRecordList(item)
                ))}

            </>}

            <View style={{ width: "95%", height: 50, alignItems: "flex-end" }}>
                {disable === false && (
                    <TouchableOpacity style={{ backgroundColor: "lightgray", alignItems: "center", borderRadius: 10, width: "50%", }} onPress={() => loadNextList()}>
                        <Text style={{ fontSize: 15, color: "white", padding: 5, fontWeight: "bold" }}>Tải thêm hồ sơ</Text>
                    </TouchableOpacity>
                )}

            </View>


            <Modal transparent={true}
                visible={showModalAddMedicines}>
                <View style={{ flex: 1, flexDirection: "column-reverse", backgroundColor: "#292C33aa" }}>

                    <Animated.View style={{ width: "100%", height: animatedValue, backgroundColor: "white" }}>
                        <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                            <View style={{ width: "auto", height: 40, backgroundColor: "orange", alignItems: "center", margin: 10, flexDirection: "row" }}>
                                <AntDesign name="medicinebox" color='white' size={30} style={{ marginHorizontal: 10 }} />
                                <Text style={{ color: "white", fontWeight: "bold" }}>KHO THUỐC</Text>
                            </View>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                {medicineList === null ? <ActivityIndicator /> : <>
                                    {
                                        medicineList.map(c => (
                                            <TouchableOpacity style={{ width: "42%", height: 230, margin: 10 }} key={c.id}
                                                onPress={() => { PickMedicine(c.id, c.name), getUnit(c.id) }}>
                                                <View style={{ alignItems: "center" }}>
                                                    <Image source={{ uri: c.image_url }} style={{ width: 180, height: 150 }} />
                                                </View>
                                                <View style={{ backgroundColor: "orange", height: "1%" }} />
                                                <Text style={{ fontSize: 18, color: "orange", paddingLeft: 10, fontWeight: "bold" }}>{c.name}</Text>
                                                <View style={{ backgroundColor: "orange", height: "1%" }} />
                                            </TouchableOpacity>
                                        ))
                                    }
                                </>}
                            </View>

                            {loadNextMedList === false && (
                                <TouchableOpacity style={{ backgroundColor: "lightgray", width: 150, alignItems: "center", alignSelf: "center",  borderRadius: 10 }} onPress={() => loadNextMedicines()} >
                                    <Text style={{ paddingVertical: 5, color: "white", fontSize: 17 }}>Tải thêm thuốc</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>


                        <View style={{flexDirection:"row", justifyContent:"space-around"}}>
                            <Button title="Tạo mới toa thuốc" color={"#06BF06"} onPress={() => {prescription_override()}} />
                            <Button title="Thêm thuốc" color={"green"} onPress={() => {prescription()}} />
                        </View>
                        

                    </Animated.View>

                    <TouchableOpacity onPress={() => { hidePopup(), setMedicines([]) }} style={{ flex: 1 }} />
                </View>

            </Modal>

            <Modal transparent={true} visible={showModalPickMedicines}>
                <View style={{ flex: 1, backgroundColor: "#292C33aa", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: "80%", height: 500, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <TouchableOpacity style={{ width: 50, height: 40, alignSelf: "flex-end" }} onPress={() => { changeMedicineItem('instructions', []), setShowModalPickMedicines(!showModalPickMedicines) }}>
                            <AntDesign name="closecircleo" color='gray' size={30} style={{ paddingLeft: 20 }} />
                        </TouchableOpacity>
                        <ScrollView showsVerticalScrollIndicator={false}>



                            <View style={{ width: "100%", backgroundColor: "gray", alignItems: "center", }} transparent={true}>
                                <Text style={{ color: "white", padding: 5, fontWeight: "bold" }}>THÔNG TIN THUỐC</Text>
                            </View>
                            <View style={{ flexDirection: "row", margin: 10 }}>
                                <Text style={{ fontSize: 17 }}>Tên thuốc: </Text>
                                <Text style={{ fontSize: 17 }}>{medName}</Text>

                            </View>
                            <View style={{ flexDirection: "row", margin: 10 }}>
                                <Text style={{ fontSize: 17 }}>Nhập số lượng: </Text>
                                <TextInput value={medicineItem.amount} onChangeText={t => changeMedicineItem('amount', t)} placeholder="0..." style={{ fontSize: 17, }} />
                            </View>
                            <View style={{ flexDirection: "row", margin: 10, }}>
                                <Text style={{ fontSize: 17 }}>Đơn vị tính: </Text>
                                <SelectList
                                    setSelected={(value) => setUnit(value)}
                                    data={medUnit}
                                    save="value"
                                    boxStyles={{ alignItems: "center", marginLeft: 10 }}
                                    search

                                />
                            </View>

                            <View >
                                <View style={{ backgroundColor: "gray", width: "100%" }}>
                                    <Text style={{ fontSize: 15, color: "white", fontWeight: "bold", paddingVertical: 5, alignSelf: "center", }}> HƯỚNG DẪN SỬ DỤNG, LIỀU LƯỢNG </Text>
                                </View>


                                <View style={{ flexDirection: "row", margin: 10 }}>
                                    <Text style={{ fontSize: 17 }}>Thời gian: </Text>
                                    <SelectList
                                        setSelected={(value) => setPeriod(value)}
                                        data={periodData}
                                        save="value"
                                        boxStyles={{ alignItems: "center", marginLeft: 10 }}
                                        search
                                    />
                                </View>

                                <View style={{ flexDirection: "row", margin: 10 }}>
                                    <Text style={{ fontSize: 17 }}>Liều lượng: </Text>
                                    <TextInput value={ins_items.amount} onChangeText={t => change('amount', t)} placeholder="0..." style={{ fontSize: 17 }} />
                                </View>

                                <View style={{ flexDirection: "row", margin: 10 }}>
                                    <Text style={{ fontSize: 15 }}>Đơn vị tính: </Text>
                                    <SelectList
                                        setSelected={(value) => change('unit', value)}
                                        data={ins_periodData}
                                        save="key"
                                        boxStyles={{ alignItems: "center", marginLeft: 10 }}
                                        search

                                    />
                                </View>

                                <TouchableOpacity style={{ backgroundColor: "#00A3E1", width: 150, borderRadius: 10, alignItems: "center", alignSelf: "center" }} onPress={() => { addInstructions() }}>
                                    <Text style={{ color: "white", fontSize: 15, fontWeight: "bold", paddingVertical: 5 }}>Thêm liều lượng</Text>
                                </TouchableOpacity>
                            </View>


                            <View style={{ justifyContent: "flex-end", height: 115 }}>
                                <Button title="Xác nhận thuốc" onPress={() => { confirmMed() }} />
                            </View>
                        </ScrollView>



                    </View>
                </View>
            </Modal>

        </ScrollView>
    )
}
const styles = StyleSheet.create({
    info_panel: {
        flexDirection: "row", marginVertical: 5
    },
    label: {
        backgroundColor: "#59CBE8", alignItems: "center", paddingLeft: 10, borderTopRightRadius: 10, justifyContent: "center"
    },
    text: {
        fontSize: 17, color: "white", paddingVertical: 5, fontWeight: "bold"
    },


})
export default Create_health_record_medicines