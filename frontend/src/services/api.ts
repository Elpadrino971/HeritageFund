import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          })

          const { access_token, refresh_token: newRefreshToken } = response.data

          localStorage.setItem('access_token', access_token)
          localStorage.setItem('refresh_token', newRefreshToken)

          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

// API Services
export const calculatorApi = {
  calculateSuccession: (assetValue: number, relation: string) =>
    api.post('/calculator/succession', { asset_value: assetValue, relation }),

  calculateLoan: (principal: number, annualRate: number, durationMonths: number) =>
    api.post('/calculator/loan', {
      principal,
      annual_rate: annualRate,
      duration_months: durationMonths,
    }),
}

export const campaignsApi = {
  list: (params?: { status?: string; property_type?: string; limit?: number; skip?: number }) =>
    api.get('/campaigns', { params }),

  get: (id: string) => api.get(`/campaigns/${id}`),

  create: (data: any) => api.post('/campaigns', data),

  update: (id: string, data: any) => api.patch(`/campaigns/${id}`, data),

  my: () => api.get('/campaigns/my/campaigns'),
}

export const investmentsApi = {
  create: (campaignId: string, amount: number) =>
    api.post('/investments', { campaign_id: campaignId, amount }),

  my: () => api.get('/investments/my/investments'),

  get: (id: string) => api.get(`/investments/${id}`),
}
