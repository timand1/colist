<script setup lang="ts">
import Button from '@/components/button/button.vue';
import { db } from '@/firebase';
import { NumberedList, Shoppinglist, TimeList, ToDoList, User } from '@/helpers/types/types';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, Timestamp, arrayUnion } from 'firebase/firestore';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { createPopper } from '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { debounce } from 'lodash';
import { setUsers, findUser } from '@/composables/setUsers';

type ListItem = Shoppinglist | ToDoList | TimeList | NumberedList;

type ShareListProps = {
    users: User[]
    invited: User[]
    author : User
    displayShareList : boolean
    list : ListItem[]
}

const props = defineProps<ShareListProps>()
const emit = defineEmits(['click']);

const route = useRoute();
const auth = getAuth();
const userInput = ref<string>('')
const foundUsers = ref<User[]>([])
const listUsers = ref(props.users)
const addedUsers = ref<User[]>([])
const errorRef = ref<boolean>(false)
const mouseDown = ref(false)

onMounted(() => {
    setUsers()
})

watch(() => props.users, (newVal) => {  
    listUsers.value = newVal
})

const updateUsers: () => Promise<void> = async () => {
    errorRef.value ? errorRef.value = false : null;
    const listId : string = route.params.id as string
    // Add chosen user to the user array in the list
    const docRef = doc(db, "lists", listId);
    try {
    await updateDoc(docRef, {
        updated : Timestamp.now(),
        // users:  [...listUsers.value, ...addedUsers.value],
        invited : arrayUnion(...addedUsers.value)
    });

    handleCloseShare();

    } catch (error) {
        errorRef.value = !errorRef.value;
    }
};

const removeUser: (user: User) => Promise<void> = async (user) => {
    const listId : string = route.params.id as string
    errorRef.value ? errorRef.value = false : null;
    const updatedUsers = props.users.filter(del => del.id != user.id)
    let updatedAssignedList = [...props.list]
    updatedAssignedList.forEach(function(obj) {
     obj.assigned = obj.assigned.filter(function(u) {
      return u.id !== user.id;
    });
  });
    const docRef = doc(db, "lists", listId);
    try {
    await updateDoc(docRef, {
        updated : Timestamp.now(),
        list : updatedAssignedList,
        users: updatedUsers,
    });

    } catch (error) {
        errorRef.value = !errorRef.value;
    }
}

const searchUser: (input : any) => Promise<void> = async (input) => {  
    userInput.value = input.value
    foundUsers.value = []

    // Will delay the function by 500 ms after a keyboard event
    searchDatabase()
}

const searchDatabase = debounce(async () => {    
    errorRef.value ? errorRef.value = false : null;
    foundUsers.value = userInput.value.length >= 2 ? findUser(userInput.value) : []
}, 500);

const popperInstance = computed(() => {
    const wrapperElem = document.querySelector('.search') as HTMLElement;
    const selectElem = document.querySelector('.search__found') as HTMLElement;
    
    return createPopper(wrapperElem, selectElem, {
        placement: 'auto-start',
        modifiers: [
      {
        name: 'flip',
        options: {
            allowedAutoPlacements: [`bottom-end`, `top-end`],
        },
    },
    {
        name: 'offset',
        options: {
            offset: [0, 2],
        },
    },
    ],
    strategy: 'absolute',
    });
});

const addUser: (user : User) => void = (user) => {
    foundUsers.value = []
    userInput.value = ''  
    
    const userExist = listUsers.value.findIndex(currentUser => currentUser.id == user.id)

    const newUser = {
        name : user.name,
        email : user.email,
        id : user.id,
        img : user.img
    }
    
    userExist == -1 ? addedUsers.value.push(newUser) : null
}

const clearSearch: () => void = () => {
    userInput.value = ''
    foundUsers.value = []
}

const handleCloseShare: () => void = () => {
    addedUsers.value = []
    emit('click')
}

const removeAdded: (user : User) => void = (user) => {
    addedUsers.value = addedUsers.value.filter(x => x.id != user.id)
}

const preventClose: (e : TouchEvent | MouseEvent) => void = (e) => {
    e.stopPropagation();
}

const closeModal = () => {
    mouseDown.value ? null : emit('click')
    mouseDown.value = false
}

const removeInvited = async (user : User) => {
    const listId : string = route.params.id as string
    errorRef.value ? errorRef.value = false : null;
    const updateInvited = props.users.filter(del => del.id != user.id)
    let updatedAssignedList = [...props.list]
    updatedAssignedList.forEach(function(obj) {
     obj.assigned = obj.assigned.filter(function(u) {
      return u.id !== user.id;
    });
  });
    const docRef = doc(db, "lists", listId);
    try {
    await updateDoc(docRef, {
        updated : Timestamp.now(),
        invited : updateInvited,
    });

    } catch (error) {
        errorRef.value = !errorRef.value;
    }
}

</script>

<template>
    <section class="share__container" @click="closeModal">
        <section class="share" @click="preventClose($event)" @mousedown="mouseDown = true" @mouseup="mouseDown = false">
            <div class="search">
                <input 
                    type="text"
                    name="search"
                    placeholder=" "
                    :value="userInput"
                    @input="searchUser($event.target)"
                    @keyup.enter="searchUser($event)"
                    @keydown.escape="clearSearch"
                    autocomplete="off"
                >
                <font-awesome-icon class="search__clear" icon="xmark" v-if="userInput.length > 0" @click="clearSearch" />
                <label for="search">Search user</label>
                <div class="search__found" :style="{ display : foundUsers.length <= 0 ? 'none' : 'flex'}" >
                <div class="search__user" v-for="user in foundUsers" @click="addUser(user)" >
                    <div class="search__user--info">
                        <p class="name">{{ user.name }}</p>
                        <p class="email">{{ user.email }}</p>
                    </div>
                    <img :src="user.img" alt="">
                </div>
                </div>
            </div>
            <div class="share__users">
                <div class="active-users">
                    <h4 class="share__added--headline">Current users <span v-if="auth.currentUser?.uid == author.id">(Author excluded)</span></h4>
                    <div class="share__current" v-for="user in listUsers">
                        <div class="share__user" v-if="auth.currentUser?.uid != props.author.id || user.id != props.author.id">
                            <img :src="user.img" alt="">
                            <div class="share__user--info">
                                <p>{{ user.name }}</p>
                                <p class="email">{{ user.email }}</p>
                            </div>
                        </div>
                        <div class="user-remove" v-if="auth.currentUser?.uid == props.author.id && user.id != auth.currentUser?.uid " @click="removeUser(user)"><Button variant="ghost" text="Remove" /></div>
                        <div class="user-remove" v-if="auth.currentUser?.uid != props.author.id && user.id == auth.currentUser?.uid" @click="removeUser(user)"><Button variant="ghost" text="Leave" /></div>
                    </div>
                </div>
                <div class="share__added" v-if="addedUsers.length > 0">
                    <h4 class="share__added--headline">New users</h4>
                    <div class="share__current" v-for="user in addedUsers">
                        <div class="share__user">
                            <img :src="user.img" alt="">
                            <div class="share__user--info">
                                <p>{{ user.name }}</p>
                                <p class="email">{{ user.email }}</p>
                            </div>
                        </div>
                        <div class="user-remove" @click="removeAdded(user)" ><Button variant="ghost" text="Remove" /></div>
                    </div>
                </div>
                <div class="share__added" v-if="invited?.length > 0">
                    <h4 class="share__added--headline">Invited users</h4>
                    <div class="share__current" v-for="user in invited">
                        <div class="share__user">
                            <img :src="user.img" alt="">
                            <div class="share__user--info">
                                <p>{{ user.name }}</p>
                                <p class="email">{{ user.email }}</p>
                            </div>
                        </div>
                        <div class="user-remove" @click="removeInvited(user)"><Button variant="ghost" text="Remove" /></div>

                        </div>
                </div>
            </div>
            <p v-if="errorRef" class="error-text">Something went wrong... Try again</p>
            <div class="share__buttons">
                <Button text="Cancel" variant="danger" outline @click="handleCloseShare" />
                <Button text="Update" variant="primary" :disabled="addedUsers.length > 0 ? false : true" @click="updateUsers" />
            </div>
        </section>
    </section>
</template>

<style lang="scss" scoped>
    @import '@/components/share-list/share-list.scss';
</style>