
import React, { useLayoutEffect, useState, useEffect, Fragment } from "react";
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    Dimensions,
    Platform,
    Keyboard,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity
} from "react-native";
import AppHeader from "../components/header";
import auth from '@react-native-firebase/auth';
import ChatBox from "../components/chatbox";
import firestore from '@react-native-firebase/firestore';
import { senderMsg } from "../Firebase/FirebaseFunction";
import SenderCard from "../components/senderCard";

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

    const onSend = () => {
        setmsgvalue('');
        settyping(false)
        if (msgvalue) {
            senderMsg(msgvalue, auth().currentUser.uid, guestUid, img, new Date())
                .then(() => setsending(false))
                .catch((er) => { console.error(er) })
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <Fragment>
                    <AppHeader back
                        onLeftPress={() => navigation.navigate('tab')} title={name} titleAlight={'center'}
                        optionalBtn={'align-justify'} headerBg='#ffffff' />

                    <FlatList
                        style={{ marginBottom: 20 }}
                        inverted
                        data={messages}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => {
                            return <ChatBox
                                msg={item.msgvalue}
                                userId={item.senBy}
                                img={item.img}
                                avatarText={imageText}
                            />
                        }}
                    />
                    <SenderCard msgvalue={msgvalue} setmsgvalue={setmsgvalue} typing={typing} settyping={settyping} setonEmoji={setonEmoji} onSend={onSend} />

                </Fragment>
        </SafeAreaView>
    )
}
export default Chat
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
    senderContainer: {
        backgroundColor: 'white',
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        justifyContent: 'flex-end',
    },
    input: {
        borderWidth: 2,
        borderRadius: 30,
        paddingHorizontal: 15,
        maxHeight: 100,
    },
    emoji: {
        justifyContent: "center", alignItems: 'center',
        marginLeft: 5
    },
    iconleft: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    }
})