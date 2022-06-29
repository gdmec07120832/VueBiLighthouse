<!--
 * @Author: 黄浩
 * @Date: 2021-12-15 10:12:10
 * @LastEditTime: 2021-12-22 11:48:07
 * @LastEditors: Please set LastEditors
 * @Descripttion: 
 * @FilePath: \lsmy-bi-lighthouse-front\src\views\BIView\ProductSupply\AuditableDataDetails\components\Tab.vue
-->
<template>
    <div class="px20">
        <y-table
        class="text-black"
        @change="handleChange"
        :options="{ ...table, columns: tableColumns, rowClassName: (record,index) => {return rowClass(record, index)}}"
        rowKey="NO"
        :loading="table.loading"
        >
            <div class="px10">备注:上述两点为两份明细差别，请知悉；【1】可货审明细-批次单可货审，是新平台批次单的字段是否可货审；【2】可货审明细-商品行可货审，是新平台批次单商品行的库存量≥订出数；</div>
        </y-table>
        <div v-if="menuVisible" class="selectMenu" :style="[{left: menuX},{top: menuY}]">
            <div class="item box" v-clipboard="currentRow" >复制内容</div>
        </div>
    </div>
</template>

<script>
import YTable from '@/views/BIView/components/YTable/YTable2'
import moment from 'moment'
export default {
    components: { YTable },
    created() {
        (() => {
            this.table.data = [].concat()
            this.getSumData()
            this.getData()
        })()
    },
    mounted() {
        document.body.onclick = () => {
            if(this.menuVisible) this.menuVisible = !this.menuVisible
        }
    },
    watch: {
        'table.pagination.page'() {
            this.table.data = [].concat()
            this.getSumData()
            this.getData()
        },
        query: {
            handler(val) {
                if(this.alReady){
                    this.table.data = [].concat()
                    this.getData()
                    this.getSumData()
                }else this.changeAlReady()
            },
            deep: true,
        },
        startTime() {
            this.table.data = [].concat()
            this.getData()
            this.getSumData()
        },
        endTime() {
            this.table.data = [].concat()
            this.getData()
            this.getSumData()
        },
        recordData: {
            handler(val) {
                if(val.length && this.sumData.length) {
                    this.table.data = this.sumData.concat(val)
                }
            }
        },
        sumData: {
            handler(val) {
                if(val.length && this.recordData.length) {
                    this.table.data = this.sumData.concat(this.recordData)
                }
            }
        }
    },
    props: {
        query: {
            type: Object
        },
        queryMap: {
            type: Object
        },
        startTime: {
            type: Object
        },
        endTime: {
            type: Object
        },
        tableColumns: {
            type: Array
        },
        api: {
            type: String
        },
        alReady: {
            type: Boolean
        }
    },
    data() {
        return {
            loadNum: 0,
            sorting: {
                field: 'rownum',
                order: 'asc',
            },
            table: {
                loading: false,
                pagination: {
                    total: 0,
                    page: 1,
                    pageSize: 8
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
        changeAlReady() {
            this.$emit('callBack',true)
        },
        // 右键展开菜单
        openMenu(e,text) {
            e.preventDefault();
            this.menuX = e.x + 'px'
            this.menuY = e.y + 'px'
            this.currentRow = text
            this.menuVisible = true
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
        rowClass(record, index){
            let str = ''
            if(index === 0) str = 'rowClassFont'
            else str = index % 2 != 0 ? 'rowClass': ''
            return str
        },
        getData() {
            let params = {
                page: this.table.pagination.page,
                pageSize: this.table.pagination.pageSize,
                ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
            }
            let startTime = this.handlerTime('startTime')
            let endTime = this.handlerTime('endTime')
            let obj = {
                startTime: startTime,
                endTime: endTime
            }
            for(let key in obj){
                if(obj[key]){
                    params[key] = obj[key]
                }
            }
            for(let key in this.queryMap){
                if(this.query[this.queryMap[key]].length > 0){
                    params[key] = this.query[this.queryMap[key]].toString()
                }
            }
            this.table.loading = true
            this.recordData = [].concat()
            this.$fetchSql('fs_good_audit', this.api, params).then(({ data }) => {
                // this.table.data = this.table.data.concat(data.list)
                this.recordData = data.list.concat()
                this.table.pagination.page = data.page
                this.table.pagination.total = data.totalRows
                this.table.needPaging = data.list.length ? true : false
            }).finally(() => {
                this.table.loading = false
            })
        },
        getSumData() {
            let params = {
                page: this.table.pagination.page,
                pageSize: this.table.pagination.pageSize,
                // ORDER_BY: `${this.sorting.field} ${this.sorting.order}`,
            }
            let startTime = this.handlerTime('startTime')
            let endTime = this.handlerTime('endTime')
            let obj = {
                startTime: startTime,
                endTime: endTime
            }
            for(let key in obj){
                if(obj[key]){
                    params[key] = obj[key]
                }
            }
            for(let key in this.queryMap){
                if(this.query[this.queryMap[key]].length > 0){
                    params[key] = this.query[this.queryMap[key]].toString()
                }
            }
            let apiMap = {
                fs_good_audit_data: 'fs_good_audit_data_sum',
                fs_good_audit_staff: 'fs_good_audit_staff_sum'
            }
            let api = apiMap[this.api]
            this.table.loading = true
            this.sumData = [].concat()
            this.$fetchSql('fs_good_audit', api, params).then(({ data }) => {
                if(this.api === 'fs_good_audit_data' && data.list[0] 
                && (data.list[0].ACT_PRICE === null)
                ) return
                if(this.api === 'fs_good_audit_staff' && data.list[0] 
                && (data.list[0].PTD_CAN_AUDIT_AMT === null)
                && (data.list[0].PTD_GOODS_AUDIT_AMT === null)
                && (data.list[0].PTD_L_GOODS_AUDIT_AMT === null)
                && (data.list[0].PTD_GOODS_AUDIT_CNT === null)
                && (data.list[0].PTD_SEND_AMT === null)
                && (data.list[0].PTD_L_SEND_AMT === null)
                && (data.list[0].PTD_SEND_CNT === null)
                && (data.list[0].PTD_AUDITED_WF_CNT === null) 
                && (data.list[0].PTD_AUDITED_WF_AMT === null)
                ) return
                for(let key in data.list[0]) {
                    if(data.list[0][key] === null) {
                        data.list[0][key] = '-'
                    }
                }
                data.list[0].NO = 0
                // this.table.data.unshift(data.list[0])
                this.sumData = data.list.concat()
            }).finally(() => {
                this.table.loading = false
            })
        },
        handlerTime(name) {
            if(this[name]){
                // return moment(moment(this[name]).format('YYYY-MM-DD')).toDate().getTime()
                return moment(this[name]).format('YYYYMMDD')
            }
        }
    }
}
</script>

<style lang='scss' scoped>
/deep/ .rowClass{
    background: #f5faff
}
/deep/ .rowClassFont{
    font-weight: 700;
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