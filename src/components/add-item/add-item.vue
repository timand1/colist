<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, onMounted, computed, reactive } from 'vue';
import Button from '@/components/button/button.vue';
import { db } from '@/firebase';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { useRoute } from 'vue-router';

type AddItemProps = {
    type : string
}

type UserInput = {
    [key: string]: string | number;
}

const props = defineProps<AddItemProps>()

const route = useRoute();
let userInput: UserInput = reactive({amount : 1});
const addItem = ref(false)

const inputFields = computed(() => {    
      switch (props.type) {
        case 'Shoppinglist':
          return [
            { name: 'item', label: 'Item', type: 'text' },
            { name: 'amount', label: 'Amount', type: 'number' },
            { name: 'comment', label: 'Comment', type: 'text' },
          ]
        case 'ToDoList':
          return [
            { name: 'todo', label: 'Todo', type: 'text' },
            { name: 'comment', label: 'Comment', type: 'text' },
          ]
        case 'NumberedList':
          return [
            { name: 'item', label: 'Item', type: 'text' },
            { name: 'placement', label: 'Placement', type: 'number' },
          ]
        default:
          return []
      }
    })
onMounted(() => {
    // props.type == 'Shoppinglist' ?
    // template.value = `` : null
    // console.log(props.type);
    
})

const toggleAddItem: () => void = () => {
    addItem.value = !addItem.value
}

const handleAddItem: () => Promise<void> = async () => {
    const newItem = {...userInput, done : false, id : crypto.randomUUID()}
    const listId : string = route.params.id as string
    
    const listRef = doc(db, "lists", listId);

    await updateDoc(listRef, {
        list: arrayUnion(newItem)
    });

    // Clear input fields
    for (const key in userInput) {
        userInput[key] = '';
    }
    userInput.amount = 1    
}

</script>

<template>
    <section class="add-item">
    <div class="add-item__headline" @click="toggleAddItem">
        <h2>Add item</h2>
        <font-awesome-icon icon="chevron-down" />
    </div>
    <div class="add-item__form" :class="addItem ? 'add-item__form--active' : ''" >
        <div v-for="(input, index) in inputFields" :key="index" class="input-container">
            <input :type="input.type" :required="input.name !== 'comment'" :name="input.name" v-model="userInput[input.name]" placeholder=" " @keyup.enter="handleAddItem">
            <label :for="input.name">{{ input.label }}</label>
        </div>
        <div class="add-item__buttons">
            <Button variant="danger" outline text="Close" @click="toggleAddItem" />
            <Button variant="primary" text="Add" @click="handleAddItem" />
        </div>
    </div>
    </section>
</template>

<style lang="scss" scoped>
  @import '@/components/add-item/add-item.scss';
</style>