import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler((event) => {
  deleteCookie(event, 'authToken', { path: '/' })
  return { success: true }
})
