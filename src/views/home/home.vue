<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, watch, watchEffect } from 'vue';
import AddList from '@/components/add-list/add-list.vue';
import Navbar from '@/components/navbar/navbar.vue';
import UserList from '@/components/user-list/user-list.vue';
import { db } from '@/firebase';
import { doc, onSnapshot, collection, query, where, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { User, type List } from '@/helpers/types/types'
import router from '@/router';

const auth = getAuth()
const addOverlay = ref<boolean>(false)
const lists = ref()
const loader = ref<boolean>(true)
const errorRef = ref<boolean>(false)
  
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
          img: auth.currentUser?.photoURL,
          email: auth.currentUser?.email
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
  errorRef.value ? errorRef.value = false : null;
  try {
    await deleteDoc(doc(db, 'lists', listId))
  } catch {
    errorRef.value = !errorRef.value;
  }
  loader.value = false;
}

const removeUser: (listId: string, users: string[], e : Event) => Promise<void> = async (listId, users, e) => {
  e.stopPropagation()
  errorRef.value ? errorRef.value = false : null;
  loader.value = true;
  const listRef = doc(db, "lists", listId);  
  const listDoc = await getDoc(listRef);
  if (listDoc.exists()) {    
    const currentUsers = listDoc.data().users;
    const updatedUsers = currentUsers.filter((user : User) => user.id !== auth.currentUser?.uid);
    await updateDoc(listRef, { users: updatedUsers });
  } else {
    errorRef.value = !errorRef.value;
  }
  loader.value = false;
}
  
const handleOverlay: () => void = () => { 
  addOverlay.value = !addOverlay.value
}

</script>
<template>
  <section class="home">
    <Navbar param="home" @click="handleOverlay" />
    <div class="lists--container" v-if="!loader">
        <div class="home__header">
          <h2>All lists</h2>
          <h3>{{ auth.currentUser?.displayName }}<img :src="auth.currentUser?.photoURL!" alt=""></h3>
        </div>
      <p v-if="errorRef" class="error-text">Something went wrong... Try again</p>
      <section class="list--container">
        <div v-for="list in lists" @click="goToList(list.id)" class="list">
          <UserList :list="list" @deleteList="deleteList" @removeUser="removeUser" />
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
