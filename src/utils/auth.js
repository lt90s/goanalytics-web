import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const AppIdKey = 'AppId'

export function getAppId() {
  return Cookies.get(AppIdKey) || 'testAppId'
}

export function setAppId(appId) {
  return Cookies.set(AppIdKey, appId)
}
