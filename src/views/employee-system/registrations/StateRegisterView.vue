<script setup>
import GlobalInput from '@/components/global/inputs/GlobalInput.vue';
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStateStore } from '@/stores';
import { HeaderDefault } from '@/components';

const router = useRouter();
const stateStore = useStateStore();

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const formInputs = ref([
  { title: 'Nome do Estado', placeholder: 'ex: São Paulo', value: '', id: 'name' },
  { title: 'Sigla', placeholder: 'ex: SP', value: '', id: 'acronym', maxlength: 2 }
]);

const disabledBtn = computed(() => formInputs.value.some(el => !el.value));

async function submitForm() {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const stateData = {
      name: formInputs.value[0].value,
      acronym: formInputs.value[1].value.toUpperCase()
    };

    await stateStore.CreateState(stateData);

    successMessage.value = 'Estado cadastrado com sucesso!';
    formInputs.value.forEach(input => input.value = '');

    setTimeout(() => {
      successMessage.value = '';
      router.push('/employee'); 
    }, 1500);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao cadastrar o estado. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50">
    <HeaderDefault />

    <div class="flex justify-center p-4 md:p-8">
      <div class="w-full xl:w-full bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Cadastro de Estado</h2>
          <p class="text-gray-600">Preencha os dados para cadastrar um novo estado</p>
        </div>

        <!-- Messages -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>

        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p class="text-green-700 text-sm">{{ successMessage }}</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="flex flex-col gap-2">
            <label class="font-semibold text-[#261D47] text-sm md:text-base">{{ formInputs[0].title }}</label>
            <GlobalInput
              :placeholder="formInputs[0].placeholder"
              v-model:value="formInputs[0].value"
              class_input="bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-semibold text-[#261D47] text-sm md:text-base">{{ formInputs[1].title }}</label>
            <GlobalInput
              :placeholder="formInputs[1].placeholder"
              v-model:value="formInputs[1].value"
              :maxlength="formInputs[1].maxlength"
              class_input="bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors w-full uppercase"
            />
          </div>

          <!-- Buttons -->
          <div class="flex flex-col md:flex-row gap-4 pt-6 border-t border-gray-200 mt-8">
            <GlobalButton
              :action="() => router.back()"
              :extra-div="false"
              title="Cancelar"
              :btn-style="`
                bg-gray-300 text-[#261D47] rounded-xl px-8 py-3 font-semibold
                transition-all duration-200 w-full md:w-auto
                hover:bg-gray-400 hover:shadow-lg transform hover:scale-105
              `"
            />
            <GlobalButton
              :action="submitForm"
              :disabled="disabledBtn || isLoading"
              :extra-div="false"
              :title="isLoading ? 'Cadastrando...' : 'Cadastrar'"
              :btn-style="`
                bg-[#261D47] text-white rounded-xl px-8 py-3 font-semibold
                transition-all duration-200 w-full md:w-auto
                ${disabledBtn || isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[#3a2a5f] hover:shadow-lg transform hover:scale-105'
                }
              `"
            />
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
