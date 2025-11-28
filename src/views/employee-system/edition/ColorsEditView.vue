<script setup>
import GlobalInput from '@/components/global/inputs/GlobalInput.vue';
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, computed, onMounted } from 'vue';
import { useColorStore } from '@/stores';
import { HeaderDefault } from '@/components';
import { useRouter, useRoute } from 'vue-router';

const colorStore = useColorStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const colorId = route.params.id; // ID da cor que vamos editar

const formInputs = ref([
  {
    title: 'Nome da Cor',
    placeholder: 'ex: Azul Royal',
    value: '',
    id: 'name'
  },
  {
    title: 'Código Hexadecimal',
    placeholder: 'ex: #FF5733',
    value: '',
    id: 'hex',
    type: 'color'
  }
]);

const disabledBtn = computed(() => {
  return formInputs.value.some(el => el.value === '') || !isValidHex(formInputs.value[1].value)
});

function isValidHex(hex) {
  if (!hex) return false;
  return /^#[0-9A-F]{6}$/i.test(hex);
}

function handleColorChange(e) {
  formInputs.value[1].value = e.target.value.toUpperCase();
}

// Carrega os dados da cor para edição
async function loadColor() {
  isLoading.value = true;
  try {
    const color = await colorStore.GetColorById(colorId); // criar método no store se não existir
    console.log(color)
    formInputs.value[0].value = color.name;
    formInputs.value[1].value = color.hex.toUpperCase();
  } catch (error) {
    errorMessage.value = 'Erro ao carregar a cor.';
  } finally {
    isLoading.value = false;
  }
}

async function submitForm() {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
 const colorData = {
  id: colorId, // <-- AQUI
  name: formInputs.value[0].value,
  hex: formInputs.value[1].value.toUpperCase()
};

    await colorStore.UpdateColor(colorData); // criar método no store para update

    successMessage.value = 'Cor atualizada com sucesso!';
    setTimeout(() => {
      successMessage.value = '';
      router.push('/employee'); // voltar para lista de cores
    }, 1500);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao atualizar a cor. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadColor();
});
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50">
    <HeaderDefault />

    <div class="flex justify-center p-4 md:p-8">
      <div class="w-full xl:w-full bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Editar Cor</h2>
          <p class="text-gray-600">Altere os dados da cor</p>
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

          <div class="flex flex-col gap-4 md:flex-row md:gap-6 md:items-end">
            <!-- Hex Input -->
            <div class="flex-1 flex flex-col gap-2">
              <label class="font-semibold text-[#261D47] text-sm md:text-base">{{ formInputs[1].title }}</label>
              <input
                type="text"
                :placeholder="formInputs[1].placeholder"
                v-model="formInputs[1].value"
                class="bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors w-full uppercase"
                @input="(e) => formInputs[1].value = e.target.value.toUpperCase()"
              />
              <p v-if="!isValidHex(formInputs[1].value) && formInputs[1].value" class="text-red-500 text-xs">
                Formato inválido. Use: #RRGGBB
              </p>
            </div>

            <!-- Color Picker -->
            <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
              <div class="flex flex-col gap-2">
                <label class="font-semibold text-[#261D47] text-xs">Seletor</label>
                <input
                  type="color"
                  :value="isValidHex(formInputs[1].value) ? formInputs[1].value : '#000000'"
                  @input="handleColorChange"
                  class="w-16 h-12 rounded-xl cursor-pointer border-2 border-gray-200"
                />
              </div>

              <div
                v-if="isValidHex(formInputs[1].value)"
                :style="{ backgroundColor: formInputs[1].value }"
                class="w-16 h-12 rounded-xl border-2 border-gray-300 shadow-md"
              ></div>
            </div>
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
              :title="isLoading ? 'Atualizando...' : 'Atualizar'"
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
