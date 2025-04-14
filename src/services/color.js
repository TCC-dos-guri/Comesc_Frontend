import api from '../../api'

class colorService {

  async getColor() {
    try{
      const response = await api.get('/color/')
      return response.data
    }catch (error){
      console.log('error in getColor', error)
      throw error
    }
  }

  async getColorById(colorId) {
    try{
      const response = await api.get(`/color/?page=1&id=${colorId}`)
      return response.data
    }catch (error){
      console.log('error in getColorById', error)
      throw error
    }
  }

  async createColor(newColor) {
    try{
      const response = await api.post('/color/', newColor)
      return response.data
    }catch (error){
      console.log('error in createColor', error)
      throw error
    }
  }

  async updateColor(color) {
    try{
      const response = await api.put(`/color/${color.id}/`, color)
      return response.data
    }catch (error){
      console.log('error in updateColor', error)
      throw error
    }
  }

  async deleteColor(colorId) {
    try{
      const response = await api.delete(`/color/${colorId}/`)
      return response.data
    }catch (error){
      console.log('error in deleteColor', error)
      throw error
    }
  }
}

export default new colorService()
