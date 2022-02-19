import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import auth from '@react-native-firebase/auth';
import UserAvatar from 'react-native-user-avatar';
import { Avatar } from "react-native-elements";

const ChatBox = ({ userId, msg, img, onImgTap, avatarText, time }) => {
    let imgtext = avatarText
    let isCurrentUser = userId === auth().currentUser.uid ? true : false;
    let t = time.toDate().toLocaleTimeString()
    return (
        <View style={[styles.cardContainer, {
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
            marginLeft: !isCurrentUser ? 5 : 0,
            marginTop: img ? 15 : 5,
            marginRight: isCurrentUser ? 10 : 0,
            width: width / 2 + 80
        }]}
        >
            {
                (!isCurrentUser) ?
                    (imgtext.length < 4) ?
                        <UserAvatar size={40} name={imgtext} />
                        :
                        <Avatar size={40} rounded source={{ uri: imgtext }} />
                    : null
            }

            <View style={[styles.chatContainer, {
                backgroundColor: isCurrentUser ? 'rgb(0, 132, 255)' : '#f2f2f2',
                marginLeft: !isCurrentUser ? 5 : 0,
            }]}
            >
                {
                    img ?
                        <TouchableOpacity onPress={onImgTap}>
                            <Image
                                source={{ uri: img }}
                                resizeMode='cover'
                                style={{ width: width / 2, height: 250 }}
                            />
                        </TouchableOpacity>
                        :
                        <View style={{ minWidth: 60 }}>
                            <Text style={[styles.chatTxt, { color: isCurrentUser ? 'white' : 'black' }]}>{msg}</Text>
                            <Text style={[styles.time, { color: isCurrentUser ? 'white' : 'black' }]}>{t.substring(0, t.length - 3)}</Text>
                        </View>
                }
            </View>
        </View>
    );
};

export default ChatBox;
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
    chatContainer: {
        borderRadius: 15,
        flexDirection: 'row'
    },
    chatTxt: {
        color: 'white',
        fontSize: 16,
        fontWeight: "400",
        padding: 8,
        paddingBottom: 0,
    },
    cardContainer: {
        flexDirection: 'row',
        width: width / 2,
        alignItems: 'center',
    },
    time: {
        alignSelf: 'flex-end',
        paddingHorizontal: 8,
        paddingBottom: 5,
        fontSize: 10,
        paddingTop: 8

    }
});