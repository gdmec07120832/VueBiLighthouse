<template>
  <div>
    <div>
      <div class="my10">
        <span class="chart-sub-title">库存周转</span>
      </div>

    </div>
    <div class="mb20 text-gary text-xs">
      当月：年化周转率(金额)=累计发出/(期初含压货+期末含压货)/2*当年总天数/当前天数；历史：年化周转率(金额)=累计发出/((期初含压货+期末含压货)/2)*12/当前月份。
    </div>
    <div class="flex flex-between mt10" style="align-items: flex-start">
      <div style="width: 33.3%; margin-right: 30px">
        <div>
          <span class="chart-sub-title">全司</span>
        </div>
        <div class="text-xl" style="line-height: 40px">{{ (totalData['全司周转率'] || 0).toFixed(2) || '--' }}</div>
        <div class="">
          <div class="flex flex-start">
            <div class="text-gary text-xs">同比：</div>
            <div class="text-xs" :class="[totalData['全司同期周转率'] > 0 ? 'text-red' : 'text-green']"
                 style="line-height: 24px">
              {{ (totalData['全司同期周转率'] * 100).toFixed(2) + '%' }}
            </div>
          </div>
          <div class="flex flex-start">
            <div class="text-gary text-xs">环比：</div>
            <div class="text-xs" :class="[totalData['全司环期周转率'] > 0 ? 'text-red' : 'text-green']"
                 style="line-height: 24px">
              {{ (totalData['全司环期周转率'] * 100).toFixed(2) + '%' }}
            </div>
          </div>
        </div>
        <div class="h250">
          <v-chart :options="getOptions(options1)" autoresize></v-chart>
        </div>
      </div>
      <div style="width: 33.3%; margin-right: 30px">
        <div>
          <span class="chart-sub-title">佛山仓+青岛仓+成都仓+供应仓</span>
        </div>
        <div class="text-xl" style="line-height: 40px">{{ (totalData['成品仓周转率'] || 0).toFixed(2) || '--' }}</div>
        <div class="">
          <div class="flex flex-start">
            <div class="text-gary text-xs">同比：</div>
            <div class="text-xs" :class="[totalData['成品仓同期周转率'] > 0 ? 'text-red' : 'text-green']"
                 style="line-height: 24px">
              {{ (totalData['成品仓同期周转率'] * 100).toFixed(2) + '%' }}
            </div>
          </div>
          <div class="flex flex-start">
            <div class="text-gary text-xs">环比：</div>
            <div class="text-xs" :class="[totalData['成品仓环期周转率'] > 0 ? 'text-red' : 'text-green']"
                 style="line-height: 24px">
              {{ (totalData['成品仓环期周转率'] * 100).toFixed(2) + '%' }}
            </div>
          </div>
        </div>
        <div class="h250">
          <v-chart :options="getOptions(options2)" autoresize></v-chart>
        </div>
      </div>
      <div style="width: 33.3%">
        <div>
          <span class="chart-sub-title">小商品成品仓</span>
        </div>
        <div class="text-xl" style="line-height: 40px">{{ (totalData['小商品周转率'] || 0).toFixed(2) || '--' }}</div>
        <div class="">
          <div class="flex flex-start">
            <div class="text-gary text-xs">同比：</div>
            <div class="text-xs" :class="[totalData['小商品同期周转率'] > 0 ? 'text-red' : 'text-green']"
                 style="line-height: 24px">
              {{ (totalData['小商品同期周转率'] * 100).toFixed(2) + '%' }}
            </div>
          </div>
          <div class="flex-start flex">
            <div class="text-gary text-xs">环比：</div>
            <div class="text-xs" :class="[totalData['小商品环期周转率'] > 0 ? 'text-red' : 'text-green']"
                 style="line-height: 24px">
              {{ (totalData['小商品环期周转率'] * 100).toFixed(2) + '%' }}
            </div>
          </div>
        </div>
        <div class="h250">
          <v-chart :options="getOptions(options3)" autoresize></v-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import deepmerge from 'deepmerge'

export default {
  name: 'InventoryTurnover',
  data () {
    return {
      basicOptions: {
        color: ['#cce0e9', '#ff7f0e', '#2680eb'],
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: params => {
            const name = params[0].name
            const lines = params.reverse().map(item => `<br>${item.marker}${item.seriesName}：${item.value}`).join('')
            return `${name}${lines}`
          }
        },
        legend: {
          icon: 'rect',
          right: 10,
          itemWidth: 12,
          itemHeight: 12,
          selectedMode: false,
        },
        grid: {
          top: 50,
          right: 10,
          bottom: 10,
          left: 10,
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
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
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
        },
      },
      options1: {
        series: []
      },
      options2: {
        series: []
      },
      options3: {
        series: []
      },
      totalData: {},
    }
  },
  created () {
    this.getData1()
  },
  methods: {
    getOptions (opt) {
      return deepmerge(this.basicOptions, opt)
    },
    getData1 () {
      this.$axios.post('/api/admin/data/kpi_report/trnvr_inv/get').then(res => {
        const data = res.data
        this.totalData = data[0] || {}
        // const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        const result = {}
        for (let item of data) {
          const year = item['YYYY']
          const month = item['MM']
          const monthIndex = Number(month) - 1
          if (!result[year]) {
            result[year] = []
          }
          result[year][monthIndex] = item
        }
        const series1 = []
        const series2 = []
        const series3 = []
        Object.keys(result).forEach(year => {
          series1.push({
            type: 'line',
            name: year + '年',
            smooth: true,
            data: result[year].map(item => item['全司周转率'].toFixed(2))
          })
          series2.push({
            type: 'line',
            name: year + '年',
            smooth: true,
            data: result[year].map(item => item['成品仓周转率'].toFixed(2))
          })
          series3.push({
            type: 'line',
            name: year + '年',
            smooth: true,
            data: result[year].map(item => item['小商品周转率'].toFixed(2))
          })
        })

        this.options1.series = series1
        this.options2.series = series2
        this.options3.series = series3
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.h250 {
  margin-top: 40px;
  height: calc(1px * var(--height) - 245px);
}
</style>
