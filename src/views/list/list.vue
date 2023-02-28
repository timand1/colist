<script setup lang="ts">
import Navbar from '@/components/navbar/navbar.vue';
import { getActiveListId } from '@/composables/activeList';
import { db } from '@/firebase';
import router from '@/router';
import { doc, getDoc } from "firebase/firestore";
import { onBeforeMount, onMounted, ref } from 'vue';

const listId = getActiveListId()
const list = ref()
onMounted(async () => {
  !listId ? router.push('/') : null
  const docRef = doc(db, "lists", listId ? listId : '');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    list.value = docSnap.data();
    
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
})



</script>
<template>
  <div class="list">
    <Navbar param="list" />
    <h2>{{ list.name }}</h2>
    <p>{{ list.author }}</p>
  </div>
</template>

<style lang="scss" scoped>
  @import '@/views/list/list.scss';
</style>
