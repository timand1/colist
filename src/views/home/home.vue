<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { onBeforeMount, onMounted, ref, watch, watchEffect } from 'vue';
import AddList from '@/components/add-list/add-list.vue';
import Navbar from '@/components/navbar/navbar.vue';
import { db } from '@/firebase';
import { doc, onSnapshot, collection, query, where, updateDoc, deleteField, deleteDoc, getDoc } from 'firebase/firestore';
import { type List } from '@/helpers/types/types'
import router from '@/router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const auth = getAuth()
const addOverlay = ref<boolean>(false)
const lists = ref()
const loader = ref<boolean>(true)

onBeforeMount(async () => {
  // const listsRef = collection(db, "lists");
  // console.log(auth.currentUser);
  
  // console.log(listsRef);
  
// const authorQuery = query(listsRef, where("author", "==", auth.currentUser?.displayName));
// const userQuery = query(listsRef, where("users", "array-contains", auth.currentUser?.displayName));
  // const authorRef = db.collection("list").where("author", "array-contains", "auth.currentUser");

  // userRef.get().then((querySnapshot) => {
  // querySnapshot.forEach((doc) => {
  //   console.log(doc.id, " => ", doc.data());
  // });
// });
// console.log(authorQuery);



// const matchingLists = await getDocs(authorQuery);
// matchingLists.forEach((doc) => {
//   console.log(doc.data());
// });
// console.log(matchingLists);



})
const isAuthenticated = ref(false)
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
  

  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user
    console.log(auth.currentUser?.displayName);
    if (isAuthenticated.value) {
      const userQuery = query(collection(db, "lists"), where("users", "array-contains", auth.currentUser?.uid));
      loader.value = false
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
    const getLists : List[]  = []
      querySnapshot.forEach((doc) => {
        getLists.push(doc.data() as List);
      });
      lists.value = getLists  
    });
      
    } else {
      console.log('Not Logged In');
      isAuthenticated.value = false;
      router.push('/login')
    }
  })

})

const goToList: (listId: string) => void = (listId) => {
  router.push(`/list/${listId}`)
}

const deleteList: (listId: string, e:Event) => Promise<void> = async (listId, e) => {
  e.stopPropagation()
  await deleteDoc(doc(db, 'lists', listId))
}

const removeUser: (listId: string, users: string[], e : Event) => Promise<void> = async (listId, users, e) => {
  e.stopPropagation()
  const listRef = doc(db, "lists", listId);  
  const listDoc = await getDoc(listRef);
  if (listDoc.exists()) {
    
    const currentUsers = listDoc.data().users;
    const updatedUsers = currentUsers.filter((userId : string) => userId !== auth.currentUser?.uid);
    await updateDoc(listRef, { users: updatedUsers });
    console.log(`Removed ${auth.currentUser?.displayName} from the users array of list ${listId}`);
    // ---------------------- stop click on parent --------------------------------
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
    <Navbar param="home" @click="handleOverlasy" />
    <div class="lists--container" v-if="!loader">
    <h2>{{ auth.currentUser?.displayName }}</h2>
    <section class="list--container">
    <div v-for="list in lists" @click="goToList(list.id)" class="list">
      <div class="list--info">
        <h2>{{ list.name }}</h2>
        <p v-if="list.users.length > 0">Users : {{ list.users.length }}</p>
        <p>{{ list.type }}</p>
      </div>
      <div class="list--remove" v-if="list.author == auth.currentUser?.displayName" @click="deleteList(list.id, $event)" ><font-awesome-icon icon="trash-can"/></div>
      <div class="list--remove" v-else @click="removeUser(list.id, list.users, $event)" ><p>Leave</p></div>
    </div>
    </section>
  </div>
  <section v-else>
    <p>loading..</p>
  </section>
    <AddList v-if="addOverlay" @click=" addOverlay = !addOverlay" :displayOverlay="addOverlay" />
  </section>
</template>

<style lang="scss" scoped>
  @import '@/views/home/home.scss';
</style>
