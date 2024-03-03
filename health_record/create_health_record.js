import { useContext, useEffect, useRef, useState } from "react"
import { ActivityIndicator, Animated, Button, Image, ScrollView, Text, TextInput, TouchableOpacity } from "react-native"
import { Modal, StyleSheet, View } from "react-native"
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import MultiSelect from "react-native-multiple-select"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { authApi, endpoints } from "../configs/API"
import MyContext from "../configs/MyContext"
import Home from "../components/home/Home"
import { AntDesign } from "react-native-vector-icons"
import Create_health_record_medicines from "./health_record_medicines"


const Create_health_record = ({ navigation }) => {

    const items = [{
        id: '1',
        name: 'Khám tổng quát'
    }, {
        id: '2',
        name: 'Xét nghiệm máu'
    }, {
        id: '3',
        name: 'X Quang'
    }, {
        id: '4',
        name: 'Khám bệnh'
    },
    ];
    const [selected, setSelected] = useState([])
    const [symstom, setSymstom] = useState(null)
    const [overview, setOverview] = useState(null)
    const [patient, setPatient] = useState([])
    const [loading, setLoading] = useState(false)
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [showModal, setShowModal] = useState(false)
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0))
    const [nextPath, setNextPath] = useState('')
    const [disable, setDisable] = useState(false)
    const [choosenPatient, setChoosenPatient] = useState(null)


    const loadPatient = async () => {
        let res = await authApi(accessTk).get(endpoints['patient'])
        setPatient(res.data.results)
        console.info("load patient thanh cong")
        if (res.data.next !== null)
            setNextPath(res.data.next)
    }
    useEffect(() => {
        loadPatient()
        setDisable(false)
    }, [])

    const showPopup = () => {

        setShowModal(!showModal)
        Animated.spring(animatedValue, {
            toValue: 500,
            useNativeDriver: false
        }).start()
    }
    const hidePopup = () => {
        setAnimatedValue(new Animated.Value(0))
        setShowModal(!showModal)
        Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: false
        }).start()
    }

    const onSelectedItemsChange = (selectedItems) => {
        setSelected(selectedItems)
    };

    const createHealthRecord = async () => {
        setLoading(true)
        try {
            let res = await authApi(accessTk).post(endpoints['health_record'], {
                "patient_id": choosenPatient.user_info.id,
                "symstoms": symstom,
                "overview": overview,
                "services": selected
            })

            console.info(res.data)
            setSelected([])
            setSymstom(null)
            setOverview(null)
            navigation.navigate(Create_health_record_medicines)

        } catch (ex) {
            console.error(ex)
        }
        finally {
            setLoading(false)
        }
    }

    const choosePatient = (value) => {
        setChoosenPatient(value)
        console.info(choosenPatient)
        hidePopup()
    }
    const renderPatient = (items) => {
        return (
            <TouchableOpacity onPress={() => { choosePatient(items) }}>
                <View key={items.id} style={styles.patient_panel}>
                    <Image source={{ uri: items.user_info.image_url }} style={{ width: 100, height: 100, borderRadius: 40 }} />
                    <View style={{ marginLeft: 20, }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Họ tên bệnh nhân:</Text>
                            <Text>{items.user_info.name}</Text>
                        </View >

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>Id:</Text>
                            <Text> {items.user_info.id}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        )
    }
    const loadNextList = async () => {
        let res = await authApi(accessTk).get(nextPath)

        let tmpList = patient
        let ConcatList = tmpList.concat(res.data.results)
        setPatient(ConcatList)
        console.info("load next patient thanh cong")
        if (res.data.next !== null) {
            setNextPath(res.data.next)
        }
        else {
            setDisable(true)
        }
    }





    return (
        <View style={{ flex: 1, }}>

            <View style={{ width: "100%", alignItems: 'center', flexDirection: "row", marginTop:10 }}>
                <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                    style={{ width: 120, height: 120, borderRadius: 75, backgroundColor: "white", borderWidth: 8, borderColor: "#79AEFF", marginHorizontal: 10, position: "relative" }} />
                <View>
                    <Text style={{ fontSize: 45, fontWeight: 'bold', color: "blue" }}>PB CLINIC</Text>
                    <Text>Hồ sơ bệnh án</Text>
                </View>
            </View>

            <KeyboardAwareScrollView style={{ backgroundColor: "white", width: "95%", height: "auto", marginTop: 20, alignSelf: "center", borderRadius: 15 }} showsVerticalScrollIndicator={false}>


                <TouchableOpacity style={{ width: "auto", height: 40, backgroundColor: "orange", alignItems: "center", justifyContent: "center", margin: 10 }} onPress={() => showPopup()} >
                    <Text style={{ color: "white", fontSize: 17 }}>Chọn bệnh nhân</Text>
                </TouchableOpacity>

                {choosenPatient && (
                    <View style={{ flexDirection: "row", marginLeft:20 }}>
                        <Image source={{ uri: choosenPatient.user_info.image_url }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                        <View style={{ marginLeft: 20, }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Họ tên bệnh nhân:</Text>
                                <Text>{choosenPatient.user_info.name}</Text>
                            </View >

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>Id:</Text>
                                <Text> {choosenPatient.user_info.id}</Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={{ width: "auto", height: 40, backgroundColor: "#FFC600", alignItems: "center", justifyContent: "center", margin: 10 }}>
                    <Text style={{ color: "white", fontSize: 17 }}>Triệu chứng của bệnh nhân</Text>
                </View>
                <View style={[styles.txt_input_box, symstom === null ? { borderLeftWidth: 0, borderBottomWidth: 0 } : <></>]}>
                    <TextInput value={symstom} onChangeText={t => setSymstom(t)} multiline={true} style={{ paddingLeft: 10, marginBottom: 10 }} placeholder="Nhập triệu chứng" />
                </View>

                <View style={{ width: "auto", height: 40, backgroundColor: "#FFC600", alignItems: "center", justifyContent: "center", margin: 10 }}>
                    <Text style={{ color: "white", fontSize: 17 }}>Kết luận của bác sĩ</Text>
                </View>
                <View style={[styles.txt_input_box, overview === null ? { borderLeftWidth: 0, borderBottomWidth: 0 } : <></>]}>
                    <TextInput value={overview} onChangeText={t => setOverview(t)} multiline={true} style={{ paddingLeft: 10, marginBottom: 10 }} placeholder="Nhập kết luận của bác sĩ..." />
                </View>


                <View style={{ width: "auto", height: 40, backgroundColor: "orange", alignItems: "center", justifyContent: "center", margin: 10 }}>
                    <Text style={{ color: "white", fontSize: 17 }}>Các dịch vụ bệnh nhân đã sử dụng</Text>
                </View>
                <MultiSelect
                    items={items}
                    uniqueKey="id"
                    onSelectedItemsChange={onSelectedItemsChange}
                    selectedItems={selected}
                    selectText=""
                    searchInputPlaceholderText="Chọn dịch vụ"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="orange"
                    tagTextColor="#CCC"
                    selectedItemTextColor="orange"
                    selectedItemIconColor="orange"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#2E67F8"
                    submitButtonText="Chọn"
                    fontSize={15}
                    styleMainWrapper={{ margin: 10, }}
                    searchIcon
                    hideSubmitButton
                    
                    

                />

            </KeyboardAwareScrollView>


            {
                loading === true ? <ActivityIndicator /> : <>
                    <TouchableOpacity style={{ width: "100%", height: 40, backgroundColor: "#2E67F8", alignItems: "center", justifyContent: "center" }} onPress={() => createHealthRecord()}>
                        <Text style={{ color: "white", fontSize: 18, paddingVertical: 4 }}>Tạo bệnh án</Text>
                    </TouchableOpacity>
                </>
            }





            <Modal
                transparent={true}
                visible={showModal}
            >
                <View style={{ flex: 1, backgroundColor: "#292C33aa", flexDirection: "column-reverse", }}>

                    {/* thay doi height */}
                    <Animated.View style={{ width: "100%", height: animatedValue, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        {/* button hide popup */}
                        <TouchableOpacity onPress={() => hidePopup()}>
                            <View style={{ backgroundColor: "lightgray", width: 40, height: 40, alignSelf: "center", borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                                <AntDesign name="downcircleo" size={35} color={"white"} />
                            </View>
                        </TouchableOpacity>

                        {/* display patients list */}
                        <ScrollView style={{ backgroundColor: "white", width: "100%", height: "100%" }} showsVerticalScrollIndicator={false}>
                            {showModal === false ? <></> : <>
                                {patient.map(p => (
                                    renderPatient(p)
                                ))}
                            </>}
                            {disable === false && (
                                <TouchableOpacity style={{ backgroundColor: "gray", width: 150, alignItems: "center", alignSelf: "center", marginTop: 60, borderRadius: 10 }} 
                                                onPress={() => loadNextList()} >
                                    <Text style={{ paddingVertical: 10, color: "white" }}>Tải thêm bệnh nhân</Text>
                                </TouchableOpacity>
                            )}

                        </ScrollView>

                    </Animated.View>

                    <TouchableOpacity onPress={() => hidePopup()} style={{ flex: 1 }} />



                </View>

            </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    txt_input_box: {
        margin: 10,
        borderLeftWidth: 1,
        borderLeftColor: "orange",
        borderBottomWidth: 1,
        borderBottomColor: "orange"
    },
    patient_panel: {
        flexDirection: "row", width: "90%", alignSelf: "center", marginTop: 20, marginBottom: 50,
        borderWidth: 1, borderColor: "orange",
        borderRadius: 10
    }
})
export default Create_health_record