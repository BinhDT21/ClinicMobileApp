import { StyleSheet, Text, ScrollView, View, Image, Button, Dimensions, Animated, TextInput, TouchableOpacity, Easing } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Login from '../user/Login';
import Signup from '../user/Signup';
import Home from './Home';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const WelcomeScreen = ({navigation}) => {
    
    const imageList = [
        "https://www.aamc.org/sites/default/files/styles/scale_and_crop_1200_x_666/public/diverse-medical-professionals-1324292283.jpg?itok=u6xm9Z22",
        "https://static.vecteezy.com/system/resources/previews/002/127/173/non_2x/medicine-and-healthcare-concept-illustration-male-and-female-doctor-character-medical-service-can-use-for-homepage-mobile-apps-web-banner-character-cartoon-illustration-flat-style-free-vector.jpg",
        "https://media.istockphoto.com/id/1131664200/vector/medicine-concept-with-doctor-in-thin-line-style.jpg?s=612x612&w=0&k=20&c=_LSE8NOhn20BTjGDUvdPtZg11Zj72qhaw0sYUi7-i74=",
    ]
    const activate = (e) => {
        if (e) {
            const img = Math.ceil(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width)
            if (img != active)
                setActive(img)
        }
    }
    const [active, setActive] = useState(0)


    return (
        <View style={styles.container}>
            <View style={{ flex: 1.1, width: "100%", alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }} style={[styles.circle, { width: 150, height: 150, borderRadius: 75 }]} />
                <Text style={{ fontSize: 20 }}>Chào mừng bạn đến với</Text>
                <Text style={{ fontSize: 45, fontWeight: 'bold', color: "blue" }}>PB CLINIC</Text>
            </View>
            <View style={{ flex: 1, width: "100%" }}>
                <ScrollView
                    onScroll={e => activate(e)}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    horizontal
                    style={{marginVertical:10}}
                >
                    {imageList.map((s, index) => <Image key={index} resizeMode='cover' source={{ uri: s }} style={[styles.wrap, {}]} />)}
                </ScrollView>

                <View style={{ flexDirection: "row", alignSelf: "center" }}>
                    {imageList.map((s, index) => <Text key={index} style={active == index ? styles.dot_active : styles.dot}></Text>)}
                </View>
            </View>

            <View style={[styles.button_panel, {  width: "100%" }]}>
                <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate(Login)}}>
                    <Text style={styles.text_button}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,{backgroundColor:"#f6aa30"}]} onPress={()=>{navigation.navigate('Signup', {'admin_creating': false})}}> 
                    <Text style={styles.text_button}>Đăng ký</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,{backgroundColor:"gray"}]} onPress={()=>{navigation.navigate(Home)}}>
                    <Text style={styles.text_button}>Bỏ qua</Text>
                </TouchableOpacity>
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
        marginTop:15,
        width: 200,
        height: 130,
        fontSize: 4,
        marginBottom:35
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
    button:{
        width:"70%", 
        backgroundColor:"#2E67F8",  
        alignItems:"center", 
        marginVertical:10,
        borderRadius:10,
        alignSelf:"center",
        
    },
    text_button:{
        fontSize:18, 
        fontWeight:"500", 
        color:"white", 
        paddingVertical:7
    }
});
export default WelcomeScreen