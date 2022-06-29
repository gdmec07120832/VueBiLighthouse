<template>
  <div ref="BIViewer" class="frame-wrapper" id="BiViewer">
    <template v-show="lazyCachedTabMenu.length && lazyCachedTabMenu.find((_) => _.biViewUrl === BIViewURL)">
      <iframe
        class="cachedTabMenu"
        ref="frame"
        v-for="item in lazyCachedTabMenu"
        :key="item.biViewUrl"
        width="100%"
        height="100%"
        :src="urlWithToken(item.biViewUrl)"
        :style="{ opacity: BIViewURL === item.biViewUrl ? 1 : 0, zIndex: BIViewURL === item.biViewUrl ? 99 : 1 }"
        style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; border: 0"
      ></iframe>
    </template>

    <iframe
      class="notCachedTabMenu"
      ref="frame0"
      width="100%"
      height="100%"
      v-if="!lazyCachedTabMenu.find((item) => item.biViewUrl === BIViewURL)"
      :src="urlWithToken(BIViewURL)"
      :style="{
        opacity: !(lazyCachedTabMenu.length && lazyCachedTabMenu.find((_) => _.biViewUrl === BIViewURL)) ? 1 : 0,
        zIndex: !(lazyCachedTabMenu.length && lazyCachedTabMenu.find((_) => _.biViewUrl === BIViewURL)) ? 99 : 1,
      }"
      style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; border: 0"
    ></iframe>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

export default {
  name: 'BI-View',
  data() {
    return {
      oldTabMenu: [],
      lazyCachedTabMenu: [],
    }
  },
  computed: {
    ...mapState('app', ['BIViewURL', 'cachedTabMenu', 'globalMenuMap']),
    cachedTabMenuStringify() {
      return JSON.stringify(this.$store.state.app.cachedTabMenu || [])
    },
  },
  watch: {
    cachedTabMenuStringify: {
      handler(val, oldVal) {
        const _val = JSON.parse(val)
        const _oldVal = JSON.parse(oldVal)
        if (_val.length !== _oldVal.length) {
          this.oldTabMenu = _val
        }
        this.lazyCachedTabMenu = this.oldTabMenu
      },
    },
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 122) {
        e.preventDefault()
        this.$refs['BIViewer'].requestFullscreen()
      }
    })
      this.$nextTick(() => {
          window.addEventListener('message', this.openAnyWeb)
      })
  },
    beforeDestroy() {
      window.removeEventListener('message', this.openAnyWeb)
    },
    beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.state.app.initAsideMenuFinishPromise[0].then(() => {
        vm.resolveBIURL(vm.$route)
        const menuPath = vm.$route.params.menuPath
        const pathArr = (menuPath || '').split('_')
        if (pathArr.length > 1) {
          const id = pathArr.pop()
          vm.$store.commit('app/ADD_CACHED_TAB_MENU', {
            path: vm.$route.path,
            name: vm.$store.state.app.globalMenuMap[id].cnName,
          })
        }
      })
    })
  },
  beforeRouteUpdate(to, from, next) {
    this.resolveBIURL(to)
    next()
  },
  methods: {
      async openAnyWeb(val) {
          if(typeof val.data !== 'string') return
          if(!val.data.includes('webTitle') && !val.data.includes('新零售驾驶舱')) return
          // '4_662_2904'
          console.log(JSON.parse(val.data))
          let menuPath = JSON.parse(val.data).url.split('/x/').reverse()[0]
          let path = this.$router.resolve({ name: 'x', params: { menuPath } }).href
          let res = await this.$axios.get('/api/menu/getSubMenusByRankOneMenuIdAndLoginUser', {
              params: {rankOneMenuId: menuPath.split('_')[0]}
          })
          let data = res.data
          this.$store.commit('app/SET_GLOBAL_MENU_MAP', data)
          this.$store.commit('app/SET_CURRENT_TAB', path)
          this.$store.commit('app/SET_MENU_HIDDEN', false)
          const name = this.globalMenuMap[menuPath.split('_').reverse()[0]].cnName
          const key = menuPath
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
                  path,
                  name,
              })
          }
      },
    urlWithToken(url) {
      const token = Cookies.get('lsmyToken')
      if (token && url) {
        return url + '&token=' + token
      } else {
        return url
      }
    },
    resolveBIURL(route) {
      const menuPath = route.params.menuPath
      const leafMenuId = (menuPath || '').split('_').slice(-1)[0]
      if (leafMenuId && this.globalMenuMap[leafMenuId]) {
        const theMenu = this.globalMenuMap[leafMenuId]
        if (theMenu.menuType === 'Report') {
          this.$axios.get('/api/admin/common/log/save', {
            params: {
              logLevel: 'Info',
              logType: 'Web',
              description: '访问',
              logSource: 'ReportView',
              extAssociationKey: theMenu.versionMainNum + '_' + theMenu.versionSubNum,
              methodName: 'YH',
              qualifiedName: menuPath
                .split('_')
                .map((_) => {
                  return (this.globalMenuMap[_] || {}).cnName
                })
                .join('-'),
            },
            silent: true,
          })
        }
        const menu = this.$store.state.app.globalMenuMap[leafMenuId]
        if (menu) {
          this.$store.commit('app/SET_BI_VIEW_URL', menu.useBackupsUrl ? menu.backupsUrl : menu.url)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.frame-wrapper {
  height: 100%;
  position: relative;

  .mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    pointer-events: none;
  }
}
</style>
