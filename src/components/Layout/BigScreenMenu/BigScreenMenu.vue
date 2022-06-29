<template>
  <a-spin style="height: 100%; overflow: auto" class="hide-scrollbar" :spinning="fetching">
    <div style="height: 100%; overflow: auto" class="hide-scrollbar">
      <screen-menu class="screen-menu" @click="onMenuClick" :menu="menus" v-if="menus.length && !fetching"/>
      <div style="margin-top: 50px" v-if="!fetching && !menus.length">
        <a-empty/>
      </div>
    </div>
  </a-spin>
</template>

<script>
import ScreenMenu from '@/components/Layout/BigScreenMenu/components/ScreenMenu';
import {flattenTree} from '@/utils/helper';

export default {
  name: "BigScreenMenu",
  components: {ScreenMenu},
  data() {
    return {
      menus: [],
      menuList: [],
      menuMap: {},
      fetching: false,
      currentUrl: ''
    }
  },
  created() {
    this.getScreenMenus()
  },
  methods: {
    onMenuClick({key}) {
      this.$router.push({
        name: 's',
        params: {
          screenId: key
        }
      })
    },
    getScreenMenus() {
      this.fetching = true
      this.$axios.get('/api/menuForScreen/getRankOneMenusByLoginUser').then(({data}) => {
        const subMenuMaps = {}
        this.menus = data.map(item => {
          const id = item.id
          subMenuMaps[id] = item.subMenu.map(_ => {
            return {
              parentName: item.cnName,
              ..._
            }
          })
          return {
            ...item,
            subMenu: []
          }
        })
        this.menuMap = subMenuMaps
        this.menuList = flattenTree(data, 'subMenu')

        this.$store.commit('app/SET_BIG_SCREEN_MENU_MAP', subMenuMaps)
      }).finally(() => {
        this.fetching = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.screen-menu {
  /deep/ .ant-menu-item:hover {
    background-color: #edfcf6;
  }
}
</style>
