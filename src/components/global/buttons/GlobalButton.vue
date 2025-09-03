<script setup>
defineEmits(["click"]);
defineProps({
  btnStyle: {
    type: String,
    default: "text-white size-auto rounded-full flex justify-center",
  },
  title: {
    type: String,
    default: "text-here",
  },
  extraDiv: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: 'mdi-chevron-right'
  },
  action: {
    type: Function,
  },
  color_text: {
    type: String,
    default: 'text-white'
  }
});
</script>
<template>
  <button
    :class="btnStyle"
    @click="action"
  >
    <span :class="`flex-1 font-normal text-md text-center ${color_text} p-1`">{{ title }}</span>
    <i
      v-if="extraDiv"
      :class="`mdi ${icon} flex items-center justify-center w-9 h-9 text-[#261D47] text-xl bg-white rounded-full`"
    ></i>
  </button>

  <!--
  <GlobalButton :btnStyle="['']" title="Proximo passo" :extraDiv="true" /
  -->
</template>
