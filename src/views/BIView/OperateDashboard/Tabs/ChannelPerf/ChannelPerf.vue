<!--渠道业绩-->
<template>
  <div>
    <div class="flex flex-between" style="">
      <div style="padding: 10px 0;position: relative">
        <span class="chart-sub-title">每日业绩完成情况</span>
        <div class="text-xs flex flex-start"
             style="position: absolute; z-index: 999; width: 1000px; line-height: 20px; margin-top: 10px">
          <div style="width: 20%; margin-right: 40px">
            <div class="flex flex-start">
              <div class="text-gary mr10">日累计支付目标</div>
              <div>{{ leftView.day[0] }}</div>
            </div>
            <div class="flex-start flex">
              <div class="text-gary mr10">月累计支付目标</div>
              <div>{{ leftView.month[0] }}</div>
            </div>
          </div>
          <div style="width: 20%; margin-right: 40px">
            <div class="flex flex-start">
              <div class="text-gary mr10">日累计完成业绩</div>
              <div>{{ leftView.day[1] }}</div>
            </div>
            <div class="flex flex-start">
              <div class="text-gary mr10">月累计完成业绩</div>
              <div>{{ leftView.month[1] }}</div>
            </div>
          </div>
          <div style="width: 20%; margin-right: 40px">
            <div class="flex flex-start">
              <div class="text-gary mr10">日累计完成率</div>
              <div
                  :class="[leftView.day[0] !== '0' && leftView.day[1] !== 0 ? leftView.day[3] ? 'text-red' : 'text-green' : '']">
                {{ leftView.day[2] }}
              </div>
            </div>
            <div class="flex flex-start">
              <div class="text-gary mr10">月累计完成率</div>
              <div
                  :class="[leftView.month[0] !== '0' && leftView.month[1] !== '0' ? leftView.month[3] ? 'text-red' : 'text-green' : '']">
                {{ leftView.month[2] }}
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div class="flex flex-between text-xs">
        <div class="flex flex-between mr20 text-xs">
          <div class="nowrap" style="display: inline-block; text-overflow: ellipsis; width: 150px; overflow: hidden">
            渠道类别<span
              v-if="query.channel.length">({{ query.channel.join(';') }})</span></div>
          <a-tooltip placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
            <template slot="title">
              <div style="width: 150px">
                <a-checkbox-group v-model="query.channel">
                  <div>
                    <a-checkbox value="海外经销">
                      海外经销
                    </a-checkbox>
                  </div>
                  <div>
                    <a-checkbox value="经销">
                      经销
                    </a-checkbox>
                  </div>
                  <div>
                    <a-checkbox value="其它">
                      其它
                    </a-checkbox>
                  </div>
                  <div>
                    <a-checkbox value="线上">
                      线上
                    </a-checkbox>
                  </div>
                  <div>
                    <a-checkbox value="线下">
                      线下
                    </a-checkbox>
                  </div>
                  <div>
                    <a-checkbox value="直营">
                      直营
                    </a-checkbox>
                  </div>
                </a-checkbox-group>
              </div>
            </template>
            <div class="dropdown-icon">
              <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
            </div>
          </a-tooltip>
        </div>
        <div style="width: 200px">
          <ez-month-select v-model="query.yearMonth">
            {{ `年月(${query.yearMonth.getFullYear()}-${query.yearMonth.getMonth() + 1})` }}
            <div style="margin-left: 40px" class="dropdown-icon">
              <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
            </div>
          </ez-month-select>
        </div>
        <div>
          <div class="text-xs-checkbox">
            <a-checkbox v-model="showRightTop">目标明细(勾选可显示)</a-checkbox>
            <div v-if="showRightTop" class="rightTop-table" style="width: 300px">
              <table style="width: 100%; border-collapse: collapse">
                <thead>
                <tr>
                  <td>渠道类别</td>
                  <td>支付业绩目标</td>
                  <td>发货业绩目标</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>经销</td>
                  <td>{{ rightTopDetail.row1[0] }}</td>
                  <td>{{ rightTopDetail.row1[1] }}</td>
                </tr>
                <tr>
                  <td>线上</td>
                  <td>{{ rightTopDetail.row2[0] }}</td>
                  <td>{{ rightTopDetail.row2[1] }}</td>
                </tr>
                <tr>
                  <td>直营</td>
                  <td>{{ rightTopDetail.row3[0] }}</td>
                  <td>{{ rightTopDetail.row3[1] }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h220">
      <v-chart :options="chartOptions" autoresize></v-chart>
    </div>
    <div class="mt10 text-xs flex flex-between">
      <div class="day-item">
        <div>天</div>
        <div>支付目标</div>
        <div>日支付业绩</div>
        <div>日完成率</div>
      </div>
      <div class="day-item" v-for="item in monthDetails.slice(0, monthDetails.length > 30 ? 16 : 15)" :key="item.date">
        <div>{{ item.shortDate }}日</div>
        <div>{{ formatW(item.target) }}</div>
        <div>{{ formatW(item.pay) }}</div>
        <div :class="[item.pay && item.target ? item.complete ? 'text-red' : 'text-green' : '']">{{ item.rate }}</div>
      </div>
    </div>
    <div class="mt15 pb5 text-xs flex flex-between">
      <div class="day-item">
        <div>天</div>
        <div>支付目标</div>
        <div>日支付业绩</div>
        <div>日完成率</div>
      </div>
      <div class="day-item" v-for="item in monthDetails.slice(monthDetails.length > 30 ? 16 : 15)" :key="item.date">
        <template v-if="!item.shortDate">
          <div style="height: 30px;color: #808492">/</div>
          <div style="height: 30px;color: #808492">/</div>
          <div style="height: 30px;color: #808492">/</div>
          <div style="height: 30px;color: #808492">/</div>
        </template>
        <template v-else>
          <div>{{ item.shortDate }}日</div>
          <div>{{ formatW(item.target) }}</div>
          <div>{{ formatW(item.pay) }}</div>
          <div :class="[item.pay && item.target ? item.complete ? 'text-red' : 'text-green' : '']">{{ item.rate }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import EzMonthSelect from './components/EzMonthSelect'
import { formatNumber } from '@/utils/helper'

const formatW = (num) => {return (typeof num !== 'number') || num === 0 ? '--' : formatNumber(num, 10000, 1) + '万'}
const formatZ = (num) => {return typeof num !== 'number' ? '--' : formatNumber(num, 1, 0)}
const transPercent = (num) => {return (typeof num !== 'number') || num === 0 ? '--' : (num * 100).toFixed(2) + '%'}
export default {
  name: 'ChanelPerf',
  components: {
    EzMonthSelect
  },
  data () {
    return {
      query: {
        yearMonth: new Date(),
        channel: []
      },
      showRightTop: false,
      theDays: [],
      chartOptions: {
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            // shadowStyle: {
            //   color: 'rgba(150,150,150,0.1)'
            // },
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: params => {
            const name = params[0].name
            return `统计日期：${name}<br>支付业绩：${formatZ(Number(params[0].value))}<br>支付目标：${formatZ(Number(params[1].value))}`
          }
        },
        grid: {
          top: 60,
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
        series: []
      },
      allData: [],
      leftView: {
        month: [],
        day: []
      },
      monthDetails: Array(30).fill({}),
      rightTopDetail: {
        row1: [],
        row2: [],
        row3: []
      }
    }
  },
  watch: {
    'query.yearMonth': {
      handler () {
        this.getData1()
      },
      immediate: true
    },
    'query.channel': {
      handler () {
        this.getData1(true)
      }
    }
  },
  created () {
    this.getData1()
  },
  methods: {
    formatW,
    getData1 (useCache) {
      const promise = useCache ? Promise.resolve({ data: this.allData }) :
          this.$axios.post('/api/admin/data/kpi_report/channel_pref/get', {
            mdate: moment(this.query.yearMonth).format('YYYY-MM')
          })
      promise.then(res => {
        const allData = this.allData = Object.freeze(res.data)
        const yearMonth = moment(this.query.yearMonth).format('YYYY-MM')
        const filtered1 = allData.filter(_ => {
          return moment(_['统计日期']).format('YYYY-MM') === yearMonth
        })

        const row1_0 = filtered1.filter(_ => _['渠道类别'] === '经销').reduce((acc, cur) => {
          return acc + cur['支付目标']
        }, 0)
        const row1_1 = filtered1.filter(_ => _['渠道类别'] === '经销').reduce((acc, cur) => {
          return acc + cur['发货业绩目标']
        }, 0)
        const row2_0 = filtered1.filter(_ => _['渠道类别'] === '线上').reduce((acc, cur) => {
          return acc + cur['支付目标']
        }, 0)
        const row2_1 = filtered1.filter(_ => _['渠道类别'] === '线上').reduce((acc, cur) => {
          return acc + cur['发货业绩目标']
        }, 0)
        const row3_0 = filtered1.filter(_ => _['渠道类别'] === '直营').reduce((acc, cur) => {
          return acc + cur['支付目标']
        }, 0)
        const row3_1 = filtered1.filter(_ => _['渠道类别'] === '直营').reduce((acc, cur) => {
          return acc + cur['发货业绩目标']
        }, 0)

        this.rightTopDetail.row1 = [formatZ(row1_0), formatZ(row1_1)]
        this.rightTopDetail.row2 = [formatZ(row2_0), formatZ(row2_1)]
        this.rightTopDetail.row3 = [formatZ(row3_0), formatZ(row3_1)]

        const filtered2 = filtered1.filter(_ => {
          return this.query.channel.length ? this.query.channel.indexOf(_['渠道类别']) > -1 : true
        })

        const day_a = filtered2.reduce((acc, cur) => {
          const time = moment() - moment(cur['统计日期'])
          return acc + (time > 0 ? cur['支付目标'] : 0)
        }, 0)
        const day_b = filtered2.reduce((acc, cur) => {
          const time = moment() - moment(cur['统计日期'])
          return acc + (time > 0 ? cur['支付金额'] : 0)
        }, 0)
        const day_c = day_a === 0 ? '--' : day_b / day_a
        this.leftView.day = [formatZ(day_a), formatZ(day_b), transPercent(day_c), day_a <= day_b]

        const month_a = filtered2.reduce((acc, cur) => cur['支付目标'] + acc, 0)
        const month_b = filtered2.reduce((acc, cur) => cur['支付金额'] + acc, 0)
        const month_c = month_a === 0 ? '--' : month_b / month_a
        this.leftView.month = [formatZ(month_a), formatZ(month_b), transPercent(month_c), month_a <= month_b]

        const maps = {}
        filtered2.forEach(item => {
          const day = moment(item['统计日期']).format('YYYY-MM-DD')
          if (maps[day]) {
            maps[day].push(item)
          } else {
            maps[day] = [item]
          }
        })
        let array = []
        Object.keys(maps).forEach(key => {
          const target = maps[key].map(_ => _['支付目标']).reduce((acc, cur) => acc + cur, 0)
          const pay = maps[key].map(_ => _['支付金额']).reduce((acc, cur) => acc + cur, 0)
          const item = {
            date: key,
            shortDate: key.slice(-2),
            target,
            pay,
            complete: target <= pay,
            rate: transPercent(target === 0 ? '--' : pay / target)
          }
          array.push(item)
        })
        array = array.sort((a, b) => {
          return moment(a.date) - moment(b.date)
        })
        let monthDetails = array.slice()
        if(array.length === 31 || array.length === 29) {
          monthDetails = monthDetails.concat([{}])
        }
        if(array.length === 28) {
          monthDetails = monthDetails.concat([{}, {}])
        }
        this.monthDetails = monthDetails
        this.chartOptions.series = [
          {
            type: 'bar',
            data: [],
            barWidth: 20,
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: '#00b050'
            },
          },
          {
            type: 'line',
            symbol: 'none',
            smooth: true,
            data: [],
            itemStyle: {
              color: '#8aa8cf'
            }
          },
        ]
        this.chartOptions.xAxis.data = array.map(_ => _.date)
        this.chartOptions.series[0].data = array.map(item => {
          return {
            value: item.pay.toFixed(0),
            itemStyle: {
              color: item.pay >= item.target ? '#ff2219' : '#00b050'
            }
          }
        })
        this.chartOptions.series[1].data = array.map(item => item.target.toFixed(0))
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.day-item {
  flex: 1;
  text-align: center;
  &:first-child {
    border-left: 1px solid #e7e9f0;
    >div {
      color: #808492!important;
    }
  }
  > div {
    color: #282c33;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #e7e9f0;
    border-right: 1px solid #e7e9f0;
    &:first-child {
      border-top: 1px solid #e7e9f0;
    }
  }

  >div:first-child {
    background: #f5f7ff;
    color: #808492;
  }

  > div:nth-child(2n - 1):not(:first-child) {
    background: #fcfcff;

  }
}

.text-xs-checkbox {
  position: relative;

  /deep/ .ant-checkbox-wrapper {
    font-size: 12px;
  }

  .rightTop-table {
    position: absolute;
    top: 20px;
    right: 0;

    table {
      td {
        text-align: right;
      }

      tbody {
        tr {
          line-height: 2;

          &:nth-child(2n+2) {
            background: #f5faff;
          }
        }

        td {
          font-size: 12px;
          color: #333;
        }
      }
    }
  }
}

.h220 {
  height: calc(1px * var(--height) - 325px)
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
</style>
