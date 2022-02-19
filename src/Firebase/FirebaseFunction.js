import firestore from '@react-native-firebase/firestore';


function addUser(uid, name, email, createAt, avatarLink) {
    firestore()
        .collection('Users')
        .doc(uid)
        .set({
            uid,
            name,
            email,
            createAt,
            avatarLink
        })
        .then(() => {
            console.log('User added!');
        });

}

export const senderMsg = async (msgvalue, currentID, guestID, img, createAt, name) => {
    const docid = guestID > currentID ? currentID + "-" + guestID : guestID + "-" + currentID;

    await firestore()
        .collection('ChatRoom')
        .doc(docid)
        .collection('messages')
        .add({
            createdAt: createAt,
            msgvalue: msgvalue,
            senBy: currentID,
            senTo: guestID,
            seen: false,
            img: img,
            name: name
        })
        .then(docRef => {
            return docRef
        })
        .catch(error => {
            return error
        });
}

export const updateMsg = async (docid, ID) => {
    await firestore()
        .collection('ChatRoom')
        .doc(docid)
        .collection('messages')
        .doc(ID)
        .update({
            seen: true
        }).then(() => {
        })
        .catch((err) => {
            console.log(err)
        })
}


export default addUser;