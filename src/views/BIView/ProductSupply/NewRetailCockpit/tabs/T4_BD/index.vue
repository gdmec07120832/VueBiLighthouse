<template>
  <div class="BD">
    <div class="header">
      <Title class="title" :label="'BD货总览'" />
      <div class="TSwitch">

        <div class="TSwitchOn">
          <a-radio-group v-model="AreaData.area" style="line-height: 30px">
            <a-radio :value="item" v-for="item in AreaData.areaOption" :key="item">
              {{ item }}
            </a-radio>
          </a-radio-group>
          <span v-if="AreaData.area==='摆场'" style="padding-right: 13px;font-size: 12px;">统计月份</span>
          <a-month-picker v-if="AreaData.area==='摆场'" 
            v-model="month_Pen" :disabledDate='disabledDate' format="YYYY-MM" valueFormat="YYYYMM" :allowClear="false" />  
        </div>

      </div>
    </div>
    <div class="main">
      <div class="BDDeliver" v-if="AreaData.area==='发货'">
        <div class="leftBox">
          <div class="select">
            <div class="label">BD货总览</div>
            <a-month-picker
              :disabledDate="disabledDate"
              v-model="month"
              format="YYYY-MM"
              valueFormat="YYYYMM"
              :allowClear="false"
              style="width: 150px"
            />
          </div>
          <div class="panel">
            <div class="col1">
              <div>BD货占比</div>
              <div :class="[computeColor('rate', panelData.PTD_BD_DEV_RATE, panelData.PTD_BD_DEV_TGT)]">
                {{ panelData.PTD_BD_DEV_RATE }}
              </div>
            </div>
            <div class="box"></div>
            <div class="col2">
              <div>目标</div>
              <div>{{ panelData.PTD_BD_DEV_TGT }}</div>
            </div>
            <div class="col3">
              <div>差值</div>
              <div :class="[computeColor('diff', panelData.PTD_BD_DEV_DIFF)]">{{ panelData.PTD_BD_DEV_DIFF }}</div>
            </div>
          </div>
          <div class="echart">
            <v-chart
              ref="echart"
              class="line"
              style="height: 80px; width: 80px; overflow: visible"
              :options="circle"
              autoresize
            ></v-chart>
            <div class="echartsData">
              <div class="row1">
                <div class="col1">
                  <div>B货占比</div>
                  <div :class="[computeColor('rate', panelData.PTD_B_DEV_RATE, panelData.PTD_B_DEV_TGT)]">
                    {{ panelData.PTD_B_DEV_RATE }}
                  </div>
                </div>
                <div class="col2">
                  <div>目标</div>
                  <div>{{ panelData.PTD_B_DEV_TGT }}</div>
                </div>
                <div class="col3">
                  <div>差值</div>
                  <div :class="[computeColor('diff', panelData.PTD_BD_DEV_DIFF)]">{{ panelData.PTD_B_DEV_DIFF }}</div>
                </div>
              </div>
              <div class="row2">
                <div class="col1">
                  <div>D货占比</div>
                  <div :class="[computeColor('rate', panelData.PTD_D_DEV_RATE, panelData.PTD_D_DEV_TGT)]">
                    {{ panelData.PTD_D_DEV_RATE }}
                  </div>
                </div>
                <div class="col2">
                  <div>目标</div>
                  <div>{{ panelData.PTD_D_DEV_TGT }}</div>
                </div>
                <div class="col3">
                  <div>差值</div>
                  <div :class="[computeColor('diff', panelData.PTD_D_DEV_DIFF)]">{{ panelData.PTD_D_DEV_DIFF }}</div>
                </div>
              </div>
            </div>
          </div>
<!--          <div class="categoryXTitle">-->
<!--            <span>区域货品结构</span>-->
<!--&lt;!&ndash;            <span>B货占比</span>&ndash;&gt;-->
<!--&lt;!&ndash;            <span>D货占比</span>&ndash;&gt;-->
<!--          </div>-->
          <div class="mt10" style="position: relative;height: calc(100% - 231px)">
            <span style="position: absolute">区域货品结构</span>
            <v-chart ref="bar" class="categoryX" style="overflow: visible" :options="categoryX" autoresize></v-chart>
          </div>
        </div>
        <div class="border"></div>
        <div class="rightBox">
          <div class="select">
            <div class="left">
              <div>BD货趋势（{{ type }}）</div>
              <span style="display: flex">
                <span style="margin-right: 10px">区域</span>
                <a-radio-group v-model="area">
                  <a-radio :value="item" v-for="item in areaOption" :key="item">
                    {{ item }}
                  </a-radio>
                </a-radio-group>
              </span>
            </div>
            <Select :label="'货品分类'" :value.sync="type" :options="['B货', 'D货', 'BD货']" />
          </div>
          <v-chart ref="barAndLine" class="line" style="overflow: visible" :options="line" autoresize></v-chart>
          <Table v-bind="table" class="table" />
          <Jump style="display: none" />
        </div>
      </div>

      <div class="BDPendulum" v-if="AreaData.area==='摆场'">
        <div class="BDPenOverView">
          <div class="BDPenLeft">
            <div class="SubPenLeft">
              <div class="SubPenTitle">
                <div class="LabelCss">BD货摆场数量</div>
                <div class="ValCss">{{IndexData.Num.value1}}</div>
              </div>
              <div class="SubPenIndex">
                <div class="LabelCss">占比：</div>
                <div class="ValCss">{{IndexData.Num.value2}}</div>
              </div>
              <div class="SubPenIndex">
                <div class="LabelCss">较同期：</div>
                <div class="ValCss" :class="[(IndexData.Num.value3.replace(/%/g,''))?(IndexData.Num.value3.replace(/%/g,'')>0)?'red':'green':'' ]">
                  {{IndexData.Num.value3}}</div>
              </div>
            </div>
            <div class="SubPenRight">
              <div class="UALChartTitle">
                <div class="UATName">区域对比</div>
                <div class="UATlegend">
                  <span>{{'当期'}}</span>
                  <span>{{'同期'}}</span>
                </div>
              </div>
              <v-chart ref="ChartNum" class="ChartNumCss" style="overflow: visible" :options="EchartPenL" autoresize></v-chart>
            </div>
          </div>

          <div class="BDPenRight">
            <div class="SubPenLeft">
              <div class="SubPenTitle">
                <div class="LabelCss">BD货摆场业绩</div>
                <div class="ValCss">{{IndexData.Amt.value1}}</div>
              </div>
              <div class="SubPenIndex">
                <div class="LabelCss">占比：</div>
                <div class="ValCss">{{IndexData.Amt.value2}}</div>
              </div>
              <div class="SubPenIndex">
                <div class="LabelCss">较同期：</div>
                <div class="ValCss" :class="[(IndexData.Amt.value3.replace(/%/g,''))?(IndexData.Amt.value3.replace(/%/g,'')>0)?'red':'green':'' ]">
                  {{IndexData.Amt.value3}}</div>
              </div>
            </div>
            <div class="SubPenRight">
              <div class="UALChartTitle">
                <div class="UATName">区域对比</div>
                <div class="UATlegend">
                  <span>{{'当期'}}</span>
                  <span>{{'同期'}}</span>
                </div>
              </div>
              <v-chart ref="ChartAmt" class="ChartAmtCss" style="overflow: visible" :options="EchartPenR" autoresize></v-chart>
            </div>
          </div>
        </div>

        <div class="BDPenTrend">
          <!-- background: #fafafa; -->
          <div class="BDPenChoice" style="padding: 5px;justify-content: flex-end;display: flex;padding-right: 0px;">
            <span style="display: flex">
              <span style="margin-right: 10px">区域</span>
              <a-radio-group v-model="RegionPen.area">
                <a-radio :value="item" v-for="item in RegionPen.areaOption" :key="item">
                  {{ item }}
                </a-radio>
              </a-radio-group>
            </span>
          </div>

          <div class="BDPenTreDiv">
            <div class="BDPenTLeft">
              <div class="BDPenTLTitle">摆场数占比趋势</div>
              <div class="BDPenTreLChert">
                <v-chart ref="BDPenTreL" class="BDPenTreLCss" style="overflow: visible" :options="EchartPLinL" autoresize></v-chart>
              </div>
            </div>
            <div class="BDPenTRight">
              <div class="BDPenTRTitle">摆场业绩占比趋势</div>
              <div class="BDPenTreRChert">
                <v-chart ref="BDPenTreR" class="BDPenTreRCss" style="overflow: visible" :options="EchartPLinR" autoresize></v-chart>
              </div>
            </div>
          </div>
        </div>
        <div class="BDPenTable">
          <Tabletcq v-bind="TableCate" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 做T+1处理开始
let _time_now=new Date();
_time_now=_time_now.getTime()-(24*60*60*1000);
_time_now=new Date(_time_now);
// 做T+1处理结束
import Title from '../../components/Title'
import moment from 'moment'
// import CircleEchart from "@/views/BIView/ProductSupply/NewRetailCockpit/components/CircleEchart";
import base from '../../utils/base'
import Table from '../../components/Table'
import Jump from '../../components/Jump'
// import * as echarts from 'echarts5/lib/echarts'
import Tabletcq from '../../components/tabletcq.vue'
import echartStyle from '../../utils/echartStyle';
export default {
  mixins: [base],
  components: {
    Title,
    Table,
    Jump,
    Tabletcq,
  },
  watch: {
    month() {
      this.getOverview()
      this.getCategoryX()
    },
    areaAndType() {
      this.getTrend()
    },
    month_Pen(){
      this.GetOverviewPen();
      this.GetTrendPen();
    },
    'RegionPen.area'(){
      this.GetTrendPen();
    }
  },
  computed: {
    areaAndType() {
      return this.type + this.area
    },
  },
  async created() {
    let that = this
    this.circle = await this.createCircle();
    this.categoryX = await this.createCategoryX();
    this.categoryX.grid.top = 30
    this.categoryX.grid.bottom = 0
    this.line = await this.createBarAndLineEchart();
    this.EchartPenL = await this.createBarAndLineEchart();
    this.EchartPenL.yAxis[0].splitLine.show = false
    this.EchartPenR = await this.createBarAndLineEchart();
    this.EchartPenR.yAxis[0].splitLine.show = false
    this.EchartPLinL = await this.createBarAndLineEchart();
    this.EchartPLinR = await this.createBarAndLineEchart();
    this.line.yAxis[0].axisLabel.formatter = function (val) {
      if (val === 0) return 0
      else return that.handleNum('round', val)
    }
    this.line.tooltip.formatter = function (params) {
      let key = ''
      if (that.type === 'BD货') key = 'BD货占比'
      else if (that.type === 'B货') key = 'B货占比'
      else if (that.type === 'D货') key = 'D货占比'
      return `统计日期：${params[0].data[0]}<br/>${key}：${that.handleNum(
        'percent',
        params[0].data[1]
      )}<br/>${key}目标：${that.handleNum('percent', params[0].data[2])}`
    }
    this.line.yAxis[0].axisLabel.formatter = function (value) {
      return that.handleNum('percent', value)
    }
    this.line.grid.bottom = 0
    this.line.grid.top = 20
    this.line.series[0].itemStyle.normal.barBorderRadius = 0
    this.getOverview()
    this.getCategoryX()
    this.getTrend()
    // await this.getOption()


    // 迭代
    this.TableCate.labelD=['类目','销额','销额占比','目标毛利率','毛利率'];
    this.TableCate.tableD=[
      ['合计',0,0,0,0],
      ['东区',0,0,0,0],
      ['南区',0,0,0,0],
      ['西区',0,0,0,0],
      ['北区',0,0,0,0],
      ['北区',0,0,0,0],
    ];
    this.GetOverviewPen();
    this.GetTrendPen();


  },
  beforeDestroy() {
    this.circle === null ? (this.circle = null) : null;
    this.line === null ? (this.line = null) : null;
    this.categoryX === null ? (this.categoryX = null) : null;
    this.EchartPenL === null ? (this.EchartPenL = null) : null;
    this.EchartPenR === null ? (this.EchartPenR = null) : null;
    this.EchartPLinL === null ? (this.EchartPLinL = null) : null;
    this.EchartPLinR === null ? (this.EchartPLinR = null) : null;

    
    
  },
  data() {
    return {
      // 迭代
      AreaData:{
        area: '发货',
        areaOption: ['发货', '摆场'],
      },
      month_Pen: moment(_time_now).format('YYYYMM'),
      TableCate:{
        index:'T4_BDPen',
        IsMerge:true,
        labelD:[],
        tableD:[],
      },
      RegionPen:{
        area: '总体',
        areaOption: ['总体', '东区', '南区', '西区', '北区'],
      },
      IndexData:{
        Num:{value1:0,value2:0,value3:0},
        Amt:{value1:0,value2:0,value3:0}        
      },
      EchartPenL:null,
      EchartPenR:null,
      EchartPLinL:null,
      EchartPLinR:null,
      // 迭代

      panelData: {
        PTD_BD_DEV_AMT: '--',
        PTD_BD_DEV_DIFF: '--',
        PTD_BD_DEV_RATE: '--',
        PTD_BD_DEV_TGT: '--',
        PTD_B_DEV_AMT: '--',
        PTD_B_DEV_DIFF: '--',
        PTD_B_DEV_RATE: '--',
        PTD_B_DEV_TGT: '--',
        PTD_DLVR_AMT: '--',
        PTD_D_DEV_AMT: '--',
        PTD_D_DEV_DIFF: '--',
        PTD_D_DEV_RATE: '--',
        PTD_D_DEV_TGT: '--',
      },
      // month: moment(new Date()).format('YYYYMM'),
      month:
        moment(new Date()).format('DD') === '01'
          ? moment(new Date()).subtract(1, 'month').format('YYYYMM')
          : moment().format('YYYYMM'),
      circle: null,
      area: '总体',
      areaOption: ['总体', '东区', '南区', '西区', '北区'],
      type: 'B货',
      line: null,
      table: {
        index: 'BD',
        labelData: ['指标', '目标占比', '实际占比', '目标差值', '同期占比', '同期差值'],
        tableData: [],
      },
      categoryX: null,
    }
  },
  methods: {
    computeColor(type, val1, val2) {
      if (val1 === null || val1 === undefined || val1 === '--') return
      if (type === 'rate') {
        if (val1 >= val2) return 'red'
        else if (val1 < val2) return 'green'
      } else if (type === 'diff') {
        if (val1.split('%')[0] >= 0) return 'red'
        else if (val1.split('%')[0] < 0) return 'green'
      }
    },
    async getOverview() {
      let query = {
        MDATE: this.month,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_bd_sum', query)
      this.handleData('overview', res.data)
      console.log(res)
    },
    async getOption() {
      let res = await this.$fetchSql('new_retail', 'new_retail_bd_src')
      console.log(res)
    },
    async getCategoryX() {
      let query = {
        MDATE: this.month,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_bd_area', query)
      this.handleData('categoryX', res.data)
    },
    async getTrend() {
      let query = {
        S_OR_N: this.area,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_bd_trend', query)
      this.handleData('trend', res.data)
      this.handleData('table', res.data)
      console.log(res)
    },
    handleData(type, source) {
      if (type === 'overview') {
        for (let key in this.panelData) {
          this.panelData[key] = '--'
        }
        if (!source.length) return
        let arr = source.concat()
        this.panelData = arr[0]
        for (let key in this.panelData) {
          this.panelData[key] = this.handleNum('percent', this.panelData[key])
        }
        console.log(source, source[0].PTD_B_DEV_RATE.split('%')[0], this.circle.series)
        let newArr = []
        newArr.push(source[0].PTD_B_DEV_RATE.split('%')[0])
        newArr.push(source[0].PTD_D_DEV_RATE.split('%')[0])
        this.circle.series[0].data = newArr
      } else if (type === 'categoryX') {
        this.categoryX.series[0].data = []
        this.categoryX.series[1].data = []
        this.categoryX.xAxis[1].data = []
        this.$refs?.bar?.$refs?.echarts?.clear()
        if (!source.length) return
        let arr = []
        arr.push(source.filter((_) => _.S_OR_N === '东区')[0])
        arr.push(source.filter((_) => _.S_OR_N === '南区')[0])
        arr.push(source.filter((_) => _.S_OR_N === '西区')[0])
        arr.push(source.filter((_) => _.S_OR_N === '北区')[0])
        let keys = ['PTD_B_DEV_RATE', 'PTD_D_DEV_RATE']
        this.categoryX.series[0].data = arr.map((item) => {
          return item[keys[0]]
        })
        this.categoryX.series[1].data = arr.map((item) => {
          return item[keys[1]]
        })
        this.categoryX.xAxis[1].data = arr.map((item) => {
          return item[keys[0]] + item[keys[1]]
        })
      } else if (type === 'trend') {
        this.line.series[0].data = []
        this.line.series[1].data = []
        this.line.xAxis[0].data = []
        this.$refs?.barAndLine?.$refs?.echarts?.clear()
        if (!source.length) return
        let arr = source.filter((_) => _.MONTH_DATE !== '年均')
        arr.sort((a, b) => a.MONTH_DATE.split('月')[0] - b.MONTH_DATE.split('月')[0])
        this.line.xAxis[0].data = Object.freeze(
          Array.from(
            new Set(
              arr.map((_) => {
                if (_.MONTH_DATE.split('月')[0] < 10)
                  return moment().format('YYYY年') + _.MONTH_DATE.split('月')[0].split('0')[1] + '月'
                else return moment().format('YYYY年') + _.MONTH_DATE
              })
            )
          )
        )
        let keys = []
        if (this.type === 'BD货') {
          keys = ['MONTH_DATE', 'PTD_BD_DEV_RATE', 'PTD_BD_DEV_TGT']
        } else if (this.type === 'B货') {
          keys = ['MONTH_DATE', 'PTD_B_DEV_RATE', 'PTD_B_DEV_TGT']
        } else if (this.type === 'D货') {
          keys = ['MONTH_DATE', 'PTD_D_DEV_RATE', 'PTD_D_DEV_TGT']
        }
        this.line.series[0].data = arr.map((item, index) => {
          if (
            moment(moment(this.month).format('YYYY') + item.MONTH_DATE.split('月')[0]).format('x') >
            moment().format('x')
          )
            return [index]
          return keys.map((key) => {
            if (key === 'MONTH_DATE') {
              if (item.MONTH_DATE.split('月')[0] < 10)
                return moment().format('YYYY年') + item.MONTH_DATE.split('月')[0].split('0')[1] + '月'
              else return moment().format('YYYY年') + item.MONTH_DATE
            }
            return item[key]
          })
        })
        this.line.series[1].data = arr.map((item, index) => {
          if (
            moment(moment(this.month).format('YYYY') + item.MONTH_DATE.split('月')[0]).format('x') >
            moment().format('x')
          )
            return [index]
          return [
            item.MONTH_DATE.split('月')[0] < 10
              ? moment().format('YYYY年') + item.MONTH_DATE.split('月')[0].split('0')[1] + '月'
              : moment().format('YYYY年') + item.MONTH_DATE,
            item[keys[2]],
          ]
        })
      } else if (type === 'table') {
        this.table.tableData = []
        if (!source.length) return
        let arr = source.filter((_) => _.MONTH_DATE !== '年均')
        arr.sort((a, b) => a.MONTH_DATE.split('月')[0] - b.MONTH_DATE.split('月')[0])
        arr.unshift(source.filter((_) => _.MONTH_DATE === '年均')[0])
        let keys = []
        if (this.type === 'BD货') {
          keys = [
            'MONTH_DATE',
            'PTD_BD_DEV_TGT',
            'PTD_BD_DEV_RATE',
            'PTD_BD_DEV_DIFF',
            'AGO_BD_DEV_RATE',
            'AGO_BD_DEV_DIFF',
          ]
        } else if (this.type === 'B货') {
          keys = ['MONTH_DATE', 'PTD_B_DEV_TGT', 'PTD_B_DEV_RATE', 'PTD_B_DEV_DIFF', 'AGO_B_DEV_RATE', 'AGO_B_DEV_DIFF']
        } else if (this.type === 'D货') {
          keys = ['MONTH_DATE', 'PTD_D_DEV_TGT', 'PTD_D_DEV_RATE', 'PTD_D_DEV_DIFF', 'AGO_D_DEV_RATE', 'AGO_D_DEV_DIFF']
        }
        this.table.tableData = arr.map((item, col) => {
          return keys.map((key, row) => {
            if (col === 0) {
              return item[key]
            }
            if (row === 0) {
              if (item[key].split('月')[0] < 10)
                return moment().format('YYYY年') + item[key].split('月')[0].split('0')[1] + '月'
              else return moment().format('YYYY年') + item[key]
            } else if (col !== 0 && row !== 4) {
              let month = moment(this.month).format('YYYY') + item[keys[0]].split('月')[0]
              if (moment(month).format('x') <= moment(new Date()).format('x')) {
                return item[key]
              } else return null
            } else if (col !== 0 && row === 4) {
              return item[key]
            }
          })
        })
      }
    },


    // 迭代
    async GetOverviewPen() {
      let query = {
        MDATE: this.month_Pen,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_bdbc_sum', query);
      res.data.sort((a, b) => a.RANK_ON - b.RANK_ON);



      // 数量趋势
      this.EchartPenL.xAxis[0].data=[];
      this.EchartPenL.series[0].data=[];  
      this.EchartPenL.series[0].name = '当期'
      this.EchartPenL.yAxis[0].axisTick.show = false;
      this.EchartPenL.yAxis[0].axisLine.show = false;
      this.EchartPenL.yAxis[0].axisLabel.show = false;
      this.EchartPenL.yAxis[0].axisLabel.formatter = '{value}%';
      this.EchartPenL.yAxis[0].axisLabel.interval = 2;
      this.EchartPenL.yAxis[0].splitNumber = '2';
      this.EchartPenL.yAxis[0].min = 0;     
      this.EchartPenL.series[1] = {
        name: '同期',
        type: 'bar',
        barWidth: '20',
        data: [],
        itemStyle: {
            normal: {
                color: function (params) {
                    let color = ['#00a854', '#ff5953', '#DFDFDF']
                    // 2 目标 1 业绩
                    if (params.data[2] === null || params.data[2] === '--' || params.data[2] === undefined) return color[2]
                    let index = params.data[1] - params.data[2] >= 0 ? 1 : 0
                    return color[index]
                },
                barBorderRadius: [10, 10, 0, 0]
            }
        },
        label: {
            show: false,
            position: 'top'
        },
        z: 1,
      }
      // 业绩趋势
      this.EchartPenR.xAxis[0].data=[];
      this.EchartPenR.series[0].data=[];  
      this.EchartPenR.series[0].name = '当期'
      this.EchartPenR.yAxis[0].axisTick.show = false;
      this.EchartPenR.yAxis[0].axisLine.show = false;
      this.EchartPenR.yAxis[0].axisLabel.show = false;
      this.EchartPenR.yAxis[0].axisLabel.formatter = '{value}%';
      this.EchartPenR.yAxis[0].axisLabel.interval = 2;
      this.EchartPenR.yAxis[0].splitNumber = '2';
      this.EchartPenR.yAxis[0].min = 0;     
      this.EchartPenR.series[1] = {
        name: '同期',
        type: 'bar',
        barWidth: '20',
        data: [],
        itemStyle: {
            normal: {
                color: function (params) {
                    let color = ['#00a854', '#ff5953', '#DFDFDF']
                    // 2 目标 1 业绩
                    if (params.data[2] === null || params.data[2] === '--' || params.data[2] === undefined) return color[2]
                    let index = params.data[1] - params.data[2] >= 0 ? 1 : 0
                    return color[index]
                },
                barBorderRadius: [10, 10, 0, 0]
            }
        },
        label: {
            show: false,
            position: 'top'
        },
        z: 1,
      }

      if(res.data.length>0){
        let Sum= res.data.filter((_)=>_.S_OR_N === '总体')[0];
        this.IndexData={
          Num:{value1:this.handleNum('round',Sum.MTD_BD_SAMPL_PAY_CNT) ,
            value2:this.handleNum('percent',Sum.MTD_BD_CNT_RATE),
            value3:this.handleNum('percent',Sum.MTD_BD_CNT_RATE_YOY)}, 
          Amt:{value1: this.handleNum('round',Sum.MTD_BD_SAMPL_PAY_AMT),
            value2: this.handleNum('percent',Sum.MTD_BD_AMT_RATE),
            value3: this.handleNum('percent',Sum.MTD_BD_AMT_RATE_YOY)}     
        }
        let CountDat= res.data.filter((_)=>_.S_OR_N !== '总体');
        Object.keys(CountDat).forEach((OnKey) => {
          this.EchartPenL.xAxis[0].data.push(CountDat[OnKey].S_OR_N);
          this.EchartPenL.series[0].data.push(CountDat[OnKey].MTD_BD_CNT_RATE*100);
          this.EchartPenL.series[1].data.push(CountDat[OnKey].AGO_BD_CNT_RATE*100); 

          this.EchartPenR.xAxis[0].data.push(CountDat[OnKey].S_OR_N);
          this.EchartPenR.series[0].data.push(CountDat[OnKey].MTD_BD_AMT_RATE*100);
          this.EchartPenR.series[1].data.push(CountDat[OnKey].AGO_BD_AMT_RATE*100); 
        });
        // 数量趋势
        this.EchartPenL.tooltip.formatter=((params)=>{
          let sentval='';
          if(params.length>1){
            sentval='区域：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'+'<br/>'+
              params[1].marker+params[1].seriesName+'：'+params[1].value.toFixed(1)+'%'
          }else{
            sentval='区域：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'
          }
          return sentval
        })
        // 业绩趋势
        this.EchartPenR.tooltip.formatter=((params)=>{
          let sentval='';
          if(params.length>1){
            sentval='区域：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'+'<br/>'+
              params[1].marker+params[1].seriesName+'：'+params[1].value.toFixed(1)+'%'
          }else{
            sentval='区域：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'
          }
          return sentval
        })

      }else{
        this.IndexData={
          Num:{value1:0,value2:0,value3:0},
          Amt:{value1:0,value2:0,value3:0}        
        } 
      }

    },
    async GetTrendPen() {

      let query = {
        S_OR_N:this.RegionPen.area,
        YDATE: moment(this.month_Pen).format('YYYY'), 
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_bdbc_trend', query);
      this.ChsrtsPenOn(res.data);
      this.TablePenOn(res.data);

    },

    ChsrtsPenOn(UserData){

      let CountDat = UserData.filter((_)=>_.MONTH_DATE!=='年均');
      CountDat.sort((a,b)=>{return a["MONTH_DATE"].replace(/[\u4e00-\u9fa5]/g,'')-b["MONTH_DATE"].replace(/[\u4e00-\u9fa5]/g,'')});

      // 数量趋势
      this.EchartPLinL.xAxis[0].data=[];
      this.EchartPLinL.series[0].data=[];  
      this.EchartPLinL.series[1].data=[];
      this.EchartPLinL.yAxis[0].axisLabel.formatter = '{value}%';
      this.EchartPLinL.yAxis[0].splitNumber = '2';
      
      this.EchartPLinL.series[0] = {
        name: '当期',
        type: 'line',
        data: [],
        itemStyle: {
          normal: {
            color: echartStyle.thisYear,
          }
        },
        lineStyle: {
            color: echartStyle.thisYear
        },
        smooth: true,
        z: 2,
        symbol: 'none',
      };
      this.EchartPLinL.series[1] = {
        name: '同期',
        type: 'line',
        data: [],
        itemStyle: { 
          normal: {
            color: echartStyle.previousYear
          }
        },
        z: 1,
        symbol: 'none'
      }

      // 业绩趋势
      this.EchartPLinR.xAxis[0].data=[];
      this.EchartPLinR.series[0].data=[];  
      this.EchartPLinR.series[1].data=[];
      this.EchartPLinR.yAxis[0].axisLabel.formatter = '{value}%';
      this.EchartPLinR.yAxis[0].splitNumber = '2';
      this.EchartPLinR.series[0] = {
        name: '当期',
        type: 'line',
        data: [],
        itemStyle: {
          normal: {
            color: echartStyle.thisYear
          }
        },
        lineStyle: {
            color: echartStyle.thisYear
        },
        smooth: true,
        z: 2,
        symbol: 'none',
      };
      this.EchartPLinR.series[1] = {
        name: '同期',
        type: 'line',
        data: [],
        itemStyle: { 
          normal: {
            color: echartStyle.previousYear
          }
        },
        z: 1,
        symbol: 'none',
      }

      if(UserData.length>0){
        Object.keys(CountDat).forEach((OnKey) => {
          this.EchartPLinL.xAxis[0].data.push(CountDat[OnKey].MONTH_DATE);
          if(CountDat[OnKey].MONTH_DATE.replace(/[\u4e00-\u9fa5]/g,'')*1<=(moment(_time_now).format('MM')*1)&&
            moment(this.month_Pen).format('YYYY')===moment(new Date()).format('YYYY')){
            this.EchartPLinL.series[0].data.push(CountDat[OnKey].MTD_BD_CNT_RATE*100);
            this.EchartPLinR.series[0].data.push(CountDat[OnKey].MTD_BD_AMT_RATE*100);
          }else if(moment(this.month_Pen).format('YYYY')!==moment(new Date()).format('YYYY')){
            this.EchartPLinL.series[0].data.push(CountDat[OnKey].MTD_BD_CNT_RATE*100);
            this.EchartPLinR.series[0].data.push(CountDat[OnKey].MTD_BD_AMT_RATE*100);
          }

          this.EchartPLinL.series[1].data.push(CountDat[OnKey].AGO_BD_CNT_RATE*100);

          this.EchartPLinR.xAxis[0].data.push(CountDat[OnKey].MONTH_DATE);
          this.EchartPLinR.series[1].data.push(CountDat[OnKey].AGO_BD_AMT_RATE*100);
        });    

        // 数量趋势
        this.EchartPLinL.tooltip.formatter=((params)=>{
          let sentval='';
          if(params.length>1){
            sentval='日期：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'+'<br/>'+
              params[1].marker+params[1].seriesName+'：'+params[1].value.toFixed(1)+'%'
          }else{
            sentval='日期：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'
          }
          return sentval
        });

        // 业绩趋势
        this.EchartPLinR.tooltip.formatter=((params)=>{
          let sentval='';
          if(params.length>1){
            sentval='日期：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'+'<br/>'+
              params[1].marker+params[1].seriesName+'：'+params[1].value.toFixed(1)+'%'
          }else{
            sentval='日期：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'
          }
          return sentval
        });
   
      }

    },

    TablePenOn(UserData){

      let CountDat = UserData.filter((_)=>_.MONTH_DATE!=='年均');
      CountDat.sort((a,b)=>{return a["MONTH_DATE"].replace(/[\u4e00-\u9fa5]/g,'')-b["MONTH_DATE"].replace(/[\u4e00-\u9fa5]/g,'')});
      let Sum = UserData.filter((_)=>_.MONTH_DATE==='年均')[0];
      CountDat.unshift(Sum);

      // console.log("===========吸纳啊大大！！！发发基督教世界============");
      // console.log(UserData);
      // console.log(CountDat);
      // console.log(Sum);
   

      this.TableCate.labelD=['指标','年度'];
      this.TableCate.tableD=[
        [{value:'摆场数占比',row:3,col:null},{value:moment(this.month_Pen).format('YYYY'),row:null,col:null},],
        [{value:'-1',row:null,col:null},{value:moment(this.month_Pen).format('YYYY')*1-1,row:null,col:null},],
        [{value:'-1',row:null,col:null},{value:'差值',row:null,col:null},],
        [{value:'摆场业绩占比',row:3,col:null},{value:moment(this.month_Pen).format('YYYY'),row:null,col:null},],
        [{value:'-1',row:null,col:null},{value:moment(this.month_Pen).format('YYYY')*1-1,row:null,col:null},],
        [{value:'-1',row:null,col:null},{value:'差值',row:null,col:null},],
      ];      
      if(UserData.length>0){
        Object.keys(CountDat).forEach((OnKey) => {
          this.TableCate.labelD.push(CountDat[OnKey].MONTH_DATE);
          this.TableCate.tableD[0].push({value:CountDat[OnKey].MTD_BD_CNT_RATE,row:null,col:null});
          this.TableCate.tableD[1].push({value:CountDat[OnKey].AGO_BD_CNT_RATE,row:null,col:null});
          this.TableCate.tableD[2].push({value:{value:CountDat[OnKey].MTD_BD_CNT_RATE-CountDat[OnKey].AGO_BD_CNT_RATE,value2:CountDat[OnKey].MTD_BD_CNT_RATE},
            row:null,col:null});
          this.TableCate.tableD[3].push({value:CountDat[OnKey].MTD_BD_AMT_RATE,row:null,col:null});
          this.TableCate.tableD[4].push({value:CountDat[OnKey].AGO_BD_AMT_RATE,row:null,col:null});
          this.TableCate.tableD[5].push({value:{value:CountDat[OnKey].MTD_BD_AMT_RATE-CountDat[OnKey].AGO_BD_AMT_RATE,value2:CountDat[OnKey].MTD_BD_AMT_RATE},
            row:null,col:null});
        });
      }




    }



    








  },
}
</script>

<style lang="scss" scoped>
.red {
  color: #ff5953 !important;
}
.green {
  color: #00a854 !important;
}
.BD {
  .header {
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .TSwitch{

    }
  }
  .main {
    height: calc(100% - 38px);

    .BDDeliver {
      height: 100%;
      display: flex;
      .leftBox {
        flex: 1;
        .select {
          margin-top: 10px;
          margin-bottom: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .label {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #000000;
            line-height: 20px;
          }
        }
        .panel {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .col1 {
            width: 92px;
            div:nth-child(1) {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: rgba(0, 0, 0, 0.88);
              line-height: 20px;
              margin-bottom: 6px;
            }
            div:nth-child(2) {
              font-size: 20px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 600;
              line-height: 24px;
            }
          }
          .box {
            flex: 1;
          }
          .col2 {
            text-align: center;
          }
          .col3 {
            text-align: right;
          }
          .col2,
          .col3 {
            flex: 1;
            div:nth-child(1) {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: #999999;
              line-height: 18px;
              margin-bottom: 3px;
            }
            div:nth-child(2) {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: rgba(0, 0, 0, 0.64);
              line-height: 18px;
            }
          }
        }
        .echart {
          margin-top: 24px;
          display: flex;
          .echartsData {
            margin-left: 12px;
            flex: 1;
            .row1,
            .row2 {
              display: flex;
              margin-bottom: 10px;
              justify-content: space-between;
              .col1 {
                text-align: left;
              }
              .col2 {
                text-align: center;
              }
              .col3 {
                text-align: right;
              }
              .col1,
              .col2,
              .col3 {
                flex: 1;
                div:nth-child(1) {
                  font-size: 12px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  color: #999999;
                  line-height: 18px;
                  position: relative;
                  margin-bottom: 2px;
                }
                div:nth-child(2) {
                  //text-align: right;
                  font-size: 12px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  color: rgba(0, 0, 0, 0.64);
                  line-height: 18px;
                }
              }
              .col1 div:nth-child(1)::before {
                content: '';
                display: inline-block;
                width: 7px;
                height: 3px;
                background: #5b8ff9;
                margin-right: 5px;
                margin-bottom: 5px;
              }
            }
            .row2 .col1 div:nth-child(1)::before {
              background: #f6c42f;
            }
          }
        }
        .categoryXTitle {
          display: grid;
          grid-template-columns: 1fr 80px 80px;
          margin-bottom: 20px;
          align-items: center;
          span:nth-child(1) {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            //font-weight: 600;
            color: #000000;
            line-height: 20px;
          }
          span:nth-child(2),
          span:nth-child(3) {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #8c8c8c;
            line-height: 17px;
          }
          span:nth-child(2)::before,
          span:nth-child(3)::before {
            content: '';
            display: inline-block;
            width: 7px;
            height: 3px;
            background: #5b8ff9;
            margin-right: 5px;
            margin-bottom: 3px;
          }
          span:nth-child(3)::before {
            background: #f6bd16;
          }
        }
        .categoryX {
          //height: calc(100% - 290px) !important;
        }
      }

      .border {
        padding: 30px;
      }
      .border::before {
        display: block;
        width: 1px;
        height: 100%;
        content: '';
        background: rgba(0, 0, 0, 0.06);
      }
      .rightBox {
        width: 70%;
        .select {
          margin-top: 15px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left {
            div:nth-child(1) {
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              //font-weight: 600;
              color: #000000;
              line-height: 20px;
              margin-bottom: 11px;
            }
          }
        }
        .line {
          height: calc(100% - 280px) !important;
        }
        .table {
          margin-top: 10px;
          /deep/ .row {
            height: 32px;
            line-height: 32px;
          }
        }
      }
    }

    .BDPendulum{
      height: 100%;
      margin-top: 6px;
      .BDPenOverView{
        // display: flex;
        height: 120px;
        display: grid;
        gap: 76px;
        grid-template-columns: repeat(2, 1fr);
        .BDPenLeft{
          height: 120px;
          display: grid;
          gap: 40px;
          grid-template-columns: repeat(1, 1fr 4fr);
          .SubPenLeft{
            height: 100%;
            .SubPenTitle{
              .LabelCss{
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 22px;
                margin-bottom: 6px;                
              }
              .ValCss{
                font-size: 24px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 24px;
                margin-bottom: 10px;
              }
            }
            .SubPenIndex{
              display: grid;
              grid-template-columns: repeat(2, auto);
              justify-content: space-between;
              padding-top: 5px;  
              .LabelCss{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #999999;
                line-height: 18px;
              }
              .ValCss{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #999999;
                line-height: 18px;
              }
              .red{
                color: #ff5953;
              }
              .green{
                color: #00a854;
              }

            }

          }
          .SubPenRight{
            height: calc(100%);
            .UALChartTitle{
              display: flex;
              justify-content: space-between;
              .UATName{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 22px;                
              }              
              .UATlegend {
                align-items: center;
                span{
                  padding-right: 10px;
                }
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
                  width: 14px;
                  height: 2px;
                  background: #5b8ff9;
                  margin-right: 5px;
                  margin-bottom: 3px;
                }
                span:nth-child(2)::before {
                  background: #dfdfdf;
                }
              }
            }

            .ChartNumCss{
              height: calc(100% - 22px) !important;
            }
          }

        }
        .BDPenRight{
          height: 120px;
          display: grid;
          gap: 40px;
          grid-template-columns: repeat(1, 1fr 4fr);
          .SubPenLeft{
            height: 100%;
            .SubPenTitle{
              .LabelCss{
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 22px;
                margin-bottom: 6px;                
              }
              .ValCss{
                font-size: 24px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 24px;
                margin-bottom: 10px;
              }
            }
            .SubPenIndex{
              display: grid;
              grid-template-columns: repeat(2, auto);
              justify-content: space-between;
              padding-top: 5px;  
              .LabelCss{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #999999;
                line-height: 18px;
              }
              .ValCss{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #999999;
                line-height: 18px;
              }
              .red{
                color: #ff5953;
              }
              .green{
                color: #00a854;
              }
            }

          }
          .SubPenRight{
            height: calc(100%);
            .UALChartTitle{
              display: flex;
              justify-content: space-between;
              .UATName{
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 22px;                
              }              
              .UATlegend {
                align-items: center;
                span{
                  padding-right: 10px;
                }
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
                  width: 14px;
                  height: 2px;
                  background: #5b8ff9;
                  margin-right: 5px;
                  margin-bottom: 3px;
                }
                span:nth-child(2)::before {
                  background: #dfdfdf;
                }
              }
            }

            .ChartAmtCss{
              height: calc(100% - 22px) !important;
            }

          }

        }

      }

      .BDPenTrend{
        height: calc(100% - 120px - 29 * 7px);
        .BDPenTreDiv{
          height: calc(100% - 21px);
          // height: calc(100%);
          padding-top: 10px;
          // display: grid;
          // gap: 76px;
          // grid-template-columns: repeat(2, 1fr);
          display: flex;
          .BDPenTLeft{
            flex: 1;
            padding-right: 38px;
            height: calc(100%);
            .BDPenTLTitle{
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: rgba(0, 0, 0, 0.64);
              line-height: 22px;
            }
            .BDPenTreLChert{
              height: calc(100% - 25px);
            }
          }
          .BDPenTRight{
            flex: 1;
            padding-left: 38px;
            height: calc(100%);
            .BDPenTRTitle{
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: rgba(0, 0, 0, 0.64);
              line-height: 22px;
            }
            .BDPenTreRChert{
              height: calc(100% - 25px);
            }

          }
        }

      }
      .BDPenTable{
        height: calc(28 * 7px);
        /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Title{
          text-align: left;
          padding-left: 10px;
        }
        /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Con1{
          text-align: left;
          padding-left: 10px;
        }
        /deep/ .TRORCLeftTUser2 tbody tr td.Title{
          text-align: left;
          padding-left: 10px;
        }
        /deep/ .TRORCLeftTUser2 tbody tr td.ConBoy1{
          text-align: left;
          padding-left: 10px;
        }
        

        /deep/ .TRORCLeftTUser2 tbody tr td{
          text-align: right;
          padding-right: 10px;
        }
        /deep/ .TRORCLeftTUser2 thead tr div td{
          text-align: right;
          padding-right: 10px;
        }
      }








    }


  }
}
</style>

