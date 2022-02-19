import { View, Text } from "react-native";
import React, { useEffect } from 'react'
import { getAsyncStorage, keys } from "../AsyncStorage/UserStorage";
import PushNotification from 'react-native-push-notification';

const splash = ({ navigation }) => {
    useEffect(() => {
        createChanels();
        getAsyncStorage(keys.uuid)
            .then((uuid) => {
                if (uuid) {
                    navigation.replace('tab')
                } else {
                    navigation.replace('login')
                }
            })
            .catch((err) => {
                console.log(err)
                navigation.replace('login')
            })
    }, [])


    const createChanels = () => {
        PushNotification.createChannel({
            channelId: "Message",
            channelName: "MessageNotifycation",
            playSound:false,
            soundName:'default'
        })
    }

    return (
        <View>
            <Text>no</Text>
        </View>
    )
}

export default splash;
