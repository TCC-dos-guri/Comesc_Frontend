import { defineStorage } from 'pinia'
import { computed } from 'vue'
import { InventoryService } from '@/services'
import { storage } from '@vueuse/core'

export const useInventoryStore = defineStorage('inventory', () => {
  const state = storage( 'inventoryStorage', {
    inventorys: [],
    selectedinventory: null,
    inventoryById: null,
    connection: false,
    error: null,
    loading: false,
  })

  const inventory = computed(() => state.value.inventorys)
  const inventoryById = computed(() => state.value.inventoryById)
  const selectedinventory = computed(() => state.value.selectedinventory)
  const isLoading = computed(() => state.value.loading)
  const inventorysCount = computed(() => state.value.inventorys.length)

  const GetInventory = async () => {
    state.value.loading = true
    try {
      const response = await InventoryService.Getinventory()
      state.value.inventorys = response.data
      return response.data
    } catch (error) {
      state.value.error = error
      throw error
    }finally {
      state.value.loading = false
      state.value.connection = true
    }
  }

  const GetInventoryById = async (inventoryId) => {
    state.value.loading = true
    try {
      const response = await InventoryService.GetInventoryById(inventoryId)
      state.value.inventoryById = response.data
      return response.data
    } catch (error) {
      state.value.error = error
      throw error
    }finally {
      state.value.loading = false
      state.value.connection = true
    }
  }

const CreateInventory = async (newInventory) => {
    state.value.loading = true
    try {
      const response = state.value.inventorys.push(await InventoryService.Createinventory(newInventory))
      return response.data
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
    }
  }

  const UpdateInventory = async (inventory) => {
    state.value.loading = true
    try {
      const index = state.value.inventorys.findIndex((s) => s.id === inventory.id)
      if (index !== -1) {
        state.value.inventorys[index] = await InventoryService.UpdateInventory(inventory)
      }
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
    }
  }

  const DeleteInventory = async (id) => {
    state.value.loading = true
    try {
      const index = state.value.inventorys.findIndex((s) => s.id === id)
      if (index !== -1) {
        await InventoryService.Deleteinventory(id)
        state.value.inventorys.splice(index, 1)
      }
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
    }
  }

  return{
    state,
    inventory,
    inventoryById,
    selectedinventory,
    isLoading,
    inventorysCount,
    UpdateInventory,
    GetInventory,
    GetInventoryById,
    CreateInventory,
    DeleteInventory,
  }
})
