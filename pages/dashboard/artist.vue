<script setup>
  import { collection, getDocs, query, where, startAfter, orderBy, limit, getCountFromServer } from 'firebase/firestore'
  import { useToast } from 'vue-toastification'

  const toast = useToast()
  const { $firestore: db } = useNuxtApp()

  const artistFetch = ref([])
  const search = ref('')
  const invertSort = ref(true)
  const page = ref(1)

  const scrollContainer = ref(null)
  const sort = ref('createdAt')
  const limitFetch = ref(50)
  const typeFilter = ref('')
  const onlyWithoutDesc = ref(false)
  const onlyWithoutSocials = ref(false)
  const onlyWithoutPlatforms = ref(false)
  const isLoading = ref(false)
  const nextFetch = ref(null)
  const maxArtist = ref(0)

  const deleteArtist = async (id) => {
    const artist = artistFetch.value.find((artist) => artist.id === id)
    if (artist) {
      const index = artistFetch.value.indexOf(artist)
      await deletebyDoc('artists', id)
        .then(() => {
          console.log('Document successfully deleted!')
          artistFetch.value.splice(index, 1)
          toast.success('Artist Deleted')
        })
        .catch((error) => {
          console.error('Error removing document: ', error)
          toast.error('Error Removing Artist')
        })
    } else {
      toast.error('Release Not Found', {
        position: 'top-right',
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: 'button',
        icon: true,
        rtl: false,
        transition: 'Vue-Toastification__bounce',
        maxToasts: 5,
        newestOnTop: true,
      })
    }
  }

  const getMaxArtistNumber = async () => {
    const coll = collection(db, "artists");
    const snapshot = await getCountFromServer(coll);
    console.log('count: ', snapshot.data().count);
    maxArtist.value = snapshot.data().count;
  }

  const getArtist = async (firstCall = false) => {
    if (isLoading.value) return; // Empêche le démarrage d'un nouveau chargement si un est déjà en cours
    isLoading.value = true; // Verrouille le chargement

    console.log('firstCall', firstCall, 'nextFetch', nextFetch.value, 'artistFetch', artistFetch.value, 'maxArtist', maxArtist.value)

    if(maxArtist.value === 0) {
      await getMaxArtistNumber();
    }

    let colRef = query(collection(db, 'artists'), orderBy(sort.value, 'desc'));

    if(onlyWithoutDesc.value) {
      colRef = query(colRef, where('description', '==', ''));
    }
    else if (onlyWithoutSocials.value) {
      colRef = query(colRef, where('socialList', '==', []));
    }
    else if (onlyWithoutPlatforms.value) {
      colRef = query(colRef, where('platformList', '==', []));
    }

    if(typeFilter.value != '') {
      colRef = query(colRef, where('type', '==', typeFilter.value));
    }

    colRef = query(colRef, limit(limitFetch.value));

    try {
      if(nextFetch.value != null && !firstCall) {
        colRef = nextFetch.value;
      }

      const snapshot = await getDocs(colRef);

      const lastVisible = snapshot.docs[snapshot.docs.length-1];

      nextFetch.value = query(collection(db, 'artists'), orderBy(sort.value, 'desc'), startAfter(lastVisible), limit(limitFetch.value));

      if (nextFetch.value != null && !firstCall) {
        const newArtists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filtrer les nouveaux artistes qui ont déjà un ID présent dans artistFetch
        const filteredNewArtists = newArtists.filter(newArtist => !artistFetch.value.some(artist => artist.id === newArtist.id));

        // Concaténer la liste filtrée
        artistFetch.value = [...artistFetch.value, ...filteredNewArtists];
      } else {
        artistFetch.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }

      console.log('artistFetch', artistFetch.value)
    } catch (error) {
      console.error("Erreur lors du chargement des artistes :", error);
    } finally {
      isLoading.value = false; // Déverrouille le chargement une fois terminé
    }
  }

  const changeOnlyFilter = (filter) => {
    console.log('changeOnlyFilter', filter)

    if(filter === 'desc') {
      onlyWithoutDesc.value = !onlyWithoutDesc.value;
      onlyWithoutSocials.value = false;
      onlyWithoutPlatforms.value = false;
    }
    if(filter === 'socials') {
      onlyWithoutSocials.value = !onlyWithoutSocials.value;
      onlyWithoutDesc.value = false;
      onlyWithoutPlatforms.value = false;

    }
    if(filter === 'platforms') {
      onlyWithoutPlatforms.value = !onlyWithoutPlatforms.value;
      onlyWithoutDesc.value = false;
      onlyWithoutSocials.value = false;
    }
  }

  const handleScroll = () => {
    console.log('handleScroll')
    const container = scrollContainer.value;
    if (!container) return;

    const scrollPosition = container.scrollTop + container.clientHeight;
    const threshold = container.scrollHeight * 0.98;
    
    if (scrollPosition > threshold && !isLoading.value) {
      getArtist(); // Charge plus d'artistes
    }
  };

  const filteredArtistList = computed(() => {
    if (page != 1) page.value = 1
    if (!artistFetch.value) return artistFetch.value
    if (!search.value) {
      return artistFetch.value
        .sort((a, b) => {
          if (sort.value === 'createdAt') {
            if (!invertSort.value) return a.createdAt - b.createdAt
            return b.createdAt - a.createdAt
          }
          if (sort.value === 'type') {
            if (!invertSort.value) return a.type.localeCompare(b.type)
            return b.type.localeCompare(a.type)
          }
          if (sort.value === 'name') {
            if (!invertSort.value) return a.name.localeCompare(b.name)
            return b.name.localeCompare(a.name)
          }
        })
    } else {
      return artistFetch.value
        .sort((a, b) => {
          if (sort.value === 'createdAt') {
            if (!invertSort.value) return a.createdAt - b.createdAt
            return b.createdAt - a.createdAt
          }
          if (sort.value === 'type') {
            if (!invertSort.value) return a.type.localeCompare(b.type)
            return b.type.localeCompare(a.type)
          }
          if (sort.value === 'name') {
            if (!invertSort.value) return a.name.localeCompare(b.name)
            return b.name.localeCompare(a.name)
          }
        })
        .filter((artist) => {
          return artist.name.toLowerCase().includes(search.value.toLowerCase())
        })
    }
  })

  onMounted(async () => {
    await getArtist();
    if(scrollContainer.value) {
      console.log('Attaching scroll event listener to:', scrollContainer.value);
      // scrollContainer.value.addEventListener('scroll', handleScroll);
    }
  });

  onUnmounted(() => {
    if (scrollContainer.value) {
      // Retirez l'écouteur d'événements lors du démontage du composant
      // scrollContainer.value.removeEventListener('scroll', handleScroll);
    }
  });
  
  watch([limitFetch, typeFilter, onlyWithoutDesc, onlyWithoutSocials, onlyWithoutPlatforms, sort], async () => {
    try {
      console.log('fetch', limitFetch.value, typeFilter.value, onlyWithoutDesc.value, onlyWithoutSocials.value, onlyWithoutPlatforms.value, sort.value)
      await getArtist(true);
    } catch (error) {
      console.error('Error in watcher:', error);
    }
  })
</script>

<template>
  <div ref="scrollContainer" class="relative space-y-3 h-full overflow-y-scroll scrollBarLight pr-2">

    <section id="searchbar" class="sticky top-0 w-full space-y-2 bg-secondary pb-2 z-20">
      <input
        id="search-input"
        v-model="search"
        type="text"
        placeholder="Search"
        class="w-full rounded border-none bg-quinary px-5 py-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out focus:bg-tertiary focus:text-quinary focus:placeholder-quinary focus:outline-none"
      />
      <div class="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
        <div class="flex flex-wrap sm:flex-nowrap w-fit justify-between gap-2">
          <div class="flex flex-row items-center justify-between sm:justify-start gap-2 w-full sm:w-fit rounded bg-quinary px-2 py-1 text-xs uppercase">
            <p class="sm:text-nowrap">Fetch Number</p>
            <select
              v-model="limitFetch"
              class="rounded border-none bg-quinary p-2 text-xs uppercase placeholder-tertiary transition-all duration-300 ease-in-out focus:outline-none sm:w-fit">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
            </select>
          </div>
          <button 
            @click="changeOnlyFilter('desc')" 
            class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500"
            :class="onlyWithoutDesc ? 'bg-primary' : 'bg-quinary'"
          >
            No description
          </button>
          <button 
            @click="changeOnlyFilter('socials')" 
            class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500"
            :class="onlyWithoutSocials ? 'bg-primary' : 'bg-quinary'"
          >
            No Socials
          </button>
          <button 
            @click="changeOnlyFilter('platforms')" 
            class="w-full rounded px-2 py-1 text-xs uppercase hover:bg-zinc-500"
            :class="onlyWithoutPlatforms ? 'bg-primary' : 'bg-quinary'"
          >
            No Platforms
          </button>
        </div>
        <div class="flex space-x-2">
          <select
            v-model="sort"
            class="w-full rounded border-none bg-quinary p-2 text-xs uppercase placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none sm:w-fit"
          >
            <option value="name">Name</option>
            <option value="type">Type</option>
            <option value="createdAt">Last Created</option>
          </select>
          <button
            @click="invertSort = !invertSort"
            class="rounded border-none bg-quinary p-2 placeholder-tertiary drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-tertiary hover:text-quinary focus:outline-none"
          >
            <icon-sort v-if="!invertSort" class="h-6 w-6 text-tertiary" />
            <icon-sort-reverse v-else class="h-6 w-6 text-tertiary" />
          </button>
        </div>
      </div>
    </section>

    <transition-group
      v-if="filteredArtistList.length > 0"
      id="artist-list"
      name="list-complete"
      tag="div"
      class="grid grid-cols-1 items-center justify-center gap-2 transition-all duration-300 ease-in-out md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      <LazyCardDashboardArtist
        v-for="artist in filteredArtistList"
        :key="artist.id"
        :id="artist.id"
        :image="artist.image"
        :name="artist.name"
        :description="artist.description"
        :type="artist.type"
        :idYoutubeMusic="artist.idYoutubeMusic"
        :styles="artist.styles"
        :socialList="artist.socialList"
        :platformList="artist.platformList"
        :createdAt="artist.createdAt"
        @deleteArtist="deleteArtist"
      />
    </transition-group>

    <p v-else class="w-full bg-quaternary p-5 text-center font-semibold uppercase">
      No artist found
    </p>

    <div class="flex flex-col items-center space-y-2 text-xs">
      <button @click="getArtist()" class="w-full md:w-fit bg-quinary mx-auto rounded px-2 py-1 uppercase hover:bg-zinc-500">
        <p v-if="!isLoading">Load More</p><p v-else>Loading...</p> ({{ artistFetch.length }} / {{ maxArtist }})
      </button>
      <button @click="limitFetch = maxArtist" class="mx-auto underline underline-offset-4">
        <p>Load All</p>
      </button>
    </div>
  </div>
</template>
