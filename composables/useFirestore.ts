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
  limit
} from "firebase/firestore";

/** NEWS FUNCTION **/

export const fetchNews = async (startDate: Timestamp, limitNumber: Number) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = query(collection($firestore, 'news'), where('date', '>=', startDate), orderBy('date', 'asc'), limit(limitNumber));
  
  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  return docs;
}

/** RELEASES FUNCTION **/

export const fetchReleasesWithDateAndLimit = async (startDate: Timestamp, limitNumber: Number) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = query(collection($firestore, 'releases'), where('date', '>=', startDate), orderBy('date', 'desc'), limit(limitNumber));
  
  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data()
    };
  }).filter((doc) => {return doc.needToBeVerified === false});

  return docs;
}

export const fetchReleasesByMonth = async (startDate: Timestamp, endDate: Timestamp) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = query(collection($firestore, 'releases'), where('date', '>=', startDate), where('date', '<=', endDate), orderBy('date', 'desc'));
  
  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data()
    };
  }).filter((doc) => {return doc.needToBeVerified === false});

  return docs;
}

export const fetchReleaseById = async (idRelease: String) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRelease = query(collection($firestore, 'releases'), where('id', '==', idRelease));
  // @ts-ignore
  const colMusic = query(collection($firestore, 'releases', idRelease, 'musics'));
  
  const snapshotRelease = await getDocs(colRelease);
  const snapshotMusic = await getDocs(colMusic);

  const docs = Array.from(snapshotRelease.docs).map((doc) => {
    return {
      ...doc.data()
    };
  }).filter((doc) => {return doc.needToBeVerified === false});

  docs[0].musics = Array.from(snapshotMusic.docs).map((doc) => {
    return {
      ...doc.data()
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
      ...doc.data()
    };
  }).filter((doc) => {return doc.needToBeVerified === false});

  return docs;
}

/** ARTIST FUNCTION **/

export const fetchArtistsWithLimit = async (startDate: Timestamp, limitNumber: Number) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = query(collection($firestore, 'artists'), where('createdAt', '<=', startDate), orderBy('createdAt', 'desc'), limit(limitNumber));
  
  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data()
    };
  })

  return docs;
}

export const fetchArtistFullInfoById = async (idArtist: String) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colArtist = query(collection($firestore, 'artists'), where('id', '==', idArtist));
  // @ts-ignore
  const colGroup = query(collection($firestore, 'artists', idArtist, 'groups'));
  // @ts-ignore
  const colMember = query(collection($firestore, 'artists', idArtist, 'members'));
  // @ts-ignore
  const colRelease = query(collection($firestore, 'releases'), where('artistsId', '==', idArtist));
  // @ts-ignore
  const colNews = query(collection($firestore, 'news'), where('artist.id', '==', idArtist));
  
  const snapshot = await getDocs(colArtist);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  // @ts-ignore
  docs[0].groups = Array.from((await getDocs(colGroup)).docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  // @ts-ignore
  docs[0].members = Array.from((await getDocs(colMember)).docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  // @ts-ignore
  docs[0].releases = Array.from((await getDocs(colRelease)).docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  // @ts-ignore
  docs[0].news = Array.from((await getDocs(colNews)).docs).map((doc) => {
    return {
      ...doc.data()
    };
  });


  return docs[0];
}

export const fetchArtistBasicInfoById = async (idArtist: String) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colArtist = query(collection($firestore, 'artists'), where('id', '==', idArtist));
  // @ts-ignore
  const colGroup = query(collection($firestore, 'artists', idArtist, 'groups'));
  // @ts-ignore
  const colMember = query(collection($firestore, 'artists', idArtist, 'members'));
  
  const snapshot = await getDocs(colArtist);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  // @ts-ignore
  docs[0].groups = Array.from((await getDocs(colGroup)).docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  // @ts-ignore
  docs[0].members = Array.from((await getDocs(colMember)).docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  return docs[0];
}

export const fetchArtistLimitedInfoById = async (idArtist: String) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colArtist = query(collection($firestore, 'artists'), where('id', '==', idArtist));
  
  const snapshot = await getDocs(colArtist);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data()
    };
  });

  return docs[0];
}

export const updateArtist = async (id: string, document:any) => {
  const {$firestore} = useNuxtApp();
  const artistGroups = ref(null);
  const artistMembers = ref(null);

  if(document.groups) {
    artistGroups.value = document.groups;
    delete document.groups;
  }

  if(document.members) {
    artistMembers.value = document.members;
    delete document.members;
  }

  if(document.taskId) delete document.taskId;
  if(document.createdAt) delete document.createdAt;

  document.updatedAt = Timestamp.fromDate(new Date());

  // @ts-ignore
  const docRef = doc($firestore, 'artists', document.id);
  await updateDoc(docRef, document);

  if(artistGroups.value) {
    // @ts-ignore
    const colGroup = collection($firestore, 'artists', document.id, 'groups');
    const snapshot = await getDocs(colGroup);
    const docs = Array.from(snapshot.docs).map((doc) => {
      return {
        ...doc.data()
      };
    });

    docs.forEach(async (docU) => {
      // @ts-ignore
      deleteDoc(doc($firestore, 'artists', document.id, 'groups', docU.id));
      // @ts-ignore
      deleteDoc(doc($firestore, 'artists', docU.id, 'members', document.id));
    });

    artistGroups.value?.forEach(async (group : Object) => {
      // @ts-ignore
      await setDoc(doc($firestore, 'artists', document.id, 'groups', group.id), group);
      fetchArtistLimitedInfoById(document.id).then((artist) => {
        // @ts-ignore
        setDoc(doc($firestore, 'artists', group.id, 'members', artist.id), artist);
      });
    });
  }

  if(artistMembers.value) {
    // @ts-ignore
    const colMember = collection($firestore, 'artists', document.id, 'members');
    const snapshot = await getDocs(colMember);
    const docs = Array.from(snapshot.docs).map((doc) => {
      return {
        ...doc.data()
      };
    });

    docs.forEach(async (docU) => {
      // @ts-ignore
      await deleteDoc(doc($firestore, 'artists', document.id, 'members', docU.id));
      // @ts-ignore
      await deleteDoc(doc($firestore, 'artists', docU.id, 'groups', document.id));
    });

    artistMembers.value?.forEach(async (member : Object) => {
      // @ts-ignore
      await setDoc(doc($firestore, 'artists', document.id, 'members', member.id), member);
      fetchArtistLimitedInfoById(document.id).then((artist) => {
        // @ts-ignore
        setDoc(doc($firestore, 'artists', member.id, 'groups', artist.id), artist);
      });
    });
  }
};

/** GENERAL FUNCTION **/

export const queryByCollection = async (col: string) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = collection($firestore, col);

  const snapshot = await getDocs(colRef);

  const docs = Array.from(snapshot.docs).map((doc) => {
    return {
      ...doc.data(),
      taskId: doc.id
    };
  });

  return docs;
};

export const queryByDoc = async (col: string, id: string) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const colRef = doc($firestore, col, id);

  const snapshot = await getDoc(colRef);

  const docs = snapshot.data();

  return docs;
};

export const set = async (col: string, document: Object) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  await setDoc(doc($firestore, col), document, { merge: true });
};

export const setWithDoc = async (col: string, docId: string, document: Object) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  await setDoc(doc($firestore, col, docId), document, { merge: true });
};

export const add = async (col: string, document: Object) => {
  const {$firestore} = useNuxtApp();

  // @ts-ignore
  const colRef = collection($firestore, col);

  const docRef = await addDoc(colRef, document);

  return docRef;
};

export const addWithDoc = async (col: string, docId: string, document: Object) => {
  const {$firestore} = useNuxtApp();

  // @ts-ignore
  const colRef = collection($firestore, col, docId);

  const docRef = await addDoc(colRef, document);

  return docRef;
};

export const update = async (col: string, id: string, document:any) => {
  const {$firestore} = useNuxtApp();

  const docRef = doc($firestore, col, id);

  await updateDoc(docRef, document);

  return docRef;

};

export const deletebyDoc = async (col : string, id : string) => {
  const {$firestore} = useNuxtApp();
  // @ts-ignore
  const docRef = doc($firestore, col, id);
  
  await deleteDoc(docRef).then(() => {
  }).catch((error) => {
    console.error('deletebyDoc : Error removing document: ', error);
  })
};