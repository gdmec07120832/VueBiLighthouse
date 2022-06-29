<template>
    <div class="TableBox">
        <div ref="TableHeaderBox" class="TableHeaderBox">
            <table class="TableHeader" border="1" ref="TableHeader"></table>
        </div>
        <div class="TableBodyBox" @scroll="scroll">
            <table class="Table" border="1" ref="Table"></table>
        </div>
        <a-pagination
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
export default {
    mixins: [ base ],
    data() {
        // let slot = Vue.component('Slot', {
        //     data: function () {
        //         return {
        //             value: 0
        //         }
        //     },
        //     template: '<div>{{value}}12341234</div>'
        // })
        return {
            // row 为竖向 字段在第一行
            // column 为横向 字段在第一列
            direction: 'column',
            // has

            header: {
                area: [
                    ['a', 'b', 'c', 'c', 'd', 'd', 'd'],
                    ['a', 'b', 'e', 'f', 'g', 'h', 'i']
                ],
                // area: [
                //     // ['a', 'b', 'c', 'c', 'd', 'd', 'd'],
                //     ['a', 'b', 'e', 'f', 'g', 'h', 'i']
                // ],
                data: {
                    a: '日期',
                    b: '店铺名称',
                    c: '总计',
                    d: '实际',
                    e: '总预售件数',
                    f: '总预售业绩',
                    g: '实际预售件数',
                    h: '实际预售业绩',
                    i: '实际业绩日占比',
                }
            },
            // 配置字段
            // valueFormat sumFirstFormat sumLastFormat 可以是字符串或函数
            tableColumn: [
                {key: 'day', areaName: 'a', valueFormat: 'YYYY/M/DD', sumFirstFormat: 'normal', sumLastFormat: 'normal', sticky: 'left'},
                {key: 'storeName', areaName: 'b'},
                {key: 'num', areaName: 'e', sumFirstFormat: 'round', colorFormat: 'colorFormat', sumFirstColorFormat: 'colorFormat', sumLastColorFormat: 'colorFormat'},
                {key: 'num1', areaName: 'f'},
                {key: 'day4', areaName: 'g'},
                {key: 'day5', areaName: 'h'},
                {key: 'day6', areaName: 'i'},
            ],
            // 合并项
            // 首行或首列 尾行或尾列
            sum: {
                first: {
                    show: true,
                    // 暂时只能固定一行 一列 多的会被覆盖
                    data: [
                        {day: '合计', storeName: '', num: 1234, num1: 123},
                    ],
                    sticky: true,
                },
                last: {
                    show: true,
                    data: [
                        {day: '尾行', storeName: '', num: 1234, num1: 123},
                    ],
                    sticky: true,
                }
            },
            // 放数据
            dataSource: [
                {day: '20220304', storeName: 1234, num: 1234, num1: 1234},
                {day: '20220305', storeName: 1234, num: 1000, num1: 1234},
                {day: '20220306', storeName: 1234, num: 1234, num1: 1234},
                {day: '20220304', storeName: 1234, num: 1234, num1: 1234},
                {day: '20220304', storeName: 1234, num: 1234, num1: 1234},
                {day: '20220304', storeName: 1234, num: 1234, num1: 1234},
                {day: '20220304', storeName: 1234, num: 1234, num1: 1234},
                {day: '20220304', storeName: 1234, num: 1234, num1: 1234},
            ],
            pagination: {
                show: true,
                page: 1,
                pageSize: 10,
                total: 100,
            },
        }
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
            // console.log(area, arr, 11111111, vArea)
        },
    },
    mounted() {
        this.initTable()
    },
    methods: {
        scroll(e) {
            this.$refs.TableHeaderBox.scrollLeft = e.target.scrollLeft
        },
        change(page, pageSize) {
            this.pagination.page = page
        },
        showSizeChange(current, size) {
            this.pagination.pageSize = size
        },
        initTable() {
            let area = this.header.area.concat()
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
                    let parentTd = vArea[areaName].colSpan > 1 ? 'parentTd' : ''
                    let sticky = this.match(area[i][j], 'sticky')
                    tableHeaderStr +=
                        `
                        <td class="col_${areaName} ${parentTd} ${sticky}"
                        rowspan="${vArea[areaName].rowSpan}"
                        colspan="${vArea[areaName].colSpan}"
                        title="${match(areaName, 'headerData')}"
                        >
                        ${match(areaName, 'headerData')}
                        </td>
                        `
                }
                tableHeaderStr += '</tr>'
            }
            let className = this.tableColumn.map(_ => _.areaName)
            // 加首行合计
            let { show:sumFirstShow, data:sumFirstData, sticky:sumFirstSticky} = this.sum.first
            if(sumFirstShow) {
                for(let i = 0; i < sumFirstData.length; i++) {
                    let rowSticky = ''
                    if(sumFirstSticky) rowSticky = 'stickyTop'
                    str += `<tr class="row row_${area.length + i + 1} ${rowSticky}">`
                    for (let j = 0; j < this.tableColumn.length; j++) {
                        let sticky = this.match(className[j], 'sticky')
                        let color = this.match(className[j], 'sumFirstColorFormat', i)
                        str +=
                            `
                            <td class="col_${className[j]} ${sticky} ${color}"
                            title="${ match(className[j], 'sumFirstFormat', i) }"
                            >
                            ${ match(className[j], 'sumFirstFormat', i) }
                            </td>
                            `
                    }
                    str += '</tr>'
                }
            }
            // 生产数据列表
            let { dataSource, tableColumn} = this
            for(let i = 0; i < dataSource.length; i++) {
                str += `<tr class="row row_${area.length + sumFirstData.length + i + 1}">`
                for(let j = 0; j < tableColumn.length; j++) {
                    let sticky = this.match(className[j], 'sticky')
                    let color = this.match(className[j], 'colorFormat', i)
                    str += `<td class="col_${className[j]} ${sticky} ${color}" title="${ match(className[j], 'valueFormat', i) }">${ match(className[j], 'valueFormat', i) }</td>`
                }
                str += '</tr>'
            }
            // 加尾行合计
            let {show:sumLastShow, data:sumLastData, sticky:sumLastSticky} = this.sum.last
            if(sumLastShow) {
                for(let i = 0; i < sumLastData.length; i++) {
                    let rowSticky = ''
                    if(sumLastSticky) rowSticky = 'stickyBottom'
                    str += `<tr class="row row_${area.length + sumFirstData.length + dataSource.length + i + 1} ${rowSticky}">`
                    for (let j = 0; j < tableColumn.length; j++) {
                        let sticky = this.match(className[j], 'sticky')
                        str += `<td class="col_${className[j]} ${sticky}" title="${ match(className[j], 'sumLastFormat', i) }">${ match(className[j], 'sumLastFormat', i) }</td>`
                    }
                    str += '</tr>'
                }
            }
            this.$refs.TableHeader.innerHTML= tableHeaderStr
            this.$refs.Table.innerHTML= str
            // let that = this
            // this.$nextTick(() => {
            //     for(let i = 0; i < dataSource.length; i++) {
            //         for(let j = 0; j < tableColumn.length; j++) {
            //             let colName = `.col_${className[j]}`
            //             if(match(tableColumn[j].areaName, 'slot', i)) {
            //                 new Vue({
            //                     render() {
            //                         return <div id="row_i_col_j">123411111</div>
            //                     }
            //                 }).$mount(colName)
            //             }
            //         }
            //     }
            // })
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
        match(areaName, type = 'value', i) {
            let headerData = JSON.parse(JSON.stringify(this.header.data))
            let dataSource = this.dataSource
            let tableColumn = this.tableColumn
            if (type === 'headerData') {
                return headerData[areaName]
            }
            else if (type === 'value') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                return dataSource.map(_ => _[arr[0].key])[i]
            }
            else if (type === 'valueFormat') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                let value = this.match(areaName, 'value', i)
                if (!(type in arr[0])) {
                    if(value === '/') return '/'
                    if(value === undefined || value === null || value === '--') return '--'
                    return value
                }
                else {
                    if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
                        let clearZero = 'clearZero' in arr[0] ? arr[0].clearZero : false
                        return this.handleNum(arr[0][type], value, clearZero)
                    } else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
                        return arr[0][type](value)
                    }
                }
            }
            else if (type === 'sumFirstFormat' || type === 'sumLastFormat') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                let { key, sumFormat } = arr[0]
                let firstOrLast = type.split('sum')[1].split('Format')[0].toLowerCase()
                let value = this.sum[firstOrLast].data[i][key]
                if (!(type in arr[0])) {
                    if(value === '/') return '/'
                    if(value === undefined || value === null || value === '--') return '--'
                    return value
                }
                else {
                    if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
                        // let clearZero = 'clearZero' in arr[0] ? arr[0].clearZero : false
                        return this.handleNum(arr[0][type], value)
                    }
                    else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
                        return arr[0][type](value)
                    }
                }
            }
            else if (type === 'sticky') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                if(arr.length && arr[0].sticky) {
                    // console.log(arr[0].sticky.slice(0, 1).toUpperCase() + arr[0].sticky.slice(1).toLowerCase())
                    return `sticky${arr[0].sticky.slice(0, 1).toUpperCase() + arr[0].sticky.slice(1).toLowerCase()}`
                }
                else return ''
            }
            else if (type === 'colorFormat') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                let value = this.match(areaName, 'value', i)
                if (!(type in arr[0])) return ''
                else {
                    if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
                        return this.handleColor(arr[0][type], value)
                    } else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
                        return arr[0][type](value)
                    }
                }
            }
            else if (type === 'sumFirstColorFormat' || type === 'sumLastColorFormat') {
                let arr = tableColumn.filter(_ => _.areaName === areaName)
                let { key, sumFormat } = arr[0]
                let firstOrLast = type.split('sum')[1].split('ColorFormat')[0].toLowerCase()
                let value = this.sum[firstOrLast].data[i][key]

                if (!(type in arr[0])) return ''
                else {
                    if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
                        return this.handleColor(arr[0][type], value)
                    } else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
                        return arr[0][type](value)
                    }
                }
            }
            // else if (type === 'slot') {
            //     let arr = tableColumn.filter(_ => _.areaName === areaName)
            //     let value = this.match(areaName, 'value', i)
            //     // console.log(areaName, i,value)
            //     if (!(type in arr[0])) return ''
            //     else {
            //         if (Object.prototype.toString.call(arr[0][type]) === '[object String]') {
            //             console.log(1111, arr[0][type], value)
            //             return this.handleColor(arr[0][type], value)
            //         } else if (Object.prototype.toString.call(arr[0][type]) === '[object Function]') {
            //             return arr[0][type](value)
            //         }
            //     }
            // }
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
    /deep/ .TableHeaderBox{
        overflow: hidden;
        padding-right: 8px;
        .TableHeader {
            width: 120%;
            border-color: #e7e9f0;
            table-layout: fixed;
            .rowHeader, .row{
                height: $tdHeight;
                position: relative;
                td{
                    //width: $tdWidth;
                    background: #f5f7ff;
                    text-align: center;
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    color: rgba(0,0,0,.88);
                    left: 0px;
                }
                .stickyLeft {
                    position: sticky!important;
                    position: -webkit-sticky!important;
                    left: 0;
                    z-index: 2;
                    &::after{
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: -1px;
                        width: 30px;
                        box-shadow: inset 10px 0 8px -8px #00000026;
                        transform: translate(100%);
                        transition: box-shadow .3s;
                        transition-property: box-shadow;
                        transition-duration: 0.3s;
                        transition-timing-function: ease;
                        transition-delay: 0s;
                        content: "";
                        pointer-events: none;
                    }
                }
                .stickyRight {
                    position: sticky!important;
                    position: -webkit-sticky!important;
                    right: 0;
                    z-index: 2;
                }
                .parentTd{
                    color: #808492
                }
            }
            .row td{
                background: #fff;
            }
        }
    }
    /deep/ .TableBodyBox{
        width: 100%;
        overflow: auto scroll;
        max-height: 184px;
        .Table{
            width: 120%;
            table-layout: fixed;
            //border: 1px solid #ccc;
            border-color: #e7e9f0;
            position: relative;
            .row:nth-child(1) {
                border-top: 1px solid #fafafa;
            }
            .row{
                height: $tdHeight;
                td{
                    width: $tdWidth;
                    text-align: center;
                    font-size: 12px;
                    font-family: PingFangSC-Regular,PingFang SC;
                    color: rgba(0,0,0,.88);
                }
                &:nth-child(odd) td{
                    background: #fafafa;
                }
                &:nth-child(even) td{
                    background: #fff;
                }
                .stickyLeft {
                    position: sticky!important;
                    position: -webkit-sticky!important;
                    left: 0;
                    z-index: 2;
                    &::after{
                        position: absolute;
                        top: 0;
                        right: 0;
                        bottom: -1px;
                        width: 30px;
                        box-shadow: inset 10px 0 8px -8px #00000026;
                        transform: translate(100%);
                        transition: box-shadow .3s;
                        transition-property: box-shadow;
                        transition-duration: 0.3s;
                        transition-timing-function: ease;
                        transition-delay: 0s;
                        content: "";
                        pointer-events: none;
                    }
                }
                .stickyRight {
                    position: sticky!important;
                    position: -webkit-sticky!important;
                    right: 0;
                    z-index: 2;
                }
            }
            .stickyTop{
                position: sticky!important;
                position: -webkit-sticky!important;
                top: 0;
                z-index: 3;
                //&:before{
                //    position: absolute;
                //    top: -1px;
                //    content: '';
                //    //width: 100%;
                //    height: 1px;
                //    background: red;
                //}
            }
            .stickyBottom{
                position: sticky!important;
                position: -webkit-sticky!important;
                bottom: 0;
                z-index: 3;
            }
        }
    }
}
</style>