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
      image: attributes.image,
      styles: attributes.styles || [],
      socialList: attributes.socialList || [],
      platformList: attributes.platformList || [],
      members: attributes.members ? await formatArray(attributes.members.data, formatArtistData) : [],
      groups: attributes.groups ? await formatArray(attributes.groups.data, formatArtistData) : [],
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
      needToBeVerified: attributes.needToBeVerified,
      platformList: attributes.platformList || [],
      date: attributes.date,
      image: attributes.image || [],
      artists: attributes.artists
        ? await formatArray(attributes.artists.data, formatArtistData)
        : [],
      musics: attributes.musics
        ? await formatArray(attributes.music.data, formatMusicData)
        : [],
      artistsId: '', // Add the missing property 'artistsId'
      artistsName: '', // Add the missing property 'artistsName'
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
