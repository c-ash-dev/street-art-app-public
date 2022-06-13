import { extractShortKey } from '../utils/app-utils'

/*
  taking Firestore data record, convert into local record
*/
export const createArtworkRecord = ({ id, data, }) => {
  const { artistId, caption, coordinates, created, creatorId, location, updated, visitCount, } = data
  const { latitude, longitude, } = coordinates

  const record = {
    id,
    artistId,
    caption,
    coordinates: {
      latitude,
      longitude,
    },
    creatorId,
    created: created.seconds,
    location,
    updated: updated.seconds,
    /*
      array of hash
      {
        '200': <url>
        '400': <url>
        '800': <url>
      }
    */
    images: [], // filled in by other query
    visitCount,
  }

  return record
}

export const createArtistRecord = ({ id, data, }) => {
  const { name, } = data

  const record = {
    name,
    id,
  }

  return record
}

export const createBookmarkRecord = ({ id, data, }) => {
  const { artworkId, created, userId, } = data
  const { seconds, } = created

  const record = {
    artworkId,
    created: seconds,
    userId,
  }

  return record
}

export const createLikeRecord = ({ id, data, }) => {
  const { artworkId, created, userId, } = data
  const { seconds, } = created

  const record = {
    artworkId,
    created: seconds,
    userId,
  }

  return record
}

export const createUserPhotoRecord = ({ id, data, }) => {
  const { artworkId, created, urls, userId, } = data
  const { seconds, } = created

  const record = {
    id,
    artworkId,
    created: seconds,
    urls,
    userId,
  }

  return record
}

export const createVisitRecord = ({ id, data, }) => {
  const { artworkId, created, userId, } = data
  const { seconds, } = created
  const key = extractShortKey(id)

  const record = {
    id: key,
    artworkId,
    created: seconds,
    userId,
  }

  return record
}

export const firstImageHash = function(artRec) {
  const images = artRec.images // array of hashes
  return images[0] || {}
}

export const firstImageSrc = function(artRec) {
  const urlHash = firstImageHash(artRec) // hash
  return urlHash['200'] || ''
}
