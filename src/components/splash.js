import { View, Text } from "react-native";
import React, { useEffect } from 'react'
import { getAsyncStorage, keys } from "../AsyncStorage/UserStorage";

const splash = ({ navigation }) => {
    useEffect(() => {
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
    return (
        <View>
            <Text>no</Text>
        </View>
    )
}

export default splash;
