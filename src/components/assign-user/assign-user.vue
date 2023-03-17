<script setup lang="ts">
import Button from '@/components/button/button.vue';
import { db } from '@/firebase';
import { NumberedList, Shoppinglist, TimeList, ToDoList, User } from '@/helpers/types/types';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

type ListItem = Shoppinglist | ToDoList | TimeList | NumberedList;

type AssignUserProps = {
    users : User[]
    item : ListItem
    type: string
    id: string
}

const props = defineProps<AssignUserProps>()
const emit = defineEmits(['closeShowAssign', 'handleUpdateItem']);

const route = useRoute();
const assignedUsers = ref<User[]>([])
const userInput = ref(Object.fromEntries(Object.entries(props.item).filter(([key]) => !['done', 'id', 'assigned'].includes(key))))
const inputFields = computed(() => {    
  switch (props.type) {
    case 'Shopping':
      return [
        { name: 'item', label: 'Item*', type: 'text', req: true },
        { name: 'amount', label: 'Amount', type: 'number', req: true },
        { name: 'comment', label: 'Comment', type: 'text', req: false },
      ]
    case 'ToDo':
      return [
        { name: 'todo', label: 'Todo*', type: 'text', req: true },
        { name: 'comment', label: 'Comment', type: 'text', req: false },
      ]
    case 'Numbered':
      return [
        { name: 'item', label: 'Item*', type: 'text', req: true },
        { name: 'placement', label: 'Placement*', min : 1, type: 'number', req: true },
      ]
    case 'Time':
      return [
        { name: 'item', label: 'Item*', type: 'text', req: true },
        { name: 'time', label: 'Time*', type: 'time', req: true },
        { name: 'date', label: 'Date', type: 'date', req: false },
      ]
    default:
      return []
  }
})

onMounted(() => {
    assignedUsers.value = props.users.filter(user => {
       return !props.item.assigned.find(a => a.id === user.id);
    });
})

watch(() => props.item.assigned, (newVal) => {      
    assignedUsers.value = props.users.filter(user => {
       return !newVal.find(a => a.id === user.id);
    });
})

const handleAssignUser: (user : User) => Promise<void> = async (user) => {

    const listId : string = route.params.id as string
    const listRef = doc(db, "lists", listId);
    const listDoc = await getDoc(listRef);
    const listData = [...listDoc.data()?.list];
  
    const itemIndex = listData.findIndex((item : ListItem ) => item.id == props.item.id)
    listData[itemIndex].assigned.push(user)
    
  
    await updateDoc(listRef, {
        updated: Timestamp.now(),
        list: listData
    });
} 

const removeAssignUser: (user : User) => Promise<void> = async (user) => {
    const listId : string = route.params.id as string
    const listRef = doc(db, "lists", listId);
    const listDoc = await getDoc(listRef);
    let listData = [...listDoc.data()?.list];
  
    const itemIndex = listData.findIndex((item : ListItem ) => item.id == props.item.id)
    const assigned = listData[itemIndex].assigned.filter((x : User) => x.id !== user.id);
    listData[itemIndex].assigned = assigned;
    
    await updateDoc(listRef, {
        updated: Timestamp.now(),
        list: listData
    });
}

const updateItem: () => void = () => {
    const updatedItem =  Object.assign({}, props.item, userInput.value);    
    if(props.type == 'Numbered') {        
        if((updatedItem as NumberedList).placement < 1) { updatedItem.placement = 0 }
    }
    
    emit('handleUpdateItem', updatedItem)
}

const preventSortableTouch: (e : TouchEvent | MouseEvent) => void = (e) => {
    e.stopPropagation();
}

</script>

<template>
    <section class="assign-user" @click="emit('closeShowAssign')">
        <div class="assign-user__container" @click="preventSortableTouch">
            <div class="item">
                <div v-for="(input, index) in inputFields" :key="index" class="assign__item">
                <input
                  :type="input.type"
                  :required="input.req"
                  :name="input.name"
                  v-model="userInput[input.name]"
                  placeholder=" "
                  autocomplete="off"
                  :maxlength="input.name == 'comment' ? 40 : 20"
                >
                <label :for="input.name">{{ input.label }}</label>
                </div>
                <div style="display: flex;"><Button variant="primary" text="Update" @click="updateItem" /></div>
            </div>
            <div class="users" v-if="users.length > item.assigned.length">
                <h4>Users</h4>
                <div v-for="user in assignedUsers" class="user">
                    <div class="user__info">
                        <img :src="user.img" alt="">
                        <div  class="user__info--name">
                            <p>{{ user.name }}</p>
                            <p class="email">{{ user.email }}</p>
                        </div>
                    </div>
                    <Button class="assign-btn" variant="ghost" text="Assign" @click="handleAssignUser(user)" />
                </div>
            </div>

            <div class="users__assigned" v-if="item.assigned.length > 0">
                <h4>Assigned</h4>
                <div v-for="user in item.assigned" class="user">
                    <div class="user__info">
                        <img :src="user.img" alt="">
                        <div class="user__info--name">
                            <p>{{ user.name }}</p>
                            <p class="email">{{ user.email }}</p>
                        </div>
                    </div>
                    <Button class="assign-btn" variant="ghost" text="Remove" @click="removeAssignUser(user)" />
                </div>
            </div>
            <Button class="close-btn" variant="danger" outline text="Close" @click="emit('closeShowAssign')" />
        </div>
    </section>
</template>

<style lang="scss" scoped>
    @import '@/components/assign-user/assign-user.scss';    
</style>