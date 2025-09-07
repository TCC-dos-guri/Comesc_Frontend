import { defineStore } from 'pinia'
import { computed } from 'vue'
import { BatchService } from '@/services'
import { useStorage } from '@vueuse/core'
import api from '@/plugins/api'
import { showMessage } from '@/utils/toastify'
import router from '@/router'


export const useBatchStore = defineStore('batch', () => {
  const state = useStorage( 'batchStorage', {
    batchs: [],
    selectedbatch: null,
    batchById: null,
    connection: false,
    error: null,
    loading: false,
  })

  async function arrCreate(batch, rolls){
    const batchObjVal = batch.map(val => val.value)
    const rollsArr = rolls.map(r => ({
      color: Number(batchObjVal[1]),
      ...r
    }))
    const {data} = await api.post('images/', {file: batchObjVal[8]}, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    const newObj = { 
        cover: data.attachment_key,
        material: batchObjVal[0],
        supplier: Number(batchObjVal[5]),
        composition: batchObjVal[2],
        invoice: batchObjVal[3],
        price: Number(batchObjVal[4]),
        qtd: Number(batchObjVal[7]),
        kg: Number(batchObjVal[6]),
        roll: rollsArr
      }

    console.log(newObj)
    await CreateBatch(newObj)
  }

  const batch = computed(() => state.value.batchs)
  const batchById = computed(() => state.value.batchById)
  const selectedbatch = computed(() => state.value.selectedbatch)
  const isLoading = computed(() => state.value.loading)
  const batchsCount = computed(() => state.value.batchs.length)

  const GetBatchs = async () => {
    state.value.loading = true
    try {
      const response = await BatchService.GetBatch()
      
      state.value.batchs = response
      return response
    } catch (error) {
      state.value.error = error
      throw error
    }finally {
      state.value.loading = false
      state.value.connection = true
    }
  }

    const GetBatchsBySearch = async (search) => {
    state.value.loading = true
    try {
      const response = await BatchService.GetBatchBySearch(search)
      
      state.value.batchs = response
      return response
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
      const response = await BatchService.GetBatchById(batchId)
      state.value.batchById = response
      return response
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
      const response = state.value.batchs.push(await BatchService.CreateBatch(newBatch))
      return response
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
      showMessage('Lote criado com sucesso', 'success', 1000, 'top-right', 'light', false)
      router.push('/batch/')
    }
  }

  const UpdateBatch = async (batch) => {
    state.value.loading = true
    try {
      const index = state.value.batchs.findIndex((s) => s.id === batch.id)
      if (index !== -1) {
        state.value.batchs[index] = await BatchService.UpdateBatch(batch)
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
        await BatchService.DeleteBatch(id)
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
    GetBatchsBySearch,
    CreateBatch,
    DeleteBatch,
    arrCreate
  }

})
