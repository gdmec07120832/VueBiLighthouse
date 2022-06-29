<!--物流发运-->
<template>
  <div>
    <div class="my10">
      <span class="chart-sub-title">物流发运</span>
    </div>
    <div class="flex flex-between mt10" style="align-items: flex-start">
      <div style="width: 50%; padding-right: 25px">
        <div class="flex-start flex">
          <div style="width: 20%; font-size: 24px; font-weight: bold">
            <div style="font-size: 14px; color: #999">干线准时率</div>
            <div>{{ transformPercent(mLineData.a, 0) }}</div>
          </div>
          <div class="flex flex-around" style="flex-flow: column; width: 20%">
            <div class="flex flex-start" style="width: 100%">
              <span class="text-gary">同比：</span>
              <span :class="[mLineData.b >=0 ? 'text-red' : 'text-green']">{{ transformPercent(mLineData.b, 2) }}</span>
            </div>
            <div class="flex flex-start" style="width: 100%">
              <span class="text-gary">环比：</span>
              <span
                  :class="[mLineData.c >= 0 ? 'text-red' : 'text-green']">{{ transformPercent(mLineData.c, 2) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 50%; padding-left: 25px">
        <div class="flex-start flex">
          <div style="width: 20%; font-size: 24px; font-weight: bold">
            <div style="font-size: 14px; color: #999">支装准时率</div>
            <div>{{ transformPercent(instData.a, 0) }}</div>
          </div>
          <div class="flex flex-around" style="flex-flow: column; width: 20%">
            <div class="flex flex-start" style="width: 100%">
              <span class="text-gary">同比：</span>
              <span :class="[instData.b >= 0 ? 'text-red' : 'text-green']">{{ transformPercent(instData.b, 2) }}</span>
            </div>
            <div class="flex flex-start" style="width: 100%">
              <span class="text-gary">环比：</span>
              <span :class="[instData.c >=0 ? 'text-red' : 'text-green']">{{ transformPercent(instData.c, 2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-between mt20" style="align-items: flex-start">
      <div style="width: 50%; padding-right: 25px">
        <div>
          <span class="chart-sub-title">干线准时率月趋势</span>
          <span class="text-xs" style="color: #808492">（备注：清空即为全选，是否经销商订单可自行查找）</span></div>
        <div style="width: 80%" class="flex-between flex">
          <a-checkbox-group v-model="query.isDealer" class="checkbox mt5" style="width: 80%">
            <a-checkbox value="否" style="width: 40%">否</a-checkbox>
            <a-checkbox value="是" style="width: 40%">是</a-checkbox>
          </a-checkbox-group>
          <a v-if="query.isDealer.length!==0" @click="query.isDealer=[]" class="text-xs" style="color: #46BCA0">清空</a>
        </div>
        <div style="margin-top: 10px" class="h250">
          <v-chart ref="chart1" :options="chartOptions1" autoresize></v-chart>
        </div>
      </div>
      <div style="width: 50%; padding-left: 25px">
        <div>
          <span class="chart-sub-title">支装准时率月趋势</span>
          <span class="text-xs" style="color: #808492"> (备注：清空即为全选，支装类型可自行查找)</span></div>
        <div style="width: 80%" class="flex flex-between">
          <a-checkbox-group v-model="query.instType" class="checkbox mt5" style="width: 80%">
            <a-checkbox value="经销林氏三包" style="width: 30%">经销林氏三包</a-checkbox>
            <a-checkbox value="经销自营三包" style="width: 30%">经销自营三包</a-checkbox>
            <a-checkbox value="林氏自营" style="width: 30%">林氏自营</a-checkbox>
          </a-checkbox-group>
          <a v-if="query.instType.length!==0" @click="query.instType=[]" class="text-xs" style="color: #46BCA0">清空</a>
        </div>
        <div style="margin-top: 10px" class="h250">
          <v-chart ref="chart2" :options="chartOptions2" autoresize></v-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import deepmerge from 'deepmerge'

const transformPercent = (num, digital) => {return typeof num === 'number' ? (num * 100).toFixed(digital) + '%' : '--'}
export default {
  name: 'LogisticsShipping',
  data () {
    return {
      basicOptions: {
        color: ['#cce0e9', '#ff7f0e', '#2680eb', '#1bc5bd'],
        legend: {
          selectedMode: false,
          icon: 'line',
          itemWidth: 12,
          itemHeight: 12,
          top: 10
        },
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(150,150,150,0.03)'
            },
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params.reverse().map(_ => `<br>${_.marker}${_.seriesName}: ${_.value}%`).join('')
            return `${name}${lines}`
          }
        },
        grid: {
          top: 40,
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
            color: '#999'
          },
          data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月']
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            formatter: '{value}%',
            color: '#999'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        },
      },
      chartOptions1: {
        color: ['#cce0e9', '#ff7f0e', '#2680eb', '#1bc5bd'],
        legend: {
          selectedMode: false,
          icon: 'rect',
          top: 10,
          right: 0,
          itemWidth: 16,
          itemHeight: 2,
        },
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params.reverse().map(_ => `<br>${_.marker}${_.seriesName}: ${_.value}%`).join('')
            return `${name}${lines}`
          }
        },
        grid: {
          top: 40,
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
            color: '#999'
          },
          data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月']
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            formatter: '{value}%',
            color: '#999'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          },
          min: val => val.min <= 10 ? 0 : Math.round((val.min - 10 ) * 100) / 100,
          max: 100,
        },
        series: []
      },
      chartOptions2: {
        color: ['#cce0e9', '#ff7f0e', '#2680eb', '#1bc5bd'],
        legend: {
          selectedMode: false,
          icon: 'rect',
          top: 10,
          right: 0,
          itemWidth: 16,
          itemHeight: 2,
        },
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params.reverse().map(_ => `<br>${_.marker}${_.seriesName}: ${_.value}%`).join('')
            return `${name}${lines}`
          }
        },
        grid: {
          top: 40,
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
            color: '#999'
          },
          data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月']
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          max: 100,
          min: (val) => {
            return Math.round((val.min - 10) * 100) / 100
          },
          axisLabel: {
            show: true,
            formatter: '{value}%',
            color: '#999'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#eee'
            }
          }
        },
        series: []
      },
      mLineData: {},
      mLineTrendAllData: [],
      instData: {},
      instTrendAllData: [],
      query: {
        isDealer: [],
        instType: []
      }
    }
  },
  watch: {
    'query.isDealer': {
      handler () {
        this.getData3()
      }
    },
    'query.instType': {
      handler () {
        this.getData4()
      }
    },
  },
  mounted () {
    this.getData1()
    this.getData2()
    // this.getData3()
    // this.getData4()
  },
  methods: {
    deepmerge,
    transformPercent,
    transArrToMap (arr) {
      let result = {}
      arr.forEach(item => {
        const year = item['TMONTH_WID'].slice(0, 4)
        if (!result[year]) {
          result[year] = [item]
        } else {
          result[year].push(item)
        }
      })
      return result
    },
    // 干线准时率
    getData1 () {
      this.$axios.post('/api/admin/data/kpi_report/mline_ontime_rate/get').then(res => {
        const data = res.data
        this.mLineTrendAllData = this.transArrToMap(data)
        this.parseData3({}, this.mLineTrendAllData)
        let ret = data.find(item => {
          return moment(item['TMONTH']).format('YYYY-MM') === moment().format('YYYY-MM')
        })
        ret = ret || {}
        this.mLineData = {
          a: ret['TM_ONTIME_RATE'],
          b: ret['YOY_ONTIME_RATE'],
          c: ret['MOM_ONTIME_RATE']
        }
      })
    },
    // 支装准时率
    getData2 () {
      this.$axios.post('/api/admin/data/kpi_report/inst_ontime/get').then(res => {
        const data = res.data
        this.instTrendAllData = this.transArrToMap(data)
        this.parseData4({}, this.instTrendAllData)
        let ret = data.find(item => {
          return moment(item['TMONTH']).format('YYYY-MM') === moment().format('YYYY-MM')
        })
        ret = ret || {}
        this.instData = {
          a: ret['TM_ONTIME_RATE'],
          b: ret['YOY_ONTIME_RATE'],
          c: ret['MOM_ONTIME_RATE']
        }
      })
    },
    // 干线准时率月趋势
    getData3 () {
      this.$axios.post('/api/admin/data/kpi_report/mline_ontime_rate_is_agency/get').then(res => {
        const data = res.data
        const result = this.transArrToMap(data)
        this.parseData3(result, this.mLineTrendAllData)
      })
    },
    parseData3 (a, b) {
      const selected = this.query.isDealer
      const isAll = !selected.length || selected.length === 2
      let data
      if (isAll) {
        data = b
      } else {
        data = {}
        Object.keys(a).forEach(key => {
          data[key] = a[key].filter(item => {
            return selected.indexOf(item['IS_AGENCY']) > -1
          })
        })
      }
      const series = []
      Object.keys(data).sort((a, b) => a - b).forEach((key) => {
        series.push({
          name: key,
          type: 'line',
          smooth: true,
          data: data[key].sort((a, b) => a['TMONTH_WID'] - b['TMONTH_WID']).map(_ => {
            return (_[isAll ? 'TM_ONTIME_RATE' : 'ONTIME_RATE'] * 100).toFixed(2)
          })
        })
      })
      setTimeout(() => {
        this.chartOptions1.series = series
      }, 0)
    },

    // 支装准时率趋势
    getData4 () {
      this.$axios.post('/api/admin/data/kpi_report/inst_type_ontime/get').then(res => {
        const data = res.data
        const result = this.transArrToMap(data)
        this.parseData4(result, this.instTrendAllData)
      })
    },
    parseData4 (a, b) {
      const selected = this.query.instType
      const isAll = !selected.length || selected.length === 3
      let data
      if (isAll) {
        data = b
      } else {
        data = {}
        Object.keys(a).forEach(key => {
          data[key] = a[key].filter(item => {
            return selected.indexOf(item['INSTALL_TYPE_NAME']) > -1
          })
        })
      }
      const series = []
      Object.keys(data).sort((a, b) => a - b).forEach((key) => {
        series.push({
          name: key,
          type: 'line',
          smooth: true,
          data: data[key].sort((a, b) => a['TMONTH_WID'] - b['TMONTH_WID']).map(_ => {
            return (_[isAll ? 'TM_ONTIME_RATE' : 'ONTIME_RATE'] * 100).toFixed(2)
          })
        })
      })
      setTimeout(() => {
        this.chartOptions2.series = series
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox /deep/ .ant-checkbox-wrapper {
  font-size: 12px;
  color: #999;
}

.h250 {
  height: calc(1px * var(--height) - 185px);
}
</style>
