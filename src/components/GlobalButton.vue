<script setup>
defineProps({
  btnStyle: {
    type: [String, Array],
    default: 'bg-red-500 text-white size-auto rounded-full',
  },
  title: {
    type: String,
    default: 'texto',
  },
  extraDiv: {
    type: Boolean,
    default: true,
  }
})
</script>

<template>
  <button :class="['flex items-center justify-between h-12 px-4 gap-2 rounded-full bg-[#261D47]', btnStyle]">
    <span class="flex-1 text-center text-white">{{ title }}</span>
    <i v-if="extraDiv" class="mdi mdi-chevron-right flex items-center justify-center w-9 h-9 text-[#261D47] text-3xl bg-white rounded-full "></i>
  </button>



  <!--
  <GlobalButton :btnStyle="['']" title="Proximo passo" :extraDiv="true" / 
  -->
</template>
