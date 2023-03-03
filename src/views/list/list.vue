<script setup lang="ts">
import AddItem from '@/components/add-item/add-item.vue';
import AddList from '@/components/add-list/add-list.vue';
import Navbar from '@/components/navbar/navbar.vue';
import ShareList from '@/components/share-list/share-list.vue';
import { auth, db } from '@/firebase';
import router from '@/router';
import { arrayRemove, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { onBeforeMount, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Shoppinglist, ToDoList, NumberedList, User, TimeList } from '@/helpers/types/types';
import { useRoute } from 'vue-router';

type ListItem = Shoppinglist | ToDoList | NumberedList | TimeList;

const route = useRoute();
const list = ref()
const amountArr = ref([1, 2, 3, 4, 5, 6, 7, 8])
const listId = ref<string>('')
const deleteMode = ref(false)
const updateName = ref(false)
const newTitle = ref('')
const loader = ref<boolean>(true)
const displayShareList = ref<boolean>(false)
const addOverlay = ref<boolean>(false)
const prevListId = ref(route.params.id)
const dragIndex = ref<number>(0); // old position
const dragItem = ref<HTMLDivElement | null >();

onBeforeMount(async () => {
  listId.value = route.params.id as string
  if (!listId) {
    router.push('/');
    return;
  }
  
  const docRef = doc(db, "lists", listId.value);
  onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().users.filter((user : User) => user.id == auth.currentUser?.uid) != -1) {
      list.value = docSnap.data();
      newTitle.value = list.value.name
      loader.value = false;
    } else {
      // Redirect / if the list doesnt exist or if the user does not have access to the list
      router.push('/')
    }
  });
  return { list };
    
});

watch(() => route.params.id, (newVal) => {  
  if(prevListId.value != route.params.id) {
    loader.value = true;

    listId.value = route.params.id as string
    if (!listId) {
      router.push('/');
      return;
    }
    
    const docRef = doc(db, "lists", listId.value);
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().users.filter((user : User) => user.id == auth.currentUser?.uid) != -1) {
        list.value = docSnap.data();
        newTitle.value = list.value.name
        loader.value = false;
        
      } else {
        // Redirect / if the list doesnt exist or if the user does not have access to the list
        loader.value = false;
        router.push('/')
      }
    });
    return { list };
  }
})
  
const updateAmount = async (item : Shoppinglist, newAmount : number) => {
  loader.value = true;
  const docRef = doc(db, "lists", listId.value);
  let updatedItem = item
  updatedItem.amount = newAmount
  const updatedList = list.value.list.map((oldItem : Shoppinglist) =>
    oldItem.id === item.id ? updatedItem : oldItem
  );
  try {
    await updateDoc(docRef, {
      list : updatedList
    });
    loader.value = false;
  } catch (error) {
    console.error("Error updating item:", error);
  }
};

const handleDeleteMode: () => void = () => {
  deleteMode.value = !deleteMode.value;
}

const closeDeleteMode: () => void = () => {
  deleteMode.value = !deleteMode.value;
  clearDeleteList()
}

let deleteArr = ref<ListItem[]>([])
const addDeleteItem: (item : Shoppinglist | ToDoList | NumberedList | TimeList) => void = (item) => {

  // Check if item is already in the arr
  const foundIndex = deleteArr.value.findIndex(x => x.id == item.id)
  foundIndex != -1 ? deleteArr.value.splice(foundIndex, 1) : deleteArr.value.push(item)
  
}
const handleCheckedItem: (item : Shoppinglist | ToDoList) => Promise<void> = async (item) => {
  loader.value = true;
  const updatedItem = {...item, done : !item.done}
  const docRef = doc(db, "lists", listId.value);
  const updatedList = list.value.list.map((oldItem : Shoppinglist) =>
    oldItem.id === item.id ? updatedItem : oldItem
  );
  try {
    await updateDoc(docRef, {
      list : updatedList
    });
    loader.value = false;
  } catch (error) {
    console.error("Error updating item:", error);
  }
}

const handleDeleteAll: () => Promise<void> = async () => {
  loader.value = true;
  const docRef = doc(db, "lists", listId.value);
  try {
    await updateDoc(docRef, {
      list : []
    });
    loader.value = false;
  } catch (error) {
    loader.value = false;
    console.error("Error updating item:", error);
  }
  closeDeleteMode()
}

const handleDeleteChosen: () => Promise<void> = async () => {
  loader.value = true;
  const docRef = doc(db, "lists", listId.value);
  try {
    await updateDoc(docRef, {
      list: arrayRemove(docRef, ...deleteArr.value),
    });
    loader.value = false;
  } catch (error) {
    loader.value = false;
    console.error('Error deleting items:', error);
  }
  closeDeleteMode()
}

const clearDeleteList: () => void = () => {
  deleteArr.value = []
}

const changeTitle: () => void = () => {
  updateName.value = !updateName.value
  newTitle.value = list.value.name
}

const handleUpdateName: () => Promise<void> = async () => {
  loader.value = true;
  const docRef = doc(db, "lists", listId.value);
  try {
    await updateDoc(docRef, {
     name : newTitle.value
    });
    loader.value = false;
  } catch (error) {
    loader.value = false;
    console.error("Error updating name:", error);
  }
  updateName.value = !updateName.value
}

const handleShareList: () => void = () => {  
  displayShareList.value = !displayShareList.value
    
}

const handleOverlay: () => void = () => { 
  addOverlay.value = !addOverlay.value
}

const dragStart: (index: number) => void = (index) => {   
  dragIndex.value = index;
  dragItem.value = list.value.list[index];  
}

const drop: (index: number) => Promise<void> = async (index) => { 
  if (index === dragIndex.value) {
    return;
  };
  
  const newList = [...list.value.list];
  newList.splice(dragIndex.value, 1);
  newList.splice(index, 0, dragItem.value);
  list.value.list = newList;
  loader.value = true;

  const docRef = doc(db, "lists", listId.value);
  try {
    await updateDoc(docRef, {
     list : newList
    });
    loader.value = false;
  } catch (error) {
    loader.value = false;
    console.error("Error updating list:", error);
  }

  dragIndex.value = 0;
  dragItem.value = null;
}

const touchIndex = ref<number | null>(null);
const touchStartX = ref<number>(0);
const touchStart: (index:number, e:any) => void = (index, e) => {
  touchIndex.value = index;
  touchStartX.value = e.touches[0].clientX;
}

const touchEnd: (index:number, e:any, id: string) => Promise<void> = async (index, e, id) => {
  if (index !== touchIndex.value) {
    return;
  }
  transformItem.value = `translateX(0px)`
  const touchEndX = e.changedTouches[0].clientX;
  const touchDistance = touchEndX - touchStartX.value;
  
  if (touchDistance > 70) {
    const newList = [...list.value.list];
    newList.splice(index, 1);
    list.value.list = newList;

    const docRef = doc(db, "lists", listId.value);
    try {
      await updateDoc(docRef, {
      list : newList
    });
    loader.value = false;
    } catch (error) {
      loader.value = false;
      console.error("Error updating list:", error);
    }
  }
  
  touchIndex.value = null;
  touchStartX.value = 0;
  const element = document.getElementById(id);
if (element) {
  element.style.transform = `translateX(${0}px)`;
}
}
const transformItem = ref()
const touchMove: (index:number, e:any, id: string) => Promise<void> = async (index, e, id) => {
  if (index !== touchIndex.value) {
    return;
  }

  const touchCurrentX = e.touches[0].clientX;
  const touchDistance = touchCurrentX - touchStartX.value;
  const element = document.getElementById(id);
if (element) {
  element.style.transform = `translateX(${touchDistance}px)`;
}

}

</script>
<template>
    <Navbar param="list" @toggleShare="handleShareList" @click="handleOverlay"/>
    <ShareList v-if="displayShareList" :users="list?.users" :display-share-list="displayShareList" :author="list.author" @click="handleShareList" />
    <section v-if="loader" class="loader"></section>
  <div class="list" v-else>
  <div class="user-container">
    <img class="user-image" v-for="user in list.users" :src="user.img" :alt="`${user.name}'s profile image`">
  </div>
    <div class="list__header">
      <div class="list__header--title" v-if="updateName">
        <input type="text" v-model="newTitle">
        <div class="icon check">
          <font-awesome-icon icon="check" @click="handleUpdateName" />        
        </div>
        <div class="icon cancel">
          <font-awesome-icon icon="xmark" @click="changeTitle" />
        </div>
        
      </div>
      <div class="list__header--title" v-else>
        <h2>{{ list?.name }}</h2>
        <font-awesome-icon icon="pen" @click="changeTitle" />
      </div>
      <p>Author - {{ list?.author.name }}</p>
    </div>
    <AddItem :type="list?.type" />
    <div class="item-container">
      <section v-if="list.type == 'Shopping'">
        <div v-for="(item, index) in list?.list" class="item" 
          :id="item.id"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @drop="drop(index)"
          @touchstart="touchStart(index, $event)"
          @touchend="touchEnd(index, $event, item.id)"
          @touchmove="touchMove(index, $event, item.id)"
        >
        <div class="item__info--left">
          <p class="item__name">{{ item?.item }}</p>
          <p class="item__comment" v-if="item?.comment">{{ item?.comment }}</p>
        </div>
          <div class="item__info--right">
            <select name="amount" @change="updateAmount(item, parseInt(($event.target as HTMLSelectElement).value))">
              <option v-for="amount in amountArr" :value="amount" :selected="item?.amount == amount">{{ amount }}</option>
            </select>
              <div class="checkbox-container checkbox-container--remove" v-if="deleteMode">
                <input type="checkbox" name="remove" id="" @change="addDeleteItem(item)">
                <label for="remove"><font-awesome-icon class="checkbox-container--remove" icon="xmark" /></label>
              </div>

              <div class="checkbox-container checkbox-container--check" v-else>
                <input type="checkbox" name="check" :checked="item?.done" @change="handleCheckedItem(item)">
                <label for="check"><font-awesome-icon class="checkbox-container--check" icon="check" /></label>
                
              </div>
          </div>
      </div>
      </section>
      <section v-else-if="list.type == 'ToDo'">
        <div v-for="(item, index) in list?.list" class="item"
          :id="item.id"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @drop="drop(index)"
          @touchstart="touchStart(index, $event)"
          @touchend="touchEnd(index, $event, item.id)"
          @touchmove="touchMove(index, $event, item.id)"
        >
        <div class="item__info--left">
          <p class="item__name">{{ item?.todo }}</p>
          <p class="item__comment" v-if="item?.comment">{{ item?.comment }}</p>
        </div>
          <div class="item__info--right">
              <div class="checkbox-container checkbox-container--remove" v-if="deleteMode">
                <input type="checkbox" name="remove" id="" @change="addDeleteItem(item)">
                <label for="remove"><font-awesome-icon class="checkbox-container--remove" icon="xmark" /></label>
              </div>

              <div class="checkbox-container checkbox-container--check" v-else>
                <input type="checkbox" name="check" :checked="item?.done" @change="handleCheckedItem(item)">
                <label for="check"><font-awesome-icon class="checkbox-container--check" icon="check" /></label>
              </div>
          </div>
        </div>
      </section>
      <section v-else-if="list.type == 'Time'">
        <div v-for="(item, index) in list?.list" class="item"
          :id="item.id"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @drop="drop(index)"
          @touchstart="touchStart(index, $event)"
          @touchend="touchEnd(index, $event, item.id)"
          @touchmove="touchMove(index, $event, item.id)"
        >
        <div class="item__info--left">
          <p class="item__name">{{ item?.item }}</p>
          <p class="item__comment" v-if="item?.date">{{ item?.date }}</p>
        </div>
          <div class="item__info--right">
            <p class="item__comment" v-if="item?.time">at {{ item?.time }}</p>
              <div class="checkbox-container checkbox-container--remove" v-if="deleteMode">
                <input type="checkbox" name="remove" id="" @change="addDeleteItem(item)">
                <label for="remove"><font-awesome-icon class="checkbox-container--remove" icon="xmark" /></label>
              </div>
          </div>
        </div>
      </section>
    </div>
    <div class="delete__menu" :class="deleteMode ? 'delete__menu--open' : 'delete__menu--closed'">
        <font-awesome-icon icon="trash-can"  v-if="!deleteMode"  @click="handleDeleteMode" />
        <div class="delete__menu--options" v-else>
          <p class="delete__option" @click="closeDeleteMode">Cancel</p>
          <p >|</p>
          <p class="delete__option" @click="handleDeleteAll">Delete All</p>
          <p >|</p>
          <p class="delete__option" @click="handleDeleteChosen">Delete {{ deleteArr.length }}</p>
        </div>
    </div>
    <AddList v-if="addOverlay" @click=" addOverlay = !addOverlay" :displayOverlay="addOverlay" />
  </div>
</template>

<style lang="scss" scoped>
  @import '@/views/list/list.scss';
</style>
