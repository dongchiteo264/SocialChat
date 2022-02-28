import React, { useState, useCallback, useRef } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import UserAvatar from 'react-native-user-avatar';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import PushNotification from 'react-native-push-notification';


const Homecard = ({ navigation, item, index }) => {
    const [text, settext] = useState('')
    const [seen, setseen] = useState(true)
    const [sentTo, setsentTo] = useState('')
    const [img, setimg] = useState('')
    const [name, setname] = useState('')
    const [sentBy, setsentBy] = useState('')

    const docid = item.uid > auth().currentUser.uid ? auth().currentUser.uid + "-" + item.uid : item.uid + "-" + auth().currentUser.uid
    firestore().collection('ChatRoom')
        .doc(docid)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .onSnapshot(snapshot => {
            snapshot.docs.map((data) => {
                settext(data.data().msgvalue);
                setseen(data.data().seen);
                setsentTo(data.data().senTo);
                setimg(data.data().img);
                setname(data.data().name)
                setsentBy(data.data().senBy)
            });
        });

    const onNotification = useCallback(() => {
        if ((seen == false) && (sentTo == auth().currentUser.uid) && (sentBy != auth().currentUser.uid)) {
            PushNotification.localNotification({
                channelId: "Message",
                message: text,
                title: name,
                id: index,
            })
        }

    }, [text, sentTo, seen, name, sentBy])

    return (
        <Card text={text} item={item} handleNotifycation={onNotification} sento={sentTo} seen={seen} name={name} navigate={navigation.navigate} img={img} ></Card>
    )
}

// const handleNotifycation = (message, name, id) => {

//     PushNotification.localNotification({
//         channelId: "Message",
//         message: message,
//         title: name,
//         id: id,
//     })

//     // PushNotification.localNotificationSchedule({
//     //     channelId: "Message",
//     //     message: message,
//     //     title: name,
//     //     id: id,
//     //     allowWhileIdle: true,
//     //     date: new Date(Date.now())
//     // })
// }



function Card(props) {
    const uid = auth().currentUser.uid;
    let textname = props.item.name;
    let avatarname = textname.trimEnd().split(' ').reverse();
    if (avatarname[1] === undefined) {
        avatarname = avatarname[0].charAt(0);
    } else { avatarname = avatarname[1].charAt(0) + ' ' + avatarname[0].charAt(0) }
    props.handleNotifycation();


    return (
        <TouchableOpacity onPress={() => props.navigate('chat', {
            name: props.item.name,
            guestUid: props.item.uid,
            imageText: props.item.avatarLink ? props.item.avatarLink : avatarname,
            email:props.item.email
        })} >
            <View style={styles.mycard}>

                {
                    (props.item.avatarLink)
                        ?
                        <Image source={{
                            uri: props.item.avatarLink
                        }}
                            style={styles.img}
                        />
                        :
                        <UserAvatar size={60} name={avatarname} />
                }

                <View>
                    <Text style={((props.seen === false) && (props.sento === auth().currentUser.uid)) ? styles.text1 : styles.text}>
                        {props.item.name}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={((props.seen === false) && props.sento === auth().currentUser.uid) ? styles.text3 : styles.text2}>
                            {(props.text === '' && props.img) ? 'Hình ảnh' : props.text}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>)
}

export default Homecard;

const styles = StyleSheet.create({
    img: { width: 60, height: 60, borderRadius: 30 },
    text: {
        fontSize: 17,
        marginLeft: 15,
        opacity: 0.8
    },
    text2: {
        fontSize: 14,
        marginLeft: 15,
        opacity: 0.5
    },
    text1: {
        fontSize: 18,
        marginLeft: 15,
        fontWeight: 'bold'
    },
    text3: {
        fontSize: 14,
        marginLeft: 15,
        fontWeight: 'bold'
    },
    mycard: {
        flexDirection: "row",
        margin: 3,
        padding: 4,
        backgroundColor: "white",
        borderBottomColor: 'grey'
    },

})