<template>
  <svg class="logo" width="74" height="74" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M37 22.1865L19.5 32.2702L2 42.3729V2L19.5 12.0838L37 22.1865ZM37 22.1865L54.5 12.0838L72 2V42.3729L54.5 32.2702L37 22.1865Z" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M37 72L72 42.373L54.5 32.2703L37 22.1865M37 72V22.1865M37 72L2 42.373L19.5 32.2703L37 22.1865" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script lang="ts">
export default {
  name: "Logo"
};

</script>

<style lang="scss" scoped>
@use '@/styles/colors';
  .logo {
    path {
      stroke: colors.$primary-font;
    }
  }

  body.dark {
    .logo {
      path {
        stroke: colors.$primary-font-dark;
      }
    }
  }
</style>