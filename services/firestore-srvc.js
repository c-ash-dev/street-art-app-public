/*
*/

// Libs
import Firebase from 'firebase'
import 'firebase/functions'

// Utils & constants
import config from '../cloud-config'

Firebase.initializeApp(config)

const createFunctionFromGCF = (funcName) => {
  return function(payload) {
    return Firebase.functions().httpsCallable(funcName)(payload)
  }
}

/*
  create handlers for Google Cloud Functions
*/

export const addArtwork = createFunctionFromGCF('addArtwork')
export const addImage = createFunctionFromGCF('addImage')

export const addBookmark = createFunctionFromGCF('addBookmark')
export const removeBookmark = createFunctionFromGCF('removeBookmark')

export const addLike = createFunctionFromGCF('addLike')
export const removeLike = createFunctionFromGCF('removeLike')

export const visitCheckIn = createFunctionFromGCF('visitCheckIn')

export const dbRef = Firebase.firestore()
dbRef.settings({
  // suppress firebase warning
  timestampsInSnapshots: true,
})

/*
  returns Promise of image records list
  {
    id,
    artworkId,
    created,
    url,
  }
*/
export const getArtworkImageRecords = (artworkId) => {
  return dbRef.collection('images')
    .where('artworkId', '==', artworkId).get()
    .then(querySnapshot => {
      const imageList = []
      querySnapshot.forEach((queryDocSnapshot) => {
        const { id, } = queryDocSnapshot
        const imageRec = queryDocSnapshot.data()
        const { artworkId, created, isFlagged, urls, } = imageRec
        const artImgRec = {
          id, artworkId, created: created.seconds, isFlagged, urls,
        }
        imageList.push(artImgRec)
      })
      return imageList
    })
}

export const onAuthStateChanged = (func) => {
  Firebase.auth().onAuthStateChanged(func)
}

export const signInWithEmailAndPassword = (email, password) => {
  return Firebase.auth().signInWithEmailAndPassword(email, password)
}

export const createUserWithEmailAndPassword = (email, password) => {
  return Firebase.auth().createUserWithEmailAndPassword(email, password)
}

export const signOut = () => {
  return Firebase.auth().signOut()
}

/*
  returns array of change records
  {
    type: <string>
    id: <string>
    record: <data>
  }
*/
export const watchArtworkCollection = (dataCallback) => {
  // TODO: save ref to unListen to call
  return dbRef.collection('artwork').onSnapshot(querySnapshot => {
    const changeRecords = []
    querySnapshot.docChanges().forEach(docChange => {
      const { doc, type, } = docChange
      const { id, } = doc
      const record = doc.data()
      changeRecords.push({
        id,
        type,
        record,
      })
    })
    dataCallback(changeRecords)
  })
}

/*
  returns array of change records
  {
    type: <string>
    id: <string>
    record: <data>
  }
*/
export const watchArtistsCollection = (dataCallback) => {
  // TODO: save ref to unListen to call
  return dbRef.collection('artists').onSnapshot(querySnapshot => {
    const changeRecords = []
    querySnapshot.docChanges().forEach(docChange => {
      const { doc, type, } = docChange
      const { id, } = doc
      const record = doc.data()
      changeRecords.push({
        id,
        type,
        record,
      })
    })
    dataCallback(changeRecords)
  })
}

/*
  returns array of change records
  {
    type: <string>
    id: <string>
    record: <data>
  }
*/
export const watchBookmarksCollection = (userId, dataCallback) => {
  // TODO: save ref to unListen to call
  return dbRef.collection('bookmarks')
    .where('userId', '==', `${userId}`)
    .onSnapshot(querySnapshot => {
      const changeRecords = []
      querySnapshot.docChanges().forEach(docChange => {
        const { doc, type, } = docChange
        const { id, } = doc
        const record = doc.data()
        changeRecords.push({
          id,
          type,
          record,
        })
      })
      dataCallback(changeRecords)
    })
}

export const watchImagesCollection = (userId, dataCallback) => {
  return dbRef.collection('images')
    .where('userId', '==', `${userId}`)
    .onSnapshot(querySnapshot => {
      const changeRecords = []
      querySnapshot.docChanges().forEach(docChange => {
        const { doc, type, } = docChange
        const { id, } = doc
        const record = doc.data()
        changeRecords.push({
          id,
          type,
          record,
        })
      })
      dataCallback(changeRecords)
    })
}

export const watchLikesCollection = (userId, dataCallback) => {
  return dbRef.collection('likes')
    .where('userId', '==', `${userId}`)
    .onSnapshot(querySnapshot => {
      const changeRecords = []
      querySnapshot.docChanges().forEach(docChange => {
        const { doc, type, } = docChange
        const { id, } = doc
        const record = doc.data()
        changeRecords.push({
          id,
          type,
          record,
        })
      })
      dataCallback(changeRecords)
    })
}

export const watchVisitsCollection = (userId, dataCallback) => {
  return dbRef.collection('visits')
    .where('userId', '==', `${userId}`)
    .onSnapshot(querySnapshot => {
      const changeRecords = []
      querySnapshot.docChanges().forEach(docChange => {
        const { doc, type, } = docChange
        const { id, } = doc
        const record = doc.data()
        changeRecords.push({
          id,
          type,
          record,
        })
      })
      dataCallback(changeRecords)
    })
}
