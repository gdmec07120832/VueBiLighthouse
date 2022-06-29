<template>
  <div class="NewRetailCockpit">
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
import { dragscroll } from 'vue-dragscroll'
import HeaderItem from './components/HeaderItem.vue'
import T1_OpenAShop from '@/views/BIView/ProductSupply/NewRetailCockpit/tabs/T1_OpenAShop'
import T2_Activity from '@/views/BIView/ProductSupply/NewRetailCockpit/tabs/T2_Activity'
import T3_AttractInvestment from './tabs/T3_AttractInvestment'
import T4_BD from './tabs/T4_BD'

import T5_PoorRatingRate from './tabs/T5_PoorRatingRate'
import T6_Racquet from './tabs/T6_Racquet'
import T7_Deal from './tabs/T7_Deal'
import T8_CustomerUnitPrice from './tabs/T8_CustomerUnitPrice'
import T9_PromotionCost from './tabs/T9_PromotionCost'
import T10_StoreProfitRate from './tabs/T10_StoreProfitRate'

import SFPinRate from '@/views/BIView/ProductSupply/NewRetailCockpit/tabs/SFPinRate'
import TuRateOfRetCap from '@/views/BIView/ProductSupply/NewRetailCockpit/tabs/TuRateOfRetCap'
import HousekeepS from '@/views/BIView/ProductSupply/NewRetailCockpit/tabs/HousekeepS'
import { Row } from 'ant-design-vue'
import moment from 'moment'

export default {
  name: 'NewRetailCockpit',
  directives: {
    dragscroll,
  },
  components: {
    HeaderItem,
    T1_OpenAShop,
    T2_Activity,
    T3_AttractInvestment,
    T4_BD,
    T5_PoorRatingRate,
    T6_Racquet,
    T7_Deal,
    T8_CustomerUnitPrice,
    T9_PromotionCost,
    T10_StoreProfitRate,
    SFPinRate,
    TuRateOfRetCap,
    HousekeepS,
  },
  async created() {
    this.curTab = this.tabs[2]
      localStorage.setItem('NewRetailCockpitCurrentMode', JSON.stringify({...this.curTab, currentWeb: '新零售驾驶舱', currentIndex: this.currentIndex}))
      this.GetIndexSet()
      this.getOpenRate()
  },

  mounted() {
    this.data_setTimeout(this)   //设置了5秒刷新一次豆腐块数据
    this.GetTimeD();
  },
  watch: {
      curTabAndCurrentIndex: {
          handler(val) {
              let obj = {
                  ...this.curTab,
                  currentWeb: '新零售驾驶舱',
                  currentIndex: this.currentIndex,
              }
              localStorage.setItem('NewRetailCockpitCurrentMode', JSON.stringify(obj))
          },
          deep: true,
      }
  },
  beforeDestroy() {
      localStorage.removeItem('NewRetailCockpitCurrentMode')
  },
  computed: {
    curTabAndCurrentIndex() {
      return this.curTab + this.currentIndex
    }
  },
  data() {
    return {
      tabs: [
        { title: '发货业绩', comp: 'T1_OpenAShop', CUBE_NAME: '发货业绩' },
        { title: '支付业绩', comp: 'T1_OpenAShop', CUBE_NAME: '支付业绩' },
        { title: '开店完成率', comp: 'T3_AttractInvestment', CUBE_NAME: '招商开店' },
        { title: '活动蓄水', comp: 'T2_Activity', CUBE_NAME: '活动蓄水' },
        { title: 'BD货占比', comp: 'T4_BD', CUBE_NAME: '货品结构' },
        { title: '差评率', comp: 'T5_PoorRatingRate', CUBE_NAME: '差评率' },
        { title: '网拍业绩', comp: 'T6_Racquet', CUBE_NAME: '网拍业绩' },
        { title: '成交毛利率', comp: 'T7_Deal', CUBE_NAME: '毛利率' },
        { title: '客单价', comp: 'T8_CustomerUnitPrice', CUBE_NAME: '客单价' },
        { title: '线上投放费用', comp: 'T9_PromotionCost', CUBE_NAME: '投放费用' },
        { title: '门店盈利率', comp: 'T10_StoreProfitRate', CUBE_NAME: '门店盈利' },
        { title: '主动摆场动销率', comp: 'SFPinRate', CUBE_NAME: '主体摆场' },
        { title: '付费留资成交率', comp: 'TuRateOfRetCap', CUBE_NAME: '留资转化' },
        { title: '内务评分', comp: 'HousekeepS', CUBE_NAME: '内务评分' },
      ],
      curTab: {},
      HeaderItemArr: [
        {
          label: '年累开店完成率',
          subTitle: '(2022年1月-4月)',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 21,
          comp: 'T3_AttractInvestment',
        },
        {
          label: '年累门店盈利比例',
          subTitle: '(2022年1月-3月)',
          value: null,
          label1: '上期',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 32,
          comp: 'T10_StoreProfitRate',
        },
        {
          label: '发货业绩',
          value: null,
          label1: '月累计达成',
          value1: null,
          label2: '日累计达成',
          value2: null,
          numType: 0,
          comp: 'T1_OpenAShop',
        },
        {
          label: '支付业绩',
          value: null,
          label1: '月累计达成',
          value1: null,
          label2: '日累计达成',
          value2: null,
          numType: 1,
          comp: 'T1_OpenAShop',
        },
        {
          label: '活动蓄水',
          subTitle: '(21年双11)',
          value: null,
          label1: '活动总达成',
          value1: null,
          label2: '日累计达成',
          value2: null,
          numType: 22,
          comp: 'T2_Activity',
        },
        {
          label: '网拍业绩',
          value: null,
          label1: '支付占比',
          value1: null,
          label2: '日累计同比',
          value2: null,
          numType: 23,
          comp: 'T6_Racquet',
        },
        {
          label: 'BD发货占比',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 24,
          comp: 'T4_BD',
        },
        {
          label: '客单价',
          subTitle: '(成品店)',
          value: null,
          label1: '同期',
          value1: null,
          label2: '同比',
          value2: null,
          numType: 25,
          comp: 'T8_CustomerUnitPrice',
        },
        {
          label: '主体摆场动销率',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 26,
          comp: 'SFPinRate',
        },
        {
          label: '内务评分',
          subTitle: '(2022年4月)',
          value: null,
          label1: '上月',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 27,
          comp: 'HousekeepS',
        },
        {
          label: '差评率',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 28,
          comp: 'T5_PoorRatingRate',
        },
        {
          label: '线上投放费用',
          value: null,
          label1: '付费留资数',
          value1: null,
          label2: '留资成本',
          value2: null,
          numType: 29,
          comp: 'T9_PromotionCost',
        },
        {
          label: '付费留资成交率',
          subTitle: '(近120天)',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 30,
          comp: 'TuRateOfRetCap',
        },
        {
          label: '成交毛利率',
          subTitle: '(成品)',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 31,
          comp: 'T7_Deal',
        },
      ],
      defaultState: false,
      currentIndex: 0,
    }
  },
  methods: { 

    async GetTimeD(){
      let res = await this.$fetchSql('new_retail', 'new_retail_dateon',);
      if(res.data){
        Object.keys(this.HeaderItemArr).forEach((OnKey) => {
          if(this.HeaderItemArr[OnKey].numType===27){
            this.HeaderItemArr[OnKey].subTitle='('+moment(res.data[0].DATEON).format('YYYY年M月')+')';
          }else if(this.HeaderItemArr[OnKey].numType===21){
            this.HeaderItemArr[OnKey].subTitle='('+moment(new Date()).format('YYYY年')+'1月'+
              '~'+moment(new Date()).format('M月')+')';
          }
        });
      }

      let res_2 = await this.$fetchSql('new_retail', 'new_retail_shop_profit_load',);
      if(res_2.data){
        Object.keys(this.HeaderItemArr).forEach((OnKey2) => {
          if(this.HeaderItemArr[OnKey2].numType===32){
            this.HeaderItemArr[OnKey2].subTitle='('+moment(res_2.data[0].LOAD_TIME).format('YYYY年')+'1月'+
              '~'+moment(res_2.data[0].LOAD_TIME).format('M月')+')';
          }
        });
      }

    },

    async data_setTimeout(set_val){
      setTimeout(()=>{
        set_val.GetIndexSet()
        set_val.getOpenRate()
        set_val.data_setTimeout(set_val);
      },5000);
    },
    //  开店完成率 单独接口
    async getOpenRate(){
      let res = await this.$fetchSql('new_retail', 'new_retail_set_open')
      let index = this.HeaderItemArr.map(_ => _.numType).indexOf(21)
      this.HeaderItemArr[index].value = res.data[0].OPEN_SHOP_FIN_RAT
      this.HeaderItemArr[index].value1 = res.data[0].OPEN_SHOP_FIN_RAT_TGT
      this.HeaderItemArr[index].value2 = res.data[0].OPEN_SHOP_FIN_RAT_DIF
    },
    async GetIndexSet() {
      let res = await this.$fetchSql('new_retail', 'new_retail_set');
      let resNeiWu = await this.$fetchSql('new_retail','new_retail_set_interior'); 
      if(res.data[0]){
        Object.keys(this.HeaderItemArr).forEach((OnKey) => {
          // if(this.HeaderItemArr[OnKey].numType===21){
          //   // 年累开店完成率
          //   this.HeaderItemArr[OnKey].value=res.data[0].OPEN_SHOP_FIN_RAT
          //   this.HeaderItemArr[OnKey].value1=res.data[0].OPEN_SHOP_FIN_RAT_TGT
          //   this.HeaderItemArr[OnKey].value2=res.data[0].OPEN_SHOP_FIN_RAT_DIF
          // }else
          if(this.HeaderItemArr[OnKey].numType===0){
            // 发货业绩
            this.HeaderItemArr[OnKey].value=res.data[0].DLVR_AMT
            this.HeaderItemArr[OnKey].value1=res.data[0].MTD_DLVR_FIN_RATE
            this.HeaderItemArr[OnKey].value2=res.data[0].DLVR_FIN_RATE
          }else if(this.HeaderItemArr[OnKey].numType===1){
            // 支付业绩
            this.HeaderItemArr[OnKey].value=res.data[0].PAY_AMT
            this.HeaderItemArr[OnKey].value1=res.data[0].MTD_PAY_FIN_RATE
            this.HeaderItemArr[OnKey].value2=res.data[0].PAY_FIN_RATE
          }else if(this.HeaderItemArr[OnKey].numType===22){
            // 活动蓄水
            this.HeaderItemArr[OnKey].value=res.data[0].XS_AMT
            this.HeaderItemArr[OnKey].value1=res.data[0].XS_AMT_TGT
            this.HeaderItemArr[OnKey].value2=res.data[0].XS_AMT_FIN_RATE
            this.HeaderItemArr[OnKey].subTitle=res.data[0].ACTIVITY_NAME
          }else if(this.HeaderItemArr[OnKey].numType===23){
            // 网拍业绩
            this.HeaderItemArr[OnKey].value=res.data[0].WP_AMT
            this.HeaderItemArr[OnKey].value1=res.data[0].WP_RAT
            this.HeaderItemArr[OnKey].value2=res.data[0].WP_RAT_YOY
          }else if(this.HeaderItemArr[OnKey].numType===24){
            // BD货占比
            this.HeaderItemArr[OnKey].value=res.data[0].BD_RAT
            this.HeaderItemArr[OnKey].value1=res.data[0].BD_RAT_TGT
            this.HeaderItemArr[OnKey].value2=res.data[0].BD_RAT_DIF
          }else if(this.HeaderItemArr[OnKey].numType===25){
            // 客单价
            this.HeaderItemArr[OnKey].value=res.data[0].UNIT_PRICEK
            this.HeaderItemArr[OnKey].value1=res.data[0].UNIT_PRICE_MOM
            this.HeaderItemArr[OnKey].value2=res.data[0].UNIT_PRICE_MOM_DIF
          }else if(this.HeaderItemArr[OnKey].numType===26){
            // 主体摆场动销率
            this.HeaderItemArr[OnKey].value=res.data[0].DX_RAT
            this.HeaderItemArr[OnKey].value1=res.data[0].DX_RAT_TGT
            this.HeaderItemArr[OnKey].value2=res.data[0].DX_RAT_DIF
          }
          // else if(this.HeaderItemArr[OnKey].numType===27){
          //   // 内务评分
          //   this.HeaderItemArr[OnKey].value=res.data[0].NW_SCORE
          //   this.HeaderItemArr[OnKey].value1=res.data[0].NW_SCORE_MOM
          //   this.HeaderItemArr[OnKey].value2=res.data[0].NW_SCORE_MOM_DIF
          // }
          else if(this.HeaderItemArr[OnKey].numType===28){
            // 差评率
            this.HeaderItemArr[OnKey].value=res.data[0].BAD_RAT
            this.HeaderItemArr[OnKey].value1=res.data[0].BAD_RAT_TGT
            this.HeaderItemArr[OnKey].value2=res.data[0].BAD_RAT_DIF
          }else if(this.HeaderItemArr[OnKey].numType===29){
            // 线上投放费用
            this.HeaderItemArr[OnKey].value=res.data[0].COST
            this.HeaderItemArr[OnKey].value1=res.data[0].LZ_NUM
            this.HeaderItemArr[OnKey].value2=res.data[0].LZ_COST
          }else if(this.HeaderItemArr[OnKey].numType===30){
            // 付费留资成交率
            this.HeaderItemArr[OnKey].value=res.data[0].FFCJ_LA_RAT
            this.HeaderItemArr[OnKey].value1=res.data[0].TGT_FFCJ_LA_RAT
            this.HeaderItemArr[OnKey].value2=res.data[0].FFCJ_LA_RAT_DIF
          }else if(this.HeaderItemArr[OnKey].numType===31){
            // 成交毛利率
            this.HeaderItemArr[OnKey].value=res.data[0].CJML_RAT
            this.HeaderItemArr[OnKey].value1=res.data[0].CJML_RAT_TGT
            this.HeaderItemArr[OnKey].value2=res.data[0].CJML_RAT_DIF
          }else if(this.HeaderItemArr[OnKey].numType===32){
            // 年累门店盈利比例
            this.HeaderItemArr[OnKey].value=res.data[0].YL_RAT
            this.HeaderItemArr[OnKey].value1=res.data[0].LAST_YL_RAT
            this.HeaderItemArr[OnKey].value2=res.data[0].YL_RAT_DIFF

          }
        })        
      }

      if(resNeiWu.data[0]){
        Object.keys(this.HeaderItemArr).forEach((OnKey2) => {
          if(this.HeaderItemArr[OnKey2].numType===27){
            // 内务评分
            this.HeaderItemArr[OnKey2].value=resNeiWu.data[0].NW_SCORE
            this.HeaderItemArr[OnKey2].value1=resNeiWu.data[0].NW_SCORE_MOM
            this.HeaderItemArr[OnKey2].value2=resNeiWu.data[0].NW_SCORE_MOM_DIF
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
      // if(e && e.offsetX > e.target.offsetWidth * 1 - 10) return
      if (this.curTab.comp === comp && comp !== 'T1_OpenAShop') return
      if (!comp) return
      this.curTab = this.tabs.filter((_) => _.comp === comp)[0]
      if (comp === 'T1_OpenAShop') {
        this.$nextTick(() => {
          this.$refs.curComp.type = index === 2 ? 'deliver' : 'pay'
        })
        if(numType === 0) this.curTab = this.tabs.filter(_ => _.title === '发货业绩')[0]
        else if(numType === 1) this.curTab = this.tabs.filter(_ => _.title === '支付业绩')[0]
      }
      this.currentIndex = index
    },
  },
}
</script>

<style lang="scss">
.NewRetailCockpitSelect{
    .ant-select-dropdown-menu-item{
        font-size: 12px;
    }
}
</style>
<style lang="scss" scoped>
// radio
/deep/ .ant-radio-wrapper{
    span.ant-radio + *{
        padding-left: 0;
        font-size: 12px;
        line-height: 21px;
    }
}
// checkbox
/deep/ .ant-checkbox + span{
    padding-left: 0;
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
    line-height: 26px;
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
.NewRetailCockpit {
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
      //background: rgba(70,188,160, 0.1);
      box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2), 0 3px 4px 2px rgba(0, 0, 0, 0.12);
      //box-shadow: 0 1px 6px 0 rgba(0, 250, 154, 0.2), 0 1px 4px 0 rgba(0,250,154, 0.12);
    }
    .active {
      transform: translateY(-5px);
      box-shadow: 0 3px 6px 2px rgba(0, 0, 0, 0.2), 0 3px 4px 2px rgba(0, 0, 0, 0.12);

      //box-shadow: 0 1px 6px 3px rgba(0,168,84, 0.5), 0 1px 4px 3px rgba(0,168,84, 0.4);
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