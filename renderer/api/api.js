import axios from 'axios'
const api = axios.create({
  baseURL: process.env.API,
  timeout: 5000 
})
export default {
  user: {
    emailLogin: (email) => {
      return api.post('/users/authenticate/email', {email})
      .then(res => res.data)
      .catch(function (res) {
        throw res;
      })
     
    },
    register:   (credentials) => api.post('/users/authenticate', {credentials}).then()
  }
}