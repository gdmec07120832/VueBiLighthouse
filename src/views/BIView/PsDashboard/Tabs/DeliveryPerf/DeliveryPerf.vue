<template>
  <div class="px15">
    <!-- height: 30px; -->
    <div class="flex-between" style="padding: 10px 0px;">
      <div class="text-black" style="display: flex;">
        <!-- <span class="chart-sub-title">发货业绩概览</span> -->
        <Title :label="'发货业绩概览'" />
        <span class="text-red ml20 text-xs" style="padding-top: 5px;">
          备注：项目组分类=其它项目组，没有发货业绩目标
        </span>
      </div>
      <div>
        <a-radio-group v-model="viewType">
          <a-radio value="1">当月</a-radio>
          <a-radio value="2">月度</a-radio>
        </a-radio-group>
      </div>
    </div>
    <div class="flex-start py5" style="align-items: flex-start">
      <span style="flex: 0 0 100px" class="text-xs text-black">项目组分类</span>
      <a-checkbox-group style="flex: 1" v-model="query2.teamType">
        <a-checkbox style="width: 120px" value="其他项目组">其他项目组</a-checkbox>
        <a-checkbox style="width: 120px" value="成品项目组">成品项目组</a-checkbox>
      </a-checkbox-group>
    </div>
    <div class="flex-start py5" style="align-items: flex-start">
      <span style="flex: 0 0 100px" class="text-xs text-black">项目组</span>
      <a-checkbox-group style="flex: 1; height: 23px; overflow-y: auto" v-model="query2.team">
        <a-checkbox style="width: 120px"
                    v-for="(item) in teamOptions" :key="item" :value="item">{{ item }}
        </a-checkbox>
      </a-checkbox-group>
    </div>

    <div class="flex-between mt20" style="align-items: flex-start" v-if="viewType === '1'">
      <div class="ch1" style="width: calc(50% - 10px)">
        <v-chart ref="chart1" autoresize :options="options1"/>
      </div>
      <div style="width: calc(50% - 10px)">
        <SortTable :sorter.sync="table.sorter" v-bind="table" @sortCol="handleSort"/>
      </div>
    </div>

    <div v-if="viewType === '2'">
      <div class="flex-start py5">
        <span class="text-black text-xs" style="flex: 0 0 100px">年份</span>
        <a-radio-group v-model="query2.year">
          <a-radio style="width: 112px" v-for="y in yearOptions" :key="y" :value="y">{{ y }}</a-radio>
        </a-radio-group>
      </div>

      <div class="ch10">
        <v-chart ref="chart10" autoresize :options="options10"/>
      </div>

      <div class="mt20">
        <table class="dashboard-common-table">
          <tr>
            <td>指标</td>
            <td>年累计</td>
            <td v-for="m in months" :key="m">{{ query2.year }}-{{ ('0' + m).slice(-2) }}</td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(0, 0,null)"
              :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}"
            >同期增幅(%)</td>
            <td @mouseenter="mouseenter(0, 1,null)"
              :style="{background:(curCol === 0) || (curRow === 1) ? hoverColor : null,}"
            :class="{
              'text-red': yearTotValues['SEND_AMT_YOY'] > 0,
              'text-green': yearTotValues['SEND_AMT_YOY'] < 0,
            }">
              {{ numeral(yearTotValues['SEND_AMT_YOY']).format('0.00%') }}
            </td>

            <td @mouseenter="mouseenter(0, (m+'月'),null)" 
              :style="{background:(curCol === 0) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m" :class="{
              'text-red': yearMonthValues[m - 1] && yearMonthValues[m - 1]['SEND_AMT_YOY'] > 0,
              'text-green': yearMonthValues[m - 1] && yearMonthValues[m - 1]['SEND_AMT_YOY'] < 0
            }">
              {{ yearMonthValues[m - 1] ? numeral(yearMonthValues[m - 1]['SEND_AMT_YOY']).format('0.00%') : '--' }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(1, 0,null)"
              :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
            >同期增额(¥)</td>
            <td @mouseenter="mouseenter(1, 1,null)"
              :style="{background:(curCol === 1) || (curRow === 1) ? hoverColor : null,}"
            >{{ numeral(yearTotValues['SEND_AMT_YOY_INCR']).format('0,0') }}</td>
            <td @mouseenter="mouseenter(1, (m+'月'),null)"
              :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ yearMonthValues[m - 1] ? numeral(yearMonthValues[m - 1]['SEND_AMT_YOY_INCR']).format('0,0') : '--' }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(2, 0,null)"
              :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
            >发货业绩</td>
            <td @mouseenter="mouseenter(2, 1,null)"
              :style="{background:(curCol === 2) || (curRow === 1) ? hoverColor : null,}"
            >{{ numeral(yearTotValues['SEND_AMT']).format('0,0') }}</td>
            <td @mouseenter="mouseenter(2, (m+'月'),null)"
              :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ yearMonthValues[m - 1] ? numeral(yearMonthValues[m - 1]['SEND_AMT']).format('0,0') : '--' }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(3, 0,null)"
              :style="{background:(curCol === 3) || (curRow === 0) ? hoverColor : null,}"
            >发货目标</td>
            <td @mouseenter="mouseenter(3, 1,null)"
              :style="{background:(curCol === 3) || (curRow === 1) ? hoverColor : null,}"
            >{{ numeral(yearTotValues['SEND_AMT_TGT']).format('0,0') }}</td>
            <td @mouseenter="mouseenter(3, (m+'月'),null)"
              :style="{background:(curCol === 3) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ yearMonthValues[m - 1] ? numeral(yearMonthValues[m - 1]['SEND_AMT_TGT']).format('0,0') : '--' }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(4, 0,null)"
              :style="{background:(curCol === 4) || (curRow === 0) ? hoverColor : null,}"
            >是否达标</td>
            <td @mouseenter="mouseenter(4, 1,null)" 
              :style="{background:(curCol === 4) || (curRow === 1) ? hoverColor : null,}"
              :class="{
              'text-red': yearTotValues['SEND_AMT'] > yearTotValues['SEND_AMT_TGT'],
              'text-green': yearTotValues['SEND_AMT'] < yearTotValues['SEND_AMT_TGT']
            }">
              {{ yearTotValues['SEND_AMT'] > yearTotValues['SEND_AMT_TGT'] ? '是' : '否' }}
            </td>
            <td @mouseenter="mouseenter(4, (m+'月'),null)" 
              :style="{background:(curCol === 4) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m" :class="{
              'text-red': yearMonthValues[m - 1]  && (yearMonthValues[m - 1]['SEND_AMT'] > yearMonthValues[m - 1]['SEND_AMT_TGT']),
               'text-green': yearMonthValues[m - 1]  && (yearMonthValues[m - 1]['SEND_AMT'] < yearMonthValues[m - 1]['SEND_AMT_TGT']),
            }">
              {{
                yearMonthValues[m - 1] ? (yearMonthValues[m - 1]['SEND_AMT'] > yearMonthValues[m - 1]['SEND_AMT_TGT']) ? '是' : '否' : '--'
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
import intersection from 'lodash/intersection'
import SortTable from '@/views/BIView/PsDashboard/components/SortTable/SortTableTcq'
import graphic from 'echarts/lib/util/graphic'
import moment from 'moment'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'

export default {
  name: 'DeliveryPerf',
  components: { SortTable,Title },
  data () {
    const thisYear = (new Date()).getFullYear()
    const months = Array(12).fill(null).map((_, i) => i + 1)
    return {
      months,
      thisYear,
      yearMonthValues: [],
      yearTotValues: {},
      teamOptions: [],
      yearOptions: [thisYear, thisYear - 1, thisYear - 2],
      viewType: '1',
      query2: {
        team: [],
        teamType: ['成品项目组'],
        year: thisYear
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
            show: true,
            color: '#999',
            formatter (v) {
              return numeral(v / 10000).format('0,0') + '万'
            }
          },
          splitLine: {
            show: true,
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
            type: 'line',
            z: 10,
            name: thisYear,
            smooth: true,
            showSymbol: true,
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
            symbol: 'none',
            data: []
          },
          {
            type: 'line',
            name: thisYear - 1,
            smooth: true,
            showSymbol: true,
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
            symbol: 'none',
            data: [],
          },
        ]
      },
      options10: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
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
          top: 40,
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
          data: months.map(_ => _ + '月'),
        },
        yAxis: {
          splitNumber: 4,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            color: '#999',
            interval: 4,
            formatter (v) {
              return numeral(v / 10000).format('0,0') + '万'
            }
          },
          splitLine: {
            show: true,
            interval: 4,
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
            type: 'line',
            z: 10,
            name: '本期业绩',
            smooth: true,
            showSymbol: true,
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
            data: []
          },
          {
            type: 'line',
            name: '同期业绩',
            smooth: true,
            showSymbol: true,
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
          },
        ]
      },
      table: {
        sorter: { col: '', type: '' },
        bodyStyle: { height: 'calc((var(--height) - 125) * 1px / 11 * 10)', },
        trHeight: 'calc((var(--height) - 130) * 1px / 11)',
        totalRow: {
          data: {},
          render (h, row) {
            return <tr style="font-weight: bold; height: calc((var(--height) - 130) * 1px / 10); text-align: center">
              <td align="left">{row.name}</td>
              <td>{numeral(row.SEND_AMT).format('0,0')}</td>
              <td>{numeral(row.AGO_SEND_AMT).format('0,0')}</td>
              <td class={{
                'text-red': row.SEND_AMT_YOY > 0,
                'text-green': row.SEND_AMT_YOY < 0
              }}>{numeral(row.SEND_AMT_YOY).format('0.00%')}</td>
              <td>/</td>
              <td>/</td>
              <td>{numeral(row.SEND_AMT_TGT).format('0,0')}</td>
              <td class={{
                'text-red': row.SEND_AMT_CMPL_RTO > 1,
                'text-green': row.SEND_AMT_CMPL_RTO < 1
              }}>{numeral(row.SEND_AMT_CMPL_RTO).format('0.00%')}</td>
            </tr>
          }
        },
        dataSource: [],
        columns: [
          { dataIndex: 'TEAM_SUPPLY', title: '项目组', align: 'left' },
          {
            dataIndex: 'SEND_AMT', title: '发货业绩', render: (h, { row, cellProp }) => {
              return <span>{numeral(row[cellProp]).format('0,0')}</span>
            }, sortable: true
          },
          {
            dataIndex: 'AGO_SEND_AMT', title: '同期发货业绩', render: (h, { row, cellProp }) => {
              return <span>{numeral(row[cellProp]).format('0,0')}</span>
            }, sortable: true
          },
          {
            dataIndex: 'SEND_AMT_YOY', title: '发货同比', render: (h, { row, cellProp }) => {
              return <span class={{
                'text-red': row[cellProp] > 0,
                'text-green': row[cellProp] < 0
              }}>{numeral(row[cellProp]).format('0.00%')}</span>
            }, sortable: true
          },
          {
            dataIndex: 'SEND_AMT_RTO', title: '发货占比', render: (h, {row, cellProp}) => {
              return <span>{numeral(row[cellProp]).format('0.00%')}</span>
            }, sortable: true
          },
          {
            dataIndex: 'SEND_AMT_RTO_YOY', title: '占比同比',  render: (h, {row, cellProp}) => {
              return <span class={{
                'text-red': row[cellProp] > 0,
                'text-green': row[cellProp] < 0
              }}>{numeral(row[cellProp]).format('0.00%')}</span>
            }, sortable: true
          },
          {
            dataIndex: 'SEND_AMT_TGT', title: '发货目标', render: (h, { row, cellProp }) => {
              return <span>{numeral(row[cellProp]).format('0,0')}</span>
            }, sortable: true
          },
          {
            dataIndex: 'SEND_AMT_CMPL_RTO', title: '发货达成率', render: (h, { row, cellProp }) => {
              return <span class={{
                'text-red': row[cellProp] >= 1,
                'text-green': row[cellProp] < 1
              }}>{numeral(row[cellProp]).format('0.00%')}</span>
            }, sortable: true
          },
        ]
      },
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,

    }
  },
  watch: {
    viewType (val) {
      this.getData2()
      if (val === '1') {
        this.options10.series[0].data = []
        this.options10.series[1].data = []
        this.getData1()
      } else {
        this.options1.series[0].data = []
        this.options1.series[1].data = []
      }
    },
    teamOptions (val, oldVal) {
      if (val.toString() !== oldVal.toString()) {
        this.query2.team = intersection(this.query2.team, val)
      }
    },
    'query2.team' (val, oldVal) {
      if (val.toString() !== oldVal.toString()) {
        this.getData1()
        this.getData2()
      }
    },
    'query2.teamType' () {
      this.getData1()
      this.getData2()
    },
    'query2.year' () {
      this.getData2()
    }
  },
  mounted () {
    this.getData1()
    this.getData2()
  },
  methods: {
    numeral,
    getData1 () {
      this.$fetchSql('pds_cockpit', 'send_amt_spl_tm_dtl', {
        TEAM_SUPPLY: this.query2.team.toString(),
        TEAM_SUPPLY_TYPE: this.query2.teamType.toString()
      }).then(({ data }) => {
        const _data = orderBy(data.filter(_ => _.TEAM_SUPPLY !== '合计'), ['SEND_AMT'], ['desc'])
        if (!this.query2.team.length) {
          this.teamOptions = _data.map(_ => _['TEAM_SUPPLY'])
        }
        this.table.dataSource = _data
        const SEND_AMT = _data.reduce((acc, cur) => {
          return acc + cur['SEND_AMT']
        }, 0)
        const AGO_SEND_AMT = _data.reduce((acc, cur) => {
          return acc + cur['AGO_SEND_AMT']
        }, 0)
        const SEND_AMT_TGT = _data.reduce((acc, cur) => {
          return acc + cur['SEND_AMT_TGT']
        }, 0)
        this.table.totalRow.data = {
          name: '合计',
          SEND_AMT: SEND_AMT,
          AGO_SEND_AMT: AGO_SEND_AMT,
          SEND_AMT_TGT: SEND_AMT_TGT,
          SEND_AMT_YOY: (SEND_AMT / AGO_SEND_AMT) - 1,
          SEND_AMT_CMPL_RTO: SEND_AMT_TGT ? SEND_AMT / SEND_AMT_TGT : 0
        }
      })
    },
    handleSort (sorter) {
      if (sorter.col && sorter.type) {
        this.table.dataSource = orderBy(this.table.dataSource, [sorter.col], [sorter.type])
      } else {
        this.table.dataSource = orderBy(this.table.dataSource, ['SEND_AMT'], ['desc'])
      }
    },
    getData2 () {
      const years = this.viewType === '1' ? [this.thisYear, this.thisYear - 1] : [this.query2.year, this.query2.year - 1]
      this.$fetchSql('pds_cockpit', 'send_amt_mly_sum', {
        TEAM_SUPPLY: this.query2.team.toString(),
        TEAM_SUPPLY_TYPE: this.query2.teamType.toString(),
        YDATE: years.toString()
      }).then(({ data }) => {

        const ret = {
          [years[0]]: Array(12).fill({}),
          [years[1]]: Array(12).fill({})
        }
        for (let item of data) {
          const year = moment(item.MDATE).year()
          const month = moment(item.MDATE).month()
          ret[year][month] = item
        }

        if (this.$refs.chart1) {
          this.$refs.chart1.clear()
          this.options1.series[0].data = ret[years[0]].map(_ => _['SEND_AMT'])
          this.options1.series[1].data = ret[years[1]].map(_ => _['SEND_AMT'])
        }
        if (this.$refs.chart10) {
          this.$refs.chart10.clear()
          this.options10.series[0].data = ret[years[0]].map(_ => _['SEND_AMT'])
          this.options10.series[1].data = ret[years[1]].map(_ => _['SEND_AMT'])
        }

        this.yearMonthValues = ret[years[0]].filter(_ => _['MDATE'])

        const SEND_AMT = this.yearMonthValues.reduce((acc, cur) => {
          return acc + cur['SEND_AMT']
        }, 0)
        const AGO_SEND_AMT = this.yearMonthValues.reduce((acc, cur) => {
          return acc + cur['AGO_SEND_AMT']
        }, 0)
        const SEND_AMT_TGT = this.yearMonthValues.reduce((acc, cur) => {
          return acc + cur['SEND_AMT_TGT']
        }, 0)
        this.yearTotValues = {
          SEND_AMT: SEND_AMT,
          AGO_SEND_AMT: AGO_SEND_AMT,
          SEND_AMT_TGT: SEND_AMT_TGT,
          SEND_AMT_YOY_INCR: SEND_AMT - AGO_SEND_AMT,
          SEND_AMT_YOY: (SEND_AMT / AGO_SEND_AMT) - 1
        }
      })
    },
    mouseenter(col, row,type) {
      this.curCol = col
      this.curRow = row
      this.curType = type
    },

  }
}
</script>

<style lang="scss" scoped>
/deep/ .ant-checkbox-wrapper {
  margin-left: 8px;
  height: 18px;
  overflow: hidden;
}

/deep/ .ant-radio-wrapper {
  margin-left: 8px;

}

.dashboard-common-table {
  /deep/ td {
    height: calc(((var(--height) - 180) * .5px) / 6);
  }
}

.ch1 {
  height: calc((var(--height) - 130) * 1px);
}

.ch10 {
  height: calc((var(--height) - 150) * .5px);
}
</style>
