<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useLocalStorage } from '@vueuse/core'
import { onMounted, watch } from 'vue';

const store = useLocalStorage('dark-mode', false)

onMounted(() => {
    checkDarkmode(store.value)
})

watch(() => store.value, (newVal) => {  
    checkDarkmode(newVal)
})

const toggleDarkmode: () => void = () => {
    store.value = !store.value
}

const checkDarkmode: (dark : boolean) => void = (dark) => {
    const bodyEl = document.querySelector('body')
    dark ? bodyEl?.classList.add('dark') : bodyEl?.classList.remove('dark');
}


</script>

<template>
    <div class="dark-mode" @click="toggleDarkmode">
        <font-awesome-icon :icon="store ? 'moon' : 'sun'" />
    </div>
</template>

<style lang="scss" scoped>
    @import '@/components/dark-mode/dark-mode.scss';
</style>