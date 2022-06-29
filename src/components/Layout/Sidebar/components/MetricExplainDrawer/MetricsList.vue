<template>
  <div class="metricView" :style="{paddingTop: cateList.length ? '' : '12px'}">
    <div v-if="cateList.length" class="cateWrapper">
      <div class="prev-btn" @click="slidePrev" v-if="maxScrollLeft > 0 && slideDistance > 0">
        <a-icon type="double-left" />
      </div>
      <div class="next-btn" @click="slideNext" v-if="maxScrollLeft > 0 && slideDistance < maxScrollLeft">
        <a-icon type="double-right" />
      </div>
      <div class="cateWrapper__content" ref="cateWrapperContent">
      <div class="cateItem">
        <span @click="handleCateClick('-1')" class="hoverText" :class="{active: curCate === '-1'}">全部</span>
      </div>
      <div class="cateItem" v-for="item in cateList" :key="item.id">
        <span @click="handleCateClick(item.id)" class="hoverText" :class="{active: curCate === item.id}">{{ item.typeName }}</span>
      </div>
    </div>
    </div>

    <a-spin :spinning="loading">
      <a-icon slot="indicator" type="loading" style="font-size: 24px" spin/>
      <div class="metricViewTable">
        <div class="metricViewTable__head">
          <div style="flex: 0 0 140px" class="metricViewTable__head__col">指标名称</div>
          <div style="flex: 0 0 140px" class="metricViewTable__head__col">页面指标</div>
          <div class="metricViewTable__head__col">计算公式</div>
          <div class="metricViewTable__head__col">描述</div>
        </div>
        <div class="metricViewTable__body">
          <div class="metricViewTable__row" v-for="item in filteredMetricList" :key="item.id">
            <div style="flex: 0 0 140px; color: #608dff" class="metricViewTable__row__col">{{ item.kpiName }}</div>
            <div style="flex: 0 0 140px" class="metricViewTable__row__col">{{ item.pageKpi || '--' }}</div>
            <div class="metricViewTable__row__col">{{ item.calcFormula || '--' }}</div>
            <div class="metricViewTable__row__col">{{ item.description || '--' }}</div>
          </div>
          <div v-if="!curMetricList.length">
            <a-empty :image="simpleImg" description="暂无数据"/>
          </div>
          <div v-if="curMetricList.length && !filteredMetricList.length">
            <a-empty :image="simpleImg" description="没有符合要求的数据，请更换关键字"/>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue'
import debounce from 'lodash/debounce'

export default {
  name: 'MetricsList',
  props: {
    report: {
      type: Object,
      default: null
    },
    keyword: String
  },
  data() {
    return {
      simpleImg: Empty.PRESENTED_IMAGE_SIMPLE,
      cateList: [],
      curMetricList: [],
      filteredMetricList: [],
      curCate: '-1',
      loading: false,
      slideDistance: 0,
      maxScrollLeft: 0
    }
  },
  watch: {
    report: {
      handler() {
        if (this.report && this.report.versionMainNum) {
          this.init()
        }
      },
      immediate: true
    },
    keyword: {
      handler: debounce(function() {
        this.filteredMetricList = this.curMetricList.filter(item => {
          return !this.keyword ? true : (item.kpiName || '').toLowerCase().includes(this.keyword) ||
            (item.pageKpi || '').toLowerCase().includes(this.keyword)
        })
      }, 100),
      immediate: true
    },
    curMetricList: {
      handler: debounce(function() {
        this.filteredMetricList = this.curMetricList.filter(item => {
          return !this.keyword ? true : (item.kpiName || '').toLowerCase().includes(this.keyword) ||
            (item.pageKpi || '').toLowerCase().includes(this.keyword)
        })
      }, 100),
      immediate: true
    }
  },
  mounted() {
    const resizeHandler = debounce(() => {
      this.calcMaxWidth()
    }, 100)
    window.addEventListener('resize', resizeHandler)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', resizeHandler)
    })
  },
  methods: {
    init() {
      this.getCategories()
      this.getCurCateMetric()
    },
    getCategories() {
      this.$axios.get('/api/user/biWKpiType/findByReportCode', {
        params: {
          code: this.report.versionMainNum
        }
      }).then(({ data }) => {
        this.cateList = data
        setTimeout(() => {
          this.calcMaxWidth()
        }, 100)
      })
    },
    getCurCateMetric() {
      this.loading = true
      const curCateId = this.curCate
      this.$axios.get('/api/user/biWKpiType/findByMainCodeOrTypeId', {
        params: {
          page: 1,
          pageSize: 999,
          code: this.report.versionMainNum,
          typeId: curCateId === '-1' ? '' : curCateId
        }
      }).then(({ data: { list } }) => {
        this.curMetricList = list
      }).finally(() => {
        this.loading = false
      })
    },
    handleCateClick(id) {
      this.curCate = id
      this.getCurCateMetric()
    },
    calcMaxWidth() {
      const dom = this.$refs.cateWrapperContent
      if(!dom) {
        return
      }
      const scrollWidth = dom.scrollWidth
      const clientWidth = dom.clientWidth
      this.maxScrollLeft = scrollWidth - clientWidth
    },
    slideNext() {
      this.slideDistance = Math.min(this.slideDistance + 80, this.maxScrollLeft)
      this.$refs.cateWrapperContent.scroll({
        left: this.slideDistance,
        behavior: 'smooth'
      })
    },
    slidePrev() {
      this.slideDistance = Math.max(this.slideDistance - 80, 0)
      this.$refs.cateWrapperContent.scroll({
        left: this.slideDistance,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.metricView {
  padding: 0 24px;
}

.cateWrapper {
  position: relative;
  margin: 0 -24px;
  padding: 0 24px;
  .prev-btn, .next-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    padding: 2px;
    color: #adadad;
    &:hover {
      background: rgba(0,0,0,.07);
      border-radius: 4px;
    }
  }
  .prev-btn {
    left: 6px;
    box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.15);
  }
  .next-btn {
    right: 6px;
    box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.15);
  }
}

.cateWrapper__content {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;

  .cateItem {
    padding: 20px 0;
    display: inline-block;
    color: #adadad;
    white-space: nowrap;
    &:not(:last-child) {
      margin-right: 12px;
    }
    .hoverText {
      padding: 4px 8px;
      border-radius: 4px;

      &:hover {
        cursor: pointer;
        background: rgba(0, 0, 0, .07);
      }

      &.active {
        color: #46BCA0;
      }
    }
  }
}

.metricViewTable__head {
  display: flex;
  border-radius: 4px;
  border: 1px solid #f2f2f2;
  overflow: hidden;

  .metricViewTable__head__col {
    font-size: 12px;
    font-weight: bold;
    padding: 8px;
    line-height: 32px;
    background: #fafafa;
    flex: 1;
  }
}

.metricViewTable__body {
  height: calc(100vh - 430px);
  overflow-y: auto;
}

.metricViewTable__row {
  display: flex;
  border-bottom: 1px solid #f2f2f2;
  &:hover {
    background: #f5f7fa;
  }

  .metricViewTable__row__col {
    font-size: 12px;
    padding: 8px;
    line-height: 24px;
    flex: 1;
    display: flex;
    align-items: center;
  }
}
</style>