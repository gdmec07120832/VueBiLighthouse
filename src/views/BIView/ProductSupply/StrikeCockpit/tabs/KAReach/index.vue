<template>
  <div class="KAReach">
    <div class="header">
      <Title class="title" :label="'KA返利'" :jump="true" :jumpTarget="JumpStr" />
      <span>&nbsp;&nbsp;【2022年KA暂未签署，数据会随合同确定而变更】</span>
      <div style="flex: 1"></div>
      <div class="SelTime">
        <!-- <span style="padding-right: 15px;">统计年月：</span>
        <a-month-picker v-model="month" format="YYYY-MM" :disabledDate='disabledDate' valueFormat="YYYYMM" :allowClear="false" style="width: 150px" /> -->
        <Select :label="'统计年份'" :value.sync="ActivityDat.area" :options="ActivityDat.areaOption" />
      </div>

    </div>

    <div class="main">
      <div class="TopInde">
        <div class="TopInAll">
          <div v-for="(item,index) in OnIndex" :key="index" @click="IsChoiceFun(index)" class="TopInACent" :class="(IsChoiceOn===index)?'TsTopInACent':''">
            <div class="IndeChart" v-if="index===0">
              <div style="padding-top: 5px;color: rgba(0, 0, 0, 0.64);padding-left: 15px;">集团</div>
              <CircleEchart class="echarts"  :value="OnIndexRate" :comp="'Activity'" :id="1" />
            </div>
            <div class="IndeText" :class="['IndexCss'+index]">
              <Indextcq v-bind="item" />
            </div>
          </div>
        </div>
      </div>


      <div class="CentreChart">

        <div class="UALChartTitle" style="position: absolute;padding: 10px 0 0 0">
          <div class="UATName">{{'KA达成趋势('+IsChangeNam.IsVal+')'}}</div>
<!--          <div class="UATlegend">-->
<!--            <span>{{ActivityDat.area}}</span>-->
<!--            <span>{{(ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,'')*1-1)+'年'}}</span>-->
<!--          </div>-->
        </div>

        <v-chart ref="DChartDescOn" class="DChartDescCss" style="overflow: visible;height: 100%!important;" :options="echartData" autoresize></v-chart>
      </div>

      <div class="DownTable">
        <Tabletcq v-bind="tableData" />


        
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
import Indextcq from '../../components/Indextcq'
import CircleEchart from '../../components/CircleEchart'
import Tabletcq from '../../components/tabletcq'
import Select from '../../components/Select'
import { HandleNum } from '../../utils/tcq'
import moment from 'moment'
import echartStyle from "../../utils/echartStyle";
export default {
  name: 'KAReach',
  components: {
    Title,
    Indextcq,
    CircleEchart,
    Tabletcq,
    Select
  },

  data(){
    return{

      pagination: {
          show: true,
          page: 1,
          pageSize: 10,
          total: 100,
      },
      month: moment(_time_now).format('YYYYMM'),
      ActivityDat:{
        area:moment(_time_now).format('YYYY年'),
        areaOption:['2021年','2020年','2019年']
      },
      IsChoiceOn:0,

      tableData:{
        index:'KAReach',
        labelD:[],
        tableD:[],
      },
      RemarksText:[
        {value:'店铺包含林氏木业家具旗舰店、林氏旗舰店'},
      ]
      ,
      OnIndex:{
        OnType:'KAReach',
        IndeWidth:50,
        IndexData:[],
      },
      OnIndexRate:0,
      IsChangeNam:{
        IsVal:'集团',
        IsArray:[],
      },

      TrendData:{},

      echartData: {
        grid: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 40,
          containLabel: true
        },

        legend: {
          show: true,
          icon: 'rect',
          // itemWidth: 16,
          // itemHeight: 2,
          ...echartStyle.legendLine,
          selectedMode: true,
          top: 15,
          right: 0,
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
            boundaryGap: false,  //柱子是否中间，
            data: [],
            axisTick: {
              show: false,
              alignWithLabel: false,  //是否在中间显示
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
            // show:false,
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
              show:false,
            },
            axisLabel: {
              // formatter: 'value',
              show:false,
            },
            splitNumber: '3',
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
                // color: '#5b8ff9',
                color: echartStyle.thisYear
              },
            },
            label: {
              show: false,
              position: 'top',
            },
            // areaStyle: {
            //   color:{
            //     type:'linear',
            //     x:0,
            //     y:0,
            //     x2:0,
            //     y2:1,
            //     colorStops:[{
            //       // offset:0,color:'rgba(58,132,255,0.6)'
            //       offset: 0, color: 'rgba(92,143,249,0.6)'
            //     },{
            //       offset:1,color:'rgba(92,143,249,0.1)'
            //     }],
            //     global:false
            //   }
            // },
            symbol: 'none',
            areaStyle: echartStyle.areaStyle[0],
            smooth: true,
            z: 2,
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
            // areaStyle: {
            //   color:{
            //     type:'linear',
            //     x:0,
            //     y:0,
            //     x2:0,
            //     y2:1,
            //     colorStops:[{
            //       offset:0,color:'rgba(231,231,231,0.6)'
            //     },{
            //       offset:1,color:'rgba(231,231,231,0.1)'
            //     }],
            //     global:false
            //   }
            // },
            symbol: 'none',
            areaStyle: echartStyle.areaStyle[1],
            smooth: true,
            itemStyle: {
              normal: {
                color: echartStyle.previousYear,
              },
            },
            lineStyle: {
              color: echartStyle.previousYear,
            },
            // symbol: 'none',
          },
        ],
      },

      JumpStr:'',


    }
  },

  watch: {
    'ActivityDat.area': {
      handler() {
        this.GetViewData();
        this.GetTrendData();
      }
    },
    // 'month': {
    //   handler() {
    //     this.GetViewData();
    //     this.GetTrendData();
    //   }
    // },

    'IsChangeNam.IsVal':{
      handler() {
        this.GetTrendData();
      }
    }
  },

  async created() {

    this.OnIndex=[
      {OnType:'KAReach',IndeWidth:50,sign:0, IndexData:[
        {title:null,Tnum:0,
        ContInfo:[{name:'目标',value:0},{name:'差额',value:0},{name:'同比',value:0},
        {name:'同期',value:0}]},
      ]},
      {OnType:'KAReach',IndeWidth:50,sign:1,IndexData:[
        {title:'线上',Tnum:0,remarks:true,RemTex:this.RemarksText,
        ContInfo:[{name:'目标',value:0},{name:'达成',value:0},{name:'同比',value:0},
        {name:'同期',value:0}]},
      ]},
      {OnType:'KAReach',IndeWidth:50,sign:2,IndexData:[
        {title:'线下火凤凰',Tnum:0,
        ContInfo:[{name:'目标',value:0},{name:'达成',value:0},{name:'同比',value:0},
        {name:'同期',value:0}]},
      ]},
      {OnType:'KAReach',IndeWidth:50,sign:3,IndexData:[
        {title:'线下网拍',Tnum:0,
        ContInfo:[{name:'目标',value:0},{name:'达成',value:0},{name:'同比',value:0},
        {name:'同期',value:0}]},
      ]},
    ]

    this.tableData.labelD=['年份','年累计','当期累计','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    this.tableData.tableD=[
      ['目标',0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      ['实际',0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      ['达成',0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      ['同期',0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      ['同比',0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]

    let res = await this.$fetchSql('all_center', 'all_center_ka_gl',);
    res.data.sort((a, b) => a.RANK_CH - b.RANK_CH);
    this.ActivityDat.areaOption = (Array.from(new Set(res.data.map((_) => _.YDATE))));
    this.ActivityDat.areaOption.sort((a,b)=>  b.replace(/[年]/g,'') - a.replace(/[年]/g,'')); 

    // this.ActivityDat.area = (!this.ActivityDat.areaOption.length)? '--':this.ActivityDat.areaOption[0];
    this.ActivityDat.area = (!this.ActivityDat.areaOption.length)? '--':moment(_time_now).format('YYYY年');

    this.IsChangeNam.IsArray = Object.freeze(Array.from(new Set(res.data.map((_) => _.CHANNEL))));
    this.IsChangeNam.IsVal = (!this.IsChangeNam.IsArray.length)? '--':this.IsChangeNam.IsArray[0];

    
    this.GetViewData();
    this.GetTrendData();
    this.jumpTarget();

  },
  mounted(){
    // 每次都需要清除画布
    this.$refs.DChartDescOn.$refs.echarts.clear();
  },
  methods: {

    async jumpTarget() {
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2020_00001':'BI_PC_2020_00004'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },

    change(page, pageSize) {
        this.pagination.page = page
    },
    showSizeChange(current, size) {
        this.pagination.pageSize = size
    },

    IsChoiceFun(Num){
      this.IsChoiceOn=Num;
      this.IsChangeNam.IsVal = this.IsChangeNam.IsArray[Num];
    },
    async GetViewData(){
      let query = {
        // YYYYMM: this.month,
        YYYY:this.ActivityDat.area
      }
      let res = await this.$fetchSql('all_center', 'all_center_ka_gl',query);
      res.data.sort((a, b) => a.RANK_CH - b.RANK_CH);


      this.OnIndex=[];
      if(res.data.length>0){
        Object.keys(res.data).forEach((OnKey) => {
          if(res.data[OnKey].CHANNEL==="集团"){
            this.OnIndexRate=res.data[OnKey].KA_REACH_RATE;
            this.OnIndex.push(
              {OnType:'KAReach',IndeWidth:50,sign:OnKey*1, IndexData:[
                {title:null,Tnum: res.data[OnKey].KA_ACT_AMT,
                ContInfo:[{name:'目标',value: res.data[OnKey].KA_GOAL_AMT},{name:'差额',value:res.data[OnKey].KA_REACH},
                {name:'同比',value: res.data[OnKey].KA_AGO_RATE},
                {name:'同期',value: res.data[OnKey].AGO_KA_ACT_AMT}]},
              ]}
            );
          }else{
            this.OnIndex.push(
              {OnType:'KAReach',IndeWidth:50,sign:OnKey*1, IndexData:[
                {title: res.data[OnKey].CHANNEL,remarks:(res.data[OnKey].CHANNEL==='线上')?true:false,
                  RemTex:(res.data[OnKey].CHANNEL==='线上')?this.RemarksText:null,
                  Tnum: res.data[OnKey].KA_ACT_AMT,
                ContInfo:[{name:'目标',value: res.data[OnKey].KA_GOAL_AMT},{name:'达成',value:res.data[OnKey].KA_REACH_RATE},
                {name:'同比',value: res.data[OnKey].KA_AGO_RATE},
                {name:'同期',value: res.data[OnKey].AGO_KA_ACT_AMT}]},
              ]}
            );
          }
        })
      }else{
        this.OnIndex=[
          {OnType:'KAReach',IndeWidth:50,sign:0, IndexData:[
            {title:null,Tnum:0,
            ContInfo:[{name:'目标',value:0},{name:'差额',value:0},{name:'同比',value:0},
            {name:'同期',value:0}]},
          ]},
          {OnType:'KAReach',IndeWidth:50,sign:1,IndexData:[
            {title:'线上',Tnum:0,
            ContInfo:[{name:'目标',value:0},{name:'达成',value:0},{name:'同比',value:0},
            {name:'同期',value:0}]},
          ]},
          {OnType:'KAReach',IndeWidth:50,sign:2,IndexData:[
            {title:'线下火凤凰',Tnum:0,
            ContInfo:[{name:'目标',value:0},{name:'达成',value:0},{name:'同比',value:0},
            {name:'同期',value:0}]},
          ]},
          {OnType:'KAReach',IndeWidth:50,sign:3,IndexData:[
            {title:'线下网拍',Tnum:0,
            ContInfo:[{name:'目标',value:0},{name:'达成',value:0},{name:'同比',value:0},
            {name:'同期',value:0}]},
          ]},
        ]
      }


    },

    async GetTrendData(){
      let query = {
        // MM:moment(this.month).format('MM')*1,
        // YYYY:moment(this.month).format('YYYY年'),
        YYYYMM: moment(_time_now).format('YYYYMM'),
        YYYY:this.ActivityDat.area,
        CHANNEL:this.IsChangeNam.IsVal
      }
      let res = await this.$fetchSql('all_center', 'all_center_ka_qs',query);
      this.TrendData=res.data;
      this.GetCharts(this.TrendData);
      this.GetTrendTable(this.TrendData);

    },

    GetCharts(UserDataOn){

      // let Userdata = UserDataOn.filter(_=>_.MDATE!=='年累计'&&_.MDATE!=='当期累计')
      let Userdata = UserDataOn.filter(_=>_.MDATE!=='当期累计'&&_.MDATE!=='年累计')
      Userdata.sort((a, b) => (a.MDATE.replace(/[\u4e00-\u9fa5]/g,''))*1 - (b.MDATE.replace(/[\u4e00-\u9fa5]/g,''))*1);

      this.echartData.xAxis[0].data=[];
      this.echartData.series[0].data=[];
      this.echartData.series[1].data=[];
      let PdYearM=0;
        this.echartData.series[0].name = this.ActivityDat.area
        this.echartData.series[1].name = this.ActivityDat.area.split('年')[0] - 1 + '年'
      Object.keys(Userdata).forEach((OnKey) => {
        this.echartData.xAxis[0].data.push(Userdata[OnKey].MDATE);

        PdYearM=Userdata[OnKey].YDATE.replace(/[\u4e00-\u9fa5]/g,'')+Userdata[OnKey].MDATE.replace(/[\u4e00-\u9fa5]/g,'');
        if(PdYearM*1<=(moment(_time_now).format('YYYYMM')*1)){
          this.echartData.series[0].data.push(Userdata[OnKey].KA_ACT_AMT);
        } 
        this.echartData.series[1].data.push(Userdata[OnKey].AGO_KA_ACT_AMT);
      });

      this.echartData.tooltip.formatter=((params)=>{
        let viewval=[];
        if(params.length===1){
          viewval='日期：'+params[0].axisValue+'<br/>'+params[0].marker+this.ActivityDat.area+'：'+HandleNum('HundredMillion',params[0].value)
        }else if(params.length===2){
          viewval='日期：'+params[0].axisValue+'<br/>'+params[0].marker+this.ActivityDat.area+'：'+HandleNum('HundredMillion',params[0].value)+'<br/>'
            +params[1].marker+(this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,'')*1-1)+'年：'+HandleNum('HundredMillion',params[1].value)
        }
        return viewval
      });
      // 每次都需要清除画布
      this.$refs.DChartDescOn.$refs.echarts.clear();

    },

    GetTrendTable(UserDataOn){
      let Userdata = UserDataOn.filter(_=>_.MDATE!=='年累计')
      Userdata.sort((a, b) => (a.MDATE.replace(/[\u4e00-\u9fa5]/g,''))*1 - (b.MDATE.replace(/[\u4e00-\u9fa5]/g,''))*1);

      let sum = UserDataOn.find(_=>{return _['MDATE'] === '年累计'});
      Userdata.unshift(sum); 

      this.tableData.labelD=['年份'];
      this.tableData.tableD=[['目标'],[this.ActivityDat.area],[(this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,'')*1-1)+'年'],['同比'],['达成'],]
      Object.keys(Userdata).forEach((OnKey) => {
        this.tableData.labelD.push(Userdata[OnKey].MDATE);
        this.tableData.tableD[0].push(Userdata[OnKey].KA_GOAL_AMT);
        this.tableData.tableD[1].push(Userdata[OnKey].KA_ACT_AMT);
        this.tableData.tableD[2].push(Userdata[OnKey].AGO_KA_ACT_AMT);
        this.tableData.tableD[3].push(Userdata[OnKey].KA_AGO_RATE);   
        this.tableData.tableD[4].push(Userdata[OnKey].KA_REACH_RATE);

      });
    },
    disabledDate(current) {
      return current && current > moment()
    },


  }

  


}
</script>

<style lang="scss" scoped>
.KAReach{
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
    .SelTime{
      /deep/ .ant-select-selection--single{
        width: 155px;
      }
    }

    
  }
  .main{
    height: calc(100% - 38px);
    .TopInde{
      .TopInAll{
        display: flex;
        max-height: 120px;
        .TopInACent{
          display: flex;
          cursor: pointer;
          flex: 1;
          .IndeChart{
            flex: 1;
            .echarts{
              height: calc(100% - 0px) !important;
              margin-top: -16px;
            }
          }
          .IndeText{
            flex: 2;
          }
          .IndexCss0{
            /deep/ .TopIndex{
              .TopIndList{
                .TopCoun{
                  ul.TopCouUl{
                    .TopCouUlLi{
                      .TopCouULUl{
                        li:nth-child(1){
                          flex: 30;
                        }
                        li:nth-child(2){
                          flex: 50;
                        }
                        li:nth-child(3){
                          flex: 20;
                        }
                      }
                    }
                  }
                }
              }
            }

          }
          /deep/ .TopIndex .TopIndList{
            padding-top: 5px;
            padding-bottom: 5px;
          }
        }
        .TopInACent:hover{
          background: rgba(0, 0, 0, 0.03);
        }
        .TsTopInACent{
          background: rgba(0, 0, 0, 0.03);
        }


      }
    }

    .CentreChart{
      // height: calc(100% - 350px) !important;
      // height: calc((100% - 150px) * 0.6) !important;
      height: calc((100% - 120px) - (6 * 28px)) !important;
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
      .DChartDescCss{
        height: calc(100% - 51px) !important;


      }
    }

    .DownTable{
      // height: calc(100% - 390px);
      // height: calc((100% - 190px) * 0.4 + 20px);
      height: calc(6 * 28px);
      // max-height: 200px;

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
</style>