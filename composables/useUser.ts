import { User, UserCredential } from 'firebase/auth';

export const useUser = () => {
    // User credentials - contains info after signing in
    const userCredentials = useState<UserCredential | null>(
        'userCredentials',
        () => null
    );

    // Firebase user object - contains user info
    const firebaseUser = useState<User | null>('user', () => null);

    const markOnboardingComplete = async (workspaceId: string) => {
        const { $trpcClient } = useNuxtApp();

        const result = await $trpcClient.user.markOnboardingComplete.mutate({ workspaceId });

        return result.success;
    };

    return {
        firebaseUser,
        userCredentials,
        markOnboardingComplete
    };
};