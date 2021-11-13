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

export const senderMsg = async (msgvalue, currentID, guestID, img, createAt) => {
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
            img: img
        })
        .then(docRef => {
            return docRef
        })
        .catch(error => {
            return error
        });
}


export default addUser;