<script setup lang="ts">
import Button from '../button/button.vue';
import logoLight from '@/assets/logo-light.svg'
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
type NavProps = {
    param : string
}

const props = defineProps<NavProps>()
const emit = defineEmits(['click']);
const router = useRouter()
const auth = getAuth();

const handleShareList: () => void = () => {

}

const handleSignOut = () => {
    signOut(auth).then(() => {
    }).catch((error) => {

    });
}

</script>
<template>
  <nav class="navbar">
    <img :src="logoLight" alt="CoList Logo" @click="router.push('/')">
    <button @click="handleSignOut">Logga ut</button>
    <Button v-if="props.param == 'list'" text="Share" variant="primary" @click="handleShareList" />
    <p v-if="props.param == 'home'" @click="emit('click')">LÄGG TILL</p>
    <p v-else>USER MENU</p>
  </nav>
</template>

<style lang="scss" scoped>
    @import '@/components/navbar/navbar.scss';
</style>
