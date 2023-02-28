<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';
import AddList from '@/components/add-list/add-list.vue';
import Navbar from '@/components/navbar/navbar.vue';
import { db } from '@/firebase';
import { doc, getDocs, onSnapshot } from 'firebase/firestore';
import { collection, query, where } from "firebase/firestore";

const auth = getAuth()

const addOverlay = ref<boolean>(false)
const lists = ref()
onBeforeMount(async () => {
  const listsRef = collection(db, "lists");
  console.log(listsRef);
  
const authorQuery = query(listsRef, where("author", "==", auth.currentUser?.displayName));
const userQuery = query(listsRef, where("users", "array-contains", auth.currentUser?.displayName));
  // const authorRef = db.collection("list").where("author", "array-contains", "auth.currentUser");

  // userRef.get().then((querySnapshot) => {
  // querySnapshot.forEach((doc) => {
  //   console.log(doc.id, " => ", doc.data());
  // });
// });
// console.log(authorQuery);

const matchingLists = await getDocs(authorQuery);
matchingLists.forEach((doc) => {
  console.log(doc.data());
});
// console.log(matchingLists);



})



  
const handleOverlay: (e:Event) => void = (e) => {
  e.stopPropagation()
  
  addOverlay.value = !addOverlay.value
}

const handleOverlasy: (e:Event) => void = (e) => {
  console.log(addOverlay.value);
  
  addOverlay.value = !addOverlay.value
}

</script>
<template>
  <section class="home">
    <Navbar param="home" @click=" handleOverlasy" />
    <h2>{{ auth.currentUser?.displayName }}</h2>
    <button @click="handleOverlay" >TEST OVERLAY</button>
    <div v-for="list in lists">{{ list }}</div>
    <AddList v-if="addOverlay" @click=" addOverlay = !addOverlay" :displayOverlay="addOverlay" />
  </section>
</template>

<style lang="scss" scoped>
  @import '@/views/home/home.scss';
</style>
