import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyBETukuNR8duMICd1HnF4yWxAgLlRKLBrs',
    authDomain: 'super-5-f8e4f.firebaseapp.com',
    projectId: 'super-5-f8e4f',
    storageBucket: 'super-5-f8e4f.appspot.com',
    messagingSenderId: '669047186444',
    appId: '1:669047186444:web:d987429bffe7fdea5a3a29',
    measurementId: 'G-PK03HK03BM'
}
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
