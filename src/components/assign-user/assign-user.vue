<script setup lang="ts">
import Button from '@/components/button/button.vue';
import { db } from '@/firebase';
import { NumberedList, Shoppinglist, TimeList, ToDoList, User } from '@/helpers/types/types';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

type ListItem = Shoppinglist | ToDoList | TimeList | NumberedList;

type AssignUserProps = {
    users : User[]
    item : ListItem
}

const props = defineProps<AssignUserProps>()
const emit = defineEmits(['closeShowAssign']);

const route = useRoute();
const assignedUsers = ref<User[]>([])

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
        list: listData
    });
} 

</script>

<template>
    <section class="assign-user">
        <div class="assign-user__container">

            <div class="users">
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

            <div class="users__assigned">
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
            <Button variant="danger" outline text="Close" @click="emit('closeShowAssign')" />
        </div>
    </section>
</template>

<style lang="scss" scoped>
    @import '@/components/assign-user/assign-user.scss';    
</style>