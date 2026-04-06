const fallbackApiBaseUrl = 'http://localhost:8080'
const fallbackAppUrl = 'http://localhost:5173'

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? fallbackApiBaseUrl,
  appUrl: import.meta.env.VITE_APP_URL ?? fallbackAppUrl,
}
