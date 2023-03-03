<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { onBeforeMount, onMounted, ref, watch, watchEffect } from 'vue';
import AddList from '@/components/add-list/add-list.vue';
import Navbar from '@/components/navbar/navbar.vue';
import { db } from '@/firebase';
import { doc, onSnapshot, collection, query, where, updateDoc, deleteField, deleteDoc, getDoc } from 'firebase/firestore';
import { User, type List } from '@/helpers/types/types'
import router from '@/router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const auth = getAuth()
const addOverlay = ref<boolean>(false)
const lists = ref()
const loader = ref<boolean>(true)

const isAuthenticated = ref(false)
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

watchEffect(() => {
  onAuthStateChanged(auth, (user) => {
    isAuthenticated.value = !!user
    if (isAuthenticated.value) {
      const userQuery = query(collection(db, "lists"), where("users", "array-contains", 
        { name : auth.currentUser?.displayName, 
          id: auth.currentUser?.uid, 
          img: auth.currentUser?.photoURL 
        }
      ));
      loader.value = false
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
    const getLists : List[]  = []
      querySnapshot.forEach((doc) => {
        getLists.push(doc.data() as List);
      });
      lists.value = getLists  
    });
      
    } else {
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
  loader.value = true;
  await deleteDoc(doc(db, 'lists', listId))
  loader.value = false;
}

const removeUser: (listId: string, users: string[], e : Event) => Promise<void> = async (listId, users, e) => {
  e.stopPropagation()
  loader.value = true;
  const listRef = doc(db, "lists", listId);  
  const listDoc = await getDoc(listRef);
  if (listDoc.exists()) {    
    const currentUsers = listDoc.data().users;
    const updatedUsers = currentUsers.filter((user : User) => user.id !== auth.currentUser?.uid);
    await updateDoc(listRef, { users: updatedUsers });

    loader.value = false;
  } else {
    console.log(`List ${listId} does not exist`);
  }
}
  
const handleOverlay: () => void = () => { 
  addOverlay.value = !addOverlay.value
}

</script>
<template>
  <section class="home">
    <Navbar param="home" @click="handleOverlay" />
    <div class="lists--container" v-if="!loader">
      <h2>{{ auth.currentUser?.displayName }}</h2>
      <section class="list--container">
        <div v-for="list in lists" @click="goToList(list.id)" class="list">
          <div class="list--info">
            <h2>{{ list.name }}</h2>
            <p v-if="list.users.length > 0">Users : {{ list.users.length }}</p>
            <p>{{ list.type }} - {{ list.list.length }} items</p>
          </div>
          <div class="list--remove" v-if="list.author.id == auth.currentUser?.uid" @click="deleteList(list.id, $event)" ><font-awesome-icon icon="trash-can"/></div>
          <div class="list--remove" v-else @click="removeUser(list.id, list.users, $event)" ><p>Leave</p></div>
        </div>
      </section>
    </div>
    <section v-else class="loader"></section>
    <AddList v-if="addOverlay" @click=" addOverlay = !addOverlay" :displayOverlay="addOverlay" />
  </section>
</template>

<style lang="scss" scoped>
  @import '@/views/home/home.scss';
</style>
