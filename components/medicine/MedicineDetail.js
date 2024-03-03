import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, Image, Dimensions, ActivityIndicator, Touchable, TouchableOpacity, } from 'react-native';

import RenderHTML from 'react-native-render-html';
import API, { endpoints } from '../../configs/API';
import Medicine from './Medicine';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const money = Intl.NumberFormat('it-IT', {
    style: "currency",
    currency: "VND"
})
const Unit = ['viên', 'gói', 'hộp']


const MedicineDetail = ({ route,navigation }) => {
    const id = route.params?.id
    const [medicine, setMedicine] = useState(null)
    useEffect(() => {
        const loadMedicine = async () => {
            try {
                let res = await API.get(endpoints['medicineDetail'](id))
                setMedicine(res.data)
                console.info(res.data)
            } catch (ex) {
                console.log('medicine detail load that bai')
            }
        }

        loadMedicine()
    }, [id])
    return (

        <ScrollView style={{ marginTop: 30, width: WIDTH, height: HEIGHT, backgroundColor: '#F3F3F3' }}>
            <TouchableOpacity style={{backgroundColor:"orange",marginLeft:10, width:100, alignItems:"center", borderRadius:10}} onPress={()=>navigation.navigate(Medicine)}>
                <Text style={{fontSize:20,color:"white", paddingVertical:4}}>Quay lại</Text>
            </TouchableOpacity>
            <View style={{ width: "100%", alignItems: 'center', marginTop: 50, flexDirection: "row" }}>
                <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                    style={{ width: 120, height: 120, borderRadius: 75, backgroundColor: "white", borderWidth: 8, borderColor: "#79AEFF", marginHorizontal: 10 }} />
                <View>
                    <Text style={{ fontSize: 45, fontWeight: 'bold', color: "blue" }}>PB CLINIC</Text>
                </View>
            </View>

            <View style={{ alignItems: 'center' }}>
                {/* Nhớ quăng ActivityIndicator */}
                {medicine === null ? <ActivityIndicator /> : <>
                    <View style={{width:"90%", alignItems:"center", backgroundColor:"white", marginTop:30}}>
                        <Image style={{ width:300, height:300, borderRadius: 10, borderWidth: 0, borderColor: 'grey', }} source={{ uri: medicine.image_url }} />
                    </View>
                    <View style={[styles.item, {padding: 20,marginTop:10 }]}>
                        
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{medicine.name.toUpperCase()}</Text>
                            <Text style={{ fontSize: 13 }}>{medicine.vendor.name}</Text>
                            <View>
                                <Text style={{ fontSize: 13 }}>{medicine.vendor.address}</Text>
                            </View>
                            {medicine.prices.filter(x => x.unit == 2).length == 1 ? <Text style={{ fontSize: 15, fontWeight: "bold", marginTop: 20 }}>{money.format(medicine.prices.filter(x => x.unit == 2)[0].unit_price)} / hộp </Text> : ""}
                        </View>
                    </View>
                    <View style={[styles.item, { marginTop: 50 }]}>
                        <ScrollView style={{ height: 400, width: WIDTH - 60, padding: 10, backgroundColor: "#F3F3F3", marginVertical: 20 }}>
                            <RenderHTML source={{ html: medicine.content }} contentWidth={WIDTH - 40} />
                        </ScrollView>

                    </View>
                </>}
            </View>
            <TouchableOpacity>

            </TouchableOpacity>
        </ScrollView>
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
    item: {
        backgroundColor: "white",
        width: WIDTH - 20,
        alignItems: 'center',
        marginTop: 100,
        borderRadius: 10
    }
})
export default MedicineDetail