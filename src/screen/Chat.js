
import React, { useLayoutEffect, useState, Fragment, useCallback } from "react";
import {
    SafeAreaView,
    Dimensions,
    Platform,
    Keyboard,
    StyleSheet,
    KeyboardAvoidingView,
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { senderMsg } from "../Firebase/FirebaseFunction";
import AppHeader from "../components/header";
import SenderCard from '../components/senderCard'
import { FlatList, TextInput } from "react-native-gesture-handler";
import ChatBox from "../components/chatbox";
import Emoji from '../../Emoji.json';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import EmojiView from "../components/emoji";

const Chat = ({ navigation, route }) => {
    const { name, guestUid, imageText } = route.params;
    const [messages, setmessages] = useState([])
    const [msgvalue, setmsgvalue] = useState('')
    const [typing, settyping] = useState(false)
    const [img, setimg] = useState('')
    const [onEmoji, setonEmoji] = useState(false)

    useLayoutEffect(() => {
        const docid = guestUid > auth().currentUser.uid ? auth().currentUser.uid + "-" + guestUid : guestUid + "-" + auth().currentUser.uid;
        const subscriber = firestore().collection('ChatRoom')
            .doc(docid)
            .collection('messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot =>
                setmessages(
                    snapshot.docs.map(doc => ({
                        createdAt: doc.data().createdAt,
                        msgvalue: doc.data().msgvalue,
                        senBy: doc.data().senBy,
                        senTo: doc.data().senTo,
                        seen: doc.data().seen,
                        img: doc.data().img
                    })),
                ),
            );
        return subscriber;
    }, [])

    const onChangeTextInput = useCallback((e) => {
        if (e === '') {
            setmsgvalue('');
            settyping(false);
        }
        if (e) {
            setmsgvalue(e);
            settyping(true);
        }
    }, [])

    const onSend = useCallback(() => {
        setmsgvalue('');
        settyping(false)
        if (msgvalue) {
            senderMsg(msgvalue, auth().currentUser.uid, guestUid, img, new Date())
                .then(() => settyping(false))
                .catch((er) => { console.error(er) })
        }
    }, [msgvalue, img])

    const getEmoji = (emoji) => {
        setmsgvalue(msgvalue + emoji)
    }

    const showEmoji = () => {
        Keyboard.dismiss()
        setTimeout(() => {
            setonEmoji(!onEmoji)
        }, 0);
    }

    const openGallery = () => {

    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.container}
                enabled={true}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={30}
            >
                <Fragment>
                    <AppHeader back
                        onLeftPress={() => navigation.navigate('tab')} title={name} titleAlight={'center'}
                        optionalBtn={'align-justify'} headerBg='#ffffff' />

                    <FlatList
                        onTouchStart={() => {
                            setonEmoji(false)
                            settyping(false)
                        }}
                        style={{ marginBottom: 20 }}
                        inverted
                        data={messages}
                        initialNumToRender={15}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => {
                            return <ChatBox
                                msg={item.msgvalue}
                                userId={item.senBy}
                                img={item.img}
                                time={item.createdAt}
                                avatarText={imageText}
                            />
                        }}
                    />
                    <SenderCard setonEmoji={setonEmoji}
                        msgvalue={msgvalue}
                        openGallery={openGallery}
                        typing={typing}
                        onChangeTextInput={onChangeTextInput}
                        settyping={settyping}
                        showEmoji={showEmoji}
                        onSend={onSend}
                    />

                    {onEmoji &&
                        <EmojiView getEmoji={getEmoji}/>
                        }
                </Fragment>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
export default Chat;
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'white'
    },
    body: {
        flex: 2 / 3,
    },
    input: {
        borderWidth: 2,
        height: 60,
        marginHorizontal: 40,
        paddingHorizontal: 20,
        marginTop: 20,
        borderColor: '#AAAAAA'
    },
    btn: {
        width: 130
    },
    labelBtn: {
        marginTop: 5, color: 'gray'
    },
    loginBtn: {
        height: 50,
        width: 250,
        backgroundColor: '#3399FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },
    loginLabel: {
        fontSize: 18,
        color: 'white'
    },
    textContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loaderContainer: {
        zIndex: 1,
        elevation: 2,
        height: height,
        width: width,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'white',
    },
})