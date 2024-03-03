import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator, Text, ScrollView, View, Image, Button, Dimensions, Animated, TextInput, TouchableOpacity, Easing, FlatList, Alert, Modal, Linking } from 'react-native';
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";
import MyContext from '../../configs/MyContext';
import { authApi, endpoints } from '../../configs/API';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const ChartType = ["Số lượng bệnh nhân khám theo tháng",
    "Số lượng bệnh nhân khám theo quý",
    "Doanh thu theo tháng",
    "Doanh thu theo quý"]

const Stat = ({ navigation }) => {
    const [user, dispatch, accessTk, setAccessTk] = useContext(MyContext)
    const [Type, setType] = useState(0)
    const [mydata, setMD] = useState([])
    const [obj, setObj] = useState({})
    const [year, setYear] = useState('2024')
    const [response, setResponse] = useState(null)


    const StatHrByMonth = async () => {
        let url = endpoints['statHr_by_Month']
        setMD([])
        if (year === '') {
            url = `${url}?year=${year}`
        }
        try {
            let res = await authApi(accessTk).get(url)
            // setResponse(res.data,AddData)
            AddData(res.data)
            console.info(res.data)
            // ChartType[Type] += `năm ${response.year}`

        } catch (ex) {
            console.info(ex)
        }

    }
    const StatHrByQuarter = async () => {
        let url = endpoints['statHr_by_Quarter']
        setMD([])
        if (year === '') {
            url = `${url}?year=${year}`
        }
        try {
            let res = await authApi(accessTk).get(url)
            // setResponse(res.data)
            AddData(res.data)
            console.info(res.data)
            // ChartType[Type] += `năm ${response.year}`

        } catch (ex) {
            console.info(ex)
        }

    }
    const StatPrByMonth = async () => {
        let url = endpoints['statPrenue_by_Month']
        setMD([])
        if (year === '') {
            url = `${url}?year=${year}`
        }
        try {
            let res = await authApi(accessTk).get(url)
            // setResponse(res.data)
            AddData(res.data)
            console.info(res.data)
            // ChartType[Type] += `năm ${response.year}`

        } catch (ex) {
            console.info(ex)
        }

    }
    const StatPrByQuarter = async () => {
        let url = endpoints['statPrenue_by_Quarter']
        setMD([])
        if (year === '') {
            url = `${url}?year=${year}`
        }
        try {
            let res = await authApi(accessTk).get(url)
            // setResponse(res.data)
            AddData(res.data)
            console.info(res.data)
            // ChartType[Type] = `năm ${response.year}`
        } catch (ex) {
            console.info(ex)
        }

    }

    useEffect(() => {

        switch (Type) {
            case 0: {

                StatHrByMonth()
                break;
            }
            case 1: {

                StatHrByQuarter()
                break;
            }
            case 2: {

                StatPrByMonth()
                break;
            }
            case 3: {

                StatPrByQuarter()
                break;
            }
        }


        console.log(mydata)
    }, [Type])


    const AddData = (response) => {
        var temp = [];
        for (i = 0; i < response.label.length; i++) {
            t = { value: response.data[i], label: response.label[i], labelWidth: 50, barWidth: 50 }
            temp.push(t)
        }
        setMD(temp)
    }

    return (
        <ScrollView style={{ backgroundColor: '#F3F3F3' }}>
            <View style={{ marginVertical: 50 }}>
                <View style={styles.btn_panel}>
                    <TouchableOpacity onPress={() => setType(0)}>
                        <Text style={[styles.btn, { backgroundColor: 'blue' }]}>Lượng khách theo tháng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setType(1)}>
                        <Text style={[styles.btn, { backgroundColor: 'blue' }]}>Lượng khách theo quý</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.btn_panel}>
                    <TouchableOpacity onPress={() => setType(2)}>
                        <Text style={[styles.btn, { backgroundColor: '#f6aa30' }]}>Doanh thu theo tháng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setType(3)}>
                        <Text style={[styles.btn, { backgroundColor: '#f6aa30' }]}>Doanh thu theo quý</Text>
                    </TouchableOpacity>
                </View>
            </View>


            {mydata != [] ? <>

                <TextInput placeholder='Nhập năm cần báo cáo'
                    style={[styles.btn, { color: 'black', width: 200, backgroundColor: 'white', alignSelf: 'center' }]}
                    value={year} onChangeText={t => setYear(t)} />

                {mydata != [] ? <>
                    <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', margin: 20 }}>Thống kê báo cáo</Text>
                    <View style={{ margin: 5, paddingVertical: 10, borderWidth: 1, borderRadius: 20, backgroundColor: "white" }}>
                        {mydata.map((s, index) => (
                            <View key={index} style={styles.btn_panel}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{s.label}</Text>
                                <Text style={{ fontSize: 13 }}>{s.value}</Text>
                            </View>
                        ))}
                    </View>
                </> : <></>}
                <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: 'bold', margin: 20 }}>{ChartType[Type]}</Text>
                <ScrollView
                    horizontal
                    style={{ margin: 20, borderWidth: 1, borderRadius: 10, padding: 20, backgroundColor: 'white' }}>
                    <BarChart data={mydata} width={500} height={200} />
                </ScrollView>
                <ScrollView
                    horizontal
                    style={{ margin: 20, borderWidth: 1, borderRadius: 10, padding: 20, backgroundColor: 'white' }}>
                    <LineChart data={mydata} width={500} height={200} spacing={70} />

                </ScrollView>

            </> : <ActivityIndicator />}
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
    chart: {
        width: 500,
        height: 500
    },
    btn_panel: {
        flexDirection: 'row',
        width: WIDTH - 10,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        fontSize: 15,
        fontWeight: 'bold'
    },
    btn: {
        width: 180,
        height: 50,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        borderRadius: 10,
        fontWeight: 'bold',
        marginHorizontal: 3
    }
})
export default Stat