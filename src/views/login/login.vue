<script setup lang="ts">
import LoginSidepanel from "@/components/login-sidepanel/login-sidepanel.vue";
import Button from "@/components/button/button.vue";
import logo from "@/assets/logo.svg";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const auth = getAuth();
const errorRef = ref<boolean>(false)
const router = useRouter()
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
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
          emai: user.email
        });
      }
    router.push('/')
  })
  .catch((error) => {
    errorRef.value = !errorRef.value
  });

  }

</script>

<template>
  <section class="login__container">
    <LoginSidepanel />
    <section class="login">
      <div class="logo-container">
        <img :src="logo" alt="">
        <h2>CoList</h2>
      </div>
        <Button text="Sign in With Google" variant="ghost" outline @click="signInWithGoogle"></Button>
      <p v-if="errorRef">Something went wrong... Try again</p>
    </section>
  </section>
</template>

<style lang="scss" scoped>
    @import '@/views/login/login.scss';
</style>
