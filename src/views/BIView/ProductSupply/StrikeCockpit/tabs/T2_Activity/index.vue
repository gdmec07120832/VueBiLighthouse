<template>
  <div class="Activity">
    <div class="header">
      <Title class="title" :label="'活动蓄水'"  :jump="true" :jumpTarget="JumpStr" />

      <div class="TopRTSel"> <Select :label="'活动选择'" :value.sync="SeleType" :options="SelOptions" /></div>
    </div>
    <div class="main">
      <div class="panel">
        <div class="Panel2">
          <div class="type3">
            <CircleEchart ref="circle1" class="echarts" :value="Indexdata[0].Reach" :comp="'Activity'" :id="1" />
            <div class="datas">
              <div class="r1">
                <div>{{ Indexdata[0].TitleName }}</div>
                <div>{{ HandleNumUse('round',Indexdata[0].TitleNum) }}</div>
              </div>
              <div class="box">
                <div class="r2">
                  <span>{{ Indexdata[0].Name1 }}</span>
                  <span>{{ HandleNumUse('round',Indexdata[0].Num1) }}</span>
                </div>
                <div class="r3">
                  <span>{{ Indexdata[0].Name2 }}</span>
                  <span>{{ HandleNumUse('round',Indexdata[0].Num2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="Panel2">
          <div class="type3">
            <CircleEchart ref="circle2" class="echarts" :value="Indexdata[1].Reach" :comp="'Activity'" :id="2" />
            <div class="datas">
              <div class="r1">
                <div>{{ Indexdata[1].TitleName }}</div>
                <div>{{ HandleNumUse('round',Indexdata[1].TitleNum) }}</div>
              </div>
              <div class="box">
                <div class="r2">
                  <span>{{ Indexdata[1].Name1 }}</span>
                  <span>{{ HandleNumUse('round',Indexdata[1].Num1) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TimeLine class="timeLine" :datas="timeLineDatas" />
      </div>

<!--      <div class="UALChartTitle">-->
<!--        <div class="UATName"></div>-->
<!--        <div class="UATlegend">-->
<!--          <span>{{'蓄水金额'}}</span>-->
<!--          <span>{{'蓄水目标'}}</span>-->
<!--        </div>-->
<!--      </div>-->
      <v-chart ref="echart" class="echartsBar mt10" style="overflow: visible" :options="echartData" autoresize></v-chart>

      <div class="ActiTable">
        <Tabletcq v-bind="tableData" />        
      </div>




    </div>
  </div>
</template>

<script>
import echartStyle from "../../utils/echartStyle.js"
import Title from '../../components/Title'
import CircleEchart from '../../components/CircleEchart'
import TimeLine from './components/TimeLine'
import Tabletcq from '../../components/tabletcq'
import Select from '../../components/Select'
import moment from 'moment'
import { HandleNum } from '../../utils/tcq'

export default {
  name: 'Activity',
  components: {
    Title,
    TimeLine,
    CircleEchart,
    Tabletcq,
    Select
  },
  data() {
    return {
      timer: null,
      SeleType: null,
      SelOptions:[],
      Indexdata:[
        {TitleName:'蓄水金额达成',TitleNum: 0,Reach: 0,Name1:'目标',Num1: 0,Name2:'差值',Num2: 0},
        {TitleName:'蓄水支付达成',TitleNum: 0,Reach: 0,Name1:'蓄水未支付金额',Num1: 0}
      ],
      HandleNumUse:HandleNum,

      tableData:{
        index:'T2_Activity',
        labelD:[],
        tableD:[],
      },

      timeLineDatas: [
        {
          label: '活动蓄水开始',
          date: null,
          date1: null,
          num: 13,
        },
        {
          label: '活动蓄水结束',
          date: null,
          date1: null,
          num: 0,
        },
        {
          label: '活动付款开始',
          date: null,
          date1: null,
          num: 4,
        },
        {
          label: '活动付款结束',
          date: null,
          date1: null,
        },
      ],

      echartData: {
        grid: {
          left: '0%',
          right: '0%',
          bottom: 20,
          top: 30,
          containLabel: true,
        },

        legend: {
          show:true,
          icon: 'rect',
          // itemWidth: 16,
          // itemHeight: 2,
          ...echartStyle.legendLine,
          selectedMode: true,
          top: 0,
          right: 10
          // left:50
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
              color: echartStyle.axisLabel
            }
          },
        ],
        yAxis: [
          {
            show: false,
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
            data: [],
            itemStyle: {
              // normal: {
              //   color: '#5b8ff9',
              // },
              // color:'#5b8ff9',
              color: echartStyle.thisYear,
              barBorderRadius: [10, 10, 0, 0],
            },
            label: {
              show: false,
              position: 'top',
            },
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
            smooth: true,
            itemStyle: {
              color: echartStyle.previousYear,
            },

            lineStyle: {
              color: echartStyle.previousYear,
            },
            symbol: 'none',
          },
        ],
      },

      UserOptions:[],
      UserOptData:[],
      JumpStr:'',
      
    
      
    }
  },

  watch: {
    'SeleType': {
      handler() {
        // this.getLine()
        // this.handleData('timeLine', this.options)
        this.HandleLine(this.UserOptions);
        this.getOverView();
        this.getLineView();
      }
    }
  },

  async created() {

    this.tableData.labelD=['日期','总计','2/18','2/19','2/20','2/21','2/22'];
    this.tableData.tableD=[
      ['蓄水目标', null, null, null, null, null, null],
      ['蓄水金额', null, null, null, null, null, null],
      ['蓄水达成', null, null, null, null, null, null],
      ['支付业绩', null, null, null, null, null, null],
      ['支付+蓄水达成', null, null, null, null, null, null],
    ]
    await this.getOptions();
    this.getOverView();
    this.getLineView();
    this.jumpTarget();
    let that = this
    this.timer = setInterval(() => {
      that.getOverView()
      that.getLineView()
    }, 30000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {

    async jumpTarget() {
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2019_00149':'BI_PC_2019_00416'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },
    async getOptions() {
      let res =  await this.$fetchSql('new_retail', 'new_retail_act_scr')
      this.UserOptions = res.data.concat();   
      this.UserOptions.sort((a, b) => moment(b.SP_ENDDING_DATE).format('x') - moment(a.SP_ENDDING_DATE).format('x'))
      this.SelOptions = Array.from(new Set(this.UserOptions.map(_ => _.ACTIVITY_NAME).filter(_ => _ !== null)))
      this.SeleType = this.SelOptions[0]
      this.HandleLine(this.UserOptions);
    },

    async getOverView() {
      let query = {
          ACTIVITY_NAME: this.SeleType
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_act_sum', query)
      this.Indexdata=[
        {TitleName:'蓄水金额达成',TitleNum: res.data[0].PTD_ORDER_AMT,Reach: res.data[0].PTD_ORDER_RATE,
          Name1:'目标',Num1: res.data[0].PTD_ORDER_TGT,Name2:'差值',Num2: res.data[0].PTD_ORDER_DIFF},
        {TitleName:'蓄水支付达成',TitleNum: res.data[0].PTD_PAY_AMT,Reach: res.data[0].PTD_ORDER_PAY_RATE,
          Name1:'蓄水未支付金额',Num1:res.data[0].PTD_NOT_PAY_AMT}
      ]
    },

    async getLineView(){
      let select = this.UserOptions.filter(_ => _.ACTIVITY_NAME === this.SeleType)
      if(!select.length) return
      let query = {
          START_TIME: moment(select[0].SP_STARTING_DATE).format('YYYYMMDD'),
          END_TIME: moment(select[0].SP_ENDDING_DATE).format('YYYYMMDD')
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_act_trend', query);
      this.UserOptData=res.data;
      this.ChartLine(this.UserOptData);
      this.FunTableData(this.UserOptData);

    },

    ChartLine(UserData){

      let arr = UserData.filter(_=>_.TDATE_DAY!=='总计');
      this.echartData.xAxis[0].data=[];
      this.echartData.series[0].data=[];
      this.echartData.series[1].data=[];
      this.$refs.echart.$refs.echarts.clear()
      if(!arr.length) return
      let keys = ['TDATE_DAY', 'PTD_ORDER_AMT', 'PTD_ORDER_TGT']
      arr.sort((a, b) => moment(a[keys[0]]).format('x') - moment(b[keys[0]]).format('x'));
      let TimeData=[];
      let Amt=[];
      let Tag=[];
      Object.keys(arr).forEach((OnKey) => {
        TimeData.push(arr[OnKey].TDATE_DAY);
        Amt.push({'value':arr[OnKey].PTD_ORDER_AMT,
          'itemStyle':{'color':(arr[OnKey].PTD_ORDER_AMT>arr[OnKey].PTD_ORDER_TGT)?'#ff5953':'#00a854'}});
        Tag.push(arr[OnKey].PTD_ORDER_TGT);
      });
      this.echartData.xAxis[0].data=TimeData;
      this.echartData.series[0].data=Amt;
      this.echartData.series[0].type='bar';
      this.echartData.series[0].name='蓄水金额';
      this.echartData.series[1].data=Tag;
      this.echartData.series[1].type='line';
      this.echartData.series[1].name='蓄水目标';
      this.echartData.tooltip.formatter=((params)=>{
        let str = `${params[0].axisValue}<br/>`
        params.forEach(item => {
            str += `${item.marker + item.seriesName}：${HandleNum('round', item.value)}<br/>`
        })
        return str
      });
    },

    FunTableData(UserDataT){
      
      let arr = UserDataT.filter(_ => _.TDATE_DAY !== '总计');
      arr.sort((a, b) => moment(a.TDATE_DAY).format('x') - moment(b.TDATE_DAY).format('x'))

      this.tableData.labelD=['日期'];
      this.tableData.tableD=[['蓄水目标'],['蓄水金额'],['蓄水达成'],['支付业绩'],['支付+蓄水达成']];

      if(!arr.length) return
      let sum = UserDataT.filter(_ => _.TDATE_DAY === '总计')[0]
      arr.unshift(sum)    
      Object.keys(arr).forEach((OnKeyT) => {
        this.tableData.labelD.push(arr[OnKeyT].TDATE_DAY);
        this.tableData.tableD[0].push(arr[OnKeyT].PTD_ORDER_TGT);
        this.tableData.tableD[1].push(arr[OnKeyT].PTD_ORDER_AMT);
        this.tableData.tableD[2].push(arr[OnKeyT].PTD_ORDER_RATE);
        this.tableData.tableD[3].push(arr[OnKeyT].PTD_PAY_AMT);
        this.tableData.tableD[4].push(arr[OnKeyT].PTD_TOT_RATE);
      });  

    },



    HandleLine(OnData){

      this.timeLineDatas.forEach(item => {
          item.data = null
          item.data1 = null
      })
      if(!OnData.length) return
      let keys = ['SP_STARTING_DATE', 'SP_ENDDING_DATE', 'ACTIVITY_STARTING_DATE', 'ACTIVITY_ENDDING_DATE']
      let obj = OnData.filter(_ => _.ACTIVITY_NAME === this.SeleType)[0]
      this.timeLineDatas.forEach((item, index) => {
          item.date = obj[keys[index]].split(' ')[0]
          item.date1 = obj[keys[index]].split(' ')[1]
      })
      this.timeLineDatas.forEach((item, index) => {
          if(index === this.timeLineDatas.length - 1) return
          let val = moment(this.timeLineDatas[index].date).format('x')
          let val1 = moment(this.timeLineDatas[index + 1].date).format('x')
          item.num = ((val1 - val) / (3600 * 24 * 1000)).toFixed(0) * 1
      })


    }





  }



}
</script>

<style lang="scss" scoped>
.Activity {
  .header {
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .main {
    margin-top: 10px;
    height: calc(100% - 48px);
    .panel {
      height: 136px;
      display: grid;
      grid-template-columns: 366px 366px 1fr;
      .timeLine {
        padding: 30px 20px 0 26px;
      }

      .type3::after {
        content: '';
        background: #f0f0f0;
        // background: #333333;
        width: 1px;
        height: 75px;
        position: relative;
        top: 50px;
        right: 0;
      }

      .type3 {
        width: 366px;
        height: 136px;
        display: flex;

        .echarts {
          display: inline-block;
          height: 136px !important;
          width: 136px !important;
        }

        .datas {
          padding: 0 30px 0 8px;
          display: inline-block;
          width: 230px;
          height: 136px;

          .r1 {
            div:nth-child(1) {
              margin-top: 14px;
              height: 22px;
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: rgba(0, 0, 0, 0.64);
              line-height: 22px;
            }

            div:nth-child(2) {
              margin-top: 4px;
              height: 24px;
              font-size: 24px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 600;
              color: #333333;
              line-height: 24px;
            }
          }

          .box {
            min-height: calc(100% - 64px);
            max-height: calc(100% - 64px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            .r2 {
              margin-top: 8px;
            }

            .r2,
            .r3,
            .r4 {
              display: flex;
              justify-content: space-between;

              span:nth-child(1) {
                height: 18px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #999999;
                line-height: 18px;
              }

              span:nth-child(2) {
                height: 18px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.64);
                line-height: 18px;
              }
            }
          }
        }
      }
    }

    .UALChartTitle{
      padding: 15px;
      padding-bottom: 0;
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
          // color: #8c8c8c;
          color: rgba(0, 0, 0, 0.64);
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
    .echartsBar {
      // height: calc(100% - 348px) !important;
      height: calc((100% - 136px - 10px) / 2) !important;
      //height: calc(100% - 300px)!important;
    }

    .tablelist{
      .TRORCLeftTUser2 {
        font-size: 12px;
        line-height: 2;
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        text-align: center;
        td {
          border: 1px solid #e7e9f0;
          // border-bottom: 0px;
        }
        tr:nth-child(2n) {
          background-color: #fcfcff;
        }
        thead tr {
          background-color: #f5f7ff;
        }
      }
    }

    .ActiTable{
      // max-height: 200px;      
      // height: calc(100% - 390px);
      height: calc((100% - 136px - 10px) / 2);
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
</style>