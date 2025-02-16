import { type Firestore } from 'firebase/firestore'

declare module '#app' {
  interface NuxtApp {
    $firestore: Firestore
  }
}
