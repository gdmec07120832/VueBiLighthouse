<template>
  <div class="section">
    <div>
      <div class="sectionTitle">
        <span>爆款矩阵</span>
        <div class="date">{{date.format('YYYY年M月')}}</div>
      </div>
      <div class="sectionContent sectionContent1">
        <div class="sectionSubTitle subTitle1">
          搜索访客
        </div>

        <div class="circleChartsWrapper">
          <div class="cornerDec cornerA"></div>
          <div class="cornerDec cornerB"></div>
          <div class="cornerDec cornerC"></div>
          <div class="cornerDec cornerD"></div>
          <div class="splitLine"></div>
          <div class="circleChartsInner">
            <div class="circleChartsInnerLeft">
              <div class="circleChartsTitle">日累计达成</div>
              <div class="circleChartsInnerContent">
                <div class="circleChartsInnerContent__left">
                  <echarts-gauge :value="numeral(data1.SEACHT_HOT_FIN_RATE_D * 100).format('0')" style="height: 100%" />
                </div>
                <div class="circleChartsInnerContent__right">
                  <div>
                    <span class="contentText">目标</span>
                    <span class="contentValue">{{numFormat(data1.TARGET_SEACHT_HOT_CUM_D)}}</span>
                  </div>
                  <div>
                    <span class="contentText">爆款</span>
                    <span class="contentValue">{{numFormat(data1.VISITORS_SEACH)}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="circleChartsInnerRight">
              <div class="circleChartsTitle">月累计达成</div>
              <div class="circleChartsInnerContent">
                <div class="circleChartsInnerContent__left">
                  <echarts-gauge :value="numeral(data1.SEACHT_HOT_FIN_RATE_M * 100).format('0')" style="height: 100%" />
                </div>
                <div class="circleChartsInnerContent__right">
                  <div>
                    <span class="contentText">目标</span>
                    <span class="contentValue">{{numFormat(data1.TARGET_SEACHT_HOT_CUM_M)}}</span>
                  </div>
                  <div>
                    <span class="contentText">差值</span>
                    <span class="contentValue">{{numFormat(data1.SEACHT_HOT_DIFF_M)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <echarts-line ref="lineChart1" class="echartsLine" />
      </div>
    </div>
    <div>
      <div class="sectionSubTitle subTitle2">
        支付金额
      </div>
      <div class="sectionContent sectionContent2">
        <div class="circleChartsWrapper">
          <div class="cornerDec cornerA"></div>
          <div class="cornerDec cornerB"></div>
          <div class="cornerDec cornerC"></div>
          <div class="cornerDec cornerD"></div>
          <div class="splitLine"></div>
          <div class="circleChartsInner">
            <div class="circleChartsInnerLeft">
              <div class="circleChartsTitle">日累计达成</div>
              <div class="circleChartsInnerContent">
                <div class="circleChartsInnerContent__left">
                  <echarts-gauge :value="numeral(data1.AMOUNT_HOT_FIN_RATE_D * 100).format('0')" style="height: 100%" />
                </div>
                <div class="circleChartsInnerContent__right">
                  <div>
                    <span class="contentText">目标</span>
                    <span class="contentValue">{{numFormat(data1.TARGET_AMOUNT_HOT_CUM_D)}}</span>
                  </div>
                  <div>
                    <span class="contentText">爆款</span>
                    <span class="contentValue">{{numFormat(data1.REAL_AMOUNT_PAY)}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="circleChartsInnerRight">
              <div class="circleChartsTitle">月累计达成</div>
              <div class="circleChartsInnerContent">
                <div class="circleChartsInnerContent__left">
                  <echarts-gauge :value="numeral(data1.AMOUNT_HOT_FIN_RATE_M * 100).format('0')" style="height: 100%" />
                </div>
                <div class="circleChartsInnerContent__right">
                  <div>
                    <span class="contentText">目标</span>
                    <span class="contentValue">{{numFormat(data1.TARGET_AMOUNT_HOT_CUM_M)}}</span>
                  </div>
                  <div>
                    <span class="contentText">差值</span>
                    <span class="contentValue">{{numFormat(data1.AMOUNT_HOT_DIFF_M)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <echarts-line ref="lineChart2" class="echartsLine" />
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import moment from 'moment'
import EchartsLine from '@/views/BIView/DataV/TmallScreen/EchartsLine'
import EchartsGauge from '@/views/BIView/DataV/TmallScreen/EchartsGauge'
import orderBy from 'lodash/orderBy'
import map from 'lodash/map'

export default {
  name: 'LeftSide',
  components: { EchartsGauge, EchartsLine },
  data() {
    return {
      date: moment(),
      data1: {},
      data2: []
    }
  },
  created() {
    this.getData1()
    this.getData2()

    this.timer = setInterval(() => {
      this.getData1()
      this.getData2()
    }, 5000)
    this.$on('hook:beforeDestroy', () => {
      clearInterval(this.timer)
    })
  },
  methods: {
    numeral,
    numFormat(value, format='0') {
      if(isNaN(Number(value))) {
        return ''
      }
      value = Number(value)
      const param = {};
      param.value =  (value / 10000).toString()
      param.unit = '万'
      if(param.value === '0') {
        return '0'
      }
      return numeral(param.value).format(format) + param.unit
    },
    async getData1() {
      const ret = await this.$fetchSql('NON_PM_b_shop', 'b_shop_hot_sum')
      try {
        const data = ret?.data?.[0] || {}
        this.date = moment(data['MDATE'])
        this.data1 = data
      } catch (e) {
        console.log(e)
      }
    },
    async getData2() {
      const ret = await this.$fetchSql('NON_PM_b_shop', 'b_shop_hot_trand_d')
      try {
        this.data2 = orderBy(ret?.data || [], ['TDATE_WID'], ['asc'])
        this.renderLineCharts(this.data2)
      } catch (e) {
        console.log(e)
      }
    },
    renderLineCharts() {
      const dates = map(this.data2, (v) => v.TDATE_WID?.slice(-4))
      const today = moment().format('YYYYMMDD')

      this.$refs.lineChart1.setOption({
        xAxis: {
          data: dates
        },
        series: [
          {
            data: map(this.data2, v => v.TDATE_WID >= today ? null : numeral(v.VISITORS_SEACH).format('0'))
          },
          {
            data: map(this.data2, v => numeral(v.TARGET_SEACHT_HOT).format('0'))
          }
        ]
      })
      this.$refs.lineChart2.setOption({
        xAxis: {
          data: dates
        },
        series: [
          {
            data: map(this.data2, v => v.TDATE_WID >= today ? null : numeral(v.REAL_AMOUNT_PAY).format('0'))
          },
          {
            data: map(this.data2, v => numeral(v.TARGET_AMOUNT_HOT_CUM_D).format('0'))
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./common/sideStyle.scss";
</style>