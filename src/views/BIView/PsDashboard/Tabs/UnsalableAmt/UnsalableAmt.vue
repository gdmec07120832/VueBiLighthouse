<template>
  <div class="px15">
    <!-- style="height: 30px" -->
    <div class="flex-between" style="padding: 10px 0px;">

      <div style="line-height: 24px;display: flex;">
        <!-- <div class="chart-sub-title">滞销金额</div> -->
        <Title :label="'滞销金额'" />
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
      <div style="width: calc(55% - 10px)">
        <div class="flex-start">
          <div style="width: 33.33%">
            <div class="text-xs" style="line-height: 30px">滞销金额</div>
            <div style="font-size: 16px; font-weight: 600; line-height: 40px">
              {{ formatW(overviewData.REM_INV_VALUE) }}
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">目标</span>
              <span class="text-xs">
                {{ formatW(overviewData.REM_INV_VALUE_FLAG) }}
              </span>
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">占库存比</span>
              <span class="text-xs" :class="{
                'text-red': overviewData.REM_INV_RATE && overviewData.REM_INV_RATE < 0.1,
                'text-green': overviewData.REM_INV_RATE && overviewData.REM_INV_RATE >= 0.1,
              }">
                {{ formatRto(overviewData.REM_INV_RATE) }}
              </span>
            </div>
          </div>
          <div style="width: 33.33%">
            <div class="text-xs" style="line-height: 30px">361-720滞销金额</div>
            <div style="font-size: 16px; font-weight: 600; line-height: 40px">
              {{ formatW(overviewData.REM_INV_AMT_361) }}
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">同期</span>
              <span class="text-xs">
                {{ formatW(overviewData.REM_INV_AMT_LY_361) }}
              </span>
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">同比</span>
              <span class="text-xs" :class="{
                'text-red': overviewData.REM_INV_AMT_YOY_361 && overviewData.REM_INV_AMT_YOY_361 < 0,
                'text-green': overviewData.REM_INV_AMT_YOY_361 && overviewData.REM_INV_AMT_YOY_361 > 0
              }">
                {{ formatRto(overviewData.REM_INV_AMT_YOY_361) }}
              </span>
            </div>
          </div>
          <div style="width: 33.33%">
            <div class="text-xs" style="line-height: 30px">720+滞销金额</div>
            <div style="font-size: 16px; font-weight: 600; line-height: 40px">
              {{ formatW(overviewData.REM_INV_AMT_720) }}
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">同期</span>
              <span class="text-xs">
                {{ formatW(overviewData.REM_INV_AMT_LY_720) }}
              </span>
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">同比</span>
              <span class="text-xs" :class="{
                'text-red': overviewData.REM_INV_AMT_YOY_720 && overviewData.REM_INV_AMT_YOY_720 < 0,
                'text-green': overviewData.REM_INV_AMT_YOY_720 && overviewData.REM_INV_AMT_YOY_720 > 0
              }">
                {{ formatRto(overviewData.REM_INV_AMT_YOY_720) }}
              </span>
            </div>
          </div>
        </div>

        <div class="ch1" style="position: relative">
          <span style="position: absolute; left: 0; top: 0;" class="text-gary text-xs">滞销库龄分层对比</span>
          <v-chart ref="chart1" autoresize :options="options1"/>
        </div>

        <div class="mt10">
          <SortTable :sorter.sync="sortTable2.sorter" v-bind="sortTable2"/>
        </div>

      </div>
      <div style="width: calc(45% - 10px)">
        <div class="text-black" style="line-height: 30px">项目组滞销金额</div>
        <SortTable :sorter.sync="sortTable.sorter" v-bind="sortTable" @sortCol="handleSort"/>
      </div>
    </div>


    <div v-if="viewType === '2'">
      <div class="flex-end ch101">
        <DropdownSelect label="统计年月">
          <div slot="selectedText">{{ query.year }}</div>
          <a-radio-group v-model="query.year">
            <div v-for="y in yearOptions" :key="y">
              <a-radio :value="y">{{ y }}</a-radio>
            </div>
          </a-radio-group>
        </DropdownSelect>
      </div>
      <div class="ch10">
        <v-chart ref="chart10" autoresize :options="options10"/>
      </div>
      <div class="mt20">
        <table class="dashboard-common-table">
          <tr>
            <td>年月</td>
            <td v-for="item in months" :key="item">{{ item }}月</td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(0, 0,null)"
              :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}"
            >当期目标</td>
            <td @mouseenter="mouseenter(0, (m+'月'),null)"
              :style="{background:(curCol === 0) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ formatW(((yearMonthValues[query.year] || [])[m - 1] || {})['TGT_CLEAN_AMT']) }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(1, 0,null)"
              :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
            >{{ query.year }}</td>
            <td @mouseenter="mouseenter(1, (m+'月'),null)"
              :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ formatW(((yearMonthValues[query.year] || [])[m - 1] || {})['REM_INV_AMT']) }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(2, 0,null)"
              :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
            >{{ query.year - 1 }}</td>
            <td @mouseenter="mouseenter(2, (m+'月'),null)"
              :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ formatW(((yearMonthValues[query.year - 1] || [])[m - 1] || {})['REM_INV_AMT']) }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(3, 0,null)"
              :style="{background:(curCol === 3) || (curRow === 0) ? hoverColor : null,}"
            >同比增长</td>
            <td @mouseenter="mouseenter(3, (m+'月'),null)"
              :style="{background:(curCol === 3) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m" :class="{
              'text-red': ((yearMonthValues[query.year] || [])[m - 1] || {})['REM_INV_AMT_YOY'] && ((yearMonthValues[query.year] || [])[m - 1] || {})['REM_INV_AMT_YOY'] < 0,
              'text-green': ((yearMonthValues[query.year] || [])[m - 1] || {})['REM_INV_AMT_YOY'] && ((yearMonthValues[query.year] || [])[m - 1] || {})['REM_INV_AMT_YOY'] > 0
            }">
              {{ formatRto(((yearMonthValues[query.year] || [])[m - 1] || {})['REM_INV_AMT_YOY']) }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(4, 0,null)"
              :style="{background:(curCol === 4) || (curRow === 0) ? hoverColor : null,}"
            >是否达标</td>
            <td @mouseenter="mouseenter(4, (m+'月'),null)"
              :style="{background:(curCol === 4) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m" :class="{
              'text-red': ((yearMonthValues[query.year] || [])[m - 1] || {})['IS_REM_INV_AMT_CMPL']==='是',
               'text-green': ((yearMonthValues[query.year] || [])[m - 1] || {})['IS_REM_INV_AMT_CMPL']==='否',
            }">
              {{ ((yearMonthValues[query.year] || [])[m - 1] || {})['IS_REM_INV_AMT_CMPL'] }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import DropdownSelect from '@/views/BIView/components/DropdownSelect/DropdownSelect'
import SortTable from '@/views/BIView/PsDashboard/components/SortTable/SortTableTcq'
import moment from 'moment'
import numeral from 'numeral'
import graphic from 'echarts/lib/util/graphic'

import Jump from '@/views/BIView/PsDashboard/components/Jump'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'
import { color } from 'echarts5'


export default {
  name: 'UnsalableAmt',
  components: { SortTable, DropdownSelect ,Jump,Title},
  data () {
    const thisYear = (new Date()).getFullYear()
    const months = Array(12).fill(null).map((_, i) => i + 1)
    return {
      viewType: '1',
      months,
      yearOptions: Array(4).fill(null).map((_, i) => thisYear - i),
      query: {
        year: thisYear,
      },
      sortTable: {
        sorter: { col: 'REM_INV_AMT_RTO', type: 'desc' },
        totalRow: {
          data: {},
          render: (h, row) => {
            return <tr style="height: calc((var(--height) - 80) * 1px / 11); font-weight: 800; text-align: center">
              <td align="left">{row.name}</td>
              <td>{this.formatW(row['TOT_UNSALABLE_TGT'])}</td>
              <td>{this.formatW(row['TOT_REM_INV_AMT'])}</td>
              <td class={{
                'text-red': row['TOT_REM_INV_AMT_DIFF'] && row['TOT_REM_INV_AMT_DIFF'] < 0,
                'text-green': row['TOT_REM_INV_AMT_DIFF'] && row['TOT_REM_INV_AMT_DIFF'] > 0
              }}>{this.formatW(row['TOT_REM_INV_AMT_DIFF'])}</td>
              <td>{this.formatRto(row['TOT_REM_INV_AMT_RTO'])}</td>
              <td>{this.formatRto(row['TOT_REM_INV_AMT_RTO_YOY'])}</td>
              <td>{this.formatW(row['TOT_REM_INV_AMT361_MORE'])}</td>
              <td>{this.formatRto(row['TOT_REM_INV_AMT361_MORE_RTO'])}</td>
            </tr>
          }
        },
        bodyStyle: { height: 'calc((var(--height) - 80) * 1px / 11 * 10 - 8px)' },
        thHeight: 'calc((var(--height) - 80) * 1px / 11)',
        trHeight: 'calc((var(--height) - 80) * 1px / 11)',
        dataSource: [],
        columns: [
          { title: '项目组', dataIndex: 'TEAM_SUPPLY', align: 'left' },
          {
            title: '目标', dataIndex: 'UNSALABLE_TGT', render: (h, { row, cellProp }) => {
              return <span>{this.formatW(row[cellProp])}</span>
            }, sortable: true
          },
          {
            title: '实际', dataIndex: 'REM_INV_AMT', render: (h, { row, cellProp }) => {
              return <span>{this.formatW(row[cellProp])}</span>
            }, sortable: true
          },
          {
            title: '差值', dataIndex: 'REM_INV_AMT_DIFF', render: (h, { row, cellProp }) => {
              return <span class={{
                'text-red': row[cellProp] && row[cellProp] < 0,
                'text-green': row[cellProp] && row[cellProp] > 0,
              }}>{this.formatW(row[cellProp])}</span>
            }, sortable: true
          },
          {
            title: '库存占比', dataIndex: 'REM_INV_AMT_RTO', render: (h, { row, cellProp }) => {
              return <span>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
          {
            title: '库存占比同比', dataIndex: 'REM_INV_AMT_RTO_YOY', render: (h, { row, cellProp }) => {
              return <span>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
          {
            title: '361+滞销库存', dataIndex: 'REM_INV_AMT361_MORE', render: (h, { row, cellProp }) => {
              return <span>{this.formatW(row[cellProp])}</span>
            }, sortable: true
          },
          {
            title: '361+库存占比', dataIndex: 'REM_INV_AMT361_MORE_RTO', render: (h, { row, cellProp }) => {
              return <span>{this.formatRto(row[cellProp])}</span>
            }, sortable: true
          },
        ]
      },
      sortTable2: {
        sorter: { col: '', type: '' },
        thHeight: 'calc((var(--height) - 190) * 1px / 12)',
        trHeight: 'calc((var(--height) - 190) * 1px / 12)',
        totalRow: {
          data: {},
          render: (h, row) => {
            return <tr style="font-weight: 800; height: calc((var(--height) - 190) * 1px / 12); text-align: center">
              <td align="left">{row.name}</td>
              <td>{this.formatW(row['TOT_CLEAN_REM_INV_AMT'])}</td>
              <td>{this.formatW(row['TOT_REM_INV_AMT_LM'])}</td>
              <td>{this.formatW(row['TOT_REM_INV_AMT'])}</td>
              <td>{this.formatRto(row['TOT_REM_INV_AMT_RTO'])}</td>
              <td class={{
                'text-red': row['TOT_REM_INV_AMT_RTO_YOY'] && row['TOT_REM_INV_AMT_RTO_YOY'] < 0,
                'text-green': row['TOT_REM_INV_AMT_RTO_YOY'] && row['TOT_REM_INV_AMT_RTO_YOY'] > 0,
              }}>{this.formatRto(row['TOT_REM_INV_AMT_RTO_YOY'])}</td>
            </tr>
          }
        },
        dataSource: [],
        columns: [
          { dataIndex: 'INV_AGE_LEVEL', title: '库龄分层', align: 'left' },
          {
            dataIndex: 'CLEAN_REM_INV_AMT', render: (h, { row, cellProp }) => {
              return <span>{this.formatW(row[cellProp])}</span>
            }, title: '清理库存'
          },
          {
            dataIndex: 'REM_INV_AMT_LM', render: (h, { row, cellProp }) => {
              return <span>{this.formatW(row[cellProp])}</span>
            }, title: '期初滞销库存'
          },
          {
            dataIndex: 'REM_INV_AMT', render: (h, { row, cellProp }) => {
              return <span>{this.formatW(row[cellProp])}</span>
            }, title: '期末滞销库存'
          },
          {
            dataIndex: 'REM_INV_AMT_RTO', render: (h, { row, cellProp }) => {
              return <span>{this.formatRto(row[cellProp])}</span>
            }, title: '期末库存占比'
          },
          {
            dataIndex: 'REM_INV_AMT_RTO_YOY', render: (h, { row, cellProp }) => {
              return <span class={{
                'text-red': row[cellProp] && row[cellProp] < 0,
                'text-green': row[cellProp] && row[cellProp] > 0,
              }}>{this.formatRto(row[cellProp])}</span>
            }, title: '库存占比同比'
          },
        ],
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
              return `<br>${_.marker}${_.seriesName}滞销库存: ${_.value ? numeral(_.value).format('0,0') : '--'}`
            }).join('')
            return `库龄分层: ${params[0].axisValue}${lines}`
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
            color: '#999'
          },
          data: ['91-180', '181-380', '361-720', '720+'],
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
            name: '期初',
            data: [],
            barWidth: 20,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#2680eb'
              color:echartsColor.thisYear
            },
            label: {
              show: false
            }
          },
          {
            type: 'bar',
            name: '期末',
            data: [],
            barWidth: 20,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#cce0e9'
              color:echartsColor.previousYear,
              norma:{
                color:echartsColor.previousYear,
              }

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
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          top: 0,
          selectedMode: false
        },
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
              return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0,0') : '--'}`
            }).join('')
            return `${params[0].axisValue}${lines}`
          },
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
              // color: 'rgba(234,234,234,0.5)',
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
            smooth: true,
            itemStyle: {
              color: echartsColor.thisYear
            },
            areaStyle: {
              // color: new graphic.LinearGradient(0, 0, 0, 1, [
              //   {
              //     offset: 0,
              //     color: '#2680eb'
              //   },
              //   {
              //     offset: 1,
              //     color: '#2680eb00'
              //   }
              // ])
              opacity:1,
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: echartsColor.NewPeriod1,
                },
                {
                  offset: 1,
                  color: echartsColor.NewPeriod2,
                }
              ])

            },
            data: [],
            symbol: 'none',
          },
          {
            type: 'line',
            smooth: true,
            itemStyle: {
              color: echartsColor.previousYear
            },
            areaStyle: {
              // color: new graphic.LinearGradient(0, 0, 0, 1, [
              //   {
              //     offset: 0,
              //     color: '#cce0e9'
              //   },
              //   {
              //     offset: 1,
              //     color: '#cce0e900'
              //   }
              // ])
              opacity:1,
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: echartsColor.NewYOY1,
                },
                {
                  offset: 1,
                  color: echartsColor.NewYOY2,
                }
              ])
            },
            data: [],
            symbol: 'none',
          }
        ]
      },
      yearMonthValues: {},
      overviewData: {
        REM_INV_AMT_361: '',
        REM_INV_AMT_720: '',
        REM_INV_AMT_LY_361: '',
        REM_INV_AMT_LY_720: '',
        REM_INV_AMT_YOY_361: '',
        REM_INV_AMT_YOY_720: '',
        REM_INV_RATE: '',
        REM_INV_VALUE: '',
        REM_INV_VALUE_FLAG: ''
      },
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,

    }
  },
  watch: {
    'query.year' () {
      this.getData3()
    },
    viewType (val) {
      if (val === '2' && !this.toggleFlag) {
        this.getData3()
        this.toggleFlag = true
      }
    }
  },
  mounted () {
    this.getData1()
    this.getData2()
    this.getData4()
  },
  methods: {
    formatW (v) {
      return v ? numeral(v / 10000).format('0,0') + '万' : '--'
    },
    formatRto (v) {
      return v ? numeral(v).format('0.00%') : '--'
    },
    getData1 () {
      this.$fetchSql('pds_cockpit', 'rem_inv_tm_361_more_sum').then(({ data: [ret] }) => {
        this.overviewData = ret
      })
    },
    getData2 () {
      this.$fetchSql('pds_cockpit', 'rem_inv_tm_age_lvl_compare').then(({ data }) => {
        const shows = ['91-180', '181-360', '361-720', '720+']
        const _data = orderBy(data.filter(_ => shows.includes(_['INV_AGE_LEVEL'])), [(data) => {
          return shows.indexOf(data['INV_AGE_LEVEL'])
        }], ['asc'])
        this.sortTable2.dataSource = _data
        this.sortTable2.totalRow.data = {
          name: '合计',
          ..._data[0]
        }
        this.options1.series[0].data = _data.map(_ => _['REM_INV_AMT_LM'])
        this.options1.series[1].data = _data.map(_ => _['REM_INV_AMT'])
      })
    },
    getData3 () {
      this.$fetchSql('pds_cockpit', 'rem_inv_mly_amt', {
        YDATE: [this.query.year, this.query.year - 1].toString()
      }).then(({ data }) => {
        const ret = {
          [this.query.year]: Array(12).fill({}),
          [this.query.year - 1]: Array(12).fill({})
        }
        for (let item of data) {
          const y = moment(item.MDATE).year()
          const m = moment(item.MDATE).month()
          ret[y] && (ret[y][m] = item)
        }

        this.$refs.chart10.clear()
        this.options10.series[0].name = this.query.year
        this.options10.series[0].data = ret[this.query.year].map(_ => _['REM_INV_AMT'])

        this.options10.series[1].name = this.query.year - 1
        this.options10.series[1].data = ret[this.query.year - 1].map(_ => _['REM_INV_AMT'])

        this.yearMonthValues = ret
      })
    },
    getData4 () {
      this.$fetchSql('pds_cockpit', 'rem_inv_tm_spl_dtl').then(({ data }) => {
        const _data = orderBy(data, ['REM_INV_AMT_RTO'], ['desc'])
        this.sortTable.dataSource = _data
        this.sortTable.totalRow.data = {
          name: '合计',
          ..._data[0]
        }
      })
    },
    handleSort (sorter) {
      if (sorter.col && sorter.type) {
        this.sortTable.dataSource = orderBy(this.sortTable.dataSource, [sorter.col], [sorter.type])
      } else {
        this.sortTable.dataSource = orderBy(this.sortTable.dataSource, ['REM_INV_AMT_RTO'], ['desc'])
      }
    },
    mouseenter(col, row,type) {
      this.curCol = col
      this.curRow = row
      this.curType = type
    },
    jumpTarget() {
        let str = ''
        if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
            str = 'http://test.bi.linshimuye.com:9090/x/4_647_809_889'
        }
        else {
            str = 'http://bi.linshimuye.com:9090/x/4_647_809_889'
        }
        let msg = {
            url: str,
            webTitle: '库龄概览'
        }
        window.parent.postMessage(JSON.stringify(msg), '*')
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard-common-table {
  /deep/ tr {
    height: calc((var(--height) * 0.9 - 80) * 1px / 2 / 6);
  }
}

.ch1 {
  height: calc((var(--height) - 180) * 1px / 2 - 11px);
}

.ch101 {
  height: calc(var(--height) * 0.1px);
}

.ch10 {
  height: calc((var(--height) * 0.9 - 80) * 1px / 2);
}
/deep/ .mt10 div div.Table_Title{
  padding-right: 0px;
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
