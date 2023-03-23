<script setup lang="ts">
import Button from '@/components/button/button.vue';
import { FavoriteItems, Shoppinglist } from '@/helpers/types/types';
import { onMounted, ref, watch } from 'vue';

type FavoriteItemProps = {
    favorite : FavoriteItems
    itemList : Shoppinglist[]
}

const props = defineProps<FavoriteItemProps>()
const emit = defineEmits(['handleAddFavorite']);

const isAdded = ref(false)

onMounted(() => {
    isAdded.value = props.itemList.filter(i => i.item == props.favorite.item).length > 0 ? true : false    
})

watch(() => props.itemList, (newVal) => {  
    isAdded.value = props.itemList.filter(i => i.item == props.favorite.item).length > 0 ? true : false
})

</script>

<template>
    <section class="favorite-item" >
        <p>{{ favorite.item }}</p>
        <Button variant="primary" text="Add" :disabled="isAdded" @click="emit('handleAddFavorite', favorite)" />
    </section>
</template>

<style lang="scss" scoped>
    @import '@/components/favorite-item/favorite-item.scss';    
</style>