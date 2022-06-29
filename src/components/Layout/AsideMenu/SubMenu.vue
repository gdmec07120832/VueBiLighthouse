<template>
  <a-sub-menu :key="menuInfo.id" v-bind="$props" v-on="$listeners">
    <span slot="title">
<!--      <a-icon v-if="deep === 0" type="appstore" style="font-size: 16px; color: #46BCA0" />-->
      <!--      <span v-if="deep === 0" style="margin-right: 5px"></span>-->
      <span style="padding-left: 36px" :title="menuInfo.cnName">{{ menuInfo.cnName }}</span>
    </span>
    <template v-for="item in menuInfo.subMenu">
      <sub-menu
          :deep="deep + 1"
          v-if="item.subMenu && item.subMenu.length"
          :key="item.id"
          :menu-info="item"
      />
      <a-menu-item v-else :key="item.id" :path="item.url" :title="item.cnName">
        <!--        <a-icon />-->
        <div style="position: relative; padding-left: 36px;" class="flex flex-start">
          <span style="flex: 1; overflow: hidden; text-overflow: ellipsis;" :style="{color: openedIds.indexOf(String(item.id)) > -1 ? '#46bca0' : ''}" :title="item.cnName">
            {{ item.cnName }}
          </span>
          <div style="width: 20px; flex-basis: 20px">
            <span class="favorite-icon" :class="{hasFavorite: item.collected}"
                  :style="{color: item.collected ? '#F9AB07' :''}"
                  @click.stop.prevent="toggleFavorite(item)">
                  <favorite-icon/>
           </span>
            <span class="isTEST" v-if="!item.releaseDate">TEST</span>
            <span class="isNEW" v-if="calcIsNew(item.releaseDate)">NEW</span>
          </div>
        </div>
      </a-menu-item>
    </template>
  </a-sub-menu>
</template>

<script>
import moment from 'moment'
import FavoriteIcon from '@/assets/svg/favorite.svg'
import { Menu } from 'ant-design-vue'

export default {
  name: 'SubMenu',
  isSubMenu: true,
  components: { FavoriteIcon },
  props: {
    ...Menu.SubMenu.props,
    deep: {
      type: Number,
      default: 0
    },
    menuInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    openedIds() {
      let tabs = this.$store.state.app.cachedTabMenu
      let ids = []
      for(let item of tabs) {
        if(item.path.startsWith('/x/')) {
          const menuPath = item.path.replace('/x/', '')
          const tailId = menuPath.split('_').pop()
          ids.push(tailId)
        }
      }
      return ids
    },
    menusMap () {
      return this.$store.state.app.globalMenuMap
    }
  },
  methods: {
    calcIsNew (date) {
      if (!date) {
        return false
      }
      let duration = moment().valueOf() - moment(date).valueOf()
      // 15天内发布的为NEW
      return duration < 86400 * 1000 * 15
    },
    toggleFavorite (item) {
      if (!item.collected) {
        this.$axios.get('/api/menuCollect/insert', {
          params: { menuId: item.id }
        }).then(() => {
          item.collected = true
          this.menusMap[item.id].collected = true
          this.$message.success('收藏成功')
        })
      } else {
        this.$axios.get('/api/menuCollect/delete', {
          params: {
            menuId: item.id
          }
        }).then(() => {
          item.collected = false
          this.menusMap[item.id].collected = false
          this.$message.success('已取消收藏')
        })
      }
    }
  }
}
</script>

<style lang="scss">
.ant-menu-item-active .favorite-icon {
  transform: scale(1) !important;
}

//.ant-menu-item-active .isNEW,
//.ant-menu-item-active .isTEST {
//  opacity: 0;
//}

.ant-menu-item-selected .favorite-icon {
  //transform: scale(1) !important;
}
</style>

<style lang="scss" scoped>
.favorite-icon {
  position: absolute;
  left: 0;
  top: 2px;
  display: inline-block;
  transform: scale(0.00001);
  transition: all .2s;
  vertical-align: middle;
  font-size: 18px;
  color: #ccc;
  z-index: 10;
  margin-left: 10px;

  &.hasFavorite {
    transform: scale(1);
  }
}

.isTEST, .isNEW {
  position: absolute;
  right: -6px;
  top: 0;
  z-index: 0;
  font-size: 12px;
  transform: scale(0.8);
}

.isTEST {
  color: #2680EB;
}

.isNEW {
  color: #F97807;
}
</style>
