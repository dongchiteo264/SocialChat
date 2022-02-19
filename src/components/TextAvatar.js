import React from "react";
import { View, Text } from "react-native";

const TextAvatar = ({ text, size, backgroundColor, textsize, textcolor }) => {
    return (
        <View style={{ backgroundColor: backgroundColor, height: size, width: size, borderRadius: size / 2, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: textsize, color: textcolor }}>{text}</Text>
        </View>
    )
}

export default TextAvatar;