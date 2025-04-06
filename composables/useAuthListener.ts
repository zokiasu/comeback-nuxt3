import { doc, setDoc, getDoc, getFirestore, Timestamp } from 'firebase/firestore'
import { useUserStore } from '~/stores/user'

export const useAuthListener = () => {
	const { $auth } = useNuxtApp()
	const { setUserData, setFirebaseUser, setIsLogin, setIsAdmin } = useUserStore()

	const createDatabaseUser = async (user: any) => {
		const db = getFirestore()
		const userRef = doc(db, 'users', user.uid)
		const today = new Date()
		today.setDate(today.getDate())
		today.setHours(0, 0, 0, 0)
		const todayTimestamp = Timestamp.fromDate(today)

		await setDoc(userRef, {
			id: user.uid,
			email: user.email,
			name: user.displayName,
			photoURL: user.photoURL,
			role: 'USER',
			createdAt: todayTimestamp,
			updatedAt: todayTimestamp,
		})

		// Ensure the structure matches what the store expects if needed
		setUserData({
			id: user.uid, // Assuming store needs 'id' instead of 'uid' based on setDoc
			email: user.email,
			name: user.displayName,
			photoURL: user.photoURL,
			role: 'USER', // Ensure role matches 'USER' set in DB
			createdAt: todayTimestamp, // Pass timestamps if needed by store
			updatedAt: todayTimestamp,
		})
	}

	const getDatabaseUser = async (user: any) => {
		const uid = user.uid
		const db = getFirestore()
		const userRef = doc(db, 'users', uid)
		const userSnap = await getDoc(userRef)
		if (userSnap.exists()) {
			const userData = userSnap.data()
			setUserData(userData)
			setIsAdmin(userData.role === 'ADMIN')
		} else {
			console.log('No such user document! Creating one.')
			await createDatabaseUser(user)
		}
	}

	const initAuthListener = () => {
		// Ensure this only runs client-side (though called from onMounted, belt-and-suspenders)
		if (!process.client) {
			return
		}

		setUserData(null) // Initial state reset
		$auth.onAuthStateChanged(async (userState: any) => {
			if (userState) {
				// It's good practice to store the raw userState if needed elsewhere
				setFirebaseUser({ ...userState }) // Use spread to ensure reactivity if needed
				setIsLogin(true)
				try {
					await getDatabaseUser(userState)
				} catch (error) {
					console.error('Error fetching/creating database user:', error)
					// Handle error appropriately - maybe reset state?
					setFirebaseUser(null)
					setIsLogin(false)
					setUserData(null)
					setIsAdmin(false)
				}
			} else {
				setFirebaseUser(null)
				setIsLogin(false)
				setUserData(null)
				setIsAdmin(false)
			}
		})
	}

	// Return only the function needed to initialize the listener
	return {
		initAuthListener,
	}
}
