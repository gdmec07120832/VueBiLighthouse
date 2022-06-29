<template>
  <div>
    <div class="my10">
      <span class="chart-sub-title">推广费用</span>
    </div>
    <div>
      <div class="flex flex-start" style="align-items: flex-start; height: 58px; overflow-y: auto">
        <div style="width: 100px; color: #3f4254" class="text-xs">店铺名称</div>
        <div class="text-xs-checkbox">
          <a-checkbox-group v-model="query.shops">
            <div v-for="item in shopNames" :key="item">
              <a-checkbox :value="item">{{ item }}</a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
      </div>
      <div class="mt10 flex flex-start" style="align-items: flex-start; height: 86px; overflow-y: auto">
        <div style="width: 100px;color: #3f4254" class="text-xs">推广工具</div>
        <div class="text-xs-checkbox" style="height: 85px">
          <a-checkbox-group v-model="query.tools">
            <div v-for="item in toolNames" :key="item">
              <a-checkbox :value="item">{{ item }}</a-checkbox>
            </div>
          </a-checkbox-group>
        </div>
      </div>
    </div>
    <div style="width: 100%; border-bottom: 1px dashed #d3d9e6; margin-bottom: 25px"></div>
    <div>
      <div class="flex flex-between" style="align-items: flex-start">
        <div style="width: 48%">
          <div class="h250" style="position: relative">
            <div style="position: absolute; left: 0; top: 0">
              <span class="chart-sub-title">店铺花费金额</span>
            </div>
            <v-chart ref="chart01" :options="deepmerge(basicOptions, chartOptions1)" autoresize></v-chart>
          </div>
        </div>
        <div style="width: 46%">
          <div class="h250" style="position: relative">
            <div style="position: absolute; left: 0; top: 0">
              <span class="chart-sub-title">花费占销售比</span>
            </div>
            <v-chart ref="chart02" :options="deepmerge(basicOptions, chartOptions2)" autoresize></v-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const nowYear = (new Date()).getFullYear()
const GlobalColors =  {
  [nowYear]: '#2680eb',
  [nowYear - 1]: '#ff7f0e',
  [nowYear - 2]: '#cce0e9'
}
// import graphic from 'echarts/lib/util/graphic'
import deepmerge from 'deepmerge'
import moment from 'moment'
export default {
  name: 'PromoteFee',
  data () {
    return {
      basicOptions: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
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
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
          right: 0
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
            color: '#999'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#f5f5f5'
            }
          }
        }
      },
      chartOptions1: {
        series: []
      },
      chartOptions2: {
        tooltip: {
          formatter: params => {
            const name = params[0].name
            const lines = params.map(_ => `<br>${_.marker}${_.seriesName}: ${_.value}%`).join('')
            return `${name}${lines}`
          }
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}.00%'
          }
        },
        series: []
      },
      shopNames: [],
      toolNames: [],
      validToolNames: [],
      query: {
        shops: [],
        tools: []
      },
      result: [],
    }
  },
  watch: {
    'query.shops': {
      handler () {
        this.getData(true)
      }
    },
    'query.tools': {
      handler() {
        this.getData(true)
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    deepmerge,
    getData (useCache = false) {
      let promise = useCache ? Promise.resolve({ data: this.result }) :
          this.$axios.post('/api/admin/data/kpi_report/promote_fee/get')
      promise.then(res => {
        const data = res.data
        this.result = data
        this.shopNames = Array.from(new Set(data.map(_ => _['店铺名称'])))

        let filtered1 = data.filter(_ => {
         return this.query.shops.length ? this.query.shops.indexOf(_['店铺名称']) > -1 : true
        })
        this.toolNames = Array.from(new Set(filtered1.map(_ => _['推广工具'])))
        let filtered2 = filtered1.filter(_ => {
          return this.query.tools.length ? this.query.tools.indexOf(_['推广工具']) > -1 : true
        })
        const dataMap = {}
        filtered2.forEach(item => {
          const key = moment(item['日期']).format('YYYY-MM')
          if(dataMap[key]) {
            dataMap[key].push(item)
          } else {
            dataMap[key] = [item]
          }
        })
        const seriesNames = Array.from(new Set(filtered2.map(_ => moment(_['日期']).format('YYYY'))))
            .sort((a, b) => a - b)
        const colors = {}
        seriesNames.forEach((year) => {
          colors[year] = GlobalColors[year]
        })
        console.log(seriesNames)
        const series = seriesNames.map((year) => {
          const data = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(month => {
            const yearMonthData = dataMap[ year + '-' + month]
            if(yearMonthData && yearMonthData.length) {
              const fee = (yearMonthData.reduce((acc, cur) => acc + cur['花费'], 0)).toFixed(2)
              // const income = (yearMonthData.reduce((acc, cur) => acc + cur['月销售业绩'], 0)).toFixed(2)
              const income = (yearMonthData[0]['月销售业绩']).toFixed(2)
              return [fee, (fee || fee === 0) ? fee / income : null]
            } else {
              return ['', '']
            }
          })
          return [{
            name: year + '年',
            type: 'line',
            itemStyle: {
              color: colors[year]
            },
            smooth: true,
            showSymbol: true,
            data: data.map(_ => _[0])
          }, {
            name: year + '年',
            type: 'line',
            itemStyle: {
              color: colors[year]
            },
            smooth: true,
            showSymbol: true,
            data: data.map(_ => (_[1]  || _[1] === 0 ) ? (_[1] * 100).toFixed(2) : '')
          }]
        })
        this.$refs['chart01'].$refs['echarts'].clear()
        this.chartOptions1.series = series.map(_ => _[0])
        this.$refs['chart02'].$refs['echarts'].clear()
        this.chartOptions2.series = series.map(_ => _[1])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-xs-checkbox {
  flex: 1;

  /deep/ .ant-checkbox-group {
    width: 100%;

    > div {
      display: inline-block;
      overflow: hidden;
      width: calc(100% / 8);
    }
  }

  /deep/ .ant-checkbox-wrapper {
    white-space: nowrap;
    overflow: hidden;
    font-size: 12px;
    color: #999;
  }
}

.h250 {
  height: calc(1px * var(--height) - 235px);
}
</style>
