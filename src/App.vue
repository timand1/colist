<script setup lang="ts">
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { onBeforeMount, ref, watchEffect } from 'vue';
import { RouterView, useRouter } from 'vue-router';

const router = useRouter()
const auth = getAuth()
const isAuthenticated = ref(false)

onBeforeMount(() => {
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

</script>
<template>
  <RouterView />
</template>

<style lang="scss" scoped>

</style>
