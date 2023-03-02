<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { buttonVariants, defaultVariantMixin } from '@/helpers/mixins/jsMixins';

type ButtonProps = {
    text?: string
    variant?: string
    outline?: boolean
    disabled? : boolean
};

const props = withDefaults(defineProps<ButtonProps>(), {
    text: 'Text',
    variant: 'primary',
    outline: false,
    disabled: false
});
const emit = defineEmits(['click']);

const componentRef = ref();
const buttonVariant = ref<string>(props.variant)
const buttonClass = ref<string>('');

// Check if variant prop is valid
defaultVariantMixin(buttonVariants).verifyVariant(props.variant)
  ? ''
  : (buttonVariant.value = 'primary');

onMounted(() => {
    props.outline 
    ? buttonClass.value = 'button--' + buttonVariant.value + '__outline'
    : buttonClass.value = 'button--' + buttonVariant.value
})

</script>

<template>
  <button
    :role="props.disabled ? 'disabled' : 'button'"
    ref="componentRef"
    class="button"
    :class="buttonClass, props.outline ? 'outline' : ''"
    @click="emit('click')"
    @keyup.enter="emit('click')"
  >
  {{ props.text }}
  </button>
</template>

<style lang="scss" scoped>
@import "@/components/button/button.scss";
</style>