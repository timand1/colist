<script setup lang="ts">
import { ref } from 'vue';
import { listTypes } from '@/helpers/mixins/jsMixins';
import Button from '@/components/button/button.vue';
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '@/firebase';
import { useRouter } from "vue-router";

const emit = defineEmits(['click']);

const listname = ref<string>('')
const listtype = ref<string>('')
const addItemRef = ref()
const createError = ref(false)
const router = useRouter()

const createNewList: () => Promise<void> = async () => {  
  const uniqueId = crypto.randomUUID()
  createError.value = false  
  if(listname.value?.length > 2 && listtype.value?.length > 0) {
    await setDoc(doc(db, "lists", uniqueId), {
      author : {
        name : auth.currentUser?.displayName,
        id : auth.currentUser?.uid,
        img : auth.currentUser?.photoURL,
        email : auth.currentUser?.email
      },
      name: listname.value,
      id : uniqueId,
      list: [],
      users: [{
        name : auth.currentUser?.displayName,
        id : auth.currentUser?.uid,
        img : auth.currentUser?.photoURL,
        email : auth.currentUser?.email
      }],
      type: listtype.value
    })
    emit('click')
    router.push(`/list/${uniqueId}`)
  } else {
    createError.value = true  
  }
}

const preventSortableTouch: (e : TouchEvent | MouseEvent) => void = (e) => {
    e.stopPropagation();
}

</script>

<template>
  <section class="add-list__overlay" @click="emit('click')">
    <section class="add-list" ref="addItemRef" @click="preventSortableTouch">
      <h2>New list</h2>
      <div class="input-container" :class="createError ? 'input-error' : null">
        <input type="text" name="listname" placeholder=' ' required v-model="listname" @focus="createError = false">
        <label for="listname">Name</label>
      </div>
      <div class="select-container" :class="createError ? 'input-error' : null">
        <select name="listtype" required v-model="listtype" @focus="createError = false">
          <option v-for="list in listTypes" :value="list">{{ list }}</option>
        </select>
        <label for="listtype">Type</label>
        <p v-if="createError" class="error-text">List name needs to be atleast 2 characters long and a list type needs to be chosen</p>
      </div>
    <div class="button-container">
      <Button variant="danger" text="Cancel" @click="emit('click')" />
      <Button variant="primary" text="Create" @click="createNewList" />
    </div>
  </section>
  </section>
</template>

<style lang="scss" scoped>
  @import '@/components/add-list/add-list.scss';
</style>
