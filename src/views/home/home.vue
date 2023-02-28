<script setup lang="ts">
import { getAuth, signOut } from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';
import AddList from '@/components/add-list/add-list.vue';

const auth = getAuth()

const addOverlay = ref<boolean>(false)

onBeforeMount(() => {

})

const handleSignOut = () => {
        signOut(auth).then(() => {
        }).catch((error) => {

        });
    }
  
const handleOverlay: (e:Event) => void = (e) => {
  e.stopPropagation()
  addOverlay.value = !addOverlay.value
}

</script>
<template>
  <div>
    <button @click="handleSignOut">Logga ut</button>
    <h2>{{ auth.currentUser?.displayName }}</h2>
    <button @click="handleOverlay" >TEST OVERLAY</button>
    <AddList v-if="addOverlay" @click=" addOverlay = !addOverlay" :displayOverlay="addOverlay" />
  </div>
</template>

<style lang="scss" scoped>

</style>
