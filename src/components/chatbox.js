import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import auth from '@react-native-firebase/auth';
import UserAvatar from 'react-native-user-avatar';
import { Avatar } from "react-native-elements";

const ChatBox = ({ userId, msg, img, onImgTap, avatarText }) => {
    let imgtext = ''; imgtext = avatarText
    let isCurrentUser = userId === auth().currentUser.uid ? true : false;
    return (
        <View style={[styles.cardContainer, {
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
            marginLeft: !isCurrentUser ? 5 : 0,
            marginTop: 5
        }]}
        >
            {
                (!isCurrentUser) ?
                    (imgtext.length < 2) ?
                        <UserAvatar size={40} name={imgtext} />
                        :
                        <Avatar size={40} rounded source={{ uri: imgtext }} />
                    : null
            }

            <View style={[styles.chatContainer, {
                marginRight: isCurrentUser ? 10 : 0,
                backgroundColor: isCurrentUser ? 'rgb(0, 132, 255)' : '#f2f2f2',
                marginLeft: !isCurrentUser ? 5 : 0
            }]}
            >
                <Text style={[styles.chatTxt, { color: isCurrentUser ? 'white' : 'black' }]}>{msg}</Text>
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
        fontSize: 18,
        fontWeight: "400",
        padding: 8,
    },
    cardContainer: {
        flexDirection: 'row',
        width: width / 2,
        alignItems: 'center',
    }
});