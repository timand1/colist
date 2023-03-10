<script setup lang="ts">
import AddItem from '@/components/add-item/add-item.vue';
import AddList from '@/components/add-list/add-list.vue';
import Navbar from '@/components/navbar/navbar.vue';
import ShareList from '@/components/share-list/share-list.vue';
import ShoppingItem from '@/components/list-item/shopping-item.vue';
import TodoItem from '@/components/list-item/todo-item.vue';
import TimeItem from '@/components/list-item/time-item.vue';
import NumberedItem from '@/components/list-item/numbered-item.vue';
import AssignUser from '@/components/assign-user/assign-user.vue';
import { auth, db } from '@/firebase';
import router from '@/router';
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { computed, onBeforeMount, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Shoppinglist, ToDoList, User, TimeList, NumberedList } from '@/helpers/types/types';
import { useRoute } from 'vue-router';
import { Sortable } from "sortablejs-vue3"

type ListItem = Shoppinglist | ToDoList | TimeList | NumberedList;

const route = useRoute();
const list = ref()
const listId = ref<string>('')
const deleteMode = ref<boolean>(false)
const loader = ref<boolean>(true)
const updateName = ref<boolean>(false)
const newTitle = ref<string>('')
const displayShareList = ref<boolean>(false)
const addOverlay = ref<boolean>(false)
const errorRef = ref<boolean>(false)
const prevListId = ref<string>(route.params.id as string)
const itemList = ref<ListItem[]>([])
const deleteArr = ref<ListItem[]>([])
const sortable = ref<InstanceType<typeof Sortable> | null>(null);
const showAssign = ref(false)
const assignableItem = ref<number>(0)

onBeforeMount(async () => {
  getList()    
});

watch(() => route.params.id, (newVal) => {  
  if(prevListId.value != route.params.id) {
    loader.value = true;
    getList()
  }
})

const getList: () => void = () => {
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
      itemList.value = list.value.list
      loader.value = false;
    } else {
      // Redirect / if the list doesnt exist or if the user does not have access to the list
      router.push('/')
    }
  });
  return { list };
}

  
const updateAmount = async (item : Shoppinglist, newAmount : number) => {
  loader.value = true;
  errorRef.value ? errorRef.value = false : null;
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
    errorRef.value = !errorRef.value;
  }
};

const handleDeleteMode: () => void = () => {
  deleteMode.value = !deleteMode.value;
}

const closeDeleteMode: () => void = () => {
  deleteMode.value = !deleteMode.value;
  clearDeleteList()
}

const handleCheckedItem: (item : Shoppinglist | ToDoList) => Promise<void> = async (item) => {
  loader.value = true;
  errorRef.value ? errorRef.value = false : null;
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
    errorRef.value = !errorRef.value;
  }
}

const handleDeleteAll: () => Promise<void> = async () => {
  loader.value = true;
  errorRef.value ? errorRef.value = false : null;
  const docRef = doc(db, "lists", listId.value);
  try {
    await updateDoc(docRef, {
      list : []
    });
    loader.value = false;
  } catch (error) {
    loader.value = false;
    errorRef.value = !errorRef.value;
  }
  closeDeleteMode()
}

const handleDeletItem: (item : ListItem ) => Promise<void> = async (item) => {
  loader.value = true;  
  errorRef.value ? errorRef.value = false : null;
  let updatedList = [...list.value.list].filter(del => del.id != item.id)
  const docRef = doc(db, "lists", listId.value);

  if(list.value.type == 'Numbered') {
    updatedList =  updatedList.map((item, index) => {
      return {
        ...item,
        placement: index + 1
      };
    });
  }

  try {
    await updateDoc(docRef, {
      list: updatedList
    });
    loader.value = false;
  } catch (error) {
    loader.value = false;
    errorRef.value = !errorRef.value;
  }
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
  errorRef.value ? errorRef.value = false : null;
  const docRef = doc(db, "lists", listId.value);
  try {
    await updateDoc(docRef, {
     name : newTitle.value
    });
    loader.value = false;
  } catch (error) {
    loader.value = false;
    errorRef.value = !errorRef.value;
  }
  updateName.value = !updateName.value
}

const handleShareList: () => void = () => {  
  displayShareList.value = !displayShareList.value    
}

const handleOverlay: () => void = () => { 
  addOverlay.value = !addOverlay.value
}

const options = computed(() => {
  return {
    draggable: ".draggable",
    animation: 250,
    delay: 100,
    delayOnTouchOnly: false
  };
});

const moveItem = async (evt: any) => {
  const newIndex = evt.newIndex;
  const oldIndex = evt.oldIndex;
  errorRef.value ? errorRef.value = false : null;
  const newList = itemList.value;
  const [removed] = newList.splice(oldIndex, 1);
  newList.splice(newIndex, 0, removed);
  itemList.value = [...newList];
  
  if(list.value.type == 'Numbered') {
    itemList.value =  itemList.value.map((item, index) => {
      return {
        ...item,
        placement: index + 1
      };
    });
  }

  const docRef = doc(db, "lists", listId.value);
  try {
    await updateDoc(docRef, {
     list : itemList.value
    });    
    loader.value = false;
  } catch (error) {
    loader.value = false;
    errorRef.value = !errorRef.value;
  }
};

const handleShowAssign: (id : string) => void = (id) => {
  assignableItem.value = list.value.list.findIndex((item : ListItem) => item.id == id)
  showAssign.value = true;
}

const closeShowAssign: () => void = () => {
  showAssign.value = false;
}

const assignedOnly = ref<boolean>(false)
const assignedItems = ref<ListItem[]>([])
const showAssignedItems: () => void = () => {
  assignedOnly.value = !assignedOnly.value;
  assignedOnly.value ? 
    assignedItems.value = itemList.value.filter(item => {
    const assignedIds = item.assigned.map(user => user.id);
    return assignedIds.includes(auth.currentUser!.uid);
  })
  : null
}

const handleUpdateItem: (item : ListItem) => Promise<void> = async (item) => {
  loader.value = true;
  errorRef.value ? errorRef.value = false : null;
  const docRef = doc(db, "lists", listId.value);
  const updatedList = list.value.list.map((oldItem : Shoppinglist) =>
    oldItem.id === item.id ? item : oldItem
  );
  
  try {
    await updateDoc(docRef, {
     list : updatedList
    });
    loader.value = false;
  } catch (error) {
    loader.value = false;
    errorRef.value = !errorRef.value;
  }
}

</script>

<template>
  <Navbar param="list" @toggleShare="handleShareList" @click="handleOverlay"/>
  <ShareList 
    v-if="displayShareList" 
    :users="list?.users" 
    :display-share-list="displayShareList" 
    :author="list.author" 
    @click="handleShareList" 
  />
  <AssignUser v-if="showAssign" :id="list.id" :type="list.type" :item="list.list[assignableItem]" :users="list.users" @closeShowAssign="closeShowAssign" @handleUpdateItem="handleUpdateItem"/>
  <section v-if="loader" class="loader"></section>
  <div class="list" v-else>
    <div class="user-container" @click="handleShareList">
      <img class="user-image" v-for="user in list.users" :src="user.img" :alt="`${user.name}'s profile image`" :title="user.name">
    </div>
    <div class="list__header">
      <div class="list__header--title" v-if="updateName">
        <input type="text" v-model="newTitle">
        <div class="icon check" @click="handleUpdateName" >
          <font-awesome-icon icon="check"/>        
        </div>
        <div class="icon cancel" @click="changeTitle" >
          <font-awesome-icon icon="xmark" />
        </div>
      </div>
      <div class="list__header--title" v-else>
        <h2>{{ list?.name }}</h2>
        <font-awesome-icon class="change-title" icon="pen" @click="changeTitle" />
      </div>
      <p>Author - {{ list?.author.name }}</p>
    </div>
    <AddItem :type="list?.type" />
    <p v-if="errorRef" class="error-text">Something went wrong... Try again</p>
    <Sortable
      :key="JSON.stringify(itemList)"
      :item-key="list.id"
      :list="assignedOnly ? assignedItems : itemList"
      :options="options"
      class="item-container"
      ref="sortable"
      @update="moveItem"
    >
      <template #item="{element}">
        <ShoppingItem
          v-if="list.type == 'Shopping'"
          :delete="deleteMode"
          :item="element"
          :users="list.users"
          :showAssign="showAssign"
          @updateAmount="updateAmount"
          @handleDeletItem="handleDeletItem"
          @handleCheckedItem="handleCheckedItem"
          @handleShowAssign="handleShowAssign"
        />
        <TodoItem
          v-else-if="list.type == 'ToDo'"
          :delete="deleteMode"
          :item="element"
          :users="list.users"
          :showAssign="showAssign"
          @handleDeletItem="handleDeletItem"
          @handleCheckedItem="handleCheckedItem"
          @handleShowAssign="handleShowAssign"
        />
        <TimeItem
          v-else-if="list.type == 'Time'"
          :delete="deleteMode"
          :item="element"
          :users="list.users"
          :showAssign="showAssign"
          @handleDeletItem="handleDeletItem"
          @handleShowAssign="handleShowAssign"
        />
        <NumberedItem
          v-else-if="list.type == 'Numbered'"
          :delete="deleteMode"
          :item="element"
          :users="list.users"
          :showAssign="showAssign"
          @handleDeletItem="handleDeletItem"
          @handleShowAssign="handleShowAssign"
        />
      </template>
    </Sortable>
    <div class="delete__menu" :class="deleteMode ? 'delete__menu--open' : 'delete__menu--closed'">
        <font-awesome-icon icon="trash-can"  v-if="!deleteMode"  @click="handleDeleteMode" />
        <div class="delete__menu--options" v-else>
          <p class="delete__option" @click="closeDeleteMode">Cancel</p>
          <p >|</p>
          <p class="delete__option" @click="handleDeleteAll">Delete All</p>
        </div>
    </div>
    <div v-if="!deleteMode" >
      <div class="checkbox-container">
      <p>Only assigned</p>
        <input type="checkbox" name="check" 
            :checked="assignedOnly" 
            @click="showAssignedItems"
          >
          <label for="check"><font-awesome-icon class="checkbox-container--check" icon="check" /></label>
      </div>
    </div>
    <AddList v-if="addOverlay" @click=" addOverlay = !addOverlay" :displayOverlay="addOverlay" />
  </div>
</template>

<style lang="scss" scoped>
  @import '@/views/list/list.scss';
</style>
