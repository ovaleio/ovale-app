import axios from 'axios'
const api = axios.create({
  baseURL: process.env.npm_package_api,
  timeout: 5000 
})
export default {
  user: {

    // Call user Login
    // Endpoint : /users/authenticate
    userLogin: (email, password) => {
      return api.post('/users/authenticate', {email, password})
      .then(res => res.data)
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw {e:error.response.status, message:error.response.data}
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          throw {e:404, message:"API not reachable"}
        } else {
          throw {e:404, message:"API not reachable"}
        }
      })
    },

    // Check if user email exists in db 
    // Endpoint : /users/authenticate/email
    emailLogin: (email) => {
      return api.post('/users/authenticate/email', {email})
      .then(res => res.data)
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw {e:error.response.status, message:error.response.data}
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          throw {e:404, message:"API not reachable"}
        } else {
          throw {e:404, message:"API not reachable"}
        }
      })
    },


    // editName
    editName: (email, name, jwt) => {
      return api.post('/users/edit/name', {email, name, jwt})
      .then(res => res.data)
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw {e:error.response.status, message:error.response.data}
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          throw {e:404, message:"API not reachable"}
        } else {
          throw {e:404, message:"API not reachable"}
        }
      })
    },
    
    // Check password 
    // Endpoint : /users/authenticate/password
    password: (password) => {
      return api.post('/users/authenticate/password', {password})
      .then(res => res.data)
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw {e:error.response.status, message:error.response.data}
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          throw {e:404, message:"API not reachable"}
        } else {
          throw {e:404, message:"API not reachable"}
        }
      })
    },

    // Check if user digits exists in db
    // Endpoint : /users/authenticate/digits
    checkDigits: ( data ) => {
      console.log(data.email)
      console.log(data.digits)
      return api.post('/users/authenticate/digits', {email: data.email, digits: data.digits})
      .then(res => res.data)
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw {e:error.response.status, message:error.response.data}
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          throw {e:404, message:"API not reachable"}
        } else {
          throw {e:404, message:"API not reachable"}
        }
      })
    },


    register:   (email, password, jwt) => {console.log(jwt)
      return api.post('/users/register', {email, password, jwt})
      .then(res => res.data)
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw {e:error.response.status, message:error.response.data}
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          throw {e:404, message:"API not reachable"}
        } else {
          throw {e:404, message:"API not reachable"}
        }
      })
    }
  }
}