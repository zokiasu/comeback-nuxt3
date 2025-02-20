import { useUserStore } from '@/stores/user'

export const signOutApp = async () => {
	const { $auth } = useNuxtApp()
	const { setUserData, setIsAdmin } = useUserStore()
	setUserData(null)
	setIsAdmin(false)
	const result = await $auth.signOut()
	return result
}
