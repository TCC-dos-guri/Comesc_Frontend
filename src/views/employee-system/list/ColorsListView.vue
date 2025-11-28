<script setup>
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useColorStore } from '@/stores';
import { HeaderDefault } from '@/components';

const router = useRouter();
const colorStore = useColorStore();

const colors = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const searchQuery = ref('');
const showDeleteModal = ref(false);
const colorToDelete = ref(null);

// Filtrar cores baseado na busca
const filteredColors = computed(() => {
  if (!searchQuery.value) return colors.value;

  return colors.value.filter(color =>
    color.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    color.hex.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function loadColors() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    colors.value = await colorStore.GetColors();
  } catch (error) {
    errorMessage.value = 'Erro ao carregar as cores.';
  } finally {
    isLoading.value = false;
  }
}

function openDeleteModal(color) {
  colorToDelete.value = color;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  colorToDelete.value = null;
}

async function confirmDelete() {
  if (!colorToDelete.value) return;

  try {
    await colorStore.DeleteColor(colorToDelete.value.id);
    successMessage.value = 'Cor excluída com sucesso!';
    await loadColors();

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao excluir a cor.';
  } finally {
    closeDeleteModal();
  }
}

function goToCreate() {
  router.push('/register/colors');
}

function goToEdit(id) {
  router.push(`/register/colors/${id}`);
}

onMounted(() => {
  loadColors();
});
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50">
    <HeaderDefault />

    <div class="p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Gerenciar Cores</h2>
          <p class="text-gray-600">Visualize e gerencie todas as cores cadastradas</p>
        </div>

        <!-- Messages -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>

        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p class="text-green-700 text-sm">{{ successMessage }}</p>
        </div>

        <!-- Search and Actions -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <!-- Search -->
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por nome ou código hex..."
                class="w-full bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors"
              />
            </div>

            <!-- Add Button -->
            <GlobalButton
              :action="goToCreate"
              :extra-div="false"
              title="+ Nova Cor"
              :btn-style="`
                bg-[#261D47] text-white rounded-xl px-6 py-3 font-semibold
                transition-all duration-200 whitespace-nowrap
                hover:bg-[#3a2a5f] hover:shadow-lg transform hover:scale-105
              `"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#261D47]"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredColors.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            {{ searchQuery ? 'Nenhuma cor encontrada' : 'Nenhuma cor cadastrada' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ searchQuery ? 'Tente buscar com outros termos' : 'Comece cadastrando sua primeira cor' }}
          </p>
          <GlobalButton
            v-if="!searchQuery"
            :action="goToCreate"
            :extra-div="false"
            title="Cadastrar Primeira Cor"
            :btn-style="`
              bg-[#261D47] text-white rounded-xl px-6 py-3 font-semibold
              transition-all duration-200
              hover:bg-[#3a2a5f] hover:shadow-lg transform hover:scale-105
            `"
          />
        </div>

        <!-- Colors Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="color in filteredColors"
            :key="color.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
          >
            <!-- Color Display -->
            <div
              :style="{ backgroundColor: color.hex }"
              class="h-32 w-full relative"
            >
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
            </div>

            <!-- Color Info -->
            <div class="p-5">
              <h3 class="text-lg font-bold text-[#261D47] mb-1 truncate">
                {{ color.name }}
              </h3>
              <p class="text-gray-600 text-sm font-mono mb-4">
                {{ color.hex }}
              </p>

              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  @click="goToEdit(color.id)"
                  class="flex-1 bg-[#261D47] text-white rounded-lg px-4 py-2 text-sm font-semibold
                         hover:bg-[#3a2a5f] transition-colors duration-200"
                >
                  Editar
                </button>
                <button
                  @click="openDeleteModal(color)"
                  class="flex-1 bg-red-500 text-white rounded-lg px-4 py-2 text-sm font-semibold
                         hover:bg-red-600 transition-colors duration-200"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <div v-if="!isLoading && filteredColors.length > 0" class="mt-6 text-center text-gray-600">
          <p class="text-sm">
            Mostrando {{ filteredColors.length }} {{ filteredColors.length === 1 ? 'cor' : 'cores' }}
            {{ searchQuery ? 'encontrada(s)' : 'cadastrada(s)' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-[#261D47] mb-4">Confirmar Exclusão</h3>

        <div class="mb-6">
          <p class="text-gray-600 mb-4">
            Tem certeza que deseja excluir a cor <strong>{{ colorToDelete?.name }}</strong>?
          </p>

          <!-- Color Preview -->
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              :style="{ backgroundColor: colorToDelete?.hex }"
              class="w-12 h-12 rounded-lg border-2 border-gray-300"
            ></div>
            <div>
              <p class="font-semibold text-[#261D47]">{{ colorToDelete?.name }}</p>
              <p class="text-sm text-gray-600 font-mono">{{ colorToDelete?.hex }}</p>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="closeDeleteModal"
            class="flex-1 bg-gray-300 text-[#261D47] rounded-xl px-6 py-3 font-semibold
                   hover:bg-gray-400 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 bg-red-500 text-white rounded-xl px-6 py-3 font-semibold
                   hover:bg-red-600 transition-colors duration-200"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
