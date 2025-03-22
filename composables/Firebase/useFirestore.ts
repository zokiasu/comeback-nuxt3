import {
	collection,
	getDoc,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	setDoc,
	updateDoc,
} from 'firebase/firestore'

/** GENERAL FUNCTION **/
export const queryByCollection = async (col: string) => {
	const { $firestore } = useNuxtApp()

	const colRef = collection($firestore as any, col)

	const snapshot = await getDocs(colRef)

	const docs = Array.from(snapshot.docs).map((doc) => {
		return {
			...doc.data(),
			taskId: doc.id,
		}
	})

	return docs
}

export const queryByDoc = async (col: string, id: string) => {
	const { $firestore } = useNuxtApp()

	const colRef = doc($firestore as any, col, id)

	const snapshot = await getDoc(colRef)

	const docs = snapshot.data()

	return docs
}

export const set = async (col: string, document: object) => {
	const { $firestore } = useNuxtApp()

	await setDoc(doc($firestore as any, col), document, { merge: true })
}

export const add = async (col: string, document: object) => {
	const { $firestore } = useNuxtApp()

	const colRef = collection($firestore as any, col)

	const docRef = await addDoc(colRef, document)

	return docRef
}

export const update = async (col: string, id: string, document: any) => {
	const { $firestore } = useNuxtApp()

	const docRef = doc($firestore as any, col, id)

	await updateDoc(docRef, document)

	return docRef
}

export const deletebyDoc = async (col: string, id: string) => {
	const { $firestore } = useNuxtApp()

	const docRef = doc($firestore as any, col, id)

	await deleteDoc(docRef)
		.then(() => {})
		.catch((error) => {
			console.error('deletebyDoc : Error removing document: ', error)
		})
}
