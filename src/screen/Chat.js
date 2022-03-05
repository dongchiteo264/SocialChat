import React, {
  useLayoutEffect,
  useState,
  Fragment,
  useCallback,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  Dimensions,
  Platform,
  Keyboard,
  StyleSheet,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { senderMsg, updateMsg } from '../Function/Firebase';
import AppHeader from '../components/header';
import SenderCard from '../components/senderCard';
import { FlatList } from 'react-native-gesture-handler';
import ChatBox from '../components/chatbox';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import EmojiView from '../components/emoji';
import storage from '@react-native-firebase/storage';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SCREENS } from '../Constant';


function RightComponent({ onPressPhone, onPressVideo }) {
  return (<View style={styles.rightButton}>
    <TouchableOpacity onPress={onPressPhone}>
      <FontAwesome name='phone' size={26} color={'#3399FF'} style={{
        marginRight: 15
      }} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onPressVideo}>
      <FontAwesome name='video-camera' size={26} color={'#3399FF'} style={{
        marginRight: 15
      }} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => console.log('k')}>
      <Feather name={'align-justify'} size={28} color={'#3399FF'} />
    </TouchableOpacity>
  </View>);
}


const Chat = ({ navigation, route }) => {
  const { name, guestUid, imageText, email } = route.params;
  const [messages, setmessages] = useState([]);
  const [msgvalue, setmsgvalue] = useState('');
  const [typing, settyping] = useState(false);
  const [onEmoji, setonEmoji] = useState(false);

  useEffect(() => {
    if (messages[0] != undefined) {
      const { senTo } = messages[0];
      if (senTo === auth().currentUser.uid) {
        const docid =
          guestUid > auth().currentUser.uid
            ? auth().currentUser.uid + '-' + guestUid
            : guestUid + '-' + auth().currentUser.uid;
        firestore()
          .collection('ChatRoom')
          .doc(docid)
          .collection('messages')
          .get()
          .then(snap => {
            snap.forEach(async doc => {
              await updateMsg(docid, doc.id);
            });
          });
      }
    }
  }, [navigation, messages]);

  useLayoutEffect(() => {
    const docid =
      guestUid > auth().currentUser.uid
        ? auth().currentUser.uid + '-' + guestUid
        : guestUid + '-' + auth().currentUser.uid;
    const subscriber = firestore()
      .collection('ChatRoom')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot =>
        setmessages(
          snapshot.docs.map(doc => ({
            createdAt: doc.data().createdAt,
            msgvalue: doc.data().msgvalue,
            senBy: doc.data().senBy,
            senTo: doc.data().senTo,
            seen: doc.data().seen,
            img: doc.data().img,
          })),
        ),
      );


    return subscriber;
  }, []);

  const onChangeTextInput = useCallback(e => {
    if (e === '') {
      setmsgvalue('');
      settyping(false);
    }
    if (e) {
      setmsgvalue(e);
      settyping(true);
    }
  }, []);

  const onSend = useCallback(
    imgurl => {
      setmsgvalue('');
      settyping(false);
      if (msgvalue || imgurl) {
        senderMsg(
          msgvalue,
          auth().currentUser.uid,
          guestUid,
          imgurl,
          new Date(),
          auth().currentUser.displayName
        )
          .then(() => {
            settyping(false);
          })
          .catch(er => {
            console.error(er);
          });
      }
    },
    [msgvalue],
  );

  const getEmoji = emoji => {
    setmsgvalue(msgvalue + emoji);
  };

  const showEmoji = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      setonEmoji(!onEmoji);
    }, 0);
  };

  const openGallery = () => {
    const option = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: true,
    };

    launchImageLibrary(option, response => {
      if (response.didCancel) {
        console.log('cancel');
      } else if (response.errorMessage) {
        console.log(response.errorCode);
      } else {
        response.assets.map(uri => {
          uploadFile(uri.fileName, uri.uri);
        });
      }
    });
  };

  const openCamera = () => {
    launchCamera(
      { mediaType: 'photo', quality: 1, includeBase64: true, saveToPhotos: true },
      function (res) {
        if (res.didCancel) {
          console.log('cancel');
        } else if (res.errorMessage) {
          console.log(response.errorCode);
        } else {
          res.assets.map(uri => {
            uploadFile(uri.fileName, uri.uri);
          });
        }
      },
    );
  };
  const uploadFile = (filename, url) => {
    const uploadTask = storage()
      .ref()
      .child(`/message/${Date.now()}'_'${filename}`)
      .putFile(url);
    uploadTask.on(
      'state_changed',
      snapshot => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress == 100) console.log('image uploaded');
      },
      error => {
        console.log('error uploading image');
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          onSend(downloadURL);
        });
      },
    );
  };


  const CallPhone = () => {
    if (email) {
      navigation.navigate(SCREENS.CALLING, { callee: email.replace('@gmail.com', ''), calltype: 'voice' })
    }
  }

  const CallVideo = () => {
    if (email) {
      navigation.navigate(SCREENS.CALLING, { callee: email.replace('@gmail.com', ''), calltype: 'video' })
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        enabled={true}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={30}>
        <Fragment>
          <AppHeader
            back
            onLeftPress={() => navigation.navigate('tab')}
            title={name}
            titleAlight={'left'}
            titleSize={18}
            rightComponent={
              <RightComponent
                onPressPhone={() => CallPhone()}
                onPressVideo={() => CallVideo()}
              />
            }
            headerBg="#ffffff"
          />

          <FlatList
            onTouchStart={() => {
              setonEmoji(false);
              settyping(false);
            }}
            style={{ marginBottom: 20 }}
            inverted
            data={messages}
            initialNumToRender={15}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <ChatBox
                  msg={item.msgvalue}
                  userId={item.senBy}
                  img={item.img}
                  time={item.createdAt}
                  onImgTap={() => {
                    if (item.img != '') {
                      navigation.navigate(SCREENS.SHOWFULL, {
                        img: item.img,
                        name: name,
                      });
                    }
                  }}
                  avatarText={imageText}
                />
              );
            }}
          />
          <SenderCard
            setonEmoji={setonEmoji}
            msgvalue={msgvalue}
            openGallery={openGallery}
            openCamera={openCamera}
            typing={typing}
            onChangeTextInput={onChangeTextInput}
            settyping={settyping}
            showEmoji={showEmoji}
            onSend={() => onSend('')}
          />

          {onEmoji && <EmojiView getEmoji={getEmoji} />}
        </Fragment>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Chat;
const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  rightButton: {
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});
