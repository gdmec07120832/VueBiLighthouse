<template>
  <div class="px15">
    <div class="flex-between py5" style="padding-top: 10px;padding-bottom: 10px;">
      <div class="flex flex-start">
        <!-- <span class="chart-sub-title">新品概览</span> -->
        <Title :label="'新品概览'" />
        <Jump class="JumpCss" @click.native="jumpTarget" />
      </div>
      <div>
        <a-radio-group v-model="viewType">
          <a-radio value="1">当月</a-radio>
          <a-radio value="2">月度</a-radio>
        </a-radio-group>        
      </div>
    </div>

    <div class="flex-between" style="align-items: flex-start" v-if="viewType === '1'">
      <div style="flex: 0 0 calc(39%)">
        <div style="line-height: 24px;display: flex;">
          <div>新品销售概览</div>
        </div>
        <div class="ch1 flex-between" style="width: 100%">
          <div style="width: calc( 1 / 3 * 100%); height: 100%; position: relative">
            <div style="position: absolute; font-size: 12px; left: 0; right: 0; top: 10px">业绩达成</div>
            <PercentageCircle :size="110" :percent="options1.series[0].data[0]"/>
          </div>
          <div style="width: calc( 1 / 3 * 100%); height: 100%; position: relative">
            <div style="position: absolute; font-size: 12px; left: 10px; top: 10px">业绩占大盘比</div>
            <PercentageCircle :size="110" :percent="options2.series[0].data[0]"/>
          </div>
          <div style="width: calc( 1 / 3 * 100%); height: 100%; position: relative">
            <div style="position: absolute; font-size: 12px; left: 10px; top: 10px">新品SKU数占大盘比</div>
            <PercentageCircle :size="110" :percent="options3.series[0].data[0]"/>
          </div>
        </div>
        <div>
          <table class="table0">
            <tr class="TitleOn">
              <td>指标</td>
              <td>实际</td>
              <td>同期</td>
              <td>同比</td>
              <td>占大盘</td>
            </tr>
            <tr>
              <td @mouseenter="mouseenter(0, 0,null)"
                :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}"
              >新品业绩</td>
              <td @mouseenter="mouseenter(0, 1,null)"
                :style="{background:(curCol === 0) || (curRow === 1) ? hoverColor : null,}"
              >{{ numeral(overviewData['NEW_SALE_AMT'] / 10000).format('0,0') }}万</td>

              <td @mouseenter="mouseenter(0, 2,null)"
                :style="{background:(curCol === 0) || (curRow === 2) ? hoverColor : null,}"
              >{{ numeral(overviewData['AGO_NEW_SALE_AMT'] / 10000).format('0,0') }}万</td>

              <td @mouseenter="mouseenter(0, 3,null)" 
                :style="{background:(curCol === 0) || (curRow === 3) ? hoverColor : null,}"
                :class="{'text-red': overviewData['NEW_MTRL_AMT_YOY'] > 0, 'text-green': overviewData['NEW_MTRL_AMT_YOY'] < 0}">
                {{ numeral(overviewData['NEW_MTRL_AMT_YOY']).format('0.00%') }}
              </td>
              <td @mouseenter="mouseenter(0, 4,null)" 
                :style="{background:(curCol === 0) || (curRow === 4) ? hoverColor : null,}"
              >
                {{ numeral(overviewData['NEW_MTRL_TOT_AMT_RTO']).format('0.00%') }}
              </td>
            </tr>
            <tr>
              <td @mouseenter="mouseenter(1, 0,null)"
                :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
              >SKU均值</td>
              <td @mouseenter="mouseenter(1, 1,null)"
                :style="{background:(curCol === 1) || (curRow === 1) ? hoverColor : null,}"
              >
                {{ numeral(overviewData['NEW_MTRL_SKU_AVG_AMT'] / 10000).format('0,0') }}万
              </td>
              <td @mouseenter="mouseenter(1, 2,null)"
                :style="{background:(curCol === 1) || (curRow === 2) ? hoverColor : null,}"
              > {{ numeral(overviewData['AGO_NEW_MTRL_SKU_AVG_AMT'] / 10000).format('0,0') }}万</td>

              <td @mouseenter="mouseenter(1, 3,null)"
                :style="{background:(curCol === 1) || (curRow === 3) ? hoverColor : null,}"
                :class="{'text-red': overviewData['NEW_MTRL_SKU_AVG_AMT_YOY'] > 0, 'text-green': overviewData['NEW_MTRL_SKU_AVG_AMT_YOY'] < 0}">
                {{ numeral(overviewData['NEW_MTRL_SKU_AVG_AMT_YOY']).format('0.00%') }}
              </td>
              <td @mouseenter="mouseenter(1, 4,null)"
                :style="{background:(curCol === 1) || (curRow === 4) ? hoverColor : null,}"
              >
                ——
              </td>
            </tr>
            <tr>
              <td @mouseenter="mouseenter(2, 0,null)"
                :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
              >销售新品SKU数</td>
              <td @mouseenter="mouseenter(2, 1,null)"
                :style="{background:(curCol === 2) || (curRow === 1) ? hoverColor : null,}"
              >{{ numeral(overviewData['SKU_CNT']).format('0,0') }}</td>

              <td @mouseenter="mouseenter(2, 2,null)" 
                :style="{background:(curCol === 2) || (curRow === 2) ? hoverColor : null,}"
              >{{ numeral(overviewData['AGO_SKU_CNT']).format('0,0') }}</td>

              <td @mouseenter="mouseenter(2, 3,null)"  
                :style="{background:(curCol === 2) || (curRow === 3) ? hoverColor : null,}"
                :class="{'text-red': overviewData['NEW_MTRL_SKU_CNT_YOY'] > 0, 'text-green': overviewData['NEW_MTRL_SKU_CNT_YOY'] < 0}">
                {{ numeral(overviewData['NEW_MTRL_SKU_CNT_YOY']).format('0.00%') }}
              </td>
              <td @mouseenter="mouseenter(2, 4,null)"
                :style="{background:(curCol === 2) || (curRow === 4) ? hoverColor : null,}"
              >{{ numeral(overviewData['NEW_MTRL_TOT_SKU_CNT_RTO']).format('0.00%') }}</td>
            </tr>
            <tr>
              <td @mouseenter="mouseenter(3, 0,null)"
                :style="{background:(curCol === 3) || (curRow === 0) ? hoverColor : null,}"
              >销售新品SPU数</td>
              <td @mouseenter="mouseenter(3, 1,null)"
                :style="{background:(curCol === 3) || (curRow === 1) ? hoverColor : null,}"
              >{{ numeral(overviewData['SPU_CNT']).format('0,0') }}</td>

              <td @mouseenter="mouseenter(3, 2,null)"
                :style="{background:(curCol === 3) || (curRow === 2) ? hoverColor : null,}"
              >{{ numeral(overviewData['AGO_SPU_CNT']).format('0,0') }}</td>
              <td @mouseenter="mouseenter(3, 3,null)"
                :style="{background:(curCol === 3) || (curRow === 3) ? hoverColor : null,}"
                :class="{'text-red': overviewData['NEW_MTRL_SPU_CNT_YOY'] > 0, 'text-green': overviewData['NEW_MTRL_SPU_CNT_YOY'] < 0}">
                {{ numeral(overviewData['NEW_MTRL_SPU_CNT_YOY']).format('0.00%') }}
              </td>
              <td @mouseenter="mouseenter(3, 4,null)"
                :style="{background:(curCol === 3) || (curRow === 4) ? hoverColor : null,}"
              >
                {{ numeral(overviewData['NEW_MTRL_TOT_SPU_CNT_RTO']).format('0.00%') }}
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div style="flex: 0 0 calc(59%)">
        <div style="line-height: 24px;">项目组新品概览</div>
        <SortTable v-bind="table" :sorter.sync="table.sorter" @sortCol="handleSort"/>
      </div>
    </div>

    <div v-if="viewType === '2'">
      <div class="flex flex-start" style="height: 30px;justify-content: flex-end;">
        <span style="flex: 0 0 100px" class="text-xs">指标选择：</span>
        <div>
          <a-radio-group v-model="query.propType">
            <a-radio style="width: 120px" value="1">新品业绩</a-radio>
            <a-radio style="width: 120px" value="2">SKU均值</a-radio>
            <a-radio style="width: 120px" value="3">销售新品SKU数</a-radio>
            <a-radio style="width: 120px" value="4">销售新品SPU数</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="flex flex-start" style="height: 30px;justify-content: flex-end;">
        <DropdownSelect label="项目组：" style="padding-right: 25px;">
          <div slot="selectedText" class="px10 text-ellipsis" style="width: 80px">{{ query.team.join(';') }}</div>
          <a-checkbox-group v-model="query.team">
            <div v-for="item in teamOptions" :key="item" >
              <a-checkbox :value="item">
                {{ item }}
              </a-checkbox>              
            </div>
          </a-checkbox-group>
        </DropdownSelect>      
        <DropdownSelect label="统计年月" style="">
          <div slot="selectedText" class="text-gary text-xs">（{{ query.year }}）</div>
          <template>
            <a-radio-group v-model="query.year">
              <div v-for="y in yearOptions" :key="y">
                <a-radio :value="y">{{ y }}</a-radio>
              </div>
            </a-radio-group>
          </template>
        </DropdownSelect>        
        <!-- <span style="flex: 0 0 100px" class="text-xs">项目组：</span>
        <div>
          <a-checkbox-group v-model="query.team">
            <a-checkbox style="width: 120px" v-for="item in teamOptions" :key="item" :value="item">
              {{ item }}
            </a-checkbox>
          </a-checkbox-group>
        </div> -->
      </div>
      <div class="ch2" style="position: relative">
        <!-- <DropdownSelect label="统计年月" style="position: absolute; top: 0; right: 0; z-index: 99">
          <div slot="selectedText" class="text-gary text-xs">（{{ query.year }}）</div>
          <template>
            <a-radio-group v-model="query.year">
              <div v-for="y in yearOptions" :key="y">
                <a-radio :value="y">{{ y }}</a-radio>
              </div>
            </a-radio-group>
          </template>
        </DropdownSelect> -->
        <v-chart ref="chart0" autoresize :options="options0"/>
      </div>
      <div>
        <table class="dashboard-common-table">
          <tr>
            <td>指标</td>
            <td>年累计</td>
            <td v-for="item in months" :key="item">{{ item + '月' }}</td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(0, 0,null)"
              :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}">{{ query.year }}年</td>
            <td @mouseenter="mouseenter(0, 1,null)"
              :style="{background:(curCol === 0) || (curRow === 1) ? hoverColor : null,}"
            >{{ calcYearTot(query.year)[0] }}</td>

            <td @mouseenter="mouseenter(0, (m+'月'),null)"
              :style="{background:(curCol === 0) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ calcValue1(query.year, m - 1) }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(1, 0,null)"
              :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
            >同期</td>
            <td @mouseenter="mouseenter(1, 1,null)"
              :style="{background:(curCol === 1) || (curRow === 1) ? hoverColor : null,}"
            >{{ calcYearTot(query.year)[1] }}</td>
            <td @mouseenter="mouseenter(1, (m+'月'),null)"
              :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ calcValue1(query.year - 1, m - 1) }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(2, 0,null)"
              :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
            >同增</td>
            <td @mouseenter="mouseenter(2, 1,null)"
              :style="{background:(curCol === 2) || (curRow === 1) ? hoverColor : null,}"
            >{{ calcYearTot(query.year)[2] }}</td>
            <td @mouseenter="mouseenter(2, (m+'月'),null)"
              :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">{{ calcValue2(query.year, m - 1, 1) }}</td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(3, 0,null)"
              :style="{background:(curCol === 3) || (curRow === 0) ? hoverColor : null,}"
            >同比</td>
            <td @mouseenter="mouseenter(3, 1,null)" 
              :style="{background:(curCol === 3) || (curRow === 1) ? hoverColor : null,}">
              {{ calcYearTot(query.year)[3] }}</td>
            <td @mouseenter="mouseenter(3, (m+'月'),null)" 
              :style="{background:(curCol === 3) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">{{ calcValue2(query.year, m - 1) }}</td>
          </tr>

          <tr v-if="query.propType === '1'">
            <td @mouseenter="mouseenter(4, 0,null)"
              :style="{background:(curCol === 4) || (curRow === 0) ? hoverColor : null,}"
            >占大盘比</td>
            <td @mouseenter="mouseenter(4, 1,null)"
              :style="{background:(curCol === 4) || (curRow === 1) ? hoverColor : null,}"
            >{{ calcValue6(query.year) }}</td>
            <td @mouseenter="mouseenter(4, (m+'月'),null)"
              :style="{background:(curCol === 4) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ calcValue5(query.year, m - 1) }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(5, 0,null)"
              :style="{background:(curCol === 5) || (curRow === 0) ? hoverColor : null,}"
            >达成</td>
            <td @mouseenter="mouseenter(5, 1,null)" 
              :style="{background:(curCol === 5) || (curRow === 1) ? hoverColor : null,}"
              :class="{
               'text-red': calcValue4(query.year) === '达标',
                'text-green': calcValue4(query.year) === '不达标',
              }">
              {{ calcValue4(query.year) || '--' }}
            </td>
            <td @mouseenter="mouseenter(5, (m+'月'),null)" 
              :style="{background:(curCol === 5) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m" :class="{
              'text-red': calcValue3(query.year, m - 1) === '达标',
              'text-green': calcValue3(query.year, m - 1) === '不达标',
            }">
              {{ calcValue3(query.year, m - 1) || '--' }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import graphic from 'echarts/lib/util/graphic'
import DropdownSelect from '@/views/BIView/components/DropdownSelect/DropdownSelect'
import moment from 'moment'
import SortTable from '@/views/BIView/PsDashboard/components/SortTable/SortTableTcq'
import orderBy from 'lodash/orderBy'
import PercentageCircle from '@/views/BIView/PsDashboard/Tabs/LivePerf/PercentageCircle'
import {isUndef} from "@/utils/helper";

import Jump from '@/views/BIView/PsDashboard/components/Jump'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'


export default {
  name: 'NewProductOverview',
  components: {SortTable, DropdownSelect, PercentageCircle,Jump,Title},
  data() {
    const months = Array(12).fill(null).map((_, i) => i + 1)
    const thisYear = (new Date()).getFullYear()
    return {
      months,
      teamOptions: [],
      yearOptions: [thisYear, thisYear - 1, thisYear - 2],
      viewType: '1',
      table: {
        sorter: {col: '', type: ''},
        bodyStyle: {height: 'calc((var(--height) - 80) * 1px / 10 * 9 - 11px)'},
        thHeight: 'calc((var(--height) - 80) * 1px / 10)',
        trHeight: 'calc((var(--height) - 80) * 1px / 10)',
        dataSource: [],
        columns: [
          {title: '项目组', dataIndex: 'TEAM_SUPPLY', align: 'left'},
          {
            title: '新品业绩', dataIndex: 'NEW_SALE_AMT', render: (h, {row, cellProp}) => {
              return <span>{this.formatW(row[cellProp])}</span>
            }, sortable: true
          },
          {
            title: '新品占大盘', dataIndex: 'NEW_MTRL_TOT_AMT_RTO', render: (h, {row, cellProp}) => {
              return <span>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
          {
            title: 'SKU均值', dataIndex: 'NEW_MTRL_SKU_AVG_AMT', render: (h, {row, cellProp}) => {
              return <span>{this.formatW(row[cellProp])}</span>
            }, sortable: true
          },
          {
            title: 'SKU均值同比', dataIndex: 'NEW_MTRL_SKU_AVG_AMT_YOY', render: (h, {row, cellProp}) => {
              return <span class={{
                'text-red': row[cellProp] && row[cellProp] > 0,
                'text-green': row[cellProp] && row[cellProp] < 0,
              }}>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
          {title: '销售新品SKU数', dataIndex: 'SKU_CNT', sortable: true},
          {
            title: 'SKU数占大盘', dataIndex: 'NEW_MTRL_TOT_SKU_CNT_RTO', render: (h, {row, cellProp}) => {
              return <span>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
          {
            title: 'SKU数同比', dataIndex: 'NEW_MTRL_SKU_CNT_YOY', render: (h, {row, cellProp}) => {
              return <span class={{
                'text-red': row[cellProp] && row[cellProp] > 0,
                'text-green': row[cellProp] && row[cellProp] < 0,
              }}>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
          {title: '销售总SKU数', dataIndex: 'SUM_SKU_CNT', sortable: true},
        ]
      },
      options1: {
        tooltips: {show: false},
        series: [
          {
            type: 'gauge',
            radius: '70%',
            center: ['50%', '60%'],
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {show: false},
            axisLine: {show: false},
            itemStyle: {
              color: '#2680eb'
            },
            data: [0],
            pointer: {
              show: true,
              width: 5,
              length: '50%'
            },
            detail: {
              fontSize: 14,
              color: '#808492',
              formatter(val) {
                return val + '%'
              }
            }
          },
          {
            type: 'gauge',
            z: 10,
            radius: '70%',
            center: ['50%', '60%'],
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            axisTick: {show: false},
            splitLine: {show: false},
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 12,
                color: [
                  [0, new graphic.LinearGradient(0, 0, 1, 0, [
                    {offset: 0, color: '#2680eb'},
                    {offset: 1, color: '#2680eb'}
                  ])],
                  [1, '#f1f3f5']
                ]
              }
            },
            axisLabel: {show: false},
            detail: {
              show: false
            }
          }
        ]
      },
      options0: {
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
          top: 20,
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
            color: '#999'
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
              // type: 'dashed',
              // color: ['#ececee']
              type: 'solid',
              color: echartsColor.splitLine,
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
              // color: '#2680eb'
              color: echartsColor.thisYear
            },
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
            data: [],
            symbol: 'none',
          },
          {
            type: 'line',
            name: thisYear - 1,
            smooth: true,
            itemStyle: {
              // color: '#cce0e9'
              color: echartsColor.previousYear,
            },
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
            symbol: 'none',
          }
        ]
      },
      options2: {
        tooltips: {show: false},
        series: [
          {
            type: 'gauge',
            radius: '70%',
            center: ['50%', '60%'],
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {show: false},
            axisLine: {show: false},
            itemStyle: {
              color: '#2680eb'
            },
            data: [0],
            pointer: {
              show: true,
              width: 5,
              length: '50%'
            },
            detail: {
              fontSize: 14,
              color: '#808492',
              formatter(val) {
                return val + '%'
              }
            }
          },
          {
            type: 'gauge',
            z: 10,
            radius: '70%',
            center: ['50%', '60%'],
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            axisTick: {show: false},
            splitLine: {show: false},
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 12,
                color: [
                  [0, new graphic.LinearGradient(0, 0, 1, 0, [
                    {offset: 0, color: '#2680eb'},
                    {offset: 1, color: '#2680eb'}
                  ])],
                  [1, '#f1f3f5']
                ]
              }
            },
            axisLabel: {show: false},
            detail: {
              show: false
            }
          }
        ]
      },
      options3: {
        tooltips: {show: false},
        series: [
          {
            type: 'gauge',
            radius: '70%',
            center: ['50%', '60%'],
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {show: false},
            axisLine: {show: false},
            itemStyle: {
              color: '#2680eb'
            },
            data: [0],
            pointer: {
              show: true,
              width: 5,
              length: '50%'
            },
            detail: {
              fontSize: 14,
              color: '#808492',
              formatter(val) {
                return val + '%'
              }
            }
          },
          {
            type: 'gauge',
            z: 10,
            radius: '70%',
            center: ['50%', '60%'],
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            axisTick: {show: false},
            splitLine: {show: false},
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 12,
                color: [
                  [0, new graphic.LinearGradient(0, 0, 1, 0, [
                    {offset: 0, color: '#2680eb'},
                    {offset: 1, color: '#2680eb'}
                  ])],
                  [1, '#f1f3f5']
                ]
              }
            },
            axisLabel: {show: false},
            detail: {
              show: false
            }
          }
        ]
      },
      query: {
        team: [],
        propType: '1', // 指标
        year: (new Date()).getFullYear()
      },
      teamData: [],
      overviewData: {},
      yearMonthValues: [],
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,
    }
  },
  watch: {
    viewType(val) {
      if (val === '2' && !this.toggleFlag) {
        this.getData3()
        this.toggleFlag = true
      }
    },
    'query.propType'() {
      if (this.viewType === '2') {
        this.toggleFlag2 = false
        this.getData3()
      }
    },
    'query.team'() {
      this.toggleFlag2 = false
      this.getData3()
    },
    'query.year'() {
      this.toggleFlag2 = false
      this.getData3()
    }
  },
  mounted() {
    this.getData1()
    this.getData2()
  },
  methods: {
    numeral,
    formatW(v) {
      return v ? numeral(v / 10000).format('0,0') + '万' : '--'
    },
    formatRto(v) {
      return v ? numeral(v).format('0.00%') : '--'
    },
    getData1() {
      this.$fetchSql('pds_cockpit', 'new_mtrl_tm_spl').then(({data}) => {
        this.teamData = data
        this.table.dataSource = orderBy(data, ['NEW_MTRL_TOT_AMT_RTO'], ['desc'])
        this.teamOptions = data.map(_ => _['TEAM_SUPPLY'])
      })
    },
    handleSort(sorter) {
      if (sorter.col && sorter.type) {
        this.table.dataSource = orderBy(this.table.dataSource, [sorter.col], [sorter.type])
      } else {
        this.table.dataSource = orderBy(this.table.dataSource, ['NEW_MTRL_TOT_AMT_RTO'], ['desc'])
      }
    },
    getData2() {
      this.$fetchSql('pds_cockpit', 'new_mtrl_tm_sum').then(({data}) => {
        this.options1.series[0].data = [(data[0]['NEW_MTRL_CMPL_RTO'] * 100).toFixed(2)]
        this.options1.series[1].axisLine.lineStyle.color[0][0] = data[0]['NEW_MTRL_CMPL_RTO']

        this.options2.series[0].data = [(data[0]['NEW_MTRL_TOT_AMT_RTO'] * 100).toFixed(2)]
        this.options2.series[1].axisLine.lineStyle.color[0][0] = data[0]['NEW_MTRL_TOT_AMT_RTO']

        this.options3.series[0].data = [(data[0]['NEW_MTRL_TOT_SKU_CNT_RTO'] * 100).toFixed(2)]
        this.options3.series[1].axisLine.lineStyle.color[0][0] = data[0]['NEW_MTRL_TOT_SKU_CNT_RTO']

        this.overviewData = data[0]
      })
    },
    getData3() {
      this.$fetchSql('pds_cockpit', 'new_mtrl_mly_dtl', {
        YDATE: [this.query.year, this.query.year - 1].toString(),
        TEAM_SUPPLY: this.query.team.toString()
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

        this.yearMonthValues = ret
        this.parseData3()
      })
    },
    parseData3() {
      const props = {1: 'NEW_SALE_AMT', 2: 'NEW_MTRL_SKU_AVG_AMT', 3: 'SKU_CNT', 4: 'SPU_CNT'}
      if (!this.toggleFlag2) {
        this.$refs.chart0 && this.$refs.chart0.clear()
        this.toggleFlag2 = true
      }
      this.options0.series[0].name = this.query.year
      this.options0.series[0].data = this.yearMonthValues[this.query.year].map(_ => _[props[this.query.propType]])
      this.options0.series[1].name = this.query.year - 1
      this.options0.series[1].data = this.yearMonthValues[this.query.year - 1].map(_ => _[props[this.query.propType]])
    },
    calcValue1(year, month) {
      const props = {1: 'NEW_SALE_AMT', 2: 'NEW_MTRL_SKU_AVG_AMT', 3: 'SKU_CNT', 4: 'SPU_CNT'}
      const value = this.yearMonthValues?.[year]?.[month]?.[props[this.query.propType]]

      if (value) {
        if (['1'].indexOf(this.query.propType) > -1) {
          return numeral(value / 10000).format('0,0') + '万'
        } else if (this.query.propType === '2') {
          return numeral(value / 10000).format('0,0.00') + '万'
        } else {
          return numeral(value).format('0,0')
        }
      }
      return '--'
    },
    calcValue2(year, month, valueType) {
      const props = {1: 'NEW_SALE_AMT', 2: 'NEW_MTRL_SKU_AVG_AMT', 3: 'SKU_CNT', 4: 'SPU_CNT'}
      const value1 = this.yearMonthValues?.[year]?.[month]?.[props[this.query.propType]]
      const value2 = this.yearMonthValues?.[year - 1]?.[month]?.[props[this.query.propType]]
      if (value1 && value2) {
        if (valueType === 1) {
          if (['1', '2'].indexOf(this.query.propType) > -1) {
            return numeral((value1 - value2) / 10000).format('0,0') + '万'
          } else {
            return numeral((value1 - value2)).format('0,0')
          }
        } else {
          return numeral((value1 / value2) - 1).format('0.00%')
        }
      } else {
        return '--'
      }
    },
    calcYearTot(year) {
      const props = {1: 'NEW_SALE_AMT', 2: 'NEW_MTRL_SKU_AVG_AMT', 3: 'SKU_CNT', 4: 'SPU_CNT'}
      const thisYearData = (this.yearMonthValues[year] || []).filter(_ => _['MDATE'])
      let value1, value2
      if (this.query.propType === '2') {
        const a = thisYearData.reduce((acc, cur) => {
          return acc + cur['NEW_SALE_AMT']
        }, 0)
        const b = thisYearData.reduce((acc, cur) => {
          return acc + cur['SKU_CNT']
        }, 0)

        if (b) {
          value1 = a / b
        }

        const c = (this.yearMonthValues[year - 1] || []).slice(0, thisYearData.length).reduce((acc, cur) => {
          return acc + cur['NEW_SALE_AMT']
        }, 0)

        const d = (this.yearMonthValues[year - 1] || []).slice(0, thisYearData.length).reduce((acc, cur) => {
          return acc + cur['SKU_CNT']
        }, 0)

        if (d) {
          value2 = c / d
        }

      } else {
        value1 = thisYearData.reduce((acc, cur) => {
          return acc + cur[props[this.query.propType]]
        }, 0)
        // console.log(this.yearMonthValues)
        value2 = (this.yearMonthValues[year - 1] || []).slice(0, thisYearData.length).reduce((acc, cur) => {
          return acc + cur[props[this.query.propType]]
        }, 0)
      }

      if (!value1 || !value2) {
        return ['--', '--', '--', '--']
      }


      const formatValue1 = ['1'].indexOf(this.query.propType) > -1
          ? numeral(value1 / 10000).format('0,0') + '万' :
          this.query.propType === '2' ? numeral(value1 / 10000).format('0,0.00') + '万' : numeral(value1).format('0,0')
      const formatValue2 = ['1'].indexOf(this.query.propType) > -1
          ? numeral(value2 / 10000).format('0,0') + '万' :
          this.query.propType === '2' ? numeral(value2 / 10000).format('0,0.00') + '万' : numeral(value2).format('0,0')

      const value3 = ['1'].indexOf(this.query.propType) > -1
          ? numeral((value1 - value2) / 10000).format('0,0') + '万' :
          this.query.propType === '2' ? numeral((value1 - value2) / 10000).format('0,0.00') + '万' : numeral(value1 - value2).format('0,0')

      const value4 = numeral((value1 / value2) - 1).format('0.00%')

      return [formatValue1, formatValue2, value3, value4]
    },
    calcValue3(year, month) {
      if (this.query.propType === '1') {
        const value = this.yearMonthValues?.[year]?.[month]?.['NEW_SALE_AMT']
        const target = this.yearMonthValues?.[year]?.[month]?.['NEW_MTRL_TGT']
        if (!target || !value) {
          return null
        }
        if (value >= target) {
          return '达标'
        } else {
          return '不达标'
        }
      }
      return '暂无目标'
    },
    calcValue4(year) {
      // 年累计达成
      if (this.query.propType === '1') {
        const thisYearData = (this.yearMonthValues[year] || []).filter(_ => _['MDATE'])
        const value1 = thisYearData.reduce((acc, cur) => {
          return acc + cur['NEW_SALE_AMT']
        }, 0)
        const value2 = thisYearData.reduce((acc, cur) => {
          return acc + cur['NEW_MTRL_TGT']
        }, 0)
        if (!value1 || !value2) {
          return null
        }
        return value1 >= value2 ? '达标' : '不达标'
      }
      return '暂无目标'
    },
    calcValue5(year, month) {
      const value = this.yearMonthValues?.[year]?.[month]?.['NEW_MTRL_TOT_AMT_RTO']
      return isUndef(value) ? '--' : numeral(value).format('0.00%')
    },
    calcValue6(year) {
      const thisYearData = (this.yearMonthValues[year] || []).filter(_ => _['MDATE'])
      const tot1 = thisYearData.reduce((acc, cur) => {
        return acc + (cur['NEW_SALE_AMT'] || 0)
      }, 0)

      const tot2 = thisYearData.reduce((acc, cur) => {
        return acc + (cur['SUM_SALE_AMT'] || 0)
      }, 0)

      return tot2 ? numeral(tot1 / tot2).format('0.00%') : '--'
    },
    mouseenter(col, row,type) {
      this.curCol = col
      this.curRow = row
      this.curType = type
    },
    jumpTarget() {
        let str = ''
        if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
            str = 'http://test.bi.linshimuye.com:9090/x/4_1201_2365'
        }
        else {
            str = 'http://bi.linshimuye.com:9090/x/4_1201_3131_2972'
        }
        let msg = {
            url: str,
            webTitle: '新品概览'
        }
        window.parent.postMessage(JSON.stringify(msg), '*')
    }

  }
}
</script>

<style scoped lang="scss">

.px15{
  padding-top: 0px;
}

/deep/ .ant-radio-wrapper {
  font-size: 12px;
  //color: #bbb;
}

.table, .table0, .table2 {
  width: 100%;
  font-size: 12px;

  tr {
    border-bottom: 1px solid #e7e9f0;

    &:hover:not(:first-child) {
      background: #fcfcff;
    }

    &:first-child {
      color: #808492;
    }
  }

  td {
    &:first-child {
      text-align: left;
      padding-left: 15px;
    }

    text-align: right;
    padding-right: 15px;
  }
}

.table td {
  height: calc(((var(--height) - 75) * 1px) / 10);
}

.table0 td {
  height: calc(((var(--height) - 88) * 0.5px) / 5);
}

.table0{

  tr {
    td {
      border: 1px solid #e7e9f0;
      border-top: 0px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    tr:nth-child(2n) {
      background-color: #fcfcff;
    }
  }
  tr.TitleOn{
    background-color: #f5f7ff;
    td{
      border: 1px solid #e7e9f0;
    }
  }

}

.table2 {
  table-layout: fixed;

  td {
    height: calc(((var(--height) - 100) * .4px) / 6);

    &:first-child {
      color: #808492;
    }
  }
}


.dashboard-common-table {
  td {
    height: calc(((var(--height) - 100) * .45px) / 7);
  }
}


.ch1 {
  height: calc((var(--height) - 75) * 0.5px - 11px);
}

.ch2 {
  height: calc(((var(--height) - 100) * .53px - 11px));
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
