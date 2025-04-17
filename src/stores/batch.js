import { defineStorage } from 'pinia'
import { computed } from 'vue'
import { batchService } from '@/services'
import { storage } from '@vueuse/core'

export const usebatchStore = defineStorage('batch', () => {
  const state = storage( 'batchStorage', {
    batchs: [],
    selectedbatch: null,
    batchById: null,
    connection: false,
    error: null,
    loading: false,
  })

  const batch = computed(() => state.value.batchs)
  const batchById = computed(() => state.value.batchById)
  const selectedbatch = computed(() => state.value.selectedbatch)
  const isLoading = computed(() => state.value.loading)
  const batchsCount = computed(() => state.value.batchs.length)

  const GetBatchs = async () => {
    state.value.loading = true
    try {
      const response = await batchService.Getbatchs()
      state.value.batchs = response.data
      return response.data
    } catch (error) {
      state.value.error = error
      throw error
    }finally {
      state.value.loading = false
      state.value.connection = true
    }
  }

  const GetBatchById = async (batchId) => {
    state.value.loading = true
    try {
      const response = await batchService.GetbatchById(batchId)
      state.value.batchById = response.data
      return response.data
    } catch (error) {
      state.value.error = error
      throw error
    }finally {
      state.value.loading = false
      state.value.connection = true
    }
  }

const CreateBatch = async (newBatch) => {
    state.value.loading = true
    try {
      const response = state.value.batchs.push(await batchService.Createbatch(newBatch))
      return response.data
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
    }
  }

  const UpdateBatch = async (batch) => {
    state.value.loading = true
    try {
      const index = state.value.batchs.findIndex((s) => s.id === batch.id)
      if (index !== -1) {
        state.value.batchs[index] = await batchService.Updatebatch(batch)
      }
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
    }
  }

  const DeleteBatch = async (id) => {
    state.value.loading = true
    try {
      const index = state.value.batchs.findIndex((s) => s.id === id)
      if (index !== -1) {
        await batchService.Deletebatch(id)
        state.value.batchs.splice(index, 1)
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
    batch,
    batchById,
    selectedbatch,
    isLoading,
    batchsCount,
    UpdateBatch,
    GetBatchs,
    GetBatchById,
    CreateBatch,
    DeleteBatch,
  }

})
