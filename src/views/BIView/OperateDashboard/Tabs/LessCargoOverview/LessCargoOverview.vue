<!--欠货概况-->
<template>
  <div>
    <div class="flex-start flex" style="align-items: flex-start">
      <div style="width: 40%;  padding-right: 20px">
        <div class="my10">
          <span class="chart-sub-title">欠货概况</span>
        </div>
        <div>欠货趋势</div>
        <div>
          <div class="text-xs-radio">
            <a-radio-group v-model="query.showType" class="mt10 nowrap block">
              <a-radio value="1" style="width: 18%">商品欠货(销)</a-radio>
              <a-radio value="2" style="width: 18%;">商品欠货(采)</a-radio>
              <a-radio value="3" style="width: 18%">日均商品(采)</a-radio>
              <a-radio value="4" style="width: 18%">订单金额(销)</a-radio>
            </a-radio-group>
            <a-radio-group v-model="query.durationType" class="mt10 nowrap block">
              <a-radio value="1" style="width: 18%">近一个月</a-radio>
              <a-radio value="2" style="width: 18%">近三个月</a-radio>
              <a-radio value="3" style="width: 18%">近一年</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div class="mt20 h190" style="overflow: hidden">
          <v-chart :options="options1" autoresize></v-chart>
        </div>
        <div class="mt10">
          <div class="my10">
            <span class="chart-sub-title">日均欠货概况</span>
          </div>
          <table class="text-xs table" style="border-collapse: collapse; width: 100%;">
            <thead>
            <tr>
              <td>日均欠货</td>
              <td>欠货数量</td>
              <td>目标(采)</td>
              <td>欠货商品(采)</td>
              <td>欠货商品(销)</td>
              <td>欠货订单(销)</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>当期日均</td>
              <td>{{lessDesc.row1[0]}}</td>
              <td>{{lessDesc.row1[1]}}</td>
              <td>{{lessDesc.row1[2]}}</td>
              <td>{{lessDesc.row1[3]}}</td>
              <td>{{lessDesc.row1[4]}}</td>
            </tr>
            <tr>
              <td>同期日均</td>
              <td>{{lessDesc.row2[0]}}</td>
              <td>{{lessDesc.row2[1]}}</td>
              <td>{{lessDesc.row2[2]}}</td>
              <td>{{lessDesc.row2[3]}}</td>
              <td>{{lessDesc.row2[4]}}</td>
            </tr>
            <tr>
              <td>同比</td>
              <td :class="[(lessDesc.row3[0] || '').startsWith('-') ? 'text-red' : 'text-green']">{{lessDesc.row3[0]}}</td>
              <td>{{lessDesc.row3[1]}}</td>
              <td :class="[(lessDesc.row3[2] || '').startsWith('-') ? 'text-red' : 'text-green']">{{lessDesc.row3[2]}}</td>
              <td :class="[(lessDesc.row3[3] || '').startsWith('-') ? 'text-red' : 'text-green']">{{lessDesc.row3[3]}}</td>
              <td :class="[(lessDesc.row3[4] || '').startsWith('-') ? 'text-red' : 'text-green']">{{lessDesc.row3[4]}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div style="width: 25%; padding: 0 10px">
        <div class="my10">
          <span class="chart-sub-title">订单金额分布</span>
        </div>
        <div class="h180">
          <v-chart :options="getOptions(options2)" autoresize></v-chart>
        </div>
        <div class="mt20 mb10">
          <span class="chart-sub-title">商品金额分布(采)</span>
        </div>
        <div class="h180">
          <v-chart :options="getOptions(options3)" autoresize></v-chart>
        </div>
      </div>
      <div style="width: 35%">
        <div class="my10">
          <span class="chart-sub-title">项目组欠货商品金额(采)</span>
        </div>
        <div class="h400">
          <v-chart :options="options4" autoresize></v-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import graphic from 'echarts/lib/util/graphic'
import moment from 'moment'
import deepmerge from 'deepmerge'
import { formatNumber, numGroupSep } from '@/utils/helper'

export default {
  name: 'LessCargoOverview',
  data () {
    return {
      query: {
        showType: '1',
        durationType: '1'
      },
      currentData1: [],
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
            const lines = params.reverse().map(_ => `<br>${_.marker}${_.seriesName}: ${_.value}万`).join('')
            return `统计日期：${name}${lines}`
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          right: 0,
          textStyle: {
            color: '#808492'
          }
        },
        grid: {
          top: 50,
          left: 10,
          right: 10,
          bottom: 10,
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
            formatter: params => params.slice(-5)
          },
          data: []
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999',
            formatter: params => params === 0 ? '' : `${params}.0万`
          },
          splitLine: {
            lineStyle: {
              color: '#f5f5f5',
              type: 'dashed'
            },
          }
        },
        series: []
      },
      basicOptions: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          axisPointer: {
            lineStyle: {
              color: '#f9f9f9'
            }
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        legend: {
          top: 0,
          left: 0,
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          selectedMode: false
        },
        grid: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        color: ['#ffcc00', '#2680eb'],
      },
      options2: {
        isEmpty: false,
        series: [
          {
            type: 'pie',
            center: ['50%', '55%'],
            radius: ['42%', '70%'],
            hoverAnimation: false,
            itemStyle: {
              borderWidth: 2,
              borderColor: '#fff'
            },
            labelLine: {
              // show: false
            },
            label: {
              color: '#000',
              formatter: '{d}%'
            },
            data: []
          }
        ]
      },
      options3: {
        series: [
          {
            type: 'pie',
            center: ['50%', '55%'],
            radius: ['42%', '70%'],
            hoverAnimation: false,
            itemStyle: {
              borderWidth: 2,
              borderColor: '#fff'
            },
            labelLine: {
              // show: false
            },
            label: {
              color: '#000',
              formatter: '{d}%'
            },
            data: []
          }
        ]
      },
      options4: {
        isEmpty: false,
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            z: 1,
            shadowStyle: {
              color: '#f9f9f9'
            }
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        legend: {
          top: 0,
          right: 0,
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          selectedMode: false,
          textStyle: {
            color: '#808492'
          }
        },
        grid: {
          top: 30,
          left: 10,
          right: 24,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          show: false
        },
        yAxis: {
          inverse: true,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#999'
          },
          type: 'category',
          data: []
        },
        series: [
          {
            type: 'bar',
            name: '当月日均欠货',
            barWidth: 5,
            itemStyle: {
              color: '#4fa8f9'
            },
            label: {
              show: true,
              position: 'right'
            },
            data: []
          },
          {
            type: 'bar',
            name: '欠货控制目标',
            barWidth: 5,
            itemStyle: {
              color: '#6993ff'
            },
            data: []
          },
          {
            type: 'bar',
            name: '后续达标日均欠货',
            barWidth: 5,
            barGap: '150%',
            itemStyle: {
              color: '#ffcc00'
            },
            data: []
          }
        ]
      },
      lessDesc: {
        row1: [], // 当期日均
        row2: [], // 同期日均
        row3: [] // 同比
      }
    }
  },
  watch: {
    'query.durationType': {
      handler () {
        this.getData1()
      }
    },
    'query.showType': {
      handler () {
        this.getData1(true)
      }
    }
  },
  created () {
    this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
  },
  methods: {
    getOptions (opt) {
      return deepmerge(this.basicOptions, opt)
    },
    // 欠货趋势
    getData1 (useCache) {
      const map = {
        '1': 'shrt_spl_trend_1',
        '2': 'shrt_spl_trend_3',
        '3': 'shrt_spl_trend_12'
      }
      const promise = useCache
          ? Promise.resolve(this.currentData1)
          : this.$axios.post(`/api/admin/data/kpi_report/${map[this.query.durationType]}/get`)

      promise.then((res) => {
        this.currentData1 = { data: res.data }
        const data = res.data.sort((a, b) => {
          return moment(a.TDATE) - moment(b.TDATE)
        }).map(_ => {
          return {
            date: moment(_.TDATE).format('YYYY-MM-DD'),
            a1: _['商品欠货销'],
            a0: _['同期商品欠货销'],
            b1: _['商品欠货采'],
            b0: _['同期商品欠货采'],
            c1: _['日均商品采'],
            c0: _['同期日均商品采'],
            d1: _['订单金额销'],
            d0: _['同期订单金额销']
          }
        })
        const showType = this.query.showType
        const map = {
          '1': ['a0', 'a1'],
          '2': ['b0', 'b1'],
          '3': ['c0', 'c1'],
          '4': ['d0', 'd1']
        }
        const map2 = {
          '1': '商品欠货(销)',
          '2': '商品欠货(采)',
          '3': '日均商品(采)',
          '4': '订单金额(销)'
        }
        let xAxisData = data.map(_ => _.date)
        let ret0 = data.map(_ => (_[map[showType][0]] / 10000).toFixed(2))
        let ret1 = data.map(_ => (_[map[showType][1]] / 10000).toFixed(2))
        this.options1.series = [
          {
            type: 'line',
            name: '上年',
            symbol: 'none',
            smooth: true,
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
            data: [],
            itemStyle: {
              color: '#cce0e9'
            },
          },
          {
            type: 'line',
            name: '本年',
            symbol: 'none',
            smooth: true,
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
            itemStyle: {
              color: '#2680eb'
            }
          }
        ]
        this.options1.xAxis.data = xAxisData
        this.options1.series[0].name = `上年${map2[showType]}`
        this.options1.series[1].name = `本年${map2[showType]}`
        this.options1.series[0].data = ret0
        this.options1.series[1].data = ret1
      })
    },

    // 项目组欠货商品金额
    getData2 () {
      this.$axios.post('/api/admin/data/kpi_report/shrt_spl_tm_d/get').then(res => {
        const data = res.data.sort((a, b) => b['当月日均欠货'] - a['当月日均欠货'])
        if (!data.length) {
          this.options4.isEmpty = true
        } else {
          this.options4.isEmpty = false
          this.options4.yAxis.data = data.map(_ => _['项目组'])
          this.options4.series[0].data = data.map(_ => {
            const val = _['当月日均欠货'].toFixed(0)
            return {
              value: val,
              label: {
                show: true,
                fontSize: 10,
                position: val >= 0 ? 'right' : 'left',
                formatter: (params) => {
                  return formatNumber(params.value, 10000, 1) + '万'
                }
              }
            }
          })
          this.options4.series[1].data = data.map(_ => {
            const val = _['欠货控制目标'].toFixed(0)
            return {
              value: val,
              label: {
                show: true,
                fontSize: 10,
                position: val >= 0 ? 'right' : 'left',
                formatter: (params) => {
                  return formatNumber(params.value, 10000, 1) + '万'
                }
              }
            }
          })
          this.options4.series[2].data = data.map(_ => {
            const val = _['后续达标日均欠货'].toFixed(0)
            return {
              value: val,
              label: {
                show: true,
                fontSize: 10,
                position: val >= 0 ? 'right' : 'left',
                formatter: (params) => {
                  return formatNumber(params.value, 10000, 1) + '万'
                }
              }
            }
          })
        }
      })
    },

    // 订单金额分布 (供应商责任&非供应商责任)
    getData3 () {
      this.$axios.post('/api/admin/data/kpi_report/shrt_spl_resp_d/get').then(res => {
        const data = res.data[0] || {}
        // 订单
        const a1 = data['供应商责任订单金额']
        const a2 = data['非供应商责任订单金额']
        // 商品
        const b1 = data['供应商责任商品金额']
        const b2 = data['非供应商责任商品金额']

        if (a1 === null || a1 === undefined || a2 === null || a2 === undefined) {
          this.options2.isEmpty = true
        } else {
          this.options2.series[0].data = [{ value: a1.toFixed(0), name: '供应商责任' }, {
            value: a2.toFixed(0),
            name: '非供应商责任'
          }]
        }

        if (b1 === null || b1 === undefined || b2 === null || b2 === undefined) {
          this.options3.isEmpty = true
        } else {
          this.options3.series[0].data = [{ value: b1.toFixed(0), name: '供应商责任' }, {
            value: b2.toFixed(0),
            name: '非供应商责任'
          }]
        }
      })
    },

    // 日均欠货
    getData4 () {
      this.$axios.post('/api/admin/data/kpi_report/shrt_spl_pers_day/get').then(res => {
        const data = res.data[0]
        this.lessDesc.row1 = [
            numGroupSep(data['当期日均欠货数量'].toFixed(0)),
            numGroupSep(data['目标'].toFixed(0)),
            numGroupSep(data['当期日均欠货商品采'].toFixed(0)),
            numGroupSep(data['当期日均欠货商品销'].toFixed(0)),
            numGroupSep(data['当期日均欠货订单销'].toFixed(0))
        ]
        this.lessDesc.row2 = [
            numGroupSep(data['同期日均欠货数量'].toFixed(0)),
            '/',
            numGroupSep(data['同期日均欠货商品采'].toFixed(0)),
            numGroupSep(data['同期日均欠货商品销'].toFixed(0)),
            numGroupSep(data['同期日均欠货订单销'].toFixed(0))
        ]
        this.lessDesc.row3 = [
          (data['欠货数量同比'] * 100).toFixed(2) + '%',
            '/',
          (data['欠货商品采同比'] * 100).toFixed(2) + '%',
          (data['欠货商品销同比'] * 100).toFixed(2) + '%',
          (data['欠货订单销同比'] * 100).toFixed(2) + '%',
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-xs-radio {
  text-align: left;

  /deep/ .ant-radio-wrapper {
    font-size: 12px;
  }
}

.table {
  thead td {
    background: #f5f7ff;
    color: #808492;
  }

  tbody {
    tr:nth-child(2n+1) {
      //background: #f5faff;
    }
  }

  td {
    line-height: 2;
    text-align: center;
    color: #808492;
    border: 1px solid #e7e9f0;
  }
}

.h400 {
  height: calc((1px * var(--height) - 50px));
}

.h180 {
  height: calc((1px * var(--height) - 100px) / 2);
}

.h190 {
  height: calc(1px * var(--height) - 315px);
}
</style>
