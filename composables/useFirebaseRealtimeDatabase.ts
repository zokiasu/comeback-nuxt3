import { ref, onValue, push, set, get, update, remove, query, orderByChild, equalTo } from 'firebase/database'
import { useToast } from 'vue-toastification'

export function useFirebaseRealtimeDatabase() {
  const { $database: database } = useNuxtApp()
  const toast = useToast()

  // Read data from a specific path in Realtime Database
  const readData = async (path: string) => {
    const dataRef = ref(database as any, path)
    try {
      const snapshot = await get(dataRef)
      if (snapshot.exists()) {
        return snapshot.val()
      } else { 
        return null
      }
    } catch (error) {
      console.error('Error reading data:', error)
      return null
    }
  }

  // Write data to a specific path in Realtime Database
  const writeData = async (path: string, data: any) => {
    const dataRef = ref(database as any, path)
    try {
      await set(dataRef, data)
      // toast.success('Data successfully written!')
    } catch (error) {
      console.error('Error writing data:', error)
      // toast.error('Failed to write data')
    }
  }

  // Update data at a specific path in Realtime Database
  const updateData = async (path: string, data: any) => {
    const dataRef = ref(database as any, path)
    try {
      await update(dataRef, data)
      // toast.success('Data successfully updated!')
    } catch (error) {
      console.error('Error updating data:', error)
      // toast.error('Failed to update data')
    }
  }

  // Delete data from a specific path in Realtime Database
  const deleteData = async (path: string) => {
    const dataRef = ref(database as any, path)
    try {
      await remove(dataRef)
      toast.success('Successfully deleted!')
    } catch (error) {
      console.error('Error deleting data:', error)
      // toast.error('Failed to delete data')
    }
  }

  // Listen for real-time updates at a specific path in Realtime Database
  const listenForUpdates = (path: string, callback: Function) => {
    const dataRef = ref(database as any, path)
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val()
      callback(data)
    })
  }

  // Query data with a specific condition
  const queryData = async (path: string, child: string, value: any) => {
    const dataRef = query(ref(database as any, path), orderByChild(child), equalTo(value))
    try {
      const snapshot = await get(dataRef)
      if (snapshot.exists()) {
        return snapshot.val()
      } else {
        return null
      }
    } catch (error) {
      console.error('Error querying data:', error)
      return null
    }
  }

  // Write data to a random ID generated by push()
  const writeDataWithRandomId = async (path: string, data: any) => {
    const dataRef = ref(database as any, path)
    const newRef = push(dataRef) // Generate a new reference with a unique ID
    try {
      await set(newRef, data)
      // toast.success('Data successfully written with random ID!')
      return newRef.key // Return the generated ID
    } catch (error) {
      console.error('Error writing data:', error)
      // toast.error('Failed to write data')
      return null
    }
  }

  return {
    writeDataWithRandomId,
    readData,
    writeData,
    updateData,
    deleteData,
    listenForUpdates,
    queryData
  }
}
