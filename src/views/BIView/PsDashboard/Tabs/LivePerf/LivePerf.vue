<template>
  <div class="px15 flex-between" style="align-items: flex-start">
    <div style="width: calc(60% - 20px);">
      <p class="text-black mt10">全渠道业绩</p>
      <div class="my20">
        <span style="font-size: 26px; font-weight: 800">{{ numeral(overviewData.AMT).format('0,0') }}</span>
        <p class="text-xs text-black">包含未锁定业绩：{{ numeral(overviewData.UNLOCK_AMT).format('0,0') }}</p>
      </div>
      <div class="text-xs text-gary mt10" style="line-height: 26px">
        <div class="flex" style="width: 50%">
          <div class="flex-start" style="width: 50%;">
            <span style="flex: 0 0 100px">目标</span>
            <span class="text-black">{{ numeral(overviewData.TGT_AMT / 10000).format('0,0') }}万</span>
          </div>
          <div class="flex-start" style="width: 50%">
            <span style="flex: 0 0 100px">同期业绩</span>
            <span class="text-black">{{ numeral(overviewData.AGO_AMT / 10000).format('0,0') }}万</span>
          </div>
        </div>
        <div class="flex" style="width: 50%">
          <div class="flex-start" style="width: 50%">
            <span style="flex: 0 0 100px">完成</span>
            <span
                :class="{'text-red': overviewData.AMT_CMPL_RTO >= 100, 'text-green': overviewData.AMT_CMPL_RTO < 100}">
              {{ numeral(overviewData.AMT_CMPL_RTO / 100).format('0.00%') }}</span>
          </div>
          <div class="flex-start" style="width: 50%;">
            <span style="flex: 0 0 100px">增幅</span>
            <span :class="{'text-red': overviewData.AMT_YOY > 0, 'text-green': overviewData.AMT_YOY < 0}">
              {{ numeral(overviewData.AMT_YOY / 100).format('0,00%') }}
            </span>
          </div>
        </div>

        <div class="flex" style="width: 50%">
          <div class="flex-start" style="width: 50%">
            <span style="flex: 0 0 100px;">差值</span>
            <span class="text-black">{{ numeral(overviewData.DIFF_AMT / 10000).format('0,00') }}万</span>
          </div>
        </div>
      </div>

      <div class="mt20">
        <a-radio-group v-model="query.channelType">
          <a-radio value="线上平台,线上外包,线下直营,线下经销">全渠道</a-radio>
          <a-radio value="线上平台,线上外包">平台+外包</a-radio>
          <a-radio value="线上平台">线上平台</a-radio>
          <a-radio value="线上外包">线上外包</a-radio>
          <a-radio value="线下直营,线下经销">直营+经销</a-radio>
          <a-radio value="线下直营">线下直营</a-radio>
          <a-radio value="线下经销">线下经销</a-radio>
        </a-radio-group>
      </div>
      <div class="ch1 mt10">
        <v-chart ref="chart" autoresize :options="options"/>
      </div>
    </div>
    <div style="width: 40%">
      <table class="table">
        <tr>
          <td>支付业绩</td>
          <td>目标</td>
          <td>完成度</td>
          <td>差值</td>
          <td>同期业绩</td>
          <td>同比增幅</td>
        </tr>
        <tr v-for="(item, index) in tableData" :key="index">
          <td>
            <div :class="{'text-lg': [0, 3].includes(index)}">{{ item.name }}</div>
            <div :class="{'text-xl': [0, 3].includes(index)}">{{ item.payAmt }}</div>
          </td>
          <td>{{ item.target }}</td>
          <td>
            <CircleRate :value="item.cmpRate"/>
          </td>

          <td>{{ item.diffAmt }}</td>
          <td>{{ item.yoyAmt }}</td>
          <td :class="item.yoyRate_c">{{ item.yoyRate }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import unionWith from 'lodash/unionWith'
import orderBy from 'lodash/orderBy'
import CircleRate from '@/views/BIView/PsDashboard/Tabs/LivePerf/CircleRate'
import graphic from 'echarts/lib/util/graphic'

export default {
  name: 'LivePerf',
  components: { CircleRate },
  data () {
    const hours = Array(24).fill(null).map((_, i) => ('0' + i).slice(-2))
    return {
      hours,
      query: {
        channelType: '线上平台,线上外包,线下直营,线下经销'
      },
      overviewData: {
        AMT: '',
        AGO_AMT: '',
        AMT_CMPL_RTO: '',
        AMT_YOY: '',
        DIFF_AMT: '',
        TGT_AMT: '',
        UNLOCK_AMT: ''
      },
      tableData: [
        {
          name: '平台+外包',
          payAmt: '--',
          target: '--',
          cmpRate: 0,
          diffAmt: '--',
          yoyAmt: '--',
          yoyRate: '--',
          yoyRate_c: ''
        },
        {
          name: '线上平台',
          payAmt: '--',
          target: '--',
          cmpRate: 0,
          diffAmt: '--',
          yoyAmt: '--',
          yoyRate: '--',
          yoyRate_c: ''
        },
        {
          name: '线上外包',
          payAmt: '--',
          target: '--',
          cmpRate: 0,
          diffAmt: '--',
          yoyAmt: '--',
          yoyRate: '--',
          yoyRate_c: ''
        },
        {
          name: '直营+经销',
          payAmt: '--',
          target: '--',
          cmpRate: 0,
          diffAmt: '--',
          yoyAmt: '--',
          yoyRate: '--',
          yoyRate_c: ''
        },
        {
          name: '线下直营',
          payAmt: '--',
          target: '--',
          cmpRate: 0,
          diffAmt: '--',
          yoyAmt: '--',
          yoyRate: '--',
          yoyRate_c: ''
        },
        {
          name: '线下经销',
          payAmt: '--',
          target: '--',
          cmpRate: 0,
          diffAmt: '--',
          yoyAmt: '--',
          yoyRate: '--',
          yoyRate_c: ''
        }
      ],
      options: {
        isEmpty: false,
        emptyText: '期间暂无业务发生',
        tooltip: {
          confine: true,
          trigger: 'axis',
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter (params) {
            const name = params[0].name
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${numeral(_.value).format('0,0')}`
            }).join('')
            return `小时：${name}${lines}`
          }
        },
        grid: {
          top: 10,
          left: 10,
          right: 20,
          bottom: 10,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          boundaryGap: false,
          data: Array(24).fill(null).map((_, index) => String(index).padStart(2, '0'))
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            color: '#999'
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#efefef'
            }
          }
        },
        series: [
          {
            name: '当天业绩',
            z: 10,
            type: 'line',
            symbol: 'none',
            smooth: true,
            animation: true,
            itemStyle: {
              color: '#2680eb'
            },
            lineStyle: {
              color: '#2680eb',
              width: 1.5
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#2680eb'
                },
                {
                  offset: 1,
                  color: '#2680eb00'
                }
              ])
            },
            data: [],
          },
          {
            data: [],
            name: '同期业绩',
            type: 'line',
            symbol: 'none',
            smooth: true,
            animation: true,
            itemStyle: {
              color: '#cce0e9'
            },
            lineStyle: {
              color: '#cce0e9',
              width: 1.5,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#cce0e9'
                },
                {
                  offset: 1,
                  color: '#cce0e900'
                }
              ])
            }
          },
        ]
      }
    }
  },
  watch: {
    'query.channelType': {
      handler () {
        this.getData2()
      }
    }
  },
  mounted () {
    this.getData1()
    this.getData2()
    this.getData3()
  },
  methods: {
    numeral,
    /**
     * 全渠道
     */
    getData1 () {
      this.$fetchSql('pds_cockpit', 'rt_amt_full_chnl').then(({ data }) => {
        this.overviewData = data[0]
      })
    },
    /**
     * 实时曲线图
     */
    getData2 () {
      this.$fetchSql('/pds_cockpit', 'rt_amt_chnl_graph', {
        CHANNEL: this.query.channelType
      }).then(({ data }) => {
        const ordered_data = orderBy(unionWith(data, Array(24).fill(null)
            .map((_, i) => ({
              PAY_HOUR: ('0' + i).slice(-2),
              AMT: 0,
              AGO_AMT: 0
            })), (a, b) => a.PAY_HOUR === b.PAY_HOUR), 'PAY_HOUR')
        this.$refs.chart.clear()
        this.options.series[0].data = ordered_data.map(_ => _['AMT'])
        this.options.series[1].data = ordered_data.map(_ => _['AGO_AMT'])
      })
    },
    /**
     * 右侧支付业绩表格
     */
    getData3 () {
      this.$fetchSql('pds_cockpit', 'rt_amt_chnl_dtl').then(({ data }) => {
        const ret = data[0]
        const keywords = ['FLAT_OUTSOURCE', 'FLAT', 'OUTSOURCE', 'DIR_DIS', 'DIR', 'DIS']
        keywords.forEach((v, i) => {
          this.tableData[i].payAmt = numeral(ret[`${v}_AMT`] / 10000).format('0,0.0') + '万'
          this.tableData[i].target = numeral(ret[`${v}_TGT_AMT`] / 10000).format('0,0.0') + '万'
          this.tableData[i].yoyAmt = numeral(ret[`${v}_AGO_AMT`] / 10000).format('0,0.0') + '万'
          this.tableData[i].diffAmt = numeral(ret[`${v}_DIFF_AMT`] / 10000).format('0,0.0') + '万'
          this.tableData[i].cmpRate = numeral(ret[`${v}_AMT`] / ret[`${v}_TGT_AMT`]).format('0.00')
          this.tableData[i].yoyRate = numeral(ret[`${v}_AMT`] / ret[`${v}_AGO_AMT`] - 1).format('0.00%')
          this.tableData[i].yoyRate_c = ret[`${v}_AMT`] / ret[`${v}_AGO_AMT`] - 1 > 0 ? 'text-red' : 'text-green'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  table-layout: fixed;
  text-align: center;
  font-size: 12px;

  tr {
    &:first-child {
      height: calc(var(--height) * .12px);
    }

    &:not(:last-child) {
      border-bottom: 1px dashed rgba(0, 0, 0, .3);
    }

    &:not(:first-child) td {
      height: calc((var(--height) * .88px) / 6);
    }
  }
}

.ch1 {
  height: calc((var(--height) - 275) * 1px);
}
</style>
