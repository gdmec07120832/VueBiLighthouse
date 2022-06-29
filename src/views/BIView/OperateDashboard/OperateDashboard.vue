<template>
  <div class="page-wrapper">
    <div class="s-board-wrapper">
      <div @click="clickCell(tabs[1], {tab: '支付口径'})" :class="{active: curCell.title === '渠道业绩' && curCell.tab === '支付口径'}" class="s-board">
        <div class="left">
          <p>支付业绩</p>
          <div
            class="text-xl"
            :class="[originData.MTD_SALE_AMT >= originData['MTD_SALE_TARGET'] ? 'text-red' : 'text-green']"
          >
            {{ cellData.MTD_SALE_AMT }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">日累计达成</div>
          <div class="text-xs" :class="[originData.PAY_AMT_RATE >= 1 ? 'text-red' : 'text-green']">
            {{ cellData.PAY_AMT_RATE }}
          </div>
          <div class="text-gary">日累计同比</div>
          <div class="text-xs" :class="[originData.AGO_PAY_AMT_RATE >= 0 ? 'text-red' : 'text-green']">
            {{ cellData.AGO_PAY_AMT_RATE }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[5])" :class="{active: curCell.title === '未发取消'}" class="s-board">
        <div class="left">
          <p>
            <span style="position: relative">
              未发取消
              <span
                style="position: absolute; font-size: 12px; color: #999; transform: scale(0.7); left: 0; bottom: -80%"
                >(支付口径)</span
              >
            </span>
          </p>
          <div class="text-xl">
            {{ cellData.MTD_CANCEL_PAY_AMT }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">占销售比</div>
          <div class="text-xs" :class="[originData.MTD_CANCEL_PAY_RATE < 0.3 ? 'text-red' : 'text-green']">
            {{ cellData.MTD_CANCEL_PAY_RATE }}
          </div>
          <div class="text-gary">日累计同比</div>
          <div
            class="text-xs"
            :class="[
              originData.AGO_MTD_CANCEL_PAY_RATE < 0
                ? 'text-red'
                : originData.AGO_MTD_CANCEL_PAY_RATE > 0
                ? 'text-green'
                : '',
            ]"
          >
            {{ cellData.AGO_MTD_CANCEL_PAY_RATE }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[1], {tab: '发货口径'})" :class="{active: curCell.title === '渠道业绩'&& curCell.tab === '发货口径'}" class="s-board">
        <div class="left">
          <p>发货业绩</p>
          <div
            class="text-xl"
            :class="[originData.DLVRED_AMT >= originData['TGT_DLVRED_AMT'] ? 'text-red' : 'text-green']"
          >
            {{ cellData.DLVRED_AMT }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">日累计达成</div>
          <div
            class="text-xs"
            :class="[originData.DLVRED_AMT >= originData['TGT_DLVRED_AMT'] ? 'text-red' : 'text-green']"
          >
            {{ cellData.DEV_AMT_RATE }}
          </div>
          <div class="text-gary">日累计同比</div>
          <div class="text-xs" :class="[originData.AGO_DEV_AMT_RATE >= 0 ? 'text-red' : 'text-green']">
            {{ cellData.AGO_DEV_AMT_RATE }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[6])" :class="{active: curCell.title === '采购毛利'}" class="s-board">
        <div class="left">
          <p>
            <span style="position: relative">
              采购毛利率
              <span
                style="position: absolute; font-size: 12px; color: #999; transform: scale(0.7); left: 0; bottom: -80%"
                >(锁定成本)</span
              >
            </span>
          </p>
          <div
            class="text-xl"
            :class="[originData.MTD_LCK_CG_AMT_RATE > originData.LCK_CG_TAR_RATE ? 'text-red' : 'text-green']"
          >
            {{ cellData.MTD_LCK_CG_AMT_RATE }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">标杆值</div>
          <div class="text-xs">{{ cellData.LCK_CG_TAR_RATE }}</div>
          <div class="text-gary">差值占比</div>
          <div
            class="text-xs"
            :class="[
              originData.MTD_LCK_CG_AMT_RATE1 > 0
                ? 'text-red'
                : originData.MTD_LCK_CG_AMT_RATE1 < 0
                ? 'text-green'
                : '',
            ]"
          >
            {{ cellData.MTD_LCK_CG_AMT_RATE1 }}
          </div>
        </div>
      </div>
      <div class="s-board">
        <div class="left">
          <p>B店流量</p>
          <div class="text-xl" :class="[originData.VISITORS >= originData.AGO_VISITORS ? 'text-red' : 'text-green']">
            {{ cellData.VISITORS }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">同期流量</div>
          <div class="text-xs">{{ cellData.AGO_VISITORS }}</div>
          <div class="text-gary">日累计同比</div>
          <div class="text-xs" :class="[originData.VISITORS_RATE >= 0 ? 'text-red' : 'text-green']">
            {{ cellData.VISITORS_RATE }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[14],{tab:'售后费用'})" :class="{active: curCell.title === '售后费用'&&curCell.tab === '售后费用'}" class="s-board">
        <div class="left">
          <p>售后费用</p>
          <div
            class="text-xl"
            :class="[originData.MTD_AFS_AMT >= originData['AGO_MTD_AFS_AMT'] ? 'text-green' : 'text-red']"
          >
            {{ cellData.MTD_AFS_AMT }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">占发货比</div>
          <div class="text-xs" :class="[originData.MTD_AFS_AMT_RATE >= 0.025 ? 'text-green' : 'text-red']">
            {{ cellData.MTD_AFS_AMT_RATE }}
          </div>
          <div class="text-gary">日累计同比</div>
          <div class="text-xs" :class="[originData.AGO_MTD_AFS_AMT_RATE >= 0 ? 'text-green' : 'text-red']">
            {{ cellData.AGO_MTD_AFS_AMT_RATE }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[14],{tab:'退货费用'})" :class="{active: curCell.title === '售后费用'&&curCell.tab === '退货费用'}" class="s-board">
        <div class="left">
          <p>退货费用</p>
          <div
            class="text-xl"
            :class="[originData.MTD_REF_AMT >= originData['LYMTD_REF_AMT'] ? 'text-green' : 'text-red']"
          >
            {{ cellData.MTD_REF_AMT }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">占发货比</div>
          <div class="text-xs" :class="[originData.MTD_REF_RATE >= 0.01 ? 'text-green' : 'text-red']">
            {{ cellData.MTD_REF_RATE }}
          </div>
          <div class="text-gary">日累计同比</div>
          <div class="text-xs" :class="[originData.AGO_MTD_REF_RATE >= 0 ? 'text-green' : 'text-red']">
            {{ cellData.AGO_MTD_REF_RATE }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[8])" :class="{active: curCell.title === '欠货概况'}"  class="s-board">
        <div class="left">
          <p>日均订单欠货</p>
          <div
            class="text-xl"
            :class="[
              originData.TOTAL_ORDER_AMOUNT > originData.TOTAL_ORDER_FLAG
                ? 'text-green'
                : originData.TOTAL_ORDER_AMOUNT < originData.TOTAL_ORDER_FLAG
                ? 'text-red'
                : '',
            ]"
          >
            {{ cellData.TOTAL_ORDER_AMOUNT }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">标杆值</div>
          <div class="text-xs">{{ cellData.TOTAL_ORDER_FLAG }}</div>
          <div class="text-gary">差值占比</div>
          <div class="text-xs" :class="[originData.TOTAL_ORDER_RATE >= 0 ? 'text-green' : 'text-red']">
            {{ cellData.TOTAL_ORDER_RATE }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[10])" :class="{active: curCell.title === '库存周转'}" class="s-board">
        <div class="left">
          <p>周转率</p>
          <div
            class="text-xl"
            :class="[originData.MTD_ZZ_RATE >= originData.MTD_ZZ_RATE_FLAG ? 'text-red' : 'text-green']"
          >
            {{ cellData.MTD_ZZ_RATE }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">标杆值</div>
          <div class="text-xs">{{ cellData.MTD_ZZ_RATE_FLAG }}</div>
          <div class="text-gary">差值占比</div>
          <div class="text-xs" :class="[originData.MTD_ZZ_RATE_DIF > 0 ? 'text-red' : 'text-green']">
            {{ cellData.MTD_ZZ_RATE_DIF }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[11])" :class="{active: curCell.title === '库龄滞销'}" class="s-board">
        <div class="left">
          <p>
              <span style="position: relative">
              滞销金额
              <span
                      style="position: absolute; font-size: 12px; color: #999; transform: scale(0.7); left: 0; bottom: -80%"
              >(考核口径)</span
              >
            </span>
          </p>
          <div
            class="text-xl"
            :class="[originData.REM_INV_VALUE < originData.REM_INV_VALUE_FLAG ? 'text-red' : 'text-green']"
          >
            {{ cellData.REM_INV_VALUE }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">标杆值</div>
          <div class="text-xs">{{ cellData.REM_INV_VALUE_FLAG }}</div>
          <div class="text-gary">占总库存比</div>
          <div class="text-xs" :class="[originData.REM_INV_RATE >= 0.1 ? 'text-green' : 'text-red']">
            {{ cellData.REM_INV_RATE }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[12])" :class="{active: curCell.title === '售后不良'}" class="s-board">
        <div class="left">
          <p>售后不良率</p>
          <div class="text-xl" :class="[originData.SHBL_RATE < originData.SHBL_RATE_FLAG ? 'text-red' : 'text-green']">
            {{ cellData.SHBL_RATE }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">标杆值</div>
          <div class="text-xs">{{ cellData.SHBL_RATE_FLAG }}</div>
          <div class="text-gary">差值占比</div>
          <div class="text-xs" :class="[originData.SHBL_RATE_DIF < 0 ? 'text-red' : 'text-green']">
            {{ cellData.SHBL_RATE_DIF }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[13])" :class="{active: curCell.title === '客满评价'}" class="s-board">
        <div class="left">
          <p>全渠道差评率</p>
          <div
            class="text-xl"
            :class="[originData.MTD_APRS_BAD_RATE >= originData.MTD_APRS_BAD_RATE_FLAG ? 'text-green' : 'text-red']"
          >
            {{ cellData.MTD_APRS_BAD_RATE }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">同期</div>
          <div class="text-xs">{{ cellData.MTD_APRS_BAD_RATE_FLAG }}</div>
          <div class="text-gary">差值占比</div>
          <div
            class="text-xs"
            :class="[
              originData.MTD_APRS_BAD_RATE_DIF < 0
                ? 'text-red'
                : originData.MTD_APRS_BAD_RATE_DIF > 0
                ? 'text-green'
                : '',
            ]"
          >
            {{ cellData.MTD_APRS_BAD_RATE_DIF }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[15])"  :class="{active: curCell.title === '支装准时率'}" class="s-board">
        <div class="left">
          <p>支装准时率</p>
          <div class="text-xl" :class="[originData.ZZZS_RATE >= originData.ZZZS_RATE_FLAG ? 'text-red' : 'text-green']">
            {{ cellData.ZZZS_RATE }}
          </div>
        </div>
        <div class="right">
          <div class="text-gary">标杆值</div>
          <div class="text-xs">{{ cellData.ZZZS_RATE_FLAG }}</div>
          <div class="text-gary">差值占比</div>
          <div class="text-xs" :class="[originData.ZZZS_RATE_DIF >= 0 ? 'text-red' : 'text-green']">
            {{ cellData.ZZZS_RATE_DIF }}
          </div>
        </div>
      </div>
      <div @click="clickCell(tabs[16])" :class="{active: curCell.title === 'DSR分析'}" class="s-board">
        <div style="width: 100%; display: flex; flex-flow: column">
          <div class="flex flex-between">
            <div style="color: #333">B店DSR</div>
            <div class="text-xs text-gary">同行对比</div>
          </div>
          <div style="flex: 1; flex-flow: column; justify-content: space-around" class="flex text-xs">
            <div style="width: 100%" class="flex flex-between">
              <span class="text-gary">描述</span>
              <span>{{ cellData.DESCRIBE }}</span>
              <span :class="[originData.DESCRIBE_PEER >= 0 ? 'text-red' : 'text-green']">{{
                cellData.DESCRIBE_PEER
              }}</span>
            </div>
            <div style="width: 100%" class="flex flex-between">
              <span class="text-gary">服务</span>
              <span>{{ cellData.SERVICE }}</span>
              <span
                :class="[originData.SERVICE_PEER > 0 ? 'text-red' : originData.SERVICE_PEER < 0 ? 'text-green' : '']"
                >{{ cellData.SERVICE_PEER }}</span
              >
            </div>
            <div style="width: 100%" class="flex flex-between">
              <span class="text-gary">物流</span>
              <span>{{ cellData.LOGISTICS }}</span>
              <span :class="[originData.LOGISTICS_PEER > 0 ? 'text-red' : 'text-green']">{{
                cellData.LOGISTICS_PEER
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tabs-container" ref="tabContainer" style="min-height: 535px; opacity: 0">
      <div class="comp-tabs" v-dragscroll>
        <div class="flex flex-start">
          <div
            class="tab-item"
            @click="changeTab(item)"
            :class="{ active: item.title === curTab.title }"
            v-for="item in tabs"
            :key="item.title"
          >
            <span class="text-gary">{{ item.title }}</span>
          </div>
        </div>
      </div>

      <div class="tabs-content-wrapper">
        <component :is="curTab.comp || 'LivePerf'" ref="curComp" style="overflow: hidden"></component>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { dragscroll } from 'vue-dragscroll'
import LivePerf from './Tabs/LivePerf/LivePerf'
import ChannelPerf from './Tabs/ChannelPerf/ChannelPerfV2'
import CirculationOverview from './Tabs/CirculationOverview/CirculationOverview'
import OrderDistribution from './Tabs/OrderDistribution/OrderDistributionV2'
import CompetitorAnalysis from './Tabs/CompetitorAnalysis/CompetitorAnalysis'
import NotShippedCancel from './Tabs/NotShipedCancel/NotShippedCancel'
import LogisticsShipping from './Tabs/LogisticsShipping/LogisticsShipping'
import PurchaseProfit from './Tabs/PurchaseProfit/PurchaseProfit'
// import BizRefund from './Tabs/BizRefund/BizRefund'
import InventoryOnway from './Tabs/InventoryOnway/InventoryOnwayV2'
import InventoryTurnover from './Tabs/InventoryTurnover/InventoryTurnoverV2'
import DSRAnalysis from './Tabs/DSRAnalysis/DSRAnalysis'
// import LessCargoOverview from './Tabs/LessCargoOverview/LessCargoOverview'
import LessCargoOverview from './Tabs/LessCargoOverview/LessCargoOverviewV2'

import CSEvaluation from './Tabs/CSEvaluation/CSEvaluation'
import BadAfterSale from './Tabs/BadAfterSale/BadAfterSaleV2'
import StorageUnsalable from './Tabs/StorageUnsalable/StorageUnsalableV2'
import PromoteFeeV2 from './Tabs/PromoteFee/PromoteFeeV2'
import SetExplain from './Tabs/SetExplain/SetExplain'
import Punctuality from './Tabs/Punctuality/Punctuality'
import { formatNumber } from '@/utils/helper'
import Bus from '@/utils/bus'
import AfterSalesExpenses from './Tabs/AfterSalesExpenses'

const formatY = (num) => {
  return typeof num !== 'number' ? '--' : formatNumber(num, 100000000) + '亿'
}
const formatW = (num) => {
  return typeof num !== 'number' ? '--' : formatNumber(num, 10000, 0) + '万'
}
const formatZ = (num) => {
  return typeof num !== 'number' ? '--' : formatNumber(num, 1, 2)
}
const formatZ3 = (num) => {
  return typeof num !== 'number' ? '--' : formatNumber(num, 1, 3)
}
const transPercent = (num) => {
  return typeof num !== 'number' ? '--' : (num * 100).toFixed(2) + '%'
}

export default {
  name: 'OperateDashboard_T',
  directives: {
    dragscroll,
  },
  components: {
    LivePerf,
    ChannelPerf,
    CirculationOverview,
    OrderDistribution,
    CompetitorAnalysis,
    NotShippedCancel,
    LogisticsShipping,
    PurchaseProfit,
    // BizRefund,
    InventoryOnway,
    InventoryTurnover,
    DSRAnalysis,
    LessCargoOverview,
    CSEvaluation,
    BadAfterSale,
    StorageUnsalable,
    PromoteFee: PromoteFeeV2,
    SetExplain,
    Punctuality,
    AfterSalesExpenses,
  },
  data() {
    return {
      refreshKey: '1',
      curCell: {},
      curTab: {},
      originData: {},
      cellData: {
        MTD_SALE_AMT: '--', // 支付业绩
        PAY_AMT_RATE: '--', // 支付业绩-日累计达成率
        AGO_PAY_AMT_RATE: '--', // 支付业绩-日累计同比
        MTD_CANCEL_PAY_AMT: '--', // 未发取消（支付）
        MTD_CANCEL_PAY_RATE: '--', // 未发取消（支付）占销售比
        AGO_MTD_CANCEL_PAY_RATE: '--', // 未发取消（支付）日累计同比
        DLVRED_AMT: '--', // 发货业绩
        DEV_AMT_RATE: '--', // 发货业绩 日累计达成率
        AGO_DEV_AMT_RATE: '--', // 发货业绩 日累计同比
        MTD_LCK_CG_AMT_RATE: '--', // 采购毛利率（锁定成本）
        LCK_CG_TAR_RATE: '--', //采购毛利率（锁定成本）标杆值
        MTD_LCK_CG_AMT_RATE1: '--',

        VISITORS: '', // B店流量
        AGO_VISITORS: '', // B店流量 同期访客数
        VISITORS_RATE: '', // B店流量 日累计同比

        MTD_AFS_AMT: '--', // 售后费用
        MTD_AFS_AMT_RATE: '--', // 售后费用 占发货比
        AGO_MTD_AFS_AMT_RATE: '', // 售后费用 日累计同比

        MTD_REF_AMT: '--', // 退货费用
        MTD_REF_RATE: '--', // 退货费用 占发货比
        AGO_MTD_REF_RATE: '--', // 退货费用 日累计同比

        TOTAL_ORDER_AMOUNT: '--', // 日均订单欠货
        TOTAL_ORDER_FLAG: '--', // 日均订单欠货 标杆值
        TOTAL_ORDER_RATE: '--', // 日均订单欠货 差值占比

        MTD_ZZ_RATE: '--', // 周转率
        MTD_ZZ_RATE_FLAG: '--', // 周转率 标准值
        MTD_ZZ_RATE_DIF: '--', // 周转率 差值占比

        REM_INV_VALUE: '--', // 呆滞金额
        REM_INV_VALUE_FLAG: '--', // 呆滞金额 标杆值
        REM_INV_RATE: '--', // 呆滞金额 占总库存比

        SHBL_RATE: '--', // 售后不良率
        SHBL_RATE_FLAG: '--', // 售后不良标杆值
        SHBL_RATE_DIF: '--', // 售后不良 差值占比

        MTD_APRS_BAD_RATE: '--', // 全渠道差评率
        MTD_APRS_BAD_RATE_FLAG: '--', // 全渠道差评率 标杆值
        MTD_APRS_BAD_RATE_DIF: '--', // 全渠道差评率 差值占比

        ZZZS_RATE: '--', // 支装准时率
        ZZZS_RATE_FLAG: '', // 支装准时率 标杆值
        ZZZS_RATE_DIF: '', // 支装准时率 差值占比

        DESCRIBE: '--', // 描述相符
        DESCRIBE_PEER: '--', // 描述相符 同行对比

        SERVICE: '--', // 服务
        SERVICE_PEER: '', // 服务 同行对比

        LOGISTICS: '--', // 物流
        LOGISTICS_PEER: '--', // 物流 同行对比
      },
      tabs: [
        { title: '实时业绩', comp: 'LivePerf' },
        { title: '渠道业绩', comp: 'ChannelPerf' },
        { title: '流转概况', comp: 'CirculationOverview' },
        { title: '订单分布', comp: 'OrderDistribution' },
        { title: '竞店分析', comp: 'CompetitorAnalysis' },
        { title: '未发取消', comp: 'NotShippedCancel' },
        // { title: '业务退款', comp: 'BizRefund' },
        { title: '采购毛利', comp: 'PurchaseProfit' },
        { title: '推广费用', comp: 'PromoteFee' },
        { title: '欠货概况', comp: 'LessCargoOverview' },
        { title: '库存在途', comp: 'InventoryOnway' },
        { title: '库存周转', comp: 'InventoryTurnover' },
        { title: '库龄滞销', comp: 'StorageUnsalable' },
        { title: '售后不良', comp: 'BadAfterSale' },
        { title: '客满评价', comp: 'CSEvaluation' },
        { title: '售后费用', comp: 'AfterSalesExpenses' },
        { title: '支装准时率', comp: 'Punctuality' },
        { title: 'DSR分析', comp: 'DSRAnalysis' },
        // { title: '物流发运', comp: 'LogisticsShipping' },
        { title: '指标说明', comp: 'SetExplain' },
      ],
    }
  },
  created() {
    this.curTab = this.tabs[0]
    if (window.parent.location === window.location) {
      this.$router.push('/')
    }
    const UpdateCompData = () => {
      setTimeout(() => {
        if (this.$refs['curComp'] && this.curTab.comp === 'LivePerf') {
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
    if (this.curTab.comp === 'LivePerf') {
      UpdateCompData()
    }
  },
  mounted() {
    this.getData1()
    const el = this.$refs['tabContainer']
    this.calcHeight = debounce(() => {
      const offsetTop = el.offsetTop
      el.style.height = `calc(100vh - ${offsetTop + 20}px)`
      el.style.setProperty('--height', String(el.clientHeight - 40))
      el.style.opacity = '1'
    }, 100)
    this.calcHeight()
    window.addEventListener('resize', this.calcHeight)
    window.parent.document.addEventListener('fullscreenchange', this.calcHeight)
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.calcHeight)
      document.removeEventListener('fullscreenchange', this.calcHeight)
    })
  },
  methods: {
    changeTab(item) {
      this.curTab = item
    },
    clickCell(tabItem, ext) {
      this.curTab = tabItem
      this.curCell = {...tabItem, ...ext}
      this.$nextTick(() => {
        if(ext && ext.tab === '支付口径') this.curTab = this.tabs[0]
        else if(ext && ext.tab === '发货口径') this.$refs.curComp.statisticType = 2
        else if(ext && ext.tab === '售后费用') this.$refs.curComp.IsChoiceOn = 0
        else if(ext && ext.tab === '退货费用') this.$refs.curComp.IsChoiceOn = 4
      })
    },
    getData1() {
      this.$axios.post('/api/admin/data/kpi_report/index_set/get').then((res) => {
        const data = res.data[0] || {}
        Object.keys(data).forEach((key) => {
          this.$set(this.originData, key, data[key])
        })
        this.cellData.MTD_SALE_AMT = formatY(data.MTD_SALE_AMT)
        this.cellData.PAY_AMT_RATE = transPercent(data.PAY_AMT_RATE)
        this.cellData.AGO_PAY_AMT_RATE = transPercent(data.AGO_PAY_AMT_RATE)
        this.cellData.MTD_CANCEL_PAY_AMT = formatY(data.MTD_CANCEL_PAY_AMT)
        this.cellData.MTD_CANCEL_PAY_RATE = transPercent(data.MTD_CANCEL_PAY_RATE)
        this.cellData.AGO_MTD_CANCEL_PAY_RATE = transPercent(data.AGO_MTD_CANCEL_PAY_RATE)
        this.cellData.DLVRED_AMT = formatY(data.DLVRED_AMT)
        this.cellData.DEV_AMT_RATE = transPercent(data.DEV_AMT_RATE)
        this.cellData.AGO_DEV_AMT_RATE = transPercent(data.AGO_DEV_AMT_RATE)
        this.cellData.MTD_LCK_CG_AMT_RATE = transPercent(data.MTD_LCK_CG_AMT_RATE)
        this.cellData.LCK_CG_TAR_RATE = transPercent(data.LCK_CG_TAR_RATE)
        this.cellData.MTD_LCK_CG_AMT_RATE1 = transPercent(data.MTD_LCK_CG_AMT_RATE1)

        this.cellData.MTD_AFS_AMT = formatW(data.MTD_AFS_AMT)
        this.cellData.MTD_AFS_AMT_RATE = transPercent(data.MTD_AFS_AMT_RATE)
        this.cellData.AGO_MTD_AFS_AMT_RATE = transPercent(data.AGO_MTD_AFS_AMT_RATE)

        this.cellData.VISITORS = formatW(data.VISITORS)
        this.cellData.AGO_VISITORS = formatW(data.AGO_VISITORS)
        this.cellData.VISITORS_RATE = transPercent(data.VISITORS_RATE)

        this.cellData.MTD_REF_AMT = formatW(data.MTD_REF_AMT)
        this.cellData.MTD_REF_RATE = transPercent(data.MTD_REF_RATE)
        this.cellData.AGO_MTD_REF_RATE = transPercent(data.AGO_MTD_REF_RATE)

        this.cellData.TOTAL_ORDER_AMOUNT = formatW(data.TOTAL_ORDER_AMOUNT)
        this.cellData.TOTAL_ORDER_FLAG = formatW(data.TOTAL_ORDER_FLAG)
        this.cellData.TOTAL_ORDER_RATE = transPercent(data.TOTAL_ORDER_RATE)

        this.cellData.MTD_ZZ_RATE = formatZ(data.MTD_ZZ_RATE)
        this.cellData.MTD_ZZ_RATE_FLAG = formatZ(data.MTD_ZZ_RATE_FLAG)
        this.cellData.MTD_ZZ_RATE_DIF = transPercent(data.MTD_ZZ_RATE_DIF)

        this.cellData.REM_INV_VALUE = formatY(data.REM_INV_VALUE)
        this.cellData.REM_INV_VALUE_FLAG = formatY(data.REM_INV_VALUE_FLAG)
        this.cellData.REM_INV_RATE = transPercent(data.REM_INV_RATE)

        this.cellData.SHBL_RATE = transPercent(data.SHBL_RATE)
        this.cellData.SHBL_RATE_FLAG = transPercent(data.SHBL_RATE_FLAG)
        this.cellData.SHBL_RATE_DIF = transPercent(data.SHBL_RATE_DIF)

        this.cellData.MTD_APRS_BAD_RATE = transPercent(data.MTD_APRS_BAD_RATE)
        this.cellData.MTD_APRS_BAD_RATE_FLAG = transPercent(data.MTD_APRS_BAD_RATE_FLAG)
        this.cellData.MTD_APRS_BAD_RATE_DIF = transPercent(data.MTD_APRS_BAD_RATE_DIF)

        this.cellData.ZZZS_RATE = transPercent(data.ZZZS_RATE)
        this.cellData.ZZZS_RATE_FLAG = transPercent(data.ZZZS_RATE_FLAG)
        this.cellData.ZZZS_RATE_DIF = transPercent(data.ZZZS_RATE_DIF)

        this.cellData.DESCRIBE = formatZ3(data.DESCRIBE)
        this.cellData.DESCRIBE_PEER = transPercent(data.DESCRIBE_PEER)

        this.cellData.SERVICE = formatZ3(data.SERVICE)
        this.cellData.SERVICE_PEER = transPercent(data.SERVICE_PEER)

        this.cellData.LOGISTICS = formatZ3(data.LOGISTICS)
        this.cellData.LOGISTICS_PEER = transPercent(data.LOGISTICS_PEER)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/views/BIView/OperateDashboard/assets/style.scss';

.page-wrapper {
  user-select: none;
  height: 100vh;
  min-width: 1366px;
  background: #eef1f6;
  padding: 20px;
  overflow-y: auto;
  scrollbar-width: thin;
  /deep/ .ant-radio-checked .ant-radio-inner {
    border-color: #39ad36;
  }
  /deep/ .ant-radio-inner::after {
    background-color: #39ad36;
  }
}

.s-board-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.s-board {
  width: calc((100% - 60px) / 7);
  transition: all .3s;
  height: 6.8vw;
  border-radius: 6px;
  background: #fff;
  padding: 5px 10px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  display: inline-flex;
  justify-content: space-between;
  margin-right: 10px;
  margin-bottom: 10px;
  user-select: none;
  white-space: nowrap;
  overflow: visible;
  max-height: 98px;
  position: relative;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, .2), 0 3px 4px 2px rgba(0, 0, 0, .12);
    &::before {
      display: block;
    }
  }

  &.active {
    transform: translateY(-5px);
    box-shadow: 0 3px 6px 2px rgba(0, 0, 0, .2), 0 3px 4px 2px rgba(0, 0, 0, .12);
    &::before {
      display: block;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #46bca0;
    display: none;
  }

  .text-xl {
    font-size: 21px;
  }

  .text-xs {
    font-size: 13px;
  }

  &:nth-child(7n) {
    margin-right: 0;
  }

  .left {
    display: flex;
    flex-flow: column;
    justify-content: center;
    padding: 0 10px;

    p {
      color: rgba(0,0,0,.88);
    }
  }

  .right {
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    text-align: right;
    padding-right: 10px;
    color: rgba(0,0,0,.88);
  }
}

.tabs-container {
  background: #fff;
  border-radius: 6px;

  .comp-tabs {
    padding: 0 10px;
    border-bottom: 1px solid #eee;
    overflow: hidden;
  }

  .tab-item {
    padding: 6px 10px;
    span {
      color: #888e99;
    }
    &.active span {
      color: rgb(70, 188, 160);
    }

    &:hover {
      cursor: pointer;
    }

    & > span {
      white-space: nowrap;
    }
  }
}

.tabs-content-wrapper {
  height: calc(100% - 34px);
  padding: 0 20px;
}
</style>
