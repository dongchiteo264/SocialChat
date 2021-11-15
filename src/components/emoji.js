
import Emoji from '../../Emoji.json';
import { FlatList } from "react-native-gesture-handler";
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";

function EmojiView(props) {
    return (<View style={{
        height: 200,
        alignItems: 'center',
        width: '100%'
    }}>
        <FlatList style={{
            marginLeft: 15
        }} numColumns={7} initialNumToRender={5} data={Emoji["Smileys & Emotion"]} keyExtractor={(id, index) => index.toString()} renderItem={({
            item
        }) => {
            return <TouchableOpacity onPress={() => props.getEmoji(item.char)} style={{
                width: '14.25%',
                height: 35,
                justifyContent: 'space-between'
            }}>
                <Text style={{
                    fontSize: 24
                }}>{item.char}</Text>
            </TouchableOpacity>;
        }} />
    </View>);
}
export default EmojiView;