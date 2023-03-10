<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ToDoList, User } from '@/helpers/types/types';

type ToDoItemProps = {
    item : ToDoList
    delete : boolean
    users: User[]
    showAssign : boolean
}

const props = defineProps<ToDoItemProps>()
const emit = defineEmits(['handleDeletItem', 'handleCheckedItem', 'handleShowAssign']);

const preventSortableTouch: (e : TouchEvent) => void = (e) => {
    e.stopPropagation();
}

</script>

<template>
    <div class="draggable item" :key="props.item.id" @click="emit('handleShowAssign', props.item.id)">
        <div class="item__info--left">
            <p class="item__name">{{ props.item?.todo }}</p>
            <p class="item__comment" v-if="props.item?.comment">{{ props.item?.comment }}</p>
        </div>
        <div class="item__info--right">
            <div class="checkbox-container checkbox-container--remove" v-if="props.delete" @touchstart="preventSortableTouch($event)" @click.stopPropagation="emit('handleDeletItem', props.item)">
                <font-awesome-icon icon="trash-can" />
            </div>

            <div class="checkbox-container checkbox-container--check" v-else>
                <input type="checkbox" name="check" 
                    :checked="props.item?.done" 
                    @change.stopPropagation="emit('handleCheckedItem', props.item)"
                    @touchstart="preventSortableTouch($event)"
                >
                <label for="check"><font-awesome-icon class="checkbox-container--check" icon="check" /></label>
            </div>
        </div>
        <div class="assigned-users" >
            <img v-for="user in item.assigned" :src="user.img" :alt="user.name" :title="user.name">
        </div>
    </div>
</template>

<style lang="scss" scoped>
  @import '@/components/list-item/item.scss';
</style>