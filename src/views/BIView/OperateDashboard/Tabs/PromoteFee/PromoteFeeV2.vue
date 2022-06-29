<template>
  <div>
    <div class="Header">
      <Title class="title" :label="'推广费用'" />
    </div>

    <div class="flex-between">
      <div class="chart-sub-title my10">
        <span>{{ query.type === '1' ? '渠道' : '部门' }}维度</span>
        <span>({{ query.tax === '1' ? '含税' : '不含税' }})</span>
        <a-tooltip placement="topRight" overlayClassName="light-tooltip">
          <template slot="title">
            <div class="text-black text-xs" style="width: 360px">
              <div>部门费用来源费用表，在此基础上划分渠道，数据为月度填报，每月9-10号填报上月数据</div>
              <div>1、工具类：含各种工具类推广和直接挂到店铺的推广费用（例如直钻超、今日头条、朋友圈推广等）</div>
              <div>2、报销类：展览费、市场品牌部等无店铺的推广费</div>
            </div>
          </template>
          <a-icon type="question-circle" class="ml5" style="color: #999" />
        </a-tooltip>
      </div>
      <div class="flex">
        <div class="text-xs-radio mr10">
          <a-radio-group v-model="query.tax">
            <a-radio value="1">含税</a-radio>
            <a-radio value="2">不含税</a-radio>
          </a-radio-group>
        </div>
        <div class="text-xs-radio">
          维度划分：
          <a-radio-group v-model="query.type">
            <a-radio value="1">渠道</a-radio>
            <a-radio value="2">部门</a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>
    <div class="my10" v-if="query.type === '1'">
      <div class="text-xs">
        <div class="flex-start mb10" style="align-items: flex-start">
          <div style="width: 50px; flex: 0 0 auto">渠道：</div>
          <div>
            <a-checkbox-group v-model="query2.channel" class="text-xs-checkbox">
              <a-checkbox v-for="item in queryOptions.channelOptions" :key="item" :value="item">{{ item }} </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
        <div class="flex-start mb10" style="align-items: flex-start">
          <div style="width: 50px; flex: 0 0 auto">店铺：</div>
          <div style="height: 46px; overflow-y: auto">
            <a-checkbox-group v-model="query2.shop" class="text-xs-checkbox">
              <a-checkbox v-for="item in queryOptions.shopOptions" :key="item" :value="item">{{ item }} </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
      </div>
    </div>

    <div class="mt10 mb20" v-if="query.type === '2'">
      <div class="text-xs">
        <div class="flex-start mb10" style="align-items: flex-start">
          <div style="width: 80px; flex: 0 0 auto">一级部门：</div>
          <div style="height: 23px; overflow-y: auto">
            <a-checkbox-group v-model="query2.dept" class="text-xs-checkbox">
              <a-checkbox v-for="item in queryOptions.deptOptions" :key="item" :value="item">{{ item }} </a-checkbox>
            </a-checkbox-group>
          </div>
        </div>
      </div>
      <div class="text-xs">
        <div class="flex-start" style="align-items: flex-start">
          <div style="width: 80px; flex: 0 0 auto">展示方式：</div>
          <div>
            <a-radio-group v-model="query2.checkType" class="text-xs-radio">
              <a-radio value="1">整体</a-radio>
              <a-radio value="2">明细</a-radio>
            </a-radio-group>
          </div>
        </div>
      </div>
    </div>

    <div v-if="query.tax === '1' && query.type === '1'" class="flex-between">
      <div class="h275" style="position: relative; width: calc(48%)">
        <div class="chart-sub-title" style="position: absolute; top: 0; left: 0">店铺花费金额</div>
        <v-chart ref="chart01" autoresize :options="chart1Options"></v-chart>
      </div>
      <div class="h275" style="position: relative; width: calc(48%)">
        <div class="chart-sub-title" style="position: absolute; top: 0; left: 0">花费占销售比</div>
        <v-chart ref="chart02" autoresize :options="chart2Options"></v-chart>
      </div>
    </div>
    <div v-if="query.tax === '2' && query.type === '1'" class="flex-center">
      <div class="h275" style="position: relative; width: 100%">
        <div class="chart-sub-title" style="position: absolute; top: 0; left: 0">店铺花费金额</div>
        <v-chart ref="chart03" autoresize :options="chart3Options"></v-chart>
      </div>
    </div>

    <div v-if="query.type === '2' && query2.checkType === '1'" class="flex-between">
      <div class="h300" style="position: relative; width: calc(48%)">
        <div class="chart-sub-title" style="position: absolute; top: 0; left: 0">部门花费金额</div>
        <v-chart ref="chart04" autoresize :options="chart4Options"></v-chart>
      </div>
      <div class="h300" style="position: relative; width: calc(48%)">
        <div class="chart-sub-title" style="position: absolute; top: 0; left: 0">部门花费占比</div>
        <v-chart ref="chart05" autoresize :options="chart5Options"></v-chart>
      </div>
    </div>

    <div style="margin-right: -8px" v-if="query.type === '2' && query2.checkType === '2'">
      <div style="overflow-y: scroll">
        <table class="table">
          <thead>
            <tr>
              <td>部门</td>
              <td>年份</td>
              <td>年累计</td>
              <td>当期累计</td>
              <td v-for="(item, index) in Array(12).fill(null)" :key="index">{{ index + 1 }}月</td>
            </tr>
          </thead>
        </table>
      </div>
      <div style="overflow-y: scroll" class="h270">
        <table class="table">
          <tbody>
            <template v-for="dept in curSelectedDept">
              <tr :key="`${dept}-1`">
                <td rowspan="2">{{ dept }}</td>
                <td>{{ curYear }}</td>
                <td>{{ calcYearTotal(twoYearDeptHashMapData, dept, curYear) }}</td>
                <td>{{ calcYearPeriod(twoYearDeptHashMapData, dept, curYear, curMonth) }}</td>
                <td v-for="(item, index) in Array(12).fill(null)" :key="index">
                  {{ getCostByYearMonth(twoYearDeptHashMapData, dept, curYear, index + 1) }}
                </td>
              </tr>
              <tr :key="`${dept}-2`">
                <td>{{ curYear - 1 }}</td>
                <td>{{ calcYearTotal(twoYearDeptHashMapData, dept, curYear - 1) }}</td>
                <td>{{ calcYearPeriod(twoYearDeptHashMapData, dept, curYear - 1, curMonth) }}</td>
                <td v-for="(item, index) in Array(12).fill(null)" :key="index">
                  {{ getCostByYearMonth(twoYearDeptHashMapData, dept, curYear - 1, index + 1) }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt10" v-if="!(query.type === '2' && query2.checkType === '2')">
      <table class="table">
        <thead>
          <tr>
            <td>年份</td>
            <td>汇总</td>
            <td>年累计</td>
            <td>当期累计</td>
            <td v-for="m in monthName" :key="m">{{ m }}</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span style="cursor: pointer; text-decoration: underline" @click="collapsed = !collapsed"
                >{{ years[0].toString().slice(-2) }}年 <b>{{ collapsed ? '↓' : '↑' }}</b></span
              >
            </td>
            <td>小计</td>
            <td>
              {{ formatNumber(calcTotal(yearTableData[years[0]] || []), 10000, 0) + '万' }}
            </td>
            <td>
              {{ formatNumber(calcTotal((yearTableData[years[0]] || []).slice(0, curMonth)), 10000, 0) + '万' }}
            </td>
            <td v-for="(item, index) in yearTableData[years[0]] || Array(12).fill(null)" :key="index">
              {{ isUndef(item) ? '--' : formatNumber(item, 10000, 0) + '万' }}
            </td>
          </tr>
          <tr v-if="!collapsed">
            <td>{{ years[0].toString().slice(-2) }}年</td>
            <td>工具类</td>
            <td>
              {{ formatNumber(calcTotal(thisYearCategoryData['工具类'] || []), 10000, 0) + '万' }}
            </td>
            <td>
              {{ formatNumber(calcTotal((thisYearCategoryData['工具类'] || []).slice(0, curMonth)), 10000, 0) + '万' }}
            </td>
            <td v-for="(item, index) in thisYearCategoryData['工具类'] || Array(12).fill(null)" :key="index">
              {{ isUndef(item) ? '--' : formatNumber(item, 10000, 0) + '万' }}
            </td>
          </tr>
          <tr v-if="!collapsed">
            <td>{{ years[0].toString().slice(-2) }}年</td>
            <td>报销类</td>
            <td>
              {{ formatNumber(calcTotal(thisYearCategoryData['报销类'] || []), 10000, 0) + '万' }}
            </td>
            <td>
              {{ formatNumber(calcTotal((thisYearCategoryData['报销类'] || []).slice(0, curMonth)), 10000, 0) + '万' }}
            </td>
            <td v-for="(item, index) in thisYearCategoryData['报销类'] || Array(12).fill(null)" :key="index">
              {{ isUndef(item) ? '--' : formatNumber(item, 10000, 0) + '万' }}
            </td>
          </tr>
          <tr>
            <td>{{ years[1].toString().slice(-2) }}年</td>
            <td>小计</td>
            <td>
              {{ formatNumber(calcTotal(yearTableData[years[1]] || []), 10000, 0) + '万' }}
            </td>
            <td>
              {{ formatNumber(calcTotal((yearTableData[years[1]] || []).slice(0, curMonth)), 10000, 0) + '万' }}
            </td>
            <td v-for="(item, index) in yearTableData[years[1]] || Array(12).fill(null)" :key="index">
              {{ isUndef(item) ? '--' : formatNumber(item, 10000, 0) + '万' }}
            </td>
          </tr>
          <tr>
            <td>{{ years[2].toString().slice(-2) }}年</td>
            <td>小计</td>
            <td>
              {{ formatNumber(calcTotal(yearTableData[years[2]] || []), 10000, 0) + '万' }}
            </td>
            <td>
              {{ formatNumber(calcTotal((yearTableData[years[2]] || []).slice(0, curMonth)), 10000, 0) + '万' }}
            </td>
            <td v-for="(item, index) in yearTableData[years[2]] || Array(12).fill(null)" :key="index">
              {{ isUndef(item) ? '--' : formatNumber(item, 10000, 0) + '万' }}
            </td>
          </tr>
          <tr>
            <td>{{ years[0].toString().slice(-2) }}年同比</td>
            <td>-</td>
            <td>-</td>
            <td
              :class="{
                'text-red':
                  calcYoy(
                    calcTotal((yearTableData[years[0]] || []).slice(0, curMonth)),
                    calcTotal((yearTableData[years[1]] || []).slice(0, curMonth))
                  ) > 0,
                'text-green':
                  calcYoy(
                    calcTotal((yearTableData[years[0]] || []).slice(0, curMonth)),
                    calcTotal((yearTableData[years[1]] || []).slice(0, curMonth))
                  ) < 0,
              }"
            >
              {{
                calcYoy(
                  calcTotal((yearTableData[years[0]] || []).slice(0, curMonth)),
                  calcTotal((yearTableData[years[1]] || []).slice(0, curMonth))
                )
                  ? calcYoy(
                      calcTotal((yearTableData[years[0]] || []).slice(0, curMonth)),
                      calcTotal((yearTableData[years[1]] || []).slice(0, curMonth))
                    ) + '%'
                  : '--'
              }}
            </td>
            <td
              v-for="(item, index) in Array(12).fill(null)"
              :key="index"
              :class="{
                'text-red':
                  calcYoy((yearTableData[years[0]] || [])[index], (yearTableData[years[1]] || [])[index]) &&
                  calcYoy((yearTableData[years[0]] || [])[index], (yearTableData[years[1]] || [])[index]) > 0,
                'text-green':
                  calcYoy((yearTableData[years[0]] || [])[index], (yearTableData[years[1]] || [])[index]) &&
                  calcYoy((yearTableData[years[0]] || [])[index], (yearTableData[years[1]] || [])[index]) < 0,
              }"
            >
              {{
                calcYoy((yearTableData[years[0]] || [])[index], (yearTableData[years[1]] || [])[index])
                  ? calcYoy((yearTableData[years[0]] || [])[index], (yearTableData[years[1]] || [])[index]) + '%'
                  : '--'
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import uniq from 'lodash/uniq'
import { array2HashMapByKey, formatNumber, isUndef, numGroupSep } from '@/utils/helper'
import Title from '../../components/Title'
import graphic from 'echarts/lib/util/graphic'
import echartsColor from '../../utils/echartsColor.js'

const curYear = new Date().getFullYear()

const colors = {
  [curYear]: '#2680eb',
  [curYear - 1]: '#ff7f0e',
  [curYear - 2]: '#cce0e9',
}
// const colors2 = ['#cce0e9', '#ff7f0e', '#2680eb']
const colors2 = [echartsColor.Stress3_1, echartsColor.Stress2_1,echartsColor.Stress1_1]
const areaStyle2 = [

  {
    opacity:0,
    color: new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,

        color: '#EDF0F4'
      },
      {
        offset: 1,
        color: '#EDF0F4'
      }
    ])
  },

  {
    opacity:0,
    color: new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: '#9AC5FF'
      },
      {
        offset: 1,
        color: '#9AC5FF'
      }
    ])
  },
  {
    opacity:0,
    color: new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: 'rgba(92,143,249,0.2)'
      },
      {
        offset: 1,
        color: 'rgba(92,143,249,0.2)'
      }
    ])
  },

]


export default {
  components: {
    Title,
  },
  data() {
    return {
      curYear,
      channelOptionOrder: {
        线上: 1,
        线下: 2,
        海外: 3,
      },
      curMonth: new Date().getMonth(),
      years: [curYear, curYear - 1, curYear - 2],
      collapsed: true,
      monthName: Array(12)
        .fill(null)
        .map((_, index) => `${index + 1}月`),
      queryOptions: {
        deptOptions: [],
        channelOptions: [],
        shopOptions: [],
      },
      query: {
        type: '1', // 1渠道 2 部门
        tax: '1', // 1含税 2不含税
      },
      query2: {
        channel: [],
        shop: [],
        dept: [],
        checkType: '1',
      },
      yearTableData: {},
      thisYearCategoryData: {},
      twoYearDeptHashMapData: {},
      chart1Options: {
        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
          right: 0,
        },
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params
              .reverse()
              .map((item) => {
                return `<br >${item.marker}${item.seriesName}: ${
                  isUndef(item.value) ? '--' : numGroupSep(item.value.toFixed(0))
                }`
              })
              .join('')
            return `${name}${lines}`
          },
        },
        color: ['#cce0e9', '#ff7f0e', '#2680eb'],
        grid: {
          top: 40,
          left: 1,
          right: 1,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
          },
          data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
        },
        yAxis: {
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
              // type: 'dashed',
              type: 'solid',
              color: echartsColor.splitLine,
              
            },
          },
        },
        series: [],
      },
      chart2Options: {
        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
          right: 0,
        },
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params
              .reverse()
              .map((item) => {
                return `<br >${item.marker}${item.seriesName}: ${
                  isUndef(item.value) ? '--' : (item.value * 100).toFixed(2) + '%'
                }`
              })
              .join('')
            return `${name}${lines}`
          },
        },
        color: ['#cce0e9', '#ff7f0e', '#2680eb'],
        grid: {
          top: 40,
          left: 1,
          right: 1,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
          },
          data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
            formatter: (val) => {
              return (val * 100).toFixed(0) + '%'
            },
          },
          splitLine: {
            lineStyle: {
              // type: 'dashed',
              // color: '#eee',
              type: 'solid',
              color: echartsColor.splitLine,
            },
          },
        },
        series: [],
      },
      chart3Options: {
        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
          right: 0,
        },
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params
              .reverse()
              .map((item) => {
                return `<br >${item.marker}${item.seriesName}: ${
                  isUndef(item.value) ? '--' : numGroupSep(item.value.toFixed(0))
                }`
              })
              .join('')
            return `${name}${lines}`
          },
        },
        color: ['#cce0e9', '#ff7f0e', '#2680eb'],
        grid: {
          top: 40,
          left: 1,
          right: 1,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
          },
          data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
        },
        yAxis: {
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
              // type: 'dashed',
              // color: '#eee',
              type: 'solid',
              color: echartsColor.splitLine,
            },
          },
        },
        series: [],
      },
      chart4Options: {
        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
          right: 0,
        },
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          formatter: (params) => {
            const name = params[0].name
            const lines = params
              .reverse()
              .map((item) => {
                return `<br >${item.marker}${item.seriesName}: ${
                  isUndef(item.value) ? '--' : numGroupSep(item.value.toFixed(0))
                }`
              })
              .join('')
            return `${name}${lines}`
          },
        },
        color: ['#cce0e9', '#ff7f0e', '#2680eb'],
        grid: {
          top: 40,
          left: 1,
          right: 1,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
          },
          data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
        },
        yAxis: {
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
              // type: 'dashed',
              // color: '#eee',
              type: 'solid',
              color: echartsColor.splitLine,
            },
          },
        },
        series: [],
      },
      chart5Options: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12,
          },
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(150,150,150,0.1)',
            },
          },
          formatter: (params) => {
            const total = params.reduce((acc, cur) => {
              return acc + (cur.value || 0)
            }, 0)
            const noValueArr = params.filter((_) => {
              return isUndef(_.value)
            })
            const hasValueArr = params.filter((_) => {
              return !isUndef(_.value)
            })
            const orderedArr = hasValueArr.sort((a, b) => b.value - a.value).concat(noValueArr)
            const name = params[0].name
            const lines = orderedArr
              .map((item) => {
                return (
                  `<br>${item.marker}${item.seriesName}: ${
                    isUndef(item.value) ? '-' : formatNumber(item.value, 1, 0)
                  }` +
                  ` (${
                    total === 0
                      ? '0.00%'
                      : isUndef(item.value)
                      ? '0.00%'
                      : ((item.value / total) * 100).toFixed(2) + '%'
                  })`
                )
              })
              .join('')
            return `${name}${lines}`
          },
        },
        color: ['#2680eb', '#27bacb', '#f7da53', '#ee856d', '#fe9c2f', '#a486fa', '#02a7f0', '#598af7'],
        grid: {
          top: 40,
          left: 1,
          right: 1,
          bottom: 0,
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#999',
          },
          data: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
        },
        
        yAxis: {
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
              // type: 'dashed',
              // color: '#eee',
              type: 'solid',
              color: echartsColor.splitLine,
            },
          },
        },
        series: [],
      },
    }
  },
  computed: {
    curSelectedDept() {
      return this.query2.dept.length ? this.query2.dept.slice() : this.queryOptions.deptOptions.slice()
    },
  },
  watch: {
    'query.type'() {
      this.parseData(this.channelData, this.deptData)
    },
    'query.tax'() {
      this.parseData(this.channelData, this.deptData)
    },
    'query2.dept'() {
      this.parseData(this.channelData, this.deptData)
    },
    'query2.channel'(val) {
      if (val.length) {
        this.queryOptions.shopOptions = uniq(
          this.channelData
            .filter((_) => {
              return val.indexOf(_['CHANNEL_DEPARTMENT']) > -1
            })
            .map((_) => _['SHOP_NAME'])
        ).sort((a, b) => {
          const prop = this.query.tax === '1' ? 'hasTaxTotal' : 'noTaxTotal'
          return (this.shopOrder[b] || { [prop]: -Infinity })[prop] - (this.shopOrder[a] || { [prop]: -Infinity })[prop]
        })
      } else {
        this.queryOptions.shopOptions = this.shopOptions
      }
      this.parseData(this.channelData, this.deptData)
    },
    'query2.shop'(val) {
      if (val.length) {
        this.queryOptions.channelOptions = uniq(
          this.channelData
            .filter((_) => {
              return val.indexOf(_['SHOP_NAME']) > -1
            })
            .map((_) => _['CHANNEL_DEPARTMENT'])
        ).sort((a, b) => {
          return this.channelOptionOrder[a] - this.channelOptionOrder[b]
        })
      } else {
        this.queryOptions.channelOptions = this.channelOptions
      }
      this.parseData(this.channelData, this.deptData)
    },
  },
  created() {
    this.getData1()
  },
  methods: {
    isUndef,
    formatNumber,
    numGroupSep,
    calcTotal(arr) {
      return arr.reduce((acc, cur) => {
        return acc + (cur || 0)
      }, 0)
    },
    calcYoy(a, b) {
      if (isUndef(a) || isUndef(b)) {
        return null
      }
      if (b === 0) {
        return null
      }
      return ((a / b - 1) * 100).toFixed(2)
    },
    calcYearPeriod(data, dept, year, period) {
      const monthData = data?.[dept]?.[year] || {}
      const v = Object.keys(monthData).reduce((acc, cur) => {
        if (cur <= period) {
          return acc + monthData[cur]['COST']
        } else {
          return acc
        }
      }, 0)
      return formatNumber(v, 10000, 0) + '万'
    },
    calcYearTotal(data, dept, year) {
      const monthData = data?.[dept]?.[year] || {}
      const v = Object.keys(monthData).reduce((acc, cur) => {
        return acc + monthData[cur]['COST']
      }, 0)
      return formatNumber(v, 10000, 0) + '万'
    },
    getCostByYearMonth(data, dept, year, month) {
      const v = data?.[dept]?.[year]?.[month]?.['COST']
      return isUndef(v) ? '--' : formatNumber(v, 10000, 0) + '万'
    },
    getData1() {
      this.$axios.post('/api/admin/data/kpi_report/extend_fee/get').then(({ data }) => {
        const channelData = []
        const deptData = []
        data.forEach((item) => {
          if (item['TYPE'] === '渠道') {
            channelData.push(item)
          } else {
            deptData.push(item)
          }
        })
        this.channelData = channelData
        this.deptData = deptData
        this.channelOptions = uniq(channelData.map((_) => _['CHANNEL_DEPARTMENT'])).sort((a, b) => {
          return this.channelOptionOrder[a] - this.channelOptionOrder[b]
        })
        this.queryOptions.channelOptions = this.channelOptions.slice()
        this.shopHashMap = array2HashMapByKey(
          channelData.filter((_) => _['IYEAR'] === curYear),
          'SHOP_NAME'
        )
        this.shopOrder = Object.keys(this.shopHashMap).reduce((acc, cur) => {
          const data = this.shopHashMap[cur]
          const hasTaxTotal = data
            .filter((_) => _['IS_TAX'] === '是')
            .reduce((acc, cur) => {
              return acc + (cur['COST'] || 0)
            }, 0)
          const noTaxTotal = data
            .filter((_) => _['IS_TAX'] === '否')
            .reduce((acc, cur) => {
              return acc + (cur['COST'] || 0)
            }, 0)
          acc[cur] = {
            hasTaxTotal,
            noTaxTotal,
          }
          return acc
        }, {})


        this.shopOptions = uniq(channelData.map((_) => _['SHOP_NAME'])).sort((a, b) => {
          const prop = this.query.tax === '1' ? 'hasTaxTotal' : 'noTaxTotal'
          return (this.shopOrder[b] || { [prop]: -Infinity })[prop] - (this.shopOrder[a] || { [prop]: -Infinity })[prop]
        })
        this.queryOptions.shopOptions = this.shopOptions.slice()
        this.parseData(this.channelData, this.deptData)
      })
    },
    getYearDataByTaxAndExpenseType(channelData, taxType, expenseType) {
      const data = channelData.filter((_) => _['IS_TAX'] === taxType).filter((_) => _['EXPENSE_TYPE'] === expenseType)
      const filteredTaxData = data.filter((_) => {
        return (
          (this.query2.channel.length ? this.query2.channel.indexOf(_['CHANNEL_DEPARTMENT']) > -1 : true) &&
          (this.query2.shop.length ? this.query2.shop.indexOf(_['SHOP_NAME']) > -1 : true)
        )
      })
      const yearHashMap = array2HashMapByKey(filteredTaxData, 'IYEAR')
      Object.keys(yearHashMap).forEach((year) => {
        yearHashMap[year] = array2HashMapByKey(yearHashMap[year], 'IMONTH')
      })
      return yearHashMap
    },
    // eslint-disable-next-line no-unused-vars
    parseData(channelData, deptData) {
      this.yearTableData = {}
      if (this.query.type === '1') {
        // 渠道
        if (this.query.tax === '1') {
          // 含税合计
          const yearHashMap = this.getYearDataByTaxAndExpenseType(channelData, '是', '合计')
          const series1 = Object.keys(yearHashMap)
            .sort((a, b) => b - a)
            .slice(0, 3)
            .sort((a, b) => a - b)
            .map((year, i) => {
              const yearData = yearHashMap[year]
              const seriesData = Array(12)
                .fill(null)
                .map((_, index) => {
                  if (!yearData[index + 1]) {
                    return null
                  }
                  return (yearData[index + 1] || []).reduce((acc, cur) => {
                    return acc + cur['COST']
                  }, 0)
                })
              const saleData = Array(12)
                .fill(null)
                .map((_, index) => {
                  if (!yearData[index + 1]) {
                    return null
                  }
                  return (yearData[index + 1] || []).reduce((acc, cur) => {
                    return acc + cur['SALE_AMT']
                  }, 0)
                })

              const rateData = seriesData.map((_, index) => {
                return isUndef(_) || isUndef(saleData[index])
                  ? null
                  : saleData[index] === 0
                  ? null
                  : _ / saleData[index]
              })

              this.$set(this.yearTableData, year, seriesData)
              return {
                name: year,
                itemStyle: {
                  color: colors2[i],
                },
                type: 'line',
                smooth: true,
                data: seriesData,
                rate: rateData,
                symbol:'none',
                areaStyle: areaStyle2[i],
                z: i,
              }
            })
          setTimeout(() => {
            this.$refs['chart01'].$refs['echarts'].clear()
            this.chart1Options.series = series1
            this.$refs['chart02'].$refs['echarts'].clear()
            this.chart2Options.series = series1.map((_) => {
              return {
                ..._,
                data: _['rate'],
              }
            })
          }, 50)
          // 报销类
          const a = this.getYearDataByTaxAndExpenseType(channelData, '是', '报销类')
          this.thisYearCategoryData['报销类'] = Array(12)
            .fill(null)
            .map((_, index) => {
              if (!(a[curYear] || [])[index + 1]) {
                return null
              }
              return a[curYear][index + 1].reduce((acc, cur) => {
                return acc + cur['COST']
              }, 0)
            })

          // 工具类
          const b = this.getYearDataByTaxAndExpenseType(channelData, '是', '工具类')
          this.thisYearCategoryData['工具类'] = Array(12)
            .fill(null)
            .map((_, index) => {
              if (!(b[curYear] || [])[index + 1]) {
                return null
              }
              return b[curYear][index + 1].reduce((acc, cur) => {
                return acc + cur['COST']
              }, 0)
            })
        } else {
          // 渠道不含税
          const yearHashMap = this.getYearDataByTaxAndExpenseType(channelData, '否', '合计')
          const series3 = Object.keys(yearHashMap)
            .sort((a, b) => a - b)
            .map((year, i) => {
              const yearData = yearHashMap[year]
              const seriesData = Array(12)
                .fill(null)
                .map((_, index) => {
                  if (!yearData[index + 1]) {
                    return null
                  }
                  return (yearData[index + 1] || []).reduce((acc, cur) => {
                    return acc + cur['COST']
                  }, 0)
                })
              const saleData = Array(12)
                .fill(null)
                .map((_, index) => {
                  if (!yearData[index + 1]) {
                    return null
                  }
                  return (yearData[index + 1] || []).reduce((acc, cur) => {
                    return acc + cur['SALE_AMT']
                  }, 0)
                })

              const rateData = seriesData.map((_, index) => {
                return isUndef(_) || isUndef(saleData[index]) ? null : _ / saleData[index]
              })
              this.$set(this.yearTableData, year, seriesData)
              return {
                name: year,
                type: 'line',
                itemStyle: {
                  color: colors2[i],
                },
                smooth: true,
                data: seriesData,
                rate: rateData,
                symbol:'none',
                areaStyle: areaStyle2[i],
                z: i,
              }
            })
          this.chart3Options.series = series3

          // 报销类
          const a = this.getYearDataByTaxAndExpenseType(channelData, '否', '报销类')
          this.thisYearCategoryData['报销类'] = Array(12)
            .fill(null)
            .map((_, index) => {
              if (!(a[curYear] || [])[index + 1]) {
                return null
              }
              return a[curYear][index + 1].reduce((acc, cur) => {
                return acc + cur['COST']
              }, 0)
            })

          // 工具类
          const b = this.getYearDataByTaxAndExpenseType(channelData, '否', '工具类')
          this.thisYearCategoryData['工具类'] = Array(12)
            .fill(null)
            .map((_, index) => {
              if (!(b[curYear] || [])[index + 1]) {
                return null
              }
              return b[curYear][index + 1].reduce((acc, cur) => {
                return acc + cur['COST']
              }, 0)
            })
        }
      } else {
        // 部门
        this.deptHashMap = array2HashMapByKey(
          deptData.filter((_) => _['IYEAR'] === curYear),
          'CHANNEL_DEPARTMENT'
        )
        this.deptOrder = Object.keys(this.deptHashMap).reduce((acc, cur) => {
          const data = this.deptHashMap[cur]
          const hasTaxTotal = data
            .filter((_) => _['IS_TAX'] === '是')
            .reduce((acc, cur) => {
              return acc + (cur['COST'] || 0)
            }, 0)
          const noTaxTotal = data
            .filter((_) => _['IS_TAX'] === '否')
            .reduce((acc, cur) => {
              return acc + (cur['COST'] || 0)
            }, 0)
          acc[cur] = {
            hasTaxTotal,
            noTaxTotal,
          }
          return acc
        }, {})

        this.queryOptions.deptOptions = uniq(deptData.map((_) => _['CHANNEL_DEPARTMENT'])).sort((a, b) => {
          const prop = this.query.tax === '1' ? 'hasTaxTotal' : 'noTaxTotal'
          return (this.deptOrder[b] || { [prop]: -Infinity })[prop] - (this.deptOrder[a] || { [prop]: -Infinity })[prop]
        })
        let filtered = deptData.filter((_) => {
          return this.query2.dept.length ? this.query2.dept.indexOf(_['CHANNEL_DEPARTMENT']) > -1 : true
        })
        if (this.query.tax === '1') {
          filtered = filtered.filter((_) => _['IS_TAX'] === '是')
        } else {
          filtered = filtered.filter((_) => _['IS_TAX'] === '否')
        }

        const filtered1 = filtered.filter((_) => _['EXPENSE_TYPE'] === '合计')

        this.twoYearDeptHashMapData = array2HashMapByKey(
          filtered1.filter((_) => {
            return _['IYEAR'] === curYear || _['IYEAR'] === curYear - 1
          }),
          'CHANNEL_DEPARTMENT'
        )
        Object.keys(this.twoYearDeptHashMapData).forEach((dept) => {
          const yearData = array2HashMapByKey(this.twoYearDeptHashMapData[dept], 'IYEAR')

          const deptData = Object.keys(yearData).reduce((acc, cur) => {
            const monthData = array2HashMapByKey(yearData[cur], 'IMONTH')
            acc[cur] = Object.keys(monthData).reduce((_acc, _cur) => {
              _acc[_cur] = monthData[_cur][0]
              return _acc
            }, {})
            return acc
          }, {})
          this.$set(this.twoYearDeptHashMapData, dept, deptData)
        })

        const yearHashMap = array2HashMapByKey(filtered1, 'IYEAR')
        Object.keys(yearHashMap).forEach((year) => {
          yearHashMap[year] = array2HashMapByKey(yearHashMap[year], 'IMONTH')
        })
        const series4 = Object.keys(yearHashMap)
          .sort((a, b) => a - b)
          .map((year, i) => {
            const yearData = yearHashMap[year]
            const seriesData = Array(12)
              .fill(null)
              .map((_, index) => {
                if (!yearData[index + 1]) {
                  return null
                }
                return (yearData[index + 1] || []).reduce((acc, cur) => {
                  return acc + cur['COST']
                }, 0)
              })
            this.$set(this.yearTableData, year, seriesData)
            return {
              name: year,
              itemStyle: {
                color: colors2[i],
              },
              type: 'line',
              smooth: true,
              data: seriesData,
              symbol:'none',
              areaStyle: areaStyle2[i],
              z: i,
            }
          })
        setTimeout(() => {
          this.$refs['chart04'].$refs['echarts'].clear()
          this.chart4Options.series = series4
        }, 50)

        // 各部门花费占比
        let dateStart = moment().subtract(12, 'month')
        let dateArr = Array(12)
          .fill(null)
          .map((_, index) => {
            return moment(dateStart).add(index, 'month').format('YYYY-MM')
          })

        const deptHashMap = array2HashMapByKey(
          filtered1.filter((_) => dateArr.indexOf(moment(_['MDATE']).format('YYYY-MM')) > -1),
          'CHANNEL_DEPARTMENT'
        )

        const series5 = Object.keys(deptHashMap).map((dept) => {
          const deptData = deptHashMap[dept]
          const seriesData = Array(12)
            .fill(null)
            .map((_, index) => {
              const data = deptData.find((_) => moment(_['MDATE']).format('YYYY-MM') === dateArr[index])
              return data ? data['COST'] : null
            })
          return {
            name: dept,
            stack: true,
            barWidth: 15,
            type: 'bar',
            data: seriesData,
          }
        })
        setTimeout(() => {
          this.$refs['chart05'].$refs['echarts'].clear()
          this.chart5Options.xAxis.data = dateArr
          this.chart5Options.series = series5
        }, 50)

        // 报销类
        let a = filtered.filter((_) => _['EXPENSE_TYPE'] === '报销类')
        a = array2HashMapByKey(a, 'IYEAR')
        Object.keys(a).forEach((year) => {
          a[year] = array2HashMapByKey(a[year], 'IMONTH')
        })
        this.thisYearCategoryData['报销类'] = Array(12)
          .fill(null)
          .map((_, index) => {
            if (!(a[curYear] || [])[index + 1]) {
              return null
            }
            return a[curYear][index + 1].reduce((acc, cur) => {
              return acc + cur['COST']
            }, 0)
          })

        // 工具类
        let b = filtered.filter((_) => _['EXPENSE_TYPE'] === '工具类')
        b = array2HashMapByKey(b, 'IYEAR')
        Object.keys(b).forEach((year) => {
          b[year] = array2HashMapByKey(b[year], 'IMONTH')
        })
        this.thisYearCategoryData['工具类'] = Array(12)
          .fill(null)
          .map((_, index) => {
            if (!(b[curYear] || [])[index + 1]) {
              return null
            }
            return b[curYear][index + 1].reduce((acc, cur) => {
              return acc + cur['COST']
            }, 0)
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.Header{
  margin-top: 10px;
  height: 30px;
  padding-bottom: 5px;
  border-bottom: 0px solid #f0f0f0;
}
.text-xs-radio {
  font-size: 12px;

  /deep/ .ant-radio-wrapper {
    font-size: 12px;
  }
}

.text-xs-checkbox {
  /deep/ .ant-checkbox-wrapper {
    width: 200px;
    height: 18px;
    overflow: hidden;
    white-space: nowrap;
    font-size: 12px;
    color: #808492;
    margin-left: 0 !important;
  }
}

.table {
  font-size: 12px;
  line-height: 2;
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  text-align: center;

  td {
    border: 1px solid #e7e9f0;
  }

  tr:nth-child(2n) {
    background-color: #fcfcff;
  }

  thead tr {
    background-color: #f5f7ff;
  }
}

.h270 {
  height: calc(1px * var(--height) - 160px);
}

.h275 {
  height: calc(1px * var(--height) - 350px);
}

.h300 {
  height: calc(1px * var(--height) - 340px);
}
</style>