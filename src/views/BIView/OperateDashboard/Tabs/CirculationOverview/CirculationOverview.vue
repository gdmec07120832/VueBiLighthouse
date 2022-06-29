<!--流转概况-->
<template>
  <div>
    <div class="HeadTitleAll">
      <div class="Header">
        <Title class="title" :label="'流转概况'" />        
      </div>
      <div class="text-xs" style="margin: 5px -10px; line-height: 24px; background: #fff4de; color: #ffa200; padding: 0 10px;">
        备注：【1】支付现货占比：每天占比为昨天客审数据；累计值为当月截止昨天累计客审数据；
        【2】报表更新为T+1模式，数据截止到昨天；
        【3】由于更新时间不一致，故发货业绩与部分T+0的数据有差异。
      </div>      
    </div>
    <div class="flex flex-start" style="align-items: flex-start">
      <div class="left-side" style="width: 25%">
        <div class="my10">
          <span class="chart-sub-title">【月】销售与发货目标达成（亿）</span>
        </div>
        <div class="flex flex-start flex-4">
          <div>
            <div class="text-gary">销售目标</div>
            <div>{{ monthView.PAY[0] }}</div>
          </div>
          <div>
            <div class="text-gary">实绩</div>
            <div>{{ monthView.PAY[1] }}</div>
          </div>
          <div>
            <div class="text-gary">达成</div>
            <div>{{ monthView.PAY[2] }}</div>
          </div>
          <div>
            <div class="text-gary">差值</div>
            <div>{{ monthView.PAY[3] }}</div>
          </div>
          <div>
            <div class="text-gary">发货目标</div>
            <div>{{ monthView.SEND[0] }}</div>
          </div>
          <div>
            <div class="text-gary">实绩</div>
            <div>{{ monthView.SEND[1] }}</div>
          </div>
          <div>
            <div class="text-gary">达成</div>
            <div>{{ monthView.SEND[2] }}</div>
          </div>
          <div>
            <div class="text-gary">差值</div>
            <div>{{ monthView.SEND[3] }}</div>
          </div>
        </div>
        <div style="margin-top: 40px">
          <span class="chart-sub-title">【日】每天发货目标与实际（万）</span></div>
        <div class="text-xs" style="color: #2680eb; line-height: 40px;">剩余日均发货目标：
          {{ RSDL_TAG_SEND_AMT }}
        </div>
        <div class="h350">
          <v-chart :options="chartOptions" autoresize></v-chart>
        </div>
      </div>
      <div class="text-xs" style="width: 40%; padding-left: 3.125vw">
        <div>
          <div class="my10">
           <span class="chart-sub-title">渠道销售</span>
          </div>
          <table class="f-table">
            <thead>
            <tr>
              <td style="text-align: left">日期</td>
              <td>销售业绩</td>
              <td>未发取消退款</td>
              <td>未发取消占比</td>
              <td>现货占比</td>
              <td>未发业绩</td>
            </tr>
            </thead>
            <tbody>
            <tr style="color: #2680EB; font-weight: bold">
              <td style="text-align: left">合计</td>
              <td>{{ tablesTotRow.channel[0] }}</td>
              <td>{{ tablesTotRow.channel[1] }}</td>
              <td>{{ tablesTotRow.channel[2] }}</td>
              <td>{{ tablesTotRow.channel[3] }}</td>
              <td>{{ tablesTotRow.channel[4] }}</td>
            </tr>
            <tr v-for="(item, index) in tablesData.channel" :key="index">
              <td style="text-align: left">{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
              <td>{{ item[2] }}</td>
              <td>{{ item[3] }}</td>
              <td>{{ item[4] }}</td>
              <td>{{ item[5] }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div style="margin-top: 20px;">
          <div class="my10">
            <span class="chart-sub-title">订单处理</span>
          </div>
          <table style="width: 100%; text-align: right; white-space: nowrap; overflow: hidden">
            <thead>
            <tr>
              <td style="text-align: left">日期</td>
              <td>审核业绩</td>
              <td>货审业绩</td>
              <td>财审业绩</td>
              <td>待客审业绩</td>
              <td>待货审业绩</td>
            </tr>
            </thead>
            <tbody>
            <tr style="color: #2680EB; font-weight: bold">
              <td style="text-align: left">日均值</td>
              <td>{{ tablesTotRow.order[0] }}</td>
              <td>{{ tablesTotRow.order[1] }}</td>
              <td>{{ tablesTotRow.order[2] }}</td>
              <td>{{ tablesTotRow.order[3] }}</td>
              <td>{{ tablesTotRow.order[4] }}</td>
            </tr>
            <tr v-for="(item, index) in tablesData.order" :key="index">
              <td style="text-align: left">{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
              <td>{{ item[2] }}</td>
              <td>{{ item[3] }}</td>
              <td>{{ item[4] }}</td>
              <td>{{ item[5] }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="text-xs" style="width: 40%; padding-left: 3.125vw">
        <div>
          <div class="my10">
            <span class="chart-sub-title">4PL发货</span>
          </div>
          <table style="width: 100%; text-align: right; white-space: nowrap; overflow: hidden">
            <thead>
            <tr>
              <td style="text-align: left">日期</td>
              <td>4PL订单存量</td>
              <td>已财审待打印</td>
              <td>已打印待发货</td>
              <td>发货业绩</td>
            </tr>
            </thead>
            <tbody>
            <tr style="color: #2680EB; font-weight: bold">
              <td style="text-align: left">合计</td>
              <td>{{ tablesTotRow._4PL[0] }}</td>
              <td>{{ tablesTotRow._4PL[1] }}</td>
              <td>{{ tablesTotRow._4PL[2] }}</td>
              <td>{{ tablesTotRow._4PL[3] }}</td>
            </tr>
            <tr v-for="item in tablesData._4PL" :key="item[0]">
              <td style="text-align: left">{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
              <td>{{ item[2] }}</td>
              <td>{{ item[3] }}</td>
              <td>{{ item[4] }}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div style="margin-top: 20px">
          <div class="my10">
            <span class="chart-sub-title">产品供应</span>
          </div>
          <table style="width: 100%; text-align: right; white-space: nowrap; overflow: hidden">
            <thead>
            <tr>
              <td style="text-align: left">日期</td>
              <td>到期未发</td>
              <td>总仓匹配率7天内</td>
              <td>商品欠货额</td>
              <td>订单欠货额</td>
            </tr>
            </thead>
            <tbody>
            <tr style="color: #2680EB; font-weight: bold">
              <td style="text-align: left">日均值</td>
              <td>{{ tablesTotRow.productSupply[0] }}</td>
              <td>{{ tablesTotRow.productSupply[1] }}</td>
              <td>{{ tablesTotRow.productSupply[2] }}</td>
              <td>{{ tablesTotRow.productSupply[3] }}</td>
            </tr>
            <tr v-for="item in tablesData.productSupply" :key="item[0]">
              <td style="text-align: left">{{ item[0] }}</td>
              <td>{{ item[1] }}</td>
              <td>{{ item[2] }}</td>
              <td>{{ item[3] }}</td>
              <td>{{ item[4] }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
import { formatNumber } from '@/utils/helper'
import Title from '../../components/Title'

const formatW = (num) => {return typeof num !== 'number' ? num : formatNumber(num, 10000, 0) + '万'}
const formatY = (num) => {return typeof num !== 'number' ? num : formatNumber(num, 100000000) + '亿'}
const formatZ = (num) => {return typeof num !== 'number' ? num : formatNumber(num, 1, 0)}

const days = []
for (let i = 1; i < 8; i++) {
  let day = moment().subtract(i, 'day').format('MM-DD')
  days.push(day)
}
export default {
  name: 'CirculationOverview',
  components: {
    Title
  },
  data () {
    return {
      days: days,
      monthView: { // 月销售与发货目标达成
        PAY: [], // 销售目标、实绩、达成、差值
        SEND: [] // 发货目标 、 、 、
      },
      briefDesc: {
        PAY: [], // 销售额：昨日、7天、月累计、日均
        GOODS_AUDIT: [], // 货审额
        SEND: [] // 发货额
      },
      chartOptions: {
        grid: {
          top: 20,
          left: 4,
          right: 10,
          bottom: 0,
          containLabel: true
        },
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(150,150,150,0.1)'
            },
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: '统计日期：{b} <br/> 当日发货业绩：{c}'
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#999'
          },
          data: days.slice().reverse()
        },
        yAxis: {
          max: 'dataMax',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            data: [],
            barWidth: 15,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              color: '#2680eb'
            },
            label: {
              show: true,
              position: 'top',
              color: '#555966',
              formatter: params => formatNumber(params.value, 10000, 0) + '万'
            }
          }
        ]
      },
      tablesData: {
        channel: [],
        _4PL: [],
        order: [],
        productSupply: []
      },
      tablesTotRow: {
        channel: [],
        _4PL: [],
        order: [],
        productSupply: []
      },
      RSDL_TAG_SEND_AMT: ''
    }
  },
  created () {
    this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
  },
  methods: {
    // 整体情况简述
    getData1 () {
      this.$axios.post('/api/admin/data/kpi_report/flow_overview_tot/get').then(({ data }) => {
        const source = data[0]
        this.briefDesc.PAY = [
          formatW(source.DTD_PAY_AMT), formatW(source.DTD_PAY_AMT_7D),
          formatY(source.MTD_PAY_AMT), formatW(source.AVG_PAY_AMT)
        ]
        this.briefDesc.GOODS_AUDIT = [
          formatW(source.DTD_GOODS_AUDIT_AMT), formatW(source.DTD_GOODS_AUDIT_AMT_7D),
          formatY(source.MTD_GOODS_AUDIT_AMT), formatW(source.AVG_GOODS_AUDIT_AMT)
        ]
        this.briefDesc.SEND = [
          formatW(source.DTD_SEND_AMT), formatW(source.DTD_SEND_AMT_7D),
          formatY(source.MTD_SEND_AMT), formatW(source.AVG_SEND_AMT)
        ]

      })
    },

    // 销售与发货目标达成 & tables合计行
    getData2 () {
      this.$axios.post('/api/admin/data/kpi_report/flow_overview_m/get').then(({ data }) => {
        const source = data[0]
        this.monthView.PAY = [
          formatY(source.MTD_TAG_PAY_AMT), formatY(source.MTD_PAY_AMT),
          (source.MTD_PAY_RATE * 100).toFixed(2) + '%', formatY(source.DIFF_PAY_AMT)
        ]
        this.monthView.SEND = [
          formatY(source.MTD_TAG_SEND_AMT), formatY(source.MTD_SEND_AMT),
          (source.MTD_SEND_RATE * 100).toFixed(2) + '%', formatY(source.DIFF_SEND_AMT)
        ]

        this.tablesTotRow.channel = [
          formatZ(source['MTD_PAY_AMT']), formatZ(source['MTD_REFUND_AMT']),
          (source['MTD_REFUND_RATE'] * 100).toFixed(1) + '%',
          (source['MTD_PAY_SPOT_RATE'] * 100).toFixed(1) + '%',
          formatZ(source['NOT_SEND_AMT'])
        ]
        this.tablesTotRow._4PL = [
          formatZ(source['ZD_ORDER_CNT']), formatZ(source['AUDITED_WAIT_PRINT_AMT']),
          formatZ(source['PRINTED_WAIT_SEND_AMT']), formatZ(source['MTD_SEND_AMT'])
        ]
        this.tablesTotRow.order = [
          formatZ(source['MTD_AUDIT_AMT']), formatZ(source['MTD_GOODS_AUDIT_AMT']),
          formatZ(source['MTD_FIN_AUDIT_AMT']), formatZ(source['WAIT_AUDIT_AMT']),
          formatZ(source['WAIT_GOOD_AUDIT_AMT'])
        ]
        this.tablesTotRow.productSupply = [
          formatZ(source['OT_NOT_SEND_AMT']), '/',
          formatZ(source['LACK_GOODS_AMT']), formatZ(source['LACK_GOODS_ORD_AMT'])
        ]
      })
    },

    // 四个表格的数据 && 每天发货目标与实际（取4PL发货表格的发货业绩列）
    getData3 () {
      this.$axios.post('/api/admin/data/kpi_report/flow_overview_d/get').then(({ data }) => {
        const source = data.sort((a, b) => moment(b.TDATE) - moment(a.TDATE))
        this.tablesData.channel = days.map((day, index) => {
          const row = source[index] || {}
          return [
            day,
            formatZ(row['DTD_PAY_AMT']),
            formatZ(row['DTD_REFUND_AMT']),
            row['DTD_REFUND_RATE'] ? (row['DTD_REFUND_RATE'] * 100).toFixed(1) + '%' : '',
            row['DTD_PAY_SPOT_RATE'] ? (row['DTD_PAY_SPOT_RATE'] * 100).toFixed(1) + '%' : '',
            formatZ(row['NOT_SEND_AMT'])
          ]
        })
        this.tablesData._4PL = days.map((day, index) => {
          const row = source[index] || {}
          return [
            day,
            formatZ(row['ZD_ORDER_CNT']),
            formatZ(row['AUDITED_WAIT_PRINT_AMT']),
            formatZ(row['PRINTED_WAIT_SEND_AMT']),
            formatZ(row['DTD_SEND_AMT'])
          ]
        })
        this.tablesData.order = days.map((day, index) => {
          const row = source[index] || {}
          return [
            day,
            formatZ(row['DTD_AUDIT_AMT']),
            formatZ(row['DTD_GOODS_AUDIT_AMT']),
            formatZ(row['DTD_FIN_AUDIT_AMT']),
            formatZ(row['WAIT_AUDIT_AMT']),
            formatZ(row['WAIT_GOOD_AUDIT_AMT'])
          ]
        })
        this.tablesData.productSupply = days.map((day, index) => {
          const row = source[index] || {}
          return [
            day,
            formatZ(row['OT_NOT_SEND_AMT']),
            row['MATCH_ORD_RATE'] ? (row['MATCH_ORD_RATE'] * 100).toFixed(1) + '%' : '',
            formatZ(row['LACK_GOODS_AMT']),
            formatZ(row['LACK_GOODS_ORD_AMT']),
          ]
        })

        this.chartOptions.series[0].data = source.map(_ => _['DTD_SEND_AMT']).reverse()
      })
    },

    // 获取剩余日均发货目标
    getData4 () {
      this.$axios.post('/api/admin/data/kpi_report/flow_overview_rsdl_tag/get').then(res => {
        const data = res.data[0]?.RSDL_TAG_SEND_AMT
        this.RSDL_TAG_SEND_AMT = formatW(data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Header{
  padding-top: 10px;
  height: 40px;
  // padding-bottom: 10px;
  border-bottom: 0px solid #F0F0F0;
}
.flex-4 {
  flex-wrap: wrap;

  .text-gary {
    color: #999;
  }

  > div {
    width: 25%;
    margin-bottom: 10px;

    > div:last-child {
      font-size: 20px;
      color: #000;
      height: 24px;
    }
  }
}

.left-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  thead {
    td {
      background: #f5f7ff;
    }
  }
  tbody tr:nth-child(2n) td{
    background: #fcfcff;
  }
  td {
    text-align: center;
    color: #282c33;
    line-height: calc(0.045px * var(--height));
    border: 1px solid #e7e9f0;
    &:first-child {
      padding-left: 10px;
      text-align: left;
      color: #808492;
    }
  }
}

.f-table {
  width: 100%;
  text-align: right;
  white-space: nowrap;
  overflow: hidden
}


table {
  table-layout: fixed;
  line-height: calc(((1px * var(--height) - 180px - 29px) / 18));

  td {
    white-space: nowrap;
    padding-right: 5px;
  }
  tr {
    border-bottom: 1px solid #e7e9f0;
  }

  thead tr {
    color: #808492;


    td:first-child {
      width: 10%;
    }
  }
}

.left-side {
  position: relative;
  &:after {
    position: absolute;
    content: "";
    height: 97%;
    top: 3%;
    width: 1px;
    background: #e7e9f0;
    right: -1.5vw;
  }
}

.h150 {
  height: calc(0.8px * var(--height) - 290px);
}

.h350 {
  height: calc(1px * var(--height) - 305px - 30px);
}
</style>
