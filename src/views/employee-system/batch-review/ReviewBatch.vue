<script setup>
import { ref } from "vue";
import { useBatchStore } from "@/stores";

const batchStore = useBatchStore();

import Menu from "@/components/employee-system/layouts/HeaderDefault.vue";
import Button from "@/components/global/buttons/GlobalButton.vue";

import FirstReview from "@/components/employee-system/batch/reviewbatch/FirstReview.vue";
import SecondReview from "@/components/employee-system/batch/reviewbatch/SecondReview.vue";
import ThirdReview from "@/components/employee-system/batch/reviewbatch/ThirdReview.vue";
import FourthReview from "@/components/employee-system/batch/reviewbatch/FourthReview.vue";
import Conclusion from "@/components/employee-system/batch/reviewbatch/ReviewConclusion.vue";

const steps = [FirstReview, SecondReview, ThirdReview, FourthReview, Conclusion];
const currentReview = ref(0);
</script>

<template>
  <div class="h-screen flex flex-col">
    <Menu />

    <form @submit.prevent="submitForm" class="w-screen h-full">
      <div class="w-full h-[5vh] flex flex-col items-center justify-center">
        <div class="text-center">
          <div class="text-lg font-medium">
            Rolo
            <!-- Numero do rolo -->
            /
            <!-- Quantos rolos revisados -->
          </div>
        </div>
      </div>

      <div class="flex flex-col h-[75vh] justify-center items-center">
        <component :is="steps[currentReview]" @RelatedProblem="currentReview++" />
      </div>

      <div class="flex justify-center items-center">
        <div
          v-if="currentReview > 0"
          class="w-full h-[12vh] flex flex-col items-center justify-center"
        >
          <div
            v-if="currentReview >= 1 && currentReview <= 3"
            class="w-full flex justify-center items-center gap-2 py-2"
          >
            <div
              v-for="idx in [1, 2, 3]"
              :key="idx"
              :class="[
                'w-5 h-5 rounded-full',
                currentReview === idx ? 'bg-[#261D47]' : 'bg-gray-300',
              ]"
            ></div>
          </div>
          <div v-if="currentReview < 4" class="flex gap-4">
            <Button
              :title="'Voltar'"
              :btnStyle="'bg-[#261D47] w-[150px] h-[50px] rounded-xl'"
              @click="currentReview--"
            />
            <Button
              :title="'Próximo'"
              :btnStyle="'bg-[#261D47] w-[150px] h-[50px] rounded-2xl'"
              @click="currentReview++"
            >
            </Button>
          </div>
          <div v-else class="flex justify-center items-center w-full">
            <RouterLink
              :to="`/employee/review_batch/${batchStore.selectedId}`"
              class="flex justify-center items-center w-full"
            >
              <Button
                :title="'Concluir revisão'"
                :btnStyle="'bg-[#261D47] w-[220px] h-[48px] rounded-xl text-white text-base font-semibold'"
                type="submit"
              />
            </RouterLink>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
