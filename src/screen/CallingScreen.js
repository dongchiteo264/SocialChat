import React, { useState, useEffect, useRef } from "react";
import {
    Image,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    View,
    TouchableOpacity,
    Alert
} from "react-native";
import { Voximplant } from 'react-native-voximplant';
import { SCREENS } from "../Constant";

const PERMISSIONS = [
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = ({ navigation, route }) => {
    const { callee, call: incomingCall, isIncomingCall, calltype } = route.params;
    const call = useRef(incomingCall);

    const voximplant = Voximplant.getInstance();
    const camera = Voximplant.Hardware.CameraManager.getInstance();
    const audio = Voximplant.Hardware.AudioDeviceManager.getInstance();


    const [permissionGranted, setPermissionGranted] = useState(false);
    const [localVideoStreamId, setLocalVideoStreamId] = useState('');
    const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
    const [callStatus, setCallStatus] = useState('Initializing');
    const endpoint = useRef(null);


    const [frontCamera, setFrontCamera] = useState(true);
    const [soundEarpiece, setSoundEarpiece] = useState(true);

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
        if (reason == 'Decline')
            reason = 'Người dùng bận'
        Alert.alert('Call failed', reason, [
            {
                text: 'OK',
                onPress: navigation.goBack()
            },
        ]);
    };

    const onHangup = () => {
        call.current.hangup();
    };

    const onReverseCamera = () => {
        camera.switchCamera(
            frontCamera
                ? Voximplant.Hardware.CameraType.BACK
                : Voximplant.Hardware.CameraType.FRONT,
        );
        setFrontCamera(!frontCamera);
    };

    const subscribeToCallEvents = () => {

        call.current.on(Voximplant.CallEvents.Failed, callEvent => {
            showError(callEvent.reason);
        });
        call.current.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
            setCallStatus('Calling');
        });
        call.current.on(Voximplant.CallEvents.Connected, callEvent => {
            setCallStatus('Connected');
        });
        call.current.on(Voximplant.CallEvents.Disconnected, callEvent => {
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: SCREENS.TAB
                    },
                ],
            });
        });
        call.current.on(
            Voximplant.CallEvents.LocalVideoStreamAdded,
            callEvent => {
                setLocalVideoStreamId(callEvent.videoStream.id);
            },
        );
        call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
            endpoint.current = callEvent.endpoint;
            subscribeToEndpointEvent();
        });
    };

    const subscribeToEndpointEvent = async () => {
        endpoint.current.on(
            Voximplant.EndpointEvents.RemoteVideoStreamAdded,
            endpointEvent => {
                setRemoteVideoStreamId(endpointEvent.videoStream.id);
            },
        );
    };
    const callSettings = {
        video: {
            sendVideo: (calltype === 'video') ? true : false,
            receiveVideo: (calltype === 'video') ? true : false,
        },
    };

    const makeCall = async () => {
        call.current = await voximplant.call(callee, callSettings);
        subscribeToCallEvents();
    };

    const answerCall = () => {
        subscribeToCallEvents();
        endpoint.current = call.current.getEndpoints()[0];
        console.log(call.current.getEndpoints()[0])
        subscribeToEndpointEvent();
        call.current.answer( {video: {
            sendVideo: true,
            receiveVideo: true,
          }})

    };

    useEffect(() => {
        if (!permissionGranted)
            return;

        if (isIncomingCall) {
            answerCall(); //tra loi cuoc goi
        } else {
            makeCall(); //tao cuoc goi
        }

        return () => {
            //huy su kien
            call.current.off(Voximplant.CallEvents.Failed);
            call.current.off(Voximplant.CallEvents.ProgressToneStart);
            call.current.off(Voximplant.CallEvents.Connected);
            call.current.off(Voximplant.CallEvents.Disconnected);
        };
    }, [permissionGranted])

    const ButtonPanel = ({ onChangeCamera, onChangeMic, switch_camera, endcall }) => {
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
                    onPress={() => switch_camera()}
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
                    onPress={() => endcall()}
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

    const ButtonView = ({ backgroundColor, Image, onPress }) => {
        return (
            <TouchableOpacity style={[styles.btnView, { backgroundColor }]}
                onPress={onPress}
            >
                {Image}
            </TouchableOpacity>)
    }

    return (
        <View style={styles.container}>
            <Voximplant.VideoView
                videoStreamId={remoteVideoStreamId}
                style={(callStatus === 'Connected') ? styles.remoteVideoStyles : styles.remoteVideoStyles1}
            />
            <Voximplant.VideoView
                videoStreamId={localVideoStreamId}
                showOnTop={true}
                style={(callStatus === 'Connected') ? styles.localVideoStyles : styles.localVideoStyles1}
            />
            <ButtonPanel
                endcall={onHangup}
                switch_camera={onReverseCamera}
            />
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
    remoteVideoStyles1: {
        height: 0,
        width: 0
    },
    localVideoStyles: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 100,
        height: 150,
    },
    localVideoStyles1: {
        height: '100%',
        width: '100%',
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