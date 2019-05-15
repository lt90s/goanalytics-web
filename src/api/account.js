import request from '@/utils/request'

export function getAccounts() {
  return request({
    url: '/admin/auth/account/all',
    method: 'get'
  })
}

export function createAccount(data) {
  return request({
    url: '/admin/auth/account',
    method: 'post',
    data
  })
}

export function deleteAccount(data) {
  return request({
    url: '/admin/auth/account',
    method: 'delete',
    data
  })
}
