export default {
  namespaced: true,
  state: {
    userInfo: {
      extUser: false,
      hasEditPermission: false,
      alias: '',
      username: ''
    }
  },
  mutations: {
    SET_USER_INFO: (state, payload) => {
      state.userInfo = payload
    }
  }
}
