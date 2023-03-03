<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { onBeforeMount, ref, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';

const router = useRouter()
const auth = getAuth()
const isAuthenticated = ref(false)

onBeforeMount(() => {
  
  onAuthStateChanged(auth, (user) => {    
    isAuthenticated.value = !!user    
    if (!isAuthenticated.value) {
      router.push('/login')
    } 
  })
})

watch(() => auth, (newVal) => {  
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user
    if (isAuthenticated.value) {
      isAuthenticated.value = true;
      router.push('/')      
    } else {
      isAuthenticated.value = false;
      router.push('/login')
    }
  })

})

</script>
<template>
  <RouterView />
</template>

<style lang="scss" scoped>

</style>
