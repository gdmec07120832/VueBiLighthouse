<!--
 * @Author: 黄浩
 * @Date: 2021-12-17 11:26:29
 * @LastEditTime: 2021-12-22 11:45:09
 * @LastEditors: Please set LastEditors
 * @Descripttion: 销售利润业绩报表
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\SalesProfitPerformanceStatement\index.vue
-->
<template>
    <div style="position: relative">
        <y-loading :loading.sync="loading" @candelLoading="cancelExport"></y-loading>
        <top-toolbar @contextMenuClick="handleContextMenuClick" />
        <div>
            <div style="background-color: #f5faff; height: 100vh; padding: 0 2%; overflow: auto">
                <div class="py10" style="margin: auto">
                    <div style="font-size: 26px;margin-left: 20px;">销售利润业绩报表</div>
                    <div style="line-height: 24px;margin-top: 10px;margin-left: 20px;font-size: 12px;color: #999" class="sub-tip">备注：【1】报表更新为T+1，数据截止到昨天；【2】20年8月前数据，默认为B货；【3】每月4号凌晨冻结上月数据。</div>
                </div>
                <div class="px20" style="background-color: #fff; border-radius: 4px;border: 2px solid #dde7f7; min-height: calc(100vh - 100px)">
                    <div class="flex flex-between py10" style="font-size: 14px;height: 53px">
                        利润款业绩明细
                        <div class="flex">
                            <a-date-picker v-model="startTime" valueFormat="YYYYMMDD" style="margin-right: 10px" />
                            <a-date-picker v-model="endTime" valueFormat="YYYYMMDD"/>
                        </div>
                    </div>
                    <div class="flex-between" style="display: flex;margin-bottom: 10px">
                        <div style="width: 20%;" v-for="(item,index) in this.selectArr" :key="index">
                            <virtual-select
                                v-model="query[item.prop]"
                                :label="item.label"
                                :options="item.arrName&&arr[item.arrName].map((_) => ({ label: _}))"
                            ></virtual-select>
                        </div>
                    </div>
                    <div class="flex flex-end mb10">
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
                    <div>
                        <y-table
                        class="text-black"
                        @change="handleChange"
                        :options="{ ...table, columns: tableColumns, rowClassName: (record,index) => {return rowClass(record, index)}}"
                        rowKey="NO"
                        :loading="table.loading"
                        ></y-table>
                    </div>
                </div>
            </div>
            <div v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
                <div class="item box" v-clipboard="currentRow" >复制内容</div>
            </div>
        </div>
    </div>
</template>

<script>
import YLoading from '@/views/BIView/components/YLoading/YLoading'
import TopToolbar from '@/views/BIView/components/TopToolbar/TopToolbar'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import YTable from '@/views/BIView/components/YTable/YTable2'
import moment from 'moment'
import _ from 'lodash'
import axios from 'axios'
import { downloadBlob } from '@/utils/helper'
export default {
    watch: {
        'queryCombine': {
            handler() {
                this.table.data = [].concat()
                this.getSumData()
                this.getData()
            }
        },
        'table.pagination.page' : {
            handler(val,oval) {
                if(val === oval) return
                this.table.data = [].concat()
                this.getSumData()
                this.getData()
            }
        },
        'query.BIG_GROUP': {
            handler(val,oval) {
                if(this.loadNum > this.loadNumLimit){
                    this.handlerArr(val,'BIG_GROUP',[
                        {'STAFF_GROUPArr':'STAFF_GROUP'},
                        {'NICK_NAMEArr':'NICK_NAME'},
                    ])
                }else this.loadNum++
            }
        },
        'query.STAFF_GROUP': {
            handler(val) {
                if(this.loadNum > this.loadNumLimit){
                    if(val.length){
                        this.handlerArr(val,'STAFF_GROUP',[
                            {'NICK_NAMEArr':'NICK_NAME'},
                        ])
                    }else{
                        this.handlerArr(this.query.BIG_GROUP,'BIG_GROUP',[
                            {'NICK_NAMEArr':'NICK_NAME'},
                        ])
                    }
                }else this.loadNum++
            }
        },
        'query.NICK_NAME': {
            handler() {
                if(this.loadNum <= this.loadNumLimit){
                    this.loadNum++
                }
            }
        },
        'query.SALES_PROFIT_CLASS': {
            handler() {
                if(this.loadNum <= this.loadNumLimit){
                    this.loadNum++
                }
            }
        },
        startTime: {
            handler() {
                this.table.data = [].concat()
                this.getSumData()
                this.getData() 
            }
        },
        endTime: {
            handler() {
                this.table.data = [].concat()
                this.getSumData()
                this.getData()
            }
        },
        recordData: {
            handler(val){
                if(val.length && this.sumData.length){
                    this.table.data = this.sumData.concat(val)
                }
            }
        },
        sumData: {
            handler(val){
                if(val.length && this.recordData.length){
                    this.table.data = this.sumData.concat(this.recordData)
                }
            }
        }
    },
    components: { YLoading, TopToolbar, VirtualSelect, YTable},
    computed: {
        tableColumns() {
            return [
                { title: '大分组', dataIndex: 'BIG_GROUP', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '分组', dataIndex: 'STAFF_GROUP', width: 130, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '全名', dataIndex: 'REAL_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '花名', dataIndex: 'NICK_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '销售利润分类', dataIndex: 'SALES_PROFIT_CLASS', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '审核业绩', dataIndex: 'AUDIT_AMT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text === '-' ? '-' : parseInt(text))}} title={text === '-' ? '-' : parseInt(text)}>{text === '-' ? '-' : parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '发货业绩', dataIndex: 'DELIVER_AMOUNT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text === '-' ? '-' : parseInt(text))}} title={text === '-' ? '-' : parseInt(text)}>{text === '-' ? '-' : parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '运费', dataIndex: 'DELIVER_FEE_AMOUNT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text === '-' ? '-' : parseInt(text))}} title={text === '-' ? '-' : parseInt(text)}>{text === '-' ? '-' : parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '三包费', dataIndex: 'THREE_BACK_AMOUNT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text === '-' ? '-' : parseInt(text))}} title={text === '-' ? '-' : parseInt(text)}>{text === '-' ? '-' : parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '提交售后业绩', dataIndex: 'SUBMIT_AFTERSALE_AMOUNT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text === '-' ? '-' : parseInt(text))}} title={text === '-' ? '-' : parseInt(text)}>{text === '-' ? '-' : parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '已发货退款', dataIndex: 'DELIVER_REFUND_AMOUNT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text === '-' ? '-' : parseInt(text))}} title={text === '-' ? '-' : parseInt(text)}>{text === '-' ? '-' : parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '平台结余', dataIndex: 'TERRACE_AMOUNT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text === '-' ? '-' : parseInt(text))}} title={text === '-' ? '-' : parseInt(text)}>{text === '-' ? '-' : parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '门店结余', dataIndex: 'STORE_AMOUNT', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text === '-' ? '-' : parseInt(text))}} title={text === '-' ? '-' : parseInt(text)}>{text === '-' ? '-' : parseInt(text).toLocaleString()}</div>
                    }
                },
                { title: '日期', dataIndex: 'TDATE', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text === '-' ? '-' : moment(text).format('YYYY-MM-DD'))}} title={text === '-' ? '-' : moment(text).format('YYYY-MM-DD')}>{text === '-' ? '-' : moment(text).format('YYYY-MM-DD')}</div>
                    }
                },
            ]
        },
        queryCombine() {
            return this.query.BIG_GROUP.toString() + this.query.STAFF_GROUP.toString() + this.query.NICK_NAME.toString() + this.query.SALES_PROFIT_CLASS.toString()
        }
    },
    created() {
        this.getFilterData()
        this.table.data = [].concat()
        this.getSumData()
        this.getData()
    },
    mounted() {
        document.body.onclick = () => {
            if(this.menuVisible) this.menuVisible = !this.menuVisible
        }
    },
    data() {
        this.getData = _.debounce(this.getData,200,{
            leading: false,
            trailing: true
        })
        return {
            loadNum: 0,
            loadNumLimit: 7,
            loading: false,
            startTime: moment(moment(new Date()).format('YYYYMM')).format('YYYYMMDD'),
            endTime: moment(new Date()).format('YYYYMMDD'),
            query: {
                // 大分组
                BIG_GROUP: [],
                // 分组
                STAFF_GROUP: [],
                // 客服
                NICK_NAME: [],
                // 销售利润分类
                SALES_PROFIT_CLASS: [],
            },
            allOptions: [],
            selectArr: [
                { label: '大分组', prop: 'BIG_GROUP', arrName: 'BIG_GROUPArr'},
                { label: '分组', prop: 'STAFF_GROUP', arrName: 'STAFF_GROUPArr'},
                { label: '客服', prop: 'NICK_NAME', arrName: 'NICK_NAMEArr'},
                { label: '销售利润分类', prop: 'SALES_PROFIT_CLASS', arrName: 'SALES_PROFIT_CLASSArr'}
            ],
            arr: {
                BIG_GROUPArr: [],
                STAFF_GROUPArr: [],
                NICK_NAMEArr: [],
                SALES_PROFIT_CLASSArr: [],
            },
            sorting: {
                field: 'rownum',
                order: 'asc',
            },
            table: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 13
                },
                data: [],
                needPaging: true
            },
            menuVisible: false,
            menuX: '0px',
            menuY: '0px',
            currentRow: '',
            sumData: [],
            recordData: []
        }
    },
    methods: {
        // 右键展开菜单
        openMenu(e,text) {
            e.preventDefault();
            this.menuX = e.x + 'px'
            this.menuY = e.y + 'px'
            this.currentRow = text
            this.menuVisible = true
        },
        rowClass(record, index){
            let str = ''
            if(index === 0) str = 'rowClassFont'
            else str = index % 2 != 0 ? 'rowClass': ''
            return str
        },
        // 处理筛选框  attr:属性名 与监听属性同名  arr: [{$key: $attr}] 传入数组 进行联动 改变子选项
        // handlerArr例子
        // let subArr = this.allOptions.filter(_ => {
        //     return val && val.length ? val.indexOf(_.MAX_CHANNEL) > -1 : true
        // })
        // this.arr.min_channelArr = Object.freeze(Array.from(new Set(subArr.map(_ => _.MIN_CHANNEL))))
        handlerArr(val,attr,arr = []){
            const subArr = this.allOptions.filter(_ => {
                return val.length ? val.indexOf(_[attr]) > -1 : true
            })
            arr.forEach(item => {
                for(let key in item){
                    this.arr[key] = Object.freeze(Array.from(new Set(subArr.map(_ => _[item[key]]))))
                }
            })
        },
        getFilterData() {
            this.$fetchSql('fs_sales_profit', 'fs_sales_profit_class_scr').then(({ data }) => {
                this.allOptions = Object.freeze(data)
                this.selectArr.forEach(({prop,arrName},index) => {
                    this.arr[arrName] = Object.freeze(Array.from(new Set(this.allOptions.map((_) => _[prop]))))
                })
            })
        },
        getSumData() {
            let params = {
                page: this.table.pagination.page,
                pageSize: this.table.pagination.pageSize,
                // ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
            }
            
            if(this.startTime) {
                params.startTime = this.startTime
            }
            if(this.endTime) {
                params.endTime = this.endTime
            }
            let map = {
                BIG_GROUP: 'bigGroup',
                STAFF_GROUP: 'staffGroup',
                NICK_NAME: 'nickName',
                SALES_PROFIT_CLASS: 'salesProfitClass',
            }
            for(let key in this.query){
                if(this.query[key].length > 0){
                    params[map[key]] = this.query[key].toString()
                }
            }
            this.table.loading = true
            this.sumData = [].concat()
            this.$fetchSql('fs_sales_profit', 'fs_sales_profit_class_sum', params).then(({ data }) => {
                // if(this.api === 'fs_good_audit_data' && data.list[0] && !data.list[0].ACT_PRICE) return
                if(data.list[0] 
                && (data.list[0].AUDIT_AMT === null)
                && (data.list[0].DELIVER_AMOUNT === null)
                && (data.list[0].DELIVER_FEE_AMOUNT === null)
                && (data.list[0].THREE_BACK_AMOUNT === null)
                && (data.list[0].SUBMIT_AFTERSALE_AMOUNT === null)
                && (data.list[0].DELIVER_REFUND_AMOUNT === null)
                && (data.list[0].terrace_amount === null)
                ) return
                for(let key in data.list[0]) {
                    if(data.list[0][key] === null) {
                        data.list[0][key] = '-'
                    }
                }
                data.list[0].NO = 0
                this.sumData = data.list.concat()
                // this.table.data.unshift(data.list[0])
            }).finally(() => {
                this.table.loading = false
            })
        },
        getData() {
            let params = {
                page: this.table.pagination.page,
                pageSize: this.table.pagination.pageSize,
                ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
            }
            if(this.startTime) {
                params.startTime = this.startTime
            }
            if(this.endTime) {
                params.endTime = this.endTime
            }
            let map = {
                BIG_GROUP: 'bigGroup',
                STAFF_GROUP: 'staffGroup',
                NICK_NAME: 'nickName',
                SALES_PROFIT_CLASS: 'salesProfitClass',
            }
            for(let key in this.query){
                if(this.query[key].length > 0){
                    params[map[key]] = this.query[key].toString()
                }
            }
            this.table.loading = true
            this.recordData = [].concat()
            this.$fetchSql('fs_sales_profit', 'fs_sales_profit_class', params).then(({ data }) => {
                this.recordData = data.list.concat()
                // this.table.data = this.table.data.concat(data.list)
                this.table.pagination.page = data.page
                this.table.pagination.total = data.totalRows
                this.table.needPaging = data.list.length ? true : false
            }).finally(() => {
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
                field = `${field}`
                order = orderMap[order]
            } else {
                field = 'rownum'
                order = 'asc'
            }
            this.sorting.field = field
            this.sorting.order = order
            this.table.data = [].concat()
            this.getSumData()
            this.getData()
        },
        cancelExport() {
            this.cancelTokenSource.cancel()
        },
        handleContextMenuClick(type) {
            if (this.loading) {
                return
            }
            if (type === 'downloadExcel') {
                const params = {}
                if(this.startTime) {
                    params.startTime = this.startTime
                }
                if(this.endTime) {
                    params.endTime = this.endTime
                }
                let map = {
                    BIG_GROUP: 'bigGroup',
                    STAFF_GROUP: 'staffGroup',
                    NICK_NAME: 'nickName',
                    SALES_PROFIT_CLASS: 'salesProfitClass',
                }
                for(let key in this.query){
                    if(this.query[key].length){
                        params[map[key]] = this.query[key].toString()
                    }
                }
                this.loading = true
                this.cancelTokenSource = axios.CancelToken.source()
                this.$axios
                .post(
                    '/api/admin/data/exportExcel',
                    {
                        excelName: '销售利润业绩报表',
                        sheetConfigList: [
                            {
                                params,
                                prefix: 'fs_sales_profit',
                                interfaceName: 'fs_sales_profit_class_exp',
                                sheetName: '精简报表',
                                columnConfigList: this.tableColumns.map((_) => ({
                                    colWidth: Number((_.width / 10).toFixed(0)),
                                    dbColName: _.dataIndex.toLowerCase(),
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
        }
    },
}
</script>

<style lang='scss' scoped>
/deep/ .rowClass{
    background: #f5faff
}
/deep/ .rowClassFont{
    font-weight: 700;
}
/deep/ .custom-checkbox-label{
    height: 30px;
    line-height: 26px;
}
/deep/ .custom-checkbox-label:before{
    margin-top: 7px;
}
/deep/ .custom-checkbox-label:after{
    top: 9px;
}
.selectMenu{
    position: absolute;
    background: #fff;
    border-radius: 2px;
    border: 1px solid #ccc;
    z-index: 2;
    .item{
        cursor: pointer;
        padding: 5px 20px;
        font-size: 12px;
        color: #666;
    }
    .item:hover{
        background: #f3f3f3;
    }
}
</style>