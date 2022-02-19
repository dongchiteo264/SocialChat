import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    StatusBar,
    Image,
} from 'react-native';
import AppHeader from '../components/header';
import { Avatar } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import TextAvatar from '../components/TextAvatar';
import { getAsyncStorage, keys } from '../AsyncStorage/UserStorage';

function AvatarUser(props) {
    return (
        <View>
            <Avatar
                size={'medium'}
                rounded
                source={{
                    uri: props.sourceAvatar,
                }}
            />
        </View>
    );
}

const Person = ({ navigation, route }) => {
    const [text, settext] = useState('');
    const [visible, setvisible] = useState(false);
    const sourceAvatar = auth().currentUser.photoURL;
    getAsyncStorage(keys.name).then(name => {
        settext(name);
    });
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <StatusBar backgroundColor={visible ? 'rgba(0,0,0,0.5)' : 'white'} />

            <AppHeader
                title={'Tôi'}
                headerBg="white"
                style={{
                    elevation: 0,
                }}
            />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setvisible(true)}>
                    {sourceAvatar ? (
                        <AvatarUser sourceAvatar={sourceAvatar}></AvatarUser>
                    ) : (
                        <TextAvatar
                            text={'TT'}
                            size={100}
                            backgroundColor="#2ecc71"
                            textsize={40}
                            textcolor="white"
                        />
                    )}
                    <Modal visible={visible} transparent={true} animationType="none">
                        <View
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <View style={{ backgroundColor: 'white', width: 200, height: 250 }}>
                                <View style={{ backgroundColor: '#96e5fe' }}>
                                    <Image
                                        resizeMode="center"
                                        style={{ width: 200, height: 80 }}
                                        source={require('../res/img/baineravatar.jpg')}
                                    />
                                </View>
                            </View>
                            <Pressable
                                onPress={() => setvisible(false)}
                                style={{
                                    position: 'absolute',
                                    zIndex: -1,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    top: 0,
                                }}></Pressable>
                        </View>
                    </Modal>
                </TouchableOpacity>
                <Text style={styles.stylename}>{text}</Text>
            </View>
        </View>
    );
};
export default Person;

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    stylename: {
        fontSize: 22,
        marginTop: 10,
        fontWeight: 'bold',
    },
});
