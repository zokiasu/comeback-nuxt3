import { useCurrentUser, useFirebaseAuth } from 'vuefire';
import { User, UserCredential } from 'firebase/auth';

export const useUser = () => {
    const userCredentials = useState<UserCredential | null>('userCredentials', () => null);
    const firebaseUser = useState<User | null>('user', () => null);

    const auth = useFirebaseAuth()!; // only exists on client side
    const user = useCurrentUser();

    const markOnboardingComplete = async (workspaceId: string) => {
        const { $trpcClient } = useNuxtApp();

        const result = await $trpcClient.user.markOnboardingComplete.mutate({ workspaceId });

        return result.success;
    };

    const getDatabaseUser = async () => {
        if (user.value == null) return null;

        const result = await queryByDoc('users', user.value.uid);

        if (result) return result;

        return null;
    };

    const isLogin = useState<boolean>('isLogin', () => false);

    return {
        userCredentials,
        firebaseUser,
        isLogin,
        auth,
        user,
        markOnboardingComplete,
        getDatabaseUser,
    };
};
