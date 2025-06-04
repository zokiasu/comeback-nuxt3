export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	public: {
		Tables: {
			algolia_config: {
				Row: {
					setting_name: string
					setting_value: string
				}
				Insert: {
					setting_name: string
					setting_value: string
				}
				Update: {
					setting_name?: string
					setting_value?: string
				}
				Relationships: []
			}
			artist_platform_links: {
				Row: {
					artist_id: string | null
					created_at: string | null
					id: string
					link: string
					name: string
				}
				Insert: {
					artist_id?: string | null
					created_at?: string | null
					id?: string
					link: string
					name: string
				}
				Update: {
					artist_id?: string | null
					created_at?: string | null
					id?: string
					link?: string
					name?: string
				}
				Relationships: [
					{
						foreignKeyName: "artist_platform_links_artist_id_fkey"
						columns: ["artist_id"]
						isOneToOne: false
						referencedRelation: "artists"
						referencedColumns: ["id"]
					},
				]
			}
			artist_relations: {
				Row: {
					created_at: string | null
					group_id: string
					member_id: string
					relation_type: Database["public"]["Enums"]["relation_type"] | null
				}
				Insert: {
					created_at?: string | null
					group_id: string
					member_id: string
					relation_type?: Database["public"]["Enums"]["relation_type"] | null
				}
				Update: {
					created_at?: string | null
					group_id?: string
					member_id?: string
					relation_type?: Database["public"]["Enums"]["relation_type"] | null
				}
				Relationships: [
					{
						foreignKeyName: "artist_relations_group_id_fkey"
						columns: ["group_id"]
						isOneToOne: false
						referencedRelation: "artists"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "artist_relations_member_id_fkey"
						columns: ["member_id"]
						isOneToOne: false
						referencedRelation: "artists"
						referencedColumns: ["id"]
					},
				]
			}
			artist_releases: {
				Row: {
					artist_id: string
					created_at: string | null
					is_primary: boolean | null
					release_id: string
				}
				Insert: {
					artist_id: string
					created_at?: string | null
					is_primary?: boolean | null
					release_id: string
				}
				Update: {
					artist_id?: string
					created_at?: string | null
					is_primary?: boolean | null
					release_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "artist_releases_artist_id_fkey"
						columns: ["artist_id"]
						isOneToOne: false
						referencedRelation: "artists"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "artist_releases_release_id_fkey"
						columns: ["release_id"]
						isOneToOne: false
						referencedRelation: "releases"
						referencedColumns: ["id"]
					},
				]
			}
			artist_social_links: {
				Row: {
					artist_id: string | null
					created_at: string | null
					id: string
					link: string
					name: string
				}
				Insert: {
					artist_id?: string | null
					created_at?: string | null
					id?: string
					link: string
					name: string
				}
				Update: {
					artist_id?: string | null
					created_at?: string | null
					id?: string
					link?: string
					name?: string
				}
				Relationships: [
					{
						foreignKeyName: "artist_social_links_artist_id_fkey"
						columns: ["artist_id"]
						isOneToOne: false
						referencedRelation: "artists"
						referencedColumns: ["id"]
					},
				]
			}
			artists: {
				Row: {
					active_career: boolean | null
					birth_date: string | null
					created_at: string | null
					debut_date: string | null
					description: string | null
					gender: Database["public"]["Enums"]["gender"] | null
					general_tags: string[] | null
					id: string
					id_youtube_music: string | null
					image: string | null
					name: string
					styles: string[] | null
					type: Database["public"]["Enums"]["artist_type"] | null
					updated_at: string | null
					verified: boolean | null
				}
				Insert: {
					active_career?: boolean | null
					birth_date?: string | null
					created_at?: string | null
					debut_date?: string | null
					description?: string | null
					gender?: Database["public"]["Enums"]["gender"] | null
					general_tags?: string[] | null
					id?: string
					id_youtube_music?: string | null
					image?: string | null
					name: string
					styles?: string[] | null
					type?: Database["public"]["Enums"]["artist_type"] | null
					updated_at?: string | null
					verified?: boolean | null
				}
				Update: {
					active_career?: boolean | null
					birth_date?: string | null
					created_at?: string | null
					debut_date?: string | null
					description?: string | null
					gender?: Database["public"]["Enums"]["gender"] | null
					general_tags?: string[] | null
					id?: string
					id_youtube_music?: string | null
					image?: string | null
					name?: string
					styles?: string[] | null
					type?: Database["public"]["Enums"]["artist_type"] | null
					updated_at?: string | null
					verified?: boolean | null
				}
				Relationships: []
			}
			firebase_user_mapping: {
				Row: {
					created_at: string | null
					firebase_id: string
					supabase_id: string | null
				}
				Insert: {
					created_at?: string | null
					firebase_id: string
					supabase_id?: string | null
				}
				Update: {
					created_at?: string | null
					firebase_id?: string
					supabase_id?: string | null
				}
				Relationships: [
					{
						foreignKeyName: "firebase_user_mapping_supabase_id_fkey"
						columns: ["supabase_id"]
						isOneToOne: false
						referencedRelation: "users"
						referencedColumns: ["id"]
					},
				]
			}
			general_tags: {
				Row: {
					created_at: string | null
					id: string
					name: string
					updated_at: string | null
				}
				Insert: {
					created_at?: string | null
					id?: string
					name: string
					updated_at?: string | null
				}
				Update: {
					created_at?: string | null
					id?: string
					name?: string
					updated_at?: string | null
				}
				Relationships: []
			}
			music_artists: {
				Row: {
					artist_id: string
					created_at: string | null
					is_primary: boolean | null
					music_id: string
				}
				Insert: {
					artist_id: string
					created_at?: string | null
					is_primary?: boolean | null
					music_id: string
				}
				Update: {
					artist_id?: string
					created_at?: string | null
					is_primary?: boolean | null
					music_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "music_artists_artist_id_fkey"
						columns: ["artist_id"]
						isOneToOne: false
						referencedRelation: "artists"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "music_artists_music_id_fkey"
						columns: ["music_id"]
						isOneToOne: false
						referencedRelation: "musics"
						referencedColumns: ["id"]
					},
				]
			}
			music_releases: {
				Row: {
					created_at: string | null
					music_id: string
					release_id: string
					track_number: number
				}
				Insert: {
					created_at?: string | null
					music_id: string
					release_id: string
					track_number: number
				}
				Update: {
					created_at?: string | null
					music_id?: string
					release_id?: string
					track_number?: number
				}
				Relationships: [
					{
						foreignKeyName: "music_releases_music_id_fkey"
						columns: ["music_id"]
						isOneToOne: false
						referencedRelation: "musics"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "music_releases_release_id_fkey"
						columns: ["release_id"]
						isOneToOne: false
						referencedRelation: "releases"
						referencedColumns: ["id"]
					},
				]
			}
			music_styles: {
				Row: {
					created_at: string | null
					id: string
					name: string
					updated_at: string | null
				}
				Insert: {
					created_at?: string | null
					id?: string
					name: string
					updated_at?: string | null
				}
				Update: {
					created_at?: string | null
					id?: string
					name?: string
					updated_at?: string | null
				}
				Relationships: []
			}
			musics: {
				Row: {
					created_at: string | null
					date: string | null
					description: string | null
					duration: number | null
					id: string
					id_youtube_music: string | null
					ismv: boolean
					name: string
					thumbnails: Json | null
					type: Database["public"]["Enums"]["music_type"] | null
					updated_at: string | null
					verified: boolean | null
				}
				Insert: {
					created_at?: string | null
					date?: string | null
					description?: string | null
					duration?: number | null
					id?: string
					id_youtube_music?: string | null
					ismv?: boolean
					name: string
					thumbnails?: Json | null
					type?: Database["public"]["Enums"]["music_type"] | null
					updated_at?: string | null
					verified?: boolean | null
				}
				Update: {
					created_at?: string | null
					date?: string | null
					description?: string | null
					duration?: number | null
					id?: string
					id_youtube_music?: string | null
					ismv?: boolean
					name?: string
					thumbnails?: Json | null
					type?: Database["public"]["Enums"]["music_type"] | null
					updated_at?: string | null
					verified?: boolean | null
				}
				Relationships: []
			}
			news: {
				Row: {
					created_at: string | null
					date: string
					id: string
					message: string
					updated_at: string | null
					verified: boolean
				}
				Insert: {
					created_at?: string | null
					date: string
					id?: string
					message: string
					updated_at?: string | null
					verified?: boolean
				}
				Update: {
					created_at?: string | null
					date?: string
					id?: string
					message?: string
					updated_at?: string | null
					verified?: boolean
				}
				Relationships: []
			}
			news_artists_junction: {
				Row: {
					artist_id: string
					created_at: string | null
					news_id: string
				}
				Insert: {
					artist_id: string
					created_at?: string | null
					news_id: string
				}
				Update: {
					artist_id?: string
					created_at?: string | null
					news_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "news_artists_junction_artist_id_fkey"
						columns: ["artist_id"]
						isOneToOne: false
						referencedRelation: "artists"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "news_artists_junction_news_id_fkey"
						columns: ["news_id"]
						isOneToOne: false
						referencedRelation: "news"
						referencedColumns: ["id"]
					},
				]
			}
			releases: {
				Row: {
					created_at: string | null
					date: string | null
					description: string | null
					id: string
					id_youtube_music: string | null
					image: string | null
					name: string
					type: Database["public"]["Enums"]["release_type"] | null
					updated_at: string | null
					verified: boolean | null
					year: number | null
				}
				Insert: {
					created_at?: string | null
					date?: string | null
					description?: string | null
					id?: string
					id_youtube_music?: string | null
					image?: string | null
					name: string
					type?: Database["public"]["Enums"]["release_type"] | null
					updated_at?: string | null
					verified?: boolean | null
					year?: number | null
				}
				Update: {
					created_at?: string | null
					date?: string | null
					description?: string | null
					id?: string
					id_youtube_music?: string | null
					image?: string | null
					name?: string
					type?: Database["public"]["Enums"]["release_type"] | null
					updated_at?: string | null
					verified?: boolean | null
					year?: number | null
				}
				Relationships: []
			}
			user_artist_contributions: {
				Row: {
					artist_id: string
					contribution_type: Database["public"]["Enums"]["contribution_type"]
					created_at: string | null
					user_id: string
				}
				Insert: {
					artist_id: string
					contribution_type: Database["public"]["Enums"]["contribution_type"]
					created_at?: string | null
					user_id: string
				}
				Update: {
					artist_id?: string
					contribution_type?: Database["public"]["Enums"]["contribution_type"]
					created_at?: string | null
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "user_artist_contributions_artist_id_fkey"
						columns: ["artist_id"]
						isOneToOne: false
						referencedRelation: "artists"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "user_artist_contributions_user_id_fkey"
						columns: ["user_id"]
						isOneToOne: false
						referencedRelation: "users"
						referencedColumns: ["id"]
					},
				]
			}
			user_news_contributions: {
				Row: {
					contribution_type: Database["public"]["Enums"]["contribution_type"]
					created_at: string | null
					news_id: string
					user_id: string
				}
				Insert: {
					contribution_type: Database["public"]["Enums"]["contribution_type"]
					created_at?: string | null
					news_id: string
					user_id: string
				}
				Update: {
					contribution_type?: Database["public"]["Enums"]["contribution_type"]
					created_at?: string | null
					news_id?: string
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "user_news_contributions_news_id_fkey"
						columns: ["news_id"]
						isOneToOne: false
						referencedRelation: "news"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "user_news_contributions_user_id_fkey"
						columns: ["user_id"]
						isOneToOne: false
						referencedRelation: "users"
						referencedColumns: ["id"]
					},
				]
			}
			users: {
				Row: {
					created_at: string
					email: string
					id: string
					name: string
					photo_url: string | null
					role: Database["public"]["Enums"]["user_role"]
					updated_at: string
				}
				Insert: {
					created_at?: string
					email: string
					id: string
					name: string
					photo_url?: string | null
					role?: Database["public"]["Enums"]["user_role"]
					updated_at?: string
				}
				Update: {
					created_at?: string
					email?: string
					id?: string
					name?: string
					photo_url?: string | null
					role?: Database["public"]["Enums"]["user_role"]
					updated_at?: string
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			bytea_to_text: {
				Args: { data: string }
				Returns: string
			}
			check_algolia_config: {
				Args: Record<PropertyKey, never>
				Returns: {
					setting_name: string
					setting_value: string
					is_set: boolean
				}[]
			}
			check_array_values_exist: {
				Args: { arr: string[]; table_name: string }
				Returns: boolean
			}
			firebase_id_to_uuid: {
				Args: { firebase_id: string }
				Returns: string
			}
			get_random_music_ids: {
				Args: { count_param: number }
				Returns: {
					id: string
				}[]
			}
			get_random_music_ids_by_artist: {
				Args: { artist_id_param: string; count_param: number }
				Returns: {
					id: string
				}[]
			}
			http: {
				Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
				Returns: Database["public"]["CompositeTypes"]["http_response"]
			}
			http_delete: {
				Args:
					| { uri: string }
					| { uri: string; content: string; content_type: string }
				Returns: Database["public"]["CompositeTypes"]["http_response"]
			}
			http_get: {
				Args: { uri: string } | { uri: string; data: Json }
				Returns: Database["public"]["CompositeTypes"]["http_response"]
			}
			http_head: {
				Args: { uri: string }
				Returns: Database["public"]["CompositeTypes"]["http_response"]
			}
			http_header: {
				Args: { field: string; value: string }
				Returns: Database["public"]["CompositeTypes"]["http_header"]
			}
			http_list_curlopt: {
				Args: Record<PropertyKey, never>
				Returns: {
					curlopt: string
					value: string
				}[]
			}
			http_patch: {
				Args: { uri: string; content: string; content_type: string }
				Returns: Database["public"]["CompositeTypes"]["http_response"]
			}
			http_post: {
				Args:
					| { uri: string; content: string; content_type: string }
					| { uri: string; data: Json }
				Returns: Database["public"]["CompositeTypes"]["http_response"]
			}
			http_put: {
				Args: { uri: string; content: string; content_type: string }
				Returns: Database["public"]["CompositeTypes"]["http_response"]
			}
			http_reset_curlopt: {
				Args: Record<PropertyKey, never>
				Returns: boolean
			}
			http_set_curlopt: {
				Args: { curlopt: string; value: string }
				Returns: boolean
			}
			is_supabase_or_firebase_project_jwt: {
				Args: Record<PropertyKey, never>
				Returns: boolean
			}
			set_algolia_config: {
				Args:
					| Record<PropertyKey, never>
					| { p_app_id: string; p_api_key: string }
				Returns: undefined
			}
			sync_all_artists_to_algolia: {
				Args: Record<PropertyKey, never>
				Returns: string
			}
			sync_all_musics_to_algolia: {
				Args: Record<PropertyKey, never>
				Returns: string
			}
			sync_all_releases_to_algolia: {
				Args: Record<PropertyKey, never>
				Returns: string
			}
			test_algolia_connection: {
				Args: Record<PropertyKey, never>
				Returns: string
			}
			test_algolia_response: {
				Args: Record<PropertyKey, never>
				Returns: string
			}
			test_algolia_sync_single_artist: {
				Args: { artist_id: string }
				Returns: string
			}
			text_to_bytea: {
				Args: { data: string }
				Returns: string
			}
			urlencode: {
				Args: { data: Json } | { string: string } | { string: string }
				Returns: string
			}
		}
		Enums: {
			artist_type: "SOLO" | "GROUP"
			contribution_type: "CREATOR" | "EDITOR"
			gender: "MALE" | "FEMALE" | "MIXTE" | "OTHER" | "UNKNOWN"
			music_type: "SONG"
			relation_type: "MEMBER" | "GROUP" | "PRODUCER" | "COMPOSER"
			release_type: "ALBUM" | "SINGLE" | "EP" | "COMPILATION"
			user_role: "USER" | "CONTRIBUTOR" | "ADMIN"
		}
		CompositeTypes: {
			http_header: {
				field: string | null
				value: string | null
			}
			http_request: {
				method: unknown | null
				uri: string | null
				headers: Database["public"]["CompositeTypes"]["http_header"][] | null
				content_type: string | null
				content: string | null
			}
			http_response: {
				status: number | null
				content_type: string | null
				headers: Database["public"]["CompositeTypes"]["http_header"][] | null
				content: string | null
			}
		}
	}
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never

export const Constants = {
	public: {
		Enums: {
			artist_type: ["SOLO", "GROUP"],
			contribution_type: ["CREATOR", "EDITOR"],
			gender: ["MALE", "FEMALE", "MIXTE", "OTHER", "UNKNOWN"],
			music_type: ["SONG"],
			relation_type: ["MEMBER", "GROUP", "PRODUCER", "COMPOSER"],
			release_type: ["ALBUM", "SINGLE", "EP", "COMPILATION"],
			user_role: ["USER", "CONTRIBUTOR", "ADMIN"],
		},
	},
} as const
