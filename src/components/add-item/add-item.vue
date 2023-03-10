<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, onMounted, computed, reactive } from 'vue';
import Button from '@/components/button/button.vue';
import { db } from '@/firebase';
import { updateDoc, doc, arrayUnion, getDoc, DocumentReference, DocumentData } from 'firebase/firestore';
import { useRoute } from 'vue-router';
import { NumberedList, User } from '@/helpers/types/types';

type AddItemProps = {
    type : string
}

type UserInput = {
    [key: string]: string | number | boolean | User[]
}

const props = defineProps<AddItemProps>()

const route = useRoute();
let userInput: UserInput = reactive({});
const addItem = ref(false)

const inputFields = computed(() => {    
  switch (props.type) {
    case 'Shopping':
      return [
        { name: 'item', label: 'Item*', type: 'text', req: true },
        { name: 'amount', label: 'Amount', type: 'number', req: true },
        { name: 'comment', label: 'Comment', type: 'text', req: false },
      ]
    case 'ToDo':
      return [
        { name: 'todo', label: 'Todo*', type: 'text', req: true },
        { name: 'comment', label: 'Comment', type: 'text', req: false },
      ]
    case 'Numbered':
      return [
        { name: 'item', label: 'Item*', type: 'text', req: true },
        { name: 'placement', label: 'Placement*', type: 'number', req: true },
      ]
    case 'Time':
      return [
        { name: 'item', label: 'Item*', type: 'text', req: true },
        { name: 'time', label: 'Time*', type: 'time', req: true },
        { name: 'date', label: 'Date', type: 'date', req: false },
      ]
    default:
      return []
  }
})
onMounted(() => {
  props.type == 'Shopping' ? userInput.amount = 1 : null;
})

const toggleAddItem: () => void = () => {
    addItem.value = !addItem.value
}

const handleDefaultAmount: (name : string) => void = (name) => {
  name == 'amount' ? userInput.amount = '' : null
}

const handleAddItem: () => Promise<void> = async () => {
  const newItem : UserInput = props.type == 'Shopping' || props.type == 'ToDO' ? 
    {...userInput, done : false, id : crypto.randomUUID()} 
    : {...userInput, id : crypto.randomUUID()}

  const listId : string = route.params.id as string
  const listRef = doc(db, "lists", listId);
 newItem.assigned = []
  if(props.type == 'Numbered') {
    handleAddNumberedItem(listRef, newItem as NumberedList)
  } else {
    await updateDoc(listRef, {
      list: arrayUnion(newItem)
    });
  }

  // Clear input fields
  for (const key in userInput) {      
      userInput[key] = '';
  }

  props.type == 'Shopping' ? userInput.amount = 1 : null
}

const handleAddNumberedItem: (listRef : DocumentReference<DocumentData>, newItem : NumberedList) => Promise<void> = async (listRef, newItem) => {
  const docSnap = await getDoc(listRef);

  newItem.placement = newItem.placement - 1
  
  let updatedList: NumberedList[] = [...docSnap.data()?.list]
  updatedList.push(newItem)
  updatedList = updatedList.sort((a, b) => a.placement - b.placement);

  const updatedItems: NumberedList[] = updatedList.map((item, index) => {
    return {
      ...item,
      placement: index + 1
    };
  });

  await updateDoc(listRef, {
    list: updatedItems
  });
}

</script>

<template>
    <section class="add-item">
    <div class="add-item__headline" @click="toggleAddItem">
        <h2>Add item</h2>
        <font-awesome-icon icon="chevron-down" :class="addItem ? 'add-item--active' : ''" />
    </div>
    <form @submit.prevent="handleAddItem" class="add-item__form" :class="addItem ? 'add-item__form--active' : ''" >
        <div v-for="(input, index) in inputFields" :key="index" class="input-container">
            <input 
              :type="input.type" 
              :required="input.req" 
              :name="input.name" 
              v-model="userInput[input.name]" 
              placeholder=" " 
              @focus="handleDefaultAmount(input.name)"
              autocomplete="off"
              :maxlength="input.name == 'comment' ? 40 : 20"
            >
            <label :for="input.name">{{ input.label }}</label>
        </div>
        <div class="add-item__buttons">
            <Button type="submit" variant="primary" text="Add" />
        </div>
    </form>
    </section>
</template>

<style lang="scss" scoped>
  @import '@/components/add-item/add-item.scss';
</style>