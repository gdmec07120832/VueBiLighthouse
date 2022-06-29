<!--库龄滞销-->
<template>
  <div class="flex flex-between" style="align-items: flex-start">
    <div class="text-xs" style="width: 33.33%; padding-right: 30px">
      <div class="my10">
        <span class="chart-sub-title">滞销清理</span>
        <a-tooltip placement="rightBottom" overlayClassName="light-tooltip">
          <div class="text-black text-xs" slot="title">
            【1】清理数量口径：18年9月前取销量，18年9月后与60天期初数两者做对比，取最小值；<br>
            【2】金额均为采购成本价；
          </div>
          <a-icon type="question-circle" style="margin-left: 5px; color: #808492"></a-icon>
        </a-tooltip>
      </div>
      <div class="flex flex-between" style="align-items: flex-start">
        <div style="width: 30%">
          <div style="text-align: center">
            <div class="sub-title2">清理达成率</div>
          </div>
          <div class="h240" style="display: flex; flex-flow: column; justify-content: center">
            <div style="height: 120px">
            <v-chart :options="gaugeOptions1" autoresize></v-chart>
          </div>
            <div>
            <div class="flex flex-center">
              <div style="color: #999">清理金额：</div>
              <div style="line-height: 30px">{{ formatW(todayData['amt']) }}</div>
            </div>
            <div class="flex flex-center">
              <div style="color:#999;">清理目标：</div>
              <div style="line-height: 30px">{{ formatW(todayData['target']) }}</div>
            </div>
          </div>
          </div>
        </div>
        <div style="width: 30%">
          <div style="text-align: center">
            <div class="sub-title2">日累计达成率</div>
          </div>
          <div class="h240" style="display: flex; flex-flow: column; justify-content: center">
            <div style="height: 120px">
            <v-chart :options="gaugeOptions2" autoresize></v-chart>
          </div>
            <div>
            <div class="flex flex-center">
              <div style="color: #999">清理金额：</div>
              <div style="line-height: 30px">{{ formatW(todayData['amt']) }}</div>
            </div>
            <div class="flex flex-center">
              <div style="color: #999">清理目标：</div>
              <div style="line-height: 30px">{{ formatW(todayData['t_target']) }}</div>
            </div>
          </div>
          </div>
        </div>
        <div style="width: 40%">
          <div style="position: relative; text-align: center">
            <div class="sub-title2">滞销金额分布
              <a-tooltip placement="rightBottom" overlayClassName="light-tooltip">
                <div class="text-black text-xs" style="min-width: 400px" slot="title">
                  实际清理金额 = 当月清数量 x 平均采购价<br>
                  剩余清理金额 = 清理金额目标 - 实际清理金额<br>
                  （PS：滞销金额分布按是否停产来区分以上两项数据，请留意）
                </div>
                <a-icon type="question-circle"
                        style="color: #808492; position: absolute; right: 0; top: 50%; transform: translateY(-50%)"></a-icon>
              </a-tooltip>
            </div>
          </div>
          <div class="h240">
            <v-chart ref="pieChart" :options="pieOptions" autoresize></v-chart>
          </div>
        </div>
      </div>
      <div class="h150" style="position: relative">
        <div style="position: absolute; left: 0; top: 0;">
          <div class="sub-title2">滞销清理趋势</div>
        </div>
        <v-chart :options="barChartOptions0" autoresize></v-chart>
      </div>
    </div>
    <div style="width: 33.33%; padding: 0 10px">
      <div class="my10">
        <span class="chart-sub-title">360+滞销金额</span>
      </div>
      <div class="mt20">
        <div class="h150-1" style="position: relative">
          <div style="position: absolute; top: 0; left: 0" class="text-xs">
            <div class="flex flex-start">
              <div style="margin-right: 50px">
                <div style="color: #999">720+滞销库存</div>
                <div style="font-size: 20px">{{ formatW(unsalableData.u720) }}</div>
              </div>
              <div>
                <div style="color: #999">占总库占比</div>
                <div style="font-size: 20px">{{ transPercent(unsalableData.u720_rate) }}</div>
              </div>
            </div>
          </div>
          <v-chart :options="deepmerge(basicLineOpt, lineChartOptions0)" autoresize></v-chart>
        </div>
      </div>
      <div class="mt20">
        <div class="h150-1" style="position: relative">
          <div class="text-xs" style="position: absolute; top: 0; left: 0">
            <div class="flex flex-start">
              <div style="margin-right: 50px">
                <div style="color:#999;">361-720滞销库存</div>
                <div style="font-size: 20px">{{ formatW(unsalableData.u360) }}</div>
              </div>
              <div>
                <div style="color: #999">占总库占比</div>
                <div style="font-size: 20px">{{ transPercent(unsalableData.u360_rate) }}</div>
              </div>
            </div>
          </div>
          <v-chart :options="lineChartOptions1" autoresize></v-chart>
        </div>
      </div>
    </div>
    <div style="width: 33.33%; padding-left: 30px">
      <div class="my10">
        <span class="chart-sub-title">滞销考核分层</span>
      </div>
      <div class="h220" style="position: relative">
        <div style="position: absolute; left: 0; top: 0">
          <div class="sub-title2">滞销库存分层趋势</div>
        </div>
        <v-chart :options="stackOptions" autoresize></v-chart>
      </div>
      <div class="mt20">
        <div class="sub-title2 mb20">预测期末滞销库存金额</div>
        <div>
          <table style="border-collapse: collapse; width: 100%; line-height: 1.7" class="table text-xs">
            <thead>
            <tr>
              <td>库龄分层</td>
              <td>目前期末滞销金额</td>
              <td>预测期末滞销金额</td>
            </tr>
            </thead>
            <tbody>
            <tr style="font-weight: bold; color: #2680EB">
              <td>合计</td>
              <td>{{ formatZ((frcst_data[0] || {})['REM_INV_AMT']) }}</td>
              <td>{{ formatZ((frcst_data[0] || {})['FRCST_REM_INV_AMT']) }}</td>
            </tr>
            <tr>
              <td>61-90</td>
              <td>{{ formatZ((frcst_data[1] || {})['REM_INV_AMT']) }}</td>
              <td>{{ formatZ((frcst_data[1] || {})['FRCST_REM_INV_AMT']) }}</td>
            </tr>
            <tr>
              <td>91-180</td>
              <td>{{ formatZ((frcst_data[2] || {})['REM_INV_AMT']) }}</td>
              <td>{{ formatZ((frcst_data[2] || {})['FRCST_REM_INV_AMT']) }}</td>
            </tr>
            <tr>
              <td>181-360</td>
              <td>{{ formatZ((frcst_data[3] || {})['REM_INV_AMT']) }}</td>
              <td>{{ formatZ((frcst_data[3] || {})['FRCST_REM_INV_AMT']) }}</td>
            </tr>
            <tr>
              <td>361-720</td>
              <td>{{ formatZ((frcst_data[4] || {})['REM_INV_AMT']) }}</td>
              <td>{{ formatZ((frcst_data[4] || {})['FRCST_REM_INV_AMT']) }}</td>
            </tr>
            <tr>
              <td>720+</td>
              <td>{{ formatZ((frcst_data[5] || {})['REM_INV_AMT']) }}</td>
              <td>{{ formatZ((frcst_data[5] || {})['FRCST_REM_INV_AMT']) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import graphic from 'echarts/lib/util/graphic'
import moment from 'moment'
import deepmerge from 'deepmerge'
import { formatNumber } from '@/utils/helper'

export default {
  name: 'StorageUnsalable',
  data () {
    return {
      barChartOptions0: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 11,
          },
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params.map(item => {
              if (item.seriesName === '实际清理金额') {
                return `<br>实际清理金额：${formatNumber(item.value, 10000, 2) + '万'}`
              } else {
                return `<br>清理达成率：${item.value.toFixed(2) + '%'}`
              }
            }).join('')
            return `统计年月：${name}${lines}`
          }
        },
        legend: {
          data: [{ name: '清理达成率', icon: 'line', itemWidth: 16, itemHeight: 2 }, {
            name: '实际清理金额',
            itemWidth: 12,
            itemHeight: 12
          }],
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          right: 0,
          top: 10,
          textStyle: {
            color: '#808492'
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
            show: true,
            lineStyle: {
              color: '#bfc2cf'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999',
            formatter: val => {
              return val.slice(-2) + '月'
            }
          },
          data: []
        },
        yAxis: [
          {
            axisLine: {
              show: true,
              lineStyle: {
                color: '#bfc2cf'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#bfc2cf',
              formatter: val => {
                return formatNumber(val, 10000, 0) + '万'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: ['#d3d9e6']
              }
            }
          },
          {
            axisLine: {
              show: false,
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
        ],
        series: []
      },
      basicLineOpt: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 1
          },
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        legend: {
          icon: 'rect',
          itemHeight: 12,
          itemWidth: 12,
          top: 20,
          right: 0,
          textStyle: {
            color: '#999'
          }
        },
        grid: {
          top: 60,
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
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        }
      },
      lineChartOptions0: {
        tooltip: {
          formatter: params => {
            const name = params[0].name
            const lines = params.reverse().map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${formatNumber(_.value, 10000, 1) + '万'}`
            }).join('')
            return `${name} 剩余库存货值${lines}`
          }
        },
        color: ['#cce0e9', '#2680eb'],
        series: []
      },
      lineChartOptions1: {
        legend: {
          icon: 'rect',
          right: 0,
          top: 20,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: '#999'
          }
        },
        grid: {
          top: 60,
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
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 1
          },
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: params => {
            const name = params[0].name
            const lines = params.reverse().map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${formatNumber(_.value, 10000, 1) + '万'}`
            }).join('')
            return `${name} 剩余库存货值${lines}`
          }
        },
        color: ['#cce0e9', '#2680eb'],
        series: []
      },
      stackOptions: {
        tooltip: {
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          trigger: 'item',
          formatter: params => {
            return `统计年月: ${params.name}<br>库龄分层：${params.seriesName}<br>两库剩余金额：${formatNumber(params.value, 1, 0)}`
          },
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
          top: 2,
          textStyle: {
            color: '#999'
          }
        },
        grid: {
          top: 30,
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          boundaryGap: ['1%', '-10%'],
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false,
          },
          data: []
        },
        yAxis: [{
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            color: '#808492',
            formatter: val => {
              return val.slice(-2) + '月'
            }
          },
          data: [],
          splitLine: {
            show: false
          }
        },
          {
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
          }
        ],
        color: ['#2680eb', '#20adf5', '#fdd969', '#fe9c2f'],
        series: []
      },
      gaugeOptions1: {
        title: {
          text: '--%',
          textStyle: {
            fontSize: 16,
            color: '#2680eb'
          },
          left: 'center',
          top: 'center'
        },
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        angleAxis: {
          max: 100,
          clockwise: true, // 逆时针
          // 隐藏刻度线
          show: false
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,

          },
          axisTick: {
            show: false
          },
        },
        polar: {
          center: ['50%', '50%'],
          radius: '140%' //图形大小
        },
        series: []
      },
      gaugeOptions2: {
        title: {
          text: '--%',
          textStyle: {
            fontSize: 16,
            color: '#2680eb'
          },
          left: 'center',
          top: 'center'
        },
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        angleAxis: {
          max: 100,
          clockwise: true, // 逆时针
          // 隐藏刻度线
          show: false
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,

          },
          axisTick: {
            show: false
          },
        },
        polar: {
          center: ['50%', '50%'],
          radius: '140%' //图形大小
        },
        series: []
      },
      pieOptions: {
        isEmpty: false,
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: '#808492',
            fontSize: 12,
          },
          top: '72%',
          selectedMode: false,

        },
        hoverAnimation: false,
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          trigger: 'item',
          formatter: params => {
            console.log(params)
            return `是否停产：${params.data.type}<br>${params.name}：${formatNumber(params.value, 10000) + '万'}`
          },
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        grid: {
          top: 10,
          bottom: 10,
          left: 0,
          right: 0
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '40%'],
            radius: ['35%', '55%'],
            label: {
              formatter: params => {
                return formatNumber(params.value, 10000, 0) + '万'
              },
              fontSize: 11,
              color: '#666'
            },
            labelLine: {
              show: false,
              length: 0,
              length2: 10
            },
            data: []
          }
        ]
      },
      orderMaps: {
        '61-90': 0,
        '91-180': 1,
        '181-360': 2,
        '361-720': 3,
        '720+': 4
      },
      unsalableData: {
        u360: '',
        u360_rate: '',
        u720: '',
        u720_rate: ''
      },
      todayData: {
        amt: '',
        target: '',
        t_target: '',
        rate: '',
        t_rate: ''
      },
      frcst_data: [],
    }
  },
  created () {
    this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
    this.getData5()
    this.getData6()
  },
  mounted () {
    this.getData7()
  },
  methods: {
    deepmerge,
    formatZ (num) {
      return typeof num === 'number' ? formatNumber(num, 1, 0) : '--'
    },
    formatW (num) {
      return typeof num === 'number' ? formatNumber(num, 10000, 1) + '万' : '--'
    },
    transPercent (num) {
      return typeof num === 'number' ? Math.ceil(num * 10000) / 100 + '%' : '--'
    },
    transArrToMap (arr, key) {
      let ret = {}
      arr.forEach(item => {
        const _key = item[key]
        if (!ret[_key]) {
          ret[_key] = [item]
        } else {
          ret[_key].push(item)
        }
      })
      return ret
    },
    // 361-720滞销金额
    getData1 () {
      this.$axios.post('/api/admin/data/kpi_report/reminv_cost_360/get').then(res => {
        const data = res.data
        this.unsalableData.u360 = data[0]['剩余库存货值']
        this.unsalableData.u360_rate = data[0]['占比']
        const yearMap = this.transArrToMap(data, 'YYYY')
        const series = []
        Object.keys(yearMap).sort((a, b) => a - b).forEach((key, index) => {
          series.push({
            name: key,
            type: 'line',
            smooth: true,
            showSymbol: true,
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: `${this.lineChartOptions0.color[index]}80`
                },
                {
                  offset: 1,
                  color: `${this.lineChartOptions0.color[index]}00`
                }
              ])
            },
            data: yearMap[key].sort((a, b) => a['MM'] - b['MM']).map(_ => _['剩余库存货值'].toFixed(2))
          })
        })
        this.lineChartOptions1.series = series
      })
    },
    // 720+ 滞销金额
    getData2 () {
      this.$axios.post('/api/admin/data/kpi_report/reminv_cost_720/get').then(res => {
        const data = res.data
        this.unsalableData.u720 = data[0]['剩余库存货值']
        this.unsalableData.u720_rate = data[0]['占比']
        const yearMap = this.transArrToMap(data, 'YYYY')
        const series = []
        Object.keys(yearMap).sort((a, b) => a - b).forEach((key, index) => {
          series.push({
            name: key,
            type: 'line',
            smooth: true,
            showSymbol: true,
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: `${this.lineChartOptions0.color[index]}80`
                },
                {
                  offset: 1,
                  color: `${this.lineChartOptions0.color[index]}00`
                }
              ])
            },
            data: yearMap[key].sort((a, b) => a['MM'] - b['MM']).map(_ => _['剩余库存货值'].toFixed(2))
          })
        })
        setTimeout(() => {
          this.lineChartOptions0.series = series
        }, 50)
      })
    },
    // 预测期末滞销库存
    getData3 () {
      this.$axios.post('/api/admin/data/kpi_report/frcst_reminv/get').then(res => {
        const data = res.data
        const orderData = data.sort((a, b) => {
          return this.orderMaps[a['INV_AGE_LEVEL']] - this.orderMaps[b['INV_AGE_LEVEL']]
        })
        let t_frcst = 0, t = 0
        orderData.forEach(item => {
          t += item['REM_INV_AMT']
          t_frcst += item['FRCST_REM_INV_AMT']
        })
        this.frcst_data = [{
          REM_INV_AMT: t,
          FRCST_REM_INV_AMT: t_frcst
        }].concat(orderData)
      })
    },
    //滞销清理趋势
    getData4 () {
      this.$axios.post('/api/admin/data/kpi_report/clean_amt_trend/get').then(res => {
        const data = res.data.sort((a, b) => {
          return moment(a['MDATE']) - moment(b['MDATE'])
        })
        const a = data.map(_ => {
          return _['清理金额']
        })
        const b = data.map(_ => {
          return _['清理达成率'] * 100
        })
        const c = data.map(_ => {
          return moment(_['MDATE']).format('YYYY-MM')
        })
        this.barChartOptions0.xAxis.data = c
        setTimeout(() => {
          this.barChartOptions0.series = [
            {
              type: 'bar',
              name: '实际清理金额',
              z: 10,
              barWidth: 25,
              itemStyle: {
                barBorderRadius: [12, 12, 0, 0],
                color: '#2680eb'
              },
              data: a
            },
            {
              type: 'line',
              name: '清理达成率',
              yAxisIndex: 1,
              itemStyle: {
                color: '#ff7f0e'
              },
              showSymbol: false,
              data: b
            },
          ]
        }, 0)
      })
    },
    // 滞销考核分层
    getData5 () {
      this.$axios.post('/api/admin/data/kpi_report/reminv_cost_level/get').then(res => {
        const data = res.data
        const levelMap = this.transArrToMap(data, '库存分层')
        const monthMap = this.transArrToMap(data, 'MDATE')
        const yAxisData = Array.from(new Set(data.map(_ => moment(_['MDATE']).format('YYYY-MM'))))
        this.stackOptions.yAxis[0].data = yAxisData
        const series = []
        Object.keys(levelMap).sort((a, b) => {
          return this.orderMaps[a] - this.orderMaps[b]
        }).forEach(key => {
          series.push({
            type: 'bar',
            name: key,
            stack: true,
            barWidth: 15,
            data: levelMap[key].sort((a, b) => moment(a['MDATE']) - moment(b['MDATE'])).map(item => {
              return item['剩余库存货值'].toFixed(0)
            })
          })
        })
        const monthTotal = Object.keys(monthMap).sort((a, b) => moment(a['MDATE']) - moment(b['MDATE'])).map(month => {
          const data = monthMap[month]
          const total = data.reduce((acc, cur) => {
            return acc + cur['剩余库存货值']
          }, 0)
          return total
        })

        const maxValue = Math.max(...monthTotal)

        const bgValues = monthTotal.map(() => {
          return maxValue / 0.95
        })

        series.push({
          type: 'bar',
          tooltip: {
            show: false
          },
          name: '',
          stack: false,
          z: 0,
          barWidth: 15,
          itemStyle: {
            color: '#ebedf3',
          },
          emphasis: {
            itemStyle: {
              color: '#ebedf3'
            }
          },
          barGap: '-100%',
          data: bgValues
        })
        this.stackOptions.yAxis[1].data = monthTotal.reverse().map(val => {
          return formatNumber(val, 100000000, 2) + '亿'
        })
        this.stackOptions.series = series
      })
    },

    // 当日清理数据
    getData6 () {
      this.$axios.post('/api/admin/data/kpi_report/clean_amt_m/get').then(res => {
        const data = res.data[0]
        this.todayData = {
          amt: data['清理金额'],
          target: data['清理目标'],
          t_target: data['累计清理目标'],
          rate: data['清理达成率'] || 0,
          t_rate: data['累计达成率'] || 0
        }

        this.gaugeOptions1.title.text = `${(this.todayData.rate * 100).toFixed(2)}%`
        this.gaugeOptions1.series = [
          {
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: '#eee',
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 7,
            itemStyle: {
              color: '#2680eb'
            },
            data: [{ name: '', value: Number((this.todayData.rate * 100).toFixed(2)) }]
          }
        ]

        this.gaugeOptions2.title.text = `${(this.todayData.t_rate * 100).toFixed(2)}%`
        this.gaugeOptions2.series = [
          {
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: '#eee',
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 7,
            itemStyle: {
              color: '#2680eb'
            },
            data: [{ name: '', value: Number((this.todayData.t_rate * 100).toFixed(2)) }]
          }
        ]
      })
    },

    // 滞销金额分布
    getData7 () {
      this.$axios.post('/api/admin/data/kpi_report/clean_amt_distrib/get').then(res => {
        const data = res.data
        if (!data.length) {
          this.pieOptions.isEmpty = true
          return
        }
        const series = []
        data.forEach(item => {
          series.push({
            order: 1,
            name: '剩余清理金额',
            type: item['是否停产'],
            value: item['剩余清理金额'],
            itemStyle: {
              color: '#ffcc00',
            }
          })
          series.push({
            order: 2,
            name: '实际清理金额',
            type: item['是否停产'],
            value: item['清理金额'],
            itemStyle: {
              color: '#2680eb'
            }
          })
        })
        this.pieOptions.series[0].data = series.sort((a, b) => a.order - b.order)

        setTimeout(() => {
          this.$refs['pieChart'].$refs['echarts'].dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: 1
          })
          this.$refs['pieChart'].$refs['echarts'].dispatchAction({
            type: 'highlight',
            seriesIndex: 0,
            dataIndex: 3
          })
        }, 100)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  thead tr {
    background: #f5f7ff;
  }

  tbody {
    font-family: Consolas, Monaco, monospace;
  }

  td {
    padding: 0 10px;
    text-align: right;
    border: 1px solid #e7e9f0;
    line-height: 2;

    &:first-child {
      text-align: left;
    }
  }
}

.sub-title2 {
  position: relative;
  font-size: 16px;
}

.h150 {
  height: calc((1px * var(--height) - 80px) / 2);
}

.h150-1 {
  height: calc((1px * var(--height) - 80px) / 2);
}

.h220 {
  height: calc((1px * var(--height) - 60px) / 2);
}

.h240 {
  height: calc((1px * var(--height)) / 2 - 30px);
}
</style>
