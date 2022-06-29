<template>
  <div>
    <div class="flex flex-between mt10">
<!--      <div class="my10">-->
<!--        <span class="chart-sub-title">DSR分析</span>-->
<!--      </div>-->
      <Title :label="'DSR分析'" :jump="true" :jumpTarget="['BI_PC_2019_00308', 'BI_PC_2019_00324']"/>
      <div>
        <div class="text-xs-radio">
          <span class="mr20">店铺选项：</span>
          <a-radio-group v-model="query.shop">
            <a-radio v-for="item in shops" :key="item" :value="item">{{ item }}</a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>
    <div class="flex flex-between mt10" style="align-items: flex-start">
      <div style="width: 33.3%; padding: 0 20px">
        <div>
          <div class="text-gary" style="color: #999">描述相符</div>
          <div class="text-xl" style="line-height: 40px; height: 40px;">{{ descData['DESCRIBE'] }}</div>
        </div>
        <div class="flex flex-between text-xs" style="flex-wrap: wrap; line-height: 2; width: 80%">
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">与同行业相比：</span>
            <span :class="[descData['DESCRIBE_PEER'] > 0 ? 'text-red' : 'text-green']">{{
                transPercent(descData['DESCRIBE_PEER'])
              }}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">对比昨日增幅：</span>
            <span
                :class="[descData['LAST_DESCRIBE_PEER'] > 0 ? 'text-red' : 'text-green']">{{
                transPercent(descData['LAST_DESCRIBE_PEER'])
              }}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">店铺目标值：</span>
            <span>{{ descData['DESCRIBE_SCORE'] }}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">距离目标值：</span>
            <span>{{ transPercent(descData['DESCRIBE_DESCRIBE']) }}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">还需5分评价：</span>
            <span>{{ descData['DESCRIBE_NEED'] }}</span>
          </div>
        </div>
        <div style="margin-top: 25px" class="h230">
          <v-chart :options="getOptions(options1)" autoresize></v-chart>
        </div>
      </div>
      <div style="width: 33.3%; padding: 0 20px">
        <div>
          <div class="text-gary" style="color: #999">服务态度</div>
          <div class="text-xl" style="line-height: 40px; height: 40px;">{{ descData['SERVICE'] }}</div>
        </div>
        <div class="flex flex-between text-xs" style="flex-wrap: wrap; line-height: 2; width: 80%">
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">与同行业相比：</span>
            <span
                :class="[descData['SERVICE_PEER'] > 0 ? 'text-red' : 'text-green']">{{
                transPercent(descData['SERVICE_PEER'])
              }}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">对比昨日增幅：</span>
            <span
                :class="[descData['LAST_SERVICE_PEER'] > 0 ? 'text-red' : 'text-green']">
              {{ transPercent(descData['LAST_SERVICE_PEER']) }}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">店铺目标值：</span>
            <span>{{ descData['SERVICE_SCORE'] }}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">距离目标值：</span>
            <span>{{ transPercent(descData['SERVICE_DESCRIBE']) }}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">还需5分评价：</span>
            <span>{{ descData['SERVICE_NEED'] }}</span>
          </div>
        </div>
        <div style="margin-top: 25px" class="h230">
          <v-chart :options="getOptions(options2)" autoresize></v-chart>
        </div>
      </div>
      <div style="width: 33.3%; padding: 0 20px">
        <div>
          <div class="text-gary" style="color: #999">物流服务</div>
          <div class="text-xl" style="line-height: 40px;height: 40px;">{{ descData['LOGISTICS'] }}</div>
        </div>
        <div class="flex flex-between text-xs" style="flex-wrap: wrap; line-height: 2; width: 80%">
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">与同行业相比：</span>
            <span
                :class="[descData['LOGISTICS_PEER'] > 0 ? 'text-red' : 'text-green']">
              {{ transPercent(descData['LOGISTICS_PEER']) }}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">对比昨日增幅：</span>
            <span
                :class="[descData['LAST_LOGISTICS_PEER'] > 0 ? 'text-red' : 'text-green']">
              {{ transPercent(descData['LAST_LOGISTICS_PEER']) }}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">店铺目标值：</span>
            <span>{{descData['LOGISTICS_SCORE']}}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">距离目标值：</span>
            <span>{{transPercent(descData['LOGISTICS_DESCRIBE'])}}</span>
          </div>
          <div style="width: 40%" class="flex flex-between">
            <span class="text-gary">还需5分评价：</span>
            <span>{{descData['LOGISTICS_NEED']}}</span>
          </div>
        </div>
        <div style="margin-top: 25px" class="h230">
          <v-chart :options="getOptions(options3)" autoresize></v-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import deepmerge from 'deepmerge'
import moment from 'moment'
import Title from '../../components/Title_H2'
// const months = Array(6).fill(null).map((_, index) => {
//   return moment().subtract(index, 'month').format('YYYY-MM')
// }).reverse()

export default {
  components: { Title },
  name: 'DSRAnalysis',
  data () {
    return {
      query: {
        shop: '',
      },
      shops: [],
      basicOptions: {
        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
          selectedMode: false,
          top: 10,
          right: 10
        },
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
            const lines = params.map(item => {
              let v = item.value
              if(item.seriesName.indexOf('相比') > -1) {
                v += '%'
              }
              return `<br>${item.marker}${item.seriesName}：${v}`
            }).join('')
            return `统计年月：${name}${lines}`
          }
        },
        title: {
          textStyle: {
            fontSize: 12
          }
        },
        grid: {
          top: 50,
          left: 0,
          right: 0,
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
          data: []
        },
        yAxis: [
          {
            min: val => val.min - 0.005,
            max: val => val.max + 0.005,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          {
            min: val => val.min - 10,
            max: val => val.max + 10,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ]
      },
      options1: {
        // 空系列才有折线绘制动画效果 see issue: echarts #7707
        series: []
      },
      options2: {
        series: []
      },
      options3: {
        series: []
      },
      trendData: [],
      descDataAll: [],
      descData: {},
    }
  },
  watch: {
    shops: {
      handler (val) {
        this.query.shop = val[0] || ''
      }
    },
    'query.shop' () {
      // this.getData2(true)
      this.parseData1()
    },
    descDataAll () {
      this.parseData1()
    },
  },
  created () {
    this.getData1()
    this.getData2()
  },
  methods: {
    transPercent (num) {
      return typeof num === 'number' ? isNaN(num) ? '--' : (num * 100).toFixed(2) + '%' : '--'
    },
    getOptions (opt) {
      return deepmerge(this.basicOptions, opt)
    },
    // 指标
    getData1 () {
      this.$axios.post('/api/admin/data/kpi_report/dsr_set_overview/get').then(res => {
        const data = res.data
        this.descDataAll = data
      })
    },
    parseData1 () {
      const cur = this.descDataAll.find(_ => {
        return _['STORE_NAME'] === this.query.shop
      })
      this.descData = cur || {}
    },
    getData2 (useCache = false) {
      const promise = useCache ? Promise.resolve(this.trendData) :
          this.$axios.post('/api/admin/data/kpi_report/dsr_set_trend/get')
      promise.then(res => {
        this.trendData = { data: res.data }
        const data = res.data.filter(_ => {
          return _['店铺'].indexOf('林氏') > -1
        })
        if (!useCache) {
          this.shops = Array.from(new Set(data.map(_ => _['店铺']))).sort((a, b) => b.length - a.length)
          this.query.shop = this.shops[0]
        }
        const curData = data.filter(_ => {
          return _['店铺'] === this.query.shop
        }).sort((a, b) => {
          return moment(a['月份']) - moment(b['月份'])
        })
        this.basicOptions.xAxis.data = curData.map(_ => {
          return moment(_['月份']).format('YYYY-MM')
        })
        this.options1.series =  [{
          type: 'line',
          name: '描述相符评分',
          smooth: true,
          symbol: 'none',
          symbolSize: 8,
          itemStyle: {
            color: '#2680eb'
          },
          data: []
        },
            {
              type: 'line',
              name: '描述相符_同行相比',
              yAxisIndex: 1,
              symbol: 'none',
              symbolSize: 8,
              smooth: true,
              itemStyle: {
                color: '#ff7f0e'
              },
              data: []
            }
        ]
        this.options2.series = [
          {
            type: 'line',
            name: '服务态度评分',
            symbol: 'none',
            smooth: true,
            symbolSize: 8,
            itemStyle: {
              color: '#2680eb'
            },
            data: []
          },
          {
            type: 'line',
            name: '服务态度_同行相比',
            yAxisIndex: 1,
            symbol: 'none',
            symbolSize: 8,
            smooth: true,
            itemStyle: {
              color: '#ff7f0e'
            },
            data: []
          }
        ]
        this.options3.series = [
          {
            type: 'line',
            name: '物流服务评分',
            smooth: true,
            symbol: 'none',
            symbolSize: 8,
            itemStyle: {
              color: '#2680eb'
            },
            data: []
          },
          {
            type: 'line',
            name: '物流服务_同行相比',
            yAxisIndex: 1,
            smooth: true,
            symbol: 'none',
            symbolSize: 8,
            itemStyle: {
              color: '#ff7f0e'
            },
            data: []
          }
        ]
        this.options1.series[0].data = curData.map(_ => (_['描述相符']))
        this.options1.series[1].data = curData.map(_ => ((_['描述相符_同行相比']) * 100).toFixed(2))
        this.options2.series[0].data = curData.map(_ => (_['服务态度']))
        this.options2.series[1].data = curData.map(_ => ((_['服务态度_同行相比']) * 100).toFixed(2))
        this.options3.series[0].data = curData.map(_ => (_['物流服务']))
        this.options3.series[1].data = curData.map(_ => ((_['物流服务_同行相比']) * 100).toFixed(2))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-xs-radio {
  font-size: 12px;
  color: #999;

  /deep/ .ant-radio-wrapper {
    font-size: 12px;
    color: #999;
  }
}

.h230 {
  height: calc((1px * var(--height)) - 240px);
}
</style>
