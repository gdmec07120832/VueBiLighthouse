<template>
  <a-drawer  width="60%"
             :destroy-on-close="true"
             :closable="false"
             :visible="visible$"
             :bodyStyle="{
               padding: 0
             }"
             @close="onClose">
    <div slot="title" style="font-size: 16px; font-weight: bold; padding-top: 8px; padding-bottom: 8px" class="text-black">
      报表指标说明
    </div>

    <div class="metricExplainContentWrapper">
        <div class="sectionHead">
          <div class="sectionHead__text">基本信息</div>
        </div>

        <div class="basicInfo">
          <div class="basicInfo__row">
            <div class="basicInfo__row__item">
              <div class="basicInfo__row__item__key">报表名称：</div>
              <div class="basicInfo__row__item__value">{{ curReport && curReport.cnName }}</div>
            </div>
          </div>

          <div class="basicInfo__row">
            <div class="basicInfo__row__item">
              <div class="basicInfo__row__item__key">业务负责人：</div>
              <div class="basicInfo__row__item__value">{{(curReport && curReport.businessManagerName) || '--'}}</div>
            </div>
            <div class="basicInfo__row__item">
              <div class="basicInfo__row__item__key">产品负责人：</div>
              <div class="basicInfo__row__item__value">{{(curReport && curReport.productOwnerName) || '--'}}</div>
            </div>
          </div>
        </div>
        <div class="sectionHead">
          <div class="sectionHead__text">指标信息</div>
          <div class="sectionHead__extra">
            <a-input-search v-model="searchKeyword" placeholder="输入指标关键字查询" allowClear />
          </div>
        </div>

        <div>
          <metrics-list :report="curReport" :keyword="searchKeyword" />
        </div>
    </div>
  </a-drawer>
</template>

<script>
import { mapState } from 'vuex'
import MetricsList from '@/components/Layout/Sidebar/components/MetricExplainDrawer/MetricsList'

export default {
  name: 'MetricZExplainDrawer',
  components: { MetricsList },
  props: {
    visible: Boolean
  },
  data() {
    return {
      searchKeyword: '',
      visible$: this.visible,
    }
  },
  computed: {
    ...mapState('app', ['globalMenuMap']),
    curReport() {
      const menuPath = this.$route.params.menuPath || ''
      const trailId = menuPath.split('_').pop()
      if (trailId) {
       return this.globalMenuMap[Number(trailId)]
      } else {
        return  null
      }
    },
  },
  watch: {
    visible(v) {
      this.visible$ = v
    },
    curReport: {
      handler(val) {
        const {versionMainNum} = val || {}
        if(!versionMainNum) {
          // 没有报表编码， 则隐藏指标说明
          this.$emit('toggleMetricExplainTrigger', false)
        } else {
          this.$emit('toggleMetricExplainTrigger', true)
        }
      },
      immediate: true
    }
  },
  methods: {
    onClose() {
      this.visible$ = false
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.metricExplainContentWrapper {
  .sectionHead {
    padding: 12px 24px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    .sectionHead__text {
      padding: 0 16px;
      font-size: 14px;
      font-weight: bold;
      line-height: 32px;
      position: relative;
      &:before {
        content: "";
        width: 4px;
        height: 16px;
        background: #46BCA0;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        position: absolute;
      }
    }
    .sectionHead__extra {
      margin-left: auto;
    }
  }


  .basicInfo {
    font-size: 12px;
    padding: 18px 24px;
    .basicInfo__row {
      display: flex;
      padding: 12px 0;
      .basicInfo__row__item {
        margin-right: 10%;
        display: flex;
        .basicInfo__row__item__key {
          width: 120px;
          flex-basis: 120px;
        }
        .basicInfo__row__item__value {
          color: rgba(173, 173, 173, 1);
        }
      }

    }
  }
}
</style>