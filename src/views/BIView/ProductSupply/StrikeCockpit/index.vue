<template>
  <div class="StrikeCockpit">
    <div class="header">

      <HeaderItem style="cursor: pointer;"
        v-for="(item, index) in HeaderItemArr"
        :key="index"
        v-bind="item"
        :active="computeClass(item.comp, index)"
        :class="['headerItem', computeClass(item.comp, index)]"
        @click.native="changeTabV1(item.comp, item.numType, index)"
      />

    </div>
    <component class="content" :is="curTab.comp" ref="curComp" style="overflow: hidden"></component>
  </div>
</template>

<script>
import HeaderItem from './components/HeaderItem.vue'
import T2_Activity from '@/views/BIView/ProductSupply/StrikeCockpit/tabs/T2_Activity'
import BShopDSR from '@/views/BIView/ProductSupply/StrikeCockpit/tabs/BShopDSR'
import KAReach from '@/views/BIView/ProductSupply/StrikeCockpit/tabs/KAReach'
import CityYOY from '@/views/BIView/ProductSupply/StrikeCockpit/tabs/CityYOY'
import StoreBPreSale from '@/views/BIView/ProductSupply/StrikeCockpit/tabs/StoreBPreSale'
import UnsalableAmount from '@/views/BIView/ProductSupply/StrikeCockpit/tabs/UnsalableAmount'
import GuestList from '@/views/BIView/ProductSupply/StrikeCockpit/tabs/GuestList'
import GrossProfit from '@/views/BIView/ProductSupply/StrikeCockpit/tabs/GrossProfit'

import T1_PaymentPerformance from './tabs/T1_PaymentPerformance'
import T2_DeliveryPerformance from './tabs/T2_DeliveryPerformance'
import T8_AttractInvestment from '@/views/BIView/ProductSupply/NewRetailCockpit/tabs/T3_AttractInvestment'
import T9_EffectiveFlow from "./tabs/T9_EffectiveFlow";
import T10_PromotionRate from './tabs/T10_PromotionRate'
import T13_BStoreMarketShare from './tabs/T13_BStoreMarketShare'


export default {
  name: 'StrikeCockpit',

  components:{
    HeaderItem,
    T2_Activity,
    BShopDSR,
    T1_PaymentPerformance,
    KAReach,
    CityYOY,
    StoreBPreSale,
    UnsalableAmount,
    GuestList,
    GrossProfit,

    T2_DeliveryPerformance,
    T8_AttractInvestment,
    T9_EffectiveFlow,
    T10_PromotionRate,
    T13_BStoreMarketShare,
  },

  async created() {
    this.curTab = this.tabs[0]
    this.GetIndexSet();
    // let res = await this.$fetchSql('ALL_USER', 'getMenuIdAbsolutePathByVersionMainNum', {
    //     versionMainNum: 'BI_PC_2019_00466'
    // })
    //   console.log('http://test.bi.linshimuye.com:9090/x/' + res.data[0].ID_ABSOLUTE_PATH)
  },

  mounted() {
    // this.data_setTimeout(this)   //设置了5秒刷新一次豆腐块数据
  },
  data() {
    return {
      tabs: [
        { title: '支付业绩', comp: 'T1_PaymentPerformance' },
        { title: '发货业绩', comp: 'T2_DeliveryPerformance' },
        { title: '活动蓄水', comp: 'T2_Activity' },
        { title: 'B店预售', comp: 'StoreBPreSale' },
        { title: '采购毛利率', comp: 'GrossProfit' },
        { title: 'KA达成', comp: 'KAReach' },
        { title: '城市同增', comp: 'CityYOY' },
        { title: '开店完成率', comp: 'T8_AttractInvestment' },
        { title: '有效流量', comp: 'T9_EffectiveFlow' },
        { title: '推广费率', comp: 'T10_PromotionRate' },
        { title: '客单价', comp: 'GuestList' },
        { title: '滞销金额', comp: 'UnsalableAmount' },
        { title: 'B店市占', comp: 'T13_BStoreMarketShare' },
        { title: 'B店DSR', comp: 'BShopDSR' },
      ],
      curTab: {},
      HeaderItemArr: [
        {
          label: '支付业绩',
          value: null,
          label1: '月累计达成',
          value1: null,
          label2: '日累计达成',
          value2: null,
          numType: 1,
          comp: 'T1_PaymentPerformance',
        },
        {
          label: '发货业绩',
          value: null,
          label1: '月累计达成',
          value1: null,
          label2: '日累计达成',
          value2: null,
          numType: 2,
          comp: 'T2_DeliveryPerformance',
        },
        {
          label: '活动蓄水',
          subTitle: '(21年双11)',
          value: null,
          label1: '活动总达成',
          value1: null,
          label2: '日累计达成',
          value2: null,
          numType: 3,
          comp: 'T2_Activity',
        },
        {
          label: 'B店预售',
          subTitle: '(21年11.04预售)',
          value: null,
          // label1: '活动目标',
          label1: '活动总达成',
          value1: null,
          // label2: '累计达成',
          label2: '日累计达成',
          value2: null,
          numType: 4,
          comp: 'StoreBPreSale',
        },
        {
          label: '采购毛利率',
          subTitle: '(锁定成本)',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 5,
          comp: 'GrossProfit',
        },
        {
          label: 'KA金额',
          value: null,
          label1: '年累计达成',
          value1: null,
          label2: '月累计达成',
          value2: null,
          numType: 6,
          comp: 'KAReach',
        },
        {
          label: '城市同增',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差额',
          value2: null,
          numType: 7,
          comp: 'CityYOY',
        },
        {
          label: '开店完成率',
          subTitle: '(2022年1月~5月)',
          value: null,
          label1: '目标',
          value1: null,
          label2: '目标差值',
          value2: null,
          numType: 8,
          comp: 'T8_AttractInvestment',
        },
        {
          label: '有效流量',
          value: null,
          label1: '月累计达成',
          value1: null,
          label2: '日累计达成',
          value2: null,
          numType: 9,
          comp: 'T9_EffectiveFlow',
        },
        {
          label: '推广费率',
          value: null,
          label1: '同期',
          value1: null,
          label2: '同比',
          value2: null,
          numType: 10,
          comp: 'T10_PromotionRate',
        },
        {
          label: '客单价',
          value: null,
          label1: '同期',
          value1: null,
          label2: '同比',
          value2: null,
          numType: 11,
          comp: 'GuestList',
        },
        {
          label: '滞销金额',
          value: null,
          label1: '目标',
          value1: null,
          label2: '占总库存比',
          value2: null,
          value3: null,
          numType: 12,
          comp: 'UnsalableAmount',
        },
        {
          label: 'B店金额市占',
          subTitle: '(天猫市场)',
          value: null,
          label1: '源氏',
          value1: null,
          label2: '全友',
          value2: null,
          numType: 13,
          comp: 'T13_BStoreMarketShare',
        },
        {
          titlenam:'B店DSR',
          subTitle:'同行对比',
          label: '描述',
          value: {val:1,ago:2},
          label1: '服务',
          value1: {val:11,ago:22},
          label2: '物流',
          value2: {val:111,ago:222},
          numType: 14,
          comp: 'BShopDSR',
        },
      ],

      defaultState: false,
      currentIndex: 0,

    }
  },
  methods:{

    async data_setTimeout(set_val){
      setTimeout(()=>{
        set_val.GetIndexSet()
        set_val.data_setTimeout(set_val);
      },5000);
    },

    async GetIndexSet() {
      let res = await this.$fetchSql('all_center', 'all_center_set');
      let res_xin = await this.$fetchSql('new_retail', 'new_retail_set');
      let res_BShop = await this.$fetchSql('all_center', 'all_center_b_advnc_kpi');
      let res_Open = await this.$fetchSql('new_retail', 'new_retail_set_open');
      let res_DSR = await this.$fetchSql('kpi_report','index_set');
      if(res.data.length>0){
        Object.keys(this.HeaderItemArr).forEach((OnKey) => {
          if(this.HeaderItemArr[OnKey].numType===1){
            // 支付业绩
            this.HeaderItemArr[OnKey].value=res.data[0].MTD_PAY_AMT
            this.HeaderItemArr[OnKey].value1=res.data[0].MTD_PAY_FIN_RATE
            this.HeaderItemArr[OnKey].value2=res.data[0].PTD_PAY_FIN_RATE
          }else if(this.HeaderItemArr[OnKey].numType===2){
            // 发货业绩
            this.HeaderItemArr[OnKey].value=res.data[0].MTD_SEND_AMT
            this.HeaderItemArr[OnKey].value1=res.data[0].MTD_SEND_FIN_RATE
            this.HeaderItemArr[OnKey].value2=res.data[0].PTD_SEND_FIN_RATE
          }else if(this.HeaderItemArr[OnKey].numType===5){
            // 采购毛利率
            this.HeaderItemArr[OnKey].value=res.data[0].MTD_CGML_RAT
            this.HeaderItemArr[OnKey].value1=res.data[0].MTD_CGML_RATE_TGT
            this.HeaderItemArr[OnKey].value2=res.data[0].MTD_CGML_RATE_DIFF
          }else if(this.HeaderItemArr[OnKey].numType===6){
            // KA全年达成
            this.HeaderItemArr[OnKey].value=res.data[0].MTD_KA_AMT
            this.HeaderItemArr[OnKey].value1=res.data[0].YTD_KA_RATE
            this.HeaderItemArr[OnKey].value2=res.data[0].MTD_KA_RATE
          }else if(this.HeaderItemArr[OnKey].numType===7){
            // 城市同增
            this.HeaderItemArr[OnKey].value=res.data[0].MTD_CITY_INC_RATE
            this.HeaderItemArr[OnKey].value1=res.data[0].MTD_CITY_INC_TGT
            this.HeaderItemArr[OnKey].value2=res.data[0].MTD_CITY_INC_DIFF
          }else if(this.HeaderItemArr[OnKey].numType===9){
            // 有效流量
            this.HeaderItemArr[OnKey].value=res.data[0].MTD_EFFECT_FLOW_CNT
            this.HeaderItemArr[OnKey].value1=res.data[0].MTD_EFFECT_FLOW_RATE
            this.HeaderItemArr[OnKey].value2=res.data[0].PTD_EFFECT_FLOW_RATE
          }else if(this.HeaderItemArr[OnKey].numType===10){
            // 推广费率
            this.HeaderItemArr[OnKey].value=res.data[0].MTD_TG_RATE
            this.HeaderItemArr[OnKey].value1=res.data[0].AGO_TG_RATE
            this.HeaderItemArr[OnKey].value2=res.data[0].MTD_TG_RATE_YOY
          }else if(this.HeaderItemArr[OnKey].numType===11){
            // 客单价
            this.HeaderItemArr[OnKey].value=res.data[0].MTD_UNIT_PRICEK
            this.HeaderItemArr[OnKey].value1=res.data[0].AGO_UNIT_PRICEK
            this.HeaderItemArr[OnKey].value2=res.data[0].MTD_UNIT_PRICEK_YOY
          }else if(this.HeaderItemArr[OnKey].numType===12){
            // 滞销金额
            this.HeaderItemArr[OnKey].value=res.data[0].MTD_FRCST_AMT
            this.HeaderItemArr[OnKey].value1=res.data[0].MTD_FRCST_TGT
            this.HeaderItemArr[OnKey].value2=res.data[0].MTD_FRCST_RATE
            this.HeaderItemArr[OnKey].value3=res.data[0].MTD_TOT_FRCST_RATE
          }else if(this.HeaderItemArr[OnKey].numType===13){
            // B店市占
            this.HeaderItemArr[OnKey].value=res.data[0].MTD_LSMY_RATE
            this.HeaderItemArr[OnKey].value1=res.data[0].MTD_YSMY_RATE
            this.HeaderItemArr[OnKey].value2=res.data[0].MTD_QYJJ_RATE


          }
          // else if(this.HeaderItemArr[OnKey].numType===14){
          //   // B店DSR
          //   // this.HeaderItemArr[OnKey].value=res.data[0].MTD_BD_DSR
          //   // this.HeaderItemArr[OnKey].value1=res.data[0].MTD_BD_DSR_PEER
          //   // this.HeaderItemArr[OnKey].value2=res.data[0].MTD_BD_DSR_DIFF
          // }

        });
      }
      if(res_xin.data.length>0){
        Object.keys(this.HeaderItemArr).forEach((OnKey) => {
          if(this.HeaderItemArr[OnKey].numType===3){
            // 活动蓄水
            this.HeaderItemArr[OnKey].value=res_xin.data[0].XS_AMT
            this.HeaderItemArr[OnKey].value1=res_xin.data[0].XS_AMT_TGT
            this.HeaderItemArr[OnKey].value2=res_xin.data[0].XS_AMT_FIN_RATE
            this.HeaderItemArr[OnKey].subTitle=res_xin.data[0].ACTIVITY_NAME
          }
        });
      }
      if(res_BShop.data.length>0){
        Object.keys(this.HeaderItemArr).forEach((OnKey) => {
          if(this.HeaderItemArr[OnKey].numType===4){
            // B店预售
            this.HeaderItemArr[OnKey].value=res_BShop.data[0].MTD_YS_AMT
            this.HeaderItemArr[OnKey].value1=res_BShop.data[0].MTD_YS_FIN_RATE
            this.HeaderItemArr[OnKey].value2=res_BShop.data[0].MTD_YS_TGT
            this.HeaderItemArr[OnKey].subTitle=res_BShop.data[0].YS_ACTIVITY_NAME
          }
        });
      }
      if(res_Open.data.length>0){
        Object.keys(this.HeaderItemArr).forEach((OnKey) => {
          if(this.HeaderItemArr[OnKey].numType===8){
            // 开店完成率
            this.HeaderItemArr[OnKey].value=res_Open.data[0].OPEN_SHOP_FIN_RAT
            this.HeaderItemArr[OnKey].value1=res_Open.data[0].OPEN_SHOP_FIN_RAT_TGT
            this.HeaderItemArr[OnKey].value2=res_Open.data[0].OPEN_SHOP_FIN_RAT_DIF
            this.HeaderItemArr[OnKey].subTitle='('+res_Open.data[0].MON+')'
          }
        });
      }
      if(res_DSR.data.length>0){
        Object.keys(this.HeaderItemArr).forEach((OnKey) => {
          if(this.HeaderItemArr[OnKey].numType===14){
            // B店DSR
            this.HeaderItemArr[OnKey].value.val=res_DSR.data[0].DESCRIBE;
            this.HeaderItemArr[OnKey].value.ago=res_DSR.data[0].DESCRIBE_PEER;
            this.HeaderItemArr[OnKey].value1.val=res_DSR.data[0].SERVICE;
            this.HeaderItemArr[OnKey].value1.ago=res_DSR.data[0].SERVICE_PEER;
            this.HeaderItemArr[OnKey].value2.val=res_DSR.data[0].LOGISTICS;
            this.HeaderItemArr[OnKey].value2.ago=res_DSR.data[0].LOGISTICS_PEER;
          }
        });


      }

    },


    computeClass(comp, index) {
      if (!this.defaultState) return
      if (!comp) return
      if (comp === 'T1_OpenAShop' && this.currentIndex === index) return 'active'
      else if (comp !== 'T1_OpenAShop') return comp === this.curTab.comp ? 'active' : ''
    },
    changeTabV1(comp, numType, index, e) {
      this.defaultState = true
      if (this.curTab.comp === comp && comp !== 'T1_OpenAShop') return
      if (!comp) return
      this.curTab = this.tabs.filter((_) => _.comp === comp)[0]
      if (comp === 'T1_OpenAShop') {
        this.$nextTick(() => {
          this.$refs.curComp.type = index === 1 ? 'deliver' : 'pay'
        })
      }
      this.currentIndex = index
    },

  }
}
</script>

<style lang="scss">
.StrikeCockpitSelect{
    .ant-select-dropdown-menu-item{
        font-size: 12px;
    }
}
</style>
<style lang="scss" scoped>
// .ant-pagination
/deep/ .ant-pagination{
    font-size: 12px;
    .ant-pagination-total-text{
        height: 28px;
        line-height: 26px;
    }
    .ant-pagination-item, .ant-pagination-prev, .ant-pagination-next{
        height: 28px;
        width: 28px;
        min-width: 28px;
        line-height: 26px;
    }
}
// btn
/deep/ .ant-btn{
    font-size: 12px;
    height: 28px;
}
// tab
/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-nav-container{
    height: 28px!important;
    line-height: 28px!important;
}
/deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab{
    height: 28px!important;
    line-height: 26px!important;
    font-size: 12px;
}
// VirtualSelect
/deep/ .custom-checkbox-label{
    height: 30px;
    line-height: 26px;
}
/deep/ .custom-checkbox-label:before {
    margin-top: 6px;
}
/deep/ .custom-checkbox-label:after {
    top: 7px;
}
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
// radio
/deep/ span.ant-radio + *{
    padding-left: 3px;
    font-size: 12px;
}
/deep/ .ant-radio-group{
    display: flex;
    align-items: center;
}
/deep/ .ant-radio-wrapper{
    display: flex;
    align-items: center;
}
// checkbox
/deep/ .ant-checkbox + span{
    padding-left: 3px;
    font-size: 12px;
}
// select
/deep/ .ant-select-selection--single{
    height: 28px;
    font-size: 12px;
}
/deep/ .ant-select{
    font-size: 12px;
}
/deep/ .ant-select-selection__rendered{
    line-height: 26px!important;
}
/deep/ .ant-select-selection--multiple{
    height: 28px;
    min-height: 28px;
    .ant-select-selection__rendered > ul > li{
        height: 20px;
        line-height: 19px;
    }
}
// input
/deep/ .ant-input{
    height: 28px;
}
/deep/ .ant-calendar-picker-input.ant-input {
  font-size: 12px;
}
/deep/ .echarts {
    overflow: visible!important;
}
.StrikeCockpit {
  width: 100%;
  background: #f5f6fa;
  height: 100vh;
  min-width: 1550px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: overlay;
  .header {
    display: flex;
    flex-wrap: wrap;
    .headerItem {
      transition: all 0.3s;
    }
    .headerItem:hover {
      transform: translateY(-5px);
      box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2), 0 3px 4px 2px rgba(0, 0, 0, 0.12);
    }
    .active {
      transform: translateY(-5px);
      box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2), 0 3px 4px 2px rgba(0, 0, 0, 0.12);
    }
  }
  .content {
    flex: 1;
    min-height: 580px;
    border-radius: 6px;
    background: #fff;
    padding: 10px 20px;
  }
  /deep/ .AttractInvestment .main{
      height: calc(100% - 38px)!important;
  }
}
</style>