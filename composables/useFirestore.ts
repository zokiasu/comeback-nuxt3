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

/** NEWS FUNCTION **/

export const fetchNews = async (startDate: Timestamp) => {
  const { $firestore } = useNuxtApp()

  const colRef = query(
    collection($firestore as any, 'news'),
    where('date', '>=', startDate),
    orderBy('date', 'asc'),
  )

  const snapshot = await getDocs(colRef)

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  return docs
}

/** RELEASES FUNCTION **/

export const fetchReleasesWithDateAndLimit = async (
  startDate: Timestamp,
  limitNumber: number,
) => {
  const { $firestore } = useNuxtApp()

  const colRef = query(
    collection($firestore as any, 'releases'),
    where('date', '>=', startDate),
    orderBy('date', 'desc'),
    limit(limitNumber),
  )

  const snapshot = await getDocs(colRef)

  const docs = Array.from(snapshot.docs)
    .map((doc) => {
      return {
        ...doc.data(),
      }
    })
    .filter((doc) => {
      return doc.needToBeVerified === false
    })

  return docs
}

export const fetchReleasesByMonth = async (startDate: Timestamp, endDate: Timestamp) => {
  const { $firestore } = useNuxtApp()

  const colRef = query(
    collection($firestore as any, 'releases'),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc'),
  )

  const snapshot = await getDocs(colRef)

  const docs = Array.from(snapshot.docs)
    .map((doc) => {
      return {
        ...doc.data(),
      }
    })
    .filter((doc) => {
      return doc.needToBeVerified === false
    })

  return docs
}

export const fetchReleaseById = async (idRelease: string) => {
  const { $firestore } = useNuxtApp()

  const colRelease = query(
    collection($firestore as any, 'releases'),
    where('id', '==', idRelease),
  )

  const colMusic = query(collection($firestore as any, 'releases', idRelease, 'musics'))

  const snapshotRelease = await getDocs(colRelease)
  const snapshotMusic = await getDocs(colMusic)

  const docs = Array.from(snapshotRelease.docs)
    .map((doc) => {
      return {
        ...doc.data(),
      }
    })
    .filter((doc) => {
      return doc.needToBeVerified === false
    })

  docs[0].musics = Array.from(snapshotMusic.docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  return docs[0]
}

export const getRandomSong = async (): Promise<any> => {
  const { firestore: db } = useNuxtApp()

  const coll = collection(db, 'releases')
  const snapshot = await getCountFromServer(coll)

  // set a random number with snapshot.data().count as max
  const random = Math.floor(Math.random() * snapshot.data().count)

  // get the release with the random number
  const colRef = query(coll)

  const snapshot2 = await getDocs(colRef)
  const doc = snapshot2.docs[random].data()

  const colMusic = query(collection(db, 'releases', doc.id, 'musics'))
  const snapshotMusic = await getDocs(colMusic)

  const musics = Array.from(snapshotMusic.docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  let randomMusic = Math.floor(Math.random() * musics.length)

  if (musics[randomMusic].name.toLowerCase().includes('inst')) {
    return getRandomSong()
  }

  return musics[randomMusic]
}

// export const fetchReleaseByArtistId = async (idArtist: String) => {
//   const {$firestore} = useNuxtApp();
//
//   const colRelease = query(collection($firestore as any, 'releases'), where('artistsId', '==', idArtist));

//   const snapshotRelease = await getDocs(colRelease);

//   const docs = Array.from(snapshotRelease.docs).map((doc) => {
//     return {
//       ...doc.data()
//     };
//   }).filter((doc) => {return doc.needToBeVerified === false});

//   return docs;
// }

/** ARTIST FUNCTION **/

export const fetchArtistsWithLimit = async (
  startDate: Timestamp,
  limitNumber: number,
) => {
  const { $firestore } = useNuxtApp()

  const colRef = query(
    collection($firestore as any, 'artists'),
    where('createdAt', '<=', startDate),
    orderBy('createdAt', 'desc'),
    limit(limitNumber),
  )

  const snapshot = await getDocs(colRef)

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  return docs
}

export const fetchArtistFullInfoById = async (idArtist: string) => {
  const { $firestore } = useNuxtApp()

  const colArtist = query(
    collection($firestore as any, 'artists'),
    where('id', '==', idArtist),
  )

  const colGroup = query(collection($firestore as any, 'artists', idArtist, 'groups'))

  const colMember = query(collection($firestore as any, 'artists', idArtist, 'members'))

  const colRelease = query(
    collection($firestore as any, 'releases'),
    where('artistsId', '==', idArtist),
  )

  const snapshot = await getDocs(colArtist)

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  docs[0].groups = Array.from((await getDocs(colGroup)).docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  docs[0].members = Array.from((await getDocs(colMember)).docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  docs[0].releases = Array.from((await getDocs(colRelease)).docs)
    .map((doc) => {
      return {
        ...doc.data(),
      }
    })
    .filter((doc) => {
      return doc.needToBeVerified === false
    })
    .sort((a, b) => {
      return b.date - a.date
    })

  return docs[0]
}

export const fetchArtistBasicInfoById = async (idArtist: string) => {
  const { $firestore } = useNuxtApp()

  const colArtist = query(
    collection($firestore as any, 'artists'),
    where('id', '==', idArtist),
  )

  const colGroup = query(collection($firestore as any, 'artists', idArtist, 'groups'))

  const colMember = query(collection($firestore as any, 'artists', idArtist, 'members'))

  const snapshot = await getDocs(colArtist)

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  docs[0].groups = Array.from((await getDocs(colGroup)).docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  docs[0].members = Array.from((await getDocs(colMember)).docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  return docs[0]
}

export const fetchArtistLimitedInfoById = async (idArtist: String) => {
  const { $firestore } = useNuxtApp()

  const colArtist = query(
    collection($firestore as any, 'artists'),
    where('id', '==', idArtist),
  )

  const snapshot = await getDocs(colArtist)

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
    }
  })

  return docs[0]
}

export const updateArtist = async (document: any) => {
  const { $firestore } = useNuxtApp()
  const artistGroups = ref(null)
  const artistMembers = ref(null)

  if (document.groups) {
    artistGroups.value = document.groups
    delete document.groups
  }

  if (document.members) {
    artistMembers.value = document.members
    delete document.members
  }

  if (document.taskId) delete document.taskId
  if (document.createdAt) delete document.createdAt

  document.updatedAt = Timestamp.fromDate(new Date())

  const docRef = doc($firestore as any, 'artists', document.id)
  await updateDoc(docRef, document)

  if (artistGroups.value) {
    const colGroup = collection($firestore as any, 'artists', document.id, 'groups')
    const snapshot = await getDocs(colGroup)
    const docs = Array.from(snapshot.docs).map((doc) => {
      return {
        ...doc.data(),
      }
    })

    docs.forEach(async (docU) => {
      deleteDoc(doc($firestore as any, 'artists', document.id, 'groups', docU.id))

      deleteDoc(doc($firestore as any, 'artists', docU.id, 'members', document.id))
    })

    if (artistGroups.value.length === 0) return

    artistGroups.value?.forEach(async (group: Object) => {
      await setDoc(
        doc($firestore as any, 'artists', document.id, 'groups', group.id),
        group,
      )
      fetchArtistLimitedInfoById(document.id).then((artist) => {
        setDoc(doc($firestore as any, 'artists', group.id, 'members', artist.id), artist)
      })
    })
  }

  if (artistMembers.value) {
    const colMember = collection($firestore as any, 'artists', document.id, 'members')
    const snapshot = await getDocs(colMember)
    const docs = Array.from(snapshot.docs).map((doc) => {
      return {
        ...doc.data(),
      }
    })

    docs.forEach(async (docU) => {
      await deleteDoc(doc($firestore as any, 'artists', document.id, 'members', docU.id))

      await deleteDoc(doc($firestore as any, 'artists', docU.id, 'groups', document.id))
    })

    artistMembers.value?.forEach(async (member: Object) => {
      await setDoc(
        doc($firestore as any, 'artists', document.id, 'members', member.id),
        member,
      )
      fetchArtistLimitedInfoById(document.id).then((artist) => {
        setDoc(doc($firestore as any, 'artists', member.id, 'groups', artist.id), artist)
      })
    })
  }
}

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

export const set = async (col: string, document: Object) => {
  const { $firestore } = useNuxtApp()

  await setDoc(doc($firestore as any, col), document, { merge: true })
}

// export const setWithDoc = async (col: string, docId: string, document: Object) => {
//   const {$firestore} = useNuxtApp();
//
//   await setDoc(doc($firestore as any, col, docId), document, { merge: true });
// };

export const add = async (col: string, document: Object) => {
  const { $firestore } = useNuxtApp()

  const colRef = collection($firestore as any, col)

  const docRef = await addDoc(colRef, document)

  return docRef
}

// export const addWithDoc = async (col: string, docId: string, document: Object) => {
//   const {$firestore} = useNuxtApp();

//
//   const colRef = collection($firestore as any, col, docId);

//   const docRef = await addDoc(colRef, document);

//   return docRef;
// };

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
