<!--订单分布-->
<template>
  <div class="flex flex-start" style="align-items: flex-start">
    <div style="width: 60%; padding-right: 20px;">
      <div class="nowrap my10">
        <span class="chart-sub-title">待货审金额按承诺日期分布</span>
      </div>
      <div class="mt5 flex flex-between" style="width: 60%">
        <div>
          <div class="text-xs text-gary nowrap">承诺本月发货待货审订单金额</div>
          <div style="height: 24px; font-size: 20px; font-weight: bold">{{totalAmt.thisMonth}}</div>
        </div>
        <div>
          <div class="text-gary text-xs nowrap">承诺次月发货待货审订单金额</div>
          <div style="height: 24px; font-size: 20px">{{totalAmt.nextMonth}}</div>
        </div>
      </div>
      <div class="mt20">
        <table class="text-xs table" style="width: 100%; border-collapse: collapse; text-align: right">
          <thead>
          <tr>
            <td style="text-align: left">时间区间</td>
            <td title="待货审业绩">待货审业绩</td>
            <td title="前一天待货审业绩">前一天待货审业绩</td>
            <td title="2日差值">2日差值</td>
            <td title="金额占比">金额占比</td>
            <td title="订单匹配率（总仓">订单匹配率(总仓)</td>
            <td title="订单匹配率（总仓&供应仓）">订单匹配率(总仓&供应仓)</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in  mainTableData" :key="item.DURATION">
            <td>{{ item.DURATION }}</td>
            <td>{{numGroupSep(item.DUR_TOTAL_AMT)}}</td>
            <td>{{numGroupSep(item.LTD_DUR_TOTAL_AMT)}}</td>
            <td>{{numGroupSep(item.DIF_VALUE_2D)}}</td>
            <td>{{transPercent(item.DUR_AMT_RATE)}}</td>
            <td>{{transPercent(item.TOT_MATCH_ORD_RATE)}}</td>
            <td>{{transPercent(item.TG_MATCH_ORD_RATE)}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="mt20">
        <div>
          <span class="chart-sub-title">承诺交期7天内订单匹配率分时趋势</span>
        </div>
        <div class="h200">
          <v-chart :options="chartOptions" autoresize></v-chart>
        </div>
      </div>
    </div>
    <div style="width: 40%; padding-left: 40px;">
      <div class="my10">
        <span class="chart-sub-title">
          订单处理监控情况
        </span>
        <span class="text-xs ml5" style="color: #808492;">备注：报表为实时数据，每次刷新数据间隔半小时</span>
      </div>
      <div>
        <div>
          <span class="sub-title2">待处理情况</span>
        </div>
        <div class="h160">
          <v-chart :options="barChartOptions1" autoresize></v-chart>
        </div>
        <table class="text-xs r-table" style="width: 100%; border-collapse: collapse; text-align: center">
          <thead>
          <tr style="line-height: 1.8;">
            <td width="20%">待客审总金额</td>
            <td width="20%">待货审总金额</td>
            <td width="20%">待财审总金额</td>
            <td width="20%">待打印金额</td>
            <td width="20%">待发货金额</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td v-for="(item, index) in barChartOptions1.series.data" :key="index">{{ numGroupSep(item) }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="mt10">
        <div class="">
          <span class="sub-title2">当天累计处理情况</span>
        </div>
        <div class="h160">
          <v-chart :options="barChartOptions2" autoresize></v-chart>
        </div>
        <table class="text-xs r-table" style="width: 100%; border-collapse: collapse; text-align: center">
          <thead>
          <tr style="line-height: 1.8;">
            <td width="20%">当天审核业绩</td>
            <td width="20%">当天货审金额</td>
            <td width="20%">当天财审金额</td>
            <td width="20%">当天打印金额</td>
            <td width="20%">当天发货金额</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td v-for="(item, index) in barChartOptions2.series.data" :key="index">{{ numGroupSep(item) }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { numGroupSep } from '@/utils/helper'
export default {
  name: 'OrderDistribution',
  data () {
    return {
      timeInterval: [
        '合计',
        '到期一周',
        '到期一周+',
        '7天内',
        '8-14天',
        '15-21天',
        '22-28天',
        '4周+'
      ],
      mainTableData: Array(9).fill({}),
      chartOptions: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params.map(item => {
              return `<br>${item.marker}${item.seriesName}：${item.value}%`
            }).join('')
            return `${name}${lines}`
          }
        },
        legend: {
          show: true,
          data: [
            { name: '总仓匹配率', icon: 'rect' },
            { name: '总仓&供应仓匹配率', icon: 'rect' }
          ],
          itemWidth: 16,
          itemHeight: 2,
          icon: 'rect',
          top: 0,
          right: 0
        },
        grid: {
          top: 20,
          bottom: 0,
          left: 0,
          right: 10,
          containLabel: true
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999',
            interval: 10
          },
          data: []
        },
        yAxis: {
          max: 'dataMax',
          min: 'dataMin',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: ['#ececee']
            }
          },
          axisLabel: {
            color: '#999',
            formatter: '{value}%'
          }
        },
        series: []
      },
      barChartOptions1: {
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'item',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
        },
        grid: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false
          },
          data: ['待客审总金额', '待货审总金额', '待财审总金额', '待打印金额', '待发货金额']
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: {
          type: 'bar',
          data: [],
          barWidth: 30,
          itemStyle: {
            barBorderRadius: [15, 15, 0, 0],
            color: '#4fa8f9'
          }
        }
      },
      barChartOptions2: {
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'item',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
        },
        grid: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false
          },
          data: ['当天审核金额', '当天货审金额', '当天财审金额', '当天打印金额', '当天发货金额']
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false,
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: {
          type: 'bar',
          data: [],
          barWidth: 30,
          itemStyle: {
            barBorderRadius: [15, 15, 0, 0],
            color: '#2680eb'
          }
        }
      },
      totalAmt: {
        thisMonth: '',
        nextMonth: ''
      }
    }
  },
  mounted () {
    this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
    this.getData5()
  },
  methods: {
    numGroupSep,
    transPercent(num) {
      return typeof num === 'number' ? (num * 100).toFixed(2) + '%' : '--'
    },
    // 待处理情况
    getData1 () {
      this.$axios.post('/api/admin/data/kpi_report/ord_wait_handle/get').then(res => {
        const data = res.data[0] || {}
        this.barChartOptions1.series.data = [
          data['WAIT_CS_AUD_AMT'],
          data['WAIT_GOOGDS_AUD_AMT'],
          data['WAIT_FIN_AUD_AMT'],
          data['WAIT_PRT_AUD_AMT'],
          data['WAIT_SEND_AMT']
        ]
      })
    },

    // 累计处理情况
    getData2 () {
      this.$axios.post('/api/admin/data/kpi_report/ord_tot_handle/get').then(res => {
        const data = res.data[0] || {}
        this.barChartOptions2.series.data = [
          data['DTD_AUD_AMT'],
          data['DTD_GOODS_AUD_AMT'],
          data['DTD_FIN_AUD_AMT'],
          data['DTD_PRINT_AMT'],
          data['DTD_SEND_AMT']
        ]
      })
    },

    // 承诺金额
    getData3() {
      this.$axios.post('/api/admin/data/kpi_report/ord_promise_amt/get').then(res => {
        const data = res.data[0]
        this.totalAmt.thisMonth = numGroupSep(data['TOT_AMT_THIS_MON'])
        this.totalAmt.nextMonth = numGroupSep(data['TOT_AMT_NEXT_MON'])
      })
    },

    // 分时趋势
    getData4() {
      this.$axios.post('/api/admin/data/kpi_report/ord_time_trend/get').then(res => {
        const data = res.data.sort((a, b) => moment(a.TDATE) - moment(b.TDATE))
        let series0Data = data.map(_ => {
          return (_['TOT_MATCH_ORD_RATE'] * 100).toFixed(2)
        })
        let series1Data = data.map(_ => {
          return (_['TG_MATCH_ORD_RATE'] * 100).toFixed(2)
        })

        let xAxisData = data.map(_ => {
          return moment(_.TDATE).format('MM-DD')
        })
        this.chartOptions.xAxis.data = xAxisData
        setTimeout(() => {
          this.chartOptions.series = [
            {
              type: 'line',
              name: '总仓匹配率',
              symbol: 'none',
              smooth: true,
              data: series0Data,
              itemStyle: {
                color: '#2680eb',
              },
              lineStyle: {
                color: '#2680eb',
                width: 2.5
              }
            },
            {
              type: 'line',
              name: '总仓&供应仓匹配率',
              symbol: 'none',
              smooth: true,
              data: series1Data,
              itemStyle: {
                color: '#ff7f0e',
              },
              lineStyle: {
                color: '#ff7f0e',
                width: 2.5
              }
            },
          ]
        }, 0)

      })
    },

    // 日期分布
    getData5() {
      this.$axios.post('/api/admin/data/kpi_report/ord_time_distribution/get').then(res => {
        const data = res.data.map(item => {
          const order = this.timeInterval.findIndex(_ => _ === item.DURATION)
          return {
            ...item,
            order
          }
        }).sort((a, b) => a.order - b.order)
        this.mainTableData = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-title2 {
  font-size: 16px;
  position: relative;
}


.table {
  table-layout: fixed;
  thead tr td:first-child {
    width: 58px
  }
  td {
    white-space: nowrap;
    overflow: hidden;
    &:not(:last-child) {
      padding-right: 10px;
    }
  }

  tbody tr {
    line-height: calc(0.0379px * var(--height));
    &:first-child {
      color: #2680eb;
      font-weight: bold;
    }

    &:nth-child(2n+1) {
      background: #f5faff;
    }

    td:first-child {
      text-align: left;
    }
  }
}

.r-table {
  table-layout: fixed;
  thead {
    td {
      color: #999;
    }
  }

  tbody {
    td {
      color: #000;
      font-size: 18px;
      overflow: hidden;
    }
  }
  td:first-child {
    padding-left: 3%;
  }
  td:nth-child(2) {
    padding-left: 2%;
  }
}

.h160 {
  height: calc((1px * var(--height) - 218px) / 2);
}

.h200 {
  height: calc(0.6589px * var(--height) - 175px)
}
</style>
