<template>
  <div style="position: relative">
    <y-loading :loading.sync="loading" @cancelLoading="cancelExport"></y-loading>
    <top-toolbar @contextMenuClick="handleContextMenuClick" />
    <div>
      <div style="background-color: #f5faff; height: 100vh; padding: 0 2%; overflow: auto">
        <div class="py10" style="margin: auto">
          <div style="font-size: 26px">货期运营标准精简报表</div>
          <div style="line-height: 24px" class="sub-tip">备注：数据更新周期：每天2点运行</div>
        </div>
        <div style="background-color: #fff; border-radius: 4px; min-height: calc(100vh - 100px)">
          <div class="flex flex-between mx20 py10" style="border-bottom: 1px solid rgba(0, 0, 0, 0.05)">
            <div style="font-weight: bold; font-size: 16px">精简报表</div>
            <div>
              <simple-select label="加载时间" v-model="query.loadTime" :options="dateOptions"></simple-select>
            </div>
          </div>
          <div class="flex flex-start" style="padding: 20px">
            <div style="width: 24%; margin-right: 2%">
              <virtual-select
                v-model="query.TEAM_SUPPLY"
                :labelWidth="{ flex: '0 0 62px' }"
                label="项目组"
                :options="teamSupplyOptions.map((_) => ({ label: _ }))"
              ></virtual-select>
            </div>
            <div style="width: 24%; margin-right: 2%">
              <virtual-select
                v-model="query.MAIN_SERIAL"
                :options="mainSerialOptions.map((_) => ({ label: _ }))"
                label="系列主型号"
              ></virtual-select>
            </div>
            <div style="width: 24%; margin-right: 2%">
              <virtual-select
                v-model="query.M_NAME"
                :options="mNameOptions.map((_) => ({ label: _ }))"
                box-width="300px"
                label="物料名称"
              ></virtual-select>
            </div>
            <div style="width: 24%">
              <y-input label="物料编码" show-suffix v-model="query.M_CODE" @input="getData2(true)" />
            </div>
          </div>
          <div class="flex flex-end" style="padding: 0 20px 20px">
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
              class="text-black"
              style=""
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
import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import YInput from '@/views/BIView/components/YInput/YInput'
import YTable from '@/views/BIView/components/YTable/YTable'
import SimpleSelect from '@/views/BIView/ProductSupply/components/SimpleSelect/SimpleSelect'
import moment from 'moment'
import TopToolbar from '@/views/BIView/components/TopToolbar/TopToolbar'
import { downloadBlob, numGroupSep } from '@/utils/helper'
import YLoading from '@/views/BIView/components/YLoading/YLoading'
import axios from 'axios'

export default {
  name: 'DTStandardSupply',
  components: { YLoading, TopToolbar, SimpleSelect, YTable, YInput, VirtualSelect },
  data() {
    return {
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
        columns: [],
        data: [],
      },
      TDATE: undefined,
    }
  },
  computed: {
    tableColumns() {
      return [
        { title: '数据加载时间', dataIndex: 'LOAD_TIME', fixed: true, width: 100, ellipsis: true },
        { title: '物料编码', dataIndex: 'M_CODE', fixed: true, width: 150, ellipsis: true },
        { title: '供应商', dataIndex: 'SUPPLIER', fixed: true, width: 80, ellipsis: true },
        { title: '系列', dataIndex: 'M_SERIES', fixed: true, width: 80, ellipsis: true },
        { title: '项目组', dataIndex: 'TEAM_SUPPLY', fixed: true, width: 80, ellipsis: true },
        { title: '系列主型号', dataIndex: 'MAIN_SERIAL', fixed: true, width: 100, ellipsis: true },
        { title: '物料名称', dataIndex: 'M_NAME', fixed: true, width: 100, ellipsis: true },
        { title: '物料描述', dataIndex: 'M_DESC', fixed: true, width: 100, ellipsis: true },

        { title: '主型号', dataIndex: 'MODEL_MAIN', fixed: true, width: 100, ellipsis: true },
        { title: '研发分类', dataIndex: 'CLASS_DEVELOPMENT', fixed: true, width: 100, ellipsis: true },

        { title: '是否停产', dataIndex: 'IS_STOP', fixed: true, width: 80, ellipsis: true },
        ...[
          5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190,
          200, 210, 220,
        ].map((item) => {
          return {
            title: `${item}天`,
            dataIndex: `MARKETABLE_QTY${item}`,
            width: 80,
            align: 'right',
            ellipsis: true,
            sorter: true,
          }
        }),
        { title: '实时销量', dataIndex: 'RLTM_ORDERS_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        { title: '剩余可销售数', dataIndex: 'REM_MARKA_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        ...Array.from({ length: 5 }, (_, i) => {
          const m = 5 - i
          return {
            title: moment(this.TDATE || this.query.loadTime || undefined)
              .subtract(m, 'month')
              .format('YYYY年MM月'),
            dataIndex: `SALES_QTY_HIS${m}`,
            width: 100,
            align: 'right',
            ellipsis: true,
            sorter: true,
          }
        }),
        {
          title: moment(this.TDATE || this.query.loadTime || undefined).format('YYYY年MM月'),
          dataIndex: 'SALES_QTY_HIS',
          width: 100,
          align: 'right',
          ellipsis: true,
          sorter: true,
        },
        //
        { title: '销售价', dataIndex: 'SALES_PRICE', width: 100, align: 'right', ellipsis: true, sorter: true },
        { title: '月均销量', dataIndex: 'AVG_SALES_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        {
          title: '客审未货审订单',
          dataIndex: 'UNGAUD_ORDERS_QTY',
          width: 100,
          align: 'right',
          ellipsis: true,
          sorter: true,
        },
        { title: '库存数', dataIndex: 'INV_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        { title: '锁库数', dataIndex: 'LOCK_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        { title: '其他锁库数', dataIndex: 'NO_LOCK_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        { title: '库存可用数', dataIndex: 'INV_USE_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        { title: '安全库存数', dataIndex: 'SFTY_STK_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        { title: '供应商库存', dataIndex: 'SPL_STK_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        { title: '仓库现货实数', dataIndex: 'STK_SPOTS_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        {
          title: '两库现货实数',
          dataIndex: 'STK2_SPOTS_QTY',
          width: 100,
          align: 'right',
          ellipsis: true,
          sorter: true,
        },
        { title: '当天欠货数', dataIndex: 'BACKLOG1', width: 100, align: 'right', ellipsis: true, sorter: true },
        {
          title: '安全库存天数',
          dataIndex: 'ACT_SAFETY_INV_DAYS',
          width: 100,
          align: 'right',
          ellipsis: true,
          sorter: true,
        },
        {
          title: '安全库存状态',
          dataIndex: 'SAFETY_INV_STATUS',
          width: 100,
          align: 'right',
          ellipsis: true,
          sorter: true,
        },
        { title: '总累计未及格数', dataIndex: 'UNINSP_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        {
          title: '实际可销售数',
          dataIndex: 'ACTUL_MARKA_QTY',
          width: 100,
          align: 'right',
          ellipsis: true,
          sorter: true,
        },
        {
          title: '安全在途天数',
          dataIndex: 'ACT_SAFETY_INTRNS_DAYS',
          width: 100,
          align: 'right',
          ellipsis: true,
          sorter: true,
        },
        {
          title: '安全在途状态',
          dataIndex: 'SAFETY_INTRNS_STATUS',
          width: 100,
          align: 'right',
          ellipsis: true,
          sorter: true,
        },
        { title: '待下推采购数', dataIndex: 'UNPUSH_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        { title: '待签署采购数', dataIndex: 'UNSIGN_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
        { title: '总可销售数', dataIndex: 'TOTAL_MARKA_QTY', width: 100, align: 'right', ellipsis: true, sorter: true },
      ]
    },
    queryCombine() {
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
    await this.getData1()
    this.getData2()
    this.getQueryOptions()
  },
  methods: {
    getQueryOptions() {
      this.$fetchSql('pds_sop', 'bord_filter_item').then(({ data }) => {
        this.allOptions = Object.freeze(data)
        this.teamSupplyOptions = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.TEAM_SUPPLY))))
        this.mainSerialOptions = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.MAIN_SERIAL))))
        this.mNameOptions = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _.M_NAME))))
      })
    },
    getData1() {
      return this.$fetchSql('pds_sop', 'bord_smpl_date').then(({ data }) => {
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
        page: this.table.pagination.page,
        pageSize: this.table.pagination.pageSize,
        ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
      }

      const { M_CODE, TEAM_SUPPLY, MAIN_SERIAL, M_NAME } = this.query
      M_CODE && (params.M_CODE = M_CODE)
      TEAM_SUPPLY && TEAM_SUPPLY.length && (params.TEAM_SUPPLY = TEAM_SUPPLY.join(','))
      MAIN_SERIAL && MAIN_SERIAL.length && (params.MAIN_SERIAL = MAIN_SERIAL.join(','))
      M_NAME && M_NAME.length && (params.M_NAME = M_NAME.join(','))
      this.$fetchSql('pds_sop', 'bord_smpl', params)
        .then(({ data }) => {
          const { totalRows, list } = data
          this.table.data = list
          this.table.pagination.total = totalRows
          this.TDATE = list[0]?.TDATE
        })
        .finally(() => {
          this.table.loading = false
        })
    },
    handleChange(pagination, filter, sorters) {
      console.log(sorters)
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
        TEAM_SUPPLY && TEAM_SUPPLY.length && (params.TEAM_SUPPLY = TEAM_SUPPLY.join(','))
        MAIN_SERIAL && MAIN_SERIAL.length && (params.MAIN_SERIAL = MAIN_SERIAL.join(','))
        M_NAME && M_NAME.length && (params.M_NAME = M_NAME.join(','))
        this.loading = true
        this.cancelTokenSource = axios.CancelToken.source()
        this.$axios
          .post(
            'api/admin/data/exportExcel',
            {
              excelName: '货期运营标准精简报表',
              sheetConfigList: [
                {
                  params,
                  prefix: 'pds_sop',
                  interfaceName: 'bord_smpl',
                  sheetName: '精简报表',
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

.text-black /deep/ .ant-table {
  color: #000;
}
</style>
