<template>
  <div class="GrossProfit">
    <div class="header">
      <Title class="title" :label="'采购毛利率'" />
      <div class="HeadTitle">
        <span class="MonthT">统计月份</span>
        <a-month-picker v-model="month" format="YYYY-MM" :disabledDate='disabledDate' valueFormat="YYYYMM" :allowClear="false" />            
      </div>

    </div>

    <div class="main">
      <div class="GPLeft">
        <div class="GPTop">
          <div class="GPTopTitle">整体概览</div>
          <div class="GPTopIndex">
            <ul class="GPTopIndUl">

              <div v-if="IndexShow" style="display: contents;">
                <li class="GPTopIndUlLi" v-for="(item_In,index_In) in IndexLeftDay" :key="index_In+'a'">
                  <div class="GPTInULTitle">{{item_In.title}}</div>
                  <div class="GPTInULNum">{{item_In.Tnum}}</div>
                </li>
              </div>
              
              <li class="GPTopIndUlLi" v-for="(item,index) in IndexLeftData" :key="index">
                <div class="GPTInULTitle">{{item.title}}</div>
                <div class="GPTInULNum">{{ HandVal(index,-1,item.Tnum) }}</div>

                <div class="GPTInULLabel" v-for="(item2,index2) in item.ContInfo" :key="index2">
                  <div class="GPTInULLabelT">{{item2.name}}</div>
                  <div class="GPTInULLabelN" :class="HandColor(index,index2,item2.value)">
                    {{HandVal(index,index2,item2.value)}}</div>
                  <div class="GPTInULLabelNUll"></div>
                </div>
              </li>

            </ul>
            <div style="clear: both"></div>
          </div>
        </div>

        <div :class="(IndexShow)?'GPDown':'GPDown_none'">
          <div class="GPDTitle">采购毛利率趋势</div>
          <div class="GPCharts">
            <v-chart
              ref="GPharBar"
              class="GPharBarCss"
              style="overflow: visible"
              :options="echartData"
              autoresize
            ></v-chart>
          </div>
        </div>
      </div>

      <div class="GPRight">
        <div class="GPRTop">
          <div class="GPRTopTitle">渠道概况</div>
          <div class="GPRTopIndex">
            <Indextcq v-bind="OnIndex" />
          </div>
        </div>

        <div class="GPRDown">
          <div class="GPRDTitle">
            <div class="GPRDTitleT">渠道明细</div>
            <div class="GPRDChoice">
              <span class="IMYSelAll" style="display: flex">
                <span class="titleName" style="line-height: 30px;padding-right: 10px;">分析维度</span>
                <a-radio-group v-model="MonthlyData.area" style="line-height: 30px">
                  <a-radio :value="item" v-for="item in MonthlyData.areaOption" :key="item">
                    {{ item }}
                  </a-radio>
                </a-radio-group>
              </span>
            </div>
          </div>

          <div :class="(MonthlyData.area==='线上店铺')?'GPRDTable':(MonthlyData.area==='线下渠道')?'GPRDTableDow':''" >  
            <Tabletcq v-bind="tableDataAll" />
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

// 做T+1处理开始
let _time_now2=new Date('2020-12-31');
//_time_now2=_time_now2.getTime()-(24*60*60*1000*365);
_time_now2=new Date(_time_now2);
// 做T+1处理结束
import Title from '../../components/Title'
import Indextcq from '../../components/Indextcq'
import Tabletcq from '../../components/tabletcq'
import moment from 'moment'
import { ThemeRiverChart } from 'echarts5/charts';
import { HandleNum } from '../../utils/tcq'
import orderBy from 'lodash/orderBy'
import echartStyle from "../../utils/echartStyle";

export default {
  name: 'GrossProfit',
  components: {
    Title,
    Indextcq,
    // Select,
    Tabletcq
  },
  data() {
    return {
      month: moment(_time_now).format('YYYYMM'),
      MonthlyData: {
        area: '线上店铺',
        areaOption: ['线上店铺', '线下渠道'],
      },

      tableDataAll:{},
      tableDataA:{
        index:'GrossProfitA',
        IsRankOn:true,
        IsRankDefa:{
          Boolean:true,
          index:2,
          value:'down'
        },
        labelSub:[],
        BodyTdHeight:null,
        labelD:[],
        tableD:[],
        IsTotalArr:{
          Boolean:true,
          arr:[]
        },
        IsPage:true,

        Pagination_SenOn: {
          show: true,
          page: 1,
          pageSize: 7,
          total: 24,
          pageSizeOptions:['7','20','30','50','100'],
        },


      },
      tableDataB:{
        index:'GrossProfitB',
        IsRankOn:true,
        IsMerge:false,
        labelSub:[],
        BodyTdHeight:null,
        labelD:[],
        tableD:[],
        IsTotalArr:{
          Boolean:true,
          arr:[]
        },
      },

      OnIndex: {
        OnType: 'GrossProfit',
        IndeWidth: 100,
        IndexData: [],
      },

      IndexLeftDay:[{
        title:'当日采购毛利率',
        Tnum: '--',
      },
      {
        title:'当日采购毛利额',
        Tnum: '--',
      }],
      IndexLeftData: [
        {
          title: '累计采购毛利率',
          Tnum: '--',
          ContInfo: [
            { name: '目标：', value: '--' },
            { name: '差值：', value: '--' },
          ],
        },
        {
          title: '累计采购毛利额',
          Tnum: '--',
          ContInfo: [
            { name: '目标：', value: '--' },
            { name: '差值：', value: '--' },
          ],
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
          icon: 'rect',
          // itemWidth: 16,
          // itemHeight: 2,
          ...echartStyle.legendLine,
          selectedMode: true,
          top: '2%',
          right: '2%'
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
                color: echartStyle.splitLine,
              },
            },
            axisLabel: {
              formatter: '{value}%',
              color: echartStyle.axisLabel,
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
      OnLineDat:null,
      OffLineDat:null,

    }
  },

  watch:{
    'month':{
      handler() {
        console.log("=======有变化！！！=======")
        console.log(this.month);
        this.GetViewData();
        this.GetDayTrend();
        this.IsChoiceTab();

        this.GetLeftIndex();
        if(this.month === moment(_time_now).format('YYYYMM')){
          this.IndexShow=true;
        }else{
          this.IndexShow=false;
        }

      }
    },
    'MonthlyData.area':{
      handler() {
        this.IsChoiceTab();
      }
    }

  },


  async created() {
    this.OnIndex.IndeWidth = 100
    this.OnIndex.OnType = 'GrossProfit'
    this.OnIndex.IndexData = [
      {
        title: '线上',
        Tnum: 0,
        ContInfo: [
          { name: '目标', value: 0 },
          { name: '差值', value: 0 },
        ],
      },
      {
        title: '线下',
        Tnum: 0,
        ContInfo: [
          { name: '目标', value: 0 },
          { name: '差值', value: 0 },
        ],
      },
      {
        title: '海外',
        Tnum: 0,
        ContInfo: [
          { name: '目标', value: 0 },
          { name: '差值', value: 0 },
        ],
      },
    ]

    this.tableDataA.labelSub=[
      {name:'序号',row:2,col:null} ,
      {name:'线上店铺',row:2,col:null} ,
      {name:'采购毛利额',row:null,col:4},
      {name:'-1',row:null,col:null},
      {name:'-1',row:null,col:null},
      {name:'-1',row:null,col:null},
      {name:'采购毛利率',row:null,col:4},
      {name:'-1',row:null,col:null},
      {name:'-1',row:null,col:null},
      {name:'-1',row:null,col:null},];
    this.tableDataA.labelD=['-1','-1','目标','达成',
      '达成率','差值','目标','达成','达成率',
      '差值',];

    this.tableDataA.tableD=[
      ['合计',200,300,400,500,600,700,800,900,1100],
      ['2022/3/4',200,300,400,500,600,700,800,900,1100],
      ['2022/3/3',200,300,400,500,600,700,800,900,1100],
      ['2022/3/2',200,300,400,500,600,700,800,900,1100],
      ['2022/3/1',200,300,400,500,600,700,800,900,1100],
      ['2022/2/28',200,300,400,500,600,700,800,900,1100],
      ['2022/2/27',200,300,400,500,600,700,800,900,1100],
    ]
    this.tableDataAll = this.tableDataA



    this.GetViewData();
    this.GetDayTrend();
    this.IsChoiceTab();

    this.GetLeftIndex();
    if(this.month === moment(_time_now).format('YYYYMM')){
      this.IndexShow=true;
    }else{
      this.IndexShow=false;
    }


  },
  methods: {

    async GetLeftIndex(){
      let query = {
        YYYYMM: this.month,  
      }
      let res = await this.$fetchSql('all_center', 'all_center_grs_qz_m',query);

      if(res.data.length>0){
        this.IndexLeftData=[
          {
            title: '累计采购毛利率',
            Tnum:  res.data[0].GROSS_RATE,
            ContInfo: [
              { name: '目标', value: res.data[0].GP_RATE_TG_LOCK }, 
              { name: '差值', value: res.data[0].DIFF_GROSS_RATE },
            ],
          },
          {
            title: '累计采购毛利额',
            Tnum: res.data[0].LCK_GROSS_PROFIT,
            ContInfo: [
              { name: '目标', value: res.data[0].GP_AMT_TG_LOCK },  
              { name: '差值', value: res.data[0].DIFF_GROSS_PROFIT },  
            ],
          },
        ]        
      }else{
        this.IndexLeftData=[
          {
            title: '累计采购毛利率',
            Tnum:  0,
            ContInfo: [
              { name: '目标', value: 0 }, 
              { name: '差值', value: 0 },
            ],
          },
          {
            title: '累计采购毛利额',
            Tnum: 0,
            ContInfo: [
              { name: '目标', value: 0 },  
              { name: '差值', value: 0 },  
            ],
          },
        ]   
      }

      if(this.month === moment(_time_now).format('YYYYMM')){

        let res_2 = await this.$fetchSql('all_center', 'all_center_grs_qz',query);
        this.IndexLeftDay=[];
        Object.keys(res_2.data).forEach((OnKey_Q) => {

          if(moment(res_2.data[OnKey_Q].MDATE).format('YYYY-MM-DD')===moment(_time_now).format('YYYY-MM-DD')){
            this.IndexLeftDay=[{
              title:'当日采购毛利率',
              Tnum: HandleNum('percent1',res_2.data[OnKey_Q].GROSS_RATE),
            },
            {
              title:'当日采购毛利额',
              Tnum: HandleNum('tenThousand',res_2.data[OnKey_Q].LCK_GROSS_PROFIT),
            }]
          }
        });

      }


    },

    HandVal(Cval, Rval, val,Sign){
      if(Cval===0){
        return HandleNum('percent1',val);
      }else if(Cval===1){
        return HandleNum('tenThousand',val);
      }
    },
    HandColor(Cval, Rval, val,Sign){
      if(Rval === 1) return (val)? (val>0)?'red':'green':''
    },


    async GetViewData(){
      let query = {
        YYYYMM: this.month,  
      }
      let res = await this.$fetchSql('all_center', 'all_center_channel',query);
      res.data.sort((a, b) => {
        return b['RANK_ON'] - a['RANK_ON']
      })

      console.log("======aaaaaaa=============")
      console.log(res.data)

      this.OnIndex.IndexData=[];
      if(res.data.length>0){
        Object.keys(res.data).forEach((OnKey) => {
          if(res.data[OnKey].SHOP_CHANNEL.indexOf('线上')>-1){
            this.OnIndex.IndexData.push({
              title: '线上',
              Tnum: res.data[OnKey].GROSS_RATE,  
              ContInfo: [
                { name: '目标', value: res.data[OnKey].GP_RATE_TG_LOCK },  
                { name: '差值', value: res.data[OnKey].DIFF_GROSS_RATE },  
              ],
            });
          }else if(res.data[OnKey].SHOP_CHANNEL.indexOf('线下')>-1){
            this.OnIndex.IndexData.push({
              title: '线下',
              Tnum: res.data[OnKey].GROSS_RATE,  
              ContInfo: [
                { name: '目标', value: res.data[OnKey].GP_RATE_TG_LOCK },  
                { name: '差值', value: res.data[OnKey].DIFF_GROSS_RATE },  
              ],
            });
          }else if(res.data[OnKey].SHOP_CHANNEL.indexOf('海外')>-1){
            this.OnIndex.IndexData.push({
              title: '海外',
              Tnum: res.data[OnKey].GROSS_RATE,  
              ContInfo: [
                { name: '目标', value: res.data[OnKey].GP_RATE_TG_LOCK },  
                { name: '差值', value: res.data[OnKey].DIFF_GROSS_RATE },  
              ],
            });
          }
        });
      }else{
        this.OnIndex.IndexData = [
          {
            title: '线上',
            Tnum: 0,
            ContInfo: [
              { name: '目标', value: 0 },
              { name: '差值', value: 0 },
            ],
          },
          {
            title: '线下',
            Tnum: 0,
            ContInfo: [
              { name: '目标', value: 0 },
              { name: '差值', value: 0 },
            ],
          },
          {
            title: '海外',
            Tnum: 0,
            ContInfo: [
              { name: '目标', value: 0 },
              { name: '差值', value: 0 },
            ],
          },
        ]
      }



    },

    async GetDayTrend(){
      let query = {
        YYYYMM: this.month,  
      }
      let res = await this.$fetchSql('all_center', 'all_center_grs_qz',query);
      res.data.sort((a,b)=>{
        return moment(a['MDATE']) - moment(b['MDATE'])
      });
      let MonthD=[];
      let AmtD=[]; 
      let TagD=[]; 
      Object.keys(res.data).forEach((OnKey) => {
        MonthD.push(moment(res.data[OnKey].MDATE).format('DD'));
        // AmtD.push((res.data[OnKey].RATE_GROSS_RATE*100).toFixed(2));
        AmtD.push((res.data[OnKey].GROSS_RATE*100).toFixed(1));   
        TagD.push((res.data[OnKey].GP_RATE_TG_LOCK*100).toFixed(1));
      });

      // 每次都需要清除画布
      this.$refs.GPharBar.$refs.echarts.clear();

      this.echartData.xAxis[0].data=MonthD;
      this.echartData.series[0].name='达成';
      this.echartData.series[0].data=AmtD;
      this.echartData.series[1].name='目标';
      this.echartData.series[1].data=TagD;

      this.echartData.tooltip.formatter=((params)=>{
        let str = `${params[0].axisValue}日<br/>`
        params.forEach(item => {
          str += `${item.marker + item.seriesName}：${item.value}%<br/>`
        })
        return str
        // let SetValue='统计日期：'+params[0].axisValue+'日<br/>'+
        //   params[0].marker+'达成：'+params[0].value+'%<br/>'+
        //   params[1].marker+'目标：'+params[1].value+'%'
        // return SetValue
      });

    },

    IsChoiceTab(){

      if(this.MonthlyData.area === '线上店铺'){
        this.GetOnLDat();
      }else if(this.MonthlyData.area === '线下渠道'){
        this.GetOffLDat();
      }

    },

    async GetOnLDat(){
      let query = {
        YYYYMM: this.month,  
      }
      let res = await this.$fetchSql('all_center', 'all_center_xs_shop',query);
      res.data.sort((a,b)=>{return (b['GP_AMT_TG_LOCK']) - (a['GP_AMT_TG_LOCK'])});
      let ArrayD=res.data;
      console.log("=======线上=======") 
      console.log(res.data);
      // this.tableDataA.index='GrossProfitA';
      this.tableDataA.IsRankOn=true;
      this.tableDataA.labelSub=[
        {name:'序号',row:2,col:null} ,
        {name:'线上店铺',row:2,col:null} ,
        {name:'采购毛利额',row:null,col:4},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'采购毛利率',row:null,col:4},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},];
      this.tableDataA.labelD=['-1','-1','目标RANK','实际RANK',
        '达成率RANK','差值RANK','目标RANK','实际RANK','达成率RANK',
        '差值RANK',];
      this.tableDataA.tableD=[];
      this.tableDataA.IsTotalArr.arr=[];

      if(ArrayD.length>0){
        ArrayD = ArrayD.filter(_=>_.SHOP_CHANNEL!=='合计');
        let sum = res.data.filter(_ => _.SHOP_CHANNEL === '合计')
        // ArrayD.unshift(sum[0])
        if(ArrayD){
          Object.keys(ArrayD).forEach((OnKey) => {
            this.tableDataA.tableD.push([
              // (OnKey == 0)?'':OnKey,
              OnKey*1+1,
              ArrayD[OnKey].SHOP_CHANNEL, 

              ArrayD[OnKey].GP_AMT_TG_LOCK, 
              ArrayD[OnKey].LCK_GROSS_PROFIT,
              
              ArrayD[OnKey].RATE_GROSS_PROFIT,
              ArrayD[OnKey].DIFF_GROSS_PROFIT,

              ArrayD[OnKey].GP_RATE_TG_LOCK, 
              ArrayD[OnKey].GROSS_RATE, 
              
              ArrayD[OnKey].RATE_GROSS_RATE, 
              ArrayD[OnKey].DIFF_GROSS_RATE,
            ]);
          });
        }
        if(sum.length>0){
          this.tableDataA.IsTotalArr.arr.push([
            '--',
            sum[0].SHOP_CHANNEL, 
            sum[0].GP_AMT_TG_LOCK, 
            sum[0].LCK_GROSS_PROFIT,
            sum[0].RATE_GROSS_PROFIT,
            sum[0].DIFF_GROSS_PROFIT,
            sum[0].GP_RATE_TG_LOCK, 
            sum[0].GROSS_RATE,  
            sum[0].RATE_GROSS_RATE, 
            sum[0].DIFF_GROSS_RATE,
          ])
        }
        // console.log(this.tableDataA.IsTotalArr.arr);
        // console.log(sum.length)
        // console.log(sum);

      }else{
        this.tableDataA.tableD=[
          ['--',0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0],
        ]
      }
      // console.log("===============!!!!!!!!!!!!!======");
      // console.log(this.tableDataA.tableD.length);
      this.tableDataA.Pagination_SenOn.page=1;
      // this.tableDataA.Pagination_SenOn.pageSize=6;
      this.tableDataA.Pagination_SenOn.total=this.tableDataA.tableD.length;

      this.tableDataAll = this.tableDataA;

    },
    async GetOffLDat(){
      let query = {
        YYYYMM: this.month,  
      }
      let res = await this.$fetchSql('all_center', 'all_center_off_line',query);
      // res.data.sort((a,b)=>{return (a['RANK_ON']) - (b['RANK_ON'])});
      // res.data.sort((a,b)=>{return (a['RANK_ONZH']) - (b['RANK_ONZH'])});
      let ArrayD=orderBy(res.data,['RANK_ONZH','GP_AMT_TG_LOCK'],['asc','desc']);
      // let ArrayD=res.data;
      console.log("=======线下=======")
      // console.log(res.data);
      // this.tableDataB.index='GrossProfitB';

      // 处理合并单元格的
      let SelectOnT = Object.freeze(Array.from(new Set(res.data.map((_) => _.PRODUCT_CATE))));
      this.UserWName=[];
      Object.keys(SelectOnT).forEach((Type) => {
        this.UserWName.push({
          value:res.data.filter((_)=>_["PRODUCT_CATE"]==SelectOnT[Type]).length,
          name:SelectOnT[Type]
        })
      });
      // console.log(SelectOnT)
      // console.log(this.UserWName);
      // 处理合并单元格的

      this.tableDataB.IsMerge=true;
      let ISLast='';
      this.tableDataB.IsRankOn=false;
      this.tableDataB.labelSub=[
        {name:'序号',row:2,col:null} ,
        {name:'主营类目',row:2,col:null} ,
        {name:'渠道细分',row:2,col:null} ,
        {name:'采购毛利额',row:null,col:4},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'采购毛利率',row:null,col:4},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},
        {name:'-1',row:null,col:null},];
      this.tableDataB.labelD=['-1','-1','-1','目标','实际',
        '达成率','差值','目标','实际','达成率',
        '差值',];
      this.tableDataB.tableD=[];
      this.tableDataB.IsTotalArr.arr=[];

      if(ArrayD.length>0){
        ArrayD = ArrayD.filter(_=>_.PRODUCT_CATE!=='合计');
        let sum = res.data.filter(_ => _.PRODUCT_CATE === '合计')
        // ArrayD.unshift(sum[0])

        if(ArrayD){
          Object.keys(ArrayD).forEach((OnKey) => {

            // console.log(this.UserWName.find((_)=>_.name===ArrayD[OnKey].PRODUCT_CATE).value)

            this.tableDataB.tableD.push([
              {value:OnKey*1+1},
              {value:(ArrayD[OnKey].PRODUCT_CATE!==ISLast)?
                ArrayD[OnKey].PRODUCT_CATE:'-1',
                row:this.UserWName.find((_)=>_.name===ArrayD[OnKey].PRODUCT_CATE).value,
                col:null},
              {value:(ArrayD[OnKey].SHOP_CHANNEL==='合计')?'--':ArrayD[OnKey].SHOP_CHANNEL}, 
              {value:ArrayD[OnKey].GP_AMT_TG_LOCK},
              {value:ArrayD[OnKey].LCK_GROSS_PROFIT},
              {value:ArrayD[OnKey].RATE_GROSS_PROFIT},
              {value:ArrayD[OnKey].DIFF_GROSS_PROFIT},

              {value:ArrayD[OnKey].GP_RATE_TG_LOCK},
              {value:ArrayD[OnKey].GROSS_RATE},

              {value:ArrayD[OnKey].RATE_GROSS_RATE},
              {value:ArrayD[OnKey].DIFF_GROSS_RATE},

            ])
            ISLast=ArrayD[OnKey].PRODUCT_CATE;
          });

        }
        if(sum.length>0){
          this.tableDataB.IsTotalArr.arr.push([
            '--',
            sum[0].PRODUCT_CATE, 
            (sum[0].SHOP_CHANNEL==='合计')?'--':sum[0].SHOP_CHANNEL, 
            sum[0].GP_AMT_TG_LOCK,
            sum[0].LCK_GROSS_PROFIT,
            sum[0].RATE_GROSS_PROFIT,
            sum[0].DIFF_GROSS_PROFIT, 
            sum[0].GP_RATE_TG_LOCK,  
            sum[0].GROSS_RATE, 
            sum[0].RATE_GROSS_RATE,
            sum[0].DIFF_GROSS_RATE,
          ])
        }

      }else{
        this.tableDataB.tableD=[
          ['--',0,0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0,0],
          ['--',0,0,0,0,0,0,0,0,0,0],
        ]
      }




      this.tableDataAll = this.tableDataB;


    },

    disabledDate(current) {
      return current && (current < moment(_time_now2)||current > moment(_time_now))
    },


  }



}
</script>

<style lang="scss" scoped>
.GrossProfit {
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
  .main {
    height: calc(100% - 38px);
    display: flex;
    .GPLeft {
      flex: 45;
      .GPTop {
        .GPTopTitle {
          padding-top: 15px;

          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #000000;
          line-height: 20px;


        }
        .GPTopIndex {
          ul.GPTopIndUl {
            list-style: none;
            padding: 0px;
            margin: 0px;
            li.GPTopIndUlLi {
              list-style: none;
              float: left;
              width: 50%;
              padding-top: 18px;
              div.GPTInULTitle {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #666666;
                line-height: 22px;
              }
              div.GPTInULNum {
                font-size: 20px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 600;
                color: #333333;
                line-height: 24px;
                padding-top: 10px;
              }
              div.GPTInULLabel {
                display: flex;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 18px;
                .GPTInULLabelT {
                  flex: 10;
                }
                .GPTInULLabelN {
                  flex: 25;
                  text-align: right;
                }
                .GPTInULLabelNUll{
                  flex: 65;
                }
                .red {
                  color: #ff5953;
                }
                .green {
                  color: #00a854;
                }
              }
              div.GPTInULLabel:nth-child(2n-1) {
                padding-top: 10px;
              }
            }
          }
        }
      }
      .GPDown {
        padding-top: 18px;
        height: calc(100% - 229px - 10px);
        .GPDTitle {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          // font-weight: 400;
          // font-weight: bold;
          color: #000000;
          line-height: 20px;
        }
        .GPCharts {
          padding-top: 18px;
          height: calc(100% - 20px);
        }
      }

      .GPDown_none {
        padding-top: 18px;
        height: calc(100% - 155px - 10px);
        .GPDTitle {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
        }
        .GPCharts {
          padding-top: 18px;
          height: calc(100% - 20px);
        }
      }

    }
    .GPRight {
      flex: 55;
      height: 100%;
      padding-left: 20px;
      .GPRTop {
        .GPRTopTitle {
          padding-top: 15px;
          font-size: 14px;
          line-height: 20px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: bold;
          color: #000000;
        
        }
        .GPRTopIndex{
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(1){
            flex:15;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(2){
            flex:25;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(3){
            flex:60;
          } 

        }
      }

      .GPRDown {
        height: calc(100% - 176px);
        .GPRDTitle {
          display: flex;
          justify-content: space-between;
          .GPRDTitleT {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            // font-weight: bold;
            // color: #666666;
            color: #000000;
            line-height: 20px;
          }
          .GPRDChoice {
            .IMYSelAll {
              .titleName {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #000000;
                line-height: 18px;
              }
            }
          }
        }
        .GPRDTable{
          height: calc(100% - 30px - 15px);
          /deep/ .tableltbody_sub{
            table tbody{
              tr:nth-child(1){
                // font-weight: bold;
              }
            }
          }
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Title{
            width: 50px;
            text-align: center;
          }
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.ConSub1{
            width: 150px;
            padding-left: 10px;
            text-align: left;
          }
          /deep/ .TRORCLeftTUser2 tbody tr td.Title{
            width: 50px;
            text-align: center;
            padding-right: 0px;
          }
          /deep/ .TRORCLeftTUser2 tbody tr td.ConBoy1{
            width: 150px;
            padding-left: 10px;
            text-align: left;
          }
          /deep/ .TRORCLeftTUser2 tbody tr td{
            text-align: right;
            padding-right: 10px;
          }
          /deep/ .TRORCLeftTUser2 .IsRank td.OnR .IsRankAllCss{
            justify-content: flex-end;
            padding-right: 10px;
          }
          /deep/ .tablelist .tablelthead .TRORCLeftTUser2 tr.IsTotal td.Title{
            text-align: center;
            padding-right: 0px;
          }
          /deep/ .tablelist .tablelthead .TRORCLeftTUser2 tr.IsTotal td.Con1{
            padding-left: 10px;
            text-align: left;
          }
          /deep/ .tablelist .tablelthead .TRORCLeftTUser2 tr.IsTotal td{
            padding-right: 10px;
            text-align: right;
          }
        }
        .GPRDTableDow{
          height: calc(100% - 30px - 15px);
          /deep/ .tableltbody_sub{
            table tbody{
              tr:nth-child(1){
                // font-weight: bold;
              }
            }
          }
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Title{
            width: 50px;
          }
          /deep/ .TRORCLeftTUser2 tbody tr td.Title{
            width: 50px;
          }
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr.labelSubCss div td{
            text-align:center;
          }
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.ConSub1,
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.ConSub2{
            padding-left: 10px;
            text-align: left;
          }
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Con1, 
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Con2{
            padding-left: 10px;
            text-align: left;
          }
          /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td{
            padding-right: 10px;
            text-align: right;
          }
          /deep/ .TRORCLeftTUser2 tbody tr td.ConBoy1,
          /deep/ .TRORCLeftTUser2 tbody tr td.ConBoy2{
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