<template>
  <ModalWrapper :close-btn="true" @close="$emit('close')">
    <template>
      <div class="top-bg">
        <div class="flex" style="flex-flow: column; align-items: flex-start;
        justify-content: center;
        margin-left: 145px; max-width: 550px; height: 260px;">
          <div style="font-size: 40px; color: #000; margin-bottom: 20px">{{ pushConfig.coverTitle }}</div>
          <div style="color: rgba(0, 0, 0, .64); line-height: 26px; font-size: 16px; margin-bottom: 20px">
            {{ pushConfig.descText }}
          </div>
          <div style="font-size: 14px; color: rgba(0, 0, 0, .45)">{{ pushConfig.versionName }}</div>
        </div>
      </div>
      <div class="flex" style="height: calc(100vh - 320px);
      align-items: flex-start; padding-top: 40px; padding-bottom: 20px">
        <div ref="navWrapper"
             class="nav-wrapper"
             style="flex: 0 0 220px;margin-left: 80px;position: relative; overflow-y: auto; height: 100%">
          <div class="vertical-navs-wrapper">
            <div class="indicator-slider" :style="{top: sliderPosition}"></div>
            <div class="vertical-navs">
              <div class="nav-item" v-for="(item, index) in navItems"
                   :key="index" @click="handleNavChange(index)">
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div style="flex: 1; padding: 0 60px; height: 100%; overflow: auto; position: relative"
             ref="contentWrapper">
          <div class="content-item"
               v-for="(item, index) in contentPages" :key="index" style="margin-bottom: 40px;">
            <div style="font-size: 30px; margin-bottom: 16px">{{ item.reportName }}</div>
            <div style="font-size: 18px; color: #474747; margin-bottom: 20px">
              {{ item.dataValue }}
            </div>
            <div style="line-height: 24px; margin-bottom: 20px; white-space: pre-wrap">{{ item.descText }}
            </div>
            <div style="text-align: center">
              <img width="80%" :src="item.imgUrl" alt="">
            </div>
          </div>
        </div>
      </div>
    </template>

  </ModalWrapper>
</template>

<script>
import ModalWrapper from '@/views/Admin/release-version-mgmt/components/modalWrapper'
import debounce from 'lodash/debounce'

export default {
  name: 'ReleaseModalV2',
  components: {ModalWrapper},
  props: {
    pushConfig: {
      type: Object,
      default: () => ({})
    },
    contentPages: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    sliderPosition() {
      return ((this.curIndex) * 40) + 'px'
    },
    navItems() {
      return this.contentPages.map(_ => _['reportName'])
    }
  },
  watch: {
    curIndex(val) {
      const top = (this.curIndex) * 40
      const wrapperHeight = this.$refs.navWrapper.clientHeight
      const offset = top + 40 - wrapperHeight
      this.$refs.navWrapper.scrollTo({top: offset, behavior: 'smooth'})
    }
  },
  data() {
    return {
      offsets: [],
      curIndex: 0
    }
  },
  mounted() {
    const wrap = this.$refs.contentWrapper
    const handler = debounce((e) => {
      const scrollTop = e.target.scrollTop
      const offsets = this.offsets
      for (let i in offsets) {
        i = Number(i)
        if ((scrollTop > offsets[i] - 50) && (scrollTop < offsets[i + 1] - 50)) {
          this.curIndex = i
          break
        }
      }
    }, 20)
    wrap.addEventListener('scroll', handler)

    wrap.addEventListener('load', this.calcContentOffset, true)

    this.calcContentOffset()
    this.$on('hook:beforeDestroy', () => {
      wrap.removeEventListener('scroll', handler)
      wrap.removeEventListener('load', this.calcContentOffset)
    })

  },
  methods: {
    calcContentOffset() {
      const wrap = this.$refs.contentWrapper
      const els = wrap.querySelectorAll('.content-item')
      const offsets = ([]).map.call(els, (el) => {
        return el.offsetTop
      })
      offsets.push(Infinity)
      this.offsets = offsets
    },
    handleNavChange(index) {
      this.curIndex = index
      this.$refs.contentWrapper.scrollTo({
        top: this.offsets[index],
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-bg {
  height: 260px;
  background: url("~@/assets/images/release-notice/index-bg-v2.png") no-repeat center center/100% 100%;
}

.nav-wrapper {
  &::-webkit-scrollbar {
    width: 0;
  }
}

.vertical-navs-wrapper {
  //flex: 0 0 220px;
  //margin-left: 80px;
  position: relative;

  .indicator-slider {
    position: absolute;
    height: 30px;
    width: 2px;
    left: 0;
    top: 0;
    transition: top .2s;
    background: #46BCA0;
  }
}

.vertical-navs {
  padding-left: 20px;
  border-left: 2px solid rgba(0, 0, 0, .1);

  .nav-item {
    cursor: pointer;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, .6);

    &:hover {
      color: #46BCA0;
    }
  }
}
</style>
