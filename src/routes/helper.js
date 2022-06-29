import instance from '@/utils/axios';
import store from '@/store';

export let userInfoOk = false

export const getUserInfo = () => {
  return instance.get('/api/getLoginUserInfo').then(({data}) => {
    userInfoOk = true
    store.commit('user/SET_USER_INFO', data)
  })
}
