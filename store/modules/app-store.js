/*
  Vuex module: App
*/

// Libs
import Vue from 'vue'

// Utils & Constants
import {
  createArtistRecord,
  createArtworkRecord,
  createBookmarkRecord,
  createLikeRecord,
  createUserPhotoRecord,
  createVisitRecord
} from '../models'

// Components
import * as fsSrvc from '../../services/firestore-srvc'
import { createKeyByArtworkId } from '../../utils/app-utils'

/*
  given artworkId
  create unique checkin for user
  return '<user>-<artwork>-<timestamp>'

*/

export default {

  namespaced: true,

  state: {
    timestamp: 0, // 1526167089200

    // should be id of artwork or null
    artworkDetailId: null,

    latestArtwork: {
      // records of Artwork, hashed by id
      /*
        'bXc88UgxXg0Ai8gO4T6i': {
          // <Artwork Record>
        }
      */
    },

    bookmarks: {
      /*
        records of Bookmarks
        hashed by artworkId, eg:

        'MfhyTTYoRpOFd0aH6NtU': {
          artworkId: 'MfhyTTYoRpOFd0aH6NtU',
          created: 2313231321,
          userId: 'Z2UGE7bGcY9PGEVfKSY5',
        }
      */
    },

    artistRecords: {
      /*
        records of Artists
        hashed by artistId, eg:

        '8sEZH0W9KXsWGjzqrShL': {
          id: '8sEZH0W9KXsWGjzqrShL',
          name: 'SMiLE',
        }
      */
    },

    userPhotos: {
      /*
        records of User Photos
        hashed by image id, eg:

        'PlTUsXlkdmkCwYi8UvVo': {
          id: 'PlTUsXlkdmkCwYi8UvVo',
          artworkId: '6wtIcIVp9JweGj1lQMjh',
          created: <date>
          urls: {
            200: 'https://storage.googleapis.com/dev-street-art-app.appspot.com/images/6wtIcIVp9JweGj1lQMjh/1536212006826-200.jpg',
          },
          userId: '1VoBRpkGQNOVSQUpFRW9imdixIZ2',
        },
      */
    },

    likes: {
      /*
        records of Likes
        hashed by artworkId, eg

        '6wtIcIVp9JweGj1lQMjh': {
          artworkId: '6wtIcIVp9JweGj1lQMjh',
          created: 1544572800000,
          userId: '1VoBRpkGQNOVSQUpFRW9imdixIZ2',
        }
      */
    },

    visits: {
      /*
        key'd on <artworkId>-<timestamp>

      '4bcMzX2ZoiVZXLVETWbM-1544572800000': {
        artworkId: '4bcMzX2ZoiVZXLVETWbM',
        created: 1544572800000,
        id: 4bcMzX2ZoiVZXLVETWbM-1544572800000,
        userId: '1VoBRpkGQNOVSQUpFRW9imdixIZ2',
      },
      */
    },

    queryRef: null,

  },

  getters: {
    // state, getters, rootState, rootGetters

    latestArtwork(state) {
      return Object.values(state.latestArtwork)
        .sort((rec1, rec2) => {
          // descending
          return rec2.created - rec1.created
        })
    },

    userBookmarks(state) {
      return Object.values(state.bookmarks)
        .sort((rec1, rec2) => {
          return rec2.created - rec1.created
        })
    },

    userPhotos(state) {
      return Object.values(state.userPhotos)
        .sort((rec1, rec2) => {
          return rec2.created - rec1.created
        })
    },

    lastTimestamp(state) {
      return state.timestamp
    },

    getArtworkById(state) {
      return (id) => {
        return state.latestArtwork[id] || null
      }
    },

    getArtistNameById(state) {
      return (id) => {
        return state.artistRecords[id] || null
      }
    },

    getArtworkDetailId(state) {
      return state.artworkDetailId
    },

    getBookmarksByArtworkId(state) {
      return (id) => {
        return state.bookmarks[id] || null
      }
    },

    getLikesByArtworkId(state) {
      return (id) => {
        return state.likes[id] || null
      }
    },

    getVisitsRec(state) {
      return state.visits
    },

    userLikes(state) {
      return Object.values(state.likes)
        .sort((rec1, rec2) => {
          return rec2.created - rec1.created
        })
    },

    userHasTodayCheckinByArtworkId(state) {
      const { visits, } = state

      return (artworkId) => {
        const key = createKeyByArtworkId(artworkId)
        return visits[key] !== undefined
      }
    },

  },

  mutations: {

    setArtworkDetailId(state, payload) {
      state.artworkDetailId = payload
    },

    /*
      Artist Record
    */

    addArtistRecord(state, payload) {
      const { id, } = payload
      Vue.set(state.artistRecords, `${id}`, payload)
    },

    removeArtistRecord(state, payload) {
      const { id, } = payload
      Vue.delete(state.artistRecords, `${id}`)
    },

    /*
      Artwork Record
    */

    addArtworkRecord(state, payload) {
      const { id, } = payload
      Vue.set(state.latestArtwork, `${id}`, payload)
    },

    increaseVisitCount(state, payload) {
      const { artworkId: id, } = payload
      state.latestArtwork[id].visitCount++
    },

    removeArtworkRecord(state, payload) {
      const { id, } = payload
      Vue.delete(state.latestArtwork, `${id}`)
    },

    /*
      Bookmark Record
    */

    // payload: bookmark record
    addBookmarkRecord(state, payload) {
      const { artworkId, } = payload
      Vue.set(state.bookmarks, `${artworkId}`, payload)
    },

    removeBookmarkRecord(state, payload) {
      const { artworkId, } = payload
      Vue.delete(state.bookmarks, `${artworkId}`)
    },

    // payload: user photos record
    addUserPhotoRecord(state, payload) {
      const { id, } = payload
      Vue.set(state.userPhotos, `${id}`, payload)
    },

    removeUserPhotoRecord(state, payload) {
      const { id, } = payload
      Vue.delete(state.userPhotos, `${id}`)
    },

    /*
      Like Record
    */

    addLikeRecord(state, payload) {
      const { artworkId, } = payload
      Vue.set(state.likes, `${artworkId}`, payload)
    },

    removeLikeRecord(state, payload) {
      const { artworkId, } = payload
      Vue.delete(state.likes, `${artworkId}`)
    },

    /*
      payload:
        artworkId: <string>
        imageList: Array<{id, artworkId, timestamp, urls,}>
    */
    updateArtworkImages(state, payload) {
      const { artworkId, imageList, } = payload
      const artworkRec = state.latestArtwork[artworkId]
      const compFunc = (a, b) => {
        return a.created - b.created
      }
      artworkRec.images = imageList.sort(compFunc).map(rec => rec.urls)
    },

    updateQueryRef(state, payload) {
      state.queryRef = payload
    },

    // Pass artworkId for artworkDetail page
    updateArtworkDetailId(state, payload) {
      const { artworkId, } = payload
      state.artworkDetailId = artworkId
    },

    // Visit Record

    addVisitRecord(state, payload) {
      const { id, } = payload
      Vue.set(state.visits, `${id}`, payload)
    },

  },

  actions: {
    // ({ state, rootState, commit, dispatch, getters, rootGetters }, payload)

    startBookmarksWatch({ commit, rootState, }, payload) {
      payload = payload || {}

      const userId = rootState.token

      fsSrvc.watchBookmarksCollection(userId, changeRecords => {
        for (let idx = 0; idx < changeRecords.length; idx += 1) {
          const chgRec = changeRecords[idx]
          // record => firestore Bookmark Record
          const { id, type, record, } = chgRec
          switch (type) {
            case 'removed':
              const { artworkId, } = record
              commit('removeBookmarkRecord', { artworkId, })
              break
            case 'added':
            case 'modified':
              const bookmarkRec = createBookmarkRecord({ id, data: record, })
              commit('addBookmarkRecord', bookmarkRec)
          }
        }
      })
    },

    startLikesWatch({ commit, rootState, }, payload) {
      payload = payload || {}

      const userId = rootState.token

      fsSrvc.watchLikesCollection(userId, changeRecords => {
        for (let idx = 0; idx < changeRecords.length; idx += 1) {
          const chgRec = changeRecords[idx]
          const { id, type, record, } = chgRec
          switch (type) {
            case 'removed':
              const { artworkId, } = record
              commit('removeLikeRecord', { artworkId, })
              break
            case 'added':
            case 'modified':
              const likeRec = createLikeRecord({ id, data: record, })
              commit('addLikeRecord', likeRec)
          }
        }
      })
    },

    /*
      load initial data records into store
      called from Store index.js
    */
    initialize({ commit, dispatch, getters, rootState, }, payload) {
      payload = payload || {}

      fsSrvc.watchArtworkCollection(changeRecords => {
        for (let idx = 0; idx < changeRecords.length; idx += 1) {
          const chgRec = changeRecords[idx]
          // record => firestore Artwork Record
          const { id, type, record, } = chgRec
          switch (type) {
            case 'removed':
              commit('removeArtworkRecord', { id, })
              break
            case 'added':
            case 'modified':
              if (record.imageCount === 0) {
                // no images to show
                commit('removeArtworkRecord', { id, })
              } else {
                const artworkRec = createArtworkRecord({ id, data: record, })
                commit('addArtworkRecord', artworkRec)
                dispatch('getArtworkImages', { artworkId: id, })
              }
              break
          }
        }
      })

      fsSrvc.watchArtistsCollection(changeRecords => {
        for (let idx = 0; idx < changeRecords.length; idx += 1) {
          const chgRec = changeRecords[idx]
          // record => firestore Artwork Record
          const { id, type, record, } = chgRec
          switch (type) {
            case 'removed':
              commit('removeArtistRecord', { id, })
              break
            case 'added':
            case 'modified':
              const artworkRec = createArtistRecord({ id, data: record, })
              commit('addArtistRecord', artworkRec)
              break
          }
        }
      })
    },

    startUserPhotosWatch({ commit, rootState, }, payload) {
      payload = payload || {}

      const userId = rootState.token

      fsSrvc.watchImagesCollection(userId, changeRecords => {
        for (let idx = 0; idx < changeRecords.length; idx += 1) {
          const chgRec = changeRecords[idx]
          const { id, type, record, } = chgRec
          switch (type) {
            case 'removed':
              commit('removeUserPhotoRecord', { id, })
              break
            case 'added':
            case 'modified':
              const userPhotoRec = createUserPhotoRecord({ id, data: record, })
              commit('addUserPhotoRecord', userPhotoRec)
          }
        }
      })
    },

    startVisitsWatch({ commit, rootState, }, payload) {
      payload = payload || {}

      const userId = rootState.token

      fsSrvc.watchVisitsCollection(userId, changeRecords => {
        for (let idx = 0; idx < changeRecords.length; idx += 1) {
          const chgRec = changeRecords[idx]
          const { id, type, record, } = chgRec
          switch (type) {
            case 'removed':
              break
            case 'added':
            case 'modified':
              const visitRecord = createVisitRecord({ id, data: record, })
              commit('addVisitRecord', visitRecord)
              break
          }
        }
      })
    },

    getArtworkImages({ commit, }, payload) {
      const { artworkId, } = payload

      fsSrvc.getArtworkImageRecords(artworkId)
        .then(imageList => {
          commit('updateArtworkImages', { artworkId, imageList, })
        })
        .catch(err => {
          console.warn('ERROR getArtworkImages', err)
        })
    },

    /*
      Bookmarks Support
    */
    /*
      payload:
      artworkId: string
      hasBookmark: boolean
    */
    toggleBookmarkByArtworkId({ dispatch, }, payload) {
      const { artworkId, hasBookmark, } = payload

      const record = {
        artworkId,
      }
      if (hasBookmark) {
        return dispatch('removeBookmarkByArtworkId', record)
      } else {
        return dispatch('addBookmarkByArtworkId', record)
      }
    },

    // decrease UI feedback delay
    createFakeBookmarkRecord({ rootState, commit, }, payload) {
      const { artworkId, } = payload

      const record = {
        artworkId,
        created: Date.now(),
        userId: rootState.token,
      }
      commit('addBookmarkRecord', record)
    },

    /*
      payload:
      {
        artworkId,
      }
    */
    addBookmarkByArtworkId({ dispatch, }, payload) {
      const { artworkId, } = payload

      const record = {
        artworkId,
      }

      dispatch('createFakeBookmarkRecord', payload)

      return fsSrvc.addBookmark(record)
        .then(result => {
          // console.log('addBookmark', result)
        })
        .catch(err => {
          console.warn('ERROR addBookmark', err)
        })
    },

    /*
      payload:
      {
        artworkId,
      }
    */
    removeBookmarkByArtworkId({ commit, }, payload) {
      const { artworkId, } = payload

      const record = {
        artworkId,
      }

      // decrease UI feedback delay
      commit('removeBookmarkRecord', { artworkId, })

      return fsSrvc.removeBookmark(record)
        .then(result => {
          // console.log('removeBookmark', result)
        })
        .catch(err => {
          console.warn('ERROR removeBookmark', err)
        })
    },

    /*
      Likes Support
    */

    toggleLikeByArtworkId({ dispatch, }, payload) {
      const { artworkId, hasLike, } = payload

      const record = {
        artworkId,
      }
      if (hasLike) {
        return dispatch('removeLikeByArtworkId', record)
      } else {
        return dispatch('addLikeByArtworkId', record)
      }
    },

    // decrease UI feedback delay
    createFakeLikeRecord({ rootState, commit, }, payload) {
      const { artworkId, } = payload

      const record = {
        artworkId,
        created: Date.now(),
        userId: rootState.token,
      }
      commit('addLikeRecord', record)
    },

    addLikeByArtworkId({ dispatch, }, payload) {
      const { artworkId, } = payload

      const record = {
        artworkId,
      }

      dispatch('createFakeLikeRecord', payload)

      return fsSrvc
        .addLike(record)
        .then(result => {
          // console.log('addlike', result)
        })
        .catch(err => {
          console.warn('ERROR addLike', err)
        })
    },

    removeLikeByArtworkId({ commit, }, payload) {
      const { artworkId, } = payload

      const record = {
        artworkId,
      }

      // decrease UI feedback delay
      commit('removeLikeRecord', { artworkId, })

      return fsSrvc.removeLike(record)
        .then(result => {
          // console.log('removeLike', result)
        })
        .catch(err => {
          console.warn('ERROR removeLike', err)
        })
    },

    /*
    Check In Support
    */

    visitCheckIn({ commit, }, payload) {
      const { artworkId, } = payload

      const record = {
        artworkId,
      }

      console.log('visit check in', record)

      return fsSrvc.visitCheckIn(record)
        .then(result => {
          console.log('check in', result)
        })
        .catch(err => {
          console.warn('ERROR with check in', err)
        })
    },

    /*
    Artwork Record Support
    */

    submitNewArtworkRecord({ commit, }, payload) {
      // DEBUG
      // console.log('submitting', payload)

      commit('showUploadProgress', null, { root: true, })

      return fsSrvc.addArtwork(payload)
        .then(
          result => {
            commit('hideUploadProgress', null, { root: true, })
            return result
          },
          error => {
            commit('hideUploadProgress', null, { root: true, })
            throw error
          }
        )
        .then(result => {
          // read result of the Cloud Function.
          const { data, } = result
          console.log('SUCCESS: addArtwork:', data)

          if (data.error !== null) {
            const { error, details, message, } = data
            switch (error) {
              case 'no-gps-exif-data':
                alert('no Location data found, please check your Location settings.')
                break
              case 'not-authenticated':
                alert('you need to login to submit an artwork image.')
                break
              default:
                alert(`${error} : ${message} : ${details}`)
                break
            }
          }
        })
        .catch(err => {
          const { error, details, message, } = err
          console.error('ERROR: addArtwork', error, message, details)
          alert(`${error} : ${message} : ${details}`)
          return Promise.reject(error)
        })
    },

    // Pass artworkId for artworkDetail pages
    updateArtworkDetailId({ commit, }, payload) {
      const { artworkId, } = payload
      commit('updateArtworkDetailId', { artworkId, })
    },
  },

}
