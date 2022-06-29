<template>
  <div class="global-layout" :class="{menuCollapsed: menuCollapsed}">
    <div class="top-nav">
      <LogoWrapper />
      <TopMenu :menus="topLevelMenus"
               @itemClick="topLevelMenuClick" :current="currentTopLevelMenu"/>
      <TopMenuRight />
    </div>
    <div class="flex" style="align-items: flex-start">
      <div class="side-menu" :class="{'hide-aside-menu': menuHidden}">
        <div v-if="!menuCollapsed" class="menu-tabs">
          <div class="tab-item" :class="{active: currentMenuType === 1}" @click="toggleMenuType(1)"><span>收藏</span>
          </div>
          <div class="tab-item" :class="{active: currentMenuType === 2}" @click="toggleMenuType(2)"><span>灯塔列表</span>
          </div>
          <div class="tab-item" :class="{active: currentMenuType === 3}" @click="toggleMenuType(3)"><span>大屏</span>
          </div>
        </div>
        <div class="menu-content-wrap">
          <div style="height: calc(100vh - 90px)">
            <template v-if="currentMenuType === 1">
              <collected-menu/>
            </template>
            <template v-if="currentMenuType === 2">
              <aside-menu />
            </template>
            <template v-if="currentMenuType === 3">
              <big-screen-menu/>
            </template>
          </div>
        </div>
        <div class="collapse-wrap" @click="toggleCollapse">
          <a-icon :type="menuCollapsed ? 'caret-right' : 'caret-left'"/>
        </div>
      </div>
      <div class="page-content-main">
        <div class="global-notice" v-if="showGlobalNotice && globalNoticeText">
          <div ref="globalNoticeText"
               style="position: relative; margin-left: 20px; margin-right: 30px; white-space: nowrap;">
            {{ globalNoticeText }}
          </div>
          <div style="position: absolute; right: 0; top: 0; cursor: pointer; padding: 0 10px; background: lightyellow"
               title="关闭"
               @click="showGlobalNotice = false">
            <a-icon type="close-circle"></a-icon>
          </div>
        </div>
        <div class="content" ref="contentWrapper" :style="{height: cachedTabMenu.length
        ? `calc(100vh - ${(showGlobalNotice && globalNoticeText) ? 114 : 90}px)`
        : `calc(100vh - ${(showGlobalNotice && globalNoticeText) ? 74 : 50}px)`}">
          <keep-alive :include="['BI-View']">
            <router-view/>
          </keep-alive>
        </div>
        <SlickList :value="cachedTabMenu" :distance="5" @input="tabOnDrop" lockAxis="x" axis="x" @sort-start="tabOnDragStart" @sort-end="tabOnDragEnd">
          <SlickItem v-for="(menu, index) in cachedTabMenu" :key="menu.path" :index="index" style="display: inline-block">
            <div class="page-tab__item" :class="{active: currentTab === menu.path}"
                 @click="onTabClick(menu.path)">
              <a-dropdown :trigger="['contextmenu']">
                <div @dblclick="onTabDbClick(menu)"
                     style="display: inline-block; line-height: 38px; vertical-align: middle; white-space: nowrap">
                  <span>{{ menu.name }}</span>
                  <a-icon @click.stop="onTabEdit(menu.path)" type="close" style="margin-left: 5px; font-size: 12px;"/>
                </div>
                <a-menu slot="overlay" @click="handleTabContextMenuClick($event, menu)">
                  <a-menu-item key="3">
                    <span style="vertical-align: middle; font-size: 13px">
                       <a-icon type="vertical-right"/><span>关闭左侧</span>
                    </span>
                  </a-menu-item>
                  <a-menu-item key="2">
                     <span style="vertical-align: middle; font-size: 13px">
                       <a-icon type="vertical-left"/><span>关闭右侧</span>
                    </span>
                  </a-menu-item>
                  <a-menu-item key="5">
                    <span style="vertical-align: middle; font-size: 13px">
                      <a-icon type="stop"/><span>关闭所有</span>
                    </span>
                  </a-menu-item>
                  <a-menu-item key="4">
                    <span style="vertical-align: middle; font-size: 13px">
                      <a-icon type="close-circle"/><span>关闭其他</span>
                    </span>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
          </SlickItem>
        </SlickList>
      </div>
    </div>
    <Sidebar v-if="$route.name === 'x'"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {flattenTree} from '@/utils/helper'
import AsideMenu from '@/components/Layout/AsideMenuV2/AsideMenu'
import Bus from '@/utils/bus'
import CollectedMenu from '@/components/Layout/CollectedMenu/CollectedMenu'
import {createDialog} from '@/utils/helper'
import BigScreenMenu from '@/components/Layout/BigScreenMenu/BigScreenMenu'
import PreviewMsg from '@/views/Admin/info-manage/PreviewMsg'
import releaseModal from '@/views/Admin/release-version-mgmt/components/releaseModal'
import TopMenu from '@/components/Layout/TopMenu'
import { SlickList, SlickItem } from 'vue-slicksort';
import { message } from 'ant-design-vue'
import TopMenuRight from '@/components/Layout/TopMenuRight'
import LogoWrapper from '@/components/Layout/LogoWrapper'

import Sidebar from '@/components/Layout/Sidebar/index'
import introMixin from '@/components/Layout/introMixins/introMixin'

const PreviewMsgService = createDialog(PreviewMsg)


export default {
  name: 'Layout',
  mixins: [introMixin],
  components: {
    LogoWrapper,
    TopMenuRight,
    TopMenu,
    BigScreenMenu,
    CollectedMenu,
    AsideMenu,
    SlickList, SlickItem,
    Sidebar
  },
  computed: {
    ...mapState('app', ['topLevelMenus', 'currentTopLevelMenu',
      'menuCollapsed', 'cachedTabMenu', 'currentTab', 'menuHidden', 'asideMenuOpenedKeys']),
    ...mapState('user', ['userInfo']),
  },
  data() {
    return {
      globalNoticeText: '',
      showGlobalNotice: true,
      ws: null,
      asideMenuLoading: false,
      asideContextMenuVisible: false,
      cachedCurrentMenuType: 2,
      currentMenuType: 2,
      searchKeyword: '',
    }
  },
  watch: {
    menuCollapsed(val) {
      if (val) {
        this.cachedOpenKeys = this.asideMenuOpenedKeys.slice()
        this.$store.commit('app/SET_ASIDE_MENU_OPENED_KEYS', [])

        this.cachedCurrentMenuType = this.currentMenuType
        this.currentMenuType = 2
      } else {
        this.$store.commit('app/SET_ASIDE_MENU_OPENED_KEYS', this.cachedOpenKeys.slice())

        this.currentMenuType = this.cachedCurrentMenuType
      }
    },
  },
  created() {
    if (this.$route.name === 's') {
      this.currentMenuType = 3
    }
    this._getTopLevelMenu().then(() => {
      if (this.$route.name === 'x') {
        const menuPath = this.$route.params.menuPath
        const [topLevelId] = (menuPath || '').split('_')
        if (topLevelId) {
          if (topLevelId === 'collected') {
            this.toggleMenuType(1)
          } else {
            const menu = this.$store.state.app.topLevelMenusMap[topLevelId]
            console.log(menu)
            this.$store.commit('app/SET_CURRENT_TOP_LEVEL_MENU', menu)
            this._getAsideMenuById(menu.id)
          }
        }
      }
    })
    this.getIndexNotify()
    this.getGlobalNotice()
    this.initWebSocket()
    this.getReleaseNotice()
  },
  beforeDestroy() {
    if (this.ws) {
      this.ws.close()
    }
  },
  methods: {
    initWebSocket() {
      this.ws = new WebSocket(`ws://${location.host}/lighthouse/ws/access/${this.userInfo.username}`)
      this.ws.addEventListener('message', (e) => {
        const data = e.data
        try {
          let notifyData = JSON.parse(data)
          if (notifyData['msgType'] === 'SystemMsg') {
            // pass
            PreviewMsgService.create.call(this, {
              propsData: {
                rowData: {
                  title: notifyData.title,
                  content: notifyData.content
                }
              }
            })
          }
        } catch (e) {
          console.log(e)
        }
      })
    },
    getIndexNotify() {
      const _this = this
      this.$axios.get('/api/notice/getHomePageNoticeToday').then(({data}) => {
        const [info] = data
        if (info) {
          const preview = () => {
            PreviewMsgService.create.call(_this, {
              propsData: {
                rowData: info
              }
            })
          }
          this.$notification.open({
            duration: 6,
            class: 'custom-info-notification',
            message: info.title,
            // eslint-disable-next-line no-unused-vars
            description: function (h) {
              return <div style="cursor: pointer;line-height: 22px" onClick={preview}>
                {info.content}
              </div>
            },
            placement: 'bottomRight'
          })
        }
      })
    },
    getGlobalNotice() {
      const scrollGlobalText = () => {
        const ref = this.$refs['globalNoticeText']
        if (ref) {
          if (ref.scrollWidth > ref.clientWidth) {
            let left = parseInt(getComputedStyle(ref).left)
            if (left > (-ref.clientWidth)) {
              left = left - 1
              ref.style.left = left + 'px'
            } else {
              ref.style.left = 0 + 'px'
            }
            setTimeout(scrollGlobalText, 50)
          } else {
            ref.style.left = 0 + 'px'
          }
        }
      }

      this.$fetchSql('data_light', 'notice').then(res => {
        const noticeText = res.data?.[0]?.['FLAG']
        this.globalNoticeText = noticeText
        setTimeout(() => {
          if (this.$refs['globalNoticeText']) {
            try {
              const eleResizeObserver = new ResizeObserver(() => {
                scrollGlobalText()
              })
              eleResizeObserver.observe(this.$refs['globalNoticeText'])
            } catch (err) {
              console.log(err)
            }
          }
        }, 500)
      })
    },
    handleAsideContextMenuClick(e) {
      this.asideContextMenuVisible = false
      if (e.key === '1') {
        this.$refs['asideMenu'].openAll()
      } else if (e.key === '2') {
        this.$refs['asideMenu'].collapseAll()
      }
    },
    filterMenuAction() {
      const globalMenuMap = this.$store.state.app.globalMenuMap
      const currentAsideMenus = this.$store.state.app.currentAsideMenu
      const topLevelMenuIds = this.$store.state.app.topLevelMenus.map(_ => _.id)
      const q = this.searchKeyword
      if (!(q.trim())) {
        Bus.$emit('search-menu-finished', [])
        this.$store.commit('app/SET_FILTERED_ASIDE_MENU', currentAsideMenus)
      } else {
        const result = []
        const searchResultOpenedKeys = []
        const flattenMenus = flattenTree(currentAsideMenus, 'subMenu')
        const filteredMenus = flattenMenus.filter(menu => {
          return (menu.cnName.toLowerCase()).indexOf(q.toLowerCase()) > -1
        })
        // 真实搜索结果的扁平数组， 包含结果中的所有子级
        // 但没有包含断层的父级。即关键词只匹配到了子级，没有匹配到父级，下一步需要补充断层的父级
        const flattenFilteredMenus = flattenTree(filteredMenus, 'subMenu')
        const filteredMenusMap = {}
        for (let menu of flattenFilteredMenus) {
          if (!filteredMenusMap[menu.id]) {
            filteredMenusMap[menu.id] = {...menu, subMenu: []}
          }
          if (!filteredMenusMap[menu.parentId] && topLevelMenuIds.indexOf(menu.parentId) === -1) {
            // 补充断层的父级
            let parent = JSON.parse(JSON.stringify({
              ...globalMenuMap[menu.parentId],
              subMenu: []
            }))
            filteredMenusMap[menu.parentId] = parent
            flattenFilteredMenus.push(parent)
          }
        }

        Object.keys(filteredMenusMap).forEach(id => {
          const menu = filteredMenusMap[id]
          if (!filteredMenusMap[menu.parentId]) {
            result.push(menu)
            searchResultOpenedKeys.push(menu.id)
          } else {
            filteredMenusMap[menu.parentId].subMenu.push(menu)
            searchResultOpenedKeys.push(menu.parentId)
          }
        })
        Bus.$emit('search-menu-finished', Array.from(new Set(searchResultOpenedKeys)))
        this.$store.commit('app/SET_FILTERED_ASIDE_MENU', result)
      }
    },
    _getTopLevelMenu() {
      return this.$axios.get('/api/menu/getRankOneMenusByLoginUser').then(({data}) => {
        const [indexPage] = data
        this.$store.commit('app/SET_GLOBAL_MENU_MAP', data)
        this.$store.commit('app/SET_INDEX', indexPage)
        this.$store.commit('app/SET_TOP_LEVEL_MENUS', data)
        const menusMap = {}
        for (let m of data) {
          menusMap[m.id] = m
        }
        this.$store.commit('app/SET_TOP_LEVEL_MENUS_MAP', menusMap)
      })
    },
    _getAsideMenuById(id) {
      this.asideMenuLoading = true
      return this.$axios.get('/api/menu/getSubMenusByRankOneMenuIdAndLoginUser', {
        params: {rankOneMenuId: id}
      }).then(({data}) => {
        this.asideMenuLoading = false
        this.$store.commit('app/SET_GLOBAL_MENU_MAP', data)
        this.$store.commit('app/SET_CURRENT_ASIDE_MENU', data)
        this.$store.commit('app/SET_FILTERED_ASIDE_MENU', JSON.parse(JSON.stringify(data)))
        this.$store.state.app.initAsideMenuFinishPromise[1]()
        if (!data.length) {
          this.$store.commit('app/SET_MENU_HIDDEN', true)
        } else {
          this.$store.commit('app/SET_MENU_HIDDEN', false)
        }
      }).finally(() => {
        // this.asideMenuLoading = false
      })
    },
    topLevelMenuClick(menu) {
      this.currentMenuType = 2
      this.$store.commit('app/SET_CURRENT_TOP_LEVEL_MENU', menu)
      this.$store.commit('app/SET_CURRENT_TAB', '')
      this._getAsideMenuById(menu.id).then(() => {
        this.$router.push({
          name: 'x',
          params: {menuPath: menu.id + ''}
        })
      })
    },
    toggleMenuType(type) {
      this.currentMenuType = type
    },
    toggleCollapse() {
      const cur = this.menuCollapsed
      this.$store.commit('app/SET_MENU_COLLAPSED', !cur)
    },
    onTabClick(key) {
      this.$store.commit('app/SET_CURRENT_TAB', key)
      this.$store.commit('app/SET_MENU_HIDDEN', false)
      console.log(this.$store.state.app.menuHidden)
      this.$router.push(key)
    },
    onTabDbClick(item) {
      this.onTabEdit(item.path)
    },
    onTabEdit(targetKey) {
      let activeKey = this.currentTab
      let lastIndex
      this.cachedTabMenu.forEach((route, i) => {
        if (route.path === targetKey) {
          lastIndex = i - 1
        }
      })
      const otherTab = this.cachedTabMenu.filter(tab => tab.path !== targetKey)
      if (otherTab.length) {
        if (otherTab.length && targetKey === activeKey) {
          if (lastIndex >= 0) {
            activeKey = otherTab[lastIndex].path
          } else {
            activeKey = otherTab[0].path
          }
        }
      }
      if (!otherTab.length) {
        activeKey = ''
      }
      this.$store.commit('app/REMOVE_CACHED_TAB_MENU', targetKey)
      this.$store.commit('app/SET_CURRENT_TAB', activeKey)
      if (activeKey) {
        this.$router.push(activeKey)
      } else {
        const id = this.$store.state.app.currentTopLevelMenu.id || ''
        this.$router.push({
          name: 'x',
          params: {
            menuPath: String(id)
          }
        })
      }
    },
    tabOnDrop(dropResult) {
      this.$refs['contentWrapper'].style.pointerEvents = 'auto'
      this.$store.commit('app/SET_CACHED_TAB_MENU',dropResult.filter(Boolean))
    },
    tabOnDragStart() {
      this.$refs['contentWrapper'].style.pointerEvents = 'none'
    },
    tabOnDragEnd () {
      this.$refs['contentWrapper'].style.pointerEvents = 'auto'
    },
    closeBatch(menu, type) {
      const index = this.cachedTabMenu.findIndex(item => item.path === menu.path)
      let shouldRemovedTab = []
      switch (type) {
        case 'closeRight':
          shouldRemovedTab = this.cachedTabMenu.filter((v, i) => i > index)
          break;
        case 'closeLeft':
          shouldRemovedTab = this.cachedTabMenu.filter((v, i) => i < index)
          break;
        case 'closeOther':
          shouldRemovedTab = this.cachedTabMenu.filter((v, i) => i !== index)
          break;
        case 'closeAll':
          shouldRemovedTab = this.cachedTabMenu.slice()
          break;
        default:
          shouldRemovedTab = []
      }
      shouldRemovedTab.forEach((item) => {
        this.onTabEdit(item.path)
      })

    },
    handleTabContextMenuClick(e, menu) {
      const {key} = e
      switch (key) {
        case '1':
          // 关闭点击的
          this.onTabEdit(menu.path)
          break;
        case '2':
          // 关闭右侧的
          this.closeBatch(menu, 'closeRight')
          break;
        case '3':
          // 关闭左侧的
          this.closeBatch(menu, 'closeLeft')
          break;
        case '4':
          // 关闭其他的
          this.closeBatch(menu, 'closeOther')
          break;
        case '5':
          // 关闭全部的
          this.closeBatch(menu, 'closeAll')
          break;
        default:
          //
      }
    },
    requestFull() {
      const el = document.querySelector('#BiViewer')
      if (el.requestFullscreen) {
        el.requestFullscreen()
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen()
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else {
        message.error('抱歉，您的浏览器不支持全屏操作')
      }
    },
    getReleaseNotice() {
      this.$axios.get('/api/admin/noticeCenter/hasNewVersion').then(({data}) => {
        if (data) {
          this.$axios.get('/api/admin/noticeCenter/hasRead', {
            params: {noticeId: data.id}
          })

          const indexPage = data.details['detailList'].find(_ => {
            return _.detailType === 0
          })
          const contentPages = data.details['detailList'].filter(_ => _.detailType === 1)

          const lastPage = data.details['detailList'].find(_ => _.detailType === 2)

          if (!indexPage || !contentPages.length) {
            return
          }

          if (lastPage) {
            contentPages.push({
              ...lastPage,
              imgUrl: lastPage.imgUrl.startsWith('/img') ? require('@/assets/images/release-notice/last-bg.png')
                  : lastPage.imgUrl,
              itemName: '结束页'
            })
          }

          this.$modal.show(releaseModal, {
            closeBtn: true,
            isPreview: false,
            pushConfig: {
              coverId: indexPage.id,
              coverTitle: indexPage.itemName,
              descText: indexPage.description,
              versionName: data.details.versionName
            },
            contentPages: contentPages.map(item => {
              return {
                ...item,
                reportName: item.itemName,
                descText: item.description
              }
            })
          }, {
            clickToClose: false, width: 1200, height: 'auto', classes: ['release-modal']
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.global-layout {
  min-width: 1366px;
}

.right-bottom-side-bar {
  width: 40px;
  position: fixed;
  bottom: 60px;
  right: 25px;
  font-size: 0;
  line-height: 0;
  z-index: 100;
}

.menuCollapsed {
  .side-menu {
    width: 0;
    flex: 0 1 0;
  }

  .collapse-menu-tab {
    line-height: 45px;
    height: 45px;
    text-align: center;
    font-weight: bold;
    color: #46BCA0;
    border-right: 1px solid #eee;
    user-select: none;
    cursor: pointer;
  }

  .search-wrap {
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
}


.side-menu {
  position: relative;
  flex: 0 1 210px;
  z-index: 100;
  box-shadow: rgba(17, 17, 26, .1) 1px 0 0;
  width: 210px;
  background: #fefefe;
  height: calc(100vh - 50px);

  &.hide-aside-menu {
    width: 0;
    flex: 0 1 0;
    overflow: hidden;
  }
}

.page-content-main {
  flex: 1;
  width: calc(100vw - 250px);

  .content {
    user-select: none;
    height: calc(100vh - 50px);
    width: 100%;
  }
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background: var(--top-nav-bg-color);
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.05);
}

.menu-tabs {
  display: flex;
  position: relative;
  overflow: hidden;
  background-color: #dbdbdb;

  &:after {
    position: absolute;
    content: "";
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(107, 108, 109, 0.19);
  }

  .tab-item {
    position: relative;
    height: 40px;
    width: calc(100% / 3);
    text-align: center;
    line-height: 40px;
    font-size: 14px;
    user-select: none;
    cursor: pointer;

    > span {
      position: relative;
      z-index: 2;
    }

    &:first-child {
      border-radius: 8px 0 0 0;
    }

    &:last-child {
      border-radius: 0 8px 0 0;
    }

    &.active {
      font-weight: bold;
      color: #46BCA0;
      box-sizing: content-box;

      &:after {
        position: absolute;
        content: "";
        left: 0;
        bottom: 0;
        height: 2px;
        background-color: #46BCA0;
        right: 0;
        z-index: 1;
        width: 100%;
      }
    }
  }
}

.page-tab__item {
  height: 40px;
  margin: 0 2px 0 0;
  padding: 0 16px;
  line-height: 38px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 4px 4px 0 0;
  transition: all .3s ease-in-out;
  color: rgba(0, 0, 0, .65);
  cursor: pointer;
  user-select: none;

  .anticon {
    height: 14px;
    width: 16px;
    color: rgba(0, 0, 0, .45);

    &:hover {
      color: rgba(0, 0, 0, .85);
    }
  }

  &:hover, &.active {
    color: #46BCA0;
  }

  &.active {
    background: #ffffff;
  }
}

.menu-content-wrap {
  height: calc(100vh - 90px);
  overflow: hidden;
  //border-right: 1px solid #dbdbdb;
  background: #dbdbdb;
}

.search-wrap {
  text-align: center;
  padding: 10px 15px;

  .search-input {
    /deep/ input {
      height: 32px;
      line-height: 32px;
      border-radius: 0;
      border-color: #eee !important;
      box-shadow: none;
    }
  }
}

.menu-tree {
  height: calc(100% - 60px);
  overflow-y: auto;
  overflow-x: hidden;

  /deep/ .ant-menu-inline {
    border-right-color: transparent;

    .ant-menu-item:hover {
      background-color: #edfcf6;
    }

    .ant-menu-item::after {
      left: 0;
      right: auto;
    }
  }

  /deep/ .ant-menu-submenu-title:hover {
    background-color: #edfcf6;
  }

  /deep/ .ant-menu-vertical {
    border-right-color: transparent;
  }

  &::-webkit-scrollbar {
    width: 0;
  }

  /deep/ .ant-menu-submenu[deep='0'] {
    border-bottom: 1px solid rgba(107, 108, 109, .19);
  }

  /deep/ .ant-menu-item[deep='0'] {
    border-bottom: 1px solid rgba(107, 108, 109, .19);
  }
}

.collapse-wrap {
  position: absolute;
  top: 40%;
  width: 20px;
  height: 30px;
  right: -20px;
  z-index: 99;
  background: #dbdbdb;
  border-radius: 0 5px 5px 0;
  cursor: pointer;

  /deep/ .anticon {
    width: 18px;
    line-height: 33px;
    color: #666;
  }
}

.floating-menu-trigger {
  width: 2px;
  background: transparent;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  z-index: 90;
}


.global-notice {
  width: 100%;
  padding: 2px 0;
  background: lightyellow;
  z-index: 100;
  position: relative;
  height: 24px;
  overflow: hidden;
}
</style>
