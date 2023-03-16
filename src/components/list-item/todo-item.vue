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

const preventSortableTouch: (e : TouchEvent | MouseEvent) => void = (e) => {
    e.stopPropagation();
}

</script>

<template>
    <div class="draggable item" :key="props.item.id" @click="emit('handleShowAssign', props.item.id)">
        <div class="item__info--left">
            <p class="item__name">{{ props.item?.todo }}</p>
            <div class="item__comment--container" v-if="item.assigned.length > 0 || props.item.comment">
                <div class="assigned-users" v-if="item.assigned.length > 0" >
                    <img v-if="item.assigned.length == 1" :src="item.assigned[0].img" :alt="item.assigned[0].name" :title="item.assigned[0].name">
                    <span class="assigned-container" v-if="item.assigned.length > 1" :title="`${item.assigned.length} users assigned`">{{ item.assigned.length }}</span>
                </div>
                <p class="item__comment" v-if="props?.item.comment">{{ props?.item.comment }}</p>
            </div>
        </div>
        <div class="item__info--right"  @click="preventSortableTouch($event)">
            <div class="checkbox-container checkbox-container--remove" 
                v-if="props.delete" 
                @click.stopPropagation="emit('handleDeletItem', props.item)" 
                @touchstart="preventSortableTouch($event)"
            >
                <font-awesome-icon icon="trash-can" />
            </div>

            <div class="checkbox-container checkbox-container--check" v-else>
                <input type="checkbox" name="check" 
                    :checked="props?.item.done" 
                    @click.stopPropagation="emit('handleCheckedItem', (props.item))" 
                    @click="preventSortableTouch($event)"
                    @touchstart="preventSortableTouch($event)"
                >
                <label for="check"><font-awesome-icon class="checkbox-container--check" icon="check" /></label>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
  @import '@/components/list-item/item.scss';
</style>