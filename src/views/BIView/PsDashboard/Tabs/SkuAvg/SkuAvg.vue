<template>
  <!-- <div class="px15">style="height: 30px" -->
  <div class="px15" style="">
    <div class="flex-between" style="padding: 10px 0px;">
      <div class="flex flex-start">
        <!-- <span class="chart-sub-title">SKU均值</span> -->
        <Title :label="'SKU均值'" />
        <Jump class="JumpCss" style="margin-top: 0px;padding-left: 15px;cursor: pointer;" @click.native="jumpTarget" />
      </div>
      <div>
        <a-radio-group v-model="viewType">
          <a-radio value="1">当月</a-radio>
          <a-radio value="2">月度</a-radio>
        </a-radio-group>
      </div>
    </div>

    <div class="flex-between" style="align-items: flex-start" v-if="viewType === '1'">
      <div style="width: calc(45% - 10px - 11px)">
        <div class="ch1">
          <div style="line-height: 30px" class="text-black">SKU均值概况</div>
          <div class="flex-start" style="height: calc(100% - 30px)">
            <div style="width: 25%">
              <div class="text-xs" style="line-height: 30px">总均值</div>
              <div class="text-xl" style="line-height: 50px">
                {{ numeral(monthOverview.TOT_SKU_AVG_AMT / 10000).format('0,0.00') }}万
              </div>
              <div class="flex-start text-xs" style="height: 40px">
                <span style="flex: 0 0 30%">标杆：</span>
                <span>
                   {{ numeral(monthOverview.SUM_SKU_DLVR_TGT / 10000).format('0,0.00') }}万
                </span>
              </div>
              <div class="flex-start text-xs" style="height: 40px">
                <span style="flex: 0 0 30%">差值：</span>
                <span class="text-green">
                   {{ numeral(monthOverview.SKU_AVG_AMT_DIFF / 10000).format('0,0.00') }}万
                </span>
              </div>
            </div>
            <div class="flex-start" style="width: 75%; height: 100%">
              <div style="width: 33.33%; height: 100%; position: relative">
                <span class="text-xs text-gary" style="position: absolute; left: 0; top: 0">同期对比</span>
                <v-chart ref="chart1" autoresize :options="options1"/>
              </div>
              <div style="width: 33.33%; height: 100%; position: relative">
                <span class="text-xs text-gary" style="position: absolute; left: 0; top: 0">新旧品对比</span>
                <v-chart ref="chart2" autoresize :options="options2"/>
              </div>
              <div style="width: 33.33%; height: 100%; position: relative">
                <span class="text-xs text-gary" style="position: absolute; left: 0; top: 0">是否停产对比</span>
                <v-chart ref="chart3" autoresize :options="options3"/>
              </div>
            </div>
          </div>
        </div>
        <div class="ch2 mt20">
          <div style="line-height: 30px" class="text-black">项目组同比</div>
          <v-chart autoresize :options="options4"/>
        </div>
      </div>
      <div style="width: calc(55% - 10px)">
        <div class="text-black" style="height: 30px">项目组汇总</div>
        <div>
          <SortTable v-bind="table" :sorter.sync="table.sorter" @sortCol="handleSort"/>
        </div>
      </div>
    </div>

    <div v-if="viewType === '2'" class="flex-between" style="align-items: flex-start">
      <div style="width: calc(30% - 10px)">
        <div class="text-black" style="line-height: 30px">SKU均值发货概览</div>
        <div>
          <SortTable v-bind="table2" :sorter.sync="table2.sorter" @sortCol="handleSort2"/>
        </div>
      </div>
      <div style="width: calc(70% - 10px);">
        <div class="flex-between" style="height: 30px">
          <div class="text-black">SKU均值发货趋势</div>
          <div class="flex flex-end">
            <DropdownSelect label="统计年月" style="margin-right: 40px">
              <div slot="selectedText">{{ query.year }}</div>
              <a-radio-group v-model="query.year">
                <div v-for="y in yearOptions" :key="y">
                  <a-radio :value="y">{{ y }}</a-radio>
                </div>
              </a-radio-group>
            </DropdownSelect>

            <DropdownSelect label="项目组">
              <div slot="selectedText" style="width: 150px;" class="text-ellipsis nowrap px20">{{ query.teams.toString() }}</div>
              <a-checkbox-group v-model="query.teams">
                <div v-for="team in teamOptions" :key="team">
                  <a-checkbox :value="team">{{team}}</a-checkbox>
                </div>
              </a-checkbox-group>
            </DropdownSelect>
          </div>
        </div>
        <div class="ch10">
          <v-chart ref="chart10" autoresize :options="options10"/>
        </div>
        <div class="mt10">
          <table class="dashboard-common-table">
            <tr>
              <td>指标</td>
              <td>年累计</td>
              <td>当期累计</td>
              <td v-for="m in months" :key="m">{{ m }}月</td>
            </tr>
            <tr>
              <td @mouseenter="mouseenter(0, 0,null)" 
                :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}"
              >{{ query.year }}</td>
              <td @mouseenter="mouseenter(0, 1,null)"
                :style="{background:(curCol === 0) || (curRow === 1) ? hoverColor : null,}"
              >
                {{ numeral((yearTot[query.year] || {})['yearTot'] / 10000).format('0,0.00') }}万
              </td>
              <td @mouseenter="mouseenter(0, 2,null)"
                :style="{background:(curCol === 0) || (curRow === 2) ? hoverColor : null,}"
              >
                {{ numeral((yearTot[query.year] || {})['curTot'] / 10000).format('0,0.00') }}万
              </td>
              <td @mouseenter="mouseenter(0, (m+'月'),null)"
                :style="{background:(curCol === 0) || (curRow === (m+'月')) ? hoverColor : null,}"
                v-for="m in months" :key="m">
                {{
                  ((yearMonthValues[query.year] || [])[m - 1] || {})['SKU_AVG_AMT']
                      ? numeral((yearMonthValues[query.year] || [])[m - 1]['SKU_AVG_AMT'] / 10000).format('0.00') + '万'
                      : '--'
                }}
              </td>
            </tr>
            <tr>
              <td @mouseenter="mouseenter(1, 0,null)"
                :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
              >{{ query.year - 1 }}</td>
              <td @mouseenter="mouseenter(1, 1,null)"
                :style="{background:(curCol === 1) || (curRow === 1) ? hoverColor : null,}"
              >
                {{ numeral((yearTot[query.year - 1] || {})['yearTot'] / 10000).format('0,0.00') }}万
              </td>
              <td @mouseenter="mouseenter(1, 2,null)"
                :style="{background:(curCol === 1) || (curRow === 2) ? hoverColor : null,}"
              >
                {{ numeral((yearTot[query.year - 1] || {})['curTot'] / 10000).format('0,0.00') }}万
              </td>
              <td @mouseenter="mouseenter(1, (m+'月'),null)"
                :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
                v-for="m in months" :key="m">
                {{
                  ((yearMonthValues[query.year - 1] || [])[m - 1] || {})['SKU_AVG_AMT']
                      ? numeral((yearMonthValues[query.year - 1] || [])[m - 1]['SKU_AVG_AMT'] / 10000).format('0.00') + '万'
                      : '--'
                }}
              </td>
            </tr>
            <tr>
              <td @mouseenter="mouseenter(2, 0,null)"
                :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
              >增额</td>
              <td @mouseenter="mouseenter(2, 1,null)"
                :style="{background:(curCol === 2) || (curRow === 1) ? hoverColor : null,}"
              >
                {{
                  numeral(((yearTot[query.year] || {}).yearTot - (yearTot[query.year - 1] || {}).yearTot) / 10000).format('0,0.00')
                }}万
              </td>
              <td @mouseenter="mouseenter(2, 2,null)"
                :style="{background:(curCol === 2) || (curRow === 2) ? hoverColor : null,}"
              >
                {{
                  numeral(((yearTot[query.year] || {}).curTot - (yearTot[query.year - 1] || {}).curTot) / 10000).format('0,0.00')
                }}万
              </td>
              <td @mouseenter="mouseenter(2, (m+'月'),null)"
                :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
                v-for="m in months" :key="m">
                {{
                  ((yearMonthValues[query.year] || [])[m - 1] || {})['SKU_AVG_AMT_YOY_INCR']
                      ? numeral((yearMonthValues[query.year] || [])[m - 1]['SKU_AVG_AMT_YOY_INCR'] / 10000).format('0.00') + '万'
                      : '--'
                }}
              </td>
            </tr>
            <tr>
              <td @mouseenter="mouseenter(3, 0,null)"
                :style="{background:(curCol === 3) || (curRow === 0) ? hoverColor : null,}"
              >增幅</td>
              <td @mouseenter="mouseenter(3, 1,null)" 
                :style="{background:(curCol === 3) || (curRow === 1) ? hoverColor : null,}"
                :class="{
                'text-red': (yearTot[query.year] || {}).yearTot / (yearTot[query.year - 1] || {}).yearTot > 1,
                'text-green': (yearTot[query.year] || {}).yearTot / (yearTot[query.year - 1] || {}).yearTot < 1
              }">
                {{
                  numeral((
                      (yearTot[query.year] || {}).yearTot / (yearTot[query.year - 1] || {}).yearTot
                  ) - 1).format('0.00%')
                }}
              </td>
              <td @mouseenter="mouseenter(3, 2,null)"  
                :style="{background:(curCol === 3) || (curRow === 2) ? hoverColor : null,}"
                :class="{
                'text-red': (yearTot[query.year] || {}).curTot / (yearTot[query.year - 1] || {}).curTot > 1,
                'text-green': (yearTot[query.year] || {}).curTot / (yearTot[query.year - 1] || {}).curTot < 1
              }">
                {{
                  numeral((
                      (yearTot[query.year] || {}).curTot / (yearTot[query.year - 1] || {}).curTot
                  ) - 1).format('0.00%')
                }}
              </td>
              <td @mouseenter="mouseenter(3, (m+'月'),null)" 
                :style="{background:(curCol === 3) || (curRow === (m+'月')) ? hoverColor : null,}"
                v-for="m in months" :key="m" :class="{
                'text-red':  ((yearMonthValues[query.year] || [])[m - 1] || {})['SKU_AVG_AMT_YOY'] &&  ((yearMonthValues[query.year] || [])[m - 1] || {})['SKU_AVG_AMT_YOY'] > 0,
                'text-green':  ((yearMonthValues[query.year] || [])[m - 1] || {})['SKU_AVG_AMT_YOY'] &&  ((yearMonthValues[query.year] || [])[m - 1] || {})['SKU_AVG_AMT_YOY'] < 0,
              }">
                {{
                  ((yearMonthValues[query.year] || [])[m - 1] || {})['SKU_AVG_AMT_YOY']
                      ? numeral((yearMonthValues[query.year] || [])[m - 1]['SKU_AVG_AMT_YOY']).format('0.00%')
                      : '--'
                }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import numeral from 'numeral'
import SortTable from '@/views/BIView/PsDashboard/components/SortTable/SortTableTcq'
import DropdownSelect from '@/views/BIView/components/DropdownSelect/DropdownSelect'
import moment from 'moment'
import graphic from 'echarts/lib/util/graphic'
import Jump from '@/views/BIView/PsDashboard/components/Jump'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'

export default {
  name: 'SkuAvg',
  components: { DropdownSelect, SortTable,Jump,Title },
  data () {
    const thisYear = (new Date()).getFullYear()
    const months = Array(12).fill(null).map((_, i) => i + 1)
    return {
      months,
      teamOptions: [],
      yearOptions: [thisYear, thisYear - 1, thisYear - 2],
      viewType: '1',
      query: {
        year: thisYear,
        teams: [],
      },
      table: {
        sorter: { col: 'AVG_SKU_AMT', type: 'desc' },
        bodyStyle: { height: 'calc((var(--height) - 80) * 1px  / 10 * 9 - 11px)' },
        trHeight: 'calc((var(--height) - 80) * 1px  / 10)',
        dataSource: [],
        columns: [
          { dataIndex: 'TEAM_SUPPLY', title: '项目组' },
          {
            dataIndex: 'AVG_SKU_AMT', title: 'SKU均值', render: (h, { row, cellProp }) => {
              return <span class={{
                'text-red': row['AVG_SKU_AMT'] >= row['AVG_SKU_DLVR_TGT'],
                'text-green': row['AVG_SKU_AMT'] < row['AVG_SKU_DLVR_TGT'],
              }}>{numeral(row[cellProp] / 10000).format('0,0.00')}万</span>
            }, sortable: true
          },
          {
            dataIndex: 'AVG_SKU_DLVR_TGT', title: 'SKU均值目标', render: (h, { row, cellProp }) => {
              return <span>{row[cellProp] ? numeral(row[cellProp] / 10000).format('0,0.00') + '万' : ''}</span>
            }, sortable: true
          },
          {
            dataIndex: 'AVG_SKU_AMT_YOY', title: '均值同比', render: (h, { row, cellProp }) => {
              return <span>{numeral(row[cellProp]).format('0.00%')}</span>
            }, sortable: true
          },
          { dataIndex: 'AVG_SKU_AMT_RK', title: '均值排名', sortable: true },
          { dataIndex: 'DLVR_AMT_RK', title: '发货排名', sortable: true },
          { dataIndex: 'RK_TYPE', title: '双排名', sortable: true },
          { dataIndex: 'MARK_SKU_CNT', title: '可销售SKU数', sortable: true },
          { dataIndex: 'UP_SPU_CNT', title: '上架SPU数', sortable: true },
        ]
      },
      table2: {
        sorter: { col: '', type: '' },
        bodyStyle: { height: 'calc((var(--height) - 80) * 1px  / 10 * 9 - 11px)' },
        trHeight: 'calc((var(--height) - 80) * 1px  / 10)',
        dataSource: [],
        columns: [
          { dataIndex: 'TEAM_SUPPLY', title: '项目组', align: 'left' },
          {
            dataIndex: 'SKU_AVG_AMT', title: 'SKU均值', render: (h, { row, cellProp }) => {
              return <span>{numeral(row[cellProp] / 10000).format('0,0.00')}万</span>
            }, sortable: true
          },
          {
            dataIndex: 'AGO_SKU_AVG_AMT', title: '同期SKU均值', render: (h, { row, cellProp }) => {
              return <span>{numeral(row[cellProp] / 10000).format('0,0.00')}万</span>
            }, sortable: true
          },
          {
            dataIndex: 'SKU_AVG_AMT_YOY', title: '均值同比', render: (h, { row, cellProp }) => {
              return <span>{numeral(row[cellProp]).format('0.00%')}</span>
            }, sortable: true
          }
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
          top: 50,
          right: 0,
          bottom: 0,
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
            show: false,
            fontSize: 10,
            color: '#999',
            interval: 0,
          },
          data: ['同期对比'],
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
            color: '#999',
          },
          splitLine: {
            show: false,
            lineStyle: {
              // type: 'dashed',
              // color: '#ececee'
              type: 'solid',
              color: echartsColor.splitLine,
            }
          }
        },
        series: [
          {
            type: 'bar',
            name: '当期',
            data: [],
            barWidth: 15,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#2680eb'
              color: echartsColor.thisYear,
            },
            label: {
              show: false
            }
          },
          {
            type: 'bar',
            name: '同期',
            data: [],
            barWidth: 15,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#cce0e9'
              color: echartsColor.previousYear,
            },
            emphasis: {
              itemStyle: {
                color: echartsColor.previousYear,
              },
            },
            label: {
              show: false
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
          top: 50,
          right: 0,
          bottom: 0,
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
            show: false,
            fontSize: 10,
            color: '#999',
            interval: 0,
          },
          data: ['新旧品对比'],
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
            color: '#999',
          },
          splitLine: {
            show: false,
            lineStyle: {
              // type: 'dashed',
              // color: '#ececee'
              type: 'solid',
              color: echartsColor.splitLine,
            }
          }
        },
        series: [
          {
            type: 'bar',
            name: '新品',
            data: [],
            barWidth: 15,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#2680eb'
              color: echartsColor.thisYear,
            },
            label: {
              show: false
            }
          },
          {
            type: 'bar',
            name: '旧品',
            data: [],
            barWidth: 15,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#cce0e9'
              color: echartsColor.previousYear,
            },
            emphasis: {
              itemStyle: {
                color: echartsColor.previousYear,
              },
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
          formatter (params) {
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
          top: 50,
          right: 0,
          bottom: 0,
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
            show: false,
            fontSize: 10,
            color: '#999',
            interval: 0,
          },
          data: ['是否停产对比']
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
            color: '#999',
          },
          splitLine: {
            show: false,
            lineStyle: {
              // type: 'dashed',
              // color: '#ececee'
              type: 'solid',
              color: echartsColor.splitLine,
            }
          }
        },
        series: [
          {
            type: 'bar',
            name: '是',
            data: [],
            barWidth: 15,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#2680eb'
              color: echartsColor.thisYear,
            },
            label: {
              show: false
            }
          },
          {
            type: 'bar',
            name: '否',
            data: [],
            barWidth: 15,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#cce0e9'
              color: echartsColor.previousYear,
            },
            emphasis: {
              itemStyle: {
                color: echartsColor.previousYear,
              },
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
              return `<br>${_.marker}${_.seriesName}: ${numeral(_.value).format('0,0')}`
            }).join('')
            return `${params[0].axisValue}${lines}`
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
            fontSize: 10,
            rotate: 30,
            color: '#999',
            interval: 0,
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
            color: '#999',
          },
          splitLine: {
            show: false,
            lineStyle: {
              // type: 'dashed',
              // color: '#ececee'
              type: 'solid',
              color: echartsColor.splitLine,
            }
          }
        },
        series: [
          {
            type: 'bar',
            name: '当期',
            data: [],
            barWidth: 15,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#2680eb'
              color: echartsColor.thisYear,
            },
            label: {
              show: false
            }
          },
          {
            type: 'bar',
            name: '同期',
            data: [],
            barWidth: 15,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#cce0e9'
              color: echartsColor.previousYear,
            },
            emphasis: {
              itemStyle: {
                color: echartsColor.previousYear,
              },
            },
            label: {
              show: false
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
              return `<br>${_.marker}${_.seriesName}: ${numeral(_.value).format('0,0')}`
            }).join('')
            return `${params[0].axisValue}${lines}`
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
            z: 2,
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
            z: 1,
          }
        ]
      },
      monthOverview: {
        TOT_SKU_AVG_AMT: '',
        SKU_AVG_AMT_DIFF: '',
        SUM_SKU_DLVR_TGT: ''
      },
      yearMonthValues: {},
      yearTot: {},
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,
    }
  },
  watch: {
    'query.teams' () {
      this.getData4()
    },
    'query.year' () {
      this.getData3()
      this.getData4()
    },
    viewType (val) {
      if (val === '2' && !this.toggleFlag) {
        this.getData3()
        this.getData4()
        this.toggleFlag = true
      }
    }
  },
  mounted () {
    this.getData1()
    this.getData2()
  },
  methods: {
    numeral,
    getData1 () {
      this.$fetchSql('pds_cockpit', 'sku_avg_amt_tm_spl_sum').then(({ data }) => {
        this.table.dataSource = orderBy(data, ['AVG_SKU_AMT'], ['desc'])

        this.options4.xAxis.data = data.map(_ => _['TEAM_SUPPLY'])
        this.options4.series[0].data = data.map(_ => _['AVG_SKU_AMT'])
        this.options4.series[1].data = data.map(_ => _['AGO_AVG_SKU_AMT'])
      })
    },
    handleSort (sorter) {
      const rank = ['双优', '单优', '双劣']
      if (sorter.col && sorter.type) {
        if (sorter.col === 'RK_TYPE') {
          if (sorter.type === 'desc') {
            this.table.dataSource = this.table.dataSource.sort((a, b) => {
              return rank.indexOf(a['RK_TYPE']) - rank.indexOf(b['RK_TYPE'])
            })

          } else if (sorter.type === 'asc') {
            this.table.dataSource = this.table.dataSource.sort((a, b) => {
              return rank.indexOf(b['RK_TYPE']) - rank.indexOf(a['RK_TYPE'])
            })
          }
        } else {
          this.table.dataSource = orderBy(this.table.dataSource, [sorter.col], [sorter.type])
        }
      } else {
        this.table.dataSource = orderBy(this.table.dataSource, ['AVG_SKU_AMT'], ['desc'])
      }
    },
    getData2 () {
      this.$fetchSql('pds_cockpit', 'sku_avg_amt_tm_ov').then(({ data: [value] }) => {
        this.monthOverview = value
        this.options1.series[0].data = [value['AVG_SKU_AMT']]
        this.options1.series[1].data = [value['AGO_AVG_SKU_AMT']]

        this.options2.series[0].data = [value['NEW_SKU_AVG_AMT']]
        this.options2.series[1].data = [value['OLD_SKU_AVG_AMT']]

        this.options3.series[0].data = [value['STOP_SKU_AVG_AMT']]
        this.options3.series[1].data = [value['UNSTOP_SKU_AVG_AMT']]
      })
    },
    getData3 () {
      this.$fetchSql('pds_cockpit', 'sku_avg_amt_spl_ov', {
        YDATE: this.query.year
      }).then(({ data }) => {
        this.table2.dataSource = orderBy(data, ['SKU_AVG_AMT'], ['desc'])
        this.teamOptions = data.map(_ => _ ['TEAM_SUPPLY'])
      })
    },
    handleSort2 (sorter) {
      if (sorter.col && sorter.type) {
        this.table2.dataSource = orderBy(this.table2.dataSource, [sorter.col], [sorter.type])
      } else {
        this.table2.dataSource = orderBy(this.table2.dataSource, ['SKU_AVG_AMT'], ['desc'])
      }
    },
    getData4 () {
      this.$fetchSql('pds_cockpit', 'sku_avg_amt_mly_sum', {
        TEAM_SUPPLY: this.query.teams.toString(),
        YDATE: [this.query.year, this.query.year - 1].toString()
      }).then(({ data }) => {
        const ret = {
          [this.query.year]: Array(12).fill({}),
          [this.query.year - 1]: Array(12).fill({})
        }
        for (let item of data) {
          const year = moment(item.MDATE).year()
          const month = moment(item.MDATE).month()
          ret[year][month] = item
        }

        this.$refs.chart10 && this.$refs.chart10.clear()
        this.options10.series[0].data = ret[this.query.year].map(_ => _['SKU_AVG_AMT'])
        this.options10.series[1].data = ret[this.query.year - 1].map(_ => _['SKU_AVG_AMT'])
        console.log(ret)
        this.yearMonthValues = ret

        const len = ret[this.query.year].filter(_ => _['MDATE']).length
        const calc = (arr) => {
          const _arr = arr.filter(_ => _['MDATE'])
          const amt = _arr.reduce((acc, cur) => {
            return acc + cur['DLVR_AMT']
          }, 0)
          const qty = _arr.reduce((acc, cur) => {
            return acc + cur['DLVR_QTY']
          }, 0)
          return amt / qty
        }

        this.yearTot = {
          [this.query.year]: {
            curTot: calc(ret[this.query.year].slice(0, len)),
            yearTot: calc(ret[this.query.year])
          },
          [this.query.year - 1]: {
            curTot: calc(ret[this.query.year - 1].slice(0, len)),
            yearTot: calc(ret[this.query.year - 1])
          }
        }

        console.log(this.yearTot)
      })
    },
    mouseenter(col, row,type) {
      this.curCol = col
      this.curRow = row
      this.curType = type
    },


    async jumpTarget() {

      let str = '';

      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2020_00033':'BI_PC_2020_00210'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        str = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        str = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }      

      let msg = {
          url: str,
          webTitle: 'SKU均值'
      }
      window.parent.postMessage(JSON.stringify(msg), '*')
    }

  }
}
</script>

<style lang="scss" scoped>
/deep/ .ant-checkbox-wrapper {
  margin-left: 8px;
  height: 18px;
}

.px15{
  // padding-top: 10px;
  padding-top: 0px;
}

.dashboard-common-table {
  td {
    height: calc((var(--height) - 90) * 0.45px / 5);
  }
}


.ch1 {
  height: calc((var(--height) - 70) * .4px);
}

.ch2 {
  height: calc((var(--height) - 70) * .6px - 20px);
}

.ch10 {
  height: calc((var(--height) - 90) * .55px - 11px);
}
</style>
