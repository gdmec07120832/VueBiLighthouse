<template>
  <div>
    <!-- <div class="my10">
      <span class="chart-sub-title">退款-科目情况</span>
    </div> -->
    <div class="Header">
      <Title class="title" :label="'业务退款'" />
    </div>

    <div class="flex flex-start" style="padding-top: 10px;">
      <span style="color: #3f4254" class="text-xs mr20">渠道选择</span>
      <div style="flex: 1">
        <div class="text-xs-checkbox">
          <a-radio-group v-model="query.channel">
            <a-radio v-for="item in channelOptions" :value="item" :key="item">{{ item }}</a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>
    <div class="flex flex-start mt10">
      <span style="color: #3f4254" class="text-xs mr20">科目选择</span>
      <div style="flex: 1">
        <div class="text-xs-checkbox">
          <a-radio-group v-model="query.type">
            <a-radio value="1">对冲收入</a-radio>
            <a-radio value="2">冲减收入</a-radio>
            <a-radio value="3">费用类</a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>
    <div class="flex flex-between mt20">
      <div style="width: 50%; padding-right: 25px">
        <div>
          <span class="chart-sub-title">退款科目金额</span>
        </div>
        <div class="h290" style="margin-top: 40px">
          <v-chart :options="deepmerge(basicOptions, options1)" autoresize></v-chart>
        </div>
      </div>
      <div style="width: 50%; padding-left: 25px">
        <div>
          <span class="chart-sub-title">{{ query.type === '1' ? '对冲收入占销售比' : '冲减收入占发货比' }}</span>
        </div>
        <div class="h290" style="margin-top: 40px">
          <v-chart :options="deepmerge(basicOptions, options2)" autoresize></v-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isUndef, numGroupSep } from '@/utils/helper'
import Title from '../../components/Title'

const nowYear = (new Date()).getFullYear()
const colors = {
  [nowYear]: '#2680EB',
  [nowYear - 1]: '#ff7f0e',
  [nowYear - 2]: '#CCE0E9',
}
import deepmerge from 'deepmerge'

export default {
  name: 'BizRefund',
  components: {
    Title,
  },
  data () {
    return {
      channelOptions: [],
      query: {
        channel: '集团',
        type: '1',
      },
      basicOptions: {
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        grid: {
          left: 0,
          top: 50,
          right: 0,
          bottom: 10,
          containLabel: true
        },
        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
          top: 0,
          right: 15,
          selectedMode: false
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
              color: '#f9f9f9',
              type: 'dashed'
            }
          }
        },
      },
      options1: {
        tooltip: {
          formatter: params => {
            const name = params[0].name
            const lines = params.reverse()
                .map(_ => `<br>${_.marker}${_.seriesName}：${isUndef(_.value) ? '--' : numGroupSep(_.value)}`).join('')
            return `${name}${lines}`
          }
        },
        series: []
      },
      options2: {
        tooltip: {
          formatter: params => {
            const name = params[0].name
            const lines = params.reverse().map(_ => `<br>${_.marker}${_.seriesName}: ${_.value ? _.value + '%' : '--'}`).join('')
            return `${name}${lines}`
          }
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: []
      },
      allData: [],
    }
  },
  watch: {
    'query.channel' () {
      this.parseData1(this.allData)
    },
    'query.type' () {
      this.parseData1(this.allData)
    }
  },
  created () {
    this.getData1()
  },
  methods: {
    deepmerge,
    getData1 () {
      this.$axios.post('/api/admin/data/kpi_report/biz_refund/get').then(res => {
        const data = res.data
        // this.channelOptions = Array.from(new Set(data.map(_ => _['渠道']))).filter(Boolean)
        let totalMap = {}
        for (let item of data) {
          let channel = item['渠道']
          let itemTotal = item['冲减收入'] + item['对冲收入'] + item['费用类']
          if (channel) {
            if (!totalMap[channel]) {
              totalMap[channel] = itemTotal
            } else {
              totalMap[channel] += itemTotal
            }
          }
        }
        console.log(totalMap)
        this.channelOptions = Object.keys(totalMap).sort((a, b) => totalMap[b] - totalMap[a])
        this.allData = Object.freeze(data)
        this.parseData1(this.allData)
      })
    },
    parseData1 (data) {
      const channel = this.query.channel
      const filter1 = data.filter(item => {
        return item['渠道'] === channel
      })
      const result = {}
      filter1.forEach(item => {
        const year = item['YYYY']
        if (!result[year]) {
          result[year] = [item]
        } else {
          result[year].push(item)
        }
      })
      const propsMap1 = {
        '1': '对冲收入',
        '2': '冲减收入',
        '3': '费用类'
      }
      const propsMap2 = {
        '1': '对冲收入占比',
        '2': '冲减收入占比',
        '3': '费用类占比'
      }

      const series1 = []
      const series2 = []
      Object.keys(result).sort((a, b) => a - b).forEach((key) => {
        const yearData = result[key]
        series1.push({
          type: 'line',
          name: key + '年',
          smooth: true,
          itemStyle: {
            color: colors[key]
          },
          data: this.basicOptions.xAxis.data.map(month => {
            const monthData = yearData.filter(_ => _['TDATE_MM'] === month)
            if (!monthData.length) {
              return null
            } else {
              const num = monthData.reduce((acc, cur) => acc + cur[propsMap1[this.query.type]], 0)
              return num.toFixed(2)
            }
          })
        })
        series2.push({
          type: 'line',
          name: key + '年',
          smooth: true,
          itemStyle: {
            color: colors[key]
          },
          data: this.basicOptions.xAxis.data.map(month => {
            const monthData = yearData.filter(_ => _['TDATE_MM'] === month)
            if (!monthData.length) {
              return null
            } else {
              const num = monthData.reduce((acc, cur) => acc + cur[propsMap2[this.query.type]], 0)
              return (num * 100).toFixed(2)
            }
          })
        })
      })
      this.options1.series = series1
      this.options2.series = series2
    }
  }
}
</script>

<style lang="scss" scoped>
.Header{
  margin-top: 10px;
  height: 30px;
  padding-bottom: 10px;
  border-bottom: 0px solid #F0F0F0;
}
.text-xs-checkbox {
  height: 24px;
  overflow: auto;

  /deep/ .ant-radio-wrapper {
    font-size: 12px;
    color: #808492;
    width: 110px;
  }
}

.text-xs-radio {
  /deep/ .ant-radio-wrapper {
    font-size: 12px;
    color: #808492;
  }
}

.h290 {
  height: calc(1px * var(--height) - 200px);
}
</style>
