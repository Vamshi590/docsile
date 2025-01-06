// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup , UserCredential} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth  = getAuth(app);

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt : "select_account"
})
export const signInWithGooglePopup = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  return signInWithPopup(auth, provider);
};


// Apple Provider Setup
export const appleProvider = new OAuthProvider('apple.com');
appleProvider.setCustomParameters({
  prompt: "consent"
});
export const signInWithApplePopup = async (): Promise<UserCredential> => {
  return await signInWithPopup(auth, appleProvider);
};
export {app , auth};
