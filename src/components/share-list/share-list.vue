<script setup lang="ts">
import Button from '../button/button.vue';
import { db } from '@/firebase';
import { User } from '@/helpers/types/types';
import { getAuth } from 'firebase/auth';
import { arrayUnion, arrayRemove, doc, updateDoc, query, collection, DocumentData, Query, where, getDocs } from 'firebase/firestore';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { createPopper } from '@popperjs/core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { debounce } from 'lodash';

type ShareListProps = {
    users: User[]
    author : User
    displayShareList : boolean
}

const props = defineProps<ShareListProps>()
const emit = defineEmits(['click']);

const route = useRoute();
const auth = getAuth();
const userInput = ref<string>('')
const foundUsers = ref<User[]>([])
const listUsers = ref(props.users)
const addedUsers = ref<User[]>([])

watch(() => props.users, (newVal) => {  
    listUsers.value = newVal
})

const updateUsers: () => Promise<void> = async () => {
    const listId : string = route.params.id as string
    // Add chosen user to the user array in the list
    console.log([...listUsers.value, ...addedUsers.value]);
    const docRef = doc(db, "lists", listId);
    try {
    await updateDoc(docRef, {
        users:  [...listUsers.value, ...addedUsers.value],
    });

    handleCloseShare();

    } catch (error) {
        console.error('Error adding users:', error);
    }
};

const removeUser: (user: User) => Promise<void> = async (user) => {
    const listId : string = route.params.id as string
    
    const docRef = doc(db, "lists", listId);
    try {
    await updateDoc(docRef, {
        users: arrayRemove(docRef, {name : user.name, id : user.id, img : user.img}),
    });
        console.log('User removed successfully!');
    } catch (error) {
        console.error('Error adding users:', error);
    }
}

const searchUser: () => Promise<void> = async () => {
    foundUsers.value = []

    // Will delay the function by 500 ms after a keyboard event
    searchDatabase()
}

const searchDatabase = debounce(async () => {    
    let words : string | string[] = userInput.value.split(' ');
      const capitalizedWords = words.map(word => {
        const firstLetter = word.charAt(0);
        const restOfWord = word.slice(1);
        return `${firstLetter.toUpperCase()}${restOfWord}`;
      });
      words = capitalizedWords.join(' ')
      console.log(words);
      
      const q = query(
      collection(db, "users"),
      where("name", "<=", words)
    );

    try {
      const querySnapshot = await getDocs(q);      
      querySnapshot.forEach((doc) => {
        foundUsers.value.push(doc.data() as User) 
      })

      popperInstance.value.update()

    } catch (err) {
    //   FIXA
    }
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
    
    userExist == -1 ? addedUsers.value.push(user) : null
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

</script>

<template>
    <section class="share__container">
        <section class="share">
            <div class="search">
                <input type="text" name="search" placeholder=" " v-model="userInput" @keyup="searchUser" @keyup.enter="searchUser" @keydown.escape="clearSearch">
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
                <div class="share__current" v-for="user in listUsers">
                    <div class="share__user" v-if="user.id != auth.currentUser?.uid && auth.currentUser?.uid == props.author.id">
                        <p>{{ user.name }}</p>
                        <img :src="user.img" alt="">
                    </div>
                    <div class="user-remove" v-if="auth.currentUser?.uid == props.author.id && user.id != auth.currentUser?.uid " @click="removeUser(user)"><font-awesome-icon icon="trash-can"/></div>
                    <div class="user-remove" v-if="auth.currentUser?.uid == user.id && user.id != auth.currentUser?.uid" @click="removeUser(user)"><p>Leave</p></div>
                </div>
                <div class="share__added" v-if="addedUsers.length > 0">
                    <p>New users</p>
                    <div class="share__current" v-for="user in addedUsers">
                        <div class="share__user">
                            <p>{{ user.name }}</p>
                            <img :src="user.img" alt="">
                        </div>
                        <div class="user-remove" @click="removeAdded(user)"><font-awesome-icon icon="trash-can"/></div>
                    </div>
                </div>
            </div>
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