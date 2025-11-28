<script setup>
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useInventoryStore, useBatchStore } from '@/stores';
import { HeaderDefault } from '@/components';

const router = useRouter();
const inventoryStore = useInventoryStore();
const batchStore = useBatchStore();

const inventory = ref([]);
const batches = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const searchQuery = ref('');
const filterStatus = ref('all'); // 'all', 'in_stock', 'out_of_stock'

// Enriquecer dados do inventário com informações do batch
const enrichedInventory = computed(() => {
  return inventory.value.map(item => {
    const roll = batches.value
      .flatMap(batch => batch.rolls || [])
      .find(r => r.id === item.roll.id);

    const batch = batches.value.find(b =>
      (b.rolls || []).some(r => r.id === item.roll.id)
    );

    return {
      ...item,
      rollInfo: roll,
      batchInfo: batch
    };
  });
});

// Filtrar inventário baseado na busca e status
const filteredInventory = computed(() => {
  let filtered = enrichedInventory.value;

  // Filtro de status
  if (filterStatus.value === 'in_stock') {
    filtered = filtered.filter(item => item.quantity > 0);
  } else if (filterStatus.value === 'out_of_stock') {
    filtered = filtered.filter(item => item.quantity === 0);
  }

  // Filtro de busca
  if (searchQuery.value) {
    filtered = filtered.filter(item => {
      const search = searchQuery.value.toLowerCase();
      return (
        item.rollInfo?.code?.toLowerCase().includes(search) ||
        item.batchInfo?.material?.toLowerCase().includes(search) ||
        item.batchInfo?.composition?.toLowerCase().includes(search) ||
        item.user?.name?.toLowerCase().includes(search)
      );
    });
  }

  return filtered;
});

// Estatísticas
const stats = computed(() => {
  const total = enrichedInventory.value.length;
  const inStock = enrichedInventory.value.filter(item => item.quantity > 0).length;
  const outOfStock = enrichedInventory.value.filter(item => item.quantity === 0).length;
  const totalQuantity = enrichedInventory.value.reduce((sum, item) => sum + item.quantity, 0);

  return { total, inStock, outOfStock, totalQuantity };
});

async function loadInventory() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    inventory.value = await inventoryStore.GetInventory();
    batches.value = await batchStore.GetBatches();
  } catch (error) {
    errorMessage.value = 'Erro ao carregar o inventário.';
  } finally {
    isLoading.value = false;
  }
}

function goToMovement() {
  router.push('/entry');
}

function getStockStatus(quantity) {
  if (quantity === 0) return { text: 'Sem estoque', color: 'bg-red-100 text-red-700' };
  if (quantity < 10) return { text: 'Estoque baixo', color: 'bg-yellow-100 text-yellow-700' };
  return { text: 'Em estoque', color: 'bg-green-100 text-green-700' };
}

onMounted(() => {
  loadInventory();
});
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50">
    <HeaderDefault />

    <div class="p-4 md:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Inventário de Estoque</h2>
          <p class="text-gray-600">Visualize e gerencie todo o inventário de rolos</p>
        </div>

        <!-- Messages -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>

        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p class="text-green-700 text-sm">{{ successMessage }}</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <p class="text-sm text-gray-600 mb-1">Total de Itens</p>
            <p class="text-3xl font-bold text-[#261D47]">{{ stats.total }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <p class="text-sm text-gray-600 mb-1">Em Estoque</p>
            <p class="text-3xl font-bold text-green-600">{{ stats.inStock }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <p class="text-sm text-gray-600 mb-1">Sem Estoque</p>
            <p class="text-3xl font-bold text-red-600">{{ stats.outOfStock }}</p>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <p class="text-sm text-gray-600 mb-1">Quantidade Total</p>
            <p class="text-3xl font-bold text-[#261D47]">{{ stats.totalQuantity }}</p>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div class="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <!-- Search -->
            <div class="flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por código do rolo, material, composição..."
                class="w-full bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors"
              />
            </div>

            <!-- Filter Buttons -->
            <div class="flex gap-2">
              <button
                @click="filterStatus = 'all'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                  filterStatus === 'all'
                    ? 'bg-[#261D47] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                Todos
              </button>
              <button
                @click="filterStatus = 'in_stock'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                  filterStatus === 'in_stock'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                Em Estoque
              </button>
              <button
                @click="filterStatus = 'out_of_stock'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
                  filterStatus === 'out_of_stock'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                Sem Estoque
              </button>
            </div>

            <!-- Movement Button -->
            <GlobalButton
              :action="goToMovement"
              :extra-div="false"
              title="+ Nova Movimentação"
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
        <div v-else-if="filteredInventory.length === 0" class="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            {{ searchQuery || filterStatus !== 'all' ? 'Nenhum item encontrado' : 'Nenhum item no inventário' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ searchQuery || filterStatus !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece registrando uma movimentação de estoque'
            }}
          </p>
          <GlobalButton
            v-if="!searchQuery && filterStatus === 'all'"
            :action="goToMovement"
            :extra-div="false"
            title="Primeira Movimentação"
            :btn-style="`
              bg-[#261D47] text-white rounded-xl px-6 py-3 font-semibold
              transition-all duration-200
              hover:bg-[#3a2a5f] hover:shadow-lg transform hover:scale-105
            `"
          />
        </div>

        <!-- Inventory Table -->
        <div v-else class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <!-- Desktop Table -->
          <div class="hidden lg:block overflow-x-auto">
            <table class="w-full">
              <thead class="bg-[#261D47] text-white">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Código do Rolo</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Material</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold">Composição</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold">Quantidade</th>
                  <th class="px-6 py-4 text-center text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="item in filteredInventory"
                  :key="item.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4">
                    <span class="font-semibold text-[#261D47] font-mono">
                      {{ item.rollInfo?.code || `#${item.roll.id}` }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-gray-700">{{ item.batchInfo?.material || 'N/A' }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-gray-600 text-sm">{{ item.batchInfo?.composition || 'N/A' }}</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="text-2xl font-bold text-[#261D47]">{{ item.quantity }}</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                        getStockStatus(item.quantity).color
                      ]"
                    >
                      {{ getStockStatus(item.quantity).text }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="lg:hidden divide-y divide-gray-200">
            <div
              v-for="item in filteredInventory"
              :key="item.id"
              class="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-[#261D47] font-mono mb-1">
                    {{ item.rollInfo?.code || `#${item.roll.id}` }}
                  </h3>
                  <p class="text-sm text-gray-700 font-semibold">{{ item.batchInfo?.material || 'N/A' }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ item.batchInfo?.composition || 'N/A' }}</p>
                </div>
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                    getStockStatus(item.quantity).color
                  ]"
                >
                  {{ getStockStatus(item.quantity).text }}
                </span>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Quantidade em estoque</span>
                  <span class="text-3xl font-bold text-[#261D47]">{{ item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <div v-if="!isLoading && filteredInventory.length > 0" class="mt-6 text-center text-gray-600">
          <p class="text-sm">
            Mostrando {{ filteredInventory.length }} {{ filteredInventory.length === 1 ? 'item' : 'itens' }}
            {{ searchQuery || filterStatus !== 'all' ? 'filtrado(s)' : 'no inventário' }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
