<script setup lang="ts">
import { ref } from 'vue';
import { listTypes } from '@/helpers/mixins/jsMixins';
import Button from '@/components/button/button.vue';
import { doc, setDoc, Timestamp } from "firebase/firestore"; 
import { auth, db } from '@/firebase';
import { useRouter } from "vue-router";

const emit = defineEmits(['click']);

const listname = ref<string>('')
const listtype = ref<string>('')
const addItemRef = ref()
const nameError = ref(false)
const listTypeError = ref(false)
const router = useRouter()
const mouseDown = ref(false)

const createNewList: () => Promise<void> = async () => {  
  const uniqueId = crypto.randomUUID()
  nameError.value = false  
  listTypeError.value = false  
  if(listname.value?.length >= 2 && listtype.value?.length > 0) {
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
      type: listtype.value,
      updated : Timestamp.now(),
      invited: []
    })
    emit('click')
    router.push(`/list/${uniqueId}`)
  } else {
    listname.value?.length < 2 ? nameError.value = true : null
    listtype.value?.length < 1 ? listTypeError.value = true : null
  }
}

const preventSortableTouch: (e : TouchEvent | MouseEvent) => void = (e) => {
  e.stopPropagation();
}

const closeModal = () => {
  mouseDown.value ? null : emit('click')
  mouseDown.value = false
}

</script>

<template>
  <section class="add-list__overlay" @click="closeModal">
    <section class="add-list" ref="addItemRef" @click="preventSortableTouch" @mousedown="mouseDown = true" @mouseup="mouseDown = false">
      <h2>New list</h2>
      <div class="input-container" :class="nameError ? 'input-error' : null">
        <input type="text" name="listname" placeholder=' ' required v-model="listname" @focus="nameError = false" autocomplete="off" >
        <label for="listname">Name</label>
        <p v-if="nameError" class="name__error-text">Min. 2 characters</p>
      </div>
      <div class="select-container" :class="listTypeError ? 'input-error' : null">
        <select name="listtype" required v-model="listtype" @focus="listTypeError = false">
          <option v-for="list in listTypes" :value="list">{{ list }}</option>
        </select>
        <label for="listtype">Type</label>
        <p v-if="listTypeError" class="type__error-text">List type needs to be chosen</p>
      </div>
    <div class="button-container">
      <Button variant="danger" outline text="Cancel" @click="emit('click')" />
      <Button variant="primary" text="Create" @click="createNewList" />
    </div>
  </section>
  </section>
</template>

<style lang="scss" scoped>
  @import '@/components/add-list/add-list.scss';
</style>
