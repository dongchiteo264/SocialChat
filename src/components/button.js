import React from 'react';

import {
    Text,
    TouchableOpacity
} from 'react-native';

function AppButton({ containerStyle, labelStyle, text,onPress }) {
    return (<TouchableOpacity style={[containerStyle]} onPress={onPress}>
        <Text style={labelStyle}>{text}</Text>
    </TouchableOpacity>);
}

export default AppButton;