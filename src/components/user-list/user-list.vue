<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import DeleteList from '../delete-list/delete-list.vue';
import Button from '@/components/button/button.vue';
import { List, User } from '@/helpers/types/types';
import { ref } from 'vue';

type UserListProps = {
    list : List
}

const props = defineProps<UserListProps>()
const emit = defineEmits(['goToList', 'deleteList', 'removeUser', 'handleDeleteModal']);
const auth = getAuth();

const deleteType = ref('')
const showDeleteModal = ref(false)

const handleDeleteModal = (type : string) => {
  deleteType.value = type
  showDeleteModal.value = !showDeleteModal.value
}

const handleDeleteList = (id : string) => {
    showDeleteModal.value = false
    emit('deleteList', id)
}

const handleLeaveList = (id : string) => {
    showDeleteModal.value = false
    emit('removeUser', id)
}
</script>

<template>
    <div class="list--info" @click="emit('goToList', props.list.id)">
        <h2>{{ props.list.name }}</h2>
        <p v-if="props.list.users.length > 1">Users : {{ props.list.users.length }}</p>
        <p>{{ props.list.type }} - {{ props.list.list.length }} items</p>
    </div>
    <div class="list--remove" v-if="props.list.author.id == auth.currentUser?.uid" @click.stopPropagation="handleDeleteModal('delete')" >
        <font-awesome-icon icon="trash-can"/>
    </div>
    <Button v-else text="Leave" variant="ghost" outline @click.stopPropagation="handleDeleteModal('leave')" />
    <DeleteList v-if="showDeleteModal" :type="deleteType" :list="list" @handle-delete-modal="handleDeleteModal" @handle-delete-list="handleDeleteList" @handle-leave-list="handleLeaveList" />
</template>

<style lang="scss" scoped>
    @import '@/components/user-list/user-list.scss';
</style>