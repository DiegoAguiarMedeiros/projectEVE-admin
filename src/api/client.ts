import axios from 'axios'

const adminApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api',
  withCredentials: true,
})

adminApiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const currentPath = window.location.pathname
      if (currentPath !== '/entrar') {
        window.location.href = '/entrar'
      }
    }
    return Promise.reject(error)
  }
)

export default adminApiClient
