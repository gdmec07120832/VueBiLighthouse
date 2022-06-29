<template>
  <div class="px15">
    <!-- style="height: 30px" style="padding: 10px 0px;"-->
    <div class="flex-between" >
      <div style="display: flex;padding: 10px 0px;">
        <!-- <div class="chart-sub-title" style="line-height: 41px;">产品达交</div> -->
        <Title :label="'产品达交'" />
        <Jump @click.native="jumpTarget" />
      </div>
      
      <ez-month-select v-model="query.yearMonth">
        <div class="flex-between text-xs" style="height: 24px; color: #808492; cursor: pointer">
          {{ `年月(${query.yearMonth.getFullYear()}-${query.yearMonth.getMonth() + 1})` }}
          <div style="margin-left: 40px" class="dropdown-icon">
            <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
          </div>
        </div>
      </ez-month-select>
    </div>
    <div class="flex-between" style="align-items: flex-start">
      <div style="width: calc(60% - 10px)">
        <div class="flex-start">
          <div style="width: 33.33%">
            <div class="text-xs" style="line-height: 30px">当月累计成品达交率</div>
            <div style="font-size: 16px; font-weight: 600; line-height: 40px">
              {{ overviewData.TM_DEAL_RTO ? numeral(overviewData.TM_DEAL_RTO).format('0.00%') : '--' }}
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">目标</span>
              <span class="text-xs">
                {{ overviewData.T_TARGET ? numeral(overviewData.T_TARGET).format('0.00%') : '--' }}
              </span>
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">差值</span>
              <span class="text-xs" :class="{
                'text-red': overviewData.TM_DEAL_RTO_DIFF && overviewData.TM_DEAL_RTO_DIFF > 0,
                'text-green': overviewData.TM_DEAL_RTO_DIFF && overviewData.TM_DEAL_RTO_DIFF < 0,
              }">
                {{ overviewData.TM_DEAL_RTO_DIFF ? numeral(overviewData.TM_DEAL_RTO_DIFF).format('0.00%') : '--' }}
              </span>
            </div>
          </div>
          <div style="width: 33.33%">
            <div class="text-xs" style="line-height: 30px">年度累计成品达交率</div>
            <div style="font-size: 16px; font-weight: 600; line-height: 40px">
              {{ overviewData.YEAR_DEAL_RTO ? numeral(overviewData.YEAR_DEAL_RTO).format('0.00%') : '--' }}
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">目标</span>
              <span class="text-xs">
                {{ overviewData.YEAR_TARGET ? numeral(overviewData.YEAR_TARGET).format('0.00%') : '--' }}
              </span>
            </div>
            <div class="flex-start" style="height: 30px">
              <span style="flex: 0 0 30%" class="text-xs text-black">差值</span>
              <span class="text-xs" :class="{
                'text-red': overviewData.YEAR_DEAL_RTO_DIFF && overviewData.YEAR_DEAL_RTO_DIFF > 0,
                'text-green': overviewData.YEAR_DEAL_RTO_DIFF && overviewData.YEAR_DEAL_RTO_DIFF < 0,
              }">
                {{ overviewData.YEAR_DEAL_RTO_DIFF ? numeral(overviewData.YEAR_DEAL_RTO_DIFF).format('0.00%') : '--' }}
              </span>
            </div>
          </div>
        </div>

        <div class="ch1">
          <v-chart ref="chart" autoresize :options="options"/>
        </div>

        <div class="mt10">
          <SortTable v-bind="table2"/>
        </div>
      </div>
      <div style="width: calc(40% - 10px)">
        <div class="flex-between" style="height: 30px">
          <div class="text-black">成品项目组达交率</div>
          <div>
            <a-radio-group v-model="query.viewType">
              <a-radio value="1">当月</a-radio>
              <a-radio value="2">年度</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div>
          <SortTable v-bind="table"/>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import moment from 'moment'
import numeral from 'numeral'
import orderBy from 'lodash/orderBy'
import EzMonthSelect from '@/views/BIView/OperateDashboard/components/EzMonthSelect'
import SortTable from '@/views/BIView/PsDashboard/components/SortTable/SortTableTcq'
import graphic from 'echarts/lib/util/graphic'

import Jump from '@/views/BIView/PsDashboard/components/Jump'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'

export default {
  name: 'FinishProductCharts',
  components: { SortTable, EzMonthSelect ,Jump,Title},
  data () {
    // const thisYear = (new Date()).getFullYear()
    const months = Array(12).fill(null).map((_, i) => i + 1)
    return {
      query: {
        yearMonth: (new Date()).getDate() === 1 ? moment(new Date()).subtract(1, 'month').toDate() : new Date(),
        viewType: '1'
      },
      options: {
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
              return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0.00%') : '--'}`
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
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          max: 'dataMax',
          min: 'dataMin',
          axisLabel: {
            show: true,
            color: '#999',
            formatter (val) {
              return (val * 100).toFixed(0) + '%'
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
            data: [],
            symbol: 'none',
          },
          {
            type: 'line',
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
            symbol: 'none',
          },
        ]
      },
      table: {
        totalRow: {
          data: {},
          render (h, row) {
            return <tr style="height: calc((var(--height) - 80) * 1px / 11); font-weight: bold; text-align: center;">
              <td align="left">合计</td>
              <td class={{
                'text-red': row['TOT_DEAL_CMPL_RTO'] && row['TOT_DEAL_CMPL_RTO'] > 1,
                'text-green': row['TOT_DEAL_CMPL_RTO'] && row['TOT_DEAL_CMPL_RTO'] < 1
              }}>
                {numeral(row['TOT_DEAL_CMPL_RTO']).format('0.00%')}
              </td>
              <td>{numeral(row['TOT_TARGET']).format('0.00%')}</td>
              <td>
                {numeral(row['TOT_DEAL_RTO']).format('0.00%')}
              </td>
              <td>
                {numeral(row['AGO_TOT_DEAL_RTO']).format('0.00%')}
              </td>
              <td class={{
                'text-red': row['TOT_DEAL_RTO_YOY'] && row['TOT_DEAL_RTO_YOY'] > 0,
                'text-green': row['TOT_DEAL_RTO_YOY'] && row['TOT_DEAL_RTO_YOY'] < 0,
              }}>
                {numeral(row['TOT_DEAL_RTO_YOY']).format('0.00%')}
              </td>
            </tr>
          }
        },
        bodyStyle: { height: 'calc((var(--height) - 80) * 1px / 11 * 10 - 8px)' },
        trHeight: 'calc((var(--height) - 80) * 1px / 11)',
        dataSource: [],
        columns: [
          { dataIndex: 'TEAM_SUPPLY', title: '项目组', align: 'left' },
          {
            dataIndex: 'DEAL_CMPL_RTO', render: (h, { row, cellProp }) => {
              return <span class={{
                'text-red': row[cellProp] && row[cellProp] > 1,
                'text-green': row[cellProp] && row[cellProp] < 1,
              }}>{numeral(row[cellProp]).format('0.00%')}</span>
            }, title: '完成率'
          },
          {
            dataIndex: 'TARGET', render: (h, { row, cellProp }) => {
              return <span>{numeral(row[cellProp]).format('0.00%')}</span>
            }, title: '目标'
          },
          {
            dataIndex: 'DEAL_RTO', render: (h, { row, cellProp }) => {
              return <span>{numeral(row[cellProp]).format('0.00%')}</span>
            }, title: '实际'
          },
          {
            dataIndex: 'AGO_DEAL_RTO', render: (h, { row, cellProp }) => {
              return <span>{numeral(row[cellProp]).format('0.00%')}</span>
            }, title: '同期'
          },
          {
            dataIndex: 'DEAL_RTO_YOY', render: (h, { row, cellProp }) => {
              return <span class={{
                'text-red': row[cellProp] > 0,
                'text-green': row[cellProp] < 0
              }}>{numeral(row[cellProp]).format('0.00%')}</span>
            }, title: '同比'
          },
        ]
      },
      table2: {
        trHeight: ' calc((var(--height) - 190) * .5px / 6)',
        dataSource: [],
        columns: [
          { title: '', dataIndex: 'head' },
          {
            title: '年累计', dataIndex: 'yt', render: (h, { row, cellProp }) => {
              return <span class={{
                'text-red': row.head === '当年同比' && row[cellProp] && typeof row[cellProp] === 'number' && row[cellProp] > 0,
                'text-green': row.head === '当年同比' && row[cellProp] && typeof row[cellProp] === 'number' && row[cellProp] < 0,
              }}>{row[cellProp] && typeof row[cellProp] === 'number'
                  ? numeral(row[cellProp]).format('0.00%') : '--'}</span>
            }
          },
          {
            title: '当期累计', dataIndex: 'mt', render: (h, { row, cellProp }) => {
              return <span class={{
                'text-red': row.head === '当年同比' && row[cellProp] && typeof row[cellProp] === 'number' && row[cellProp] > 0,
                'text-green': row.head === '当年同比' && row[cellProp] && typeof row[cellProp] === 'number' && row[cellProp] < 0,
              }}>{row[cellProp] && typeof row[cellProp] === 'number'
                  ? numeral(row[cellProp]).format('0.00%') : '--'}</span>
            }
          },
          ...months.map(m => ({
            title: `${m}月`, render: (h, { row, cellProp }) => {
              if (row.head === '当年同比') {
                return <span class={{
                  'text-red': row[cellProp] && row[cellProp] > 0,
                  'text-green': row[cellProp] && row[cellProp] < 0,
                }}>{row[cellProp] ? numeral(row[cellProp]).format('0.00%') : '--'}</span>
              }
              if (row.head === '是否达标') {
                return <span class={{
                  'text-red': row[cellProp] && row[cellProp] === '是',
                  'text-green': row[cellProp] && row[cellProp] === '否',
                }}>{row[cellProp] || '--'}</span>
              }

              return <span>{row[cellProp] ? numeral(row[cellProp]).format('0.00%') : '--'}</span>
            }, dataIndex: `m${m}`
          }))
        ]
      },
      overviewData: {
        TM_DEAL_RTO: '',
        T_TARGET: '',
        TM_DEAL_RTO_DIFF: '',
        YEAR_DEAL_RTO: '',
        YEAR_DEAL_RTO_DIFF: '',
        YEAR_TARGET: ''
      }
    }
  },
  watch: {
    'query.yearMonth': {
      handler (val, oldVal) {
        if (val.getFullYear() !== oldVal.getFullYear()) {
          this.getData4()
        }
        this.getData3()
        if (this.query.viewType === '1') {
          this.getData1()
        } else {
          this.getData2()
        }
      }
    },
    'query.viewType': {
      handler (val) {
        if (val === '1') {
          this.getData1()
        } else {
          this.getData2()
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.getData3()
    this.getData4()
  },
  methods: {
    numeral,
    getData1 () {
      this.$fetchSql('pds_cockpit', 'deal_tm_spl_cmpl_rto', {
        // YDATE: moment(this.query.yearMonth).format('YYYY'),
        MDATE: moment(this.query.yearMonth).format('YYYYMM')
      }).then(({ data }) => {
        this.table.totalRow.data = data[0]
        this.table.dataSource = orderBy(data, [(data) => {
          return data['DEAL_CMPL_RTO'] === null ? -Infinity : data['DEAL_CMPL_RTO']
        }], ['desc'])
      })
    },
    getData2 () {
      this.$fetchSql('pds_cockpit', 'deal_year_spl_cmpl_rto', {
        YDATE: moment(this.query.yearMonth).format('YYYY'),
        MDATE: moment(this.query.yearMonth).format('YYYYMM')
      }).then(({ data }) => {
        this.table.totalRow.data = data[0]
        this.table.dataSource = orderBy(data, [(data) => {
          return data['DEAL_CMPL_RTO'] === null ? -Infinity : data['DEAL_CMPL_RTO']
        }], ['desc'])
      })
    },
    getData3 () {
      this.$fetchSql('pds_cockpit', 'deal_sum_cmpl_rto', {
        YDATE: moment(this.query.yearMonth).format('YYYY'),
        MDATE: moment(this.query.yearMonth).format('YYYYMM')
      }).then(({ data: [ret] }) => {
        this.overviewData = ret
      })
    },
    getData4 () {
      this.$fetchSql('pds_cockpit', 'deal_mly_rto').then(({ data }) => {
        const year = this.query.yearMonth.getFullYear()
        const ret = {
          [year]: Array(12).fill({}),
          [year - 1]: Array(12).fill({})
        }
        for (let item of data) {
          const y = moment(item.MDATE).year()
          const m = moment(item.MDATE).month()
          ret[y] && (ret[y][m] = item)
        }

        this.$refs.chart && this.$refs.chart.clear()
        this.options.series[0].name = year
        this.options.series[0].data = ret[year].map(_ => _['DEAL_RTO'])

        this.options.series[1].name = year - 1
        this.options.series[1].data = ret[year - 1].map(_ => _['DEAL_RTO'])

        const len = moment().month() + 1
        const calc = (arr) => {
          const a = arr.reduce((acc, cur) => {
            return acc + (cur['DEAL_QTY'] || 0)
          }, 0)
          const b = arr.reduce((acc, cur) => {
            return acc + (cur['CURR_RQR_QTY'] || 0)
          }, 0)
          return b ? a / b : null
        }

        const thisYearTot = year < moment().year() ? calc(ret[year]) : calc(ret[year].slice(0, len))
        const lastYearTot = year - 1 < moment().year() ? calc(ret[year - 1]) : calc(ret[year - 1].slice(0, len))

        this.thisYearTot = thisYearTot

        this.table2.dataSource = [
          {
            head: '当年目标', yt: '--', mt: '--', ...ret[year].reduce((acc, cur, idx) => {
              acc[`m${idx + 1}`] = cur['TARGET']
              return acc
            }, {})
          },
          {
            head: `${year}年`,
            yt: thisYearTot,
            mt: calc(ret[year].slice(0, len)), ...ret[year].reduce((acc, cur, idx) => {
              acc[`m${idx + 1}`] = cur['DEAL_RTO']
              return acc
            }, {})
          },
          {
            head: `${year - 1}年`,
            yt: lastYearTot,
            mt: calc(ret[year - 1].slice(0, len)), ...ret[year - 1].reduce((acc, cur, idx) => {
              acc[`m${idx + 1}`] = cur['DEAL_RTO']
              return acc
            }, {})
          },
          {
            head: `当年同比`, yt: (thisYearTot && lastYearTot) ? (thisYearTot / lastYearTot) - 1 : null, mt: (() => {
              const a = calc(ret[year].slice(0, len))
              const b = calc(ret[year - 1].slice(0, len))
              return (a && b) ? (a / b) - 1 : null
            })(), ...ret[year].reduce((acc, cur, idx) => {
              const a = cur['DEAL_RTO']
              const b = ret[year - 1][idx]['DEAL_RTO']
              acc[`m${idx + 1}`] = (a && b) ? (a / b) - 1 : null
              return acc
            }, {})
          },
          {
            head: `是否达标`, yt: '--', mt: '--', ...ret[year].reduce((acc, cur, idx) => {
              acc[`m${idx + 1}`] = cur['IS_DEAL_RTO_CMPL']
              return acc
            }, {})
          },
        ]
      })
    },
    jumpTarget() {
        let str = ''
        if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
            str = 'http://test.bi.linshimuye.com:9090/x/4_78_882_881'
        }
        else {
            str = 'http://bi.linshimuye.com:9090/x/4_78_882_881'
        }
        let msg = {
            url: str,
            webTitle: '成品达交'
        }
        window.parent.postMessage(JSON.stringify(msg), '*')
    }


  }
}
</script>

<style lang="scss" scoped>
.ch1 {
  height: calc((var(--height) - 190) * .5px - 11px);
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
