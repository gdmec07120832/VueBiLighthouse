<!--客满评价-->
<template>
  <div>
    <div class="flex flex-between my10">
<!--      <div class="my10" style="">-->
<!--        <span class="chart-sub-title">评价分析-当月</span>-->
<!--      </div>-->
      <Title :label="'客满评价'" :jump="true" :jumpTarget="['BI_PC_2019_00111', 'BI_PC_2019_00114']"/>
      <div class="text-xs mr10">
        <a-tooltip overlayClassName="light-tooltip" placement="rightBottom">
          <ez-month-select v-model="query.yearMonth">
            {{ `年月(${query.yearMonth.getFullYear()}-${query.yearMonth.getMonth() + 1})` }}
            <div style="margin-left: 10px" class="dropdown-icon">
              <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
            </div>
          </ez-month-select>
        </a-tooltip>
      </div>
    </div>
    <div class="flex-between flex" style="align-items: flex-start">
      <div style="width: 60%;" class="r_pr40">
        <div class="flex flex-start" style="align-items: flex-start">
          <div style="width: 40%">
            <div class="flex flex-between">
              <div>
                <div class="sub-title2">全渠道评价情况</div>
              </div>
              <div class="text-xs-radio" style="text-align: right">
                <a-radio-group v-model="query.option0" button-style="solid" size="small">
                  <a-radio-button value="1">数量</a-radio-button>
                  <a-radio-button value="2">占比</a-radio-button>
                </a-radio-group>
              </div>
            </div>
            <div class="mt10 h120">
              <table v-if="query.option0 === '1'" class="table text-xs" style="border-collapse: collapse;width: 100%">
                <thead>
                <tr>
                  <td>分类</td>
                  <td>数量</td>
                  <td>同比</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>好评</td>
                  <td>{{ totalCounts['本月好评数'] }}</td>
                  <td :class="[totalCounts['本月好评数'] > totalCounts['同期好评数'] ? 'text-red' : 'text-green']">
                    {{ computeYoY(totalCounts['同期好评数'], totalCounts['本月好评数']) }}
                  </td>
                </tr>
                <tr>
                  <td>中评</td>
                  <td>{{ totalCounts['本月中评数'] }}</td>
                  <td :class="[totalCounts['本月中评数'] < totalCounts['同期中评数'] ? 'text-red' : 'text-green']">
                    {{ computeYoY(totalCounts['同期中评数'], totalCounts['本月中评数']) }}
                  </td>
                </tr>
                <tr>
                  <td>差评</td>
                  <td>{{ totalCounts['本月差评数'] }}</td>
                  <td :class="[totalCounts['本月差评数'] < totalCounts['同期差评数'] ? 'text-red' : 'text-green']">
                    {{ computeYoY(totalCounts['同期差评数'], totalCounts['本月差评数']) }}
                  </td>
                </tr>
                <tr>
                  <td>个人差评</td>
                  <td>{{ totalCounts['本月个人差评数'] }}</td>
                  <td :class="[totalCounts['本月个人差评数'] < totalCounts['同期个人差评数'] ? 'text-red' : 'text-green']">
                    {{ computeYoY(totalCounts['同期个人差评数'], totalCounts['本月个人差评数']) }}
                  </td>
                </tr>
                <tr>
                  <td>总评价</td>
                  <td>{{ totalCounts['本月总评价数'] }}</td>
                  <td :class="[totalCounts['本月总评价数'] > totalCounts['同期总评价数'] ? 'text-red' : 'text-green']">
                    {{ computeYoY(totalCounts['同期总评价数'], totalCounts['本月总评价数']) }}
                  </td>
                </tr>
                <tr>
                  <td>成交商品</td>
                  <td>{{ totalCounts['本月成交数'] }}</td>
                  <td :class="[totalCounts['本月总评价数']] > totalCounts['同期总评价数'] ? 'text-red' : 'text-green'">
                    {{ computeYoY(totalCounts['同期成交数'], totalCounts['本月成交数']) }}
                  </td>
                </tr>
                </tbody>
              </table>
              <table v-if="query.option0 === '2'" class="table text-xs"
                     style="line-height: 2.5;border-collapse: collapse; width: 100%">
                <thead>
                <tr>
                  <td>分类</td>
                  <td>占比</td>
                  <td>同比</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>好评</td>
                  <td>{{ computeRate(totalCounts['本月好评数'], totalCounts['本月总评价数']) }}</td>
                  <td :class="[
                       computeYoYRate([totalCounts['同期好评数'], totalCounts['同期总评价数']],
                          [totalCounts['本月好评数'], totalCounts['本月总评价数']]
                      ).startsWith('-') ? 'text-green' : 'text-red'
                  ]">{{
                      computeYoYRate([totalCounts['同期好评数'], totalCounts['同期总评价数']],
                          [totalCounts['本月好评数'], totalCounts['本月总评价数']]
                      )
                    }}
                  </td>
                </tr>
                <tr>
                  <td>中评</td>
                  <td>{{ computeRate(totalCounts['本月中评数'], totalCounts['本月总评价数']) }}</td>
                  <td :class="[
                     computeYoYRate([totalCounts['同期中评数'], totalCounts['同期总评价数']],
                          [totalCounts['本月中评数'], totalCounts['本月总评价数']]
                      ).startsWith('-') ? 'text-red' : 'text-green'
                  ]">
                    {{
                      computeYoYRate([totalCounts['同期中评数'], totalCounts['同期总评价数']],
                          [totalCounts['本月中评数'], totalCounts['本月总评价数']]
                      )
                    }}
                  </td>
                </tr>
                <tr>
                  <td>差评</td>
                  <td>{{ computeRate(totalCounts['本月差评数'], totalCounts['本月总评价数']) }}</td>
                  <td :class="[
                       computeYoYRate([totalCounts['同期差评数'], totalCounts['同期总评价数']],
                          [totalCounts['本月差评数'], totalCounts['本月总评价数']]
                      ).startsWith('-') ? 'text-red' : 'text-green'
                  ]">
                    {{
                      computeYoYRate([totalCounts['同期差评数'], totalCounts['同期总评价数']],
                          [totalCounts['本月差评数'], totalCounts['本月总评价数']]
                      )
                    }}
                  </td>
                </tr>
                <tr>
                  <td>评价率</td>
                  <td>{{ computeRate(totalCounts['本月总评价数'], totalCounts['本月成交数']) }}</td>
                  <td :class="[
                       computeYoYRate([totalCounts['同期总评价数'], totalCounts['同期成交数']],
                          [totalCounts['本月总评价数'], totalCounts['本月成交数']]
                      ).startsWith('-') ? 'text-green' : 'text-red'
                  ]">
                    {{
                      computeYoYRate([totalCounts['同期总评价数'], totalCounts['同期成交数']],
                          [totalCounts['本月总评价数'], totalCounts['本月成交数']]
                      )
                    }}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div style="width: 60%; padding-left: 20px">
            <div class="mb10">
              <div class="sub-title2">渠道数量占比</div>
            </div>
            <div class="text-xs-radio" style="text-align: right">
              <a-radio-group v-model="query.option1" style="display: flex;justify-content: flex-end">
                <a-radio value="1">好评</a-radio>
                <a-radio value="2">中评</a-radio>
                <a-radio value="3">差评</a-radio>
                <a-radio value="4">评价率</a-radio>
              </a-radio-group>
            </div>
            <div class="h180">
              <v-chart :options="pieOptions" autoresize></v-chart>
            </div>
          </div>
        </div>
        <div class="mt10">
          <div class="mb15">
            <div class="sub-title2">全渠道评价情况走势</div>
          </div>
          <div class="text-xs-radio align flex flex-start">
            <span style="color: #3f4254; flex: 0 0 24px" class="text-xs mr10">渠道</span>
            <a-radio-group v-model="query.option2" style="width: calc(100% - 100px)">
              <a-radio :value="item" :key="item" v-for="item in channelOptions">{{ item }}</a-radio>
            </a-radio-group>
          </div>
          <div class="text-xs-radio align flex flex-start mt5">
            <span style="color: #3f4254;flex: 0 0 24px;" class="text-xs mr10">选项</span>
            <a-radio-group v-model="query.option3" style="width: calc(100% - 100px)">
              <a-radio value="好评率">好评率</a-radio>
              <a-radio value="中评率">中评率</a-radio>
              <a-radio value="差评率">差评率</a-radio>
              <a-radio value="评价率">评价率</a-radio>
              <a-radio value="好评">好评</a-radio>
              <a-radio value="中评">中评</a-radio>
              <a-radio value="差评">差评</a-radio>
              <a-radio value="个人差评">个人差评</a-radio>
              <a-radio value="总评价数">总评价数</a-radio>
            </a-radio-group>
          </div>
          <div class="h130">
            <v-chart :options="barOptions" autoresize></v-chart>
          </div>
        </div>
      </div>
      <div style="width: 40%">
        <div class="flex flex-start">
          <div class="h150" style="width: 50%; padding: 0 15px">
            <stat-table-data title="线上平台" :counts="channel_a"></stat-table-data>
          </div>
          <div class="h150" style="width: 50%; padding: 0 15px">
            <stat-table-data title="线上外包" :counts="channel_b"></stat-table-data>
          </div>
        </div>
        <div class="flex flex-start mt20">
          <div class="h150" style="width: 50%; padding: 0 15px">
            <stat-table-data title="线下直营" :counts="channel_c"></stat-table-data>
          </div>
          <div class="h150" style="width: 50%; padding: 0 15px">
            <stat-table-data title="线下经销" :counts="channel_d"></stat-table-data>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import uniq from 'lodash/uniq'
import EzMonthSelect from '../../components/EzMonthSelect'
import StatTableData from './statTableData'
import Title from '../../components/Title_H2'
import echartsColor from '../../utils/echartsColor.js'

export default {
  name: 'CSEvaluation',
  components: { StatTableData, EzMonthSelect, Title },
  data () {
    return {
      channelOptions: [],
      query: {
        yearMonth: new Date(),
        option0: '1',
        option1: '1',
        option2: '', // 全渠道评价走势 渠道
        option3: '好评', // 全渠道评价走势 选项
      },
      pieOptions: {
        color: ['#2680eb', '#27bacb', '#f7da53', '#ee856d', '#fe9c2f', '#a486fa', '#02a7f0', '#598af7'],
        legend: {
          icon: 'circle',
          left: '28%',
          itemWidth: 8,
          itemHeight: 8,
          top: 'center',
          textStyle: {
            rich: {
              rate: {
                width: 70,
                fontSize: 14,
                padding: [0, 0, 6, 0]
              },
              name: {
                lineHeight: 15,
                color: '#808492'
              }
            }
          },
          formatter: (name) => {
            const data = this.pieOptions.series[0].data
            const total = data.reduce((acc, cur) => {
              return acc + cur.value
            }, 0)
            for (let item of data) {
              if (item.name === name) {
                if (this.query.option1 === '4') {
                  // 评价率
                  return (
                      `{rate| ${item.value}%}\n{name| ${name}}`
                  )
                }
                return (
                    `{rate| ${this.computeRate(item.value, total)}}\n{name| ${name}}`
                )
              }
            }
            return name
          }
        },
        grid: {
          left: 0,
          bottom: 0,
          right: 0,
          top: 0,
          containLabel: true
        },
        tooltip: {
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: (params) => {
            const a = { '1': '好评数', '2': '中评数', '3': '差评数', '4': '评价率' }
            return params['name'] + a[this.query.option1] + '：' + params.value + (this.query.option1 === '4' ? '%' : '')
          }
        },
        series: [
          {
            type: 'pie',
            // hoverAnimation: false,
            roseType: 'radius',
            center: ['13%', '50%'],
            radius: ['30%', '65%'],
            labelLine: {
              smooth: 0,
              show: false
            },
            label: {
              show: false,
              formatter: '{d}%',
              color: '#000',
              fontSize: 10
            },
            data: []
          }
        ]
      },
      barOptions: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 1,
            lineStyle: {
              color: '#f9f9f9'
            }
          },
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: params => {
            const name = params[0].name
            const hasPercent = this.query.option3.indexOf('率') > -1
            const lines = params.map(_ => `<br>${_.seriesName}: ${hasPercent ? _.value + '%' : _.value}`).join('')
            return `统计年月：${name}${lines}`
          }
        },
        grid: {
          top: 15,
          bottom: 0,
          left: 0,
          right: 0,
          containLabel: true,
        },
        xAxis: {
          axisLabel: {
            color: echartsColor.axisLabel,
            interval: 0,
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          data: []
        },
        yAxis: {
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: []
      },
      allData: [],
      totalCounts: {},
      channel_a: {}, //线上平台
      channel_b: {}, //线上外包
      channel_c: {}, // 线下直营
      channel_d: {}, // 线下经销

    }
  },
  watch: {
    'query.yearMonth': {
      handler () {
        this.parseData1(this.allData)
        this.parseData2(this.allData)
        this.parseData3(this.allData)
      }
    },
    'query.option1': {
      handler () {
        this.parseData2(this.allData)
      }
    },
    'query.option2': {
      handler () {
        this.parseData4(this.allData)
      }
    },
    'query.option3': {
      handler () {
        this.parseData4(this.allData)
      }
    },
  },
  created () {
    this.getData1()
  },
  methods: {
    computeYoY (last, now) {
      if (!now || !last) {
        return '--'
      } else {
        return (((now - last) / last) * 100).toFixed(2) + '%'
      }
    },
    computeYoYRate ([a1, a2], [b1, b2]) {
      if (!a1 || !a2 || !b1 || !b2) {
        return '--'
      } else {
        return ((((b1 / b2) - (a1 / a2)) / (a1 / a2)) * 100).toFixed(2) + '%'
      }
    },
    computeRate (a, b) {
      if (!a || !b) {
        return '--'
      } else {
        return ((a / b) * 100).toFixed(2) + '%'
      }
    },
    getData1 () {
      this.$axios.post('/api/admin/data/kpi_report/cus_sati_eval/get').then(res => {
        this.allData = res.data
        this.channelOptions = uniq(res.data.map(item => item['分渠道'])).filter(Boolean)
        this.query.option2 = this.channelOptions[0]
        this.parseData1(this.allData)
        this.parseData2(this.allData)
        this.parseData3(this.allData)
        this.parseData4(this.allData)

      })
    },
    parseData1 (allData) {
      const data = allData.filter(item => {
            return moment(item['MDATE']).format('YYYY-MM') === moment(this.query.yearMonth).format('YYYY-MM')
          })

      ;['本月好评数', '本月中评数', '本月差评数', '本月个人差评数', '本月总评价数', '本月成交数',
        '同期好评数', '同期中评数', '同期差评数', '同期个人差评数', '同期总评价数', '同期成交数'].forEach(key => {
        const t = data.reduce((acc, cur) => {
          return acc + (cur[key] || 0)
        }, 0)
        this.$set(this.totalCounts, key, t)
      })
      console.log(data, this.totalCounts)
    },

    // 处理成饼状图需要的数据格式
    parseData2 (allData) {
      const propsMap = {
        '1': '本月好评数',
        '2': '本月中评数',
        '3': '本月差评数',
        '4': '本月评价率'
      }
      const selectMonthData = allData.filter(item => {
        return moment(item['MDATE']).format('YYYY-MM') === moment(this.query.yearMonth).format('YYYY-MM')
      })

      const seriesData = selectMonthData.map((item) => {
        return {
          value: this.query.option1 === '4' ? (item[propsMap[this.query.option1]] * 100).toFixed(2)
              : item[propsMap[this.query.option1]],
          name: item['分渠道']
        }
      })
      this.pieOptions.series[0].data = seriesData.sort((a, b) => b.value - a.value)
    },

    // 分渠道统计数据
    parseData3 (allData) {
      const selectMonthData = allData.filter(item => {
        return moment(item['MDATE']).format('YYYY-MM') === moment(this.query.yearMonth).format('YYYY-MM')
      })
      const channelMapResult = {}
      selectMonthData.forEach(item => {
        const channel = item['分渠道']
        channelMapResult[channel] = item
      })
      this.channel_a = channelMapResult['线上平台']
      this.channel_b = channelMapResult['线上外包']
      this.channel_c = channelMapResult['线下直营']
      this.channel_d = channelMapResult['线下经销']
      console.log(channelMapResult)
    },

    // 处理成柱状图需要的数据格式
    parseData4 (allData) {
      // 数据与选择的月份无关
      // 只展示近13个月的数据
      const yearMonth = moment().subtract(12, 'month').format('YYYYMM')
      const selectedChannelData = allData.filter(item => {
        return item['分渠道'] === this.query.option2 && (moment(item['MDATE']).format('YYYYMM') >= yearMonth)
      }).map(item => {
        return {
          ...item,
          '好评率': !item['本月总评价数'] ? null : item['本月好评数'] / item['本月总评价数'],
          '中评率': !item['本月总评价数'] ? null : item['本月中评数'] / item['本月总评价数'],
          '差评率': !item['本月总评价数'] ? null : item['本月差评数'] / item['本月总评价数'],
          '评价率': !item['本月成交数'] ? null : item['本月总评价数'] / item['本月成交数'],
          '好评': item['本月好评数'],
          '中评': item['本月中评数'],
          '差评': item['本月差评数'],
          '个人差评': item['本月个人差评数'],
          '总评价数': item['本月总评价数'],
          '同期好评率': !item['同期总评价数'] ? null : item['同期好评数'] / item['同期总评价数'],
          '同期中评率': !item['同期总评价数'] ? null : item['同期中评数'] / item['同期总评价数'],
          '同期差评率': !item['同期总评价数'] ? null : item['同期差评数'] / item['同期总评价数'],
          '同期评价率': !item['同期成交数'] ? null : item['同期总评价数'] / item['同期成交数'],
          '同期好评': item['同期好评数'],
          '同期中评': item['同期中评数'],
          '同期差评': item['同期差评数'],
          '同期个人差评': item['同期个人差评数'],
          '同期总评价数': item['同期总评价数'],
          yearMonth: moment(item['MDATE']).format('YYYYMM')
        }
      }).sort((a, b) => a.yearMonth - b.yearMonth)
      console.log(selectedChannelData)
      this.barOptions.xAxis.data = selectedChannelData.map(item => {
        return item['yearMonth'].slice(2, 4) + '-' + item['yearMonth'].slice(4)
      })
      this.barOptions.series = [
        {
          type: 'bar',
          barWidth: 15,
          itemStyle: {
            barBorderRadius: [7, 7, 0, 0],
            color: echartsColor.thisYear
          },
          label: {
            show: true,
            color: '#666',
            position: 'top',
            fontSize: 10,
            formatter: '{c}%'
          },
          data: []
        },
        {
          type: 'line',
          smooth: true,
          symbol: 'none',
          z: 1,
          itemStyle: {
            color: echartsColor.previousYear
          },
          areaStyle: {
              opacity: 0.2,
          },
          data: []
        },
      ]
      this.barOptions.series[0].name = this.query.option3
      this.barOptions.series[1].name = '同期' + this.query.option3
      const hasPercent = this.query.option3.indexOf('率') > -1
      this.barOptions.series[0].data = selectedChannelData.map(item => {
        return hasPercent ? (item[this.query.option3] * 100).toFixed(1) : item[this.query.option3]
      })
      this.barOptions.series[0].label.formatter = hasPercent ? '{c}%' : '{c}'
      this.barOptions.series[1].data = selectedChannelData.map(item => {
        return hasPercent ? (item['同期' + this.query.option3] * 100).toFixed(1)
            : item['同期' + this.query.option3]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-xs-radio {
  /deep/ .ant-radio-group {
    flex: 1;
    display: flex;
    flex-wrap: nowrap;

    .ant-radio-wrapper {
      font-size: 12px;
    }
  }

  &.align {
    /deep/ .ant-radio-wrapper {
      width: calc((100% - 80px) / 10);
    }
  }
}

.table {
  line-height: calc(0.0476px * var(--height));

  td {
    white-space: nowrap;
    border: 1px solid #e7e9f0;
    overflow: hidden;
    text-align: center;
    padding: 0 10px;
  }
  tr{
      td:nth-child(1){
          text-align: left;
      }
      td:nth-child(2), td:nth-child(3){
          text-align: right;
      }
  }
  thead td {
    background: #f5f7ff;
  }

  tbody tr:nth-child(2n+1) {
    //background: #f1f9fd;
  }
}

.h120 {
  height: calc(0.37px * var(--height));
}

.h130 {
  height: calc(0.63px * var(--height) - 180px);
}

.h150 {
  height: calc((1px * var(--height) - 80px) / 2);
}

.h180 {
  height: calc(0.135px * var(--height) + 100px);
}

.sub-title2 {
  position: relative;
  font-size: 16px;
}


.dropdown-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #fff;
  box-shadow: rgba(10, 30, 51, 0.2) 0 0 5px 0;
  border-radius: 4px;

  &:hover {
    cursor: pointer;

    i {
      opacity: .5;
    }
  }
}

.r_pr40 {
  padding-right: 40px;
  @media (max-width: 1440px) {
    padding-right: 0;
  }
}
</style>
