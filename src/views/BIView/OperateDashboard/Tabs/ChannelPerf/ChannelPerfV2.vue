<!--渠道业绩-->
<template>
  <div>
    <div class="flex flex-between" style="">
      <div style="padding: 10px 0;position: relative">
        <!-- <span class="chart-sub-title"></span> -->
        <Title class="title" :label="'每日业绩完成情况'" :jump="true" :jumpTarget="JumpStr" />
        <div class="text-xs flex flex-start"
             style="position: absolute; z-index: 999; width: 1000px; line-height: 20px; margin-top: 10px">
          <div style="width: 20%; margin-right: 40px">
            <div class="flex flex-start">
              <div class="text-gary mr10">日累计{{ statisticType === 1 ? '支付' : '发货' }}目标</div>
              <div>{{ leftView.day[0] }}</div>
            </div>
            <div class="flex-start flex">
              <div class="text-gary mr10">月累计{{ statisticType === 1 ? '支付' : '发货' }}目标</div>
              <div>{{ leftView.month[0] }}</div>
            </div>
          </div>
          <div style="width: 20%; margin-right: 40px">
            <div class="flex flex-start">
              <div class="text-gary mr10">日累计完成业绩</div>
              <div>{{ leftView.day[1] }}</div>
            </div>
            <div class="flex flex-start">
              <div class="text-gary mr10">月累计完成业绩</div>
              <div>{{ leftView.month[1] }}</div>
            </div>
          </div>
          <div style="width: 20%; margin-right: 40px">
            <div class="flex flex-start">
              <div class="text-gary mr10">日累计完成率</div>
              <div
                  :class="[leftView.day[0] !== '0' && leftView.day[1] !== 0 ? leftView.day[3] ? 'text-red' : 'text-green' : '']">
                {{ leftView.day[2] }}
              </div>
            </div>
            <div class="flex flex-start">
              <div class="text-gary mr10">月累计完成率</div>
              <div
                  :class="[leftView.month[0] !== '0' && leftView.month[1] !== '0' ? leftView.month[3] ? 'text-red' : 'text-green' : '']">
                {{ leftView.month[2] }}
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div class="flex flex-between text-xs" style="position: relative; height: 41px">
        <div class="flex-start" style="position: absolute; top: 41px; right: 0; z-index: 999; align-items: flex-start">
          <div class="flex flex-between text-xs">
            <div class="text-xs-radio" style="width: 317px">
              口径<a-radio-group v-model="statisticType" class="ml10">
                <a-radio :value="1">支付口径</a-radio>
                <a-radio :value="2">发货口径</a-radio>
              </a-radio-group>
            </div>
          </div>
          <div>
            <div class="flex flex-between text-xs" style="margin-bottom: 9px">
              <div class="nowrap" style="display: inline-block; text-overflow: ellipsis; width: 180px; overflow: hidden">
                渠道分类<span style="color: rgba(0, 0, 0, .65)"
                          v-if="query.channelType.length">({{ query.channelType.join(';') }})</span></div>
              <a-tooltip placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
                <template slot="title">
                  <div style="width: 150px">
                    <a-checkbox-group v-model="query.channelType">
                      <div v-for="item in new Set(uniqChannelOptions.map(_ => _.channelType))" :key="item">
                        <a-checkbox :value="item">
                          {{ item }}
                        </a-checkbox>
                      </div>
                    </a-checkbox-group>
                  </div>
                </template>
                <div class="dropdown-icon">
                  <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
                </div>
              </a-tooltip>
            </div>
            <div class="flex flex-between text-xs">
              <div class="nowrap" style="display: inline-block; text-overflow: ellipsis; width: 120px; overflow: hidden">
                渠道细分<span style="color: rgba(0, 0, 0, .65)"
                          v-if="query.channel.length">({{ query.channel.join(';') }})</span></div>
              <a-tooltip placement="bottomRight" overlayClassName="light-tooltip" trigger="click">
                <template slot="title">
                  <div style="width: 150px">
                    <a-checkbox-group v-model="query.channel">
                      <div v-for="item in channelOptions" :key="item">
                        <a-checkbox :value="item">{{ item }}</a-checkbox>
                      </div>
                    </a-checkbox-group>
                  </div>
                </template>
                <div class="dropdown-icon">
                  <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
                </div>
              </a-tooltip>
            </div>
          </div>
        </div>
        <div class="mr20">
          <div class="text-xs-radio">
            <a-tooltip placement="top" overlayClassName="light-tooltip">
              <template slot="title">
                <div class="text-black text-xs" style="width: 350px">
                  <div>视角说明</div>
                  <div>一、全司视角：全公司产生业绩汇总，但不包含其它（非正常业务产生的业绩）</div>
                  <div>二、全中视角：全司视角的统计对象基础上，但不含①定制&拎包、②品牌市场所属业绩、③其它</div>
                  <div>三、品市视角：母婴店、快手店、抖音店、海外B2C的汇总业绩</div>
                </div>
              </template>
              <a-icon type="question-circle" class="" style="color: #999; cursor: pointer"/>
            </a-tooltip>
            视角<a-radio-group class="ml10" v-model="viewType">
              <a-radio :value="1">全司视角</a-radio>
              <a-radio :value="2">全中视角</a-radio>
              <a-radio :value="3">品市视角</a-radio>
            </a-radio-group>
          </div>
        </div>
        <div>
          <ez-month-select v-model="query.yearMonth" class="flex-start">
            <div style="width: 140px">年月<span style="color: rgba(0, 0, 0, .65)">{{
                `(${query.yearMonth.getFullYear()}-${query.yearMonth.getMonth() + 1})`
              }}</span>
            </div>
            <div style="margin-left: 40px" class="dropdown-icon">
              <a-icon type="double-right" style="color: #079909;transform: rotate(90deg); cursor: pointer"/>
            </div>
          </ez-month-select>
        </div>
      </div>
    </div>
    <div class="h220">
      <v-chart :options="chartOptions"  ref="chart" autoresize></v-chart>
    </div>
    <div class="mt10 text-xs flex flex-between">
      <div class="day-item" @mouseleave="mouseenter(null, null)">
        <div>天</div>
        <div @mouseenter="mouseenter(0, 0,null)"
          :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}"
        >目标</div>
        <div @mouseenter="mouseenter(1, 0,null)"
          :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
        >实绩</div>
        <div @mouseenter="mouseenter(2, 0,null)"
          :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
        >达成</div>
      </div>
      <div class="day-item" v-for="item in monthDetails.slice(0, monthDetails.length > 30 ? 16 : 15)" :key="item.date" @mouseleave="mouseenter(null, null)">
        <div>{{ item.shortDate }}日</div>
        <div @mouseenter="mouseenter(0, item.shortDate,null)"
          :style="{background:(curCol === 0) || (curRow === item.shortDate) ? hoverColor : null,}"
        >{{ formatW(item.target) }}</div>
        <div @mouseenter="mouseenter(1, item.shortDate,null)"
          :style="{background:(curCol === 1) || (curRow === item.shortDate) ? hoverColor : null,}"
        >{{ formatW(item.pay) }}</div>
        <div @mouseenter="mouseenter(2, item.shortDate,null)"
          :style="{background:(curCol === 2) || (curRow === item.shortDate) ? hoverColor : null,}"
          :class="[item.pay && item.target ? item.complete ? 'text-red' : 'text-green' : '']">{{ item.rate }}</div>
      </div>
    </div>
    <div class="mt15 pb5 text-xs flex flex-between">
      <div class="day-item" @mouseleave="mouseenter(null, null)">
        <div>天</div>
        <div @mouseenter="mouseenter(3, 0+'d',null)"
          :style="{background:(curCol === 3) || (curRow === 0+'d') ? hoverColor : null,}"
        >目标</div>
        <div @mouseenter="mouseenter(4, 0+'d',null)"
          :style="{background:(curCol === 4) || (curRow === 0+'d') ? hoverColor : null,}"
        >实绩</div>
        <div @mouseenter="mouseenter(5, 0+'d',null)"
          :style="{background:(curCol === 5) || (curRow === 0+'d') ? hoverColor : null,}"
        >达成</div>
      </div>
      <div class="day-item" v-for="item in monthDetails.slice(monthDetails.length > 30 ? 16 : 15)" :key="item.date" @mouseleave="mouseenter(null, null)">
        <template v-if="!item.shortDate">
          <div style="height: 30px;color: #808492">/</div>
          <div style="height: 30px;color: #808492">/</div>
          <div style="height: 30px;color: #808492">/</div>
          <div style="height: 30px;color: #808492">/</div>
        </template>
        <template v-else>
          <div>{{ item.shortDate }}日</div>
          <div @mouseenter="mouseenter(3, item.shortDate+'d',null)"
            :style="{background:(curCol === 3) || (curRow === item.shortDate+'d') ? hoverColor : null,}"
          >{{ formatW(item.target) }}</div>
          <div @mouseenter="mouseenter(4, item.shortDate+'d',null)"
            :style="{background:(curCol === 4) || (curRow === item.shortDate+'d') ? hoverColor : null,}"
          >{{ formatW(item.pay) }}</div>
          <div @mouseenter="mouseenter(5, item.shortDate+'d',null)"
            :style="{background:(curCol === 5) || (curRow === item.shortDate+'d') ? hoverColor : null,}"
            :class="[item.pay && item.target ? item.complete ? 'text-red' : 'text-green' : '']">{{ item.rate }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import uniqWith from 'lodash/uniqWith'
import isEqual from 'lodash/isEqual'
import moment from 'moment'
import EzMonthSelect from '../../components/EzMonthSelect'
import { formatNumber } from '@/utils/helper'
import Bus from '@/utils/bus'
import Title from '../../components/Title'

const formatW = (num) => {return (typeof num !== 'number') || num === 0 ? '--' : formatNumber(num, 10000, 1) + '万'}
const formatZ = (num) => {return typeof num !== 'number' ? '--' : formatNumber(num, 1, 0)}
const transPercent = (num) => {return (typeof num !== 'number') || num === 0 ? '--' : (num * 100).toFixed(2) + '%'}

const channelTypeIndex = ['线上渠道', '线下渠道', '海外渠道', '其它']

export default {
  name: 'ChanelPerf',
  components: {
    EzMonthSelect,
    Title
  },
  data () {
    return {
      statisticType: 1, // 口径
      viewType: 1, // 视角
      query: {
        yearMonth: new Date(),
        channelType: [],
        channel: []
      },
      showRightTop: false,
      theDays: [],
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
          formatter: params => {
            const viewType = ({ '1': '全司', 2: '全中', '3': '品市' })[this.viewType]
            const statisticType = ({ '1': '支付', '2': '发货' })[this.statisticType]
            const name = params[0].name
            return `统计日期：${name}<br>${viewType}${statisticType}业绩：${formatZ(Number(params[0].value))}<br>${viewType}${statisticType}目标：${formatZ(Number(params[1].value))}`
          }
        },
        grid: {
          top: 60,
          bottom: 10,
          left: 10,
          right: 10,
          containLabel: true
        },
        xAxis: {
          data: [],
          axisLabel: {
            color: '#999',
            formatter: params => {
              return params.slice(-2)
            }
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
              type: 'solid',
              color: ['rgba(234,234,234,0.5)']
            }
          },
          axisLabel: {
            show: false,
            color: '#bbbbbb',
            // interval: 100000000,
          }
        },
        series: [
          {
            type: 'bar',
            data: [],
            barWidth: 20,
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: '#00b050'
            },
          },
          {
            type: 'line',
            symbol: 'none',
            smooth: true,
            data: [],
            itemStyle: {
              color: '#8aa8cf'
            }
          },
        ]
      },
      allData: [],
      leftView: {
        month: [],
        day: []
      },
      monthDetails: Array(30).fill({}),
      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,
      JumpStr:'',
    }
  },
  computed: {
    statisticProps () {
      return this.statisticType === 1 ? ['支付金额', '支付目标'] : ['发货业绩', '发货业绩目标']
    },
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
    uniqChannelOptions () {
      const yearMonth = moment(this.query.yearMonth).format('YYYY-MM')
      const filtered1 = this.allData.filter(_ => {
        return moment(_['统计日期']).format('YYYY-MM') === yearMonth
      }).filter(_ => {
        return (this.viewType === 1 && _['数据类型'] === '全司') ||
            (this.viewType === 2 && _['数据类型'] === '全中') ||
            (this.viewType === 3 && _['数据类型'] === '产市')
      })
      return uniqWith(filtered1.map(_ => {
        return { channelType: _['渠道类别'], channel: _['渠道细分'] }
      }), isEqual).sort((a, b) => {
        return channelTypeIndex.indexOf(a.channelType) - channelTypeIndex.indexOf(b.channelType)
      })
    }
  },
  watch: {
    viewType: {
      handler () {
        this.getData1(true)
      }
    },
    uniqChannelOptions (val, oldVal) {
      if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
        this.query.channelType = this.query.channelType.filter(item => {
          return val.find(_ => _.channelType === item)
        })
      }
    },
    statisticType: {
      handler () {
        this.getData1(true)
      }
    },
    'query.yearMonth': {
      handler () {
        this.getData1()
      },
      immediate: false
    },
    'query.channelType': {
      handler () {
        let hasLoad = false
        for (let item of this.query.channel) {
          if (this.channelOptions.indexOf(item) === -1) {
            this.query.channel = []
            hasLoad = true
            break
          }
        }
        if (!hasLoad) {
          this.getData1(true)
        }
      }
    },
    'query.channel': {
      handler () {
        this.getData1(true)
      }
    }
  },
  async created () {
    this.getData1()
    Bus.$on('tab-cell-click', (payload) => {
      if(payload.title === '渠道业绩') {
        if(payload.tab === '发货口径') {
          this.statisticType = 2
        }
        if(payload.tab === '支付口径') {
          this.statisticType = 1
        }
      }
    })
    this.jumpTarget();
  },
  methods: {
    async jumpTarget() {
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2019_00017':'BI_PC_2020_00352'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },
    formatW,
    getData1 (useCache) {
      const promise = useCache ? Promise.resolve({ data: this.allData }) :
          this.$axios.post('/api/admin/data/kpi_report/channel_pref_new/get', {
            mdate: moment(this.query.yearMonth).format('YYYY-MM')
          })
      promise.then(res => {
        const allData = this.allData = Object.freeze(res.data.filter(item => {
          return item['渠道类别'] && item['渠道细分']
        }))
        const yearMonth = moment(this.query.yearMonth).format('YYYY-MM')

        const filtered0 = allData.filter(_ => {
          return moment(_['统计日期']).format('YYYY-MM') === yearMonth
        }).filter(_ => {
          return (this.viewType === 1 && _['数据类型'] === '全司') ||
              (this.viewType === 2 && _['数据类型'] === '全中') ||
              (this.viewType === 3 && _['数据类型'] === '产市')
        })

        const filtered1 = filtered0.filter(_ => {
          return this.query.channelType.length ? this.query.channelType.indexOf(_['渠道类别']) > -1 : true
        })

        const filtered2 = filtered1.filter(_ => {
          return this.query.channel.length ? this.query.channel.indexOf(_['渠道细分']) > -1 : true
        })

        const day_a = filtered2.reduce((acc, cur) => {
          const time = moment() - moment(cur['统计日期'])
          return acc + (time > 0 ? cur[this.statisticProps[1]] : 0)
        }, 0)
        const day_b = filtered2.reduce((acc, cur) => {
          const time = moment() - moment(cur['统计日期'])
          return acc + (time > 0 ? cur[this.statisticProps[0]] : 0)
        }, 0)
        const day_c = day_a === 0 ? '--' : day_b / day_a
        this.leftView.day = [formatZ(day_a), formatZ(day_b), transPercent(day_c), day_a <= day_b]

        const month_a = filtered2.reduce((acc, cur) => cur[this.statisticProps[1]] + acc, 0)
        const month_b = filtered2.reduce((acc, cur) => cur[this.statisticProps[0]] + acc, 0)
        const month_c = month_a === 0 ? '--' : month_b / month_a
        this.leftView.month = [formatZ(month_a), formatZ(month_b), transPercent(month_c), month_a <= month_b]

        const maps = {}
        filtered2.forEach(item => {
          const day = moment(item['统计日期']).format('YYYY-MM-DD')
          if (maps[day]) {
            maps[day].push(item)
          } else {
            maps[day] = [item]
          }
        })
        let array = []
        Object.keys(maps).forEach(key => {
          const target = maps[key].map(_ => _[this.statisticProps[1]]).reduce((acc, cur) => acc + cur, 0)
          const pay = maps[key].map(_ => _[this.statisticProps[0]]).reduce((acc, cur) => acc + cur, 0)
          const item = {
            date: key,
            shortDate: key.slice(-2),
            target,
            pay,
            complete: target <= pay,
            rate: transPercent(target === 0 ? '--' : pay / target)
          }
          array.push(item)
        })
        array = array.sort((a, b) => {
          return moment(a.date) - moment(b.date)
        })
        let monthDetails = array.slice()
        if (array.length === 31 || array.length === 29) {
          monthDetails = monthDetails.concat([{}])
        }
        if (array.length === 28) {
          monthDetails = monthDetails.concat([{}, {}])
        }
        if(!array.length) {
          monthDetails = Array(30).fill({})
        }
        this.monthDetails = monthDetails
        this.chartOptions.xAxis.data = array.map(_ => _.date)
        this.$refs['chart'].$refs['echarts']?.clear()
        this.chartOptions.series[0].data = array.map(item => {
          return {
            value: item.pay.toFixed(0),
            itemStyle: {
              color: item.pay >= item.target ? '#ff2219' : '#00b050'
            }
          }
        })
        this.chartOptions.series[1].data = array.map(item => item.target.toFixed(0))
      })
    },
    mouseenter(col, row,type) {
      this.curCol = col
      this.curRow = row
      this.curType = type
    },

  }
}
</script>

<style lang="scss" scoped>

.day-item {
  flex: 1;
  text-align: center;

  &:first-child {
    border-left: 1px solid #e7e9f0;

    > div {
      color: #808492 !important;
    }
  }

  > div {
    color: #282c33;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #e7e9f0;
    border-right: 1px solid #e7e9f0;

    &:first-child {
      border-top: 1px solid #e7e9f0;
    }
  }

  > div:first-child {
    background: #f5f7ff;
    color: #808492;
  }

  > div:nth-child(2n - 1):not(:first-child) {
    background: #fcfcff;

  }
}

.text-xs-radio {
  /deep/ .ant-radio-wrapper {
    font-size: 12px;
  }
}

.text-xs-checkbox {
  position: relative;

  /deep/ .ant-checkbox-wrapper {
    font-size: 12px;
  }

  .rightTop-table {
    position: absolute;
    top: 20px;
    right: 0;

    table {
      td {
        text-align: right;
      }

      tbody {
        tr {
          line-height: 2;

          &:nth-child(2n+2) {
            background: #f5faff;
          }
        }

        td {
          font-size: 12px;
          color: #333;
        }
      }
    }
  }
}

.h220 {
  height: calc(1px * var(--height) - 325px)
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
