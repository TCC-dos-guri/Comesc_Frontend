<script setup>
import GlobalInput from '@/components/global/inputs/GlobalInput.vue';
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAddressStore, useSupplierStore } from '@/stores';
import { HeaderDefault } from '@/components';

const router = useRouter();
const route = useRoute();
const supplierStore = useSupplierStore();
const addressStore = useAddressStore();

const isLoading = ref(false);
const isLoadingData = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const addresses = ref([]);
const selectedAddress = ref(null);

const formInputs = ref([
  { title: 'Nome do Supplier', placeholder: 'ex: ACME Ltda.', value: '', id: 'name' },
  { title: 'CNPJ', placeholder: 'ex: 12.345.678/0001-90', value: '', id: 'cnpj' }
]);

const disabledBtn = computed(() => {
  return formInputs.value.some(el => el.value === '') || !selectedAddress.value;
});

onMounted(async () => {
  try {
    // Buscar endereços disponíveis
    addresses.value = await addressStore.GetAddress();

    // Buscar dados do supplier
    const supplierId = route.params.id;
    const supplier = await supplierStore.GetSupplierById(supplierId);

    if (supplier) {
      formInputs.value[0].value = supplier.name;
      formInputs.value[1].value = supplier.cnpj;
      selectedAddress.value = supplier.address.id;
    }
  } catch (error) {
    errorMessage.value = 'Erro ao carregar os dados do supplier.';
  } finally {
    isLoadingData.value = false;
  }
});

async function submitForm() {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const supplierData = {
      id: route.params.id,
      name: formInputs.value[0].value,
      cnpj: formInputs.value[1].value,
      address: selectedAddress.value
    };

    await supplierStore.UpdateSupplier(supplierData);

    successMessage.value = 'Supplier atualizado com sucesso!';

    setTimeout(() => {
      successMessage.value = '';
      router.push('/employee');
    }, 1500);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao atualizar o supplier. Tente novamente.';
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
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Editar Supplier</h2>
          <p class="text-gray-600">Atualize os dados do supplier</p>
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
              <label class="font-semibold text-[#261D47] text-sm md:text-base">Endereço</label>
              <select
                v-model="selectedAddress"
                class="bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors w-full"
              >
                <option disabled value="">Selecione um endereço</option>
                <option v-for="address in addresses" :key="address.id" :value="address.id">
                  {{ address.street }}, {{ address.city }}
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
