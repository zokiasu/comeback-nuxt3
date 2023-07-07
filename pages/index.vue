<template>
  <div>
    Hello World {{ user }}
    <button @click="signIn" class="p-2">Sign In</button>
    <button @click="signOut" class="p-2">Sign Out</button>
    <button @click="signUp" class="p-2">Sign Up</button>
  </div>
</template>

<script setup>
const user = useCurrentUser();
const signIn = async () => {
  const context = await signInWithEAndP('zokiasu@gmail.com', 'salimonou')
  console.log(context)
}
const signUp = async () => {
  const context = await signUpWithEAndP('pierrick.tly@gmail.com', 'salimonou')
  console.log(context)
}
const signOut = async () => {
  const context = await signOutApp()
  console.log(context)
}

onMounted(async () => {
  // const releases = await queryByCollection('releases');
  // console.log(releases)
})
</script>