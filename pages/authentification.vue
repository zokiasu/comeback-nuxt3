<script setup lang="ts">
import { UserCredential } from '@firebase/auth';
const router = useRouter();

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const signUpVersion = ref(false);

const signIn = async () => {
  const userCredential: UserCredential | null = await signInWithEAndP(email.value, password.value)
  if(userCredential) {
    router.push('/');
  }
}

const signUp = async () => {
  if (password.value !== passwordConfirm.value) {
    console.log('password not equal')
    return
  }

  const userCredential: UserCredential | null = await signUpWithEAndP(email.value, password.value)
  if (userCredential) {
    router.push('/');
  }
}

const signOut = async () => {
  await signOutApp()
}

useHead({
  title: 'Authentification',
  meta: [{
    name: 'description',
    content: 'Authentification'
  }]
})
</script>

<template>
  <div class="min-h-screen sm:min-h-[calc(100vh-60px)] flex items-center p-5">
    <div class="space-y-5 mx-auto rounded p-5 h-fit bg-quaternary w-full md:w-1/2 lg:w-1/3">
      <div>
        <img src="~/assets/image/logo.png" alt="Comeback" class="block mx-auto h-20" />
        <p class="font-bold text-center">Authentification</p>
      </div>
      <form 
        v-if="!signUpVersion"
        @submit.prevent="signIn"
        class="flex flex-col justify-center items-center space-y-5"
      >
        <div class="w-full">
          <CbLabel label="Email" />
          <input 
            type="email" 
            placeholder="Email" 
            v-model="email" 
            class="bg-transparent w-full border-b appearance-none transition-all ease-in-out duration-150 focus:p-1.5 focus:outline-none focus:bg-tertiary focus:text-secondary focus:rounded"
          />
        </div>
        <div class="w-full">
          <CbLabel label="Password" />
          <input 
            type="password" 
            placeholder="Password" 
            v-model="password" 
            class="bg-transparent w-full border-b appearance-none transition-all ease-in-out duration-150 focus:p-1.5 focus:outline-none focus:bg-tertiary focus:text-secondary focus:rounded"
          />
        </div>
        <button type="submit" class="bg-quinary py-1 uppercase font-semibold w-full rounded transition-all ease-in-out duration-500 hover:bg-zinc-500">Sign In</button>
      </form>
      
      <form
        v-else
        @submit.prevent="signUp"
        class="flex flex-col justify-center items-center space-y-5"
      >
        <div class="w-full">
          <CbLabel label="Email" />
          <input 
            type="email" 
            placeholder="Email" 
            v-model="email" 
            class="bg-transparent w-full border-b appearance-none transition-all ease-in-out duration-150 focus:p-1.5 focus:outline-none focus:bg-tertiary focus:text-secondary focus:rounded"
          />
        </div>
        <div class="w-full">
          <CbLabel label="Password" />
          <input 
            type="password" 
            placeholder="Password" 
            v-model="password" 
            class="bg-transparent w-full border-b appearance-none transition-all ease-in-out duration-150 focus:p-1.5 focus:outline-none focus:bg-tertiary focus:text-secondary focus:rounded"
          />
        </div>
        <div class="w-full">
          <CbLabel label="Password Verification" />
          <input 
            type="password" 
            placeholder="Password Verification" 
            v-model="passwordConfirm" 
            class="bg-transparent w-full border-b appearance-none transition-all ease-in-out duration-150 focus:p-1.5 focus:outline-none focus:bg-tertiary focus:text-secondary focus:rounded"
          />
        </div>
        <button type="submit" class="bg-quinary py-1 uppercase font-semibold w-full rounded">Sign Up</button>
      </form>

      <div class="flex justify-center gap-1">
        <p v-if="!signUpVersion">Don't have an account ?</p>
        <p v-else>Already have an account ?</p>
        <button @click="signUpVersion = !signUpVersion" class="hover:text-primary transition-all ease-in-out duration-300">
          <span v-if="!signUpVersion">Sign Up</span>
          <span v-else>Sign In</span>
        </button>
      </div>
    </div>
  </div>
</template>