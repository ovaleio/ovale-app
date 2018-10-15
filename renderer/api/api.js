import axios from 'axios'

import {remote} from "electron";

export default {
  user: {
    login:      (credentials) => axios.post('/users/authenticate', {credentials}).then(),
    register:   (credentials) => axios.post('/users/authenticate', {credentials}).then()
  }
}