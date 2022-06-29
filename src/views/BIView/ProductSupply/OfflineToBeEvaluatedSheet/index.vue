<!--
 * @Author: 黄浩
 * @Date: 2021-12-03 10:50:00
 * @LastEditTime: 2021-12-09 13:37:22
 * @LastEditors: Please set LastEditors
 * @Descripttion: 线下待评价单
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\OfflineToBeEvaluatedSheet\index.vue
-->
<template>
    <div style="position: relative">
        <y-loading :loading.sync="loading" @candelLoading="cancelExport"></y-loading>
        <top-toolbar @contextMenuClick="handleContextMenuClick" />
        <div>
            <div style="background-color: #f5faff; height: 100vh; padding: 0 2%; overflow: auto">
                <div class="py10" style="margin: auto">
                    <div style="font-size: 26px;margin-left: 20px;">线下待评价单</div>
                    <div style="line-height: 24px;margin-top: 10px;margin-left: 20px" class="sub-tip">备注：【1】报表更新为T+1，数据截止到昨天。</div>
                </div>
                <div style="background-color: #fff; border-radius: 4px;border: 2px solid #dde7f7; min-height: calc(100vh - 100px)">
                    <div class="flex flex-between mx20 py10" style="font-size: 14px;height: 53px">
                        待评价单明细
                    </div>
                    <div style="padding-left: 20px;flex-direction: column;display: flex;">
                        <div style="width: 24%;margin-bottom: 10px">
                            <virtual-select
                                v-model="query.area_name"
                                label="大区"
                                :options="area_nameArr.map((_) => ({ label: _ }))"
                            ></virtual-select>
                        </div>
                        <div style="width: 24%;margin-bottom: 10px">
                            <virtual-select
                                v-model="query.sub_area_name"
                                :options="sub_area_nameArr.map((_) => ({ label: _ }))"
                                label="片区"
                            ></virtual-select>
                        </div>
                        <div style="width: 24%;margin-bottom: 10px">
                            <virtual-select
                                v-model="query.group_name"
                                :options="group_nameArr.map((_) => ({ label: _ }))"
                                box-width="300px"
                                label="门店"
                            ></virtual-select>
                        </div>
                        <div style="margin-bottom: 10px;display: flex;justify-content: space-between">
                            <virtual-select
                                style="width: 24%;"
                                v-model="query.nick_name"
                                :options="nick_nameArr.map((_) => ({ label: _ }))"
                                box-width="300px"
                                label="导购"
                            ></virtual-select>
                            <div style="flex: 1 1 auto; text-align: right;padding-right: 20px">
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
                    </div>
                    <div style="padding: 0 20px">
                        <y-table
                        class="text-black"
                        @change="handleChange"
                        :options="{ ...table, columns: tableColumns, rowClassName: (record,index) => {return rowClass(record, index)}}"
                        rowKey="TID"
                        :loading="table.loading"
                        ></y-table>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
            <div class="item box" v-clipboard="currentRow" >复制内容</div>
            <!-- <div class="item" @click="copy">其他</div> -->
        </div>
    </div>
</template>

<script>
import YLoading from '@/views/BIView/components/YLoading/YLoading'
import TopToolbar from '@/views/BIView/components/TopToolbar/TopToolbar'
import VirtualSelect from '@/views/BIView/components/VSelect/VSelect'
import YTable from '@/views/BIView/components/YTable/YTable2'
import moment from 'moment'
import { downloadBlob } from '@/utils/helper'
import axios from 'axios'
import _ from 'lodash'
export default {
    components: { YLoading, TopToolbar, VirtualSelect, YTable },
    async created() {
        await (async () => {
            this.getArr()
            this.getData(true)
        })()
    },
    mounted() {
        document.body.onclick = () => {
            if(this.menuVisible) this.menuVisible = !this.menuVisible
        }
    },
    computed: {
        tableColumns() {
            return [
                { title: '销售单号', dataIndex: 'SYS_TRADE_NO', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '淘宝单号', dataIndex: 'TID', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '合并单号', dataIndex: 'MERGE_TRADE_NO', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '买家昵称', dataIndex: 'CUSTOMER_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '昵称', dataIndex: 'NICK_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '名字', dataIndex: 'REAL_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '大区', dataIndex: 'AREA_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '片区', dataIndex: 'SUB_AREA_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '小组', dataIndex: 'GROUP_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '收货人姓名', dataIndex: 'RECEIVER_NAME', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '收货人手机', dataIndex: 'RECEIVER_MOBILE', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                },
                { title: '剩余评价时间', dataIndex: 'SUR_RETURN_DATE', width: 100, ellipsis: true, sorter: true,
                    customRender: (text) => {
                        return <div oncontextmenu={(e) => {this.openMenu(e,text)}} title={text}>{text}</div>
                    }
                }
            ]
        },  
    },
    watch: {
        'table.pagination.page'() {
            this.getData()
        },
        'query.area_name': {
            handler(val) {
                this.area_nameArr = this.area_nameArr1.concat()
                if (this.loadNum > 7) {
                    if(val.length > 0){
                        let subArr = []
                        val.forEach(item => {
                            let index = this.area_nameArr.indexOf(item)
                            if(index > -1) {
                                let sub = this.area_nameArr.splice(index,1)
                                this.area_nameArr.unshift(sub[0])
                                this.area_nameArr.push()
                            }
                            subArr = subArr.concat(this.allArr.filter(item1 => {
                                return item1.AREA_NAME === item
                            })) 
                        })
                        this.sub_area_nameArr = Object.freeze(Array.from(new Set(subArr.map(_ => _.SUB_AREA_NAME))))
                        this.group_nameArr = Object.freeze(Array.from(new Set(subArr.map(_ => _.GROUP_NAME))))
                        this.nick_nameArr = Object.freeze(Array.from(new Set(subArr.map(_ => _.NICK_NAME))))
                    }else{
                        this.sub_area_nameArr = Object.freeze(Array.from(new Set(this.allArr.map(_ => _.SUB_AREA_NAME))))
                        this.group_nameArr = Object.freeze(Array.from(new Set(this.allArr.map(_ => _.GROUP_NAME))))
                        this.nick_nameArr = Object.freeze(Array.from(new Set(this.allArr.map(_ => _.NICK_NAME))))
                    }
                    this.getData(true)
                }
                else this.loadNum ++
            }
        },
        'query.sub_area_name': {
            handler(val) {
                this.sub_area_nameArr = this.sub_area_nameArr1.concat()
                if (this.loadNum > 7){
                    if(Array.from( this.sub_area_nameArr).length <= 0) return
                    if(val.length > 0){
                        let subArr = []
                        val.forEach(item => {
                            let index = this.sub_area_nameArr.indexOf(item)
                            if(index > -1) {
                                let sub = this.sub_area_nameArr.splice(index,1)
                                this.sub_area_nameArr.unshift(sub[0])
                                this.sub_area_nameArr.push()
                            }
                            subArr = subArr.concat(this.allArr.filter(item1 => {
                                return item1.SUB_AREA_NAME === item
                            }))
                        })
                        this.group_nameArr = Object.freeze(Array.from(new Set(subArr.map(_ => _.GROUP_NAME))))
                        this.nick_nameArr = Object.freeze(Array.from(new Set(subArr.map(_ => _.NICK_NAME))))
                    }else{
                        let subArr = []
                        this.sub_area_nameArr.forEach(item => {
                            subArr = subArr.concat(this.allArr.filter(item1 => {
                                return item1.SUB_AREA_NAME === item
                            }))
                        })
                        this.group_nameArr = Object.freeze(Array.from(new Set(subArr.map(_ => _.GROUP_NAME))))
                        this.nick_nameArr = Object.freeze(Array.from(new Set(subArr.map(_ => _.NICK_NAME))))
                    }
                    this.getData(true)
                }else this.loadNum ++
            }
        },
        'query.group_name': {
            handler(val) {
                this.group_nameArr = this.group_nameArr1.concat()
                if (this.loadNum > 7){
                    val.forEach(item => {
                        let index = this.group_nameArr.indexOf(item)
                        if(index > -1) {
                            let sub = this.group_nameArr.splice(index,1)
                            this.group_nameArr.unshift(sub[0])
                            this.group_nameArr.push()
                        }
                    })
                    this.getData(true)
                }
                else this.loadNum ++
            }
        },
        'query.nick_name': {
            handler(val) {
                this.nick_nameArr = this.nick_nameArr1.concat()
                if (this.loadNum > 7) {
                    val.forEach(item => {
                        let index = this.nick_nameArr.indexOf(item)
                        if(index > -1) {
                            let sub = this.nick_nameArr.splice(index,1)
                            this.nick_nameArr.unshift(sub[0])
                            this.nick_nameArr.push()
                        }
                    })
                    this.getData(true)
                }
                else this.loadNum ++
            }
        }
    },
    data() {
        this.getData = _.debounce(this.getData,200,{
            leading: false,
            trailing: true
        })
        return {
            sorting: {
                field: 'rownum',
                order: 'asc',
            },
            // 首次加载
            loadNum: 0,
            loading: false,
            query: {
                nick_name: [],
                group_name: [],
                area_name: [],
                sub_area_name: []
            },
            nick_nameArr: [],
            nick_nameArr1: [],
            group_nameArr: [],
            group_nameArr1: [],
            area_nameArr: [],
            area_nameArr1: [],
            sub_area_nameArr: [],
            sub_area_nameArr1: [],
            allArr: [],
            table: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 12
                },
                data: [],
                needPaging: true
            },
            menuVisible: false,
            menuX: '0px',
            menuY: '0px',
            currentRow: '',
        }
    },
    methods: {
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
            this.getData()
        },
        rowClass(record, index){
            return index % 2 != 0 ? 'rowClass': ''
        },
        // 右键展开菜单
        openMenu(e,text) {
            e.preventDefault();
            this.menuX = e.x + 'px'
            this.menuY = e.y + 'px'
            this.currentRow = text
            this.menuVisible = true
        },
        // 顶部hover菜单点击
        handleContextMenuClick(type) {
            if (this.loading) {
                return
            }
            if (type === 'downloadExcel') {
                const params = {
                    LOAD_TIME: this.query.loadTime,
                }
                const {nick_name, group_name, area_name, sub_area_name} = this.query
                nick_name.length > 0&&(params.nickName = this.query.nick_name.toString())
                group_name.length > 0&&(params.groupName = this.query.group_name.toString())
                area_name.length > 0&&(params.areaName = this.query.area_name.toString())
                sub_area_name.length > 0&&(params.subAreaName = this.query.sub_area_name.toString())
                this.loading = true
                this.cancelTokenSource = axios.CancelToken.source()
                this.$axios
                .post(
                    '/api/admin/data/exportExcel',
                    {
                        excelName: '线下待评价单报表',
                        sheetConfigList: [
                            {
                            params,
                            prefix: 'fs_jx',
                            interfaceName: 'fs_jx_not_aprs',
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
        getArr() {
            this.$fetchSql('fs_jx', 'fs_jx_choice').then(({ data }) => {
                this.allArr = data
                let arr = [
                    {arrName: 'nick_nameArr', key: 'NICK_NAME'},
                    {arrName: 'group_nameArr', key: 'GROUP_NAME'},
                    {arrName: 'area_nameArr', key: 'AREA_NAME'},
                    {arrName: 'sub_area_nameArr', key: 'SUB_AREA_NAME'},
                    {arrName: 'nick_nameArr1', key: 'NICK_NAME'},
                    {arrName: 'group_nameArr1', key: 'GROUP_NAME'},
                    {arrName: 'area_nameArr1', key: 'AREA_NAME'},
                    {arrName: 'sub_area_nameArr1', key: 'SUB_AREA_NAME'},
                ]
                arr.forEach(({arrName,key}) => {
                    this[arrName] = Object.freeze(Array.from(new Set(data.map((_) => _[key]))))
                    this[arrName] = this[arrName].filter(item => {
                        return item
                    })
                })
            })
        },
        getData(resetPage) {
            if(resetPage){
                this.table.pagination.page = 1
            }
            this.table.loading = true
            const params = {
                page: this.table.pagination.page,
                pageSize: this.table.pagination.pageSize,
                ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
            }
            const {nick_name, group_name, area_name, sub_area_name} = this.query
            nick_name.length > 0&&(params.nickName = this.query.nick_name.toString())
            group_name.length > 0&&(params.groupName = this.query.group_name.toString())
            area_name.length > 0&&(params.areaName = this.query.area_name.toString())
            sub_area_name.length > 0&&(params.subAreaName = this.query.sub_area_name.toString())
            this.$fetchSql('fs_jx', 'fs_jx_not_aprs',params).then(({ data }) => {
                let { totalRows, list } = data
                this.table.data = list
                this.table.pagination.total = totalRows
                this.table.needPaging = data.needPaging
            }).finally(() => {
                this.table.loading = false
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.sub-tip {
  color: #999;
  font-size: 12px;
}
.selectMenu{
    position: absolute;
    background: #fff;
    border-radius: 2px;
    border: 1px solid #ccc;
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
/deep/ .rowClass{
    background: #f5faff
}
/deep/ .custom-checkbox-label{
    height: 30px;
    line-height: 26px;
}
/deep/ .custom-checkbox-label:before{
    margin-top: 6px;
}
/deep/ .custom-checkbox-label:after{
    top: 7px;
}
/deep/ .text-black{
    td{
        color: #000
    }
}
</style>