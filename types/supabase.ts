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
			artists: {
				Row: {
					id: string
					name: string
					image: string | null
					type: string
					active_career: boolean
					verified: boolean
					id_youtube_music: string | null
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					name: string
					image?: string | null
					type: string
					active_career?: boolean
					verified?: boolean
					id_youtube_music?: string | null
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					name?: string
					image?: string | null
					type?: string
					active_career?: boolean
					verified?: boolean
					id_youtube_music?: string | null
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
			releases: {
				Row: {
					id: string
					name: string
					image: string | null
					type: string
					date: string
					verified: boolean
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					name: string
					image?: string | null
					type: string
					date: string
					verified?: boolean
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					name?: string
					image?: string | null
					type?: string
					date?: string
					verified?: boolean
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
			news: {
				Row: {
					id: string
					message: string
					date: string
					verified: boolean
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					message: string
					date: string
					verified?: boolean
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					message?: string
					date?: string
					verified?: boolean
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
			musics: {
				Row: {
					id: string
					name: string
					type: string
					verified: boolean
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					name: string
					type: string
					verified?: boolean
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					name?: string
					type?: string
					verified?: boolean
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
			artist_social_links: {
				Row: {
					id: string
					artist_id: string
					name: string
					link: string
					created_at: string
				}
				Insert: {
					id?: string
					artist_id: string
					name: string
					link: string
					created_at?: string
				}
				Update: {
					id?: string
					artist_id?: string
					name?: string
					link?: string
					created_at?: string
				}
				Relationships: []
			}
			artist_platform_links: {
				Row: {
					id: string
					artist_id: string
					name: string
					link: string
					created_at: string
				}
				Insert: {
					id?: string
					artist_id: string
					name: string
					link: string
					created_at?: string
				}
				Update: {
					id?: string
					artist_id?: string
					name?: string
					link?: string
					created_at?: string
				}
				Relationships: []
			}
			artist_relations: {
				Row: {
					id: string
					group_id: string
					member_id: string
					relation_type: string
					created_at: string
				}
				Insert: {
					id?: string
					group_id: string
					member_id: string
					relation_type: string
					created_at?: string
				}
				Update: {
					id?: string
					group_id?: string
					member_id?: string
					relation_type?: string
					created_at?: string
				}
				Relationships: []
			}
			artist_releases: {
				Row: {
					id: string
					artist_id: string
					release_id: string
					created_at: string
				}
				Insert: {
					id?: string
					artist_id: string
					release_id: string
					created_at?: string
				}
				Update: {
					id?: string
					artist_id?: string
					release_id?: string
					created_at?: string
				}
				Relationships: []
			}
			music_artists: {
				Row: {
					id: string
					music_id: string
					artist_id: string
					created_at: string
				}
				Insert: {
					id?: string
					music_id: string
					artist_id: string
					created_at?: string
				}
				Update: {
					id?: string
					music_id?: string
					artist_id?: string
					created_at?: string
				}
				Relationships: []
			}
			music_releases: {
				Row: {
					id: string
					music_id: string
					release_id: string
					created_at: string
				}
				Insert: {
					id?: string
					music_id: string
					release_id: string
					created_at?: string
				}
				Update: {
					id?: string
					music_id?: string
					release_id?: string
					created_at?: string
				}
				Relationships: []
			}
			news_artists_junction: {
				Row: {
					id: string
					news_id: string
					artist_id: string
					created_at: string
				}
				Insert: {
					id?: string
					news_id: string
					artist_id: string
					created_at?: string
				}
				Update: {
					id?: string
					news_id?: string
					artist_id?: string
					created_at?: string
				}
				Relationships: []
			}
			music_styles: {
				Row: {
					id: string
					name: string
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					name: string
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					name?: string
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
			general_tags: {
				Row: {
					id: string
					name: string
					created_at: string
					updated_at: string
				}
				Insert: {
					id?: string
					name: string
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					name?: string
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
			users: {
				Row: {
					id: string
					email: string
					name: string
					photo_url: string | null
					role: string
					created_at: string
					updated_at: string
				}
				Insert: {
					id: string
					email: string
					name: string
					photo_url?: string | null
					role?: string
					created_at?: string
					updated_at?: string
				}
				Update: {
					id?: string
					email?: string
					name?: string
					photo_url?: string | null
					role?: string
					created_at?: string
					updated_at?: string
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
				DefaultSchema['Views'])
		? (DefaultSchema['Tables'] &
				DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never

export const Constants = {
	public: {
		Enums: {
			artist_type: ['SOLO', 'GROUP'],
			contribution_type: ['CREATOR', 'EDITOR'],
			gender: ['MALE', 'FEMALE', 'MIXTE', 'OTHER', 'UNKNOWN'],
			music_type: ['SONG'],
			relation_type: ['MEMBER', 'GROUP', 'PRODUCER', 'COMPOSER'],
			release_type: ['ALBUM', 'SINGLE', 'EP', 'COMPILATION'],
			user_role: ['USER', 'CONTRIBUTOR', 'ADMIN'],
		},
	},
} as const
