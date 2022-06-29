import { generatePromise } from '@/utils/helper'
import Vue from 'vue'
export default {
  namespaced: true,
  state: {
    fullLoading: false,
    floatingMenuShow: false,
    menuCollapsed: false,
    menuHidden: true,
    currentPageType: 'iframe', // iframe 或者 page
    BIViewURL: '',
    indexPage: {},
    topLevelMenus: [],
    topLevelMenusMap: {},
    globalMenuMap: {},
    currentTopLevelMenu: {},
    currentAsideMenu: [],
    asideMenuOpenedKeys: [],
    searchedKeyword: '',
    filteredAsideMenu: [],
    cachedTabMenu: [],
    currentTab: '', // 底部tab切换
    bigScreenMenuMaps: {},
    lastRoute: '', // 存储打开管理菜单前的路由，在关闭管理菜单后跳转回去
    initAsideMenuFinishPromise: generatePromise()
  },
  mutations: {
    SET_ASIDE_MENU_OPENED_KEYS: (state, payload) => {
      state.asideMenuOpenedKeys = payload
    },
    SET_FULL_LOADING: (state, payload) => {
      state.fullLoading = payload
    },
    SET_FLOAT_MENU_SHOW: (state, payload) => {
      state.floatingMenuShow = payload
    },
    SET_MENU_COLLAPSED: (state, payload) => {
      state.menuCollapsed = payload
    },
    SET_INDEX: (state, payload) => {
      state.indexPage = payload
    },
    SET_BI_VIEW_URL: (state, payload) => {
      state.BIViewURL = payload
    },
    SET_TOP_LEVEL_MENUS: (state, payload) => {
      state.topLevelMenus = payload
    },
    SET_TOP_LEVEL_MENUS_MAP: (state, payload) => {
      state.topLevelMenusMap = payload
    },
    SET_CURRENT_TOP_LEVEL_MENU: (state, payload) => {
      state.currentTopLevelMenu = payload
    },
    SET_CURRENT_ASIDE_MENU: (state, payload) => {
      state.currentAsideMenu = payload
    },
    SET_SEARCHED_KEYWORD: (state, payload) => {
      state.searchedKeyword = payload
    },
    SET_FILTERED_ASIDE_MENU: (state, payload) => {
      state.filteredAsideMenu = payload
    },
    UPDATE_FILTERED_ASIDE_MENU: (state, payload) => {
      const { id, properties } = payload
      const walk = (tree) => {
        for (let key in tree) {
          if (tree[key].id === id) {
            for (let _key in properties) {
              tree[key][_key] = properties[_key]
            }
          }
          walk(tree[key].subMenu)
        }
        return tree
      }
      state.filteredAsideMenu = walk(state.filteredAsideMenu)
      console.log(state.filteredAsideMenu)
    },
    SET_GLOBAL_MENU_MAP: (state, payload) => {
      // payload is a tree
      const traverse = (tree) => {
        for (let item of tree) {
          if (!state.globalMenuMap[item.id]) {
            Vue.set(state.globalMenuMap, item.id, item)
            // state.globalMenuMap[item.id] = item
          }
          if (item.subMenu && item.subMenu.length) {
            traverse(item.subMenu)
          }
        }
      }
      traverse(payload)
    },
    SET_CURRENT_TAB: (state, payload) => {
      state.currentTab = payload
      console.log(state.currentTab,111111111, payload, state)
    },
    ADD_CACHED_TAB_MENU: (state, payload) => {
      // payload = {path: '/a/xxx_xx', name: '菜单名称', biViewUrl}
      state.currentTab = payload.path
      const leafMenuId = (payload.path || '').split('_').slice(-1)[0]
      if (leafMenuId) {
        const menu = state.globalMenuMap[leafMenuId]
        if (menu) {
          payload.biViewUrl = menu.useBackupsUrl ? menu.backupsUrl : menu.url
        }
      }
      const currentCachedTabMenu = state.cachedTabMenu
      if (currentCachedTabMenu.find(item => item.path === payload.path)) {
        return
      }
      currentCachedTabMenu.push(payload)
    },
    REMOVE_CACHED_TAB_MENU: (state, payload) => {
      // payload 为 path
      const index = state.cachedTabMenu.findIndex(_ => _.path === payload)
      if (index > -1) {
        state.cachedTabMenu.splice(index, 1)
      }
    },
    SET_CACHED_TAB_MENU: (state, payload) => {
      state.cachedTabMenu = payload
      console.log(state.cachedTabMenu, 2222222222)
    },
    SET_MENU_HIDDEN: (state, payload) => {
      state.menuHidden = payload
    },
    SET_BIG_SCREEN_MENU_MAP: (state, payload) => {
      state.bigScreenMenuMaps = payload
    },
    SET_LAST_ROUTE: (state, payload) => {
      state.lastRoute = payload
    }
  }
}
