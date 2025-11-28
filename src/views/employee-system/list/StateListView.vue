<script setup>
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStateStore } from '@/stores';
import { HeaderDefault } from '@/components';

const router = useRouter();
const stateStore = useStateStore();

const states = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const searchQuery = ref('');
const showDeleteModal = ref(false);
const stateToDelete = ref(null);

// Filtrar estados baseado na busca
const filteredStates = computed(() => {
  if (!searchQuery.value) return states.value;

  return states.value.filter(state =>
    state.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    state.acronym.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function loadStates() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    states.value = await stateStore.GetStates();
  } catch (error) {
    errorMessage.value = 'Erro ao carregar os estados.';
  } finally {
    isLoading.value = false;
  }
}

function openDeleteModal(state) {
  stateToDelete.value = state;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  stateToDelete.value = null;
}

async function confirmDelete() {
  if (!stateToDelete.value) return;

  try {
    await stateStore.DeleteState(stateToDelete.value.id);
    successMessage.value = 'Estado excluído com sucesso!';
    await loadStates();

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao excluir o estado.';
  } finally {
    closeDeleteModal();
  }
}

function goToCreate() {
  router.push('/register/state');
}

function goToEdit(id) {
  router.push(`/register/state/${id}`);
}

onMounted(() => {
  loadStates();
});
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50">
    <HeaderDefault />

    <div class="p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Gerenciar Estados</h2>
          <p class="text-gray-600">Visualize e gerencie todos os estados cadastrados</p>
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
                placeholder="Buscar por nome ou sigla..."
                class="w-full bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors"
              />
            </div>

            <!-- Add Button -->
            <GlobalButton
              :action="goToCreate"
              :extra-div="false"
              title="+ Novo Estado"
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
        <div v-else-if="filteredStates.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            {{ searchQuery ? 'Nenhum estado encontrado' : 'Nenhum estado cadastrado' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ searchQuery ? 'Tente buscar com outros termos' : 'Comece cadastrando seu primeiro estado' }}
          </p>
          <GlobalButton
            v-if="!searchQuery"
            :action="goToCreate"
            :extra-div="false"
            title="Cadastrar Primeiro Estado"
            :btn-style="`
              bg-[#261D47] text-white rounded-xl px-6 py-3 font-semibold
              transition-all duration-200
              hover:bg-[#3a2a5f] hover:shadow-lg transform hover:scale-105
            `"
          />
        </div>

        <!-- States Table -->
        <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead class="bg-[#261D47] text-white">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Sigla</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="state in filteredStates"
                  :key="state.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4">
                    <span class="font-semibold text-[#261D47]">{{ state.name }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[#261D47] text-white">
                      {{ state.acronym }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2 justify-center">
                      <button
                        @click="goToEdit(state.id)"
                        class="bg-[#261D47] text-white rounded-lg px-4 py-2 text-sm font-semibold
                               hover:bg-[#3a2a5f] transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        @click="openDeleteModal(state)"
                        class="bg-red-500 text-white rounded-lg px-4 py-2 text-sm font-semibold
                               hover:bg-red-600 transition-colors duration-200"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden divide-y divide-gray-200">
            <div
              v-for="state in filteredStates"
              :key="state.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-lg font-bold text-[#261D47]">{{ state.name }}</h3>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[#261D47] text-white">
                    {{ state.acronym }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="goToEdit(state.id)"
                  class="flex-1 bg-[#261D47] text-white rounded-lg px-4 py-2 text-sm font-semibold
                         hover:bg-[#3a2a5f] transition-colors duration-200"
                >
                  Editar
                </button>
                <button
                  @click="openDeleteModal(state)"
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
        <div v-if="!isLoading && filteredStates.length > 0" class="mt-6 text-center text-gray-600">
          <p class="text-sm">
            Mostrando {{ filteredStates.length }} {{ filteredStates.length === 1 ? 'estado' : 'estados' }}
            {{ searchQuery ? 'encontrado(s)' : 'cadastrado(s)' }}
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
            Tem certeza que deseja excluir o estado <strong>{{ stateToDelete?.name }}</strong>?
          </p>

          <!-- State Info Preview -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Nome do Estado</p>
                <p class="font-semibold text-[#261D47] text-lg">{{ stateToDelete?.name }}</p>
              </div>
              <span class="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-[#261D47] text-white">
                {{ stateToDelete?.acronym }}
              </span>
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
