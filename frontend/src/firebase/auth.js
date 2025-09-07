import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

// To start redirect sign-in
export const doSignInWithGoogle = () => signInWithRedirect(auth, provider);

// To handle the result after redirect
export const checkGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      return user;
    }
    return null;
  } catch (err) {
    console.error("Redirect error:", err);
    return null;
  }
};


export const doSignOut = () => signOut(auth);