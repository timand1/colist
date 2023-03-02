<script setup lang="ts">
import { ref } from 'vue';
import { listTypes } from '@/helpers/mixins/jsMixins';
import Button from '@/components/button/button.vue';
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from '@/firebase';
import { useRouter } from "vue-router";


type AddItemProps = {
  displayOverlay: boolean
};

// CHECK IF NEEDED
const props = defineProps<AddItemProps>()


const emit = defineEmits(['click']);

const listname = ref<string>('')
const listtype = ref<string>('')
const addItemRef = ref()

const router = useRouter()

const createNewList: () => Promise<void> = async () => {
  
  const uniqueId = crypto.randomUUID()
  console.log(listname.value?.length );
  
  if(listname.value?.length > 2 && listtype.value?.length > 0) {
    await setDoc(doc(db, "lists", uniqueId), {
      author : {
        name : auth.currentUser?.displayName,
        id : auth.currentUser?.uid,
        img : auth.currentUser?.photoURL
      },
      name: listname.value,
      id : uniqueId,
      list: [],
      users: [{
        name : auth.currentUser?.displayName,
        id : auth.currentUser?.uid,
        img : auth.currentUser?.photoURL
      }],
      type: listtype.value
    })
    router.push(`/list/${uniqueId}`)
  } else {
    console.log('wtf dude');
    
  }
}

</script>

<template>
  <section class="add-list__overlay">
    <section class="add-list" ref="addItemRef">
      <h2>New list</h2>
      <div class="input-container">
        <input type="text" name="listname" placeholder=' ' required v-model="listname">
        <label for="listname">Name</label>
      </div>
      <div class="input-container">
        <select name="listtype" required v-model="listtype">
          <option v-for="list in listTypes" :value="list">{{ list }}</option>
        </select>
        <label for="listtype">Type</label>
      </div>
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
