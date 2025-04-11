import api from '../../plugins/api'

class AdressService{

async GetAdress() {
  try {
    const { data } = await api.get('/address')
    return data.results
  }
  catch (error) {
    console.log('error in GetAdress', error)
    throw error
  }
}
}

export default new AddressService()
