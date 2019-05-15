import request from '@/utils/request'

export function getApps() {
  return request({
    url: '/admin/app',
    method: 'get'
  })
}

export function createApp(data) {
  return request({
    url: '/admin/app',
    method: 'post',
    data
  })
}

export function deleteApp(appId) {
  return request({
    url: '/admin/app',
    method: 'delete',
    data: {
      appId
    }
  })
}
