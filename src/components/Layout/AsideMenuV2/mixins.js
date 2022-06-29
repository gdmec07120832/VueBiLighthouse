import { mapState } from 'vuex'
import Bus from '@/utils/bus'

export default {
  computed: {
    ...mapState('app', ['filteredAsideMenu',
      'cachedTabMenu', 'menuCollapsed', 'currentAsideMenu',
      'currentTopLevelMenu', 'indexPage', 'asideMenuOpenedKeys']),
    selectable () {
      const len = this.cachedTabMenu.length
      return len < 7
    },
  },
  methods: {
    handleItemClick (m) {
      if(m.subMenu.length) {
        this.currentFolderId = m.id
        this.currentFolder = m
      } else {
        const _menuPath = [m.id]
        let _m = JSON.parse(JSON.stringify(m))
        while (_m?.parentId) {
          _menuPath.unshift(_m.parentId)
          _m = this.$store.state.app.globalMenuMap[_m.parentId]
        }
        const menuPath = _menuPath.join('_')
        const path = this.$router.resolve({ name: 'x', params: { menuPath } }).href

        const found = this.cachedTabMenu.find(_ => {
          return String(m.id) === _.path.split('_').slice(-1)[0]
        })
        if (this.cachedTabMenu.length >= 7 && !found) {
          this.$notification.open({
            message: '提示',
            placement: 'bottomRight',
            description: '您打开的报表数量达到上限，请关闭部分已打开的报表后再试！',
            icon: () => <a-icon type="sound" style="color: #f9ab07"/>
          })
          return
        }
        Bus.$emit('asideMenu__selectedPage')
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
            name: m.cnName
          })
        }
      }
    }
  }
}