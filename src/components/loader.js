
import React from "react";
import {
    ActivityIndicator,
    View,
    StyleSheet,
    Dimensions,
    Platform,
} from "react-native";
;

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
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

});

const Loader = () => {
    return (
            <View style={styles.indicator}>
                <ActivityIndicator
                    size="large"
                    animating={true}
                    color={'blue'}
                    style={{
                        left: Platform.OS === "ios" ? 1.3 : 0,
                        top: Platform.OS === "ios" ? 1 : 0,
                    }}
                />
            </View>
    )
};

export default Loader;