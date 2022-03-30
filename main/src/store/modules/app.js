const app = {
  namespaced: true,
  state: {
    // 应用切换过渡
    appLoading: false,
    // 子路由跳转路径，用于左侧菜单渲染
    path: '',
    // 子应用名称
    appName: '',
    // 是否跨应用跳转
    isAcrossApplication: false,
  },
  mutations: {
    setPathM: (state, data) => {
      state.path = data
    },
    setAppNameM: (state, data) => {
      state.appName = data
    },
    setIsAcrossApplicationM: (state, data) => {
      state.isAcrossApplication = data
    },
    setAppLoadingM: (state, data) => {
      state.appLoading = data
    },
  },
  actions: {
    setPath({ commit }, data) {
      commit('setPathM', data)
    },
    setAppName({ commit }, data) {
      commit('setAppNameM', data)
    },
    setIsAcrossApplication({ commit }, data) {
      commit('setIsAcrossApplicationM', data)
    },
    setAppLoading({ commit }, data) {
      console.log('data', data)
      commit('setAppLoadingM', data)
    },
  },
  getters: {},
}

export default app
