<template>
  <div style="overflow-x: hidden">
    <div class="flex-between py5" style="padding-top: 10px; border-bottom: 0px solid #F0F0F0;">
      <div class="chart-sub-title">
        <Title class="title" :label="'实时总览'" />
      </div>
      <div class="flex">
        <div class="mr5">视角</div>
        <a-tooltip overlayClassName="light-tooltip" placement="top">
          <template slot="title">
            <div class="text-black text-xs" style="width: 350px">
              <div>视角说明</div>
              <div>一、 全司视角：全公司产生业绩汇总，但不含其他（非正常业务产生的业绩）</div>
              <div>二、 全中视角：全司视角的统计对象基础上，但不含①定制&拎包、②品牌市场所属业绩、③其他</div>
              <div>三、 品市视角：母婴店、快手店、抖音店，海外B2C的汇总业绩</div>
            </div>
          </template>
          <a-icon style="color: rgba(0, 0, 0, 0.45); cursor: pointer" type="question-circle" />
        </a-tooltip>
        <span class="mx5" style="color: rgba(0, 0, 0, 0.45)">:</span>
        <a-radio-group v-model="currentView">
          <a-radio :value="1">全司视角</a-radio>
          <a-radio :value="2">全中视角</a-radio>
          <a-radio :value="3">品市视角</a-radio>
        </a-radio-group>
      </div>
    </div>

    <div class="flex pt10">
      <div
        :class="{ active: currentChannel === 'all' }"
        class="view-item flex-between"
        style="width: 34%"
        @click="handleTabClick('all')"
      >
        <div ref="pieChart" style="width: 25%; height: 120px" />
        <div style="width: 70%">
          <div class="view-type">{{ currentText }}</div>
          <div class="main-value">{{ numeral(allValues.SALE_AMT).format('0,0') }}</div>
          <div>
            <div class="flex metric-values">
              <div class="flex">
                <span>目标</span>
                <span>{{ numeral(allValues.SALES_TARGET).format('0,0') }}</span>
              </div>
              <div class="flex">
                <span>差值</span>
                <span>{{ numeral(allValues.DIF_AMT).format('0,0') }}</span>
              </div>
            </div>
            <div class="flex metric-values">
              <div class="flex">
                <span>同比</span>
                <span
                  :class="allValues.AGO_DIF_RATE > 0 ? 'text-red' : allValues.AGO_DIF_RATE < 0 ? 'text-green' : ''"
                  >{{ numeral(allValues.AGO_DIF_RATE).format('0.[0]%') }}</span
                >
              </div>
              <div class="flex">
                <span>同期</span>
                <span>{{ numeral(allValues.AGO_SALE_AMT).format('0,0') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :class="{ active: currentChannel === 'online' }" class="view-item" @click="handleTabClick('online')">
        <div>
          <div class="view-type">线上渠道</div>
          <div class="main-value">{{ numeral(onlineValues.SALE_AMT).format('0,0') }}</div>
          <div>
            <div class="flex metric-values">
              <div class="flex">
                <span>目标</span>
                <span>{{ numeral(onlineValues.SALES_TARGET).format('0,0') }}</span>
              </div>
              <div class="flex">
                <span>达成</span>
                <span :class="onlineValues.CMP_RATE >= 1 ? 'text-red' : 'text-green'">{{
                  numeral(onlineValues.CMP_RATE).format('0.[0]%')
                }}</span>
              </div>
            </div>
            <div class="flex metric-values">
              <div class="flex">
                <span>同比</span>
                <span
                  :class="
                    onlineValues.AGO_DIF_RATE > 0 ? 'text-red' : onlineValues.AGO_DIF_RATE < 0 ? 'text-green' : ''
                  "
                  >{{ numeral(onlineValues.AGO_DIF_RATE).format('0.[0]%') }}</span
                >
              </div>
              <div class="flex">
                <span>占比</span>
                <span>{{ numeral(onlineValues.TOT_RATE).format('0.[0]%') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="currentView !== 3"
        :class="{ active: currentChannel === 'offline' }"
        class="view-item"
        @click="handleTabClick('offline')"
      >
        <div>
          <div class="view-type">线下渠道</div>
          <div class="main-value">{{ numeral(offlineValues.SALE_AMT).format('0,0') }}</div>
          <div>
            <div class="flex metric-values">
              <div class="flex">
                <span>目标</span>
                <span>{{ numeral(offlineValues.SALES_TARGET).format('0,0') }}</span>
              </div>
              <div class="flex">
                <span>达成</span>
                <span :class="offlineValues.CMP_RATE >= 1 ? 'text-red' : 'text-green'">{{
                  numeral(offlineValues.CMP_RATE).format('0.[0]%')
                }}</span>
              </div>
            </div>
            <div class="flex metric-values">
              <div class="flex">
                <span>同比</span>
                <span
                  :class="
                    offlineValues.AGO_DIF_RATE > 0 ? 'text-red' : offlineValues.AGO_DIF_RATE < 0 ? 'text-green' : ''
                  "
                  >{{ numeral(offlineValues.AGO_DIF_RATE).format('0.[0]%') }}</span
                >
              </div>
              <div class="flex">
                <span>占比</span>
                <span>{{ numeral(offlineValues.TOT_RATE).format('0.[0]%') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="currentView !== 3"
        :class="{ active: currentChannel === 'abroad' }"
        class="view-item"
        @click="handleTabClick('abroad')"
      >
        <div>
          <div class="view-type">海外渠道</div>
          <div class="main-value">{{ numeral(abroadValues.SALE_AMT).format('0,0') }}</div>
          <div>
            <div class="flex metric-values">
              <div class="flex">
                <span>目标</span>
                <span>{{ numeral(abroadValues.SALES_TARGET).format('0,0') }}</span>
              </div>
            </div>
            <div class="flex metric-values">
              <div>
                <span>海外渠道并非每天产生业绩</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-between py5" style="padding-bottom: 0px;">
      <div class="py15 flex-start">
        <div class="chart-sub-title">
          {{ showType === 1 ? '数据趋势' : '数据图表'
          }}<span v-if="showType === 1"
            >（ {{ currentText
            }}<span>{{ { online: '线上渠道', offline: '线下渠道', abroad: '海外渠道' }[currentChannel] }}</span
            >）</span
          >
        </div>
        <a-radio-group v-model="showType" class="ml15">
          <a-radio :value="1">趋势图</a-radio>
          <a-radio :value="2">图表</a-radio>
        </a-radio-group>
      </div>
      <div v-show="showType === 1" class="flex-start">
        <div class="tab-wrapper">
          <div :class="{ active: dateType === 1 }" class="tab" @click="dateType = 1">同期对比</div>
          <div :class="{ active: dateType === 2 }" class="tab" @click="dateType = 2">对比日期</div>
        </div>
        <a-date-picker
          v-if="dateType === 2"
          v-model="chartDate"
          :allowClear="false"
          :disabledDate="disabledDate"
          size="small"
          style="width: 148px; margin-left: 2px"
          valueFormat="YYYYMMDD"
        />
      </div>
    </div>

    <div v-if="showType === 1" class="flex flex-between">
      <div ref="chart1" class="chart"></div>
      <div ref="chart2" class="chart"></div>
    </div>

    <div v-if="showType === 2" class="grid-wrapper">
      <div class="cate" :style="{width: [1,2].includes(currentView) ? '18%' : '9%'}">
        <div class="grid-cell head bold">汇总</div>
        <div class="flex-between">
          <div style="flex: 1">
            <div class="grid-cell bold">渠道细分</div>
            <div class="grid-cell bold">目标</div>
            <div class="grid-cell bold">实绩</div>
            <div class="grid-cell bold">达成</div>
            <div class="grid-cell bold">占总</div>
            <div class="grid-cell bold">同比</div>
          </div>
          <div style="flex: 1" v-if="[1, 2].includes(currentView)">
            <GridCol :getGridCellValue="getGridCellValue" channel="汇总" text="合计" />
          </div>
        </div>
      </div>
      <div v-if="currentView === 3" class="cate" style="width: 9%">
        <div class="grid-cell head bold">线上</div>
        <div style="flex: 1">
          <GridCol :getGridCellValue="getGridCellValue" channel="线上渠道" text="合计" />
        </div>
      </div>
      <div v-if="[1, 2].includes(currentView)" class="cate" style="width: 18%">
        <div class="grid-cell head bold">线上</div>
        <div class="flex-between">
          <div style="flex: 1">
            <GridCol :getGridCellValue="getGridCellValue" channel="线上平台" />
          </div>
          <div style="flex: 1">
            <GridCol :getGridCellValue="getGridCellValue" channel="线上外包" />
          </div>
        </div>
      </div>
      <div v-if="[1, 2].includes(currentView)" class="cate" style="width: 46%">
        <div class="grid-cell head bold">线下</div>
        <div class="flex-between">
          <div style="flex: 1">
            <GridCol :getGridCellValue="getGridCellValue" channel="线下直营" />
          </div>
          <div style="flex: 1">
            <GridCol :getGridCellValue="getGridCellValue" channel="线下经销" />
          </div>
          <div style="flex: 1">
            <GridCol :getGridCellValue="getGridCellValue" channel="线下家装" />
          </div>
          <div style="flex: 1">
            <GridCol :getGridCellValue="getGridCellValue" channel="线下定制" />
          </div>
          <div style="flex: 1">
            <GridCol :getGridCellValue="getGridCellValue" channel="线下拎包" />
          </div>
        </div>
      </div>
      <div v-if="[1, 2].includes(currentView)" class="cate" :style="{width: currentView === 1 ? '18%' : '9%'}">
        <div class="grid-cell head bold">海外</div>
        <div class="flex-between">
          <div style="flex: 1;">
            <GridCol :getGridCellValue="getGridCellValue" channel="海外B2B" />
          </div>
          <div style="flex: 1;"  v-if="currentView === 1">
            <GridCol :getGridCellValue="getGridCellValue" channel="海外B2C" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce, find, keyBy, merge } from 'lodash'
import numeral from 'numeral'
import * as echarts from 'echarts5/lib/echarts'
import 'echarts5/lib/component/tooltip'
import 'echarts5/lib/component/title'
import { GraphicComponent, GridComponent } from 'echarts5/components'
import { LineChart, PieChart } from 'echarts5/charts'
import moment from 'moment'
import Title from '../../components/Title'
import echartsColor from '../../utils/echartsColor.js'
echarts.use([GridComponent, LineChart, PieChart, GraphicComponent])

const pieOptions = {
  graphic: [
    {
      type: 'text',
      left: 'center',
      top: 'center',
      z: 10,
      style: {
        fill: '#333333',
        font: '20px "PingFangSC-Medium", "PingFang SC"',
      },
    },
    {
      type: 'text',
      left: 'center',
      top: '84%',
      z: 10,
      style: {
        fill: 'rgba(0, 0, 0, 0.65)',
        text: '达成',
        font: '14px "PingFangSC-Regular", "PingFang SC"',
      },
    },
  ],
  series: [
    {
      silent: true,
      color: ['#5A8DF3', 'transparent', 'transparent'],
      type: 'pie',
      radius: ['78%', '94%'],
      avoidLabelOverlap: false,
      startAngle: 234,
      itemStyle: {
        borderRadius: '50%',
      },
      label: {
        show: false,
      },
      emphasis: {
        inherit: 'transparent',
        scale: false,
        label: {
          show: true,
          fontSize: '40',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
      z: 2,
    },
    {
      silent: true,
      color: ['#F0F0F0', 'transparent'],
      name: 'back',
      type: 'pie',
      radius: ['78%', '94%'],
      avoidLabelOverlap: false,
      startAngle: 234,
      itemStyle: {
        borderRadius: '50%',
      },
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '40',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [{ value: 800 }, { value: 200 }],
      z: 1,
    },
  ],
}

const commonOptions = {
  grid: {
    top: 50,
    left: 0,
    right: 0,
    bottom: 10,
    containLabel: true,
  },
  title: {
    text: '分时趋势图',
    textStyle: {
      fontSize: 14,
      fontWeight: 400,
      fontFamily: 'PingFangSC-Medium, PingFang SC',
      color: '#4D5053',
      lineHeight: 20,
    },
    top: 0,
    left: 0,
  },
  // color: ['#5B8FF9', '#DFE4EA', '#DFE4EA'],
  color: [echartsColor.thisYear, echartsColor.previousYear],
  colorBy: 'series',
  tooltip: {
    trigger: 'axis',
    formatter: function (params) {
      let str = `小时: ${params[0].axisValue}<br/>`
      params.forEach((item) => {
        str += item.seriesName + ':' + numeral(item.value).format('0,0') + '<br/>'
      })
      return str
    },
    axisPointer: {
      type: 'line',
      lineStyle: {
          type: 'solid'
      },
    },
  },
  xAxis: {
    type: 'category',
    data: Array.from({ length: 24 }).map((_, i) => i),
    axisLabel: {
      color: echartsColor.axisLabel,
      fontSize: 12,
      fontFamily: 'Helvetica',
    },
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: true,
      lineStyle: {
          color: [echartsColor.splitLine],
      },
    },
    axisLabel: {
      color: echartsColor.axisLabel,
      fontSize: 12,
      fontFamily: 'Helvetica',
      formatter: function (value, index) {
        return (value / 10000).toLocaleString() + '万'
      },
    },
  },
  series: [
    {
      name: '支付业绩',
      data: [],
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {
        // opacity: 0.2,
        opacity: 1,
        color:{
          type:'linear',
          x:0,
          y:0,
          x2:0,
          y2:1,
          colorStops:[{
            offset: 0, color: echartsColor.NewPeriod1
          },{
            offset:1,color: echartsColor.NewPeriod2
          }],
          global:false
        }

      },
      z: 2,
    },
    {
      name: '同期业绩',
      data: [],
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {
        normal: {
          // opacity: 0.2
          opacity: 1,
          color:{
            type:'linear',
            x:0,
            y:0,
            x2:0,
            y2:1,
            colorStops:[{
              offset: 0, color: echartsColor.NewYOY1
            },{
              offset:1,color: echartsColor.NewYOY2
            }],
            global:false
          }
        },
        emphasis: {
          // color: echartsColor.previousYear,
          // opacity: 0.2
          opacity: 1,
          color:{
            type:'linear',
            x:0,
            y:0,
            x2:0,
            y2:1,
            colorStops:[{
              offset: 0, color: echartsColor.NewYOY1
            },{
              offset:1,color: echartsColor.NewYOY2
            }],
            global:false
          }
        }
      },
      lineStyle: {
          emphasis: {
              color: echartsColor.previousYear,
          }
      },
      z: 1,
    },
  ],
}

const formatAMT = (value) => {
  return numeral(value).format('0,0')
}

const formatRT = (value) => {
  return numeral(value).format('0.[00]%')
}




const GridCol = {
  functional: true,
  render(createElement, context) {
    const {channel, text, getGridCellValue} = context.props
    return <div>
      <div class="grid-cell bold">{text || channel}</div>
      <div class="grid-cell">{ formatAMT(getGridCellValue(channel, 'SALES_TARGET'))}</div>
      <div class="grid-cell">{ formatAMT(getGridCellValue(channel, 'SALE_AMT'))}</div>
      <div class={[getGridCellValue(channel, 'CMP_RATE') >= 1 ? 'text-red' : 'text-green', 'grid-cell']}>
        { formatRT(getGridCellValue(channel, 'CMP_RATE')) }
     </div>
      <div class="grid-cell">{ formatRT(getGridCellValue(channel, 'TOT_RATE')) }</div>
      <div class={['grid-cell', getGridCellValue(channel, 'AGO_DIF_RATE') > 0 ? 'text-red' : getGridCellValue(channel, 'AGO_DIF_RATE') < 0 ? 'text-green' : '']}>
        { formatRT(getGridCellValue(channel, 'AGO_DIF_RATE')) }
      </div>
    </div>
  },
}

export default {
  name: 'LivePerf',
  components: {GridCol,Title},
  computed: {
    currentText() {
      return { 1: '全司', 2: '全中', 3: '品市' }[this.currentView]
    },
  },
  data() {
    return {
      showType: 1, // 1: 趋势图  2：图表
      dateType: 1, // 1: 同期对比 2：对比日期
      chartDate: moment().format('YYYYMMDD'),
      currentView: 1,
      currentChannel: 'all', // all | online | offline | abroad
      allValues: {},
      onlineValues: {},
      offlineValues: {},
      abroadValues: {},
      gridData: [],
    }
  },
  watch: {
    currentView() {
      this.getSummary()
      this.getSubSummary()
      this.currentChannel = 'all'
      if (this.showType === 1) {
        this.getChartData()
      }
      if (this.showType === 2) {
        this.getGridData()
      }
    },
    currentChannel() {
      this.getChartData()
    },
    dateType() {
      this.chartDate = moment().format('YYYYMMDD')
    },
    chartDate() {
      this.getChartData()
    },
    showType(val) {
      if (val === 1) {
        this.getChartData()
      }
      if (val === 2) {
        this.chart1?.dispose()
        this.chart2?.dispose()
        this.getGridData()
      }
    },
  },
  mounted() {
    this.getSummary()
    this.getSubSummary()
    this.getChartData()
    const rc = () => {
      setTimeout(() => {
        this.chart1?.resize({
          animation: {
            duration: 300,
            easing: 'cubicInOut',
          },
        })
        this.chart2?.resize({
          animation: {
            duration: 300,
            easing: 'cubicInOut',
          },
        })
      }, 200)
    }
    window.addEventListener('resize', rc)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', rc)
    })
  },
  methods: {
    // for auto refresh
    _getData1() {
      this.getSummary(false)
      this.getSubSummary()
      if(this.showType === 1) {
        this.getChartData(false)
      }
      if(this.showType === 2) {
        this.getGridData()
      }
    },
    async getSummary(dispose = true) {
      try {
        const { data } = await this.$fetchSql('real_time', 'read_time_tot')
        const text = { 1: '全司视角', 2: '全中视角', 3: '品市视角' }[this.currentView]
        const ret = find(data, { CHANNEL_VIEW: text }) || {}
        this.$set(this, 'allValues', ret)
        if(dispose) {
          this.pieChart?.dispose()
          this.pieChart = null
        }
        if(!this.pieChart) {
          this.pieChart = echarts.init(this.$refs.pieChart)
        }

        this.pieChart.setOption(
          merge({}, pieOptions, {
            graphic: [
              {
                style: {
                  text: numeral(ret['CMP_RATE']).format('0.[00]%'),
                },
              },
            ],
            series: [
              {
                data: [
                  { value: ret.CMP_RATE * 80, name: '达成率' },
                  { value: (1 - ret.CMP_RATE) * 80, name: '未达成率' },
                  { value: 20, name: '' },
                ],
              },
            ],
          })
        )
      } catch (err) {
        console.log(err)
      }
    },
    async getSubSummary() {
      try {
        const { data } = await this.$fetchSql('real_time', 'read_time_tot_sub')
        const text = { 1: '全司视角', 2: '全中视角', 3: '品市视角' }[this.currentView]
        this.$set(this, 'onlineValues', find(data, { CHANNEL_VIEW: text, CHANNEL: '线上渠道' }) || {})
        this.$set(this, 'offlineValues', find(data, { CHANNEL_VIEW: text, CHANNEL: '线下渠道' }) || {})
        this.$set(this, 'abroadValues', find(data, { CHANNEL_VIEW: text, CHANNEL: '海外渠道' }) || {})
      } catch (err) {
        console.log(err)
      }
    },
    getChartData: debounce(
      async function (dispose = true) {
        try {
          const text = { 1: '全司视角', 2: '全中视角', 3: '品市视角' }[this.currentView]
          const text2 = { online: '线上渠道', offline: '线下渠道', abroad: '海外渠道' }[this.currentChannel]
          const { data } = await this.$fetchSql('real_time', 'read_time_hours', {
            CHANNEL_VIEW: text,
            CHANNEL: text2 || this.currentText,
            TDATE: this.dateType === 1 ? moment().format('YYYYMMDD') : this.chartDate,
          })
          const hoursData = keyBy(data, 'TDATE_HOURS')
          const hoursKeys = Array.from({ length: 24 }, (_, i) => {
            return ('0' + i).slice(-2)
          })

          const currentHour = moment().get('hour')
          const options1 = {
            series: [
              { data: hoursKeys.slice(0, currentHour + 1).map((key) => hoursData[key]?.['SALE_AMT']) },
              { data: hoursKeys.map((key) => hoursData[key]?.['AGO_AMT']) },
            ],
          }

          const options2 = {
            series: [
              { data: hoursKeys.slice(0, currentHour + 1).map((key) => hoursData[key]?.['SALE_AMT_TOT']) },
              { data: hoursKeys.map((key) => hoursData[key]?.['AGO_AMT_TOT']) },
            ],
          }
          this.renderChart1(options1, dispose)
          this.renderChart2(options2, dispose)
        } catch (err) {
          console.log(err)
        }
      },
      500,
      { leading: true, trailing: false }
    ),
    async getGridData() {
      const text = { 1: '全司视角', 2: '全中视角', 3: '品市视角' }[this.currentView]
      try {
        const { data } = await this.$fetchSql('real_time', 'read_time_chnl_type', {
          CHANNEL_VIEW: text,
        })
        this.$set(this, 'gridData', data || [])
      } catch (err) {
        console.log(err)
      }
    },
    getGridCellValue(channel, prop) {
      const item = find(this.gridData, { CHANNEL: channel }) || {}
      return item[prop]
    },
    formatAMT,
    formatRT,
    renderChart1(options = {}, dispose = true) {
      if(dispose) {
        this.chart1?.dispose()
        this.chart1 = null
      }
     if(!this.chart1) {
       this.chart1 = echarts.init(this.$refs.chart1)
     }
     if(this.chart1) {
       this.chart1.setOption(merge({}, commonOptions, options))
     }
    },
    renderChart2(options = {}, dispose = true) {
      if(dispose) {
        this.chart2?.dispose()
        this.chart2 = null
      }
      if(!this.chart2) {
        this.chart2 = echarts.init(this.$refs.chart2)
      }
      if(this.chart2) {
        this.chart2.setOption(
          merge(
            {},
            commonOptions,
            {
              title: {
                text: '时段累计图',
              },
            },
            options
          )
        )
      }
    },
    handleTabClick(tab) {
      this.currentChannel = tab
    },
    numeral,
    disabledDate(current) {
      return current && current > moment().startOf('day')
    },
  },
}
</script>

<style lang="scss" scoped>
.view-item {
  width: 22%;
  padding: 10px 20px 15px;
  position: relative;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: rgba(0, 0, 0, 0.01);

    & + .view-item::after {
      opacity: 0;
    }
  }

  &.active {
    background: rgba(0, 0, 0, 0.04);

    & + .view-item::after {
      opacity: 0;
    }
  }

  &:not(:first-child)::after {
    content: '';
    position: absolute;
    width: 1px;
    height: 80%;
    bottom: 6px;
    left: 0;
    background: rgba(0, 0, 0, 0.04);
  }

  .view-type {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.32);
  }

  .main-value {
    font-size: 24px;
    padding: 10px 0 10px 0;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.88);
  }

  .metric-values {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.64);

    div {
      padding: 2px 0;
      flex: 1;

      span:first-child {
        width: 35px;
      }
    }
  }
}

.tab-wrapper {
  display: flex;
  border-radius: 4px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.05);

  .tab {
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 12px;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    &.active {
      color: white;
      background: #46bca0;
    }

    &:last-child {
      margin-left: 8px;
    }
  }
}

.grid-wrapper {
  display: flex;

  margin-top: 5px;
  .cate {
    border-top: 1px solid #ededed;
    border-bottom: 1px solid #ededed;
    border-right: 1px solid #ededed;
    &:first-child {
      border-left: 1px solid #ededed;
      border-radius: 4px 0 0 4px;
    }
    &:last-child {
      border-radius: 0 4px 4px 0;
    }
  }

  .grid-cell {
    text-align: center;
    font-size: 12px;
    line-height: 36px;
    height: 36px;

    &:nth-child(odd) {
      background: #fafafa;
    }

    &.head {
      border-bottom: 1px solid #ededed;
    }

    &.bold {
      font-weight: bold;
    }
  }
}

.chart {
  width: 48%;
  height: calc((var(--height) * 1px) - 250px);
}
</style>