<template>
  <div class="px20 py20 wrapper flex flex-between" style="align-items: flex-start" :key="$route.params.screenId">
    <div class="left-menu" style="width: 40%">
      <div v-for="item in currentMenus" :key="item.id">
        <p style="font-size: 16px">{{ item.cnName }}</p>
        <div class="flex-between flex" style="flex-wrap: wrap">
          <div class="menu-item"
               :class="{active : selected && selected.id === leafMenu.id}"
               v-for="leafMenu in item.subMenu"
               :key="leafMenu.id" @click="selectItem(leafMenu)">
            {{ leafMenu.cnName }}
          </div>
        </div>
      </div>
    </div>
    <div class="right-preview-img" style="width: 55%">
      <p style="margin-top: 25px; font-size: 16px">大屏预览</p>
      <div>
        <template v-if="selected && selected.picUrl">
          <div style="width: 100%; padding-bottom: 56.25%"
               :style="{background: `url(${resolvePicUrl(selected.picUrl)}) no-repeat center/cover`}">
          </div>
          <!--          <img :src="resolvePicUrl(selected.picUrl)"-->
          <!--               style="width: 100%; height: auto; object-fit: cover; max-height: 400px" alt="">-->
        </template>
        <template v-else>
          <div style="text-align: center; min-height: 350px; background: #f5f7ff">
            <template v-if="selected">
              <p style="font-size: 30px; padding-top: 100px">{{ selected && selected.cnName }}</p>
              <p>暂无预览图</p>
            </template>
            <template v-else>
              <p style="font-size: 30px; padding-top: 100px">请从左侧选择一个大屏</p>
            </template>
          </div>
        </template>
      </div>
      <div class="flex flex-center mt20" v-if="selected">
        <div class="enter-btn" @click="enterBigScreen(selected)">
          <a-icon type="arrows-alt"/>
          进入大屏
        </div>
      </div>
    </div>
    <iframe :src="currentUrl" style="border: 0; position: absolute" width="0" height="0" allowfullscreen
            webkitallowfullscreen
            mozallowfullscreen id="fullscreen"></iframe>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import instance from '@/utils/axios'

export default {
  name: 'ScreenLandingPage',
  data () {
    return {
      selected: null,
      screenId: null,
      currentMenus: [],
      currentUrl: ''
    }
  },
  computed: {
    menuMaps () {
      return this.$store.state.app.bigScreenMenuMaps
    }
  },
  watch: {
    '$route.params.screenId': {
      handler () {
        this.screenId = this.$route.params.screenId
        this.calcCurrentMenus()
      },
    },
    menuMaps: {
      handler () {
        this.calcCurrentMenus()
        this.selected = this.currentMenus[0]?.subMenu?.[0]
      },
      immediate: true
    }
  },
  created () {
    this.$store.commit('app/SET_MENU_HIDDEN', false)
    this.screenId = this.$route.params.screenId
    this.calcCurrentMenus()
  },
  mounted () {
    const handler = () => {
      if (document.fullscreenElement) {
        console.log('enter')
      } else {
        if (this.currentUrl) {
          this.currentUrl = null
        }
      }
    }
    screenfull.on('change', handler)
    this.$once('hook:beforeDestroy', () => {
      screenfull.off('change', handler)
    })
  },
  methods: {
    resolvePicUrl (url) {
      if((url || '').startsWith('http')) {
        return url
      }
      return location.origin + instance.defaults.baseURL + '/download' + url
    },
    enterBigScreen ({ id, cnName }) {
      this.onMenuClick({ id, cnName })
    },
    onMenuClick ({ id, cnName }) {
      this.$store.commit('app/SET_FULL_LOADING', true)
      const urlMaps = {
        '平台客服排行榜': '/frame/real-time-performance',
        '全渠道大屏': '/frame/omni-channel',
        '天猫客服排行榜': '/frame/real-time-TMperformance',
        '京东客服排行榜': '/frame/real-time-JDperformance',
        '新品监控大屏': '/frame/news-monitoring',
        '抖音快手直播业绩大屏': '/frame/live-tiktokkwailive',
        '理货作业大屏': '/frame/SD-SD_Tally',
        '分拨作业大屏': '/frame/SD-SD_BigBang',
        '项目组排名': '/frame/project-group-ranking',
        '新零售招商大屏': '/frame/progress-of-new-retail-investment',
        '天猫B店大屏': '/frame/frame-tmall-screen'
      }

      if(Object.keys(urlMaps).includes(cnName)) {

        this.currentUrl = urlMaps[cnName]
        screenfull.request(document.querySelector('#fullscreen'))
        this.$store.commit('app/SET_FULL_LOADING', false)

      } else {
        this.$axios.get('/api/menuForScreen/getSignatureUrl', {
          params: { id }
        }).then(({ data }) => {
          this.$axios.get('/api/admin/common/log/save', {
            params: {
              logLevel: 'Info',
              logSource: 'ReportView',
              logType: 'Web',
              description: '访问',
              // extAssociationKey: this.indexPage.id,
              extAssociationKey: id,  //最新的
              methodName: 'BS',
              qualifiedName: this.currentMenus[0]?.parentName + '-' + cnName
            },
            silent: true
          })
          this.currentUrl = data
          screenfull.request(document.querySelector('#fullscreen'))

        }).finally(() => {
          this.$store.commit('app/SET_FULL_LOADING', false)
        })
      }

    },
    selectItem (item) {
      this.selected = item
      console.log(this.selected)
    },
    calcCurrentMenus () {
      this.currentMenus = this.menuMaps[this.$route.params.screenId] || []
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;

  > div {
    min-height: 600px;
  }

  .left-menu {
    padding: 20px;
    position: relative;

    &:after {
      position: absolute;
      content: "";
      width: 1px;
      background: #ddd;
      height: 80%;
      right: -4.5%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .menu-item {
    width: 48%;
    margin-bottom: 20px;
    text-align: center;
    line-height: 40px;
    height: 40px;
    border: 1px solid #46BCA0;

    &:hover, &.active {
      cursor: pointer;
      background: #48bca0;
      color: #fff;
    }
  }

  .enter-btn {
    width: 200px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 1px solid #46BCA0;

    &:hover {
      cursor: pointer;
      background: #48bca0;
      color: #fff;
    }
  }

}
</style>
