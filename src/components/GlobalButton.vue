<script setup>
  const props = defineProps({
    btnStyle: {
      type: String,
      default: '[bg-red-500 text-white w-32 h-12 rounded-lg]',
      required: true,
    },
    tittle: {
      type: String,
      default: 'texto',
      required: true,
    },
    extraDiv:{
      type: Boolean,
      default: false,
    }
  })
</script>

<template>
  <button :class="btnStyle">
    {{ tittle }}
    <div v-if="$props.extraDiv">

    </div>
  </button>

</template>
