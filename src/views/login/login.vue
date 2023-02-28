<script setup lang="ts">
import LoginSidepanel from "@/components/login-sidepanel/login-sidepanel.vue";
import Button from "@/components/button/button.vue";
import logo from "@/assets/logo.svg";
import { getAuth, GoogleAuthProvider, signInWithPopup  } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const auth = getAuth();
const errorRef = ref<boolean>(false)
const router = useRouter()

const signInWithGoogle = () => {
    errorRef.value ? errorRef.value = false : null

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;

      router.push('/')
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
