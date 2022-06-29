<template>
  <div class="HousekeepS">
    <div class="header">
      <Title class="title" :label="'内务评分'" />
      <div>
        <span style="padding-right: 13px;font-size: 12px;">统计月份</span>
        <a-month-picker v-model="month" format="YYYY-MM" :disabledDate='disabledDate' valueFormat="YYYYMM" :allowClear="false" />        
      </div>
    </div>

    <!-- InteriorSum  -->
    <div class="content">
      <div class="HoukeepSLeft">
        <div class="HoukeepSLTitle">评分总览</div>
        <div class="HoukeepSLIndex">
          <div class="HoukeepSLICon" v-for="(item, index) in InteriorSum" :key="index">
            <div class="HoukeepSLICName">{{ item.IntName }}</div>
            <div class="HoukeepSLICVal">{{ IsNullOn('round', item.Num) }}</div>
            <div class="HkeepSLICSpan">
              <div class="HkeepSLICSpanT">{{ item.IntName2 }}</div>
              <div class="HkeepSLICSpanN">{{ IsNullOn('round', item.Nam2) }}</div>
            </div>
            <div class="HkeepSLICSpan">
              <div class="HkeepSLICSpanT">{{ item.IntName3 }}</div>
              <div class="HkeepSLICSpanN">{{ IsNullOn('round', item.Nam3) }}</div>
            </div>
            <div class="HkeepSLICSpan">  <!-- KSpan-->
              <div class="HkeepSLICSpanT">{{ item.IntName4 }}</div>
              <div class="HkeepSLICSpanN">{{ IsNullOn('round', item.Nam4) }}</div>
            </div>
            <div class="HkeepSLICSpan">
              <div class="HkeepSLICSpanT">{{ item.IntName5 }}</div>
              <div class="HkeepSLICSpanN" :style="{color:(item.Nam5*1>0)?'#ff5953':'#00a854'}">{{ IsNullOn('round', item.Nam5) }}</div>
            </div>
          </div>
        </div>

        <div class="HoukeepSLTVice">
          <div class="HoukeepSLTVText">区域评分</div>
          <div class="HoukeepSLTVLeg">
            <span>员工服务</span>
            <span>货品管理</span>
            <span>场地布置</span>
          </div>
        </div>

        <div class="HkeepSLCharts">
          <!-- <div class="HkeepSLChartsCss" :style="{height:CliWidth/6.8+'px'}"  ref="HkeepSLCharts"></div> :style="{height:(OnCliHeight-320)+'px'}" -->
          <div class="HkeepSLChartsCss" >
            <v-chart   style="overflow: visible;" :options="OptionsChartBar" autoresize ></v-chart>
          </div>

        </div>
      </div>
      <div class="HoukeepSRight">
        <div class="HoukeepSRTitle">得分趋势</div>

        <div class="HoukeepSRSelect">
          <div class="HkeepSRSSel">
            <Select :label="'区域'" :value.sync="type" :options="TypeOptions" />
          </div>
          <div class="HkeepSRSLeg">
            <span>总分</span>
            <span>员工服务</span>
            <span>货品管理</span>
            <span>场地布置</span>
          </div>
        </div>

        <div class="HkeepSRCharts">
          <!-- <div class="HkeepSRChartsCss" :style="{height:CliWidth/6+'px'}" style="overflow: visible;" ref="HkeepSRChartsB"></div> 
              :style="{height:(OnCliHeight-290)+'px'}"-->
          <div class="HkeepSRChartsCss" >
            <v-chart   style="overflow: visible;" :options="OptionsChartLine" autoresize ></v-chart>
          </div>
        </div>

        <div class="HkeepSRTable">
          <Table v-bind="tableOnM" class="table" />
          <!-- <Jump /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var clientWidth = document.body.offsetWidth;
// 做T+1处理开始
let _time_now=new Date();
_time_now=_time_now.getTime()-(24*60*60*1000);
_time_now=new Date(_time_now);
// 做T+1处理结束
import deepmerge from 'deepmerge'
import Title from '../../components/Title'
import Select from '../../components/Select'
import Table from '../../components/Table'
// import Jump from '../../components/Jump'
import moment from 'moment'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default {
  name: 'HousekeepS',
  components: {
    Title,
    Table,
    Select,
    // Jump,
  },
  data() {
    return {
      month: moment(_time_now).format('YYYYMM'),
      CliWidth:document.body.offsetHeight,
      OnCliHeight:document.body.offsetHeight-300,
      OnCliHeight2:document.body.offsetHeight-590,
      type: '全国',
      TypeOptions:[],
      InteriorSum: [],
      HandleTrend:[],
      tableOnM: {
        index: 'HousekeepS',
        tableData: [
          ['1月', 0, 0, 0, 0],
          ['2月', 0, 0, 0, 0],
          ['3月', 0, 0, 0, 0],
          ['4月', 0, 0, 0, 0],
          ['5月', 0, 0, 0, 0],
          ['6月', 0, 0, 0, 0],
          ['7月', 0, 0, 0, 0],
          ['8月', 0, 0, 0, 0],
          ['9月', 0, 0, 0, 0],
          ['10月', 0, 0, 0, 0],
          ['11月', 0, 0, 0, 0],
          ['12月', 0, 0, 0, 0],
        ],
        labelData: ['月份', '总分', '员工服务', '货品管理', '场地布置'],
      },
      OptionsTemplate:{
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
        xAxis: [],
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
          },
        ],
        series:[]
      },
      OptionsChartBar:{},
      OptionsChartLine:{},

    }
  },

  watch: {
    month() {
      console.log('运行上了！！！')
      this.GetInteriorSum();
      this.GetRegional()
    },
    type(){
      this.HandleTrendData(this.HandleTrend);
    }

  },
  async created() {
    window.onresize = () =>{
      this.CliWidth = document.body.offsetHeight;
      console.log("=========高度有表还==========");
      console.log(this.CliWidth)
      this.OnCliHeight=this.CliWidth-300;
      this.OnCliHeight2=this.CliWidth-590;
    }

    let res = await this.$fetchSql('new_retail', 'new_retail_dateon',);
    if(res.data){
      this.month=moment(res.data[0].DATEON).format('YYYYMM');
    }


    this.GetInteriorSum()
    this.GetRegional()
    this.GetTrendData()
    this.GetTrendSelect()
  },
  mounted() {
  },
  methods: {
    async GetInteriorSum() {
      let query = {
        MDATE: this.month,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_interior_sum', query)
      this.InteriorSum = [
        {
          IntName: '总得分',
          Num: res.data[0].MTD_TOT_SCORE,
          IntName2: '满分',
          Nam2: res.data[0].MTD_TOT_FULL,
          IntName3: '差值',
          Nam3: res.data[0].MTD_TOT_SCORE_DIFF,
          IntName4: '上月',
          Nam4: res.data[0].LAST_TOT_SCORE,
          IntName5: '差值',
          Nam5: res.data[0].LAST_TOT_SCORE_DIFF,
        },
        {
          IntName: '员工服务',
          Num: res.data[0].MTD_STAFF_SCORE,
          IntName2: '满分',
          Nam2: res.data[0].MTD_TAFF_FULL,
          IntName3: '差值',
          Nam3: res.data[0].MTD_STAFF_SCORE_DIFF,
          IntName4: '上月',
          Nam4: res.data[0].LAST_STAFF_SCORE,
          IntName5: '差值',
          Nam5: res.data[0].LAST_STAFF_SCORE_DIFF,
        },
        {
          IntName: '货品管理',
          Num: res.data[0].MTD_GOODS_SCORE,
          IntName2: '满分',
          Nam2: res.data[0].MTD_GOODS_FULL,
          IntName3: '差值',
          Nam3: res.data[0].MTD_GOODS_SCORE_DIFF,
          IntName4: '上月',
          Nam4: res.data[0].LAST_GOODS_SCORE,
          IntName5: '差值',
          Nam5: res.data[0].LAST_GOODS_SCORE_DIFF,
        },
        {
          IntName: '场地布置',
          Num: res.data[0].MTD_FIELD_SCORE,
          IntName2: '满分',
          Nam2: res.data[0].MTD_FIELD_FULL,
          IntName3: '差值',
          Nam3: res.data[0].MTD_FIELD_SCORE_DIFF,
          IntName4: '上月',
          Nam4: res.data[0].LAST_FIELD_SCORE,
          IntName5: '差值',
          Nam5: res.data[0].LAST_FIELD_SCORE_DIFF,
        },
      ]
    },

    async GetRegional() {
      let query = {
        MDATE: this.month,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_interior_area', query)
      this.HkeepSLChartsFun(res.data);
    },

    async GetTrendData() {
      let query = {
        MDATE: this.month,
      }
      let res = await this.$fetchSql('new_retail', 'new_retail_interior_trend', query)
      this.HandleTrend=res.data;
      this.HandleTrendData(res.data);
    },
    HandleTrendData(UserData){
      UserData=UserData.filter(_=>_.S_OR_N===this.type);
      UserData.sort((a, b) => {
        return (
          (a['MDATE'] ? a['MDATE'].replace(/[\u4e00-\u9fa5]/g,'') : 0) * 1 -
          (b['MDATE'] ? b['MDATE'].replace(/[\u4e00-\u9fa5]/g,'') : 0) * 1
        )
      });
      this.tableOnM.tableData=[];
      Object.keys(UserData).forEach((OnKey) => {
        this.tableOnM.tableData.push([
          UserData[OnKey].MDATE,
          this.IsNullOn('round',UserData[OnKey].MTD_TOT_SCORE),
          this.IsNullOn('round',UserData[OnKey].MTD_STAFF_SCORE),
          this.IsNullOn('round',UserData[OnKey].MTD_GOODS_SCORE),
          this.IsNullOn('round',UserData[OnKey].MTD_FIELD_SCORE),
        ]);
      });
      this.HkeepSRChartFunB(UserData);
    },

    async GetTrendSelect(){
      let res = await this.$fetchSql('new_retail', 'new_retail_interior_trend',);
      res.data.sort((a,b)=>{return a['RANK_ON'] - b['RANK_ON'] });
      this.TypeOptions = Object.freeze(Array.from(new Set(res.data.map((_) => _.S_OR_N))));
    },
    
    HkeepSLChartsFun(OnData) {
      // this.HkeepSLChartsVal = echarts.init(this.$refs['HkeepSLCharts'])
      let Userlab=[];
      let FieldData=[]; //场地布置得分
      let GoodsData=[]; //货品管理得分
      let StaffData=[]; //员工服务得分
      let AllData = []; //所有的总数
      let seriesData={
        tooltip:{
          formatter:''
        },
        xAxis:[
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
          },
          {
              type: 'category',
              // inverse: true,
              axisTick: 'none',
              axisLine: 'none',
              show: true,
              axisLabel: {
                  textStyle: {
                      color: '#282c33',
                      fontSize: '12'
                  },
                  formatter: (val) => {
                      return this.IsNullOn('round', val)
                  }
              },
              data: []
          }
        ],
        series:[
          {
            name: '员工服务',
            type: 'line',
            barWidth: '20',
            stack: null,
            data: [150, 230, 224, 218, 135, 147, 260],
            itemStyle: {
              normal: {
                color: '#5b8ff9',
              },
            },
            label: {
              show: true,
              position: 'inside',
            },
            z: 2,
            lineStyle: {
              color: '#e7e7e7',
            },
          },
          {
            name: '货品管理',
            type: 'line',
            barWidth: '20',
            stack: null,
            data: [150 / 2, 230 / 2, 224 / 2, 218 / 2, 135 / 2, 147 / 2, 260 / 2],
            itemStyle: {
              normal: {
                color: '#5b8ff9',
              },
            },
            label: {
              show: true,
              position: 'inside',
            },
            z: 1,
            smooth: false,
            lineStyle: {
              color: '#e7e7e7',
            },
            symbol: 'none',
          },
          {
            name: '场地布置',
            type: 'line',
            barWidth: '20',
            stack: null,
            data: [150 / 2, 230 / 2, 224 / 2, 218 / 2, 135 / 2, 147 / 2, 260 / 2],
            itemStyle: {
              normal: {
                color: '#5b8ff9',
              },
            },
            label: {
              show: true,
              position: 'inside',
            },
            z: 1,
            smooth: false,
            lineStyle: {
              color: '#e7e7e7',
            },
            symbol: 'none',
          },
        ]
      };
      Object.keys(OnData).forEach((OnKey) => {
        Userlab.push(OnData[OnKey].S_OR_N);
        FieldData.push(this.IsNullOn('round',OnData[OnKey].MTD_FIELD_SCORE));
        GoodsData.push(this.IsNullOn('round',OnData[OnKey].MTD_GOODS_SCORE));
        StaffData.push(this.IsNullOn('round',OnData[OnKey].MTD_STAFF_SCORE));
        AllData.push(this.IsNullOn('round',OnData[OnKey].MTD_FIELD_SCORE+OnData[OnKey].MTD_GOODS_SCORE+OnData[OnKey].MTD_STAFF_SCORE));
      }); 

      seriesData.xAxis[0].data = Userlab
      seriesData.xAxis[1].data = AllData;


      seriesData.series[0].type = 'bar'
      seriesData.series[0].stack = '总量'
      seriesData.series[0].name='员工服务'
      seriesData.series[0].data = StaffData 

      seriesData.series[1].type = 'bar'
      seriesData.series[1].stack = '总量'
      seriesData.series[1].name='货品管理'
      seriesData.series[1].data = GoodsData
      
      seriesData.series[2].type = 'bar'
      seriesData.series[2].stack = '总量'
      seriesData.series[2].name='场地布置'
      seriesData.series[2].data = FieldData




      // seriesData.series[3].data = null
      seriesData.series[0].itemStyle.normal.color='#5B8FF9';
      seriesData.series[1].itemStyle.normal.color='#F6BD16';
      seriesData.series[2].itemStyle.normal.color='#5D7092';
      seriesData.series[0].barWidth=40;
      seriesData.series[1].barWidth=40;
      seriesData.series[2].barWidth=40;
      seriesData.series[0].label.show=true;
      seriesData.series[1].label.show=true;
      seriesData.series[2].label.show=true;

      seriesData.tooltip.formatter=((params)=>{
        return params[0].name+'<br>'+params[0].marker+params[0].seriesName+'：'+params[0].value+
          '<br>'+params[1].marker+params[1].seriesName+'：'+params[1].value+
          '<br>'+params[2].marker+params[2].seriesName+'：'+params[2].value
      });
      // this.HkeepSLChartsVal.setOption(this.OptionsChart)
      this.OptionsChartBar = deepmerge(this.OptionsTemplate,seriesData)
    },


    HkeepSRChartFunB(OnData) {
      // this.HkeepSRChartValB = echarts.init(this.$refs['HkeepSRChartsB'])
      let Userlab = []
      let TotData = []    //总分
      let StaffData = []  //员工服务得分
      let GoodsData = []  //货品管理得分
      let FieldData = []  //场地布置得分
      let seriesData={
        tooltip:{
          formatter:''
        },
        xAxis:[
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
          },
        ],
        series:[
          {
            name: '产地布置',
            type: 'line',
            barWidth: '20',
            stack: null,
            data: [150, 230, 224, 218, 135, 147, 260],
            itemStyle: {
              normal: {
                color: '#5b8ff9',
              },
            },
            label: {
              show: true,
              position: 'inside',
            },
            z: 2,
            lineStyle: {
              color: '#e7e7e7',
            },
            symbol: 'none',
          },
          {
            name: '货品管理',
            type: 'line',
            barWidth: '20',
            stack: null,
            data: [150 / 2, 230 / 2, 224 / 2, 218 / 2, 135 / 2, 147 / 2, 260 / 2],
            itemStyle: {
              normal: {
                color: '#5b8ff9',
              },
            },
            label: {
              show: true,
              position: 'inside',
            },
            z: 1,
            smooth: false,
            lineStyle: {
              color: '#e7e7e7',
            },
            symbol: 'none',
          },
          {
            name: '货品管理',
            type: 'line',
            barWidth: '20',
            stack: null,
            data: [150 / 2, 230 / 2, 224 / 2, 218 / 2, 135 / 2, 147 / 2, 260 / 2],
            itemStyle: {
              normal: {
                color: '#5b8ff9',
              },
            },
            label: {
              show: true,
              position: 'inside',
            },
            z: 1,
            smooth: false,
            lineStyle: {
              color: '#e7e7e7',
            },
            symbol: 'none',
          },
          {
            name: '货品管理',
            type: 'line',
            barWidth: '20',
            stack: null,
            data: [150 / 2, 230 / 2, 224 / 2, 218 / 2, 135 / 2, 147 / 2, 260 / 2],
            itemStyle: {
              normal: {
                color: '#5b8ff9',
              },
            },
            label: {
              show: true,
              position: 'inside',
            },
            z: 1,
            smooth: false,
            lineStyle: {
              color: '#e7e7e7',
            },
            symbol: 'none',
          },
        ]
      }

      Object.keys(OnData).forEach((OnKey) => {
        Userlab.push(OnData[OnKey].MDATE);
        TotData.push(this.IsNullOn('round',OnData[OnKey].MTD_TOT_SCORE));
        StaffData.push(this.IsNullOn('round',OnData[OnKey].MTD_STAFF_SCORE));
        GoodsData.push(this.IsNullOn('round',OnData[OnKey].MTD_GOODS_SCORE));
        FieldData.push(this.IsNullOn('round',OnData[OnKey].MTD_FIELD_SCORE));
      });
      seriesData.series[0].type = 'line'
      seriesData.series[1].type = 'line'
      seriesData.series[2].type = 'line'
      seriesData.series[3].type = 'line'
      seriesData.xAxis[0].data = Userlab;
      seriesData.series[0].data = TotData
      seriesData.series[1].data = StaffData
      seriesData.series[2].data = GoodsData
      seriesData.series[3].data = FieldData
      seriesData.series[0].stack = '总分'
      seriesData.series[0].name='总分'
      seriesData.series[1].stack = '员工服务得分'
      seriesData.series[1].name='员工服务得分'
      seriesData.series[2].stack = '货品管理得分'
      seriesData.series[2].name='货品管理得分'
      seriesData.series[3].stack = '场地布置得分'
      seriesData.series[3].name='场地布置得分'
      seriesData.series[0].label.show = false;
      seriesData.series[1].label.show = false;
      seriesData.series[2].label.show = false;
      seriesData.series[3].label.show = false;

      seriesData.series[0].itemStyle.normal.color='#EB63D8';
      seriesData.series[1].itemStyle.normal.color='#5B8FF9';
      seriesData.series[2].itemStyle.normal.color='#F6BD16';
      seriesData.series[3].itemStyle.normal.color='#5D7092';

      seriesData.series[0].lineStyle.color='#EB63D8';
      seriesData.series[1].lineStyle.color='#5B8FF9';
      seriesData.series[2].lineStyle.color='#F6BD16';
      seriesData.series[3].lineStyle.color='#5D7092';

      seriesData.tooltip.formatter=((params)=>{
        return params[0].name+'<br>'+params[0].marker+params[0].seriesName+'：'+params[0].value+
          '<br>'+params[1].marker+params[1].seriesName+'：'+params[1].value+
          '<br>'+params[2].marker+params[2].seriesName+'：'+params[2].value+
          '<br>'+params[3].marker+params[3].seriesName+'：'+params[3].value
      });
      // OptionsChartLine
      // this.HkeepSRChartValB.setOption(this.OptionsChart)
      this.OptionsChartLine = deepmerge(this.OptionsTemplate,seriesData)

    },

    disabledDate(current) {
      return current && current > moment()
    },

    IsNullOn(type, val) {
      if (val === null || val === undefined || (!val && val !== 0)) return '--'
      if (val === 0) return '--'
      if (type === 'percent') {
        return (val * 100).toFixed(2) + '%'
      }else if(type === 'percent1'){
        return (val * 100).toFixed(1) + '%'
      }else if (type === 'tenThousand') {
          return (val / 10000).toFixed(1).toLocaleString() + '万'
      } else if (type === 'round') {
          return (val==0)?'--':((val * 1).toFixed(0) * 1).toLocaleString()
      }
    },


  },
}
</script>

<style lang="scss" scoped>
.HousekeepS {
  .header {
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .content {
    height: calc(100% - 38px);
    --heightUser: calc(100vh);
    display: flex;
    .HoukeepSLeft {
      flex: 1;
      padding-top: 30px;
      padding-right: 20px;
      .HoukeepSLTitle {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
      }
      .HoukeepSLIndex {
        display: flex;
        padding-top: 20px;
        .HoukeepSLICon {
          flex: 1;
          .HoukeepSLICName {
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.64);
            line-height: 22px;
          }
          .HoukeepSLICVal {
            font-size: 22px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 45px;
          }

          .HkeepSLICSpan {
            display: flex;
            .HkeepSLICSpanT {
              flex: 1;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #999999;
              line-height: 22px;
            }
            .HkeepSLICSpanN {
              flex: 1;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.64);
              line-height: 22px;
            }
          }

          .KSpan {
            padding-top: 10px;
          }
        }
      }

      .HoukeepSLTVice {
        display: flex;
        padding-top: 20px;
        align-items: center;
        justify-content: space-between;
        .HoukeepSLTVText {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
        }
        .HoukeepSLTVLeg {
          margin-bottom: 20px;
          align-items: center;
          padding-right: 30px;
          span:nth-child(1),
          span:nth-child(2),
          span:nth-child(3) {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #8c8c8c;
            line-height: 17px;
          }
          span:nth-child(1)::before,
          span:nth-child(2)::before,
          span:nth-child(3)::before {
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
            background: #f6bd16;
          }
          span:nth-child(3)::before {
            background: #5d7092;
          }
        }
      }

      .HkeepSLCharts {
        height: calc(100% - 260px)!important;
        padding-top: 20px;
        .HkeepSLChartsCss {
          width: 100%;
          height: calc(100%)!important;
        }
      }
    }
    .HoukeepSRight {
      flex: 1;
      padding-top: 30px;
      .HoukeepSRTitle {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
      }
      .HoukeepSRSelect {
        display: flex;
        padding-top: 20px;
        align-items: center;
        justify-content: space-between;
        .HkeepSRSSel {
        }
        .HkeepSRSLeg {
          margin-bottom: 20px;
          align-items: center;
          span:nth-child(1),
          span:nth-child(2),
          span:nth-child(3),
          span:nth-child(4) {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #8c8c8c;
            line-height: 17px;
          }
          span:nth-child(1)::before,
          span:nth-child(2)::before,
          span:nth-child(3)::before,
          span:nth-child(4)::before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 2px;
            background: #EB63D8;
            margin-left: 5px;
            margin-right: 5px;
            margin-bottom: 3px;
          }
          span:nth-child(2)::before {
            background: #5B8FF9;
          }
          span:nth-child(3)::before {
            background: #F6BD16;
          }
          span:nth-child(4)::before {
            background: #5D7092;
          }
        }
      }
      .HkeepSRCharts {
        width: 100%;
        height: calc(100% - 230px)!important;
        padding-top: 20px;
        .HkeepSRChartsCss {
          width: 100%;
          height: calc(100%)!important;
        }
      }
    }
  }
}
</style>

