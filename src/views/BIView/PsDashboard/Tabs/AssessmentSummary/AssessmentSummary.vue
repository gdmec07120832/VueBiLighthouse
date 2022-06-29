<template>
  <div class="px15">
    <!-- style="height: 30px" class="text-black" -->
    <div class="flex-between" style="padding: 10px 0px;">
      <!-- <div class="chart-sub-title" style="line-height: 41px;">考核指标汇总</div> -->
      <Title :label="'考核指标汇总'" />
      <div>
        <ez-month-select v-model="query.yearMonth">
          <div class="flex-between text-xs" style="height: 24px; color: #808492">
            {{ `统计年月（${query.yearMonth.getFullYear()}-${query.yearMonth.getMonth() + 1}）` }}
            <div style="margin-left: 40px" class="dropdown-icon">
              <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
            </div>
          </div>
        </ez-month-select>
      </div>
    </div>

    <div class="mt10">
      <div class="flex-start" style="height: 30px">
        <span style="flex: 0 0 100px" class="text-black">指标选择</span>
        <div>
          <a-radio-group v-model="query.valueType" class="valueTypeRadioWrapper">
            <a-radio value="1">发货业绩</a-radio>
            <a-radio value="2">日均欠货</a-radio>
            <a-radio value="3">滞销库存</a-radio>
            <a-radio value="4">年化周转</a-radio>
            <a-radio value="5">售后不良</a-radio>
            <a-radio value="6">SKU均值</a-radio>
            <a-radio value="7">新品业绩</a-radio>
            <a-radio value="8">预测准确率</a-radio>
            <a-radio value="9">成品达交</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="flex-start mt10" style="height: 30px">
        <span style="flex: 0 0 100px" class="text-black">项目组</span>
        <div style="height: 24px; overflow: auto">
          <a-checkbox-group v-model="query.teams" class="teamsCheckBoxWrapper">
            <a-checkbox value="办公家具项目部">办公家具项目部</a-checkbox>
            <a-checkbox value="布床项目部">布床项目部</a-checkbox>
            <a-checkbox value="小件开发项目部">小件开发项目部</a-checkbox>
            <a-checkbox value="功能项目部">功能项目部</a-checkbox>
            <a-checkbox value="皮沙发项目部">皮沙发项目部</a-checkbox>
            <a-checkbox value="床垫项目部">床垫项目部</a-checkbox>
            <a-checkbox value="皮床项目部">皮床项目部</a-checkbox>
            <a-checkbox value="实木项目部">实木项目部</a-checkbox>
            <a-checkbox value="柜类项目部">柜类项目部</a-checkbox>
            <a-checkbox value="儿童项目部">儿童项目部</a-checkbox>
            <a-checkbox value="布沙发项目部">布沙发项目部</a-checkbox>
            <a-checkbox value="板木项目部">板木项目部</a-checkbox>
            <a-checkbox value="板式项目部">板式项目部</a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
    </div>


    <div class="ch1" style="position: relative">
      <div v-if="query.valueType === '1'"
           style="position: absolute;" class="text-xs text-red">备注：发货业绩为月初冻结上月数据
      </div>
      <v-chart ref="chart1" autoresize :options="chartOptions"/>
    </div>

    <div class="mt10">
      <ASTable1 :query="query" :year-month-values="yearMonthValues"
                v-if="query.valueType === '1'"/>
      <ASTable2 :query="query" :year-month-values="yearMonthValues"
                v-if="query.valueType === '2'"/>
      <ASTable3 :query="query" :year-month-values="yearMonthValues"
                v-if="query.valueType === '3'"/>
      <ASTable4 :query="query" :year-month-values="yearMonthValues"
                v-if="query.valueType === '4'"/>
      <ASTable5 :query="query" :year-month-values="yearMonthValues"
                v-if="query.valueType === '5'"/>
      <ASTable6 :query="query" :year-month-values="yearMonthValues"
                v-if="query.valueType === '6'"/>
      <ASTable7 :query="query" :year-month-values="yearMonthValues"
                v-if="query.valueType === '7'"/>
      <ASTable8 :query="query" :year-month-values="yearMonthValues"
                v-if="query.valueType === '8'"/>
      <ASTable9 :query="query" :year-month-values="yearMonthValues"
                v-if="query.valueType === '9'"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import EzMonthSelect from '@/views/BIView/OperateDashboard/components/EzMonthSelect'
import numeral from 'numeral'
import ASTable1 from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/ASTable1'
import ASTable2 from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/ASTable2'
import ASTable3 from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/ASTable3'
import ASTable4 from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/ASTable4'
import ASTable5 from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/ASTable5'
import ASTable6 from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/ASTable6'
import ASTable7 from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/ASTable7'
import ASTable8 from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/ASTable8'
import ASTable9 from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/ASTable9'
import mixin from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/Tables/mixin'
import graphic from 'echarts/lib/util/graphic'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'

export default {
  mixins: [mixin],
  name: 'AssessmentSummary',
  components: {
    ASTable1,
    ASTable2,
    ASTable3,
    ASTable4,
    ASTable5,
    ASTable6,
    ASTable7,
    ASTable8,
    ASTable9,
    EzMonthSelect,
    Title
  },
  data () {
    const months = Array(12).fill(null).map((_, i) => i + 1)
    return {
      fetchId: 0,
      months,
      teamOptions: [],
      query: {
        valueType: '1',
        teams: [],
        yearMonth: moment().subtract(1, 'month').toDate()
      },
      chartOptions: {
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
            z: 10,
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
      yearMonthValues: {},
    }
  },
  watch: {
    'query.valueType' () {
      if (this[`getData${this.query.valueType}`]) {
        this[`getData${this.query.valueType}`]()
      }
    },
    'query.yearMonth' () {
      if (this[`getData${this.query.valueType}`]) {
        this[`getData${this.query.valueType}`]()
      }
    },
    'query.teams' () {
      if (this[`getData${this.query.valueType}`]) {
        this[`getData${this.query.valueType}`]()
      }
    }
  },
  mounted () {
    this.getData1()
  },
  methods: {
    theFetchSql (interfaceName) {
      this.fetchId = ++this.fetchId
      const lastId = this.fetchId
      this.$refs.chart1.clear()
      this.chartOptions.yAxis.max = undefined
      this.chartOptions.yAxis.min = undefined
      return this.$fetchSql('pds_cockpit', interfaceName, {
        MDATE: moment(this.query.yearMonth).format('YYYYMM'),
        YDATE: [this.year, this.year - 1].toString(),
        TEAM_SUPPLY: this.query.teams.toString()
      }).then(({ data }) => {
        if (lastId !== this.fetchId) {
          return Promise.reject('canceled')
        }
        const ret = this.resolveData(data)
        this.yearMonthValues = ret
        return ret
      })
    },
    resolveData (data) {
      const year = (this.query.yearMonth).getFullYear()
      this.chartOptions.series[0].name = year
      this.chartOptions.series[1].name = year - 1
      const ret = {
        [year]: Array(12).fill({}),
        [year - 1]: Array(12).fill({})
      }
      for (let item of data) {
        const y = moment(item.MDATE).year()
        const m = moment(item.MDATE).month()
        ret[y] && (ret[y][m] = item)
      }
      return ret
    },
    getData1 () {
      this.theFetchSql('idx_sum_dlvr_amt').then((ret) => {
        this.chartOptions.tooltip.formatter = (params) => {
          const lines = params.map(_ => {
            return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0,0') : '--'}`
          }).join('')
          return `${params[0].axisValue} 发货业绩${lines}`
        }
        this.chartOptions.series[0].data = ret[this.year].map(_ => _['SEND_AMT'])
        this.chartOptions.series[1].data = ret[this.year - 1].map(_ => _['SEND_AMT'])
      })
    },
    getData2 () {
      this.theFetchSql('idx_sum_avg_shrt').then(ret => {
        this.chartOptions.tooltip.formatter = (params) => {
          const lines = params.map(_ => {
            return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0,0') : '--'}`
          }).join('')
          return `${params[0].axisValue} 日均欠货${lines}`
        }
        this.chartOptions.series[0].data = ret[this.year].map(_ => _['AVG_PURPRICE1'])
        this.chartOptions.series[1].data = ret[this.year - 1].map(_ => _['AVG_PURPRICE1'])
      })
    },
    getData3 () {
      this.theFetchSql('idx_sum_rem_inv_amt').then((ret) => {
        this.chartOptions.tooltip.formatter = (params) => {
          const lines = params.map(_ => {
            return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0,0') : '--'}`
          }).join('')
          return `${params[0].axisValue} 滞销库存${lines}`
        }
        this.chartOptions.series[0].data = ret[this.year].map(_ => _['REM_INV_AMT'])
        this.chartOptions.series[1].data = ret[this.year - 1].map(_ => _['REM_INV_AMT'])
      })
    },
    getData4 () {
      this.theFetchSql('idx_sum_trnvr_rto').then((ret) => {
        this.chartOptions.tooltip.formatter = (params) => {
          const lines = params.map(_ => {
            return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0,0.00') : '--'}`
          }).join('')
          return `${params[0].axisValue} 年华周转${lines}`
        }
        this.chartOptions.series[0].data = ret[this.year].map(_ => _['TRNVR_RATE'])
        this.chartOptions.series[1].data = ret[this.year - 1].map(_ => _['TRNVR_RATE'])
      })
    },
    getData5 () {
      this.theFetchSql('idx_sum_qbd_afs_rto').then((ret) => {
        this.chartOptions.tooltip.formatter = (params) => {
          const lines = params.map(_ => {
            return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0.00%') : '--'}`
          }).join('')
          return `${params[0].axisValue} 售后不良${lines}`
        }
        this.chartOptions.series[0].data = ret[this.year].map(_ => _['SHBLS_RTO'])
        this.chartOptions.series[1].data = ret[this.year - 1].map(_ => _['SHBLS_RTO'])
      })
    },
    getData6 () {
      this.theFetchSql('idx_sum_sku_avg_amt').then((ret) => {
        this.chartOptions.tooltip.formatter = (params) => {
          const lines = params.map(_ => {
            return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0,0') : '--'}`
          }).join('')
          return `${params[0].axisValue} SKU均值${lines}`
        }
        this.chartOptions.series[0].data = ret[this.year].map(_ => _['SKU_AVG_AMT'])
        this.chartOptions.series[1].data = ret[this.year - 1].map(_ => _['SKU_AVG_AMT'])
      })
    },
    getData7 () {
      this.theFetchSql('idx_sum_new_mtrl_amt').then((ret) => {
        this.chartOptions.tooltip.formatter = (params) => {
          const lines = params.map(_ => {
            return `<br>${_.marker}${_.seriesName}: ${_.value ? this.formatW(_.value) : '--'}`
          }).join('')
          return `${params[0].axisValue} 新品业绩${lines}`
        }
        this.chartOptions.series[0].data = ret[this.year].map(_ => _['NEW_SALE_AMT'])
        this.chartOptions.series[1].data = ret[this.year - 1].map(_ => _['NEW_SALE_AMT'])
      })
    },
    getData8 () {
      this.theFetchSql('idx_sum_frcst_accuracy').then((ret) => {
        this.chartOptions.tooltip.formatter = (params) => {
          const lines = params.map(_ => {
            return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0,0') : '--'}`
          }).join('')
          return `${params[0].axisValue} 预测准确率${lines}`
        }
        const prop = this.query.teams.length ? 'SPL_CURR_SCORE' : 'TOT_CURR_SCORE'
        this.chartOptions.series[0].data = ret[this.year].map(_ => _[prop])
        this.chartOptions.series[1].data = ret[this.year - 1].map(_ => _[prop])
      })
    },
    getData9 () {
      this.theFetchSql('idx_sum_deal_rto').then((ret) => {
        this.chartOptions.tooltip.formatter = (params) => {
          const lines = params.map(_ => {
            return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0.00%') : '--'}`
          }).join('')
          return `${params[0].axisValue} 成品达交${lines}`
        }
        this.chartOptions.yAxis.min = (val) => {
          return val.min * 0.95
        }
        this.chartOptions.yAxis.max = (val) => {
          return val.max / 0.95
        }
        this.chartOptions.series[0].data = ret[this.year].map(_ => _['DEAL_RTO'])
        this.chartOptions.series[1].data = ret[this.year - 1].map(_ => _['DEAL_RTO'])
      })
    },
  }

}
</script>

<style lang="scss" scoped>
/deep/ .dashboard-common-table {
  td {
    height: calc(((var(--height) - 140) * .3px) / 4);
  }
}

.valueTypeRadioWrapper {
  /deep/ .ant-radio-wrapper {
    width: 120px;
  }
}


.teamsCheckBoxWrapper {
  /deep/ .ant-checkbox-wrapper {
    width: 120px;
    margin-bottom: 5px;
    margin-left: 0;
    margin-right: 8px;
  }
}

.ch1 {
  height: calc((var(--height) - 150) * .7px);
}
</style>
