<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { List } from '@/helpers/types/types';

type UserListProps = {
    list : List
}

const props = defineProps<UserListProps>()
const emit = defineEmits(['goToList', 'deleteList', 'removeUser']);
const auth = getAuth();
</script>

<template>
    <div class="list--info">
        <h2>{{ list.name }}</h2>
        <p v-if="list.users.length > 0">Users : {{ list.users.length }}</p>
        <p>{{ list.type }} - {{ list.list.length }} items</p>
    </div>
    <div class="list--remove" v-if="list.author.id == auth.currentUser?.uid" @click.stopPropagation="emit('deleteList', list.id, $event)" >
        <font-awesome-icon icon="trash-can"/>
    </div>
        <div class="list--remove" v-else @click.stopPropagation="emit('removeUser', list.id, list.users, $event)" >
        <p>Leave</p>
    </div>
</template>

<style lang="scss" scoped>
    @import '@/components/user-list/user-list.scss';
</style>