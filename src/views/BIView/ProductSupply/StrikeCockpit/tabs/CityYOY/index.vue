<template>
  <div class="CityYOY">
    <div class="header">
      <Title class="title" :label="'城市同增'" />
      <div class="ChoiceRight">
        <Select :label="'统计年份'" :value.sync="ActivityDat.area" :options="ActivityDat.areaOption" 
          style="margin-top: -1px;" />
      </div>
    </div>

    <div class="main">
      <div class="TopView">
        <div class="TopLeft">
          <!-- <Indextcq v-bind="OnIndex" /> -->
          <div class="TitleNam">同增总览</div>

          <div class="TitlAll">
            <div class="TitlLeft">
              <div class="TitleSub">同增城市占比</div>
              <div class="TitNumAll">
                <div class="TitNum" :style="{color:(OnIndex.IndexData[0].Tnum)?(OnIndex.IndexData[0].Tnum>=OnIndex.IndexData[0].ContInfo[0].value)?'#ff5953':'#00a854':''}">
                  {{HandleNumFun('percent1',OnIndex.IndexData[0].Tnum)}}</div>
                <div class="TitNumSub">
                  <div class="TitSubName">目标</div> 
                  <div class="TitSubVal">{{HandleNumFun('percent1',OnIndex.IndexData[0].ContInfo[0].value)}}</div>
                </div>
              </div>
            </div>

            <div class="TitlRight">
              <div class="IndCity">
                <div class="IndCityNam">总发货城市数</div>
                <div class="IndCityNam">{{HandleNumFun('round',OnIndex.IndexData[0].ContInfo[2].value)}}</div>
              </div>
              <div class="IndCity">
                <div class="IndCityNam">同增城市数</div>
                <div class="IndCityNam">{{HandleNumFun('round',OnIndex.IndexData[0].ContInfo[1].value)}}</div>
              </div>
            </div>

          </div>



        </div>

        <div class="TopRight">
          <div class="TopRigTitle">
            <div class="TopRTName">同增趋势{{'('+SpecialDat.area+')'}}</div>
            <div class="TopRTSel"> <Select :label="'城市等级'" :value.sync="SpecialDat.area" :options="SpecialDat.areaOption" /></div>
          </div>

          <div class="TopRigChart">
<!--            <div class="UALChartTitle">-->
<!--              <div class="UATName"></div>-->
<!--              <div class="UATlegend">-->
<!--                <span>{{(ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,'')*1)+'年'}}</span>-->
<!--                <span>{{(ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,'')*1-1)+'年'}}</span>-->
<!--              </div>-->
<!--            </div>-->
            <v-chart ref="DChartLogOn" class="DChartLogCss" style="overflow: visible;" :options="EchartDataM" autoresize></v-chart>
          </div>
        </div>
      </div>

      <div class="DownChaTab">

        <div class="DownChTitleAll">
          <div class="DownChTitle">城市等级分布</div>
          <div class="DownChSel">
            <span style="display: flex">
              <a-radio-group v-model="area">
                <a-radio :value="item" v-for="item in areaOption" :key="item">
                  {{ item }}
                </a-radio>
              </a-radio-group>
            </span>
          </div>          
        </div>

        <div class="DownCount">
          <div class="DownChaLeft">
            <div class="DownCharts"> 
              <v-chart ref="DCharBar" class="DCharBarCss" style="overflow: visible" :options="echartData" autoresize></v-chart>
            </div>
          </div>
          <div class="DownTabRight">
            <Tabletcq v-bind="tableData" />
          </div>          
        </div>

      </div>


    </div>
  </div>
</template>

<script>
// 做T+1处理开始
import echartStyle from "@/views/BIView/ProductSupply/StrikeCockpit/utils/echartStyle";

let _time_now=new Date();
_time_now=_time_now.getTime()-(24*60*60*1000);
_time_now=new Date(_time_now);
// 做T+1处理结束
import Title from '../../components/Title'
// import Indextcq from '../../components/Indextcq'
import Select from '../../components/Select'
import Tabletcq from '../../components/tabletcq'
import moment from 'moment'
import { HandleNum } from '../../utils/tcq'


export default {
  name: 'CityYOY',
  components: {
    Title,
    // Indextcq,
    Select,
    // CircleEchart,
    Tabletcq
  },
  data() {
    return {

      HandleNumFun:HandleNum,
      ActivityDat:{
        area:moment(_time_now).format('YYYY年'),
        areaOption:[moment(_time_now).format('YYYY')+'年',
          moment(_time_now).format('YYYY')*1-1+'年',
          moment(_time_now).format('YYYY')*1-2+'年']
      },
      SpecialDat:{
        area:moment(_time_now).format('YYYY年'),
        areaOption:[moment(_time_now).format('YYYY')+'年',
          moment(_time_now).format('YYYY')*1-1+'年',
          moment(_time_now).format('YYYY')*1-2+'年']
      },
      OnIndex: {
        OnType: 'CityYOY',
        IndeWidth: 100,
        IndexData: [],
      },

      area: '同增城市数',
      areaOption: ['同增城市数', '城市增额'],

      tableData:{
        index:'ceshi1',
        labelD:[],
        tableD:[],
      },

      EchartDataM: {
        grid: {
          left: '0%',
          right: '0%',
          bottom: 5,
          top: 20,
          containLabel: true,
        },
        animation:true,
        animationDuration:1500,
        animaationEasing: 'cubicInOut', //控制echarts初始化加载时间

        legend: {
          show: true,
          icon: 'rect',
          // itemWidth: 16,
          // itemHeight: 2,
          ...echartStyle.legendLine,
          selectedMode: true,
          top: 0,
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
            data: [],
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: echartStyle.axisLabel,
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
              // formatter: '{value} %',
              formatter: ((value,index)=>{
                return value.toFixed(1)+'%';
              }),
              color: echartStyle.axisLabel,
            },
            splitNumber: '3',
          },
        ],
        series: [
          {
            name: moment().format('YYYY年'),
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
            smooth: true,
            z: 2,
            symbol: 'none',
            areaStyle: echartStyle.areaStyle[0]
          },
          {
            name: moment().subtract(1, 'y').format('YYYY年'),
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


      echartData: {
        grid: {
          left: '0%',
          right: '0%',
          bottom: 5,
          top: 30,
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
        legend: {
          icon: 'rect',
          // itemWidth: 16,
          // itemHeight: 2,
          ...echartStyle.legendRect,
          selectedMode: true,
          top: 0,
          right: 10
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
                // color: '#f7f7f7',
                color: echartStyle.splitLine,
              },
            },
            axisLabel: {
              // formatter: 'value',
              color: echartStyle.axisLabel,
            },
            splitNumber: '3',
          },
        ],
        series: [
          {
            name: '线上',
            type: 'bar',
            barWidth: '20',
            itemStyle: {
              // normal: {
              //   color: '#5b8ff9',
              // },
              // color:'#5B8FF9',
              color: echartStyle.thisYear,
              barBorderRadius: [10, 10, 0, 0],
            },
            data: [],

            label: {
              show: false,
              position: 'top',
            },
            smooth: true,
            z: 2,
          },
          {
            name: '线下',
            type: 'bar',
            barWidth: '20',
            itemStyle: {
              // normal: {
              //   color: '#5b8ff9',
              // },
              // color:'#F6BD16',
              color: echartStyle.type3,
              barBorderRadius: [10, 10, 0, 0],
            },
            data: [],
            label: {
              show: false,
              position: 'top',
            },
            z: 1,
            smooth: true,
            // lineStyle: {
            //   color: '#e7e7e7',
            // },
            // symbol: 'none',
          },
        ],
      },

    }
  },

  watch: {
    'ActivityDat.area': {
      handler() {
        console.log("=================")
        console.log(this.ActivityDat.area);
        this.GetViewData();
        this.GetTrendDaInd();
        this.IsSwitch();
      }
    },
    'SpecialDat.area': {
      handler() {
        this.GetTrendDaInd();
      }
    },
    'area': {
      handler() {
        this.IsSwitch();
      }
    }




  },
  async created() {

    this.OnIndex.IndeWidth=100;
    this.OnIndex.OnType='CityYOY'
    this.OnIndex.IndexData=[
      {title:'同增城市占比',Tnum:0,
        ContInfo:[{name:'目标：',value:0},{name:'同增城市数：',value:0},{name:'总发货城市数：',value:0}]},
    ]

    this.tableData.labelD=['店铺','总发货城市数','同增城市数','同增城市占比','线上同增城市占比','线下同增城市占比'];
    this.tableData.tableD=[
      ['全国',0,0,0,0,0],
      ['特级',0,0,0,0,0],
      ['一级',0,0,0,0,0],
      ['二级',0,0,0,0,0],
      ['三级',0,0,0,0,0],
      ['四级',0,0,0,0,0],
      ['五级',0,0,0,0,0],
      ['六级',0,0,0,0,0],
      ['暂不开放',0,0,0,0,0],
    ]


    let res = await this.$fetchSql('all_center', 'all_center_city_inc_src',);
    res.data.sort((a,b)=>{return (a['RANK_ON']) - (b['RANK_ON'])});
    this.SpecialDat.areaOption = (Array.from(new Set(res.data.map((_) => _.CITY_LEVEL))));
    this.SpecialDat.areaOption.unshift('全部');
    this.SpecialDat.area = (!this.SpecialDat.areaOption)? '--':this.SpecialDat.areaOption[0];


    this.GetViewData();
    this.GetTrendDaInd();
    this.IsSwitch();

  },
  mounted(){
    // // 每次都需要清除画布
    // this.$refs.DChartLogOn.$refs.echarts.clear();
    // // this.$$refs.DCharBar
  },
  methods: {

    IsSwitch(){
      if(this.area==='同增城市数'){
        this.GetGradeBarNum();
      }else if(this.area==='城市增额'){
        this.GetGradeBarAmt();
      }
    },

    async GetViewData(){
      let query = {
        YDATE: this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,''),
      }
      let res = await this.$fetchSql('all_center', 'all_center_city_inc_sum',query);
      if(res.data.length>0){
        this.OnIndex.IndexData=[
          {title:'同增城市占比',Tnum:res.data[0].MTD_ALL_INC_CITY_RATE,
            ContInfo:[{name:'目标：',value:res.data[0].MTD_INC_CITY_TGT},
            {name:'同增城市数：',value: res.data[0].MTD_ALL_INC_CITY_CNT},
            {name:'总发货城市数：',value: res.data[0].MTD_TOT_CITY_CNT}]},
        ]
      }else{
        this.OnIndex.IndexData=[
          {title:'同增城市占比',Tnum:0,
            ContInfo:[{name:'目标：',value:0},
            {name:'同增城市数：',value: 0},
            {name:'总发货城市数：',value: 0}]},
        ]
      }

      console.log(this.OnIndex.IndexData);

    },
    async GetTrendDaInd(){
      let query = {
        YDATE: this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,''),
        CITY_LEVEL: (this.SpecialDat.area==='全部')?null:this.SpecialDat.area,
      }
      let res = await this.$fetchSql('all_center', 'all_center_city_inc_trend',query);
      res.data.sort((a,b)=>{
        return moment(a['MDATE_R']) - moment(b['MDATE_R'])
      });
        // 每次都需要清除画布
        this.$refs.DChartLogOn.$refs.echarts.clear();
        // this.$$refs.DCharBar

      if(res.data.length>0){
        this.EchartDataM.xAxis[0].data=[];
        this.EchartDataM.series[0].data=[];
        this.EchartDataM.series[0].name= this.ActivityDat.area;
        this.EchartDataM.series[1].data=[];
        this.EchartDataM.series[1].name= this.ActivityDat.area.split('年')[0] - 1 + '年';
        Object.keys(res.data).forEach((OnKey) => {
          this.EchartDataM.xAxis[0].data.push(res.data[OnKey].MDATE);
          if(res.data[OnKey].MDATE.replace(/[\u4e00-\u9fa5]/g,'')*1<=(moment(_time_now).format('MM')*1-1)){
            this.EchartDataM.series[0].data.push((res.data[OnKey].MTD_ALL_INC_CITY_RATE*100||0).toFixed(1));
          }
          this.EchartDataM.series[1].data.push((res.data[OnKey].AGO_ALL_INC_CITY_RATE*100||0).toFixed(1));
        });

        this.EchartDataM.tooltip.formatter=((params)=>{
          let SetValue=[];
          if(params.length>1){
            SetValue='日期：'+params[0].axisValue+'<br/>'+
            params[0].marker+this.ActivityDat.area+'：'+params[0].value+'%'+'<br/>'+
            params[1].marker+(this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,'')*1-1)+'年：'+params[1].value+'%';
          }else{
            SetValue='日期：'+params[0].axisValue+'<br/>'+
            params[0].marker+(this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,'')*1-1)+'年：'+params[0].value+'%';
          }
          return SetValue
        });

      }

      // console.log("====================1111111111111111222222=========");
      // console.log(res.data)

    },
    async GetGradeBarNum(){
      let query = {
        YDATE: this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,''),
        // CITY_LEVEL: this.SpecialDat.area,
      }
      let res = await this.$fetchSql('all_center', 'all_center_city_inc_num',query);
      res.data.sort((a,b)=>{return (a['RANK_ON']) - (b['RANK_ON'])});
      // console.log("=============22222222222222=====================");
      this.tableData.labelD=['店铺','总发货城市数','同增城市数','同增城市占比','线上同增城市占比','线下同增城市占比'];
      this.tableData.index='CityYOYNum',
      this.tableData.tableD=[];
      if(res.data.length>0){
        let BarData=res.data.filter(_=>_.CITY_LEVEL!=='全国');
        this.echartData.xAxis[0].data=[];
        this.echartData.series[0].name='线上';
        this.echartData.series[0].type='bar';
        this.echartData.series[0].data=[];
        this.echartData.series[1].name='线下';
        this.echartData.series[1].data=[];
        this.echartData.series[1].type='bar';
        Object.keys(BarData).forEach((OnKey) => {
          this.echartData.xAxis[0].data.push(BarData[OnKey].CITY_LEVEL);
          this.echartData.series[0].data.push(BarData[OnKey].MTD_ON_INC_CITY_CNT);
          this.echartData.series[1].data.push(BarData[OnKey].MTD_OFF_INC_CITY_CNT);
        }); 
        this.echartData.tooltip.formatter=((params)=>{
          let str = `${params[0].axisValue}<br/>`
          params.forEach(item => {
              str += `${item.marker + item.seriesName}：${HandleNum('round', item.value)}<br/>`
          })
          return str
          // let SetValue='日期：'+params[0].axisValue+'<br/>'+
          //   params[0].marker+'线上：'+HandleNum('round',params[0].value)+'<br/>'+
          //   params[1].marker+'线下：'+HandleNum('round',params[1].value)
          // return SetValue
        });

        let TabData=res.data.filter(_=>_.CITY_LEVEL!=='全国');
        let Sum = res.data.find(_=>{return _['CITY_LEVEL'] === '全国'});
        TabData.unshift(Sum);
        // console.log(TabData); 
        Object.keys(TabData).forEach((OnKeyT) => {
          // 表格数据！
          this.tableData.tableD.push([
            TabData[OnKeyT].CITY_LEVEL,
            TabData[OnKeyT].MTD_TOT_CITY_CNT,
            TabData[OnKeyT].MTD_ALL_INC_CITY_CNT,
            TabData[OnKeyT].MTD_ALL_INC_CITY_RATE,
            TabData[OnKeyT].MTD_ON_INC_CITY_RATE,
            TabData[OnKeyT].MTD_OFF_INC_CITY_RATE,
          ])          
        });
        
      }else{
        this.tableData.tableD=[
          ['全国',0,0,0,0,0],
          ['特级',0,0,0,0,0],
          ['一级',0,0,0,0,0],
          ['二级',0,0,0,0,0],
          ['三级',0,0,0,0,0],
          ['四级',0,0,0,0,0],
          ['五级',0,0,0,0,0],
          ['六级',0,0,0,0,0],
          ['暂不开放',0,0,0,0,0],
        ]        
      }

    },

    async GetGradeBarAmt(){
      let query = {
        YDATE: this.ActivityDat.area.replace(/[\u4e00-\u9fa5]/g,''),
        // CITY_LEVEL: this.SpecialDat.area,
      }
      let res = await this.$fetchSql('all_center', 'all_center_city_inc_amount',query);
      res.data.sort((a,b)=>{return (a['RANK_ON']) - (b['RANK_ON'])});

      this.tableData.labelD=['店铺','总增额','线上增额','线下增额','线上增额占比','线下增额占比'];
      this.tableData.index='CityYOYAmt',
      this.tableData.tableD=[];
      if(res.data.length>0){
        let BarData=res.data.filter(_=>_.CITY_LEVEL!=='全国');
        this.echartData.xAxis[0].data=[];
        this.echartData.series[0].data=[];
        this.echartData.series[1].data=[];
        Object.keys(BarData).forEach((OnKey) => {
          this.echartData.xAxis[0].data.push(BarData[OnKey].CITY_LEVEL);
          // this.echartData.series[0].data.push(BarData[OnKey].MTD_ON_SEND_INCR);
          this.echartData.series[0].data.push({
              value: BarData[OnKey].MTD_ON_SEND_INCR,
              itemStyle: {
                  barBorderRadius: BarData[OnKey].MTD_ON_SEND_INCR > 0 ? [10, 10, 0, 0] : [0, 0, 10, 10]
              }
          });
          // this.echartData.series[1].data.push(BarData[OnKey].MTD_OFF_SEND_INCR);
          this.echartData.series[1].data.push({
              value: BarData[OnKey].MTD_OFF_SEND_INCR,
              itemStyle: {
                  barBorderRadius: BarData[OnKey].MTD_OFF_SEND_INCR > 0 ? [10, 10, 0, 0] : [0, 0, 10, 10]
              }
          });
        });
        this.echartData.tooltip.formatter=((params)=>{
          let SetValue='日期：'+params[0].axisValue+'<br/>'+
            params[0].marker+'线上：'+HandleNum('round',params[0].value)+'<br/>'+
            params[1].marker+'线下：'+HandleNum('round',params[1].value)
          return SetValue
        });

        let TabData=res.data.filter(_=>_.CITY_LEVEL!=='全国');
        let Sum = res.data.find(_=>{return _['CITY_LEVEL'] === '全国'});
        TabData.unshift(Sum);
        // console.log(TabData); 
        Object.keys(TabData).forEach((OnKeyT) => {
          // 表格数据！
          this.tableData.tableD.push([
            TabData[OnKeyT].CITY_LEVEL,
            TabData[OnKeyT].MTD_ALL_SEND_INCR,  
            TabData[OnKeyT].MTD_ON_SEND_INCR,
            TabData[OnKeyT].MTD_OFF_SEND_INCR,
            TabData[OnKeyT].MTD_ON_INC_CITY_RATE,
            TabData[OnKeyT].MTD_OFF_INC_CITY_RATE,

          ])          
        });
          console.log(this.echartData)
      }else{
        this.tableData.tableD=[
          ['全国',0,0,0,0,0],
          ['特级',0,0,0,0,0],
          ['一级',0,0,0,0,0],
          ['二级',0,0,0,0,0],
          ['三级',0,0,0,0,0],
          ['四级',0,0,0,0,0],
          ['五级',0,0,0,0,0],
          ['六级',0,0,0,0,0],
          ['暂不开放',0,0,0,0,0],
        ]        
      }

    }



  }





}
</script>

<style lang="scss" scoped>
.CityYOY {
  .header {
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .ChoiceRight{
      /deep/ .ant-select-selection--single{
        width: 155px;
      }
    }
  }
  .main {
    height: calc(100% - 38px);
    .TopView {
      display: flex;
      .TopLeft {
        flex: 1;
        .TitleNam{
          padding-top: 10px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #000000;
        }


        .TitlAll{
          display: flex;
          .TitlLeft{
            flex: 1;
            .TitleSub{
              padding-top: 10px;
              color: rgba(0, 0, 0, 0.64);
            }
            .TitNumAll{
              // display: flex;
              .TitNum{
                // flex: 1;
                font-size: 22px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                padding-top: 5px;
              }
              .TitNumSub{
                .TitSubName{
                  font-size: 14px;
                  color: rgba(0, 0, 0, 0.64);
                  padding-top: 10px;
                }
                .TitSubVal{
                  font-size: 18px;
                  font-weight: bold;
                  line-height: 38px;
                }
              }
            }
          }
          .TitlRight{
            flex: 1;
            .IndCity{
              // display: flex;
              .IndCityNam{
                // flex: 1;
                font-size: 14px;
              }
              .IndCityNam:nth-child(1){
                // color: #999999;
                color: rgba(0, 0, 0, 0.64);
                padding-top: 10px;
              }
              .IndCityNam:nth-child(2){
                font-size: 18px;
                font-weight: bold;
                line-height: 38px;
              }
            };

          }

        }




      }
      .TopRight {
        flex: 3;
        .TopRigTitle{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 35px;
          .TopRTName{
            // color: #999999;
            color: rgba(0, 0, 0, 0.64);
          }
          .TopRTSel{
          }
        }
        .TopRigChart{
          //height: calc(100% - 40px);
          height: 127px;
          padding-top: 10px;
          .UALChartTitle{
            display: flex;
            justify-content: space-between;
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
          .DChartLogCss{
            height: calc(100% - 21px);
          }
        }

      }
    }

    .DownChaTab{
      height: calc(100% - 217px);
      
      .DownChTitleAll{
        display: flex;
        justify-content: space-between;
        .DownChTitle{
          padding-top: 10px;
        }
        .DownChSel{
          // padding-top: 15px;
          padding-top: 10px;
        }        
      }

      .DownCount{
        height: calc(100% - 31px);
        padding-top: 10px;
        display: flex;
        .DownChaLeft{
          flex: 1;
          .DownCharts{
            // height: calc(100% - 60px);
            height: calc(100%);
            // padding-top: 15px;
          }
        }
        .DownTabRight{
          flex: 1;
          // padding-top: 46px;
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Title{
            padding-left: 10px;
            text-align: left;
          }
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td{
            padding-right: 10px;
            text-align: right;
          }  
          /deep/ .TRORCLeftTUser2 tbody tr td.Title{
            padding-left: 10px;
            text-align: left;
          }
          /deep/ .TRORCLeftTUser2 tbody tr td{
            padding-right: 10px;
            text-align: right;
          }
        }
      }


    }


  }
}

/deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li{
  line-height: 30px;
}
/deep/ .TopIndex .TopIndList .TopINum{
  line-height: 45px;
}
</style>