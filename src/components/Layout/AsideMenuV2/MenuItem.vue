<template>
  <div class="menu-item__wrapper">
    <span class="menu-item__page-title" :class="{active: openedKeys.includes(String(menu.id))}">
        <favorite-svg class="favoriteIcon" @click.stop="toggleFavorite(menu)" :class="{hasFavorite: menu.collected}" v-if="!menu.subMenu.length"/>
        <folder-fill-svg v-if="menu.subMenu.length" class="menu-item__page-title__icon"/>
        <chart-svg v-else class="menu-item__page-title__icon"/>
        <div class="menu-item__page-title__text" :style="{maxWidth: !menu.releaseDate || calcIsNew(menu.releaseDate) ? 'calc(100% - 45px)' : 'calc(100% - 15px)'}">
            <span class="menu-item__page-title__text__title">
              <OverflowTooltip>
              {{ menu.cnName }}
              </OverflowTooltip>
            </span>
          <span class="isTEST" v-if="!menu.releaseDate">TEST</span>
          <span class="isNEW" v-if="calcIsNew(menu.releaseDate)">NEW</span>
        </div>
    </span>
  </div>
</template>

<script>
import ChartSvg from '@/assets/svg/chart.svg'
import FolderFillSvg from '@/assets/svg/folder-fill.svg'
import FavoriteSvg from '@/assets/svg/favorite.svg'
import moment from 'moment'
import OverflowTooltip from '@/views/BIView/components/OverflowTooltip/OverflowTooltip'
import { mapState } from 'vuex'

export default {
  name: 'MenuItem',
  components: { OverflowTooltip, ChartSvg, FolderFillSvg, FavoriteSvg },
  computed: {
    ...mapState('app', ['cachedTabMenu']),
    menusMap () {
      return this.$store.state.app.globalMenuMap
    },
    openedKeys() {
      return this.cachedTabMenu.map(item => {
        const ret = item.path.match(/x\/(?:\d+_)*(\d+)$/)
        return ret[1]
      })
    }
  },
  props: {
    menu: {
      type: Object
    }
  },
  methods: {
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
    },
    calcIsNew(date) {
      if (!date) {
        return false
      }
      let duration = moment().valueOf() - moment(date).valueOf()
      // 15天内发布的为NEW
      return duration < 86400 * 1000 * 15
    }
  }
}
</script>

<style scoped lang="scss">
.menu-item__wrapper {
  position: relative;
  padding: 8px 8px 8px 24px;
  &:hover {
    .favoriteIcon {
      transform: translateY(-50%) scale(1);
    }
  }
  .favoriteIcon {
    position: absolute;
    left: 3px;
    top: 50%;
    font-size: 18px;
    transform: translateY(-50%) scale(0);
    transition: all .2s;
    color: #ccc;
    &.hasFavorite {
      color: #f9ab07;
      transform: translateY(-50%) scale(1);
    }
  }
}

.menu-item__page-title {
  display: flex;
  white-space: nowrap;
  &.active {
    .menu-item__page-title__icon, .menu-item__page-title__text__title {
      color: #46bca0!important;
    }
  }

  .menu-item__page-title__icon {
    flex: none;
    width: 14px;
    height: 14px;
    margin-right: 6px;
    color: rgba(0, 0, 0, .65)
  }

  .menu-item__page-title__text {
    position: relative;
    flex: 1;
    line-height: 14px;
    height: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;

    .menu-item__page-title__text__title {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      color: #828282;
      text-overflow: ellipsis;
    }

    .isTEST, .isNEW {
      position: absolute;
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
  }
}
</style>