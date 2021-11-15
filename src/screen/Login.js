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
    LogBox,
    Alert,
    Dimensions
} from 'react-native';
import AppButton from '../components/button';
LogBox.ignoreAllLogs();
import auth from '@react-native-firebase/auth';
import Loader from '../components/loader';
import { keys, setAsyncStorage } from '../AsyncStorage/UserStorage';

const Login = ({ navigation }) => {
    const [username, setusername] = useState('')
    const [password, setpassword] = useState('')
    const [loading, setloading] = useState(false)

    const checkSignin = () => {
        if (username && password) {
            setloading(true)
            auth().signInWithEmailAndPassword(username, password)
                .then((res) => {
                    setloading(false)
                    setAsyncStorage(keys.uuid, res.user.uid)
                    navigation.replace('tab')
                })
                .catch((error) => {
                    var errorCode = error.code;
                    setloading(false)
                    if (errorCode == "auth/user-disabled") {
                        Alert.alert('Opps!', 'Tài khoản của bạn đã bị khoá');
                    }
                    if (errorCode == "auth/network-request-failed") {
                        Alert.alert('Opps!', 'Không có kết nối Internet');
                    }
                    Alert.alert('Opps!', 'Email hoặc mật khẩu không đúng');
                    console.log(errorCode)
                });
        }
        else {
            Alert.alert('Opps!', 'Vui lòng nhập đầy đủ thông tin');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {loading ?
                <View style={styles.loaderContainer}>
                    <Loader />
                </View>
                :
                <LoginView setusername={setusername} username={username} password={password} setpassword={setpassword} checkSignin={checkSignin} navigate={navigation.navigate}></LoginView>
            }
        </SafeAreaView>
    )
}


function LoginView(props) {
    return (<KeyboardAvoidingView style={styles.container} behavior='height'>
        <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require('../res/img/logo.png')} style={{
                        width: 140,
                        height: 140,
                        bottom: 5,
                        position: 'absolute'
                    }} />
                </View>
                <View style={styles.body}>
                    <TextInput placeholder='Email' value={props.username} placeholderColor='#CCCCCC' returntype='next' keyboardType='email-address' style={styles.input} autoCorrect={false} onChangeText={input => props.setusername(input)} />
                    <TextInput placeholder='Password' value={props.password} placeholderColor='#CCCCCC' returntype='go' keyboardType='default' secureTextEntry style={styles.input} onChangeText={input => props.setpassword(input)} />
                    <View style={{
                        alignItems: 'flex-end',
                        marginHorizontal: 30
                    }}>
                        <AppButton containerStyle={styles.btn} labelStyle={styles.labelBtn} text={'Quên mật khẩu ?'} />
                    </View>

                    <View style={{
                        marginTop: 20,
                        alignItems: 'center'
                    }}>
                        <AppButton text={'Đăng nhập'} containerStyle={styles.loginBtn} labelStyle={styles.loginLabel} onPress={props.checkSignin} />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={{
                            color: 'gray'
                        }}>Chưa có tài khoản? </Text>
                        <AppButton text={'Đăng ký'} labelStyle={{
                            color: '#3399FF',
                            fontSize: 15,
                            fontWeight: '700'
                        }} onPress={() => props.navigate('signup')} />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>);
}

export default Login;

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    logoContainer: {
        flex: 1 / 3,
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