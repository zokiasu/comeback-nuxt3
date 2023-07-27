import { User, UserCredential } from 'firebase/auth';
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

export const useUser = () => {

    const auth = useFirebaseAuth()!; // only exists on client side
    const user = useCurrentUser();

    // User credentials - contains info after signing in
    const userCredentials = useState<UserCredential | null> ( 'userCredentials', () => null );

    // Firebase user object - contains user info
    const firebaseUser = useState<User | null>('user', () => null);

    const markOnboardingComplete = async (workspaceId: string) => {
        const { $trpcClient } = useNuxtApp();

        const result = await $trpcClient.user.markOnboardingComplete.mutate({ workspaceId });

        return result.success;
    };

    const getDatabaseUser = async () => {
        if (!user.value) return null;

        const result = await queryByDoc('users', user.value.uid);

        if (result) {
            return result;
        }

        return null;
    };

    const useUserData = () => useState<Object>('userData', () => null);
    const isUserLogin = () => useState<boolean>('isLogin', () => user.value !== null);

    return {
        userCredentials,
        firebaseUser,
        markOnboardingComplete,
        useUserData,
        isUserLogin,
        getDatabaseUser,
        user,
        auth,
    };
};