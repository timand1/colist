<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Shoppinglist, User } from '@/helpers/types/types';

type ShoppingItemProps = {
    item : Shoppinglist
    delete : boolean
    users: User[]
    showAssign : boolean
}

const props = defineProps<ShoppingItemProps>()
const emit = defineEmits(['updateAmount', 'handleDeletItem', 'handleCheckedItem', 'handleShowAssign']);

const amountArr = ref([1, 2, 3, 4, 5, 6, 7, 8])

const preventSortableTouch: (e : TouchEvent | MouseEvent) => void = (e) => {
    e.stopPropagation();
}

</script>

<template>
    <div class="draggable item" :key="props.item.id" @click="emit('handleShowAssign', props.item.id)">
        <div class="item__info--left">
            <p class="item__name">{{ props?.item.item }}</p>
            <p class="item__comment" v-if="props?.item.comment">{{ props?.item.comment }}</p>
        </div>
        <div class="item__info--right">
            <select name="amount" @touchstart="preventSortableTouch($event)" @click="preventSortableTouch($event)" @change="emit('updateAmount', props.item, parseInt(($event.target as HTMLSelectElement).value))">
                <option v-for="amount in amountArr" :value="amount" :selected="props?.item.amount == amount">{{ amount }}</option>
            </select>
            <div class="checkbox-container checkbox-container--remove" 
                v-if="props.delete" 
                @click="emit('handleDeletItem', props.item)" 
                @touchstart="preventSortableTouch($event)"
            >
                <font-awesome-icon icon="trash-can" />
            </div>

            <div class="checkbox-container checkbox-container--check" v-else>
                <input type="checkbox" name="check" 
                    :checked="props?.item.done" 
                    @click.stopPropagation="emit('handleCheckedItem', (props.item))" 
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