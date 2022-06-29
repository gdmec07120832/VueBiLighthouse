<template>
  <div class="page-wrapper">
    <!-- <div class="s-board__wrapper">
      <div class="s-board__item" v-for="(item, index) in sBoard"
           :key="index">
        <div class="s-board__content">
          <div class="s-board__content-left">
            <p>
              <span style="position: relative">
                {{ item.name }}
                <span class="remark text-xs text-gary" v-if="item.subName">{{ item.subName }}</span>
              </span>
            </p>
            <div class="text-xl" :class="[`text-${item.vc}`]">{{ item.v }}</div>
          </div>
          <div class="s-board__content-right" style="grid-area: a">
            <div class="text-gary">{{ item.af }}</div>
            <div :class="[`text-${item.afv_c}`]">{{ item.afv }}</div>
          </div>
          <div class="s-board__content-right text-xs" style="grid-area: b">
            <div class="text-gary">{{ item.bf }}</div>
            <div :class="`text-${item.bfv_c}`">{{ item.bfv }}</div>
          </div>
        </div>
      </div>
    </div>   -->

      <!-- 2022-04-23 疾风 迭代内容 -->
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
      <!-- 2022-04-23 疾风 迭代内容 -->



    <div class="s-tabs" style="margin-top: 0px;">
      <div class="comp-tabs">
        <div class="flex-start">
          <div class="tab-item" @click="[activeTab = item,Unhighlight=false]" :class="{active: activeTab === item}"
               v-for="item in tabs" :key="item.name">
            <span class="text-gary">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <Component :style="{'padding': activeTab.name == '渠道业绩' ?'0 15px': ''}" :is="currentComponent" ref="curComp"/>
    </div>
  </div>
</template>

<script>
// import ChannelPerf from '@/views/BIView/PsDashboard/Tabs/ChannelPerf/ChannelPerf'
import LivePerfV2 from '@/views/BIView/PsDashboard/Tabs/LivePerf/LivePerfNew'
// import LivePerfV2 from '@/views/BIView/OperateDashboard/Tabs/LivePerf/LivePerf' 


// import ChannelPerf from '@/views/BIView/OperateDashboard/Tabs/ChannelPerf/ChannelPerfV2'
import ChannelPerf from '@/views/BIView/OperateDashboard/Tabs/ChannelPerf/ChannelPerfV2'

import AnnualizedTurnover from '@/views/BIView/PsDashboard/Tabs/AnnualizedTurnover/AnnualizedTurnover'
import NewProductOverview from '@/views/BIView/PsDashboard/Tabs/NewProductOverview/NewProductOverview'
import AssessmentSummary from '@/views/BIView/PsDashboard/Tabs/AssessmentSummary/AssessmentSummary'
import InventoryOverview from '@/views/BIView/PsDashboard/Tabs/InventoryOverview/InventoryOverview'
import PurchaseProfit from '@/views/BIView/PsDashboard/Tabs/PurchaseProfit/PurchaseProfit'
import BadAfterSale from '@/views/BIView/PsDashboard/Tabs/BadAfterSale/BadAfterSale'
import UnsalableAmt from '@/views/BIView/PsDashboard/Tabs/UnsalableAmt/UnsalableAmt'
import SupplementCharts from '@/views/BIView/PsDashboard/Tabs/SupplementCharts/SupplementCharts'
import FinishProductCharts from '@/views/BIView/PsDashboard/Tabs/FinishProductCharts/FinishProductCharts'
import ShortShippedCharts from '@/views/BIView/PsDashboard/Tabs/ShortShippedOverview/ShortShippedCharts'

import DeliveryPerf from '@/views/BIView/PsDashboard/Tabs/DeliveryPerf/DeliveryPerf'

import SkuAvg from '@/views/BIView/PsDashboard/Tabs/SkuAvg/SkuAvg'

import TeamSale from '@/views/BIView/PsDashboard/Tabs/TeamSale/TeamSale'
import KpiDesc from '@/views/BIView/PsDashboard/Tabs/KpiDesc/KpiDesc'
import { formatNumber } from '@/utils/helper'

import HeaderItem from '@/views/BIView/PsDashboard/components/HeaderItem.vue'

const formatY = (num) => {
  return typeof num !== 'number' ? '--' : formatNumber(num, 100000000) + '亿'
}
const formatW = (num, digits = 2) => {
  return typeof num !== 'number' ? '--' : formatNumber(num, 10000, digits) + '万'
}

const transPercent = (num) => {
  return typeof num !== 'number' ? '--' : (num * 100).toFixed(2) + '%'
}

const Blank = {
  render() {
    return <div class="px15 text-gary">开发中...</div>
  },
}
export default {
  name: 'PsDashboard',
  components:{
    HeaderItem,
  },

  data() {
    return {
      sBoard: [
        {
          name: '支付业绩',
          v: '--',
          vc: '',
          af: '日累计达成率',
          afv: '--',
          afv_c: '',
          bf: '日累计同比',
          bfv: '',
          bfv_c: '',
        },
        {
          name: '发货业绩',
          v: '--',
          vc: '',
          af: '日累计达成率',
          afv: '--',
          afv_c: '',
          bf: '日累计同比',
          bfv: '--',
          bfv_c: '',
        },
        {
          name: 'SKU均值',
          v: '--',
          vc: '',
          af: '目标达成率',
          afv: '',
          afv_c: '',
          bf: '同比',
          bfv: '--',
          bfv_c: '',
        },
        {
          name: '新品业绩',
          v: '--',
          vc: '',
          af: '日累计达成率',
          afv: '--',
          afv_c: '',
          bf: '日累计同比',
          bfv: '--',
          bfv_c: '',
        },
        {
          name: '日均订单欠货', subName: '(成品项目组、销售额)', v: '--', vc: '',
          af: '目标', afv: '--', afv_c: '',
          bf: '差值', bfv: '--', bfv_c: ''
        },
        {
          name: '日均商品欠货', subName: '(成品项目组、采购额)', v: '--', vc: '',
          af: '目标', afv: '--', afv_c: '',
          bf: '差值', bfv: '--', bfv_c: ''
        },
        {
          name: '成品达交率',
          v: '--',
          vc: '',
          af: '目标',
          afv: '--',
          afv_c: '',
          bf: '差值',
          bfv: '--',
          bfv_c: '',
        },
        {
          name: '库存',
          v: '--',
          vc: '',
          af: '同期库存',
          afv: '--',
          afv_c: '',
          bf: '同比',
          bfv: '--',
          bfv_c: '',
        },
        {
          name: '滞销金额',
          v: '--',
          vc: '',
          af: '目标',
          afv: '--',
          afv_c: '',
          bf: '占总库存比',
          bfv: '--',
          bfv_c: '',
        },
        {
          name: '年化周转',
          v: '--',
          vc: '',
          af: '目标',
          afv: '--',
          afv_c: '',
          bf: '差值占比',
          bfv: '--',
          bfv_c: '',
        },
        {
          name: '售后不良率',
          v: '--',
          vc: '',
          af: '目标',
          afv: '--',
          afv_c: '',
          bf: '差值占比',
          bfv: '--',
          bfv_c: '',
        },
        {
          name: '采购毛利率',
          subName: '(锁定成本)',
          v: '--',
          vc: '',
          af: '目标',
          afv: '--',
          afv_c: '',
          bf: '差值占比',
          bfv: '--',
          bfv_c: '',
        },
      ],

      // 2022-04-23 疾风 迭代内容
      HeaderItemArr: [
        {
          label: '支付业绩',
          value: null,
          label1: '日累计达成率',
          value1: null,
          label2: '日累计同比',
          value2: null,
          numType: 1,
          comp: 'ChannelPerf',
        },
        {
          label: '发货业绩',
          value: null,
          label1: '日累计达成率',
          value1: null,
          label2: '日累计同比',
          value2: null,
          numType: 2,
          comp: 'ChannelPerf',
        },
        {
          label: 'SKU均值',
          value: null,
          label1: '目标达成率',
          value1: null,
          label2: '同比',
          value2: null,
          numType: 3,
          comp: 'SkuAvg',
        },
        {
          label: '新品业绩',
          value: null,
          label1: '日累计达成率',
          value1: null,
          label2: '日累计同比',
          value2: null,
          numType: 4,
          comp: 'NewProductOverview',
        },
        {
          label: '日均订单欠货',
          subTitle: '(成品项目组、销售额)',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 5,
          comp: 'ShortShippedCharts',
        },
        {
          label: '日均商品欠货',
          subTitle: '(成品项目组、采购额)',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 6,
          comp: 'ShortShippedCharts',
        },
        {
          label: '成品达交率',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值',
          value2: null,
          numType: 7,
          comp: 'FinishProductCharts',
        },
        {
          label: '库存',
          value: null,
          label1: '同期库存',
          value1: null,
          label2: '同比',
          value2: null,
          numType: 8,
          comp: 'InventoryOverview',
        },
        {
          label: '滞销金额',
          value: null,
          label1: '目标',
          value1: null,
          label2: '占总库存比',
          value2: null,
          numType: 9,
          comp: 'UnsalableAmt',
        },
        {
          label: '年化周转',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值占比',
          value2: null,
          numType: 10,
          comp: 'AnnualizedTurnover',
        },
        {
          label: '售后不良率',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值占比',
          value2: null,
          numType: 11,
          comp: 'BadAfterSale',
        },
        {
          label: '采购毛利率',
          subTitle: '(锁定成本)',
          value: null,
          label1: '目标',
          value1: null,
          label2: '差值占比',
          value2: null,
          numType: 12,
          comp: 'PurchaseProfit',
        },
      ],
      curTab: {},
      defaultState: false,
      currentIndex: 0,
      Unhighlight:true,  //取消选项卡的高亮！！
      // 2022-04-23 疾风 迭代内容

      tabs: [
        {name: '实时业绩', component: LivePerfV2, comp:'LivePerfV2'},
        {name: '渠道业绩', component: ChannelPerf, comp:'ChannelPerf'},
        // {name: '发货业绩' 项目组发货, component: DeliveryPerf, comp:'DeliveryPerf'},
        {name: '项目组发货' , component: DeliveryPerf, comp:'DeliveryPerf'},
        {name: 'SKU均值', component: SkuAvg, comp:'SkuAvg'},
        {name: '项目组销售', component: TeamSale, comp:'TeamSale'},
        {name: '新品概览', component: NewProductOverview, comp:'NewProductOverview'},
        {name: '欠货概况', component: ShortShippedCharts, comp:'ShortShippedCharts'},
        {name: '成品达交', component: FinishProductCharts, comp:'FinishProductCharts'},
        {name: '补件达交', component: SupplementCharts, comp:'SupplementCharts'},
        {name: '库存概览', component: InventoryOverview, comp:'InventoryOverview'},
        {name: '滞销金额', component: UnsalableAmt, comp:'UnsalableAmt'},
        {name: '年化周转', component: AnnualizedTurnover, comp:'AnnualizedTurnover'},
        {name: '售后不良', component: BadAfterSale, comp:'BadAfterSale'},
        {name: '采购毛利', component: PurchaseProfit, comp:'PurchaseProfit'},
        {name: '考核汇总', component: AssessmentSummary, comp:'AssessmentSummary'},
        // {name: '指标说明', component: KpiDesc, comp:'KpiDesc'},
      ],
      activeTab: null,
    }
  },

  computed: {
    currentComponent() {
      return this.activeTab ? this.activeTab.component : Blank
    },
  },
  created() {
    this.activeTab = this.tabs[0]
    this.curTab = this.tabs[0];
    this.getData1()
    const UpdateCompData = () => {
      setTimeout(() => {
        if (this.$refs['curComp'] && this.activeTab.component.name === 'LivePerfV2') {
          Array(5)
            .fill({})
            .forEach((item, index) => {
              let methodName = `getData${index}`
              if (this.$refs['curComp'][methodName]) {
                this.$refs['curComp'][methodName]()
              }
            })
        }
        UpdateCompData()
      }, 10000)
    }
    if (this.activeTab.component.name === 'LivePerfV2') {
      UpdateCompData()
    }
  },
  mounted() {
    /* eslint-disable */
    const tabsContainer = document.querySelector('.s-tabs')

    const calcHeight = () => {
      const windowHeight = Math.max(document.documentElement.clientHeight, 768)
      // const a = document.querySelector('.s-board__wrapper').clientHeight
      const a = document.querySelector('.header').clientHeight
      
      const h = (windowHeight - a - 40)
      tabsContainer.style.height = h + 'px'
      tabsContainer.style.setProperty('--height', h - 40)
    }

    calcHeight()

    window.addEventListener('resize', calcHeight)
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', calcHeight)
    })

  },
  methods: {
    getData1() {
      this.$fetchSql('pds_cockpit', 'all_kpi_report').then((res) => {
        const data = res.data[0]
        const sBoard = this.sBoard
        // 支付业绩
        this.sBoard[0].v = formatY(data['MTD_SALE_AMT'])
        this.sBoard[0].afv = transPercent(data['PAY_AMT_RATE'])
        this.sBoard[0].bfv = transPercent(data['AGO_PAY_AMT_RATE'])
        this.sBoard[0].vc = data['PAY_AMT_RATE'] >= 1 ? 'red' : 'green'
        this.sBoard[0].afv_c = data['PAY_AMT_RATE'] >= 1 ? 'red' : 'green'
        this.sBoard[0].bfv_c = data['AGO_PAY_AMT_RATE'] > 0 ? 'red' : 'green'

        // 发货业绩->项目组发货
        this.sBoard[1].v = formatY(data['DLVRED_AMT'])
        this.sBoard[1].afv = transPercent(data['DEV_AMT_RATE'])
        this.sBoard[1].bfv = transPercent(data['AGO_DEV_AMT_RATE'])
        this.sBoard[1].vc = data['DEV_AMT_RATE'] >= 1 ? 'red' : 'green'
        this.sBoard[1].afv_c = data['DEV_AMT_RATE'] >= 1 ? 'red' : 'green'
        this.sBoard[1].bfv_c = data['AGO_DEV_AMT_RATE'] > 0 ? 'red' : 'green'

        // SKU均值
        this.sBoard[2].v = formatW(data['AVG_SKU_DLVR_AMT'])
        this.sBoard[2].afv = transPercent(data['AVG_SKU_CMPL_RTO'])
        this.sBoard[2].bfv = transPercent(data['AGO_AVG_SKU_DLVR_DIF'])
        this.sBoard[2].vc = data['AVG_SKU_CMPL_RTO'] >= 1 ? 'red' : 'green'
        this.sBoard[2].afv_c = data['AVG_SKU_CMPL_RTO'] >= 1 ? 'red' : 'green'
        this.sBoard[2].bfv_c = data['AGO_AVG_SKU_DLVR_DIF'] > 0 ? 'red' : 'green'

        // 新品业绩
        this.sBoard[3].v = formatW(data['NEW_SALE_AMT'], 0)
        this.sBoard[3].afv = transPercent(data['NEW_MTRL_CMPL_RTO'])
        this.sBoard[3].bfv = transPercent(data['AGO_NEW_SALE_AMT_DIF'])
        this.sBoard[3].vc = data['NEW_MTRL_CMPL_RTO'] >= 1 ? 'red' : 'green'
        this.sBoard[3].afv_c = data['NEW_MTRL_CMPL_RTO'] >= 1 ? 'red' : 'green'
        this.sBoard[3].bfv_c = data['AGO_NEW_SALE_AMT_DIF'] > 0 ? 'red' : 'green'

        // 日均订单欠货
        this.sBoard[4].v = formatW(data['CP_TOTAL_ORDER_AMOUNT'], 0)
        this.sBoard[4].afv = formatW(data['NSHG_TOTAL_ORDER_FLAG'], 0)
        this.sBoard[4].bfv = transPercent(data['CP_TOTAL_ORDER_RATE'])
        this.sBoard[4].vc = data['CP_TOTAL_ORDER_AMOUNT'] > data['NSHG_TOTAL_ORDER_FLAG'] ? 'green' : 'red'
        this.sBoard[4].bfv_c = data['CP_TOTAL_ORDER_AMOUNT'] > data['NSHG_TOTAL_ORDER_FLAG'] ? 'green' : 'red'

        // 日均商品欠货
        this.sBoard[5].v = formatW(data['CP_AVG_PURPRICE_AMT'], 0)
        this.sBoard[5].afv = formatW(data['AVG_MEX_TGT'], 0)
        this.sBoard[5].bfv = transPercent(data['CP_AVG_PURPRICE_AMT_DIF'])
        this.sBoard[5].vc = data['CP_AVG_PURPRICE_AMT'] > data['AVG_MEX_TGT'] ? 'green' : 'red'
        this.sBoard[5].bfv_c = data['CP_AVG_PURPRICE_AMT'] > data['AVG_MEX_TGT'] ? 'green' : 'red'

        // 成品达交率
        this.sBoard[6].v = transPercent(data['DEAL_RATE'])
        this.sBoard[6].afv = transPercent(data['DEAL_TGT'])
        this.sBoard[6].bfv = transPercent(data['DEAL_DIF'])
        this.sBoard[6].vc = data['DEAL_RATE'] < data['DEAL_TGT'] ? 'green' : 'red'
        this.sBoard[6].bfv_c = data['DEAL_RATE'] < data['DEAL_TGT'] ? 'green' : 'red'

        // 库存
        this.sBoard[7].v = formatY(data['IMMDT_COST_VALUE'])
        this.sBoard[7].afv = formatY(data['AGO_IMMDT_COST_VALUE'])
        this.sBoard[7].bfv = transPercent(data['AGO_IMMDT_COST_VALUE_RATE'])
        this.sBoard[7].bfv_c = data['AGO_IMMDT_COST_VALUE_RATE'] > 0 ? 'green' : 'red'

        // 滞销金额
        this.sBoard[8].v = formatY(data['REM_INV_VALUE'])
        this.sBoard[8].afv = formatY(data['REM_INV_VALUE_FLAG'])
        this.sBoard[8].bfv = transPercent(data['REM_INV_RATE'])
        this.sBoard[8].vc = data['REM_INV_VALUE'] < data['REM_INV_VALUE_FLAG'] ? 'red' : 'green'
        this.sBoard[8].bfv_c = data['REM_INV_RATE'] < 0.1 ? 'red' : 'green'

        // 年化周转
        this.sBoard[9].v = data['MTD_ZZ_RATE'].toFixed(2)
        this.sBoard[9].afv = data['MTD_ZZ_RATE_FLAG'].toFixed(2)
        this.sBoard[9].bfv = transPercent(data['MTD_ZZ_RATE_DIF'])
        this.sBoard[9].vc = data['MTD_ZZ_RATE'] > data['MTD_ZZ_RATE_FLAG'] ? 'red' : 'green'
        this.sBoard[9].bfv_c = data['MTD_ZZ_RATE'] > data['MTD_ZZ_RATE_FLAG'] ? 'red' : 'green'

        // 售后不良率
        this.sBoard[10].v = transPercent(data['SHBL_RATE'])
        this.sBoard[10].afv = transPercent(data['SHBL_RATE_FLAG'])
        this.sBoard[10].bfv = transPercent(data['SHBL_RATE_DIF'])
        this.sBoard[10].vc = data['SHBL_RATE'] < data['SHBL_RATE_FLAG'] ? 'red' : 'green'
        this.sBoard[10].bfv_c = data['SHBL_RATE'] < data['SHBL_RATE_FLAG'] ? 'red' : 'green'

        // 采购毛利率 (不含税)
        this.sBoard[11].v = transPercent(data['MTD_LCK_CG_AMT_RATE'])
        this.sBoard[11].afv = transPercent(data['LCK_CG_TAR_RATE'])
        this.sBoard[11].bfv = transPercent(data['MTD_LCK_CG_AMT_RATE1'])
        this.sBoard[11].vc = data['MTD_LCK_CG_AMT_RATE'] > data['LCK_CG_TAR_RATE'] ? 'red' : 'green'
        this.sBoard[11].bfv_c = data['MTD_LCK_CG_AMT_RATE'] > data['LCK_CG_TAR_RATE'] ? 'red' : 'green'


        if(data){
          Object.keys(this.HeaderItemArr).forEach((OnKey) => {
            if(this.HeaderItemArr[OnKey].label==='支付业绩'){
              this.HeaderItemArr[OnKey].value=data['MTD_SALE_AMT']
              this.HeaderItemArr[OnKey].value1=data['PAY_AMT_RATE']
              this.HeaderItemArr[OnKey].value2=data['AGO_PAY_AMT_RATE']
            }else if(this.HeaderItemArr[OnKey].label==='发货业绩'){
              this.HeaderItemArr[OnKey].value=data['DLVRED_AMT']
              this.HeaderItemArr[OnKey].value1=data['DEV_AMT_RATE']
              this.HeaderItemArr[OnKey].value2=data['AGO_DEV_AMT_RATE']
            }else if(this.HeaderItemArr[OnKey].label==='SKU均值'){
              this.HeaderItemArr[OnKey].value=data['AVG_SKU_DLVR_AMT']
              this.HeaderItemArr[OnKey].value1=data['AVG_SKU_CMPL_RTO']
              this.HeaderItemArr[OnKey].value2=data['AGO_AVG_SKU_DLVR_DIF']
            }else if(this.HeaderItemArr[OnKey].label==='新品业绩'){
              this.HeaderItemArr[OnKey].value=data['NEW_SALE_AMT']
              this.HeaderItemArr[OnKey].value1=data['NEW_MTRL_CMPL_RTO']
              this.HeaderItemArr[OnKey].value2=data['AGO_NEW_SALE_AMT_DIF']
            }else if(this.HeaderItemArr[OnKey].label==='日均订单欠货'){
              this.HeaderItemArr[OnKey].value=data['CP_TOTAL_ORDER_AMOUNT']
              this.HeaderItemArr[OnKey].value1=data['NSHG_TOTAL_ORDER_FLAG']
              this.HeaderItemArr[OnKey].value2=data['CP_TOTAL_ORDER_RATE']
            }else if(this.HeaderItemArr[OnKey].label==='日均商品欠货'){
              this.HeaderItemArr[OnKey].value=data['CP_AVG_PURPRICE_AMT']
              this.HeaderItemArr[OnKey].value1=data['AVG_MEX_TGT']
              this.HeaderItemArr[OnKey].value2=data['CP_AVG_PURPRICE_AMT_DIF']
            }else if(this.HeaderItemArr[OnKey].label==='成品达交率'){
              this.HeaderItemArr[OnKey].value=data['DEAL_RATE']
              this.HeaderItemArr[OnKey].value1=data['DEAL_TGT']
              this.HeaderItemArr[OnKey].value2=data['DEAL_DIF']
            }else if(this.HeaderItemArr[OnKey].label==='库存'){
              this.HeaderItemArr[OnKey].value=data['IMMDT_COST_VALUE']
              this.HeaderItemArr[OnKey].value1=data['AGO_IMMDT_COST_VALUE']
              this.HeaderItemArr[OnKey].value2=data['AGO_IMMDT_COST_VALUE_RATE']
            }else if(this.HeaderItemArr[OnKey].label==='滞销金额'){
              this.HeaderItemArr[OnKey].value=data['REM_INV_VALUE']
              this.HeaderItemArr[OnKey].value1=data['REM_INV_VALUE_FLAG']
              this.HeaderItemArr[OnKey].value2=data['REM_INV_RATE']
            }else if(this.HeaderItemArr[OnKey].label==='年化周转'){
              this.HeaderItemArr[OnKey].value=data['MTD_ZZ_RATE']
              this.HeaderItemArr[OnKey].value1=data['MTD_ZZ_RATE_FLAG']
              this.HeaderItemArr[OnKey].value2=data['MTD_ZZ_RATE_DIF']
            }else if(this.HeaderItemArr[OnKey].label==='售后不良率'){
              this.HeaderItemArr[OnKey].value=data['SHBL_RATE']
              this.HeaderItemArr[OnKey].value1=data['SHBL_RATE_FLAG']
              this.HeaderItemArr[OnKey].value2=data['SHBL_RATE_DIF']
            }else if(this.HeaderItemArr[OnKey].label==='采购毛利率'){
              this.HeaderItemArr[OnKey].value=data['MTD_LCK_CG_AMT_RATE']
              this.HeaderItemArr[OnKey].value1=data['LCK_CG_TAR_RATE']
              this.HeaderItemArr[OnKey].value2=data['MTD_LCK_CG_AMT_RATE1']
            }
          });
        }



      })
    },

    // 2022-04-23 疾风 迭代内容
    computeClass(comp, index) {
      if (!this.defaultState) return
      if (!comp) return
      if (comp === 'T1_OpenAShop' && this.currentIndex === index) return 'active'
      else if (comp !== 'T1_OpenAShop') return comp === this.curTab.comp && 
        this.currentIndex === index && this.Unhighlight===true? 'active' : ''
    },
    changeTabV1(comp, numType, index, e) {
      this.defaultState = true;
      this.Unhighlight = true;
      if ((this.curTab.comp === comp && this.currentIndex===index) && comp !== 'T1_OpenAShop') return
      if (!comp) return
      this.curTab = this.tabs.filter((_) => _.comp === comp)[0];
      this.activeTab = this.tabs.filter((_) => _.comp === comp)[0]
      if (comp === 'ChannelPerf') {
        this.$nextTick(() => {  
          this.$refs.curComp.statisticType = index === 0 ? 1 : 2
        })
      }else if(comp === 'ShortShippedCharts'){
        this.$nextTick(() => {
          this.$refs.curComp.ShortType = index === 4 ? '3' : '2'
        })
      }else if(comp === 'AnnualizedTurnover'){
        this.$nextTick(()=>{
          this.$refs.curComp.AnnuType = '2'
        })
      }
      this.currentIndex = index
    },
    // 2022-04-23 疾风 迭代内容
  }
}
</script>

<style lang="scss" scoped>
/deep/ .ant-checkbox-wrapper {
  font-size: 12px;
}

/deep/ .ant-radio-wrapper {
  font-size: 12px;
}

.page-wrapper {
  padding: 10px 2%;
  background: #eef1f6;
  height: 100vh;
  overflow-y: auto;
  //min-height: 768px;
  min-width: 1366px;
  user-select: none;
}

.s-board__wrapper {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: repeat(6, 1fr);
  grid-row-gap: 15px;
  grid-column-gap: 15px;

  > .s-board__item {
    height: 100%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

    .s-board__content {
      padding: 10px 20px;
      height: 6.8vw;
      white-space: nowrap;
      min-height: 90px;
      max-height: 110px;
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas: 'left a' 'left b';

      .s-board__content-left {
        grid-area: left;
        height: 100%;
        text-align: left;
        display: flex;
        flex-flow: column;
        justify-content: center;

        > p {
          position: relative;

          .remark {
            position: absolute;
            left: 50%;
            text-align: center;
            top: 16px;
            transform: translateX(-50%) scale(0.8);
          }
        }
      }

      .s-board__content-right {
        text-align: right;
        display: flex;
        flex-flow: column;

        &:first-of-type {
          justify-content: flex-start;
        }

        &:last-of-type {
          justify-content: flex-end;
        }
      }
    }
  }
}


  // 2022-04-23 疾风 迭代内容
  .header {
    padding-top: 0px;
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
    /deep/ .s-board{
      width: calc((100% - 50px) / 6);
    }
    /deep/ .s-board:nth-child(6n) {
      margin-right: 0;
    }    
  }
  // 2022-04-23 疾风 迭代内容

.s-tabs {
  margin-top: 15px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  .tab-item {
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
      background: rgba(112, 112, 112, 0.1);
      border-radius: 5px;
    }

    &.active {
      span {
        color: #46bca0;
      }
    }
  }

  .comp-tabs {
    padding: 4px 5px;
    border-bottom: 1px solid rgb(238, 238, 238);
    overflow: hidden;
  }
}

/deep/ .dashboard-common-table {
  width: 100%;
  table-layout: fixed;
  font-size: 12px;
  text-align: center;

  tr {
    &:first-child {
      background: #f5f7ff !important;
      color: #808492;
    }

    &:nth-child(2n + 1) {
      background: #fcfcff;
    }

    td {
      border: 1px solid #e7e9f0;

      &:first-child {
        text-align: center;
        color: #808492;
      }
    }
  }
}
</style>
