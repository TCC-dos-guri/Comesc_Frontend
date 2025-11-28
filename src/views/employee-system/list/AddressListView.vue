<script setup>
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAddressStore } from '@/stores';
import { HeaderDefault } from '@/components';

const router = useRouter();
const addressStore = useAddressStore();

const addresses = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const searchQuery = ref('');
const showDeleteModal = ref(false);
const addressToDelete = ref(null);

// Filtrar endereços baseado na busca
const filteredAddresses = computed(() => {
  if (!searchQuery.value) return addresses.value;

  return addresses.value.filter(address =>
    address.street.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    address.cep.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    address.state?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    address.state?.acronym.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function loadAddresses() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    addresses.value = await addressStore.GetAddress();
  } catch (error) {
    errorMessage.value = 'Erro ao carregar os endereços.';
  } finally {
    isLoading.value = false;
  }
}

function openDeleteModal(address) {
  addressToDelete.value = address;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  addressToDelete.value = null;
}

async function confirmDelete() {
  if (!addressToDelete.value) return;

  try {
    await addressStore.DeleteAddress(addressToDelete.value.id);
    successMessage.value = 'Endereço excluído com sucesso!';
    await loadAddresses();

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao excluir o endereço.';
  } finally {
    closeDeleteModal();
  }
}

function goToCreate() {
  router.push('/register/address');
}

function goToEdit(id) {
  router.push(`/register/address/${id}`);
}

onMounted(() => {
  loadAddresses();
});
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50">
    <HeaderDefault />

    <div class="p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Gerenciar Endereços</h2>
          <p class="text-gray-600">Visualize e gerencie todos os endereços cadastrados</p>
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
                placeholder="Buscar por rua, CEP ou estado..."
                class="w-full bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors"
              />
            </div>

            <!-- Add Button -->
            <GlobalButton
              :action="goToCreate"
              :extra-div="false"
              title="+ Novo Endereço"
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
        <div v-else-if="filteredAddresses.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            {{ searchQuery ? 'Nenhum endereço encontrado' : 'Nenhum endereço cadastrado' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ searchQuery ? 'Tente buscar com outros termos' : 'Comece cadastrando seu primeiro endereço' }}
          </p>
          <GlobalButton
            v-if="!searchQuery"
            :action="goToCreate"
            :extra-div="false"
            title="Cadastrar Primeiro Endereço"
            :btn-style="`
              bg-[#261D47] text-white rounded-xl px-6 py-3 font-semibold
              transition-all duration-200
              hover:bg-[#3a2a5f] hover:shadow-lg transform hover:scale-105
            `"
          />
        </div>

        <!-- Addresses Table -->
        <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead class="bg-[#261D47] text-white">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Rua</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Número</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">CEP</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="address in filteredAddresses"
                  :key="address.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4">
                    <span class="font-semibold text-[#261D47]">{{ address.street }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-gray-600">{{ address.number || 'S/N' }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-gray-600 font-mono text-sm">{{ address.cep }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span class="text-gray-600">{{ address.state?.name }}</span>
                      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-[#261D47] text-white">
                        {{ address.state?.acronym }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2 justify-center">
                      <button
                        @click="goToEdit(address.id)"
                        class="bg-[#261D47] text-white rounded-lg px-4 py-2 text-sm font-semibold
                               hover:bg-[#3a2a5f] transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        @click="openDeleteModal(address)"
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
              v-for="address in filteredAddresses"
              :key="address.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="mb-4">
                <h3 class="text-lg font-bold text-[#261D47] mb-2">{{ address.street }}, {{ address.number || 'S/N' }}</h3>
                <div class="space-y-1">
                  <p class="text-sm text-gray-600">
                    <span class="font-semibold">CEP:</span> {{ address.cep }}
                  </p>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-600 font-semibold">Estado:</span>
                    <span class="text-sm text-gray-600">{{ address.state?.name }}</span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-[#261D47] text-white">
                      {{ address.state?.acronym }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="goToEdit(address.id)"
                  class="flex-1 bg-[#261D47] text-white rounded-lg px-4 py-2 text-sm font-semibold
                         hover:bg-[#3a2a5f] transition-colors duration-200"
                >
                  Editar
                </button>
                <button
                  @click="openDeleteModal(address)"
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
        <div v-if="!isLoading && filteredAddresses.length > 0" class="mt-6 text-center text-gray-600">
          <p class="text-sm">
            Mostrando {{ filteredAddresses.length }} {{ filteredAddresses.length === 1 ? 'endereço' : 'endereços' }}
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
            Tem certeza que deseja excluir este endereço?
          </p>

          <!-- Address Info Preview -->
          <div class="p-4 bg-gray-50 rounded-lg space-y-2">
            <div>
              <p class="text-sm text-gray-500">Endereço</p>
              <p class="font-semibold text-[#261D47]">
                {{ addressToDelete?.street }}, {{ addressToDelete?.number || 'S/N' }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">CEP</p>
              <p class="font-mono text-sm text-gray-700">{{ addressToDelete?.cep }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Estado</p>
              <div class="flex items-center gap-2">
                <p class="text-sm text-gray-700">{{ addressToDelete?.state?.name }}</p>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-[#261D47] text-white">
                  {{ addressToDelete?.state?.acronym }}
                </span>
              </div>
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
