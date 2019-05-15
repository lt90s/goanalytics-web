import request from '@/utils/request'

import store from '@/store'

export function getCounter(data) {
  const appId = store.getters.appId

  return request({
    url: '/o/counter?appId=' + appId,
    method: 'post',
    data
  })
}

export function getCpvCounter(name, op, start, end) {
  const appId = store.getters.appId

  return request({
    url: '/o/counter?appId=' + appId,
    method: 'post',
    data: {
      descriptors: [{
        type: 'cpv',
        operator: op,
        name: name,
        start: start,
        end: end
      }]
    }
  })
}

export function getSlotCounter(name, op, start, end) {
  const appId = store.getters.appId

  return request({
    url: '/o/counter?appId=' + appId,
    method: 'post',
    data: {
      descriptors: [{
        type: 'slot',
        operator: op,
        name: name,
        start: start,
        end: end
      }]
    }
  })
}

export function getTrend() {
  const appId = store.getters.appId
  return request({
    url: '/o/counter/trend?appId=' + appId,
    method: 'get'
  })
}

export function getCustomizedCounters() {
  const appId = store.getters.appId
  return request({
    url: '/o/counter/customized?appId=' + appId,
    method: 'get'
  })
}

export function createCustomizedCounter(data) {
  const appId = store.getters.appId
  return request({
    url: '/o/counter/customized?appId=' + appId,
    method: 'post',
    data
  })
}

export function deleteCustomizedCounter(name, type) {
  const appId = store.getters.appId
  return request({
    url: '/o/counter/customized?appId=' + appId,
    method: 'delete',
    data: {
      name,
      type
    }
  })
}
