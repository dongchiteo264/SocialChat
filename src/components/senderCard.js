import React, { useCallback } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SenderCard = (props) => {
 
    return (
        <View style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <View style={styles.senderContainer}>
                {!props.typing && <>
                    <TouchableOpacity style={styles.iconleft} onPress={props.openCamera}>
                        <Entypo name="camera" size={32} color={'#3399FF'} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconleft} onPress={props.openGallery}>
                        <MaterialIcons name="insert-photo" size={34} color={'#3399FF'} />
                    </TouchableOpacity>
                </>}

                <TextInput style={[styles.input, {
                    width: props.typing ? '75%' : '55%'
                }]} placeholder="Nhập văn bản" onChangeText={input => { props.onChangeTextInput(input) }}
                    value={props.msgvalue} multiline={true} onFocus={() => props.settyping(true)}
                    onTouchStart={() => props.setonEmoji(false)}
                />
                <TouchableOpacity style={styles.emoji} onPress={props.showEmoji}>
                    <Image source={require('../res/img/icon/smile.png')} style={{
                        height: 34,
                        width: 34
                    }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={props.onSend}>
                    <MaterialCommunityIcons name="send-circle" color={'#3399FF'} size={42} />
                </TouchableOpacity>
            </View>


        </View>)
}


export default SenderCard
const styles = StyleSheet.create({
    senderContainer: {
        backgroundColor: 'white',
        flexDirection: "row",
        alignItems: "center",
        alignContent: "center",
        justifyContent: 'flex-end',
        marginBottom: 5
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