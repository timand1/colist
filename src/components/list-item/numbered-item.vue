<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { NumberedList, User } from '@/helpers/types/types';

type NumberedItemProps = {
    item : NumberedList
    delete : boolean
    users: User[]
    showAssign : boolean
}

const props = defineProps<NumberedItemProps>()
const emit = defineEmits(['handleDeletItem', 'handleShowAssign']);

const preventSortableTouch: (e : TouchEvent | MouseEvent) => void = (e) => {
    e.stopPropagation();
}

</script>

<template>
    <div class="draggable item" :key="props.item.id" @click="emit('handleShowAssign', props.item.id)">
        <div class="item__info--numbered">
            <p class="item__placement">{{ props.item?.placement }}</p>
            <p class="item__name">{{ props.item?.item }}</p>
        </div>
        <div class="item__info--right" @click="preventSortableTouch($event)">
            <div class="checkbox-container checkbox-container--remove" v-if="props.delete" @touchstart="preventSortableTouch($event)" @click.stopPropagation="emit('handleDeletItem', props.item)">
                <font-awesome-icon icon="trash-can" />
            </div>
        </div>
        <div class="assigned-users" v-if="item.assigned.length > 0" >
            <img :src="item.assigned[0].img" :alt="item.assigned[0].name" :title="item.assigned[0].name">
            <img v-if="item.assigned.length > 1" :src="item.assigned[1].img" :alt="item.assigned[1].name" :title="item.assigned[1].name">
            <span v-if="item.assigned.length > 2">+{{ item.assigned.length - 2 }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
  @import '@/components/list-item/item.scss';
</style>