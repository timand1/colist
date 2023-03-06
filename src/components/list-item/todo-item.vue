<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ToDoList } from '@/helpers/types/types';

type ToDoItemProps = {
    item : ToDoList
    delete : boolean
}

const props = defineProps<ToDoItemProps>()
    const emit = defineEmits(['handleDeletItem', 'handleCheckedItem']);
</script>

<template>
    <div class="draggable item" :key="props.item.id">
        <div class="item__info--left">
            <p class="item__name">{{ props.item?.todo }}</p>
            <p class="item__comment" v-if="props.item?.comment">{{ props.item?.comment }}</p>
        </div>
        <div class="item__info--right">
            <div class="checkbox-container checkbox-container--remove" v-if="props.delete" @click="emit('handleDeletItem', props.item)">
                <font-awesome-icon icon="trash-can" />
            </div>

            <div class="checkbox-container checkbox-container--check" v-else>
                <input type="checkbox" name="check" :checked="props.item?.done" @change="emit('handleCheckedItem', props.item)">
                <label for="check"><font-awesome-icon class="checkbox-container--check" icon="check" /></label>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
  @import '@/components/list-item/item.scss';
</style>