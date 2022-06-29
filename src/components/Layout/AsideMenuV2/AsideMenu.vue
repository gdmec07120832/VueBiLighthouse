<template>
  <div>
    <div class="mx15 my10">
      <a-input v-model="searchKeyword" placeholder="Search" @keyup.enter="handleSearch">
        <a-icon slot="prefix" type="search" @click="handleSearch"/>
      </a-input>
    </div>
    <div>
      <div class="menu-item" :class="{active: curMainMenu && curMainMenu.id === menu.id,
            isOpened: relativePathKeys.includes(String(menu.id)), isCurrentOpened: currentRelativePathKeys.includes(String(menu.id))}"
           @click="handleAsideMenuClick(menu)"
           v-for="menu in filteredAsideMenu" :key="menu.id">
        <div class="menu-item__title">
          {{ menu.cnName }}
        </div>
        <a-icon class="menu-item__arrow-icon" v-if="menu.subMenu.length" type="right"/>
      </div>
    </div>


    <!--  菜单内容页  -->
    <div class="aside-menu-content-wrapper" @click="handleOutClick" v-if="!menuHidden && !menuCollapsed" :style="{pointerEvents: showAsideMenuContent ? 'auto' : 'none'}">
      <div class="aside-menu-content" :class="showAsideMenuContent && 'show'" ref="content">
        <div style="height: 40px;padding: 0 24px; border-bottom: 1px solid rgba(107, 108, 109, 0.19)" class="flex flex-end">
          <div class="aside-menu-content__close-area" @click="closeAsideMenuContent">
            <a-icon type="vertical-right"/>&nbsp;收起
          </div>
        </div>
        <menu-content :menu="(curMainMenu && curMainMenu.subMenu) || []"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MenuContent from '@/components/Layout/AsideMenuV2/MenuContent'
import Bus from '@/utils/bus'
import mixins from './mixins'
import filterDeep from 'deepdash/es/filterDeep.js'

export default {
  name: 'AsideMenu',
  mixins: [mixins],
  components: { MenuContent },
  computed: {
    ...mapState('app', ['filteredAsideMenu', 'searchedKeyword',
      'cachedTabMenu', 'menuCollapsed', 'currentAsideMenu', 'menuHidden',
      'currentTopLevelMenu', 'indexPage', 'asideMenuOpenedKeys']),
    selectable() {
      const len = this.cachedTabMenu.length
      return len < 7
    },
    relativePathKeys() {
      const paths = this.cachedTabMenu.map(item => {
        return item.path.replace('/x/', '').split('_')
      })
      console.log(paths)
      return paths.reduce((acc, cur) => {
        return acc.concat(cur)
      }, [])
    },
    currentRelativePathKeys() {
      return this.$route.path.replace('/x/', '').split('_')
    }
  },

  data() {
    return {
      searchKeyword: '',
      curMainMenu: null,
      showAsideMenuContent: false
    }
  },
  watch: {
    $route: {
      handler(route) {
        if (route.name === 'x') {
          const menuPath = route.params.menuPath
          if (String(menuPath) === String(this.indexPage.id)) {
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
        } else {
          this.$store.commit('app/SET_CURRENT_TAB', '')
        }
        if (route.matched.find(match => match.name === 'a')) {
          // 表示打开管理菜单
          // this.$store.commit('app/SET_MENU_COLLAPSED', true)
        }
      },
      immediate: true
    },
    currentTopLevelMenu() {
      setTimeout(() => {
        this.closeAsideMenuContent()
      }, 100)
    },
    curMainMenu(val) {
      this.showAsideMenuContent = !!val
    }
  },
  created() {
    this.searchKeyword = this.searchedKeyword
    Bus.$on('asideMenu__selectedPage', () => {
      this.closeAsideMenuContent()
    })
  },
  methods: {
    handleSearch() {
      const currentAsideMenus = this.$store.state.app.currentAsideMenu
      const q = this.searchKeyword
      this.$store.commit('app/SET_SEARCHED_KEYWORD', q)
      if (!(q.trim())) {
        Bus.$emit('search-menu-finished', [])
        this.$store.commit('app/SET_FILTERED_ASIDE_MENU', currentAsideMenus)
        const newCurMainMenu = currentAsideMenus.find(item => item.id === this.curMainMenu.id)
        if (newCurMainMenu) {
          this.curMainMenu = newCurMainMenu
        } else {
          this.curMainMenu = currentAsideMenus[0]
        }
      } else {
        const result = filterDeep(currentAsideMenus, (value, key, parentValue, context) => {
          return (value.cnName.toLowerCase()).indexOf(q.toLowerCase()) > -1
        }, {
          childrenPath: ['subMenu'], onTrue: {
            skipChildren: true
          }
        })

        this.$store.commit('app/SET_FILTERED_ASIDE_MENU', result)
        console.log(result)
        const newCurMainMenu = result?.find(item => item.id === this.curMainMenu.id)
        console.log(newCurMainMenu)
        if (newCurMainMenu) {
          this.curMainMenu = newCurMainMenu
        } else {
          this.curMainMenu = result?.[0]
        }
      }
    },
    closeAsideMenuContent() {
      this.curMainMenu = null
    },
    handleAsideMenuClick(m) {
      if (m.subMenu.length) {
        this.curMainMenu = m
        return
      }
      this.handleItemClick(m)
    },
    handleOutClick(e) {
      if (!e.path.includes(this.$refs['content'])) {
        this.closeAsideMenuContent()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.menu-item {
  display: flex;
  position: relative;
  align-items: center;
  height: 45px;
  padding-left: 12px;
  padding-right: 12px;
  border-bottom: 1px solid rgba(107, 108, 109, 0.19);
  color: rgba(0, 0, 0, .65);

  &:hover, &.active {
    cursor: pointer;
    background: #ececec;
    color: #46BCA0;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #46BCA0;
    }
  }

  &.isCurrentOpened {
    color: #46BCA0;
  }

  &.isOpened {
    .menu-item__arrow-icon {
      color: #46BCA0;
    }
  }

  .menu-item__title {
    padding-left: 12px;
    flex: 1;
    white-space: nowrap;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .menu-item__arrow-icon {
    width: 32px;
    color: rgba(0, 0, 0, .4);
    transform: translateY(1px);
  }
}

.aside-menu-content-wrapper {
  position: fixed;
  overflow: hidden;
  right: 0;
  left: 210px;
  top: 50px;
  bottom: 0;
  z-index: 101;
}

.aside-menu-content {
  position: absolute;
  white-space: nowrap;
  transform: translate3d(-650px, 0, 0);
  top: 0;
  width: 650px;
  overflow-x: hidden;
  bottom: 0;
  background-color: #ececec;
  box-shadow: 4px 0 13px 0 rgba(0, 0, 0, .05);
  transition: all .3s ease;
  font-family: PingFangSC-Regular, PingFang SC, Microsoft YaHei, sans-serif;

  &.show {
    transform: translate3d(0, 0, 0);
  }


  .aside-menu-content__close-area {
    font-size: 12px;
    padding: 4px 8px;
    color: #46BCA0;

    &:hover {
      cursor: pointer;
      background: rgba(0, 0, 0, .05);
      border-radius: 6px;
    }
  }
}
</style>