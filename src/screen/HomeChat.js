import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import AppHeader from '../components/header';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import auth from '@react-native-firebase/auth';
import { clearAsyncStorage } from '../AsyncStorage/UserStorage';
import Homecard from '../components/homecard';
import firestore from '@react-native-firebase/firestore';
import Loader from '../components/loader';
import { Voximplant } from 'react-native-voximplant';

function Header(props) {
  const voximplant = Voximplant.getInstance();

  const disconnectVox = async () => {
    await voximplant.disconnect();
  }

  return (
    <AppHeader
      title="Đoạn chat"
      headerBg="#ffffff"
      titleSize={24}
      style={{
        height: 60,
        elevation: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      }}
      right={<SimpleLineIcons name="logout" size={24} />}
      onRightPress={() =>
        auth()
          .signOut()
          .then(() => {
            disconnectVox();
            clearAsyncStorage().then(() => {
              props.replace('login');
            });
          })
      }
    />
  );
}

const HomeChat = ({ navigation, route }) => {
  const [users, setUsers] = useState(null);
  const [loading, setloading] = useState(true);
  const voximplant = Voximplant.getInstance();

  const getUsers = async () => {
    const querySanp = await firestore()
      .collection('Users')
      .where('uid', '!=', auth().currentUser.uid)
      .get();
    const allusers = querySanp.docs.map(docSnap => docSnap.data());
    setUsers(allusers);
    setloading(false);
  };
  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      navigation.navigate('incommingcallscreen', { call: incomingCallEvent.call });
    })
    const unsub = getUsers();
    return () => {
      unsub;
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  }, []);

  const onRefresh = () => {
    setUsers('');
    setloading(true);
    getUsers();
  };


  return (
    <SafeAreaView style={styles.container}>
      <Header replace={navigation.replace}></Header>
      <View style={styles.body}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Loader />
          </View>
        ) : (
          <View style={styles.listUser}>
            <FlatList
              data={users}
              renderItem={({ item, index }) => {
                return <Homecard item={item} index={index} navigation={navigation} />;
              }}
              keyExtractor={item => item.uid}
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
              }
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    backgroundColor: 'white',
    flex: 1,
  },
  listUser: {
    marginTop: 10,
  },
});
