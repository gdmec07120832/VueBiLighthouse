<template>
    <div class="Detailed">
        <div class="header">
            <span>店铺明细</span>
            <a href="#" @click="handleContextMenuClick">下载</a>
        </div>
        <y-table
                class="text-black mt10"
                @change="handleChange"
                :options="{ ...table, columns: tableColumns, rowClassName: (record,index) => {return index === 0 ? 'blod grey': index % 2 === 0 ? 'grey' : ''}}"
                :rowKey="(row) => {return row.SHOP_NAME + row.NO}"
                :loading="table.loading"
        ></y-table>
    </div>
</template>

<script>
import YTable from '@/views/BIView/components/YTable/YTable2'
import base from '../../utils/base'
import moment from "moment";
import axios from 'axios'
import { downloadBlob } from '@/utils/helper'
export default {
    name: "Detailed",
    mixins: [ base ],
    components: {
        YTable,
    },
    props: {
        Overview: {
            type: Object,
            default() {return {}}
        },
        dateV3: {
            type: Object,
            default() {return {}}
        },
        currentTab: {
            type: String,
            default: '',
        },
        selects: {
            type: Object,
            default() {return {}}
        },
        curPanel: {
            type: Number,
            default: 1,
        },
        allCondition: {
            type: String,
            default: '',
        },
    },
    watch: {
        Overview: {
            handler(val) {
                console.log(val)
            },
            deep: true
        },
        allCondition: {
            handler(val) {
                console.log(val)
                this.getData()
            }
        },
        'table.pagination.page': {
            handler() {
                this.getData()
            }
        },
    },
    mounted() {
        this.getData()
    },
    data() {
        return {
            table: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 15
                },
                data: [],
                needPaging: true,
                // columns: this.tableColumns
            },
            sorting: {
                field: 'rownum',
                order: 'asc',
            },
        }
    },
    computed: {
        tableColumns() {
            let obj = [
                {key: this.dateV3.dayOrMonth === 1 ? 'TDATE_DAY' : 'MONTH_DATE', title: '统计日期'},
                {key: 'SHOP_NAME', title: '线上店铺'},
                {key: 'PTD_PAY_TGT', title: '支付目标', handleType: 'round'},
                {key: 'PTD_PAY_AMT', title: '支付业绩', handleType: 'round'},
                {key: 'PTD_PAY_RATE', title: '支付达成', handleType: 'percent'},
                {key: 'AGO_PAY_AMT', title: '同期支付业绩', handleType: 'round'},
                {key: 'AGO_PAY_RATE', title: '支付同比增幅', handleType: 'percent'},
                {key: 'PTD_DLVR_TGT', title: '发货目标', handleType: 'round'},
                {key: 'PTD_DLVR_AMT', title: '发货业绩', handleType: 'round'},
                {key: 'PTD_DLVR_RATE', title: '发货达成', handleType: 'percent'},
                {key: 'AGO_DLVR_RATE', title: '同期发货业绩', handleType: 'round'},
                {key: 'AGO_BEF_DLVR_RATE', title: '发货同比增幅', handleType: 'percent'},
            ]
            let arr = []
            arr = obj.map(item => {
                return {
                    title: item.title, dataIndex: item.key, width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div title={text} class={item.key === 'AGO_PAY_RATE' || item.key === 'AGO_BEF_DLVR_RATE' ? this.computeColor(text) : null}>{item.handleType ? this.handleNum(item.handleType, text) : text}</div>
                    }
                }
            })
            return arr.concat()
        }
    },
    methods: {
        computeColor(val) {
            if(val > 0) return 'red'
            else if(val <= 0) return 'green'
        },
        handleChange(pagination, filter, sorters) {
            console.log(111111111111)
            const orderMap = {
                ascend: 'asc',
                descend: 'desc',
            }
            let { field, order } = sorters
            if (field && order) {
                field = `${field}`
                order = orderMap[order]
            } else {
                field = 'rownum'
                order = 'asc'
            }
            this.sorting.field = field
            this.sorting.order = order
            console.log(this.sorting, pagination, filter, sorters, this.table.pagination.page)
            // this.table.data = [].concat()
            // this.getSumData()
            this.getData()
        },
        async getData() {
            let dayOrMonth = this.dateV3.dayOrMonth
            let query = dayOrMonth === 1 ?
            {
                MDATE: this.dateV3.day2,
                CHNL_NAME: this.currentTab,
                ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
                page: this.table.pagination.page,
                pageSize: this.table.pagination.pageSize,
            }
            :
            {
                START_TIME: this.dateV3.month2 + '01',
                END_TIME: this.dateV3.month2 + '12',
                CHNL_NAME: this.currentTab,
                ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
                page: this.table.pagination.page,
                pageSize: this.table.pagination.pageSize,
            }
            for(let key in this.selects[this.currentTab]) {
                if(key !== 'obj') {
                    let select = this.selects[this.currentTab][key]
                    if(Object.prototype.toString.call(select) === '[object Array]' && select.length) {
                        query[key] = select.toString()
                    }else if(Object.prototype.toString.call(select) === '[object String]' && select) {
                        query[key] = select.toString()
                    }
                }
            }
            let api = dayOrMonth === 1 ? 'shop_perf_day_dtl' : 'shop_perf_month_dtl'
            let res = await this.$fetchSql('shop_perf', api, query)
            this.table.data = res.data.list.concat()
            this.table.pagination.page = res.data.page
            this.table.pagination.total = res.data.totalRows
            console.log(res)
        },
        handleContextMenuClick(type) {
            // if (this.loading) {
            //     return
            // }
            // if (type === 'downloadExcel') {
            //     let tabMap = {
            //         '汇总货审情况': 'fs_good_audit_data',
            //         '小组/门店货审情况': 'fs_good_audit_staff',
            //         '人员货审情况': 'fs_good_audit_staff',
            //         '整单可货审明细': 'fs_good_audit_data',
            //         '商品可货审明细': 'fs_good_audit_data',
            //     }
            //     let api = tabMap[this.currentTab]
                let dayOrMonth = this.dateV3.dayOrMonth
                let query = dayOrMonth === 1 ?
                    {
                        MDATE: this.dateV3.day2,
                        CHNL_NAME: this.currentTab,
                        // ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
                        // page: this.table.pagination.page,
                        // pageSize: this.table.pagination.pageSize,
                    }
                    :
                    {
                        START_TIME: this.dateV3.month2 + '01',
                        END_TIME: this.dateV3.month2 + '12',
                        CHNL_NAME: this.currentTab,
                        // ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
                        // page: this.table.pagination.page,
                        // pageSize: this.table.pagination.pageSize,
                    }
                for(let key in this.selects[this.currentTab]) {
                    if(key !== 'obj') {
                        let select = this.selects[this.currentTab][key]
                        if(Object.prototype.toString.call(select) === '[object Array]' && select.length) {
                            query[key] = select.toString()
                        }else if(Object.prototype.toString.call(select) === '[object String]' && select) {
                            query[key] = select.toString()
                        }
                    }
                }
                // const params = {}
                // for(let key in this.queryMap) {
                //     if(this.query[this.queryMap[key]].length > 0) {
                //         params[key] = this.query[this.queryMap[key]].toString()
                //     }
                // }
                // if(this.startTime) {
                //     params.startTime = moment(this.startTime).format('YYYYMMDD')
                // }
                // if(this.endTime) {
                //     params.endTime = moment(this.endTime).format('YYYYMMDD')
                // }
                // this.loading = true
                this.cancelTokenSource = axios.CancelToken.source()
                this.$axios
                    .post(
                        '/api/admin/data/exportExcel',
                        {
                            excelName: '店铺业绩明细报表',
                            sheetConfigList: [
                                {
                                    params: query,
                                    prefix: 'shop_perf',
                                    interfaceName: this.dateV3.dayOrMonth === 1 ? 'shop_perf_day_dtl' : 'shop_perf_month_dtl',
                                    sheetName: '店铺业绩明细报表',
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
            // }
        }
    },
}
</script>

<style lang="scss" scoped>
/deep/ .grey{
    background: #fafafa;
}
/deep/ .blod{
    font-weight: bold;
}
.Detailed {
    .red {
        color: #FF2219!important;
    }
    .green {
        color: #00B050!important;
    }
    height: 800px;
    width: 100%;
    background: #fff;
    padding: 10px 20px;

    .header {
        position: relative;
        padding-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        a {
            text-decoration: underline;
        }
    }

    .header::after {
        content: '';
        display: block;
        width: calc(100% + 40px);
        height: 1px;
        background: #f0f0f0;
        position: absolute;
        bottom: 1px;
        left: -20px;
    }
}
</style>