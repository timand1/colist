<script setup lang="ts">
import Logo from "@/assets/logo.vue";
</script>

<template>
  <div class="login-sidepanel">
    <h2>Ever had a situation like this?</h2>
    <div class="thoughtbubble thoughtbubble--left"><p>What ingredients did I have to buy?</p></div>
    <div class="thoughtbubble thoughtbubble--right"><p>What were I suppose bring to the party?</p></div>
    <div class="tagline">
      <h1>Simplify your days</h1>
      <h1>with easy list-making </h1>
      <p>Streamline your tasks with CoList</p>
    </div>
    <Logo />
  </div>
</template>

<style lang="scss" scoped>
    @import '@/components/login-sidepanel/login-sidepanel.scss';
</style>
