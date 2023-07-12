import {
  collection,
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
  limit
} from "firebase/firestore";

export const queryByCollection = async (col: string) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = collection($firestore, col);

  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  return docs;
};

export const fetchNews = async (startDate: Timestamp, limitNumber: Number) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = query(collection($firestore, 'news'), where('date', '>=', startDate), orderBy('date', 'asc'), limit(limitNumber));
  
  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  return docs;
}

export const fetchReleases = async (startDate: Timestamp, limitNumber: Number) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = query(collection($firestore, 'releases'), where('date', '>=', startDate), orderBy('date', 'desc'), limit(limitNumber));
  
  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  return docs;
}

export const fetchReleasesByMonth = async (startDate: Timestamp, endDate: Timestamp) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = query(collection($firestore, 'releases'), where('date', '>=', startDate), where('date', '<=', endDate), orderBy('date', 'desc'));
  
  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  return docs;
}

export const fetchReleaseById = async (idRelease: String) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRelease = query(collection($firestore, 'releases'), where('id', '==', idRelease));
  const colMusic = query(collection($firestore, 'releases', idRelease, 'musics'));
  
  const snapshotRelease = await getDocs(colRelease);
  const snapshotMusic = await getDocs(colMusic);

  const docs = Array.from(snapshotRelease.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  docs[0].musics = Array.from(snapshotMusic.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  return docs[0];
}

export const fetchReleaseByArtistId = async (idArtist: String) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRelease = query(collection($firestore, 'releases'), where('artistsId', '==', idArtist));
  
  const snapshotRelease = await getDocs(colRelease);

  const docs = Array.from(snapshotRelease.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  return docs;
}

export const fetchArtists = async () => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = query(collection($firestore, 'artists'), orderBy('name', 'asc'));
  
  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  return docs;
}

export const fetchArtistsWithLimit = async (startDate: Timestamp, limitNumber: Number) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = query(collection($firestore, 'artists'), where('createdAt', '<=', startDate), orderBy('createdAt', 'desc'), limit(limitNumber));
  
  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  return docs;
}

export const fetchArtistInfoById = async (idArtist: String) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colArtist = query(collection($firestore, 'artists'), where('id', '==', idArtist));
  // @ts-ignore
  const colGroup = query(collection($firestore, 'artists', idArtist, 'groups'));
  // @ts-ignore
  const colMember = query(collection($firestore, 'artists', idArtist, 'members'));
  // @ts-ignore
  const colRelease = query(collection($firestore, 'releases'), where('artistsId', '==', idArtist));
  
  const snapshot = await getDocs(colArtist);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  // @ts-ignore
  docs[0].groups = Array.from((await getDocs(colGroup)).docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  // @ts-ignore
  docs[0].members = Array.from((await getDocs(colMember)).docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  // @ts-ignore
  docs[0].releases = Array.from((await getDocs(colRelease)).docs).map((doc) => {
    return {
      ...doc.data(),
      taskID : doc.id
    };
  });

  return docs[0];
}

export const set = async (col: string, document: Object) => {
  const {$firestore} = useNuxtApp();

  await setDoc(doc(collection($firestore, col)), document, { merge: true });
};

export const add = async (col: string, document: Object) => {
  const {$firestore} = useNuxtApp();

  // @ts-ignore
  const colRef = collection($firestore, col);

  const docRef = await addDoc(colRef, document);

  return docRef;
};

export const update = async (col: string, id: string, document:any) => {
  const {$firestore} = useNuxtApp();

  const docRef = doc($firestore, col, id);

  await updateDoc(docRef, document);

  return docRef;

};

export const deleteByCollection = async (col : string, id : string) => {
  const {$firestore} = useNuxtApp();

  const docRef = doc($firestore, col, id);
  return await deleteDoc(docRef);
};