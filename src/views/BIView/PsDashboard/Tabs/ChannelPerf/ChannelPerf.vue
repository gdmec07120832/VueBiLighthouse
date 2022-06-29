<template>
  <div class="px15">
    <div class="flex-between">
      <div class="flex-start text-xs text-black" style="height: 30px">
        <span class="mr20">日累计支付</span>
        <span class="mr20">实绩：{{ numeral(dly_sum.TOT_PAY_AMT).format('0,0') }}</span>
        <span class="mr20">同期：{{ numeral(dly_sum.TOT_PAY_AMT_AGO).format('0,0') }}</span>
        <span class="mr20"
              :class="{'text-green': dly_sum.TOT_PAY_AMT_YOY < 0, 'text-red': dly_sum.TOT_PAY_AMT_YOY > 0}">同比：{{
            numeral(dly_sum.TOT_PAY_AMT_YOY).format('0.00%')
          }}</span>
      </div>
      <div class="flex-start" style="height: 30px">
        <ez-month-select v-model="query.yearMonth" style="margin-right: 50px">
          <div class="flex-between text-xs" style="height: 24px; color: #808492; cursor: pointer">
            {{ `年月(${query.yearMonth.getFullYear()}-${query.yearMonth.getMonth() + 1})` }}
            <div style="margin-left: 40px" class="dropdown-icon">
              <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
            </div>
          </div>
        </ez-month-select>
        <DropdownSelect label="渠道类别">
          <div slot="selectedText" class="text-ellipsis px10" style="width: 80px">
            {{ query.channel.join(', ') }}
          </div>
          <a-checkbox-group v-model="query.channel">
            <div>
              <a-checkbox value="线上渠道">线上渠道</a-checkbox>
            </div>
            <div>
              <a-checkbox value="线下渠道">线下渠道</a-checkbox>
            </div>
            <div>
              <a-checkbox value="海外渠道">海外渠道</a-checkbox>
            </div>
            <div>
              <a-checkbox value="其它">其它</a-checkbox>
            </div>
          </a-checkbox-group>
        </DropdownSelect>
      </div>
    </div>

    <div class="ch1">
      <v-chart autoresize :options="chartOptions"/>
    </div>

    <div class="mt15">
      <table class="table">
        <tr>
          <th>日期</th>
          <th v-for="item in monthDays[0]" :key="item">{{ item + 1 }}</th>
        </tr>
        <tr>
          <td>实绩</td>
          <td v-for="item in monthDays[0]" :key="item">{{
              monthData[item] && (monthData[item]['TOT_PAY_AMT'] ? (numeral(monthData[item]['TOT_PAY_AMT'] / 10000).format('0,0') + '万') : '--')
            }}
          </td>
        </tr>
        <tr>
          <td>同期</td>
          <td v-for="item in monthDays[0]" :key="item">
            {{
              monthData[item] && (monthData[item]['TOT_PAY_AMT_AGO'] ? (numeral(monthData[item]['TOT_PAY_AMT_AGO'] / 10000).format('0,0') + '万') : '--')
            }}
          </td>
        </tr>
        <tr>
          <td>同比</td>
          <td v-for="item in monthDays[0]" :key="item"
              :class="monthData[item] && (monthData[item]['TOT_PAY_AMT_YOY'] > 0 ? 'text-red' : monthData[item]['TOT_PAY_AMT_YOY'] < 0 ?  'text-green' : '')">
            {{
              monthData[item] && (monthData[item]['TOT_PAY_AMT_YOY'] ? numeral(monthData[item]['TOT_PAY_AMT_YOY']).format('0.00%') : '--')
            }}
          </td>
        </tr>
      </table>
      <table class="table mt15">
        <tr>
          <th>日期</th>
          <th v-for="item in monthDays[1]" :key="item">{{ item + 1 > 31 ? '/' : item + 1 }}</th>
        </tr>
        <tr>
          <td>实绩</td>
          <td v-for="item in monthDays[1]" :key="item">{{
              item + 1 > 31 ? '/' :
                  monthData[item] && (monthData[item]['TOT_PAY_AMT'] ? (numeral(monthData[item]['TOT_PAY_AMT'] / 10000).format('0,0') + '万') : '--')
            }}
          </td>
        </tr>
        <tr>
          <td>同期</td>
          <td v-for="item in monthDays[1]" :key="item">{{
              item + 1 > 31 ? '/' :
                  monthData[item] && (monthData[item]['TOT_PAY_AMT_AGO'] ? (numeral(monthData[item]['TOT_PAY_AMT_AGO'] / 10000).format('0,0') + '万') : '--')
            }}
          </td>
        </tr>
        <tr>
          <td>同比</td>
          <td v-for="item in monthDays[1]" :key="item"
              :class="monthData[item] && (monthData[item]['TOT_PAY_AMT_YOY'] > 0 ? 'text-red' : monthData[item]['TOT_PAY_AMT_YOY'] < 0 ?  'text-green' : '')">
            {{
              item + 1 > 31 ? '/' :
                  monthData[item] && (monthData[item]['TOT_PAY_AMT_YOY'] ? numeral(monthData[item]['TOT_PAY_AMT_YOY']).format('0.00%') : '--')
            }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import numeral from 'numeral'
import orderBy from 'lodash/orderBy'
import EzMonthSelect from '@/views/BIView/OperateDashboard/components/EzMonthSelect'
import DropdownSelect from '@/views/BIView/components/DropdownSelect/DropdownSelect'

const genDays = (half) => {
  return [Array(half).fill(null).map((item, index) => index),
    Array(half).fill(null).map((item, index) => index + half)
  ]
}

export default {
  name: 'ChannelPerf',
  components: { DropdownSelect, EzMonthSelect },
  data () {
    const _this = this
    return {
      dly_sum: {
        TOT_PAY_AMT: '',
        TOT_PAY_AMT_AGO: '',
        TOT_PAY_AMT_YOY: ''
      },
      monthData: [],
      query: {
        yearMonth: new Date(),
        channel: [],
      },
      chartOptions: {
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: (params) => {
            const lines = params.map(item => {
              return `<br>${item.marker}${item.seriesName}: ${numeral(item.value).format('0,0')}`
            }).join('')
            return `统计日期：${moment(_this.query.yearMonth).format('YYYY-MM')}-${params[0].axisValue}${lines}`
          }
        },
        grid: {
          top: 20,
          bottom: 10,
          left: 10,
          right: 10,
          containLabel: true
        },
        xAxis: {
          data: [],
          axisLabel: {
            color: '#999',
            formatter: params => {
              return params.slice(-2)
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: ['#ececee']
            }
          },
          axisLabel: {
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            z: 10,
            name: '实绩',
            data: [],
            barWidth: 20,
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: '#00b050'
            },
          },
          {
            type: 'line',
            name: '同期',
            symbol: 'none',
            smooth: true,
            data: [],
            itemStyle: {
              color: '#8aa8cf'
            }
          }
        ]
      }
    }
  },
  computed: {
    monthDays () {
      const days = moment(this.query.yearMonth).daysInMonth()
      if (days === 28) {
        return genDays(14)
      } else if (days <= 30) {
        return genDays(15)
      } else {
        return genDays(16)
      }
    }
  },
  watch: {
    'query.yearMonth': {
      handler () {
        this.getData1()
        this.getData2()
        this.chartOptions.xAxis.data = Array(moment(this.query.yearMonth).daysInMonth())
            .fill(null).map((_, index) => {
              return ('0' + (index + 1)).slice(-2)
            })
      },
      immediate: true
    },
    'query.channel': {
      handler () {
        this.getData1()
        this.getData2()
      }
    }
  },
  mounted () {
    // this.getData1()
  },
  methods: {
    numeral,
    /**
     * 左上角日累计支付
     */
    getData1 () {
      this.$fetchSql('pds_cockpit', 'chnl_amt_dly_sum', {
        MDATE: moment(this.query.yearMonth).format('YYYYMM'),
        CHNL_NAME: this.query.channel.toString()
      }).then(({ data: [dly_sum] }) => {
        this.dly_sum = dly_sum
      })
    },
    /**
     * 图表数据
     */
    getData2 () {
      this.$fetchSql('pds_cockpit', 'chnl_amt_dly_dtl', {
        MDATE: moment(this.query.yearMonth).format('YYYYMM'),
        CHNL_NAME: this.query.channel.toString()
      }).then(({ data }) => {
        const ret = orderBy(data, 'TDATE')
        this.monthData = ret
        this.chartOptions.series[0].data = ret.map(item => ({
          value: item['TOT_PAY_AMT'],
          itemStyle: {
            color: item['TOT_PAY_AMT'] >= item['TOT_PAY_AMT_AGO'] ? '#ff1e10' : '#079909'
          }
        }))
        this.chartOptions.series[1].data = ret.map(_ => _['TOT_PAY_AMT_AGO'])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: center;

  tr {
    &:nth-child(2n+1) {
      td {
        background: #fcfcff;
      }
    }

    td {
      height: calc((var(--height) * 0.4px - 15px) / 8);
      border: 1px solid #e7e9f0;

      &:first-child {
        color: #808492;
      }
    }
  }

  th {
    height: calc((var(--height) * 0.4px - 15px) / 8);
    font-weight: normal;
    background: #f5f7ff;
    border: 1px solid #e7e9f0;
    color: #808492;
  }
}

.ch1 {
  height: calc(var(--height) * 0.6px - 65px);
}
</style>
