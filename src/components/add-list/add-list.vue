<script setup lang="ts">
import { ref } from 'vue';
import { listTypes } from '@/helpers/mixins/jsMixins';
import Button from '@/components/button/button.vue';
import useDetectOutsideClick from '@/composables/clickOutsideComponent';
import { setActiveListId } from '@/composables/activeList';
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '@/firebase';
import { useRouter } from "vue-router";


type AddItemProps = {
  displayOverlay: boolean
};

const props = withDefaults(defineProps<AddItemProps>(), {

});

const emit = defineEmits(['click']);

const listname = ref<string>('')
const listtype = ref<string>('')
const addItemRef = ref()

const router = useRouter()

const createNewList: () => Promise<void> = async () => {
  
  const newList = {
    author : auth.currentUser?.displayName,
    name: listname.value,
    id : crypto.randomUUID(),
    list: [],
    users: []
  }
  console.log(listname.value?.length );
  
  if(listname.value?.length > 2 && listtype.value?.length > 0) {
    await setDoc(doc(db, "lists", newList.id), {
      newList
    })
    setActiveListId(newList.id)
    router.push(`/list`)
  } else {
    console.log('wtf dude');
    
  }
}

useDetectOutsideClick(addItemRef, () => { 
  props.displayOverlay ?
  emit('click')
  : null
})

</script>

<template>
  <section class="add-list__overlay">
    <section class="add-list" ref="addItemRef">
      {{ props.displayOverlay }}
      <input type="text" name="listname" v-model="listname">
      <select name="listtype" v-model="listtype">
        <option v-for="list in listTypes" :value="list">{{ list }}</option>
    </select>
    <div class="button-container">
      <Button variant="danger" text="Cancel" @click="emit('click')" />
      <Button variant="primary" text="Add" @click="createNewList" />
    </div>
  </section>
  </section>
</template>

<style lang="scss" scoped>
  @import '@/components/add-list/add-list.scss';
</style>
