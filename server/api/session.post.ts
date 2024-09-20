import { defineEventHandler, readBody, setCookie, createError } from 'h3'
import { getAuth } from 'firebase-admin/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const idToken = body.idToken

  if (!idToken) {
    throw createError({ statusCode: 400, statusMessage: 'ID Token is required' })
  }

  try {
    const auth = getAuth()
    const decodedToken = await auth.verifyIdToken(idToken)

    // Stocker le token dans un cookie HTTP-only
    setCookie(event, 'authToken', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 5, // 5 jours
      path: '/',
    })

    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error)
    throw createError({ statusCode: 401, statusMessage: 'Invalid ID Token' })
  }
})
