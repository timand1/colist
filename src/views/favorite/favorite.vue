<script setup lang="ts">
import Button from '@/components/button/button.vue';
import UserFavorite from '@/components/user-favorite/user-favorite.vue';
import Navbar from '@/components/navbar/navbar.vue';
import AddList from '@/components/add-list/add-list.vue';
import { auth, db } from '@/firebase';
import { FavoriteItems } from '@/helpers/types/types';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { computed, onMounted, ref } from 'vue';
import { Sortable } from "sortablejs-vue3"

const userInput = ref()
const favoriteList = ref<FavoriteItems[]>([])
const loader = ref(false)
const inputError = ref(false)
const addOverlay = ref<boolean>(false)

onMounted(() => { 
  const userRef = doc(db, "users", auth.currentUser?.uid!);
  onSnapshot(userRef, (docSnap) => {    
    if (docSnap.exists()) {      
        favoriteList.value = docSnap.data().favorites;      
    } 
  })
})

const handleAddFavorite = async () => {
    if(userInput.value.length >= 2) {
        inputError.value = false;
        const newFavorite = {
            item : userInput.value,
            amount : 1,
            comment: "",
        }
        loader.value = true
        const userRef = doc(db, "users", auth.currentUser?.uid!);
        await updateDoc(userRef, {
            favorites: arrayUnion(newFavorite)
        });
        userInput.value = ''
        loader.value = false
    } else {
        inputError.value = true;
    }
}

const handleRemoveFavorite = async (item : FavoriteItems) => {
    loader.value = true
    const updatedFavorites = [...favoriteList.value].filter(fav => fav.item != item.item)
    const userRef = doc(db, "users", auth.currentUser?.uid!);
    await updateDoc(userRef, {
        favorites: updatedFavorites
    });
    loader.value = false
}

const favOptions = computed(() => {
  return {
    draggable: ".draggable",
    animation: 250,
    delay:  window.matchMedia("(max-width: 480px)").matches ? 100 : 1,
    delayOnTouchOnly: false
  };
});

const moveItem = async (evt: any) => {
  const newIndex = evt.newIndex;
  const oldIndex = evt.oldIndex;
  const newList = favoriteList.value;
  const [removed] = newList.splice(oldIndex, 1);
  newList.splice(newIndex, 0, removed);
  favoriteList.value = [...newList];
  
  const docRef = doc(db, "users", auth.currentUser?.uid!);
  try {
    await updateDoc(docRef, {
      favorites : favoriteList.value
    });    
    loader.value = false;
  } catch (error) {
    loader.value = false;
  }
};

const handleOverlay: () => void = () => { 
  addOverlay.value = !addOverlay.value
}

</script>

<template>
    <section class="favorite">
        <Navbar param="favorite" @click="handleOverlay" />
        <section v-if="loader" class="loader"></section>
        <h2>Favorites</h2>
        <form class="favorite__add" @submit.prevent="handleAddFavorite">
            <div class="input-container" :class="{'input-error' : inputError}">
                <input type="text" name="favorite" placeholder=" " v-model="userInput" :maxlength="30" autocomplete="off"  @focus="inputError = false">
                <label for="favorite">Favorite</label>
                <p v-if="inputError" class="input-error__text">Min. 2 characters</p>
            </div>
            <Button type="submit" variant="primary" text="Add" />
        </form>
        <Sortable
        :key="JSON.stringify(favoriteList)"
        :item-key="auth.currentUser?.uid"
        :list="favoriteList"
        :options="favOptions"
        class="favorite__container"
        ref="sortable"
        @update="moveItem"
        >
        <template #item="{element}">
            <UserFavorite
            :favorite="element"
            @handleRemoveFavorite="handleRemoveFavorite"
            />
        </template>
        </Sortable>
        <div v-if="favoriteList?.length == 0" class="empty">
        <h4>Empty</h4>
        <p>You have no favorites at this moment</p>
      </div>
      <AddList v-if="addOverlay" @click=" addOverlay = !addOverlay" :displayOverlay="addOverlay" />
    </section>
</template>

<style lang="scss" scoped>
    @import '@/views/favorite/favorite.scss';    
</style>