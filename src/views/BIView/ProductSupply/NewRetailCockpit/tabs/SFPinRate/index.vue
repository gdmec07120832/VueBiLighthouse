<template>
  <div class="SFPinRate">
    <div class="header">
      <Title class="title" :label="'主体摆场'" />
      <div>
        <span style="padding-right: 13px;font-size: 12px;">统计月份</span>
        <a-month-picker v-model="month" format="YYYY-MM" :disabledDate='disabledDate' valueFormat="YYYYMM" :allowClear="false" />        
      </div>

    </div>

    <div class="content">
      <div class="ConLeft" ref="ID_content">
        <div class="MPPopulation">
          <div class="MainPen">
            <div class="label">主体摆场总览</div>
          </div>
          <div class="MPindex">
            <div v-for="(item, index) in GetMainData" :key="index" class="MPindexCont">
              <div class="MPICTitle">{{ item.TitleL }}</div>
              <div class="MPICTitleVal">{{ index == 0 ?  UnitNum('round',item.Num) : (item.Num * 100).toFixed(1) + '%' }}</div>
              <div v-if="index == 0" class="MPICTitle">{{ item.Vice }}</div>
              <div v-if="index == 0" class="MPICTitleVal">{{ UnitNum('round',item.Num2) }}</div>

              <div v-if="index != 0" class="MPConVal">
                <div class="MPConValName">{{ item.Vice }}</div>
                <div class="MPConValVal">{{ (item.Num2 * 100).toFixed(1) + '%' }}</div>
              </div>
              <div v-if="index != 0" class="MPConVal">
                <div class="MPConValName">{{ item.Vice2 }}</div>
                <div class="MPConValVal" :class="item.Num3 >= 0 ? 'ISRead' : 'ISGreen'">
                  {{ (item.Num3 * 100).toFixed(1) + '%' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="MPTableModule">
          <div class="MainPen" style="margin-top: 30px;margin-bottom: 3px">
            <div class="label">区域主体摆场</div>
          </div>

          <div class="MPTableNew" style="margin-top: 0px">
            <ul class="MPTableNewUl">
              <li class="MPTTitle">
                <ul>
                  <li
                    v-for="(item, index) in TableSP.labelData"
                    :key="index"
                    :class="index == 0 ? 'top0' : ''"
                    @contextmenu="openMenu($event, item)"
                  >
                    {{ item }}
                  </li>
                </ul>
              </li>

                    <!-- this.curCol = col,
                    this.curRow = row, -->
              <li v-for="(item, index) in TableSP.tableData" :key="index" @mouseleave="mouseenter(null, null)"  @mouseenter="mouseenter(index, 0)"
                class="MPTCont" :class="((index+1)===TableSP.tableData.length)?'border-bottomO':''"
                :style="{background:(curCol===index)?hoverColor:''}"
              >
                <ul>
                  <li
                    @mouseenter="mouseenter(index, 0)"
                    :style="{background:(curRow===0)?hoverColor:''}"
                    @contextmenu="openMenu($event, item.S_OR_N)"
                    style="border-left: 1px solid #e7e9f0; text-decoration-line: underline; cursor: pointer"
                    class="title_name"
                    :class="ChartsCategory === item.S_OR_N ? 'ISChoose' : ''"
                    @click="GetCategoryData(item.S_OR_N)"
                  >
                    {{ item.S_OR_N }}
                  </li>
                  <li @mouseenter="mouseenter(index, 1)" :style="{background:(curRow===1)?hoverColor:''}"
                    @contextmenu="openMenu($event, item.MTD_TOT_SAMP_QTY)">{{ UnitNum('round',item.MTD_TOT_SAMP_QTY) }}</li>

                  <li @mouseenter="mouseenter(index, 2)" :style="{background:(curRow===2)?hoverColor:''}" 
                    @contextmenu="openMenu($event, UnitNum('Rate', item.MTD_MAIN_SAMP_RATE))">
                    {{ UnitNum('Rate', item.MTD_MAIN_SAMP_RATE) }}
                  </li>
                  <li
                    @mouseenter="mouseenter(index, 3)"
                    :style="{background:(curRow===3)?hoverColor:''}"
                    @contextmenu="openMenu($event, UnitNum('Rate', item.YOY_MAIN_SAMP_RATE))"
                    :class="item.YOY_MAIN_SAMP_RATE > 0 ? 'ISRead' : 'ISGreen'"
                  >
                    {{ UnitNum('Rate', item.YOY_MAIN_SAMP_RATE) }}
                  </li>
                  <li @mouseenter="mouseenter(index, 4)" :style="{background:(curRow===4)?hoverColor:''}" 
                    @contextmenu="openMenu($event, UnitNum('Rate', item.MTD_MAIN_INVSAMP_RATE))">
                    {{ UnitNum('Rate', item.MTD_MAIN_INVSAMP_RATE) }}
                  </li>
                  <li
                    @mouseenter="mouseenter(index, 5)"
                    :style="{background:(curRow===5)?hoverColor:''}"
                    @contextmenu="openMenu($event, 'item')"
                    :class="item.YOY_MAIN_INVSAMP_RATE > 0 ? 'ISRead' : 'ISGreen'"
                  >
                    {{ UnitNum('Rate', item.YOY_MAIN_INVSAMP_RATE) }}
                  </li>
                  <li @mouseenter="mouseenter(index, 6)" :style="{background:(curRow===6)?hoverColor:''}"
                    @contextmenu="openMenu($event, 'item')">{{ UnitNum('Rate', item.MTD_MAIN_SALSAMP_RATE) }}</li>
                  <li
                    @mouseenter="mouseenter(index, 7)"
                    :style="{background:(curRow===7)?hoverColor:''}"
                    @contextmenu="openMenu($event, 'item')"
                    :class="item.YOY_MAIN_SALSAMP_RATE > 0 ? 'ISRead' : 'ISGreen'"
                  >
                    {{ UnitNum('Rate', item.YOY_MAIN_SALSAMP_RATE) }}
                  </li>
                </ul>
              </li>
            </ul>

            <div v-if="menuVisible" class="selectMenu" :style="[{ left: menuX }, { top: menuY }]">
              <div class="item box" v-clipboard="currentRow">复制内容</div>
            </div>
          </div>
        </div>


        <div class="MPCharts_new_all">
          <div class="MainPen">
            <div class="label">主体类目摆场({{ ChartsCategory }})</div>
          </div>
          <div class="MPCharts_new">
            <div class="MPCharts_new_L">
              <div class="MPChartsDRTitle">摆场占比</div>
              <v-chart style="overflow: visible;" :options="OptionsChartAre" autoresize></v-chart>
            </div>    
            <div class="MPCharts_new_R">
              <div class="MPChartsDRTitle">摆场动销变化</div>
              <v-chart   style="overflow: visible;" :options="ChartsDBarOnData" autoresize ></v-chart>
            </div> 
          </div>
        </div>

        <!-- <div class="MPCharts">
          <div class="MainPen">
            <div class="label">主体类目摆场({{ ChartsCategory }})</div>
          </div>

          <div class="MPChartsDown">
            <div class="MPChartsDRig">
              <div class="MPChartsDRTitle">摆场占比</div>
              <div class="MPChartsDRCont" :style="{height:CliWidth/5.8+'px'}" ref="ChartsDRigOn"></div> :style="{height:(OnCliHeight-420)+'px'}"
              <div class="MPChartsDRCont">
                <v-chart style="overflow: visible;" :options="OptionsChartAre" autoresize></v-chart>
              </div>
              <div class="MPChartsDRCont"  ref="ChartsDRigOn"></div>
            </div>
            <div class="MPChartsDBar">
              <div class="MPChartsDRTitle">摆场动销变化</div>
              <div class="MPChartsDBCont" :style="{height:CliWidth/5.8+'px'}" ref="ChartsDBarOn"></div>
              <div class="MPChartsDBCont"  ref="ChartsDBarOn"></div>
              <div class="MPChartsDBCont" :style="{height:(OnCliHeight-410)+'px'}">
                <v-chart   style="overflow: visible;" :options="ChartsDBarOnData" autoresize ></v-chart>
              </div>
            </div>
          </div>
        </div> -->

      </div>

      <div class="ConRight">
        <div class="MainPen">
          <div class="label">主体摆场趋势</div>
        </div>
        <div class="SelectAss">
          <div class="SelectAssC">
            <Select :label="'区域'" :value.sync="type" :options="TypeOptions" />
          </div>
          <div class="SelectAssC">
            <Select :label="'主体类目'" :value.sync="type2" :options="Type2Options" />
          </div>
        </div>
        <div class="Choice">
          <div class="ChoiceLeft">
            <span style="display: flex">
              <a-radio-group v-model="area">
                <a-radio :value="item" v-for="item in areaOption" :key="item">
                  {{ item }}
                </a-radio>
              </a-radio-group>
            </span>
          </div>
          <div class="ChoiceRight">
            <span>2022</span>
            <span>2021</span>
          </div>
        </div>

        <div class="CRightTable">
          <!-- <div class="CRightTableCon" :style="{height:CliWidth/6+'px'}" ref="CRightTableOn"></div> -->
          <!-- <div class="CRightTableCon" ref="CRightTableOn"></div>   :style="{height:(OnCliHeight2)+'px'}"-->
          <div class="CRightTableCon">
            <v-chart ref="CRIgTerrt"  style="overflow: visible;" :options="OptionsChart" autoresize ></v-chart>
          </div>
          
        </div>

        <div class="">
          <Table v-bind="table1" class="tableCss" />
          <!-- <Jump /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// var clientWidth = 0;
// 做T+1处理开始
let _time_now=new Date();
_time_now=_time_now.getTime()-(24*60*60*1000);
_time_now=new Date(_time_now);
// 做T+1处理结束
import Title from '../../components/Title'
import moment from 'moment'
import Table from '../../components/Table'
import Select from '../../components/Select'
// import Jump from '../../components/Jump'
// import * as echarts from 'echarts5/lib/echarts'
import base from '../../utils/base'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import echartStyle from '../../utils/echartStyle.js'

export default {
  name: 'SFPinRate',
  mixins: [ base ],

  components: {
    Title,
    Table,
    Select,
    // Jump,
  },

  data() {
    return {
      CliWidth:document.body.offsetHeight,
      OnCliHeight:document.body.offsetHeight-300,
      OnCliHeight2:document.body.offsetHeight-590,
      month: moment(_time_now).format('YYYYMM'),
      UserDataOn:[],

      hoverColor: 'rgba(135,206,250, 0.2)',
      curCol : null,
      curRow : null,

      GetMainData: [
        { TitleL: '总摆场数', Num: 0, Vice: '主体摆场数', Num2: 0, Vice2: '较同期', Num3: 0 },
        { TitleL: '主体摆场占比', Num: 0, Vice: '目标', Num2: 0, Vice2: '较同期', Num3: 0 },
        { TitleL: '主体无效摆场占比', Num: 0, Vice: '目标', Num2: 0, Vice2: '较同期', Num3: 0 },
        { TitleL: '主体摆场动销率', Num: 0, Vice: '目标', Num2: 0, Vice2: '较同期', Num3: 0 },
      ],
      table1: {
        index: 'SFPinRate',
        tableData: [
          ['1月', 0, 0, 0, ''],
          ['2月', 0, 0, 0, ''],
          ['3月', 0, 0, 0, ''],
          ['4月', 0, 0, 0, ''],
          ['5月', 0, 0, 0, ''],
          ['6月', 0, 0, 0, ''],
          ['7月', 0, 0, 0, ''],
          ['8月', 0, 0, 0, ''],
          ['9月', 0, 0, 0, ''],
          ['10月', 0, 0, 0, ''],
          ['11月', 0, 0, 0, ''],
          ['12月', 0, 0, 0, ''],
        ],
        labelData: ['月份', '总摆场数', '主体摆场占比', '同期占比', '同期差值'],
      },
      TableSP: {
        labelData: [
          '区域',
          '总摆场数',
          '主体摆场占比',
          '较同期',
          '主体无效摆场占比',
          '较同期',
          '主体摆场动销率',
          '较同期',
        ],
        tableData: [{ name: '全国', allnum: 430 }],
      },
      menuVisible: false,
      currentRow: '',
      menuX: '0px',
      menuY: '0px',
      type: '全国',
      TypeOptions: [],
      type2: '全部',
      Type2Options: [],
      ChartsCategory: '全国',

      area: '主体摆场占比',
      areaOption: ['主体摆场占比', '主体无效摆场占比', '主体摆场动销率'],

      OptionsChartAre:{
        tooltip: {
          trigger: 'item',
          formatter:((params)=>{
            return params.name+'<br/>'+'摆场数：'+this.UnitNum('round',params.value)+'<br/>'+'占比：'+(params.percent).toFixed(2)+'%'
          })
          
        },
        legend: {
          top: '5%',
          show:true,
          // left: 'center',
          // fontSize:'3',
          textStyle:{
            fontSize:10
          },
          itemHeight:8,
          orient: 'vertical', //垂直显示
          y: 'center', //延Y轴居中
          x: 'right', //居右显示
        },
        color: ['#5B8FF9', '#B9D0FF', '#6D88B6', '#FD84B6', '#F6BD16', '#A285D2', '#6DC8EC'],
        series: [
          {
            name: '主体类目摆场占比',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],

      },

      
      ChartsDBarOnData:{
        grid: {
          left: '0%',
          right: '0%',
          bottom: 20,
          top: 10,
          containLabel: true,
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              color: '#000000',
              backgroundColor: 'aliceblue',
            },
          },
          formatter: 'value',
        },

        xAxis: [
          {
            type: 'category',
            // 月份
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: echartStyle.axisLabel
            }
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: echartStyle.splitLine,
              },
            },
            axisLabel: {
              formatter: 'value',
              color: echartStyle.axisLabel
            },
            splitNumber:'3'
          },
        ],

        series: [
          {
            name: '本期业绩',
            type: 'line',
            barWidth: '20',
            data: [150, 230, 224, 218, 135, 147, 260],
            itemStyle: {
              normal: {
                color: '#5b8ff9',
                barBorderRadius: [10, 10, 0, 0],
              },
            },
            label: {
              show: false,
              position: 'top',
            },
            z: 2,
          },
          {
            name: '同期业绩',
            type: 'line',
            // showSymbol: false,
            barWidth: '20',
            data: [150 / 2, 230 / 2, 224 / 2, 218 / 2, 135 / 2, 147 / 2, 260 / 2],
            itemStyle: {
              normal: {
                color: '#e7e7e7',
                barBorderRadius: [10, 10, 0, 0],
              },
            },
            label: {
              show: false,
              position: 'top',
            },
            z: 1,
            smooth: false,
            lineStyle: {
              normal: {
                color: '#e7e7e7',
                lineStyle: {
                  color: '#e7e7e7',
                },
              },
            },
            // symbol: 'none',
          },
        ],
      },
      OptionsChart: {
        grid: {
          left: '0%',
          right: '0%',
          bottom: 20,
          top: 10,
          containLabel: true,
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            label: {
              color: '#000000',
              backgroundColor: 'aliceblue',
            },
          },
          formatter: 'value',
        },

        xAxis: [
          {
            type: 'category',
            // 月份
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: echartStyle.axisLabel
            }
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: '#f7f7f7',
              },
            },
            axisLabel: {
              formatter: 'value',
              color: echartStyle.axisLabel
            },
          },
        ],

        series: [
          {
            name: '本期业绩',
            type: 'line',
            barWidth: '20',
            data: [150, 230, 224, 218, 135, 147, 260],
            itemStyle: {
              normal: {
                color: echartStyle.thisYear,
                barBorderRadius: [10, 10, 0, 0],
              },
            },
            label: {
              show: false,
              position: 'top',
            },
            z: 2,
            symbol: 'none',
            areaStyle: echartStyle.areaStyle[0],
          },
          {
            name: '同期业绩',
            type: 'line',
            // showSymbol: false,
            barWidth: '20',
            data: [150 / 2, 230 / 2, 224 / 2, 218 / 2, 135 / 2, 147 / 2, 260 / 2],
            itemStyle: {
              normal: {
                color: echartStyle.previousYear,
                barBorderRadius: [10, 10, 0, 0],
              },
            },
            label: {
              show: false,
              position: 'top',
            },
            z: 1,
            smooth: false,
            lineStyle: {
              normal: {
                color: echartStyle.previousYear,
                lineStyle: {
                  color: echartStyle.previousYear,
                },
              },
            },
            symbol: 'none',
            areaStyle: echartStyle.areaStyle[1],
          },
        ],
      },
    }
  },

  watch: {
    month() {
      // console.log('运行上了！！！')
      console.log(this.month)
      this.GetMonthFilter()
      this.GetMainSumData()
      this.GetRetailData()
      this.GetCategoryData(this.ChartsCategory)
      this.GetMonthTrendData()
    },

    area() {
      this.GetMonthTrendData()
    },
    type() {
      this.GetMonthTrendData()
    },
    type2() {
      this.GetMonthTrendData()
    },

    // CliWidth(){
    //   console.log("高度有变化了！！！");
    // }

  },

  async created() {
    
    // let _this=this;
    // window.onresize = () =>{
    //   this.CliWidth = document.body.offsetHeight;
    //   console.log("=========高度有表还==========");
    //   console.log(this.CliWidth)
    //   this.OnCliHeight=this.CliWidth-300;
    //   this.OnCliHeight2=this.CliWidth-590;
    //   console.log(this.$refs['ID_content'].scrollHeight);
    // }
    // this.CliWidth=clientWidth-40;
    // console.log(this.CliWidth);
    this.GetMonthFilter()
    this.GetMainSumData()
    this.GetRetailData()
    this.GetCategoryData(this.ChartsCategory)
    this.GetMonthTrendData()
  },

  mounted() {
    document.body.addEventListener('click', () => {
      if (this.menuVisible) this.menuVisible = !this.menuVisible
    })

    // let _this=this;
    // window.onresize =()=>{
    //   _this.ChartsDRigOnVal.resize()
    // }
    // 每次都需要清除画布
    this.$refs.CRIgTerrt.$refs.echarts.clear();


  },

  methods: {

    mouseenter(col, row){
      this.curCol = col;
      this.curRow = row;
    },

    openMenu(e, text) {
      e.preventDefault()
      this.menuX = e.target.offsetLeft + e.offsetX + 'px'
      this.menuY = e.target.offsetTop + e.offsetY + 'px'
      this.currentRow = text
      this.menuVisible = true
    },

    async GetMainSumData() {
      let query = {
        MDATE: this.month,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_main_sum', query)
      this.GetMainData
      this.GetMainData = [
        {
          TitleL: '总摆场数',
          Num: res.data[0].MTD_TOT_SAMP_QTY,
          Vice: '主体摆场数',
          Num2: res.data[0].MTD_MAIN_SAMP_QTY,
        },
        {
          TitleL: '主体摆场占比',
          Num: res.data[0].MTD_MAIN_SAMP_RATE,
          Vice: '目标',
          Num2: 0,
          Vice2: '较同期',
          Num3: res.data[0].YOY_MAIN_SAMP_RATE,
        },
        {
          TitleL: '主体无效摆场占比',
          Num: res.data[0].MTD_MAIN_INVSAMP_RATE,
          Vice: '目标',
          Num2: res.data[0].MTD_MAIN_INVSAMP_TGT,
          Vice2: '较同期',
          Num3: res.data[0].YOY_MAIN_INVSAMP_RATE,
        },
        {
          TitleL: '主体摆场动销率',
          Num: res.data[0].MTD_MAIN_SALSAMP_RATE,
          Vice: '目标',
          Num2: res.data[0].MTD_MAIN_SALSAMP_TGT,
          Vice2: '较同期',
          Num3: res.data[0].YOY_MAIN_SALSAMP_RATE,
        },
      ]
    },

    async GetRetailData() {
      let query = {
        MDATE: this.month,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_main_area', query)
      res.data.sort((a, b) => {
        return a['S_OR_N_RANK'] - b['S_OR_N_RANK']
      })
      this.TableSP.tableData = res.data
    },
    async GetCategoryData(NameOn) {
      let query = {
        MDATE: this.month,
        S_OR_N: NameOn,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_main_cate', query)
      this.ChartsCategory = NameOn;
      this.UserDataOn=res.data;
      this.ChartsDRigOnFun(res.data)
      this.ChartsDBarOnFun(res.data)
    },

    async GetMonthTrendData() {
      let query = {
        MDATE: this.month,
        S_OR_N: this.type,
        MAIN_CATEGORY: this.type2,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_main_trend', query)
      res.data.sort((a, b) => {
        return (
          (a['MDATE_MONTH'] ? a['MDATE_MONTH'].substr(0, 2) : 0) * 1 -
          (b['MDATE_MONTH'] ? b['MDATE_MONTH'].substr(0, 2) : 0) * 1
        )
      })
      this.table1.labelData = []
      this.table1.labelData = ['月份', '总摆场数', this.area, '同期占比', '同期差值']
      this.table1.tableData = []

      let YOY_RATE_var=0;
      let DIFF_RATE_var=0;
      let ON_RATE_var=0;

      Object.keys(res.data).forEach((OnKey) => {

        ON_RATE_var=this.area === '主体摆场占比'
            ? this.UnitNum('Rate',res.data[OnKey].MTD_MAIN_SAMP_RATE)
            : this.area === '主体无效摆场占比'
            ? this.UnitNum('Rate',res.data[OnKey].MTD_MAIN_INVSAMP_RATE)
            : this.UnitNum('Rate',res.data[OnKey].MTD_MAIN_SALSAMP_RATE)

        YOY_RATE_var=this.area === '主体摆场占比'
          ? this.UnitNum('Rate',res.data[OnKey].AGO_MAIN_SAMP_RATE)
          : this.area === '主体无效摆场占比'
          ? this.UnitNum('Rate',res.data[OnKey].AGO_MAIN_INVSAMP_RATE)
          : this.UnitNum('Rate',res.data[OnKey].AGO_MAIN_SALSAMP_RATE);
        DIFF_RATE_var=this.area === '主体摆场占比'
          ? this.UnitNum('Rate',res.data[OnKey].AGO_MAIN_SAMP_DIFF)
          : this.area === '主体无效摆场占比'
          ? this.UnitNum('Rate',res.data[OnKey].AGO_MAIN_INVSAMP_DIFF)
          : this.UnitNum('Rate',res.data[OnKey].AGO_MAIN_SALSAMP_DIFF);

        this.table1.tableData.push([
          res.data[OnKey].MDATE_MONTH,
          this.UnitNum('IsNull',res.data[OnKey].MTD_TOT_SAMP_QTY),
          (res.data[OnKey].MTD_TOT_SAMP_QTY==0||res.data[OnKey].MTD_TOT_SAMP_QTY=='--')?'--':ON_RATE_var,
          YOY_RATE_var,
          (res.data[OnKey].MTD_TOT_SAMP_QTY==0||res.data[OnKey].MTD_TOT_SAMP_QTY=='--')?'--':DIFF_RATE_var,
        ])
      })
      this.CRightTableOnFun(res.data, this.area)
    },

    async GetMonthFilter() {
      let query = {
        MDATE: this.month,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_main_trend', query)
      res.data.sort((a,b)=>{return a['RANK_ON'] - b['RANK_ON'] })
      this.TypeOptions = Object.freeze(Array.from(new Set(res.data.map((_) => _.S_OR_N))));
      let UserDat = (Array.from(new Set(res.data.map((_) => _.MAIN_CATEGORY))));
      UserDat= UserDat.filter((_)=>_!=='全部');
      UserDat.unshift('全部');
      this.Type2Options =UserDat;
    },

    ChartsDRigOnFun(OnData) {
      console.log("======sasdasdasdadasd1111111========")
      let UserData = []
      // let UserColor = ['#5B8FF9', '#B9D0FF', '#6D88B6', '#FD84B6', '#F6BD16', '#A285D2', '#6DC8EC']
      UserData = OnData.map((_) => {  
        return { value: _.MTD_MAIN_SAMP_QTY, name: _.MAIN_CATEGORY }
      })
      this.OptionsChartAre.series[0].data=UserData;

      // this.ChartsDRigOnVal = echarts.init(this.$refs['ChartsDRigOn'])
      // this.ChartsDRigOnVal.setOption({
      //   tooltip: {
      //     trigger: 'item',
      //     formatter:((params)=>{
      //       return params.name+'<br/>'+'摆场数：'+params.value+'<br/>'+'占比：'+(params.percent).toFixed(2)+'%'
      //     })
      //   },
      //   legend: {
      //     top: '5%',
      //     show:true,
      //     // left: 'center',
      //     // fontSize:'3',
      //     textStyle:{
      //       fontSize:12
      //     },
      //     itemHeight:8,
      //     orient: 'vertical', //垂直显示
      //     y: 'center', //延Y轴居中
      //     x: 'right', //居右显示
      //   },
      //   color: UserColor,
      //   series: [
      //     {
      //       name: '主体类目摆场占比',
      //       type: 'pie',
      //       radius: ['40%', '70%'],
      //       center: ['35%', '50%'],
      //       avoidLabelOverlap: false,
      //       label: {
      //         show: false,
      //         position: 'center',
      //       },
      //       emphasis: {
      //         label: {
      //           show: false,
      //           fontSize: '40',
      //           fontWeight: 'bold',
      //         },
      //       },
      //       labelLine: {
      //         show: false,
      //       },
      //       data: UserData,
      //     },
      //   ],
      // })

    },

    ChartsDBarOnFun(OnData) {

      // this.ChartsDBarOnData=this.OptionsChart;
      // this.ChartsDBarOnVal = echarts.init(this.$refs['ChartsDBarOn'])
      let Userlab = []
      let UserData = []
      OnData.sort((a, b) => {
        return b['MTD_MAIN_SALSAMP_DIFF']-a['MTD_MAIN_SALSAMP_DIFF']
      })
      Object.keys(OnData).forEach((OnKey) => {
        Userlab.push(OnData[OnKey].MAIN_CATEGORY)
        UserData.push({
          value: (OnData[OnKey].MTD_MAIN_SALSAMP_DIFF * 100 || 0).toFixed(2),
          itemStyle: { color: OnData[OnKey].MTD_MAIN_SALSAMP_DIFF > 0 ? '#ff5953' : '#00a854' },
        })
      })
      this.ChartsDBarOnData.series[0].type = 'bar'
      this.ChartsDBarOnData.series[0].itemStyle.normal.barBorderRadius = [0, 0, 0, 0]
      this.ChartsDBarOnData.xAxis[0].data = Userlab
      this.ChartsDBarOnData.yAxis[0].axisLabel.formatter = '{value} %'
      this.ChartsDBarOnData.tooltip.trigger = 'axis'
      this.ChartsDBarOnData.tooltip.formatter = (params) => {

        return params[0].name + '<br/>' + params[0].marker + params[0].value + '%'
      }
      this.ChartsDBarOnData.series[0].data = UserData
      this.ChartsDBarOnData.series[1].data = null

      // this.ChartsDBarOnVal.setOption(this.OptionsChart)
    },

    CRightTableOnFun(OnData, type) {
      // this.CRightTableOnVal = echarts.init(this.$refs['CRightTableOn'])
      let Userlab = []
      let UserData = []
      let AgoUserData = []
      let YaerOn = moment(new Date()).format('YYYY')

      Object.keys(OnData).forEach((OnKey) => {
        Userlab.push(OnData[OnKey].MDATE_MONTH)
        if (type === '主体摆场占比') {
          UserData.push(this.UnitNum('percent',OnData[OnKey].MTD_MAIN_SAMP_RATE))
          AgoUserData.push(this.UnitNum('percent',OnData[OnKey].AGO_MAIN_SAMP_RATE))
        } else if (type === '主体无效摆场占比') {
          UserData.push(this.UnitNum('percent',OnData[OnKey].MTD_MAIN_INVSAMP_RATE))
          AgoUserData.push(this.UnitNum('percent',OnData[OnKey].AGO_MAIN_INVSAMP_RATE))
        } else if (type === '主体摆场动销率') {
          UserData.push(this.UnitNum('percent',OnData[OnKey].MTD_MAIN_SALSAMP_RATE))
          AgoUserData.push(this.UnitNum('percent',OnData[OnKey].AGO_MAIN_SALSAMP_RATE))
        }
      })
      this.OptionsChart.series[0].type = 'line'
      this.OptionsChart.xAxis[0].data = Userlab
      this.OptionsChart.series[0].data = UserData
      this.OptionsChart.series[1].data = AgoUserData
      this.OptionsChart.yAxis[0].axisLabel.formatter = '{value}%'
      this.OptionsChart.tooltip.trigger = 'axis'
      this.OptionsChart.tooltip.formatter = (params) => {

        return params[0].name + '<br/>' + YaerOn + '年：' + params[0].marker + params[0].value + ((params[0].value=='--')?'':'%')+'<br/>'
        +(YaerOn-1) + '年：' + params[1].marker + params[1].value+((params[1].value=='--')?'':'%')
      }

      // this.CRightTableOnVal.setOption(this.OptionsChart)
    },

    disabledDate(current) {
      return current && current > moment()
    },

    UnitNum(type, Num) {
      Num = Num ? Num : 0
      type = type ? type : null
      if (type === 'Rate' && Num !== '--') {
        Num = (Num * 100).toFixed(1) + '%'
      }else if(type === 'percent' && Num !== '--'){
        Num = (Num==0)?'--':(Num * 100).toFixed(1)
      }else if(type ==='IsNull' && Num !== '--'){
        Num = (Num==0)?'--':Num
      }else if (type === 'round') {
          return (Num==0)?'--':((Num * 1).toFixed(0) * 1).toLocaleString()
      }else {
        Num
      }
      return Num
    },
  },
}
</script>

<style lang="scss" scoped>
.SFPinRate {
  .header {
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .content {
    // height: calc(100% - 38px);
    height: calc(100% - 38px);
    --height: 100%;
    display: flex;
    .ConLeft {
      // flex: 1;
      flex: 474;
      min-width: 474px;
      margin-right: 30px;
      height: calc(100%)!important;
      
      .MPCharts_new_all{
        height: calc(100% - 395px)!important; 
        width: 100%;

        .MPCharts_new{
          width: 100%;
          height: calc(100%)!important;
          display: flex;
          .MPCharts_new_L{
            flex: 1;
            width: 100%;
            padding-right: 40px;
            height: calc(100%)!important; 
            .MPChartsDRTitle {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #444444;
              line-height: 17px;
            }
          }
          .MPCharts_new_R{
            flex: 1;
            width: 100%;
            height: calc(100%)!important; 
            .MPChartsDRTitle {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #444444;
              line-height: 17px;
            }
          }
        }        
      }



      .MainPen {
        margin-top: 10px;
        margin-bottom: 13px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .label {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 400;
          color: #000000;
          line-height: 20px;
        }
      }
      .MPPopulation {
        .MPindex {
          display: flex;
          .MPindexCont {
            flex: 1;
            .MPICTitle {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.64);
              line-height: 22px;
            }
            .MPICTitleVal {
              font-size: 18px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 600;
              color: #3c3c3c;
              line-height: 24px;
            }
            .MPConVal {
              display: flex;
              .MPConValName {
                flex: 1;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 18px;
              }
              .MPConValVal {
                flex: 1;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.64);
                line-height: 18px;
              }
              .ISRead {
                color: #ff5953;
              }
              .ISGreen {
                color: #00a854;
              }
            }
          }
        }
      }

      // .MPCharts{
      //   height: calc(100% -125px -190px)!important; 
      //   position: relative;
      //   .MPChartsDown {
      //     display: flex;
      //     .MPChartsDRTitle {
      //       font-size: 12px;
      //       font-family: PingFangSC-Regular, PingFang SC;
      //       font-weight: 400;
      //       color: #444444;
      //       line-height: 17px;
      //     }
      //     .MPChartsDRig {
      //       flex: 1;
      //       padding-right: 30px;
      //       position: relative;
      //       .MPChartsDRCont {
      //         padding-top: 10px;
      //         width: 100%;
      //         position: relative;
      //         // height: 180px;
      //         // height: calc((100vh * 0.76 * 0.214) + 10px)!important;
      //         // height: calc(100% - 372px)!important;         
      //         // height: calc(100% - 30px)!important;   
      //         // max-height: 180px;   
      //         // height: 100%;
      //         // height: var(--height);
      //       }
      //     }
      //     .MPChartsDBar {
      //       flex: 2;
      //       .MPChartsDBCont {
      //         padding-top: 10px;
      //         width: 100%;
      //         position: relative;
      //         // height: 180px;
      //         // height: calc((100vh * 0.76 * 0.214) + 10px)!important;
      //         // height: calc(100% + 30px)!important; 
      //         // max-height: 180px;  
      //       }
      //     }

      //   }        
      // }




    }
    .ConRight {
      // flex: 1;
      flex: 584;
      min-width: 584px;
      .MainPen {
        margin-top: 10px;
        margin-bottom: 13px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .label {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 400;
          color: #000000;
          line-height: 20px;
        }
      }
      .SelectAss {
        display: flex;
        .SelectAssC {
          padding-right: 30px;
        }
      }
      .Choice {
        margin-top: 13px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .ChoiceLeft{
          span{
            /deep/ .ant-radio-wrapper{
              font-size: 12px;
            }
          }

        }
        .ChoiceRight {
          margin-bottom: 20px;
          align-items: center;

          span:nth-child(1),
          span:nth-child(2) {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #8c8c8c;
            line-height: 17px;
          }
          span:nth-child(1)::before,
          span:nth-child(2)::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 2px;
            background: #5c8ff9;
            margin-right: 5px;
            margin-left: 5px;
            margin-bottom: 3px;
          }
          span:nth-child(2)::before {
            background: #e7e7e7;
          }
        }
      }

      .CRightTable {
        height: calc(100% - 265px)!important; 
        width: 100%;
        .CRightTableCon {
          width: 100%;
          height: calc(100%)!important;
          // height: 290px;
          // height: calc((100vh * 0.76 * 0.45) - 8px)!important;
        }
      }

      .tableCss {
        display: flex;
        position: relative;
        // /deep/ .col {
        //   min-width: 70px;
        //   max-width: 70px;
        // }
      }
    }
  }
}

.MPTableNew {
  .MPTableNewUl,
  .MPTableNewUl li ul {
    margin: 0px;
    padding: 0px;
  }

  .MPTableNewUl li ul {
    display: flex;
    li {
      flex: 1;
    }
  }

  .MPTableNewUl {
    list-style: none;
    li.MPTTitle ul li,
    li.MPTCont ul li {
      list-style: none;
    }

    li.MPTTitle ul li.top0 {
      border-left: 1px solid #e7e9f0;
    }
    li.MPTTitle ul li {
      background: #f5f7ff;

      height: 25px;
      line-height: 25px;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(0, 0, 0, 0.88);

      padding: 0 8px;
      border-top: 1px solid #e7e9f0;
      border-right: 1px solid #e7e9f0;
      // border-left: 1px solid #e7e9f0;
      text-align: center;
    }

    li.MPTCont ul li {
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(0, 0, 0, 0.88);
      padding: 0 8px;
      border-top: 1px solid #e7e9f0;
      border-right: 1px solid #e7e9f0;
      // border-left: 1px solid #e7e9f0;
      text-align: center;
    }

    li.MPTCont ul li.title_name:hover{
      text-decoration-line: underline; cursor: pointer;
      color: #4C89FF;
    }

    // li.MPTCont ul li.border-bottomO{  
    //   border-bottom: 1px solid #e7e9f0;
    // }
    li.border-bottomO{
      border-bottom: 1px solid #e7e9f0;
    }

    li.MPTCont ul li.ISRead {
      color: #ff5953;
    }
    li.MPTCont ul li.ISGreen {
      color: #00a854;
    }
    li.MPTCont ul li.ISChoose {
      color: #4C89FF;
    }
  }
}

.selectMenu {
  position: absolute;
  background: #fff;
  border-radius: 2px;
  border: 1px solid #ccc;
  z-index: 2;
  .item {
    cursor: text;
    padding: 5px 20px;
    font-size: 12px;
    color: #666;
  }
  .item:hover {
    background: #f3f3f3;
  }
}
</style>