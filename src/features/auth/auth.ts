import { env } from '../../config/env'

export function getGithubLoginUrl() {
  return `${env.apiBaseUrl}/oauth2/authorization/github`
}

export function getLogoutUrl() {
  return `${env.apiBaseUrl}/logout`
}
