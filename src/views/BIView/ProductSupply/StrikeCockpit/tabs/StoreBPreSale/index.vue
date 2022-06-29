<template>
  <div class="StoreBPreSale">
    <div class="header">
      <Title class="title" :label="'线上预售'" :jump="true" :jumpTarget="JumpStr" />
      <div class="TopRTSel"> 
        <Select style="padding-right: 25px;" :label="'店铺选择'" :value.sync="SelectShop.area" :options="SelectShop.areaOption" />
        <Select :label="'活动选择'" :value.sync="ActivityDat.area" :options="ActivityDat.areaOption" />
      </div>
      
    </div>

    <div class="main">
      <div class="StorTop">
        <div :class="(Reach.Ptd_Rate!=0)?'StorTopLeft':'StorTopLeft_null'">
          <div class="StorTLAll">
            <!--  -->
            <div v-if="Reach.Ptd_Rate!=0" class="StorTLAllLeft">
              <!-- <div class="StorLTitle">当日预售达成</div> -->
              <div class="StorLCAl">
                <div class="StorLCircl">
                  <CircleEchart class="echarts" :value="Reach.Ptd_Rate" :comp="'Activity'" :id="1" />
                </div>
                <div class="StorLCIndex">
                  <Indextcq v-bind="OnIndex" />
                </div>
              </div>
            </div>

            <div class="StorTLAllLeft">
              <!-- <div class="StorLTitle">累计预售达成</div> -->
              <div class="StorLCAl">
                <div class="StorLCircl">
                  <CircleEchart class="echarts" :value="Reach.Tot_Rate" :comp="'Activity'" :id="2" />
                </div>
                <div class="StorLCIndex">
                  <Indextcq v-bind="OnIndex2" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="StorTopRight">
          <div class="StorTRChart">
            <div class="StorTRCTitle">
              <div class="StorTRCTitlNull"></div>
              <div class="StorTRCTitlTex">预售业绩结构</div>
            </div>
            <div class="StorTRChartOn">
              <v-chart ref="StorTRChartOnV" class="StorTRChartOnCss" style="overflow: visible" :options="OptionData" autoresize></v-chart>
            </div>
          </div>

          <div class="StorTRIndeLis">
            <div class="StorTRIndeLOn">
              <ul class="StTRIndeLOnUl">
                <li>
                  <div class="StTRILOnUlTitle">预售尾款业绩</div>
                  <div class="StTRILOnUlVal">{{IndexAmt.PtdAmt}}</div>
                </li>
                <li>
                  <div class="StTRILOnUlTitle">剩余尾款金额</div>
                  <div class="StTRILOnUlVal">{{IndexAmt.PtdRemAmt}}</div>
                </li>
                <li>
                  <div class="StTRILOnUlTitle">待催付业绩</div>
                  <div class="StTRILOnUlVal">{{IndexAmt.PtdWaPaAmt}}</div>
                </li>
                <li>
                  <div class="StTRILOnUlTitle">付定金后退款业绩</div>
                  <div class="StTRILOnUlVal">{{IndexAmt.PtdStReAmt}}</div>
                </li>
                <li>
                  <div class="StTRILOnUlTitle">付尾款后退款业绩</div>
                  <div class="StTRILOnUlVal">{{IndexAmt.PtdTaPaAmt}}</div>
                </li>
              </ul>
              <div style="clear: both;"></div>
            </div>
          </div>
        </div>

        <div v-if="Reach.Ptd_Rate==0" style="height: 100%;flex: 2;"></div>



      </div>


      <div class="StoCenQieH">
        <div class="StoCenTitle">{{'达成情况('+SelectShop.area+')'}}</div>
        <span class="SelAll" style="display: flex">
          <a-radio-group v-model="AreaData.area" style="line-height: 30px;">
            <a-radio :value="item" v-for="item in AreaData.areaOption" :key="item">
              {{ item }}
            </a-radio>
          </a-radio-group>
        </span>
      </div>

      <div v-if="AreaData.area==='趋势'" class="StorCentre">
        <!-- <div class="StoCenTitle">{{'达成情况('+SelectShop.area+')'}}</div> -->
        <div class="StoCenChart">
          <v-chart ref="StoCenChaRef" class="StoCenChaCss" style="overflow: visible" :options="echartData" autoresize></v-chart>
        </div>
      </div>

      <div v-if="AreaData.area==='表格'" class="StorDown">
        <Tabletcq v-bind="tableData" />
      </div>

    </div>
  </div>
</template>

<script>
import echartStyle from "../../utils/echartStyle";
import Title from '../../components/Title'
import CircleEchart from '../../components/CircleEchart'
import Indextcq from '../../components/Indextcq'
import Tabletcq from '../../components/tabletcq'
import Select from '../../components/Select'
import moment from 'moment'
import { HandleNum } from '../../utils/tcq'

export default {
  name: 'StoreBPreSale',
  components: {
    Title,
    Indextcq,
    Select,
    CircleEchart,
    Tabletcq
  },
  data() {
    return {
      timer: null,
      AreaData:{
        area: '趋势',
        areaOption: ['趋势', '表格'],        
      },
      tableData:{
        index:'StoreBPreSale',
        labelSub:[],
        labelD:[],
        tableD:[],

        IsPage:true,

        Pagination_SenOn: {
          show: true,
          page: 1,
          pageSize: 8,
          total: 24,
          pageSizeOptions:['8','20','30','50','100'],
        },

      },
      Reach:{
        Ptd_Rate:0,
        Tot_Rate:0,
      },

      IndexAmt:{
        PtdAmt:0,
        PtdRemAmt:0,
        PtdWaPaAmt:0,
        PtdStReAmt:0,
        PtdTaPaAmt:0,
      },

      SelectShop:{
        area: '林氏木业家具旗舰店',
        areaOption: ['林氏木业家具旗舰店','林氏旗舰店'], 
      },

      ActivityDat:{
        area: '22年02.27预售(02.27-03.04)',
        areaOption: ['22年02.27预售(02.27-03.04)'], 
      },


      OnIndex: {
        OnType: 'StoreBPreSale',
        IndeWidth: 100,
        IndexData: [],
      },

      OnIndex2: {
        OnType: 'StoreBPreSale',
        IndeWidth: 100,
        IndexData: [],
      },

      echartData: {
        grid: {
          left: '0%',
          right: '0%',
          bottom: 20,
          top: 30,
          containLabel: true,
        },

        legend: {
          // show:false,
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
            show:false,
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
              // show:false,
            },
            axisLabel: {
              // formatter: 'value',
              show:false
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

      OptionData : {
        tooltip: {
          trigger: 'item',
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#333',
            fontSize: 12
          },
          formatter:'{value}'
        },
        legend: {
          show:true,
          textStyle:{
            fontSize:10
          },
          itemHeight:8,
          itemWidth:15,
          orient: 'vertical', //垂直显示
          y: 'center', //延Y轴居中
          x: 'right', //居右显示 
          selectedMode:false, //禁止点击 
          align: 'left'
        },
        color: ['#5B8FF9', '#F6BD16', '#6D88B6', '#FD84B6', '#B9D0FF', '#A285D2', '#6DC8EC'],
        series: [
          {
            name: '主体类目摆场占比',
            type: 'pie',
            hoverAnimation:true,  //取消鼠标移上去放大效果
            radius: ['40%', '80%'],
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
            data: [
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 274, name: '联盟广告'},
              {value: 235, name: '视频广告'},
              {value: 400, name: '搜索引擎'}
            ],
          },
        ],

      },
      JumpStr:'',



    }
  },

  watch: {
    'SelectShop.area': {
      handler() {
        this.GetViewData();
        this.GetTrendData();
      }
    },
    'ActivityDat.area': {
      handler() {
        this.GetViewData();
        this.GetTrendData();
      }
    }
  },


  async created() {
    let res = await this.$fetchSql('all_center', 'all_center_b_advnc_scr', )
    res.data.sort((a, b) => moment(b.PTD_ADVNC_START_DT).format('x') - moment(a.PTD_ADVNC_START_DT).format('x'))
    // this.SelectShop.areaOption = Object.freeze(Array.from(new Set(res.data.map((_) => _.SHOP_NAME))));
    // this.SelectShop.area =(!this.SelectShop.areaOption.length)? '--':'林氏木业家具旗舰店';
    this.ActivityDat.areaOption = Object.freeze(Array.from(new Set(res.data.map((_) => _.ADVNC_NAME))));
    this.ActivityDat.area =(!this.ActivityDat.areaOption.length)? '--':this.ActivityDat.areaOption[0];

    this.OnIndex.IndeWidth=100;
    this.OnIndex.OnType='StoreBPreSale'
    this.OnIndex.IndexData=[
      {title:'当日预售达成',Tnum:0,
        ContInfo:[{name:'目标',value:0},{name:'差额',value:0}]},
    ]

    this.OnIndex2.IndeWidth=100;
    this.OnIndex2.OnType='StoreBPreSale'
    this.OnIndex2.IndexData=[
      {title:'累计预售达成',Tnum:0,
        ContInfo:[{name:'目标',value:0},{name:'差额',value:0}]},
    ]

      this.tableData.labelSub=[
        {name:'日期',row:2,col:null} ,
        {name:'店铺名称',row:2,col:null} ,
        {name:'总计',row:null,col:2},
        {name:'-1',row:null,col:null},
        {name:'实际',row:null,col:7},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'多拍',row:null,col:2},
        {name:'-1',row:null,col:null},
        {name:'退款',row:null,col:3},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null}];
      this.tableData.labelD=['-1','-1','总预售业绩','总预售件数',
        '目标','实际预售业绩','实际预售完成率','实际业绩日占比','实际预售件数',
        '预售尾款业绩','预售尾款率',
        '预售多拍业绩','预售多拍个数','付定后退款业绩','付尾后退款数量','付尾后退款业绩'];

    this.tableData.tableD=[
      ['合计',200,300,400,500,600,700,800,900,1100,1200,1300,1400,1500,1600],
      ['2022/3/4',200,300,400,500,600,700,800,900,1100,1200,1300,1400,1500,1600],
      ['2022/3/3',200,300,400,500,600,700,800,900,1100,1200,1300,1400,1500,1600],
      ['2022/3/2',200,300,400,500,600,700,800,900,1100,1200,1300,1400,1500,1600],
      ['2022/3/1',200,300,400,500,600,700,800,900,1100,1200,1300,1400,1500,1600],
      ['2022/2/28',200,300,400,500,600,700,800,900,1100,1200,1300,1400,1500,1600],
      ['2022/2/27',200,300,400,500,600,700,800,900,1100,1200,1300,1400,1500,1600],
    ]

    this.GetViewData();
    this.GetTrendData();
    this.jumpTarget();
    let that = this
    this.timer = setInterval(() => {
      that.GetViewData()
      that.GetTrendData()
    }, 30000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods:{

    async jumpTarget() {
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2019_00092':'BI_PC_2019_00354'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },

    async GetViewData(){
      let query = {
        SHOP_NAME: this.SelectShop.area,
        ADVNC_NAME: this.ActivityDat.area
      }
      let res = await this.$fetchSql('all_center', 'all_center_b_advnc_sum', query);

      this.OnIndex.IndexData[0].Tnum=res.data[0].PTD_ADVNC_SALE_AMT;
      this.OnIndex.IndexData[0].ContInfo[0].value=res.data[0].PTD_ADVNC_SALE_TGT;
      this.OnIndex.IndexData[0].ContInfo[1].value=res.data[0].PTD_ADVNC_SALE_DIFF;
      this.Reach.Ptd_Rate=res.data[0].PTD_ADVNC_SALE_RATE;

      // this.Reach.Ptd_Rate=0.5

      this.OnIndex2.IndexData[0].Tnum=res.data[0].TOT_ADVNC_SALE_AMT;
      this.OnIndex2.IndexData[0].ContInfo[0].value=res.data[0].TOT_ADVNC_SALE_TGT;
      this.OnIndex2.IndexData[0].ContInfo[1].value=res.data[0].TOT_ADVNC_SALE_DIFF;
      this.Reach.Tot_Rate=res.data[0].TOT_ADVNC_SALE_RATE;

      this.IndexAmt.PtdAmt=HandleNum('round',res.data[0].PTD_ADVNC_FINAL_AMT);
      this.IndexAmt.PtdRemAmt=HandleNum('round',res.data[0].PTD_ADVNC_REM_FINAL_AMT);
      this.IndexAmt.PtdWaPaAmt=HandleNum('round',res.data[0].PTD_WAIT_PAY_AMT);
      this.IndexAmt.PtdStReAmt=HandleNum('round',res.data[0].PTD_STEP_PARA_REFUND_AMT);
      this.IndexAmt.PtdTaPaAmt=HandleNum('round',res.data[0].PTD_TAIL_PARA_REFUND_AMT);
       

      this.OptionData.series[0].data=[];
      let AmtAll=0;
      let Wk=0;
      let Cf=0;
      let Df=0;
      let Fw=0;
      if(res.data.length>0){
        AmtAll=res.data[0].PTD_ADVNC_FINAL_AMT+res.data[0].PTD_WAIT_PAY_AMT+
          res.data[0].PTD_STEP_PARA_REFUND_AMT+res.data[0].PTD_TAIL_PARA_REFUND_AMT
        Wk=res.data[0].PTD_ADVNC_FINAL_AMT;
        Cf=res.data[0].PTD_WAIT_PAY_AMT;
        Df=res.data[0].PTD_STEP_PARA_REFUND_AMT;
        Fw=res.data[0].PTD_TAIL_PARA_REFUND_AMT;
        this.OptionData.series[0].data=[
          {value: Wk, name: '尾款业绩  '+HandleNum('percent1',Wk/AmtAll)},
          {value: Cf, name: '待催付  '+HandleNum('percent1',Cf/AmtAll)},
          {value: Df, name: '定付后退款  '+HandleNum('percent1',Df/AmtAll)},
          {value: Fw, name: '付尾后退款  '+HandleNum('percent1',Fw/AmtAll)}
        ]
        this.OptionData.tooltip.formatter=((params)=>{

          return params.marker+params.name.match(/[\u4e00-\u9fa5]/g).join("")+'<br/>'+
            '业绩：'+ HandleNum('round',params.value) +'<br/>'+'占比：'+params.percent.toFixed(1)+'%'
        })
      }
      

    },

    async GetTrendData(){  
      let query = {
        SHOP_NAME: this.SelectShop.area,
        ADVNC_NAME: this.ActivityDat.area
      }
      let res = await this.$fetchSql('all_center', 'all_center_b_advnc_detail', query);
      res.data.sort((a, b) => moment(a.TDATE_DAY).format('x') - moment(b.TDATE_DAY).format('x'))

      this.HandChartData(res.data);
      this.HandTableData(res.data);


    },

    HandChartData(UserdataON){

      let Userdata = UserdataON.filter(_=>_.TDATE_DAY!=='汇总')

      let MonthData=[];
      let Amt=[];
      let Tag=[];
      let HandTime=0;
      Object.keys(Userdata).forEach((OnKey) => {
        HandTime=Userdata[OnKey].TDATE_DAY.split('/');
        MonthData.push(HandTime[1]+'月'+HandTime[2]+'日');
        Amt.push({'value':Userdata[OnKey].PTD_ADVNC_ACT_SALE_AMT,
          'itemStyle':{'color':(Userdata[OnKey].PTD_ADVNC_ACT_SALE_AMT>Userdata[OnKey].PTD_EVD_ADVNC_TGT_AMT)?'#ff5953':'#00a854'}});
        Tag.push(Userdata[OnKey].PTD_EVD_ADVNC_TGT_AMT);
      });
      this.$refs.StoCenChaRef.$refs.echarts.clear()
      this.echartData.xAxis[0].data=MonthData;
      this.echartData.series[0].data=Amt;
      this.echartData.series[0].type='bar';
      this.echartData.series[0].name='实际预售金额';
      this.echartData.series[1].data=Tag;
      this.echartData.series[1].type='line';
      this.echartData.series[1].name='预售目标';
      this.echartData.tooltip.formatter=((params)=>{
        let str = `${params[0].axisValue}<br/>`
        params.forEach(item => {
            str += `${item.marker + item.seriesName}：${HandleNum('round', item.value)}<br/>`
        })
        return str
      //   return '统计日期：'+params[0].axisValue+'<br/>'+params[0].marker+
      //     '实际预售金额：'+HandleNum('round',params[0].value)+'<br/>'+params[1].marker+'预售目标：'+HandleNum('round',params[1].value)
      });
    },

    HandTableData(UserdataON){

      this.tableData.labelSub=[
        {name:'日期',row:2,col:null} ,
        {name:'总计',row:null,col:2},
        {name:'-1',row:null,col:null},
        {name:'实际',row:null,col:7},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'多拍',row:null,col:2},
        {name:'-1',row:null,col:null},
        {name:'退款',row:null,col:3},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null}];
      this.tableData.labelD=['-1','总预售业绩','总预售件数',
        '目标','实际预售业绩','实际预售完成率','实际业绩日占比','实际预售件数',
        '预售尾款业绩','预售尾款率',
        '预售多拍业绩','预售多拍个数','付定后退款业绩','付尾后退款数量','付尾后退款业绩'];

      this.tableData.tableD=[];
      let Userdata = UserdataON.filter(_=>_.TDATE_DAY!=='汇总')
      let sum = UserdataON.filter(_ => _.TDATE_DAY === '汇总')[0]
      Userdata.unshift(sum)

      Object.keys(Userdata).forEach((OnKey) => {

        this.tableData.tableD.push([
          (Userdata[OnKey].TDATE_DAY==='汇总')?'合计':Userdata[OnKey].TDATE_DAY,
          // Userdata[OnKey].SHOP_NAME,
          Userdata[OnKey].PTD_ADVNC_SALE_AMT,
          Userdata[OnKey].PTD_ADVNC_SALE_CNT,

          Userdata[OnKey].PTD_EVD_ADVNC_TGT_AMT,
          Userdata[OnKey].PTD_ADVNC_ACT_SALE_AMT,
          Userdata[OnKey].PTD_ADVNC_SALE_FINL_RATE,
          Userdata[OnKey].PTD_ADVNC_ACT_SALE_RATE,
          Userdata[OnKey].PTD_ADVNC_ACT_SALE_CNT,
          Userdata[OnKey].PTD_ADVNC_FINAL_AMT,
          Userdata[OnKey].PTD_ADVNC_FINAL_RATE,

          Userdata[OnKey].PTD_ADVNC_DP_SALE_AMT,
          Userdata[OnKey].PTD_ADVNC_DP_SALE_CNT,

          Userdata[OnKey].PTD_STEP_PARA_REFUND_AMT,
          Userdata[OnKey].PTD_TAIL_PARA_REFUND_CNT,
          Userdata[OnKey].PTD_TAIL_PARA_REFUND_AMT,

        ])


      });

      this.tableData.Pagination_SenOn.page=1;
      this.tableData.Pagination_SenOn.total=this.tableData.tableD.length;


    }


  }



}
</script>

<style lang="scss" scoped>
.StoreBPreSale {
  .header {
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .TopRTSel{
      display: flex;
    }
  }
  .main {
    height: calc(100% - 38px);
    .StorTop {
      // height: calc(100% - 400px);
      height: 192px;
      max-height: 192px;
      display: flex;
      .StorTopLeft {
        height: 100%;
        flex: 5;
        .StorTLAll {
          height: 100%;
          display: flex;
          .StorTLAllLeft {
            flex: 1;
            height: 100%;
            .StorLTitle {
              padding-top: 15px;
              padding-left: 0px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: rgba(0, 0, 0, 0.64);
              line-height: 20px;
            }
            .StorLCAl {
              // height: calc(100% - 35px);
              height: 100%;
              // max-height: 131px;
              display: flex;
              .StorLCircl {
                flex: 1;
                height: calc(100% - 35px);
                margin-top: 25px;
                // padding-top: 35px;
              }
              .StorLCIndex {
                flex: 1;
                margin-top: 25px;
              }
            }
          }
        }
      }

      .StorTopLeft_null {
        height: 100%;
        flex: 2;
        .StorTLAll {
          height: 100%;
          display: flex;
          .StorTLAllLeft {
            flex: 1;
            height: 100%;
            .StorLTitle {
              padding-top: 15px;
              padding-left: 0px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: rgba(0, 0, 0, 0.64);
              line-height: 20px;
            }
            .StorLCAl {
              // height: calc(100% - 35px);
              height: 100%;
              // max-height: 131px;
              display: flex;
              .StorLCircl {
                flex: 1;
                height: calc(100% - 35px);
                margin-top: 25px;
                // padding-top: 35px;
              }
              .StorLCIndex {
                flex: 1;
                margin-top: 25px;
              }
            }
          }
        }
      }


      .StorTopRight {
        height: 100%;
        flex: 5;
        display: flex;
        .StorTRChart{
          flex: 35;
          height: 100%;
          max-height: 200px;
          .StorTRCTitle{
              // padding-top: 15px;
              padding-top: 0px;
              padding-left: 15px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: rgba(0, 0, 0, 0.64);
              line-height: 20px;
              display: flex;
              margin-top: 35px;
              .StorTRCTitlNull{
                flex: 6;
              }
              .StorTRCTitlTex{
                flex: 4;
                text-align: right;
                padding-right: 20px;
              }
          }
          .StorTRChartOn{ 
            height: 100%;
            max-height: 131px;
            margin-top: -20px;
            .StorTRChartOnCss{
              height: 100%;
              max-height: 131px;
            }
          }
        }
        .StorTRIndeLis{
          flex: 65;
          .StorTRIndeLOn{
            padding-left: 20px;
            padding-top: 30px;
            ul.StTRIndeLOnUl{
              list-style: none;
              padding: 0px;
              margin: 0px;
              li{
                float: left;
                width: 33.33%;
                height: 100%;
                .StTRILOnUlTitle{
                  // padding-top: 15px;
                  padding-top: 0px;
                  padding-left: 15px;

                  font-size: 12px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(0, 0, 0, 0.64);
                  line-height: 22px;

                }
                .StTRILOnUlVal{
                  padding-left: 15px;
                  padding-top: 10px;
                  padding-bottom: 10px;
                  font-size: 16px;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 600;
                  color: #3C3C3C;
                  line-height: 20px;
                }
              }
            }

          }

        }

      }
    }

    .StoCenQieH{
      display: flex;
      justify-content: space-between;
      .StoCenTitle{
        padding-top: 0px;
        padding-left: 0px;
        padding-right: 15px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.64);
        line-height: 30px;
      }
    }

    .StorCentre{
      // height: calc(100% - 390px);
      // height: calc(100% - 192px - (6 * 27px + 54px) - 30px);
      height: calc(100% - 192px - 30px);
      padding-top: 10px;
      .StoCenChart{
        padding-top: 0px;
        // height: calc(100% - 20px);
        height: calc(100%);
      }

    }

    .StorDown{
      // height: calc(100% - 350px);
      // // height: calc(100% - 400px);
      // max-height: 270px;
      // height: calc(6 * 27px + 54px);  
      height: calc(100% - 192px - 30px);
      padding-top: 10px;
      /deep/ .tablelthead .TRORCLeftTUser2 thead tr.labelSubCss div td{
        text-align:center;
      }
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
/deep/ .TopIndex .TopIndList{
  padding-top: 15px;
  padding-bottom: 5px;
}
/deep/ .TopIndex .TopIndList .TopINum{
  // padding-top: 20px;
  // margin-top: 25px;

}
</style>