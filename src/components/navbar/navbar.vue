<script setup lang="ts">
import Button from '../button/button.vue';
import Logo from '@/assets/logo-tab.svg'
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import useDetectOutsideClick from '@/composables/clickOutsideComponent';
import DarkMode from '../dark-mode/dark-mode.vue';
import { ref } from 'vue';

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

const handleHelp: () => void = () => { 
  toggleUserMenu()
  router.push('/help')
}

useDetectOutsideClick(userMenuRef, () => {
  displayUserMenu.value = false
});

</script>
<template>
  <nav class="navbar">
    <img :src="Logo" alt="CoList Logo" @click="router.push('/')">
    <div class="navbar--right">
    <Button v-if="props.param == 'list'" text="Share" variant="primary" @click="handleShareList" />
      <font-awesome-icon v-if="props.param == 'home'" icon="plus" @click="emit('click')" />
      <div>      
      <div class="navbar__user" ref="userMenuRef">
        <font-awesome-icon icon="circle-user" class="user" @click="toggleUserMenu" />
        <div class="navbar__user--menu" v-if="displayUserMenu">
          <p @click="handleList">Lists</p>
          <div class="divider"></div>
          <p @click="handleNewList">New List</p>
          <div class="divider"></div>
          <p @click="handleHelp">Help</p>
          <div class="divider"></div>
          <p @click="handleSignOut">Sign out</p>
        </div>
      </div>
      </div>
    </div>
    <DarkMode />
  </nav>
</template>

<style lang="scss" scoped>
    @import '@/components/navbar/navbar.scss';
</style>
