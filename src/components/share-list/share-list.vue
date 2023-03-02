<script setup lang="ts">
import { db } from '@/firebase';
import { arrayUnion, arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
// Get lodash debound for search func

const route = useRoute();

const userInput = ref()
const addedUsers = ref<string[]>([]) // array of users id

const updateUsers: () => Promise<void> = async () => {
    const listId : string = route.params.id as string
    // Add chosen user to the user array in the list
    const docRef = doc(db, "lists", listId);
    try {
    await updateDoc(docRef, {
        list: arrayUnion(docRef, ...addedUsers.value),
    });
        console.log('Users added successfully!');
    } catch (error) {
        console.error('Error adding users:', error);
    }
};

const removeUser: (id: string) => Promise<void> = async (id) => {
    const listId : string = route.params.id as string
 // Remove chosen user to the user array in the list
    const docRef = doc(db, "lists", listId);
    try {
    await updateDoc(docRef, {
        list: arrayRemove(docRef, id),
    });
        console.log('Users added successfully!');
    } catch (error) {
        console.error('Error adding users:', error);
    }
}

</script>

<template>
    <section class="share__container">
        <section class="share">
        
        </section>
    </section>
</template>

<style lang="scss" scoped>
    @import '@/components/share-list/share-list.scss';
</style>