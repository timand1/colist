<script setup lang="ts">
import { getAuth, GoogleAuthProvider, signInWithPopup  } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { ref } from "vue";

const auth = getAuth();
const errorRef = ref<boolean>(false)

const signInWithGoogle = () => {
    errorRef.value ? errorRef.value = false : null

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      // ----- NOT SURE IF NEEDED, NEED TEST WITHOUT ----
      // If first time logging in with google, create a user and empty userChats
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName : user.displayName,
          email : user.email,
          photoURL: user.photoURL,
        });
      }

      // redirect home
      
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;      
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      errorRef.value = !errorRef.value
      });
  }

</script>

<template>
  <div>
    <button @click="signInWithGoogle"></button>
    <p v-if="errorRef">Something went wrong... Try again</p>
  </div>
</template>

<style lang="scss" scoped>

</style>
