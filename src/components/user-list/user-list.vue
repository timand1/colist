<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from '@/components/button/button.vue';
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
        <h2>{{ props.list.name }}</h2>
        <p v-if="props.list.users.length > 1">Users : {{ props.list.users.length }}</p>
        <p>{{ props.list.type }} - {{ props.list.list.length }} items</p>
    </div>
    <div class="list--remove" v-if="props.list.author.id == auth.currentUser?.uid" @click.stopPropagation="emit('deleteList', props.list.id, $event)" >
        <font-awesome-icon icon="trash-can"/>
    </div>
    <Button v-else text="Leave" variant="ghost" outline @click.stopPropagation="emit('removeUser', props.list.id, props.list.users, $event)" />
</template>

<style lang="scss" scoped>
    @import '@/components/user-list/user-list.scss';
</style>