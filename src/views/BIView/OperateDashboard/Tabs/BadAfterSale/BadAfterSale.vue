<template>
  <div>
    <div class="my10">
      <span class="chart-sub-title">售后不良</span>
    </div>
    <div class="flex-start flex">
      <div class="text-xs-radio">
        <a-radio-group v-model="query.type">
          <a-radio v-for="item in typeOptions" :value="item[1]" :key="item[1]">{{ item[0] }}</a-radio>
        </a-radio-group>
      </div>
    </div>
    <div class="flex flex-start">
      <div class="type-items" v-for="item in typeOptions" :key="item[0]">
        <div style="font-weight: bold; font-size: 18px; line-height: 40px">{{ transPercent(thisMonthData[item[1]]) }}</div>
        <div class="text-xs">
          <div>
            <span style="margin-right: 10%" class="text-gary">同比</span>
            <span :class="[thisMonthData[item[2]] < 0 ? 'text-red' : 'text-green']">{{transPercent(thisMonthData[item[2]])}}</span>
          </div>
          <div class="mt5">
            <span style="margin-right: 10%" class="text-gary">环比</span>
            <span :class="[thisMonthData[item[3]] < 0 ? 'text-red' : 'text-green']">{{transPercent(thisMonthData[item[3]])}}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 30px;position: relative" class="h300">
      <div style="position: absolute; left: 0; top: 0">
        <span class="chart-sub-title">趋势图</span>
      </div>
      <v-chart :options="chartOptions" autoresize></v-chart>
    </div>
  </div>
</template>

<script>
import graphic from 'echarts/lib/util/graphic'
// import {Line} from '@antv/g2plot'
import moment from 'moment'

export default {
  name: 'BadAfterSale',
  data () {
    return {
      query: {
        type: 'TM_CHECK_BAD_RATE',
      },
      typeOptions: [
        ['售后不良率', 'TM_BAD_RATE', 'YOY_BAD_RATE', 'MOM_BAD_RATE'],
        ['售后不良率(考核)', 'TM_CHECK_BAD_RATE', 'YOY_CHECK_BAD_RATE', 'MOM_CHECK_BAD_RATE'],
        ['售后不良率(特殊)', 'TM_SPECIAL_BAD_RATE', 'YOY_CHECK_BAD_RATE', 'MOM_SPECIAL_BAD_RATE'],
        ['售后不良率(非小件)', 'TM_NON_SMALL_BAD_RATE', 'YOY_NON_SMALL_BAD_RATE', 'MOM_NON_SMALL_BAD_RATE'],
        ['售后不良率(小件)', 'TM_SMALL_BAD_RATE', 'YOY_SMALL_BAD_RATE', 'MOM_SMALL_BAD_RATE'],
        ['工厂+原材料不良率', 'TM_FPM_BAD_RATE', 'YOY_FPM_BAD_RATE', 'MOM_FPM_BAD_RATE'],
        ['物流三包不良率', 'TM_LOGISTIC_BAD_RATE', 'YOY_LOGISTIC_BAD_RATE', 'MOM_LOGISTIC_BAD_RATE'],
        ['工厂不良率', 'TM_FACTORY_BAD_RATE', 'YOY_FACTORY_BAD_RATE', 'MOM_FACTORY_BAD_RATE'],
        ['原材料不良率', 'TM_MATERIAL_BAD_RATE', 'YOY_MATERIAL_BAD_RATE', 'MOM_MATERIAL_BAD_RATE'],
      ],
      chartOptions: {
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          right: 0,
          selectedMode: false
        },
        tooltip: {
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 1,
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params.reverse().map(_ => `<br>${_.marker}${_.seriesName}: ${_.value ? _.value + '%' : '--'}`).join('')
            return `${name}${lines}`
          },
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        grid: {
          top: 40,
          left: 2,
          right: 18,
          bottom: 20,
          containLabel: true
        },
        xAxis: {
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ececee'
            }
          },
          axisLabel: {
            color: '#999'
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          axisLine: {
            show: false,
            lineStyle: {
              color: '#ececee'
            }
          },
          axisLabel: {
            color: 'transparent'
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        color: ['#cce0e9', '#2680eb'],
        series: []
      },
      allData: [],
      thisMonthData: {},
    }
  },
  watch: {
    'query.type' () {
      this.parseData1()
    },
  },
  created () {
    this.getData1()
  },
  methods: {
    transPercent (num) {
      return typeof num === 'number' ? (num * 100).toFixed(2) + '%' : '--'
    },
    getData1 () {
      this.$axios.post('/api/admin/data/kpi_report/bad_rate/get').then(res => {
        const data = res.data
        this.allData = Object.freeze(data)
        // 取本月的数据
        this.thisMonthData = data.find(item => {
          return moment().format('YYYYMM') === item['TMONTH_WID']
        }) || {}
        this.parseData1()

      })
    },
    parseData1 () {
      const data = this.allData
      const maps = {}
      data.forEach(item => {
        const year = item['TMONTH_WID'].slice(0, 4)
        if (!maps[year]) {
          maps[year] = [item]
        } else {
          maps[year].push(item)
        }
      })
      const series = []
      Object.keys(maps).sort((a, b) => a - b).slice(-2).forEach((key, index, self) => {
        const len = self.length
        series.push({
          type: 'line',
          name: key,
          smooth: true,
          label: {
            show: true,
            position: 'top',
            color: index === len - 1 ? '#666' : 'transparent',
            formatter: '{c}%'
          },
          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: `${this.chartOptions.color[index]}80`
              },
              {
                offset: 1,
                color: `${this.chartOptions.color[index]}00`
              }
            ])
          },
          data: maps[key].sort((a, b) => a['TMONTH_WID'] - b['TMONTH_WID']).map(_ => {
            return (_[this.query.type] * 100).toFixed(2)
          })
        })
      })
      this.chartOptions.series = series
    }
  }
}
</script>

<style lang="scss" scoped>
.text-xs-radio {
  width: 100%;

  /deep/ .ant-radio-group {
    width: 100%;
  }

  /deep/ .ant-radio-wrapper {
    font-size: 12px;
    width: calc((100% - 72px) / 9);
  }
}

.type-items {
  width: calc((100% - 72px) / 9);
  padding-left: 20px;
  margin-right: 8px;
}

.h300 {
  height: calc(1px * var(--height) - 175px);
}
</style>
