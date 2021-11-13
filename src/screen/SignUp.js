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
import addUser from '../Firebase/FirebaseFunction';
LogBox.ignoreAllLogs();

const SignUp = ({ navigation }) => {

    const [username, setusername] = useState('')
    const [password, setpassword] = useState('')
    const [name, setname] = useState('')
    const [loading, setLoading] = useState(false)

    const checkRegister = () => {
        if (username && password && name) {
            if (password.length >= 6) {
                setLoading(true)
                auth()
                    .createUserWithEmailAndPassword(username, password)
                    .then((userCurrent) => {
                        let user = userCurrent.user;
                        user.updateProfile({
                            displayName: name
                        })
                            .then(() => {
                                addUser(user.uid, name, user.email, new Date, '')
                                navigation.dispatch(StackActions.popToTop());
                                setLoading(false)
                                setAsyncStorage(keys.uuid, user.uid)
                                navigation.replace('tab')
                            })
                    })
                    .catch(error => {
                        if (error.code == 'auth/network-request-failed') {
                            Alert.alert('Opps, có lỗi xảy ra!', 'Không có kết nối Internet');
                        }
                        else if (error.code === 'auth/email-already-in-use') {
                            Alert.alert('Opps, có lỗi xảy ra!', 'Email đã được đăng ký')
                        }
                        else if (error.code === 'auth/invalid-email') {
                            Alert.alert('Opps, có lỗi xảy ra!', 'Địa chỉ email không hợp lệ');
                        }
                        setLoading(false)

                        console.log(error.code)
                    });
            }
            else {
                Alert.alert('Opps, có lỗi xảy ra!', 'Mật khẩu tối thiểu 6 ký tự');
            }
        }
        else {
            Alert.alert('Opps, có lỗi xảy ra!', 'Vui lòng nhập đầy đủ thông tin');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior='height'
            >
                <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        {loading ?
                            <View style={styles.loaderContainer}>
                                <Loader />
                            </View> :
                            <>
                                <View style={styles.logoContainer}>
                                    <AppHeader back onLeftPress={() => navigation.navigate('login')} />
                                    <Image source={require('../res/img/logo.png')} style={{ width: 140, height: 140, bottom: 5, position: 'absolute' }} />
                                </View>
                                <View style={styles.body}>
                                    <TextInput
                                        placeholder='Email'
                                        placeholderColor='#CCCCCC'
                                        returntype='next'
                                        keyboardType='email-address'
                                        style={styles.input}
                                        onChangeText={(input) => setusername(input)}
                                    />
                                    <TextInput
                                        placeholder='Họ và tên'
                                        placeholderColor='#CCCCCC'
                                        returntype='next'
                                        keyboardType='default'
                                        style={styles.input}
                                        onChangeText={(input) => setname(input)}
                                    />
                                    <TextInput
                                        placeholder='Password'
                                        placeholderColor='#CCCCCC'
                                        returntype='go'
                                        keyboardType='default'
                                        onChangeText={(input) => setpassword(input)}
                                        style={styles.input}
                                        secureTextEntry
                                    />

                                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                                        <AppButton text={'Đăng nhập'} containerStyle={styles.loginBtn} labelStyle={styles.loginLabel}
                                            onPress={checkRegister}
                                        />
                                    </View>
                                    <View style={styles.textContainer}>
                                        <Text style={{ color: 'gray' }}>Đã có tài khoản? </Text>
                                        <AppButton text={'Đăng nhập'} labelStyle={{ color: '#3399FF', fontSize: 15, fontWeight: '700' }}
                                            onPress={() => navigation.goBack()} />
                                    </View>
                                </View>
                            </>
                        }
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
export default SignUp;
const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    logoContainer: {
        flex: 1 / 3.2,
        alignItems: "center",
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
        borderColor: '#AAAAAA'
    },
    btn: {
        width: 130
    },
    labelBtn: {
        marginTop: 5, color: 'gray'
    },
    loginBtn: {
        height: 50,
        width: 250,
        backgroundColor: '#3399FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },
    loginLabel: {
        fontSize: 18,
        color: 'white'
    },
    textContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
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

})