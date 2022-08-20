import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCC2isZO_9Z0_72SdwX3s-wJB4tR6h48ZE",
  authDomain: "nextfire-app-itamar.firebaseapp.com",
  projectId: "nextfire-app-itamar",
  storageBucket: "nextfire-app-itamar.appspot.com",
  messagingSenderId: "288920810788",
  appId: "1:288920810788:web:5ea5f43836f61bb457efb1",
  measurementId: "G-C2QM90WZDM"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const increment = firebase.firestore.FieldValue.increment;

// Helper Functions
/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */

export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**
 * Converts a firebase document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
}