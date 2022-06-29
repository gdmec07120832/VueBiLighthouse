<template>
  <div class="px15">
    <!-- class="py10" -->
    <div class="TitleHeard" style="display: flex;padding: 10px 0px;">
      <!-- <div class="chart-sub-title" style="line-height: 41px;">库存周转</div> -->
      <Title :label="'库存周转'" />
      <Jump class="JumpCss" @click.native="jumpTarget" />
    </div>
    <div>
      <div class="ch1 flex-start">
        <div class="section-item"
             :class="{active: query.valueType === '1'}"
             @click="query.valueType = '1'">
          <div>全司</div>
          <div class="cnt">{{ formatZ(thisMonthData.TRNVR_RATE_A) }}</div>
          <div>
            <div class="flex">
              <span class="text-gary" style="flex: 0 0 60%">同期</span>
              <span>
                {{ formatZ(thisMonthData.AGO_TRNVR_RATE_A) }}
              </span>
            </div>
            <div class="flex">
              <span class="text-gary" style="flex: 0 0 60%">同比</span>
              <span :class="{
                'text-red': thisMonthData.TRNVR_RATE_A_YOY && thisMonthData.TRNVR_RATE_A_YOY > 0,
                'text-green': thisMonthData.TRNVR_RATE_A_YOY && thisMonthData.TRNVR_RATE_A_YOY < 0,
              }">
                {{ formatRto(thisMonthData.TRNVR_RATE_A_YOY) }}
              </span>
            </div>
          </div>
        </div>
        <div class="section-item" :class="{active: query.valueType === '2'}"
             @click="query.valueType = '2'">
          <!-- <div>佛山仓+青岛仓+成都仓+供应商</div> -->
          <div>佛山仓+青岛仓+成都仓+成品代发仓+供应仓</div>
          <div class="cnt">
            {{ formatZ(thisMonthData.TRNVR_RATE_B) }}
          </div>
          <div>
            <div class="flex">
              <span class="text-gary" style="flex: 0 0 60%">同期</span>
              <span>
                {{ formatZ(thisMonthData.AGO_TRNVR_RATE_B) }}
              </span>
            </div>
            <div class="flex">
              <span class="text-gary" style="flex: 0 0 60%">同比</span>
              <span :class="{
                'text-red': thisMonthData.TRNVR_RATE_B_YOY && thisMonthData.TRNVR_RATE_B_YOY > 0,
                'text-green': thisMonthData.TRNVR_RATE_B_YOY && thisMonthData.TRNVR_RATE_B_YOY < 0,
              }">
                {{ formatRto(thisMonthData.TRNVR_RATE_B_YOY) }}
              </span>
            </div>
          </div>
        </div>
        <div class="section-item" :class="{active: query.valueType === '3'}"
             @click="query.valueType = '3'">
          <div>小商品成品仓</div>
          <div class="cnt">
            {{ formatZ(thisMonthData.TRNVR_RATE_C) }}
          </div>
          <div>
            <div class="flex">
              <span class="text-gary" style="flex: 0 0 60%">同期</span>
              <span>
                {{ formatZ(thisMonthData.AGO_TRNVR_RATE_C) }}
              </span>
            </div>
            <div class="flex">
              <span class="text-gary" style="flex: 0 0 60%">同比</span>
              <span :class="{
                'text-red': thisMonthData.TRNVR_RATE_C_YOY && thisMonthData.TRNVR_RATE_C_YOY > 0,
                'text-green': thisMonthData.TRNVR_RATE_C_YOY && thisMonthData.TRNVR_RATE_C_YOY < 0,
              }">
                {{ formatRto(thisMonthData.TRNVR_RATE_C_YOY) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ch2" style="position: relative">
      <div style="position: absolute; right: 0; top: 0; z-index: 99">
        <div class="flex text-xs text-gary">
          统计年份 （{{ query.year }}）
          <a-tooltip placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
            <template slot="title">
              <a-radio-group v-model="query.year">
                <div v-for="y in yearOptions" :key="y">
                  <a-radio :value="y">{{ y }}</a-radio>
                </div>
              </a-radio-group>
            </template>
            <div style="margin-left: 40px" class="dropdown-icon">
              <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
            </div>
          </a-tooltip>

        </div>
      </div>
      <v-chart ref="chart1" autoresize :options="chartOptions"/>
    </div>

    <div>
      <table class="dashboard-common-table">
        <tr>
          <td>年月</td>
          <td v-for="item in months" :key="item">
            {{ (item) + '月' }}
          </td>
        </tr>
        <tr>
          <td @mouseenter="mouseenter(0, 0,null)"
            :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}"
          >当期目标</td>
          <td @mouseenter="mouseenter(0, (m+'月'),null)"
            :style="{background:(curCol === 0) || (curRow === (m+'月')) ? hoverColor : null,}"
            v-for="m in months" :key="m">
            <span v-if="query.valueType === '1' || query.valueType === '2'">
              {{ formatZ(((yearMonthValues[query.year] || [])[m - 1] || {})['TGT_TRNVR_RATIO']) }}
            </span>
            <span v-else class="text-black">
              {{
                ((yearMonthValues[query.year] || [])[m - 1] || {})[valueProps[query.valueType]] ? '暂无目标' : '--'
              }}
            </span>
          </td>
        </tr>

        <tr>
          <td @mouseenter="mouseenter(1, 0,null)"
            :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
          >{{ query.year }}</td>
          <td @mouseenter="mouseenter(1, (m+'月'),null)"
            :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
            v-for="m in months" :key="m">
            {{ formatZ(((yearMonthValues[query.year] || [])[m - 1] || {})[valueProps[query.valueType]]) }}
          </td>
        </tr>
        <tr>
          <td @mouseenter="mouseenter(2, 0,null)"
            :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
          >{{ query.year - 1 }}</td>
          <td @mouseenter="mouseenter(2, (m+'月'),null)"
            :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
            v-for="m in months" :key="m">
            {{
              formatZ(
                  ((yearMonthValues[query.year - 1] || [])[m - 1] || {})[valueProps[query.valueType]]
              )
            }}
          </td>
        </tr>
        <tr>
          <td @mouseenter="mouseenter(3, 0,null)"
            :style="{background:(curCol === 3) || (curRow === 0) ? hoverColor : null,}"
          >同比增长</td>
          <td @mouseenter="mouseenter(3, (m+'月'),null)"
            :style="{background:(curCol === 3) || (curRow === (m+'月')) ? hoverColor : null,}"
            v-for="m in months" :key="m" :class="{
            'text-red':  ((yearMonthValues[query.year] || [])[m - 1] || {})[valueProps[query.valueType] + '_YOY'] > 0,
            'text-green':  ((yearMonthValues[query.year] || [])[m - 1] || {})[valueProps[query.valueType] + '_YOY'] < 0
          }">
            {{
              formatRto(
                  ((yearMonthValues[query.year] || [])[m - 1] || {})[valueProps[query.valueType] + '_YOY']
              )
            }}
          </td>
        </tr>
        <tr>
          <td @mouseenter="mouseenter(4, 0,null)"
            :style="{background:(curCol === 4) || (curRow === 0) ? hoverColor : null,}"
          >是否达标</td>
          <td @mouseenter="mouseenter(4, (m+'月'),null)"
            :style="{background:(curCol === 4) || (curRow === (m+'月')) ? hoverColor : null,}"
            v-for="m in months" :key="m">
            <span v-if="query.valueType === '1' || query.valueType === '2'" :class="{
              'text-red': calcIsReached(query.year, m - 1) === '是',
              'text-green': calcIsReached(query.year, m - 1) === '否'
            }">
              {{
                calcIsReached(query.year, m - 1)
              }}
            </span>
            <span v-else>
              {{
                ((yearMonthValues[query.year] || [])[m - 1] || {})[valueProps[query.valueType]] ? '--' : ''
              }}
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import numeral from 'numeral'
import graphic from 'echarts/lib/util/graphic'

import Jump from '@/views/BIView/PsDashboard/components/Jump'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'

export default {
  name: 'AnnualizedTurnover',
  components: {Jump,Title},
  data() {
    const months = Array(12).fill(null).map((_, i) => i + 1)
    const thisYear = (new Date()).getFullYear()
    return {
      AnnuType:'1',
      valueProps: {1: 'TRNVR_RATE_A', 2: 'TRNVR_RATE_B', 3: 'TRNVR_RATE_C'},
      yearOptions: [thisYear, thisYear - 1, thisYear - 2],
      query: {
        year: ((new Date()).getDate() === 1 && (new Date()).getMonth() === 11) ? thisYear - 1 : thisYear,
        valueType: '1',
      },
      months,
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
          formatter(params) {
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0.00') : '--'}`
            }).join('')
            return `${params[0].axisValue}周转率${lines}`
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
            color: echartsColor.axisLabel,
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
            show: true,
            lineStyle: {
              color: [echartsColor.splitLine]
            }
          },
          axisLabel: {
            show: true,
            color: echartsColor.axisLabel,
          }
        },
        series: [
          {
            type: 'line',
            z: 10,
            smooth: true,
            itemStyle: {
              color: echartsColor.thisYear,
            },
            symbol: 'none',
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
            smooth: true,
            itemStyle: {
              color: echartsColor.previousYear,
            },
            symbol: 'none',
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
            data: []
          }
        ]
      },
      yearMonthValues: {},
      thisMonthData: {
        TRNVR_RATE_A: '',
        TRNVR_RATE_B: '',
        TRNVR_RATE_C: '',
        AGO_TRNVR_RATE_A: '',
        AGO_TRNVR_RATE_B: '',
        AGO_TRNVR_RATE_C: '',
        TRNVR_RATE_A_YOY: '',
        TRNVR_RATE_B_YOY: '',
        TRNVR_RATE_C_YOY: '',
      },
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,
    }
  },
  watch: {
    'query.year'() {
      this.getData1()
    },
    'query.valueType'() {
      setTimeout(() => {
        this.parseData1(this.yearMonthValues)
      }, 200);
    },
    'AnnuType'(){
      this.query.valueType=this.AnnuType;
    }
  },
  mounted() {
    this.getData1()
  },
  methods: {
    calcIsReached(year, month) {
      const tgt = this.yearMonthValues?.[year]?.[month]?.['TGT_TRNVR_RATIO']
      const cur = this.yearMonthValues?.[year]?.[month]?.[this.valueProps[this.query.valueType]]
      if (tgt && cur) {
        return cur >= tgt ? '是' : '否'
      } else {
        return null
      }
    },
    formatZ(v) {
      return v ? numeral(v).format('0.00') : '--'
    },
    formatRto(v) {
      return (v || v === 0) ? numeral(v).format('0.00%') : '--'
    },
    getData1() {
      this.$fetchSql('pds_cockpit', 'trnvr_rto_mly', {
        MDATE: [this.query.year, this.query.year - 1].toString()
      }).then(({data}) => {
        const ret = {
          [this.query.year]: Array(12).fill({}),
          [this.query.year - 1]: Array(12).fill({})
        }
        for (let item of data) {
          const y = moment(item.MDATE).year()
          const m = moment(item.MDATE).month()
          ret[y] && (ret[y][m] = item)
        }

        this.yearMonthValues = ret
        console.log(this.yearMonthValues)
        if(moment().date() === 1) {
          if(moment().month() === 11) {
            if(ret[moment().year - 1]?.length) {
              this.thisMonthData = ret[moment().year() - 1][11]
            }
          } else {
            if(ret[moment().year()]?.length) {
              this.thisMonthData = ret[moment().year()][moment().month() - 1]
            }
          }
        } else {
          if(ret[moment().year()]?.length) {
            this.thisMonthData = ret[moment().year()][moment().month()]
          }
        }

        this.parseData1(ret)
      })
    },
    parseData1(ret) {
      const props = {1: 'TRNVR_RATE_A', 2: 'TRNVR_RATE_B', 3: 'TRNVR_RATE_C'}
      this.$refs.chart1 && this.$refs.chart1.clear()
      this.chartOptions.series[0].name = this.query.year
      this.chartOptions.series[1].name = this.query.year - 1

      this.chartOptions.series[0].data = ret[this.query.year].map(_ => _[props[this.query.valueType]])
      this.chartOptions.series[1].data = ret[this.query.year - 1].map(_ => _[props[this.query.valueType]])
    },
    mouseenter(col, row,type) {
      this.curCol = col
      this.curRow = row
      this.curType = type
    },
    jumpTarget() {
        let str = ''
        if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
            str = 'http://test.bi.linshimuye.com:9090/x/4_647_809_810'
        }
        else {
            str = 'http://bi.linshimuye.com:9090/x/4_647_809_810'
        }
        let msg = {
            url: str,
            webTitle: '周转率概览'
        }
        window.parent.postMessage(JSON.stringify(msg), '*')
    }


  }
}
</script>

<style lang="scss" scoped>
.dashboard-common-table {
  /deep/ tr {
    height: calc(((var(--height) - 36) * 0.3px) / 6);
  }
}

.section-item {
  width: 35%;
  padding-right: 20px;
  max-width: 350px;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-evenly;
  padding-left: 20px;
  border-radius: 5px;

  .cnt {
    font-size: 18px;
    font-weight: bold;
  }

  &:hover {
    cursor: pointer;
    // background: rgba(0, 0, 0, .01);
    background: rgba(0, 0, 0, 0.03);
  }

  &.active {
    // background: rgba(0, 0, 0, .02);
    background: rgba(0, 0, 0, 0.03);
  }
}

.ch1 {
  height: calc((var(--height) - 36) * 0.27px);
}

.ch2 {
  height: calc((var(--height) - 36) * 0.4px - 11px);
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
