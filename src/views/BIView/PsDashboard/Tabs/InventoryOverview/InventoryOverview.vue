<template>
  <div class="px15">
    <!-- style="height: 30px" -->
    <div class="flex-between" style="padding: 10px 0px;">
      <div class="text-black" style="display: flex;padding: 0px 0px;">
        <!-- <div class="chart-sub-title">库存金额</div> -->
        <Title :label="'库存金额'" />
        <Jump @click.native="jumpTarget" />
      </div>
      <div>
        <a-radio-group v-model="viewType">
          <a-radio value="1">当月</a-radio>
          <a-radio value="2">月度</a-radio>
        </a-radio-group>
      </div>
    </div>


    <div v-if="viewType === '1'" class="inventoryWrapper">
      <div>
        <a-radio-group v-model="query.valueType" style="width: 100%;" class="flex-between mt2">
          <a-radio style="width: 33.33%" value="1">库存金额</a-radio>
          <a-radio style="width: 33.33%" value="2">林氏仓</a-radio>
          <a-radio style="width: 33.33%" value="3">供应仓</a-radio>
        </a-radio-group>
        <div class="flex-between">
          <div style="width: 33.33%; padding-left: 25px; padding-right: 25px">
            <div style="font-weight: bold;" class="py5">
              {{ formatY(overviewData2.TOT_INV_AMT) }}
            </div>
            <div class="flex-between text-xs" style="height: 24px">
              <span class="text-gary">峰值</span><span>{{ formatY(overviewData2.MAX_TOT_INV_AMT) }}</span>
            </div>
            <div class="flex-between text-xs" style="height: 24px">
              <span class="text-gary">同期</span><span>{{ formatY(overviewData2.TOT_INV_AMT_AGO) }}</span>
            </div>
            <div class="flex-between text-xs" style="height: 24px">
              <span class="text-gary">同比</span>
              <span :class="{
                'text-red': overviewData2.TOT_INV_AMT_YOY && overviewData2.TOT_INV_AMT_YOY < 0,
                'text-green': overviewData2.TOT_INV_AMT_YOY && overviewData2.TOT_INV_AMT_YOY > 0
              }">
                {{ overviewData2.TOT_INV_AMT_YOY ? numeral(overviewData2.TOT_INV_AMT_YOY).format('0.00%') : '--' }}
              </span>
            </div>
          </div>
          <div style="width: 33.33%; padding-left: 25px; padding-right: 25px">
            <div style="font-weight: bold;" class="py5">
              {{ formatY(overviewData2.LINSY_INV_AMT) }}
            </div>
            <div class="flex-between text-xs" style="height: 24px">
              <span class="text-gary">峰值</span><span>
              {{ formatY(overviewData2.MAX_LINSY_INV_AMT) }}
            </span>
            </div>
            <div class="flex-between text-xs" style="height: 24px">
              <span class="text-gary">同期</span><span>
              {{ formatY(overviewData2.LINSY_INV_AMT_AGO) }}
            </span>
            </div>
            <div class="flex-between text-xs" style="height: 24px">
              <span class="text-gary">同比</span>
              <span :class="{
                'text-red': overviewData2.LINSY_INV_AMT_YOY && overviewData2.LINSY_INV_AMT_YOY < 0,
                'text-green': overviewData2.LINSY_INV_AMT_YOY && overviewData2.LINSY_INV_AMT_YOY > 0,
              }">
                {{ overviewData2.LINSY_INV_AMT_YOY ? numeral(overviewData2.LINSY_INV_AMT_YOY).format('0.00%') : '--' }}
              </span>
            </div>
          </div>
          <div style="width: 33.33%; padding-left: 25px; padding-right: 25px">
            <div style="font-weight: bold;" class="py5">
              {{ formatY(overviewData2.SPL_INV_AMT) }}
            </div>
            <div class="flex-between text-xs" style="height: 24px">
              <span class="text-gary">峰值</span><span>
               {{ formatY(overviewData2.MAX_SPL_INV_AMT) }}
            </span>
            </div>
            <div class="flex-between text-xs" style="height: 24px">
              <span class="text-gary">同期</span><span>
               {{ formatY(overviewData2.SPL_INV_AMT_AGO) }}
            </span>
            </div>
            <div class="flex-between text-xs" style="height: 24px">
              <span class="text-gary">同比</span>
              <span :class="{
                'text-red': overviewData2.SPL_INV_AMT_YOY && overviewData2.SPL_INV_AMT_YOY < 0,
                'text-green': overviewData2.SPL_INV_AMT_YOY && overviewData2.SPL_INV_AMT_YOY > 0,
              }">
              {{ overviewData2.SPL_INV_AMT_YOY ? numeral(overviewData2.SPL_INV_AMT_YOY).format('0.00%') : '--' }}
            </span>
            </div>
          </div>
        </div>

        <div class="ch1" style="position: relative">
          <DropdownSelect v-if="query.valueType === '2'" label="筛选："
                          style="position: absolute; left: 10px; top: 10px; z-index: 99">
            <div slot="selectedText" style="width: 80px; text-align: center">{{
                ({0: '全部', 1: '佛山仓', 2: '青岛仓', 3: '成都仓', 4: '小商品仓', 5: '海外仓', 6: '代发仓'})[query.invType]
              }}
            </div>
            <a-radio-group v-model="query.invType">
              <div>
                <a-radio value="0">全部</a-radio>
              </div>
              <div>
                <a-radio value="1">佛山仓</a-radio>
              </div>
              <div>
                <a-radio value="2">青岛仓</a-radio>
              </div>
              <div>
                <a-radio value="3">成都仓</a-radio>
              </div>
              <div>
                <a-radio value="4">小商品仓</a-radio>
              </div>
              <div>
                <a-radio value="5">海外仓</a-radio>
              </div>
              <div>
                <a-radio value="6">代发仓</a-radio>
              </div>
            </a-radio-group>
          </DropdownSelect>
          <v-chart ref="chart1" autoresize :options="options1"/>
        </div>

        <div class="flex flex-between mt2">
          <div class="ch1" style="width: calc(50% - 10px); position: relative">
            <span style="position: absolute; left: 0; top: 0" class="text-xs text-gary">仓库划分</span>
            <v-chart ref="chart2" autoresize :options="options2"/>
          </div>
          <div class="ch1" style="width: calc(50% - 10px); position: relative">
            <span style="position: absolute; left: 0; top: 0" class="text-xs text-gary">停产划分</span>
            <v-chart ref="chart3" autoresize :options="options3"/>
          </div>
        </div>
      </div>
      <div>
        <div class="flex-start">
          <div style="flex: 0 0 30%">
            <p>当月在途</p>
            <div style="font-weight: bold">
              {{
                overviewData.TM_INTRNS_AMT ? numeral(overviewData.TM_INTRNS_AMT / 100000000).format('0.00') + '亿' : '--'
              }}
            </div>
          </div>
          <div style="flex: 0 0 30%">
            <p>总在途</p>
            <div style="font-weight: bold">
              {{ overviewData.INTRNS_AMT ? numeral(overviewData.INTRNS_AMT / 100000000).format('0.00') + '亿' : '--' }}
            </div>
          </div>
        </div>
        <div class="ch2 mt20" style="position: relative">
          <span style="position: absolute; left: 0; top: 0" class="text-xs text-gary">未来30天在途分布</span>
          <v-chart ref="chart4" autoresize :options="options4"/>
        </div>
        <div class="ch2 mt20" style="position: relative">
          <span style="position: absolute; left: 0; top: 0" class="text-xs text-gary">未来四个月在途分布</span>
          <v-chart ref="chart5" autoresize :options="options5"/>
        </div>
      </div>
      <div>
        <div class="flex-start">
          <div style="flex: 0 0 30%">
            <p>当月报检</p>
            <div style="font-weight: bold">
              {{
                overviewData.WAIT_INSP_AMT ? numeral(overviewData.WAIT_INSP_AMT / 100000000).format('0.00') + '亿' : '--'
              }}
            </div>
          </div>
          <div style="flex: 0 0 30%">
            <p>年累计报检</p>
            <div style="font-weight: bold">
              {{
                overviewData.YEAR_WAIT_INSP_AMT ? numeral(overviewData.YEAR_WAIT_INSP_AMT / 100000000).format('0.00') + '亿' : '--'
              }}
            </div>
          </div>
        </div>
        <div class="ch2 mt20" style="position: relative">
          <span style="position: absolute; left: 0; top: 0" class="text-xs text-gary">近30天报检分布</span>
          <v-chart ref="chart6" autoresize :options="options6"/>
        </div>
        <div class="ch2 mt20" style="position: relative">
          <span style="position: absolute; left: 0; top: 0" class="text-xs text-gary">报检金额趋势</span>
          <v-chart ref="chart7" autoresize :options="options7"/>
        </div>
      </div>
    </div>


    <div v-if="viewType === '2'">
      <div class="flex-start mt10" style="height: 24px;justify-content: flex-end;padding-right: 15px;">
        <DropdownSelect label="统计年份" style="margin-right: 50px">
          <span slot="selectedText" class="text-xs text-gary px20" style="width: 100px">{{ query.year }}</span>
          <a-radio-group v-model="query.year">
            <div v-for="item in yearOptions" :key="item">
              <a-radio :value="item">{{ item }}</a-radio>
            </div>
          </a-radio-group>
        </DropdownSelect>
        <DropdownSelect label="仓库类型" style="margin-right: 50px">
          <div slot="selectedText" class="text-gary text-ellipsis text-xs px20" style="width: 100px">{{
              query.stockType.join('，')
            }}
          </div>
          <a-checkbox-group v-model="query.stockType">
            <div>
              <a-checkbox value="供应仓">供应仓</a-checkbox>
            </div>
            <div>
              <a-checkbox value="林氏仓">林氏仓</a-checkbox>
            </div>
          </a-checkbox-group>
        </DropdownSelect>
        <DropdownSelect label="是否停产">
          <div slot="selectedText" class="text-gary text-ellipsis text-xs px20" style="width: 100px">{{
              query.isStop.join('，')
            }}
          </div>
          <a-checkbox-group v-model="query.isStop">
            <div>
              <a-checkbox value="停产">停产</a-checkbox>
            </div>
            <div>
              <a-checkbox value="非停产">非停产</a-checkbox>
            </div>
          </a-checkbox-group>
        </DropdownSelect>
      </div>

      <div class="ch10">
        <v-chart ref="chart10" autoresize :options="options10"/>
      </div>

      <div class="mt20">
        <table class="dashboard-common-table">
          <tr>
            <td>年月</td>
            <td>年平均</td>
            <td>当期平均</td>
            <td v-for="item in months" :key="item">
              {{ item + '月' }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(0, 0,null)"
              :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}"
            >{{ query.year }}</td>
            <td @mouseenter="mouseenter(0, 1,null)"
              :style="{background:(curCol === 0) || (curRow === 1) ? hoverColor : null,}"
            >
              {{ formatY(thisYearTot.yearTotAvg) }}
            </td>
            <td @mouseenter="mouseenter(0, 2,null)"
              :style="{background:(curCol === 0) || (curRow === 2) ? hoverColor : null,}"
            >
              {{ formatY(thisYearTot.monTotAvg) }}
            </td>
            <td @mouseenter="mouseenter(0, (m+'月'),null)"
              :style="{background:(curCol === 0) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ formatY(((yearMonthValues[query.year] || [])[m - 1] || {})['TOT_INV_AMT']) }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(1, 0,null)"
              :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
            >{{ query.year - 1 }}</td>
            <td @mouseenter="mouseenter(1, 1,null)"
              :style="{background:(curCol === 1) || (curRow === 1) ? hoverColor : null,}"
            >
              {{ formatY(lastYearTot.yearTotAvg) }}
            </td>
            <td @mouseenter="mouseenter(1, 2,null)"
              :style="{background:(curCol === 1) || (curRow === 2) ? hoverColor : null,}"
            >
              {{ formatY(lastYearTot.monTotAvg) }}
            </td>
            <td @mouseenter="mouseenter(1, (m+'月'),null)"
              :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ formatY(((yearMonthValues[query.year - 1] || [])[m - 1] || {})['TOT_INV_AMT']) }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(2, 0,null)"
              :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
            >差额</td>
            <td  @mouseenter="mouseenter(2, 1,null)"
              :style="{background:(curCol === 2) || (curRow === 1) ? hoverColor : null,}"
            >
              {{ formatY(thisYearTot.yearTotAvg - lastYearTot.yearTotAvg) }}
            </td>
            <td @mouseenter="mouseenter(2, 2,null)"
              :style="{background:(curCol === 2) || (curRow === 2) ? hoverColor : null,}"
            >
              {{ formatY(thisYearTot.monTotAvg - lastYearTot.monTotAvg) }}
            </td>
            <td @mouseenter="mouseenter(2, (m+'月'),null)"
              :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{
                formatY(((yearMonthValues[query.year] || [])[m - 1] || {})['TOT_INV_AMT']
                    - ((yearMonthValues[query.year - 1] || [])[m - 1] || {})['TOT_INV_AMT'])
              }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(3, 0,null)"
              :style="{background:(curCol === 3) || (curRow === 0) ? hoverColor : null,}"
            >同比</td>
            <td @mouseenter="mouseenter(3, 1,null)" 
              :style="{background:(curCol === 3) || (curRow === 1) ? hoverColor : null,}"
              :class="{
              'text-red': thisYearTot.yearTotAvg < lastYearTot.yearTotAvg,
              'text-green': thisYearTot.yearTotAvg > lastYearTot.yearTotAvg,
            }">
              {{ formatYoy(thisYearTot.yearTotAvg, lastYearTot.yearTotAvg) }}
            </td>
            <td @mouseenter="mouseenter(3, 2,null)"
              :style="{background:(curCol === 3) || (curRow === 2) ? hoverColor : null,}"
              :class="{
               'text-red': thisYearTot.monTotAvg < lastYearTot.monTotAvg,
              'text-green': thisYearTot.monTotAvg > lastYearTot.monTotAvg,
            }">
              {{ formatYoy(thisYearTot.monTotAvg, lastYearTot.monTotAvg) }}
            </td>
            <td @mouseenter="mouseenter(3, (m+'月'),null)"
              :style="{background:(curCol === 3) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m" :class="{
              'text-red': ((yearMonthValues[query.year] || [])[m - 1] || {})['TOT_INV_AMT'] && ((yearMonthValues[query.year] || [])[m - 1] || {})['TOT_INV_AMT'] < ((yearMonthValues[query.year -1] || [])[m - 1] || {})['TOT_INV_AMT'],
              'text-green': ((yearMonthValues[query.year] || [])[m - 1] || {})['TOT_INV_AMT'] && ((yearMonthValues[query.year] || [])[m - 1] || {})['TOT_INV_AMT'] > ((yearMonthValues[query.year -1] || [])[m - 1] || {})['TOT_INV_AMT']
            }">
              {{
                formatYoy(((yearMonthValues[query.year] || [])[m - 1] || {})['TOT_INV_AMT'], ((yearMonthValues[query.year - 1] || [])[m - 1] || {})['TOT_INV_AMT'])
              }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import moment from 'moment'
import orderBy from 'lodash/orderBy'
import DropdownSelect from '@/views/BIView/components/DropdownSelect/DropdownSelect'
import graphic from 'echarts/lib/util/graphic'
import Jump from '@/views/BIView/PsDashboard/components/Jump'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'

export default {
  name: 'InventoryOverview',
  components: {DropdownSelect,Jump,Title},
  data() {
    const nextFourMonth = Array(4).fill(null).map((_, i) => {
      return moment().add(i, 'months').format('YY-MM')
    })
    const months = Array(12).fill(null).map((_, i) => i + 1)
    const thisYear = (new Date()).getFullYear()
    return {
      months,
      nextFourMonth,
      yearOptions: [thisYear, thisYear - 1, thisYear - 2],
      viewType: '1',
      query: {
        valueType: '1',
        invType: '0',
        year: thisYear,
        stockType: [],
        isStop: [],
      },
      options1: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter(params) {
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${numeral(_.value).format('0,0')}`
            }).join('')
            return `${params[0].axisValue}${lines}`
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          top: 10,
          selectedMode: false
        },
        grid: {
          top: 50,
          right: 0,
          bottom: 10,
          left: 0,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: echartsColor.axisLabel,
          },
          data: months.map(_ => _ + '月'),
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            color: echartsColor.axisLabel,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: [
          {
            type: 'line',
            z: 10,
            name: thisYear,
            smooth: true,
            showSymbol: true,
            itemStyle: {
              color: echartsColor.thisYear,
            },
            symbol: 'none',
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: echartsColor.NewPeriod1
                },
                {
                  offset: 1,
                  color: echartsColor.NewPeriod2
                }
              ]),
              opacity: 1,
            },
            data: []
          },
          {
            type: 'line',
            name: thisYear - 1,
            smooth: true,
            showSymbol: true,
            itemStyle: {
              color: echartsColor.previousYear
            },
            symbol: 'none',
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: echartsColor.NewYOY1
                },
                {
                  offset: 1,
                  color: echartsColor.NewYOY2
                }
              ]),
              opacity: 1,
            },
            data: [],
          },
        ]
      },
      options2: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(0, 0, 0, .05)',
            }
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter(params) {
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${numeral(_.value).format('0,0')}`
            }).join('')
            return `${params[0].axisValue}${lines}`
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          top: 10,
          selectedMode: false
        },
        grid: {
          top: 50,
          right: 0,
          bottom: 10,
          left: 0,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: echartsColor.axisLabel
          },
          data: ['林氏仓', '供应仓'],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            color: echartsColor.axisLabel,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: [
          {
            type: 'bar',
            name: '当期',
            data: [],
            barWidth: 20,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              color: echartsColor.thisYear
            },
            label: {
              show: false
            },
          },
          {
            type: 'bar',
            name: '同期',
            data: [],
            barWidth: 20,
            itemStyle: {
              normal: {
                  barBorderRadius: [7, 7, 0, 0],
                  color: echartsColor.previousYear
              },
              emphasis: {
                  barBorderRadius: [7, 7, 0, 0],
                  color: echartsColor.previousYear
              }
            },
            label: {
              show: false
            }
          }
        ]
      },
      options3: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(0, 0, 0, .05)'
            },
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter(params) {
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${numeral(_.value).format('0,0')}`
            }).join('')
            return `${params[0].axisValue}${lines}`
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          top: 10,
          selectedMode: false
        },
        grid: {
          top: 50,
          right: 0,
          bottom: 10,
          left: 0,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: echartsColor.axisLabel
          },
          data: ['非停产', '停产'],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            color: echartsColor.axisLabel,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: [
          {
            type: 'bar',
            name: '当期',
            data: [],
            barWidth: 20,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              color: echartsColor.thisYear
            },
            label: {
              show: false
            }
          },
          {
            type: 'bar',
            name: '同期',
            data: [],
            barWidth: 20,
            itemStyle: {
                normal: {
                    barBorderRadius: [7, 7, 0, 0],
                    color: echartsColor.previousYear
                },
                emphasis: {
                    barBorderRadius: [7, 7, 0, 0],
                    color: echartsColor.previousYear
                }
            },
            label: {
              show: false
            }
          }
        ]
      },
      options4: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter(params) {
            return `交货日期: ${moment(params[0].axisValue).format('YYYY-MM-DD')}<br>在途金额: ${numeral(params[0].value).format('0,0')}`
          }
        },
        grid: {
          top: 30,
          right: 10,
          bottom: 10,
          left: 10,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: echartsColor.axisLabel,
            formatter(v) {
              return moment(v).format('D') + '日'
            }
          },
          data: []
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            color: echartsColor.axisLabel,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: [
          {
            type: 'line',
            smooth: true,
            showSymbol: true,
            itemStyle: {
              color: echartsColor.thisYear,
            },
            symbol: 'none',
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: echartsColor.NewPeriod1
                },
                {
                  offset: 1,
                  color: echartsColor.NewPeriod2
                }
              ]),
              opacity: 1,
            },
            data: []
          }
        ]
      },
      options5: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter(params) {
            return `年月: ${moment(params[0].axisValue).format('YY-MM')}<br>在途金额: ${numeral(params[0].value).format('0,0')}`
          }
        },
        grid: {
          top: 30,
          right: 0,
          bottom: 10,
          left: 0,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: echartsColor.axisLabel,
            formatter(v) {
              return moment(v).format('YY-MM')
            }
          },
          data: [],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            color: echartsColor.axisLabel,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: [
          {
            type: 'bar',
            data: [],
            barWidth: 20,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              color: echartsColor.thisYear
            },
            label: {
              show: false
            }
          }
        ]
      },
      options6: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter(params) {
            return `交货日期：${moment(params[0].axisValue).format('YYYY-MM-DD')}<br>在途金额：${numeral(params[0].value).format('0,0')}`
          }
        },
        grid: {
          top: 30,
          right: 10,
          bottom: 10,
          left: 10,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: echartsColor.axisLabel,
            formatter(v) {
              return moment(v).format('D') + '日'
            }
          },
          data: []
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            color: echartsColor.axisLabel,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: [
          {
            type: 'line',
            smooth: true,
            showSymbol: true,
            itemStyle: {
              color: echartsColor.thisYear,
            },
            symbol: 'none',
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: echartsColor.NewPeriod1
                },
                {
                  offset: 1,
                  color: echartsColor.NewPeriod2
                }
              ]),
              opacity: 1,
            },

            data: []
          }
        ]
      },
      options7: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter(params) {
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value / 100000000).format('0.00') + '亿' : '--'}`
            }).join('')
            return `${params[0].axisValue}${lines}`
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          top: 10,
          selectedMode: false
        },
        grid: {
          top: 30,
          right: 0,
          bottom: 10,
          left: 0,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: echartsColor.axisLabel
          },
          data: months.map(_ => _ + '月'),
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            color: echartsColor.axisLabel,
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
              color: '#ececee'
            }
          }
        },
        series: [
          {
            type: 'line',
            z: 10,
            smooth: true,
            showSymbol: true,
            itemStyle: {
              color: echartsColor.thisYear
            },
            symbol: 'none',
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: echartsColor.NewPeriod1
                },
                {
                  offset: 1,
                  color: echartsColor.NewPeriod2
                }
              ]),
              opacity: 1,
            },


            data: []
          },
          {
            type: 'line',
            smooth: true,
            showSymbol: true,
            itemStyle: {
              color: echartsColor.previousYear
            },
            symbol: 'none',
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: echartsColor.NewYOY1
                },
                {
                  offset: 1,
                  color: echartsColor.NewYOY2
                }
              ]),
              opacity: 1,
            },

            data: [],
          },
        ]
      },

      options10: {
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter(params) {
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${numeral(_.value).format('0,0')}`
            }).join('')
            return `${params[0].axisValue}${lines}`
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          top: 10,
          selectedMode: false
        },
        grid: {
          top: 20,
          bottom: 10,
          left: 10,
          right: 10,
          containLabel: true
        },
        xAxis: {
          data: months.map(_ => _ + '月'),
          axisLabel: {
            color: echartsColor.axisLabel
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
            show: false,
            lineStyle: {
              type: 'dashed',
              color: ['#ececee']
            }
          },
          axisLabel: {
            show: false
          }
        },
        series: [
          {
            type: 'line',
            z: 10,
            name: thisYear,
            smooth: true,
            itemStyle: {
              color: echartsColor.thisYear
            },
            symbol: 'none',
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: echartsColor.NewPeriod1
                },
                {
                  offset: 1,
                  color: echartsColor.NewPeriod2
                }
              ]),
              opacity: 1,
            },
            data: []
          },
          {
            type: 'line',
            name: thisYear - 1,
            smooth: true,
            itemStyle: {
              color: echartsColor.previousYear
            },
            symbol: 'none',
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: echartsColor.NewYOY1
                },
                {
                  offset: 1,
                  color: echartsColor.NewYOY2
                }
              ]),
              opacity: 1,
            },
            data: []
          }
        ]
      },
      overviewData: {
        INTRNS_AMT: '',
        TM_INTRNS_AMT: '',
        WAIT_INSP_AMT: '',
        YEAR_WAIT_INSP_AMT: ''
      },
      overviewData2: {
        LINSY_INV_AMT: '',
        LINSY_INV_AMT_AGO: '',
        LINSY_INV_AMT_YOY: '',
        MAX_LINSY_INV_AMT: '',
        MAX_SPL_INV_AMT: '',
        MAX_TOT_INV_AMT: '',
        SPL_INV_AMT: '',
        SPL_INV_AMT_AGO: '',
        SPL_INV_AMT_YOY: '',
        STOP_INV_AMT: '',
        STOP_INV_AMT_AGO: '',
        TOT_INV_AMT: '',
        TOT_INV_AMT_AGO: '',
        TOT_INV_AMT_YOY: '',
        UNSTOP_INV_AMT: '',
        UNSTOP_INV_AMT_AGO: '',
      },
      yearMonthValues: {},
      thisYearMonthData: {},
      thisYearTot: {
        yearTotAvg: '',
        monTotAvg: ''
      },
      lastYearTot: {
        yearTotAvg: '',
        monTotAvg: ''
      },
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,

    }
  },
  watch: {
    'query.valueType'() {
      this.parseData8(this.thisYearMonthData)
      this.getData9()
    },
    'query.invType'() {
      this.isChangeInvType = true
      this.parseData8(this.thisYearMonthData)
    },
    'query.year'() {
      this.getData3()
    },
    'query.isStop'() {
      this.getData3()
    },
    'query.stockType'() {
      this.getData3()
    },
    viewType(val) {
      if (val === '2' && !this.toggleFlag) {
        this.getData3()
        this.toggleFlag = true
      }
    }
  },
  mounted() {
    this.getData1()
    this.getData2()
    this.getData4()
    this.getData5()
    this.getData6()
    this.getData7()
    this.getData8()
    this.getData9()
  },
  methods: {
    numeral,
    formatY(v) {
      return v ? numeral(v / 100000000).format('0.00') + '亿' : '--'
    },
    formatYoy(a, b) {
      return (a && b) ? numeral((a / b) - 1).format('0.00%') : '--'
    },
    getData1() {
      this.$fetchSql('pds_cockpit', 'inv_ov_tm_intrns_wait_insp_sum').then(({data: [ret]}) => {
        this.overviewData = ret
      })
    },
    getData2() {
      this.$fetchSql('pds_cockpit', 'inv_ov_tm_sum').then(({data: [ret]}) => {
        this.overviewData2 = ret
      })
    },
    /**
     * 月度汇总
     */
    getData3() {
      this.$fetchSql('pds_cockpit', 'inv_ov_mly_sum', {
        YDATE: [this.query.year, this.query.year - 1].toString(),
        IS_STOP: this.query.isStop.toString(),
        STOCK_TYPE: this.query.stockType.toString()
      }).then(({data}) => {
        const ret = {
          [this.query.year]: Array(12).fill({}),
          [this.query.year - 1]: Array(12).fill({})
        }
        for (let item of data) {
          const year = moment(item.MDATE).year()
          const month = moment(item.MDATE).month()
          ret[year][month] = item
        }
        this.$refs.chart10.clear()
        this.options10.series[0].name = this.query.year
        this.options10.series[0].data = ret[this.query.year].map(_ => _['TOT_INV_AMT'])

        this.options10.series[1].name = this.query.year - 1
        this.options10.series[1].data = ret[this.query.year - 1].map(_ => _['TOT_INV_AMT'])

        this.yearMonthValues = ret

        const curYear = moment().year()
        const curMon = moment().month() + 1
        const len = () => this.query.year === curYear ? curMon : 12
        const calc = (arr) => {
          return arr.reduce((acc, cur) => {
            return acc + (cur['TOT_INV_AMT'] || 0)
          }, 0)
        }
        const thisYearTot = {
          yearTotAvg: calc(ret[this.query.year]) / len(),
          monTotAvg: calc(ret[this.query.year].slice(0, len())) / len(),
        }

        const lastYearTot = {
          yearTotAvg: calc(ret[this.query.year - 1]) / 12,
          monTotAvg: calc(ret[this.query.year - 1].slice(0, len())) / len(),
        }

        this.thisYearTot = thisYearTot
        this.lastYearTot = lastYearTot

      })
    },
    /**
     * 未来30天在途
     */
    getData4() {
      this.$fetchSql('pds_cockpit', 'inv_ov_tm_nxt30_days_intrns').then(({data}) => {
        this.$refs.chart4 && this.$refs.chart4.clear()
        this.options4.xAxis.data = data.map(_ => _['TDATE'])
        this.options4.series[0].data = data.map(_ => _['INTRNS_AMT'])
      })
    },
    /**
     * 未来四个月在途
     */
    getData5() {
      this.$fetchSql('pds_cockpit', 'inv_ov_nxt_4mons_intrns').then(({data}) => {
        this.$refs.chart5.clear()
        const _data = orderBy(data, ['MDATE'])
        this.options5.series[0].data = _data.map(_ => _['INTRNS_AMT'])
        this.options5.xAxis.data = _data.map(_ => _['MDATE'])
      })
    },
    /**
     * 近30天报检分布
     */
    getData6() {
      this.$fetchSql('pds_cockpit', 'inv_ov_tm_lst_30days_insp').then(({data}) => {
        const _data = orderBy(data, ['TDATE'])
        this.$refs.chart6 && this.$refs.chart6.clear()
        this.options6.xAxis.data = _data.map(_ => _['TDATE'])
        this.options6.series[0].data = _data.map(_ => _['WAIT_INSP_AMT'])
      })
    },
    /**
     * 报检金额趋势
     */
    getData7() {
      this.$fetchSql('pds_cockpit', 'inv_ov_tm_insp_trend').then(({data}) => {
        const year = moment().year()
        const ret = {
          [year]: Array(12).fill({}),
          [year - 1]: Array(12).fill({})
        }
        for (let item of data) {
          const year = moment(item['TDATE']).year()
          const month = moment(item['TDATE']).month()
          ret[year][month] = item
        }

        this.$refs.chart7 && this.$refs.chart7.clear()
        this.options7.series[0].name = year
        this.options7.series[0].data = ret[year].map(_ => _['WAIT_INSP_AMT'])

        this.options7.series[1].name = year - 1
        this.options7.series[1].data = ret[year - 1].map(_ => _['WAIT_INSP_AMT'])
      })
    },
    /**
     * 接口同月度汇总，但数据处理不一样
     */
    getData8() {
      const year = moment().year()
      this.$fetchSql('pds_cockpit', 'inv_ov_mly_sum', {
        YDATE: [year, year - 1].toString(),
      }).then(({data}) => {
        const ret = {
          [year]: Array(12).fill({}),
          [year - 1]: Array(12).fill({})
        }
        for (let item of data) {
          const year = moment(item.MDATE).year()
          const month = moment(item.MDATE).month()
          ret[year][month] = item
        }
        this.thisYearMonthData = ret
        this.parseData8(ret)
      })
    },
    parseData8(ret) {
      const year = moment().year()
      const month = moment().month()
      const props = {1: 'TOT_INV_AMT', 2: 'LINSY_INV_AMT', 3: 'SPL_INV_AMT'}
      const props2 = {1: 'FS_INV_AMT', 2: 'QD_INV_AMT', 3: 'CD_INV_AMT', 4: 'SHG_INV_AMT', 5: 'OVERSEA_INV_AMT', 6: 'DIR_SEND_INV_AMT'}
      this.$refs.chart1 && this.$refs.chart1.clear()
      if (this.query.valueType === '2' && this.query.invType !== '0') {
        this.options1.series[0].data = ret[year].map(_ => _[props2[this.query.invType]])
        this.options1.series[1].data = ret[year - 1].map(_ => _[props2[this.query.invType]])
      } else {
        this.options1.series[0].data = ret[year].map(_ => _[props[this.query.valueType]])
        this.options1.series[1].data = ret[year - 1].map(_ => _[props[this.query.valueType]])
      }

      if(this.isChangeInvType) {
        this.isChangeInvType = false
        return
      }

      this.$refs.chart2 && this.$refs.chart2.clear()
      // this.options2.xAxis.data[0] = '林氏仓'
      this.options2.series[0].data = [
        ret[year][month]['LINSY_INV_AMT'],
        ret[year][month]['SPL_INV_AMT'],
      ]
      this.options2.series[1].data = [
        ret[year - 1][month]['LINSY_INV_AMT'],
        ret[year - 1][month]['SPL_INV_AMT'],
      ]
    },
    getData9() {
      const props = {1: '', 2: '林氏仓', 3: '供应仓'}
      const ym1 = moment().format('YYYYMM')
      const ym2 = moment().subtract(1, 'year').format('YYYYMM')
      this.$fetchSql('pds_cockpit', 'inv_ov_mly_sum_is_stop', {
        MDATE: [ym1, ym2].toString(),
        STOCK_TYPE: props[this.query.valueType]
      }).then(({data}) => {
        this.$refs.chart3 && this.$refs.chart3.clear()

        const thisYearData = data.find(item => moment(item['MDATE']).format('YYYYMM') === ym1)
        const lastYearData = data.find(item => moment(item['MDATE']).format('YYYYMM') === ym2)
        this.options3.series[0].data = [
          thisYearData['UNSTOP_INV_AMT'],
          thisYearData['STOP_INV_AMT']
        ]
        this.options3.series[1].data = [
          lastYearData['UNSTOP_INV_AMT'],
          lastYearData['STOP_INV_AMT']
        ]
      })
    },
    mouseenter(col, row,type) {
      this.curCol = col
      this.curRow = row
      this.curType = type
    },
    jumpTarget() {
        let str = ''
        if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
            str = 'http://test.bi.linshimuye.com:9090/x/4_647_809_929'
        }
        else {
            str = 'http://bi.linshimuye.com:9090/x/4_647_809_929'
        }
        let msg = {
            url: str,
            webTitle: '库存总览'
        }
        window.parent.postMessage(JSON.stringify(msg), '*')
    }

  }
}
</script>

<style lang="scss" scoped>
/deep/ .ant-radio-wrapper {
  font-size: 12px;
}

.inventoryWrapper {
  height: calc(var(--height) * 1px - 24px - 11px);
  display: flex;
  justify-content: space-between;

  > div {
    width: calc((100% - 40px) / 3);
  }
}

.ch1 {
  height: calc((var(--height) - 165) * .5px - 11px);
}

.ch2 {
  height: calc((var(--height) - 135) * .5px - 11px);
}

.ch10 {
  height: calc((var(--height) - 50) * .5px);
}

.dashboard-common-table {
  /deep/ tr {
    height: calc(((var(--height) - 50) * .3px) / 5);
  }
}

/deep/ .Jump {
  margin-top: 0px;
  padding-left: 15px;
  color: #2F67E4;
  cursor: pointer;
  .svg g{
     fill: #2F67E4
  }
}
/deep/ .Jump:hover{
    color: #48A3FC;
    .svg g{
        fill: #48A3FC
    }
}
</style>
