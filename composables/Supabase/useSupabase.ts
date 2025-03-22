import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

export const useSupabase = () => {
	const { $supabase } = useNuxtApp()
	return {
		supabase: $supabase as SupabaseClient<Database>,
	}
}
