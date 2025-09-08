<script setup>
import { useBatchStore } from "@/stores";
import { useRollStore } from "@/stores";
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";

// Components
import Menu from "@/components/employee-system/layouts/HeaderDefault.vue";
import BatchInfo from "@/components/employee-system/batch/batchInfo.vue";

</script>

<template>
  <div class="flex flex-col gap-4">
    <Menu />

    <div class="flex justify-center items-center flex-col">
      <i class="text-3xl font-medium">Lote</i>
      <i class="text-4xl font-medium">Nº <!---do lote--></i>
    </div>

    <!--
    Passar as funçoes de cada coisa para o batchinfo
    :hex="findHex(localBatch.value)"
      :cor="findColor(localBatch.value)"
      :composition="localBatch.value.composition"
      :amount_pieces="localBatch.value.qtd"
      :price="localBatch.value.price "
      :material_name="findMaterial(localBatch.value)"
      -->
    <BatchInfo/>

    <div class="flex items-center justify-between p-4 w-full">
      <div class="flex gap-2">
        <div class="flex justify-center items-center w-10 h-10 rounded-full bg-[#261D47]">
          <i class="mdi mdi-plus text-xl text-white" />
        </div>
        <div class="flex items-center">
          <i class="text-sm">Informações</i>
        </div>
      </div>
      <div class="flex gap-4">
        <span class="text-sm">Rolos revisados:</span>
        <span>
          <!-- Quantos rolos revisados -->
        </span>
      </div>
    </div>
    <div class="w-full flex flex-2 p-4 relative"></div>
  </div>
</template>
