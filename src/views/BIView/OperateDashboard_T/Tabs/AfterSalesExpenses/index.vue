<template>
  <div class="AfterSalesExpenses">
    <div class="Header">
      <Title class="title" :label="'售后费用'" :jump="true" :jumpTarget="JumpStr" />
      <div class="ChoiceCss">
        <span class="SelAll" style="display: flex">
          <a-radio-group v-model="AreaData.area" style="line-height: 30px;">
            <a-radio :value="item" v-for="item in AreaData.areaOption" :key="item">
              {{ item }}
            </a-radio>
          </a-radio-group>
        </span>
      </div>
    </div>

    <div class="Min">
      <div class="AfterTop">
        <div class="AfterTopCon" v-for="(item,index) in OnIndex" :key="index" 
          @click="IsChoiceFun(index)" :class="(IsChoiceOn===index)?'TsTopInACent':''">
          <Indextcq v-bind="item" />
        </div>
        
      </div>

      <div class="AfterZhong">

        <div class="AfterZhChartL">
          <div class="AfterZhTitle">
            售后费用
          </div>
          <div class="AfterZChar">
            <v-chart ref="singleBarR" class="AfterZCharCss" :options="singleBar" autoresize/>
          </div>
        </div>

        <div class="AfterZhChartR">
          <div class="AfterZhTitle">
            费用占发货比
          </div>
          <div class="AfterZChar">
            <v-chart ref="singleBar1R" class="AfterZCharCss" :options="singleBar1" autoresize/>
          </div>
        </div>

      </div>
      <!-- <div class="AfterDown">
        <Tabletcq v-bind="tableData" />
      </div> -->
    </div>

  </div>
</template>

<script>
// 做T+1处理开始
let _time_now=new Date();
_time_now=_time_now.getTime()-(24*60*60*1000);
_time_now=new Date(_time_now);
// 做T+1处理结束
import graphic from 'echarts/lib/util/graphic'
import Title from '../../components/Title'
import Indextcq from '../../components/Indextcq'
// import Tabletcq from '../../components/tabletcq'
import { ChartData,HandleNum } from '../../utils/tcq'
import Bus from '@/utils/bus'
import moment from 'moment'
export default {
  name: 'AfterSalesExpenses',
  components: {
    Title,
    // Tabletcq,
    Indextcq,
  },
  data() {
    return {
      AreaData:{
        area:'月度费用',
        areaOption:['月度费用','年度费用']
      },
      OnIndex:[],
      OnIndM:[],
      OnIndY:[],
      IsChoiceOn:0,
      singleBar:{},
      singleBar1:{},
      UserTrendData:{},
      tableData:{
        index:'AfterSalesExpenses',
        isparm:false,
        labelD:[],
        tableD:[],
      },
      JumpStr:'',
      RemarksText:[
        {value:'若时间截止当月，费用尚未跑完，同期为完整月份数据，仅供趋势参考；'},
        // {value:'② 2021年（不含）之后，店铺包含林氏木业家具旗舰店、林氏旗舰店、林氏木业kids旗舰店、林氏木业全屋定制旗舰店'}
      ]
    }
  },
  watch: {
    'AreaData.area':{
      handler(){
        console.log(this.AreaData.area);
        this.IsUserIndex();
        this.UserOnTrendL();
        this.UserOnTrendR();
        // this.IsTrendAndTab();
      }
    },
    'IsChoiceOn':{
      handler(){
        // setTimeout(() => {
        //   this.$refs.singleBarR.$refs.echarts.clear();
        //   this.$refs.singleBar1R.$refs.echarts.clear();
        // }, 200);
        this.UserOnTrendL();
        this.UserOnTrendR();
        // this.IsTrendAndTab();
      }
    }
  },
  async created() {
    this.singleBar=ChartData();
    this.singleBar1=ChartData();

    this.singleBar.xAxis[0].data=[];
    this.singleBar.series[0].data=[];
    this.singleBar.series[1].data=[];

    this.singleBar1.xAxis[0].data=[];
    this.singleBar1.series[0].data=[];
    this.singleBar1.series[1].data=[];

    this.OnIndex=[
      {OnType:'AfterSalesExpenses',IndeWidth:100,sign:0, IndexData:[
        {title:'整体售后',Tnum:0,
        ContInfo:[{name:'同比增额',value:0},{name:'占发货比',value:0},{name:'比率增幅',value:0},]},
      ]},
      {OnType:'AfterSalesExpenses',IndeWidth:100,sign:1,IndexData:[
        {title:'退款费用',Tnum:0,remarks:false,
        ContInfo:[{name:'同比增额',value:0},{name:'占发货比',value:0},{name:'比率增幅',value:0},]},
      ]},
      {OnType:'AfterSalesExpenses',IndeWidth:100,sign:2,IndexData:[
        {title:'补件费用',Tnum:0,
        ContInfo:[{name:'同比增额',value:0},{name:'占发货比',value:0},{name:'比率增幅',value:0},]},
      ]},
      {OnType:'AfterSalesExpenses',IndeWidth:100,sign:2,IndexData:[
        {title:'服务费用',Tnum:0,
        ContInfo:[{name:'同比增额',value:0},{name:'占发货比',value:0},{name:'比率增幅',value:0},]},
      ]},
      {OnType:'AfterSalesExpenses',IndeWidth:100,sign:2,IndexData:[
        {title:'退货费用',Tnum:0,
        ContInfo:[{name:'同比增额',value:0},{name:'占发货比',value:0},{name:'比率增幅',value:0},]},
      ]},
    ];

    this.tableData.labelD=['年月','年平均','当期平均','1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    this.tableData.tableD=[
      ['2022',0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      ['2021',0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      ['差额',0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      ['同比',0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];


    Bus.$on('tab-cell-click', (payload) => {
      console.log("=======运行到售后费用这里来！！！======");
      console.log(payload);
      if(payload.title === '售后费用') {
        if(payload.tab === '售后费用') {
          this.IsChoiceOn = 0;
        }
        if(payload.tab === '退货费用') {
          this.IsChoiceOn = 4;
        }
      }
    })


    this.GetViewTrend();
    await this.GetViewDataM();
    await this.GetViewDataY();
    this.IsUserIndex();
    this.jumpTarget();


  },

  mounted(){
    // 每次都需要清除画布
    setTimeout(() => {
      this.$refs.singleBarR.$refs.echarts.clear();
      this.$refs.singleBar1R.$refs.echarts.clear();
    }, 200);

  },

  methods:{
    IsChoiceFun(Num){
      this.IsChoiceOn=Num;
      // this.IsChangeNam.IsVal = this.IsChangeNam.IsArray[Num];
      // console.log("111111111111111111111111111111111");
      // console.log(this.IsChoiceOn);
    },
    async jumpTarget() {
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2020_00030':'BI_PC_2020_00152'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },
    IsUserIndex(){
      if(this.AreaData.area==='月度费用'){
        if(this.OnIndM.length>0){
          this.OnIndex=[
            {OnType:'AfterSalesExpenses',IndeWidth:100,sign:0, IndexData:[
              {title:'整体售后',Tnum:this.OnIndM[0].MTD_FYZE_AMT,remarks:true,RemTex:this.RemarksText,
              ContInfo:[{name:'同比增额',value:this.OnIndM[0].MTD_FYZE_AMT_DIFF},
                {name:'占发货比',value:this.OnIndM[0].MTD_FYZE_RATIO},
                {name:'比率增幅',value:this.OnIndM[0].MTD_FYZE_RATIO_DIFF},
              ]},
            ]},
            {OnType:'AfterSalesExpenses',IndeWidth:100,sign:1,IndexData:[
              {title:'退款费用',Tnum:this.OnIndM[0].MTD_RETURNS_AMT,remarks:false,
              ContInfo:[{name:'同比增额',value:this.OnIndM[0].MTD_RETURNS_AMT_DIFF},
                {name:'占发货比',value:this.OnIndM[0].MTD_RETURNS_RATIO},
                {name:'比率增幅',value:this.OnIndM[0].MTD_RETURNS_RATIO_DIFF},
              ]},
            ]},
            {OnType:'AfterSalesExpenses',IndeWidth:100,sign:2,IndexData:[
              {title:'补件费用',Tnum:this.OnIndM[0].MTD_CMP_AMT,
              ContInfo:[{name:'同比增额',value:this.OnIndM[0].MTD_CMP_AMT_DIFF},
                {name:'占发货比',value:this.OnIndM[0].MTD_CMP_RATIO},
                {name:'比率增幅',value:this.OnIndM[0].MTD_CMP_RATIO_DIFF},
              ]},
            ]},
            {OnType:'AfterSalesExpenses',IndeWidth:100,sign:2,IndexData:[
              {title:'服务费用',Tnum:this.OnIndM[0].MTD_SERVICE_AMT,
              ContInfo:[{name:'同比增额',value:this.OnIndM[0].MTD_SERVICE_AMT_DIFF},
                {name:'占发货比',value:this.OnIndM[0].MTD_SERVICE_RATIO},
                {name:'比率增幅',value:this.OnIndM[0].MTD_SERVICE_RATIO_DIFF},
              ]},
            ]},
            {OnType:'AfterSalesExpenses',IndeWidth:100,sign:2,IndexData:[
              {title:'退货费用',Tnum:this.OnIndM[0].MTD_REF_AMT,
              ContInfo:[{name:'同比增额',value:this.OnIndM[0].MTD_REF_AMT_DIFF},
                {name:'占发货比',value:this.OnIndM[0].MTD_REF_RATIO},
                {name:'比率增幅',value:this.OnIndM[0].MTD_REF_RATIO_DIFF},
              ]},
            ]},
          ];
        }

      }else{

        if(this.OnIndY.length>0){
          this.OnIndex=[
            {OnType:'AfterSalesExpenses',IndeWidth:100,sign:0,IndexData:[
              {title:'整体售后',Tnum:this.OnIndY[0].MTD_FYZE_AMT,remarks:true,RemTex:this.RemarksText,
              ContInfo:[{name:'同比增额',value:this.OnIndY[0].MTD_FYZE_AMT_DIFF},
                {name:'占发货比',value:this.OnIndY[0].MTD_FYZE_RATIO},
                {name:'比率增幅',value:this.OnIndY[0].MTD_FYZE_RATIO_DIFF},
              ]},
            ]},
            {OnType:'AfterSalesExpenses',IndeWidth:100,sign:1,IndexData:[
              {title:'退款费用',Tnum:this.OnIndY[0].MTD_RETURNS_AMT,remarks:false,
              ContInfo:[{name:'同比增额',value:this.OnIndY[0].MTD_RETURNS_AMT_DIFF},
                {name:'占发货比',value:this.OnIndY[0].MTD_RETURNS_RATIO},
                {name:'比率增幅',value:this.OnIndY[0].MTD_RETURNS_RATIO_DIFF},
              ]},
            ]},
            {OnType:'AfterSalesExpenses',IndeWidth:100,sign:2,IndexData:[
              {title:'补件费用',Tnum:this.OnIndY[0].MTD_CMP_AMT,
              ContInfo:[{name:'同比增额',value:this.OnIndY[0].MTD_CMP_AMT_DIFF},
                {name:'占发货比',value:this.OnIndY[0].MTD_CMP_RATIO},
                {name:'比率增幅',value:this.OnIndY[0].MTD_CMP_RATIO_DIFF},
              ]},
            ]},
            {OnType:'AfterSalesExpenses',IndeWidth:100,sign:2,IndexData:[
              {title:'服务费用',Tnum:this.OnIndY[0].MTD_SERVICE_AMT,
              ContInfo:[{name:'同比增额',value:this.OnIndY[0].MTD_SERVICE_AMT_DIFF},
                {name:'占发货比',value:this.OnIndY[0].MTD_SERVICE_RATIO},
                {name:'比率增幅',value:this.OnIndY[0].MTD_SERVICE_RATIO_DIFF},
              ]},
            ]},
            {OnType:'AfterSalesExpenses',IndeWidth:100,sign:2,IndexData:[
              {title:'退货费用',Tnum:this.OnIndY[0].MTD_REF_AMT,
              ContInfo:[{name:'同比增额',value:this.OnIndY[0].MTD_REF_AMT_DIFF},
                {name:'占发货比',value:this.OnIndY[0].MTD_REF_RATIO},
                {name:'比率增幅',value:this.OnIndY[0].MTD_REF_RATIO_DIFF},
              ]},
            ]},
          ];
        }

      }

    },

    async GetViewDataY(){
      let res = await this.$fetchSql('kpi_report', 'afs_cost_y');
      // console.log("===========YYYYYYYYYY================");
      // console.log(res.data);
      this.OnIndY=res.data;
    },


    async GetViewDataM(){
      let res = await this.$fetchSql('kpi_report', 'afs_cost_m');
      // console.log("=============================");
      // console.log(res.data);
      this.OnIndM=res.data;
    },

    async GetViewTrend(){
      let res = await this.$fetchSql('kpi_report', 'afs_cost_m_trend');
      res.data.sort((a,b)=>{
        return moment(a['TMONTH_DATE']) - moment(b['TMONTH_DATE'])
      });
      this.UserTrendData=res.data;
      this.UserOnTrendL();
      this.UserOnTrendR();
      // this.IsTrendAndTab();  //表格暂时去掉



    },

    UserOnTrendL(){
      // console.log("================趋势图！！！====================");
      // console.log(this.UserTrendData);
      this.singleBar.grid.top=15;
      this.singleBar.series[0].type= 'line';
      this.singleBar.series[0].itemStyle.normal.color='#5C8FF9';


      this.singleBar.yAxis[0].splitLine.lineStyle.type= 'solid';
      this.singleBar.series[0].areaStyle.opacity=1;
      this.singleBar.series[0].areaStyle.color= new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'rgba(92,143,249,0.2)'
        },
        {
          offset: 1,
          color: 'rgba(92,143,249,0.2)'
        }
      ]);
      this.singleBar.series[1].areaStyle.opacity=0.2;
      this.singleBar.series[1].areaStyle.color='#EDF0F4';
      // this.singleBar.series[1].areaStyle.color= new graphic.LinearGradient(0, 0, 0, 1, [
      //   {
      //     offset: 0,
      //     color: '#EDF0F4'
      //   },
      //   {
      //     offset: 1,
      //     color: '#cce0e900'
      //   }
      // ]);


      this.singleBar.xAxis[0].data=[];
      this.singleBar.series[0].data=[];
      this.singleBar.series[1].data=[];
      let OnAmt=0;
      let OnAmtAgo=0;
      if(this.UserTrendData.length>0){
        if(this.AreaData.area==='月度费用'){
          Object.keys(this.UserTrendData).forEach((OnKey) => {
            if((moment(_time_now).format("YYYY")*1-1)===(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("YYYY")*1)){
              this.singleBar.xAxis[0].data.push(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("MM")+'月');
              // OnAmtAgo=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].LYMTD_FYZE_AMT:
              //   (this.IsChoiceOn===1)?this.UserTrendData[OnKey].LYMTD_RETURNS_AMT: 
              //   (this.IsChoiceOn===2)?this.UserTrendData[OnKey].LYMTD_CMP_AMT:
              //   (this.IsChoiceOn===3)?this.UserTrendData[OnKey].LYMTD_SERVICE_AMT:
              //   (this.IsChoiceOn===4)?this.UserTrendData[OnKey].LYMTD_REF_AMT:this.UserTrendData[OnKey].LYMTD_FYZE_AMT; 
              OnAmtAgo=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].MTD_FYZE_AMT:
                (this.IsChoiceOn===1)?this.UserTrendData[OnKey].MTD_RETURNS_AMT: 
                (this.IsChoiceOn===2)?this.UserTrendData[OnKey].MTD_CMP_AMT:
                (this.IsChoiceOn===3)?this.UserTrendData[OnKey].MTD_SERVICE_AMT:
                (this.IsChoiceOn===4)?this.UserTrendData[OnKey].MTD_REF_AMT:this.UserTrendData[OnKey].MTD_FYZE_AMT;
              this.singleBar.series[1].data.push(OnAmtAgo);
            }else if((moment(_time_now).format("YYYY")*1)===(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("YYYY")*1)){
              OnAmt=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].MTD_FYZE_AMT:
                (this.IsChoiceOn===1)?this.UserTrendData[OnKey].MTD_RETURNS_AMT: 
                (this.IsChoiceOn===2)?this.UserTrendData[OnKey].MTD_CMP_AMT:
                (this.IsChoiceOn===3)?this.UserTrendData[OnKey].MTD_SERVICE_AMT:
                (this.IsChoiceOn===4)?this.UserTrendData[OnKey].MTD_REF_AMT:this.UserTrendData[OnKey].MTD_FYZE_AMT;
              this.singleBar.series[0].data.push(OnAmt);
            }
          });

        }else{
          Object.keys(this.UserTrendData).forEach((OnKey) => {
            if((moment(_time_now).format("YYYY")*1-1)===(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("YYYY")*1)){
              this.singleBar.xAxis[0].data.push(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("MM")+'月');
              // OnAmtAgo=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].SUM_LYMTD_FYZE_AMT:
              //   (this.IsChoiceOn===1)?this.UserTrendData[OnKey].SUM_LYMTD_RETURNS_AMT: 
              //   (this.IsChoiceOn===2)?this.UserTrendData[OnKey].SUM_LYMTD_CMP_AMT:
              //   (this.IsChoiceOn===3)?this.UserTrendData[OnKey].SUM_LYMTD_SERVICE_AMT:
              //   (this.IsChoiceOn===4)?this.UserTrendData[OnKey].SUM_LYMTD_REF_AMT:this.UserTrendData[OnKey].SUM_LYMTD_FYZE_AMT;
              OnAmtAgo=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].SUM_MTD_FYZE_AMT:
                (this.IsChoiceOn===1)?this.UserTrendData[OnKey].SUM_MTD_RETURNS_AMT: 
                (this.IsChoiceOn===2)?this.UserTrendData[OnKey].SUM_MTD_CMP_AMT:
                (this.IsChoiceOn===3)?this.UserTrendData[OnKey].SUM_MTD_SERVICE_AMT:
                (this.IsChoiceOn===4)?this.UserTrendData[OnKey].SUM_MTD_REF_AMT:this.UserTrendData[OnKey].SUM_MTD_FYZE_AMT;
              this.singleBar.series[1].data.push(OnAmtAgo);
            }else if((moment(_time_now).format("YYYY")*1)===(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("YYYY")*1)){
              OnAmt=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].SUM_MTD_FYZE_AMT:
                (this.IsChoiceOn===1)?this.UserTrendData[OnKey].SUM_MTD_RETURNS_AMT: 
                (this.IsChoiceOn===2)?this.UserTrendData[OnKey].SUM_MTD_CMP_AMT:
                (this.IsChoiceOn===3)?this.UserTrendData[OnKey].SUM_MTD_SERVICE_AMT:
                (this.IsChoiceOn===4)?this.UserTrendData[OnKey].SUM_MTD_REF_AMT:this.UserTrendData[OnKey].SUM_MTD_FYZE_AMT;
              this.singleBar.series[0].data.push(OnAmt); 
            }

          });

        }

      }
      this.singleBar.tooltip.formatter=((params)=>{
        let IsParm=[];
        if(params.length>1){
          IsParm='时间：'+params[0].axisValue+'<br/>'+params[0].marker+HandleNum('round',params[0].value)+'<br/>'+
            params[1].marker+HandleNum('round',params[1].value);
        }else{
          IsParm='时间：'+params[0].axisValue+'<br/>'+params[0].marker+HandleNum('round',params[0].value);
        }
        return IsParm;
      });

    },

    UserOnTrendR(){
      // console.log("================趋势图右！！！====================");
      // console.log(this.UserTrendData);
      this.singleBar1.grid.top=15;
      this.singleBar1.series[0].type= 'line';
      this.singleBar1.series[0].itemStyle.normal.color='#5C8FF9';
      this.singleBar1.yAxis[0].axisLabel.formatter='{value}%'


      this.singleBar1.yAxis[0].splitLine.lineStyle.type= 'solid';
      this.singleBar1.series[0].areaStyle.opacity=1;
      this.singleBar1.series[0].areaStyle.color= new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: 'rgba(92,143,249,0.2)'
        },
        {
          offset: 1,
          color: 'rgba(92,143,249,0.2)'
        }
      ]);
      this.singleBar1.series[1].areaStyle.opacity=0.2;

      this.singleBar1.series[1].areaStyle.color='#EDF0F4';

      // this.singleBar1.series[1].areaStyle.color= new graphic.LinearGradient(0, 0, 0, 1, [
      //   {
      //     offset: 0,
      //     color: '#EDF0F4'
      //   },
      //   {
      //     offset: 1,
      //     color: '#cce0e900'
      //   }
      // ]);

      this.singleBar1.xAxis[0].data=[];
      this.singleBar1.series[0].data=[];
      this.singleBar1.series[1].data=[];
      let OnAmt=0;
      let OnAmtAgo=0;
      if(this.UserTrendData.length>0){
        if(this.AreaData.area==='月度费用'){
          Object.keys(this.UserTrendData).forEach((OnKey) => {

            if((moment(_time_now).format("YYYY")*1-1)===(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("YYYY")*1)){
              this.singleBar1.xAxis[0].data.push(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("MM")+'月');
              // OnAmtAgo=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].LYMTD_FYZE_RATIO:
              //   (this.IsChoiceOn===1)?this.UserTrendData[OnKey].LYMTD_RETURNS_RATIO: 
              //   (this.IsChoiceOn===2)?this.UserTrendData[OnKey].LYMTD_CMP_RATIO:
              //   (this.IsChoiceOn===3)?this.UserTrendData[OnKey].LYMTD_SERVICE_RATIO:
              //   (this.IsChoiceOn===4)?this.UserTrendData[OnKey].LYMTD_REF_RATIO:this.UserTrendData[OnKey].LYMTD_FYZE_RATIO;
              OnAmtAgo=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].MTD_FYZE_RATIO:
                (this.IsChoiceOn===1)?this.UserTrendData[OnKey].MTD_RETURNS_RATIO: 
                (this.IsChoiceOn===2)?this.UserTrendData[OnKey].MTD_CMP_RATIO:
                (this.IsChoiceOn===3)?this.UserTrendData[OnKey].MTD_SERVICE_RATIO:
                (this.IsChoiceOn===4)?this.UserTrendData[OnKey].MTD_REF_RATIO:this.UserTrendData[OnKey].MTD_FYZE_RATIO;
              this.singleBar1.series[1].data.push(OnAmtAgo*100);
            }else if((moment(_time_now).format("YYYY")*1)===(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("YYYY")*1)){
              OnAmt=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].MTD_FYZE_RATIO:
                (this.IsChoiceOn===1)?this.UserTrendData[OnKey].MTD_RETURNS_RATIO: 
                (this.IsChoiceOn===2)?this.UserTrendData[OnKey].MTD_CMP_RATIO:
                (this.IsChoiceOn===3)?this.UserTrendData[OnKey].MTD_SERVICE_RATIO:
                (this.IsChoiceOn===4)?this.UserTrendData[OnKey].MTD_REF_RATIO:this.UserTrendData[OnKey].MTD_FYZE_RATIO;      
              this.singleBar1.series[0].data.push(OnAmt*100);   
            }

          });

        }else{

          Object.keys(this.UserTrendData).forEach((OnKey) => {
            if((moment(_time_now).format("YYYY")*1-1)===(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("YYYY")*1)){
              this.singleBar1.xAxis[0].data.push(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("MM")+'月');              
              // OnAmtAgo=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].SUM_LYMTD_FYZE_RATIO:
              //   (this.IsChoiceOn===1)?this.UserTrendData[OnKey].SUM_LYMTD_RETURNS_RATIO: 
              //   (this.IsChoiceOn===2)?this.UserTrendData[OnKey].SUM_LYMTD_CMP_RATIO:
              //   (this.IsChoiceOn===3)?this.UserTrendData[OnKey].SUM_LYMTD_SERVICE_RATIO:
              //   (this.IsChoiceOn===4)?this.UserTrendData[OnKey].SUM_LYMTD_REF_RATIO:this.UserTrendData[OnKey].SUM_LYMTD_FYZE_RATIO;
              OnAmtAgo=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].SUM_MTD_FYZE_RATIO:
                (this.IsChoiceOn===1)?this.UserTrendData[OnKey].SUM_MTD_RETURNS_RATIO: 
                (this.IsChoiceOn===2)?this.UserTrendData[OnKey].SUM_MTD_CMP_RATIO:
                (this.IsChoiceOn===3)?this.UserTrendData[OnKey].SUM_MTD_SERVICE_RATIO:
                (this.IsChoiceOn===4)?this.UserTrendData[OnKey].SUM_MTD_REF_RATIO:this.UserTrendData[OnKey].SUM_MTD_FYZE_RATIO;
              this.singleBar1.series[1].data.push(OnAmtAgo*100);

            }else if((moment(_time_now).format("YYYY")*1)===(moment(this.UserTrendData[OnKey].TMONTH_DATE).format("YYYY")*1)){
              OnAmt=(this.IsChoiceOn===0)?this.UserTrendData[OnKey].SUM_MTD_FYZE_RATIO:
                (this.IsChoiceOn===1)?this.UserTrendData[OnKey].SUM_MTD_RETURNS_RATIO: 
                (this.IsChoiceOn===2)?this.UserTrendData[OnKey].SUM_MTD_CMP_RATIO:
                (this.IsChoiceOn===3)?this.UserTrendData[OnKey].SUM_MTD_SERVICE_RATIO:
                (this.IsChoiceOn===4)?this.UserTrendData[OnKey].SUM_MTD_REF_RATIO:this.UserTrendData[OnKey].SUM_MTD_FYZE_RATIO;
              this.singleBar1.series[0].data.push(OnAmt*100);
            }

          });

        }


        this.singleBar1.tooltip.formatter=((params)=>{
          let IsParm=[];
          if(params.length>1){
            IsParm='时间：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].value.toFixed(2)+'%'+'<br/>'+
              params[1].marker+params[1].value.toFixed(2)+'%';
          }else{
            IsParm='时间：'+params[0].axisValue+'<br/>'+params[0].marker+params[0].value.toFixed(2)+'%';
          }
          return IsParm;
        });

      }

    },


    IsTrendAndTab(){
      if(this.AreaData.area==='月度费用'){
        this.UserOnTableM();
      }else{
        this.UserOnTableY();
      }
    },

    UserOnTableM(){

      let CumSumY= this.Cumulative(
        {MTD_DEV_AMT:0,LYMTD_DEV_AMT:0,MTD_FYZE_AMT:0,LYMTD_FYZE_AMT:0,
        MTD_CMP_AMT:0,LYMTD_CMP_AMT:0,
        MTD_SERVICE_AMT:0,LYMTD_SERVICE_AMT:0,
        MTD_RETURNS_AMT:0,LYMTD_RETURNS_AMT:0,
        MTD_REF_AMT:0,LYMTD_REF_AMT:0,},
        this.UserTrendData.filter(_=>moment(_.TMONTH_DATE).format("YYYY")*1===(moment(_time_now).format("YYYY")*1))
      );

      // let CumSumM=CumSumY;  //月累计
      let CumSumM= this.Cumulative(
        {MTD_DEV_AMT:0,LYMTD_DEV_AMT:0,MTD_FYZE_AMT:0,LYMTD_FYZE_AMT:0,
        MTD_CMP_AMT:0,LYMTD_CMP_AMT:0,
        MTD_SERVICE_AMT:0,LYMTD_SERVICE_AMT:0,
        MTD_RETURNS_AMT:0,LYMTD_RETURNS_AMT:0,
        MTD_REF_AMT:0,LYMTD_REF_AMT:0,},
        this.UserTrendData.filter(_=>moment(_.TMONTH_DATE).format("YYYY")*1===(moment(_time_now).format("YYYY")*1-1))
      );

      let CumSumAgoM= this.Cumulative(
        {MTD_DEV_AMT:0,LYMTD_DEV_AMT:0,MTD_FYZE_AMT:0,LYMTD_FYZE_AMT:0,
        MTD_CMP_AMT:0,LYMTD_CMP_AMT:0,
        MTD_SERVICE_AMT:0,LYMTD_SERVICE_AMT:0,
        MTD_RETURNS_AMT:0,LYMTD_RETURNS_AMT:0,
        MTD_REF_AMT:0,LYMTD_REF_AMT:0,},
        this.UserTrendData.filter(_=>moment(_.TMONTH_DATE).format("YYYY")*1===(moment(_time_now).format("YYYY")*1-1)&&
          moment(_.TMONTH_DATE).format("MM")*1<=(moment(_time_now).format("MM")*1))
      );



      this.tableData.labelD=['年月','年累计','当期累计',];
      // this.tableData.tableD=[
      //   ['2022',],
      //   ['2021',],
      //   ['差额',],
      //   ['同比',],
      //   ['占发货比',],
      // ];

      this.tableData.tableD=[
        ['2022费用',],
        ['2021费用',],
        ['费用同比',],
        ['2022占发货比',],
        ['2021占发货比',],
        ['比率增幅',],
      ];

      if(this.IsChoiceOn===0){
        this.tableData.tableD[0].push(CumSumY.MTD_FYZE_AMT);
        this.tableData.tableD[0].push(CumSumY.MTD_FYZE_AMT);

        this.tableData.tableD[1].push(CumSumM.MTD_FYZE_AMT);
        this.tableData.tableD[1].push(CumSumAgoM.MTD_FYZE_AMT);

        // 差额 
        // this.tableData.tableD[2].push(CumSumY.MTD_FYZE_AMT-CumSumM.MTD_FYZE_AMT);
        // this.tableData.tableD[2].push(CumSumY.MTD_FYZE_AMT-CumSumAgoM.MTD_FYZE_AMT);

        // 费用同比
        this.tableData.tableD[2].push(((CumSumY.MTD_FYZE_AMT)/(CumSumM.MTD_FYZE_AMT))-1);
        this.tableData.tableD[2].push(((CumSumY.MTD_FYZE_AMT)/(CumSumAgoM.MTD_FYZE_AMT))-1);
        // 2022占发货比
        this.tableData.tableD[3].push((CumSumY.MTD_FYZE_AMT/CumSumY.MTD_DEV_AMT));
        this.tableData.tableD[3].push((CumSumY.MTD_FYZE_AMT/CumSumY.MTD_DEV_AMT));
        // 2021占发货比
        this.tableData.tableD[4].push((CumSumM.MTD_FYZE_AMT/CumSumM.MTD_DEV_AMT));
        this.tableData.tableD[4].push((CumSumAgoM.MTD_FYZE_AMT/CumSumAgoM.MTD_DEV_AMT));
        // 占发货比同比
        this.tableData.tableD[5].push(
          ((CumSumY.MTD_FYZE_AMT/CumSumY.MTD_DEV_AMT)/(CumSumM.MTD_FYZE_AMT/CumSumM.MTD_DEV_AMT))-1
        );
        this.tableData.tableD[5].push(
          ((CumSumY.MTD_FYZE_AMT/CumSumY.MTD_DEV_AMT)/(CumSumAgoM.MTD_FYZE_AMT/CumSumAgoM.MTD_DEV_AMT))-1
        );


      }else if(this.IsChoiceOn===1){
        this.tableData.tableD[0].push(CumSumY.MTD_RETURNS_AMT);
        this.tableData.tableD[0].push(CumSumY.MTD_RETURNS_AMT);

        this.tableData.tableD[1].push(CumSumM.MTD_RETURNS_AMT);
        this.tableData.tableD[1].push(CumSumAgoM.MTD_RETURNS_AMT);

        // 差额
        // this.tableData.tableD[2].push(CumSumY.MTD_RETURNS_AMT-CumSumM.MTD_RETURNS_AMT);
        // this.tableData.tableD[2].push(CumSumY.MTD_RETURNS_AMT-CumSumAgoM.MTD_RETURNS_AMT);

        // 费用同比
        this.tableData.tableD[2].push(((CumSumY.MTD_RETURNS_AMT)/(CumSumM.MTD_RETURNS_AMT))-1);
        this.tableData.tableD[2].push(((CumSumY.MTD_RETURNS_AMT)/(CumSumAgoM.MTD_RETURNS_AMT))-1);
        // 2022占发货比
        this.tableData.tableD[3].push((CumSumY.MTD_RETURNS_AMT/CumSumY.MTD_DEV_AMT));
        this.tableData.tableD[3].push((CumSumY.MTD_RETURNS_AMT/CumSumY.MTD_DEV_AMT));
        // 2021占发货比
        this.tableData.tableD[4].push((CumSumM.MTD_RETURNS_AMT/CumSumM.MTD_DEV_AMT));
        this.tableData.tableD[4].push((CumSumAgoM.MTD_RETURNS_AMT/CumSumAgoM.MTD_DEV_AMT));
        // 占发货比同比
        this.tableData.tableD[5].push(
          ((CumSumY.MTD_RETURNS_AMT/CumSumY.MTD_DEV_AMT)/(CumSumM.MTD_RETURNS_AMT/CumSumM.MTD_DEV_AMT))-1
        );
        this.tableData.tableD[5].push(
          ((CumSumY.MTD_RETURNS_AMT/CumSumY.MTD_DEV_AMT)/(CumSumAgoM.MTD_RETURNS_AMT/CumSumAgoM.MTD_DEV_AMT))-1
        );

        // this.tableData.tableD[3].push(((CumSumY.MTD_RETURNS_AMT/CumSumY.MTD_DEV_AMT)/(CumSumY.LYMTD_RETURNS_AMT/CumSumY.LYMTD_DEV_AMT))-1);
        // this.tableData.tableD[3].push(((CumSumM.MTD_RETURNS_AMT/CumSumM.MTD_DEV_AMT)/(CumSumM.LYMTD_RETURNS_AMT/CumSumM.LYMTD_DEV_AMT))-1);
        

      }else if(this.IsChoiceOn===2){
        this.tableData.tableD[0].push(CumSumY.MTD_CMP_AMT);
        this.tableData.tableD[0].push(CumSumY.MTD_CMP_AMT);

        this.tableData.tableD[1].push(CumSumM.MTD_CMP_AMT);
        this.tableData.tableD[1].push(CumSumAgoM.MTD_CMP_AMT);

        // 差额
        // this.tableData.tableD[2].push(CumSumY.MTD_CMP_AMT-CumSumM.MTD_CMP_AMT);
        // this.tableData.tableD[2].push(CumSumY.MTD_CMP_AMT-CumSumAgoM.MTD_CMP_AMT);

        // 费用同比
        this.tableData.tableD[2].push(((CumSumY.MTD_CMP_AMT)/(CumSumM.MTD_CMP_AMT))-1);
        this.tableData.tableD[2].push(((CumSumY.MTD_CMP_AMT)/(CumSumAgoM.MTD_CMP_AMT))-1);
        // 2022占发货比
        this.tableData.tableD[3].push((CumSumY.MTD_CMP_AMT/CumSumY.MTD_DEV_AMT));
        this.tableData.tableD[3].push((CumSumY.MTD_CMP_AMT/CumSumY.MTD_DEV_AMT));
        // 2021占发货比
        this.tableData.tableD[4].push((CumSumM.MTD_CMP_AMT/CumSumM.MTD_DEV_AMT));
        this.tableData.tableD[4].push((CumSumAgoM.MTD_CMP_AMT/CumSumAgoM.MTD_DEV_AMT));
        // 占发货比同比
        this.tableData.tableD[5].push(
          ((CumSumY.MTD_CMP_AMT/CumSumY.MTD_DEV_AMT)/(CumSumM.MTD_CMP_AMT/CumSumM.MTD_DEV_AMT))-1
        );
        this.tableData.tableD[5].push(
          ((CumSumY.MTD_CMP_AMT/CumSumY.MTD_DEV_AMT)/(CumSumAgoM.MTD_CMP_AMT/CumSumAgoM.MTD_DEV_AMT))-1
        );

        // this.tableData.tableD[3].push(((CumSumY.MTD_CMP_AMT/CumSumY.MTD_DEV_AMT)/(CumSumY.LYMTD_CMP_AMT/CumSumY.LYMTD_DEV_AMT))-1);
        // this.tableData.tableD[3].push(((CumSumM.MTD_CMP_AMT/CumSumM.MTD_DEV_AMT)/(CumSumM.LYMTD_CMP_AMT/CumSumM.LYMTD_DEV_AMT))-1);
      

      }else if(this.IsChoiceOn===3){
        this.tableData.tableD[0].push(CumSumY.MTD_SERVICE_AMT);
        this.tableData.tableD[0].push(CumSumY.MTD_SERVICE_AMT);

        this.tableData.tableD[1].push(CumSumM.MTD_SERVICE_AMT);
        this.tableData.tableD[1].push(CumSumAgoM.MTD_SERVICE_AMT);

        // 差额
        // this.tableData.tableD[2].push(CumSumY.MTD_SERVICE_AMT-CumSumM.MTD_SERVICE_AMT);
        // this.tableData.tableD[2].push(CumSumY.MTD_SERVICE_AMT-CumSumAgoM.MTD_SERVICE_AMT);

        // 费用同比
        this.tableData.tableD[2].push(((CumSumY.MTD_SERVICE_AMT)/(CumSumM.MTD_SERVICE_AMT))-1);
        this.tableData.tableD[2].push(((CumSumY.MTD_SERVICE_AMT)/(CumSumAgoM.MTD_SERVICE_AMT))-1);
        // 2022占发货比
        this.tableData.tableD[3].push((CumSumY.MTD_SERVICE_AMT/CumSumY.MTD_DEV_AMT));
        this.tableData.tableD[3].push((CumSumY.MTD_SERVICE_AMT/CumSumY.MTD_DEV_AMT));
        // 2021占发货比
        this.tableData.tableD[4].push((CumSumM.MTD_SERVICE_AMT/CumSumM.MTD_DEV_AMT));
        this.tableData.tableD[4].push((CumSumAgoM.MTD_SERVICE_AMT/CumSumAgoM.MTD_DEV_AMT));
        // 占发货比同比
        this.tableData.tableD[5].push(
          ((CumSumY.MTD_SERVICE_AMT/CumSumY.MTD_DEV_AMT)/(CumSumM.MTD_SERVICE_AMT/CumSumM.MTD_DEV_AMT))-1
        );
        this.tableData.tableD[5].push(
          ((CumSumY.MTD_SERVICE_AMT/CumSumY.MTD_DEV_AMT)/(CumSumAgoM.MTD_SERVICE_AMT/CumSumAgoM.MTD_DEV_AMT))-1
        );

        // this.tableData.tableD[3].push(((CumSumY.MTD_SERVICE_AMT/CumSumY.MTD_DEV_AMT)/(CumSumY.LYMTD_SERVICE_AMT/CumSumY.LYMTD_DEV_AMT))-1);
        // this.tableData.tableD[3].push(((CumSumM.MTD_SERVICE_AMT/CumSumM.MTD_DEV_AMT)/(CumSumM.LYMTD_SERVICE_AMT/CumSumM.LYMTD_DEV_AMT))-1);
      

      }else if(this.IsChoiceOn===4){
        this.tableData.tableD[0].push(CumSumY.MTD_REF_AMT);
        this.tableData.tableD[0].push(CumSumY.MTD_REF_AMT);

        this.tableData.tableD[1].push(CumSumM.MTD_REF_AMT);
        this.tableData.tableD[1].push(CumSumAgoM.MTD_REF_AMT);

        // 差额
        // this.tableData.tableD[2].push(CumSumY.MTD_REF_AMT-CumSumM.MTD_REF_AMT);
        // this.tableData.tableD[2].push(CumSumY.MTD_REF_AMT-CumSumAgoM.MTD_REF_AMT);

        // 费用同比
        this.tableData.tableD[2].push(((CumSumY.MTD_REF_AMT)/(CumSumM.MTD_REF_AMT))-1);
        this.tableData.tableD[2].push(((CumSumY.MTD_REF_AMT)/(CumSumAgoM.MTD_REF_AMT))-1);
        // 2022占发货比
        this.tableData.tableD[3].push((CumSumY.MTD_REF_AMT/CumSumY.MTD_DEV_AMT));
        this.tableData.tableD[3].push((CumSumY.MTD_REF_AMT/CumSumY.MTD_DEV_AMT));
        // 2021占发货比
        this.tableData.tableD[4].push((CumSumM.MTD_REF_AMT/CumSumM.MTD_DEV_AMT));
        this.tableData.tableD[4].push((CumSumAgoM.MTD_REF_AMT/CumSumAgoM.MTD_DEV_AMT));
        // 占发货比同比
        this.tableData.tableD[5].push(
          ((CumSumY.MTD_REF_AMT/CumSumY.MTD_DEV_AMT)/(CumSumM.MTD_REF_AMT/CumSumM.MTD_DEV_AMT))-1
        );
        this.tableData.tableD[5].push(
          ((CumSumY.MTD_REF_AMT/CumSumY.MTD_DEV_AMT)/(CumSumAgoM.MTD_REF_AMT/CumSumAgoM.MTD_DEV_AMT))-1
        );

        // this.tableData.tableD[3].push(((CumSumY.MTD_REF_AMT/CumSumY.MTD_DEV_AMT)/(CumSumY.LYMTD_REF_AMT/CumSumY.LYMTD_DEV_AMT))-1);
        // this.tableData.tableD[3].push(((CumSumM.MTD_REF_AMT/CumSumM.MTD_DEV_AMT)/(CumSumM.LYMTD_REF_AMT/CumSumM.LYMTD_DEV_AMT))-1);
      
      }

      let AmtData=this.UserTrendData.filter(_=>moment(_.TMONTH_DATE).format("YYYY")*1===(moment(_time_now).format("YYYY")*1));
      let AgoData=this.UserTrendData.filter(_=>moment(_.TMONTH_DATE).format("YYYY")*1===(moment(_time_now).format("YYYY")*1-1));

      Object.keys(AgoData).forEach((AgoKey) => {
        this.tableData.labelD.push(moment(AgoData[AgoKey].TMONTH_DATE).format("MM")+'月');
        this.tableData.tableD[0].push(0);
        if(this.IsChoiceOn===0){
          this.tableData.tableD[1].push(AgoData[AgoKey].MTD_FYZE_AMT);
        }else if(this.IsChoiceOn===1){
          this.tableData.tableD[1].push(AgoData[AgoKey].MTD_RETURNS_AMT);
        }else if(this.IsChoiceOn===2){
          this.tableData.tableD[1].push(AgoData[AgoKey].MTD_CMP_AMT);
        }else if(this.IsChoiceOn===3){
          this.tableData.tableD[1].push(AgoData[AgoKey].MTD_SERVICE_AMT);
        }else if(this.IsChoiceOn===4){
          this.tableData.tableD[1].push(AgoData[AgoKey].MTD_REF_AMT);      
        }
        this.tableData.tableD[2].push(0);
        this.tableData.tableD[3].push(0);
        // this.tableData.tableD[4].push(0);
        if(this.IsChoiceOn===0){
          this.tableData.tableD[4].push(AgoData[AgoKey].MTD_FYZE_RATIO);
        }else if(this.IsChoiceOn===1){
          this.tableData.tableD[4].push(AgoData[AgoKey].MTD_RETURNS_RATIO); 
        }else if(this.IsChoiceOn===2){
          this.tableData.tableD[4].push(AgoData[AgoKey].MTD_CMP_RATIO); 
        }else if(this.IsChoiceOn===3){
          this.tableData.tableD[4].push(AgoData[AgoKey].MTD_SERVICE_RATIO);
        }else if(this.IsChoiceOn===4){
          this.tableData.tableD[4].push(AgoData[AgoKey].MTD_REF_RATIO);      
        }

      });

      Object.keys(AmtData).forEach((AmtKey) => {
        if(this.IsChoiceOn===0){
          this.tableData.tableD[0].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_FYZE_AMT);
          // this.tableData.tableD[3].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_FYZE_RATIO_DIFF);
          // this.tableData.tableD[4].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_FYZE_RATIO);
          this.tableData.tableD[3].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_FYZE_RATIO);

        }else if(this.IsChoiceOn===1){
          this.tableData.tableD[0].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_RETURNS_AMT);
          // this.tableData.tableD[3].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_RETURNS_RATIO_DIFF);
          // this.tableData.tableD[4].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_RETURNS_RATIO);
          this.tableData.tableD[3].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_RETURNS_RATIO);

        }else if(this.IsChoiceOn===2){
          this.tableData.tableD[0].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_CMP_AMT);
          // this.tableData.tableD[3].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_CMP_RATIO_DIFF);
          // this.tableData.tableD[4].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_CMP_RATIO);
          this.tableData.tableD[3].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_CMP_RATIO);

        }else if(this.IsChoiceOn===3){
          this.tableData.tableD[0].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_SERVICE_AMT);
          // this.tableData.tableD[3].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_SERVICE_RATIO_DIFF);
          // this.tableData.tableD[4].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_SERVICE_RATIO);
          this.tableData.tableD[3].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_SERVICE_RATIO);

        }else if(this.IsChoiceOn===4){
          this.tableData.tableD[0].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_REF_AMT);
          // this.tableData.tableD[3].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_REF_RATIO_DIFF);
          // this.tableData.tableD[4].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_REF_RATIO);
          this.tableData.tableD[3].splice(AmtKey*1+3,1,AmtData[AmtKey].MTD_REF_RATIO);
        }
      });
      // 差值的算法
      Object.keys(this.tableData.tableD[0]).forEach((diffKey) => {
        if(diffKey>=3){
          this.tableData.tableD[2].splice(diffKey,1,
            // (this.tableData.tableD[0][diffKey])?this.tableData.tableD[0][diffKey]-this.tableData.tableD[1][diffKey]:0
            (this.tableData.tableD[0][diffKey])?(this.tableData.tableD[0][diffKey]/this.tableData.tableD[1][diffKey]-1):0
          );
          this.tableData.tableD[5].splice(diffKey,1,
            (this.tableData.tableD[0][diffKey])?(this.tableData.tableD[3][diffKey]/this.tableData.tableD[4][diffKey]-1):0
          );
        }
      });


    },

    UserOnTableY(){
      // this.tableData.labelD=['年月','年累计','当期累计',];
      this.tableData.labelD=['年月',];
      // this.tableData.tableD=[
      //   ['2022',],
      //   ['2021',],
      //   ['差额',],
      //   ['同比',],
      //   ['占发货比',],
      // ];
      this.tableData.tableD=[
        ['2022费用',],
        ['2021费用',],
        ['费用同比',],
        ['2022占发货比',],
        ['2021占发货比',],
        ['比率增幅',],
      ];

      let AmtData=this.UserTrendData.filter(_=>moment(_.TMONTH_DATE).format("YYYY")*1===(moment(_time_now).format("YYYY")*1));
      let AgoData=this.UserTrendData.filter(_=>moment(_.TMONTH_DATE).format("YYYY")*1===(moment(_time_now).format("YYYY")*1-1));

      Object.keys(AgoData).forEach((AgoKey) => {
        this.tableData.labelD.push(moment(AgoData[AgoKey].TMONTH_DATE).format("MM")+'月');
        this.tableData.tableD[0].push(0);
        if(this.IsChoiceOn===0){
          this.tableData.tableD[1].push(AgoData[AgoKey].SUM_MTD_FYZE_AMT);
        }else if(this.IsChoiceOn===1){
          this.tableData.tableD[1].push(AgoData[AgoKey].SUM_MTD_RETURNS_AMT);
        }else if(this.IsChoiceOn===2){
          this.tableData.tableD[1].push(AgoData[AgoKey].SUM_MTD_CMP_AMT);
        }else if(this.IsChoiceOn===3){
          this.tableData.tableD[1].push(AgoData[AgoKey].SUM_MTD_SERVICE_AMT);
        }else if(this.IsChoiceOn===4){
          this.tableData.tableD[1].push(AgoData[AgoKey].SUM_MTD_REF_AMT);      
        }
        this.tableData.tableD[2].push(0);
        this.tableData.tableD[3].push(0);
        // this.tableData.tableD[4].push(0);
        if(this.IsChoiceOn===0){
          this.tableData.tableD[4].push(AgoData[AgoKey].SUM_MTD_FYZE_RATIO); 
        }else if(this.IsChoiceOn===1){
          this.tableData.tableD[4].push(AgoData[AgoKey].SUM_MTD_RETURNS_RATIO); 
        }else if(this.IsChoiceOn===2){
          this.tableData.tableD[4].push(AgoData[AgoKey].SUM_MTD_CMP_RATIO); 
        }else if(this.IsChoiceOn===3){
          this.tableData.tableD[4].push(AgoData[AgoKey].SUM_MTD_SERVICE_RATIO);
        }else if(this.IsChoiceOn===4){
          this.tableData.tableD[4].push(AgoData[AgoKey].SUM_MTD_REF_RATIO);      
        }


      });

      Object.keys(AmtData).forEach((AmtKey) => {
        if(this.IsChoiceOn===0){
          this.tableData.tableD[0].splice(AmtKey*1+1,1,AmtData[AmtKey].SUM_MTD_FYZE_AMT);
          this.tableData.tableD[3].splice(AmtKey*1+1,1,AmtData[AmtKey].SUM_MTD_FYZE_RATIO);
        }else if(this.IsChoiceOn===1){
          this.tableData.tableD[0].splice(AmtKey*1+1,1,AmtData[AmtKey].SUM_MTD_RETURNS_AMT);
          this.tableData.tableD[3].splice(AmtKey*1+1,1,AmtData[AmtKey].SUM_MTD_RETURNS_RATIO);
        }else if(this.IsChoiceOn===2){
          this.tableData.tableD[0].splice(AmtKey*1+1,1,AmtData[AmtKey].SUM_MTD_CMP_AMT);
          this.tableData.tableD[3].splice(AmtKey*1+1,1,AmtData[AmtKey].SUM_MTD_CMP_RATIO);
        }else if(this.IsChoiceOn===3){
          this.tableData.tableD[0].splice(AmtKey*1+1,1,AmtData[AmtKey].SUM_MTD_SERVICE_AMT);
          this.tableData.tableD[3].splice(AmtKey*1+1,1,AmtData[AmtKey].SUM_MTD_SERVICE_RATIO);
        }else if(this.IsChoiceOn===4){
          this.tableData.tableD[0].splice(AmtKey*1+1,1,AmtData[AmtKey].SUM_MTD_REF_AMT);
          this.tableData.tableD[3].splice(AmtKey*1+1,1,AmtData[AmtKey].SUM_MTD_REF_RATIO);
        }
      });
      // 差值和同比的算法
      Object.keys(this.tableData.tableD[0]).forEach((diffKey) => {
        if(diffKey>=1){
          this.tableData.tableD[2].splice(diffKey,1,
            (this.tableData.tableD[0][diffKey])?(this.tableData.tableD[0][diffKey]/this.tableData.tableD[1][diffKey]-1):0
          );
          this.tableData.tableD[5].splice(diffKey,1,
            (this.tableData.tableD[0][diffKey])?(this.tableData.tableD[3][diffKey]/this.tableData.tableD[4][diffKey]-1):0
          );
        }
      });


    },





    Cumulative(UserJ,OnData){

      Object.keys(OnData).forEach((OnKey) => {
        Object.keys(UserJ).forEach((KeyName) => {
          UserJ[KeyName]+=OnData[OnKey][KeyName];
        });
      });

      return UserJ;

    }






  }


}
</script>

<style lang="scss" scoped>
.AfterSalesExpenses {
  height: calc(100%);
  padding-top: 10px;
  .Header {
    display: flex;
    justify-content: space-between;
    // height: 38px;
    height: 30px;
    padding-bottom: 10px;
    border-bottom: 0px solid #F0F0F0;
    .ChoiceCss{}
  }
  .Min {
    height: calc(100% - 38px);
    .AfterTop{
      display: flex;
      .AfterTopCon{
        flex: 1;
        border: 1px solid #F0F0F0;
        margin-top: 10px;
        /deep/ .TopIndex{
          .TopIndList{
            padding: 5px 15px;
          }
        }
      } 
      .AfterTopCon:hover{
        background: rgba(0, 0, 0, 0.03);
      }
      .TsTopInACent{
        background: rgba(0, 0, 0, 0.03);
      }
    }
    .AfterZhong{
      // height: calc((100% - 186px) / 2);
      // height: calc(100% - 176px - (28px * 7 + 5px));
      height: calc(100% - 176px - 20px);
      display: flex;
      // margin-top: 10px;
      margin-top: 30px;
      .AfterZhChartL{
        flex: 1;
        padding-right: 25px;
        height: calc(100%);
        .AfterZChar{
          height: calc(100% - 21px);
        }

      }
      .AfterZhChartR{
        flex: 1;
        padding-left: 25px;
        height: calc(100%);
        .AfterZChar{
          height: calc(100% - 21px);
        }
      }

    }
    .AfterDown{
      // height: calc((100% - 206px) / 2);
      height: calc( 28px * 7 + 5px);
      padding-top: 10px;
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
</style>