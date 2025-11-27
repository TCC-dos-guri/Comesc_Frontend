import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import StateService from '@/services/state'

export const useStateStore = defineStore('state', () => {
  const state = useStorage('stateStorage', {
    states: [],
    selectedState: null,
    stateById: null,
    connection: false,
    error: null,
    loading: false,
  })

  // --- COMPUTED PROPERTIES ---
  const states = computed(() => state.value.states)
  const stateById = computed(() => state.value.stateById)
  const selectedState = computed(() => state.value.selectedState)
  const isLoading = computed(() => state.value.loading)
  const statesCount = computed(() => state.value.states.length)

  // --- ACTIONS ---
  const GetStates = async () => {
    state.value.loading = true
    try {
      const response = await StateService.GetStates()
      state.value.states = response
      return response
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
      state.value.connection = true
    }
  }

  const GetStateById = async (stateId) => {
    state.value.loading = true
    try {
      const response = await StateService.GetStateById(stateId)
      state.value.stateById = response
      return response
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
      state.value.connection = true
    }
  }

  const CreateState = async (newState) => {
    state.value.loading = true
    try {
      const createdState = await StateService.CreateState(newState)
      state.value.states.push(createdState)
      return createdState
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
    }
  }

  const UpdateState = async (updatedState) => {
    state.value.loading = true
    try {
      const index = state.value.states.findIndex((s) => s.id === updatedState.id)
      if (index !== -1) {
        state.value.states[index] = await StateService.UpdateState(updatedState)
      }
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
    }
  }

  const DeleteState = async (stateId) => {
    state.value.loading = true
    try {
      const index = state.value.states.findIndex((s) => s.id === stateId)
      if (index !== -1) {
        await StateService.DeleteState(stateId)
        state.value.states.splice(index, 1)
      }
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
    }
  }

  return {
    state,
    states,
    stateById,
    selectedState,
    isLoading,
    statesCount,
    GetStates,
    GetStateById,
    CreateState,
    UpdateState,
    DeleteState,
  }
})
