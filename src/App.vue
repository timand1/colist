<script setup lang="ts">
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { onBeforeMount, ref, watch, watchEffect } from 'vue';
import { RouterView, useRouter } from 'vue-router';

const router = useRouter()
const auth = getAuth()
const isAuthenticated = ref(false)

onBeforeMount(() => {
  
  onAuthStateChanged(auth, (user) => {
    
    isAuthenticated.value = !!user
    console.log(auth.currentUser?.displayName);
    
    if (isAuthenticated.value) {
      console.log('Logged in');
      router.push('/')
      
    } else {
      console.log('Not Logged In');
      router.push('/login')
    }
  })
})

watch(() => auth, (newVal) => {  
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user
    console.log(auth.currentUser?.displayName);
    if (isAuthenticated.value) {
      isAuthenticated.value = true;
      router.push('/')
      console.log('Logged in');
      
    } else {
      console.log('Not Logged In');
      isAuthenticated.value = false;
      router.push('/login')
    }
  })

})

watchEffect(() => {
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
