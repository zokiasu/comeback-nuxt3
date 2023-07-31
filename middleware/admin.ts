import { useCurrentUser } from 'vuefire';
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await useCurrentUser();
  const { isAdmin } = useUser();
  
  // redirect the user to the login page
  if (!user.value && !isAdmin.value) {
    return navigateTo({
      path: '/authentification',
      query: {
        redirect: to.fullPath,
      },
    })
  }
})
