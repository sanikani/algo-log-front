import axios from 'axios'

import { env } from '../config/env'
import { ApiError, type ApiResponse, type FieldErrorDetail } from '../types/api'

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response
    const body = response?.data as Partial<ApiResponse<FieldErrorDetail[]>> | undefined

    if (response && body?.status && body?.code && body?.message) {
      return Promise.reject(new ApiError(body.status, body.code, body.message, body.data))
    }

    return Promise.reject(new ApiError(500, 'NETWORK_ERROR', '서버와 통신할 수 없습니다.'))
  },
)
