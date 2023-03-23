<script setup lang="ts">
import { FavoriteItems } from '@/helpers/types/types';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

type UserFavoriteProps = {
    favorite : FavoriteItems
}

const props = defineProps<UserFavoriteProps>()
const emit = defineEmits(['handleRemoveFavorite']);



</script>

<template>
    <div class="draggable user-favorite" >
        <p>{{ favorite.item }}</p>
        <div class="remove--favorite" @click.stopPropagation="emit('handleRemoveFavorite', props.favorite)" >
            <font-awesome-icon icon="trash-can"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import '@/components/user-favorite/user-favorite.scss';    
</style>