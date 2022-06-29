<!--竞店分析-->
<template>
  <div>
    <div class="Header">
      <Title class="title" :label="'竞店分析'" />
    </div>
    
    <div v-show="false" class="flex flex-between" style="line-height: 30px">
      <div>
        指标参数
        <span class="text-xs text-gary">注：各竞店业绩渠道为ALL</span>
      </div>
      <div class="text-xs flex">
        <div class="nowrap" style="display: inline-block; text-overflow: ellipsis; width: 150px; overflow: hidden">
          指标类型：<span v-if="query.dataIndex">{{ query.dataIndex }}</span>
        </div>
        <a-tooltip placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
          <template slot="title">
            <div style="width: 150px" class="text-xs-radio">
              <a-radio-group v-model="query.dataIndex">
                <div v-for="item in dataIndexOptions" :key="item">
                  <a-radio :value="item">{{ item }}</a-radio>
                </div>
              </a-radio-group>
            </div>
          </template>
          <a-icon type="double-right" style="color: #079909; transform: rotate(90deg); cursor: pointer" />
        </a-tooltip>
      </div>
    </div>
    <div class="flex flex-between" style="flex-wrap: wrap">
      <div class="my10 h145" style="width: 30%; position: relative">
        <v-chart v-if="query.type === '1'" autoresize :options="chart1Options"></v-chart>
        <v-chart v-if="query.type === '2'" autoresize :options="chart2Options"></v-chart>
        <div style="position: absolute; top: 0; left: 0">
          <span class="chart-sub-title">竞店同比对比</span>
          <a-tooltip placement="right" overlayClassName="light-tooltip">
            <template slot="title">
              <div class="text-black text-xs" style="width: 220px">
                <div>累计同比：今年至当前日期的同比数据</div>
                <div class="mt5" style="font-weight: bold">店铺简称备注：</div>
                <div style="line-height: 22px">
                  <div>林氏木业：林氏木业家具旗舰店</div>
                  <div>顾家家居：顾家家居官方旗舰店</div>
                  <div>源氏木语：源氏木语家居旗舰店</div>
                  <div>全友家私：全友家私家具旗舰店</div>
                  <div>芝华仕：芝华仕官方旗舰店</div>
                  <div>维莎：维莎旗舰店</div>
                  <div>quanu全友：全友家居官方旗舰店</div>
                  <div>原始原素：原始原素家居旗舰店</div>
                </div>
              </div>
            </template>
            <a-icon type="question-circle" class="ml5" style="color: #999" />
          </a-tooltip>
        </div>
        <div style="position: absolute; right: 0; top: 0">
          <a-radio-group v-model="query.type" class="text-xs-radio">
            <a-radio value="2">累计同比</a-radio>
            <a-radio value="1">月度同比</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="my10 h145" style="width: 30%; position: relative" v-for="item in charts" :key="item.title">
        <v-chart :options="deepmerge(basicOptions, item.options, { arrayMerge: combineMerge })" autoresize></v-chart>
        <div style="position: absolute; top: 0; left: 0">
          <span class="chart-sub-title">{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import deepmerge from 'deepmerge'
import { formatNumber } from '@/utils/helper'
import Title from '../../components/Title'
import graphic from 'echarts/lib/util/graphic'
import echartsColor from '../../utils/echartsColor.js'

const shopNameMapping = {
  林氏木业: '林氏',
  顾家家居: '顾家',
  源氏木语: '源氏',
  全友家私: '全友',
  芝华仕: '芝华仕',
  维莎: '维莎',
  quanu全友: 'quanu',
  原始原素: '原始',
}
export default {
  name: 'CompetitorAnalysis',
  components: {
    Title,
  },
  data() {
    const charts = [
      { title: '林氏木业', options: {} },
      { title: '顾家家居', options: {} },
      { title: '源氏木语', options: {} },
      { title: '全友家私', options: {} },
      { title: '芝华仕', options: {} },
      { title: '维莎', options: {} },
      { title: 'quanu全友', options: {} },
      { title: '原始原素', options: {} },
    ]
    return {
      query: {
        type: '2',
        dataIndex: '支付金额',
      },
      allData: [],
      dataIndexOptions: [],
      charts: charts,
      basicOptions: {
        color: ['#cce0e9', '#ff7f0e', '#2680eb'],
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params
              .reverse()
              .map((item) => {
                if (item.seriesName === '同比') {
                  return `<br>${item.marker} ${item.seriesName}: ${item.value ? item.value : '-'}${
                    item.value ? '%' : ''
                  }`
                }
                return `<br>${item.marker} ${item.seriesName}年支付金额：${
                  item.value == 0 ? '--' : formatNumber(item.value, 1, 0)
                }`
              })
              .join('')
            return `统计月份：${name}${lines}`
          },
        },
        legend: {
          itemWidth: 16,
          itemHeight: 2,
          top: 0,
          icon: 'rect',
          right: 0,
        },
        grid: {
          top: 40,
          left: 1,
          bottom: 0,
          right: 1,
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
          },
          data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
        },
        yAxis: [
          {
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#999',
            },
            splitLine: {
              lineStyle: {
                // type: 'dashed',
                type: 'solid',
                // color: 'rgba(234,234,234,0.5)'
                color: echartsColor.splitLine,
              },
            },
          },
          {
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#999',
              formatter: '{value}%',
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [],
      },
      chart1Options: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params
              .map((item) => {
                return `<br>${item.marker} ${item.seriesName}: ${item.value}%`
              })
              .join('')
            return `统计月份：${name}${lines}`
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          top: 25,
          type: 'scroll',
        },
        color: ['#2680eb', '#27bacb', '#f7da53', '#ee856d', '#fe9c2f', '#a486fa', '#02a7f0', '#598af7'],
        grid: {
          top: 55,
          left: 1,
          bottom: 0,
          right: 1,
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
          },
          data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
            formatter: (val) => {
              return `${val}%`
            },
          },
          splitLine: {
            lineStyle: {
              // type: 'dashed',
              type: 'solid',
              // color: '#eee',
              // color: 'rgba(234,234,234,0.5)'
              color: echartsColor.splitLine,
            },
          },
        },
        series: [],
      },
      chart2Options: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            return `${params[0].marker}${params[0].name}: ${(params[0].value * 100).toFixed(2)}%`
          },
        },
        grid: {
          top: 45,
          left: 1,
          bottom: 0,
          right: 1,
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            color: '#999',
            formatter: (val) => {
              return shopNameMapping[val] || (val || '').slice(0, 2)
            },
          },
          data: [],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
            formatter: (val) => {
              return `${(val * 100).toFixed(0)}%`
            },
          },
          splitLine: {
            lineStyle: {
              // type: 'dashed',
              type: 'solid',
              // color: '#eee',
              // color: 'rgba(234,234,234,0.5)'
              color: echartsColor.splitLine,
            },
          },
        },
        series: [
          {
            type: 'bar',
            barWidth: 15,
            label: {
              formatter: (params) => {
                return (params.value * 100).toFixed(2) + '%'
              },
              show: true,
              color: '#999',
              position: 'top',
            },
            itemStyle: {
              color: '#2680eb',
            },
            data: [],
          },
        ],
      },
    }
  },
  watch: {
    'query.dataIndex'() {
      this.parseData(this.allData)
    },
  },
  created() {
    this.getData1()
    this.getData2()
    this.getData3()
  },
  methods: {
    deepmerge,
    combineMerge(target, source, options) {
      const destination = target.slice()

      source.forEach((item, index) => {
        if (typeof destination[index] === 'undefined') {
          destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
        } else if (options.isMergeableObject(item)) {
          destination[index] = deepmerge(target[index], item, options)
        } else if (target.indexOf(item) === -1) {
          destination.push(item)
        }
      })
      return destination
    },
    getOptions() {},
    getData1() {
      this.$axios.post('/api/admin/data/kpi_competitor/competitor_m/get').then((res) => {
        const shops = this.charts.map((_) => _.title)
        const data = res.data.filter((item) => {
          return shops.indexOf(item['STORE_NAME']) > -1
        })

        this.allData = Object.freeze(data)
        this.parseData(this.allData)
      })
    },
    parseData(data) {
      this.dataIndexOptions = Array.from(new Set(data.map((item) => item['DATA_INDEX'])))
      const filteredData = data.filter((item) => {
        return item['DATA_INDEX'] === this.query.dataIndex
      })
      const shopMap = {}
      filteredData.forEach((item) => {
        const shop = item['STORE_NAME']
        const year = item['TDATE'].slice(0, 4)
        if (!shopMap[shop]) {
          shopMap[shop] = {
            [year]: [item],
          }
        } else {
          if (!shopMap[shop][year]) {
            shopMap[shop][year] = [item]
          } else {
            shopMap[shop][year].push(item)
          }
        }
      })
      console.log(shopMap);
      let num=0;

      Object.keys(shopMap).forEach((shop) => {
        const series = []
        Object.keys(shopMap[shop])
          .sort((a, b) => a - b)
          .forEach((year) => {
            const yearData = shopMap[shop][year]
            const data = Array(12)
              .fill(null)
              .map((_, index) => {
                const thisMonthData = yearData.filter((_) => Number(_['TDATE'].slice(5, 7)) === index + 1)
                return thisMonthData.length
                  ? thisMonthData.reduce((acc, cur) => {
                      return acc + cur['DATA_BUYER']
                    }, 0)
                  : null
              })
            series.push({
              type: 'line',
              symbol:'none',
              itemStyle: {
                normal: {
                    color:null
                }
              },
              z:num+=1,
              areaStyle: {
                    opacity:0,
                    color:null,
              },
              showSymbol: true,
              smooth: true,
              name: year,
              data: data.map((_) => {
                if (this.query.dataIndex.indexOf('人数') > -1) {
                  return Math.round(_)
                } else {
                  return _ || _ === 0 ? _.toFixed(2) : null
                }
              }),
            })
          })
        const chartOptions = this.charts.find((_) => _.title === shop)
        const aData = series.reduce((acc, cur) => {
          return acc.concat(cur.data)
        }, [])
        const max = Math.max(...aData)
        const interval = Math.ceil(max / 5 / 10000000) * 10000000
        chartOptions.options.yAxis = [
          {
            min: 0,
            max: interval * 5,
            interval,
          },
        ]
        const lastYear = Object.keys(shopMap[shop])
          .sort((a, b) => a - b)
          .slice(-2)[0]
        const thisYear = Number(lastYear) + 1
        // eslint-disable-next-line no-unused-vars
        const yoyData = Array(12)
          .fill(null)
          .map((_, index) => {
            const lastYearMonthData = shopMap[shop][lastYear].find(
              (item) => Number(item['TDATE'].slice(5, 7)) === index + 1
            )
            const thisYearMonthData = shopMap[shop][thisYear].find(
              (item) => Number(item['TDATE'].slice(5, 7)) === index + 1
            )
            if (lastYearMonthData && thisYearMonthData) {
              return (
                ((thisYearMonthData['DATA_BUYER'] - lastYearMonthData['DATA_BUYER']) /
                  lastYearMonthData['DATA_BUYER']) *
                100
              ).toFixed(2)
            } else {
              return null
            }
          })

          if(series.length>2){
            series[2].itemStyle.normal.color=echartsColor.Stress1_1;
            series[1].itemStyle.normal.color=echartsColor.Stress2_1;
            series[0].itemStyle.normal.color=echartsColor.Stress3_1;
            series[2].areaStyle.opacity=0;
            series[2].areaStyle.color= new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(92,143,249,0.2)'
              },
              {
                offset: 1,
                color: 'rgba(92,143,249,0.2)'
              }
            ]);
            series[1].areaStyle.opacity=0;
            series[1].areaStyle.color= new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#9AC5FF'
              },
              {
                offset: 1,
                color: '#cce0e900'
              }
            ]); 
            series[0].areaStyle.opacity=0;
            series[0].areaStyle.color= new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#EDF0F4'
              },
              {
                offset: 1,
                color: '#EDF0F4'
              }
            ]); 

          }else{
            series[1].itemStyle.normal.color=echartsColor.Stress1_1;
            series[0].itemStyle.normal.color=echartsColor.Stress2_1;     
            series[1].areaStyle.opacity=0;
            series[1].areaStyle.color= new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                // color: '#5C8FF9'
                color: 'rgba(92,143,249,0.2)'
              },
              {
                offset: 1,
                color: 'rgba(92,143,249,0.2)'
              }
            ]);
            series[0].areaStyle.opacity=0;
            series[0].areaStyle.color= new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#EDF0F4'
              },
              {
                offset: 1,
                color: '#EDF0F4'
              }
            ]); 
          }


        chartOptions.options.series = series
      })
    },
    getData2() {
      this.$fetchSql('kpi_competitor', 'competitor_y').then(({ data }) => {
        const sorted = data.sort((a, b) => b['PAY_AMT_YOY'] - a['PAY_AMT_YOY'])
        this.chart2Options.xAxis.data = sorted.map((_) => _['STORE_NAME'])
        this.chart2Options.series[0].data = sorted.map((_) => ({
          value: _['PAY_AMT_YOY'],
          itemStyle: {
            color: _['PAY_AMT_YOY'] > 0 ? '#ff0000' : '#079909',
          },
        }))
      })
    },
    getData3() {
      this.$fetchSql('kpi_competitor', 'competitor2').then(({ data }) => {
        console.log('data', data)
        const shopMap = {}
        data.forEach((item) => {
          const shop = item['STORE_NAME']
          const year = item['TDATE'].slice(0, 4)
          if (!shopMap[shop]) {
            shopMap[shop] = {
              [year]: [item],
            }
          } else {
            if (!shopMap[shop][year]) {
              shopMap[shop][year] = [item]
            } else {
              shopMap[shop][year].push(item)
            }
          }
        })
        console.log('getData3', shopMap)
        // 计算月度同比
        const shopYoy = []
        const shopYoyMap = {}
        const curYear = new Date().getFullYear()
        Object.keys(shopMap).forEach((shop) => {
          const shopData = shopMap[shop]
          const theYearTotal = shopData[curYear].reduce((acc, cur) => {
            return acc + (cur['PAY_AMOUNT'] || 0)
          }, 0)
          const lastYearTotal = shopData[curYear].reduce((acc, cur) => {
            return acc + (cur['PAY_AMOUNT_PREV'] || 0)
          }, 0)
          const yoy = theYearTotal / lastYearTotal - 1
          shopYoyMap[shop] = yoy
          shopYoy.push({
            shop,
            yoy,
          })
        })
        const orderedYoy = shopYoy.sort((a, b) => b['yoy'] - a['yoy'])
        let selected = orderedYoy.slice(0, 3)

        if (!selected.find((item) => item.shop === '林氏木业')) {
          selected = selected.slice(0, 2).concat({
            shop: '林氏木业',
            yoy: shopYoyMap['林氏木业'],
          })
        }
        const selectedShop = selected.map((_) => _.shop)
        console.log(selectedShop)
        const _selectedShop = ['林氏木业', '顾家家居', '源氏木语']
        const selectedLegend = this.charts.reduce((acc, cur) => {
          acc[cur.title] = _selectedShop.indexOf(cur.title) > -1
          return acc
        }, {})

        console.log(selectedLegend)

        const allShop = this.charts.map((_) => _.title)
        const series = allShop.map((shop) => {
          const theShopData = shopMap[shop]
          const theYearData = theShopData[curYear].sort((a, b) => moment(a['TDATE']) - moment(b['TDATE']))
          return {
            type: 'line',
            smooth: true,
            name: shop,
            data: theYearData.map((_, index) => {
              return ((_['PAY_AMT_YOY'] || 0) * 100).toFixed(2)
            }),
          }
        })
        this.chart1Options.series = series
        this.chart1Options.legend.selected = selectedLegend
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.Header{
  margin-top: 10px;
  height: 30px;
  padding-bottom: 5px;
  border-bottom: 0px solid #f0f0f0;
}
.text-xs-radio {
  font-size: 12px;

  /deep/ .ant-radio-wrapper {
    font-size: 12px;
    color: #666;
  }
}

.h145 {
  height: calc((1px * var(--height) - 70px - 30px) / 3);
}
</style>
