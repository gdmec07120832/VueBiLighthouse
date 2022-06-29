<template>
  <div class="OrderFlow">
    <div class="header">
      <Title class="title" :label="'订单分布'" /> 
    </div>
    <div class="OrderFlowMin">
      <div class="leftBox">
        <div class="title_1" style="height: 30px;line-height: 30px">发货达成</div>
        <!-- <TableRow v-bind.sync="table" class="mt10"/> -->
        <div class="TableLeft">
          <Tabletcq v-bind="tableData" @OnParm='ParmData' />
        </div>
        <div class="title_2 mt20" style="margin-top: 10px;">待处理情况</div>
        <v-chart ref="singleBar" class="CHartBarCss" style="overflow: visible;height: calc(50% - 130px)" :options="singleBar" autoresize/>
        <div class="title_2 mt10" style="padding-top: 13px;">当天累计处理情况</div>
        <v-chart ref="singleBar1" class="CHartBarCss1" style="overflow: visible;height: calc(50% - 130px)" :options="singleBar1" autoresize/>
      </div>
        <!-- <div style="width: 64px"></div> -->
      <div class="rightBox" ref="rightBox">
        <div class="select" style="">
          <div class="SelTitle">待货审订单分布</div>
          <div class="SelCont">
            <virtual-select
                style="width: 180px;margin-right: 20px"
                v-model="SelectsDat[0].value"
                :label="SelectsDat[0].label"
                :options="SelectsDat[0].options.map((_) => ({ label: _ }))"
                :allowShowClear="false"
            ></virtual-select>
            <virtual-select
                style="width: 180px;margin-right: 0"
                v-model="SelectsDat[1].value"
                :label="SelectsDat[1].label"
                :options="SelectsDat[1].options.map((_) => ({ label: _ }))"
                :allowShowClear="false"
            ></virtual-select>            
          </div>

        </div>

        <div class="RigIndex">
          <div class="RigIndexOn" v-for="(item,index) in OnIndex" :key="index" 
            @click="IsChoiceFun(index)" :class="(IsChoiceOn===index)?'TsTopInACent':''">
            <Indextcq v-bind="item" />
          </div>
        </div>

        <div class="RigIndDow">
          <div class="title_1" style="margin-top: 10px;display: flex;justify-content: space-between;">
            <div>承诺时间分布</div>
            <div class="ChoiceCss">
              <span class="SelAll" style="display: flex">
                <a-radio-group v-model="AreaData.area" style="line-height: 30px;">
                  <a-radio :value="item" v-for="item in AreaData.areaOption" :key="item" style="font-size: 12px;">
                    {{ item }}
                  </a-radio>
                </a-radio-group>
              </span>
            </div>
          </div>

          <div class="RigIndDowOn">
            <Indextcq v-bind="RigIndDat" />
          </div>
        </div>

        <div class="TableRight">
          <Tabletcq v-bind="TableDatRig" />
        </div>

        
      </div>
    </div>




  </div>
</template>

<script>
import Title from '../../components/Title'
import Tabletcq from '../../components/tabletcq'
import Indextcq from '../../components/Indextcq'
import { ChartData,HandleNum } from '../../utils/tcq'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelectV3'

export default {
  name: 'OrderDistributionV2',
  components: {
    Title,
    Tabletcq,
    Indextcq,
    VirtualSelect
  },
  data () {
    return{
      AreaData:{
        area:'待货审',
        areaOption:['待货审','可货审']
      },
      singleBar:{
      },
      singleBar1:{},
      tableData:{
        index:'OrderDistributionV2_UP',
        isparm:true,
        labelD:[],
        tableD:[],
      },
      TableDatRig:{
        index:'OrderDistributionV2_Dow',
        labelD:[],
        tableD:[],
      },

      OnIndex:[],
      IsChoiceOn:0,
      IsChangeNam:{
        IsVal:'合计'
      },
      RigIndDat:{
        OnType:'',
        IndeWidth:100,
        IndexData:[],
      },
      SelectsDat: [
        {
          label: '渠道分类',
          value: ['全部'],
          options: ['全部', '线上渠道', '线下渠道', '海外渠道', '其它'],
        },
        {
          label: '渠道细分',
          value: ['全部'],
          options: ['全部', '线上平台', '线上外包', '线下经销', '线下直营', '线下定制', '线下拎包', '其它'],
        },
      ],
      allOptions:[],


    }
  },

  watch: {
    'SelectsDat.0.value': {
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
                  this.SelectsDat[0].value = ['全部']
              }
          }
          else if(!diff.includes('全部') && val.length > oval.length){
              this.SelectsDat[0].value = this.SelectsDat[0].value.filter(_ => _ !== '全部')
          }
          if(val.length === 0){
              this.SelectsDat[0].value = ['全部']
          }
          if(val.toString() === '全部'){
              this.SelectsDat[1].options = Array.from(new Set(this.allOptions.map(_ => _.CHNL_TYPE)))
          }
          else{
              this.SelectsDat[1].options = Array.from(new Set(this.allOptions.filter(_ => val.includes(_.CHNL_NAME)).map(_ => _.CHNL_TYPE)))
          }

          this.GetIndexRig();
          this.GetIndexRigZh();
          this.GetTableRigZh();
          // console.log("-----------变化了！！！---");
          // console.log(this.SelectsDat[0].value);

      }
    },
    'SelectsDat.1.value': {
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
                  this.SelectsDat[1].value = ['全部']
              }
          }
          else if(!diff.includes('全部') && val.length > oval.length){
              this.SelectsDat[1].value = this.SelectsDat[1].value.filter(_ => _ !== '全部')
          }
          if(val.length === 0){
              this.SelectsDat[1].value = ['全部']
          }

          this.GetIndexRig();
          this.GetIndexRigZh();
          this.GetTableRigZh();

      }
    },
    'IsChangeNam.IsVal':{
      handler(){
        this.GetTrendLeft();
      }
    },
    'IsChoiceOn':{
      handler(){
        this.GetIndexRigZh();
        this.GetTableRigZh();
      }
    },
    'AreaData.area':{
      handler(){
        this.GetIndexRigZh();
      }
    }
 

  },

  async created() {

    this.singleBar= ChartData();
    this.singleBar1=ChartData();
    this.singleBar.xAxis[0].data=[];
    this.singleBar.series[0].data=[];
    this.singleBar.series[1].data=[];
    this.singleBar.yAxis[0].axisTick.show = false;
    this.singleBar.yAxis[0].axisLine.show = false;
    this.singleBar.yAxis[0].axisLabel.show = false;
    this.singleBar.yAxis[0].splitLine.show = false;
    this.singleBar.series[0].label.show = true;
    this.singleBar.series[0].label.position= 'top';
    this.singleBar.series[0].itemStyle.normal.color= '#5b8ff9';
    this.singleBar.grid.top=25;


    this.singleBar1.xAxis[0].data=[];
    this.singleBar1.series[0].data=[];
    this.singleBar1.series[1].data=[];
    this.singleBar1.yAxis[0].axisTick.show = false;
    this.singleBar1.yAxis[0].axisLine.show = false;
    this.singleBar1.yAxis[0].axisLabel.show = false;
    this.singleBar1.yAxis[0].splitLine.show = false;
    this.singleBar1.series[0].label.show = true;
    this.singleBar1.series[0].label.position= 'top';
    this.singleBar1.series[0].itemStyle.normal.color= '#5b8ff9';
    this.singleBar1.grid.top=25;


    this.tableData.labelD=['渠道','月目标','本月累计发货','日累计达成','今日发货','剩余日均','今天计划发货'];
    this.tableData.tableD=[
      ['合计',0,0,0,0,0,0],
      ['线上渠道',0,0,0,0,0,0],
      ['线下渠道',0,0,0,0,0,0],
      ['海外渠道',0,0,0,0,0,0],
    ]

    this.OnIndex=[
      {OnType:'OrderDistributionV2',IndeWidth:25,sign:0, IndexData:[
        {title:'总待货审订单金额',Tnum:0,
        ContInfo:[{name:'占比',value:0},{name:'线上占比',value:0},{name:'线下占比',value:0},
        {name:'海外占比',value:0}]},
      ]},
      {OnType:'OrderDistributionV2',IndeWidth:25,sign:1,IndexData:[
        {title:'承诺待发货金额(已剔除待通知)',Tnum:0,remarks:false,
        ContInfo:[{name:'占比',value:0},{name:'线上占比',value:0},{name:'线下占比',value:0},
        {name:'海外占比',value:0}]},
      ]},
      {OnType:'OrderDistributionV2',IndeWidth:25,sign:2,IndexData:[
        {title:'待通知发货金额',Tnum:0,
        ContInfo:[{name:'占比',value:0},{name:'线上占比',value:0},{name:'线下占比',value:0},
        {name:'海外占比',value:0}]},
      ]},
    ];

    this.RigIndDat.IndeWidth=100;
    this.RigIndDat.OnType='OrderDistributionV2_T'
    this.RigIndDat.IndexData=[
      {title:'到期待货审',Tnum:0,
        ContInfo:[{name:'占比',value:0},]},

      {title:'按承诺本月发货',Tnum:0,
        ContInfo:[{name:'占比',value:0},]},

      {title:'承诺次月发货',Tnum:0,
        ContInfo:[{name:'占比',value:0},]},

      {title:'承诺次月后发货',Tnum:0,
        ContInfo:[{name:'占比',value:0},]},
    ];

    this.TableDatRig.labelD=['时间区间','待货审业绩','金额占比','订单匹配率（总仓）','订单匹配率（总仓&供应仓）','可货审金额',];
    this.TableDatRig.tableD=[
      ['汇总',0,0,0,0,0,],
      ['到期订单',0,0,0,0,0,],
      ['0-14天',0,0,0,0,0,],
      ['15-28天',0,0,0,0,0,],
      ['4周以上',0,0,0,0,0,],
    ];


    this.getOptions();
    this.GetTableLeft();
    this.GetTrendLeft();
    this.GetIndexRig();
    this.GetIndexRigZh();
    this.GetTableRigZh();

    
  },

  methods: {

    ParmData(data){
      console.log("======f返回的数据是！！！=======")
      console.log(data);
      this.IsChangeNam.IsVal=data; 
    },
    IsChoiceFun(Num){
      this.IsChoiceOn=Num;
      // this.IsChangeNam.IsVal = this.IsChangeNam.IsArray[Num];
      console.log("111111111111111111111111111111111");
      console.log(this.IsChoiceOn);
    },

    // 待货审订单筛选项
    async getOptions(){
        let res = await this.$fetchSql('all_center', 'all_center_send_spot_src')
        this.allOptions = res.data.concat()
        let sortObj = {
            '全部': 0,
            '线上': 1,
            '线下': 2,
            '海外': 3,
            '其它': 4
        }
        let sortObj_1 = {
            '全部': 0,
            '线上平台': 1,
            '线上外包': 2,
            '线下直营': 3,
            '线下经销': 4,
            '线下家装': 5,
            '线下定制': 6,
            '线下拎包': 7,
            '海外B2B': 8,
            '其它': 9
        }
        res.data.sort((a, b) => {
            let a_i = 5, b_i = 5
            for(let key in sortObj){
                if(a.CHNL_NAME.indexOf(key) > -1) a_i = sortObj[key]
                if(b.CHNL_NAME.indexOf(key) > -1) b_i = sortObj[key]
            }
            return a_i - b_i
        })
        this.SelectsDat[0].options = await Array.from(new Set(res.data.map(_ => _.CHNL_NAME)))
        this.SelectsDat[0].options.unshift('全部')
        this.SelectsDat[0].value = ['全部']
        res.data.sort((a, b) => {
            let a_i = 10, b_i = 10
            for(let key in sortObj_1){
                if(a.CHNL_TYPE.indexOf(key) > -1) a_i = sortObj_1[key]
                if(b.CHNL_TYPE.indexOf(key) > -1) b_i = sortObj_1[key]
            }
            return a_i - b_i
        })
        this.SelectsDat[1].options = await Array.from(new Set(res.data.map(_ => _.CHNL_TYPE)))
        this.SelectsDat[1].options.unshift('全部')
        this.SelectsDat[1].value = ['全部']
    },
    // 发货达成 左上
    async GetTableLeft(){
        // let res = await this.$fetchSql('all_center', 'all_center_send_order_reach');
        let res = await this.$fetchSql('kpi_report', 'ord_send_reach');
        // console.log("========aaaaaaaa========"); 
        // console.log(res.data);
        this.tableData.labelD=['渠道','月目标','本月累计发货','日累计达成','今日发货','剩余日均','今天计划发货'];
        this.tableData.tableD=[
          ['合计',],
          ['线上渠道',],
          ['线下渠道',],
          ['海外渠道',],
        ];
        if(res.data.length>0){
          Object.keys(res.data).forEach((OnKey) => {
            Object.keys(this.tableData.tableD).forEach((OnKey2) => {
              if(this.tableData.tableD[OnKey2][0]===res.data[OnKey].CHNL_NAME){
                this.tableData.tableD[OnKey2].push(
                  res.data[OnKey].PTD_SEND_TGT,
                  res.data[OnKey].PTD_SEND_AMT,
                  res.data[OnKey].PTD_SEND_RATE,
                  res.data[OnKey].DAY_SEND_AMT,
                  res.data[OnKey].PTD_DAILY_SURP_TGT,
                  res.data[OnKey].PTD_TODAY_EST_AMT,
                );
              }
            });
          });
        }else{
          this.tableData.tableD=[
            ['合计',0,0,0,0,0,0],
            ['线上渠道',0,0,0,0,0,0],
            ['线下渠道',0,0,0,0,0,0],
            ['海外渠道',0,0,0,0,0,0],
          ];          
        }
        
    },
    // 待处理情况 左中 左下
    async GetTrendLeft(){
      let query = {
        CHNL_NAME:(this.IsChangeNam.IsVal==='合计')?null:this.IsChangeNam.IsVal
      }
      // let res = await this.$fetchSql('all_center', 'all_center_send_order_handle', query);
      let res = await this.$fetchSql('kpi_report', 'ord_wait_handle_new', query);

      this.singleBar.xAxis[0].data=['待客审','待货审','待财审','待打印','待发货'];
      this.singleBar.series[1].data=[];

      this.singleBar1.xAxis[0].data=['已客审','已货审','已财审','已打印','已发货'];
      this.singleBar1.series[1].data=[];
      if(res.data.length>0){
        this.singleBar.series[0].data=[
          (res.data[0].PTD_WAIT_CS_AUD_AMT).toFixed(0),
          (res.data[0].PTD_WAIT_GOODS_AUD_AMT).toFixed(0),
          (res.data[0].PTD_WAIT_FIN_AUD_AMT).toFixed(0),
          (res.data[0].PTD_WAIT_PRINT_AMT).toFixed(0),
          (res.data[0].PTD_WAIT_SEND_AMT).toFixed(0),
        ];  
        this.singleBar1.series[0].data=[
          (res.data[0].PTD_CS_AUD_AMT).toFixed(0),
          (res.data[0].PTD_GOODS_AUD_AMT).toFixed(0),
          (res.data[0].PTD_FIN_AUD_AMT).toFixed(0),
          (res.data[0].PTD_PRINT_AMT).toFixed(0),
          (res.data[0].PTD_SEND_AMT).toFixed(0),
        ];  
      }

      this.singleBar.series[0].label.formatter=((params)=>{
        return HandleNum('round',params.value);
      });
      this.singleBar1.series[0].label.formatter=((params)=>{
        return HandleNum('round',params.value);
      });
    },

    // 右上
    async GetIndexRig(){

      let query = {
        CHNL_NAME:(this.SelectsDat[0].value.join(',')==='全部')?null:this.SelectsDat[0].value.join(','),
        CHNL_TYPE:(this.SelectsDat[1].value.join(',')==='全部')?null:this.SelectsDat[1].value.join(',')
      }
      // let res = await this.$fetchSql('all_center', 'all_center_send_order_distri',query);
      let res = await this.$fetchSql('kpi_report', 'ord_wait_goods_order_dist',query);  

      if(res.data.length>0){

        if(this.SelectsDat[0].value.join(',')==='全部'){
          this.OnIndex=[
            {OnType:'OrderDistributionV2',IndeWidth:25,sign:0, IndexData:[
              {title:'总待货审订单金额',Tnum: res.data[0].PTD_WAIT_GOODS_AUD_AMT,
              ContInfo:[{name:'占比',value:1},
              {name:'线上占比',value: res.data[0].ON_WAIT_GOODS_AUD_RATE},
              {name:'线下占比',value: res.data[0].OFF_WAIT_GOODS_AUD_RATE},
              {name:'海外占比',value: res.data[0].HW_WAIT_GOODS_AUD_RATE}]},
            ]},
            {OnType:'OrderDistributionV2',IndeWidth:25,sign:1,IndexData:[
              {title:'承诺待发货金额(已剔除待通知)',
              Tnum: res.data[0].PTD_COMMIT_SEND_AMT,
              remarks:false,
              ContInfo:[{name:'占比',value: res.data[0].PTD_COMMIT_SEND_RATE},
                {name:'线上占比',value: res.data[0].ON_COMMIT_SEND_RATE},
                {name:'线下占比',value: res.data[0].OFF_COMMIT_SEND_RATE},
                {name:'海外占比',value: res.data[0].HW_COMMIT_SEND_RATE}]},
            ]},
            {OnType:'OrderDistributionV2',IndeWidth:25,sign:2,IndexData:[
              {title:'待通知发货金额',Tnum: res.data[0].PTD_WAIT_INFO_SEND_AMT,
              ContInfo:[{name:'占比',value: res.data[0].PTD_WAIT_INFO_SEND_RATE},
              {name:'线上占比',value: res.data[0].ON_WAIT_INFO_RATE},
              {name:'线下占比',value: res.data[0].OFF_WAIT_INFO_RATE},
              {name:'海外占比',value: res.data[0].HW_WAIT_INFO_RATE}]},
            ]},
          ];
        }else{
          this.OnIndex=[
            {OnType:'OrderDistributionV2',IndeWidth:25,sign:0, IndexData:[
              {title:'总待货审订单金额',Tnum: res.data[0].PTD_WAIT_GOODS_AUD_AMT,
              ContInfo:[{name:'占比',value:1},
                // {name:'线上占比',value: res.data[0].ON_WAIT_GOODS_AUD_RATE},
                // {name:'线下占比',value: res.data[0].OFF_WAIT_GOODS_AUD_RATE},
                // {name:'海外占比',value: res.data[0].HW_WAIT_GOODS_AUD_RATE}
              ]},
            ]},
            {OnType:'OrderDistributionV2',IndeWidth:25,sign:1,IndexData:[
              {title:'承诺待发货金额(已剔除待通知)',
              Tnum: res.data[0].PTD_COMMIT_SEND_AMT,
              remarks:false,
              ContInfo:[{name:'占比',value: res.data[0].PTD_COMMIT_SEND_RATE},
                // {name:'线上占比',value: res.data[0].ON_COMMIT_SEND_RATE},
                // {name:'线下占比',value: res.data[0].OFF_COMMIT_SEND_RATE},
                // {name:'海外占比',value: res.data[0].HW_COMMIT_SEND_RATE}
              ]},
            ]},
            {OnType:'OrderDistributionV2',IndeWidth:25,sign:2,IndexData:[
              {title:'待通知发货金额',Tnum: res.data[0].PTD_WAIT_INFO_SEND_AMT,
              ContInfo:[{name:'占比',value: res.data[0].PTD_WAIT_INFO_SEND_RATE},
                // {name:'线上占比',value: res.data[0].ON_WAIT_INFO_RATE},
                // {name:'线下占比',value: res.data[0].OFF_WAIT_INFO_RATE},
                // {name:'海外占比',value: res.data[0].HW_WAIT_INFO_RATE}
              ]},
            ]},
          ];
        }
        
      }

    },

    // 右中
    async GetIndexRigZh(){

      let query = {
        IS_WAIT_SEND:(this.IsChoiceOn===1)?'否':(this.IsChoiceOn===2)?'是':null,
        CHNL_NAME:(this.SelectsDat[0].value.join(',')==='全部')?null:this.SelectsDat[0].value.join(','),
        CHNL_TYPE:(this.SelectsDat[1].value.join(',')==='全部')?null:this.SelectsDat[1].value.join(',')
      }
      // let res = await this.$fetchSql('all_center', 'all_center_send_order_goods_ord',query);
      let res=[]
      if(this.AreaData.area==='待货审'){
        res = await this.$fetchSql('kpi_report', 'ord_wait_goods_order',query);
      }else if(this.AreaData.area==='可货审'){
        res = await this.$fetchSql('kpi_report', 'ord_can_goods_audit',query);
      }

      if(res.data.length>0){

        if(this.AreaData.area==='待货审'){
          this.RigIndDat.IndexData=[
            {title:'到期待货审',Tnum: res.data[0].PTD_DUE_COMMIT_SEND_AMT,
              ContInfo:[{name:'占比',value: res.data[0].PTD_DUE_COMMIT_SEND_RATE},]},
            {title:'按承诺本月发货',Tnum: res.data[0].PTD_THIS_COMMIT_SEND_AMT,
              ContInfo:[{name:'占比',value: res.data[0].PTD_THIS_COMMIT_SEND_RATE},]},
            {title:'承诺次月发货',Tnum: res.data[0].PTD_NEXT_COMMIT_SEND_AMT,
              ContInfo:[{name:'占比',value: res.data[0].PTD_NEXT_COMMIT_SEND_RATE},]},
            {title:'承诺次月后发货',Tnum: res.data[0].PTD_AFTER_COMMIT_SEND_AMT,
              ContInfo:[{name:'占比',value: res.data[0].PTD_AFTER_COMMIT_SEND_RATE},]},
          ];
        }else if(this.AreaData.area==='可货审'){
          this.RigIndDat.IndexData=[
            {title:'到期可货审',Tnum: res.data[0].PTD_DUE_COMMIT_AUDIT_AMT,
              ContInfo:[{name:'占比',value: res.data[0].PTD_DUE_COMMIT_ADUIT_RATE},]},
            {title:'按承诺本月发货',Tnum: res.data[0].PTD_THIS_COMMIT_AUDIT_AMT,
              ContInfo:[{name:'占比',value: res.data[0].PTD_THIS_COMMIT_ADUIT_RATE},]},
            {title:'承诺次月发货',Tnum: res.data[0].PTD_NEXT_COMMIT_AUDIT_AMT,
              ContInfo:[{name:'占比',value: res.data[0].PTD_NEXT_COMMIT_ADUIT_RATE},]},
            {title:'承诺次月后发货',Tnum: res.data[0].PTD_AFTER_COMMIT_AUDIT_AMT,
              ContInfo:[{name:'占比',value: res.data[0].PTD_AFTER_COMMIT_ADUIT_RATE},]},
          ];
        }


      }else{
        this.RigIndDat.IndexData=[
          {title:'到期待货审',Tnum: 0,
            ContInfo:[{name:'占比',value: 0},]},
          {title:'按承诺本月发货',Tnum: 0,
            ContInfo:[{name:'占比',value: 0},]},
          {title:'承诺次月发货',Tnum: 0,
            ContInfo:[{name:'占比',value: 0},]},
          {title:'承诺次月后发货',Tnum: 0,
            ContInfo:[{name:'占比',value: 0},]},
        ];
      }

    },

    // 右下
    async GetTableRigZh(){

      let query = {
        IS_WAIT_SEND:(this.IsChoiceOn===1)?'否':(this.IsChoiceOn===2)?'是':null,
        CHNL_NAME:(this.SelectsDat[0].value.join(',')==='全部')?null:this.SelectsDat[0].value.join(','),
        CHNL_TYPE:(this.SelectsDat[1].value.join(',')==='全部')?null:this.SelectsDat[1].value.join(',')
      }
      // let res = await this.$fetchSql('all_center', 'all_center_send_order_goods_range',query);
      let res = await this.$fetchSql('kpi_report', 'ord_wait_goods_range',query);

      this.TableDatRig.labelD=['时间区间','待货审业绩','金额占比','订单匹配率（总仓）','订单匹配率(总仓&供应仓)','可货审金额',];
      this.TableDatRig.tableD=[
        ['汇总',],
        ['到期订单',],
        ['0-14天',],
        ['15-28天',],
        ['4周以上',],
      ];

      if(res.data.length>0){

        Object.keys(res.data).forEach((OnKey) => {
          Object.keys(this.TableDatRig.tableD).forEach((OnKey2) => {
            if(this.TableDatRig.tableD[OnKey2][0]===res.data[OnKey].DURATION){
              this.TableDatRig.tableD[OnKey2].push(
                res.data[OnKey].PTD_WAIT_GOODS_AUD_AMT,
                res.data[OnKey].PTD_WAIT_GOODS_AUD_RATE,
                res.data[OnKey].PTD_ZK_SUP_RATE,
                res.data[OnKey].PTD_LK_SUP_RATE,
                res.data[OnKey].PTD_CAN_GOODS_AUD_AMT, 
              );
            }
          });
        });

      }else{
        this.TableDatRig.tableD=[
          ['汇总',0,0,0,0,0,],
          ['到期订单',0,0,0,0,0,],
          ['0-14天',0,0,0,0,0,],
          ['15-28天',0,0,0,0,0,],
          ['4周以上',0,0,0,0,0,],
        ];        
      }

    }


  }






}
</script>

<style lang="scss" scoped>
.OrderFlow{
  height: calc(100%);
  padding-top: 10px;
  .header{
    // height: 38px;
    height: 30px;
    padding-bottom: 10px;
    border-bottom: 0px solid #F0F0F0;
  }
  .OrderFlowMin{
    height: calc(100% - 38px);
    display: flex;
    .leftBox{
      flex: 45;
      padding-top: 0px;
      padding-right: 32px;
      .title_1{
        font-size: 14px;
        font-family: PingFangSC-Medium,PingFang SC;
        font-weight: 700;
        color: #000;
        margin-bottom: 10px;
      }
      .TableLeft{
        height: 145px;

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
      .title_2{
        font-size: 14px;
        font-family: PingFangSC-Regular,PingFang SC;
        color: #333;
      }
    }
    .rightBox{
      height: 100%;
      flex: 55;
      padding-left: 32px;
      padding-top: 0px;
      .title_1{
        font-size: 14px;
        font-family: PingFangSC-Medium,PingFang SC;
        font-weight: normal;
        color: #000;
      }
      .select{
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .SelTitle{
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          font-family: PingFangSC-Medium,PingFang SC;
          font-weight: 700;
          color: #000;          
        }
        .SelCont{
          display: flex;
          /deep/ .select-container{
              >div:nth-child(1) span{
                  font-size: 12px!important;
              }
              >span:nth-child(2){
                  margin-left: 10px;
                  border: 1px solid #d9d9d9;
                  border-radius: 4px;
                  div:nth-child(1){
                      height: 28px!important;
                      line-height: 28px!important;
                  }
                  span:nth-child(2){
                      line-height: 28px!important;
                  }
              }
              .dropdown-button{
                  height: 20px;
                  line-height: 28px;
              }
          }          
        }


      }
      .RigIndex{
        display: flex;
        height: 145px;
        .RigIndexOn{
          flex: 1;
          cursor: pointer;
          /deep/ .TopIndex .TopIndList{
            padding-top: 5px;
            padding-bottom: 0px;
            padding-right: 0px;
            padding-left: 10px;
          }
          /deep/ .TopIndex .TopIndList .TopITitle{
            line-height: 22px;
          }
          /deep/ .TopIndex .TopIndList .TopINum{
            line-height: 24px;
            // height: 24px;
            height: 34px;
            font-size: 22px;
            padding-top: 8px;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li{
            line-height: 18px;
            padding-top: 8px;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl{
            display: inline;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi{
            width: 33.33% !important;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi:nth-child(1) .TopCouULUl{
            display: flex;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi:nth-child(1) .TopCouULUl li:nth-child(1){
            flex: 33;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi:nth-child(1) .TopCouULUl li:nth-child(2){
            flex: 33;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi:nth-child(1) .TopCouULUl li:nth-child(3){
            flex: 33;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi:nth-child(1){
            width: 100% !important;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li:nth-child(3){
            padding-top: 0px;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li{
            text-align: left;            
          }   
        }
        .TopInACent:hover{
          background: rgba(0, 0, 0, 0.03);
        }
        .TsTopInACent{
          background: rgba(0, 0, 0, 0.03);
        }

      }

      .RigIndDow{
        // height: calc((100% - 145px - 100px) / 2);
        // --height:calc((100% - 219px) / 2);
        height: 139px;
        // --height:calc(8px);
        --height:calc(10px);
        .title_1{
          font-size: 14px;
          font-family: PingFangSC-Medium,PingFang SC;
          font-weight: normal;
          color: #000;
        }
        .RigIndDowOn{
          /deep/ .TopIndex .TopIndList{
            // padding-top: calc(var(--height));
            padding-top: 5px;
            padding-bottom: 0px;
            padding-right: 0px;
            padding-left: 0px;
          }
          /deep/ .TopIndex .TopIndList .TopINum{
            // margin-top: 20px;
            margin-top: calc(var(--height));
            // font-size: 22px;
            font-size: 16px;
            font-weight: 400;
            color: #333;
            line-height: 24px;
            // height: 25px;
            height: 30px;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi{
            // padding-top: 20px;
            // padding-top: calc(var(--height));
            padding-top: 0px;
          }
          /deep/ .TopIndex .TopIndList .TopCoun .TopCouUl .TopCouUlLi .TopCouULUl li{
            text-align: left;
          }
        }
      }
      .TableRight{
        margin-top: 5px;
        // height: calc((100% - 145px - 60px) / 2);
        height: calc(100% - 145px - 139px - 55px);
        // height: calc(28px * 6);
        /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Title{
          padding-left: 10px;
          text-align: left;
          width: 80px;
        }

        /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td.Con4{
          width: 160px;
        }

        /deep/ .tablelthead .TRORCLeftTUser2 thead tr div td{
          padding-right: 10px;
          text-align: right;
        }  

        /deep/ .TRORCLeftTUser2 tbody tr td.Title{
          padding-left: 10px;
          text-align: left;
          width: 80px;
        }
        /deep/ .TRORCLeftTUser2 tbody tr td{
          padding-right: 10px;
          text-align: right;
          max-height: 28px;
        }

        /deep/ .TRORCLeftTUser2 tbody tr td.ConBoy4{
          width: 160px;
        }        
 
      }

    }

  }

}

</style>




