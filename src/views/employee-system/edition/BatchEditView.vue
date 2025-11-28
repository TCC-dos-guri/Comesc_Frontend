<script setup>
import GlobalInput from '@/components/global/inputs/GlobalInput.vue';
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSupplierStore, useColorStore, useBatchStore } from '@/stores';
import { HeaderDefault } from '@/components';

const router = useRouter();
const route = useRoute();
const supplierStore = useSupplierStore();
const colorStore = useColorStore();
const batchStore = useBatchStore();

const isLoading = ref(false);
const isLoadingData = ref(true);
const errorMessage = ref('');
const successMessage = ref('');

const formInputs = ref([
  {
    title: 'Material',
    placeholder: 'Nome ou Código',
    value: '',
    id: 'material'
  },
  {
    title: 'Cor',
    placeholder: 'Selecione a cor',
    value: '',
    id: 'color_id',
    select: true,
    options: []
  },
  {
    title: 'Composição',
    placeholder: 'ex: 80% PA 20% PUE',
    value: '',
    id: 'composition'
  },
  {
    title: 'Nota Fiscal',
    placeholder: 'ex: N 00179',
    value: '',
    id: 'invoice'
  },
  {
    title: 'Preço',
    placeholder: 'ex: R$ 25,00',
    value: '',
    id: 'price'
  },
  {
    title: 'Fornecedor',
    placeholder: 'Selecione o fornecedor',
    value: '',
    id: 'supplier_id',
    select: true,
    options: []
  },
  {
    title: 'Peso',
    placeholder: 'ex: 500kg',
    value: '',
    id: 'weight'
  },
  {
    title: 'Qtd. de Rolos',
    placeholder: 'ex: 12',
    value: '',
    id: 'rolls_quantity'
  },
  {
    title: 'Imagem da Malha',
    media: true,
    value: '',
    id: 'image',
    showimg: null,
    existingImage: null
  }
]);

const supplierOptions = computed(() =>
  supplierStore.suppliers?.map(s => ({ value: s.id, label: s.name })) || []
);

const colorOptions = computed(() =>
  colorStore.colors?.map(c => ({ value: c.id, label: c.name })) || []
);

const disabledBtn = computed(() => {
  return formInputs.value.filter(el => !el.media).some(el => el.value === '');
});

function ChangeImg(e) {
  const imageInput = formInputs.value[formInputs.value.length - 1];
  imageInput.value = e.target.files[0];
  imageInput.showimg = URL.createObjectURL(e.target.files[0]);
}

onMounted(async () => {
  try {
    // Carregar opções de fornecedores e cores
    await supplierStore.GetSuppliers();
    await colorStore.GetColors();

    // Atualizar opções nos selects
    formInputs.value[1].options = colorOptions.value;
    formInputs.value[5].options = supplierOptions.value;

    // Buscar dados do lote
    const batchId = route.params.id;
    const batch = await batchStore.GetBatchById(batchId);

    if (batch) {
      formInputs.value[0].value = batch.material;
      formInputs.value[1].value = batch?.color.id;
      formInputs.value[2].value = batch.composition;
      formInputs.value[3].value = batch.invoice;
      formInputs.value[4].value = batch.price;
      formInputs.value[5].value = batch?.supplier.id;
        formInputs.value[6].value = batch.weigth;
      formInputs.value[7].value = batch.rolls_quantity?.toString() || '';

      // Se houver imagem existente
      if (batch.image_url) {
        formInputs.value[8].existingImage = batch.image_url;
        formInputs.value[8].showimg = batch.image_url;
      }
    }
  } catch (error) {
    errorMessage.value = 'Erro ao carregar os dados do lote.';
  } finally {
    isLoadingData.value = false;
  }
});

async function submitForm() {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const formData = new FormData();

    formData.append('id', route.params.id);
    formData.append('material', formInputs.value[0].value);
    formData.append('color_id', formInputs.value[1].value);
    formData.append('composition', formInputs.value[2].value);
    formData.append('invoice', formInputs.value[3].value);
    formData.append('price', formInputs.value[4].value);
    formData.append('supplier_id', formInputs.value[5].value);
    formData.append('weight', formInputs.value[6].value);
    formData.append('rolls_quantity', formInputs.value[7].value);

    // Adicionar imagem apenas se uma nova foi selecionada
    if (formInputs.value[8].value && typeof formInputs.value[8].value !== 'string') {
      formData.append('image', formInputs.value[8].value);
    }

    await batchStore.UpdateBatch(formData);

    successMessage.value = 'Lote atualizado com sucesso!';

    setTimeout(() => {
      successMessage.value = '';
      router.push('/employee/batches');
    }, 1500);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao atualizar o lote. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50">
    <HeaderDefault />

    <div class="flex justify-center p-4 md:p-8">
      <div class="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Editar Lote</h2>
          <p class="text-gray-600">Atualize os dados do lote</p>
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
            <!-- Form Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="(info, i) in formInputs"
                :key="i"
                :class="info.media ? 'md:col-span-2' : ''"
                class="flex flex-col gap-2"
              >
                <label class="font-semibold text-[#261D47] text-sm md:text-base">
                  {{ info.title }}
                </label>
                <GlobalInput
                  :select="info.select"
                  :options="info.options"
                  :placeholder="info.placeholder"
                  :media="info.media"
                  :showimg="info.showimg"
                  v-model:value="info.value"
                  @showImg="ChangeImg"
                  class_input="bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors w-full"
                />
                <p v-if="info.media && info.existingImage && !info.value" class="text-xs text-gray-500">
                  Imagem atual mantida. Selecione uma nova para substituir.
                </p>
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
