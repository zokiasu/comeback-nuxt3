<script setup lang="ts">
const router = useRouter()

const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const signUpVersion = ref(false)
const displayLoginWithEmailAndPassword = ref(false)

const signIn = async () => {
  const userCredential: any = await signInWithEAndP(email.value, password.value)
  if (userCredential) {
    router.push('/')
  }
}

const signUp = async () => {
  if (password.value !== passwordConfirm.value) {
    console.error('password not equal')
    return
  }

  const userCredential: any = await signUpWithEAndP(email.value, password.value)
  if (userCredential) {
    router.push('/')
  }
}

const signOut = async () => {
  await signOutApp()
}

useHead({
  title: 'Authentification',
  meta: [
    {
      name: 'description',
      content: 'Authentification',
    },
  ],
})
</script>

<template>
  <div class="flex items-center sm:min-h-[calc(100vh-200px)]">
    <div
      class="relative mx-auto h-fit w-full rounded bg-quaternary p-5 md:w-1/2 lg:w-1/3"
    >
      <h1 class="text-3xl font-bold text-center">Authentification</h1>
      
      <div class="py-5 space-y-3">
        <GoogleSignInButton />
        <MicrosoftSignInButton />
        <button @click="displayLoginWithEmailAndPassword = !displayLoginWithEmailAndPassword" class="text-center w-full hover:underline">
          <p>Login/Signup with Email and Password</p>
        </button>
      </div>
      
      <div v-show="displayLoginWithEmailAndPassword" class="space-y-5">
        <form
          v-if="!signUpVersion"
          @submit.prevent="signIn"
          class="flex flex-col items-center justify-center space-y-5"
        >
          <div class="w-full">
            <ComebackLabel label="Email" />
            <input
              type="email"
              placeholder="Email"
              v-model="email"
              class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
            />
          </div>
          <div class="w-full">
            <ComebackLabel label="Password" />
            <input
              type="password"
              placeholder="Password"
              v-model="password"
              class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            class="w-full rounded bg-quinary py-1 font-semibold uppercase transition-all duration-500 ease-in-out hover:bg-zinc-500"
          >
            Sign In
          </button>
        </form>

        <form
          v-else
          @submit.prevent="signUp"
          class="flex flex-col items-center justify-center space-y-5"
        >
          <div class="w-full">
            <ComebackLabel label="Email" />
            <input
              type="email"
              placeholder="Email"
              v-model="email"
              class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
            />
          </div>
          <div class="w-full">
            <ComebackLabel label="Password" />
            <input
              type="password"
              placeholder="Password"
              v-model="password"
              class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
            />
          </div>
          <div class="w-full">
            <ComebackLabel label="Password Verification" />
            <input
              type="password"
              placeholder="Password Verification"
              v-model="passwordConfirm"
              class="w-full appearance-none border-b bg-transparent transition-all duration-150 ease-in-out focus:rounded focus:bg-tertiary focus:p-1.5 focus:text-secondary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            class="w-full rounded bg-quinary py-1 font-semibold uppercase"
          >
            Sign Up
          </button>
        </form>

        <div class="flex justify-center gap-1">
          <p v-if="!signUpVersion">Don't have an account ?</p>
          <p v-else>Already have an account ?</p>
          <button
            @click="signUpVersion = !signUpVersion"
            class="transition-all duration-300 ease-in-out hover:text-primary"
          >
            <span v-if="!signUpVersion">Sign Up</span>
            <span v-else>Sign In</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
