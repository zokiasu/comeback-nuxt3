import type { Artist } from '~/types/artist'
import type { Release } from '~/types/release'
import type { Music } from '~/types/music'

export function useGeneralFunction() {

  const formatArtistData = async (artistData: any) => {
    if (!artistData) return {} as Artist

    const { attributes } = artistData

    const artistTmp: Artist = {
      id: artistData.id,
      idYoutubeMusic: attributes.idYoutubeMusic || '',
      name: attributes.name,
      description: attributes.description || '',
      type: attributes.type,
      images: attributes.images || [],
      styles: attributes.styles || [],
      socials: attributes.socials || [],
      platforms: attributes.platforms || [],
      members: attributes.members
        ? await formatArray(attributes.members.data, formatArtistData)
        : [],
      groups: attributes.groups
        ? await formatArray(attributes.groups.data, formatArtistData)
        : [],
      releases: [],
    }

    return artistTmp
  }

  const formatReleaseData = async (releaseData: any) => {
    if (!releaseData) return {} as Release

    const { attributes } = releaseData

    const releaseTmp: Release = {
      id: releaseData.id,
      idYoutubeMusic: attributes.idYoutubeMusic,
      name: attributes.name,
      type: attributes.type,
      year: attributes.year,
      verified: attributes.verified,
      platforms: attributes.platforms || [],
      dateRelease: attributes.dateRelease,
      images: attributes.images || [],

      artists: attributes.artists
        ? await formatArray(attributes.artists.data, formatArtistData)
        : [],
      music: attributes.music
        ? await formatArray(attributes.music.data, formatMusicData)
        : [],
    }

    return releaseTmp
  }

  const formatMusicData = async (musicData: any) => {
    if (!musicData) return {} as Music

    const { attributes } = musicData

    const musicTmp: Music = {
      id: musicData.id,
      videoId: attributes.videoId,
      name: attributes.name,
      duration: attributes.duration,
      images: attributes.images || [],
      artists: attributes.artists
        ? await formatArray(attributes.artists.data, formatArtistData)
        : [],
      releases: attributes.releases
        ? await formatArray(attributes.releases.data, formatReleaseData)
        : [],
    }

    return musicTmp
  }

  const formatArray = async (array: any[], formatter: Function) => {
    return await Promise.all(array.map(async (item) => await formatter(item)))
  }

  return {
    formatArtistData,
    formatReleaseData,
    formatMusicData,
  }
}
