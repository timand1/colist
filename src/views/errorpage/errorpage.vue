<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from '@/components/button/button.vue';
const router = useRouter();

</script>
<template>
     <div class="error">
      <h1>Ooops!</h1>
      <p>
        It looks like you've stumbled upon a broken link. Don't worry, it's not
        your fault. It's probably just a glitch in the matrix. Try clicking the button below or head back to the
        homepage. And if the problem persists, don't send us a message and we won't get
        right on it! </p>
        <p>PS: If you're still seeing this page, you may want to check
        if the internet is down or if your device is stuck in a parallel
        universe.</p>
        <Button text="Go back" variant="primary" @click="router.push('/')" />
    </div>
</template>

<style scoped lang="scss">
    @import '@/views/errorpage/errorpage.scss';
</style>