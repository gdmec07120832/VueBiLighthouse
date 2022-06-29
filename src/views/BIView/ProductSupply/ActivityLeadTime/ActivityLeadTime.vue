<template>
  <div style="position: relative">
    <y-loading :loading.sync="loading" @cancelLoading="cancelExport"></y-loading>
    <top-toolbar @contextMenuClick="handleContextMenuClick"/>

    <div>
      <div style="background-color: #f5faff; height: 100vh; padding: 0 2%; overflow: auto;">
        <div class="py10" style="margin: auto;">
          <div style="font-size: 26px">活动货期报表</div>
          <div style="line-height: 24px" class="sub-tip">备注：数据更新周期，从8:00开始至次日2:00，每小时运行1次；</div>
        </div>

        <div style="background-color: #fff; border-radius: 4px; min-height: calc(100vh - 100px)">
          <!-- <span @click="test_router()">标准精简</span> -->
          <div class="flex flex-between mx20 py10" style="border-bottom: 1px solid rgba(0, 0, 0, .05)">
            <div style="font-size: 16px; font-weight: bold">报表明细</div>
            <div>
              <simple-select label="加载时间" v-model="query.loadTime" :options="dateOptions"></simple-select>
            </div>
          </div>

          <!-- <div class="flex flex-start" style="padding: 20px;padding-top: 10px;padding-bottom: 0px;"> -->
          <div class="flex flex-start" style="padding: 20px 20px 0;">
            <div style="width: 24%; margin-right: 2%">
              <virtual-select v-model="query.TEAM_SUPPLY"
                              :label-width="{flex: '0 0 62px'}"
                              box-width="223px"
                              label="项目组" :options="teamSupplyOptions.map(_ => ({label: _}))"></virtual-select>
            </div>

            <div style="width: 24%; margin-right: 2%">
              <virtual-select v-model="query.MAIN_SERIAL"
                              :options="mainSerialOptions.map(_ => ({label: _}))"
                              box-width="223px"
                              label="系列主型号"></virtual-select>
            </div>

            <div style="width: 24%; margin-right: 2%;">
              <virtual-select v-model="query.M_NAME" :options="mNameOptions.map(_ => ({label: _}))"
                              box-width="223px"
                              label="物料名称"></virtual-select>
            </div>
            <div style="width: 24%;">
              <y-input label="物料编码" show-suffix v-model="query.M_CODE" @input="getData2(true)"/>
            </div>

          </div>

          <div class="flex flex-start" style="padding: 20px">
            <div style="flex: 1 1 auto; text-align: right">
              <div style="display: inline-block; line-height: 32px; border-radius: 2px; font-size: 12px;
              border: 1px solid rgba(0, 0, 0, .15); padding: 0 8px; cursor: pointer"
                   @click="handleContextMenuClick('downloadExcel')">导出Excel
              </div>
            </div>
          </div>


          <div>
            <!-- <div @mouseenter="excel.show=true" @mouseleave="excel.show=false" style="height: 40px;width: 100%;">
              <div v-show="excel.show" style="background: #ffffff;">
                <div class="export_excel" @click="excel_show_fun(1)"></div>
                <div class="export-menu" v-show="excel.excel_show" @click="handleContextMenuClick('downloadExcel')">
                  <div class="export-menu-item" >
                    Excel格式
                  </div>
                </div>
              </div>
            </div> -->

            <div @mouseenter="excel.show=true" @mouseleave="excel_show_fun('excel')" style="padding: 0 20px">
              <y-table :options="table" @change="handleChange" rowKey="M_CODE"
                       :loading="table.loading"></y-table>
            </div>
          </div>


        </div>

      </div>
    </div>
  </div>
</template>

<script>

var table_width = (window.innerWidth - 8 - (window.innerWidth * 0.02 * 2) - 40) / 16;

import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import YInput from '@/views/BIView/components/YInput/YInput'
import YTable from '@/views/BIView/components/YTable/YTable'
import SimpleSelect from '@/views/BIView/ProductSupply/components/SimpleSelect/SimpleSelect'
import moment from 'moment'
import TopToolbar from '@/views/BIView/components/TopToolbar/TopToolbar'
import YLoading from '@/views/BIView/components/YLoading/YLoading'
import {downloadBlob, numGroupSep} from '@/utils/helper'
import axios from 'axios'

export default {

  name: 'ActivityLeadTime',

  components: {YLoading, TopToolbar, SimpleSelect, YInput, VirtualSelect, YTable},
  data() {
    return {
      excel: {
        show: false,
        excel_show: false,
      },
      sorting: {
        field: 'rownum',
        order: 'asc'
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
        M_NAME: []
      },
      table: {
        transformCellText: ({text}) => {
          if (typeof text === 'number') {
            return numGroupSep(Math.round(text * 1000) / 1000)
          }
          return text
        },
        loading: false,
        pagination: {
          total: 0,
          page: 1,
          pageSize: 12
        },
        data: [],
        columns: [
          {title: '数据加载时间', dataIndex: 'LOAD_TIME', width: table_width, ellipsis: true},
          {title: '供应商', dataIndex: 'SUPPLIER', width: table_width, ellipsis: true},
          {title: '系列', dataIndex: 'M_SERIES', width: table_width, ellipsis: true},
          {title: '项目组', dataIndex: 'TEAM_SUPPLY', width: table_width, ellipsis: true},
          {title: '系列主型号', dataIndex: 'MAIN_SERIAL', width: table_width, ellipsis: true},

          {title: '计划专员', dataIndex: 'PLAN_STAFF', width: table_width, ellipsis: true},
          {title: '物料编码', dataIndex: 'M_CODE', width: 150, ellipsis: true},
          {title: '物料名称', dataIndex: 'M_NAME', width: table_width, ellipsis: true},
          {title: '物料描述', dataIndex: 'M_DESC', width: table_width, ellipsis: true},
          {title: '是否停产', dataIndex: 'IS_STOP', width: table_width, ellipsis: true},
          {title: '主型号', dataIndex: 'MODEL_MAIN', width: table_width, ellipsis: true},
          {title: '研发分类', dataIndex: 'CLASS_DEVELOPMENT', width: table_width, ellipsis: true},
          {
            title: '实时销量',
            dataIndex: 'RLTM_ORDERS_QTY',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '订单未清数',
            dataIndex: 'UNCLER_ORDERS_QRT',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {title: '库存数', dataIndex: 'INV_QTY', width: table_width, ellipsis: true, align: 'right', sorter: true},
          {title: '锁库数', dataIndex: 'LOCK_QTY', width: table_width, ellipsis: true, align: 'right', sorter: true},

          {title: '其它锁库数', dataIndex: 'NO_LOCK_QTY', width: table_width, ellipsis: true, align: 'right', sorter: true},
          {
            title: '内销数',
            dataIndex: 'INNER_SALES_QTY',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {title: '库存可用数', dataIndex: 'INV_USE_QTY', width: table_width, ellipsis: true, align: 'right', sorter: true},
          {title: '供应商库存', dataIndex: 'SPL_STK_QTY', width: table_width, ellipsis: true, align: 'right', sorter: true},
          {
            title: '仓库现货实数',
            dataIndex: 'STK_SPOTS_QTY',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '两库现货实数',
            dataIndex: 'STK2_SPOTS_QTY',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '两库存占订单',
            dataIndex: 'STK2_ORDERS2_RATIO',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '库存占订单',
            dataIndex: 'STK1_ORDERS2_RATIO',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {title: '5天', dataIndex: 'MARKETABLE_QTY5', width: table_width, ellipsis: true, align: 'right', sorter: true},
          {
            title: '10天',
            dataIndex: 'MARKETABLE_QTY10',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },

          {
            title: '15天',
            dataIndex: 'MARKETABLE_QTY15',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '20天',
            dataIndex: 'MARKETABLE_QTY20',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '25天',
            dataIndex: 'MARKETABLE_QTY25',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '30天',
            dataIndex: 'MARKETABLE_QTY30',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '35天',
            dataIndex: 'MARKETABLE_QTY35',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '40天',
            dataIndex: 'MARKETABLE_QTY40',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '45天',
            dataIndex: 'MARKETABLE_QTY45',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '50天',
            dataIndex: 'MARKETABLE_QTY50',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },

          {
            title: '55天',
            dataIndex: 'MARKETABLE_QTY55',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '60天',
            dataIndex: 'MARKETABLE_QTY60',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '70天',
            dataIndex: 'MARKETABLE_QTY70',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '80天',
            dataIndex: 'MARKETABLE_QTY80',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '90天',
            dataIndex: 'MARKETABLE_QTY90',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '100天',
            dataIndex: 'MARKETABLE_QTY100',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '110天',
            dataIndex: 'MARKETABLE_QTY110',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {
            title: '120天',
            dataIndex: 'MARKETABLE_QTY120',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },

          //  {title: '130天', dataIndex: 'MARKETABLE_QTY130', width: 100, ellipsis: true,align: 'right',sorter: true},
          //  {title: '140天', dataIndex: 'MARKETABLE_QTY140', width: 100, ellipsis: true,align: 'right',sorter: true},
          //  {title: '150天', dataIndex: 'MARKETABLE_QTY150', width: 100, ellipsis: true,align: 'right',sorter: true},
          //  {title: '160天', dataIndex: 'MARKETABLE_QTY160', width: 100, ellipsis: true,align: 'right',sorter: true},
          //  {title: '170天', dataIndex: 'MARKETABLE_QTY170', width: 100, ellipsis: true,align: 'right',sorter: true},
          //  {title: '180天', dataIndex: 'MARKETABLE_QTY180', width: 100, ellipsis: true,align: 'right',sorter: true},
          //  {title: '190天', dataIndex: 'MARKETABLE_QTY190', width: 100, ellipsis: true,align: 'right',sorter: true},
          //  {title: '200天', dataIndex: 'MARKETABLE_QTY200', width: 100, ellipsis: true,align: 'right',sorter: true},
          //  {title: '210天', dataIndex: 'MARKETABLE_QTY210', width: 100, ellipsis: true,align: 'right',sorter: true},
          //  {title: '220天', dataIndex: 'MARKETABLE_QTY220', width: 100, ellipsis: true,align: 'right',sorter: true},
          {title: '月均销量', dataIndex: 'AVG_SALES_QTY', width: table_width, ellipsis: true, align: 'right', sorter: true},
          {
            title: '计划维护货期',
            dataIndex: 'PLAN_MAINTAIN',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {title: '备注', dataIndex: 'MARKS', width: table_width, ellipsis: true, align: 'right', sorter: true},
          {title: '累计未及格数', dataIndex: 'UNINSP_QTY', width: table_width, ellipsis: true, align: 'right', sorter: true},
          {
            title: '剩余可销售数',
            dataIndex: 'REM_MARKA_QTY',
            width: table_width,
            ellipsis: true,
            align: 'right',
            sorter: true
          },
          {title: '是否控制库存', dataIndex: 'IS_CTRL_STK', width: table_width, ellipsis: true,},
          {title: '控制原因', dataIndex: 'CTRL_REASON', width: table_width, ellipsis: true,},


        ]

      }

    }
  },

  computed: {
    queryCombine() {
      // 目的是监测这个三个筛选值的变化然后再运行函数！
      return this.query.MAIN_SERIAL.toString() + this.query.TEAM_SUPPLY.toString() + this.query.M_NAME.toString()
    }
  },

  watch: {

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
      const filtered = this.allOptions.filter(_ => {
        return val && val.length ? val.indexOf(_.TEAM_SUPPLY) > -1 : true
      })
      this.mainSerialOptions = Object.freeze(Array.from(new Set(filtered.map(_ => _.MAIN_SERIAL))))
      this.mNameOptions = Object.freeze(Array.from(new Set(filtered.map(_ => _.M_NAME))))
    },


    'query.MAIN_SERIAL'(val, oldVal) {
      if (JSON.stringify(val) === JSON.stringify(oldVal)) {
        return
      }
      const filtered = this.allOptions.filter(_ => {
        return val && val.length ? val.indexOf(_.MAIN_SERIAL) > -1 : true
      })
      this.mNameOptions = Object.freeze(Array.from(new Set(filtered.map(_ => _.M_NAME))))
    }

  },

  async created() {
    await this.getData1()  //async await一起用可以使异步执行的方法运行效果和同步一样
    this.getData2()
    this.getQueryOptions()
  },

  methods: {

    excel_show_fun(val) {
      if (val == 1) {
        this.excel.excel_show = true;
      } else if (val == 'excel') {
        this.excel.show = false;
        this.excel.excel_show = false;
      } else {
        this.excel.excel_show = false;
      }
    },
    getQueryOptions() {
      this.$fetchSql('pds_sop', 'bord_act_rt_filter_item').then(({data}) => {
        this.allOptions = Object.freeze(data);  //方法可以冻结一个对象
        // console.log("=======获取数据的！！！========");
        // console.log(this.allOptions);
        this.teamSupplyOptions = Object.freeze(Array.from(new Set(this.allOptions.map(_ => _.TEAM_SUPPLY))))  //数组的去重获取新的一个数组
        this.mainSerialOptions = Object.freeze(Array.from(new Set(this.allOptions.map(_ => _.MAIN_SERIAL))))
        this.mNameOptions = Object.freeze(Array.from(new Set(this.allOptions.map(_ => _.M_NAME))))
      })
    },

    test_router() {
      this.$router.push({
        path: "/x/4_647_813_842",
      });
    },

    getData1() {
      return this.$fetchSql('pds_sop', 'bord_act_rt_load_time').then(({data}) => {
        this.dateOptions = data.map(_ => _.LOAD_TIME).sort((a, b) => moment(b) - moment(a))
        this.query.loadTime = this.dateOptions[0]
      })
    },

    getData2(isResetPage = false) {

      // console.log("========运行到getData2这里！！==========");
      // console.log(isResetPage);


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

      console.log(this.table.pagination.page);

      const {M_CODE, TEAM_SUPPLY, MAIN_SERIAL, M_NAME} = this.query
      M_CODE && (params.M_CODE = M_CODE)
      TEAM_SUPPLY && TEAM_SUPPLY.length && (params.TEAM_SUPPLY = TEAM_SUPPLY.join(','))
      MAIN_SERIAL && MAIN_SERIAL.length && (params.MAIN_SERIAL = MAIN_SERIAL.join(','))
      M_NAME && M_NAME.length && (params.M_NAME = M_NAME.join(','))

      // console.log(this.query);
      // console.log(M_CODE && (params.M_CODE = M_CODE));
      // console.log(TEAM_SUPPLY.join(','));
      // console.log(MAIN_SERIAL && MAIN_SERIAL.length && (params.MAIN_SERIAL = MAIN_SERIAL.join(',')));
      // console.log(M_NAME && M_NAME.length && (params.M_NAME = M_NAME.join(',')));


      this.$fetchSql('pds_sop', 'bord_act_rt', params).then(({data}) => {
        const {totalRows, list} = data
        this.table.data = list
        this.table.pagination.total = totalRows

        // console.log(data);
        // console.log(list);
        // console.log(totalRows);

      }).finally(() => {
        this.table.loading = false
      })
    },

    handleChange(pagination, filter, sorters,) {

      console.log("========运行到aa这里！！==========");
      console.log(sorters)
      const orderMap = {
        'ascend': 'asc',
        'descend': 'desc'
      }
      let {field, order} = sorters
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

      if (type === 'downloadExcel') {
        const params = {
          LOAD_TIME: this.query.loadTime
        }

        const {M_CODE, TEAM_SUPPLY, MAIN_SERIAL, M_NAME} = this.query
        M_CODE && (params.M_CODE = M_CODE)
        TEAM_SUPPLY && TEAM_SUPPLY.length && (params.TEAM_SUPPLY = TEAM_SUPPLY.join(','))
        MAIN_SERIAL && MAIN_SERIAL.length && (params.MAIN_SERIAL = MAIN_SERIAL.join(','))
        M_NAME && M_NAME.length && (params.M_NAME = M_NAME.join(','))
        this.loading = true
        this.cancelTokenSource = axios.CancelToken.source()


        this.$axios.post('api/admin/data/exportExcel', {
          excelName: '活动货期报表',
          sheetConfigList: [
            {
              params,
              prefix: 'pds_sop',
              interfaceName: 'bord_act_rt',
              sheetName: '活动货期报表',
              columnConfigList: this.table.columns.map(_ => ({
                colWidth: _.width / 10,
                dbColName: _.dataIndex,
                excelColName: _.title
              }))
            }
          ]
        }, {
          responseType: 'blob',
          cancelToken: this.cancelTokenSource.token
        }).then(({data, headers}) => {
          const filename = headers['content-disposition'].match(/filename=(.*)/)[1]

          // console.log(data);
          downloadBlob(data, decodeURIComponent(filename))

        }).finally(() => {
          this.loading = false
        })
        this.excel_show_fun(2);


      }

    },

    cancelExport() {
      this.cancelTokenSource.cancel()
    },

  }

// _this.$router.push({
//   path: _this.tabs[value].path,
// });

}
</script>

<style lang="scss" scoped>
.sub-tip {
  color: #999;
  font-size: 12px;
}

/deep/ .simple-select-input {

  // border: 1px solid #46bca0;

}

/deep/ .drop-down-button {
  // background: #46bca0
}

/deep/ .simple-select-box {
  .box-item {
    &:hover {
      // background: #EEEEEE;
    }

    &.selected {
      // background: #aaa;
      // background: #DDDDDD;
    }
  }
}

/deep/ .drop-down-icon {
  // font-size: 12px; color: #fff;
}

/deep/ .ant-table {
  color: rgba(0, 0, 0, 1);
}

.export_excel {
  width: 30px;
  height: 30px;
  background: url("~@/assets/images/excel_img.png") no-repeat left center/contain;
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

