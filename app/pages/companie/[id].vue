<script setup lang="ts">
	import { storeToRefs } from 'pinia'
	import { useUserStore } from '@/stores/user'
	import type { Company, CompanyArtist } from '~/composables/Supabase/useSupabaseCompanies'
	import { useSupabaseCompanies } from '~/composables/Supabase/useSupabaseCompanies'

	const userStore = useUserStore()
	const { isLoginStore, isAdminStore } = storeToRefs(userStore)
	const { getCompanyById, getCompanyArtists } = useSupabaseCompanies()

	const title = ref<string>('Company Page')
	const description = ref<string>('Company')
	const route = useRoute()
	const company = ref<Company>()
	const companyArtists = ref<CompanyArtist[]>([])
	const imageBackground = ref<string | null>(null)
	const imageBackLoaded = ref<boolean>(false)
	const isFetchingCompany = ref<boolean>(true)

	onMounted(async () => {
		try {
			company.value = await getCompanyById(route.params.id as string)
			if (company.value) {
				companyArtists.value = await getCompanyArtists(company.value.id)
				imageBackground.value = company.value.logo_url || null
				title.value = company.value.name
				description.value = company.value.description || ''
			}
		} catch (error) {
			console.error(error)
			isFetchingCompany.value = false
		} finally {
			isFetchingCompany.value = false
		}
	})

	const currentArtists = computed(() =>
		companyArtists.value
			.filter((relation) => relation.is_current)
			.sort((a, b) => (a.artist?.name || '').localeCompare(b.artist?.name || ''))
	)

	const pastArtists = computed(() =>
		companyArtists.value
			.filter((relation) => !relation.is_current)
			.sort((a, b) => (a.artist?.name || '').localeCompare(b.artist?.name || ''))
	)

	const getCompanyTypeLabel = (type: string | undefined) => {
		const labels = {
			LABEL: 'Label',
			PUBLISHER: 'Éditeur',
			DISTRIBUTOR: 'Distributeur',
			MANAGER: 'Management',
			AGENCY: 'Agence',
			STUDIO: 'Studio',
			OTHER: 'Autre',
		}
		return labels[type as keyof typeof labels] || type || 'Non spécifié'
	}

	const formatLocation = (city?: string, country?: string) => {
		if (city && country) return `${city}, ${country}`
		if (city) return city
		if (country) return country
		return null
	}

	const editLink = computed(() => {
		if (!isLoginStore || !isAdminStore) {
			return '/authentification'
		}
		return `/dashboard/companies` // Nous pouvons ajuster cela plus tard
	})

	useHead({
		title,
		meta: [
			{
				name: 'description',
				content: description,
			},
		],
	})
</script>

<template>
	<div v-if="company">
		<section
			class="background-top relative h-[30vh] overflow-hidden bg-cover bg-no-repeat lg:h-[40vh] xl:h-[50vh] 2xl:h-[70vh]"
		>
			<NuxtImg
				v-if="imageBackground"
				:src="imageBackground"
				:alt="company?.name + '_background'"
				format="webp"
				loading="lazy"
				class="absolute inset-0 h-full w-full object-cover"
				@load="imageBackLoaded = true"
			/>
			<div
				class="absolute inset-0 flex items-end p-5 transition-all duration-500 ease-in-out lg:p-10 xl:p-14 2xl:px-32"
				:class="imageBackLoaded ? 'bg-cb-secondary-950/60' : 'bg-cb-quinary-900'"
			>
				<div class="space-y-5 lg:container lg:mx-auto lg:px-5">
					<SkeletonDefault v-if="isFetchingCompany" class="h-14 w-80 rounded" />
					<h1
						v-if="company.name && !isFetchingCompany"
						class="text-3xl font-bold md:text-6xl xl:text-7xl"
					>
						{{ company.name }}
					</h1>
					<div v-if="company.type || company.founded_year" class="flex flex-wrap gap-2 font-semibold">
						<p
							v-if="company.type"
							class="bg-cb-quaternary-950 w-fit rounded px-3 py-1 text-xs font-semibold whitespace-nowrap uppercase"
						>
							{{ getCompanyTypeLabel(company.type) }}
						</p>
						<p
							v-if="company.founded_year"
							class="bg-cb-quaternary-950 w-fit rounded px-3 py-1 text-xs font-semibold whitespace-nowrap uppercase"
						>
							Fondée en {{ company.founded_year }}
						</p>
						<p
							v-if="formatLocation(company.city, company.country)"
							class="bg-cb-quaternary-950 w-fit rounded px-3 py-1 text-xs font-semibold whitespace-nowrap uppercase"
						>
							{{ formatLocation(company.city, company.country) }}
						</p>
						<p
							v-if="company.verified"
							class="bg-cb-primary-900 w-fit rounded px-3 py-1 text-xs font-semibold whitespace-nowrap uppercase"
						>
							Vérifiée
						</p>
					</div>
					<div v-if="!isFetchingCompany" class="flex flex-wrap gap-2">
						<NuxtLink
							v-if="isAdminStore"
							:to="editLink"
							class="bg-cb-secondary-950 px-2 py-1 text-xs font-semibold uppercase"
						>
							Modifier la compagnie
						</NuxtLink>
					</div>
				</div>
			</div>
		</section>

		<section
			class="mx-auto space-y-8 p-5 py-8 lg:container lg:space-y-14 lg:px-14 lg:py-10 xl:px-5"
		>
			<div v-if="isFetchingCompany" class="space-y-2">
				<SkeletonDefault class="h-5 w-3/4 rounded" />
				<SkeletonDefault class="h-5 w-2/4 rounded" />
				<SkeletonDefault class="h-5 w-2/6 rounded" />
				<SkeletonDefault class="h-5 w-2/5 rounded" />
			</div>

			<div v-else class="space-y-5">
				<CardDefault v-if="company.website && !isFetchingCompany" name="Site Web">
					<div class="flex flex-wrap gap-2">
						<ComebackExternalLink
							name="Site officiel"
							:link="company.website"
							class="!px-2.5 !py-1"
						/>
					</div>
				</CardDefault>

				<CardDefault name="Description" class="pt-5">
					<p
						v-if="company.description"
						class="max-w-6xl text-xs leading-6 whitespace-pre-line md:text-base md:leading-8"
					>
						{{ company.description }}
					</p>
					<div v-else>
						<p class="text-xs md:text-base">Aucune description disponible.</p>
						<p class="text-xs md:text-base">
							Ajoutez une description pour partager plus d'informations sur cette compagnie avec notre
							communauté.
						</p>
						<div v-if="isAdminStore" class="pt-2">
							<NuxtLink
								:to="editLink"
								class="bg-cb-quaternary-950 mt-5 px-2 py-1 text-xs font-semibold uppercase"
							>
								Ajouter une description
							</NuxtLink>
						</div>
					</div>
				</CardDefault>

				<CardDefault name="Informations" class="pt-5">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div v-if="company.type" class="space-y-1">
							<h4 class="text-sm font-semibold text-gray-300">Type</h4>
							<p class="text-sm">{{ getCompanyTypeLabel(company.type) }}</p>
						</div>
						<div v-if="company.founded_year" class="space-y-1">
							<h4 class="text-sm font-semibold text-gray-300">Année de fondation</h4>
							<p class="text-sm">{{ company.founded_year }}</p>
						</div>
						<div v-if="formatLocation(company.city, company.country)" class="space-y-1">
							<h4 class="text-sm font-semibold text-gray-300">Localisation</h4>
							<p class="text-sm">{{ formatLocation(company.city, company.country) }}</p>
						</div>
						<div class="space-y-1">
							<h4 class="text-sm font-semibold text-gray-300">Statut</h4>
							<p class="text-sm">{{ company.verified ? 'Vérifiée' : 'Non vérifiée' }}</p>
						</div>
					</div>
				</CardDefault>
			</div>

			<div v-if="currentArtists.length && !isFetchingCompany">
				<CardDefault :name="`Artistes actuels (${currentArtists.length})`">
					<transition-group
						name="list-complete"
						tag="div"
						class="scrollBarLight flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 xl:flex-wrap"
					>
						<CardObject
							v-for="relation in currentArtists"
							:key="`current_artist_${relation.artist?.id}`"
							is-artist
							:artist-id="String(relation.artist?.id ?? '')"
							:main-title="relation.artist?.name ?? 'Artiste inconnu'"
							:sub-title="relation.relationship_type ? getCompanyTypeLabel(relation.relationship_type) : undefined"
							:image="relation.artist?.image"
							:object-link="`/artist/${String(relation.artist?.id ?? '')}`"
						/>
					</transition-group>
				</CardDefault>
			</div>

			<div v-if="pastArtists.length && !isFetchingCompany">
				<CardDefault :name="`Anciens artistes (${pastArtists.length})`">
					<transition-group
						name="list-complete"
						tag="div"
						class="scrollBarLight flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 xl:flex-wrap"
					>
						<CardObject
							v-for="relation in pastArtists"
							:key="`past_artist_${relation.artist?.id}`"
							is-artist
							:artist-id="String(relation.artist?.id ?? '')"
							:main-title="relation.artist?.name ?? 'Artiste inconnu'"
							:sub-title="relation.relationship_type ? getCompanyTypeLabel(relation.relationship_type) : undefined"
							:image="relation.artist?.image"
							:object-link="`/artist/${String(relation.artist?.id ?? '')}`"
						/>
					</transition-group>
				</CardDefault>
			</div>

			<div v-if="!currentArtists.length && !pastArtists.length && !isFetchingCompany">
				<CardDefault name="Artistes">
					<p class="text-xs md:text-base">Aucun artiste associé à cette compagnie.</p>
				</CardDefault>
			</div>
		</section>
	</div>
</template>