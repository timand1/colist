<script setup lang="ts">
import LoginSidepanel from "@/components/login-sidepanel/login-sidepanel.vue";
import Button from "@/components/button/button.vue";
import logo from "@/assets/logo.svg";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserSessionPersistence   } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

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
  .then((result) => {
    // handle the successful sign-in
    router.push('/')
    console.log("User signed in:", result.user.displayName);
  })
  .catch((error) => {
    // handle sign-in errors
    errorRef.value = !errorRef.value
    console.log("Error signing in:", error.message);
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
