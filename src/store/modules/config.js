const state = {
  appId: '',
  name: '',
  channels: [],
  platforms: ['ios', 'android'],
  versions: []
}

const mutations = {
  SET_APPID: (state, appId) => {
    state.appId = appId
  },
  SET_APPNAME: (state, name) => {
    state.name = name
  },
  SET_CHANNELS: (state, channels) => {
    state.channels = channels
  },
  SET_VERSIONS: (state, versions) => {
    state.versions = versions
  }
}

const actions = {
  setAppId({ commit }, appId) {
    commit('SET_APPID', appId)
  },

  setAppName({ commit }, name) {
    commit('SET_APPNAME', name)
  },
  getConfig({ commit, state }) {
    if (state.appId === '') {
      alert('appId cannot be empty')
      return
    }
    commit('SET_CHANNELS', ['huawei', 'xiaomi', 'google', 'appStore'])
    commit('SET_VERSIONS', ['1.0.0', '1.2.0', '2.0.0'])
  },
  resetAppId({ commit }) {
    commit('SET_APPID', '')
    commit('SET_APPNAME', '')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

