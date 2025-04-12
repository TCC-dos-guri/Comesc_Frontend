
import { defineStore } from 'pinia';
import {computed} from 'vue';
import { addressService } from '@/services';
import { useStorage } from '@vueuse/core';

export const useAddressStorage = defineStore('address', () => {

  const state = useStorage('addressStorage', {
    address: [],
    selectedAddress: null,
    addressById: null,
    error: null,
    conected: false
  })

  const address = computed(() => state.value.address)
  const addressById = computed(() => state.value.addressById)
  const selectedAddress = computed(() => state.value.selectedAddress)
  const conected = computed(() => state.value.loading)

  const  getData = async () => {
    state.value.loading = true
    try {
      state.value.address = await addressService.getAddress()
    }
    catch (error){
      state.value.error = error
      throw error
    }
    finally {
      state.value.loading = false
      state.value.conected = true
    }
  }

  const getAddressById = async (addressId) => {
    state.value.loading = true
    try {
      const response = await addressService.getAddressById(addressId)
      state.value.addressById = response
      return response
    } catch (error) {
      state.value.error = error
      throw error
    } finally {
      state.value.loading = false
      state.value.conected = true
    }
  }

  const createAddress = async (newAddress) => {
    state.value.loading = true
    try{
      state.value.address.push(await addressService.createAddress(newAddress))
    }catch (error){
      state.value.error = error
      throw error
    }finally{
      state.value.loading = false
    }
  }

    const updateAddress = async (address) => {
      state.value.loading = true
      try {
        const index = state.value.anys.findIndex((s) => s.id === address.id)
        if (index !== -1) {
          state.value.address[index] = await addressService.updateAddress(address)
        }
      } catch (error) {
        state.value.error = error
        throw error
      } finally {
        state.value.loading = false
      }
    }

    const deleteAddress = async (id) => {
      state.value.loading = true
      try {
        const index = state.value.address.findIndex((s) => s.id === id)
        if (index !== -1) {
          await addressService.deleteAddress(id)
          state.value.address.splice(index, 1)
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
  address,
  addressById,
  selectedAddress,
  conected,
  getData,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
  }

},)



