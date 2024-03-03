import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ActivityIndicator, Text, View, Button, Dimensions, Modal, Linking } from 'react-native';
import WebView from 'react-native-webview';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Image } from 'react-native';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const UserRole = ['Bác sĩ', 'Y tá', 'Người dùng', 'Quản trị viên']

const WEB_PAGE_URL = "https://hphat03.pythonanywhere.com/admin/"

const Manage = () => {
    const [visible, setV] = useState(false)
    const openLink = () => {
        Linking.canOpenURL(WEB_PAGE_URL).then((supported) => {
            supported && Linking.openURL(WEB_PAGE_URL)
        })
    }
    const in_app_open = () => {
        InAppBrowser.isAvailable().then(() => {
            return InAppBrowser.open(WEB_PAGE_URL, {
                animated: true,
                modalEnabled: true,
                showTitle: true
            })
        })
    }
    
    return (
        <View style={{ flex: 1,alignItems: 'center', backgroundColor: '#292C33aa'}}>
            <View style={{ width: "100%", height: "auto", backgroundColor: "white",alignItems: 'center', marginTop:20}}>
                <View style={{ alignItems: 'center', marginVertical: 10 }}>
                    <Image source={{ uri: 'https://res.cloudinary.com/dzm6ikgbo/image/upload/v1708058077/react_native_static/qbu5nbfryzzfzoqsbwvd.png' }}
                        style={{ width: 120, height: 120, borderRadius: 75, backgroundColor: "white", borderWidth: 8, borderColor: "#79AEFF", marginHorizontal: 10, position: "relative" }} />
                    <View style={{alignItems:"center",}}>
                        <Text style={{marginVertical:10, fontSize:17}}>Quản lý phòng khám</Text>
                        <Text style={{ fontSize: 45, fontWeight: 'bold', color: "blue" }}>PB CLINIC</Text>
                    </View>
                    <Button title='sử dụng quyền Admin' color="blue" onPress={() => setV(true)} />
                </View>
                
            </View>

            <Modal visible={visible} presentationStyle='pageSheet' animationType='slide' onRequestClose={() => setV(false)}>
                <WebView source={{ uri: WEB_PAGE_URL }} />
                <Button title='quay lại' onPress={()=>{setV(false)}}/>
            </Modal>

        </View>

    )
}
export default Manage  