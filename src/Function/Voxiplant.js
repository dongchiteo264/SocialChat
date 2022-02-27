import { ACC_NAME, APP_NAME } from '../Constant/voxiplant';
import { Voximplant } from 'react-native-voximplant';
import { keys, setAsyncStorage } from '../AsyncStorage/UserStorage';
const voximplant = Voximplant.getInstance();

const loginVox = async (username, password) => {
    let user_name = username.replace('@gmail.com', '');
    let user = {
        username,
        password
    }
    try {
        const _username = `${user_name}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
        await voximplant.login(_username, password);
        setAsyncStorage(keys.vox, JSON.stringify(user))
        return true;
    } catch (e) {
        return e;
    }
}


export { loginVox }