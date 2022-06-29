/*
 * @Author: 黄浩
 * @Date: 2021-11-29 10:18:31
 * @LastEditTime: 2021-12-22 16:52:16
 * @LastEditors: 
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import '@/components/Antd/antd-components'
import '@/assets/styles/index.scss'
import router from '@/routes'
import store from '@/store'
import instance from '@/utils/axios'
import Cookies from 'js-cookie'

import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-CN')

import Clipboard from 'v-clipboard'

Vue.use(Clipboard)

import VModal from 'vue-js-modal'

Vue.use(VModal)

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/component/axisPointer'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'

Vue.component('v-chart', {
  props: { ...ECharts.props },
  methods: {
    clear () {
      this.$refs.echarts.clear()
    }
  },
  render () {
    const props = this.$props
    const style = {
      width: '100%',
      height: '100%',
      color: '#ccc',
      whiteSpace: 'nowrap',
    }
    return <div style="width: 100%; height: 100%; overflow: hidden">
      {props.options?.isEmpty === true ?
        <div style={style} class="flex flex-center">{props.options?.emptyText || '空数据集'}</div>
        : <ECharts ref="echarts" options={props.options} autoresize={props.autoresize}
                   manualUpdate={props.manualUpdate}/>
      }
    </div>
  }
})

import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { ConfigProvider } from 'ant-design-vue'
import { fetchSql } from '@/utils/helper'

Vue.prototype.$axios = instance
Vue.prototype.$fetchSql = fetchSql
Vue.prototype.productionTip = false

import { tableCellTooltip } from '@/utils/directives'

Vue.directive('cellTip', tableCellTooltip)

if (process.env.NODE_ENV === 'development') {
  const token = new URL(window.location.href).searchParams.get('token')
  if (token) {
    Cookies.set('lsmyToken', token)
    Cookies.set('token', token)
  } else {
    Cookies.set('lsmyToken', process.env.VUE_APP_LOCAL_TOKEN)
    Cookies.set('token', process.env.VUE_APP_LOCAL_TOKEN)
  }
}

new Vue({
  router,
  store,
  render () {
    return <ConfigProvider locale={zhCN}>
      <App/>
    </ConfigProvider>
  },
}).$mount('#app')

