<script setup>
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSupplierStore } from '@/stores';
import { HeaderDefault } from '@/components';

const router = useRouter();
const supplierStore = useSupplierStore();

const suppliers = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const searchQuery = ref('');
const showDeleteModal = ref(false);
const supplierToDelete = ref(null);

// Filtrar suppliers baseado na busca
const filteredSuppliers = computed(() => {
  if (!searchQuery.value) return suppliers.value;

  return suppliers.value.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    supplier.cnpj.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    supplier.address?.street.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    supplier.address?.city.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function loadSuppliers() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    suppliers.value = await supplierStore.GetSuppliers();
  } catch (error) {
    errorMessage.value = 'Erro ao carregar os suppliers.';
  } finally {
    isLoading.value = false;
  }
}

function openDeleteModal(supplier) {
  supplierToDelete.value = supplier;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  supplierToDelete.value = null;
}

async function confirmDelete() {
  if (!supplierToDelete.value) return;

  try {
    await supplierStore.DeleteSupplier(supplierToDelete.value.id);
    successMessage.value = 'Supplier excluído com sucesso!';
    await loadSuppliers();

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao excluir o supplier.';
  } finally {
    closeDeleteModal();
  }
}

function goToCreate() {
  router.push('/register/suppliers');
}

function goToEdit(id) {
  router.push(`/register/suppliers/${id}`);
}

onMounted(() => {
  loadSuppliers();
});
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50">
    <HeaderDefault />

    <div class="p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Gerenciar Suppliers</h2>
          <p class="text-gray-600">Visualize e gerencie todos os fornecedores cadastrados</p>
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
                placeholder="Buscar por nome, CNPJ ou endereço..."
                class="w-full bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors"
              />
            </div>

            <!-- Add Button -->
            <GlobalButton
              :action="goToCreate"
              :extra-div="false"
              title="+ Novo Supplier"
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
        <div v-else-if="filteredSuppliers.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            {{ searchQuery ? 'Nenhum supplier encontrado' : 'Nenhum supplier cadastrado' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ searchQuery ? 'Tente buscar com outros termos' : 'Comece cadastrando seu primeiro fornecedor' }}
          </p>
          <GlobalButton
            v-if="!searchQuery"
            :action="goToCreate"
            :extra-div="false"
            title="Cadastrar Primeiro Supplier"
            :btn-style="`
              bg-[#261D47] text-white rounded-xl px-6 py-3 font-semibold
              transition-all duration-200
              hover:bg-[#3a2a5f] hover:shadow-lg transform hover:scale-105
            `"
          />
        </div>

        <!-- Suppliers Table -->
        <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead class="bg-[#261D47] text-white">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Nome</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">CNPJ</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Endereço</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="supplier in filteredSuppliers"
                  :key="supplier.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4">
                    <span class="font-semibold text-[#261D47]">{{ supplier.name }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-gray-600 font-mono text-sm">{{ supplier.cnpj }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-gray-600 text-sm">
                      {{ supplier.address?.street }}, {{ supplier.address?.number }}
                    </span>
                  </td>

                  <td class="px-6 py-4">
                    <div class="flex gap-2 justify-center">
                      <button
                        @click="goToEdit(supplier.id)"
                        class="bg-[#261D47] text-white rounded-lg px-4 py-2 text-sm font-semibold
                               hover:bg-[#3a2a5f] transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        @click="openDeleteModal(supplier)"
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
              v-for="supplier in filteredSuppliers"
              :key="supplier.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="mb-4">
                <h3 class="text-lg font-bold text-[#261D47] mb-2">{{ supplier.name }}</h3>
                <p class="text-sm text-gray-600 font-mono mb-2">{{ supplier.cnpj }}</p>
                <p class="text-sm text-gray-600">
                  {{ supplier.address?.street }}, {{ supplier.address?.number }}
                </p>
                <p class="text-sm text-gray-600">{{ supplier.address?.city }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="goToEdit(supplier.id)"
                  class="flex-1 bg-[#261D47] text-white rounded-lg px-4 py-2 text-sm font-semibold
                         hover:bg-[#3a2a5f] transition-colors duration-200"
                >
                  Editar
                </button>
                <button
                  @click="openDeleteModal(supplier)"
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
        <div v-if="!isLoading && filteredSuppliers.length > 0" class="mt-6 text-center text-gray-600">
          <p class="text-sm">
            Mostrando {{ filteredSuppliers.length }} {{ filteredSuppliers.length === 1 ? 'supplier' : 'suppliers' }}
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
            Tem certeza que deseja excluir o supplier <strong>{{ supplierToDelete?.name }}</strong>?
          </p>

          <!-- Supplier Info Preview -->
          <div class="p-4 bg-gray-50 rounded-lg space-y-2">
            <div>
              <p class="text-sm text-gray-500">Nome</p>
              <p class="font-semibold text-[#261D47]">{{ supplierToDelete?.name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">CNPJ</p>
              <p class="font-mono text-sm text-gray-700">{{ supplierToDelete?.cnpj }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Endereço</p>
              <p class="text-sm text-gray-700">
                {{ supplierToDelete?.address?.street }}, {{ supplierToDelete?.address?.number }} -
                {{ supplierToDelete?.address?.city }}
              </p>
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
