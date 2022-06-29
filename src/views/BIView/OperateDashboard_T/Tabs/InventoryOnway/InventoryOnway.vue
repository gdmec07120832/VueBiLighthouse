<template>
  <div class="flex-between flex" style="align-items: flex-start">
    <div style="width: 40%; padding-right: 40px">
      <div class="flex-start flex" style="align-items: flex-end">
        <div style="width: 30%">
          <div class="my10">
            <span class="chart-sub-title">库存金额</span>
            <a-tooltip placement="bottomRight" overlayClassName="light-tooltip">
              <div slot="title" class="text-xs text-black">
                总库存：佛山仓库、青岛仓库、供应商仓库、生活馆成品仓、展厅和展会的库存金额；金额均按采购成本价核算。
              </div>
              <a-icon type="question-circle" style="margin-left: 5px; color: #808492"></a-icon>
            </a-tooltip>
          </div>
          <div style="font-size: 22px; line-height: 40px">{{ stockData.stock_amt }}</div>
        </div>
        <div class="flex flex-start mb5" style="flex: 1">
          <div style="flex: 1">
            <div class="text-gary text-xs">同期库存金额</div>
            <div>{{ stockData.ago_stock_amt }}</div>
          </div>
          <div style="flex: 1">
            <div class="text-gary text-xs">库位利用率</div>
            <div>{{ stockData.stock_loc_ratio }}</div>
          </div>
        </div>
      </div>
      <div class="mt20">
        <div class="h202">
          <table class="text-xs table" style="width: 100%; border-collapse: collapse">
            <thead>
            <tr>
              <td>仓库</td>
              <td>库存金额</td>
              <td>同期库存金额</td>
              <td>同期差额</td>
              <td>库存金额同比</td>
            </tr>
            </thead>
          </table>
          <div class="table-wrapper">
            <table class="text-xs table" style="width: 100%; border-collapse: collapse">
              <tbody>
              <tr v-for="item in leftTableData" :key="item.STOCK_TYPE">
                <td>{{ item.STOCK_TYPE }}</td>
                <td>{{ formatY(item['库存金额']) }}</td>
                <td>{{ formatY(item['同期库存金额']) }}</td>
                <td :class="[item['同期差额'] < 0 ? 'text-red' : item['同期差额'] > 0 ? 'text-green' : '']">
                  {{ formatY(item['同期差额']) }}
                </td>
                <td :class="[item['同比'] < 0 ? 'text-red' :  item['同比'] > 0 ? 'text-green' : '']">
                  {{ item['同比'] ? (item['同比'] * 100).toFixed(0) + '%' : '--' }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px; position: relative" class="h201">
        <div style="position: absolute; left: 0; top: 0">
          <span class="chart-sub-title">期末库存月趋势</span>
        </div>
        <v-chart :options="options1" autoresize></v-chart>
      </div>
    </div>
    <div style="width: 40%; padding-right: 40px">
      <div class="my10">
        <span class="chart-sub-title">停产库存</span>
      </div>
      <div style="font-size: 22px; line-height: 40px;">{{ formatY(centerTableTotal.total) }}</div>
      <div class="mt20">
        <div class="h202">
          <table class="text-xs table table-compact" style="border-collapse: collapse; width: 100%">
            <thead>
            <tr>
              <td>上架-停产时间</td>
              <td>停产金额</td>
              <td>金额占比</td>
              <td>同期停产金额</td>
              <td>同期金额占比</td>
            </tr>
            </thead>
            <tbody>
            <tr class="table-bold-row">
              <td>合计</td>
              <td>{{ formatW(centerTableTotal.total) }}</td>
              <td>/</td>
              <td>{{ formatW(centerTableTotal.ago_total) }}</td>
              <td>/</td>
            </tr>
            <tr v-for="item in centerTableData" :key="item.order">
              <td>{{ item['上架停产时间'] }}</td>
              <td>{{ formatW(item['停产金额']) }}</td>
              <td>{{ (item['金额占比'] * 100).toFixed(2) + '%' }}</td>
              <td>{{ formatW(item['同期停产金额']) }}</td>
              <td>{{ (item['同期金额占比'] * 100).toFixed(2) + '%' }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="h200 mt20" style="position: relative">
        <div style="position: absolute; left: 0; top: 0;">
          <span class="chart-sub-title">停产库存月趋势</span>
        </div>
        <v-chart :options="options2" autoresize></v-chart>
      </div>
    </div>
    <div style="width: 30%;">
      <div class="flex flex-start" style="align-items: flex-end">
        <div style="width: 30%">
          <div class="my10" style="">
            <span class="chart-sub-title">采购在途</span>
          </div>
          <div style="font-size: 22px;line-height: 40px">{{ formatY(purchaseOnWayData.amt) }}</div>
        </div>
        <div class="mb5" style="flex: 1">
          <div class="text-xs text-gary">当月在途</div>
          <div>{{ formatY(purchaseOnWayData.dtd_amt) }}</div>
        </div>
      </div>
      <div class="h202 mt20">
        <v-chart :options="barOptions" autoresize></v-chart>
      </div>
      <div class="h200 mt20" style="position: relative">
        <div style="position: absolute; left: 0; top: 0">
          <span class="chart-sub-title">报检金额月趋势</span>
        </div>
        <v-chart :options="getOptions(options3)" autoresize></v-chart>
      </div>
    </div>
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import graphic from 'echarts/lib/util/graphic'
import moment from 'moment'
import deepmerge from 'deepmerge'
import { formatNumber, isUndef, numGroupSep } from '@/utils/helper'

const formatY = (num) => { return num ? formatNumber(num, 100000000) + '亿' : '--' }
const formatW = (num) => { return num ? formatNumber(num, 10000, 1) + '万' : '--' }

export default {
  name: 'InventoryOnway',
  data () {
    return {
      stockType: [
        '佛山仓库', '青岛仓库', '供应商仓库', '小商品成品仓', '展厅', '展会'
      ],
      basicOptions: {
        title: {
          top: 0,
          left: 0,
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          right: 0,
          selectedMode: false,
        },
        grid: {
          top: 50,
          right: 0,
          bottom: 10,
          left: 0,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ececee'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999'
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ececee'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999',
            formatter: value => {
              return (value / 100000000).toFixed(2) + '亿'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
      },
      options1: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: params => {
            const name = params[0].name
            const lines = params.reverse()
                .map(item => `<br>${item.marker}${item.seriesName}：${isUndef(item.value) ? '--' : numGroupSep(item.value)}`).join('')
            return `${name}${lines}`
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          right: 0,
          selectedMode: false,
        },
        grid: {
          top: 50,
          right: 0,
          bottom: 10,
          left: 0,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ececee'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999'
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ececee'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999',
            formatter: value => {
              return (value / 100000000).toFixed(2) + '亿'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: []
      },
      options2: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: params => {
            const name = params[0].name
            const lines = params.reverse()
                .map(item => `<br>${item.marker}${item.seriesName}：${isUndef(item.value) ? '--' : numGroupSep(item.value)}`).join('')
            return `${name}${lines}`
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          right: 0,
          selectedMode: false,
        },
        grid: {
          top: 50,
          right: 0,
          bottom: 10,
          left: 0,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ececee'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999'
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ececee'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999',
            formatter: value => {
              return (value / 100000000).toFixed(2) + '亿'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: []
      },
      options3: {
        tooltip: {
          formatter: params => {
            const name = params[0].name
            const lines = params.reverse()
                .map(item => `<br>${item.marker}${item.seriesName}：${isUndef(item.value) ? '--' : numGroupSep(item.value)}`).join('')
            return `${name}${lines}`
          }
        },
        color: ['#cce0e9', '#0052cc'],
        series: []
      },
      barOptions: {
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(150,150,150, 0.1)'
            }
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          left: 0,
          selectedMode: false
        },
        grid: {
          top: 30,
          right: 0,
          bottom: 0,
          left: 0,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, '-10%'],
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false
          }
        },
        yAxis: [{
          type: 'category',
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#808492'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        }, {
          type: 'category',
          inverse: true,
          axisTick: 'none',
          axisLine: 'none',
          show: true,
          axisLabel: {
            textStyle: {
              color: '#282c33',
              fontSize: '12'
            },
          },
          data: []
        }],
        series: [
          {
            type: 'bar',
            name: '报检金额',
            stack: true,
            barWidth: 20,
            itemStyle: {
              color: '#ffcc00'
            },
            data: []
          },
          {
            type: 'bar',
            name: '在途金额',
            stack: true,
            barWidth: 20,
            label: {
              show: false
            },
            itemStyle: {
              color: '#2062e6'
            },
            data: []
          },
          {
            type: 'bar',
            tooltip: {
              show: false
            },
            name: '',
            stack: false,
            z: 0,
            barWidth: 20,
            itemStyle: {
              color: '#ebedf3',
            },
            emphasis: {
              itemStyle: {
                color: '#ebedf3'
              }
            },
            barGap: '-100%',
            data: []
          }
        ]
      },
      durations: [
        '0-30',
        '31-60',
        '61-90',
        '91-180',
        '181-360',
        '361-720',
        '720+'
      ],
      leftTableData: [],
      centerTableData: [],
      centerTableTotal: {
        total: '--', // 停产金额
        ago_total: '--', // 同期停产金额
      },
      stockData: {
        stock_amt: '--', // 库存金额
        ago_stock_amt: '--', // 同期库存金额
        stock_loc_ratio: '--', // 库位利用率
      },
      purchaseOnWayData: {
        amt: '--', // 采购在途
        dtd_amt: '--' // 当月在途
      }
    }
  },
  created () {
    this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
    this.getData5()
    this.getData6()
    this.getData7()
    this.getData8()
  },
  methods: {
    formatY,
    formatW,
    getOptions (opt) {
      return deepmerge(this.basicOptions, opt)
    },
    // 库存金额
    getData1 () {
      this.$axios.post('/api/admin/data/kpi_report/stock_immdt_cost/get').then(res => {
        const data = res.data.map(item => {
          // const order = this.stockType.findIndex(_ => _ === item['STOCK_TYPE'])
          return {
            // order,
            ...item
          }
        }).filter((item) => {
          return ['展厅', '展会'].indexOf(item['STOCK_TYPE']) === -1
        })
        // .sort((a, b) => a.order - b.order)
        this.leftTableData = orderBy(data, item => item['库存金额'] || -Infinity, ['desc'])
        this.stockData.stock_amt = formatY(data.reduce((acc, cur) => {
          return acc + (cur['库存金额'] || 0)
        }, 0))
        this.stockData.ago_stock_amt = formatY(data.reduce((acc, cur) => {
          return acc + (cur['同期库存金额'] || 0)
        }, 0))
      })
    },

    // 库位利用率
    getData2 () {
      this.$axios.post('/api/admin/data/kpi_report/stockloc_ratio/get').then(res => {
        const value = res.data[0].VALUE
        this.stockData.stock_loc_ratio = (value * 100).toFixed(2) + '%'
      })
    },
    // 停产库存
    getData3 () {
      this.$axios.post('/api/admin/data/kpi_report/stop_inv_cost/get').then(res => {
        const data = res.data.map(item => {
          const order = this.durations.findIndex(_ => _ === item['上架停产时间'])
          return {
            order,
            ...item
          }
        }).sort((a, b) => a.order - b.order)
        this.centerTableData = data
        this.centerTableTotal.total = data.reduce((acc, cur) => {
          return acc + (cur['停产金额'] || 0)
        }, 0)
        this.centerTableTotal.ago_total = data.reduce((acc, cur) => {
          return acc + (cur['同期停产金额'] || 0)
        }, 0)
      })
    },

    // 采购在途
    getData4 () {
      this.$axios.post('/api/admin/data/kpi_report/intrns_amt_sum/get').then(res => {
        const data = res.data[0]['AS采购在途金额']
        this.purchaseOnWayData.amt = data
      })
    },

    // 报检金额月趋势
    getData5 () {
      this.$axios.post('/api/admin/data/kpi_report/mtrl_inv_trend/get').then(res => {
        const data = res.data
        const result = {}
        for (let item of data) {
          const year = item['YYYY']
          const month = item['MM']
          const monthIndex = Number(month - 1)
          if (!result[year]) {
            result[year] = []
          }
          result[year][monthIndex] = item
        }
        console.log(result)
        const series = []
        Object.keys(result).sort((a, b) => a - b).forEach((year, index) => {
          series.push({
            name: year,
            type: 'line',
            smooth: true,
            showSymbol: true,
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: `${this.options3.color[index]}80`
                },
                {
                  offset: 1,
                  color: `${this.options3.color[index]}00`
                }
              ])
            },
            data: result[year].map(_ => (_['报检金额'] ? _['报检金额'].toFixed(0) : null))
          })
        })
        console.log(series)
        this.options3.series = series
      })
    },

    // 停产库存月趋势
    getData6 () {
      this.$axios.post('/api/admin/data/kpi_report/stop_immdt_cost_trend/get').then(res => {
        const data = res.data.sort((a, b) => {
          return Number(a['MM']) - Number(b['MM'])
        })
        const year = data[0]['YYYY']
        this.options2.series = [
          {
            type: 'line',
            name: year - 1,
            smooth: true,
            showSymbol: true,
            itemStyle: {
              color: '#cce0e9'
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#cce0e980'
                },
                {
                  offset: 1,
                  color: '#cce0e900'
                }
              ])
            },
            data: data.map(_ => _['同期库存金额'] ? (_['同期库存金额'].toFixed(0)) : null)
          },
          {
            type: 'line',
            name: year,
            smooth: true,
            showSymbol: true,
            itemStyle: {
              color: '#0052cc'
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0052cc80'
                },
                {
                  offset: 1,
                  color: '#0052cc00'
                }
              ])
            },
            data: data.map(_ => _['库存金额'] ? (_['库存金额'].toFixed(0)) : null)
          }
        ]

      })
    },

    // 库存金额趋势
    getData7 () {
      this.$axios.post('/api/admin/data/kpi_report/immdt_cost_trend/get').then(res => {
        const data = res.data.sort((a, b) => {
          return Number(a['MM']) - Number(b['MM'])
        })
        const year = data[0]['YYYY']
        this.options1.series = [
          {
            type: 'line',
            name: year - 1,
            smooth: true,
            showSymbol: true,
            itemStyle: {
              color: '#cce0e9'
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#cce0e980'
                },
                {
                  offset: 1,
                  color: '#cce0e900'
                }
              ])
            },
            data: data.map(_ => _['同期库存金额'] ? (_['同期库存金额'].toFixed(0)) : null)
          },
          {
            type: 'line',
            name: year,
            smooth: true,
            showSymbol: true,
            itemStyle: {
              color: '#0052cc'
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#0052cc80'
                },
                {
                  offset: 1,
                  color: '#0052cc00'
                }
              ])
            },
            data: data.map(_ => _['库存金额'] ? (_['库存金额'].toFixed(0)) : null)
          }
        ]
      })
    },

    // 近4个月在途金额
    getData8 () {
      this.$axios.post('/api/admin/data/kpi_report/mtrl_inv_4/get').then(res => {
        const data = res.data.sort((a, b) => {
          return moment(b.MDATE) - moment(a.MDATE)
        })
        this.purchaseOnWayData.dtd_amt = data[0]['当月在途']
        this.barOptions.yAxis[0].data = data.map(_ => moment(_.MDATE).format('YY-MM'))
        const totalData = data.map(_ => {
          return _['报检金额'] + _['在途金额']
        })
        this.barOptions.yAxis[1].data = totalData.reverse().map(_ => {
          return formatY(_)
        })
        const max = Math.max(...totalData) / 0.95
        this.barOptions.series[0].data = data.map(_ => (_['报检金额']).toFixed(0))
        this.barOptions.series[1].data = data.map(_ => (_['在途金额']).toFixed(0))
        this.barOptions.series[2].data = data.map(() => max)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-wrapper {
  height: calc(0.358px * var(--height));
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
}

.table {
  table-layout: fixed;
  white-space: nowrap;
  line-height: calc(0.0425px * var(--height));

  td {
    text-align: center;
    padding: 2px 5px;
    border: 1px solid #e7e9f0;

    &:first-child {
      text-align: left;
    }
  }

  thead {
    tr {
      background: #f5f7ff;
    }
  }

  .table-bold-row {
    font-weight: bold;
    color: #2680eb;
  }
}

.table-compact {
  line-height: calc(0.0478px * var(--height) * 7 / 9);
}

.h201 {
  height: calc(0.65px * var(--height) - 168px);
}

.h200 {
  height: calc(0.65px * var(--height) - 168px);
}

.h202 {
  height: calc(0.4px * var(--height) + 5px);
}

.h210 {
  height: calc((1px * var(--height) - 80px) / 2);
}
</style>
