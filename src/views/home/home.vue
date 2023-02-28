<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth()

const handleSignOut = () => {
        signOut(auth).then(() => {
        }).catch((error) => {

        });
    }
</script>
<template>
  <div>
    <button @click="handleSignOut">Logga ut</button>
    <h2>{{ auth.currentUser?.displayName }}</h2>
  </div>
</template>

<style lang="scss" scoped>

</style>
