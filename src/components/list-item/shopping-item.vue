<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { FavoriteItems, Shoppinglist, User } from '@/helpers/types/types';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

type ShoppingItemProps = {
    item : Shoppinglist
    delete : boolean
    users: User[]
    showAssign : boolean
    favorites : FavoriteItems[]
}

const props = defineProps<ShoppingItemProps>()
const emit = defineEmits(['updateAmount', 'handleDeletItem', 'handleCheckedItem', 'handleShowAssign']);

const amountArr = ref([1, 2, 3, 4, 5, 6, 7, 8])
const isfavorite = ref(false)
onMounted(() => {
    if(props.favorites.filter(favorite => favorite.item == (props.item as Shoppinglist).item).length > 0) {
        isfavorite.value = true
    } else {
        isfavorite.value = false
    }
})

watch(() => props.favorites, (newVal) => {      
    if(props.favorites.filter(favorite => favorite.item == (props.item as Shoppinglist).item).length > 0) {
        isfavorite.value = true
    } else {
        isfavorite.value = false
    }
})

const preventSortableTouch: (e : TouchEvent | MouseEvent) => void = (e) => {
    e.stopPropagation();
}

const handleFavorite = () => {
    if(isfavorite.value) {
        handleRemoveFavorite()
    } else {
        handleAddFavorite()
    }
}

const handleAddFavorite = async () => {
    const newFavorite = {
        item : (props.item as Shoppinglist).item,
        amount : 1,
        comment: "",
    }
    const userRef = doc(db, "users", auth.currentUser?.uid!);
    await updateDoc(userRef, {
        favorites: arrayUnion(newFavorite)
    });
}

const handleRemoveFavorite = async () => {
    const updatedFavorites = [...props.favorites].filter(fav => fav.item != (props.item as FavoriteItems).item)
    const userRef = doc(db, "users", auth.currentUser?.uid!);
    await updateDoc(userRef, {
        favorites: updatedFavorites
    });
}

</script>

<template>
    <div class="draggable item" :key="props.item.id" @click="emit('handleShowAssign', props.item.id)">
        <div class="item__info--left">
            <div class="shop__left">
                <div class="favorite__icon" @click="preventSortableTouch($event)">
                    <font-awesome-icon class="favorite" :class="{'favorite-item' : isfavorite}" icon="heart" @click.stopPropagation="handleFavorite" />
                </div>
                    <p class="item__name">{{ props?.item.item }}</p>
            </div>
            <div class="item__comment--container" v-if="item.assigned.length > 0 || props.item.comment">
                <div class="assigned-users" v-if="item.assigned.length > 0" >
                    <img v-if="item.assigned.length == 1" :src="item.assigned[0].img" :alt="item.assigned[0].name" :title="item.assigned[0].name">
                    <span class="assigned-container" v-if="item.assigned.length > 1" :title="`${item.assigned.length} users assigned`">{{ item.assigned.length }}</span>
                </div>
                <p class="item__comment" v-if="props?.item.comment">{{ props?.item.comment }}</p>
            </div>
        </div>
        <div class="item__info--right" @click="preventSortableTouch($event)">
            <select name="amount" @touchstart="preventSortableTouch($event)" @click="preventSortableTouch($event)" @change="emit('updateAmount', props.item, parseInt(($event.target as HTMLSelectElement).value))">
                <option v-for="amount in amountArr" :value="amount" :selected="props?.item.amount == amount">{{ amount }}</option>
            </select>
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