<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { TimeList, User } from '@/helpers/types/types';

type TimeItemProps = {
    item : TimeList
    delete : boolean
    users: User[]
    showAssign : boolean
}

const props = defineProps<TimeItemProps>()
const emit = defineEmits(['handleDeletItem', 'handleShowAssign']);

const preventSortableTouch: (e : TouchEvent) => void = (e) => {
    e.stopPropagation();
}

</script>

<template>
    <div class="draggable item" :key="props.item.id" @click="emit('handleShowAssign', props.item.id)">
        <div class="item__info--left">
            <p class="item__name">{{ props.item?.item }}</p>
            <div class="item__comment--container" v-if="item.assigned.length > 0 || props.item.date">
                <div class="assigned-users" v-if="item.assigned.length > 0" >
                    <img v-if="item.assigned.length == 1" :src="item.assigned[0].img" :alt="item.assigned[0].name" :title="item.assigned[0].name">
                    <span class="assigned-container" v-if="item.assigned.length > 1" :title="`${item.assigned.length} users assigned`">{{ item.assigned.length }}</span>
                </div>
                <p class="item__comment" v-if="props?.item.date">{{ props?.item.date }}</p>
            </div>
        </div>
        <div class="item__info--right">
            <p class="item__comment" v-if="props.item?.time">at {{ props.item?.time }}</p>
            <div class="checkbox-container checkbox-container--remove" 
                v-if="props.delete" 
                @click.stopPropagation="emit('handleDeletItem', props.item)"
                @touchstart="preventSortableTouch($event)"
            >
                <font-awesome-icon icon="trash-can" />
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>
  @import '@/components/list-item/item.scss';
</style>