<template>
  <div class="px15">
    <!-- <div class="flex flex-start" style="padding-top: 10px;padding-bottom: 5px;">  style="padding: 10px 0px;"-->
    <div class="flex flex-start" style="padding: 10px 0px;">
      <!-- <span class="chart-sub-title" style="line-height: 41px;">项目组销售</span> -->
      <Title :label="'项目组销售'" />
    </div>

    <div class="flex-between" style="height: 30px;padding-bottom: 10px;"
      :style="{'justify-content':(viewType ==='2')?'flex-end':'space-between'}"
    >
      <div class="flex-start" style="height: 30px;padding-right: 20px;">
        <DropdownSelect label="项目组分类" style="margin-right: 50px">
          <div slot="selectedText" class="px10 text-ellipsis" style="width: 80px">{{ query2.teamType.join(';') }}</div>
          <a-checkbox-group v-model="query2.teamType">
            <div>
              <a-checkbox value="成品项目组">成品项目组</a-checkbox>
            </div>
            <div>
              <a-checkbox value="其它项目组">其它项目组</a-checkbox>
            </div>
          </a-checkbox-group>
        </DropdownSelect>

        <DropdownSelect v-if="viewType === '2'" label="项目组" style="margin-right: 50px">
          <div slot="selectedText" class="px10 text-ellipsis" style="width: 80px">{{ query2.team.join(';') }}</div>
          <a-checkbox-group v-model="query2.team">
            <div v-for="item in teamOptions" :key="item">
              <a-checkbox :value="item">{{ item }}</a-checkbox>
            </div>
          </a-checkbox-group>
        </DropdownSelect>
        <DropdownSelect v-if="viewType === '2'" label="统计年份">
          <div slot="selectedText">{{ query2.year }}</div>
          <a-radio-group v-model="query2.year">
            <div v-for="y in yearOptions" :key="y">
              <a-radio :value="y">{{ y }}</a-radio>
            </div>
          </a-radio-group>
        </DropdownSelect>
      </div>
      <div>
        <a-radio-group v-model="viewType">
          <a-radio value="1">当月</a-radio>
          <a-radio value="2">月度</a-radio>
        </a-radio-group>
      </div>
    </div>

    <div class="flex-between" style="align-items: flex-start" v-if="viewType === '1'">
      <div style="width: calc(40% - 10px)">
        <div class="ch1">
          <v-chart autoresize :options="options1"/>
        </div>
        <div>
          <div class="flex-start" style="height: 30px">
            <DropdownSelect label="线上线下">
              <div slot="selectedText" class="px10 text-ellipsis" style="width: 80px">
                {{ query2.channelType1.join(';') }}
              </div>
              <a-checkbox-group v-model="query2.channelType1">
                <div>
                  <a-checkbox value="线上渠道">线上渠道</a-checkbox>
                </div>
                <div>
                  <a-checkbox value="线下渠道">线下渠道</a-checkbox>
                </div>
                <div>
                  <a-checkbox value="海外渠道">海外渠道</a-checkbox>
                </div>
                <div>
                  <a-checkbox value="其它">其它</a-checkbox>
                </div>
              </a-checkbox-group>
            </DropdownSelect>
          </div>

          <div class="ch2">
            <v-chart autoresize :options="options2"></v-chart>
          </div>
        </div>
      </div>
      <div style="width: calc(60% - 10px)">
        <SortTable :sorter.sync="table.sorter" v-bind="table" @sortCol="handleSort"/>
        <!-- 这里需要修改的 -->
      </div>
    </div>

    <div v-if="viewType === '2'">
      <div class="ch10">
        <v-chart ref="chart10" autoresize :options="options10"/>
      </div>

      <div class="mt10">
        <div class="flex-start" style="height: 30px">
          <a-radio-group v-model="query2.channelType" button-style="solid" size="small">
            <a-radio-button value="2">线上</a-radio-button>
            <a-radio-button value="1">线下</a-radio-button>
            <a-radio-button value="3">海外</a-radio-button>
          </a-radio-group>
        </div>
      </div>

      <div class="mt10">
        <table class="dashboard-common-table">
          <tr>
            <td>指标</td>
            <td>年份</td>
            <td>年累计</td>
            <td v-for="m in months" :key="m">{{ m }}月</td>
          </tr>

          <tr>
            <td rowspan="3" @mouseenter="mouseenter(0, 0,'销售额')"  
              :style="{background:curType ==='销售额' ? hoverColor : null,}">销售额</td>
            <td @mouseenter="mouseenter(0, 1,'销售额')" 
              :style="{background:(curCol === 0) || (curRow === 1) ? hoverColor : null,}">同比</td>
            <td @mouseenter="mouseenter(0, 2,'销售额')" 
              :style="{background:(curCol === 0) || (curRow === 2) ? hoverColor : null,}"
              :class="{
              'text-red': calcYearDataYoy(query2.year) && calcYearDataYoy(query2.year) > 0,
              'text-green': calcYearDataYoy(query2.year) && calcYearDataYoy(query2.year) < 0
            }">
              {{ calcYearDataYoy(query2.year) ? numeral(calcYearDataYoy(query2.year)).format('0.00%') : '--' }}
            </td>
            <td v-for="m in months" :key="m"
                @mouseenter="mouseenter(0, (m+'月'),'销售额')"
                :style="{background:(curCol === 0) || (curRow === (m+'月')) ? hoverColor : null,}"
                :class="{
                'text-red':calcYoy(query2.year, m - 1) && calcYoy(query2.year, m - 1) > 0,
                'text-green': calcYoy(query2.year, m - 1) && calcYoy(query2.year, m - 1) < 0
            }">
              {{ calcYoy(query2.year, m - 1) ? numeral(calcYoy(query2.year, m - 1)).format('0.00%') : '--'}}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(1, 1,'销售额')" 
              :style="{background:(curCol === 1) || (curRow === 1) ? hoverColor : null,}">{{ query2.year }}</td>
            <td @mouseenter="mouseenter(1, 2,'销售额')" 
              :style="{background:(curCol === 1) || (curRow === 2) ? hoverColor : null,}">{{ numeral(calcYearChannelData(query2.year) / 10000).format('0,0') }}万</td>
            <td v-for="m in months" :key="m"
              @mouseenter="mouseenter(1, (m+'月'),'销售额')"
              :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
            >
              {{ calcChannelData(query2.year, m - 1) }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(2, 1,'销售额')" 
              :style="{background:(curCol === 2) || (curRow === 1) ? hoverColor : null,}">{{ query2.year - 1 }}</td>
            <td @mouseenter="mouseenter(2, 2,'销售额')" 
              :style="{background:(curCol === 2) || (curRow === 2) ? hoverColor : null,}">{{ numeral(calcYearChannelData(query2.year - 1) / 10000).format('0,0') }}万</td>
            <td v-for="m in months" :key="m"
              @mouseenter="mouseenter(2, (m+'月'),'销售额')"
              :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
            >
              {{ calcChannelData(query2.year - 1, m - 1) }}
            </td>
          </tr>

          <tr>
            <td rowspan="3" @mouseenter="mouseenter(3, 0,'渠道')"
              :style="{background:curType ==='渠道' ? hoverColor : null,}">
              {{ ({1: '线下', 2: '线上', 3: '海外'})[query2.channelType] }}渠道</td>
            <td @mouseenter="mouseenter(3, 1,'渠道')"
              :style="{background:(curCol === 3) || (curRow === 1) ? hoverColor : null,}">同比</td>
            <td @mouseenter="mouseenter(3, 2,'渠道')" 
              :style="{background:(curCol === 3) || (curRow === 2) ? hoverColor : null,}"
              :class="{
                'text-red': calcYearDataYoy(query2.year, query2.channelType) && calcYearDataYoy(query2.year, query2.channelType) > 0,
                'text-green': calcYearDataYoy(query2.year, query2.channelType) && calcYearDataYoy(query2.year, query2.channelType) < 0
              }">
              {{
                calcYearDataYoy(query2.year, query2.channelType) ? numeral(calcYearDataYoy(query2.year, query2.channelType)).format('0.00%') : '--'
              }}
            </td>
            <td @mouseenter="mouseenter(3, (m+'月'),'渠道')" 
              :style="{background:(curCol === 3) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m" :class="{
               'text-red':calcYoy(query2.year, m - 1, query2.channelType) && calcYoy(query2.year, m - 1, query2.channelType) > 0,
                'text-green': calcYoy(query2.year, m - 1, query2.channelType) && calcYoy(query2.year, m - 1, query2.channelType) < 0
            }">
              {{
                calcYoy(query2.year, m - 1, query2.channelType) ? numeral(calcYoy(query2.year, m - 1, query2.channelType)).format('0.00%') : '--'
              }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(4, 1,'渠道')"
              :style="{background:(curCol === 4) || (curRow === 1) ? hoverColor : null,}"
            >{{ query2.year }}</td>

            <td @mouseenter="mouseenter(4, 2,'渠道')"
              :style="{background:(curCol === 4) || (curRow === 2) ? hoverColor : null,}"
            >
              {{ numeral(calcYearChannelData(query2.year, query2.channelType) / 10000).format('0,0') }}万</td>

            <td @mouseenter="mouseenter(4, (m+'月'),'渠道')" 
              :style="{background:(curCol === 4) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ calcChannelData(query2.year, m - 1, query2.channelType) }}
            </td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(5, 1,'渠道')"
              :style="{background:(curCol === 5) || (curRow === 1) ? hoverColor : null,}"
            >{{ query2.year - 1 }}</td>
            <td @mouseenter="mouseenter(5, 2,'渠道')"
              :style="{background:(curCol === 5) || (curRow === 2) ? hoverColor : null,}"
            >
              {{ numeral(calcYearChannelData(query2.year - 1, query2.channelType) / 10000).format('0,0') }}万</td>
            <td @mouseenter="mouseenter(5, (m+'月'),'渠道')" 
              :style="{background:(curCol === 5) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ calcChannelData(query2.year - 1, m - 1, query2.channelType) }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from 'numeral'
import orderBy from 'lodash/orderBy'
import intersection from 'lodash/intersection'
import DropdownSelect from '@/views/BIView/components/DropdownSelect/DropdownSelect'
import SortTable from '@/views/BIView/PsDashboard/components/SortTable/SortTableTcq'
import moment from 'moment'
import graphic from 'echarts/lib/util/graphic'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'

export default {
  name: 'TeamSale',
  components: {SortTable, DropdownSelect,Title},
  data() {
    const thisYear = (new Date()).getFullYear()
    const months = Array(12).fill(null).map((_, i) => i + 1)
    return {
      months,
      viewType: '1',
      yearOptions: [thisYear, thisYear - 1],
      teamOptions: [],
      yearMonthValues: {},
      query2: {
        teamType: ['成品项目组'],
        channelType1: [],
        team: [],
        year: thisYear,
        channelType: '2',
      },
      options1: {
        color: ['#2680eb', '#20adf5', '#fdd969', '#fe9c2f'],
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
            const lines = params.map(item => {
              return `<br>${item.marker}${item.seriesName}: ${numeral(item.value).format('0,0')}`
            }).join('')
            return `${params[0].axisValue}${lines}`
          }
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
          data: [],
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: '#999',
            fontSize: 10
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
          },
          axisLabel: {
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            stack: '总量',
            barWidth: 20,
            name: '线上渠道',
            data: []
          },
          {
            type: 'bar',
            stack: '总量',
            barWidth: 20,
            name: '线下渠道',
            data: []
          },
          {
            type: 'bar',
            stack: '总量',
            barWidth: 20,
            name: '海外渠道',
            data: []
          },
          {
            type: 'bar',
            stack: '总量',
            barWidth: 20,
            name: '其它',
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
            },
            data: []
          },
        ]
      },
      options2: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(0, 0, 0, .05)'
            },
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter(params) {
            const lines = params.map(item => {
              return `<br>${item.marker}${item.seriesName}: ${numeral(item.value).format('0,0')}`
            }).join('')
            return `${params[0].axisValue}${lines}`
          }
        },
        legend: {
          icon: 'rect',
          itemWidth: 12,
          itemHeight: 12,
          top: 20,
          selectedMode: false
        },
        grid: {
          top: 60,
          right: 10,
          bottom: 10,
          left: 10,
          containLabel: true
        },
        xAxis: {
          boundaryGap: [0, 12],
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            rotate: 30,
            fontSize: 10,
            color: '#999'
          },
          data: [],
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            color: '#999',
          },
          splitLine: {
            show: false,
            lineStyle: {
              // type: 'dashed',
              // color: '#ececee'
              type: 'solid',
              color: echartsColor.splitLine,
            }
          }
        },
        series: [
          {
            type: 'bar',
            name: '当期',
            data: [],
            barWidth: 13,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#2680eb'
              color: echartsColor.thisYear,
            },
            label: {
              show: false
            }
          },
          {
            type: 'bar',
            name: '同期',
            data: [],
            barWidth: 13,
            barGap: 0,
            itemStyle: {
              barBorderRadius: [7, 7, 0, 0],
              // color: '#cce0e9'
              color: echartsColor.previousYear,
            },
            label: {
              show: false
            }
          }
        ]
      },
      options10: {
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
              return `<br>${_.marker}${_.seriesName}: ${numeral(_.value).format('0,0')}`
            }).join('')
            return `${params[0].axisValue}${lines}`
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
            color: '#999'
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
              // color: ['#ececee']
              type: 'solid',
              color: echartsColor.splitLine,
            }
          },
          axisLabel: {
            show: false
          }
        },
        series: [
          {
            type: 'line',
            z: 10,
            name: thisYear,
            smooth: true,
            itemStyle: {
              // color: '#2680eb'
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
          {
            type: 'line',
            name: thisYear - 1,
            smooth: true,
            itemStyle: {
              // color: '#cce0e9'
              color: echartsColor.previousYear,
            },
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
            data: [],
            symbol: 'none',
          },
        ]
      },

      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,
      table: {
        sorter: {type: '', col: ''},
        totalRow: {
          data: {
            ACT_PRICE: '',
            ACT_PRICE_RTO_YOY: '',
            ACT_PRICE_RTO: '',
            ACT_PRICE_YOY: '',
            OFL_ACT_PRICE_RTO: '',
            OFL_ACT_PRICE_RTO_YOY: '',
            ONL_ACT_PRICE_RTO: '',
            ONL_ACT_PRICE_RTO_YOY: '',
            OVS_ACT_PRICE_RTO: '',
            OVS_ACT_PRICE_RTO_YOY: '',
          },
          render(h, row) {
            return <tr style="font-weight: bold; height: calc((var(--height) - 80) * 1px / 11); text-align: center">
              <td align="left">合计</td>
              <td>{numeral(row.ACT_PRICE / 10000).format('0,0')}万</td>
              <td>/</td>
              <td>{numeral(row.ACT_PRICE_RTO / 100).format('0.00%')}</td>
              <td>{numeral(row.ONL_ACT_PRICE_RTO / 100).format('0.00%')}</td>
              <td class={{
                'text-red': row.ONL_ACT_PRICE_RTO_YOY > 0,
                'text-green': row.ONL_ACT_PRICE_RTO_YOY < 0
              }}>{numeral(row.ONL_ACT_PRICE_RTO_YOY / 100).format('0.00%')}
              </td>
              <td>{numeral(row.OFL_ACT_PRICE_RTO / 100).format('0.00%')}</td>
              <td class={{
                'text-red': row.OFL_ACT_PRICE_RTO_YOY > 0,
                'text-green': row.OFL_ACT_PRICE_RTO_YOY < 0
              }}>{numeral(row.OFL_ACT_PRICE_RTO_YOY / 100).format('0.00%')}
              </td>
              <td>{numeral(row.OVS_ACT_PRICE_RTO / 100).format('0.00%')}</td>
              <td class={{
                'text-red': row.OVS_ACT_PRICE_RTO_YOY > 0,
                'text-green': row.OVS_ACT_PRICE_RTO_YOY < 0
              }}>{numeral(row.OVS_ACT_PRICE_RTO_YOY / 100).format('0.00%')}
              </td>
            </tr>
          }
        },
        bodyStyle: {height: 'calc((var(--height) - 80) * 1px / 11 * 10 - 16px)'},
        trHeight: 'calc((var(--height) - 80) * 1px / 11)',
        dataSource: [],
        columns: [
          {dataIndex: 'TEAM_SUPPLY', title: '项目组', align: 'left'},
          {
            dataIndex: 'ACT_PRICE', title: '销额', render(h, {row, cellProp}) {
              return <span>{numeral(row[cellProp] / 10000).format('0,0') + '万'}</span>
            }, sortable: true
          },
          {
            dataIndex: 'ACT_PRICE_RTO_YOY', title: '销额占比同比', render(h, {row, cellProp}) {
              return <span
                  class={{'text-red': row[cellProp] > 0, 'text-green': row[cellProp] < 0}}>
                {numeral(row[cellProp] / 100).format('0.00%')}
              </span>
            }, sortable: true
          },
          {
            dataIndex: 'ACT_PRICE_RTO', title: '销额占比', render(h, {row, cellProp}) {
              return <span>{numeral(row[cellProp] / 100).format('0.00%')}</span>
            }, sortable: true
          },
          {
            dataIndex: 'ONL_ACT_PRICE_RTO', title: '线上占比', render(h, {row, cellProp}) {
              return <span>{numeral(row[cellProp] / 100).format('0.00%')}</span>
            }, sortable: true
          },
          {
            dataIndex: 'ONL_ACT_PRICE_RTO_YOY', title: '线上占比同比', render(h, {row, cellProp}) {
              return <span
                  class={{'text-red': row[cellProp] > 0, 'text-green': row[cellProp] < 0}}>
                {numeral(row[cellProp] / 100).format('0.00%')}
              </span>
            }, sortable: true
          },
          {
            dataIndex: 'OFL_ACT_PRICE_RTO', title: '线下占比', render(h, {row, cellProp}) {
              return <span>{numeral(row[cellProp] / 100).format('0.00%')}</span>
            }, sortable: true
          },
          {
            dataIndex: 'OFL_ACT_PRICE_RTO_YOY', title: '线下占比同比', render(h, {row, cellProp}) {
              return <span
                  class={{'text-red': row[cellProp] > 0, 'text-green': row[cellProp] < 0}}>
                {numeral(row[cellProp] / 100).format('0.00%')}
              </span>
            }, sortable: true
          },
          {
            dataIndex: 'OVS_ACT_PRICE_RTO', title: '海外占比', render(h, {row, cellProp}) {
              return <span>
                {numeral(row[cellProp] / 100).format('0.00%')}
              </span>
            }, sortable: true
          },
          {
            dataIndex: 'OVS_ACT_PRICE_RTO_YOY', title: '海外占比同比', render(h, {row, cellProp}) {
              return <span
                  class={{'text-red': row[cellProp] > 0, 'text-green': row[cellProp] < 0}}>
                {numeral(row[cellProp] / 100).format('0.00%')}
              </span>
            }, sortable: true
          },
        ]
      }
    }
  },
  watch: {
    'query2.teamType'() {
      this.getData1()
      this.getData2()
      this.getData3()
    },
    'query2.channelType1'() {
      this.parseData3(this.pricedata)
    },
    viewType(val) {
      if (val === '2' && !this.toggleFlag) {
        this.getData4()
        this.toggleFlag = true
      }
    },
    teamOptions: {
      handler(val) {
        this.query2.team = intersection(val, this.query2.team)
      }
    },
    'query2.team': {
      handler() {
        if (this.viewType === '2') {
          this.toggleFlag2 = false
          this.getData4()
        }
      }
    },
    'query2.year': {
      handler() {
        if (this.viewType === '2') {
          this.toggleFlag2 = false
          this.getData4()
        }
      }
    }
  },
  mounted() {
    this.getData1()
    this.getData2()
    this.getData3()
  },
  methods: {
    numeral,
    calcChannelData(year, month, type) {
      const props = {1: 'OFL_ACT_PRICE', 2: 'ONL_ACT_PRICE', 3: 'OVS_ACT_PRICE'}
      return this.yearMonthValues?.[year]?.[month]?.[props[type] || 'TOT_ACT_PRICE'] ?
          numeral(this.yearMonthValues?.[year]?.[month]?.[props[type] || 'TOT_ACT_PRICE'] / 10000).format('0,0') + '万'
          : '--'
    },
    calcYoy(year, month, type) {
      const props = {1: 'OFL_ACT_PRICE', 2: 'ONL_ACT_PRICE', 3: 'OVS_ACT_PRICE'}
      const newVal = this.yearMonthValues?.[year]?.[month]?.[props[type] || 'TOT_ACT_PRICE']
      const oldVal = this.yearMonthValues?.[year - 1]?.[month]?.[props[type] || 'TOT_ACT_PRICE']
      if (newVal && oldVal) {
        return (newVal / oldVal) - 1
      }
      return null
    },
    calcYearChannelData(year, type) {
      const props = {1: 'OFL_ACT_PRICE', 2: 'ONL_ACT_PRICE', 3: 'OVS_ACT_PRICE'}
      const yearData = this.yearMonthValues[year] || []

      return yearData.reduce((acc, cur) => {
        return acc + (cur[props[type] || 'TOT_ACT_PRICE'] || 0)
      }, 0)
    },
    calcYearDataYoy(year, type) {
      const newVal = this.calcYearChannelData(year, type)
      const oldVal = this.calcYearChannelData(year - 1, type)
      if (newVal && oldVal) {
        return (newVal / oldVal) - 1
      }
      return null
    },
    getData1() {
      this.$fetchSql('pds_cockpit', 'spl_sal_tm_amt_rto', {
        TEAM_SUPPLY_TYPE: this.query2.teamType.join(',')
      }).then(({data}) => {
        this.table.dataSource = orderBy(data, ['ACT_PRICE'], ['desc'])
        this.teamOptions = data.map(_ => _['TEAM_SUPPLY'])
      })
    },
    getData2() {
      this.$fetchSql('pds_cockpit', 'spl_sal_tm_amt_rto_tot', {
        TEAM_SUPPLY_TYPE: this.query2.teamType.join(',')
      }).then(({data}) => {
        this.table.totalRow.data = data[0] || {}
      })
    },
    getData3() {
      this.$fetchSql('pds_cockpit', 'spl_sal_tm_amt_cmp', {
        TEAM_SUPPLY_TYPE: this.query2.teamType.join(',')
      }).then(({data}) => {
        const t_data = data.map((item) => {
          return {
            ...item,
            tot: item['ONL_ACT_PRICE'] + item['OFL_ACT_PRICE'] + item['OVS_ACT_PRICE'] + item['OTH_ACT_PRICE']
          }
        })
        const ordered = orderBy(t_data, 'tot', ['desc'])
        this.options1.xAxis.data = ordered.map(_ => _['TEAM_SUPPLY'])
        this.options1.series[0].data = ordered.map(_ => _['ONL_ACT_PRICE'])
        this.options1.series[1].data = ordered.map(_ => _['OFL_ACT_PRICE'])
        this.options1.series[2].data = ordered.map(_ => _['OVS_ACT_PRICE'])
        this.options1.series[3].data = ordered.map(_ => _['OTH_ACT_PRICE'])
        this.pricedata = data
        this.parseData3(this.pricedata)
      })
    },
    parseData3(data) {
      const _channelMap = {'线上渠道': 'ONL', '线下渠道': 'OFL', '海外渠道': 'OVS', '其它': 'OTH'}
      const teams = data.map(_ => _['TEAM_SUPPLY'])
      let props
      if (!this.query2.channelType1.length) {
        props = ['OFL', 'ONL', 'OVS', 'OTH']
      } else {
        props = this.query2.channelType1.map(_ => _channelMap[_])
      }

      const act_price = data.map(_ => {
        return props.reduce((acc, cur) => {
          return acc + _[`${cur}_ACT_PRICE`]
        }, 0)
      })
      const act_price_yoy = data.map(_ => {
        return props.reduce((acc, cur) => {
          return acc + _[`${cur}_ACT_PRICE_YOY`]
        }, 0)
      })

      const items = teams.map((name, index) => {
        return {
          team: name,
          price: act_price[index],
          price_yoy: act_price_yoy[index]
        }
      })
      console.log(items)

      const ordered = orderBy(items, 'price', ['desc'])

      this.options2.xAxis.data = ordered.map(_ => _['team'])
      this.options2.series[0].data = ordered.map(_ => _['price'])
      this.options2.series[1].data = ordered.map(_ => _['price_yoy'])
    },
    getData4() {
      this.$fetchSql('pds_cockpit', 'spl_sal_mly_amt', {
        YDATE: [this.query2.year, this.query2.year - 1].toString(),
        TEAM_SUPPLY_TYPE: this.query2.teamType.join(','),
        TEAM_SUPPLY: this.query2.team.join(',')
      }).then(({data}) => {
        const ret = {
          [this.query2.year]: Array(12).fill({}),
          [this.query2.year - 1]: Array(12).fill({})
        }
        for (let item of data) {
          const year = moment(item.MDATE).year()
          const month = moment(item.MDATE).month()
          ret[year][month] = item
        }
        this.yearMonthValues = ret
        if (!this.toggleFlag2) {
          this.$refs['chart10'] && this.$refs['chart10'].clear()
          this.toggleFlag2 = true
        }
        this.options10.series[0].name = this.query2.year
        this.options10.series[1].name = this.query2.year - 1
        this.options10.series[0].data = ret[this.query2.year].map(_ => _['TOT_ACT_PRICE'])
        this.options10.series[1].data = ret[this.query2.year - 1].map(_ => _['TOT_ACT_PRICE'])
      })
    },
    parseData4() {

    },
    handleSort(sorter) {
      if (sorter.col && sorter.type) {
        this.table.dataSource = orderBy(this.table.dataSource, [sorter.col], [sorter.type])
      } else {
        this.table.dataSource = orderBy(this.table.dataSource, ['ACT_PRICE'], ['desc'])
      }
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
.dashboard-common-table {
  /deep/ td {
    height: calc((var(--height) - 100) * .5px / 7);
  }

}

.ch1 {
  height: calc((var(--height) - 50) * .45px - 8px);
}

.ch2 {
  height: calc((var(--height) - 50) * .55px - 50px - 8px);
}

.ch10 {
  height: calc((var(--height) - 130) * .4px + 35px - 16px);
}
</style>
