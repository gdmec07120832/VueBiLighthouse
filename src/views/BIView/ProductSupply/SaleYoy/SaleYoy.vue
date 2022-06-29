<template>
  <div style="background-color: #f5faff; height: 100vh; padding: 20px 2%; overflow: auto">
    <div class="px10 pb20" style="margin: auto;">
      <div style="font-size: 26px; font-weight: 800">项目组销售同比增长</div>
      <div style="line-height: 24px" class="sub-tip">备注：【1】数据统计时间为订单支付时间；
        【2】销售业绩逻辑：客审状态=已客审，剔除未发货取消订单后的实际售价；
        【3】实际售价：减去优惠后的商品价格
      </div>
    </div>
    <div style="background-color: #fff; border: 2px solid #dde7f7; padding: 0 20px">
      <div class="py10">销售同比增长</div>
      <div class="flex flex-start" style="flex-wrap: wrap">
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select :filterable="false" label="统计年份" v-model="query.year"
                          :options="yearList.map(y => ({label: y}))"
                          :multiple="false"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="线上/线下"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="收入渠道"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="收入店铺"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="项目组"></virtual-select>
        </div>
      </div>
      <div style="height: 220px">
        <v-chart :options="chartOptions" autoresize></v-chart>
      </div>
      <div>
        <div class="py10 mt20 flex flex-between" style="font-weight: 800">
          <div>
          全渠道支付业绩完成率
            <a-tooltip placement="rightBottom" overlayClassName="light-tooltip">
            <div class="text-black text-xs" style="min-width: 200px" slot="title">
              支付业绩：订单总支付金额<br/>
              (总支付金额因存在未发取消与线下操作等业务场景，故与实际售价存在差异)
            </div>
            <a-icon type="question-circle"
                    style="color: #808492;"></a-icon>
          </a-tooltip>
          </div>
          <div>
            <a-tooltip placement="leftBottom" overlayClassName="light-tooltip">
              <div class="text-black text-xs" slot="title">
                <div style="cursor: pointer" @click="exportTable('全渠道支付业绩完成率', 'exportTable01')">
                  导出报表
                </div>
              </div>
              <a-icon type="dash" style="font-size: 14px; cursor: pointer"></a-icon>
            </a-tooltip>
          </div>
        </div>
        <div>
          <table ref="exportTable01" v-cell-tip="{pad: 5}" class="table" style="table-layout: fixed" rules="groups">
            <thead>
            <tr>
              <td>指标</td>
              <td>累计值</td>
              <td v-for="item in monthList" :key="item">{{ query.year }}年{{ item }}月</td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>业绩目标</td>
              <td>{{ numGroupSep(Math.round(allChannelPayTotal['TGT_PAY_AMT'])) }}</td>
              <td v-for="item in allChannelPayMonth" :key="item.MDATE">
                {{ numGroupSep(Math.round(item['TGT_PAY_AMT'])) }}
              </td>
            </tr>
            <tr>
              <td>业绩支付</td>
              <td>{{ numGroupSep(Math.round(allChannelPayTotal['PAY_AMT'])) }}</td>
              <td v-for="item in allChannelPayMonth" :key="item.MDATE">
                {{ numGroupSep(Math.round(item['PAY_AMT'])) }}
              </td>
            </tr>
            <tr>
              <td>完成率</td>
              <td>
                {{ calcRate(allChannelPayTotal['PAY_AMT'], allChannelPayTotal['TGT_PAY_AMT']) }}
              </td>
              <td v-for="item in allChannelPayMonth" :key="item.MDATE">
                {{
                  calcRate(Math.round(item['PAY_AMT']), Math.round(item['TGT_PAY_AMT']))
                }}
              </td>
            </tr>
            <tr>
              <td>日累计同比增幅</td>
              <td>
                {{
                  calcRate(allChannelPayTotal['PAY_AMT'] - allChannelPayTotal['PAY_AMT_YOY'], allChannelPayTotal['PAY_AMT_YOY'])
                }}
              </td>
              <td v-for="item in allChannelPayMonth" :key="item.MDATE">
                {{
                  calcRate((item['PAY_AMT'] - item['PAY_AMT_YOY']), item['PAY_AMT_YOY'])
                }}
              </td>
            </tr>
            <tr>
              <td>日累计同比增额</td>
              <td>
                {{
                  numGroupSep(Math.round(allChannelPayTotal['PAY_AMT'] - allChannelPayTotal['PAY_AMT_YOY']))
                }}
              </td>
              <td v-for="item in allChannelPayMonth" :key="item.MDATE">
                {{
                  numGroupSep(Math.round(item['PAY_AMT'] - item['PAY_AMT_YOY']))
                }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div class="py10 mt20" style="font-weight: 800">项目组实际售价</div>
        <div>
          <v-tabs :tabs="['销售额', '销售同比', '销售占比']" :value.sync="query.tab1"></v-tabs>
        </div>
        <div>
          <table v-cell-tip="{pad: 5}" v-if="query.tab1 === '销售额'" class="table" style="table-layout: fixed">
            <thead>
            <tr>
              <td>{{ query.tab1 }}</td>
              <td>
                <span class="table-sorting-header" :class="{
                  ascending: query.teamOrderProp === 'total' && query.teamOrderType === 'asc',
                  descending: query.teamOrderProp === 'total' && query.teamOrderType === 'desc'
                }" @click="handleSort('total')">合计</span>
              </td>
              <td v-for="item in monthList" :key="item">
                <span class="table-sorting-header" :class="{
                  ascending: query.teamOrderProp === item && query.teamOrderType === 'asc',
                  descending: query.teamOrderProp === item && query.teamOrderType === 'desc'
                }"
                      @click="handleSort(item)">{{ item }}月</span>
              </td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td></td>
              <td>{{numGroupSep(Math.round(yearTotalData['REAL_SALE_PRICE']))}}</td>
              <td v-for="(item, index) in monthTotalData" :key="index">
                {{numGroupSep(Math.round(item['REAL_SALE_PRICE']))}}
              </td>
            </tr>
            <tr v-for="item in teamPayList" :key="item.team">
              <td>{{ item.team }}</td>
              <td>{{ numGroupSep(Math.round(item['REAL_SALE_PRICE'])) }}</td>
              <td v-for="(monthData, index) in item['monthList']" :key="index">
                {{ numGroupSep(Math.round(monthData['REAL_SALE_PRICE'])) }}
              </td>
            </tr>
            </tbody>
          </table>
          <table v-cell-tip="{pad: 5}" v-if="query.tab1 === '销售同比'" class="table" style="table-layout: fixed">
            <thead>
              <tr>
              <td>{{ query.tab1 }}</td>
              <td>
                <span class="table-sorting-header" :class="{
                  ascending: query.teamOrderProp2 === 'total' && query.teamOrderType2 === 'asc',
                  descending: query.teamOrderProp2 === 'total' && query.teamOrderType2 === 'desc'
                }" @click="handleSort('total')">合计</span>
              </td>
              <td v-for="item in monthList" :key="item">
                <span class="table-sorting-header" :class="{
                  ascending: query.teamOrderProp2 === item && query.teamOrderType2 === 'asc',
                  descending: query.teamOrderProp2 === item && query.teamOrderType2 === 'desc'
                }"
                      @click="handleSort(item)">{{ item }}月</span>
              </td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td></td>
              <td>{{calcRate(yearTotalData['REAL_SALE_PRICE'] - yearTotalData['REAL_SALE_PRICE_YOY'], yearTotalData['REAL_SALE_PRICE_YOY'])}}</td>
              <td v-for="(item, index) in monthTotalData" :key="index">
                {{calcRate(item['REAL_SALE_PRICE'] - item['REAL_SALE_PRICE_YOY'], item['REAL_SALE_PRICE_YOY'])}}
              </td>
            </tr>
            <tr v-for="item in teamPayList" :key="item.team">
              <td>{{ item.team }}</td>
              <td>{{ item['RATE_YOY'] }}</td>
              <td v-for="(monthData, index) in item['monthList']" :key="index">
                {{ monthData['RATE_YOY'] }}
              </td>
            </tr>
            </tbody>
          </table>
          <table v-cell-tip="{pad: 5}" v-if="query.tab1 === '销售占比'" class="table" style="table-layout: fixed">
            <thead>
            <tr>
              <td>{{ query.tab1 }}</td>
              <td>
                <span class="table-sorting-header" :class="{
                  ascending: query.teamOrderProp3 === 'total' && query.teamOrderType3 === 'asc',
                  descending: query.teamOrderProp3 === 'total' && query.teamOrderType3 === 'desc'
                }" @click="handleSort('total')">合计</span>
              </td>
              <td v-for="item in monthList" :key="item">
                <span class="table-sorting-header" :class="{
                  ascending: query.teamOrderProp3 === item && query.teamOrderType3 === 'asc',
                  descending: query.teamOrderProp3 === item && query.teamOrderType3 === 'desc'
                }"
                      @click="handleSort(item)">{{ item }}月</span>
              </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in teamPayList" :key="item.team">
              <td>{{ item.team }}</td>
              <td>{{ item['SHARE_RATE'] }}</td>
              <td v-for="(monthData, index) in item['monthList']" :key="index">
                {{ monthData['SHARE_RATE'] }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="mt20" style="background-color: #fff; border: 2px solid #dde7f7; padding: 0 20px">
      <div class="flex flex-start">
        <div class="py10" style="font-weight: 800">产品销售同比增长</div>
        <div class="ml20">
          <a-radio-group v-model="query.priceType">
            <a-radio value="销售价">销售价</a-radio>
            <a-radio value="采购价">采购价</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="flex-start flex" style="flex-wrap: wrap">
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select :multiple="false" label="统计年份" :filterable="false"
                          :options="yearList.map(y => ({label: y}))"
                          v-model="query.year2"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="线上/线下"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="收入渠道"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="收入店铺"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="项目组"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="研发分类"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="系列主型号"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <virtual-select label="物料名称"></virtual-select>
        </div>
        <div class="py10" style="width: 25%; padding-right: 5%">
          <y-input label="物料编码"></y-input>
        </div>
      </div>
      <div class="mt10">
        <v-tabs :tabs="[
            '系列主型号销额', '系列主型号同比', '系列主型号销量', '系列主型号占比', 'SKU销额', 'SKU同比', 'SKU销量', 'SKU占比'
        ]" :value.sync="query.tab2"></v-tabs>
      </div>
      <div>
        <table class="table" style="table-layout: fixed">
          <thead>
            <tr>
              <td>系列主型号</td>
              <td>项目组</td>
              <td>排名</td>
              <td>合计<br>销售额</td>
              <td></td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { numGroupSep, array2HashMapByKey } from '@/utils/helper'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import VTabs from '@/views/BIView/components/VTabs/VTabs'
import YInput from '@/views/BIView/components/YInput/YInput'

const currentYear = (new Date()).getFullYear()
const yearList = Array(currentYear - 2019 + 1).fill(null).map((item, index) => {
  return currentYear - index
})
export default {
  name: 'SaleYoy',
  components: { YInput, VTabs, VirtualSelect },
  data () {
    return {
      yearList,
      monthList: [],
      monthList2: [],
      monthTotalData: [],
      yearTotalData: {},
      allChannelPayMonth: [],
      allChannelPayTotal: {
        PAY_AMT: 0,
        PAY_AMT_YOY: 0,
        TGT_PAY_AMT: 0
      },
      teamPayList: [],
      query: {
        year: currentYear,
        year2: currentYear,
        team: [],
        teamOrderProp: '',
        teamOrderType: '',
        teamOrderProp2: '',
        teamOrderType2: '',
        teamOrderProp3: '',
        teamOrderType3: '',
        tab1: '销售额',
        tab2: '系列主型号销额',
        priceType: '销售价'
      },
      chartOptions: {
        tooltip: {
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          backgroundColor: '#fff'
        },
        grid: {
          top: 50,
          right: 0,
          left: 0,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          data: []
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: ['#ececee'],
              type: 'dashed'
            }
          }
        },
        series: [
          {
            type: 'line',
            name: '当年实际售价',
            itemStyle: {
              color: '#396fff'
            },
          },
          {
            type: 'line',
            name: '上年实际售价',
            itemStyle: {
              color: '#f3d024'
            }
          }
        ]
      }
    }
  },
  watch: {
    'query.year' () {
      this.getData1()
      this.getData2()
    }
  },
  created () {
    this.getData1()
    this.getData2()
    this.getData3()
  },
  methods: {
    calcRate (a, b) {
      if ((a || a === 0) && b) {
        return ((a / b) * 100).toFixed(2) + '%'
      }
      return '--'
    },
    numGroupSep,
    getData1 () {
      this.$fetchSql('spl_sales', 'shop_spl_sum', {
        YDATE: this.query.year
      }).then(({ data }) => {
        const filteredByTeam = data.filter(_ => {
          return this.query.team.length ? this.query.team.includes(_['TEAM_SUPPLY']) : true
        })
        const monthMap = array2HashMapByKey(filteredByTeam, 'MDATE')
        let _data = []
        Object.keys(monthMap).forEach((month) => {
          const list = monthMap[month]
          const theMonthTotal = list.reduce((acc, cur) => {
            return {
              REAL_SALE_PRICE: acc['REAL_SALE_PRICE'] + cur['REAL_SALE_PRICE'],
              REAL_SALE_PRICE_YOY: acc['REAL_SALE_PRICE_YOY'] + cur['REAL_SALE_PRICE_YOY'],
            }
          }, {
            REAL_SALE_PRICE: 0,
            REAL_SALE_PRICE_YOY: 0,
          })
          _data.push({ ...theMonthTotal, MDATE: month })
        })
        _data = _data.sort((a, b) => moment(a.MDATE) - moment(b.MDATE))
        const monthList = _data.map(_ => moment(_.MDATE).format('MM'))
        this.monthList = monthList
        this.monthTotalData = _data
        this.yearTotalData = _data.reduce((acc, cur) => {
          return {
            REAL_SALE_PRICE: acc['REAL_SALE_PRICE'] + cur['REAL_SALE_PRICE'],
            REAL_SALE_PRICE_YOY: acc['REAL_SALE_PRICE_YOY'] + cur['REAL_SALE_PRICE_YOY'],
          }
        }, {
          REAL_SALE_PRICE: 0,
          REAL_SALE_PRICE_YOY: 0,
        })
        this.chartOptions.xAxis.data = monthList.map(_ => _ + '月')
        this.chartOptions.series[0].data = _data.map(_ => Math.round(_['REAL_SALE_PRICE']))
        this.chartOptions.series[1].data = _data.map(_ => Math.round(_['REAL_SALE_PRICE_YOY']))

        // （项目组 & 月份）维度
        const teamMonthMap = array2HashMapByKey(filteredByTeam, 'TEAM_SUPPLY')
        const teamYearMap = {}
        Object.keys(teamMonthMap).forEach(team => {
          teamYearMap[team] = teamMonthMap[team].reduce((acc, cur) => {
            return {
              REAL_SALE_PRICE: acc['REAL_SALE_PRICE'] + cur['REAL_SALE_PRICE'],
              REAL_SALE_PRICE_YOY: acc['REAL_SALE_PRICE_YOY'] + cur['REAL_SALE_PRICE_YOY'],
            }
          }, {
            REAL_SALE_PRICE: 0,
            REAL_SALE_PRICE_YOY: 0,
          })
        })
        this.teamYearMap = teamYearMap
        this.teamMonthMap = teamMonthMap
        this.parseData1(this.teamMonthMap, this.teamYearMap, monthList)
      })
    },
    parseData1 (teamMonthMap, teamYearMap, monthList) {
      console.log(this.monthTotalData)
      let teamYearArr = Object.keys(teamYearMap).map(team => {
        const list = teamMonthMap[team]
        return {
          team,
          SHARE_RATE: this.calcRate(teamYearMap[team]['REAL_SALE_PRICE'], this.yearTotalData['REAL_SALE_PRICE']),
          RATE_YOY: this.calcRate(teamYearMap[team]['REAL_SALE_PRICE'] - teamYearMap[team]['REAL_SALE_PRICE_YOY'],
              teamYearMap[team]['REAL_SALE_PRICE_YOY']),
          ...teamYearMap[team],
          monthList: monthList.map(month => {
            const find = list.find(item => moment(item.MDATE).format('MM') === month) || {}
            const monthTotal = this.monthTotalData.find(item => moment(item.MDATE).format('MM') === month) || {}
            return ({
              ...find,
              SHARE_RATE: this.calcRate(find['REAL_SALE_PRICE'], monthTotal['REAL_SALE_PRICE']),
              RATE_YOY: this.calcRate(find['REAL_SALE_PRICE'] - find['REAL_SALE_PRICE_YOY'],
                  find['REAL_SALE_PRICE_YOY'])
            })
          })
        }
      })
      const propsMap = {
        '销售额': ['teamOrderProp', 'teamOrderType'],
        '销售同比': ['teamOrderProp2', 'teamOrderType2'],
        '销售占比': ['teamOrderProp3', 'teamOrderType3']
      }
      let orderProp = this.query[propsMap[this.query.tab1][0]]
      let orderType = this.query[propsMap[this.query.tab1][1]]
      if (!orderType || orderProp === 'total') {
        teamYearArr = teamYearArr.sort((a, b) => {
          if(this.query.tab1 === '销售额' || !orderType) {
            const av = a['REAL_SALE_PRICE']
            const bv = b['REAL_SALE_PRICE']
            return (orderType === 'desc' || orderType === '') ? bv - av : av - bv
          }
          if(this.query.tab1 === '销售同比') {
            const av = a['RATE_YOY'] === '--' ? -Infinity : parseFloat(a['RATE_YOY'])
            const bv = b['RATE_YOY'] === '--' ? -Infinity : parseFloat(b['RATE_YOY'])
            return orderType === 'desc' ? bv - av : av - bv
          }
          if(this.query.tab1 === '销售占比') {
            const av = a['SHARE_RATE'] === '--' ? -Infinity : parseFloat(a['SHARE_RATE'])
            const bv = b['SHARE_RATE'] === '--' ? -Infinity : parseFloat(b['SHARE_RATE'])
            return orderType === 'desc' ? bv - av : av - bv
          }

        })
      } else {
        teamYearArr = teamYearArr.sort((a, b) => {
          if(this.query.tab1 === '销售额') {
            const av = (a.monthList.find(_ => moment(_.MDATE).format('MM') === orderProp) || {})['REAL_SALE_PRICE'] || 0
            const bv = (b.monthList.find(_ => moment(_.MDATE).format('MM') === orderProp) || {})['REAL_SALE_PRICE'] || 0
            return orderType === 'desc' ? bv - av : av - bv
          }
          if(this.query.tab1 === '销售同比') {
            let av = (a.monthList.find(_ => moment(_.MDATE).format('MM') === orderProp) || {RATE_YOY: '--'})['RATE_YOY']
            let bv = (b.monthList.find(_ => moment(_.MDATE).format('MM') === orderProp) || {RATE_YOY: '--'})['RATE_YOY']
            av = av === '--' ? -Infinity : parseFloat(av)
            bv = bv === '--' ? -Infinity : parseFloat(bv)
            return orderType === 'desc' ? bv - av : av - bv
          }
          if(this.query.tab1 === '销售占比') {
            let av = (a.monthList.find(_ => moment(_.MDATE).format('MM') === orderProp) || {SHARE_RATE: '--'})['SHARE_RATE']
            let bv = (b.monthList.find(_ => moment(_.MDATE).format('MM') === orderProp) || {SHARE_RATE: '--'})['SHARE_RATE']
            av = av === '--' ? -Infinity : parseFloat(av)
            bv = bv === '--' ? -Infinity : parseFloat(bv)
            return orderType === 'desc' ? bv - av : av - bv
          }
        })
      }
      this.teamPayList = teamYearArr
    },
    handleSort (prop) {
      const propsMap = {
        '销售额': ['teamOrderProp', 'teamOrderType'],
        '销售同比': ['teamOrderProp2', 'teamOrderType2'],
        '销售占比': ['teamOrderProp3', 'teamOrderType3']
      }
      const teamOrderProp = propsMap[this.query.tab1][0]
      const teamOrderType = propsMap[this.query.tab1][1]
      const orderType = ['asc', 'desc', '']
      const currentProp = this.query[teamOrderProp]
      if (currentProp === prop) {
        this.query[teamOrderType] = orderType[(orderType.indexOf(this.query[teamOrderType]) + 1) % 3]
      } else {
        this.query[teamOrderProp] = prop
        this.query[teamOrderType] = 'asc'
      }
      this.parseData1(this.teamMonthMap, this.teamYearMap, this.monthList)
    },
    getData2 () {
      this.$fetchSql('spl_sales', 'fs_income_shop', {
        YDATE: this.query.year
      }).then(({ data }) => {
        const _data = data.sort((a, b) => moment(a.MDATE) - moment(b.MDATE))
        this.allChannelPayMonth = Object.freeze(_data)
        const total = _data.reduce((acc, cur) => {
          return {
            PAY_AMT: acc['PAY_AMT'] + cur['PAY_AMT'],
            PAY_AMT_YOY: acc['PAY_AMT_YOY'] + cur['PAY_AMT_YOY'],
            TGT_PAY_AMT: acc['TGT_PAY_AMT'] + cur['TGT_PAY_AMT']
          }
        }, {
          PAY_AMT: 0,
          PAY_AMT_YOY: 0,
          TGT_PAY_AMT: 0
        })
        this.allChannelPayTotal = total
      })
    },
    getData3 () {
      this.$fetchSql('spl_sales', 'mtrl_shop', {
        YDATE: this.query.year,
        page: 1,
        pageSize: 10
      }).then(({ data }) => {
        console.log(data)
      })
    },
    exportTable() {
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-tip {
  color: #999;
  font-size: 12px;
}

.table {
  width: 100%;
  white-space: nowrap;
  font-size: 12px;

  td {
    padding: 6px;
    height: 30px;
    overflow: hidden;
  }

  td:not(:first-child) {
    text-align: right;
  }

  tbody tr:nth-child(2n + 1) {
    background: #f5faff;
  }

  .table-sorting-header {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }

    &.ascending:after, &.descending:after {
      display: inline-block;
      padding: 0 6px;
      content: "";
      width: 5px;
      height: 10px;
      background-repeat: no-repeat;
      background-size: contain;
      background-position-x: right;
    }

    &.ascending {
      &:after {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAMAAADJ7yrpAAAAKlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKE86IAAAADXRSTlMABBEmRGprlJW72e77tTkTKwAAAFNJREFUeAHtzjkSgCAUBNHPgsoy97+ulGXRqJE5L+xkxoYt2UdsLb5bqFINz+aLuuLn5rIu2RkO3fZpWENimNgiw6iBYRTPMLJjGFxQZ1hxxb/xBI1qC8k39CdKAAAAAElFTkSuQmCC");
      }
    }

    &.descending {
      &:after {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAMAAADJ7yrpAAAAKlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKE86IAAAADXRSTlMABBEmRGprlJW72e77tTkTKwAAAFJJREFUeAHtzjkSgCAQRNFmQYUZ7n9dKUvru0TmvPAn3br0QfgdZ5xx6x+rQn23GqTYnq1FDcnuzZIO2WmedVqIRVxgGKEyjNgYRjKGkZ1hFIZ3I70LyM0VtU8AAAAASUVORK5CYII=");
      }
    }
  }
}
</style>
