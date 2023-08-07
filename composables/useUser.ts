import { useCurrentUser, useFirebaseAuth } from 'vuefire';
import { User, UserCredential } from 'firebase/auth';
import { useUserStore } from '@/stores/user'

export const useUser = () => {
    const { isLoginStore, isAdminStore, userDataStore, firebaseUserStore } = useUserStore()
    
    const firebaseUser = useState<User | null>('firebaseUser', () => firebaseUserStore);

    const isLogin = useState<boolean>('isLogin', () => isLoginStore);

    const isAdmin = useState<boolean>('isAdmin', () => isAdminStore);

    const userData = useState<any>('userData', () => userDataStore);

    const getDatabaseUser = async () => {
        if (firebaseUser.value == null) return null;

        const result = await queryByDoc('users', firebaseUser.value.uid);

        if (result) return result;

        return null;
    };

    return {
        firebaseUser,
        isAdmin,
        isLogin,
        userData,
        getDatabaseUser,
    };
};
