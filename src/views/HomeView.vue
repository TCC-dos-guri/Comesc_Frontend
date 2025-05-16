<script setup>
import GlobalButton from '@/components/GlobalButton.vue'
</script>

<template>
  <GlobalButton class="teste" :btnStyle="['bg-red-500', 'text-white', 'w-32', 'h-12', 'rounded-lg']" tittle="texto">
    <slot>
      
    </slot>
  </GlobalButton>
</template>

<style scoped>

</style>
