import {
  collection,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  Timestamp,
  query,
  where,
  orderBy,
  limit,
  getCountFromServer,
} from 'firebase/firestore'
import _ from 'lodash'

export function useFirebaseFunction() {
  const { $firestore: database } = useNuxtApp()

  /** GENERAL FUNCTION FOR FIREBASE FUNCTION **/
  const snapshotResultToArray = (result: any) => {
    const docs = Array.from(result.docs).map((doc: any) => {
      return {
        ...doc.data(),
      }
    })

    return docs
  }

  /** HOME FUNCTION **/
  const getNextComebacks = async (startDate: Timestamp) => {
    const colRef = query(
      collection(database as any, 'news'),
      where('date', '>=', startDate),
      orderBy('date', 'asc'),
    )

    const snapshot = await getDocs(colRef)

    return snapshotResultToArray(snapshot)
  }

  const getLastReleases = async (startDate: Timestamp, limitNumber: number) => {
    const colRef = query(
      collection(database as any, 'releases'),
      where('date', '>=', startDate),
      where('needToBeVerified', '==', false),
      orderBy('date', 'desc'),
      limit(limitNumber),
    )

    const snapshot = await getDocs(colRef)

    return snapshotResultToArray(snapshot)
  }

  const getLastArtistsAdded = async (limitNumber: number) => {
    const colRef = query(
      collection(database as any, 'artists'),
      orderBy('createdAt', 'desc'),
      limit(limitNumber),
    )

    const snapshot = await getDocs(colRef)

    return snapshotResultToArray(snapshot)
  }

  const getRandomMusic = async (): Promise<any> => {
    const colRef = query(collection(database as any, 'releases'))

    const snapshot = await getDocs(colRef)

    const docs = Array.from(snapshot.docs).map((doc) => {
      return {
        ...doc.data(),
      }
    })

    const random = Math.floor(Math.random() * docs.length)

    const colMusic = query(
      collection(database as any, 'releases', docs[random].id, 'musics'),
    )

    const snapshotMusic = await getDocs(colMusic)

    const musics = Array.from(snapshotMusic.docs).map((doc) => {
      return {
        ...doc.data(),
      }
    })

    let randomMusic = Math.floor(Math.random() * musics.length)

    if (musics[randomMusic]?.name.toLowerCase().includes('inst')) {
      return getRandomMusic()
    }

    return musics[randomMusic]
  }

  /** Release **/
  const updateReleaseNeedToBeVerified = async (id: string, data: any) => {
    const docRef = doc(database as any, 'releases', id)

    await updateDoc(docRef, data)
  }

  /** Comeback **/
  const getComebackExist = async (
    date: Timestamp,
    artistName: string,
  ): Promise<boolean> => {
    const today = new Date()
    //convert today to timestamp
    const todayInTimestamp = Timestamp.fromDate(today)
    //fetch all comeback after today
    const comebackList = await getNextComebacks(todayInTimestamp)
    
    //verify if comeback exist in list
    const comebackExist = comebackList.find((comeback: any) => {
      const cbDate = new Date(comeback.date.seconds * 1000)
      //format cbDate to test to DD-MM-YYYY
      cbDate.setHours(0, 0, 0, 0)
      const dateToTest = new Date(date.seconds * 1000)
      dateToTest.setHours(0, 0, 0, 0)
      
      if (
        comeback.artist.name.toLowerCase() === artistName.toLowerCase() &&
        _.isEqual(cbDate, dateToTest)
      )
        return true
    })
    
    //if comeback exist return true
    if (comebackExist) return true
    return false
  }

  return {
    database,
    getNextComebacks,
    getLastReleases,
    getLastArtistsAdded,
    getRandomMusic,
    updateReleaseNeedToBeVerified,
    getComebackExist,
  }
}
