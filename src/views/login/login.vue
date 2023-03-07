<script setup lang="ts">
import LoginSidepanel from "@/components/login-sidepanel/login-sidepanel.vue";
import Button from "@/components/button/button.vue";
import Logo from "@/assets/logo.vue";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence, GithubAuthProvider  } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import DarkMode from '@/components/dark-mode/dark-mode.vue';

const auth = getAuth();
const errorRef = ref<boolean>(false)
const router = useRouter()

const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    errorRef.value ? errorRef.value = false : null
    setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // sign in the user with Google Sign-In
    return signInWithPopup(auth, provider);
  })
  .then(async (result) => {

    // If first time logging in, create a user in firestore
    const user = result.user
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      } else {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          name : user.displayName,
          img: user.photoURL,
          email: user.email
        });
      }
    router.push('/')
  })
  .catch((error) => {
    errorRef.value = !errorRef.value
  });

  }

const signInWithApple = () => {

}

const signInWithGitHub = () => {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
  .then(async (result) => {
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;

    // The signed-in user info.
    const user = result.user;
    
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      } else {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          name : user.displayName,
          img: user.photoURL,
          email: user.email
        });
      }
    router.push('/')
  }).catch((error) => {
    errorRef.value = !errorRef.value
  });
}

</script>

<template>
  <section class="login__container">
    <LoginSidepanel />
    <section class="login">
    <DarkMode />
      <div class="logo-container">
        <Logo />
        <h2>CoList</h2>
      </div>
          <div class="btn-container">
            <button class="btn btn--google" @click="signInWithGoogle"><font-awesome-icon icon="fa-brands fa-google" /> Continue with Google</button>
            <!-- <button class="btn btn--apple" @click="signInWithApple"><font-awesome-icon icon="fa-brands fa-apple" /> Continue with Apple</button> -->
            <button class="btn btn--github" @click="signInWithGitHub"><font-awesome-icon icon="fa-brands fa-github" /> Continue with GitHub</button>
            <p v-if="errorRef">Something went wrong... Try again</p>
        </div>
    </section>
  </section>
</template>

<style lang="scss" scoped>
    @import '@/views/login/login.scss';
</style>
