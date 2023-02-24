<script setup lang="ts">import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { onBeforeMount } from 'vue';


const auth = getAuth()

onBeforeMount(() => {
    onAuthStateChanged(auth, (user) => {
      // logged in
      if (user) {
        const uid = user.uid;
        // redirect to home
      // not logged in
      } else {
        // redirect to login
      }
    });
})
</script>
<template>
  <div>

  </div>
</template>

<style lang="scss" scoped>

</style>
