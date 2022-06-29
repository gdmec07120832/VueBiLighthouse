<template>
  <div class="px15" style="padding-bottom: 15px; background: #fff">
    <div class="flex-between my10">
      <div class="flex flex-start">
        <!-- <span class="chart-sub-title">实时总览</span> -->
        <Title :label="'实时总览'" />
      </div>
      <div>
        <div class="text-xs-radio">
          视角
          <a-tooltip placement="top" overlayClassName="light-tooltip">
            <template slot="title">
              <div class="text-black text-xs" style="width: 350px">
                <div>视角说明</div>
                <div>一、全司视角：全公司产生业绩汇总，但不包含其它（非正常业务产生的业绩）</div>
                <div>二、全中视角：全司视角的统计对象基础上，但不含①定制&拎包、②品牌市场所属业绩、③其它</div>
                <div>三、品市视角：母婴店、快手店、抖音店、海外B2C的汇总业绩</div>
              </div>
            </template>
            <a-icon type="question-circle" class="mr10" style="color: #999; cursor: pointer" />
          </a-tooltip>
          <a-radio-group v-model="query.viewType">
            <a-radio value="全司视角">全司视角</a-radio>
            <a-radio value="全中视角">全中视角</a-radio>
            <a-radio value="品市视角">品市视角</a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>

    <div class="flex-start sectionWrapper">
      <div @click="query.channel = 1" style="width: 34%" :class="{ active: query.channel === 1 }">
        <div class="text-xs">{{ query.viewType.slice(0, 2) }}</div>
        <div class="flex-start">
          <div style="height: 100px; width: 40%">
            <percentage-circle :percent="parseFloat((currentTotalData['CMP_RATE'] * 100).toFixed(2))" />
          </div>
          <div style="flex: 1; flex-flow: column; align-items: start; align-self: stretch" class="flex-between">
            <div style="font-weight: bold; font-size: 32px; text-align: left">
              {{ formatZ(currentTotalData['SALE_AMT']) }}
            </div>
            <div style="width: 100%; flex-wrap: wrap" class="flex flex-start text-xs">
              <div style="width: 50%; margin-bottom: 10px">
                目标：<span>{{ formatZ(currentTotalData['SALES_TARGET']) }}</span>
              </div>
              <div style="width: 50%; margin-bottom: 10px">
                差额：<span>{{ formatZ(currentTotalData['DIF_AMT']) }}</span>
              </div>
              <div style="width: 50%">
                同比：<span
                  :class="{
                    'text-red': currentTotalData['AGO_DIF_RATE'] > 0,
                    'text-green': currentTotalData['AGO_DIF_RATE'] < 0,
                  }"
                  >{{ transPercent(currentTotalData['AGO_DIF_RATE']) }}</span
                >
              </div>
              <div style="width: 50%">
                同期：<span>{{ formatZ(currentTotalData['AGO_SALE_AMT']) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="currentChannelTotalData['线上渠道']"
        @click="query.channel = 2"
        class="channel-section"
        :class="{ active: query.channel === 2 }"
      >
        <div style="max-width: 300px; margin: auto; height: 100%; flex-flow: column" class="flex-between">
          <div class="flex-start" style="align-items: flex-start; margin-bottom: 10px; width: 100%">
            <div style="width: 50%; padding-left: 20px">
              <img
                style="height: 50px; width: auto"
                :src="require('@/views/BIView/OperateDashboard/Tabs/LivePerf/images/p1.png')"
                alt="p1"
              />
            </div>
            <div>
              <div class="text-xs mb10">线上渠道</div>
              <div style="font-weight: bold; font-size: 20px">
                {{ formatZ(currentChannelTotalData['线上渠道']['SALE_AMT']) }}
              </div>
            </div>
          </div>
          <div style="width: 100%; flex-wrap: wrap" class="flex flex-start text-xs">
            <div style="width: 50%; margin-bottom: 10px">
              目标：<span>{{ formatZ(currentChannelTotalData['线上渠道']['SALES_TARGET']) }}</span>
            </div>
            <div style="width: 50%; margin-bottom: 10px">
              达成：<span
                :class="{
                  'text-red': currentChannelTotalData['线上渠道']['CMP_RATE'] >= 1,
                  'text-green': currentChannelTotalData['线上渠道']['CMP_RATE'] < 1,
                }"
                >{{ transPercent(currentChannelTotalData['线上渠道']['CMP_RATE']) }}</span
              >
            </div>
            <div style="width: 50%">
              同比：<span>
                {{ currentChannelTotalData['线上渠道']['YOY_RATE'] }}
              </span>
            </div>
            <div style="width: 50%">
              占总：<span>{{ transPercent(currentChannelTotalData['线上渠道']['TOT_RATE']) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="currentChannelTotalData['线下渠道']"
        @click="query.channel = 3"
        class="channel-section"
        :class="{ active: query.channel === 3 }"
      >
        <div style="max-width: 300px; margin: auto; height: 100%; flex-flow: column" class="flex-between">
          <div class="flex-start" style="align-items: flex-start; margin-bottom: 10px; width: 100%">
            <div style="width: 50%; padding-left: 20px">
              <img
                style="height: 50px; width: auto"
                :src="require('@/views/BIView/OperateDashboard/Tabs/LivePerf/images/p2.png')"
                alt="p2"
              />
            </div>
            <div>
              <div class="text-xs mb10">线下渠道</div>
              <div style="font-weight: bold; font-size: 20px">
                {{ formatZ(currentChannelTotalData['线下渠道']['SALE_AMT']) }}
              </div>
            </div>
          </div>
          <div style="width: 100%; flex-wrap: wrap" class="flex flex-start text-xs">
            <div style="width: 50%; margin-bottom: 10px">
              目标：<span>{{ formatZ(currentChannelTotalData['线下渠道']['SALES_TARGET']) }}</span>
            </div>
            <div style="width: 50%; margin-bottom: 10px">
              达成：<span
                :class="{
                  'text-red': currentChannelTotalData['线下渠道']['CMP_RATE'] >= 1,
                  'text-green': currentChannelTotalData['线下渠道']['CMP_RATE'] < 1,
                }"
                >{{ transPercent(currentChannelTotalData['线下渠道']['CMP_RATE']) }}</span
              >
            </div>
            <div style="width: 50%">
              同比：<span>{{ currentChannelTotalData['线下渠道']['YOY_RATE'] }}</span>
            </div>
            <div style="width: 50%">
              占总：<span>{{ transPercent(currentChannelTotalData['线下渠道']['TOT_RATE']) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="currentChannelTotalData['海外渠道']"
        @click="query.channel = 4"
        class="channel-section"
        :class="{ active: query.channel === 4 }"
      >
        <div style="max-width: 300px; margin: auto; height: 100%; flex-flow: column" class="flex-between">
          <div class="flex-start" style="align-items: flex-start; margin-bottom: 10px; width: 100%">
            <div style="width: 50%; padding-left: 20px">
              <img
                style="height: 50px; width: auto"
                :src="require('@/views/BIView/OperateDashboard/Tabs/LivePerf/images/p3.png')"
                alt="p3"
              />
            </div>
            <div>
              <div class="text-xs mb10">海外渠道</div>
              <div style="font-weight: bold; font-size: 20px">
                {{ formatZ(currentChannelTotalData['海外渠道']['SALE_AMT']) }}
              </div>
            </div>
          </div>
          <div style="width: 100%; flex-wrap: wrap" class="flex flex-start text-xs">
            <div style="width: 100%; margin-bottom: 10px">
              目标：<span>{{ formatZ(currentChannelTotalData['海外渠道']['SALES_TARGET']) }}</span>
            </div>
            <div style="width: 100%; margin-bottom: 10px">备注：<span>海外渠道并非每天都产生业绩</span></div>
          </div>
        </div>
      </div>
    </div>

    <!--    <div class="h210">-->
    <!--      <v-chart ref="chart01" :options="chartOptions" autoresize></v-chart>-->
    <!--    </div>-->

    <div class="flex flex-end">
      <div class="compare-type-btn" :class="{ active: compareType === 1 }" @click="compareType = 1">同期对比</div>
      <div class="compare-type-btn" :class="{ active: compareType === 2 }" @click="compareType = 2">对比日期</div>
      <a-date-picker
        :allowClear="false"
        :value="compareDate"
        v-if="compareType === 2"
        style="width: 150px"
        class="ml5"
        @change="compareTimeChange"
        :disabledDate="disableDate"
      />
    </div>
    <div class="h200 flex flex-between chartMainWrapper">
      <div style="width: calc(50% - 20px); height: 100%; position: relative">
        <div style="position: absolute; left: 0; top: 0">分时趋势图</div>
        <v-chart ref="chart001" autoresize :options="chartOptions1" />
      </div>
      <div style="width: calc(50% - 20px); height: 100%; position: relative">
        <div style="position: absolute; left: 0; top: 0">时段累计图</div>
        <v-chart ref="chart002" autoresize :options="chartOptions2" />
      </div>
    </div>
    <div class="mt10">
      <table class="table">
        <tbody>
          <tr>
            <td>渠道细分</td>
            <td v-for="(item, index) in currentChannelData" :key="index">
              {{ item['CHANNEL'] }}
            </td>
          </tr>
          <tr>
            <td>目标</td>
            <td v-for="(item, index) in currentChannelData" :key="index">
              {{ item['SALES_TARGET'] }}
            </td>
          </tr>
          <tr>
            <td>实绩</td>
            <td v-for="(item, index) in currentChannelData" :key="index">
              {{ item['SALE_AMT'] }}
            </td>
          </tr>
          <tr>
            <td>达成</td>
            <td v-for="(item, index) in currentChannelData" :key="index">
              <span
                :class="{
                  'text-red': parseFloat(item['CMP_RATE']) > 100,
                  'text-green': parseFloat(item['CMP_RATE']) < 100,
                }"
                >{{ item['CMP_RATE'] }}</span
              >
            </td>
          </tr>
          <tr>
            <td>占比</td>
            <td v-for="(item, index) in currentChannelData" :key="index">
              {{ item['TOT_RATE'] }}
            </td>
          </tr>
          <tr>
            <td>同比</td>
            <td v-for="(item, index) in currentChannelData" :key="index">
              <span
                :class="{
                  'text-red': parseFloat(item['YOY_RATE']) > 0,
                  'text-green': parseFloat(item['YOY_RATE']) < 0,
                }"
              >
                {{ item['YOY_RATE'] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import graphic from 'echarts/lib/util/graphic'
import { formatNumber } from '@/utils/helper'
import PercentageCircle from './PercentageCircle'
import sortBy from 'lodash/sortBy'
import moment from 'moment'
import Title from '@/views/BIView/PsDashboard/components/Title'


const formatZ = (num) => {
  return num && typeof num === 'number' ? formatNumber(num, 1, 0) : '0'
}
const transPercent = (num) => {
  return typeof num !== 'number' || num === 0 || isNaN(num) || !isFinite(num) ? '--' : (num * 100).toFixed(2) + '%'
}

const CHANNEL_INDEX = [
  '合计',
  '汇总',
  '线上平台',
  '线上外包',
  '线下直营',
  '线下经销',
  '线下家装',
  '线下定制',
  '线下拎包',
  '海外B2B',
  '海外B2C',
  '其它',
]

export default {
  name: 'LivePerfV2',
  components: {PercentageCircle,Title},
  data() {
    return {
      disableDate(currentDate) {
        return currentDate > moment()
      },
      query: {
        channel: 1, // 1 总览 2 线上渠道 3 线下渠道  4 海外渠道
        viewType: '全司视角',
      },
      compareType: 1, // 1：同期对比 2：时间对比
      compareDate: moment(),
      chartOptions: {
        isEmpty: false,
        emptyText: '期间暂无业务发生',
        tooltip: {
          confine: true,
          trigger: 'axis',
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params
              .reverse()
              .map((_) => `<br>${_.marker}${_.seriesName}: ${formatZ(_.value)}`)
              .join('')
            return `小时：${name}${lines}`
          },
        },
        grid: {
          top: 20,
          left: 0,
          right: 20,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          boundaryGap: false,
          data: Array(24)
            .fill(null)
            .map((_, index) => String(index).padStart(2, '0')),
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#efefef',
            },
          },
        },
        series: [
          {
            data: [],
            name: '同期业绩',
            type: 'line',
            symbol: 'none',
            smooth: true,
            animation: true,
            itemStyle: {
              color: '#cce0e9',
            },
            lineStyle: {
              color: '#cce0e9',
              width: 1.5,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#cce0e9',
                },
                {
                  offset: 1,
                  color: '#cce0e900',
                },
              ]),
            },
          },
          {
            data: [],
            name: '当天业绩',
            z: 10,
            type: 'line',
            symbol: 'none',
            smooth: true,
            animation: true,
            itemStyle: {
              color: '#2680eb',
            },
            lineStyle: {
              color: '#2680eb',
              width: 1.5,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#2680eb',
                },
                {
                  offset: 1,
                  color: '#2680eb00',
                },
              ]),
            },
          },
        ],
      },
      chartOptions1: {
        tooltip: {
          confine: true,
          trigger: 'axis',
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params
              .reverse()
              .map((_) => `<br>${_.marker}${_.seriesName}: ${formatZ(_.value)}`)
              .join('')
            return `小时：${name}${lines}`
          },
        },
        grid: {
          top: 40,
          left: 0,
          right: 20,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#808080',
            },
          },
          axisTick: {
            show: false,
          },
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(220,220,220,0.5)',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#808080',
            },
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: '同期',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#919191',
              normal: {
                color: '#DCDCDC',
                lineStyle: {
                  color: '#DCDCDC',
                  width: 2,
                },
                areaStyle: {
                  color: 'rgba(255, 255, 255, 0.00)',
                },
              },
            },
            data: [],
          },
          {
            name: '当天',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#919191',
              normal: {
                color: '#1E90FF',
                lineStyle: {
                  color: '#1E90FF',
                  width: 2,
                },
                areaStyle: {
                  color: 'rgba(255, 255, 255, 0.00)',
                },
              },
            },
            areaStyle: {},
            data: [],
          },
        ],
      },
      chartOptions2: {
        tooltip: {
          confine: true,
          trigger: 'axis',
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params
              .reverse()
              .map((_) => `<br>${_.marker}${_.seriesName}: ${formatZ(_.value)}`)
              .join('')
            return `小时：${name}${lines}`
          },
        },
        grid: {
          top: 40,
          left: 0,
          right: 20,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#808080',
            },
          },
          axisTick: {
            show: false,
          },
          boundaryGap: false,
          data: [],
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(220,220,220,0.5)',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#808080',
            },
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: '同期',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#919191',
              normal: {
                color: '#DCDCDC',
                lineStyle: {
                  color: '#DCDCDC',
                  width: 2,
                },
                areaStyle: {
                  color: 'rgba(255, 255, 255, 0.00)',
                },
              },
            },
            data: [],
          },
          {
            name: '当天',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#919191',
              normal: {
                color: '#1E90FF',
                lineStyle: {
                  color: '#1E90FF',
                  width: 2,
                },
                areaStyle: {
                  color: 'rgba(255, 255, 255, 0.00)',
                },
              },
            },
            areaStyle: {},
            data: [],
          },
        ],
      },
      timelineAllData: [], // 分小时数据
      channelAllData: [], // 渠道细分
      totalAllData: [], // 总览数据
      channelTotalData: [],
      currentChannelData: [],
      currentTotalData: {},
      currentChannelTotalData: {},
    }
  },
  watch: {
    compareType: {
      handler() {
        this.loaded = false
        this.getData5()
      },
    },
    'query.viewType': {
      handler() {
        this.loaded = false
        if (this.query.channel !== 1) {
          this.query.channel = 1
        } else {
          // this.getData1(true)
          this.getData5(true)
        }
        this.getData2(true)
        this.getData3(true)
        this.getData4(true)
      },
    },
    'query.channel': {
      handler() {
        this.loaded = false
        // this.getData1(true)
        this.getData5(true)
      },
    },
  },
  created() {
    // this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
    this.getData5()
  },
  methods: {
    transPercent,
    formatZ,
    compareTimeChange(time) {
      this.compareDate = time
      this.loaded = false
      this.getData5()
    },
    getData1(useCache) {
      let promise
      if (useCache) {
        promise = Promise.resolve({ data: this.timelineAllData })
      } else {
        promise = this.$fetchSql('kpi_report', 'live_pref_hours_new').then(({ data }) => {
          this.timelineAllData = data
          return { data }
        })
      }
      promise.then(({ data }) => {
        const timelineData = data
          .filter((item) => {
            return item['CHANNEL_VIEW'] === this.query.viewType
          })
          .filter((item) => {
            return (
              item['CHANNEL'] ===
              {
                1: this.query.viewType.slice(0, 2),
                2: '线上渠道',
                3: '线下渠道',
                4: '海外渠道',
              }[this.query.channel]
            )
          })
        const curHour = new Date().getHours()
        const fullTimelineData = Array(24)
          .fill(null)
          .map((_, index) => {
            const dayItem = timelineData.find((item) => Number(item['TDATE_HOURS']) === index)
            return dayItem
              ? Number(dayItem['TDATE_HOURS']) > curHour
                ? {
                    ...dayItem,
                    SALE_AMT: null,
                  }
                : dayItem
              : { SALE_AMT: null, AGO_AMT: null }
          })
        if (!this.loaded) {
          this.$refs['chart01']?.$refs['echarts']?.clear()
          this.loaded = true
        }
        this.chartOptions.isEmpty = !fullTimelineData.filter((item) => item.AGO_AMT !== null || item.SALE_AMT !== null)
          .length
        this.chartOptions.series[1].data = fullTimelineData.map((_) => _['SALE_AMT'])
        this.chartOptions.series[0].data = fullTimelineData.map((_) => _['AGO_AMT'])
      })
    },
    getData2(useCache) {
      let promise
      if (useCache) {
        promise = Promise.resolve({ data: this.channelAllData })
      } else {
        promise = this.$fetchSql('kpi_report', 'live_pref_chnl_type').then(({ data }) => {
          this.channelAllData = data
          return { data }
        })
      }
      promise.then(({ data }) => {
        const _data = data.filter((_) => {
          return _['CHANNEL_VIEW'] === this.query.viewType
        })

        let sortData = sortBy(_data, (o) => {
          return CHANNEL_INDEX.indexOf(o['CHANNEL']) === -1 ? 99 : CHANNEL_INDEX.indexOf(o['CHANNEL'])
        })
        sortData = sortData.map((_) => {
          return {
            CHANNEL: _['CHANNEL'],
            SALES_TARGET: formatZ(_['SALES_TARGET']),
            SALE_AMT: formatZ(_['SALE_AMT']),
            CMP_RATE: transPercent(_['CMP_RATE']),
            TOT_RATE: transPercent(_['TOT_RATE']),
            YOY_RATE: transPercent(_['SALE_AMT'] / _['AGO_SALE_AMT'] - 1),
          }
        })

        if (sortData.length < 6) {
          sortData = sortData.concat(Array(6 - sortData.length).fill({}))
        }

        this.currentChannelData = sortData
      })
    },
    getData3(useCache) {
      let promise
      if (useCache) {
        promise = Promise.resolve({ data: this.totalAllData })
      } else {
        promise = this.$fetchSql('kpi_report', 'live_pref_tot').then(({ data }) => {
          this.totalAllData = data
          return { data }
        })
      }
      promise.then(({ data }) => {
        this.currentTotalData = data.find((_) => _['CHANNEL_VIEW'] === this.query.viewType) || {}
        // this.currentTotalData['CMP_RATE'] = 0
      })
    },
    getData4(useCache) {
      let promise
      if (useCache) {
        promise = Promise.resolve({ data: this.channelTotalData })
      } else {
        promise = this.$fetchSql('kpi_report', 'live_pref_tot_sub').then(({ data }) => {
          this.channelTotalData = data
          return { data }
        })
      }
      promise.then(({ data }) => {
        let _filtered = data.filter((_) => _['CHANNEL_VIEW'] === this.query.viewType)
        _filtered = _filtered.map((_) => {
          return {
            ..._,
            YOY_RATE: transPercent(_['SALE_AMT'] / _['AGO_SALE_AMT'] - 1),
          }
        })
        let ret = {}
        for (let item of _filtered) {
          ret[item['CHANNEL']] = item
        }

        this.currentChannelTotalData = ret
      })
    },
    // 获取分时段的数据
    getData5(useCache) {
      let promise
      if (useCache) {
        promise = Promise.resolve(this.realTimeHoursData)
      } else {
        let p0 = this.$fetchSql('real_time', 'read_time_hours', {
          TDATE: moment().format('YYYYMMDD'),
        }).then(({ data }) => data)

        let p1 = this.$fetchSql('real_time', 'read_time_hours', {
          TDATE:
            this.compareType === 1
              ? moment().subtract(1, 'year').format('YYYYMMDD')
              : moment(this.compareDate).format('YYYYMMDD'),
        }).then(({ data }) => data)

        promise = Promise.all([p0, p1]).then(([data1, data2]) => {
          this.realTimeHoursData = [data1, data2]
          return [data1, data2]
        })
      }
      promise.then(([data1, data2]) => {
        const transData = (data) => {
          return data
            .filter((item) => {
              return item['CHANNEL_VIEW'] === this.query.viewType
            })
            .filter((item) => {
              return (
                item['CHANNEL'] ===
                {
                  1: this.query.viewType.slice(0, 2),
                  2: '线上渠道',
                  3: '线下渠道',
                  4: '海外渠道',
                }[this.query.channel]
              )
            })
        }

        const curData = transData(data1)
        const compareData = transData(data2)

        console.log(curData)
        console.log(compareData)
        if (!this.loaded) {
          this.$refs['chart001']?.$refs['echarts']?.clear()
          this.$refs['chart002']?.$refs['echarts']?.clear()
          this.loaded = true
        }
        this.chartOptions1.xAxis.data = curData.map((item) => item.TDATE_HOURS)
        this.chartOptions1.series[1].data = curData.map((item) => item['SALE_AMT'])
        this.chartOptions1.series[0].name =
          this.compareType === 1 ? '同期' : moment(this.compareDate).format('YYYY-MM-DD')
        this.chartOptions1.series[0].data = compareData.map((item) => item['SALE_AMT'])

        this.chartOptions2.xAxis.data = curData.map((item) => item.TDATE_HOURS)
        this.chartOptions2.series[1].data = curData.map((item) => item['SALE_AMT_TOT'])
        this.chartOptions2.series[0].name =
          this.compareType === 1 ? '同期' : moment(this.compareDate).format('YYYY-MM-DD')
        this.chartOptions2.series[0].data = compareData.map((item) => item['SALE_AMT_TOT'])
      })
    },
  },
}
</script>

<style scoped lang="scss">
.sectionWrapper {
  > div {
    padding: 10px;
    border-radius: 5px;

    &:hover,
    &.active {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.01);

      &:before {
        background-color: transparent;
      }

      + div:before {
        background-color: transparent;
      }
    }

    &.active {
      background-color: rgba(0, 0, 0, 0.02);
    }
  }
}

.text-xs-radio {
  font-size: 12px;

  /deep/ .ant-radio-wrapper {
    font-size: 12px;
  }
}

.channel-section {
  width: 22%;
  height: 130px;
  padding: 0 20px;
  position: relative;

  &:before {
    content: '';
    display: block;
    width: 1px;
    height: 80px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.07);
    position: absolute;
  }
}

.table {
  font-size: 12px;
  width: 100%;
  table-layout: fixed;

  tr {
    &:first-child {
      td {
        background-color: #f5f7ff;
      }
    }

    &:nth-child(2n + 1) {
      background-color: #fcfcff;
    }

    td {
      color: #808492;
      padding: 0 10px;
      line-height: calc((var(--height) * 1px - 200px) * 0.4 / 6);
      height: calc((var(--height) * 1px - 200px) * 0.4 / 6);
      border: 1px solid #e7e9f0;
      text-align: right;

      &:first-child {
        text-align: left;
      }
    }
  }
}

.compare-type-btn {
  line-height: 32px;
  padding: 0 10px;
  color: rgb(169, 169, 169);
  cursor: pointer;
  background: rgb(255, 255, 255);
  &.active {
    background: rgb(245, 245, 245);
  }
}

.h210 {
  height: calc((var(--height) * 1px - 200px) * 0.5);
}

.h200 {
  height: calc((var(--height) * 1px - 200px) * 0.5);
}

.chartMainWrapper {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    height: 100%;
    display: block;
    width: 1px;
    background: rgba(211, 211, 211, 0.4);
  }
}
</style>
