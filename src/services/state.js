import api from '@/plugins/api'

class StateService {
  async GetStates() {
    try {
      const response = await api.get('/state/')
      return response.data
    } catch (error) {
      console.log('error in GetStates', error)
      throw error
    }
  }

  async GetStateById(stateId) {
    try {
      const response = await api.get(`/state/${stateId}/`)
      return response.data
    } catch (error) {
      console.log('error in GetStateById', error)
      throw error
    }
  }

  async CreateState(newState) {
    try {
      const response = await api.post('/state/', newState)
      return response.data
    } catch (error) {
      console.log('error in CreateState', error)
      throw error
    }
  }

  async UpdateState(state) {
    try {
      const response = await api.put(`/state/${state.id}/`, state)
      return response.data
    } catch (error) {
      console.log('error in UpdateState', error)
      throw error
    }
  }

  async DeleteState(stateId) {
    try {
      const response = await api.delete(`/state/${stateId}/`)
      return response.data
    } catch (error) {
      console.log('error in DeleteState', error)
      throw error
    }
  }
}

export default new StateService()
