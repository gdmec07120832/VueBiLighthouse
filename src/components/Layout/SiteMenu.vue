<template>
  <transition name="slide-in">
    <div v-if="show" class="siteMenuWrapper">
      <div class="siteMenuHead">
        <span class="siteMenuHeadText">数据中台</span>
        <span class="siteMenuHeadCloseIcon" @click="closeMenu">
          <a-icon type="close" />
        </span>
      </div>
      <div class="siteMenuContent">
        <div class="siteMenuContentItem" v-for="site in sitesNavs" :key="site.siteName">
          <div class="siteMenuContentItemTitle">{{site.siteName}}</div>
          <div class="siteMenuContentItemList">
            <div class="siteMenuContentItemListItem" v-for="n in site.navs" :key="n.id" @click="clickNav(n)">{{n.navBarName}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
const order = ['PC', 'DMS']
const SiteCnNames  = {
  PC: '数据灯塔(BI）',
  DMS: '数据资产(DMS）'
}
export default {
  name: 'SiteMenu',
  props: {
    show: {
      default: false,
      type: Boolean
    },
    quickNavMap: {
      default: () => ({}),
      type: Object,
    }
  },
  computed: {
    sitesNavs() {
     return order.map(key => {
        return {
          siteName: SiteCnNames[key],
          navs: this.quickNavMap[key]
        }
      })
    }
  },
  methods: {
    closeMenu () {
      this.$emit('update:show', false)
    },
    clickNav (n) {
      if(/^http:\/\//.test(n.url)) {
        window.open(n.url)
      } else {
        window.open(location.origin + n.url)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .siteMenuWrapper {
    position: fixed;
    z-index: 999;
    left: 0;
    top: 50px;
    width: 400px;
    bottom: 0;
    background-color: #fff;
    box-shadow: 4px 0 13px 0 rgba(0, 0, 0, 0.05);
    border-radius: 0 30px 0 0;
    transition: all .3s ease;
    font-family: PingFangSC-Regular, PingFang SC,"Microsoft YaHei", sans-serif;
  }

  .siteMenuHead {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 24px;
    border-bottom: 1px solid #F0F0F0;
    .siteMenuHeadText {
      height: 24px;
      font-size: 16px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
    .siteMenuHeadCloseIcon {
      font-size: 18px;
      line-height: 18px;
      cursor: pointer;
      padding: 8px;
      color: #909399;
      border-radius: 6px;
      &:hover {
        background-color: #eee;
      }
      &:active {
        background-color: #ddd;
      }
    }
  }

  .siteMenuContent {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr;
    padding: 24px;
    .siteMenuContentItem {
      .siteMenuContentItemTitle {
        height: 24px;
        line-height: 24px;
        font-weight: 400;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        margin: 8px auto;
        padding-left: 20px;
      }
      .siteMenuContentItemList {
        color: #7C7C7C;
        .siteMenuContentItemListItem {
          line-height: 24px;
          font-size: 13px;
          padding: 4px 20px;
          &:hover {
            cursor: pointer;
            background-color: #eee;
            border-radius: 4px;
          }
          &:active {
            background-color: #ddd;
          }
        }
      }
    }
  }

  .slide-in-enter {
    opacity: 0;
    transform: translateX(-400px);
  }
  .slide-in-enter-to {
    opacity: 1;
    transform: translateX(0);
  }

  .slide-in-leave {
    opacity: 1;
    transform: translateX(0);
  }

  .slide-in-leave-to {
    opacity: 0;
    transform: translateX(-400px);
  }
</style>