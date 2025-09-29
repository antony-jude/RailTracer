
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-7088683648-93b4e",
  "appId": "1:323976167837:web:6a8b5438460e088730ef74",
  "apiKey": "AIzaSyC78UET10yxWR7ANqI21RxjpAsqHxPAeN0",
  "authDomain": "studio-7088683648-93b4e.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "323976167837"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
