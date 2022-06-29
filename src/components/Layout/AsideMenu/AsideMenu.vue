<template>
  <a-menu mode="inline"
          :key="menuCollapsed"
          :inline-collapsed="menuCollapsed"
          :inlineIndent="12"
          v-model="selectedKeys"
          :selectable="selectable"
          :open-keys="asideMenuOpenedKeys"
          @click="menuItemClick"
          @openChange="openChange">
    <template v-for="item in filteredAsideMenu">
      <sub-menu :key="item.id" v-if="item.subMenu && item.subMenu.length" :menu-info="item"></sub-menu>
      <a-menu-item deep="0" v-else :key="item.id" :path="item.url" :title="item.cnName">
        <span style="padding-left: 36px" :title="item.cnName">{{ item.cnName }}</span>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script>
import { mapState } from 'vuex'
import SubMenu from '@/components/Layout/AsideMenu/SubMenu'
import Bus from '@/utils/bus'
import { flattenTree } from '@/utils/helper'

export default {
  name: 'AsideMenu',
  components: { SubMenu },
  computed: {
    ...mapState('app', ['filteredAsideMenu',
      'cachedTabMenu', 'menuCollapsed', 'currentAsideMenu',
      'currentTopLevelMenu', 'indexPage', 'asideMenuOpenedKeys']),
    selectable () {
      const len = this.cachedTabMenu.length
      return len < 7
    }
  },
  watch: {
    indexPage(val) {
      const route = this.$route
      if(route.name === 'x') {
        if(String(route.params.menuPath) === String(val.id)) {
          this.$router.replace('/index')
        }
      }
    },
    $route: {
      handler (route) {
        if (route.name === 'x') {
          const menuPath = route.params.menuPath
          if (String(menuPath) === String(this.indexPage.id)) {
            // this.$store.commit('app/SET_MENU_HIDDEN', true)
            // return
            this.$router.replace('/index')
          } else {
            if (!this.indexPage.id) {
              // this.$store.commit('app/SET_MENU_HIDDEN', false)
            } else {
              if (this.currentTopLevelMenu.id === this.indexPage.id) {
                // this.$store.commit('app/SET_MENU_HIDDEN', true)
                this.$store.commit('app/SET_MENU_COLLAPSED', true)
              } else {
                // this.$store.commit('app/SET_MENU_HIDDEN', false)
              }
            }
          }
          const tailKey = (menuPath || '').split('_').slice(-1)[0]
          if (tailKey) {
            this.selectedKeys = [Number(tailKey)]
          }
        }
        if (route.matched.find(match => match.name === 'a')) {
          // 表示打开管理菜单
          // this.$store.commit('app/SET_MENU_COLLAPSED', true)
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      selectedKeys: [],
      cachedOpenKeys: [],
      openKeys: []
    }
  },
  created () {
    Bus.$on('search-menu-finished', (openedKeys) => {
      this.openKeys = openedKeys
      this.$store.commit('app/SET_ASIDE_MENU_OPENED_KEYS', openedKeys)
    })
  },
  methods: {
    menuItemClick ({ keyPath, item, key }) {
        console.log(keyPath, item, key)
      const topLevelId = this.$store.state.app.currentTopLevelMenu.id
      const menuPath = `${topLevelId}_${keyPath.reverse().join('_')}`
      const path = this.$router.resolve({ name: 'x', params: { menuPath } }).href

      const found = this.cachedTabMenu.find(_ => {
        return String(key) === _.path.split('_').slice(-1)[0]
      })
      if (this.cachedTabMenu.length >= 7 && !found) {
        this.$notification.open({
          message: '提示',
          placement: 'bottomRight',
          description: '您打开的报表数量达到上限，请关闭部分已打开的报表后再试！',
          icon: <a-icon type="sound" style="color: #f9ab07"/>
        })
        return
      }
      if (found) {
        this.$store.commit('app/SET_CURRENT_TAB', found.path)
        this.$router.push(found.path)
      } else {
        this.$router.push({
          name: 'x',
          params: { menuPath }
        })
        this.$store.commit('app/ADD_CACHED_TAB_MENU', {
          path: path,
          name: item.title
        })
      }

    },
    openChange (openKeys) {
      this.openKeys = openKeys
      this.$store.commit('app/SET_ASIDE_MENU_OPENED_KEYS', openKeys)
    },
    openAll () {
      const currentMenuList = flattenTree(this.currentAsideMenu, 'subMenu')
      this.openKeys = currentMenuList.filter(item => item.subMenu && item.subMenu.length).map(_ => _.id)
      this.$store.commit('app/SET_ASIDE_MENU_OPENED_KEYS', this.openKeys)
    },
    collapseAll () {
      this.openKeys = []
      this.$store.commit('app/SET_ASIDE_MENU_OPENED_KEYS', [])
    }
  }
}
</script>

<style scoped>

</style>
