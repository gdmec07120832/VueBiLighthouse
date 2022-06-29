<template>
  <div class="GuestList">
    <div class="header">
      <Title class="title" :label="'客单价'"/>
      <span>&nbsp;&nbsp;【融合店客单价与业务共创中，敬请期待】</span>
      <div style="flex: 1"></div>
      <div class="ChoiceRight">
        <span class="SelAll" style="display: flex">
          <!-- <span class="titleName" style="line-height: 30px;">店铺筛选：</span> -->
          <a-radio-group v-model="AreaData.area" style="line-height: 30px;">
            <a-radio :value="item" v-for="item in AreaData.areaOption" :key="item">
              {{ item }}
            </a-radio>
          </a-radio-group>
        </span>

        <Select v-if="AreaData.area==='月度'" :label="'统计年份'" :value.sync="ActivityDat.area" :options="ActivityDat.areaOption" 
          style="margin-top: -1px;" />
        <span v-if="AreaData.area==='当月'" class="MonthTitle">统计月份</span>
        <a-month-picker v-if="AreaData.area==='当月'" 
          v-model="month" format="YYYY-MM" :disabledDate='disabledDate' valueFormat="YYYYMM" :allowClear="false" />        
      </div>

    </div>
    <div class="main">
      <div class="IsMonthO" v-if="AreaData.area==='当月'">
        <div class="IMOLeft">
          <div class="IMOLTitle">渠道情况</div>
          <div class="IMOLInedx">
            <div v-for="(item,index) in OnIndex" :key="index" @click="IsChoiceFun(index)" class="IMOLInedxDat" :class="(IsChoiceOn===index)?'TsTopInACent':''">
              <Indextcq v-bind="item" />
            </div>
          </div>
          <div class="IMOLChart">

<!--            <div class="UALChartTitle">-->
<!--              <div class="UATName"></div>-->
<!--              <div class="UATlegend">-->
<!--                <span>{{UATlegendN.Amt}}</span>-->
<!--                <span>{{UATlegendN.Ago}}</span>-->
<!--              </div>-->
<!--            </div>-->
            <v-chart ref="IMOLCharOn" class="IMOLCharCss" style="overflow: visible" :options="EchartDataM" autoresize></v-chart>  
          </div>
        </div>

        <div class="IMORight">

          <div class="IMORTopSel">
            <div class="IMORTitle">渠道明细</div>
            <a-radio-group v-model="toolsType" style="padding-top: 13px;" buttonStyle="solid" size="small">
              <a-radio-button value="线上店铺">
                  线上店铺
              </a-radio-button>
                <a-radio-button value="线下区域">
                  线下区域
              </a-radio-button>
            </a-radio-group>            
          </div>

          <div class="TableData">
            <Tabletcq v-bind="UTableData" />
          </div>

        </div>
      </div>
      
      <div class="IsMonthly" v-if="AreaData.area==='月度'">
        <div class="IMYChar">
          <div class="IMYChTitle">
            <div class="IMYChTitleWhen">客单价趋势</div>
            <div class="IMYChSelectCss">
              <div class="IMYSelAll" style="display: flex">
                <span class="titleName">渠道选择</span>
                <a-radio-group v-model="MonthlyData.area" style="line-height: 30px;">
                  <a-radio :value="item" v-for="item in MonthlyData.areaOption" :key="item">
                    {{ item }}
                  </a-radio>
                </a-radio-group>
              </div>   
              <div class="UATName">
                <!-- <Select v-if="MonthlyData.area==='线上'" style="padding-right: 0px;" :label="'店铺选择'" :value.sync="SelectShop.area" :options="SelectShop.areaOption" /> -->
                <virtual-select v-if="MonthlyData.area==='线上'"
                  style="margin-right: 0px"
                  v-model="selects[0].value"
                  :label="selects[0].label"
                  :options="selects[0].options.map((_) => ({ label: _ }))"
                  :allowShowClear="false"
                  ></virtual-select>
                <!-- <Select v-if="MonthlyData.area==='线下成品店'" style="padding-right: 0px;" :label="'区域选择'" :value.sync="Region.area" :options="Region.areaOption" /> -->
                <virtual-select v-if="MonthlyData.area==='线下成品店'"
                  style="margin-right: 0px"
                  v-model="selects[1].value"
                  :label="selects[1].label"
                  :options="selects[1].options.map((_) => ({ label: _ }))"
                  :allowShowClear="false"
                  ></virtual-select>

              </div>                         
            </div>

          </div>

          <div class="IMYCharts">

<!--            <div class="UALChartTitle">-->
<!--              <div></div>-->
<!--              <div class="UATlegend">-->
<!--                <span>{{UATlegendN.Amt}}</span>-->
<!--                <span>{{UATlegendN.Ago}}</span>-->
<!--              </div>-->
<!--            </div>-->
            <v-chart ref="IMYChartOn" class="IMYChartCss" style="overflow: visible" :options="EchartDataYE" autoresize></v-chart>  
          </div>
        </div>

        <div class="IMYTable">
          <Tabletcq v-bind="IMYTableData" />
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
import Indextcq from '../../components/Indextcq'
import Tabletcq from '../../components/tabletcq'
import Select from '../../components/Select'
import { HandleNum } from '../../utils/tcq'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'
import echartStyle from "../../utils/echartStyle";
export default {
  name: 'GuestList',
  components: {
    Title,
    Indextcq,
    Tabletcq,
    Select,
    VirtualSelect
  },
  data(){
    return{

      selects: [
        {
          label: '店铺选择',
          value: [],
          options: [],
        },
        {
          label: '区域选择',
          value: [],
          options: [],
        },
      ],
      SelectShop:{
        area: '林氏木业家具旗舰店',
        areaOption: ['林氏木业家具旗舰店','林氏旗舰店'], 
      },
      Region:{
        area: '林氏木业家具旗舰店',
        areaOption: ['林氏木业家具旗舰店','林氏旗舰店'], 
      },
      UATlegendN:{
        Amt:'本期',
        Ago:'同期'
      },
      UATlegendNY:{
        Amt:'本期',
        Ago:'同期'
      },
      month: moment(_time_now).format('YYYYMM'),
      ActivityDat:{
        area:moment(_time_now).format('YYYY年'),
        areaOption:['2021年','2020年','2019年']
      },
      toolsType:'线上店铺',
      AreaData:{
        area: '当月',
        areaOption: ['当月', '月度'],        
      },
      MonthlyData:{
        area: '全渠道',
        areaOption: ['全渠道','线上', '线下成品店','线下融合店'],        
      },

      IsChoiceOn:0,
      IsChangeNam:{
        IsVal:'整体',
        IsArray:[],
      },

      OnIndex:{
        OnType:'GuestList',
        IndeWidth:100,
        IndexData:[],
      },
      UTableData:{
        index:'GuestListA',
        IsMerge:false,
        IsRankOn:false,
        labelD:[],
        tableD:[],
        IsPage:false,
        Pagination_SenOn: {
          show: true,
          page: 1,
          pageSize: 14,
          total: 100,
          pageSizeOptions:['14','20','30','50','100'],
        },
      },

      IMYTableData:{
        index:'GuestListB',
        IsMerge:false,
        labelD:[],
        tableD:[],
      },
      
      EchartDataM: {
        grid: {
          left: '0%',
          right: '0%',
          bottom: 20,
          top: 30,
          containLabel: true,
        },

        legend: {
          show: true,
          icon: 'rect',
          // itemWidth: 16,
          // itemHeight: 2,
          ...echartStyle.legendLine,
          selectedMode: true,
          top: 10,
          right: 10
        },

        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
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
                // color: '#f7f7f7',
                color: echartStyle.splitLine
              },
            },
            axisLabel: {
              // formatter: 'value',
                color: echartStyle.axisLabel
            },
            splitNumber: '3',
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
                // color: '#5b8ff9',
                color: echartStyle.thisYear
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
            data: [150 / 2, 230 / 2, 224 / 2, 218 / 2, 135 / 2, 147 / 2, 260 / 2],
            label: {
              show: false,
              position: 'top',
            },
            z: 1,
            smooth: true,
            itemStyle: {
              normal: {
                // color: '#e7e7e7',
                color: echartStyle.previousYear
              },
            },
            lineStyle: {
              // color: '#e7e7e7',
              color: echartStyle.previousYear
            },
            symbol: 'none',
            areaStyle: echartStyle.areaStyle[1]
          },
        ],
      },


      EchartDataYE: {
        legend: {
          show: true,
          icon: 'rect',
          ...echartStyle.legendLine,
          selectedMode: true,
          top: 0,
          right: 10
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: 20,
          top: 20,
          containLabel: true,
        },

        tooltip: {
          backgroundColor: '#fff',
          trigger: 'axis',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
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
              // formatter: 'value',
              color: echartStyle.axisLabel
            },
            splitNumber: '3',
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
            data: [150 / 2, 230 / 2, 224 / 2, 218 / 2, 135 / 2, 147 / 2, 260 / 2],
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

    'month': {
      handler() {
        this.GetViewData();
        this.GetTrendData();
        this.GetTableDataM();
      }
    },
    'IsChangeNam.IsVal':{
      handler() {
        this.GetTrendData();
      }
    },

    'selects.0.value': {
      handler(val, oval){
          let diff = []
          if(val.length > oval.length) {
              diff = val.filter(_ => !oval.includes(_))
          }
          else if(oval.length > val.length) {
              diff = oval.filter(_ => !val.includes(_))
          }
          if(diff.includes('全部') && val.length > oval.length){
              if(oval.length > 0){
                  this.selects[0].value = ['全部']
              }
          }
          else if(!diff.includes('全部') && val.length > oval.length){
              this.selects[0].value = this.selects[0].value.filter(_ => _ !== '全部')
          }
          if(val.length === 0){
              this.selects[0].value = ['全部']
          }
          this.GetTrendData_Y();
      }
    },
    'selects.1.value': {
      handler(val, oval){
          let diff = []
          if(val.length > oval.length) {
              diff = val.filter(_ => !oval.includes(_))
          }
          else if(oval.length > val.length) {
              diff = oval.filter(_ => !val.includes(_))
          }
          if(diff.includes('全部') && val.length > oval.length){
              if(oval.length > 0){
                  this.selects[1].value = ['全部']
              }
          }
          else if(!diff.includes('全部') && val.length > oval.length){
              this.selects[1].value = this.selects[1].value.filter(_ => _ !== '全部')
          }
          if(val.length === 0){
              this.selects[1].value = ['全部']
          }
          this.GetTrendData_Y();
      }
    },

    'toolsType': {
      handler() {
        if(this.toolsType === '线上店铺'){
          this.UTableData.labelD=['店铺','客单价','同期','同比',];
          this.UTableData.IsMerge=false,
          this.UTableData.tableD=[
            ['林氏木业家具旗舰店',200,300,400,],
            ['JD-林氏木业家具旗舰店',200,300,400,],
            ['林氏旗舰店',200,300,400,],
            ['林氏木业唯品会旗舰店',200,300,400,],
            ['林氏木业苏宁旗舰店',200,300,400,],
            ['林氏木业京东自营旗舰店',200,300,400,],
            ['linsyhome林氏生活旗舰店',200,300,400,],
            ['林氏木业云集旗舰店',200,300,400,],
            ['林氏木业考拉旗舰店',200,300,400,],
            ['林氏木业考拉旗舰店',200,300,400,],
          ]          
        }else if(this.toolsType === '线下区域'){
          this.UTableData.labelD=['店态','区域','客单价','同期','同比'];
          this.UTableData.IsMerge=true,
          // this.UTableData.tableD=[
          //   ['成品店','东区',200,300,400,],
          //   ['成品店','南区',200,300,400,],
          //   ['成品店','西区',200,300,400,],
          //   ['成品店','北区',200,300,400,],
          //   ['融合店','东区',200,300,400,],
          //   ['融合店','南区',200,300,400,],
          //   ['融合店','西区',200,300,400,],
          //   ['融合店','北区',200,300,400,],
          // ] 

          this.UTableData.tableD=[
            [
              {value:'成品店',row:4,col:null},
              {value:'东区',row:null,col:null},
              {value:200,row:null,col:null},
              {value:300,row:null,col:null},
              {value:400,row:null,col:null},
            ],
            [
              {value:'-1',row:null,col:null},
              {value:'南区',row:null,col:null},
              {value:200,row:null,col:null},
              {value:300,row:null,col:null},
              {value:400,row:null,col:null},
            ],   
            [
              {value:'-1',row:null,col:null},
              {value:'西区',row:null,col:null},
              {value:200,row:null,col:null},
              {value:300,row:null,col:null},
              {value:400,row:null,col:null},
            ],
            [
              {value:'-1',row:null,col:null},
              {value:'北区',row:null,col:null},
              {value:200,row:null,col:null},
              {value:300,row:null,col:null},
              {value:400,row:null,col:null},
            ],  

            [
              {value:'融合店',row:4,col:null},
              {value:'东区',row:null,col:null},
              {value:200,row:null,col:null},
              {value:300,row:null,col:null},
              {value:400,row:null,col:null},
            ], 
            [
              {value:'-1',row:null,col:null},
              {value:'南区',row:null,col:null},
              {value:200,row:null,col:null},
              {value:300,row:null,col:null},
              {value:400,row:null,col:null},
            ], 
            [
              {value:'-1',row:null,col:null},
              {value:'西区',row:null,col:null},
              {value:200,row:null,col:null},
              {value:300,row:null,col:null},
              {value:400,row:null,col:null},
            ], 
            [
              {value:'-1',row:null,col:null},
              {value:'北区',row:null,col:null},
              {value:200,row:null,col:null},
              {value:300,row:null,col:null},
              {value:400,row:null,col:null},
            ], 
          ]

        }

        this.GetTableDataM();

      }
    },

    'ActivityDat.area':{
      handler() {
        this.GetTrendData_Y();
      }
    },

    'MonthlyData.area':{
      handler() {
        this.GetTrendData_Y();
      }
    },

    // 'SelectShop.area':{
    //   handler() {
    //     this.GetTrendData_Y();
    //   }
    // },
    // 'Region.area':{
    //   handler() {
    //     this.GetTrendData_Y();
    //   }
    // }

  },
  async created() {

    this.OnIndex=[
      {OnType:'GuestList',IndeWidth:100,sign:0, IndexData:[
        {title:'全渠道',Tnum:0,
        ContInfo:[{name:'同期',value:0},{name:'同比',value:0},]},
      ]},

      {OnType:'GuestList',IndeWidth:100,sign:1,IndexData:[
        {title:'线上',Tnum:0,
        ContInfo:[{name:'同期',value:0},{name:'同比',value:0},]},
      ]},

      {OnType:'GuestList',IndeWidth:100,sign:2,IndexData:[
        {title:'线下成品店',Tnum:0,
        ContInfo:[{name:'同期',value:0},{name:'同比',value:0},]},
      ]},

      // {OnType:'GuestList',IndeWidth:100,sign:3,IndexData:[
      //   {title:'线下(融合店)',Tnum:0,
      //   ContInfo:[{name:'同期：',value:0},{name:'同比：',value:0},]},
      // ]},

    ]

    this.UTableData.labelD=['店铺','客单价','同期','同比',];
    this.UTableData.IsMerge=false,
    this.UTableData.IsPage=true,
    this.UTableData.tableD=[
      ['林氏木业家具旗舰店',200,300,400,],
      ['JD-林氏木业家具旗舰店',200,300,400,],
      ['林氏旗舰店',200,300,400,],
      ['林氏木业唯品会旗舰店',200,300,400,],
      ['林氏木业苏宁旗舰店',200,300,400,],
      ['林氏木业京东自营旗舰店',200,300,400,],
      ['linsyhome林氏生活旗舰店',200,300,400,],
      ['林氏木业云集旗舰店',200,300,400,],
      ['林氏木业考拉旗舰店',200,300,400,],
      ['林氏木业考拉旗舰店',200,300,400,],
    ]

    this.IMYTableData.labelD=['指标','当期累计','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    this.IMYTableData.tableD=[
      ['2021年',200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400],
      ['2020年',200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400],
      ['同期增额',200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400],
      ['同期增幅',200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400],
    ]

    let res = await this.$fetchSql('all_center', 'all_center_cust_unit_price_overview',);
    res.data.sort((a, b) => a.RANK_ON - b.RANK_ON);
    this.IsChangeNam.IsArray = Object.freeze(Array.from(new Set(res.data.map((_) => _.CHANNEL))));
    this.IsChangeNam.IsVal = (!this.IsChangeNam.IsArray.length)? '--':this.IsChangeNam.IsArray[0];
    this.MonthlyData.areaOption = Object.freeze(Array.from(new Set(res.data.map((_) => _.CHANNEL))));
    this.MonthlyData.area = (!this.MonthlyData.areaOption.length)? '--':this.MonthlyData.areaOption[0];

    let res2 = await this.$fetchSql('all_center', 'all_center_cust_year',);
    res2.data.sort((a, b) => b.YDATE_WID - a.YDATE_WID);
    this.ActivityDat.areaOption = Object.freeze(Array.from(new Set(res2.data.map((_) => _.YDATE_WID+'年'))));


    let ShopData=res2.data.filter((_) => _.CLASS.indexOf('区')<0&&_.CLASS!=='全部');
    // this.SelectShop.areaOption = (Array.from(new Set(ShopData.map((_)=> _.CLASS))));
    // this.SelectShop.areaOption.unshift('全部');
    // this.SelectShop.area = this.SelectShop.areaOption[0];
    ShopData.sort((a,b)=>b.ACT_PRICE - a.ACT_PRICE);
    this.selects[0].options = (Array.from(new Set(ShopData.map((_)=> _.CLASS))));
    this.selects[0].value = ['全部'];
    this.selects[0].options.unshift('全部');


    let RegionData=res2.data.filter((_) => _.CLASS.indexOf('区')>0);
    Object.keys(RegionData).forEach((OnKey) => {
      if(RegionData[OnKey].CLASS==='东区'){
        RegionData[OnKey].RANK=1;
      }else if(RegionData[OnKey].CLASS==='南区'){
        RegionData[OnKey].RANK=2;
      }else if(RegionData[OnKey].CLASS==='西区'){
        RegionData[OnKey].RANK=3;
      }else if(RegionData[OnKey].CLASS==='北区'){
        RegionData[OnKey].RANK=4;
      }
    });
    RegionData.sort((a, b) => a.RANK - b.RANK);
    // this.Region.areaOption = (Array.from(new Set(RegionData.map((_)=> _.CLASS))));
    // this.Region.areaOption.unshift('全部');
    // this.Region.area = this.Region.areaOption[0];
    this.selects[1].options = (Array.from(new Set(RegionData.map((_)=> _.CLASS))));
    this.selects[1].value = ['全部'];
    this.selects[1].options.unshift('全部');


    this.GetViewData();
    this.GetTrendData();


  },
  mounted(){
    // 每次都需要清除画布
    this.$refs.IMOLCharOn.$refs.echarts.clear();
    this.GetTableDataM();
    this.GetTrendData_Y();
  },
  methods: {

    IsChoiceFun(Num){
      this.IsChoiceOn=Num;
      this.IsChangeNam.IsVal = this.IsChangeNam.IsArray[Num];
    },

    async GetViewData(){
      let query = {
        YYYYMM: this.month,
      }
      let res = await this.$fetchSql('all_center', 'all_center_cust_unit_price_overview',query);
      res.data.sort((a, b) => a.RANK_ON - b.RANK_ON);

      this.OnIndex=[];
      if(res.data.length>0){
        Object.keys(res.data).forEach((OnKey) => {
          this.OnIndex.push([
            {OnType:'GuestList',IndeWidth:100,sign:OnKey*1, IndexData:[
              {title:res.data[OnKey].CHANNEL,Tnum:res.data[OnKey].CUST_UNIT_PRICE,
              ContInfo:[{name:'同期',value:res.data[OnKey].YOY_CUST_UNIT_PRICE},
                {name:'同比',value:res.data[OnKey].YOY_DIFF_CUST_UNIT_PRICE},]},
            ]},
          ])
        });
      }else{
        this.OnIndex=[
          {OnType:'GuestList',IndeWidth:100,sign:0, IndexData:[
            {title:'全渠道',Tnum:0,
            ContInfo:[{name:'同期',value:0},{name:'同比',value:0},]},
          ]},
          {OnType:'GuestList',IndeWidth:100,sign:1,IndexData:[
            {title:'线上',Tnum:0,
            ContInfo:[{name:'同期',value:0},{name:'同比',value:0},]},
          ]},
          {OnType:'GuestList',IndeWidth:100,sign:2,IndexData:[
            {title:'线下(成品店)',Tnum:0,
            ContInfo:[{name:'同期',value:0},{name:'同比',value:0},]},
          ]},
        ]
      }

    },

    async GetTrendData(){
      let query = {
        // YYYY: moment(this.month).format('YYYY'),
        MDATE:moment(this.month).format('YYYY'),
        MDATE2:moment(this.month).format('YYYY')*1-1,
        CHANNEL: this.IsChangeNam.IsVal,
      }
      let res = await this.$fetchSql('all_center', 'all_center_cust_unit_month_trend',query);
      res.data.sort((a,b)=>{
        return moment(a['MDATE']) - moment(b['MDATE'])
      });
      let MontDat=[];
      let Amt=[];
      let Ago=[];
      this.UATlegendN.Amt=moment(this.month).format('YYYY')+'年';
      this.UATlegendN.Ago=(moment(this.month).format('YYYY')*1-1)+'年';

      if(res.data.length>0){
        Object.keys(res.data).forEach((OnKey) => {
          if(moment(res.data[OnKey].MDATE).format('YYYY')*1===(moment(this.month).format('YYYY')*1-1)){
            MontDat.push(moment(res.data[OnKey].MDATE).format('MM月'));
            Ago.push(res.data[OnKey].CUST_UNIT_PRICE);
          }
          if(moment(res.data[OnKey].MDATE).format('YYYY')*1===(moment(this.month).format('YYYY')*1)){
            Amt.push((res.data[OnKey].CUST_UNIT_PRICE==0)?null:res.data[OnKey].CUST_UNIT_PRICE); 
          }
        });
      }
      // 每次都需要清除画布
      this.$refs.IMOLCharOn.$refs.echarts.clear();

      this.EchartDataM.xAxis[0].data=MontDat;
      this.EchartDataM.series[0].name= this.UATlegendN.Amt;
      this.EchartDataM.series[0].data=Amt;
      this.EchartDataM.series[1].name= this.UATlegendN.Ago;
      this.EchartDataM.series[1].data=Ago;
      this.EchartDataM.tooltip.formatter=((params)=>{
        let SetValue=[];
        if(params.length>1){
          SetValue='日期：'+params[0].axisValue+'<br/>'+
            params[0].marker+this.UATlegendN.Amt+'：'+HandleNum('round',params[0].value)+'<br/>'+
            params[1].marker+this.UATlegendN.Ago+'：'+HandleNum('round',params[1].value)+''
        }else{
          SetValue='日期：'+params[0].axisValue+'<br/>'+
            params[0].marker+this.UATlegendN.Ago+'：'+HandleNum('round',params[0].value)+'<br/>'
        }
        return SetValue
      });
    },

    async GetTableDataM(){
      // UTableData  
      let query = {
        YYYYMM: this.month,
        CHANNEL: (this.toolsType === '线上店铺') ? '线上':
          (this.toolsType === '线下区域') ? '线下成品店' :null,
      }
      let res = await this.$fetchSql('all_center', 'all_center_cust_unit_month_chdet',query);
      res.data.sort((a,b)=>{return (b['ACT_PRICE']) - (a['ACT_PRICE'])});
      if(res.data.length>0){
        this.UTableData.tableD=[]; 
        if(this.toolsType === '线上店铺'){

          this.UTableData.labelD=['店铺','客单价RANK','同期RANK','同比RANK',];
          this.UTableData.IsMerge=false;
          this.UTableData.IsRankOn=true;
          this.UTableData.IsPage=true;
          this.UTableData.index='GuestListA';
          Object.keys(res.data).forEach((OnKey) => {
            this.UTableData.tableD.push([
              res.data[OnKey].CLASS,
              res.data[OnKey].CUST_UNIT_PRICE,
              res.data[OnKey].YOY_CUST_UNIT_PRICE,
              res.data[OnKey].YOY_DIFF_CUST_UNIT_PRICE,
            ]);
          });

          // console.log("===============11111111===qqq======");
          // console.log(this.UTableData.tableD.length)

          this.UTableData.Pagination_SenOn.page=1;
          // this.UTableData.Pagination_SenOn.pageSize=9;
          this.UTableData.Pagination_SenOn.total=this.UTableData.tableD.length;

        }else if(this.toolsType === '线下区域'){
          this.UTableData.labelD=['店态','区域','客单价','同期','同比'];
          this.UTableData.IsMerge=true;
          this.UTableData.IsRankOn=false;
          this.UTableData.IsPage=false;
          this.UTableData.index='GuestList_2A';
          let ISLast='';
          // res.data.unshift({ACT_PRICE:0
          //   ,CHANNEL: "线下融合店"
          //   ,CLASS: "东区"
          //   ,CUST_CNT: 0
          //   ,CUST_UNIT_PRICE: 0
          //   ,YOY_ACT_PRICE: 0
          //   ,YOY_CUST_CNT: 0
          //   ,YOY_CUST_UNIT_PRICE: 0
          //   ,YOY_DIFF_CUST_UNIT_PRICE: 0}); 
          // res.data.unshift({ACT_PRICE:0
          //   ,CHANNEL: "线下融合店"
          //   ,CLASS: "南区"
          //   ,CUST_CNT: 0
          //   ,CUST_UNIT_PRICE: 0
          //   ,YOY_ACT_PRICE: 0
          //   ,YOY_CUST_CNT: 0
          //   ,YOY_CUST_UNIT_PRICE: 0
          //   ,YOY_DIFF_CUST_UNIT_PRICE: 0}); 
          //   res.data.unshift({ACT_PRICE:0
          //   ,CHANNEL: "线下融合店"
          //   ,CLASS: "西区"
          //   ,CUST_CNT: 0
          //   ,CUST_UNIT_PRICE: 0
          //   ,YOY_ACT_PRICE: 0
          //   ,YOY_CUST_CNT: 0
          //   ,YOY_CUST_UNIT_PRICE: 0
          //   ,YOY_DIFF_CUST_UNIT_PRICE: 0}); 
          // res.data.unshift({ACT_PRICE:0
          //   ,CHANNEL: "线下融合店"
          //   ,CLASS: "北区"
          //   ,CUST_CNT: 0
          //   ,CUST_UNIT_PRICE: 0
          //   ,YOY_ACT_PRICE: 0
          //   ,YOY_CUST_CNT: 0
          //   ,YOY_CUST_UNIT_PRICE: 0
          //   ,YOY_DIFF_CUST_UNIT_PRICE: 0}); 
          Object.keys(res.data).forEach((OnKeyRank) => {
            if(res.data[OnKeyRank].CLASS==='合计'){
              res.data[OnKeyRank].RANK_ON=1;
            }else if(res.data[OnKeyRank].CLASS==='东区'){
              res.data[OnKeyRank].RANK_ON=2;
            }else if(res.data[OnKeyRank].CLASS==='南区'){
              res.data[OnKeyRank].RANK_ON=3;
            }else if(res.data[OnKeyRank].CLASS==='西区'){
              res.data[OnKeyRank].RANK_ON=4;
            }else if(res.data[OnKeyRank].CLASS==='北区'){
              res.data[OnKeyRank].RANK_ON=5;
            }else{
              res.data[OnKeyRank].RANK_ON=6;
            }
          });
          res.data.sort((a,b)=>{return (a['RANK_ON']) - (b['RANK_ON'])});
          // 处理合并单元格的
          let SelectOnT = Object.freeze(Array.from(new Set(res.data.map((_) => _.CHANNEL))));
          this.UserWName=[];
          Object.keys(SelectOnT).forEach((Type) => {
            this.UserWName.push({
              value:res.data.filter((_)=>_["CHANNEL"]==SelectOnT[Type]).length,
              name:SelectOnT[Type]
            })
          });
          // 处理合并单元格的
          Object.keys(res.data).forEach((OnKey) => {
            this.UTableData.tableD.push([
              {value:(res.data[OnKey].CHANNEL!==ISLast)?
                res.data[OnKey].CHANNEL:'-1',
                row:this.UserWName.find((_)=>_.name===res.data[OnKey].CHANNEL).value,
                col:null},
              {value:res.data[OnKey].CLASS,row:null,col:null},
              {value:res.data[OnKey].CUST_UNIT_PRICE,row:null,col:null},
              {value:res.data[OnKey].YOY_CUST_UNIT_PRICE,row:null,col:null},
              {value:res.data[OnKey].YOY_DIFF_CUST_UNIT_PRICE,row:null,col:null},
            ]);
            ISLast=res.data[OnKey].CHANNEL
          });


        }
      }

    },

    async GetTrendData_Y(){

      let OnValue=null;
      if(this.MonthlyData.area==='整体'){
        OnValue=null; 
      }else if(this.MonthlyData.area==='线上'){
        // OnValue=this.SelectShop.area;
        OnValue=this.selects[0].value.join(',');
      }else if(this.MonthlyData.area==='线下成品店'){
        // OnValue=this.Region.area; 
        OnValue=this.selects[1].value.join(',');
      }
      let query = {
        YYYY: this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,''),
        CHANNEL: this.MonthlyData.area,
        CLASS: (OnValue==='全部')?null:OnValue
      }
      let res = await this.$fetchSql('all_center', 'all_center_cust_year_trend',query);
      res.data.sort((a,b)=>{
        return moment(a['MDATE_WID']) - moment(b['MDATE_WID'])
      });

      // console.log("=========111111111111111111=========");
      // console.log(res.data);
      this.UATlegendNY.Amt=this.ActivityDat.area;
      this.UATlegendNY.Ago=(this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,'')*1-1)+'年';
      if(res.data.length>0){   
        this.EchartDataYE.xAxis[0].data=[];
        this.EchartDataYE.series[0].data=[];
        this.EchartDataYE.series[1].data=[];
        let Array_y=res.data.filter(_=>_.DATA_TYPE!=='年累');
        Object.keys(Array_y).forEach((OnKey) => {
          this.EchartDataYE.xAxis[0].data.push(moment(Array_y[OnKey].MDATE_WID).format('MM月'));
          this.EchartDataYE.series[0].data.push((Array_y[OnKey].CUST_UNIT_PRICE==0)?null:Array_y[OnKey].CUST_UNIT_PRICE); 
          this.EchartDataYE.series[1].data.push(Array_y[OnKey].YOY_CUST_UNIT_PRICE); 
        });
        this.EchartDataYE.series[0].name= this.UATlegendNY.Amt;
        this.EchartDataYE.series[1].name= this.UATlegendNY.Ago;
        this.EchartDataYE.tooltip.formatter=((params)=>{
          let str = `${params[0].axisValue}<br/>`
          params.forEach(item => {
            str += `${item.marker + item.seriesName}：${HandleNum('round', item.value)}<br/>`
          })
          return str
          // let SetValue='日期：'+params[0].axisValue+'<br/>'+
          //   params[0].marker+this.UATlegendNY.Amt+'：'+HandleNum('round',params[0].value)+'<br/>'+
          //   params[1].marker+this.UATlegendNY.Ago+'：'+HandleNum('round',params[1].value)+''
          // return SetValue
        });

        // 表格开始
        let Array_YTab=res.data.filter(_=>_.DATA_TYPE!=='年累');
        let sum = res.data.find(_=>{return _['DATA_TYPE'] === '年累'});
        Array_YTab.unshift(sum); 
        
        this.IMYTableData.labelD=['指标'];
        this.IMYTableData.tableD=[
          [this.ActivityDat.area],
          [(this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,'')*1-1)+'年'],
          ['同期增额'],
          ['同期增幅'],
        ]
        Object.keys(Array_YTab).forEach((OnKeyT) => {
          if(Array_YTab[OnKeyT].DATA_TYPE === '年累'){
            this.IMYTableData.labelD.push(Array_YTab[OnKeyT].DATA_TYPE);
            this.IMYTableData.tableD[0].push(Array_YTab[OnKeyT].CUST_UNIT_PRICE);
            this.IMYTableData.tableD[1].push(Array_YTab[OnKeyT].YOY_CUST_UNIT_PRICE);
            this.IMYTableData.tableD[2].push(Array_YTab[OnKeyT].CUST_UNIT_PRICE_MINUS);
            this.IMYTableData.tableD[3].push(Array_YTab[OnKeyT].YOY_DIFF_CUST_UNIT_PRICE);
          }else{
            this.IMYTableData.labelD.push(moment(Array_YTab[OnKeyT].MDATE_WID).format('MM月'));
            this.IMYTableData.tableD[0].push(Array_YTab[OnKeyT].CUST_UNIT_PRICE);
            this.IMYTableData.tableD[1].push(Array_YTab[OnKeyT].YOY_CUST_UNIT_PRICE);
            this.IMYTableData.tableD[2].push(Array_YTab[OnKeyT].CUST_UNIT_PRICE_MINUS);
            this.IMYTableData.tableD[3].push(Array_YTab[OnKeyT].YOY_DIFF_CUST_UNIT_PRICE);
          }

        });

        // 每次都需要清除画布
        if(this.AreaData.area==='月度'){
          this.$refs.IMYChartOn.$refs.echarts.clear();
        }

      }else{
        this.IMYTableData.labelD=['指标','当期累计','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
        this.IMYTableData.tableD=[
          ['2021年',0,0,0,0,0,0,0,0,0,0,0,0,0],
          ['2020年',0,0,0,0,0,0,0,0,0,0,0,0,0],
          ['同期增额',0,0,0,0,0,0,0,0,0,0,0,0,0],
          ['同期增幅',0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]
      }




    },


  

    disabledDate(current) {
      return current && current > moment()
    },
  }

}
</script>

<style lang="scss" scoped>
.GuestList{
  .header{
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    position: relative;
    span:nth-child(2) {
      margin-top: 0;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(0, 0, 0, 0.25);
      line-height: 20px;
    }
    .ChoiceRight{
      display: flex;
      span.SelAll{
        padding-right: 15px;
        .titleName{
          padding-right: 15px;
        }

      }
      .MonthTitle{
        font-size: 12px;
        line-height: 28px;
        padding-right: 10px;
        color: rgba(0, 0, 0, 0.65);
      }
      /deep/ .ant-select-selection--single{
        width: 155px;
      }
    }
  }
  .main{
    height: calc(100% - 38px);
    .IsMonthO{
      height: 100%;
      display: flex;
      .IMOLeft{
        height: 100%;
        flex: 65;
        padding-right: 20px;
        .IMOLTitle{
          padding-top: 15px;
          // padding-left: 15px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #000000;
          line-height: 30px;
        }
        .IMOLInedx{
          display: flex;
          max-height: 120px;
          cursor: pointer;
          .IMOLInedxDat{
            flex: 1;
            /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(1){
              flex:10;
            }
            /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(2){
              flex:20;
            }
            /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(3){
              flex:70;
            }
          }
          .IMOLInedxDat:hover{
            background: rgba(0, 0, 0, 0.03);
          }
          .TsTopInACent{
            background: rgba(0, 0, 0, 0.03);
          }
          /deep/ .TopIndex .TopIndList{
            padding-top: 5px;
            padding-bottom: 5px;
          }
        }
        .IMOLChart{
          height: calc(100% - 120px - 45px);
          .UALChartTitle{
            padding: 15px;
            display: flex;
            justify-content: space-between;
            .UATlegend {
              // margin-bottom: 20px;
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
          .IMOLCharCss{
            //height: calc(100% - 51px) !important;
          }

        }

      }
      .IMORight{
        flex: 35;
        height: 100%;
        .IMORTopSel{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .IMORTitle{
            padding-top: 15px;
            padding-left: 15px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #000000;
            line-height: 30px;
          }          
        }
        .TableData{
          height: calc(100% - 45px);
          padding-top: 15px;
          /deep/ .tablelist .tablelthead .TRORCLeftTUser2 td.Title{
            text-align: left;
            padding-left: 10px;
          }
          /deep/ .tablelist .tablelthead .TRORCLeftTUser2 td{
            text-align: right;
            padding-right: 10px;
          }
          /deep/ .tablelist .tableltbody .TRORCLeftTUser2 td.Title{
            text-align: left;
            padding-left: 10px;
          }
          /deep/ .tablelist .tableltbody .TRORCLeftTUser2 td{
            text-align: right;
            padding-right: 10px;
          }
          /deep/ .TRORCLeftTUser2 .IsRank td.OnR .IsRankAllCss{
            justify-content: flex-end;
            padding-right: 0px;
          }   
        }


      }
    }

    .IsMonthly{
      height: 100%;
      .IMYChar{
        height: calc(100% - 150px);
        .IMYChTitle{
          padding: 10px;
          padding-left: 0px;
          display: flex;
          justify-content: space-between;
          .IMYChTitleWhen{
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #000000;
            line-height: 30px;
          }
          .IMYChSelectCss{
            .IMYSelAll{
              .titleName{
                color: rgba(0, 0, 0, 0.65);
                line-height: 30px;
                font-size: 12px;      
                padding-right: 15px;          
              }
            }
          }
        }
        .IMYCharts{
          height: calc(100% - 78px);
          // height: calc(100% - 50px);
          .UALChartTitle{
            padding: 15px;
            padding-top: 0px;
            padding-left: 0px;
            display: flex;
            justify-content: space-between;
            .UATlegend {
              // margin-bottom: 20px;
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
          .IMYChartCss{
            //height: calc(100% - 36px) !important;
          }

        }

      }

      .IMYTable{
        /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Title{
          text-align: left;
          padding-left: 10px;
          width: 105px;
        }
        /deep/ .TRORCLeftTUser2 tbody tr td.Title{
          text-align: left;
          padding-left: 10px;
          width: 105px;
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

/deep/ .tablelist .tablelthead .TRORCLeftTUser2 td.Title{
  width: 155px;
}
/deep/ .tablelist .tableltbody .TRORCLeftTUser2 td.Title{
  width: 155px;
}
</style>