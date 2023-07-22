<script setup lang="ts">
import { UserCredential } from '@firebase/auth';

const { firebaseUser } = useUser();
const router = useRouter();

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const signIn = async () => {
  const userCredential: UserCredential | null = await signInWithEAndP(email.value, password.value)
  if (userCredential) router.push('/');
}

const signUp = async () => {
  if (password.value !== passwordConfirm.value) {
    console.log('password not equal')
    return
  }

  const userCredential: UserCredential | null = await signUpWithEAndP(email.value, password.value)
  if (userCredential) router.push('/');
}

const signOut = async () => {
  await signOutApp()
}
</script>

<template>
  <div>
    <p>Authentification</p>
    <!-- build a form with email et password call sign in to sign user-->
    <form @submit.prevent="signIn">
      <input type="email" v-model="email" />
      <input type="password" v-model="password" />
      <button type="submit">Sign In</button>
    </form>
    <!-- build a form with email et password et une vérification de mot de passe call sign up to sign user-->
    <form @submit.prevent="signUp">
      <input type="email" v-model="email" />
      <input type="password" v-model="password" />
      <input type="password" v-model="passwordConfirm" />
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>