<script setup lang="ts">
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { onBeforeMount, ref, watchEffect } from 'vue';
import { RouterView, useRouter } from 'vue-router';

const router = useRouter()
const auth = getAuth()
const isAuthenticated = ref(false)

onBeforeMount(() => {
  console.log(auth.currentUser?.displayName);
  
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user
  })
  if (isAuthenticated.value) {
    console.log('Logged in');
    
  } else {
    console.log('Not Logged In');
    router.push('/login')
  }
})

watchEffect(() => {
  console.log(auth.currentUser);
  onAuthStateChanged(auth, (user) => {
  })
  if (isAuthenticated.value) {
    isAuthenticated.value = true;
    console.log('Logged in');
    
  } else {
    console.log('Not Logged In');
    isAuthenticated.value = false;
    router.push('/login')
  }
})

const handleSignOut = () => {
        signOut(auth).then(() => {
        }).catch((error) => {

        });
    }

</script>
<template>
  <button v-if="auth.currentUser" @click="handleSignOut">Logga ut</button>
  <RouterView />
</template>

<style lang="scss" scoped>

</style>
