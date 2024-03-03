import { useContext, useState } from "react"
import { Alert, Button, Text, TouchableOpacity, View, Image, ScrollView } from "react-native"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SelectList } from "react-native-dropdown-select-list";
import API, { authApi, endpoints } from "../../configs/API";
import MyContext from "../../configs/MyContext";
import { ActivityIndicator } from "react-native";
import Home from "../home/Home";





const Appointment = ({ navigation }) => {
    const [expectedDate, setExpectedDate] = useState('')
    const [department, setDepartment] = useState('1')
    const [departmentName, setDepartmentName] = useState('')
    const [datePickerVisible, setDatePickerVisible] = useState(false)
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [loading, setLoading] = useState(false)


    const showDateTimePicker = () => {
        setDatePickerVisible(true)
    }
    const hideDateTimePicker = () => {
        setDatePickerVisible(false)
    }

    const handleConfirm = (date) => {
        let formatedDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes()

        setExpectedDate(formatedDate)
        hideDateTimePicker()

    }


    const setDepartmentSelected = (value) => {

        if (value.includes("phụ sản")) {
            setDepartment('1')
            setDepartmentName('Khoa phụ sản')
        } else if (value.includes("nhi")) {
            setDepartment('2')
            setDepartmentName('Khoa nhi')
        } else if (value.includes("xương")) {
            setDepartment('3')
            setDepartmentName('Khoa xương khớp')
        } else if (value.includes("liễu")) {
            setDepartment('4')
            setDepartmentName('Khoa da liễu')
        } else if (value.includes("kinh")) {
            setDepartment('5')
            setDepartmentName('Khoa thần kinh')
        } else if (value.includes("mạch")) {
            setDepartment('6')
            setDepartmentName('Khoa tim mạch')
        }
    }

    const createAppointment = async () => {
        setLoading(true)
        try {
            let res = await authApi(accessTk).post(endpoints['appointment'], {
                "ExpectedDate": expectedDate,
                "department_id": department
            })
            {
                // res.data.message && (
                //     Alert.alert("Thông báo!", res.data.message)
                // )

                if(res.data.message != null && res.data.message!= undefined){
                    Alert.alert("Thông báo!", res.data.message)
                }
                else{
                    Alert.alert("Thông báo!", "Tạo lịch khám thành công")
                    navigation.navigate('Home')
                }
            }
        } catch (ex) {
            console.error(ex)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView style={{ flex: 1, width: "100%", backgroundColor: "#F3F3F3" }}>



            <View style={{ width: "100%", alignSelf: "center", flexDirection: "column", alignItems: "center", backgroundColor: "#F3F3F3" }}>

                <TouchableOpacity style={{ backgroundColor: "white", width: "60%", borderRadius: 15, marginVertical: 15, paddingLeft: 19, borderColor: "orange", borderWidth: 1 }}
                    onPress={showDateTimePicker}>
                    <Text style={{ color: "black", fontSize: 18, paddingVertical: 10, fontWeight: "bold" }}>Đặt lịch</Text>
                    <DateTimePickerModal
                        isVisible={datePickerVisible}
                        mode="datetime"
                        display="inline"
                        onConfirm={handleConfirm}
                        onCancel={hideDateTimePicker}
                    />
                </TouchableOpacity>

                <View style={{ width: "60%" }}>
                    <SelectList
                        setSelected={(val) => setDepartmentSelected(val)}
                        data={[
                            { value: 'Khoa phụ sản' },
                            { value: 'Khoa nhi' },
                            { value: 'Khoa xương khớp' },
                            { value: 'Khoa da liễu' },
                            { value: 'Khoa thần kinh' },
                            { value: 'Khoa tim mạch' }
                        ]}
                        placeholder="Chọn khoa"
                        save="value"
                        search={false}
                        inputStyles={{ fontSize: 18, color: "black", fontWeight: "bold" }}
                        boxStyles={{ backgroundColor: "white", borderWidth: 1, borderRadius: 15, borderColor: "orange" }}
                        dropdownTextStyles={{ fontSize: 18 }}
                        dropdownStyles={{ borderColor: "orange", borderStyle: "solid" }}
                        maxHeight={500}

                    />
                </View>

            </View>

            <View style={{ marginVertical: 30, width: "80%", height: 200, borderWidth: 1, borderColor: "#2E67F8", alignSelf: "center", borderRadius: 15, backgroundColor: "white" }}>
                <View style={{ backgroundColor: "#2E67F8", width: "60%", alignSelf: "center", alignItems: "center", borderBottomLeftRadius: 15, borderBottomRightRadius: 15, marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, color: "white", paddingVertical: 5 }}>Thông tin đăng ký</Text>
                </View>

                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <Text style={{ fontSize: 18, paddingLeft: 10 }}>Bệnh nhân: </Text>
                    <Text style={{ fontSize: 18 }}>{user.user_info.first_name} {user.user_info.last_name}</Text>
                </View>

                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <Text style={{ fontSize: 18, paddingLeft: 10 }}>Khoa khám:</Text>
                    <Text style={{ fontSize: 18 }}> {departmentName}</Text>
                </View>

                <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <Text style={{ fontSize: 18, paddingLeft: 10 }}>Lịch khám:</Text>
                    <Text style={{ fontSize: 18 }}> {expectedDate}</Text>
                </View>

            </View>

            {
                loading === true ? <>
                    <ActivityIndicator />
                </> : <>
                    <TouchableOpacity style={{ backgroundColor: "orange", width: "60%", borderRadius: 15, alignItems: "center", alignSelf: "center", justifyContent: "center", marginBottom: 10 }} onPress={() => { createAppointment() }}>
                        <Text style={{ fontSize: 18, color: "white", paddingVertical: 10, fontWeight: "bold" }}>Xác nhận</Text>
                    </TouchableOpacity>
                </>
            }


        </ScrollView>
    )
}
export default Appointment