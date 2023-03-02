<script setup lang="ts">
import Button from '../button/button.vue';
import logoLight from '@/assets/logo-light.svg'
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

type NavProps = {
    param : string
}

const props = defineProps<NavProps>()
const emit = defineEmits(['click', 'toggleShare']);
const router = useRouter()
const auth = getAuth();
const displayUserMenu = ref(false)

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
  // toggle new list from app isntead?
  router.push('/').then(() => {
    emit('click')
  }
    
  )
}

</script>
<template>
  <nav class="navbar">
    <img :src="logoLight" alt="CoList Logo" @click="router.push('/')">
    <div class="navbar--right">
    <Button v-if="props.param == 'list'" text="Share" variant="primary" @click="handleShareList" />
      <font-awesome-icon v-if="props.param == 'home'" icon="plus" @click="emit('click')" />
      <div>      
      <div class="navbar__user">
        <font-awesome-icon icon="circle-user" class="user" @click="toggleUserMenu" />
        <div class="navbar__user--menu" v-if="displayUserMenu">
          <p @click="handleList">Lists</p>
          <div class="divider"></div>
          <p @click="handleNewList">New List</p>
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
