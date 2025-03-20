import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const supabaseUrl = config.public.supabaseUrl as string
	const supabaseKey = config.public.supabaseKey as string

	if (!supabaseUrl || !supabaseKey) {
		console.error('Variables Supabase manquantes:', { supabaseUrl, supabaseKey })
		throw new Error('SUPABASE_URL and SUPABASE_KEY are required')
	}

	const supabase = createClient<Database>(supabaseUrl, supabaseKey)

	return {
		provide: {
			supabase,
		},
	}
})
