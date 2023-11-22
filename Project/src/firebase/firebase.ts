import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { config } from './keys';

const firebaseConfig = config
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Export the necessary Firebase modules for your application
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebaseApp;