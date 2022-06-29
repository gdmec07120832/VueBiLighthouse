<template>
  <div class="px15">
    <!-- line-height: 24px; -->
    <div class="TitleHeard" style="display: flex;padding: 10px 0px;justify-content: space-between;">
      <!-- <div class="chart-sub-title" style="line-height: 41px;">售后不良</div> -->
      <div class="HeardTitle" style="display: flex;">
        <Title :label="'售后不良'" />
        <Jump class="JumpCss" @click.native="jumpTarget" />        
      </div>

      <div class="SelMonth">
        <a-radio-group v-model="viewType">
          <a-radio value="1">当月</a-radio>
          <a-radio value="2">月度</a-radio>
        </a-radio-group>        
      </div>
    </div>

    <div class="flex-between" style="height: 30px;justify-content: flex-end;" v-if="viewType === '1'">
      <div class="flex" style="padding-right: 0px;width: calc(55% - 0px);justify-content: space-between;">
        <div class="TitleName" style="color: rgba(0, 0, 0, 0.65);">不良概况</div>
        <div class="TitleOnUser">
          <DropdownSelect label="不良类型" style="margin-right: 60px">
            <div slot="selectedText" style="min-width: 130px;">{{ 
              (query.valueType==='5')? '工厂+原材料不良率':
              (query.valueType==='1')?'售后不良率':
              (query.valueType==='2')?'工厂不良率':
              (query.valueType==='3')?'原材料不良率':'物流不良率'
            }}</div>
            <a-radio-group v-model="query.valueType">
              <div>
                <a-radio value="5">工厂+原材料不良率</a-radio>  
              </div>
              <div>
                <a-radio value="1">售后不良率</a-radio>
              </div>
              <div>
                <a-radio value="2">工厂不良率</a-radio>
              </div>
              <div>
                <a-radio value="3">原材料不良率</a-radio>
              </div>
              <div>
                <a-radio value="4">物流不良率</a-radio>
              </div> 
            </a-radio-group>
          </DropdownSelect>          
        </div>
      </div>
      <div style="width: calc(45% - 0px);color: rgba(0, 0, 0, 0.65);padding-left: 10px;">项目组售后不良率</div>
    </div>

    <div class="flex-between" style="align-items: flex-start" v-if="viewType === '1'">
      <div style="width: calc(55% - 10px)">
        <div class="flex-start">
          <div style="width: 33.33%">
            <div class="text-xs" style="line-height: 30px">售后不良率</div>
            <div style="font-size: 16px; font-weight: 600; line-height: 40px">
              {{ formatRto(dataA.rto) }}
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">同期</span>
              <span class="text-xs">
                 {{ formatRto(dataA.ago) }}
              </span>
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">同比</span>
              <span class="text-xs" :class="{
                'text-red': dataA.yoy && dataA.yoy < 0,
                'text-green': dataA.yoy && dataA.yoy > 0,
              }">
                 {{ formatRto(dataA.yoy) }}
              </span>
            </div>
          </div>
          <div style="width: 33.33%">
            <div class="text-xs" style="line-height: 30px">售后不良率（非小件）</div>
            <div style="font-size: 16px; font-weight: 600; line-height: 40px">
              {{ formatRto(dataB.rto) }}
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">同期</span>
              <span class="text-xs">
                 {{ formatRto(dataB.ago) }}
              </span>
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">同比</span>
              <span class="text-xs" :class="{
                'text-red': dataB.yoy && dataB.yoy < 0,
                'text-green': dataB.yoy && dataB.yoy > 0,
              }">
                 {{ formatRto(dataB.yoy) }}
              </span>
            </div>
          </div>
          <div style="width: 33.33%">
            <div class="text-xs" style="line-height: 30px">售后不良率（小件）</div>
            <div style="font-size: 16px; font-weight: 600; line-height: 40px">
              {{ formatRto(dataC.rto) }}
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">同期</span>
              <span class="text-xs">
                {{ formatRto(dataC.ago) }}
              </span>
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">同比</span>
              <span class="text-xs" :class="{
                'text-red': dataC.yoy && dataC.yoy < 0,
                'text-green': dataC.yoy && dataC.yoy > 0,
              }">
                {{ formatRto(dataC.yoy) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex-start" style="height: 60px">
          <span class="text-black text-xs" style="flex: 0 0 100px">是否小件</span>
          <a-checkbox-group v-model="query.commodityType" style="flex:  0 0 20%">
            <a-checkbox value="是" style="width: 45%">是</a-checkbox>
            <a-checkbox value="否" style="width: 45%">否</a-checkbox>
          </a-checkbox-group>

          <div v-if="query.commodityType.length">
            <a-button type="link" @click="query.commodityType = []">清空</a-button>
          </div>
        </div>

        <div class="flex-between">
          <div class="ch1" style="width: calc(45%); position: relative">
            <span style="position: absolute; left: 0; top: 0" class="text-xs text-gary">研发类型</span>
            <v-chart autoresize :options="options1"/>
          </div>
          <div class="ch1" style="width: calc(45%); position: relative">
            <span style="position: absolute; left: 0; top: 0" class="text-xs text-gary">停产/非停产</span>
            <v-chart autoresize :options="options2"/>
          </div>
        </div>
      </div>
      <div style="width: calc(45% - 10px);padding-top: 10px;">
        <!-- <div class="text-black" style="height: 30px">项目组售后不良率</div> -->
        <SortTable :sorter.sync="sortTable.sorter" v-bind="sortTable" @sortCol="handleSort"/>
      </div>
    </div>


    <div v-if="viewType === '2'">
      <div class="flex-start mt10" style="height: 40px;justify-content: flex-end;padding-right: 15px;">
        <DropdownSelect label="不良类型" style="margin-right: 50px">
          <div slot="selectedText" style="min-width: 130px;">{{ 
            (query.valueType==='5')? '工厂+原材料不良率':
            (query.valueType==='1')?'售后不良率':
            (query.valueType==='2')?'工厂不良率':
            (query.valueType==='3')?'原材料不良率':'物流不良率'
          }}</div>
          <a-radio-group v-model="query.valueType">
            <div>
              <a-radio value="5">工厂+原材料不良率</a-radio>  
            </div>
            <div>
              <a-radio value="1">售后不良率</a-radio>
            </div>
            <div>
              <a-radio value="2">工厂不良率</a-radio>
            </div>
            <div>
              <a-radio value="3">原材料不良率</a-radio>
            </div>
            <div>
              <a-radio value="4">物流不良率</a-radio>
            </div> 
          </a-radio-group>
        </DropdownSelect>

        <DropdownSelect label="统计年份" style="margin-right: 50px">
          <div slot="selectedText">{{ query2.year }}</div>
          <a-radio-group v-model="query2.year">
            <div v-for="y in yearOptions" :key="y">
              <a-radio :value="y">{{ y }}</a-radio>
            </div>
          </a-radio-group>
        </DropdownSelect>

        <DropdownSelect label="项目组" style="margin-right: 50px">
          <div slot="selectedText" style="width: 100px;" class="text-ellipsis px20">
            {{ query2.teams.join(';') }}
          </div>
          <a-checkbox-group v-model="query2.teams">
            <div v-for="t in teamOptions" :key="t">
              <a-checkbox :value="t">{{ t }}</a-checkbox>
            </div>
          </a-checkbox-group>
        </DropdownSelect>

        <DropdownSelect label="是否小件">
          <div slot="selectedText" class="text-ellipsis px20">{{ query2.commodityType.join(';') }}</div>
          <a-checkbox-group v-model="query2.commodityType">
            <div>
              <a-checkbox value="是">是</a-checkbox>
            </div>
            <div>
              <a-checkbox value="否">否</a-checkbox>
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
            <td></td>
            <td>年累计</td>
            <td>当期累计</td>
            <td v-for="item in months" :key="item">{{ item }}月</td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(0, 0,null)"
              :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}"
            >当期目标</td>
            <td @mouseenter="mouseenter(0, 1,null)"
              :style="{background:(curCol === 0) || (curRow === 1) ? hoverColor : null,}"
            >/</td>
            <td @mouseenter="mouseenter(0, 2,null)"
              :style="{background:(curCol === 0) || (curRow === 2) ? hoverColor : null,}"
            >/</td>
            <td @mouseenter="mouseenter(0, (m+'月'),null)" 
              :style="{background:(curCol === 0) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{
                query.valueType === '5' ?
                    formatRto(
                        ((yearMonthValues[query2.year] || [])[m - 1] || {})['TGT_AUD_BAD_RATIO']
                    )
                    : '--'

              }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(1, 0,null)"
              :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
            >{{ query2.year }}</td>
            <td @mouseenter="mouseenter(1, 1,null)"
              :style="{background:(curCol === 1) || (curRow === 1) ? hoverColor : null,}"
            >
              {{ formatRto(yearTot.thisYear) }}
            </td>
            <td @mouseenter="mouseenter(1, 2,null)"
              :style="{background:(curCol === 1) || (curRow === 2) ? hoverColor : null,}"
            >
              {{ formatRto(curTot.thisYear) }}
            </td>
            <td @mouseenter="mouseenter(1, (m+'月'),null)" 
              :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{
                formatRto(
                    ((yearMonthValues[query2.year] || [])[m - 1] || {})[valueProps[query.valueType]]
                )
              }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(2, 0,null)"
              :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
            >{{ query2.year - 1 }}</td>
            <td @mouseenter="mouseenter(2, 1,null)"
              :style="{background:(curCol === 2) || (curRow === 1) ? hoverColor : null,}"
            >
              {{ formatRto(yearTot.lastYear) }}
            </td>
            <td @mouseenter="mouseenter(2, 2,null)"
              :style="{background:(curCol === 2) || (curRow === 2) ? hoverColor : null,}"
            >
              {{ formatRto(curTot.lastYear) }}
            </td>
            <td @mouseenter="mouseenter(2, (m+'月'),null)" 
              :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{
                formatRto(
                    ((yearMonthValues[query2.year - 1] || [])[m - 1] || {})[valueProps[query.valueType]]
                )
              }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(3, 0,null)"
              :style="{background:(curCol === 3) || (curRow === 0) ? hoverColor : null,}"
            >同比增长</td>
            <td @mouseenter="mouseenter(3, 1,null)"
              :style="{background:(curCol === 3) || (curRow === 1) ? hoverColor : null,}"
            >
              {{ formatRto((yearTot.thisYear / yearTot.lastYear) - 1) }}
            </td>
            <td @mouseenter="mouseenter(3, 2,null)"
              :style="{background:(curCol === 3) || (curRow === 2) ? hoverColor : null,}"
            >
              {{ formatRto((curTot.thisYear / curTot.lastYear) - 1) }}
            </td>
            <td @mouseenter="mouseenter(3, (m+'月'),null)"
              :style="{background:(curCol === 3) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{
                formatRto(
                    ((yearMonthValues[query2.year] || [])[m - 1] || {})[valueProps[query.valueType] + '_YOY']
                )
              }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(4, 0,null)"
              :style="{background:(curCol === 4) || (curRow === 0) ? hoverColor : null,}"
            >是否达标</td>
            <td @mouseenter="mouseenter(4, 1,null)"
              :style="{background:(curCol === 4) || (curRow === 1) ? hoverColor : null,}"
            >--</td>
            <td @mouseenter="mouseenter(4, 2,null)"
              :style="{background:(curCol === 4) || (curRow === 2) ? hoverColor : null,}"
            >--</td>
            <td @mouseenter="mouseenter(4, (m+'月'),null)"
              :style="{background:(curCol === 4) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m" :class="{
              'text-red': query.valueType === '5' && ((yearMonthValues[query2.year] || [])[m - 1] || {})['IS_SHBLS_RTO_CMPL'] === '是',
              'text-green': query.valueType === '5' && ((yearMonthValues[query2.year] || [])[m - 1] || {})['IS_SHBLS_RTO_CMPL'] === '否',

            }">
              {{
                query.valueType === '5' ?
                    ((yearMonthValues[query2.year] || [])[m - 1] || {})['IS_SHBLS_RTO_CMPL']
                    : '--'
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
import orderBy from 'lodash/orderBy'
import DropdownSelect from '@/views/BIView/components/DropdownSelect/DropdownSelect'
import SortTable from '@/views/BIView/PsDashboard/components/SortTable/SortTableTcq'
import moment from 'moment'
import graphic from 'echarts/lib/util/graphic'

import Jump from '@/views/BIView/PsDashboard/components/Jump'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'

export default {
  name: 'BadAfterSale',
  components: { SortTable, DropdownSelect ,Jump,Title},
  data () {
    const months = Array(12).fill(null).map((_, i) => i + 1)
    const thisYear = (new Date()).getFullYear()
    return {
      viewType: '1',
      months,
      valueProps: { 1: 'SHBLS_RTO', 2: 'GCBLS_RTO', 3: 'MTRLS_RTO', 4: 'LOGST_RTO',5:'GHBLS_RTO' },
      teamOptions: [],
      yearOptions: [thisYear, thisYear - 1, thisYear - 2],
      query: {
        valueType: '5',
        commodityType: []
      },
      query2: {
        year: thisYear,
        teams: [],
        commodityType: []
      },
      sortTable: {
        sorter: { col: 'SHBLS_RTO', type: 'desc' },
        bodyStyle: { height: 'calc((var(--height) - 80) * 1px / 11 * 10 - 31px)', },
        thHeight: 'calc((var(--height) - 80) * 1px / 11)',
        trHeight: 'calc((var(--height) - 80) * 1px / 11)',
        dataSource: [],
        columns: [
          { dataIndex: 'TEAM_SUPPLY', title: '项目组' },
          {
            dataIndex: 'SHBLS_RTO_DIFF', title: '目标差', render: (h, { row, cellProp }) => {
              return <span class={{
                'text-red': row[cellProp] && row[cellProp] < 0,
                'text-green': row[cellProp] && row[cellProp] > 0
              }}>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
          {
            dataIndex: 'WG_TGT', title: '目标', render: (h, { row, cellProp }) => {
              return <span>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
          {
            dataIndex: 'SHBLS_RTO', title: '实际', render: (h, { row, cellProp }) => {
              return <span>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
          {
            dataIndex: 'AGO_SHBLS_RTO', title: '同期', render: (h, { row, cellProp }) => {
              return <span>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
          {
            dataIndex: 'SHBLS_RTO_YOY', title: '同比', render: (h, { row, cellProp }) => {
              return <span>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
        ]
      },
      options1: {
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
          formatter (params) {
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}售后不良率: ${_.value ? numeral(_.value).format('0.00%') : '--'}`
            }).join('')
            return `研发类型: ${params[0].axisValue}${lines}`
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
          top: 60,
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
              color: echartsColor.splitLine,
            }
          }
        },
        series: [
          {
            type: 'bar',
            name: '当期',
            data: [],
            barWidth: 20,
            barGap: '80%',
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              color: echartsColor.thisYear,
            },
            label: {
              show: true,
              position: 'top',
              color: '#000',
              formatter (v) {
                return v.value ? numeral(v.value).format('0.00%') : ''
              }
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
                  color: echartsColor.previousYear,
              },
              emphasis: {
                  barBorderRadius: [7, 7, 0, 0],
                  color: echartsColor.previousYear,
              }
            },
            label: {
              show: true,
              position: 'top',
              color: '#000',
              formatter (v) {
                return v.value ? numeral(v.value).format('0.00%') : ''
              }
            }
          }
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
              color: 'rgba(0, 0, 0, .05)'
            },
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter (params) {
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}售后不良率: ${_.value ? numeral(_.value).format('0.00%') : '--'}`
            }).join('')
            return `是否停产: ${params[0].axisValue}${lines}`
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
          top: 60,
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
              color: echartsColor.splitLine,
            }
          }
        },
        series: [
          {
            type: 'bar',
            name: '当期',
            data: [],
            barGap: '80%',
            barWidth: 20,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              color: echartsColor.thisYear,
            },
            label: {
              show: true,
              position: 'top',
              color: '#000',
              formatter (v) {
                return v.value ? numeral(v.value).format('0.00%') : ''
              }
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
                    color: echartsColor.previousYear,
                },
                emphasis: {
                    barBorderRadius: [7, 7, 0, 0],
                    color: echartsColor.previousYear,
                }
            },
            label: {
              show: true,
              position: 'top',
              color: '#000',
              formatter (v) {
                return v.value ? numeral(v.value).format('0.00%') : ''
              }
            }
          }
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
          formatter (params) {
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0.00%') : '--'}`
            }).join('')
            return `月份: ${params[0].axisValue}${lines}`
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          top: 0,
          selectedMode: false
        },
        grid: {
          top: 30,
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
              color: [echartsColor.axisLabel]
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
            smooth: true,
            itemStyle: {
              color: echartsColor.thisYear
            },
            symbol: 'none',
            // areaStyle: {
            //   // color: new graphic.LinearGradient(0, 0, 0, 1, [
            //   //   {
            //   //     offset: 0,
            //   //     color: '#2680eb'
            //   //   },
            //   //   {
            //   //     offset: 1,
            //   //     color: '#2680eb00'
            //   //   }
            //   // ])
            //   opacity: 0.2,
            // },
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
            itemStyle: {
              color: echartsColor.previousYear,
            },
            symbol: 'none',
            // areaStyle: {
            //   // color: new graphic.LinearGradient(0, 0, 0, 1, [
            //   //   {
            //   //     offset: 0,
            //   //     color: '#cce0e9'
            //   //   },
            //   //   {
            //   //     offset: 1,
            //   //     color: '#cce0e900'
            //   //   }
            //   // ])
            //   opacity: 0.2,
            // },
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
      dataA: {
        rto: '',
        ago: '',
        yoy: ''
      },
      dataB: {
        rto: '',
        ago: '',
        yoy: ''
      },
      dataC: {
        rto: '',
        ago: '',
        yoy: ''
      },
      yearMonthValues: {},
      yearTot: {
        thisYear: '',
        lastYear: ''
      },
      curTot: {
        thisYear: '',
        lastYear: ''
      },
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,
    }
  },
  watch: {
    viewType (val) {
      if (val === '2' && !this.toggleFlag) {
        this.getData7()
        this.toggleFlag = true
      }
    },
    'query.valueType' () {
      this.parseData2(this.oDataA)
      this.parseData3(this.oDataB)
      this.parseData4(this.oDataC)

      if (this.toggleFlag) {
        this.parseData7(this.yearMonthValues)
      }
    },
    'query.commodityType' () {
      this.getData5()
      this.getData6()
    },
    'query2.teams' () {
      this.getData7()
    },
    'query2.year' () {
      this.getData7()
    },
    'query2.commodityType' () {
      this.getData7()
    }
  },
  mounted () {
    this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
    this.getData5()
    this.getData6()
  },
  methods: {
    numeral,
    formatRto (v) {
      return v ? numeral(v).format('0.00%') : '--'
    },
    getData1 () {
      this.$fetchSql('pds_cockpit', 'qbd_afs_tm_spl_rto').then(({ data }) => {
        const ret = orderBy(data, ['SHBLS_RTO'], ['desc'])
        this.teamOptions = ret.map(_ => _['TEAM_SUPPLY'])
        this.sortTable.dataSource = ret
      })
    },
    handleSort (sorter) {
      if (sorter.col && sorter.type) {
        this.sortTable.dataSource = orderBy(this.sortTable.dataSource, [sorter.col], [sorter.type])
      } else {
        this.sortTable.dataSource = orderBy(this.sortTable.dataSource, ['SHBLS_RTO'], ['desc'])
      }
    },
    getData2 () {
      this.$fetchSql('pds_cockpit', 'qbd_afs_tm_kpi_sum').then(({ data: [ret] }) => {
        this.oDataA = ret
        this.parseData2(ret)
      })
    },
    parseData2 (data) {
      const props = { 1: 'SHBLS', 2: 'GCBLS', 3: 'MTRLS', 4: 'LOGST',5:'GHBLS' }
      const rto = data[props[this.query.valueType] + '_RTO']
      const ago = data['AGO_' + props[this.query.valueType] + '_RTO']
      const yoy = data[props[this.query.valueType] + '_RTO_YOY']
      this.dataA = { rto, ago, yoy }
    },
    getData3 () {
      this.$fetchSql('pds_cockpit', 'qbd_afs_tm_kpi_sum_uncommodity')
          .then(({ data: [ret] }) => {
            this.oDataB = ret
            this.parseData3(ret)
          })
    },
    parseData3 (data) {
      const props = { 1: 'SHBLS', 2: 'GCBLS', 3: 'MTRLS', 4: 'LOGST',5:'GHBLS' }
      const rto = data[props[this.query.valueType] + '_RTO']
      const ago = data['AGO_' + props[this.query.valueType] + '_RTO']
      const yoy = data[props[this.query.valueType] + '_RTO_YOY']
      this.dataB = { rto, ago, yoy }
    },
    getData4 () {
      this.$fetchSql('pds_cockpit', 'qbd_afs_tm_kpi_sum_commodity')
          .then(({ data: [ret] }) => {
            this.oDataC = ret
            this.parseData4(ret)
          })
    },
    parseData4 (data) {
      const props = { 1: 'SHBLS', 2: 'GCBLS', 3: 'MTRLS', 4: 'LOGST',5:'GHBLS' }
      const rto = data[props[this.query.valueType] + '_RTO']
      const ago = data['AGO_' + props[this.query.valueType] + '_RTO']
      const yoy = data[props[this.query.valueType] + '_RTO_YOY']
      this.dataC = { rto, ago, yoy }
    },
    getData5 () {
      this.$fetchSql('pds_cockpit', 'qbd_afs_tm_development', {
        COMMODITY_TYPE: this.query.commodityType.toString()
      }).then(({ data }) => {
        this.options1.xAxis.data = data.map(_ => _['CLASS_DEVELOPMENT'])
        this.options1.series[0].data = data.map(_ => _['SHBLS_RTO'])
        this.options1.series[1].data = data.map(_ => _['AGO_SHBLS_RTO'])
      })
    },
    getData6 () {
      this.$fetchSql('pds_cockpit', 'qbd_afs_tm_is_stop', {
        COMMODITY_TYPE: this.query.commodityType.toString()
      }).then(({ data }) => {
        this.options2.xAxis.data = data.map(_ => _['IS_STOP'])
        this.options2.series[0].data = data.map(_ => _['SHBLS_RTO'])
        this.options2.series[1].data = data.map(_ => _['AGO_SHBLS_RTO'])
      })
    },
    getData7 () {
      this.$fetchSql('pds_cockpit', 'qbd_afs_mly_rto', {
        YDATE: [this.query2.year, this.query2.year - 1].toString(),
        TEAM_SUPPLY: this.query2.teams.toString(),
        COMMODITY_TYPE: this.query2.commodityType.toString()
      }).then(({ data }) => {
        const ret = {
          [this.query2.year]: Array(12).fill({}),
          [this.query2.year - 1]: Array(12).fill({})
        }
        for (let item of data) {
          const y = moment(item.MDATE).year()
          const m = moment(item.MDATE).month()
          ret[y] && (ret[y][m] = item)
        }
        this.yearMonthValues = ret
        this.parseData7(ret)
      })
    },
    parseData7 (ret) {
      const props = { 1: 'SHBLS_RTO', 2: 'GCBLS_RTO', 3: 'MTRLS_RTO', 4: 'LOGST_RTO',5:'GHBLS_RTO' }
      this.$refs.chart10 && this.$refs.chart10.clear()
      this.options10.series[0].name = this.query2.year
      this.options10.series[1].name = this.query2.year - 1
      this.options10.series[0].data = ret[this.query2.year].map(_ => _[props[this.query.valueType]])
      this.options10.series[1].data = ret[this.query2.year - 1].map(_ => _[props[this.query.valueType]])

      const yearTot = {
        thisYear: '',
        lastYear: ''
      }
      const curTot = {
        thisYear: '',
        lastYear: ''
      }

      const calc = (arr, prop) => {
        return arr.reduce((acc, cur) => {
          return acc + (cur[prop] || 0)
        }, 0)
      }
      const curValueProps = {1: 'SHBLS', 2: 'GCBLS', 3: 'MATERIAL_BAD', 4: 'LOGISTIC_BAD',5:'GHBLS'}
      const curValueProp = curValueProps[this.query.valueType]
      if (this.query2.year === moment().year()) {
        const mon = moment().month() + 1
        const a1 = calc(ret[this.query2.year].slice(0, mon), curValueProp)
        const a2 = calc(ret[this.query2.year].slice(0, mon), 'DLVRED_QTY')
        yearTot.thisYear = a1 / a2
        curTot.thisYear = a1 / a2

        const b1 = calc(ret[this.query2.year - 1].slice(0, mon), curValueProp)
        const b2 = calc(ret[this.query2.year - 1].slice(0, mon), 'DLVRED_QTY')

        curTot.lastYear = b1 / b2

        const c1 = calc(ret[this.query2.year - 1], curValueProp)
        const c2 = calc(ret[this.query2.year - 1], 'DLVRED_QTY')

        yearTot.lastYear = c1 / c2
      } else {
        const a1 = calc(ret[this.query2.year], curValueProp)
        const a2 = calc(ret[this.query2.year], 'DLVRED_QTY')
        yearTot.thisYear = a1 / a2
        curTot.thisYear = a1 / a2

        const b1 = calc(ret[this.query2.year - 1], curValueProp)
        const b2 = calc(ret[this.query2.year - 1], 'DLVRED_QTY')

        yearTot.lastYear = b1 / b2
        curTot.lastYear = b1 / b2
      }

      this.yearTot = yearTot
      console.log(yearTot)
      this.curTot = curTot
    },
    mouseenter(col, row,type) {
      this.curCol = col
      this.curRow = row
      this.curType = type
    },
    jumpTarget() {
        let str = ''
        if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
            str = 'http://test.bi.linshimuye.com:9090/x/4_632_1161_5602'
        }
        else {
            str = 'http://bi.linshimuye.com:9090/x/4_77_2761_1161_115'
        }
        let msg = {
            url: str,
            webTitle: '售后不良明细'
        }
        window.parent.postMessage(JSON.stringify(msg), '*')
    }

  },
}
</script>

<style lang="scss" scoped>
.dashboard-common-table {
  /deep/ tr {
    height: calc((var(--height) - 150) * 1px / 2 / 6);
  }
}

.ch1 {
  height: calc((var(--height) - 240) * 1px - 31px);
}

.ch10 {
  height: calc((var(--height) - 100) * 1px / 2 - 31px);
}

.TitleHeard{
  .HeardTitle{
    /deep/ .Title{
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.88);
      line-height: 24px;
    }
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
