<script setup lang="ts">
import Button from '../button/button.vue';
import Logo from '@/assets/logo.svg'
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useDetectOutsideClick from '@/composables/clickOutsideComponent';
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core'
import { onMounted, watch } from 'vue';

type NavProps = {
    param : string
}

const props = defineProps<NavProps>()
const emit = defineEmits(['click', 'toggleShare']);
const router = useRouter()
const auth = getAuth();
const displayUserMenu = ref(false)
const userMenuRef = ref()

const handleShareList: () => void = () => { 
  emit('toggleShare')
}

const toggleUserMenu: () => void = () => { 
  displayUserMenu.value = !displayUserMenu.value
}

const handleSignOut = () => {
  toggleUserMenu()
  signOut(auth).then(() => {
    router.push('/login')
  }).catch((error) => {

  });
}

const handleList: () => void = () => { 
  toggleUserMenu()
  router.push('/')
}

const handleNewList: () => void = () => { 
  toggleUserMenu()
  emit('click')
}

const handleFavorite: () => void = () => { 
  toggleUserMenu()
  router.push('/favorite')
}

const handleHelp: () => void = () => { 
  toggleUserMenu()
  router.push('/help')
}

useDetectOutsideClick(userMenuRef, () => {
  displayUserMenu.value = false
});

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
  <nav class="navbar">
    <img :src="Logo" alt="CoList Logo" @click="router.push('/')">
    <div class="navbar--right">
      <font-awesome-icon :icon="store ? 'sun' : 'moon'" class="dark-mode" @click="toggleDarkmode" :title="store ? 'Light Mode' : 'Dark Mode'"/>
      <Button v-if="props.param == 'list'" text="Share" variant="primary" @click="handleShareList" />
      <font-awesome-icon v-if="props.param == 'home'" icon="plus" @click="emit('click')" title="Create new list" />
      <div>      
      <div class="navbar__user" ref="userMenuRef">
        <img class="navbar__user--image" :src="auth.currentUser!.photoURL!" :alt="auth.currentUser!.displayName!" title="User menu" @click="toggleUserMenu" >
        <div class="navbar__user--menu" v-if="displayUserMenu">
          <p @click="handleList">Lists</p>
          <div class="divider"></div>
          <p @click="handleNewList">New List</p>
          <div class="divider"></div>
          <p @click="handleFavorite">Favorites</p>
          <div class="divider"></div>
          <p @click="handleHelp">Help</p>
          <div class="divider"></div>
          <p @click="handleSignOut">Sign out</p>
        </div>
      </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
    @import '@/components/navbar/navbar.scss';
</style>
