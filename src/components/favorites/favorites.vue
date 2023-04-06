<script setup lang="ts">
import Button from '@/components/button/button.vue';
import FavoriteItem from '@/components/favorite-item/favorite-item.vue';
import { db } from '@/firebase';
import { List, Shoppinglist, FavoriteItems } from '@/helpers/types/types';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { ref, watch } from 'vue';

type FavoritesProps = {
    favorites : FavoriteItems[]
    list : List
}

const props = defineProps<FavoritesProps>()
const emit = defineEmits(['handleFavoriteModal']);

const itemList = ref<Shoppinglist[]>([...props.list.list as Shoppinglist[]])

const handleRemoveFavorite = async (item : Shoppinglist) => {
   
    const newList: Shoppinglist[] = [...props.list.list] as Shoppinglist[]
    const updatedList = newList.filter(i  =>  i.item != item.item)
    const listRef = doc(db, "lists", props.list.id);  
    
    await updateDoc(listRef, {
      list: updatedList
    });
}

const handleAddFavorite = async (item : Shoppinglist) => {
const newItem = {
    item : item.item,
    amount: item.amount,
    comment : item.comment,
    assigned : [],
    done : false,
    id : crypto.randomUUID()
}
  const listRef = doc(db, "lists", props.list.id);
    await updateDoc(listRef, {
      list: arrayUnion(newItem)
    });
}

watch(() => props.list, (newVal) => {  
    itemList.value = [...props.list.list] as Shoppinglist[]
})

</script>

<template>
    <section class="favorites">
        <section class="favorites__container" @scroll="$event.stopPropagation()"  >
            <h4>Favorites</h4>
            <FavoriteItem v-for="favorite in favorites" :key="favorite.item" :favorite="favorite" :itemList="itemList" @handleRemoveFavorite="handleRemoveFavorite" @handleAddFavorite="handleAddFavorite" />
            <Button variant="danger" outline text="Close" @click="emit('handleFavoriteModal')" />
        </section>
    </section>
</template>

<style lang="scss" scoped>
    @import '@/components/favorites/favorites.scss';    
</style>