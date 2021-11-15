
import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    SafeAreaView,
    Text,
    FlatList,
    RefreshControl
} from "react-native";
import AppHeader from '../components/header'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import auth from '@react-native-firebase/auth';
import { clearAsyncStorage } from "../AsyncStorage/UserStorage";
import Homecard from "../components/homecard";
import firestore from '@react-native-firebase/firestore';
import Loader from "../components/loader";


function Header(props) {
    return (<AppHeader title='Đoạn chat' headerBg='#ffffff' style={{ borderWidth: 2 }} right={<SimpleLineIcons name="logout" size={28} />} onRightPress={() => auth().signOut().then(() => {
        clearAsyncStorage().then(() => {
            props.replace('login');
        });
    })} />);
}


const HomeChat = ({ navigation }) => {
    const [users, setUsers] = useState(null);
    const [loading, setloading] = useState(true)

    const getUsers = async () => {
        const querySanp = await firestore().collection('Users').where('uid', '!=', auth().currentUser.uid).get();
        const allusers = querySanp.docs.map(docSnap => docSnap.data());
        setUsers(allusers)
        setloading(false)
    }
    useEffect(() => {
      const unsub=  getUsers()
      return ()=> unsub
    }, [navigation])

    const onRefresh = () => {
        setUsers('')
        setloading(true)
        getUsers()
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header replace={navigation.replace}></Header>
            <View style={styles.body}>
                {
                    loading ?
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Loader />
                        </View>
                        :
                        <View style={styles.listUser}>
                            <FlatList
                                data={users}
                                renderItem={({ item }) => {
                                    return <Homecard item={item} navigate={navigation.navigate}/>
                                }}
                                keyExtractor={(item) => item.uid}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={loading}
                                        onRefresh={onRefresh}
                                    />
                                }
                            />
                        </View>
                }
            </View>
        </SafeAreaView>
    )
};


export default HomeChat;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        backgroundColor: 'white',
        flex: 1,
    },
    listUser: {
        marginTop: 10
    }
})