<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { TimeList } from '@/helpers/types/types';

type TimeItemProps = {
    item : TimeList
    delete : boolean
}

const props = defineProps<TimeItemProps>()
const emit = defineEmits(['handleDeletItem']);

const preventSortableTouch: (e : TouchEvent) => void = (e) => {
    e.stopPropagation();
}

</script>

<template>
    <div class="draggable item" :key="props.item.id">
        <div class="item__info--left">
            <p class="item__name">{{ props.item?.item }}</p>
            <p class="item__comment" v-if="props.item?.date">{{ props.item?.date }}</p>
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