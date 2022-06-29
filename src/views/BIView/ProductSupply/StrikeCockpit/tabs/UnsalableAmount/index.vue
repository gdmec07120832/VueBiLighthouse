<template>
  <div class="UnsalableAmount">
    <div class="header">
      <Title class="title" :label="'滞销库龄'" :jump="true" :jumpTarget="JumpStr" />
      <div class="HeadTitle">
        <span class="MonthT">统计月份</span>
        <a-month-picker v-model="month" format="YYYY-MM" :disabledDate='disabledDate' valueFormat="YYYYMM" :allowClear="false" />            
      </div>
    </div>

    <div class="main">
      <div class="UALeft">
        <div class="UALIndex" ref="panel">
          <div v-for="(item,index) in OnIndex" :key="index" @click="IsChoiceFun(index)" class="IMOLInedxDat" :class="(IsChoiceOn===index)?'TsTopInACent':''">
            <Indextcq v-bind="item" />
          </div>
        </div>

        <div class="UALChart" style="position: relative">
<!--          <div class="UALChartTitle">-->
          <div class="UATName mt15" style="position: absolute;">{{(IsChoiceOn===0)?'滞销金额趋势' + `（${AgeName}）`:'滞销占库比趋势' + `（${AgeName}）`}}</div>
<!--            <div class="UATlegend">-->
<!--              <span>{{UATlegendN.Amt}}</span>-->
<!--              <span>{{UATlegendN.Ago}}</span>-->
<!--            </div>-->
<!--          </div>-->
          <v-chart  ref="UALCharOn" class="UALCharOnCss" style="overflow: visible" :options="echartData" autoresize></v-chart>
        </div>


        <div class="UALTable">
          <Tabletcq v-bind="tableData" @OnParm='ParmData' />
        </div>


      </div>

      <div class="UARight">
        <div class="UARIndex">
          <Indextcq v-bind="OnIndexR" />
        </div>

        <div class="UARChart" style="position: relative">
<!--          <div class="UARChartTitle">-->
          <div class="UATName" style="position: absolute">{{'滞销清理达成'}}</div>
<!--            <div class="UATlegend">-->
<!--              <span>{{'清理额'}}</span>-->
<!--              <span>{{'达成'}}</span>-->
<!--            </div>-->
<!--          </div>-->
          <v-chart ref="UARCharOn" class="UARCharOnCss" style="overflow: visible" :options="EchartDataBar" autoresize></v-chart>
        </div>

        <div class="UARTable">
          <div class="UARTabTitle">
            预测期末滞销库存金额
          </div>
          <div class="UARTabUser">
            <Tabletcq v-bind="tableDataB" />
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
import Indextcq from '../../components/Indextcq'
import Tabletcq from '../../components/tabletcq'
import moment from 'moment'
import { HandleNum } from '../../utils/tcq'
import echartStyle from "../../utils/echartStyle";
export default {
  name: 'UnsalableAmount',
  components: {
    Title,
    Indextcq,
    Tabletcq
  },
  data() {
    return {
      month: moment(_time_now).format('YYYYMM'),
      IsChoiceOn:0,
      IsChangeNam:{
        IsVal:'滞销金额',
        IsArray:['滞销金额','滞销占库比'],
      },
      ChartdataON:[],
      UATlegendN:{
        Amt:'本期',
        Ago:'同期'
      },
      AgeName:'合计',
      OnIndex:{
        OnType:'UnsalableAmount',
        sign:0,
        IndeWidth:100,
        IndexData:[],
      },

      OnIndexR:{
        OnType:'UnsalableAmount',
        sign:1,
        IndeWidth:100,
        IndexData:[],
      },

      tableData:{
        index:'UnsalableAmountA',
        isparm:true,
        labelD:[],
        tableD:[],
      },

      tableDataB:{
        index:'UnsalableAmountB',
        labelD:[],
        tableD:[],
      },

      echartData: {
        grid: {
          left: 0,
          right: 0,
          bottom: 10,
          top: 40,
          containLabel: true,
        },

        legend: {
          icon: 'rect',
          // itemWidth: 16,
          // itemHeight: 2,
          ...echartStyle.legendLine,
          selectedMode: true,
          top: 20,
          right: 10,
          show:true,
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
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: echartStyle.splitLine
              },
              show:false
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


      EchartDataBar: {
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 40,
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
              show:false
            },
            axisLabel: {
              // formatter: 'value',
              show:false,
            },
            splitNumber: '3',
          },
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
              show:false
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
              normal: {
                color: echartStyle.previousYear,
              },
            },
            yAxisIndex:1,
            lineStyle: {
              color: echartStyle.previousYear,
            },
            symbol: 'none',
          },
        ],
      },

      JumpStr:'',


    }
  },

  watch: {
    'month': {
      handler() {
        this.GetViewData();
        this.GetViewTrend();
        this.GetViewRClear();
        this.GetHandRTable();

      }
    },

    'AgeName': {
      handler() {
        this.GetViewTrend();
      }
    },

    'IsChangeNam.IsVal':{
      handler() {
        console.log("====1111111===========");
        console.log(this.IsChangeNam.IsVal)
        this.TrendCharts(this.ChartdataON);
      }
    },

  },

  async created() {

    // this.OnIndex.IndeWidth=100;
    // this.OnIndex.OnType='UnsalableAmount'
    // this.OnIndex.sign=0;
    // this.OnIndex.IndexData=[
    //   {title:'滞销金额',Tnum:30496160,
    //     ContInfo:[{name:'达成',value:0.789},{name:'同比',value:0.039},]},
    //   {title:'滞销占库比',Tnum:0.0916,
    //     ContInfo:[{name:'同期',value:0.123},{name:'同比',value:0.1023},]},
    // ]


    this.OnIndex=[
      {OnType:'UnsalableAmount',IndeWidth:100,sign:0, IndexData:[
        {title:'滞销金额',Tnum:0,
        ContInfo:[{name:'达成',value:0},{name:'同比',value:0},]},
      ]},
      {OnType:'UnsalableAmount',IndeWidth:100,sign:1,IndexData:[
        {title:'滞销占库比',Tnum:0,
        ContInfo:[{name:'同期',value:0},{name:'同比',value:0},]},
      ]},
    ]



    this.OnIndexR.IndeWidth=50;
    this.OnIndexR.OnType='UnsalableAmount'
    this.OnIndexR.sign=2;
    this.OnIndexR.IndexData=[
      {title:'实际清理',Tnum:0,
        ContInfo:[{name:'日累计目标',value:0},{name:'日累计达成',value:0},
          {name:'月累计目标',value:0},{name:'月累计达成',value:0},]},
    ]
 
    this.tableData.labelD=['库龄分层','滞销金额','金额同比','库存占比','占比同比'];
    this.tableData.tableD=[
      ['合计',0,0,0,0],
      ['61-90',0,0,0,0],
      ['91-180',0,0,0,0],
      ['181-360',0,0,0,0],
      ['361-720',0,0,0,0],
      ['720+',0,0,0,0],
    ]

    this.tableDataB.labelD=['库龄分层','目前期末滞销金额','预测期末滞销金额'];
    this.tableDataB.tableD=[
      ['合计',0,0],
      ['61-90',0,0],
      ['91-180',0,0],
      ['181-360',0,0],
      ['361-720',0,0],
      ['720+',0,0],
    ]

    this.GetViewData();
    this.GetViewTrend();
    this.GetViewRClear();
    this.GetHandRTable();
    this.jumpTarget();


  },
  mounted(){
    // 每次都需要清除画布
    this.$refs.UALCharOn.$refs.echarts.clear();
  },


  methods: {

    async jumpTarget() {
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2019_00199':'BI_PC_2019_00138'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },

    IsChoiceFun(Num){
      this.IsChoiceOn=Num;
      this.IsChangeNam.IsVal = this.IsChangeNam.IsArray[Num];
    },

    ParmData(data){
      console.log("======f返回的数据是！！！=======")
      console.log(data);
      this.AgeName=data; 
    },

    async GetViewData(){
      console.log("==============1212112=======")
      let query = {
        YYYYMM: this.month,  
      }
      let res = await this.$fetchSql('all_center', 'all_center_unsale_inv',query);
      res.data.sort((a,b)=>{
        return a["RANK_ON"] - b["RANK_ON"]
      });
      // console.log(res.data);
      if(res.data.length>0){
        this.HandIndexDat(res.data);
        this.HandLetTable(res.data);
      }else{
        let target = this.$refs.panel.children[0].children[0].children[0].children[2].children[0].children[0].children[0].children[1]
        target.innerText = '--'
        this.OnIndex=[
          {OnType:'UnsalableAmount',IndeWidth:100,sign:0, IndexData:[
            {title:'滞销金额',Tnum:0,
            ContInfo:[{name:'目标',value:0},{name:'同比',value:0},]},
          ]},
          {OnType:'UnsalableAmount',IndeWidth:100,sign:1,IndexData:[
            {title:'滞销占库比',Tnum:0,
            ContInfo:[{name:'同期',value:0},{name:'同比',value:0},]},
          ]},
        ]
        this.tableData.tableD=[
          ['合计',0,0,0,0],
          ['91-180',0,0,0,0],
          ['181-360',0,0,0,0],
          ['361-720',0,0,0,0],
          ['720+',0,0,0,0],
        ]
      }
    },

    HandIndexDat(Userdata){
      let sum = Userdata.find(_=>{return _['INV_AGE_LEVEL'] === '合计'});
      this.OnIndex=[
        {OnType:'UnsalableAmount',IndeWidth:100,sign:0, IndexData:[
          {title:'滞销金额',Tnum:sum.UNSALE_INV_VALUE,
          ContInfo:[{name:'目标',value:sum.TGT_CLEAN_AMT},
          {name:'同比',value:(sum.UNSALE_INV_VALUE - sum.AGO_UNSALE_INV_VALUE) / sum.AGO_UNSALE_INV_VALUE},]},
        ]},
        {OnType:'UnsalableAmount',IndeWidth:100,sign:1,IndexData:[
          {title:'滞销占库比',Tnum:sum.UNSALE_INV_RATE,
          ContInfo:[{name:'同期',value:sum.AGO_UNSALE_INV_RATE},
          {name:'同比',value:(sum.UNSALE_INV_RATE - sum.AGO_UNSALE_INV_RATE) / sum.AGO_UNSALE_INV_RATE},]},
        ]},
      ]
      let target = this.$refs.panel.children[0].children[0].children[0].children[2].children[0].children[0].children[0].children[1]
      let text = target.innerText
      if(!sum.TGT_CLEAN_AMT) target.innerText = '--'
      else text = target.innerText = (sum.TGT_CLEAN_AMT * 1).toLocaleString()
      this.$nextTick(() => {
          target.classList.remove('red')
          target.classList.remove('green')
      })
    },
    HandLetTable(Userdata){
      this.tableData.labelD=['库龄分层','滞销金额','金额同比','库存占比','占比同比'];
      this.tableData.tableD=[];
      Object.keys(Userdata).forEach((OnKey) => {
        this.tableData.tableD.push([
          Userdata[OnKey].INV_AGE_LEVEL,
          Userdata[OnKey].UNSALE_INV_VALUE,
          (Userdata[OnKey].UNSALE_INV_VALUE - Userdata[OnKey].AGO_UNSALE_INV_VALUE) / Userdata[OnKey].AGO_UNSALE_INV_VALUE,
          Userdata[OnKey].UNSALE_INV_RATE,
          (Userdata[OnKey].UNSALE_INV_RATE - Userdata[OnKey].AGO_UNSALE_INV_RATE) / Userdata[OnKey].AGO_UNSALE_INV_RATE,
        ]);
      });
    },

    async GetViewTrend(){
      let query = {
        // YYYY: moment(this.month).format('YYYY'),  
        MDATE:moment(this.month).format('YYYY')*1,
        MDATE2:moment(this.month).format('YYYY')*1-1,
        INV_AGE_LEVEL:this.AgeName,
      }
      let res = await this.$fetchSql('all_center', 'all_center_trend',query);
      res.data.sort((a,b)=>{
        return moment(a['MDATE']) - moment(b['MDATE'])
      });
      console.log("===========aaaaaaaa1111111111111=====================");
      this.ChartdataON=res.data;
      this.TrendCharts(this.ChartdataON);
    },

    TrendCharts(Chartdata){

      let arr=Chartdata;
      let MonDat=[];
      let AmtDat=[];
      let AgoDat=[];
      // 每次都需要清除画布
      this.$refs.UALCharOn.$refs.echarts.clear();

      Object.keys(arr).forEach((OnKey) => {
        if(moment(arr[OnKey].MDATE).format('YYYY')*1==(moment(this.month).format('YYYY')*1-1)){
          MonDat.push(moment(arr[OnKey].MDATE).format('MM')+'月');          
          AgoDat.push((this.IsChangeNam.IsVal==='滞销金额')?arr[OnKey].UNSALE_INV_VALUE:arr[OnKey].UNSALE_INV_RATE);  
        }else if(moment(arr[OnKey].MDATE).format('YYYY')*1==(moment(this.month).format('YYYY')*1)){
          AmtDat.push((this.IsChangeNam.IsVal==='滞销金额')?arr[OnKey].UNSALE_INV_VALUE:arr[OnKey].UNSALE_INV_RATE);
        }
      })
      this.echartData.xAxis[0].data=MonDat;
      this.echartData.series[0].data=AmtDat;
      // this.echartData.series[0].name='本期';
      this.echartData.series[1].data=AgoDat;
      // this.echartData.series[1].name='同期';
      this.UATlegendN.Amt=moment(this.month).format('YYYY年');
      this.UATlegendN.Ago=moment(this.month).format('YYYY')*1-1+'年';
      this.echartData.series[0].name= this.UATlegendN.Amt;
      this.echartData.series[1].name= this.UATlegendN.Ago;
      this.echartData.tooltip.formatter=((params)=>{
        let OnLooK='';
        if(params.length>1){
          OnLooK= params[0].axisValue+'<br/>'+params[0].marker+this.UATlegendN.Amt+'：'+
            HandleNum((this.IsChangeNam.IsVal==='滞销金额')?'tenThousand':'percent1',params[0].value)+'<br/>'
            +params[1].marker+this.UATlegendN.Ago+'：'+
            HandleNum((this.IsChangeNam.IsVal==='滞销金额')?'tenThousand':'percent1',params[1].value);
        }else{
          OnLooK= params[0].axisValue+'<br/>'+params[0].marker+this.UATlegendN.Ago+'：'+
            HandleNum((this.IsChangeNam.IsVal==='滞销金额')?'tenThousand':'percent1',params[0].value);
        }
        return OnLooK;
      });

    },

    async GetViewRClear(){
      let query = {
        YYYY: moment(this.month).format('YYYY'),  
      }
      let res = await this.$fetchSql('all_center', 'all_center_clean_reach',query);
      res.data.sort((a,b)=>{
        return moment(a['MDATE']) - moment(b['MDATE'])
      });
      console.log("=====aaaa=============")
      // console.log(res.data);
      if(res.data.length>0){
        this.HandRIndex(res.data);
        this.HandRTrendOn(res.data);
      }

    },
    HandRIndex(Userdata){
      let Arr = Userdata.find(_=>{return moment(_['MDATE']).format('YYYYMM') === this.month});
      if(Arr){
        this.OnIndexR.IndexData=[
          {title:'实际清理',Tnum:Arr.CMLT_CLEAN_AMT,  
            ContInfo:[{name:'日累计目标',value: Arr.CMLT_CLEAN_TARGET_AMT},{name:'月累计目标',value: Arr.CLEAN_TARGET_AMT}, 
              {name:'日累计达成',value: Arr.CLEAN_REACH_RATE_D},{name:'月累计达成',value: Arr.CLEAN_REACH_RATE_M},]},
        ]
      }else{
        this.OnIndexR.IndexData=[
          {title:'实际清理',Tnum:0,
            ContInfo:[{name:'日累计目标',value:0},{name:'月累计目标',value:0},
            {name:'日累计达成',value:0},{name:'月累计达成',value:0},]},
        ]
      }
    },

    HandRTrendOn(Userdata){

      let MonDat=[];
      let AmtDat=[];
      let AgoDat=[];
      // 每次都需要清除画布
      this.$refs.UARCharOn.$refs.echarts.clear();

      Object.keys(Userdata).forEach((OnKey) => { 
        MonDat.push(moment(Userdata[OnKey].MDATE).format('MM')+'月');
        AmtDat.push({'value':Userdata[OnKey].CMLT_CLEAN_AMT,
          'itemStyle':{'color':(Userdata[OnKey].CLEAN_REACH_RATE_M>1)?'#ff5953':'#00a854'}
        });
        AgoDat.push(Userdata[OnKey].CLEAN_REACH_RATE_M);
      });

      this.EchartDataBar.xAxis[0].data=MonDat;
      this.EchartDataBar.series[0].name='清理额';
      this.EchartDataBar.series[0].data=AmtDat;
      this.EchartDataBar.series[0].type='bar';
      this.EchartDataBar.series[1].name='达成';
      this.EchartDataBar.series[1].data=AgoDat;
      this.EchartDataBar.tooltip.formatter=((params)=>{
        let str = `${params[0].axisValue}<br/>`
        params.forEach(item => {
          str += `${item.marker + item.seriesName}：${HandleNum(item.seriesName === '达成' ? 'percent' : 'round',item.value)}<br/>`
        })
        return str
        // return '日期：'+params[0].axisValue+'<br/>'+params[0].marker+'清理额：'+HandleNum('round',params[0].value)+'<br/>'
        //     +params[1].marker+'达成：'+HandleNum('percent',params[1].value)
      });      

    },

    async GetHandRTable(){
      let query = {
        YYYYMM: this.month,  
      }
      let res = await this.$fetchSql('all_center', 'all_center_frcst_reminv',query);
      res.data.sort((a,b)=>{
        return a["RANK_ON"] - b["RANK_ON"]
      });
      let Arr=res.data;
      this.tableDataB.tableD=[]
      if(Arr.length>0){

        Object.keys(Arr).forEach((OnKey) => { 

          this.tableDataB.tableD.push([
            Arr[OnKey].INV_AGE_LEVEL,
            Arr[OnKey].REM_INV_AMT,
            Arr[OnKey].FRCST_REM_INV_AMT,
          ]);

        });

      }else{
        this.tableDataB.tableD=[
          ['合计','--','--'],
          ['61-90','--','--'],
          ['91-180','--','--'],
          ['181-360','--','--'],
          ['361-720','--','--'],
          ['720+','--','--'],
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
.UnsalableAmount {
  .header {
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .HeadTitle{
      .MonthT{
        padding-right: 10px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
  .main{
    height: calc(100% - 38px);
    display: flex;
    .UALeft{
      height: 100%;
      flex: 1;
      // margin-right: 10px;
      margin-right: 60px;
      .UALIndex{
        display: flex;
        cursor: pointer;
        max-height: 120px;
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
        }
        /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(1){
          width: 20%;
        }
      }
      .UALTable{
        // height: calc(100% - 141px - 230px);
        // height: calc((100% - 141px) * 0.6 - 51px);
        // height: calc((6 * 28px + 1px));
        height: calc((7 * 28px - 10px));
        // max-height: 220px;
        margin-top: 30px;
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
      .UALChart{
        // height: calc(100% - 141px - 230px);
        // height: calc((100% - 141px) * 0.4 + 51px);
        height: calc((100% - 120px) - (7 * 28px + 1px) - 20px);
        // max-height: 375px;
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
        .UALCharOnCss{
          //height: calc(100% - 30px)!important;
        }

      }

    }
    .UARight{
      height: 100%;
      flex: 1;
      .UARIndex{
        max-height: 120px;
        /deep/ .TopIndex .TopIndList{
          padding-top: 5px;
        }
        /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(1){
          flex:25;
        }
        /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(2){
          flex:25;
        }
        /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(3){
          flex:50;
        }

      }

      .UARChart{
        // height: calc(100% - 141px - 230px);
        // height: calc((100% - 141px) * 0.4);
        
        height: calc((100% - 120px) - (8 * 28px + 1px) - 10px);
        margin-top: 10px;

        // max-height: 220px;
        .UARChartTitle{
          padding: 15px;
          padding-top: 0px;
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
        .UARCharOnCss{
          //height: calc(100% - 36px)!important;
        }
      }

      .UARTable{
        // height: calc(100% - 141px - 210px);  7*27
        // height: calc((100% - 141px) * 0.6) ;
        height: calc((8 * 28px + 1px));
        .UARTabTitle{
          padding: 15px;
          padding-top: 7px;
          padding-bottom: 7px;
        }
        .UARTabUser{
          height: calc(100% - 36px);
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
</style>