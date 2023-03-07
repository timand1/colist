<script setup lang="ts">
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Shoppinglist } from '@/helpers/types/types';

type ShoppingItemProps = {
    item : Shoppinglist
    delete : boolean
}

const props = defineProps<ShoppingItemProps>()
const emit = defineEmits(['updateAmount', 'handleDeletItem', 'handleCheckedItem']);

const amountArr = ref([1, 2, 3, 4, 5, 6, 7, 8])

</script>

<template>
    <div class="draggable item" :key="props.item.id" >
        <div class="item__info--left">
            <p class="item__name">{{ props?.item.item }}</p>
            <p class="item__comment" v-if="props?.item.comment">{{ props?.item.comment }}</p>
        </div>
        <div class="item__info--right">
            <select name="amount" @change.stopPropagation="emit('updateAmount', props.item, parseInt(($event.target as HTMLSelectElement).value))">
                <option v-for="amount in amountArr" :value="amount" :selected="props?.item.amount == amount">{{ amount }}</option>
            </select>
            <div class="checkbox-container checkbox-container--remove" 
                v-if="props.delete" 
                @click.native="emit('handleDeletItem', props.item)" 
            >
                <font-awesome-icon icon="trash-can" />
            </div>

            <div class="checkbox-container checkbox-container--check" v-else>
                <input type="checkbox" name="check" 
                    :checked="props?.item.done" 
                    @click.native="emit('handleCheckedItem', (props.item))" 
                >
                <label for="check"><font-awesome-icon class="checkbox-container--check" icon="check" /></label>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
  @import '@/components/list-item/item.scss';
</style>