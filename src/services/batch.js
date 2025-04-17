import api from '../../api'

class BatchService {

  async GetBatch() {
    try{
      const response = await api.get('/batch/')
      return response.data
    }catch (error){
      console.log('error in GetBatch', error)
      throw error
    }
  }

  async GetBatchById(batchId) {
    try{
      const response = await api.get(`/batch/?page=1&id=${batchId}`)
      return response.data
    }catch (error){
      console.log('error in GetBatchById', error)
      throw error
    }
  }

  async CreateBatch(newBatch) {
    try{
      const response = await api.post('/batch/', newBatch)
      return response.data
    }catch (error){
      console.log('error in CreateBatch', error)
      throw error
    }
  }

  async UpdateBatch(batch) {
    try{
      const response = await api.put(`/batch/${batch.id}/`, batch)
      return response.data
    }catch (error){
      console.log('error in UpdateBatch', error)
      throw error
    }
  }

  async DeleteColor(batchId) {
    try{
      const response = await api.delete(`/color/${batchId}/`)
      return response.data
    }catch (error){
      console.log('error in DeleteBatch', error)
      throw error
    }
  }
}

export default new BatchService()
