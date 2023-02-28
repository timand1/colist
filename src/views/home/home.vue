<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { onBeforeMount, ref } from 'vue';
import AddList from '@/components/add-list/add-list.vue';
import Navbar from '@/components/navbar/navbar.vue';
import { db } from '@/firebase';
import { doc, getDocs, onSnapshot, collection, query, where, updateDoc, deleteField, deleteDoc, getDoc } from 'firebase/firestore';
import { type List } from '@/helpers/types/types'
import { setActiveListId } from '@/composables/activeList';
import router from '@/router';

const auth = getAuth()
const addOverlay = ref<boolean>(false)
const lists = ref()

onBeforeMount(async () => {
  const listsRef = collection(db, "lists");
  console.log(listsRef);
  
// const authorQuery = query(listsRef, where("author", "==", auth.currentUser?.displayName));
// const userQuery = query(listsRef, where("users", "array-contains", auth.currentUser?.displayName));
  // const authorRef = db.collection("list").where("author", "array-contains", "auth.currentUser");

  // userRef.get().then((querySnapshot) => {
  // querySnapshot.forEach((doc) => {
  //   console.log(doc.id, " => ", doc.data());
  // });
// });
// console.log(authorQuery);

const userQuery = query(collection(db, "lists"), where("users", "array-contains", auth.currentUser?.uid));

const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
const getLists : List[]  = []
  querySnapshot.forEach((doc) => {
    getLists.push(doc.data() as List);
  });
  lists.value = getLists  
});

// const matchingLists = await getDocs(authorQuery);
// matchingLists.forEach((doc) => {
//   console.log(doc.data());
// });
// console.log(matchingLists);



})

const goToList: (listId: string) => void = (listId) => {
  setActiveListId(listId)
  router.push('/list')
}


const deleteList: (listId: string) => Promise<void> = async (listId) => {
  await deleteDoc(doc(db, 'lists', listId))
}

const removeUser: (listId: string, users: string[]) => Promise<void> = async (listId, users) => {
  const listRef = doc(db, "lists", listId);
  console.log();
  
  const listDoc = await getDoc(listRef);
  if (listDoc.exists()) {
    
    const currentUsers = listDoc.data().users;
    const updatedUsers = currentUsers.filter((userId : string) => userId !== auth.currentUser?.uid);
    await updateDoc(listRef, { users: updatedUsers });
    console.log(`Removed ${auth.currentUser?.displayName} from the users array of list ${listId}`);
    // ---------------------- FIX STOPPROP --------------------------------
  } else {
    console.log(`List ${listId} does not exist`);
  }
}
  
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
    <section class="list--container">
    <div v-for="list in lists" @click="goToList(list.id)" class="list">
      <p>{{ list.name }}</p>
      <p v-if="list.users.length > 0">Users : {{ list.users.length }}</p>
      <button v-if="list.author == auth.currentUser?.displayName" @click="deleteList(list.id)">DEL</button>
      <button v-else @click="removeUser(list.id, list.users)">Leave</button>
    </div>
    </section>
    <AddList v-if="addOverlay" @click=" addOverlay = !addOverlay" :displayOverlay="addOverlay" />
  </section>
</template>

<style lang="scss" scoped>
  @import '@/views/home/home.scss';
</style>
