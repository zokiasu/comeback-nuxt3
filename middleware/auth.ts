import { useCurrentUser } from 'vuefire';
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await useCurrentUser();
  
  // redirect the user to the login page
  if (!user.value) {
    return navigateTo({
      path: '/authentification',
      query: {
        redirect: to.fullPath,
      },
    })
  }
})
