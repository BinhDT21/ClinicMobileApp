import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useContext, useEffect, useState } from "react"
import API, { endpoints } from "../../configs/API"
import MedicineStyle from "./MedicineStyle"
import MyContext from "../../configs/MyContext"
import { AntDesign } from "react-native-vector-icons"

const Medicine = ({navigation}) => {
    const [medicines, setMedicines] = useState(null)
    const [user, dispatch] = useContext(MyContext)
    const [nextPath, setNextPath] = useState('')
    const [disable, setDisable] = useState(false)

    const loadMedicines = async () => {
        let res = await API.get(endpoints['medicine'])
        setMedicines(res.data.results)
        if (res.data.next !== null)
            setNextPath(res.data.next)
    }
    useEffect(() => {
        loadMedicines()
        setDisable(false)
    }, [])

    const loadNextList = async () => {
        let res = await API.get(nextPath)

        let tmpList = medicines
        let ConcatList = tmpList.concat(res.data.results)
        setMedicines(ConcatList)
        console.info("load next medicines thanh cong")
        if (res.data.next !== null) {
            setNextPath(res.data.next)
        }
        else {
            setDisable(true)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ width: "100%", alignItems: 'center', flexDirection: "row" }}>
                <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                    style={{ width: 120, height: 120, borderRadius: 75, backgroundColor: "white", borderWidth: 8, borderColor: "#79AEFF", marginHorizontal: 10, position: "relative" }} />
                <View>
                    <Text style={{ fontSize: 45, fontWeight: 'bold', color: "orange" }}>PB CLINIC</Text>
                </View>
            </View>
            <View style={{ width: "auto", height: 40, backgroundColor: "orange", alignItems: "center", margin: 10, flexDirection: "row" }}>
                <AntDesign name="medicinebox" color='white' size={30} style={{ marginHorizontal: 10 }} />
                <Text style={{ color: "white", fontWeight: "bold" }}>KHO THUỐC</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={MedicineStyle.rowItems}>
                    {medicines === null ? <ActivityIndicator /> : <>
                        {
                            medicines.map(c => (
                                <View style={MedicineStyle.medItemsBox} key={c.id}>
                                    <View style={{ alignItems: "center" }}>
                                        <Image source={{ uri: c.image_url }} style={MedicineStyle.img} />
                                    </View>
                                    <Text style={MedicineStyle.infor}>{c.name}</Text>
                                    <TouchableOpacity onPress={()=>{navigation.navigate('MedicineDetail',{'id':c.id})}}>
                                        <Text style={{ color: "blue", paddingLeft: 10 }}>thông tin chi tiết</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                    </>}
                </View>

                {disable === false && (
                    <TouchableOpacity style={{ backgroundColor: "lightgray", width: 150, alignItems: "center", alignSelf: "center", marginTop: 60, borderRadius: 10 }} onPress={() => loadNextList()} >
                        <Text style={{ paddingVertical: 10, color: "white", fontSize: 17 }}>Tải thêm</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    )
}
export default Medicine