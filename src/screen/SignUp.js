import React, { useState } from 'react';

import {
    Text,
    View,
    Image,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    Alert,
    Dimensions,
    LogBox,
} from 'react-native';
import AppButton from '../components/button';
import Loader from '../components/loader';
import auth from '@react-native-firebase/auth';
import { StackActions } from '@react-navigation/native';
import AppHeader from '../components/header';
import { keys, setAsyncStorage } from '../AsyncStorage/UserStorage';
import addUser from '../Function/Firebase';
import { ACC_ID, API_KEY, APPLICATION_ID } from "../Constant/voxiplant";
import { loginVox } from '../Function/Voxiplant.js';
import { SCREENS } from '../Constant';
LogBox.ignoreAllLogs();

const SignUp = ({ navigation }) => {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [name, setname] = useState('');
    const [loading, setLoading] = useState(false);

    const checkRegister = () => {
        if (username && password && name) {
            if (password.length >= 6) {
                setLoading(true);
                auth()
                    .createUserWithEmailAndPassword(username, password)
                    .then(userCurrent => {
                        let user = userCurrent.user;
                        user.updateProfile({
                            displayName: name,
                        })
                            .then(() => {
                                createVox(username, password, name);
                                addUser(user.uid, name, user.email, new Date(), '');
                                navigation.dispatch(StackActions.popToTop());
                                setLoading(false);
                                setAsyncStorage(keys.uuid, user.uid);
                                navigation.replace(SCREENS.TAB);
                            });
                    })
                    .catch(error => {
                        if (error.code == 'auth/network-request-failed') {
                            Alert.alert('Opps, c?? l???i x???y ra!', 'Kh??ng c?? k???t n???i Internet');
                        } else if (error.code === 'auth/email-already-in-use') {
                            Alert.alert('Opps, c?? l???i x???y ra!', 'Email ???? ???????c ????ng k??');
                        } else if (error.code === 'auth/invalid-email') {
                            Alert.alert('Opps, c?? l???i x???y ra!', '?????a ch??? email kh??ng h???p l???');
                        }
                        setLoading(false);

                        console.log(error.code);
                    });
            } else {
                Alert.alert('Opps, c?? l???i x???y ra!', 'M???t kh???u t???i thi???u 6 k?? t???');
            }
        } else {
            Alert.alert('Opps, c?? l???i x???y ra!', 'Vui l??ng nh???p ?????y ????? th??ng tin');
        }
    };
    const createVox = (username, password, name) => {
        let user_name = username.replace('@gmail.com', '');
        fetch(`https://api.voximplant.com/platform_api/AddUser/?account_id=${ACC_ID}&api_key=${API_KEY}&user_name=${user_name}&user_display_name=${name}&user_password=${password}&application_id=${APPLICATION_ID}`)
            .then((respone) => respone.json())
            .then((res) => {
                console.log('t???o vox th??nh c??ng ' + res)
                loginVox(username, password).then((e) => console.log(e))
            })
            .catch((e) => {
                console.log("l???i " + e)
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.container} behavior="height">
                <TouchableWithoutFeedback
                    style={styles.container}
                    onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {loading ? (
                            <View style={styles.loaderContainer}>
                                <Loader />
                            </View>
                        ) : (
                            <>
                                <View style={styles.logoContainer}>
                                    <AppHeader
                                        back
                                        onLeftPress={() => navigation.navigate(SCREENS.LOGIN)}
                                    />
                                    <Image
                                        source={require('../res/img/logo.png')}
                                        style={{
                                            width: 140,
                                            height: 140,
                                            bottom: 5,
                                            position: 'absolute',
                                        }}
                                    />
                                </View>
                                <View style={styles.body}>
                                    <TextInput
                                        placeholder="Email"
                                        placeholderColor="#CCCCCC"
                                        returntype="next"
                                        keyboardType="email-address"
                                        style={styles.input}
                                        value={username}
                                        onChangeText={input => setusername(input)}
                                    />
                                    <TextInput
                                        placeholder="H??? v?? t??n"
                                        placeholderColor="#CCCCCC"
                                        returntype="next"
                                        keyboardType="default"
                                        style={styles.input}
                                        onChangeText={input => setname(input)}
                                        value={name}
                                    />
                                    <TextInput
                                        placeholder="Password"
                                        placeholderColor="#CCCCCC"
                                        returntype="go"
                                        keyboardType="default"
                                        onChangeText={input => setpassword(input)}
                                        style={styles.input}
                                        secureTextEntry
                                        value={password}
                                    />

                                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                                        <AppButton
                                            text={'????ng K??'}
                                            containerStyle={styles.loginBtn}
                                            labelStyle={styles.loginLabel}
                                            onPress={checkRegister}
                                        />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={{ color: 'gray' }}>???? c?? t??i kho???n? </Text>
                                        <AppButton
                                            text={'????ng nh???p'}
                                            labelStyle={{
                                                color: '#3399FF',
                                                fontSize: 15,
                                                fontWeight: '700',
                                            }}
                                            onPress={() => navigation.goBack()}
                                        />
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
export default SignUp;
const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    logoContainer: {
        flex: 1 / 3.2,
        alignItems: 'center',
    },
    body: {
        flex: 2 / 3,
    },
    input: {
        borderWidth: 2,
        height: 60,
        marginHorizontal: 40,
        paddingHorizontal: 20,
        marginTop: 20,
        borderColor: '#AAAAAA',
    },
    btn: {
        width: 130,
    },
    labelBtn: {
        marginTop: 5,
        color: 'gray',
    },
    loginBtn: {
        height: 50,
        width: 250,
        backgroundColor: '#3399FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    loginLabel: {
        fontSize: 18,
        color: 'white',
    },
    textContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        zIndex: 1,
        elevation: 2,
        height: height,
        width: width,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
});
