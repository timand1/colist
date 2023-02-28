<script setup lang="ts">
import { getActiveListId } from '@/composables/activeList';
import { db } from '@/firebase';
import router from '@/router';
import { doc, getDoc } from "firebase/firestore";
import { onBeforeMount, ref } from 'vue';

const listId = getActiveListId()
const list = ref()
onBeforeMount(() => {
  !listId ? router.push('/') : null
})
const docRef = doc(db, "lists", listId ? listId : '');
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
  list.value = docSnap.data();
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
}
</script>
<template>
  <div>
    {{ list }}
  </div>
</template>

<style lang="scss" scoped>

</style>
