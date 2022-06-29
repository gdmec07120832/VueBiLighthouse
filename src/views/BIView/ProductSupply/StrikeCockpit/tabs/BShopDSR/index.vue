<template>
  <div class="BShopDSR">
    <div class="header">
      <Title class="title" :label="(AreaData.area==='林氏木业家具旗舰店')?'B店DSR':'D店DSR'" :jump="true" :jumpTarget="JumpStr" />

      <div class="ChoiceRight">
        <span style="display: flex">
          <span class="titleName">店铺筛选</span>
          <a-radio-group v-model="AreaData.area">
            <a-radio :value="item" v-for="item in AreaData.areaOption" :key="item">
              {{ item }}
            </a-radio>
          </a-radio-group>
        </span>
      </div>

    </div>
    <div class="main">

      <Indextcq v-bind="OnIndex" />
      <!-- <div class="TopIndex">
        <div class="TopIndList" v-for="(item,index) in OnIndex.IndexData" :key="index">
          <div class="TopITitle">{{item.title}}</div>
          <div class="TopINum">{{item.Tnum}}</div>
          <div class="TopCoun">
            <ul class="TopCouUl">
              <li v-for="(item1,index1) in item.ContInfo" :key="index1" class="TopCouUlLi">
                <ul class="TopCouULUl">
                  <li>{{item1.name}}</li>
                  <li>{{item1.value}}</li>
                </ul>                
              </li>
            </ul>
          </div>
        </div>
      </div> -->

      <div class="DownChart">
        <div class="DChartDesc">
          <v-chart ref="DChartDescOn" class="DChartDescCss" style="overflow: visible" :options="DescOptions" autoresize></v-chart>
        </div>

        <div class="DChartServ">
          <v-chart ref="DChartServOn" class="DChartServCss" style="overflow: visible" :options="ServOptions" autoresize></v-chart>
        </div>

        <div class="DChartLog">
          <v-chart ref="DChartLogOn" class="DChartLogCss" style="overflow: visible" :options="LogOptions" autoresize></v-chart>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import Title from '../../components/Title'
import Indextcq from '../../components/Indextcq'
import moment from 'moment'
import deepmerge from 'deepmerge'
// import { HandleNum } from '../../utils/tcq'
import echartStyle from "../../utils/echartStyle";

export default {
  name: 'BShopDSR',
  components: {
    Title,
    Indextcq,
  },

  data(){
    return{
      OnIndex:{
        OnType:'BShopDSR',
        IndeWidth:100,
        IndexData:[],
      },
      AreaData:{
        area: '林氏木业家具旗舰店',
        areaOption: ['林氏木业家具旗舰店', '林氏旗舰店'],        
      },
      HandIndexData:[],
      HandTrendData:[],


      OptionsTemplate:{
        grid: {
          left: '0%',
          right: '0%',
          bottom: 20,
          top: 30,
          containLabel: true,
        },

        legend: {
          icon: 'rect',
          itemWidth: 16,
          itemHeight: 2,
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
          formatter: params => {
            const name = params[0].name
            const lines = params.map(item => {
              let v = item.value
              if(item.seriesName.indexOf('相比') > -1) {
                v += '%'
              }
              return `<br>${item.marker}${item.seriesName}：${v}`
            }).join('')
            return `统计年月：${name}${lines}`
          }
        },

        xAxis:[
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
            min: val => val.min - 0.005,
            max: val => val.max + 0.005,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          },
          {
            min: val => val.min - 10,
            max: val => val.max + 10,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],

        series:[]
      },

      DescOptions:{},
      ServOptions:{},
      LogOptions:{},

      JumpStr:'',

    }
  },

  watch: {
    'AreaData.area': {
      handler() {
        this.GetIndexView(this.HandIndexData);
        this.GetChartTrend(this.HandTrendData);
      }
    }
  },

  async created() {
    this.OnIndex.IndeWidth=50;
    this.OnIndex.OnType='BShopDSR'
    this.OnIndex.IndexData=[
      {title:'描述相符',Tnum:null,
        ContInfo:[{name:'与同行业相比',value:null},{name:'对比昨日增幅',value:null},{name:'店铺目标值',value:null},
          {name:'距离目标值',value:null},{name:'还需5分评价',value:null}]},

      {title:'服务态度',Tnum:null,
        ContInfo:[{name:'与同行业相比',value:null},{name:'对比昨日增幅',value:null},{name:'店铺目标值',value:null},
          {name:'距离目标值',value:null},{name:'还需5分评价',value:null}]},

      {title:'物流服务',Tnum:null,
        ContInfo:[{name:'与同行业相比',value:null},{name:'对比昨日增幅',value:null},{name:'店铺目标值',value:null},
          {name:'距离目标值',value:null},{name:'还需5分评价',value:null}]},
    ]
    this.GetOverView();
    this.GetOverTrend();
    this.jumpTarget();
  },

  methods: {

    async jumpTarget() {
      let query = {
        versionMainNum:(process.env.VUE_APP_RELEASE_ENV !== 'pro')?'BI_PC_2019_00308':'BI_PC_2019_00324'
      }
      let res =  await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum',query);
      if(process.env.VUE_APP_RELEASE_ENV !== 'pro') {
        this.JumpStr = 'http://test.bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
      else {
        this.JumpStr = 'http://bi.linshimuye.com:9090/x/'+res.data[0].ID_ABSOLUTE_PATH;
      }
    },

    async GetOverView(){
      let res = await this.$fetchSql('kpi_report', 'dsr_set_overview', )
      this.HandIndexData=res.data;
      this.GetIndexView(this.HandIndexData);
    },
    async GetOverTrend(){  
      let res = await this.$fetchSql('kpi_report', 'dsr_set_trend', )
      // console.log(res.data);      
      this.HandTrendData=res.data;
      this.GetChartTrend(this.HandTrendData);
    },

    GetIndexView(Userdata){

      let arr =Userdata.find(_=>{
        return _['STORE_NAME'] === this.AreaData.area
      });
      let IsNullData=this.OnIndex.IndexData.concat();
      this.OnIndex.IndexData=[];
      if(!arr) return this.OnIndex.IndexData=IsNullData
      this.OnIndex.IndexData=[
        {title:'描述相符',Tnum:arr.DESCRIBE,
          ContInfo:[{name:'与同行业相比',value:arr.DESCRIBE_PEER},{name:'对比昨日增幅',value:arr.LAST_DESCRIBE_PEER},
            {name:'店铺目标值',value:arr.DESCRIBE_SCORE},
            {name:'距离目标值',value:arr.DESCRIBE_DESCRIBE},{name:'还需5分评价',value:arr.DESCRIBE_NEED}]},

        {title:'服务态度',Tnum:arr.SERVICE,
          ContInfo:[{name:'与同行业相比',value:arr.SERVICE_PEER},{name:'对比昨日增幅',value:arr.LAST_SERVICE_PEER},
            {name:'店铺目标值',value:arr.SERVICE_SCORE},
            {name:'距离目标值',value:arr.SERVICE_DESCRIBE},{name:'还需5分评价',value:arr.SERVICE_NEED}]},

        {title:'物流服务',Tnum:arr.LOGISTICS,
          ContInfo:[{name:'与同行业相比',value:arr.LOGISTICS_PEER},{name:'对比昨日增幅',value:arr.LAST_LOGISTICS_PEER},
            {name:'店铺目标值',value:arr.LOGISTICS_SCORE},
            {name:'距离目标值',value:arr.LOGISTICS_DESCRIBE},{name:'还需5分评价',value:arr.LOGISTICS_NEED}]},
      ]

    },
    GetChartTrend(UserData){
      this.$refs.DChartDescOn.$refs.echarts.clear()
      this.$refs.DChartServOn.$refs.echarts.clear()
      this.$refs.DChartLogOn.$refs.echarts.clear()
      let ChaArr=UserData.filter(_=>{
        return _['店铺'] === this.AreaData.area
      })
      ChaArr.sort((a, b) => {
        return moment(a['月份']) - moment(b['月份'])
      })
      this.OptionsTemplate.xAxis[0].data=ChaArr.map(_ => {return moment(_['月份']).format('YYYY-MM')})
      let seriesData={        
        series:[
          {
            type: 'line',
            name: '描述相符评分',
            smooth: true,
            symbolSize: 8,
            itemStyle: {
              color: echartStyle.type1
            },
            data: [1,2,3],
            symbol: 'none',
          },
          {
            type: 'line',
            name: '描述相符_同行相比',
            yAxisIndex: 1,
            symbolSize: 8,
            smooth: true,
            itemStyle: {
              color: echartStyle.type3
            },
            data: [4,5,6],
            symbol: 'none'
          }
        ]
      }

      let seriesData2={        
        series:[
          {
            type: 'line',
            name: '服务态度评分',
            smooth: true,
            symbolSize: 8,
            itemStyle: {
              color: echartStyle.type1
            },
            data: [1,2,3],
            symbol: 'none',
          },
          {
            type: 'line',
            name: '服务态度_同行相比',
            yAxisIndex: 1,
            symbolSize: 8,
            smooth: true,
            itemStyle: {
              color: echartStyle.type3
            },
            data: [4,5,6],
            symbol: 'none',
          }
        ]
      }

      let seriesData3={        
        series:[
          {
            type: 'line',
            name: '物流服务评分',
            smooth: true,
            symbolSize: 8,
            itemStyle: {
              color: echartStyle.type1
            },
            data: [1,2,3],
            symbol: 'none',
          },
          {
            type: 'line',
            name: '物流服务_同行相比',
            yAxisIndex: 1,
            symbolSize: 8,
            smooth: true,
            itemStyle: {
              color: echartStyle.type3
            },
            data: [4,5,6],
            symbol: 'none',
          }
        ]
      }

      seriesData.series[0].data = ChaArr.map(_ => (_['描述相符']))
      seriesData.series[1].data = ChaArr.map(_ => ((_['描述相符_同行相比']) * 100).toFixed(2))
      seriesData2.series[0].data = ChaArr.map(_ => (_['服务态度']))
      seriesData2.series[1].data = ChaArr.map(_ => ((_['服务态度_同行相比']) * 100).toFixed(2))
      seriesData3.series[0].data = ChaArr.map(_ => (_['物流服务']))
      seriesData3.series[1].data = ChaArr.map(_ => ((_['物流服务_同行相比']) * 100).toFixed(2))

      this.DescOptions = deepmerge(this.OptionsTemplate,seriesData);
      this.ServOptions = deepmerge(this.OptionsTemplate,seriesData2);
      this.LogOptions = deepmerge(this.OptionsTemplate,seriesData3);


    }


  },



}
</script>

<style lang="scss" scoped>
.BShopDSR{
  .header{
    height: 38px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .ChoiceRight{
      span{
        .titleName{
          padding-right: 15px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.65);
        }        
      }
    }
  }

  .main{
    height: calc(100% - 38px);
    .TopIndex{
      display: flex;
      .TopIndList{
        flex: 1;
        padding: 15px;
        .TopITitle{
          color: rgb(153, 153, 153);
          font-size: 14px;
        }
        .TopINum{
          font-size: 20px;
          line-height: 40px;
          height: 40px;
        }
        .TopCoun{
          .TopCouUl{
            list-style: none;
            padding: 0px;
            margin: 0px;
            .TopCouUlLi{
              float: left;
              width: 50%;
              .TopCouULUl{
                padding: 0px;
                list-style: none;
                li{
                  float: left;                  
                  width: 50%;
                  font-size: 12px;
                  line-height: 25px;
                }
              }
            }

          }
        }
        
      }
    }

    /deep/ .TopIndex{
      .TopIndList{
        .TopCoun{
          ul.TopCouUl{
            .TopCouUlLi{
              .TopCouULUl{
                li:nth-child(1){
                  flex: 40;
                }
                li:nth-child(2){
                  flex: 30;
                }
                li:nth-child(3){
                  flex: 30;
                }
              }
            }
          }
        }
      }
    }


    .DownChart{
      height: calc(100% - 168px);
      // width: 100%;
      display: flex;
      padding-top: 20px;
      .DChartDesc{
        flex: 1;
        .DChartDescCss{
          height: calc(100%) !important;
        }
      }
      .DChartServ{
        flex: 1;
        .DChartServCss{
          height: calc(100%) !important;
        }
      }
      .DChartLog{
        flex: 1;
        .DChartLogCss{
          height: calc(100%) !important;

        }
      }

    }

  }


}
</style>