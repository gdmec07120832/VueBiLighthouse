<template>
  <div class="TuRateOfRetCap">
    <div class="header">
      <Title class="title" :label="'留资转化'" />

      <div class="OnHand">
        <div class="switch">
          <span style="padding-right: 12px; font-size: 12px;">是否剔除代投</span>
          <a-switch :checked="CheckedVal"  checked-children="是" un-checked-children="否" default-checked @change="onChange" size="small"/>
        </div>
        <span style="padding-right: 13px;font-size: 12px;">统计月份</span>
        <a-month-picker v-model="month" :disabledDate='disabledDate' format="YYYY-MM" valueFormat="YYYYMM" :allowClear="false" />        
      </div>
    </div>

    <div class="content" ref="ID_content">
      <div class="TRORCTop">
        <div
          class="TRORCTopCon"
          v-for="(item, index) in GetCapRetenData"
          :key="index"
          :class="IsChoice === index ? 'TRORChoice' : ''"
          @click="IsChoiceFun(index)"
          style="border-left: 1px solid #f0f0f0"
        >
          <div class="TROConName">
              {{ item.IntName }}
              <a-tooltip v-if="index === 3" overlayClassName="panelTooltop" :title="'由于业务流程规范问题，数据统计上存在缺失，数据暂时仅供参考。'" placement="top">
<!--                  <a-icon style="color: rgba(0, 0, 0, 0.45);cursor: pointer" type="question-circle"/>-->
                  <a-icon style="color: rgba(255, 0, 0, 0.45);cursor: pointer" type="exclamation-circle" />
              </a-tooltip>
          </div>
          <div class="TROConNum">{{ (index===0)?handleNumOn('round',item.Num):handleNumOn('percent1',item.Num) }}</div>
          <div class="TROConIndex">
            <div class="TROIName">{{ item.IntName2 }}</div>
            <div class="TROINum" :class="(item.Nam2>=1)?'ISReadOn':'ISGreenOn'">{{ (item.Nam2==0)?'--':handleNumOn('percent1',item.Nam2) }}</div>
            <div class="TROIName">{{ item.IntName3 }}</div>
            <div class="TROINum">{{ (index===0)?handleNumOn('round',item.Nam3):handleNumOn('percent1',item.Nam3) }}</div>
          </div>

          <div class="TROConIndex">
            <div class="TROIName">{{ item.IntName4 }}</div>
            <div class="TROINum" >{{ handleNumOn('percent1',item.Nam4) }}</div>
            <div class="TROIName">{{ item.IntName5 }}</div>
            <div class="TROINum">{{ (index===0)?handleNumOn('round',item.Nam5):handleNumOn('percent1',item.Nam5) }}</div>
          </div>

          <div class="TROConIndex">
            <div class="TROIName">{{ item.IntName6 }}</div>
            <div class="TROINum" >{{ handleNumOn('percent1',item.Nam6) }}</div>
            <div class="TROIName"></div>
            <div class="TROINum"></div>
          </div>
        </div>
      </div>

      <div class="TRORCDown">
        <div class="TRORCLeft">
          <div class="TRORCLeftTitle">{{(IsChoice==0)?'区域留资数量情况':(IsChoice==1)?'区域跟进及时况':(IsChoice==2)?'工具留资意向情况':'区域留资转化情况'}}</div>
          <div class="TRORCLeftSelect">
            <div class="TRORCLSelect">
              <!-- <Select :label="'主营类目'" :value.sync="type" :options="['全部', '东区', '南区']" /> -->
              <div class="flex flex-start" style="margin-right: 40px">

                <span class="ml10" style="font-size: 12px;">主营类目：</span>
                <a-select v-model="query.ProductSet" mode="multiple" style="min-width: 150px;font-size:12px" dropdownClassName="category">
                    <a-select-option :value="item" v-for="(item, index) in Product" :key="index">
                        {{item}}
                    </a-select-option>
                </a-select>



              </div>
            </div>

            <div class="TRORCLSelect">
              <!-- <Select :label="'留资渠道'" :value.sync="type2" :options="['全部', '东区', '南区']" /> -->
              <div class="flex flex-start" style="margin-right: 0px">

                <span class="ml10" style="font-size: 12px;">留资渠道：</span>
                <a-select v-model="query.ChannelOnSet" mode="multiple" style="min-width: 200px;font-size:12px" dropdownClassName="category">
                    <a-select-option :value="item" v-for="(item, index) in ChannelOn" :key="index">
                        {{item}}
                    </a-select-option>
                </a-select>

              </div>

            </div>
          </div>

          <div class="TRORCLeftTable">
            <!-- <Table v-bind="tableOn" class="table" /> -->
            <div style="padding-right: 8px">
              <table class="TRORCLeftTUser2">
                <thead>
                  <tr>
                    <td>{{(IsChoice===2)?'类型':'店态'}}</td>
                    <td>{{(IsChoice===2)?'分类':'区域'}}</td>
                    <td>{{(IsChoice===0)?'留资数量':(IsChoice===1)?'跟进及时率':(IsChoice===2)?'留资意向率':'留资转化率'}}</td>
                    <td>同期</td>
                    <td>同比</td>
                    <td>上期</td>
                    <td>环比</td>
                  </tr>
                </thead>
              </table>
            </div>
            <!-- :style="{height:(ConHeight)+'px'}" height: 260px;    style="height:32.4px;"-->
            <div class="TRORCLeftTable_Body"  style="width: 100%;  overflow-y: scroll;border: 0px solid;" >
              <table class="TRORCLeftTUser">
                <tbody>
                  <div v-for="(item, index) in OnlyRegionData" :key="index" style="width: 100%; display: contents">
                    <tr class="TR_Height" style="vertical-align: middle;" @mouseleave="[mouseenter(null, null),mouseenter_tr(null)]"  
                      @mouseenter="mouseenter_tr(item.STORE_TYPE)"
                      :style="{background:(curCol===index)?hoverColor:''}"
                    >
                      <td v-if="(index===0||index===4)&&IsChoice!==2" rowspan='4' style="vertical-align: middle;"
                        :style="{background:(OnName===item.STORE_TYPE)?hoverColor:''}"
                      > 
                        <span>{{ item.STORE_TYPE }}</span>
                      </td>

                      <td v-if="IsChoice===2&&(index===0||index===(UserWName['付费']+1)||index===(UserWName['付费']+UserWName['自然']))" 
                        :rowspan="UserWName[item.STORE_TYPE]" style="vertical-align: middle;"
                        :style="{background:(OnName===item.STORE_TYPE)?hoverColor:''}"
                      >
                        <span>{{ item.STORE_TYPE }}</span>
                      </td>
                      <!-- @click="(IsChoice===2)?'':SwitchFun(item.STORE_TYPE, item.S_OR_N, index)" -->
                      <td @mouseenter="mouseenter(index, 1)" :style="{background:(curRow==1)?hoverColor:''}">
                        <!-- v-if="IsChoice!=2" -->
                        <span v-if="IsChoice==222"
                          style="cursor: pointer; text-decoration: underline"
                          :class="collapsed == index && collapsed2 == true ? 'ISChoiceONCss' : ''"
                          >{{ item.S_OR_N }} <b>{{ collapsed == index && collapsed2 == true ? '↑' : '↓' }}</b></span
                        >
                        <span v-else>{{ item.S_OR_N }}</span>
                      </td>
                      <td  @mouseenter="mouseenter(index, 2)" :style="{background:(curRow==2)?hoverColor:''}">
                        {{ (IsChoice===0)?handleNumOn('round',item.ON_NUM):UnitNum('Rate',item.ON_NUM) }}
                      </td>
                      <td  @mouseenter="mouseenter(index, 3)" :style="{background:(curRow==3)?hoverColor:''}">
                        {{ (IsChoice===0)?handleNumOn('round',item.ON_YOY_NUM):UnitNum('Rate',item.ON_YOY_NUM) }}
                      </td>
                      <td  @mouseenter="mouseenter(index, 4)" :style="{background:(curRow==4)?hoverColor:''}" 
                        :class="(item.ON_YOY_DIF==0)?'':(item.ON_YOY_DIF>0)?'ISRead':'ISGreen'">
                        {{ UnitNum('Rate',item.ON_YOY_DIF) }}
                      </td>
                      <td  @mouseenter="mouseenter(index, 5)" :style="{background:(curRow==5)?hoverColor:''}">
                        {{ (IsChoice===0)?handleNumOn('round',item.ON_MOM_LZ):UnitNum('Rate',item.ON_MOM_LZ) }}
                      </td>
                      <td  @mouseenter="mouseenter(index, 6)" :style="{background:(curRow==6)?hoverColor:''}" 
                        :class="(item.ON_MOM_DIF==0)?'':(item.ON_MOM_DIF>0)?'ISRead':'ISGreen'">
                        {{ UnitNum('Rate',item.ON_MOM_DIF) }}
                      </td>
                    </tr>

                    <div v-if="collapsed == index && collapsed2 == true" style="width: 100%; display: contents">
                      <tr v-for="(item, index) in AreaData" :key="index">
                        <td>
                          <span>{{ item.STORE_TYPE }}</span>
                        </td>
                        <td>
                          <span>{{ item.SUB_AREA_NAME }}</span>
                        </td>
                        <td>
                          {{ (IsChoice===0)?item.ON_NUM:UnitNum('Rate',item.ON_NUM) }}
                        </td>
                        <td>
                          {{ (IsChoice===0)?item.ON_YOY_NUM:UnitNum('Rate',item.ON_YOY_NUM) }}
                        </td>
                        <td :class="(item.ON_YOY_DIF==0)?'':(item.ON_YOY_DIF>0)?'ISRead':'ISGreen'">
                          {{ UnitNum('Rate',item.ON_YOY_DIF) }}
                        </td>
                        <td>
                          {{ (IsChoice===0)?item.ON_MOM_LZ:UnitNum('Rate',item.ON_MOM_LZ) }}
                        </td>
                        <td :class="(item.ON_MOM_DIF==0)?'':(item.ON_MOM_DIF>0)?'ISRead':'ISGreen'">
                          {{ UnitNum('Rate',item.ON_MOM_DIF) }}
                        </td>
                      </tr>
                    </div>

                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="TRORCRight">
          <div class="TRORCRightTitle">{{(IsChoice==0)?'留资意向率趋势':(IsChoice==1)?'跟进及时率趋势':(IsChoice==2)?'留资意向率趋势':'留资转化率趋势'}}</div>
          <div class="TRORCRightChe">
            <div class="TRORCRightCheVal">
              <div class="TRORCRightCheTitle" style="line-height: 28px;">店态选择：</div>
              <a-checkbox-group v-model="query.ShopType" style="line-height: 30px;">
                <a-checkbox value="成品店"> 成品店 </a-checkbox>
                <a-checkbox value="融合店"> 融合店 </a-checkbox>
              </a-checkbox-group>
              <div class="HkeepSRSSel" style="padding-left: 40px;">
                <Select :label="'年份'" :value.sync="typeY" :options="YearSelect" />
              </div>              
            </div>


            <div class="TRORCRightLeg">
              <span>当期</span>
              <span>同期</span>
            </div>
          </div>

          <div class="TRORCRightChart">
            <!-- <div class="RightChartsCss" ref="RightCharts"></div> -->
            <v-chart ref="TRORTreet"  style="overflow: visible;" :options="OptionsChart" autoresize ></v-chart>
          </div>

          <div class="TRORCRightTable">
            <Table v-bind="tableOnM" class="tableCss" />
            <!-- <Jump /> -->
          </div>
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
import Select from '../../components/Select'
import Table from '../../components/Table'
// import Jump from '../../components/Jump'
import moment from 'moment'
import orderBy from 'lodash/orderBy'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import echartStyle from "../../utils/echartStyle";

export default {
  name: 'TuRateOfRetCap',

  components: {
    Title,
    Table,
    Select,
    // Jump,
  },

  data() {
    return {

      CheckedVal:true,

      hoverColor: 'rgba(135,206,250, 0.2)',
      curCol : null,
      curRow : null,
      OnName : null,

      ConHeight:0,
      query: {
        ProductSet: ['成品','定制'], 
        ChannelOnSet:['自然','付费','代投'],
        ShopType:[],
      },
      Product:[],  //主营类目
      ChannelOn:[],  //留资渠道
      YearSelect:[], //年份选择

      UserONlyRegion: [],
      OnlyRegionData: [],
      collapsed: 11111,
      collapsed2: false,
      LastIndex: 11111,
      UserArea:[],
      AreaData: [],
      TrendData:[],
      TrendTableData:[],
      
      Var_shop_type:'', 
      Var_Region:'', 
      Var_index:'',

      UserWName:{},  //意向率合并单元格

      month: moment(_time_now).format('YYYYMM'),
      type: '全部',
      type2: '全部',
      typeY:moment(_time_now).format('YYYY'),
      
      IsChoice: 0,
      GetCapRetenData: [

        {
          IntName: '留资数量',
          Num: 0,
          IntName2: '达成',
          Nam2: 0,
          IntName3: '成品店',
          Nam3: 0,
          IntName4: '同比',
          Nam4: 0,
          IntName5: '融合店',
          Nam5: 0,
          IntName6: '环比',
          Nam6: 0,
        },
        {
          IntName: '跟进及时率',
          Num: 0,  
          IntName2: '达成',
          Nam2: 0,
          IntName3: '成品店',
          Nam3: 0,
          IntName4: '同比',
          Nam4: 0,
          IntName5: '融合店',
          Nam5: 0,
          IntName6: '环比',
          Nam6: 0,
        },
        {
          IntName: '留资意向率',  
          Num: 0,  
          IntName2: '达成', 
          Nam2: 0, 
          IntName3: '成品店',
          Nam3: 0,
          IntName4: '同比',
          Nam4: 0,
          IntName5: '融合店',
          Nam5: 0,
          IntName6: '环比',
          Nam6: 0,
        },
        {
          IntName: '留资转化率',  
          Num: 0,  
          IntName2: '达成',
          Nam2: 0, 
          IntName3: '成品店',
          Nam3: 0, 
          IntName4: '同比',
          Nam4: 0, 
          IntName5: '融合店',
          Nam5: 0,
          IntName6: '环比',
          Nam6: 0,
        },

      ],
      tableOn: {
        index: 'TuRateOfRetDat',
        labelData: ['店态', '成品店', '成品店', '成品店', '融合店', '融合店'],
        tableData: [
          ['区域', 1, 1, 1, 1, 1],
          ['留资数量', 1, 1, 1, 1, 1],
          ['同期', 1, 1, 1, 1, 1],
          ['同比', 1, 1, 1, 1, 1],
          ['上期', 1, 1, 1, 1, 1],
          ['环比', 1, 1, 1, 1, 1],
        ],
      },

      tableOnM: {
        index: 'TuRateOfRetDatB',
        labelData: ['月份', '目标', '实际', '达成', '同比', '环比'],
        tableData: [
          // ['月份', 1, 1, 1, 1, 1],
          // ['年累计', 1, 1, 1, 1, 1],
          // ['当期累计', 1, 1, 1, 1, 1],
          // ['1月', 1, 1, 1, 1, 1],
          // ['2月', 1, 1, 1, 1, 1],
          // ['3月', 1, 1, 1, 1, 1],
          // ['4月', 1, 1, 1, 1, 1],
          // ['5月', 1, 1, 1, 1, 1],
          // ['6月', 1, 1, 1, 1, 1],
          // ['7月', 1, 1, 1, 1, 1],
          // ['8月', 1, 1, 1, 1, 1],
          // ['9月', 1, 1, 1, 1, 1],
          // ['10月', 1, 1, 1, 1, 1],
          // ['11月', 1, 1, 1, 1, 1],
          // ['12月', 1, 1, 1, 1, 1],
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
            data: [],
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
            data: [],
            itemStyle: {
              normal: {
                color: echartStyle.thisYear,
              },
            },
            label: {
              show: false,
              position: 'top',
            },
            smooth: true,
            z: 2,
            symbol: 'none',
            areaStyle: echartStyle.areaStyle[0]
          },
          {
            name: '同期业绩',
            type: 'line',
            barWidth: '20',
            data: [],
            label: {
              show: false,
              position: 'top',
            },
            z: 1,
            smooth: true,
            itemStyle: {
              normal: {
                color: echartStyle.previousYear,
              },
            },
            lineStyle: {
              color: echartStyle.previousYear,
            },
            symbol: 'none',
              areaStyle: echartStyle.areaStyle[1]
          },
        ],
      },
    }
  },

  watch: {
    month() {
      // console.log('运行上了！！！')
      this.GetCapRetenSum()
      if(this.IsChoice===2){
        this.GetInvestment(); 
      }else{
        this.GetTranOfRetCapRegion();
        this.GetTranOfRetCap();
        this.collapsed2=false;
      }
      // this.GetCapRetenTrend();
      // this.GetTableTrend();
      
    },
    'query.ChannelOnSet'(){
      // console.log("运行上了！！！-----------");
      if(this.IsChoice===2){
        this.GetInvestment(); 
      }else{
        this.GetTranOfRetCapRegion();
        this.GetTranOfRetCap();
        this.collapsed2=false;
      }

    },

    'query.ProductSet'(){
      // console.log("=-=====运行上了主营类目这里！===");
      if(this.IsChoice===2){
        this.GetInvestment(); 
      }else{
        this.GetTranOfRetCapRegion();
        this.GetTranOfRetCap();
        this.collapsed2=false;
      }
    },

    'query.ShopType'(){
      this.GetCapRetenTrend();
      this.GetTableTrend();
    },

    'typeY'(){
      this.GetCapRetenTrend();
      this.GetTableTrend();
    },

    'CheckedVal'(){
      // console.log(this.CheckedVal);
      this.GetCapRetenSum();
      if(this.IsChoice===2){
        this.GetInvestment(); 
      }else{
        this.GetTranOfRetCapRegion();
        this.GetTranOfRetCap();
        this.collapsed2=false;
      }
      this.GetTableTrend();
      this.GetCapRetenTrend();

    }

  },
  async created() {
    let res = await this.$fetchSql('new_retail', 'new_retail_lz_select',)
    res.data.sort((a, b) => {
      return a['SHOP_RANK'] - b['SHOP_RANK']
    })
    this.Product = Object.freeze(Array.from(new Set(res.data.map((_) => _.PRODUCT_CATE)))) //主营类目
    this.ChannelOn = Object.freeze(Array.from(new Set(res.data.map((_) => _.CHANNEL_TYPE))))  //留资渠道
    this.query.ChannelOnSet=[];
    Object.keys(this.ChannelOn).forEach((OnKey) => {
      this.query.ChannelOnSet.push(this.ChannelOn[OnKey]);
    });


    this.YearSelect = Array.from(new Set(res.data.map((_) => _.USER_YAER)))  //获取年份
    this.YearSelect.sort((a,b)=>{return b-a});

    this.GetCapRetenSum()
    this.GetTranOfRetCapRegion()
    this.GetCapRetenTrend()
    this.GetTableTrend()
  },
  mounted() {

     //获取内容页的高度
    // console.log("=========初始化！！！！！！=======")
    // this.ConHeight=this.$refs['ID_content'].scrollHeight;
    // window.onresize = () =>{
    //   console.log("===========高度变化了！！！=====");
    //   this.ConHeight=this.$refs['ID_content'].scrollHeight;
    //   this.ConHeight=this.ConHeight-306
    //   console.log(this.$refs['ID_content'].scrollHeight);
    // }
    // this.RightChartsFun()
    // 每次都需要清除画布
    this.$refs.TRORTreet.$refs.echarts.clear();


  },
  methods: {
    onChange(checked) {
      this.CheckedVal = checked;
    },
    mouseenter(col, row){
      this.curCol = col;
      this.curRow = row;
    },

    mouseenter_tr(name){
      this.OnName = name;
    },

    async GetCapRetenSum() {
      let query = {
        MDATE: this.month,
        IS_DAITOU_FILTER:(this.CheckedVal===true)?'是':'否'
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_lz_sum', query)

      // console.log('=====留资总览====')
      // arr.unshift(source.filter(_ => _.MONTH_DATE === '年均')[0])
      // console.log(res.data);
      // console.log(res.data.length);
      // console.log(res.data.filter(_=>_.STORE_TYPE==='整体'));
      // console.log(res.data.filter(_=>_.STORE_TYPE==='整体')[0].LZ_FIN_CNT);
      this.GetCapRetenData = [
        {
          IntName: '留资数量',
          Num: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].LZ_CNT:'--',
          IntName2: '达成',
          Nam2: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].LZ_FIN_CNT:'--',
          IntName3: '成品店',
          Nam3: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='成品店')[0].LZ_CNT:'--',
          IntName4: '同比',
          Nam4: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].YOY_DIF_LZ_CNT:'--',
          IntName5: '融合店',
          Nam5: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='融合店')[0].LZ_CNT:'--',
          IntName6: '环比',
          Nam6: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].MOM_DIF_LZ_CNT:'--',
        },
        {
          IntName: '跟进及时率',
          Num: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].ONTIME_LABEL_RAT:'--',  
          IntName2: '达成',
          Nam2: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].ONTIME_LABEL_FIN_RAT:'--',
          IntName3: '成品店',
          Nam3: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='成品店')[0].ONTIME_LABEL_RAT:'--',
          IntName4: '同比',
          Nam4: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].YOY_DIF_ONTIME_LABEL_RAT:'--',
          IntName5: '融合店',
          Nam5: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='融合店')[0].ONTIME_LABEL_RAT:'--',
          IntName6: '环比',
          Nam6: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].MOM_DIF_ONTIME_LABEL_RAT:'--',
        },
        {
          IntName: '留资意向率',  
          Num: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].YYX_LZ_RAT:'--',  
          IntName2: '达成', 
          Nam2: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].YYX_LZ_FIN_RAT:'--', 
          IntName3: '成品店',
          Nam3: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='成品店')[0].YYX_LZ_RAT:'--',
          IntName4: '同比',
          Nam4: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].YOY_DIF_YYX_LZ_RAT:'--',
          IntName5: '融合店',
          Nam5: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='融合店')[0].YYX_LZ_RAT:'--',
          IntName6: '环比',
          Nam6: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].MOM_DIF_YYX_LZ_RAT:'--',
        },
        {
          IntName: '付费留资转化率(近120天)',  
          Num: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].FFCJ_LA_RAT:'--',  
          IntName2: '达成',
          Nam2: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].FFCJ_LA_FIN_RAT:'--', 
          IntName3: '成品店',
          Nam3: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='成品店')[0].FFCJ_LA_RAT:'--', 
          IntName4: '同比',
          Nam4: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].YOY_DIF_FFCJ_LA_RAT:'--', 
          IntName5: '融合店',
          Nam5: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='融合店')[0].FFCJ_LA_RAT:'--',
          IntName6: '环比',
          Nam6: (res.data.length!=0)?res.data.filter(_=>_.STORE_TYPE==='整体')[0].MOM_DIF_FFCJ_LA_RAT:'--',
        },
      ]
    },

    SwitchFun(shop_type, Region, index){
      if(this.collapsed2 == true){
        this.collapsed2=false;
      }else{
        this.collapsed2=true;
      }
      this.collapsed = index;
      this.GetTranOfRetCap(shop_type, Region)
    },

    async GetTranOfRetCap(shop_type, Region) {

      this.Var_shop_type=(shop_type)?shop_type:this.Var_shop_type;
      this.Var_Region=(Region)?Region:this.Var_Region;


      let query = {
        MDATE: this.month,
        S_OR_N: this.Var_Region,
        STORE_TYPE: this.Var_shop_type,
        PRODUCT_CATE:this.query.ProductSet.join(','),
        CHANNEL_TYPE:this.query.ChannelOnSet.join(','),
        IS_DAITOU_FILTER:(this.CheckedVal===true)?'是':'否'
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_lz_zrea', query)
      // console.log('=======留资转化！！======')
      // console.log(Region)
      // console.log(index)
      // console.log(res.data)
      // this.AreaData = res.data
      this.UserArea=res.data;
      this.IsChoiceFunAreaData();

    },

    async GetTranOfRetCapRegion() {
      let query = {
        MDATE: this.month,
        PRODUCT_CATE:this.query.ProductSet.join(','),
        CHANNEL_TYPE:this.query.ChannelOnSet.join(','),
        IS_DAITOU_FILTER:(this.CheckedVal===true)?'是':'否'
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_region', query)
      console.log('=======留资转化！！只取大区======')
      res.data.sort((a, b) => {
        return a['SHOP_RANK'] - b['SHOP_RANK']
      })
      this.UserONlyRegion = res.data;
      this.OnlyRegionData = [];
      let Num_Var = 0
      let Yoy_Num_Var = 0
      let Mom_Num_Var = 0
      Object.keys(this.UserONlyRegion).forEach((OnKey) => {
          if (this.IsChoice === 0) {
            Num_Var = this.UserONlyRegion[OnKey].LZ_CNT
            Yoy_Num_Var = this.UserONlyRegion[OnKey].YOY_LZ_CNT
            Mom_Num_Var = this.UserONlyRegion[OnKey].MOM_LZ_CNT
          } else if (this.IsChoice === 1) {
            Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].ONTIME_LABEL_CNT / this.UserONlyRegion[OnKey].TEL_OPER_CONFIRM_CNT)
            Yoy_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].YOY_ONTIME_LABEL_CNT / this.UserONlyRegion[OnKey].YOY_TEL_OPER_CONFIRM_CNT)
            Mom_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].MOM_ONTIME_LABEL_CNT / this.UserONlyRegion[OnKey].MOM_TEL_OPER_CONFIRM_CNT)
          }else if(this.IsChoice === 2){
            Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].YYX_LZ_QTY / this.UserONlyRegion[OnKey].WCGZ_LZ_QTY)
            Yoy_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].YOY_YYX_LZ_QTY / this.UserONlyRegion[OnKey].YOY_WCGZ_LZ_QTY)
            Mom_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].MOM_YYX_LZ_QTY / this.UserONlyRegion[OnKey].MOM_WCGZ_LZ_QTY)
          }else if(this.IsChoice === 3){
            Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].FFCJ_LZ_QTY / this.UserONlyRegion[OnKey].TEL_CONFIRM_CNT_120)
            Yoy_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].YOY_FFCJ_LZ_QTY / this.UserONlyRegion[OnKey].YOY_TEL_CONFIRM_CNT_120)
            Mom_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].MOM_FFCJ_LZ_QTY / this.UserONlyRegion[OnKey].MOM_TEL_CONFIRM_CNT_120)
          }
          this.OnlyRegionData.push({
            S_OR_N: this.UserONlyRegion[OnKey].S_OR_N,
            STORE_TYPE: this.UserONlyRegion[OnKey].STORE_TYPE,
            ON_NUM: Num_Var,
            ON_YOY_NUM: Yoy_Num_Var,
            ON_YOY_DIF: Yoy_Num_Var != 0 && Yoy_Num_Var !='--' && Num_Var !='--' ? (Num_Var - Yoy_Num_Var) / Yoy_Num_Var : 0,
            ON_MOM_LZ: Mom_Num_Var,
            ON_MOM_DIF: Mom_Num_Var != 0 && Mom_Num_Var !='--' && Num_Var !='--' ? (Num_Var - Mom_Num_Var) / Mom_Num_Var : 0,
          })  
      })

    },


    async GetInvestment() {
      let query = {
        MDATE: this.month,
        PRODUCT_CATE:this.query.ProductSet.join(','),
        CHANNEL_TYPE:this.query.ChannelOnSet.join(','),
        IS_DAITOU_FILTER:(this.CheckedVal===true)?'是':'否'
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_product', query)
      console.log('=======运行到留资意向这里！！======')
      let Num_Var = 0
      let Yoy_Num_Var = 0
      let Mom_Num_Var = 0
      let SHOP_RANK_Var=0;
      this.OnlyRegionData = []
      Object.keys(res.data).forEach((OnKey) => {
        if(this.IsChoice === 2){
          Num_Var = this.UnitNum('ISNull',res.data[OnKey].YYX_LZ_QTY / res.data[OnKey].WCGZ_LZ_QTY)
          Num_Var=(Num_Var=='--')?0:Num_Var;
          Yoy_Num_Var = this.UnitNum('ISNull',res.data[OnKey].YOY_YYX_LZ_QTY / res.data[OnKey].YOY_WCGZ_LZ_QTY)
          Mom_Num_Var = this.UnitNum('ISNull',res.data[OnKey].MOM_YYX_LZ_QTY / res.data[OnKey].MOM_WCGZ_LZ_QTY)
          SHOP_RANK_Var=res.data[OnKey].SHOP_RANK
        }
        this.OnlyRegionData.push({
          S_OR_N: res.data[OnKey].LZ_TYPE,
          STORE_TYPE: res.data[OnKey].CHANNEL_TYPE,
          ON_NUM: Num_Var,
          ON_YOY_NUM: Yoy_Num_Var,
          ON_YOY_DIF: Yoy_Num_Var != 0 && Yoy_Num_Var !='--' && Num_Var !='--' ? (Num_Var - Yoy_Num_Var) / Yoy_Num_Var : 0,
          ON_MOM_LZ: Mom_Num_Var,
          ON_MOM_DIF: Mom_Num_Var != 0 && Mom_Num_Var !='--' && Num_Var !='--' ? (Num_Var - Mom_Num_Var) / Mom_Num_Var : 0,
          SHOP_RANK:SHOP_RANK_Var
        })  
      });
      // 排序
      console.log("========ada===")
      console.log(res.data);
      this.OnlyRegionData= orderBy(this.OnlyRegionData,['SHOP_RANK','ON_NUM'],['asc','desc']);
      // 处理合并单元格的
      let SelectOnT = Object.freeze(Array.from(new Set(res.data.map((_) => _.CHANNEL_TYPE))));
      
      this.UserWName={};
      Object.keys(SelectOnT).forEach((Type) => {
        this.UserWName[SelectOnT[Type]]=this.OnlyRegionData.filter((_)=>_["STORE_TYPE"]==SelectOnT[Type]).length;
      });
      // 处理合并单元格的
      console.log(SelectOnT);
      console.log(this.UserWName);

    },

    async IsChoiceFun(Num) {
      this.IsChoice = Num
      let Num_Var = 0
      let Yoy_Num_Var = 0
      let Mom_Num_Var = 0
      if(this.IsChoice === 2){
        this.GetInvestment();
      }else{
        this.OnlyRegionData = []
        Object.keys(this.UserONlyRegion).forEach((OnKey) => {
          if (this.IsChoice === 0) {
            Num_Var = this.UserONlyRegion[OnKey].LZ_CNT
            Yoy_Num_Var = this.UserONlyRegion[OnKey].YOY_LZ_CNT
            Mom_Num_Var = this.UserONlyRegion[OnKey].MOM_LZ_CNT
          } else if (this.IsChoice === 1) {
            Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].ONTIME_LABEL_CNT / this.UserONlyRegion[OnKey].TEL_OPER_CONFIRM_CNT)
            Yoy_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].YOY_ONTIME_LABEL_CNT / this.UserONlyRegion[OnKey].YOY_TEL_OPER_CONFIRM_CNT)
            Mom_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].MOM_ONTIME_LABEL_CNT / this.UserONlyRegion[OnKey].MOM_TEL_OPER_CONFIRM_CNT)
          }else if(this.IsChoice === 2){
            Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].YYX_LZ_QTY / this.UserONlyRegion[OnKey].WCGZ_LZ_QTY)
            Yoy_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].YOY_YYX_LZ_QTY / this.UserONlyRegion[OnKey].YOY_WCGZ_LZ_QTY)
            Mom_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].MOM_YYX_LZ_QTY / this.UserONlyRegion[OnKey].MOM_WCGZ_LZ_QTY)
          }else if(this.IsChoice === 3){
            Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].FFCJ_LZ_QTY / this.UserONlyRegion[OnKey].TEL_CONFIRM_CNT_120)
            Yoy_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].YOY_FFCJ_LZ_QTY / this.UserONlyRegion[OnKey].YOY_TEL_CONFIRM_CNT_120)
            Mom_Num_Var = this.UnitNum('ISNull',this.UserONlyRegion[OnKey].MOM_FFCJ_LZ_QTY / this.UserONlyRegion[OnKey].MOM_TEL_CONFIRM_CNT_120)
          }
          this.OnlyRegionData.push({
            S_OR_N: this.UserONlyRegion[OnKey].S_OR_N,
            STORE_TYPE: this.UserONlyRegion[OnKey].STORE_TYPE,
            ON_NUM: Num_Var,
            ON_YOY_NUM: Yoy_Num_Var,
            ON_YOY_DIF: Yoy_Num_Var != 0 && Yoy_Num_Var !='--' && Num_Var !='--' ? (Num_Var - Yoy_Num_Var) / Yoy_Num_Var : 0,
            ON_MOM_LZ: Mom_Num_Var,
            ON_MOM_DIF: Mom_Num_Var != 0 && Mom_Num_Var !='--' && Num_Var !='--' ? (Num_Var - Mom_Num_Var) / Mom_Num_Var : 0,
          })        
        })
        this.IsChoiceFunAreaData();
      }

      this.RightChartsFun();
      this.RightTableFun();

    },

    IsChoiceFunAreaData(){  
      this.AreaData=[];
      let Num_Var = 0
      let Yoy_Num_Var = 0
      let Mom_Num_Var = 0
      Object.keys(this.UserArea).forEach((OnKey) => {
        if (this.IsChoice === 0) {
          Num_Var = this.UserArea[OnKey].LZ_CNT
          Yoy_Num_Var = this.UserArea[OnKey].YOY_LZ_CNT
          Mom_Num_Var = this.UserArea[OnKey].MOM_LZ_CNT
        } else if (this.IsChoice === 1) {
          Num_Var = this.UnitNum('ISNull',this.UserArea[OnKey].ONTIME_LABEL_CNT / this.UserArea[OnKey].TEL_OPER_CONFIRM_CNT)
          Yoy_Num_Var = this.UnitNum('ISNull',this.UserArea[OnKey].YOY_ONTIME_LABEL_CNT / this.UserArea[OnKey].YOY_TEL_OPER_CONFIRM_CNT)
          Mom_Num_Var = this.UnitNum('ISNull',this.UserArea[OnKey].MOM_ONTIME_LABEL_CNT / this.UserArea[OnKey].MOM_TEL_OPER_CONFIRM_CNT)
        }else if(this.IsChoice === 2){
          Num_Var = this.UnitNum('ISNull',this.UserArea[OnKey].YYX_LZ_QTY / this.UserArea[OnKey].WCGZ_LZ_QTY)
          Yoy_Num_Var = this.UnitNum('ISNull',this.UserArea[OnKey].YOY_YYX_LZ_QTY / this.UserArea[OnKey].YOY_WCGZ_LZ_QTY)
          Mom_Num_Var = this.UnitNum('ISNull',this.UserArea[OnKey].MOM_YYX_LZ_QTY / this.UserArea[OnKey].MOM_WCGZ_LZ_QTY)
        }else if(this.IsChoice === 3){
          Num_Var = this.UnitNum('ISNull',this.UserArea[OnKey].FFCJ_LZ_QTY / this.UserArea[OnKey].TEL_OPER_CONFIRM_CNT)
          Yoy_Num_Var = this.UnitNum('ISNull',this.UserArea[OnKey].YOY_FFCJ_LZ_QTY / this.UserArea[OnKey].YOY_TEL_OPER_CONFIRM_CNT)
          Mom_Num_Var = this.UnitNum('ISNull',this.UserArea[OnKey].MOM_FFCJ_LZ_QTY / this.UserArea[OnKey].MOM_TEL_OPER_CONFIRM_CNT)
        }
        this.AreaData.push({
          SUB_AREA_NAME: this.UserArea[OnKey].SUB_AREA_NAME,
          STORE_TYPE: this.UserArea[OnKey].STORE_TYPE,
          ON_NUM: Num_Var,
          ON_YOY_NUM: Yoy_Num_Var,
          ON_YOY_DIF: Yoy_Num_Var != 0 && Yoy_Num_Var !='--' && Num_Var !='--' ? (Num_Var - Yoy_Num_Var) / Yoy_Num_Var : 0,
          ON_MOM_LZ: Mom_Num_Var,
          ON_MOM_DIF: Mom_Num_Var != 0 && Mom_Num_Var !='--' && Num_Var !='--' ? (Num_Var - Mom_Num_Var) / Mom_Num_Var : 0,
        }) 

      });

    },

    async GetCapRetenTrend() {
      let query = {
        // MDATE: this.month,
        // MDATE2:(this.month.substring(0,4)-1)+'01',
        MDATE: this.typeY,
        MDATE2:(this.typeY-1)+'',
        STORE_TYPE:this.query.ShopType.join(','),
        IS_DAITOU_FILTER:(this.CheckedVal===true)?'是':'否'
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_trend', query);
      res.data.sort((a, b) => {
        return a['MDATE_WID'] - b['MDATE_WID']
      })
      // console.log("======运行到趋势图这里来！！！=========");
      this.TrendData=res.data;
      this.RightChartsFun();

    },
    RightChartsFun() {
      this.typeY=this.typeY+'';
      let UserOnData=this.TrendData;
      // this.RightChartsVal = echarts.init(this.$refs['RightCharts'])
      let MonData=[];
      let Amt=[];
      let AgoAmt=[];
      let AmtVar=0;
      let AgoAmtVar=0;
      Object.keys(UserOnData).forEach((OnKey) => {
        if(UserOnData[OnKey].MDATE_WID.substring(0,4)==(this.typeY.substring(0,4)-1)){
          MonData.push(UserOnData[OnKey].MDATE_WID.substring(4,6)+'月');
          if(this.IsChoice===0){
            AgoAmtVar=UserOnData[OnKey].LZ_CNT;
          }else if(this.IsChoice===1){
            AgoAmtVar=this.UnitNum('ISNull',UserOnData[OnKey].ONTIME_LABEL_CNT / UserOnData[OnKey].TEL_OPER_CONFIRM_CNT);
          }else if(this.IsChoice===2){
            AgoAmtVar = this.UnitNum('ISNull',UserOnData[OnKey].YYX_LZ_QTY / UserOnData[OnKey].WCGZ_LZ_QTY)
          }else if(this.IsChoice===3){
            AgoAmtVar = this.UnitNum('ISNull',UserOnData[OnKey].FFCJ_LZ_QTY / UserOnData[OnKey].TEL_CONFIRM_CNT_120)
          }
          AgoAmt.push((AgoAmtVar!='--')?AgoAmtVar:0);  
        }
        if(UserOnData[OnKey].MDATE_WID.substring(0,4)==(this.typeY.substring(0,4))){
          if(this.IsChoice===0){
            AmtVar=UserOnData[OnKey].LZ_CNT;
          }else if(this.IsChoice===1){
            AmtVar=this.UnitNum('ISNull',UserOnData[OnKey].ONTIME_LABEL_CNT/UserOnData[OnKey].TEL_OPER_CONFIRM_CNT);
          }else if(this.IsChoice===2){
            AmtVar = this.UnitNum('ISNull',UserOnData[OnKey].YYX_LZ_QTY / UserOnData[OnKey].WCGZ_LZ_QTY)
          }else if(this.IsChoice===3){
            AmtVar = this.UnitNum('ISNull',UserOnData[OnKey].FFCJ_LZ_QTY / UserOnData[OnKey].TEL_CONFIRM_CNT_120)
          }
          Amt.push((AmtVar!='--')?AmtVar:0);    
        }
      });

      // console.log(Amt.map(_=>_*1000));

      this.OptionsChart.yAxis[0].axisLabel.formatter = (this.IsChoice===0)?'{value}':'{value}%'
      this.OptionsChart.xAxis[0].data = MonData;
      this.OptionsChart.series[0].data = (this.IsChoice===0)?Amt:Amt.map(_=>_*100)
      this.OptionsChart.series[1].data = (this.IsChoice===0)?AgoAmt:AgoAmt.map(_=>_*100)
      this.OptionsChart.series[0].name='当期'
      this.OptionsChart.series[1].name='同期'
      this.OptionsChart.series[0].itemStyle.normal.color='#5b8ff9';
      this.OptionsChart.series[1].itemStyle.normal.color='#dfdfdf';

      this.OptionsChart.tooltip.formatter = (params) => {
        let OnVar1='';
        if(params.length!=1){
          OnVar1=params[0].name + '<br/>' +params[0].marker+params[0].seriesName+'：'+ 
            ((this.IsChoice===0)?this.handleNumOn('round',params[0].value):(params[0].value).toFixed(1)+'%')+'<br/>'+params[1].marker+params[1].seriesName+'：'+ 
            ((this.IsChoice===0)?this.handleNumOn('round',params[1].value):(params[1].value).toFixed(1)+'%');
        }else{
          OnVar1=params[0].name + '<br/>' +params[0].marker+params[0].seriesName+'：'+ 
            ((this.IsChoice===0)?this.handleNumOn('round',params[0].value):(params[0].value).toFixed(1)+'%');
        }
        return OnVar1
      }


      // this.RightChartsVal.setOption(this.OptionsChart)
    },


    async GetTableTrend() {   
      let query = {
        // MDATE: this.month,
        // MDATE2:(this.month.substring(0,4)-1)+'01',
        MDATE: this.typeY,
        MDATE2:(this.typeY-1)+'',
        STORE_TYPE:(this.query.ShopType.length==1)?this.query.ShopType.join(','):'整体',
        IS_DAITOU_FILTER:(this.CheckedVal===true)?'是':'否'
      }

      let res = await this.$fetchSql('new_retail', 'new_retail_table_trend', query);
      res.data.sort((a, b) => {
        return a['MDATE_WID'] - b['MDATE_WID']
      })
      this.TrendTableData=res.data;
      this.RightTableFun();
    },


    RightTableFun(){

      this.typeY=this.typeY+'';
      let UserOnData=this.TrendTableData;

      this.tableOnM.labelData=[];
      this.tableOnM.labelData=['月份','目标',(this.typeY.substring(0,4))+'年',(this.typeY.substring(0,4)-1)+'年','同比','达成'];
      this.tableOnM.tableData=[];
      this.tableOnM.tableData=[
        ['年累计','--'],
        ['月累计','--'],
      ];
      let TGT_Y_VAL=0; //年累计目标
      let TGT_M_VAL=0; //月累计目标
      let YOY_YTD_NUM=0;// 同期年累计
      let YOY_MTD_NUM=0;// 同期月累计
      let YTD_NUM=0;// 年累计
      let MTD_NUM=0;// 月累计
      let YOY_RAT_Y=0;//年累计同比
      let YOY_RAT_M=0;//月累计同比
      let REACH_VAR_Y=0;//年累计达成
      let REACH_VAR_M=0;//月累计达成
      let IsTGTVAL=0;
      let IsTGTVAL_M=0;

      let Call_By={
        Mole_Var_Y:0,
        DenTor_Var_Y:0,
        Rate_Var_Y:0,
        Mole_Var_Y_YOY:0,
        DenTor_Var_Y_YOY:0,
        Rate_Var_Y_YOY:0,
        Mole_Var_M_YOY:0,
        DenTor_Var_M_YOY:0,
        Rate_Var_M_YOY:0,
        TGT_Var:0,
        TGT_Var_Num:0,
        TGT_Var_M:0,
        TGT_Var_Num_M:0,
      };

      // if(this.IsChoice===0){
      Object.keys(UserOnData).forEach((OnKey) => {
        if(UserOnData[OnKey].MDATE_WID.substring(0,4)==(this.typeY.substring(0,4)-1)){  
          //获取上一年的数  所以同期之应该就是用当期的值
          Call_By['Mole_Var_Y_YOY']+=(this.IsChoice===0)?0:(this.IsChoice===1)?UserOnData[OnKey].ONTIME_LABEL_CNT:
            (this.IsChoice===2)?UserOnData[OnKey].YYX_LZ_QTY:(this.IsChoice===3)?UserOnData[OnKey].FFCJ_LZ_QTY:0;
          Call_By['DenTor_Var_Y_YOY']+=(this.IsChoice===0)?0:(this.IsChoice===1)?UserOnData[OnKey].TEL_OPER_CONFIRM_CNT:
            (this.IsChoice===2)?UserOnData[OnKey].WCGZ_LZ_QTY:(this.IsChoice===3)?UserOnData[OnKey].TEL_CONFIRM_CNT_120:0;
          Call_By['Rate_Var_Y_YOY']+=(this.IsChoice===0)?UserOnData[OnKey].LZ_CNT:0;


          this.tableOnM.tableData.push(
            [UserOnData[OnKey].MDATE_WID.substring(4,6)+'月','--','--',
            (this.IsChoice===0)? this.handleNumOn('round',UserOnData[OnKey].LZ_CNT):
            (this.IsChoice===1)?this.handleNumOn('percent1',UserOnData[OnKey].ONTIME_LABEL_RAT):
            (this.IsChoice===2)?this.handleNumOn('percent1',UserOnData[OnKey].YYX_LZ_RAT):
              this.handleNumOn('percent1',UserOnData[OnKey].FFCJ_LA_RAT),
            '--','--']
        )}
      });

      Object.keys(this.tableOnM.tableData).forEach((OnKey2) => { 
        // console.log(this.tableOnM.tableData[OnKey2][0]);
        Object.keys(UserOnData).forEach((OnKey3) => {
          if(this.tableOnM.tableData[OnKey2][0]=='年累计'&&
              UserOnData[OnKey3].MDATE_WID.substring(0,4)==(this.typeY.substring(0,4))){
                // console.log("=======年累计！！！========");
                // console.log(UserOnData[OnKey3].MDATE_WID.substring(4,6)+'月') 

                IsTGTVAL=(this.IsChoice===0)?UserOnData[OnKey3].TGT_LZ_CNT:(this.IsChoice===1)?UserOnData[OnKey3].TGT_ONTIME_LABEL_RAT:
                  (this.IsChoice===2)?UserOnData[OnKey3].TGT_YYX_LZ_RAT:(this.IsChoice===3)?UserOnData[OnKey3].TGT_FFCJ_LA_RAT:0;
                Call_By['TGT_Var']+=IsTGTVAL
                Call_By['TGT_Var_Num']+=((IsTGTVAL!=0)?1:0); 

                Call_By['Mole_Var_Y']+=(this.IsChoice===0)?0:(this.IsChoice===1)?UserOnData[OnKey3].ONTIME_LABEL_CNT:
                  (this.IsChoice===2)?UserOnData[OnKey3].YYX_LZ_QTY:(this.IsChoice===3)?UserOnData[OnKey3].FFCJ_LZ_QTY:0;
                Call_By['DenTor_Var_Y']+=(this.IsChoice===0)?0:(this.IsChoice===1)?UserOnData[OnKey3].TEL_OPER_CONFIRM_CNT:
                  (this.IsChoice===2)?UserOnData[OnKey3].WCGZ_LZ_QTY:(this.IsChoice===3)?UserOnData[OnKey3].TEL_CONFIRM_CNT_120:0;
                Call_By['Rate_Var_Y']+=(this.IsChoice===0)?UserOnData[OnKey3].LZ_CNT:0;


                if(moment(UserOnData[OnKey3].MDATE_WID).format('YYYYMM')<=moment(_time_now).format('YYYYMM')){ 
                  // 如果数据数据年月少于系统年月达到条件  所以不需要再另外做判断
                  IsTGTVAL_M=(this.IsChoice===0)?UserOnData[OnKey3].TGT_LZ_CNT:(this.IsChoice===1)?UserOnData[OnKey3].TGT_ONTIME_LABEL_RAT:
                    (this.IsChoice===2)?UserOnData[OnKey3].TGT_YYX_LZ_RAT:(this.IsChoice===3)?UserOnData[OnKey3].TGT_FFCJ_LA_RAT:0;
                  Call_By['TGT_Var_M']+=IsTGTVAL_M
                  Call_By['TGT_Var_Num_M']+=((IsTGTVAL_M!=0)?1:0); 
                  Call_By['Mole_Var_M_YOY']+=(this.IsChoice===0)?0:(this.IsChoice===1)?UserOnData[OnKey3].YOY_ONTIME_LABEL_CNT:
                    (this.IsChoice===2)?UserOnData[OnKey3].YOY_YYX_LZ_QTY:(this.IsChoice===3)?UserOnData[OnKey3].YOY_FFCJ_LZ_QTY:0;
                  Call_By['DenTor_Var_M_YOY']+=(this.IsChoice===0)?0:(this.IsChoice===1)?UserOnData[OnKey3].YOY_TEL_OPER_CONFIRM_CNT:
                    (this.IsChoice===2)?UserOnData[OnKey3].YOY_WCGZ_LZ_QTY:(this.IsChoice===3)?UserOnData[OnKey3].YOY_TEL_CONFIRM_CNT_120:0;
                  Call_By['Rate_Var_M_YOY']+=(this.IsChoice===0)?UserOnData[OnKey3].YOY_LZ_CNT:0;
                }


                //YOY_MTD_NUM+=UserOnData[OnKey3].YOY_LZ_CNT;
                // YTD_NUM+=UserOnData[OnKey3].LZ_CNT;

                MTD_NUM+=UserOnData[OnKey3].LZ_CNT;

              this.tableOnM.tableData[OnKey2][1]='--';
              this.tableOnM.tableData[OnKey2][2]='--';
              this.tableOnM.tableData[OnKey2][4]='--';
              this.tableOnM.tableData[OnKey2][5]='--';
          }
          if(this.tableOnM.tableData[OnKey2][0]=='月累计'){
              this.tableOnM.tableData[OnKey2][1]='--';
              this.tableOnM.tableData[OnKey2][2]='--';
              this.tableOnM.tableData[OnKey2][4]='--';
              this.tableOnM.tableData[OnKey2][5]='--';
          }
          // if(this.tableOnM.tableData[OnKey2][0]==(UserOnData[OnKey3].MDATE_WID.substring(4,6)+'月')&&
          //   UserOnData[OnKey3].MDATE_WID.substring(0,4)==(this.month.substring(0,4))){
          if(this.tableOnM.tableData[OnKey2][0]==(UserOnData[OnKey3].MDATE_WID.substring(4,6)+'月')&&
            UserOnData[OnKey3].MDATE_WID.substring(0,4)==(this.typeY.substring(0,4))){
              this.tableOnM.tableData[OnKey2][1]=(this.IsChoice===0)?this.handleNumOn('round',UserOnData[OnKey3].TGT_LZ_CNT):
                (this.IsChoice===1)?this.handleNumOn('percent1',UserOnData[OnKey3].TGT_ONTIME_LABEL_RAT):
                (this.IsChoice===2)?this.handleNumOn('percent1',UserOnData[OnKey3].TGT_YYX_LZ_RAT):
                  this.handleNumOn('percent1',UserOnData[OnKey3].TGT_FFCJ_LA_RAT);  

              this.tableOnM.tableData[OnKey2][2]=(this.IsChoice===0)?this.handleNumOn('round',UserOnData[OnKey3].LZ_CNT):
                (this.IsChoice===1)?this.handleNumOn('percent1',UserOnData[OnKey3].ONTIME_LABEL_RAT):
                (this.IsChoice===2)?this.handleNumOn('percent1',UserOnData[OnKey3].YYX_LZ_RAT):
                  this.handleNumOn('percent1',UserOnData[OnKey3].FFCJ_LA_RAT);

              this.tableOnM.tableData[OnKey2][4]=(this.IsChoice===0)?this.handleNumOn('percent1',UserOnData[OnKey3].YOY_DIF_LZ_CNT):
                (this.IsChoice===1)?this.handleNumOn('percent1',UserOnData[OnKey3].YOY_DIF_ONTIME_LABEL_RAT):
                (this.IsChoice===2)?this.handleNumOn('percent1',UserOnData[OnKey3].YOY_DIF_YYX_LZ_RAT):
                  this.handleNumOn('percent1',UserOnData[OnKey3].YOY_DIF_FFCJ_LA_RAT);

              this.tableOnM.tableData[OnKey2][5]=(this.IsChoice===0)?this.handleNumOn('percent1',UserOnData[OnKey3].LZ_FIN_CNT):
                (this.IsChoice===1)?this.handleNumOn('percent1',UserOnData[OnKey3].ONTIME_LABEL_FIN_RAT):
                (this.IsChoice===2)?this.handleNumOn('percent1',UserOnData[OnKey3].YYX_LZ_FIN_RAT):
                  this.handleNumOn('percent1',UserOnData[OnKey3].FFCJ_LA_FIN_RAT);
          }
        })

      })

      // console.log(Call_By);
      TGT_Y_VAL=(this.IsChoice===0)?Call_By['TGT_Var']:(Call_By['TGT_Var']/Call_By['TGT_Var_Num']); 
      TGT_M_VAL=(this.IsChoice===0)?Call_By['TGT_Var_M']:(Call_By['TGT_Var_M']/Call_By['TGT_Var_Num_M']); 
      YTD_NUM=(this.IsChoice===0)?Call_By['Rate_Var_Y']:((Call_By['DenTor_Var_Y'])?(Call_By['Mole_Var_Y']/Call_By['DenTor_Var_Y']):0);
      MTD_NUM=(this.IsChoice===0)?Call_By['Rate_Var_Y']:((Call_By['DenTor_Var_Y'])?(Call_By['Mole_Var_Y']/Call_By['DenTor_Var_Y']):0);
      YOY_YTD_NUM=(this.IsChoice===0)?Call_By['Rate_Var_Y_YOY']:((Call_By['DenTor_Var_Y_YOY'])?(Call_By['Mole_Var_Y_YOY']/Call_By['DenTor_Var_Y_YOY']):0);
      YOY_MTD_NUM=(this.IsChoice===0)?Call_By['Rate_Var_M_YOY']:((Call_By['DenTor_Var_M_YOY'])?(Call_By['Mole_Var_M_YOY']/Call_By['DenTor_Var_M_YOY']):0);
      YOY_RAT_Y=(YOY_YTD_NUM!=0)?(YTD_NUM-YOY_YTD_NUM)/YOY_YTD_NUM:0;//年累计同比
      YOY_RAT_M=(YOY_MTD_NUM!=0)?(MTD_NUM-YOY_MTD_NUM)/YOY_MTD_NUM:0;//月累计同比
      REACH_VAR_Y=(TGT_Y_VAL!=0)?YTD_NUM/TGT_Y_VAL:0;//年累计达成
      REACH_VAR_M=(TGT_M_VAL!=0)?MTD_NUM/TGT_M_VAL:0;//月累计达成

      this.tableOnM.tableData[0][1]=this.handleNumOn((this.IsChoice===0)?'round':'percent1',TGT_Y_VAL);
      this.tableOnM.tableData[1][1]=this.handleNumOn((this.IsChoice===0)?'round':'percent1',TGT_M_VAL);
      this.tableOnM.tableData[0][2]=this.handleNumOn((this.IsChoice===0)?'round':'percent1',YTD_NUM);
      this.tableOnM.tableData[1][2]=this.handleNumOn((this.IsChoice===0)?'round':'percent1',MTD_NUM);
      this.tableOnM.tableData[0][3]=this.handleNumOn((this.IsChoice===0)?'round':'percent1',YOY_YTD_NUM);
      this.tableOnM.tableData[1][3]=this.handleNumOn((this.IsChoice===0)?'round':'percent1',YOY_MTD_NUM);
      this.tableOnM.tableData[0][4]=this.handleNumOn('percent1',YOY_RAT_Y);
      this.tableOnM.tableData[1][4]=this.handleNumOn('percent1',YOY_RAT_M);
      this.tableOnM.tableData[0][5]=this.handleNumOn('percent1',REACH_VAR_Y);
      this.tableOnM.tableData[1][5]=this.handleNumOn('percent1',REACH_VAR_M);

    },


    disabledDate(current) {
      return current && current > moment()
    },

    handleNumOn(type, val, boolean = false) {
        if (val === null || val === undefined || (!val && val !== 0)||val=='NaN'||val=='--'||val===0) return '--'
        if (boolean && val === 0) return '--'
        if (type === 'percent') {
          return (val * 100).toFixed(2) + '%'
        }else if(type === 'percent1'){
          return (val * 100).toFixed(1) + '%'
        }else if (type === 'tenThousand') {
            return (val / 10000).toFixed(1).toLocaleString() + '万'
        } else if (type === 'round') {
            return ((val * 1).toFixed(0) * 1).toLocaleString()
        }
    },

  

    UnitNum(type, Num) {
      Num = Num ? Num : '--'
      type = type ? type : null
      if (type === 'Rate' && Num !== '--') {
        Num = (Num * 100).toFixed(1) + '%'
      } else if (type === 'ISNull' && Num !== '--') {
        Num = Num == 'NaN' || Num == 'Infinity' ? 0 : Num
      } else {
        Num
      }
      return Num
    },
  },
}
</script>

<style lang="scss">
.panelTooltop{
    max-width: none;
    .ant-tooltip{
        max-width: 300px;
    }
    .ant-tooltip-arrow::before {
        background: #fff;
    }
    .ant-tooltip-inner{
        background: #fff;
        font-size: 14px;
        color: #bbb;
    }
}
</style>
<style lang="scss" scoped>
.TuRateOfRetCap {
  .header {
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .OnHand{
      display: flex;
      line-height: 28px;
      // padding-right: 25px;
      .switch{
        padding-right: 20px;
      }
    }
  }
  .content {
    height: calc(100% - 38px);
    .TRORCTop {
      display: flex;
      .TRORCTopCon {
        flex: 1;
        margin-top: 10px;
        border: 1px solid #f0f0f0;
        border-left: 0px;
        padding: 10px;
        cursor: pointer;

        .TROConName {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
        }
        .TROConNum {
          font-size: 20px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 34px;
        }
        .TROConIndex {
          display: flex;
          .TROIName {
            flex: 1;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 22px;
          }
          .TROINum {
            flex: 1;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            // color: #079909;
            color: rgba(0, 0, 0, 0.64);
            line-height: 22px;
          }

          .ISReadOn {
            color: #ff5953;
          }
          .ISGreenOn {
              color: #00a854;
          }

        }
      }
      .TRORChoice {
        // border-top: 5px solid #46bca0;
        // background-color: rgba(243, 243, 243, 0.2);
        background-color: rgba(0, 0, 0, 0.03);
        
        
      }

      .TRORCTopCon:hover {
        background: rgba(0, 0, 0, 0.03);
        // border-top: 5px solid #46bca0
      }

    }

    .TRORCDown {
      width: 100%;
      height: calc(100% - 152px);
      display: flex;
      padding-top: 10px;
      .TRORCLeft {
        width: 100%;
        height: calc(100%);
        flex: 1;
        margin-right: 30px;
        max-width: 705px;
        .TRORCLeftTitle {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
        }
        .TRORCLeftSelect {
          display: flex;
          padding-top: 10px;
          .TRORCLSelect {
            // padding-right: 30px;
            /deep/.flex-start .ant-select-enabled .ant-select-selection .ant-select-selection__rendered{
              margin-right: 0px;
            }
          }
        }
        .TRORCLeftTable {
          width: 100%;
          // height: calc(100%);
          height: calc(100% - 122px)!important;
          padding-top: 16px;

          .TRORCLeftTable_Body{
            width: 100%;
            // height: calc(100% - 266px)!important;
            height: calc(100%);
            .TRORCLeftTUser{
              width: 100%;
              height: calc(100% - 1px);
              .TR_Height{
                height: calc(100% / 8);
              }

            }
          }


          .TRORCLeftTUser2 {
            font-size: 12px;
            line-height: 2;
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            text-align: center;
            td {
              border: 1px solid #e7e9f0;
              border-bottom: 0px;
            }
            tr:nth-child(2n) {
              background-color: #fcfcff;
            }
            thead tr {
              background-color: #f5f7ff;
            }
          }
          .TRORCLeftTUser {
            font-size: 12px;
            line-height: 2;
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            text-align: center;
            td {
              border: 1px solid #e7e9f0;
            }
            tr:nth-child(2n) {
              background-color: #fcfcff;
            }
            thead tr {
              background-color: #f5f7ff;
            }
          }
        }
      }
      .TRORCRight {
        width: 100%;
        height: calc(100%);
        flex: 2;
        .TRORCRightTitle {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
        }
        .TRORCRightChe {
          display: flex;
          padding-top: 0px;
          align-items: center;
          justify-content: space-between;
          .TRORCRightCheVal {
            display: flex;
            .TRORCRightCheTitle {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #000000;
              line-height: 18px;
            }
          }
          .TRORCRightLeg {
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
              background: #5b8ff9;
              margin-left: 5px;
              margin-right: 5px;
              margin-bottom: 3px;
            }
            span:nth-child(2)::before {
              background: #dfdfdf;
            }
          }
        }
        .TRORCRightChart {
          width: 100%;
          height: calc(100% - 243px);
          .RightChartsCss {
            width: 100%;
            // height: calc(100% - 38px);
            height: 140px;
          }
        }
        .TRORCRightTable{
          // height: calc(100% - 260px);
          .tableCss{
              display: flex;
              position: relative;
              /deep/ .col1 {
                min-width: 65px;
                max-width: 65px;            
            }
          }
        }
      }
    }
  }
  .ISChoiceONCss {
    color: #00a854;
  }

  .ISRead {
    color: #ff5953;
  }
  .ISGreen {
      color: #00a854;
  }

  .light-tooltip {
    padding-top: 0;

    /deep/ .ant-tooltip-inner {
      background: #fff;
    }

    /deep/ .ant-tooltip-arrow {
      display: none;
    }
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

  /deep/ .ant-checkbox-wrapper{
    font-size: 12px;
  }

}
</style>





