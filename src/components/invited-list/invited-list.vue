<script setup lang="ts">
import { auth } from '@/firebase';
import { List, User } from '@/helpers/types/types';
import { onMounted, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

type InvitedListProps = {
    list : List
}

const props = defineProps<InvitedListProps>()
const emit = defineEmits(['acceptInvite', 'declineInvite']);
const currentUser = ref<User[]>()
onMounted(() => {
    currentUser.value = props.list.invited.filter(user => user.id == auth.currentUser?.uid)
})


</script>

<template>
    <section class="invited-list">
        <div class="invited__info">
            <div class="invited__top">
                <h3>{{ list.name }}</h3>
            </div>
            <div class="invited__bottom">
                <p>{{ list.author.name }}</p>
                <p>{{ list.type }} - {{ list.users.length }} users</p>
            </div>
        </div>
        <div class="btn-container">
        <div class="icon cancel" @click="emit('declineInvite', list.id )" title="Decline" >
          <font-awesome-icon icon="xmark" />
        </div>
            <div class="icon check" @click="emit('acceptInvite', list.id, currentUser)" title="Accept" >
          <font-awesome-icon icon="check"/>        
        </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    @import '@/components/invited-list/invited-list.scss';
</style>