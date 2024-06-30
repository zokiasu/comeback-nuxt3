<script setup lang="ts">
import { type Release } from '@/types/release';
import { Timestamp } from 'firebase/firestore';
import VueDatePicker from "@vuepic/vue-datepicker";

const { id, name, type, idYoutubeMusic, date, yearReleased, needToBeVerified,  artistsName, platformList } = defineProps<{
  id: string;
  name: string;
  type: string;
  idYoutubeMusic: string;
  date: object;
  yearReleased: number;
  needToBeVerified: boolean;
  artistsName: string;
  platformList: Array<{ name: string; link: string }>;
}>();

const emit = defineEmits(["verifiedRelease"]);

const dateToChange = ref(null);
const { updateRelease } = useFirebaseFunction();

const releaseToUpdate = reactive<Release>({} as Release);
releaseToUpdate.platformList = platformList;

const releaseDate = computed(() => {
  let dateComputed = new Date();
  if (date) {
    //@ts-ignore
    dateComputed = new Date(date.seconds * 1000);
    return `${dateComputed.getDate()}-${dateComputed.getMonth() + 1}-${dateComputed.getFullYear()}`;
  } else {
    return "No Date";
  }
});

const validVerifiedRelease = async () => {
  if (dateToChange.value) {
    const dateToTimestamp = new Timestamp(dateToChange.value / 1000, 0);
    if (dateToTimestamp.toDate().getFullYear() !== yearReleased) {
      // console.log('Date and Year Released are not the same');
      return;
    } else {
      releaseToUpdate.needToBeVerified = false;
    }
  }

  for (const key in releaseToUpdate) {
    //@ts-ignore
    if (releaseToUpdate[key] === '') {
      //@ts-ignore
      delete releaseToUpdate[key];
    }
  }

  await updateRelease(id, releaseToUpdate).then((res) => {
    if (res == 'success') {
      emit('verifiedRelease');
    }
    else {
      console.log('Error updating release');
    }
  });
};

watchEffect(() => {
  if (dateToChange.value) {
    const dateToTimestamp = new Timestamp(dateToChange.value / 1000, 0);
    releaseToUpdate.date = dateToTimestamp;
  }
});
</script>

<template>
  <div class="p-3 space-y-5">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div>
        <ComebackInput label="Artist Name" :placeholder="artistsName" disabled />
      </div>
      <div>
        <ComebackInput label="Release Name" :placeholder="name" />
      </div>
      <div class="space-y-2">
        <p class="font-semibold uppercase text-sm">DATE ({{ releaseDate }})</p>
        <VueDatePicker v-model="dateToChange" auto-apply :enable-time-picker="false" />
      </div>
      <div>
        <ComebackInput
          label="YEAR"
          :placeholder="String(yearReleased)"
          v-model="releaseToUpdate.year"
        />
      </div>
    </div>

    <!-- Platforms -->
    <div class="w-full space-y-2">
      <ComebackLabel label="Platforms" />
      <div
        v-for="(platform, index) in releaseToUpdate.platformList"
        :key="platform"
        class="flex w-full gap-1"
      >
        <div class="w-full space-y-3 rounded bg-quinary p-2 text-xs">
          <input
            type="text"
            :value="platform.name"
            placeholder="Platform's Name"
            @input="releaseToUpdate.platformList[index].name = $event.target.value"
            class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
          />
          <input
            type="text"
            :value="platform.link"
            placeholder="Platform's Link"
            @input="releaseToUpdate.platformList[index].link = $event.target.value"
            class="w-full appearance-none border-b bg-transparent outline-none transition-all duration-150 ease-in-out"
          />
        </div>
        <button
          class="rounded bg-primary p-5 text-xs hover:bg-red-900"
          @click="
            releaseToUpdate.platformList.splice(
              releaseToUpdate.platformList.indexOf(platform),
              1
            )
          "
        >
          Delete
        </button>
      </div>
      <button
        class="w-full rounded bg-primary p-2 text-xs font-semibold uppercase hover:bg-red-900"
        @click="releaseToUpdate.platformList.push({ name: '', link: '' })"
      >
        Add Platforms
      </button>
    </div>

    <button
      @click="validVerifiedRelease"
      class="w-full rounded bg-quinary px-2 py-1 uppercase hover:bg-zinc-500"
    >
      Validate
    </button>
  </div>
</template>
