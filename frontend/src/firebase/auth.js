import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" }); // always show chooser

export const doSignInWithGoogle = () => 
  {
    try{
    signInWithPopup(auth , provider);
    // signInWithRedirect(auth, provider);
  } catch (err) {
    console.log("SOMETHING WRONG!!!!!!!"); 
  }
}
export const checkGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      console.log("✅ Redirect sign-in success:", user.email);
      return user;
    }
    return null;
  } catch (err) {
    console.error("Redirect error:", err);
    return null;
  }
};

export const doSignOut = () => signOut(auth);
