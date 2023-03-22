<script setup lang="ts">
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, watch, watchEffect } from 'vue';
import AddList from '@/components/add-list/add-list.vue';
import Navbar from '@/components/navbar/navbar.vue';
import UserList from '@/components/user-list/user-list.vue';
import { db } from '@/firebase';
import { doc, onSnapshot, collection, query, where, updateDoc, deleteDoc, getDoc, Timestamp, arrayUnion } from 'firebase/firestore';
import { User, type List } from '@/helpers/types/types'
import router from '@/router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import InvitedList from '@/components/invited-list/invited-list.vue';

const auth = getAuth()
const addOverlay = ref<boolean>(false)
const lists = ref()
const loader = ref<boolean>(true)
const errorRef = ref<boolean>(false)
const invitedLists = ref()
  
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
      lists.value = getLists.sort((a, b) => (a.updated < b.updated) ? 1 : ((b.updated < a.updated) ? -1 : 0));
    });
      
    } else {
      isAuthenticated.value = false;
      router.push('/login')
    }
  })

})

watchEffect(() => {
    const userQuery = query(collection(db, "lists"), where("invited", "array-contains", 
        { name : auth.currentUser?.displayName, 
          id: auth.currentUser?.uid, 
          img: auth.currentUser?.photoURL,
          email: auth.currentUser?.email
        }
    ));
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
    invitedLists.value = []
      querySnapshot.forEach((doc) => {
        invitedLists.value.push(doc.data() as List);
      });
    });
})

const goToList: (listId: string) => void = (listId) => {
  router.push(`/list/${listId}`)
}

const deleteList: (listId: string) => Promise<void> = async (listId) => {  
  loader.value = true;
  errorRef.value ? errorRef.value = false : null;
  try {
    await deleteDoc(doc(db, 'lists', listId))
  } catch {
    errorRef.value = !errorRef.value;
  }
  loader.value = false;
}

const removeUser: (listId: string) => Promise<void> = async (listId) => {
  errorRef.value ? errorRef.value = false : null;
  loader.value = true;
  const listRef = doc(db, "lists", listId);  
  const listDoc = await getDoc(listRef);
  if (listDoc.exists()) {    
    const currentUsers = listDoc.data().users;
    const updatedUsers = currentUsers.filter((user : User) => user.id !== auth.currentUser?.uid);
    await updateDoc(listRef, { users: updatedUsers, updated : Timestamp.now(), });
  } else {
    errorRef.value = !errorRef.value;
  }
  loader.value = false;
}
  
const handleOverlay: () => void = () => { 
  addOverlay.value = !addOverlay.value
}

const acceptInvite = async (listId: string, user : User[]) => {
  errorRef.value ? errorRef.value = false : null;
  loader.value = true;
  const listRef = doc(db, "lists", listId);  
  const listDoc = await getDoc(listRef);
  if (listDoc.exists()) {    
    const currentInvited = listDoc.data().invited;
    const updatedInvited = currentInvited.filter((user : User) => user.id !== auth.currentUser?.uid);
    await updateDoc(listRef, { invited: updatedInvited, updated : Timestamp.now(), users : arrayUnion(...user) });
  } else {
    errorRef.value = !errorRef.value;
  }
  loader.value = false;
}

const declineInvite = async (listId: string) => {
  errorRef.value ? errorRef.value = false : null;
  loader.value = true;
  const listRef = doc(db, "lists", listId);  
  const listDoc = await getDoc(listRef);
  if (listDoc.exists()) {    
    const currentInvited = listDoc.data().invited;
    const updatedInvited = currentInvited.filter((user : User) => user.id !== auth.currentUser?.uid);
    await updateDoc(listRef, { invited: updatedInvited, updated : Timestamp.now() });
  } else {
    errorRef.value = !errorRef.value;
  }
  loader.value = false;
}

</script>
<template>
  <section class="home">
    <Navbar param="home" @click="handleOverlay" />
    <div class="lists--container">
        <div class="home__header">
          <h2>All lists</h2>
          <h3>{{ auth.currentUser?.displayName }}<img :src="auth.currentUser?.photoURL!" alt=""></h3>
          <p class="invited__info" v-if="invitedLists?.length > 0">You have new lists <font-awesome-icon icon="envelope" title="You have new lists"/> </p>
        </div>
      <p v-if="errorRef" class="error-text">Something went wrong... Try again</p>
      <section class="list--container">
        <div v-for="list in lists" class="list">
          <UserList :list="list" @deleteList="deleteList" @removeUser="removeUser" @goToList="goToList" />
        </div> 
      </section>
      <div v-if="lists?.length == 0" class="empty">
        <h4>Empty</h4>
        <p>You have no list at this moment</p>
      </div>
      <h4 class="invited__headline" v-if="invitedLists?.length > 0">Invited</h4>
      <div class="list--container" v-if="invitedLists?.length > 0">
        <div v-for="list in invitedLists">
          <InvitedList :list="list" @acceptInvite="acceptInvite" @declineInvite="declineInvite" />
        </div>
      </div>
    </div>
    <section v-if="loader" class="loader"></section>
    <AddList v-if="addOverlay" @click=" addOverlay = !addOverlay" :displayOverlay="addOverlay" />
    <font-awesome-icon class="create-icon" icon="pen-to-square" @click="addOverlay = !addOverlay" :displayOverlay="addOverlay" />
  </section>
</template>

<style lang="scss" scoped>
  @import '@/views/home/home.scss';
</style>
