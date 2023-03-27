<script setup lang="ts">
import { List } from '@/helpers/types/types';
import Button from '../button/button.vue';

type DeleteProps = {
    list : List
    type : string
}

const props = defineProps<DeleteProps>()
const emit = defineEmits(['handleDeleteModal', 'handleDeleteList', 'handleLeaveList']);

</script>

<template>
    <section class="delete__overlay">
        <div class="delete__modal">
            <h3>Confirm</h3>
            <p>Are you sure that you want to {{ type }} <span class="list-name">{{ list.name }}</span>?</p>
            <div class="btn-container">
                <Button variant="primary" outline text="Cancel" @click.stopPropagation="emit('handleDeleteModal')" />
                <Button v-if="type == 'delete'" variant="danger" :text="'Delete'"
                    @click="emit('handleDeleteList', list.id)"
                />
                <Button v-else variant="danger" :text="'Leave'"
                    @click="emit('handleLeaveList', list.id)"
                />
            </div>

        </div>        
    </section>
</template>

<style lang="scss" scoped>
    @import '@/components/delete-list/delete-list.scss';    
</style>