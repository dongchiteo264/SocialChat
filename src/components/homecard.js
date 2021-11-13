import React, { } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import UserAvatar from 'react-native-user-avatar';

function Homecard(props) {
    let textname = '';
    textname = props.item.name;
    let avatarname = textname.trimEnd().split(' ').reverse();
    if (avatarname[1] === undefined) {
        avatarname = avatarname[0];
    } else { avatarname = avatarname[1] + ' ' + avatarname[0] }

    return (
        <TouchableOpacity onPress={() => props.navigate('chat', {
            name: props.item.name,
            guestUid: props.item.uid,
            imageText: props.item.avatarLink ? props.item.avatarLink : avatarname[0]
        })}>
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
                    <Text style={styles.text}>
                        {props.item.name}
                    </Text>
                    <Text style={styles.text}>
                        {props.item.email}
                    </Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => { }}></TouchableOpacity>
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
    text1: {
        fontSize: 18,
        marginLeft: 15,
        fontWeight: 'bold'
    },
    mycard: {
        flexDirection: "row",
        margin: 3,
        padding: 4,
        backgroundColor: "white",
        borderBottomColor: 'grey'
    }
})