<template>
    <div class="TableBox">
        <div ref="TableHeaderBox" class="TableHeaderBox">
            <table class="TableHeader" ref="TableHeader"></table>
        </div>
        <div class="TableBodyBox">
            <table class="Table" ref="Table"></table>
        </div>
        <a-pagination
            v-if="pagination.show"
            :current="pagination.page"
            :pageSize="pagination.pageSize"
            :total="pagination.total"
            @change="change"
            @showSizeChange="showSizeChange"
            :showTotal="total => `共${total}条, 第${pagination.page}页`"
            class="mt10"
            style="display: flex;justify-content: flex-end"
            size="small"
            show-size-changer
        />
    </div>
</template>

<script>
import base from '../utils/base'
import Vue from 'vue'
import _ from 'lodash'
export default {
    mixins: [ base ],
    mounted() {
        this.initTable()
    },
    computed: {
        // 生成area映射
        vArea() {
            let area = this.header.area.concat()
            let arr = []
            area.forEach(row => arr = arr.concat(...row))
            arr = Array.from(new Set(arr))
            let vArea = {}
            arr.forEach(areaName => {
                vArea[areaName] = this.computeSpan(areaName)
            })
            return vArea
        },
        // activeRow(row) {
        //     if(row === this.curRow) return 'activeRow'
        //     else return ''
        // },
        // activeCol(col) {
        //     if(col === this.curCol) return 'activeCol'
        //     else return ''
        // },
    },
    props: {
        header: {
            type: Object,
            default() {return {}}
        },
        body: {
            type: Object,
            default() {return {}}
        },
        pagination: {
            type: Object,
            default() {return {}}
        }
    },
    watch: {
        $props: {
            handler() {
                this.initTable()
            },
            deep: true
        }
    },
    data() {
        return {
            // 默认横向 即字段在第一列
            // header: {
            //     area: [
            //         ['a', 'b', 'c', 'c'],
            //         ['a', 'b', 'd', 'e']
            //     ],
            //     column: [
            //         {areaName: 'a', key: 'name', label: '渠道细分'},
            //         {areaName: 'b', key: 'name', label: '汇总', value: '汇总'},
            //         {areaName: 'c', key: null, label: '线上渠道'},
            //         {areaName: 'd', key: 'name', label: '线上平台', value: '线上平台'},
            //         {areaName: 'e', key: 'name', label: '线上外包', value: '线上外包'},
            //     ],
            // },
            // body: {
            //     column: [
            //         {key: 'target', label: '目标', valueFormat: 'round', colorFormat: 'colorFormat', sumFormat: 'normal'},
            //         {key: 'actual', label: '实际'},
            //         {key: 'reach', label: '达成', colorFormat: 'colorFormat'},
            //         {key: 'percent', label: '占总',},
            //         {key: 'YOY', label: '同比',},
            //     ],
            //     data: [
            //         {target: 12341, actual: 12342, reach: 123431, percent: 12344, YOY: 12345, name: '汇总'},
            //         {target: 12341, actual: 12342, reach: 123432, percent: 12344, YOY: 12345, name: '线上平台'},
            //         {target: 12341, actual: 12342, reach: 123433, percent: 12344, YOY: 12345, name: '线上外包'},
            //     ],
            // },
            curCol: null,
            curRow: null,
        }
    },
    methods: {
        change(page, pageSize) {
            let obj = _.cloneDeep(this.pagination)
            obj.page = page
            this.$emit('update:pagination', obj)
            // this.pagination.page = page
        },
        showSizeChange(current, size) {
            let obj = _.cloneDeep(this.pagination)
            obj.pageSize = size
            this.$emit('update:pagination', obj)
            // this.pagination.pageSize = size
        },
        computeSpan(areaName) {
            let area = this.header.area.concat()
            area = area.filter(row => row.includes(areaName)).map(row => {
                return row.filter(_ => _ === areaName).length
            })
            let colSpan = 1,rowSpan = area.length
            for(let i = 0; i < rowSpan; i++) {
                area[i] > colSpan ? colSpan = area[i] : null
            }
            return {
                rowSpan,
                colSpan,
            }
        },
        activeRow(row) {
            if(row === this.curRow) return 'activeRow'
            else return ''
        },
        activeCol(col) {
            if(col === this.curCol) return 'activeCol'
            else return ''
        },
        initTable() {
            let area = this.header.area.concat()
            let { column:headerColumn } = this.header
            let match = this.match
            let vArea = this.vArea
            area = area.map((row, index) => {
                return Array.from(new Set(row))
            })
            .map((row, index) => {
                let arr = []
                area.slice(0, index).forEach(row1 => {
                    arr = arr.concat(...row1)
                })
                arr = Array.from(new Set([...arr]))
                return row.filter(_ => !arr.includes(_))
            })
            let tableHeaderStr = '', str = ''
            // 生成表头
            for(let i = 0; i < area.length; i++) {
                tableHeaderStr += `<tr class="rowHeader row_${i + 1}">`
                for(let j = 0; j < area[i].length; j++) {
                    let areaName = area[i][j]
                    tableHeaderStr +=
                        `
                        <td class="col_${areaName}"
                        rowspan="${vArea[areaName].rowSpan}"
                        colspan="${vArea[areaName].colSpan}"
                        title="${match(areaName, 'headerLabel')}"
                        >
                        ${match(areaName, 'headerLabel')}
                        </td>
                        `
                }
                tableHeaderStr += '</tr>'
            }
            // 生产数据列表
            let { data:bodyData, column:bodyColumn } = this.body
            for(let i = 0; i < bodyColumn.length; i++) {
                // let key = bodyColumn[i].key
                str += `<tr class="row row_${area.length + i + 1}">`
                // 首列
                str += `<td class="col_${headerColumn[0].areaName}" data-i="${i}" data-j="0" data-hasactiveevent="true">${bodyColumn[i].label}</td>`
                for(let j = 0; j < bodyData.length; j++) {
                    let areaName = headerColumn.filter(_ => _.key !== null)[j].areaName
                    let color = this.match(areaName, 'colorFormat', i)
                    str +=
                    `
                    <td
                    class="col_${areaName} ${color}"
                    title="${ match(areaName, 'valueFormat', i) }"
                    data-i="${i}"
                    data-j="${j + 1}"
                    data-hasactiveevent="true"
                    >
                    ${ match(areaName, 'valueFormat', i) }
                    </td>
                    `
                }
                str += '</tr>'
            }
            this.$refs.TableHeader.innerHTML= tableHeaderStr
            this.$refs.Table.innerHTML= str
            let body = this.$refs.Table
            body.addEventListener('mouseover', (e) => {
                let { dataset } = e.target
                let { i, j} = dataset
                if('hasactiveevent' in dataset) {
                    this.curRow = i
                    this.curCol = j
                    e.target.classList.add('active')
                    let tbody = e.target.parentElement.parentElement
                    for(let row = 0; row < tbody.children.length; row ++) {
                        for(let col = 0; col < tbody.children[0].children.length; col ++) {
                            tbody.children[row].children[col].classList.remove('active')
                        }
                    }
                    for(let row = 0; row < tbody.children.length; row ++) {
                        tbody.children[row].children[j].classList.add('active')
                    }
                    for(let col = 0; col < tbody.children[0].children.length; col ++) {
                        tbody.children[i].children[col].classList.add('active')
                    }
                }
            })
            body.addEventListener('mouseout', (e) => {
                let { dataset } = e.target
                let { i, j, hasactiveevent} = dataset
                let tbody = e.target.parentElement.parentElement
                for(let row = 0; row < tbody.children.length; row ++) {
                    for(let col = 0; col < tbody.children[0].children.length; col ++) {
                        tbody.children[row].children[col].classList.remove('active')
                    }
                }

            })
        },
        match(areaName, type = 'value', i, j) {
            let { column:headerColumn,} = this.header
            let { data:bodyData, column:bodyColumn} = this.body
            if (type === 'headerLabel') {
                let item = headerColumn.filter(_ => _.areaName === areaName)
                if(item.length) return item[0].label
                return ''
            }
            else if (type === 'value') {
                let arr = headerColumn.filter(_ => _.areaName === areaName)
                let {value:headerDataValue, key:headerDataKey} = arr[0]
                let bodyDataItem = bodyData.filter(_ => _[headerDataKey] === headerDataValue)
                if(bodyDataItem.length) return bodyDataItem[0][bodyColumn[i].key]
                return null
            }
            else if (type === 'valueFormat') {
                let { column:bodyColumn } = this.body
                let value = this.match(areaName, 'value', i, j)
                if(!(type in bodyColumn[i])){
                    if(value === '/') return '/'
                    if(value === undefined || value === null || value === '--') return '--'
                    else return value
                }
                else {
                    if (Object.prototype.toString.call(bodyColumn[i][type]) === '[object String]') {
                        return this.handleNum(bodyColumn[i][type], value)
                    } else if (Object.prototype.toString.call(bodyColumn[i][type]) === '[object Function]') {
                        return bodyColumn[i][type](value)
                    }
                }
            }
            else if (type === 'colorFormat') {
                let { column:bodyColumn } = this.body
                let value = this.match(areaName, 'value', i, j)
                if(!(type in bodyColumn[i])) return ''
                else {
                    if (Object.prototype.toString.call(bodyColumn[i][type]) === '[object String]') {
                        return this.handleColor(bodyColumn[i][type], value)
                    } else if (Object.prototype.toString.call(bodyColumn[i][type]) === '[object Function]') {
                        return bodyColumn[i][type](value)
                    }
                }
            }
            return ''
        }
    }
}
</script>

<style lang="scss" scoped>
$tdWidth: 100px;
$tdHeight: 25px;
/deep/ .red {
    color: #ff5953!important;
}
/deep/ .green {
    color: #00a854!important;
}
.TableBox{
    width: 100%;
    /deep/ .TableHeaderBox{
        .TableHeader {
            width: 100%;
            //border: 1px solid #e7e9f0;
            table-layout: fixed;
            display: flex;
            flex-direction: column;
            .rowHeader, .row{
                flex: 1;
                height: $tdHeight;
                position: relative;
                display: flex;
                td{
                    flex: 1;
                    //width: $tdWidth;
                    background: #f5f7ff;
                    text-align: center;
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    color: rgba(0,0,0,.88);
                    left: 0px;
                    border-top: 1px solid #e7e9f0;
                    border-left: 1px solid #e7e9f0;
                    &::beafore{
                        width: 0px;
                        content: '';
                        display: inline-block;
                        vertical-align: middle;
                        height: 100%;
                    }
                }
                td:nth-last-child(1) {
                    border-right: 1px solid #e7e9f0;
                }
            }
            .row td{
                background: #fff;
            }
        }
    }
    /deep/ .TableBodyBox{
        width: 100%;
        .Table{
            width: 100%;
            table-layout: fixed;
            //border-left: 1px solid #e7e9f0;
            //border-right: 1px solid #e7e9f0;
            position: relative;
            display: flex;
            flex-direction: column;
            .row{
                height: $tdHeight;
                flex: 1;
                display: flex;
                td{
                    flex: 1;
                    width: $tdWidth;
                    text-align: center;
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    background: #fff;
                    color: rgba(0,0,0,.88);
                    border-top: 1px solid #e7e9f0;
                    border-left: 1px solid #e7e9f0;
                    &::before{
                        width: 0px;
                        content: '';
                        display: inline-block;
                        vertical-align: middle;
                        height: 100%;
                    }
                }
                td:nth-last-child(1) {
                    border-right: 1px solid #e7e9f0;
                }
                .active{
                    background: rgba(135, 206, 250, 0.2)
                }
                &:nth-last-child(1) {
                    td{
                        //border-bottom: none;
                        border: 1px solid #e7e9f0;
                        border-right: none;
                    }
                    td:nth-last-child(1) {
                        border: 1px solid #e7e9f0;
                    }
                }
                //&:nth-child(odd) td{
                //    background: #fafafa;
                //}
                //&:nth-child(even) td{
                //    background: #fff;
                //}
            }
        }
    }
}
</style>