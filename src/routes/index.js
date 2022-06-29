import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layout/Layout'
import { getUserInfo, userInfoOk } from '@/routes/helper'
import otherRoutes from '@/routes/otherRoutes'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'layout',
      path: '/',
      redirect: 'index',
      component: Layout,
      children: [
        {
          name: 'index',
          path: 'index',
          component: () => import('@/views/BIView/index')
        },
        {
          name: 'metricExplore',
          path: 'metricExplore',
          redirect: {
            name: 'metricExploreIndex'
          },
          component: () => import('@/views/MetricExplore/MetricExplore'),
          children: [
            {
              name: 'metricExploreIndex',
              path: 'index',
              component: () => import('@/views/MetricExplore/MetricGraph'),
            },
            {
              name: 'metricExploreSearchResult',
              path: 'searchResult',
              component: () => import('@/views/MetricExplore/SearchResult')
            }
          ],
        },
        {
          name: 'x',
          path: 'x/:menuPath',
          component: () => import('@/views/BIView/BI-View')
        },
        {
          name: 'a',
          path: 'a',
          component: () => import('@/views/Admin/components/AdminWrapper'),
          children: [
            {
              path: 'menu-manage',
              component: () => import('@/views/Admin/components/FakeFrame'),
              meta: {
                title: '菜单管理',
                realPath: '/frame/menu-manage'
              }
            },
            {
              name: 'role-module-manage',
              path: 'role-module-manage',
              component: () => import('@/views/Admin/role-module-manage/RoleModuleManage'),
              meta: {
                title: '角色-模块管理'
              }
            },
          ]
        },
        {
          name: 's',
          path: 's/:screenId',
          component: () => import('@/views/ScreenLandingPage/ScreenLandingPage')
        }
      ]
    },
    {
      name: 'frame',
      path: '/frame',
      component: {
        render () {
          return <router-view/>
        }
      },
      children: [
        {
          name: 'frame-index-page',
          path: 'index-page',
          component: () => import('@/views/BIView/IndexPage/IndexPage')
        },
        {
          name: 'frame-admin-landing-page',
          path: 'admin-landing-page',
          component: () => import('@/views/Admin/admin-landing-page/AdminLandingPage')
        },
        { // 菜单管理
          name: 'frame-menu-manage',
          path: 'menu-manage',
          component: () => import('@/views/Admin/menu-manage/MenuManage')
        },
        { // 大屏菜单管理
          name: 'big-screen-menu-manage',
          path: 'big-screen-menu-manage',
          component: () => import('@/views/Admin/big-screen-manage/screen-menu-manage/ScreenMenuManage'),
          meta: {
            title: '大屏菜单管理'
          }
        },
        {
          name: 'role-manage',
          path: 'role-manage',
          component: () => import('@/views/Admin/role-manage/RoleManageIndex'),
          meta: {
            title: '角色管理'
          }
        },
        {
          name: 'big-screen-role-manage',
          path: 'big-screen-role-manage',
          component: () => import('@/views/Admin/big-screen-manage/screen-role-manage/ScreenRoleManage'),
          meta: {
            title: '大屏角色管理'
          }
        },
        {
          name: 'info-manage',
          path: 'info-manage',
          component: () => import('@/views/Admin/info-manage/InfoManage'),
          meta: {
            title: '消息管理'
          }
        },
        {
          name: 'feedback-manage',
          path: 'feedback-manage',
          component: () => import('@/views/Admin/feedback-manage/FeedbackManage'),
          meta: {
            title: '反馈管理'
          }
        },

        // 发版管理
        {
          name: 'frame-release-version-mgmt',
          path: 'release-version-mgmt',
          component: () => import('@/views/Admin/release-version-mgmt/release-version-mgmt')
        },
        {
          name: 'frame-release-version-mgmt-edit',
          path: 'release-version-mgmt/edit/:id',
          component: () => import('@/views/Admin/release-version-mgmt/edit')
        },

        { // 产供驾驶舱web化
          name: 'frame-ps-dashboard',
          path: 'ps-dashboard',
          component: () => import('@/views/BIView/PsDashboard/PsDashboard')
        },
        { // 经营看板
          name: 'frame-operate-dashboard',
          path: 'operate-dashboard',
          component: () => import('@/views/BIView/OperateDashboard/OperateDashboard')
        },
        { // 经营看板 新
          name: 'frame-operate-dashboard-t',
          path: 'operate-dashboard-t',
          component: () => import('@/views/BIView/OperateDashboard_T/OperateDashboard')
        },
        { // 标准精简
          name: 'frame-dt-standard-simplify',
          path: 'dt-standard-simplify',
          component: () => import('@/views/BIView/ProductSupply/DTStandardSupply/DTStandardSupply')
        },

        {  //活动货期报表
          name: 'frame-dt-activity-leadtime',
          path: 'dt-activity-leadtime',
          component: () => import('@/views/BIView/ProductSupply/ActivityLeadTime/ActivityLeadTime')
        },

        {  //运营下单历史报表
          name: 'frame-dt-activity-operating',
          path: 'dt-activity-operating',
          component: () => import('@/views/BIView/ProductSupply/OperatingStatements/OperatingStatements')
        },

        {  //采购精简版
          name: 'frame-dt-purchase-simplify',
          path: 'dt-purchase-simplify',
          component: () => import('@/views/BIView/ProductSupply/PurchaseSimplify/PurchaseSimplify')
        },

        {  //货期报表
          name: 'frame-dt-delivery-report',
          path: 'dt-delivery-report',
          component: () => import('@/views/BIView/ProductSupply/DeliveryReport/DeliveryReport')
        },

        {  //实时业绩 报表的
          name: 'frame-real-time-performancetable',  
          path: 'real-time-performancetable',
          component: () => import('@/views/BIView/ProductSupply/RealTimePerformanceTable/RealTimePerformanceTable')
        },

        {  //大屏web化  客服排行  real-time-performance
          name: 'frame-real-time-performance',
          path: 'real-time-performance',
          component: () => import('@/views/BIView/DataV/RealTimePerformance/RealTimePerformance')
        },

        {  //大屏web化  天猫客服  real-time-performance
          name: 'frame-real-time-TMperformance',
          path: 'real-time-TMperformance',
          component: () => import('@/views/BIView/DataV/RealTimePerformance/TMRealTimePerformance')
        },

        {  //大屏web化  京东客服  real-time-JDperformance
          name: 'frame-real-time-JDperformance',
          path: 'real-time-JDperformance',
          component: () => import('@/views/BIView/DataV/RealTimePerformance/JDRealTimePerformance')
        },

        {  //大屏web化  全渠道大屏
          name: 'frame-omni-channel',
          path: 'omni-channel',
          component: () => import('@/views/BIView/DataV/OmniChannel/OmniChannel')
        },

        {  //大屏web化  新品监控大屏
          name: 'frame-news-monitoring',
          path: 'news-monitoring',
          component: () => import('@/views/BIView/DataV/NewsMonitoring/NewsMonitoring')
        },

        {  //  新品监控大屏和项目组  切换页面
          name: 'frame-ptnm-ptnmswitchview',
          path: 'ptnm-ptnmswitchview',
          component: () => import('@/views/BIView/DataV/NewsMonitoring/PTNMSwitchView')
        },


        {  //  抖音快手直播业绩大屏  TiktokKwaiLive
          name: 'frame-live-tiktokkwailive',
          path: 'live-tiktokkwailive',
          component: () => import('@/views/BIView/DataV/TiktokV/TiktokKwaiLive')
        },

        {  //  仓储分拔理货大屏  SD_Tally
          name: 'frame-SD-SD_Tally',
          path: 'SD-SD_Tally',
          component: () => import('@/views/BIView/DataV/Logistics/SD_Tally')
        },

        {  //  仓储分拔大挂大屏  SD_BigBang
          name: 'frame-SD-SD_BigBang',
          path: 'SD-SD_BigBang',
          component: () => import('@/views/BIView/DataV/Logistics/SD_BigBang')
        },

        {
          name: 'frame-team-ship-daily',
          path: 'team-ship-daily',
          component: () => import('@/views/BIView/ProductSupply/TeamShipDaily/TeamShipDaily')
        },
        {
          name: 'frame-ps-sale-yoy',
          path: 'ps-sale-yoy',
          component: () => import('@/views/BIView/ProductSupply/SaleYoy/SaleYoy')
        },

        { // 线下待评价单 web化
          name: 'frame-offline-to-be-evaluated-sheet',
          path: 'offline-to-be-evaluated-sheet',
          component: () => import('@/views/BIView/ProductSupply/OfflineToBeEvaluatedSheet/index.vue')
        },

        { // 可货审数据明细 web化
          name: 'frame-auditable-data-details',
          path: 'auditable-data-details',
          component: () => import('@/views/BIView/ProductSupply/AuditableDataDetails/index.vue')
        },

        { // 销售利润业绩报表 web化
          name: 'frame-sales-profit-performance-statement',
          path: 'sales-profit-performance-statement',
          component: () => import('@/views/BIView/ProductSupply/SalesProfitPerformanceStatement/index.vue')
        },

        {  //大屏web化  新项目组排名
          name: 'frame-project-group-ranking',
          path: 'project-group-ranking',
          component: () => import('@/views/BIView/DataV/ProjectGroupRanking')
        },

        { // 实时业绩 web化
          name: 'frame-channel-overview-real-time-performance',
          path: 'channel-overview-real-time-performance',
          component: () => import('@/views/BIView/ProductSupply/ChannelOverviewRealTimePerformance/index.vue')
        },

        { // 海外驾驶舱 web化
          name: 'frame-overseas-cockpit',
          path: 'overseas-cockpit',
          component: () => import('@/views/BIView/ProductSupply/OverseasCockpit/index.vue')
        },

        { // 店铺业绩 web化
          name: 'frame-store-performance',
          path: 'store-performance',
          component: () => import('@/views/BIView/ProductSupply/StorePerformance/index.vue')
        },

        { // 新零售 web化
          name: 'frame-new-retail-cockpit',
          path: 'new-retail-cockpit',
          component: () => import('@/views/BIView/ProductSupply/NewRetailCockpit/index.vue')
        },

        { // 全中驾驶舱 web化
          name: 'frame-strike-cockpit',
          path: 'strike-cockpit',
          component: () => import('@/views/BIView/ProductSupply/StrikeCockpit/index.vue')
        },

        {  //大屏web化  新零售招商进度
          name: 'frame-progress-of-new-retail-investment',
          path: 'progress-of-new-retail-investment',
          component: () => import('@/views/BIView/DataV/ProgressOfNewRetailInvestment')
        },

        { // 全中驾驶舱 web化
          name: 'frame-strike-cockpit',
          path: 'strike-cockpit',
          component: () => import('@/views/BIView/ProductSupply/StrikeCockpit/index.vue')
        },
        { //天猫大屏
          name: 'frame-tmall-screen',
          path: 'frame-tmall-screen',
          component: () => import('@/views/BIView/DataV/TmallScreen/TmallScreen')
        }
      ]
    },
    ...otherRoutes
  ]
})

const allowRouteList = ['404', '403', '502', 'noticePage','frame-news-monitoring','frame-ptnm-ptnmswitchview',
  'frame-omni-channel','frame-real-time-performance','frame-real-time-TMperformance','frame-real-time-JDperformance',
  'frame-progress-of-new-retail-investment', 'frame-project-group-ranking', 'frame-tmall-screen']

router.beforeEach((to, from, next) => {
  if (!userInfoOk && allowRouteList.indexOf(to.name) < 0) {
    getUserInfo().then(next).catch((e) => {
      if (e.toJSON().message &&
        (e.toJSON().message === 'Request failed with status code 502' || e.toJSON().message.includes('timeout'))) {
        next('/502')
      } else {
        next('/403')
      }
    })
  } else {
    next()
  }
  // if(to.name === 'noticePage') {
  //   next()
  // } else {
  //   next('/noticePage')
  // }
})

export default router
