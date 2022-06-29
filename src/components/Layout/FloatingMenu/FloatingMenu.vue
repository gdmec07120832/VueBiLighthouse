<template>
  <transition name="slide">
    <div class="floating-menu" v-if="floatingMenuShow" @mouseleave="leaveFloatingMenu">
      <div class="floating-menu--wrapper hide-scrollbar flex" style="align-items: flex-start">
        <div class="menu-left">
          <div v-for="item in menus" :class="{active: item.id === activeMenu.id}" :key="item.id"
               @mouseenter="generateChildMenu(item)">
            {{ item.cnName }}
          </div>
        </div>
        <div class="menu-right hide-scrollbar">
          <div class="leaf-node-wrapper">
            <span class="leaf-node-0" v-for="node in leafNode" :key="node.id" @click="openBIView(node)">
              {{ node.cnName }}
            </span>
          </div>
          <div>
            <div v-for="(sub) in subs" :key="sub.name">
              <div style="font-size: 16px; font-weight: bold; padding-left: 15px; margin-top: 15px">{{sub.name}}</div>
              <div class="leaf-node-wrapper">
                <span class="leaf-node-0" v-for="node in sub.children" :key="node.id" @click="openBIView(node)">
                  {{ node.cnName }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "FloatingMenu",
  data() {
    return {
      leafNode: [],
      subs: [],
      activeMenu: {}
    }
  },
  computed: {
    ...mapState('app', ['cachedTabMenu']),
    floatingMenuShow() {
      return this.$store.state.app.floatingMenuShow
      // return true
    },
    menus() {
      return this.$store.state.app.currentAsideMenu
    }
  },
  methods: {
    leaveFloatingMenu() {
      this.$store.commit('app/SET_FLOAT_MENU_SHOW', false)
    },
    generateChildMenu(menu) {
      this.activeMenu = menu
      const leafNode = []
      const notLeaf = []
      for (let node of menu.subMenu) {
        if (node.subMenu.length === 0) {
          leafNode.push({
            ...node,
            keyPath: [menu.parentId, menu.id, node.id]
          })
        } else {
          notLeaf.push({
            ...node
          })
        }
      }
      console.log(notLeaf)
      this.leafNode = leafNode
      const noLeafResultMap = {}
      const walk = (tree, parentPath, parent) => {
        for(let item of tree) {
          const _item = Object.assign(item, {
            keyPath: parent.keyPath.concat(item.id)
          })
          if(!item.subMenu.length) {
            if(!noLeafResultMap[parentPath]) {
              noLeafResultMap[parentPath] = [_item]
            } else {
              noLeafResultMap[parentPath].push(_item)
            }
          } else {
            walk(item.subMenu, parentPath + '->' + item.cnName, _item)
          }
        }
      }
      walk(notLeaf, '', {
        keyPath: [menu.parentId]
      })
      console.log(noLeafResultMap)
      this.subs = Object.keys(noLeafResultMap).map(key => {
        return {
          name: key.slice(2),
          children: noLeafResultMap[key]
        }
      })
    },
    openBIView(node) {
      console.log(node)
      const menuPath = node.keyPath.join('_')
      const path = this.$router.resolve({name: 'x', params: {menuPath}}).href
      const found = this.cachedTabMenu.find(_ => {
        return String(node.id) === _.path.split('_').slice(-1)[0]
      })
      if(this.cachedTabMenu.length >= 7 && !found) {
        this.$notification.open({
          message: '提示',
          placement: 'bottomRight',
          description: '您打开的报表数量达到上限，请关闭部分已打开的报表后再试！',
          icon: <a-icon type="sound" style="color: #f9ab07"/>
        })
        return
      }
      if(found) {
        this.$store.commit('app/SET_CURRENT_TAB', found.path)
        this.$router.push(found.path)
      } else {
        this.$router.push({
          name: 'x',
          params: {menuPath}
        })
        this.$store.commit('app/ADD_CACHED_TAB_MENU', {
          path: path,
          name: node.cnName
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.floating-menu {
  position: fixed;
  top: 50px;
  bottom: 0;
  width: 500px;
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  //background-color: rgba(255, 255, 255, 0.6);
  background: #fefefe;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  z-index: 999;
}

.slide-enter-active, .slide-leave-active {
  transition: all .3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translateX(-250px);
  opacity: 0;
}

.floating-menu--wrapper {
  padding: 20px;
  overflow-y: auto;
  height: 100%
}

.menu-left {
  width: 130px;
  flex: 0 0 130px;

  > div {
    padding-left: 15px;
    border-radius: 2px;
    font-size: 16px;
    line-height: 40px;
    cursor: pointer;

    &:hover,
    &.active{
      background: #eee;
    }
  }
}

.menu-right {
  height: 100%;
  overflow-y: auto;
}

.leaf-node-wrapper {
  .leaf-node-0 {
    display: inline-block;
    line-height: 32px;
    padding: 0 15px;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
