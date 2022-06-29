<template>
<div>
  <div class="Header">
    <Title class="title" :label="'采购毛利'" :jump="true" :jumpTarget="JumpStr" />
  </div>
  <div class="flex-start flex" style="align-items: flex-start">
    <div class="mt10" style="width: 50%; padding-right: 25px">
      <div>
        <span class="chart-sub-title">集团视角</span>
        <a-tooltip placement="bottomRight" overlayClassName="light-tooltip">
          <template slot="title">
            <div class="text-black text-xs" style="width: 300px">
              <div>1、采购毛利率为日期选择当天采购毛利率</div>
              <div>2、采购毛利额为日期选择当天采购毛利额</div>
              <div>3、累计采购毛利率为日期选择当月累计采购毛利率</div>
              <div>4、累计采购毛利额为日期选择当月累计采购毛利额</div>
              <div>5、此页面数据为含税数据</div>
            </div>
          </template>
          <a-icon type="question-circle" class="ml5" style="color: #999"/>
        </a-tooltip>
      </div>
      <div class="flex flex-start mt5" style="flex-wrap: wrap">
        <div class="mb5" style="width: 30%">
          <div style="color: #999">当日采购毛利率</div>
          <div class="text-xl" style="">{{ groupView.DTD_GPR_RATE }}</div>
        </div>
        <div class="mb5 flex flex-start" style="width: 50%">
          <div style="width: 45%">
            <div style="color: #999">累计采购毛利率</div>
            <div class="text-xl" style="">{{ groupView.MTD_GPR_RATE }}</div>
          </div>
          <div style="flex: 1; flex-flow: column; align-items: flex-start;" class="flex">
            <div style="line-height: 32px"><span
                style="margin-right: 10px;color: #999">目标</span><span>{{ groupView.GPR_TAR }}</span></div>
            <div style="line-height: 32px"><span style="margin-right: 10px; color: #999">差值</span>
              <span :class="groupView.GPR_DIF.startsWith('-') ? 'text-green' : 'text-red'">
              {{ groupView.GPR_DIF }}
              </span>
            </div>
          </div>
        </div>
        <div class="mb5" style="width: 30%">
          <div style="color: #999">当日采购毛利额</div>
          <div class="text-xl" style="">{{ groupView.DTD_AMT }}</div>
        </div>
        <div class="mb5 flex-start flex" style="width: 50%">
          <div style="width: 45%">
            <div style="color: #999">累计采购毛利额</div>
            <div class="text-xl" style="">{{ groupView.MTD_AMT }}</div>
          </div>
          <div style="flex: 1; flex-flow: column; align-items: flex-start;" class="flex">
            <div style="line-height: 32px"><span
                style="margin-right: 10px; color: #999">目标</span><span>{{ groupView.GPA_TAR }}</span></div>
            <div style="line-height: 32px"><span style="margin-right: 10px; color: #999">差值</span><span
                :class="groupView.GPA_DIF.startsWith('-') ? 'text-green': 'text-red'">{{ groupView.GPA_DIF }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt20 h245" style="position: relative">
        <div style="position: absolute; left: 0; top: 0">
          <span class="chart-sub-title">集团锁定毛利趋势</span>
        </div>
        <v-chart ref="chart1" autoresize :options="options1"></v-chart>
      </div>
    </div>
    <div class="mt10" style="width: 50%; padding-left: 25px">
      <div class="flex flex-between" style="line-height: 21px">
        <span class="chart-sub-title">渠道视角</span>
        <div class="text-xs-radio">
          <a-radio-group v-model="query.tax" style="display: none">
            <a-radio value="1">含税</a-radio>
            <a-radio value="2">不含税</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="flex flex-between mt5"
           style="align-items: flex-start; justify-content: flex-start; padding-bottom: 7px">
        <div style="width: 20%">
          <div style="color: #999">平台</div>
          <div class="text-xl" style="line-height: 50px">{{ transPercent((channelDesc[0] || {}).rate) }}</div>
          <div class="text-xs">
            <div style="line-height: 30px">
              <span class="text-gary" style="margin-right: 10px">目标</span>
              <span>{{ transPercent((channelDesc[0] || {}).target) }}</span>
            </div>
            <div style="line-height: 30px">
              <span class="text-gary" style="margin-right: 10px">差值</span>
              <span :class="[(channelDesc[0] || {}).diff > 0 ? 'text-red' : 'text-green']">
                {{ transPercent((channelDesc[0] || {}).diff) }}
              </span>
            </div>
          </div>
        </div>
        <div style="width: 20%">
          <div style="color: #999">直营</div>
          <div class="text-xl" style="line-height: 50px">{{ transPercent((channelDesc[1] || {}).rate) }}</div>
          <div class="text-xs">
            <div style="line-height: 30px">
              <span class="text-gary" style="margin-right: 10px">目标</span>
              <span>{{ transPercent((channelDesc[1] || {}).target) }}</span>
            </div>
            <div style="line-height: 30px">
              <span class="text-gary" style="margin-right: 10px">差值</span>
              <span :class="[(channelDesc[1] || {}).diff > 0 ? 'text-red' : 'text-green']">
                {{ transPercent((channelDesc[1] || {}).diff) }}
              </span>
            </div>
          </div>
        </div>
        <div style="width: 20%">
          <div style="color: #999">采购经销</div>
          <div class="text-xl" style="line-height: 50px">{{ transPercent((channelDesc[2] || {}).rate) }}</div>
          <div class="text-xs">
            <div style="line-height: 30px">
              <span class="text-gary" style="margin-right: 10px">目标</span>
              <span>{{ transPercent((channelDesc[2] || {}).target) }}</span>
            </div>
            <div style="line-height: 30px">
              <span class="text-gary" style="margin-right: 10px">差值</span>
              <span :class="[(channelDesc[2] || {}).diff > 0 ? 'text-red' : 'text-green']">
                {{ transPercent((channelDesc[2] || {}).diff) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt20 h245" style="position: relative">
        <div style="position: absolute; left: 0; top: 0">
          <span class="chart-sub-title">渠道锁定毛利趋势</span>
        </div>
        <v-chart ref="chart2" autoresize :options="options2"></v-chart>
      </div>
    </div>
  </div>

</div>

</template>

<script>
import graphic from 'echarts/lib/util/graphic'
import moment from 'moment'
import deepmerge from 'deepmerge'
import Title from '../../components/Title'
import echartsColor from '../../utils/echartsColor.js'

export default {
  name: 'PurchaseProfit',
  components: {
    Title,
  },
  data () {
    return {
      query: {
        tax: '1'
      },
      options1: {
        isEmpty: false,
        emptyText: '空数据集',
        grid: {
          top: 60,
          left: 0,
          right: 0,
          bottom: 10,
          containLabel: true
        },
        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
          top: 10,
          right: 0,
          selectedMode: false
        },
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: (params) => {
            const item = params[0]
            return `日期 ${item.axisValue}<br> ${item.seriesName} ${item.data.realValue}%`
          }
        },
        yAxis: {
          max: 50,
          min: 0,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#bfc2cf',
            formatter: '{value}%'
          },
          splitLine: {
            lineStyle: {
              // type: 'dashed',
              type: 'solid',
              // color: 'rgba(234,234,234,0.5)'
              color: echartsColor.splitLine
              
            }
          }
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#808492',
            formatter: label => {
              return label.slice(-2)
            }
          },
          data: []
        },
        series: [
          {
            type: 'line',
            name: '锁定累计采购毛利率',
            showSymbol: true,
            smooth: true,
            data: [],
            itemStyle: {
              // color: '#2680eb'
              color: '#5C8FF9'
            },
            areaStyle: {
              opacity:1,
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                // {
                //   offset: 0,
                //   color: '#2680eb80'
                // },
                // {
                //   offset: 1,
                //   color: '#2680eb00'
                // }
                {
                  offset: 0,
                  // color: 'rgba(92,143,249,0.2)'
                  color: echartsColor.NewPeriod1
                },
                {
                  offset: 1,
                  // color: 'rgba(92,143,249,0.2)'
                  color: echartsColor.NewPeriod2
                }

              ])
            },
            symbol:'none'
          }
        ]
      },
      options2: {
        isEmpty: false,
        emptyText: '空数据集',
        grid: {
          top: 60,
          left: 0,
          right: 0,
          bottom: 10,
          containLabel: true
        },
        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
          top: 10,
          right: 0,
          selectedMode: false
        },
        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter: (params) => {
            const lines = params.map(_ => {
              return `<br>${_.seriesName}: ${_.data.realValue}%`
            })
            return `日期：${params[0]['axisValue']}${lines}`
          }
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#808492',
            formatter: label => {
              return label.slice(-2)
            }
          },
          data: []
        },
        yAxis: {
          max: 50,
          min: 0,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#bfc2cf',
            formatter: '{value}%'
          },
          splitLine: {
            lineStyle: {
              // type: 'dashed',
              type: 'solid',
              color: echartsColor.splitLine
            }
          }




        },
        series: [
          {
            type: 'line',
            name: '采购经销',
            showSymbol: true,
            smooth: true,
            itemStyle: {
              // color: '#8950fc'
              color: echartsColor.Stress1_1
            },
            data: [],
            symbol:'none'
          },
          {
            type: 'line',
            name: '平台',
            showSymbol: true,
            smooth: true,
            itemStyle: {
              // color: '#2680eb'
              color: echartsColor.Stress2_1
            },
            data: [],
            symbol:'none'
          },
          {
            type: 'line',
            name: '直营',
            showSymbol: true,
            smooth: true,
            itemStyle: {
              // color: '#ff7f0e'
              color: echartsColor.Stress3_1
            },
            data: [],
            symbol:'none'
          },
        ]
      },
      groupView: {
        DTD_GPR_RATE: '0.00%', // 当日采购毛利率
        MTD_GPR_RATE: '0.00%', // 累计采购毛利率
        DTD_AMT: '0', // 当日采购毛利额
        MTD_AMT: '0', // 累计采购毛利额
        GPR_DIF: '0.00%', // 毛利率差值
        GPA_DIF: '0', // 毛利额差值
        GPR_TAR: '--',
        GPA_TAR: '--'
      },
      channelView: [
        {
          MTD_GPR_RATE: '0.00%',
          TAR: '',
        }, // 平台
        {
          MTD_GPR_RATE: '0.00%',
          TAR: ''
        }, // 直营
        {
          MTD_GPR_RATE: '0.00%',
          TAR: ''
        }, // 采购经销
      ],
      channelDesc: [],
      JumpStr:'',
    }
  },
  watch: {
    'query.tax': {
      handler () {
        this.getData1()
      }
    }
  },
  async created(){
    this.jumpTarget();
  },
  mounted () {
    this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
  },
  methods: {
    async jumpTarget() {
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2021_00103':'BI_PC_2021_00098'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },
    deepmerge,
    transPercent (num) {
      return (typeof num === 'number' && num !== 0) ? (num * 100).toFixed(2) + '%' : '--'
    },
    // 集团视角 汇总
    getData1 () {
      this.$axios.post('/api/admin/data/KPI_REPORT/FIN_GPR_JT_TOP/get').then(res => {
        const data = res.data[0]
        if (data) {
          this.groupView.DTD_GPR_RATE = `${(data.DTD_GPR_RATE * 100).toFixed(2)}%`
          this.groupView.MTD_GPR_RATE = `${(data.MTD_GPR_RATE * 100).toFixed(2)}%`
          const map = {
            '1': ['DTD_AMT', 'MTD_AMT', 'GPA_TAR_LCK', 'GPA_DIF'],
            '2': ['DTD_AMT_TAX', 'MTD_AMT_TAX', 'GPA_TAX_TAR_LCK', 'GPA_TAX_DIF']
          }
          let DTD_AMT = Number((data[map[this.query.tax][0]] / 10000).toFixed(0))
          let MTD_AMT = Number((data[map[this.query.tax][1]] / 10000).toFixed(0))
          this.groupView.DTD_AMT = `${DTD_AMT.toLocaleString()}万`
          this.groupView.MTD_AMT = `${MTD_AMT.toLocaleString()}万`
          this.groupView.GPR_TAR = (data['GPR_TAR_LCK'] * 100).toFixed(2) + '%'
          this.groupView.GPR_DIF = `${(data.GPR_DIF * 100).toFixed(2)}%`
          let GPA_TAR = Number((data[map[this.query.tax][2]] / 10000).toFixed(0))
          this.groupView.GPA_TAR = GPA_TAR === 0 ? '--' : `${GPA_TAR.toLocaleString()}万`
          let GPA_DIF = Number((data[map[this.query.tax][3]] / 10000).toFixed(0))
          this.groupView.GPA_DIF = `${GPA_DIF.toLocaleString()}万`
        }
      })
    },

    // 集团锁定毛利率趋势
    getData2 () {
      this.$axios.post('/api/admin/data/KPI_REPORT/FIN_GPR_JT_BTM/get').then(res => {
        const data = res.data.sort((a, b) => {
          return moment(a['TDATE']) - moment(b['TDATE'])
        })

        if (data.length === 0) {
          this.options1.isEmpty = true
          this.options1.emptyText = '空数据集'
        } else {
          this.options1.isEmpty = false
        }

        this.options1.xAxis.data = data.map(_ => _['YMD'])
        setTimeout(() => {
          this.$refs['chart1']?.$refs['echarts']?.clear()
          this.options1.series[0].data = data.map(_ => {
            return {
              value: ((Math.min(0.5, _.MTD_GPR_RATE)) * 100).toFixed(2),
              realValue: (_.MTD_GPR_RATE * 100).toFixed(2)
            }
          })
        }, 50)
      })
    },

    // 渠道视角 汇总
    getData3 () {
      this.$axios.post('/api/admin/data/KPI_REPORT/FIN_GPR_CHNL_TOP/get').then(({ data }) => {
        const channelOrder = ['平台', '直营', '采购经销']
        const orderedData = data.sort((a, b) => {
          return channelOrder.indexOf(a['CHANNEL']) - channelOrder.indexOf(b['CHANNEL'])
        })
        const ret = orderedData.map((item) => {
          return {
            rate: item['MTD_GPR_RATE'],
            target: item['CHNL_GPR_TAR_LCK'],
            diff: item['GPR_DIF']
          }
        })
        this.channelDesc = ret
      })
    },

    // 渠道视角 趋势
    getData4 () {
      this.$axios.post('/api/admin/data/KPI_REPORT/FIN_GPR_CHNL_BTM/get').then(({ data }) => {
        let a = [], b = [], c = []
        const _data = data
        if (_data.length === 0) {
          this.options2.isEmpty = true
          this.options2.emptyText = '空数据集'
        } else {
          this.options2.isEmpty = false
        }

        for (let item of _data) {
          const name = item.CHANNEL
          if (name === '平台') {
            a.push(item)
          } else if (name === '直营') {
            b.push(item)
          } else if (name === '采购经销') {
            c.push(item)
          }
        }
        a = a.sort((i, j) => moment(i['TDATE']) - moment(j['TDATE']))
        b = b.sort((i, j) => moment(i['TDATE']) - moment(j['TDATE']))
        c = c.sort((i, j) => moment(i['TDATE']) - moment(j['TDATE']))
        this.$refs['chart2']?.$refs['echarts']?.clear()
        setTimeout(() => {
          this.options2.xAxis.data = a.map(_ => _['YMD'])
          this.options2.series[0].data = c.map(_ => ({
            realValue: (_.MTD_GPR_RATE * 100).toFixed(2),
            value: ((Math.min(0.5, _.MTD_GPR_RATE)) * 100).toFixed(2)
          }))
          this.options2.series[1].data = a.map(_ => ({
            realValue: (_.MTD_GPR_RATE * 100).toFixed(2),
            value: ((Math.min(0.5, _.MTD_GPR_RATE)) * 100).toFixed(2)
          }))
          this.options2.series[2].data = b.map(_ => ({
            realValue: (_.MTD_GPR_RATE * 100).toFixed(2),
            value: ((Math.min(0.5, _.MTD_GPR_RATE)) * 100).toFixed(2)
          }))
        }, 50)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Header{
  margin-top: 10px;
  height: 30px;
  padding-bottom: 5px;
  border-bottom: 0px solid #f0f0f0;
}
.text-xs-radio /deep/ .ant-radio-wrapper {
  font-size: 12px;
}

.h245 {
  height: calc(1px * var(--height) - 215px - 30px)
}
</style>
