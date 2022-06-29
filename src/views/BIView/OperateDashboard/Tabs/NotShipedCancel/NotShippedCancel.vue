<!--未发取消-->
<template>
  <div>
    <div class="Header">
      <Title class="title" :label="'未发取消'" :jump="true" :jumpTarget="JumpStr" :ps="'【若时间截止当月，数据尚未跑完，同期为完整月份数据，仅供趋势参考；】'"/>
      <div class="flex flex-between my10" style="justify-content: flex-end;">
        <div class="flex flex-start">
          <div class="flex flex-start" style="margin-right: 40px">
          <span style="color: #3f4254" class="text-xs mr5">统计口径:
            <span style="display: inline-block; width: 80px; text-align: center">{{
                query.dimension === '1' ? '支付口径' : '退款口径'
              }}</span>
          </span>
            <a-tooltip placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
              <template slot="title">
                <a-radio-group style="width: 100px" v-model="query.dimension" class="text-xs-radio">
                  <div>
                    <a-radio value="1">支付口径</a-radio>
                  </div>
                  <div>
                    <a-radio value="2">退款口径</a-radio>
                  </div>
                </a-radio-group>
              </template>
              <div class="dropdown-icon text-xs">
                <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
              </div>
            </a-tooltip>
          </div>
          <div class="flex flex-start" style="margin-right: 40px">
            <span style="color: #3f4254" class="text-xs mr5">渠道分类:
              <span style="display: inline-block; width: 80px;text-overflow: ellipsis;line-height: 16px;
              margin-left: 10px;text-align: center; overflow: hidden; white-space: nowrap; vertical-align: text-bottom">
                {{ query.channelType.join(',') }}
              </span>
            </span>
            <a-tooltip placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
              <template slot="title">
                <a-checkbox-group style="width: 100px" v-model="query.channelType" class="text-xs-checkbox">
                  <div v-for="channelType in new Set(uniqChannelOptions.map(_ => _['channelType']))" :key="channelType">
                    <a-checkbox :value="channelType">{{ channelType }}</a-checkbox>
                  </div>
                </a-checkbox-group>
              </template>
              <div class="dropdown-icon text-xs">
                <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
              </div>
            </a-tooltip>
          </div>
          <div class="flex flex-start">
          <span style="color: #3f4254" class="text-xs mr5">渠道细分:
            <span style="display: inline-block; margin-left: 10px;
            width: 80px;text-overflow: ellipsis;line-height: 16px;
              text-align: center; overflow: hidden; white-space: nowrap; vertical-align: text-bottom">
                {{ query.channel.join(',') }}
              </span>
          </span>
            <a-tooltip placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
              <template slot="title">
                <a-checkbox-group style="width: 120px" v-model="query.channel" class="text-xs-checkbox">
                  <div v-for="item in channelOptions" :key="item">
                    <a-checkbox :value="item">{{ item }}</a-checkbox>
                  </div>
                </a-checkbox-group>
              </template>
              <div class="dropdown-icon text-xs">
                <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
              </div>
            </a-tooltip>
          </div>
        </div>
        <div>
          <div style="display: inline-flex; width: 100px; justify-content: center" class="text-xs">年份：{{
              query.year
            }}
          </div>
          <a-tooltip placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
            <template slot="title">
              <a-radio-group style="width: 100px" v-model="query.year">
                <a-radio v-for="item in queryYearOptions" :key="item" :value="item" style="display: block">
                  {{ item }}
                </a-radio>
              </a-radio-group>
            </template>
            <div class="dropdown-icon text-xs">
              <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
            </div>
          </a-tooltip>
        </div>
      </div>
    </div>




    <div class="mt5 flex flex-start text-xs" style="align-items: flex-start">
      <div>
        <table class="left-table" style="table-layout: fixed;">
          <thead>
          <tr>
            <td width="100">支付口径</td>
            <td width="100">年份</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>比例同比</td>
            <td>{{ query.year }}</td>
          </tr>
          <tr>
            <td rowspan="2">取消占比</td>
            <td>{{ query.year }}</td>
          </tr>
          <tr>
            <td>{{ query.year - 1 }}</td>
          </tr>
          <tr>
            <td rowspan="2">未发取消</td>
            <td>{{ query.year }}</td>
          </tr>
          <tr>
            <td>{{ query.year - 1 }}</td>
          </tr>
          <tr>
            <td rowspan="2">销售业绩</td>
            <td>{{ query.year }}</td>
          </tr>
          <tr>
            <td>{{ query.year - 1 }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div style="flex: 1">
        <table class="table text-xs"
               style="table-layout: fixed; width: 100%; border-collapse: collapse; text-align: right; line-height: 2">
          <thead>
          <tr>
            <td>全年累计</td>
            <td>当期累计</td>
            <td>01月</td>
            <td>02月</td>
            <td>03月</td>
            <td>04月</td>
            <td>05月</td>
            <td>06月</td>
            <td>07月</td>
            <td>08月</td>
            <td>09月</td>
            <td>10月</td>
            <td>11月</td>
            <td>12月</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td :class="[
                calcYoY(
                        calcArray(channelYearData(query.year), CANCEL_AMT) / calcArray(channelYearData(query.year), PAY_AMT),
                        calcArray(channelYearData(query.year - 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1), PAY_AMT)
                    ) > 0 ? 'text-green' :
                    calcYoY(
                        calcArray(channelYearData(query.year), CANCEL_AMT) / calcArray(channelYearData(query.year), PAY_AMT),
                        calcArray(channelYearData(query.year - 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1), PAY_AMT)
                    ) < 0 ? 'text-red' : ''
            ]">
              {{
                transPercent(
                    calcYoY(
                        calcArray(channelYearData(query.year), CANCEL_AMT) / calcArray(channelYearData(query.year), PAY_AMT),
                        calcArray(channelYearData(query.year - 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1), PAY_AMT)
                    )
                )
              }}
            </td>
            <td v-if="query.year === nowYear" :class="[
                calcYoY(
                        calcArray(channelYearData(query.year).slice(0, query.month + 1), CANCEL_AMT) / calcArray(channelYearData(query.year).slice(0, query.month + 1), PAY_AMT),
                        calcArray(channelYearData(query.year - 1).slice(0, query.month + 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1).slice(0, query.month + 1), PAY_AMT)
                    ) > 0 ? 'text-green' :
                    calcYoY(
                        calcArray(channelYearData(query.year).slice(0, query.month + 1), CANCEL_AMT) / calcArray(channelYearData(query.year).slice(0, query.month + 1), PAY_AMT),
                        calcArray(channelYearData(query.year - 1).slice(0, query.month + 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1).slice(0, query.month + 1), PAY_AMT)
                    ) < 0 ? 'text-red' : ''
            ]">
              {{
                transPercent(
                    calcYoY(
                        calcArray(channelYearData(query.year).slice(0, query.month + 1), CANCEL_AMT) / calcArray(channelYearData(query.year).slice(0, query.month + 1), PAY_AMT),
                        calcArray(channelYearData(query.year - 1).slice(0, query.month + 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1).slice(0, query.month + 1), PAY_AMT)
                    )
                )
              }}
            </td>
            <td v-else :class="[
                calcYoY(
                        calcArray(channelYearData(query.year), CANCEL_AMT) / calcArray(channelYearData(query.year), PAY_AMT),
                        calcArray(channelYearData(query.year - 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1), PAY_AMT)
                    ) > 0 ? 'text-green' :
                    calcYoY(
                        calcArray(channelYearData(query.year), CANCEL_AMT) / calcArray(channelYearData(query.year), PAY_AMT),
                        calcArray(channelYearData(query.year - 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1), PAY_AMT)
                    ) < 0 ? 'text-red' : ''
            ]">
              {{
                transPercent(
                    calcYoY(
                        calcArray(channelYearData(query.year), CANCEL_AMT) / calcArray(channelYearData(query.year), PAY_AMT),
                        calcArray(channelYearData(query.year - 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1), PAY_AMT)
                    )
                )
              }}
            </td>
            <td v-for="(item, index) in Array(12)" :key="index" :class="[
                calcYoY(channelYearData(query.year)[index][CANCEL_RATE], channelYearData(query.year - 1)[index][CANCEL_RATE]) < 0 ? 'text-red'
                : calcYoY(channelYearData(query.year)[index][CANCEL_RATE], channelYearData(query.year - 1)[index][CANCEL_RATE]) > 0 ? 'text-green'
                : ''
            ]">
              {{
                transPercent(calcYoY(channelYearData(query.year)[index][CANCEL_RATE], channelYearData(query.year - 1)[index][CANCEL_RATE]))
              }}
            </td>
          </tr>
          <tr>
            <td>
              {{
                transPercent(calcArray(channelYearData(query.year), CANCEL_AMT) / calcArray(channelYearData(query.year), PAY_AMT))
              }}
            </td>
            <td v-if="query.year === nowYear">
              {{
                transPercent(
                    calcArray(channelYearData(query.year).slice(0, query.month + 1), CANCEL_AMT) / calcArray(channelYearData(query.year).slice(0, query.month + 1), PAY_AMT)
                )
              }}
            </td>
            <td v-else>
              {{
                transPercent(calcArray(channelYearData(query.year), CANCEL_AMT) / calcArray(channelYearData(query.year), PAY_AMT))
              }}
            </td>
            <td v-for="item in channelYearData(query.year)" :key="item['MDATE']">{{
                transPercent(item[CANCEL_RATE])
              }}
            </td>
          </tr>
          <tr>
            <td>
              {{
                transPercent(calcArray(channelYearData(query.year - 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1), PAY_AMT))
              }}
            </td>
            <td v-if="query.year === nowYear">
              {{
                transPercent(
                    calcArray(channelYearData(query.year - 1).slice(0, query.month + 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1).slice(0, query.month + 1), PAY_AMT)
                )
              }}
            </td>
            <td v-else>
              {{
                transPercent(calcArray(channelYearData(query.year - 1), CANCEL_AMT) / calcArray(channelYearData(query.year - 1), PAY_AMT))
              }}
            </td>
            <td v-for="item in channelYearData(query.year - 1)" :key="item['MDATE']">{{
                transPercent(item[CANCEL_RATE])
              }}
            </td>
          </tr>
          <tr>
            <td>{{ formatY(calcArray(channelYearData(query.year) || [], CANCEL_AMT)) }}</td>
            <td v-if="query.year === nowYear">
              {{ formatY(calcArray(channelYearData(query.year).slice(0, query.month + 1), CANCEL_AMT)) }}
            </td>
            <td v-else>{{ formatY(calcArray(channelYearData(query.year) || [], CANCEL_AMT)) }}</td>
            <td v-for="item in channelYearData(query.year)" :key="item['MDATE']">{{ formatY(item[CANCEL_AMT]) }}</td>
          </tr>
          <tr>
            <td>{{ formatY(calcArray(channelYearData(query.year - 1) || [], CANCEL_AMT)) }}</td>
            <td v-if="query.year === nowYear">
              {{ formatY(calcArray(channelYearData(query.year - 1).slice(0, query.month + 1), CANCEL_AMT)) }}
            </td>
            <td v-else>{{ formatY(calcArray(channelYearData(query.year - 1) || [], CANCEL_AMT)) }}</td>
            <td v-for="item in channelYearData(query.year - 1)" :key="item['MDATE']">{{
                formatY(item[CANCEL_AMT])
              }}
            </td>
          </tr>
          <tr>
            <td>{{ formatY(calcArray(channelYearData(query.year) || [], PAY_AMT)) }}</td>
            <td v-if="query.year === nowYear">
              {{ formatY(calcArray(channelYearData(query.year).slice(0, query.month + 1), PAY_AMT)) }}
            </td>
            <td v-else>{{ formatY(calcArray(channelYearData(query.year) || [], PAY_AMT)) }}</td>
            <td v-for="item in channelYearData(query.year)" :key="item['MDATE']">{{ formatY(item[PAY_AMT]) }}</td>
          </tr>
          <tr>
            <td>{{ formatY(calcArray(channelYearData(query.year - 1) || [], PAY_AMT)) }}</td>
            <td v-if="query.year === nowYear">
              {{ formatY(calcArray(channelYearData(query.year - 1).slice(0, query.month + 1), PAY_AMT)) }}
            </td>
            <td v-else>{{ formatY(calcArray(channelYearData(query.year - 1) || [], PAY_AMT)) }}</td>
            <td v-for="item in channelYearData(query.year - 1)" :key="item['MDATE']">{{ formatY(item[PAY_AMT]) }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mt20 flex flex-between">
      <div style="width: 50%;" class="h175">
        <v-chart :options="getOptions(options1)" autoresize></v-chart>
      </div>
      <div style="width: 50%;" class="h175">
        <v-chart :options="getOptions(options2)" autoresize></v-chart>
      </div>
    </div>
  </div>
</template>

<script>
import uniqWith from 'lodash/uniqWith'
import isEqual from 'lodash/isEqual'
import Title from '../../components/Title'
import graphic from 'echarts/lib/util/graphic'
import echartsColor from '../../utils/echartsColor.js'
const nowYear = (new Date()).getFullYear()
// const colors = {
//   [nowYear]: '#2680EB',
//   [nowYear - 1]: '#ff7f0e',
//   [nowYear - 2]: '#CCE0E9',
// }

    // Stress1_1:'rgba(105,156,254,1)',
    // Stress1_2:'rgba(105,156,254,1)',
    // Stress2_1:'rgba(109,190,250,1)',
    // Stress2_2:'rgba(109,190,250,1)',
    // Stress3_1:'rgba(247,163,93,1)',
    // Stress3_2:'rgba(247,163,93,1)',

const colors = {
  [nowYear]: echartsColor.Stress1_1, 
  [nowYear - 1]: echartsColor.Stress2_1, 
  [nowYear - 2]: echartsColor.Stress3_1,
}

const areaStyle2 = {

  [nowYear]:{
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

  [nowYear - 1]:{
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
  [nowYear - 2]:{
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

}


import deepmerge from 'deepmerge'
import { formatNumber } from '@/utils/helper'

const currentYear = (new Date()).getFullYear()
export default {
  name: 'NotShippedCancel',
  components: {
    Title,
  },
  data () {
    return {
      nowYear,
      queryYearOptions: [currentYear, currentYear - 1, currentYear - 2],
      basicOptions: {
        legend: {
          icon: 'rect',
          top: 0,
          right: 0,
          itemHeight: 12,
          itemWidth: 12
        },
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'item',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(150,150,150,0.03)'
            },
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
        },
        grid: {
          top: 20,
          bottom: 10,
          left: 10,
          right: 10,
          containLabel: true
        },
        xAxis: {
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#999'
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            // show: false
          }

        }
      },
      uniqChannelOptions: [],
      query: {
        dimension: '1', // 1：支付口径 2：退款口径
        channelType: [], // 渠道类型
        channel: [],
        channelOptions: [],
        month: (new Date()).getMonth(),
        year: currentYear,
      },
      yearMap: {
        [currentYear]: Array(12).fill({}),
        [currentYear - 1]: Array(12).fill({}),
        [currentYear - 2]: Array(12).fill({}),
        [currentYear - 3]: Array(12).fill({}),
      },
      options1: {
        legend: {
          itemWidth: 16,
          itemHeight: 2
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {}
          },
          formatter: params => {
            const name = '未发取消占比'
            const lines = params.reverse().map(item => {
              return `<br/>${item.marker}${item.seriesName}年${item.name}：${item.value ? item.value + '%' : '--'}`
            }).join('')
            return `${name}${lines}`
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#bfc2cf',
            formatter: '{value}%'
          },
          splitLine: {
              lineStyle: {
                  color:echartsColor.splitLine,
                  type: 'solid'
              },
          },

        },
        series: []
      },
      options2: {
        tooltip: {
          formatter: params => {
            const value = formatNumber(params.value, 100000000, 2) + '亿'
            return `统计年月：${params.seriesName}年${params.name}<br>未发取消小计：${value}`
          }
        },
        yAxis: {
          axisLabel: {
            color: '#bfc2cf',
            formatter: value => {
              return formatNumber(value, 100000000, 2) + '亿'
            }
          },
          splitLine: {
              lineStyle: {
                  color: echartsColor.splitLine,
                  type: 'solid'
              },
          },
        },
        series: []
      },
      JumpStr:'',
    }
  },
  computed: {
    channelOptions () {
      const channelType = this.query.channelType
      if (!channelType.length) {
        return this.uniqChannelOptions.map(_ => _['channel'])
      } else {
        return this.uniqChannelOptions.filter(_ => {
          return channelType.includes(_.channelType)
        }).map(_ => _['channel'])
      }
    },
    CANCEL_AMT () {
      return this.query.dimension === '1' ? 'CANCEL_AMT' : 'RETURN_CANCEL_AMT'
    },
    PAY_AMT () {
      return this.query.dimension === '1' ? 'PAY_AMT' : 'RETURN_PAY_AMT'
    },
    CANCEL_RATE () {
      return this.query.dimension === '1' ? 'CANCEL_RATE' : 'RETURN_CANCEL_RATE'
    }
  },
  watch: {
    'query.channelType' (val) {
      if (val.length) {
        this.query.channel = this.query.channel.filter(_ => {
          return this.channelOptions.includes(_)
        })
      } else {
        this.parseData(this.yearMap)
      }
    },
    'query.channel' () {
      this.parseData(this.yearMap)
    },
    'query.dimension' () {
      this.parseData(this.yearMap)
    }
  },
  async created () {
    this.getData();
    this.jumpTarget();
  },

  methods: {
    async jumpTarget() {
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2020_00155':'BI_PC_2019_00400'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },
    formatY (num) {
      return typeof num === 'number' ? num === 0 ? '' : formatNumber(num, 100000000, 2) + '亿' : '--'
    },
    calcArray (arr, prop) {
      return arr.reduce((acc, cur) => {
        return acc + (typeof cur[prop] === 'number' ? cur[prop] : 0)
      }, 0)
    },
    calcYoY (a, b) {
      if ((!a && a !== 0) || !b) {
        return '--'
      } else {
        return (((a - b) / b))
      }
    },
    transPercent (num) {
      return typeof num === 'number' ? isNaN(num) ? '' : (num * 100).toFixed(2) + '%' : '--'
    },
    getOptions (options) {
      return deepmerge(this.basicOptions, options)
    },
    channelYearData (year) {
      const yearData = this.yearMap[year]
      const monthData = yearData.map(channelArr => {
        let arr = channelArr
        if (!channelArr.length) {
          arr = []
        }
        // const item = arr.find(_ => _.CHANNEL === this.query.channel)
        const items = arr.filter(_ => {
          return this.query.channel.length ? this.query.channel.includes(_['CHANNEL']) :
              this.query.channelType.length ? this.query.channelType.includes(_['CHANNEL_TYPE']) : true
        })
        if (!items.length) {
          return {}
        }
        const ret = items.reduce((acc, cur) => {
          return {
            PAY_AMT: acc.PAY_AMT + (cur.PAY_AMT || 0),
            CANCEL_AMT: acc.CANCEL_AMT + (cur.CANCEL_AMT || 0),
            RETURN_CANCEL_AMT: acc.RETURN_CANCEL_AMT + (cur.RETURN_CANCEL_AMT || 0),
            RETURN_PAY_AMT: acc.RETURN_PAY_AMT + (cur.RETURN_PAY_AMT || 0)
          }
        }, {
          PAY_AMT: 0,
          CANCEL_AMT: 0,
          RETURN_CANCEL_AMT: 0,
          RETURN_PAY_AMT: 0
        })
        ret['CANCEL_RATE'] = ret['PAY_AMT'] ? (ret['CANCEL_AMT'] || ret['CANCEL_AMT'] === 0)
            ? ret['CANCEL_AMT'] / ret['PAY_AMT'] : null : null
        ret['RETURN_CANCEL_RATE'] = ret['RETURN_PAY_AMT'] ? (ret['RETURN_CANCEL_AMT'] || ret['RETURN_CANCEL_AMT'] === 0)
            ? ret['RETURN_CANCEL_AMT'] / ret['RETURN_PAY_AMT'] : null : null
        return ret
      })
      return monthData
    },
    getData () {
      this.$axios.post('/api/admin/data/kpi_cancel/kpi_cancel_m/get').then(res => {
        const data = res.data
        const uniqChannelOptions = uniqWith(data.map(_ => {
          return { channelType: _['CHANNEL_TYPE'], channel: _['CHANNEL'] }
        }), isEqual)
        this.uniqChannelOptions = uniqChannelOptions
        this.query.channelOptions = Array.from(new Set(data.map(_ => _['CHANNEL'])))
        const yearMap = {}
        data.forEach(item => {
          const year = item['YDATE']
          const month = parseInt(item['MDATE'])
          if (!yearMap[year]) {
            yearMap[year] = Array(12).fill(null).map(() => [])
          }
          yearMap[year][month - 1].push({
            ...item,
            RETURN_CANCEL_RATE: item['RETURN_PAY_AMT'] ? (item['RETURN_CANCEL_AMT'] || item['RETURN_CANCEL_AMT'] === 0)
                ? item['RETURN_CANCEL_AMT'] / item['RETURN_PAY_AMT'] : null : null
          })
        })
        console.log(yearMap)
        yearMap[currentYear - 3] = Array(12).fill([])
        this.yearMap = yearMap
        this.parseData(yearMap)
      })
    },
    parseData (yearMap) {
      const series = [], series1 = []
      let num =0;
      Object.keys(yearMap)
          .filter(year => !!this.queryYearOptions.find(_ => String(_) === year))
          .sort((a, b) => b - a).forEach((key) => {
            num+=1;
            console.log("==========aaa========");
            console.log(num);
        series.push({
          type: 'bar',
          barGap: 0.1,
          barWidth: 10,
          itemStyle: {
            color: colors[key],
            barBorderRadius: [5, 5, 0, 0]
          },
          name: key,
          data: Array(12).fill(null).map((_, index) => {
            const itemArr = yearMap[key][index]
            // const item = itemArr.find(_ => _.CHANNEL === this.query.channel)
            const items = itemArr.filter(_ => {
              return this.query.channel.length ? this.query.channel.includes(_['CHANNEL']) :
                  this.query.channelType.length ? this.query.channelType.includes(_['CHANNEL_TYPE']) : true
            })
            if (items.length) {
              // return item[this.CANCEL_AMT]
              return items.reduce((acc, cur) => acc + (cur[this.CANCEL_AMT] || 0), 0)
            } else {
              return null
            }
          })
        })
        series1.push({
          name: key,
          type: 'line',
          smooth: true,
          itemStyle: {
            color: colors[key]
          },
          symbol:'none',
          areaStyle: areaStyle2[key],
          z: (key==nowYear)?3:(key==(nowYear-1))?2:1,
          data: Array(12).fill(null).map((_, index) => {
            const itemArr = yearMap[key][index]
            const items = itemArr.filter(_ => {
              return this.query.channel.length ? this.query.channel.includes(_['CHANNEL']) :
                  this.query.channelType.length ? this.query.channelType.includes(_['CHANNEL_TYPE']) : true
            })
            if (!items.length) {
              return null
            }

            const CANCEL_AMT = items.reduce((acc, cur) => acc + cur[this.CANCEL_AMT] || 0, 0)
            const PAY_AMT = items.reduce((acc, cur) => acc + cur[this.PAY_AMT] || 0, 0)
            if (PAY_AMT === 0) {
              return null
            }
            return (CANCEL_AMT / PAY_AMT * 100).toFixed(2)
          })
        })
      })
      this.options1.series = series1.sort((a, b) => a.name - b.name)
      this.options2.series = series
      this.options2.legend = { data: series.map(_ => _.name).sort((a, b) => a - b) }
    }
  }
}
</script>

<style lang="scss" scoped>
  .Header{
    // height: 38px;
    margin-top: 10px;
    height: 30px;
    padding-bottom: 10px;
    border-bottom: 0px solid #F0F0F0;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

.text-xs-radio {
  /deep/ .ant-radio-wrapper {
    font-size: 12px;
    width: 100%;
  }
}


.light-tooltip {
  padding-top: 0;

  /deep/ .ant-tooltip-inner {
    background: #fff;
  }

  /deep/ .ant-tooltip-arrow {
    display: none;
  }
}

.left-table {
  thead tr {
    background: #f5f7ff;
  }

  tr {
    line-height: 28px;
    height: 28px;
  }

  tr:nth-child(2n) td:last-child {
    background: #fcfcff;
  }

  td {
    border: 1px solid #e7e9f0;
    text-align: center;
    vertical-align: middle;
  }
}

.table {
  empty-cells: show;

  thead tr {
    background: #f5f7ff;
  }

  td {
    text-align: center;
    border: 1px solid #e7e9f0;

    &:first-child {
      border-left: none;
    }
  }

  tr {
    height: 28px;
    line-height: 28px;

    &:nth-child(2n) {
      background: #fcfcff;
    }

    td:nth-child(1) {
      //text-align: left;
    }

    td:nth-child(2) {
      text-align: center;
    }

    td:nth-child(3) {
      text-align: center;
    }
  }
}

.h175 {
  height: calc(1px * var(--height) - 315px - 30px);
}

.dropdown-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #fff;
  box-shadow: rgba(10, 30, 51, 0.2) 0 0 5px 0;
  border-radius: 4px;

  &:hover {
    cursor: pointer;

    i {
      opacity: .5;
    }
  }
}
</style>
