<template>
  <div class="AttractInvestment">
    <div class="header">
      <Title class="title" :label="AreaData.area"
        :jump="AreaData.area === '硬装集采' ? true : false" :jumpTarget="JumpStr" />

      <div class="TSwitch">
        
        <div class="TSwitchOn" style="padding-right: 0;display: flex;align-items: center">
          <a-radio-group v-model="AreaData.area" style="line-height: 30px">
            <a-radio :value="item" v-for="item in AreaData.areaOption" :key="item">
              {{ item }}
            </a-radio>
          </a-radio-group>
        </div>

        <div v-if="AreaData.area==='硬装集采'" class="SelTime" style="padding-right: 20px;">

            <a-range-picker
              style="width: 250px"
              v-model="date"
              :allowClear="false"
              :mode="['month', 'month']"
              :open="open"
              format="YYYY-MM"
              @openChange="openChange"
              @panelChange="panelChange"
            />

        </div>
        <div class="ml10" style="font-size: 12px; line-height: 30px">最后更新时间：{{ loadTimeObj[AreaData.area] }}</div>
      </div>

      <!-- <div style="display: none">
        <a-range-picker
          style="width: 250px"
          v-model="date"
          :allowClear="false"
          :mode="['month', 'month']"
          :open="open"
          format="YYYY-MM"
          @openChange="openChange"
          @panelChange="panelChange"
        />
      </div> -->
    </div>
    <div class="main">
      <SiteSelection v-if="AreaData.area === '选商选址'"/>

      <div class="InvProStoreOpe" v-if="AreaData.area==='招商开店'">
        <div class="leftBox">
          <Panel :openOverView="openOverView" :comp="'AttractInvestment'" :currentPanel.sync="currentPanel" />
          <!--<div class="tableBox">-->
          <div class="select" style="display: flex; align-items: center">
            <div class="mr10">区域开店</div>
            <a-radio-group v-if="currentPanel === '已开店'" v-model="DATA_TYPE">
              <a-radio value="年累"> 年累 </a-radio>
              <a-radio value="当月"> 当月 </a-radio>
            </a-radio-group>
            <div style="flex: 1"></div>
            <a-radio-group v-model="STORE_TYPE">
              <a-radio value="总体"> 总体 </a-radio>
              <a-radio value="成品店"> 成品店 </a-radio>
              <a-radio value="融合店"> 融合店 </a-radio>
            </a-radio-group>
          </div>
          <div class="panel1" v-if="currentPanel === '已开店'">
            <!--                    <Table ref="overViewTable" class="table" @click="clickTable" v-bind="table" style="display: none"/>-->
            <Table ref="overViewTable1" class="table1" @click="clickTable1" v-bind="tableCopy" />
            <!--                </div>-->
            <div class="echartsBox">
              <span>
                <!--                            <span></span>-->
                <!--                            <span>实际开店</span>-->
                <!--                            <span></span>-->
                <!--                            <span>开店目标</span>-->
                <span></span>
                <span>累计已开店</span>
                <span></span>
                <span>累计开店目标</span>
                <span></span>
                <span>累计已关店</span>
              </span>
              <v-chart ref="line" class="line" style="overflow: visible" :options="echart" autoresize></v-chart>
            </div>
          </div>
          <InBusiness v-if="currentPanel === '营业中'" :date="date" :STORE_TYPE="STORE_TYPE" ref="InBusiness" />
        </div>
        <div class="rightBox">
          <div class="row1">招商建店</div>
          <TimeLine class="timeLine" :datas="timeLindData" />
          <div class="selects" style="margin-top: 25px">
            <span>区域招商建店</span>
            <a-radio-group v-model="regionSTORE_TYPE" style="float: right">
              <a-radio value="总体"> 总体 </a-radio>
              <a-radio value="成品店"> 成品店 </a-radio>
              <a-radio value="融合店"> 融合店 </a-radio>
            </a-radio-group>
          </div>
          <RegionalInvestment :date="date" :regionSTORE_TYPE="regionSTORE_TYPE" />
          <div class="progress" style="display: none">
            <div class="selects">
              <span>区域招商</span>
              <a-radio-group v-model="regionSTORE_TYPE" style="float: right">
                <a-radio value="总体"> 总体 </a-radio>
                <a-radio value="成品店"> 成品店 </a-radio>
                <a-radio value="融合店"> 融合店 </a-radio>
              </a-radio-group>
            </div>
            <div class="box">
              <div class="line1">
                <div></div>
                <div>东区</div>
                <div>南区</div>
                <div>西区</div>
                <div>北区</div>
              </div>

              <div class="line2" v-for="(item, index) in progressData" :key="index">
                <div>{{ item.label }}</div>
                <ProgressBar
                  :value="val"
                  v-for="(val, index1) in item.data"
                  :key="index1"
                  :colorIndex="item.colorIndex"
                />
              </div>
            </div>
          </div>
          <div class="table" style="display: none">
            <div class="title">区域建店</div>
            <Table v-bind="table1" />
          </div>
        </div>        
      </div>

      <div class="HarLoadCenPur" v-if="AreaData.area==='硬装集采'">
        <div class="LeftDiv">
          <div class="TopDiv" style="padding-top: 15px;">
            <div class="TopTitle">
              门店硬装集采概览
            </div>

            <div class="TopCont">
              <div class="TopChart">
                <CircleEchart class="echarts" :label="'占比'" :value="OverSum[0].Ret" :comp="'Activity'" :type="'type1'" :id="1" />
              </div>
              <div class="TopIndex">
                <div class="TopIndCon">
                  <div class="TopIndLab">
                    <span>全类目集采店数</span>
                    <span style="padding-left: 5px;">
                      <a-popover  placement="bottomLeft">
                        <template #content>
                          <p class="ContCss" style="margin: 0px;padding: 0px;font-size: 12px;">
                            22年5月前进入集采供应商库是5个品类，5月后新增2个类目；后期会按照业务实际陆续推进新增可集采品类；对集采百分比略有影响；
                          </p>
                        </template>
                        <template #title>
                          <span>备注说明</span>
                        </template>
                        <a-icon style="font-size: 16px;color: rgb(153, 153, 153);" type="question-circle"/>  
                      </a-popover> 
                    </span> 

                  </div>
                  <div class="TopIndVal">
                    {{OverSum[0].val1}}
                  </div>
                </div>

                <div class="TopIndCon">
                  <div class="TopIndLab">
                    下单店铺数
                  </div>
                  <div class="TopIndVal">
                    {{OverSum[0].val2}}
                  </div>
                </div>

                <div class="TopIndCon">
                  <div class="TopIndLab">
                    差值
                  </div>
                  <div class="TopIndVal">
                    {{OverSum[0].val3}}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="DownDiv">
            <div class="DownTitle">区域硬装全类目集采占比情况</div>

            <div class="DownTable">
              <Tabletcq v-bind="TableHard" @OnParm='ParmData' />
            </div>
            <div class="DownCharts">  
              <v-chart ref="DownChBar" class="DownChBarCss" style="overflow: visible" :options="EchartHardL" autoresize></v-chart>
            </div>

          </div>
        </div>

        <div class="RightDiv">
          
          <div class="RightTop">
            <div class="RigTopTiAndSel">
              <div class="RigTopTitle">
                门店硬装集采类目分析
              </div>  
              <div class="RigTopSel">
                <Select :label="'区域'" :value.sync="RegionSel.area" :options="RegionSel.areaOption" />
              </div>           
            </div>

            <div class="RigTopSub">
              门店硬装集采类目销额及毛利率
            </div>
            <div class="RigCharts">
              <v-chart ref="RigChBar" class="RigChBarCss" style="overflow: visible" :options="EchartHardR" autoresize></v-chart>
            </div>
          </div>

          <div class="RightDown">
            <div class="RigDownTitle">
              门店硬装集采类目分布情况
            </div>
            <div class="RigDownTable">
              <Tabletcq v-bind="TableCate" />
            </div>

          </div>

        </div>

      </div>
    </div>
    <Jump style="display: none" />
  </div>
</template>

<script>
import Title from '../../components/Title.vue'
import moment from 'moment'
import Table from '../../components/Table'
import base from '../../utils/base'
import TimeLine from './components/TimeLine'
import ProgressBar from './components/ProgressBar'
import Jump from '../../components/Jump'
import Panel from './components/Panel'
import _ from 'lodash'
import InBusiness from './components/InBusiness'
import RegionalInvestment from './components/RegionalInvestment'
import CircleEchart from '../../components/CircleEchart.vue'
import Tabletcq from '../../components/tabletcq.vue'
import SiteSelection from '@/views/BIView/ProductSupply/NewRetailCockpit/tabs/T3_AttractInvestment/components/SiteSelection'
import echartStyle from "../../utils/echartStyle";
export default {
  mixins: [base],
  components: {
    Title,
    Table,
    TimeLine,
    ProgressBar,
    // dbRight,
    Panel,
    Jump,
    InBusiness,
    RegionalInvestment,
    CircleEchart,
    Tabletcq,
    SiteSelection,
  },
  async created() {
    this.echart = await this.createBarAndLineEchart();
    this.EchartHardL = await this.createBarAndLineEchart();
    this.EchartHardR = await this.createBarAndLineEchart();
    this.EchartHardL.yAxis[0].splitLine.show = false
    let that = this
    this.echart.series.push(_.cloneDeep(this.echart.series[1]))
    this.echart.series[1].lineStyle.color = echartStyle.thisYear
    this.echart.series[1].lineStyle.color = echartStyle.previousYear
    // this.echart.series[2].lineStyle.color = 'rgba(250,205,145,0.8)'
    this.echart.series[2].lineStyle.color = echartStyle.type3
    // FFD700
    // this.echart.series[0].itemStyle.normal.color = '#5b8ff9'
      this.echart.series[1].itemStyle.color = echartStyle.thisYear
      this.echart.series[1].itemStyle.color = echartStyle.previousYear
    // this.echart.series[2].itemStyle.color = 'rgba(250,205,145,0.8)'
    this.echart.series[2].itemStyle.color = echartStyle.type3
    // this.echart.tooltip.formatter = function (params) {
    //     console.log(params)
    //     return  `统计日期：${params[0].data[0]}月<br/>${params[1].marker}开店目标：${that.handleNum('round', params[0].data[2])}<br/>
    //             ${params[0].marker}实际开店：${that.handleNum('round', params[0].data[1])}<br/>
    //             ${params[2].marker}累计已关店：${that.handleNum('round', params[0].data[3])}`
    // }
    this.echart.series[0].name = '累计已开店'
    this.echart.series[1].name = '累计开店目标'
    this.echart.series[2].name = '累计已关店'
    this.echart.grid.bottom = 0
    this.echart.grid.top = 20
    this.echart.yAxis[0].axisLabel.formatter = null
    // this.echart.xAxis[0].axisLabel = {
    //   formatter: function (val) {
    //     return val + '月'
    //   },
    // }
    this.getTime()
    this.getOpenOverView()
    this.getAreaOpen()
    this.getAreaLine()
    this.getBuildShop()
    // this.getRegionInvestment()
    // this.getAreaBuild()


    // 迭代内容
    this.TableHard.labelD=['经销商店分区','下单门店数量','全类目集采门店数','占比'];
    this.TableHard.tableD=[
      ['合计',0,0,0,],
      ['东区',0,0,0,],
      ['南区',0,0,0,],
      ['西区',0,0,0,],
      ['北区',0,0,0,],
    ]
    this.TableCate.labelD=['类目','销额','销额占比','目标毛利率','毛利率'];
    this.TableCate.tableD=[
      ['合计',0,0,0,0],
      ['东区',0,0,0,0],
      ['南区',0,0,0,0],
      ['西区',0,0,0,0],
      ['北区',0,0,0,0],
    ]
    this.GetHarOverView();
    this.GetHarTrend();
    this.GetHarBar();
    this.jumpTarget();

  },
  beforeDestroy() {
    this.echart === null ? (this.echart = null) : null;
    this.EchartHardL === null ? (this.EchartHardL = null) : null;
    this.EchartHardR === null ? (this.EchartHardR = null) : null;
  },
  mounted() {
    // this.$refs.overViewTable.$el.children[0].children[1].classList.add('active')
    if(this.AreaData.area === '招商开店') this.$refs.overViewTable1.$el.children[1].children[0].classList.add('active')
  },
  watch: {
    'AreaData.area': {
        handler(val) {
            if(val === '招商开店') {
                let vm = this
                this.$nextTick(() => {
                    vm.$refs.overViewTable1.$el.children[1].children[0].classList.add('active')
                }, 100)
            }
        }
    },
    currentPanel: {
      handler(val) {
        if (val === '已开店') {
          this.$nextTick(() => {
            this.$refs.overViewTable1.$el.children[1].children[0].classList.add('active')
          })
        } else {
          this.$nextTick(() => {
            this.$refs.InBusiness.$refs.table.$el.children[1].children[0].classList.add('active')
          })
        }
      },
    },
    currentRegion: {
      handler(val) {
        this.getAreaLine(val)
      },
    },
    DATA_TYPE: {
      handler(val) {
        this.handleData(
          'areaOpen',
          this.areaOpenData.filter((_) => _.DATA_TYPE === val)
        )
      },
    },
    time: {
      handler() {
        this.getOpenOverView()
        this.getAreaOpen()
        this.getAreaLine(this.currentRegion)
        this.getBuildShop()
        // this.getRegionInvestment()
        // this.getAreaBuild()
      },
    },
    STORE_TYPE: {
      handler() {
        this.getAreaOpen()
        this.getAreaLine(this.currentRegion)
      },
    },
    // regionSTORE_TYPE: {
    //     handler(val) {
    //         console.log(val);
    //         // this.getRegionInvestment()
    //         // this.getAreaBuild()
    //     }
    // },
    mode: {
      handler(val, oval) {
        if (val !== null && oval !== null) {
          this.date = this.storeDate
          this.open = false
          this.GetHarOverView();
          this.GetHarTrend();
          this.GetHarBar();
        }
      },
    },
    'RegionSel.area':{
      handler() {
        // 每次都需要清除画布
        this.$refs.RigChBar.$refs.echarts.clear();
        this.GetHarBar();
      }
    },
    open: {
      handler(val) {
        if (!val) this.mode = null
      },
    },
  },
  computed: {
    time() {
      return this.START_TIME + this.END_TIME
    },
    START_TIME() {
      return this.date[0].format('YYYYMM')
    },
    END_TIME() {
      return this.date[1].format('YYYYMM')
    },
  },
  data() {
    let options = process.env.VUE_APP_RELEASE_ENV !== 'pro' ? ['选商选址', '招商开店', '硬装集采'] : ['招商开店', '硬装集采']
    return {
      // 迭代内容
      MonthHar:[moment().format('YYYYMM'),moment().format('YYYYMM')],
      AreaData: {
        area: '招商开店',
          // areaOption: ['选商选址', '招商开店', '硬装集采'],
          areaOption: options,
      },
      RegionSel: {
        area: '全国',
        areaOption: ['全国', '东区', '南区', '西区', '北区'],
      },
      TableHard:{
        index:'T3_AttractInvestmentHard',
        isparm:true,
        labelD:[],
        tableD:[],
      },
      TableCate:{
        index:'T3_AttractInvestmentCate',
        labelD:[],
        tableD:[],
      },
      OverSum:[{Ret:0,val1:0,val2:0,val3:0}],
      AgeName:'合计', 
      EchartHardL: null,
      EchartHardR: null,
      // 迭代内容


      loadTime: moment().format('YYYY年MM月DD日'),
      loadTimeObj: {
          '选商选址': null,
          '招商开店': null,
          '硬装集采': null,
      },
      currentPanel: '已开店',
      date: [
        moment().format('MM') === '01' ? moment().subtract(1, 'month') : moment(),
        moment().format('MM') === '01' ? moment().subtract(1, 'month') : moment(),
      ],
      storeDate: null,
      open: false,
      mode: null,
      STORE_TYPEOption: [],
      DATA_TYPE: '年累',
      //左
      STORE_TYPE: '总体',
      //右 区域招商店态
      regionSTORE_TYPE: '总体',
      openOverView: {
        CP_CLOSE_SHOP: '--',
        CP_OPENING: '--',
        CP_OPEN_DIFF: '--',
        CP_OPEN_SHOP: '--',
        CP_OPEN_TGT: '--',
        RH_CLOSE_SHOP: '--',
        RH_OPENING: '--',
        RH_OPEN_DIFF: '--',
        RH_OPEN_SHOP: '--',
        RH_OPEN_TGT: '--',
        TOT_CLOSE_SHOP: '--',
        TOT_OPENING: '--',
        TOT_OPEN_DIFF: '--',
        TOT_OPEN_RATE: '--',
        TOT_OPEN_SHOP: '--',
        TOT_OPEN_TGT: '--',
        CP_NEW_OPENING: '--',
        RH_NEW_OPENING: '--',
        TOT_NEW_OPENING: '--',
      },
      table: {
        index: 'AttractInvestmentA',
        labelData: ['区域', '全国', '东区', '南区', '西区', '北区'],
        tableData: [],
      },
      tableCopy: {
        index: 'AttractInvestmentA',
        labelData: ['区域', '/', '/', '/', '/'],
        tableData: [
          ['全国', '/', '/', '/', '/'],
          ['东区', '/', '/', '/', '/'],
          ['南区', '/', '/', '/', '/'],
          ['西区', '/', '/', '/', '/'],
          ['北区', '/', '/', '/', '/'],
        ],
      },
      currentRegion: '全国',
      areaOpenData: [],
      table1: {
        index: 'AttractInvestmentB',
        labelData: ['区域', '全国', '东区', '南区', '西区', '北区'],
        tableData: [],
      },
      echart: null,
      progressData: [
        {
          label: '意向金进度',
          data: [null, null, null, null],
          key: 'PTD_MONEY_RATE',
          colorIndex: 0,
        },
        {
          label: '选址进度',
          data: [null, null, null, null],
          key: 'PTD_LOCAT_RATE',
          colorIndex: 1,
        },
        {
          label: '量尺进度',
          data: [null, null, null, null],
          key: 'PTD_RULE_RATE',
          colorIndex: 2,
        },
      ],
      timeLindData: [
        { label: '意向金通过', data1: null, data2: null, data3: null, key: 'PTD_MONEY' },
        { label: '选址通过', data1: null, data2: null, data3: null, key: 'PTD_LOCAT' },
        { label: '量尺通过', data1: null, data2: null, data3: null, key: 'PTD_RULE' },
        { label: '筹备中', data1: null, data2: null, data3: null, key: 'PTD_OPEN_CNT' },
      ],
      JumpStr:''
    }
  },
  methods: {
    panelChange(val, mode) {
      this.storeDate = val
      this.mode = mode
    },
    openChange(state) {
      this.open = state
    },
    async getTime() {
      //  选商选址
      let res = await this.$fetchSql('new_retail', 'new_retail_open_xsxz_loadtime')
      this.loadTimeObj['选商选址'] = moment(res.data[0].UPDATE_TIME).format('YYYY年MM月DD日')
      // 招商开店
      let res1 = await this.$fetchSql('new_retail', 'new_retail_open_loadtime')
        this.loadTimeObj['招商开店'] = moment(res1.data[0].UPDATE_TIME).format('YYYY年MM月DD日')
      // 硬装
      let res2 = await this.$fetchSql('all_center', 'all_center_stuff_coll_loadtime')
        this.loadTimeObj['硬装集采'] = moment(res2.data[0].UPDATE_TIME).format('YYYY年MM月DD日')
    },
    clickTable1(e) {
      let text = e.target.innerText
      let keys = ['全国', '东区', '西区', '南区', '北区']
      if (keys.indexOf(text) > -1) {
        this.currentRegion = text
        // if(text === keys[0]) this.getAreaLine()
        // else this.getAreaLine(text)
        let cols = e.target.parentElement.parentElement.children
        for (let i = 1; i < cols.length; i++) {
          let children = cols[i].children[0]
          // for(let j = )
          children.classList.remove('active')
        }
        e.target.classList.add('active')
      }
    },
    changeMonth1(val) {
      this.START_TIME = val
    },
    changeMonth2(val) {
      this.END_TIME = val
    },
    //开店总览
    async getOpenOverView() {
      let query = {
        START_TIME: this.START_TIME,
        END_TIME: this.END_TIME,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_open_sum', query)
      this.openOverView = res.data[0]
      this.handleData('openOverView', res.data)
    },
    //区域开店
    async getAreaOpen() {
      let query = {
        START_TIME: this.START_TIME,
        END_TIME: this.END_TIME,
      }
      this.STORE_TYPE && this.STORE_TYPE !== '总体' ? (query.STORE_TYPE = this.STORE_TYPE) : null
      let res = await this.$fetchSql('new_retail', 'new_retail_open_areaopen', query)
      this.areaOpenData = res.data.concat()
      this.handleData(
        'areaOpen',
        res.data.filter((_) => _.DATA_TYPE === this.DATA_TYPE)
      )
    },
    async getAreaLine(S_OR_N = '全国') {
      let query = {
        START_TIME: moment(this.START_TIME).format('YYYY') + '01',
        END_TIME: moment(this.END_TIME).format('YYYY') + '12',
      }
      S_OR_N !== '全国' ? (query.S_OR_N = S_OR_N) : null
      this.STORE_TYPE && this.STORE_TYPE !== '总体' ? (query.STORE_TYPE = this.STORE_TYPE) : null
      let res = await this.$fetchSql('new_retail', 'new_retail_open_trend', query)
      this.handleData('areaLine', res.data)
    },
    //招商建店
    async getBuildShop() {
      let query = {
        START_TIME: this.START_TIME,
        END_TIME: this.END_TIME,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_open_investbuild', query)
      this.handleData('buildShop', res.data)
    },
    //区域招商
    async getRegionInvestment() {
      let query = {
        START_TIME: this.START_TIME,
        END_TIME: this.END_TIME,
      }
      this.regionSTORE_TYPE && this.regionSTORE_TYPE !== '总体' ? (query.STORE_TYPE = this.regionSTORE_TYPE) : null
      let res = await this.$fetchSql('new_retail', 'new_retail_open_areainvest', query)
      this.handleData('regionInvestment', res.data)
    },

    async getAreaBuild() {
      let query = {
        START_TIME: this.START_TIME,
        END_TIME: this.END_TIME,
      }
      this.regionSTORE_TYPE && this.regionSTORE_TYPE !== '总体' ? (query.STORE_TYPE = this.regionSTORE_TYPE) : null
      let res = await this.$fetchSql('new_retail', 'new_retail_open_areabuild', query)
      this.handleData('areaBuild', res.data)
    },
    handleData(type, source) {
      if (type === 'openOverView') {
        this.openOverView = null
        if (!source.length) return
        this.openOverView = _.cloneDeep(source[0])
      } else if (type === 'areaOpen') {
        // this.table.tableData = []
        // if(!source.length) return;
        // let keys = [
        //     {key: 'TOT_OPEN_TGT', label: '开店目标'},
        //     {key: 'TOT_OPEN_SHOP', label: '已开店'},
        //     {key: 'TOT_OPEN_DIFF', label: '差值'},
        //     {key: 'TOT_CLOSE_SHOP', label: '已关店'},
        //     {key: 'TOT_OPENING', label: '营业中'},
        // ]
        // let names = ['全国', '东区', '南区', '西区', '北区']
        // let arr = names.map(name => {
        //     return source.filter(_ => _.S_OR_N === name)[0]
        // })
        // let newArr = []
        // newArr = keys.map(item => {
        //     return [
        //         item.label,
        //         arr[0][item.key],
        //         arr[1][item.key],
        //         arr[2][item.key],
        //         arr[3][item.key],
        //         arr[4][item.key],
        //     ]
        // })
        // this.table.tableData = newArr.concat()
        this.tableCopy.tableData = []
        if (!source.length) return
        this.tableCopy.labelData = this.tableCopy.labelData
          .slice(0, 1)
          .concat(...['开店目标', '已开店', '达成率', '已关店'])
        let sortObj = { 全国: 1, 东区: 2, 南区: 3, 西区: 4, 北区: 5 }
        let arr = source.concat()
        arr = arr.sort((a, b) => sortObj[a.S_OR_N] - sortObj[b.S_OR_N])
        this.tableCopy.tableData = arr.map((item) => {
          return ['S_OR_N', 'TOT_OPEN_TGT', 'TOT_OPEN_SHOP', 'TOT_OPEN_RATE', 'TOT_CLOSE_SHOP'].map((key) => {
            return item[key]
          })
        })
      } else if (type === 'areaLine') {
        let arr = source.concat()
        this.echart.xAxis[0].data = []
        this.echart.series[0].data = []
        this.echart.series[1].data = []
        this.echart.series[2].data = []
        this.$refs?.line?.$refs?.echarts?.clear()
        if (!arr.length) return
        let keys = ['MONTH_DATE', 'TOT_OPEN_SHOP', 'TOT_OPEN_TGT', 'TOT_CLOSE_SHOP']
        arr.sort((a, b) => a[keys[0]] - b[keys[0]])
        let fun = function (val, boo = false) {
          if (val < 10) return val.split('0')[1]
          else return val
        }
          console.log(arr)
        this.echart.xAxis[0].data = Array.from(new Set(arr.map((_) => fun(_[keys[0]], true) + '月')))
        this.echart.series[0].data = arr.map((item) => {
          return keys.map((key) => {
            if (key === 'MONTH_DATE') return item[key] > moment().format('MM') ? undefined : fun(item[key]) + '月'
            return item[key]
          })
        })
        this.echart.series[1].data = arr.map((item) => {
          return [fun(item[keys[0]]) + '月', item[keys[2]]]
        })
        this.echart.series[2].data = arr.map((item) => {
          return [item[keys[0]] > moment().format('MM') ? undefined : fun(item[keys[0]]) + '月', item[keys[3]]]
        })
      } else if (type === 'buildShop') {
        this.timeLindData.forEach((item) => {
          for (let key in item) {
            if (key !== 'label' && key !== 'key') item[key] = null
          }
        })
        if (!source.length) return
        this.timeLindData.forEach((item) => {
          item.data1 = source.filter((_) => _.STORE_TYPE === '合计')[0][item.key]
          item.data2 = source.filter((_) => _.STORE_TYPE === '成品店')[0][item.key]
          item.data3 = source.filter((_) => _.STORE_TYPE === '融合店')[0][item.key]
        })
      } else if (type === 'regionInvestment') {
        this.progressData.forEach((item) => {
          item.data = []
        })
        if (!source.length) return
        let arr = []
        arr.push(source.filter((_) => _.S_OR_N === '东区')[0])
        arr.push(source.filter((_) => _.S_OR_N === '南区')[0])
        arr.push(source.filter((_) => _.S_OR_N === '西区')[0])
        arr.push(source.filter((_) => _.S_OR_N === '北区')[0])
        this.progressData.forEach((item, index) => {
          item.data = arr.map((_) => {
            return (_[item.key] * 100).toFixed(0) + '%'
          })
        })
      } else if (type === 'areaBuild') {
        this.table1.tableData = []
        if (!source.length) return
        let keys = [
          { key: 'PTD_OPEN_CNT', label: '建店中' },
          { key: 'PTD_ABNL_CNT', label: '异常数' },
          { key: 'PTD_DES_ABNL_CNT', label: '设计异常' },
          { key: 'PTD_OFFER_ABNL_CNT', label: '报价异常' },
          { key: 'PTD_CONSEN_ABNL_CNT', label: '施工异常' },
          { key: 'PTD_PREPARE_ABNL_CNT', label: '筹备异常' },
        ]
        let names = ['全国', '东区', '南区', '西区', '北区']
        let arr = []
        arr = names.map((name) => {
          return source.filter((_) => _.S_OR_N === name)[0]
        })
        let newArr = []
        newArr = keys.map((item) => {
          return [item.label, arr[0][item.key], arr[1][item.key], arr[2][item.key], arr[3][item.key], arr[4][item.key]]
        })
        this.table1.tableData = newArr.concat()
      }
    },

    // 迭代内容
    ParmData(data){
      console.log("======f返回的数据是！！！=======")
      // console.log(data);
      this.AgeName=data; 
      console.log(moment(this.END_TIME).format('YYYY'))
      this.GetHarTrend();

    },

    async GetHarOverView(){
      let query = {
        START_TIME: this.START_TIME,
        END_TIME: this.END_TIME,
      }
      let res = await this.$fetchSql('all_center', 'all_center_stuff_coll_sum', query);
      res.data.sort((a,b)=>{return a["RANK_ON"]-b["RANK_ON"]});
      this.TableHard.tableD=[];
      if(res.data.length>0){
        let sum = res.data.filter((_) => _.S_OR_N === '合计');
        this.OverSum[0].Ret=sum[0].SHOP_CNT_RATE;
        this.OverSum[0].val1=sum[0].ALL_COLLECT_SHOP_CNT;
        this.OverSum[0].val2=sum[0].PLACE_SHOP_CNT;
        this.OverSum[0].val3=sum[0].SHOP_CNT_DIFF;
        Object.keys(res.data).forEach((OnKey) => {
          this.TableHard.tableD.push(
            [
              res.data[OnKey].S_OR_N,
              res.data[OnKey].PLACE_SHOP_CNT,
              res.data[OnKey].ALL_COLLECT_SHOP_CNT,
              res.data[OnKey].SHOP_CNT_RATE,
            ]
          )
        });

      }else{
        this.TableHard.tableD=[
          ['合计',0,0,0,],
          ['东区',0,0,0,],
          ['南区',0,0,0,],
          ['西区',0,0,0,],
          ['北区',0,0,0,],
        ]
      }
    },

    async GetHarTrend(){
      let query = {
        //START_TIME: this.START_TIME,
        // END_TIME: this.END_TIME,
        S_OR_N: (this.AgeName==='合计')?null:this.AgeName,
        YDATE: moment(this.END_TIME).format('YYYY')
      }
      let res = await this.$fetchSql('all_center', 'all_center_stuff_coll_trend', query);
      res.data.sort((a,b)=>{return a["MONTH_DATE"].replace(/[\u4e00-\u9fa5]/g,'')-b["MONTH_DATE"].replace(/[\u4e00-\u9fa5]/g,'')});

      this.EchartHardL.xAxis[0].data=[];
      this.EchartHardL.series[1].data=[];          
      this.EchartHardL.series[0].data=[];  
      this.EchartHardL.yAxis[0].axisLabel.formatter = '{value}%';

      this.EchartHardL.yAxis[0].axisTick.show = false;
      this.EchartHardL.yAxis[0].axisLine.show = false;
      this.EchartHardL.yAxis[0].axisLabel.show = false;
      this.EchartHardL.grid ={
          left: '0%',
          right: '0%',
          bottom: 0,
          top: 25,
          containLabel: true
      };

      this.EchartHardL.color =[echartStyle.type1, echartStyle.type3];
      this.EchartHardL.legend ={
        icon: 'rect',
        itemWidth: 16,
        itemHeight: 2,
        selectedMode: false,
        top: 0,
        right: 10
      };

      this.EchartHardL.series[0] = {
        name: '全类目集采',
        type: 'bar',
        barWidth: '35',
        stack:'1',
        data: [],
        itemStyle: {
            normal: {
                color: function (params) {
                    // let color = ['#00a854', '#ff5953', 'rgba(250, 205, 145, 0.8)']
                    let color = ['#00a854', '#ff5953', echartStyle.type3]
                    // 2 目标 1 业绩
                    if (params.data[2] === null || params.data[2] === '--' || params.data[2] === undefined) return color[2]
                    let index = params.data[1] - params.data[2] >= 0 ? 1 : 0
                    return color[index]
                },
                barBorderRadius: [0, 0, 0, 0]
            }
        },
        label: {
            show: true,
            position: 'inside',
            textStyle:{
              fontSize:10
            },
            formatter:function(params){
              return (params.data)?params.data+'%':'--'
            }
        },
        z: 1,
      };
      this.EchartHardL.series[1]= {
        name: '部分类目集采',
        type: 'bar',
        barWidth: '35',
        stack:'1',
        data: [],
        itemStyle: {
            normal: {
                color: function (params) {
                    let color = ['#00a854', '#ff5953', echartStyle.type1]
                    // 2 目标 1 业绩
                    if (params.data[2] === null || params.data[2] === '--' || params.data[2] === undefined) return color[2]
                    let index = params.data[1] - params.data[2] >= 0 ? 1 : 0
                    return color[index]
                },
                barBorderRadius: [18, 18, 0, 0]
            }
        },
        label: {
            show: true,
            position: 'inside',
            textStyle:{
              fontSize:10
            },
            formatter:function(params){
              return (params.data)?params.data+'%':'--'
            }
        },
        z: 2,
      };
      // ,PLACE_SHOP_CNT       -- 下单店铺数 	
      // ,ALL_COLLECT_SHOP_CNT -- 全类目集采店数

      if(res.data.length>0){
        Object.keys(res.data).forEach((OnKey) => {
          this.EchartHardL.xAxis[0].data.push(res.data[OnKey].MONTH_DATE);
          this.EchartHardL.series[1].data.push(
            (this.HandleNum('Null',(res.data[OnKey].PLACE_SHOP_CNT-res.data[OnKey].ALL_COLLECT_SHOP_CNT)/res.data[OnKey].PLACE_SHOP_CNT)*100).toFixed(1)*1
          );          
          this.EchartHardL.series[0].data.push((this.HandleNum('Null',res.data[OnKey].ALL_COLLECT_SHOP_CNT/res.data[OnKey].PLACE_SHOP_CNT)*100).toFixed(1)*1);        
        });
        this.EchartHardL.tooltip.formatter=((params)=>{
          let sentval='';
          if(params.length>1){
            sentval='日期：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'+'<br/>'+
              params[1].marker+params[1].seriesName+'：'+params[1].value.toFixed(1)+'%'
          }else{
            sentval='日期：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'
          }
          return sentval
        })
      }

    },

    async GetHarBar(){
      let query = {
        START_TIME: this.START_TIME,
        END_TIME: this.END_TIME,
        S_OR_N: (this.RegionSel.area==='全国')?null:this.RegionSel.area,
        // YDATE: moment(this.END_TIME).format('YYYY')
      }
      let res = await this.$fetchSql('all_center', 'all_center_stuff_coll_cate_anal', query);
      res.data.sort((a,b)=>{return b["ACT_PRICE_RATE"]-a["ACT_PRICE_RATE"]});
      let TrendDat = res.data.filter((_)=>_.GOODS_CATEGORY_NAME!=='合计');

      // 趋势图开始
      this.EchartHardR.xAxis[0].data=[];
      this.EchartHardR.series[0].data=[];
      this.EchartHardR.series[1].data=[];
      this.EchartHardR.series[0].name = '销额占比'
      this.EchartHardR.yAxis[0].axisLabel.formatter = '{value}%';
      this.EchartHardR.yAxis[0].axisLabel.interval = 2;
      this.EchartHardR.yAxis[0].splitNumber = '2';
      this.EchartHardR.yAxis[0].min = 0;    
      this.EchartHardR.grid ={
        left: '0%',
        right: '0%',
        bottom: 10,
        top: 20,
        containLabel: true
      };
      this.EchartHardR.series[1] = {
        name: '毛利率',
        type: 'bar',
        barWidth: '20',
        data: [],
        itemStyle: {
            normal: {
                color: function (params) {
                    let color = ['#00a854', '#ff5953', echartStyle.type3]
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
        Object.keys(TrendDat).forEach((OnKey) => {
          this.EchartHardR.xAxis[0].data.push((TrendDat[OnKey].GOODS_CATEGORY_NAME)?TrendDat[OnKey].GOODS_CATEGORY_NAME:'其它');
          this.EchartHardR.series[0].data.push(TrendDat[OnKey].ACT_PRICE_RATE*100);
          this.EchartHardR.series[1].data.push(TrendDat[OnKey].GROSS_PROFIT_RATE*100);
        });
        this.EchartHardR.tooltip.formatter=((params)=>{
          let sentval='';
          if(params.length>1){
            sentval='集采类目：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'+'<br/>'+
              params[1].marker+params[1].seriesName+'：'+params[1].value.toFixed(1)+'%'
          }else{
            sentval='集采类目：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].seriesName+'：'+params[0].value.toFixed(1)+'%'
          }
          return sentval
        })
      }

      // 趋势图结束

      // 表格开始
      this.TableCate.tableD=[];
      if(res.data.length>0){
        Object.keys(res.data).forEach((OnKeyTal) => {
          this.TableCate.tableD.push([
            (res.data[OnKeyTal].GOODS_CATEGORY_NAME)?res.data[OnKeyTal].GOODS_CATEGORY_NAME:'其它',
            res.data[OnKeyTal].ACT_PRICE,
            res.data[OnKeyTal].ACT_PRICE_RATE,
            res.data[OnKeyTal].GROSS_PROFIT_TGT,
            {value:res.data[OnKeyTal].GROSS_PROFIT_RATE,value2:res.data[OnKeyTal].GROSS_PROFIT_TGT},
          ])
        });
      }else{
        this.TableCate.labelD=['类目','销额','销额占比','目标毛利率','毛利率'];
        this.TableCate.tableD=[
          ['合计',null,0,0,0],
          ['东区',0,0,0,0],
          ['南区',0,0,0,0],
          ['西区',0,0,0,0],
          ['北区',0,0,0,0],
        ]        
      }
      // 表格结束


    },
    HandleNum (Type, val) {
        if (val === null || val === undefined || (!val && val !== 0) || val == 'NaN' || val == '--' || val == 0) return  '--'
        if(Type === 'Null'){
            return val
        }
    },
    async jumpTarget() {  
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2022_00053':'BI_PC_2022_00076'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },

  },
}
</script>

<style lang="scss" scoped>
.AttractInvestment {
  .header {
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .TSwitch {
      display: flex;
      .TSwitchOn {
        padding-right: 20px;
      }
    }
    .picker1 /deep/ .ant-input {
      border-right: none;
    }

    .picker2 /deep/ .ant-input {
      border-left: none;
      transform: translateX(-5px);
    }
  }

  .main {
    height: calc(100% - 38px);
    .InvProStoreOpe{
      height: calc(100%);
      // height: calc(100% - 24px);
      display: flex;
      justify-content: space-between;      
      .leftBox {
        flex: 474;
        min-width: 474px;
        margin-right: 80px;
        .select {
          margin-top: 15px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #000000;
          line-height: 17px;
        }
        .panel1 {
          margin-top: 5px;
          height: calc(100% - 206px);
          .table {
            /deep/ .col1 .row {
              text-decoration: underline;
              cursor: pointer;
            }
            /deep/ .col1 .row:hover {
              text-decoration: underline;
              cursor: pointer;
              color: #4c89ff;
            }
            /deep/ .col1 .active {
              color: #4c89ff;
            }
            /deep/ .col1 .row:nth-child(1) {
              text-decoration: none;
              cursor: text;
              color: rgba(0, 0, 0, 0.88);
            }
          }
          .table1 {
            margin-top: 5px;
            /deep/ .col {
              .row:nth-child(1) {
                text-decoration: underline;
                cursor: pointer;
              }
              .row:nth-child(1):hover {
                text-decoration: underline;
                cursor: pointer;
                color: #4c89ff;
              }
              .active {
                color: #4c89ff;
              }
            }
          }
          .echartsBox {
            margin-top: 10px;
            //height: calc(100% - 372px)!important;
            //height: 200px;
            height: calc(100% - 135px);
            position: relative;
            > span:nth-child(1) {
              z-index: 2;
              position: absolute;
              right: 0;
              top: 0;
              display: flex;
              align-items: center;
              span {
                margin-right: 10px;
              }
              span:nth-child(1) {
                //width: 4px;
                //height: 10px;
                //border-radius: 2px 2px 0 0;
                width: 16px;
                height: 2px;
                background: #5c8ff9;
              }
              span:nth-child(3) {
                width: 16px;
                height: 2px;
                background: #e7e7e7;
              }
              span:nth-child(5) {
                width: 16px;
                height: 2px;
                //background: #FFD700;
                //background: rgba(250, 205, 145, 0.8);
                background: #FF9D4D;
              }
              span:nth-child(2),
              span:nth-child(4),
              span:nth-child(6) {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.88);
                line-height: 17px;
              }
            }
          }
        }
      }  

      .rightBox {
        flex: 584;
        min-width: 584px;
        .row1 {
          margin-top: 15px;
          margin-bottom: 13px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #000000;
          line-height: 20px;
        }
        .timeLine {
          height: 108px;
        }
        .progress {
          margin-top: 25px;
          height: calc(100% - 48px - 108px - 25px - 185px);
          //height: 200px;
          .selects {
            margin-bottom: 5px;
            //display: flex;
            //align-items: center;
            //justify-content: space-between;
            span:nth-child(1) {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: #000000;
              line-height: 17px;
            }
          }
          .box {
            height: calc(100% - 26px);
            background: #fafafa;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            .line1 {
              display: flex;
              div {
                flex: 1;
                margin-right: 20px;
                text-align: center;
              }
              div:nth-child(1) {
                width: 100px;
                flex: none;
                text-align: left;
                padding-left: 15px;
              }
            }
            .line2 {
              display: flex;
              align-items: center;
              div {
                flex: 1;
                margin-right: 20px;
                text-align: center;
              }
              div:nth-child(1) {
                width: 100px;
                flex: none;
                text-align: left;
                padding-left: 15px;
              }
            }
          }
        }
        .table {
          margin-top: 10px;
          .title {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #000000;
            line-height: 17px;
            margin-bottom: 8px;
          }
        }
        .footer {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #46bca0;
          line-height: 14px;
          .svg g {
            fill: #46bca0;
          }
        }
      }      
      
    }

    .HarLoadCenPur{
      height: calc(100%);
      display: flex;
      justify-content: space-between;   
      .LeftDiv{
        height: 100%;
        flex: 1;
        padding-right: 40px;
        .TopDiv{
          height: 206px;
          .TopTitle{
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #000000;
            line-height: 20px;
            margin-bottom: 12px;
          }
          .TopCont{
            display: flex;
            .TopChart{
              flex: 20;
              // width: 120px;
              height: 120px;
            }
            .TopIndex{
              flex: 80;
              display: flex;
              padding-top: 15px;

              .TopIndCon{
                flex: 100;
                .TopIndLab{
                  font-family: PingFangSC-Regular, PingFang SC;
                  color: #333333;
                  // line-height: 45px;
                  padding-bottom: 10px;
                }
                .TopIndVal{
                  font-family: PingFangSC-Medium, PingFang SC;
                  color: #333333;
                }
              }              
              .TopIndCon:nth-child(1){
                .TopIndLab{
                  font-size: 14px;
                  font-weight: 400;
                  display: flex;
                  align-items: flex-end;
                  height: 35px;
                }
                .TopIndVal{
                  font-size: 22px;
                  font-weight: 500;
                  display: flex;
                  align-items: flex-end;
                  height: 33px;
                }
              }
              .TopIndCon:nth-child(2),.TopIndCon:nth-child(3){
                .TopIndLab{
                  font-size: 12px;
                  font-weight: 400;
                  color: #999999;
                  display: flex;
                  align-items: flex-end;
                  height: 35px;
                }
                .TopIndVal{
                  font-size: 12px;
                  font-weight: 400;
                  color: rgba(0, 0, 0, 0.64);
                  display: flex;
                  align-items: flex-end;
                  height: 33px;
                }
              }


            }

          }

        }

        .DownDiv{
          // height: calc(100% - 167px);
          height: calc(100% - 206px);
          .DownTitle{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            padding-bottom: 10px;
          }
          .DownTable{
            /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Title{
              text-align: left;
              padding-left: 10px;
            }
            /deep/ .TRORCLeftTUser2 tbody tr td.Title{
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
          .DownCharts{
            padding-top: 10px;
            height: calc(100% - 31px - 163px);

          }
        }


      }
      .RightDiv{
        height: 100%;
        flex: 1;
        .RightTop{
          padding-top: 15px;
          .RigTopTiAndSel{
            display: flex;
            justify-content:space-between;
            margin-bottom: 12px;
            .RigTopTitle{
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 600;
              color: #000000;
              line-height: 28px;
            }
          }

          .RigTopSub{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            // padding-bottom: 10px;
          }
          .RigCharts{
            height: 130px;
          }
        }

        .RightDown{
          height: calc(100% - 206px);
          .RigDownTitle{
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            padding-bottom: 10px;
          }
          .RigDownTable{
            height: calc(100% - 31px);
            /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Title{
              text-align: left;
              padding-left: 10px;
            }
            /deep/ .TRORCLeftTUser2 tbody tr td.Title{
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




  }
}
</style>