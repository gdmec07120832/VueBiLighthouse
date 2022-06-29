<template>
  <div class="px15">
    <!-- style="height: 30px" -->
    <div class="flex-between" style="padding: 10px 0px;">
      <div style="display: flex;">
        <!-- <div class="chart-sub-title">欠货概况</div> -->
        <Title class="chart-sub-title" :label="'欠货概况'" />
        <Jump @click.native="jumpTarget" />
      </div>


      <div style="display: flex;">
        <div class="TitleOn" style="color: #bbbbbb;padding-right: 15px;">时间周期</div>
        <a-radio-group v-model="viewType">
          <a-radio value="1">当月</a-radio>
          <a-radio value="2">月度</a-radio>
        </a-radio-group>
      </div>
    </div>

    

    <div class="flex-between" style="align-items: flex-start" v-if="viewType === '1'">
      <div style="width: calc(50% - 10px)">

        <div class="TitleOnAll" style="display: flex;justify-content: space-between;">
          <div class="TitleLeft" style="color: rgba(0, 0, 0, 0.65);">
            欠货概况
          </div>
          <div class="TitleOnScel" style="display: flex;justify-content: flex-end;">
            <!-- style="height: 30px;justify-content: flex-end;" class="flex-start" -->
            <DropdownSelect label="欠货类型" style="padding-right: 20px;">
              <div slot="selectedText" style="min-width: 130px;">{{ 
                (query1.valueType==='3')? '订单金额（销）':
                (query1.valueType==='2')?'商品欠货（采）':'商品欠货（销）'
              }}</div>
              <a-radio-group v-model="query1.valueType"  >
                <div>
                  <a-radio value="3" style="width: 15%">订单金额（销）</a-radio>
                </div>
                <div>
                  <a-radio value="2" style="width: 15%">商品欠货（采）</a-radio>
                </div>
                <div>
                  <a-radio value="1" style="width: 15%">商品欠货（销）</a-radio>
                </div>
                
                <!-- <div style="width: 15%"></div> -->
                <!-- <a-radio value="4" class="IsKong" style="width: 15%"></a-radio> -->
              </a-radio-group>              
            </DropdownSelect>
            <!-- style="height: 30px;justify-content: flex-end;" class="flex-start"-->
            <DropdownSelect label="时间周期" style="margin-top: 0px;">
              <div slot="selectedText" style="min-width: 130px;">{{ 
                (query1.timeType==='1')? '近一个月':
                (query1.timeType==='2')?'近三个月':
                (query1.timeType==='3')?'近一年':'近两年'
              }}</div>
              <a-radio-group v-model="query1.timeType"  >
                <div>
                  <a-radio value="1" style="width: 15%">近一个月</a-radio> 
                </div>
                <div>
                  <a-radio value="2" style="width: 15%">近三个月</a-radio>
                </div>
                <div>
                  <a-radio value="3" style="width: 15%">近一年</a-radio>
                </div>
                <div>
                  <a-radio value="4" style="width: 15%">近两年</a-radio>
                </div>
              </a-radio-group>            
            </DropdownSelect>
          </div>          
        </div>

        <div class="ch1">
          <v-chart ref="chart1" autoresize :options="options1"/>
        </div>

        <div class="mt20">
          <SortTable v-bind="table2"/>
        </div>
      </div>
      <div style="width: calc(50% - 10px)">
        <div class="text-black">项目组欠货商品金额（采）</div>
        <div style="padding-top: 20px;">
          <SortTable :sorter.sync="table.sorter" v-bind="table" @sortCol="handleSort"/>
        </div>
      </div>
    </div>

    <div v-if="viewType === '2'">
      <div class="flex-between" style="height: 30px;justify-content: flex-end;">
        <div style="margin-top: -4px;margin-right: 20px;">
          <!-- <a-radio-group v-model="query2.valueType">
            <a-radio value="1">日均商品欠货（采）</a-radio>
            <a-radio value="2">日均商品欠货（销）</a-radio>
            <a-radio value="3">日均订单金额（销）</a-radio>
          </a-radio-group> -->

          <DropdownSelect label="欠货类型">
            <div slot="selectedText" style="min-width: 130px;">{{ 
              (query2.valueType==='1')? '日均商品欠货（采）':
              (query2.valueType==='2')?'日均商品欠货（销）':'日均订单金额（销）'
            }}</div>
            <a-radio-group v-model="query2.valueType">
              <div>
                <a-radio value="1">日均商品欠货（采）</a-radio>
              </div>
              <div>
                <a-radio value="2">日均商品欠货（销）</a-radio>
              </div>
              <div>
                <a-radio value="3">日均订单金额（销）</a-radio>
              </div>
            </a-radio-group>
          </DropdownSelect>

        </div>
        <div class="flex-start">
          <DropdownSelect label="项目组" style="margin-right: 50px">
            <div slot="selectedText" class="text-ellipsis px10" style="width: 80px;">{{ query2.teams.join(';') }}</div>
            <a-checkbox-group v-model="query2.teams">
              <div v-for="item in teamOptions" :key="item">
                <a-checkbox :value="item">{{ item }}</a-checkbox>
              </div>
            </a-checkbox-group>
          </DropdownSelect>
          <DropdownSelect label="统计年份">
            <div slot="selectedText">{{ query2.year }}</div>
            <a-radio-group v-model="query2.year">
              <div v-for="y in yearOptions" :key="y">
                <a-radio :value="y">{{ y }}</a-radio>
              </div>
            </a-radio-group>
          </DropdownSelect>
        </div>
      </div>

      <div class="ch10">
        <v-chart ref="chart10" autoresize :options="options10"/>
      </div>

      <div class="mt15">
        <table class="dashboard-common-table">
          <tr>
            <td></td>
            <td>年平均</td>
            <td>当期平均</td>
            <td v-for="m in months" :key="m">{{ m }}月</td>
          </tr>
          <tr>
            <td @mouseenter="mouseenter(0, 0,null)" 
              :style="{background:(curCol === 0) || (curRow === 0) ? hoverColor : null,}">当期目标</td>
            <td @mouseenter="mouseenter(0, 1,null)" 
              :style="{background:(curCol === 0) || (curRow === 1) ? hoverColor : null,}"
            >
              {{ yearAvg['tgt'] ? numeral(yearAvg['tgt'] / 10000).format('0,0.0') + '万' : '--' }}
            </td>
            <td @mouseenter="mouseenter(0, 2,null)"  
              :style="{background:(curCol === 0) || (curRow === 2) ? hoverColor : null,}">
              {{ curAvg['tgt'] ? numeral(curAvg['tgt'] / 10000).format('0,0.0') + '万' : '--' }}
            </td>
            <td @mouseenter="mouseenter(0, (m+'月'),null)"
              :style="{background:(curCol === 0) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{
                (typeof TgtValues[m - 1] === 'number') ?
                    TgtValues[m - 1] ? numeral(TgtValues[m - 1] / 10000).format('0,0.0') + '万' : '--' : '--'
              }}
            </td>
          </tr>

          <tr>
            <td  @mouseenter="mouseenter(1, 0,null)"
              :style="{background:(curCol === 1) || (curRow === 0) ? hoverColor : null,}"
            >{{ query2.year }}</td>

            <td @mouseenter="mouseenter(1, 1,null)"
              :style="{background:(curCol === 1) || (curRow === 1) ? hoverColor : null,}"
            >{{ numeral(yearAvg.thisYear / 10000).format('0,0.0') }}万</td>

            <td @mouseenter="mouseenter(1, 2,null)"
              :style="{background:(curCol === 1) || (curRow === 2) ? hoverColor : null,}"
            >{{ numeral(curAvg.thisYear / 10000).format('0,0.0') }}万</td>

            <td @mouseenter="mouseenter(1, (m+'月'),null)"
              :style="{background:(curCol === 1) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ thisYearValues[m - 1] ? numeral(thisYearValues[m - 1] / 10000).format('0,0.0') + '万' : '--' }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(2, 0,null)"
              :style="{background:(curCol === 2) || (curRow === 0) ? hoverColor : null,}"
            >{{ query2.year - 1 }}</td>
            <td @mouseenter="mouseenter(2, 1,null)"
              :style="{background:(curCol === 2) || (curRow === 1) ? hoverColor : null,}"
            >{{ numeral(yearAvg.lastYear / 10000).format('0,0.0') }}万</td>

            <td @mouseenter="mouseenter(2, 2,null)"
              :style="{background:(curCol === 2) || (curRow === 2) ? hoverColor : null,}"
            >{{ numeral(curAvg.lastYear / 10000).format('0,0.0') }}万</td>
            <td @mouseenter="mouseenter(2, (m+'月'),null)"
              :style="{background:(curCol === 2) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m">
              {{ lastYearValues[m - 1] ? numeral(lastYearValues[m - 1] / 10000).format('0,0.0') + '万' : '--' }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(3, 0,null)"
              :style="{background:(curCol === 3) || (curRow === 0) ? hoverColor : null,}"
            >同比增长</td>
            <td @mouseenter="mouseenter(3, 1,null)" 
              :style="{background:(curCol === 3) || (curRow === 1) ? hoverColor : null,}"
              :class="{
              'text-red': yearAvg.thisYear / yearAvg.lastYear < 1,
              'text-green': yearAvg.thisYear / yearAvg.lastYear > 1
            }">
              {{ numeral((yearAvg.thisYear / yearAvg.lastYear) - 1).format('0.00%') }}
            </td>
            <td @mouseenter="mouseenter(3, 2,null)" 
              :style="{background:(curCol === 3) || (curRow === 2) ? hoverColor : null,}"
              :class="{
              'text-red': curAvg.thisYear / curAvg.lastYear < 1,
              'text-green': curAvg.thisYear / curAvg.lastYear > 1
            }">
              {{ numeral((curAvg.thisYear / curAvg.lastYear) - 1).format('0.00%') }}
            </td>
            <td @mouseenter="mouseenter(3, (m+'月'),null)" 
              :style="{background:(curCol === 3) || (curRow === (m+'月')) ? hoverColor : null,}"
              v-for="m in months" :key="m" :class="{
              'text-red': (thisYearValues[m - 1] && lastYearValues[m - 1]) && (thisYearValues[m - 1] / lastYearValues[m - 1]) < 1,
               'text-green': (thisYearValues[m - 1] && lastYearValues[m - 1]) && (thisYearValues[m - 1] / lastYearValues[m - 1]) > 1,
            }">
              {{
                (thisYearValues[m - 1] && lastYearValues[m - 1])
                    ? (numeral((thisYearValues[m - 1] / lastYearValues[m - 1]) - 1).format('0.00%'))
                    : '--'
              }}
            </td>
          </tr>

          <tr>
            <td @mouseenter="mouseenter(4, 0,null)" 
              :style="{background:(curCol === 4) || (curRow === 0) ? hoverColor : null,}"
            >是否达标</td>
            <td @mouseenter="mouseenter(4, 1,null)"
              :style="{background:(curCol === 4) || (curRow === 1) ? hoverColor : null,}" 
            >--</td>
            <td @mouseenter="mouseenter(4, 2,null)"
              :style="{background:(curCol === 4) || (curRow === 2) ? hoverColor : null,}" 
            >--</td>
            <td @mouseenter="mouseenter(4, (m+'月'),null)"
              :style="{background:(curCol === 4) || (curRow === (m+'月')) ? hoverColor : null,}" 
              v-for="m in months" :key="m" :class="{
              'text-green': (thisYearValues[m - 1] && TgtValues[m - 1]) && thisYearValues[m - 1] > TgtValues[m - 1],
              'text-red': (thisYearValues[m - 1] && TgtValues[m - 1]) && thisYearValues[m - 1] <= TgtValues[m - 1],
            }">
              {{
                (thisYearValues[m - 1] && TgtValues[m - 1] && typeof TgtValues[m - 1] === 'number' && typeof thisYearValues[m - 1] === 'number')
                    ? thisYearValues[m - 1] > TgtValues[m - 1] ? '否' : '是' : '--'
              }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import numeral from 'numeral'
import DropdownSelect from '@/views/BIView/components/DropdownSelect/DropdownSelect'
import SortTable from '@/views/BIView/PsDashboard/components/SortTable/SortTableTcq'
import graphic from 'echarts/lib/util/graphic'
import moment from 'moment'

import Jump from '@/views/BIView/PsDashboard/components/Jump'
import Title from '@/views/BIView/PsDashboard/components/Title'
import echartsColor from '../../utils/echartsColor.js'


export default {
  name: 'ShortShippedCharts',
  components: {SortTable, DropdownSelect,Jump,Title},
  data() {
    const thisYear = (new Date()).getFullYear()
    const months = Array(12).fill(null).map((_, i) => i + 1)
    return {
      months,
      viewType: '1',
      teamOptions: [],
      yearOptions: [thisYear, thisYear - 1, thisYear - 2],
      ShortType:null,
      ShortTypeM:'',
      query1: {
        valueType: '3',
        timeType: '1'
      },
      query2: {
        valueType: '1',
        teams: [],
        year: thisYear
      },
      table: {
        sorter: {type: '', col: ''},
        bodyStyle: {height: 'calc((var(--height) - 70) * 1px / 11 * 10 - 11px - 20px)'},
        trHeight: 'calc((var(--height) - 70) * 1px / 11)',
        dataSource: [],
        columns: [
          {dataIndex: 'TEAM_SUPPLY', title: '项目组', align: 'left'},
          {
            dataIndex: 'TARGET_EXPURPRICE', title: '目标', render: (h, {row, cellProp}) => {
              return <span>{numeral(row[cellProp] / 10000).format('0,0.0')}万</span>
            }, sortable: true
          },
          {
            dataIndex: 'AVG_PURPRICE_AMT', title: '实际', render: (h, {row, cellProp}) => {
              return <span>{numeral(row[cellProp] / 10000).format('0,0.0')}万</span>
            }, sortable: true
          },
          {
            dataIndex: 'DIFF_TGT_EXPURPRICE', title: '差值', render: (h, {row, cellProp}) => {
              return <span class={{
                'text-green': row[cellProp] > 0,
                'text-red': row[cellProp] <= 0
              }}>{numeral(row[cellProp] / 10000).format('0,0.0')}万</span>
            }, sortable: true
          },
          {
            dataIndex: 'TGT_REMAIN_PPRICE', title: '控制日均欠货', render: (h, {row, cellProp}) => {
              return <span>{numeral(row[cellProp] / 10000).format('0,0.0')}万</span>
            }, sortable: true
          },
          {
            dataIndex: 'RESPON_AVG_EX_SPL_PUR_AMT', title: '供应商责任', render: (h, {row, cellProp}) => {
              return <span>{numeral(row[cellProp] / 10000).format('0,0.0')}万</span>
            }, sortable: true
          },
          {
            dataIndex: 'UNRESPON_AVG_EX_SPL_PUR_AMT', title: '非供应商责任', render: (h, {row, cellProp}) => {
              return <span>{numeral(row[cellProp] / 10000).format('0,0.0')}万</span>
            }, sortable: true
          },
          {
            dataIndex: 'EX_ORDERS_AMT', title: '欠货订单金额', render: (h, {row, cellProp}) => {
              return <span>{numeral(row[cellProp] / 10000).format('0,0.0')}万</span>
            }, sortable: true
          }
        ]
      },
      table2: {
        trHeight: 'calc((var(--height) - 140) * .1px)',
        dataSource: [],
        columns: [
          {dataIndex: 'name', title: '指标', align: 'left'},
          {
            dataIndex: 'TGT', render: (h, {row, cellProp}) => {
              return <span>{row[cellProp] === '/' ? '/' : numeral(row[cellProp] / 10000).format('0,0') + '万'}</span>
            }, title: '目标'
          },
          {
            dataIndex: 'ACT', render: (h, {row, cellProp}) => {
              return <span>{row[cellProp] === '/' ? '/' : numeral(row[cellProp] / 10000).format('0,0') + '万'}</span>
            }, title: '实际'
          },
          {
            dataIndex: 'DIFF', render: (h, {row, cellProp}) => {
              return <span class={{
                'text-red': row[cellProp] !== '/' && row[cellProp] < 0,
                'text-green': row[cellProp] !== '/' && row[cellProp] > 0,
              }}>{row[cellProp] === '/' ? '/' : numeral(row[cellProp] / 10000).format('0,0') + '万'}</span>
            }, title: '差值'
          },
          {
            dataIndex: 'RSP', render: (h, {row, cellProp}) => {
              return <span>{row[cellProp] === '/' ? '/' : numeral(row[cellProp] / 10000).format('0,0') + '万'}</span>
            }, title: '供应商责任'
          },
          {
            dataIndex: 'UNRSP', render: (h, {row, cellProp}) => {
              return <span>{row[cellProp] === '/' ? '/' : numeral(row[cellProp] / 10000).format('0,0') + '万'}</span>
            }, title: '非供应商责任'
          },
        ]
      },
      options1: {
        tooltip: {
          confine: true,
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter(params) {
            const lines = params.map(_ => {
              return `<br>${_.marker}${_.seriesName}: ${_.value ? numeral(_.value).format('0,0') : '--'}`
            }).join('')
            return `统计日期: ${moment(params[0].axisValue).format('YYYY-MM_DD')}${lines}`
          },
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
          right: 0,
          bottom: 10,
          left: 0,
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
            show: false,
            color: '#999'
          },
          data: months.map(_ => _ + '月'),
        },
        yAxis: {
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            color: '#999',
            formatter(v) {
              return numeral(v / 10000).format('0,0') + '万'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              // type: 'dashed',
              type: 'solid',
              color: echartsColor.splitLine
              // color:'#000000'
            }
          }
        },
        series: [
          //  #5C8FF9
          {
            type: 'line',
            name: '当期欠货',
            smooth: true,
            showSymbol: true,
            itemStyle: {
              // color: '#2680eb'
              color: echartsColor.thisYear
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  // color: '#2680eb'
                  color: echartsColor.NewPeriod1
                },
                {
                  offset: 1,
                  // color: '#2680eb00'
                  color: echartsColor.NewPeriod2
                }
              ]),
              opacity: 1
            },
            data: [],
            symbol:'none',
            z:2
          },
          {
            type: 'line',
            name: '同期欠货',
            smooth: true,
            showSymbol: true,
            itemStyle: {
              // color: '#cce0e9'
              color: echartsColor.previousYear
            },
            areaStyle: {
              opacity:1,
              // color:'#EDF0F4'
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  // color: '#cce0e9'
                  color: echartsColor.NewYOY1
                },
                {
                  offset: 1,
                  color: echartsColor.NewYOY2
                }
              ])

            },
            data: [],
            symbol:'none',
            z:1
          },
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
        grid: {
          top: 20,
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
            show: true,
            lineStyle: {
              // type: 'dashed',
              // color: ['#ececee']
              type: 'solid',
              color: echartsColor.splitLine
            }
          },
          axisLabel: {
            show: true,
            color: '#999',
            formatter(v) {
              return numeral(v / 10000).format('0,0') + '万'
            }
          }
        },
        series: [
          {
            type: 'line',
            name: thisYear,
            z: 10,
            smooth: true,
            itemStyle: {
              // color: '#2680eb'
              color: echartsColor.thisYear
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  // color: '#2680eb'
                  color: echartsColor.NewPeriod1
                },
                {
                  offset: 1,
                  // color: '#2680eb00'
                  color: echartsColor.NewPeriod2
                }
              ]),
              // color: '#5C8FF9',
              opacity: 1,
            },
            data: [],
            symbol:'none'
          },
          {
            type: 'line',
            name: thisYear - 1,
            smooth: true,
            itemStyle: {
              // color: '#cce0e9'
              color: echartsColor.previousYear
            },
            areaStyle: {
              opacity:1,
              // color:'#EDF0F4'
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  // color: '#cce0e9'
                  color: echartsColor.NewYOY1
                },
                {
                  offset: 1,
                  color: echartsColor.NewYOY2
                }
              ])
            },
            data: [],
            symbol:'none',
            z:1
          }
        ]
      },
      TgtValues: [],
      thisYearValues: [],
      lastYearValues: [],
      curAvg: {
        tgt: '',
        thisYear: '',
        lastYear: ''
      },
      yearAvg: {
        tgt: '',
        thisYear: '',
        lastYear: ''
      },

      hoverColor: 'rgba(135,206,250, 0.2)',
      curRow: null,
      curCol: null,
      curType:null,

    }
  },
  watch: {
    viewType(val) {
      if (val === '2' && !this.toggleFlag) {
        this.getData4()
        if(this.ShortType){
          this.query2.valueType=(this.ShortType==='2')?'1':(this.ShortType==='3')?'3':this.query2.valueType;
        }
        this.toggleFlag = true
      }else if(val==='1'){
        if(this.ShortType){
          this.query1.valueType=this.ShortType;
        }
      }
    },
    'query2.valueType'() {
      setTimeout(() => {
        this.parseData4(this.trendData)
      }, 200); 
    },
    'query2.year'() {
      this.getData4()
    },
    'query2.teams'() {
      this.getData4()
    },
    'query1.valueType'() {
      setTimeout(()=>{
        this.parseData3(this._2yearData)
      },200);
    },
    'query1.timeType'() {
      this.parseData3(this._2yearData)
    },
    'ShortType'(){
      // this.query1.valueType=this.ShortType;
      if(this.viewType === '1'){
        this.query1.valueType=this.ShortType;
      }else if(this.viewType === '2'){
        this.query2.valueType=(this.ShortType==='2')?'1':(this.ShortType==='3')?'3':this.query2.valueType;
      }
    },

  },
  mounted() {
    this.getData1()
    this.getData2()
    this.getData3()
  },
  methods: {
    numeral,
    getData1() {
      this.$fetchSql('pds_cockpit', 'shrt_tm_spl_dtl').then(({data}) => {
        this.teamOptions = data.map(_ => _['TEAM_SUPPLY'])
        this.table.dataSource = orderBy(data, ['AVG_PURPRICE_AMT'], ['desc'])
      })
    },
    handleSort(sorter) {
      if (sorter.col && sorter.type) {
        this.table.dataSource = orderBy(this.table.dataSource, [sorter.col], [sorter.type])
      } else {
        this.table.dataSource = orderBy(this.table.dataSource, ['AVG_PURPRICE_AMT'], ['desc'])
      }
    },
    getData2() {
      this.$fetchSql('pds_cockpit', 'shrt_tm_sum').then(({data: [ret]}) => {
        this.table2.dataSource = [{
          name: '日均欠货订单（销）',
          TGT: ret['TGT_AVG_EXORDER_AMT'],
          ACT: ret['AVG_EX_ORDERS_AMT'],
          DIFF: ret['AVG_EX_ORDERS_AMT_DIFF'],
          RSP: ret['RESPON_AVG_EX_SPL_ORD_AMT'],
          UNRSP: ret['UNRESPON_AVG_EX_SPL_ORD_AMT']
        }, {
          name: '日均商品欠货（销）',
          TGT: ret['TGT_AVG_ACT_PRICE_AMT'],
          ACT: ret['AVG_ACT_PRICE_AMT'],
          DIFF: ret['AVG_ACT_PRICE_AMT_DIFF'],
          RSP: ret['RESPON_AVG_EX_SPL_ACT_AMT'],
          UNRSP: ret['UNRESPON_AVG_EX_SPL_ACT_AMT']
        }, {
          name: '日均商品欠货（采）',
          TGT: ret['TARGET_EXPURPRICE'],
          ACT: ret['AVG_PURPRICE_AMT'],
          DIFF: ret['DIFF_TGT_EXPURPRICE'],
          RSP: ret['RESPON_AVG_EX_SPL_PUR_AMT'],
          UNRSP: ret['UNRESPON_AVG_EX_SPL_PUR_AMT']
        }]
      })
    },
    getData3() {
      this.$fetchSql('pds_cockpit', 'shrt_tm_last_2years_sum').then(({data}) => {
        const _data = orderBy(data, ['TDATE', ['asc']])
        this._2yearData = _data
        this.parseData3(_data)

      })
    },
    parseData3(_data) {
      const timeTypeLen = {1: -30, 2: -90, 3: -360, 4: -720}
      const valueProps = {1: 'ACT_PRICE1', 2: 'AVG_PURPRICE1', 3: 'EX_ORDERS_AMT'}
      const valueProps2 = {1: 'ACT_PRICE1_YOY', 2: 'AVG_PURPRICE1_YOY', 3: 'EX_ORDERS_AMT_YOY'}
      const ret = _data.slice(timeTypeLen[this.query1.timeType])

      this.$refs.chart1.clear()
      this.options1.xAxis.data = ret.map(_ => _['TDATE'])
      this.options1.series[0].data = ret.map(_ => {
          let isAfter = moment(_.TDATE).format('x') > moment().format('x')
          if(isAfter) return null
          return _[valueProps[this.query1.valueType]]
      })
      this.options1.series[1].data = ret.map(_ => _[valueProps2[this.query1.valueType]])
    },
    getData4() {
      this.$fetchSql('pds_cockpit', 'shrt_mly_spl_sum', {
        YDATE: [this.query2.year, this.query2.year - 1].toString(),
        TEAM_SUPPLY: this.query2.teams.toString()
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

        this.trendData = ret
        this.parseData4(this.trendData)
      })
    },
    parseData4(ret) {
      const props = {1: 'AVG_PURPRICE_AMT', 2: 'AVG_ACT_PRICE_AMT', 3: 'AVG_EX_ORDERS_AMT'}
      const props2 = {1: 'TARGET_EXPURPRICE', 2: 'TGT_AVG_ACT_PRICE_AMT', 3: 'TGT_AVG_EXORDER_AMT'}

      this.$refs.chart10.clear()
      this.options10.series[0].name = this.query2.year
      this.options10.series[0].data = ret[this.query2.year].map(_ => _[props[this.query2.valueType]])

      this.options10.series[1].name = this.query2.year - 1
      this.options10.series[1].data = ret[this.query2.year - 1].map(_ => _[props[this.query2.valueType]])

      this.TgtValues = ret[this.query2.year].filter(_ => _['MDATE']).map(_ => _[props2[this.query2.valueType]])
      this.thisYearValues = ret[this.query2.year].filter(_ => _['MDATE']).map(_ => _[props[this.query2.valueType]])
      this.lastYearValues = ret[this.query2.year - 1].filter(_ => _['MDATE']).map(_ => _[props[this.query2.valueType]])

      const len = ret[this.query2.year].filter(_ => _['MDATE']).length
      this.curAvg = {
        tgt: ret[this.query2.year].slice(0, len).reduce((acc, cur) => {
          return acc + (cur[props2[this.query2.valueType]] || 0)
        }, 0) / len,
        thisYear: ret[this.query2.year].slice(0, len).reduce((acc, cur) => {
          return acc + (cur[props[this.query2.valueType]] || 0)
        }, 0) / len,
        lastYear: ret[this.query2.year - 1].slice(0, len).reduce((acc, cur) => {
          return acc + (cur[props[this.query2.valueType]] || 0)
        }, 0) / len,
      }

      this.yearAvg = {
        tgt: ret[this.query2.year].reduce((acc, cur) => {
          return acc + (cur[props2[this.query2.valueType]] || 0)
        }, 0) / len,
        thisYear: ret[this.query2.year].reduce((acc, cur) => {
          return acc + (cur[props[this.query2.valueType]] || 0)
        }, 0) / len,
        lastYear: ret[this.query2.year - 1].reduce((acc, cur) => {
          return acc + (cur[props[this.query2.valueType]] || 0)
        }, 0) / 12,
      }
    },
    mouseenter(col, row,type) {
      this.curCol = col
      this.curRow = row
      this.curType = type
    },
    jumpTarget() {
        let str = ''
        if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
            str = 'http://test.bi.linshimuye.com:9090/x/4_78_807_4442'
        }
        else {
            str = 'http://bi.linshimuye.com:9090/x/4_78_807_116_4172'
        }
        let msg = {
            url: str,
            webTitle: '欠货分析日报'
        }
        window.parent.postMessage(JSON.stringify(msg), '*')
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard-common-table {
  /deep/ td {
    height: calc(((var(--height) - 100) * .4px) / 6);
  }
}

.ch1 {
  height: calc((var(--height) - 120) * .6px - 11px);
}

.ch10 {
  height: calc((var(--height) - 100) * .5px);
}

/deep/ .mt20 div div.Table_Title{
  padding-right: 0px;

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

.IsKong{
  /deep/ .ant-radio{
    display: none;
  }
}
</style>
