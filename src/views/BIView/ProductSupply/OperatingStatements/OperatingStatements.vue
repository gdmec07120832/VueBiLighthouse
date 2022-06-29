<template>
  <div style="position: relative">
    <y-loading :loading.sync="loading" @cancelLoading="cancelExport"></y-loading>
    <top-toolbar @contextMenuClick="handleContextMenuClick" />

    <div>
      <div style="background-color: #f5faff; height: 100vh; padding: 0 2%; overflow: auto">
        <div class="py10" style="margin: auto">
          <div style="font-size: 26px">运营下单历史报表</div>
          <div style="line-height: 24px" class="sub-tip">
            备注：【1】数据更新周期：每天2点、12点30分、19点30分运行； 【2】数据保留时间：15天；
          </div>
        </div>

        <div style="background-color: #fff; border-radius: 4px; min-height: calc(100vh - 100px)">
          <!-- <span @click="test_router()">标准精简</span> -->
          <div class="flex flex-between mx20 py10" style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
            <div style="font-size: 16px; font-weight: bold">运营下单历史报表</div>
            <div>
              <simple-select label="加载时间" v-model="query.loadTime" :options="dateOptions"></simple-select>
            </div>
          </div>
          <div class="flex flex-start" style="padding: 20px 20px 0">
            <div style="width: 24%; margin-right: 2%">
              <virtual-select
                v-model="query.TEAM_SUPPLY"
                :label-width="{ flex: '0 0 62px' }"
                label="项目组"
                box-width="223px"
                :options="teamSupplyOptions.map((_) => ({ label: _ }))"
              ></virtual-select>
            </div>
            <div style="width: 24%; margin-right: 2%">
              <virtual-select
                v-model="query.MAIN_SERIAL"
                :options="mainSerialOptions.map((_) => ({ label: _ }))"
                box-width="223px"
                label="系列主型号"
              ></virtual-select>
            </div>
            <div style="width: 24%; margin-right: 2%">
              <virtual-select
                v-model="query.M_NAME"
                :options="mNameOptions.map((_) => ({ label: _ }))"
                box-width="223px"
                label="物料名称"
              ></virtual-select>
            </div>
            <div style="width: 24%">
              <y-input label="物料编码" show-suffix v-model="query.M_CODE" @input="getData2(true)" />
            </div>
          </div>

          <div class="flex flex-end" style="padding: 20px">
            <div style="flex: 1 1 auto; text-align: right">
              <div
                style="
                  display: inline-block;
                  line-height: 32px;
                  border-radius: 2px;
                  font-size: 12px;
                  border: 1px solid rgba(0, 0, 0, 0.15);
                  padding: 0 8px;
                  cursor: pointer;
                "
                @click="handleContextMenuClick('downloadExcel')"
              >
                导出Excel
              </div>
            </div>
          </div>

          <div style="padding: 0 20px">
            <y-table
              :options="table"
              @change="handleChange"
              rowKey="M_CODE"
              :loading="table.loading"
            ></y-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let table_width = (window.innerWidth - 8 - window.innerWidth * 0.02 * 2 - 40) / 16

import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import YInput from '@/views/BIView/components/YInput/YInput'
import YTable from '@/views/BIView/components/YTable/YTable'
import SimpleSelect from '@/views/BIView/ProductSupply/components/SimpleSelect/SimpleSelect'
import moment from 'moment'
import TopToolbar from '@/views/BIView/components/TopToolbar/TopToolbar'
import YLoading from '@/views/BIView/components/YLoading/YLoading'
import { downloadBlob, numGroupSep } from '@/utils/helper'
import axios from 'axios'

export default {
  name: 'ActivityLeadTime',

  components: { YLoading, TopToolbar, SimpleSelect, YInput, VirtualSelect, YTable },
  data() {
    return {
      authTeam: '',
      excel: {
        show: false,
        excel_show: false,
      },
      sorting: {
        field: 'rownum',
        order: 'asc',
      },
      loading: false,
      allOptions: [],
      dateOptions: [],
      teamSupplyOptions: [],
      mainSerialOptions: [],
      mNameOptions: [],
      query: {
        loadTime: '',
        M_CODE: '',
        TEAM_SUPPLY: [],
        MAIN_SERIAL: [],
        M_NAME: [],
      },
      TDATE: undefined,
      table: {
        transformCellText: ({ text }) => {
          if (typeof text === 'number') {
            return numGroupSep(Math.round(text * 1000) / 1000)
          }
          return text
        },
        loading: false,
        pagination: {
          total: 0,
          page: 1,
          pageSize: 12,
        },
        data: [],
        columns: []
      },
    }
  },

  computed: {
    tableColumns() {
      return [
        { title: '物料编码', dataIndex: 'M_CODE', fixed: true, width: 150, ellipsis: true },
        { title: '供应商', dataIndex: 'SUPPLIER', fixed: true, width: table_width, ellipsis: true },
        { title: '系列', dataIndex: 'M_SERIES', fixed: true, width: table_width, ellipsis: true },
        { title: '项目组', dataIndex: 'TEAM_SUPPLY', fixed: true, width: table_width, ellipsis: true },
        { title: '系列主型号', dataIndex: 'MAIN_SERIAL', fixed: true, width: table_width, ellipsis: true },
        { title: '物料名称', dataIndex: 'M_NAME', fixed: true, width: table_width, ellipsis: true },
        { title: '物料描述', dataIndex: 'M_DESC', fixed: true, width: table_width, ellipsis: true },
        { title: '主型号', dataIndex: 'MAIN_MODEL', fixed: true, width: table_width, ellipsis: true },
        { title: '研发分类', dataIndex: 'CLASS_DEVELOPMENT', fixed: true, width: table_width, ellipsis: true },
        { title: '是否停产', dataIndex: 'IS_STOP', fixed: true, width: table_width, ellipsis: true },
        ...[
          5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190,
          200, 210, 220,
        ].map((item) => {
          return {
            title: `${item}天`,
            dataIndex: `MARKETABLE_QTY${item}`,
            width: table_width - 10,
            align: 'right',
            sorter: true,
          }
        }),

        { title: '是否有效', dataIndex: 'IS_VALID', width: table_width, ellipsis: true },
        { title: '是否可销售', dataIndex: 'IS_SALABLE', width: table_width, ellipsis: true },
        {
          title: '实时销量',
          dataIndex: 'RLTM_ORDERS_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: '剩余可销售数',
          dataIndex: 'REM_MARKA_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        ...Array.from({ length: 14 }, (_, i) => {
          const m = 14 - i
          return {
            title: moment(this.TDATE || this.query.loadTime || undefined)
              .subtract(m, 'month')
              .format('YYYY年MM月销量'),
            dataIndex: `SALES_QTY_HIS${m}`,
            width: table_width + 30,
            align: 'right',
            sorter: true,
          }
        }),
        {
          title: moment(this.TDATE || this.query.loadTime || undefined).format('YYYY年MM月销量'),
          dataIndex: 'SALES_QTY_HIS',
          width: table_width + 30,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        ...Array.from({length: 3}, (_, i) => {
          const m = 2 - i
          return {
            title: moment(this.TDATE || this.query.loadTime || undefined).subtract(m, 'month').format('YYYY年MM月抖快销量'),
            dataIndex : m === 0 ? 'DY_KS_SALES_QTY_HIS' : `DY_KS_SALES_QTY_HIS${m}`,
            width: table_width + 60,
            align: 'right',
            sorter: true,
          }
        }),
        ...Array.from({length: 3}, (_, i) => {
          const m = 2 - i
          return {
            title: moment(this.TDATE || this.query.loadTime || undefined).subtract(m, 'month').format('YYYY年MM月海外销量'),
            dataIndex : m === 0 ? 'OVERSEA_SALES_QTY_HIS' : `OVERSEA_SALES_QTY_HIS${m}`,
            width: table_width + 60,
            align: 'right',
            sorter: true,
          }
        }),
        ...Array.from({length: 6}, (_, i) => {
          const m = 5 - i
          return {
            title: moment(this.TDATE || this.query.loadTime || undefined).subtract(m, 'month').format('YYYY年MM月发货数'),
            dataIndex : m === 0 ? 'DLVR_QTY_HIS' : `DLVR_QTY_HIS${m}`,
            width: table_width + 40,
            align: 'right',
            sorter: true,
          }
        }),
        {
          title: '月均发货数',
          dataIndex: 'AVG_DLVR_QTY',
          width: table_width,
          align: 'right',
          sorter: true,
        },
        {
          title: '平均采购价',
          dataIndex: 'AVG_PURPRICE',
          width: table_width,
          align: 'right',
          sorter: true,
        },
        {
          title: '销售价',
          dataIndex: 'SALES_PRICE',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: '月均销量',
          dataIndex: 'AVG_SALES_QTY',
          width: table_width,
          align: 'right',
          sorter: true,
        },
        {
          title: '客审未发货订单数',
          dataIndex: 'UNDLVR_ORDERS_QTY',
          width: table_width + 35,
          align: 'right',
          sorter: true,
        },
        {
          title: '客审未货审订单数',
          dataIndex: 'UNGAUD_ORDERS_QTY',
          width: table_width + 35,
          align: 'right',
          sorter: true,
        },
        {
          title: '摆场无批次订单数量',
          dataIndex: 'NO_BT_SALES_QTY',
          width: table_width + 35,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        { title: '库存数', dataIndex: 'INV_QTY', width: table_width, ellipsis: true, align: 'right', sorter: true },
        { title: '锁库数', dataIndex: 'LOCK_QTY', width: table_width, ellipsis: true, align: 'right', sorter: true },
        {
          title: '其它锁库数',
          dataIndex: 'NO_LOCK_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: '库存可用数',
          dataIndex: 'INV_USE_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },

        {
          title: '两库现货实数',
          dataIndex: 'STK2_SPOTS_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: '仓库现货实数',
          dataIndex: 'STK_SPOTS_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: '供应商库存',
          dataIndex: 'SPL_STK_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },

        { title: '安全库存天数', dataIndex: 'ACT_SAFETY_INV_DAYS', width: table_width, ellipsis: true },
        { title: '安全库存状态', dataIndex: 'SAFETY_INV_STATUS', width: table_width, ellipsis: true },

        {
          title: '待检数',
          dataIndex: 'WAIT_INSP_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: moment(this.TDATE || this.query.loadTime || undefined).format('YYYY-MM') + '累计未合格数',
          dataIndex: 'INTRNS_QTY_M1',
          width: table_width + 50,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: moment(this.TDATE || this.query.loadTime || undefined).add(1, 'month').format('YYYY-MM') + '累计未合格数',
          dataIndex: 'INTRNS_QTY_M2',
          width: table_width + 50,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: moment(this.TDATE || this.query.loadTime || undefined).add(2, 'month').format('YYYY-MM') + '累计未合格数',
          dataIndex: 'INTRNS_QTY_M3',
          width: table_width + 50,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },

        {
          title: moment(this.TDATE || this.query.loadTime || undefined).add(3, 'month').format('YYYY-MM') + '累计未合格数',
          dataIndex: 'INTRNS_QTY_M4',
          width: table_width + 50,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: '累计未合格数(在途)',
          dataIndex: 'UNINSP_QTY',
          width: table_width + 50,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: '实际可销售数',
          dataIndex: 'ACTUL_MARKA_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: '待下推采购数',
          dataIndex: 'UNPUSH_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: '待签署采购数',
          dataIndex: 'UNSIGN_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        {
          title: '总可销售数',
          dataIndex: 'TOTAL_MARKA_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },

        { title: '安全在途天数', dataIndex: 'ACT_SAFETY_INTRNS_DAYS', width: table_width, ellipsis: true },
        { title: '安全在途状态', dataIndex: 'SAFETY_INTRNS_STATUS', width: table_width, ellipsis: true },
        {
          title: '林氏90天滞销',
          dataIndex: 'OVER90_STK_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },

        {
          title: '总仓90天滞销',
          dataIndex: 'OVER90_STK2_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        { title: '下单类别', dataIndex: 'ORDER_CATEGORY', width: table_width, ellipsis: true },
        {
          title: '最小起订量',
          dataIndex: 'MIN_ORDER_QTY',
          width: table_width,
          ellipsis: true,
          align: 'right',
          sorter: true,
        },
        { title: '最早上架日期', dataIndex: 'ERLY_SHELVES_DATE', width: table_width, ellipsis: true },
        { title: '停产日期', dataIndex: 'STOP_DATE', width: table_width, ellipsis: true },
        { title: '是否一件代发', dataIndex: 'IS_SPL_DIRECT_SEND', width: table_width, ellipsis: true },
        { title: '单品升级性质', dataIndex: 'UNIT_PROD_LVLUP_NATR', width: table_width, ellipsis: true },

        { title: '商品类别', dataIndex: 'CATEGORY_NAME', width: table_width, ellipsis: true },
        { title: '小类', dataIndex: 'MINOR_CLASS', width: table_width, ellipsis: true },

        { title: '大类', dataIndex: 'MAJOR_CLASS', width: table_width, ellipsis: true },
        { title: '一级风格', dataIndex: 'STYLE_PRODUCT', width: table_width, ellipsis: true },
        { title: '二级风格', dataIndex: 'STYLE_PRODUCT2', width: table_width, ellipsis: true },
        { title: '材质', dataIndex: 'TEXTURES', width: table_width, ellipsis: true },
        { title: '销售类目', dataIndex: 'GOODS_CATEGORY', width: table_width, ellipsis: true },
        { title: '销售利润分类', dataIndex: 'SALES_PROFIT_CLASS', width: table_width, ellipsis: true },
        { title: '渠道专供', dataIndex: 'CHANNEL_FOR', width: table_width, ellipsis: true },
        { title: '软货标签', dataIndex: 'SOFT_GOODS_LABEL', width: table_width, ellipsis: true },
        { title: 'BD货配套标签', dataIndex: 'BD_LABEL', width: table_width, ellipsis: true },
        { title: '数据加载时间', dataIndex: 'LOAD_TIME', width: table_width, ellipsis: true },
      ]
    },
    queryCombine() {
      // 目的是监测这个三个筛选值的变化然后再运行函数！
      return this.query.MAIN_SERIAL.toString() + this.query.TEAM_SUPPLY.toString() + this.query.M_NAME.toString()
    },
  },

  watch: {
    tableColumns: {
      immediate: true,
      handler(val) {
        this.table.columns = val
      }
    },
    'table.pagination.page'() {
      this.getData2()
    },
    queryCombine() {
      setTimeout(() => {
        this.getData2(true)
      }, 50)
    },

    'query.loadTime'() {
      this.getData2(true)
    },

    'query.TEAM_SUPPLY'(val) {
      const filtered = this.allOptions.filter((_) => {
        return val && val.length ? val.indexOf(_.TEAM_SUPPLY) > -1 : true
      })
      this.mainSerialOptions = Object.freeze(Array.from(new Set(filtered.map((_) => _.MAIN_SERIAL))))
      this.mNameOptions = Object.freeze(Array.from(new Set(filtered.map((_) => _.M_NAME))))
    },

    'query.MAIN_SERIAL'(val, oldVal) {
      if (JSON.stringify(val) === JSON.stringify(oldVal)) {
        return
      }
      const filtered = this.allOptions.filter((_) => {
        return val && val.length ? val.indexOf(_.MAIN_SERIAL) > -1 : true
      })
      this.mNameOptions = Object.freeze(Array.from(new Set(filtered.map((_) => _.M_NAME))))
    },
  },

  async created() {
    await this.getTeamAuth()
    await this.getData1() //async await一起用可以使异步执行的方法运行效果和同步一样
    // this.getData2()
    this.getQueryOptions()
  },

  methods: {
    excel_show_fun(val) {
      if (val == 1) {
        this.excel.excel_show = true
      } else if (val == 'excel') {
        this.excel.show = false
        this.excel.excel_show = false
      } else {
        this.excel.excel_show = false
      }
    },

    getQueryOptions() {
      this.$fetchSql('pds_sop', 'bord_filter_item').then(({ data }) => {
        this.allOptions = Object.freeze(
          data.filter((item) => {
            return this.authTeam ? item['TEAM_SUPPLY'] === this.authTeam : true
          })
        )
        this.teamSupplyOptions = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.TEAM_SUPPLY))))
        this.mainSerialOptions = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.MAIN_SERIAL))))
        this.mNameOptions = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.M_NAME))))
      })
    },

    test_router() {
      this.$router.push({
        path: '/x/4_647_813_842',
      })
    },
    getTeamAuth() {
      return this.$fetchSql('pds_sop', 'bord_authorization_control', {
        NO: (this.$store.state.user?.userInfo?.username).toString(),
      }).then(({ data }) => {
        this.authTeam = data[0] ? data[0]['TEAM_SUPPLY'] : ''
      })
    },
    getData1() {
      return this.$fetchSql('pds_sop', 'bord_load_time').then(({ data }) => {
        this.dateOptions = data.map((_) => _.LOAD_TIME).sort((a, b) => moment(b) - moment(a))
        this.query.loadTime = this.dateOptions[0]
      })
    },

    getData2(isResetPage = false) {
      if (isResetPage) {
        this.table.pagination.page = 1
      }
      this.table.loading = true
      const params = {
        LOAD_TIME: this.query.loadTime,
        PAGE: this.table.pagination.page,
        PAGE_SIZE: this.table.pagination.pageSize,
        ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
      }

      const { M_CODE, TEAM_SUPPLY, MAIN_SERIAL, M_NAME } = this.query
      M_CODE && (params.M_CODE = M_CODE)
      if (this.authTeam) {
        params.TEAM_SUPPLY = this.authTeam
      }
      TEAM_SUPPLY && TEAM_SUPPLY.length && (params.TEAM_SUPPLY = TEAM_SUPPLY.join(','))
      MAIN_SERIAL && MAIN_SERIAL.length && (params.MAIN_SERIAL = MAIN_SERIAL.join(','))
      M_NAME && M_NAME.length && (params.M_NAME = M_NAME.join(','))

      this.$fetchSql('pds_sop', 'bord', params)
        .then(({ data }) => {
          this.table.data = data
          this.table.pagination.total = data?.[0]?.TOT_ROWNUM || 0
          this.TDATE = data?.[0]?.TDATE
        })
        .finally(() => {
          this.table.loading = false
        })
    },

    handleChange(pagination, filter, sorters) {
      const orderMap = {
        ascend: 'asc',
        descend: 'desc',
      }
      let { field, order } = sorters
      if (field && order) {
        field = `T.${field}`
        order = orderMap[order]
      } else {
        field = 'rownum'
        order = 'asc'
      }
      this.sorting.field = field
      this.sorting.order = order
      this.getData2()
    },

    handleContextMenuClick(type) {
      if (this.loading) {
        return
      }
      if (type === 'downloadExcel') {
        const params = {
          LOAD_TIME: this.query.loadTime,
        }

        const { M_CODE, TEAM_SUPPLY, MAIN_SERIAL, M_NAME } = this.query
        M_CODE && (params.M_CODE = M_CODE)
        if (this.authTeam) {
          params.TEAM_SUPPLY = this.authTeam
        }
        TEAM_SUPPLY && TEAM_SUPPLY.length && (params.TEAM_SUPPLY = TEAM_SUPPLY.join(','))
        MAIN_SERIAL && MAIN_SERIAL.length && (params.MAIN_SERIAL = MAIN_SERIAL.join(','))
        M_NAME && M_NAME.length && (params.M_NAME = M_NAME.join(','))
        this.loading = true
        this.cancelTokenSource = axios.CancelToken.source()

        this.$axios
          .post(
            'api/admin/data/exportExcel',
            {
              excelName: '运营下单历史报表',
              sheetConfigList: [
                {
                  params: {
                    ...params,
                    PAGE: 1,
                    PAGE_SIZE: this.table.data[0]?.TOT_ROWNUM || 0,
                  },
                  prefix: 'pds_sop',
                  interfaceName: 'bord',
                  sheetName: '运营下单历史报表',
                  columnConfigList: this.tableColumns.map((_) => ({
                    colWidth: Number((_.width / 10).toFixed(0)),
                    dbColName: _.dataIndex,
                    excelColName: _.title,
                  })),
                },
              ],
            },
            {
              timeout: 60 * 1000 * 3,
              responseType: 'blob',
              cancelToken: this.cancelTokenSource.token,
            }
          )
          .then(({ data, headers }) => {
            const filename = headers['content-disposition'].match(/filename=(.*)/)[1]
            downloadBlob(data, decodeURIComponent(filename))
          })
          .finally(() => {
            this.loading = false
          })
        this.excel_show_fun(2)
      }
    },

    cancelExport() {
      this.cancelTokenSource.cancel()
    },
  },
}
</script>

<style lang="scss" scoped>
.sub-tip {
  color: #999;
  font-size: 12px;
}

/deep/ .ant-table {
  color: rgba(0, 0, 0, 1);
}

.export_excel {
  width: 30px;
  height: 30px;
  background: url('~@/assets/images/excel_img.png') no-repeat left center/contain;
  float: right;
  margin-right: 15px;
}

.export-menu {
  width: 85px;
  background: #ffffff;
  border: 1px solid #e4e4e4;
  margin-top: 15px;
  float: right;
  margin-right: -16px;
  cursor: pointer;

  &:hover {
    background: #cccccc80;
  }
}

.export-menu-item {
  text-align: center;
  font-size: 12px;
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
