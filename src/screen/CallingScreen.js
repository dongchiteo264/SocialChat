import React, { useState, useEffect } from "react";
import {
    Image,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    View,
    TouchableOpacity
} from "react-native";
import { Voximplant } from 'react-native-voximplant';

const PERMISSIONS = [
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = ({ navigation, route }) => {
    const { callee, call: incomingCall, isIncomingCall } = route.params;

    const [permissionGranted, setPermissionGranted] = useState(false);
    const [localVideoStreamId, setLocalVideoStreamId] = useState('');
    const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');

    const getPermissions = async () => {
        const granted = await PermissionsAndroid.requestMultiple(PERMISSIONS);
        if (granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted' && granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted') {
            setPermissionGranted(true);
        }
        else {
            alert('Permissions not granted');
        }
    }

    useEffect(() => {
        if (Platform.OS === 'android') {
            getPermissions();
        } else {
            setPermissionGranted(true);
        }
    }, [])

    const showError = reason => {
        Alert.alert('Call failed', `Reason: ${reason}`, [
            {
                text: 'OK',
                onPress: navigation.navigate('HomeScreen'),
            },
        ]);
    };

    useEffect(() => {
        if (!permissionGranted)
            return;
        
    }, [])

    const ButtonPanel = () => {
        return (
            <View style={styles.panelView}>
                <ButtonView
                    backgroundColor='#606060'
                    Image={
                        <Image
                            style={{ width: 33, height: 33, marginRight: 2 }}
                            source={require('../res/img/icon/video-camera.png')}
                        />
                    }
                />
                <ButtonView
                    backgroundColor='#606060'
                    Image={
                        <Image
                            style={{ width: 45, height: 45, marginLeft: 5 }}
                            source={require('../res/img/icon/switch-camera.png')}
                        />
                    }
                />
                <ButtonView
                    backgroundColor='#606060'
                    Image={
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={require('../res/img/icon/microphone.png')}
                        />
                    }
                />
                <ButtonView
                    backgroundColor={'red'}
                    Image={
                        <Image
                            style={{ width: 45, height: 45, marginLeft: 0 }}
                            source={require('../res/img/icon/end-call.png')}
                        />
                    }
                />
            </View>
        )
    }

    const ButtonView = ({ backgroundColor, Image }) => {
        return (
            <TouchableOpacity style={[styles.btnView, { backgroundColor }]}>
                {Image}
            </TouchableOpacity>)
    }

    return (
        <View style={styles.container}>
            <Voximplant.VideoView
                videoStreamId={remoteVideoStreamId}
                style={styles.remoteVideoStyles}
            />
            <Voximplant.VideoView
                videoStreamId={localVideoStreamId}
                showOnTop={true}
                style={styles.localVideoStyles}
            />
            <ButtonPanel />
        </View>
    )
}

export default CallingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    remoteVideoStyles: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    localVideoStyles: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 100,
        height: 150,
    },
    panelView: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: '#1f1f1f',
        height: 100,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnView: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: "center"
    }
})