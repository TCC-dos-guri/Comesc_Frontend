<script setup>
import GlobalInput from '@/components/global/inputs/GlobalInput.vue';
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAddressStore, useStateStore } from '@/stores';
import { HeaderDefault } from '@/components';

const router = useRouter();
const route = useRoute();
const addressStore = useAddressStore();
const stateStore = useStateStore();

const isLoading = ref(false);
const isLoadingData = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const states = ref([]);
const selectedState = ref(null);

const formInputs = ref([
  { title: 'Rua', placeholder: 'ex: Av. Paulista', value: '', id: 'street' },
  { title: 'CEP', placeholder: 'ex: 12345-678', value: '', id: 'cep' },
  { title: 'Número', placeholder: 'ex: 123', value: '', id: 'number', type: 'number' }
]);

const disabledBtn = computed(() => {
  return formInputs.value.some(el => el.value === '') || !selectedState.value;
});

onMounted(async () => {
  try {
    // Buscar estados disponíveis
    states.value = await stateStore.GetStates();

    // Buscar dados do endereço
    const addressId = route.params.id;
    const address = await addressStore.GetAddressById(addressId);

    if (address) {
      formInputs.value[0].value = address.street;
      formInputs.value[1].value = address.cep;
      formInputs.value[2].value = address.number?.toString() || '';
      selectedState.value = address.state.id;
    }
  } catch (error) {
    errorMessage.value = 'Erro ao carregar os dados do endereço.';
  } finally {
    isLoadingData.value = false;
  }
});

async function submitForm() {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const addressData = {
      id: route.params.id,
      street: formInputs.value[0].value,
      cep: formInputs.value[1].value,
      number: formInputs.value[2].value ? parseInt(formInputs.value[2].value) : null,
      state_id: selectedState.value
    };

    await addressStore.UpdateAddress(addressData);

    successMessage.value = 'Endereço atualizado com sucesso!';

    setTimeout(() => {
      successMessage.value = '';
      router.push('/employee');
    }, 1500);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao atualizar o endereço. Tente novamente.';
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
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Editar Endereço</h2>
          <p class="text-gray-600">Atualize os dados do endereço</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingData" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#261D47]"></div>
        </div>

        <!-- Form Content -->
        <div v-else>
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
                class_input="bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors w-full"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-semibold text-[#261D47] text-sm md:text-base">{{ formInputs[2].title }}</label>
              <GlobalInput
                type="number"
                :placeholder="formInputs[2].placeholder"
                v-model:value="formInputs[2].value"
                class_input="bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors w-full"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-semibold text-[#261D47] text-sm md:text-base">Estado</label>
              <select
                v-model="selectedState"
                class="bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors w-full"
              >
                <option disabled value="">Selecione um estado</option>
                <option v-for="state in states" :key="state.id" :value="state.id">
                  {{ state.name }} - {{ state.acronym }}
                </option>
              </select>
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
                :title="isLoading ? 'Atualizando...' : 'Salvar Alterações'"
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
    </div>
  </main>
</template>
