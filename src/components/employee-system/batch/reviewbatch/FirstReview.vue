<script setup>
import { defineEmits } from "vue";

import iconButton from "@/components/global/buttons/IconButton.vue";

const emit = defineEmits(["RelatedProblem"]);

function reportProblem() {
  emit("RelatedProblem");
}
</script>

<template>
  <div
    class="flex flex-col gap-12 justify-center items-center"
  >
    <iconButton
      :title="'Relatar problema'"
      :btnClass="'flex flex-col rounded-xl bg-[#261D47] w-[220px] h-[175px]'"
      :titleClass="'text-white text-lg'"
      @click="reportProblem"
    >
      <i class="mdi mdi-alert-circle text-white text-[75px]" />
    </iconButton>

    <iconButton
      :title="'Confirmar lote'"
      :btnClass="'flex flex-col rounded-xl bg-[#261D47] w-[220px] h-[175px]'"
      :titleClass="'text-white text-lg'"
    >
      <i class="mdi mdi-check-circle text-white text-[75px]" />
    </iconButton>
  </div>
</template>
