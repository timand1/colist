import { ref } from "vue";

const activeList = ref<string>()

export function getActiveListId() {
    return activeList.value
} 

export function setActiveListId(id : string) {
    activeList.value = id
} 