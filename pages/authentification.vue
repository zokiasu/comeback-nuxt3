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
  <div class="flex items-center sm:min-h-[calc(100vh-160px)]">
    <div class="relative mx-auto h-fit w-full space-y-5 rounded bg-quaternary p-5 md:w-1/2 lg:w-1/3">
      <p class="text-3xl font-bold text-center">Authentification</p>
      <div>
        <GoogleSignInButton />
      </div>
    </div>
  </div>
</template>
