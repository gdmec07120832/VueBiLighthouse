<template>
  <div class="px15">
    <div style="display: flex;padding: 10px 0px;">
      <!-- <div class="chart-sub-title" style="line-height: 41px;">采购毛利</div> -->
      <Title :label="'采购毛利'" />
    </div>   

    <div class=" flex flex-between" style="align-items: flex-start">

      <div style="width: calc(55% - 10px)">
        <div class="flex-start" style="height: 30px">
          <span>集团视角</span>
          <a-tooltip placement="topRight" overlayClassName="light-tooltip">
            <template slot="title">
              <div class="text-black text-xs" style="width: 280px">
                <div class="text-xs py5">
                  口径说明：本页面数据为核算锁定版含税数据，成本为锁定成本。<br/>
                  页面说明：本日数为昨日数，累计数为本月合计数。
                </div>
              </div>
            </template>
            <a-icon type="question-circle" class="ml5" style="color: #999" />
          </a-tooltip>
        </div>
        <div>
          <div class="flex-start">
            <div style="width: 50%">
              <div style="line-height: 30px">本日采购毛利率</div>
              <div style="font-size: 22px">
                {{ formatRto(overviewData.DTD_GPR_RATE) }}
              </div>
            </div>
            <div style="width: 50%">
              <div style="line-height: 30px">本日采购毛利额</div>
              <div style="font-size: 22px">
                {{ formatW(overviewData.DTD_AMT) }}
              </div>
            </div>
          </div>
          <div class="flex-start mt10">
            <div style="width: 50%">
              <div style="line-height: 30px">累计采购毛利率</div>
              <div class="flex-start">
                <div style="width: 40%; font-size: 22px; white-space: nowrap">
                  {{ formatRto(overviewData.MTD_GPR_RATE) }}
                </div>
                <div style="width: 60%">
                  <div class="flex-start" style="width: 100%">
                    <span style="flex: 0 0 20%" class="text-xs text-gary">目标</span>
                    <span class="text-xs">
                      {{ formatRto(overviewData.GPR_TAR_LCK) }}
                    </span>
                  </div>
                  <div class="flex-start" style="width: 100%">
                    <span style="flex: 0 0 20%" class="text-xs text-gary">差值</span>
                    <span
                      class="text-xs"
                      :class="{
                        'text-red': overviewData.GPR_DIF && overviewData.GPR_DIF > 0,
                        'text-green': overviewData.GPR_DIF && overviewData.GPR_DIF < 0,
                      }"
                    >
                      {{ formatRto(overviewData.GPR_DIF) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style="width: 50%">
              <div style="line-height: 30px">累计采购毛利额</div>
              <div class="flex-start">
                <div style="width: 40%; font-size: 22px; white-space: nowrap">
                  {{ formatW(overviewData.MTD_AMT) }}
                </div>
                <div style="width: 60%">
                  <div class="flex-start" style="width: 100%">
                    <span style="flex: 0 0 20%" class="text-xs text-gary">目标</span>
                    <span class="text-xs">
                      {{ formatW(overviewData.GPA_TAR_LCK) }}
                    </span>
                  </div>
                  <div class="flex-start" style="width: 100%">
                    <span style="flex: 0 0 20%" class="text-xs text-gary">差值</span>
                    <span
                      class="text-xs"
                      :class="{
                        'text-red': overviewData.GPA_DIF && overviewData.GPA_DIF > 0,
                        'text-green': overviewData.GPA_DIF && overviewData.GPA_DIF < 0,
                      }"
                    >
                      {{ formatW(overviewData.GPA_DIF) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="ch1 mt20" style="position: relative">
          <span style="position: absolute; left: 0; top: 0">集团累计采购毛利率趋势</span>
          <v-chart ref="chart1" autoresize :options="options" />
        </div>
      </div>
      <div style="width: calc(45% - 10px)">
        <div class="flex-start" style="height: 30px">项目组视角</div>
        <SortTable :sorter.sync="table.sorter" v-bind="table" @sortCol="handleSort" />
      </div>
    </div>
  </div>

</template>

<script>
import numeral from 'numeral'
import orderBy from 'lodash/orderBy'
import SortTable from '@/views/BIView/PsDashboard/components/SortTable/SortTableTcq'
import moment from 'moment'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'
import graphic from 'echarts/lib/util/graphic'

export default {
  name: 'PurchaseProfit',
  components: { SortTable,Title },
  data() {
    return {
      table: {
        bodyStyle: {
          height: 'calc((var(--height) - 45) * 1px / 13 * 12 - 41px)',
        },
        thHeight: 'calc((var(--height) - 45) * 1px / 13)',
        trHeight: 'calc((var(--height) - 45) * 1px / 13)',
        sorter: { type: 'desc', col: 'MTD_GRS_PRFT_AMT_TAX' },
        dataSource: [],
        columns: [
          { dataIndex: 'TEAM_SUPPLY', title: '项目组', align: 'left' },
          {
            dataIndex: 'MTD_GPR_RATE',
            title: '实际毛利率',
            sortable: true,
            render(h, { row, cellProp }) {
              return <span>{numeral(row[cellProp]).format('0.00%')}</span>
            },
          },
          {
            dataIndex: 'MTD_GRS_PRFT_AMT_TAX',
            title: '采购毛利额',
            render: (h, { row, cellProp }) => {
              return <span>{row[cellProp] ? numeral(row[cellProp]).format('0,0') : '--'}</span>
            },
            sortable: true,
          },
          {
            dataIndex: 'GPA_PROP',
            title: '采购毛利额占比',
            sortable: true,
            render(h, { row, cellProp }) {
              return <span>{numeral(row[cellProp]).format('0.00%')}</span>
            },
          },
        ],
      },
      options: {
        color: ['#2680eb'],
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            const lines = params.map((_) => {
              return `<br>锁定累计采购毛利率: ${numeral(_.data.realValue).format('0.00%')}`
            })
            return `日期：${moment(params[0]['axisValue']).format('YYYY-MM-DD')}${lines}`
          },
        },
        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
          top: 10,
          right: 0,
          selectedMode: false,
        },
        grid: {
          top: 40,
          bottom: 10,
          left: 10,
          right: 10,
          containLabel: true,
        },
        xAxis: {
          data: [1, 2, 3, 4, 5, 6],
          axisLabel: {
            color: '#999',
            formatter(v) {
              return moment(v).format('DD')
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          max: 0.5,
          min: 0,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#bfc2cf',
            formatter(v) {
              return (v * 100).toFixed(0) + '%'
            },
          },
          splitLine: {
            lineStyle: {
              // type: 'dashed',
              // color: '#ececee',
              type: 'solid',
              color: echartsColor.splitLine,
            },
          },
        },
        series: [
          {
            type: 'line',
            smooth: true,
            itemStyle: {
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
        ],
      },
      overviewData: {
        DTD_GPR_RATE: '',
        MTD_GPR_RATE: '',
        GPR_TAR_LCK: '',
        GPR_DIF: '',

        DTD_AMT_TAX: '',
        MTD_AMT_TAX: '',
        GPA_TAX_TAR_LCK: '',
        GPA_TAX_DIF: '',
      },
    }
  },
  mounted() {
    this.getData1()
    this.getData2()
    this.getData3()
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
      this.$fetchSql('pds_cockpit', 'grs_prft_spl').then(({ data }) => {
        this.table.dataSource = orderBy(data, ['MTD_GRS_PRFT_AMT_TAX'], 'desc')
      })
    },
    handleSort(sorter) {
      if (sorter.col && sorter.type) {
        this.table.dataSource = orderBy(this.table.dataSource, [sorter.col], [sorter.type])
      } else {
        this.table.dataSource = orderBy(this.table.dataSource, ['MTD_GRS_PRFT_AMT_TAX'], ['desc'])
      }
    },
    getData2() {
      this.$fetchSql('KPI_REPORT', 'FIN_GPR_JT_TOP').then(({ data: [ret] }) => {
        this.overviewData = ret || {}
      })
    },
    getData3() {
      this.$fetchSql('KPI_REPORT', 'FIN_GPR_JT_BTM').then(({ data }) => {
        const _data = orderBy(data, ['TDATE'], ['asc'])
        this.$refs.chart1.clear()

        this.options.xAxis.data = _data.map((_) => _['TDATE'])
        this.options.series[0].data = _data.map((_) => {
          return {
            value: Math.min(0.5, _['MTD_GPR_RATE']),
            realValue: _['MTD_GPR_RATE'],
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.ch1 {
  height: calc((var(--height) - 220) * 1px - 41px);
}
</style>
