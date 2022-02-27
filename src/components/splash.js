import { View, Text, StyleSheet, Image, StatusBar } from "react-native";
import React, { useEffect } from 'react'
import { getAsyncStorage, keys } from "../AsyncStorage/UserStorage";
import PushNotification from 'react-native-push-notification';
import { Voximplant } from 'react-native-voximplant';
import { loginVox } from "../Function/Voxiplant";
const voximplant = Voximplant.getInstance();

const splash = ({ navigation }) => {

    useEffect(() => {
        createChanels();
        connectVoxiplant();
    }, [])


    const createChanels = () => {
        PushNotification.createChannel({
            channelId: "Message",
            channelName: "MessageNotifycation",
            playSound: false,
            soundName: 'default'
        })
    }

    const connectVoxiplant = () => {
        const requestConnect = setInterval(async () => {
            const status = await voximplant.getClientState();
            if (status === Voximplant.ClientState.DISCONNECTED) {
                await voximplant.connect();
            }
            if (status === Voximplant.ClientState.CONNECTED) {
                clearInterval(requestConnect)
                getAsyncStorage(keys.vox)
                    .then((data) => {
                        let username = JSON.parse(data).username;
                        let password = JSON.parse(data).password;
                        loginVox(username, password)
                    })
                ChangeScreen(status);
            }
        }, 500);
    };


    const ChangeScreen = (status) => {
        getAsyncStorage(keys.uuid)
            .then((uuid) => {
                if (uuid && status === Voximplant.ClientState.CONNECTED) {
                    navigation.replace('tab')
                } else if (!uuid && status === Voximplant.ClientState.CONNECTED) {
                    navigation.replace('login')
                }
            })
            .catch((err) => {
                console.log('lỗi ' + err)
                navigation.replace('login')
            })
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#e2e2e2'} barStyle='dark-content' />
            <Image
                style={styles.logoStyle}
                source={require('../res/img/logo1.png')}
                resizeMode='stretch'
            />
        </View>
    )
}

export default splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e2e2e2'
    },
    logoStyle: {
        width: 250,
        height: 250
    }
})
