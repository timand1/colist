<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { NoteList, User } from '@/helpers/types/types';
import { ref } from 'vue';
import Button from '../button/button.vue';

type NoteItemProps = {
    item : NoteList
    delete : boolean
    users: User[]
    showAssign : boolean
}

const props = defineProps<NoteItemProps>()
const emit = defineEmits(['handleDeletItem','handleUpdateText', 'handleShowAssign']);
const isEdit = ref(false)
const updatedText = ref(props.item.text)
const preventSortableTouch: (e : TouchEvent | MouseEvent) => void = (e) => {
    e.stopPropagation();
}

const handleEditItem = () => {
  isEdit.value = true
}

const handleCloseEdit = () => {
  isEdit.value = false
}

const updateText = () => {
    const updatedItem = {...props.item, text: updatedText.value}
    emit('handleUpdateText', updatedItem)
}
</script>

<template>
    <div v-if="isEdit" class="edit-note">
    <h3>{{ item.title }}</h3>
    <textarea v-model="updatedText">
        {{ updatedText }}
    </textarea>
    <div class="btn-container">
        <Button class="close-btn" variant="danger" outline text="Close" @click="handleCloseEdit" />
        <Button class="save-btn" variant="primary" :disabled="item.text === updatedText" text="Update" @click="updateText" />
    </div>
    </div>
    <div v-else class="draggable item" :key="props.item.id" @click="emit('handleShowAssign', item.id)">
        <div class="item__info--left">
            <p class="item__name">{{ props.item?.title }}</p>
            <div class="item__comment--container" v-if="item.assigned.length > 0">
                <div class="assigned-users" v-if="item.assigned.length > 0" >
                    <img v-if="item.assigned.length == 1" :src="item.assigned[0].img" :alt="item.assigned[0].name" :title="item.assigned[0].name">
                    <span class="assigned-container" v-if="item.assigned.length > 1" :title="`${item.assigned.length} users assigned`">{{ item.assigned.length }}</span>
                </div>

            </div>
        </div>
        <div class="item__info--right" @click="preventSortableTouch($event)">
            <div class="checkbox-container checkbox-container--remove" 
                v-if="props.delete" 
                @click.stopPropagation="emit('handleDeletItem', props.item)" 
                @touchstart="preventSortableTouch($event)"
            >
                <font-awesome-icon icon="trash-can" />
            </div>
            
            <div 
                v-else
                class="checkbox-container checkbox-container--edit"
                @click.stopPropagation="handleEditItem" 
                @click="preventSortableTouch($event)"
                @touchstart="preventSortableTouch($event)"
            >
                <font-awesome-icon icon="pen-to-square" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
  @import '@/components/list-item/item.scss';
</style>