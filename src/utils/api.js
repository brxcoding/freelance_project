import axios from "axios"

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const refresh = localStorage.getItem("refreshToken")
    if (error.response?.status === 401 && refresh && !original._retry) {
      original._retry = true
      try {
        const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh,
        })
        localStorage.setItem("accessToken", data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      }
    }
    return Promise.reject(error)
  },
)

export default api
