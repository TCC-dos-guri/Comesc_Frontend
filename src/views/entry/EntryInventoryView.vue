<script setup>
import GlobalButton from '@/components/global/buttons/GlobalButton.vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useInventoryStore, useRollStore } from '@/stores';
import { HeaderDefault } from '@/components';

const router = useRouter();
const inventoryStore = useInventoryStore();
const rollStore = useRollStore();

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const movementType = ref('entrada'); // 'entrada' ou 'baixa'
const selectedRoll = ref(null);
const quantity = ref('');
const rolls = ref([]);
const currentInventory = ref([]);

const filteredRolls = computed(() => {
  return rolls.value.filter(roll => {
    const inventoryItem = currentInventory.value.find(inv => inv.roll.id === roll.id);
    if (movementType.value === 'baixa') {
      return inventoryItem && inventoryItem.quantity > 0;
    }
    return true;
  });
});

const selectedRollInventory = computed(() => {
  if (!selectedRoll.value) return null;
  return currentInventory.value.find(inv => inv.roll.id === selectedRoll.value);
});

const currentStock = computed(() => {
  return selectedRollInventory.value?.quantity || 0;
});

const disabledBtn = computed(() => {
  // if (!selectedRoll.value || !quantity.value || quantity.value <= 0) return true;

  // if (movementType.value === 'baixa') {
  //   return parseInt(quantity.value) > currentStock.value;
  // }

  return false;
});

onMounted(async () => {
  try {
    // Carregar rolos disponíveis
    rolls.value = await rollStore.GetRolls();

    // Carregar inventário atual
    currentInventory.value = await inventoryStore.GetInventory();
  } catch (error) {
    errorMessage.value = 'Erro ao carregar dados.';
  }
});

async function submitMovement() {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const inventoryItem = selectedRollInventory.value;

    let newQuantity;
    if (movementType.value === 'entrada') {
      newQuantity = currentStock.value + parseInt(quantity.value);
    } else {
      newQuantity = currentStock.value - parseInt(quantity.value);
    }

    if (inventoryItem) {
      // Atualizar inventário existente
      await inventoryStore.UpdateInventory({
        id: inventoryItem.id,
        roll_id: selectedRoll.value,
        quantity: newQuantity
      });
    } else {
      // Criar novo item no inventário (entrada)
      await inventoryStore.CreateInventory({
        roll_id: selectedRoll.value,
        quantity: parseInt(quantity.value)
      });
    }

    successMessage.value = `${movementType.value === 'entrada' ? 'Entrada' : 'Baixa'} realizada com sucesso!`;

    // Recarregar inventário
    currentInventory.value = await inventoryStore.GetInventory();

    // Limpar formulário
    selectedRoll.value = null;
    quantity.value = '';

    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao realizar movimentação. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
}

function getRollInfo(rollId) {
  return rolls.value.find(r => r.id === rollId);
}
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50">
    <HeaderDefault />

    <div class="p-4 md:p-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-6 md:mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-[#261D47] mb-2">Movimentação de Estoque</h2>
          <p class="text-gray-600">Registre entradas e baixas de rolos no estoque</p>
        </div>

        <!-- Messages -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>

        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p class="text-green-700 text-sm">{{ successMessage }}</p>
        </div>

        <!-- Movement Form -->
        <div class="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <form @submit.prevent="submitMovement" class="space-y-6">
            <!-- Type Selector -->
            <div class="flex flex-col gap-2">
              <label class="font-semibold text-[#261D47] text-sm md:text-base">Tipo de Movimentação</label>
              <div class="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  @click="movementType = 'entrada'"
                  :class="[
                    'p-4 rounded-xl font-semibold transition-all duration-200',
                    movementType === 'entrada'
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  + Entrada
                </button>
                <button
                  type="button"
                  @click="movementType = 'baixa'"
                  :class="[
                    'p-4 rounded-xl font-semibold transition-all duration-200',
                    movementType === 'baixa'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                >
                  - Baixa
                </button>
              </div>
            </div>

            <!-- Roll Selector -->
            <div class="flex flex-col gap-2">
              <label class="font-semibold text-[#261D47] text-sm md:text-base">Rolo</label>
              <select
                v-model="selectedRoll"
                class="bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors w-full"
              >
                <option :value="null" disabled>Selecione um rolo</option>
                <option v-for="roll in filteredRolls" :key="roll.id" :value="roll.id">
                  {{ roll.code || `Rolo #${roll.id}` }} -
                  {{ roll.batch?.material || 'Material não especificado' }}
                </option>
              </select>
            </div>

            <!-- Current Stock Info -->
            <div v-if="selectedRoll" class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p class="text-sm text-blue-700">
                <span class="font-semibold">Estoque atual:</span> {{ currentStock }} unidade(s)
              </p>
            </div>

            <!-- Quantity Input -->
            <div class="flex flex-col gap-2">
              <label class="font-semibold text-[#261D47] text-sm md:text-base">Quantidade</label>
              <input
                type="number"
                v-model="quantity"
                min="1"
                :max="movementType === 'baixa' ? currentStock : undefined"
                placeholder="Digite a quantidade"
                class="bg-gray-100 p-3 rounded-xl outline-none border-2 border-transparent focus:border-[#261D47] transition-colors w-full"
              />
              <p v-if="movementType === 'baixa' && quantity > currentStock" class="text-red-500 text-xs">
                Quantidade indisponível em estoque
              </p>
            </div>

            <!-- Result Preview -->
            <div v-if="selectedRoll && quantity" class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600 mb-2">
                <span class="font-semibold">Estoque após movimentação:</span>
              </p>
              <div class="flex items-center gap-3">
                <span class="text-2xl font-bold text-[#261D47]">{{ currentStock }}</span>
                <span class="text-xl text-gray-400">
                  {{ movementType === 'entrada' ? '→' : '→' }}
                </span>
                <span
                  :class="[
                    'text-2xl font-bold',
                    movementType === 'entrada' ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ movementType === 'entrada'
                    ? currentStock + parseInt(quantity || 0)
                    : currentStock - parseInt(quantity || 0)
                  }}
                </span>
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
                :action="submitMovement"
                
                :extra-div="false"
                :title="isLoading ? 'Processando...' : (movementType === 'entrada' ? 'Registrar Entrada' : 'Registrar Baixa')"
                :btn-style="`
                  ${movementType === 'entrada' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                  text-white rounded-xl px-8 py-3 font-semibold
                  transition-all duration-200 w-full md:w-auto
                  ${disabledBtn || isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-lg transform hover:scale-105'
                  }
                `"
              />
            </div>
          </form>
        </div>

        <!-- Recent Movements (Optional Section) -->
        <div class="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-[#261D47] mb-4">Estoque Atual</h3>

          <div v-if="currentInventory.length === 0" class="text-center py-8 text-gray-500">
            Nenhum item em estoque
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="item in currentInventory"
              :key="item.id"
              class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex-1">
                <p class="font-semibold text-[#261D47]">
                  {{ getRollInfo(item.roll.id)?.code || `Rolo #${item.roll.id}` }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ getRollInfo(item.roll.id)?.batch?.material || 'Material não especificado' }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-[#261D47]">{{ item.quantity }}</p>
                <p class="text-xs text-gray-500">unidades</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
