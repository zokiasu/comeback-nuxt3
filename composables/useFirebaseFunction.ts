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
  onSnapshot,
} from 'firebase/firestore'
import _ from 'lodash'

export function useFirebaseFunction() {
  const { $firestore: database } = useNuxtApp()
  const { shuffleArray } = useGeneralFunction()
  const config = useRuntimeConfig()

  /** 
   * GENERAL FUNCTION FOR FIREBASE FUNCTION 
  **/
  // Converts a Firestore snapshot into an array of documents.
  const snapshotResultToArray = (result: any) => {
    const docs = Array.from(result.docs).map((doc: any) => {
      return {
        ...doc.data(),
      }
    })

    return docs
  }
  // Fetches details of a YouTube video using the YouTube Data API.
  const getVideoDetails = async (videoId: string, apiKey: string) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails,status&key=${apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      return (data.items && data.items.length) ? data.items[0] : null
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la vidéo:', error)
      return null
    }
  }
  // Checks if a YouTube video can be embedded.
  const canVideoBeEmbedded = async (videoId: string, apiKey: string) => {
    const videoDetails = await getVideoDetails(videoId, apiKey)

    if (!videoDetails) {
      return false
    }

    const isEmbeddable = videoDetails.status.embeddable
    const hasRestriction = videoDetails.contentDetails.regionRestriction

    return isEmbeddable && !hasRestriction
  }

  /** 
   * HOMEPAGE FUNCTION 
  **/
  // Listens for real-time updates to the 'news' collection in Firestore where the date is greater than or equal to the provided start date.
  const getRealtimeNextComebacks = async (startDate: Timestamp, callback: Function) => {
    const colRef = query(
      collection(database as any, 'news'),
      where('date', '>=', startDate),
      orderBy('date', 'asc'),
    )

    // Écoute en temps réel des modifications dans la collection
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const comebacks = snapshotResultToArray(snapshot)
      callback(comebacks)
    })

    // Retourne la fonction pour se désabonner de l'écouteur
    return unsubscribe
  }
  // Listens for real-time updates to the 'releases' collection in Firestore where the date is greater than or equal to the provided start date and needToBeVerified is false.
  const getRealtimeLastestReleases = async (startDate: Timestamp, limitNumber: number, callback: Function) => {
    const colRef = query(
      collection(database as any, 'releases'),
      where('date', '>=', startDate),
      where('needToBeVerified', '==', false),
      orderBy('date', 'desc'),
      limit(limitNumber),
    )

    // Écoute en temps réel des modifications dans la collection
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const releases = snapshotResultToArray(snapshot)
      callback(releases)
    })

    // Retourne la fonction pour se désabonner de l'écouteur
    return unsubscribe
  }
  // Listens for real-time updates to the 'artists' collection in Firestore.
  const getRealtimeLastestArtistsAdded = async (limitNumber: number, callback: Function) => {
    const colRef = query(
      collection(database as any, 'artists'),
      orderBy('createdAt', 'desc'),
      limit(limitNumber),
    )

    // Écoute en temps réel des modifications dans la collection
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const artists = snapshotResultToArray(snapshot)
      callback(artists)
    })

    // Retourne la fonction pour se désabonner de l'écouteur
    return unsubscribe
  }
  // Fetches a random music release from the 'releases' collection in Firestore.
  const getRandomMusic = async (): Promise<any> => {
    const colRef = query(collection(database as any, 'releases'));
    const snapshot = await getDocs(colRef);
    let releases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
    releases = shuffleArray(releases); // Mélange les releases
  
    for (let release of releases) {
      const colMusic = query(collection(database as any, 'releases', release.id, 'musics'));
      const snapshotMusic = await getDocs(colMusic);
      const musics = snapshotMusic.docs.map((doc) => doc.data());
  
      for (let music of musics) {
        const isEmbeddable = await canVideoBeEmbedded(music.videoId, config.public.YOUTUBE_API_KEY);
        if (!music.name.toLowerCase().includes('inst') && isEmbeddable) {
          return music; // Retourne immédiatement dès qu'une musique correspondante est trouvée
        }
      }
    }
  
    // Si aucune musique correspondante n'est trouvée après avoir parcouru toutes les releases
    return null;
  };

  /**
   * CALENDAR PAGE FUNCTION
  **/
  //TODO: Add comment
  const getReleasesBetweenDates = async (startDate: Timestamp, endDate: Timestamp) => {
    const colRef = query(
      collection(database as any, 'releases'),
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      where('needToBeVerified', '==', false),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(colRef);

    return snapshotResultToArray(snapshot);
  }

  /** 
   * Release's Function
  **/
  // Updates a document in the 'releases' collection in Firestore.
  const updateRelease = async (id: string, data: any) => {
    const docRef = doc(database as any, 'releases', id)
    await updateDoc(docRef, data)
  }
  // Fetches releases by a specific artist from the 'releases' collection in Firestore.
  const getReleaseByArtistId = async (artistId: string) => {
    const colRef = query(collection(database as any, 'releases'), where('artistsId', '==', artistId));
    const snapshot = await getDocs(colRef);
    return snapshotResultToArray(snapshot);
  }
  //TODO: Add comment
  const getReleaseById = async (id: string) => {
    //TODO
  }

  const getReleaseByPageWithFilters = async (page: number, orderBy: string, lastVisibleElement: any) => {
    //TODO
  }

  /** 
   * Artist's Function
  **/
  //TODO: Add comment
  const getArtistById = async (id: string) => {
    //TODO
  }
  const updateArtist = async (id: string, data: any) => {
    //TODO
  }
  // Creates a new artist document in the 'artists' collection in Firestore.
  const createArtist = async (data: any) => {
    const docRef = await addDoc(collection(database as any, 'artists'), data);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  }

  /** 
   * Comeback's Function
  **/
  // Checks if a comeback exists in the 'news' collection in Firestore for a specific artist on a specific date.
  const getComebackExist = async (date: Timestamp, artistName: string): Promise<boolean> => {
    const today = new Date()
    const todayInTimestamp = Timestamp.fromDate(today)
    const colRef = query(
      collection(database as any, 'news'),
      where('date', '>=', todayInTimestamp),
      orderBy('date', 'asc'),
    )

    try {
      const snapshot = await getDocs(colRef)
      const comebacks = snapshotResultToArray(snapshot)

      return comebacks.some((comeback: any) => {
        const cbDate = new Date(comeback.date.seconds * 1000)
        cbDate.setHours(0, 0, 0, 0)
        const dateToTest = new Date(date.seconds * 1000)
        dateToTest.setHours(0, 0, 0, 0)

        return (
          comeback.artist.name.toLowerCase() === artistName.toLowerCase() &&
          _.isEqual(cbDate, dateToTest)
        )
      })
    } catch (error) {
      console.error("Erreur lors de la vérification de l'existence du comeback:", error)
      return false
    }
  }

  return {
    database,
    getRealtimeNextComebacks,
    getRealtimeLastestReleases,
    getRealtimeLastestArtistsAdded,
    getReleasesBetweenDates,
    getRandomMusic,
    updateRelease,
    getComebackExist,
    getReleaseByArtistId,
    createArtist,
  }
}
