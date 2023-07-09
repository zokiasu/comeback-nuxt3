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
</script>

<template>
  <div>
    <div class="container mx-auto p-5 min-h-screen md:min-h-fit">
      <div
        class="overflow-hidden rounded-lg grid gap-5 grid-cols-1 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-4 md:grid-rows-4">
        <ComebackReported class="rounded-lg md:row-span-3 md:col-span-2 2xl:col-span-1" />
        <div class="bg-yellow-500 text-center rounded-lg h-40 sm:h-full sm:row-span-3 md:col-span-2 lg:col-span-3">A
        </div>
        <div class="bg-zinc-500 text-center rounded-lg h-40 md:col-span-4 lg:col-span-5 2xl:col-span-4">A</div>
      </div>
    </div>
  </div>
</template>